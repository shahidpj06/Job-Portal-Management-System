import bcrypt from "bcrypt";
import { createHash, randomBytes } from "node:crypto";

import { prisma } from "../database/index.js";
import type { PrismaClient } from "../generated/prisma/client.js";
import type {
  ForgotPasswordInput,
  ResetPasswordInput,
} from "../schemas/password.schema.js";
import { ApiError } from "../tools/api-error.js";

import { EmailService } from "./email.service.js";

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;
const PASSWORD_SALT_ROUNDS = 12;

const hashResetToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

const invalidResetTokenError = (): ApiError => {
  return new ApiError({
    statusCode: 400,
    code: "INVALID_RESET_TOKEN",
    message: "This reset link is invalid or expired. Request a new link.",
  });
};

const sendPasswordResetLink = async (
  input: ForgotPasswordInput,
  database: PrismaClient = prisma,
): Promise<void> => {
  const user = await database.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      email: true,
      sessionVersion: true,
    },
  });

  if (!user) {
    return;
  }

  const token = randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(token);
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + RESET_TOKEN_TTL_MS);

  await database.passwordResetToken.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      tokenHash,
      sessionVersion: user.sessionVersion,
      createdAt,
      expiresAt,
    },
    update: {
      tokenHash,
      sessionVersion: user.sessionVersion,
      createdAt,
      expiresAt,
    },
  });

  await EmailService.sendPasswordResetEmail({
    email: user.email,
    token,
    expiresAt,
  });
};

const resetPassword = async (
  input: ResetPasswordInput,
  database: PrismaClient = prisma,
): Promise<void> => {
  const tokenHash = hashResetToken(input.token);

  const storedToken = await database.passwordResetToken.findUnique({
    where: { tokenHash },
    select: {
      id: true,
      userId: true,
      expiresAt: true,
      sessionVersion: true,
      user: {
        select: {
          sessionVersion: true,
        },
      },
    },
  });

  if (
    !storedToken ||
    storedToken.expiresAt.getTime() <= Date.now() ||
    storedToken.sessionVersion !== storedToken.user.sessionVersion
  ) {
    throw invalidResetTokenError();
  }

  const passwordHash = await bcrypt.hash(
    input.newPassword,
    PASSWORD_SALT_ROUNDS,
  );

  await database.$transaction(async (transaction) => {
    const updatedUser = await transaction.user.updateMany({
      where: {
        id: storedToken.userId,
        sessionVersion: storedToken.sessionVersion,
      },
      data: {
        passwordHash,
        sessionVersion: { increment: 1 },
      },
    });

    if (updatedUser.count !== 1) {
      throw invalidResetTokenError();
    }

    const consumedToken = await transaction.passwordResetToken.deleteMany({
      where: {
        id: storedToken.id,
        tokenHash,
        sessionVersion: storedToken.sessionVersion,
        expiresAt: { gt: new Date() },
      },
    });

    if (consumedToken.count !== 1) {
      throw invalidResetTokenError();
    }

    await transaction.refreshToken.updateMany({
      where: {
        userId: storedToken.userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  });
};

export const PasswordResetDataService = {
  sendPasswordResetLink,
  resetPassword,
};
