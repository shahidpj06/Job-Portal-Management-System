import type { Prisma, PrismaClient } from "../generated/prisma/client.js";

import { prisma } from "../database/index.js";
import type { UpdateProfileInput } from "../schemas/profile.schema.js";
import { ApiError } from "../tools/api-error.js";

const PROFILE_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  location: true,
  headline: true,
  bio: true,
  skills: true,
  createdAt: true,
  updatedAt: true,
  profileFiles: {
    select: {
      id: true,
      kind: true,
      filename: true,
      contentType: true,
      size: true,
      updatedAt: true,
    },
  },
} satisfies Prisma.UserSelect;

const profileNotFoundError = () => {
  return new ApiError({
    statusCode: 404,
    code: "PROFILE_NOT_FOUND",
    message: "Your profile could not be found.",
  });
};

export const ProfileDataService = {
  getProfile: async (userId: string, database: PrismaClient = prisma) => {
    const profile = await database.user.findUnique({
      where: { id: userId },
      select: PROFILE_SELECT,
    });

    if (!profile) {
      throw profileNotFoundError();
    }

    return profile;
  },

  updateProfile: async (
    userId: string,
    input: UpdateProfileInput,
    database: PrismaClient = prisma,
  ) => {
    try {
      return await database.user.update({
        where: { id: userId },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          location: input.location,
          headline: input.headline,
          bio: input.bio,
          skills: input.skills,
        },
        select: PROFILE_SELECT,
      });
    } catch (error) {
      if (
        error !== null &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "P2025"
      ) {
        throw profileNotFoundError();
      }

      throw error;
    }
  },
};
