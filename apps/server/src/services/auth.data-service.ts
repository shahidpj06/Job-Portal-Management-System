import bcrypt from "bcrypt";
import { UserRole } from "../generated/prisma/client.js";
import { prisma } from "../database/index.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";
import { ApiError } from "../tools/api-error.js";
import type { Prisma, PrismaClient } from "../generated/prisma/client.js";
import {
  createAccessToken,
  createRefreshToken,
  getRefreshTokenExpiry,
  hashRefreshToken,
} from "../tools/auth-token.helper.js";
import type { AuthSession, AuthUser } from "../types/auth.js";
import { ChangePasswordInput } from "../schemas/password.schema.js";

const PASSWORD_SALT_ROUNDS = 12;

const toAuthUser = (user: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}): AuthUser => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };
};

const createSession = async (
  user: AuthUser,
  sessionVersion: number,
  database: Pick<Prisma.TransactionClient, "refreshToken"> = prisma,
): Promise<AuthSession> => {
  const refreshToken = createRefreshToken();

  await database.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: getRefreshTokenExpiry(),
      sessionVersion,
    },
  });

  return {
    user,
    accessToken: createAccessToken(user, sessionVersion),
    refreshToken,
  };
};

const invalidCredentialsError = (): ApiError => {
  return new ApiError({
    statusCode: 401,
    code: "INVALID_CREDENTIALS",
    message: "Email or password is incorrect.",
  });
};

const invalidRefreshTokenError = (): ApiError => {
  return new ApiError({
    statusCode: 401,
    code: "INVALID_REFRESH_TOKEN",
    message: "Your session has expired. Please log in again.",
  });
};

export const AuthDataService = {
  register: async (
    input: RegisterInput,
    database = prisma,
  ): Promise<AuthSession> => {
    const email = input.email.toLowerCase();

    const existingUser = await database.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ApiError({
        statusCode: 409,
        code: "EMAIL_ALREADY_IN_USE",
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(
      input.password,
      PASSWORD_SALT_ROUNDS,
    );

    const user = await database.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email,
        passwordHash,
        role: UserRole.USER,
      },
    });

    return createSession(toAuthUser(user), user.sessionVersion, database);
  },

  login: async (input: LoginInput, database = prisma): Promise<AuthSession> => {
    const email = input.email.toLowerCase();

    const user = await database.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw invalidCredentialsError();
    }

    const isPasswordValid = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw invalidCredentialsError();
    }

    return createSession(toAuthUser(user), user.sessionVersion, database);
  },

  getById: async (
    userId: string,
    sessionVersion: number,
    database = prisma,
  ): Promise<AuthUser> => {
    const user = await database.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        sessionVersion: true,
      },
    });

    if (!user || user.sessionVersion !== sessionVersion) {
      throw new ApiError({
        statusCode: 401,
        code: "SESSION_REVOKED",
        message: "Your session has expired. Please sign in again.",
      });
    }

    return toAuthUser(user);
  },

  refresh: async (
    refreshToken: string,
    database = prisma,
  ): Promise<AuthSession> => {
    return database.$transaction(async (transaction) => {
      const storedToken = await transaction.refreshToken.findUnique({
        where: {
          tokenHash: hashRefreshToken(refreshToken),
        },
        include: {
          user: true,
        },
      });

      const now = new Date();

      if (
        !storedToken ||
        storedToken.revokedAt ||
        storedToken.expiresAt <= now ||
        storedToken.sessionVersion !== storedToken.user.sessionVersion
      ) {
        throw invalidRefreshTokenError();
      }

      const consumed = await transaction.refreshToken.updateMany({
        where: {
          id: storedToken.id,
          revokedAt: null,
          expiresAt: { gt: now },
        },
        data: {
          revokedAt: now,
        },
      });

      if (consumed.count !== 1) {
        throw invalidRefreshTokenError();
      }

      return createSession(
        toAuthUser(storedToken.user),
        storedToken.sessionVersion,
        transaction,
      );
    });
  },

  logout: async (refreshToken: string, database = prisma): Promise<void> => {
    const storedRefreshToken = await database.refreshToken.findUnique({
      where: {
        tokenHash: hashRefreshToken(refreshToken),
      },
      select: {
        id: true,
        revokedAt: true,
      },
    });

    if (!storedRefreshToken || storedRefreshToken.revokedAt) {
      return;
    }

    await database.refreshToken.update({
      where: {
        id: storedRefreshToken.id,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  },

  changePassword: async (
    userId: string,
    input: ChangePasswordInput,
    database: PrismaClient = prisma,
  ): Promise<void> => {
    const user = await database.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        passwordHash: true,
        sessionVersion: true,
      },
    });

    if (!user) {
      throw new ApiError({
        statusCode: 401,
        code: "AUTHENTICATION_REQUIRED",
        message: "Please sign in again.",
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      input.currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new ApiError({
        statusCode: 400,
        code: "CURRENT_PASSWORD_INCORRECT",
        message: "Your current password is incorrect.",
      });
    }

    const isSamePassword = await bcrypt.compare(
      input.newPassword,
      user.passwordHash,
    );

    if (isSamePassword) {
      throw new ApiError({
        statusCode: 400,
        code: "PASSWORD_UNCHANGED",
        message: "Choose a password different from your current password.",
      });
    }

    const passwordHash = await bcrypt.hash(
      input.newPassword,
      PASSWORD_SALT_ROUNDS,
    );

    await database.$transaction(async (transaction) => {
      const updated = await transaction.user.updateMany({
        where: {
          id: user.id,
          passwordHash: user.passwordHash,
          sessionVersion: user.sessionVersion,
        },
        data: {
          passwordHash,
          sessionVersion: { increment: 1 },
        },
      });

      if (updated.count !== 1) {
        throw new ApiError({
          statusCode: 409,
          code: "PASSWORD_CHANGE_CONFLICT",
          message:
            "Your account credentials changed during this request. Please sign in again.",
        });
      }

      await transaction.refreshToken.updateMany({
        where: {
          userId: user.id,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      await transaction.passwordResetToken.deleteMany({
        where: {
          userId: user.id,
        },
      });
    });
  },
};
