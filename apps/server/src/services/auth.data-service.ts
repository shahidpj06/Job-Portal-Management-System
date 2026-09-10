import bcrypt from "bcrypt";
import { UserRole } from "../generated/prisma/client.js";
import { prisma } from "../database/index.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";
import { ApiError } from "../tools/api-error.js";
import {
  createAccessToken,
  createRefreshToken,
  getRefreshTokenExpiry,
  hashRefreshToken,
} from "../tools/auth-token.helper.js";
import type { AuthSession, AuthUser } from "../types/auth.js";

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
  database = prisma,
): Promise<AuthSession> => {
  const refreshToken = createRefreshToken();

  await database.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return {
    user,
    accessToken: createAccessToken(user),
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

    return createSession(toAuthUser(user), database);
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

    return createSession(toAuthUser(user), database);
  },

  getById: async (userId: string, database = prisma): Promise<AuthUser> => {
    const user = await database.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new ApiError({
        statusCode: 404,
        code: "USER_NOT_FOUND",
        message: "User not found.",
      });
    }

    return user;
  },

  refresh: async (
    refreshToken: string,
    database = prisma,
  ): Promise<AuthSession> => {
    const storedRefreshToken = await database.refreshToken.findUnique({
      where: {
        tokenHash: hashRefreshToken(refreshToken),
      },
      include: {
        user: true,
      },
    });

    if (
      !storedRefreshToken ||
      storedRefreshToken.revokedAt ||
      storedRefreshToken.expiresAt <= new Date()
    ) {
      throw invalidRefreshTokenError();
    }

    await database.refreshToken.update({
      where: {
        id: storedRefreshToken.id,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return createSession(toAuthUser(storedRefreshToken.user), database);
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
};
