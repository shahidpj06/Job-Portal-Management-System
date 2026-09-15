import type { PrismaClient, ProfileFile } from "../generated/prisma/client.js";
import { ProfileFileKind } from "../generated/prisma/enums.js";

import type { ProfileUploadKind } from "../config/upload.js";
import { prisma } from "../database/index.js";
import { ApiError } from "../tools/api-error.js";
import { validateProfileFile } from "../tools/profile-file.helper.js";
import { PrivateFileStorageService } from "./private-file.storage-service.js";

const FILE_KINDS: Record<ProfileUploadKind, ProfileFileKind> = {
  avatar: ProfileFileKind.AVATAR,
  resume: ProfileFileKind.RESUME,
};

const getFileMetadata = (file: ProfileFile) => {
  return {
    id: file.id,
    kind: file.kind,
    filename: file.filename,
    contentType: file.contentType,
    size: file.size,
    updatedAt: file.updatedAt,
  };
};

const replacementConflictError = () => {
  return new ApiError({
    statusCode: 409,
    code: "FILE_REPLACEMENT_CONFLICT",
    message:
      "Your file changed during this upload. Refresh your profile and try again.",
  });
};

const removeUnusedFile = async (
  userId: string,
  kind: ProfileUploadKind,
  path: string,
): Promise<void> => {
  try {
    await PrivateFileStorageService.deleteFile(userId, kind, path);
  } catch {
    // Do not turn a successful replacement into a failed response.
    // Retain the path for cleanup investigation without logging signed URLs.
    console.error("Profile file cleanup required", {
      userId,
      kind,
      path,
    });
  }
};

export const ProfileFileDataService = {
  replaceFile: async (
    userId: string,
    kind: ProfileUploadKind,
    file: Express.Multer.File,
    database: PrismaClient = prisma,
  ) => {
    const validatedFile = await validateProfileFile(kind, file);

    const fileKey = {
      userId,
      kind: FILE_KINDS[kind],
    };

    const previousFile = await database.profileFile.findUnique({
      where: { userId_kind: fileKey },
    });

    const uploadedFile = await PrivateFileStorageService.uploadFile(
      userId,
      kind,
      validatedFile,
    );

    let savedFile: ProfileFile;

    try {
      savedFile = await database.$transaction(async (transaction) => {
        if (!previousFile) {
          return transaction.profileFile.create({
            data: {
              ...fileKey,
              ...uploadedFile,
            },
          });
        }

        const result = await transaction.profileFile.updateMany({
          where: {
            id: previousFile.id,
            userId,
            path: previousFile.path,
          },
          data: uploadedFile,
        });

        if (result.count !== 1) {
          throw replacementConflictError();
        }

        return transaction.profileFile.findUniqueOrThrow({
          where: { id: previousFile.id },
        });
      });
    } catch (error) {
      const isUniqueConflict =
        error !== null &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "P2002";

      const isReplacementConflict =
        error instanceof ApiError && error.code === "FILE_REPLACEMENT_CONFLICT";

      if (isUniqueConflict || isReplacementConflict) {
        await removeUnusedFile(userId, kind, uploadedFile.path);
        throw replacementConflictError();
      }

      // A database connection failure can leave the commit outcome unknown.
      // Do not delete a file that the database may now reference.
      console.error("Profile upload persistence requires reconciliation", {
        userId,
        kind,
        path: uploadedFile.path,
      });

      throw error;
    }

    if (previousFile) {
      await removeUnusedFile(userId, kind, previousFile.path);
    }

    return getFileMetadata(savedFile);
  },

  getFileAccess: async (
    userId: string,
    kind: ProfileUploadKind,
    database: PrismaClient = prisma,
  ) => {
    const file = await database.profileFile.findUnique({
      where: {
        userId_kind: {
          userId,
          kind: FILE_KINDS[kind],
        },
      },
    });

    if (!file) {
      throw new ApiError({
        statusCode: 404,
        code: "PROFILE_FILE_NOT_FOUND",
        message: `You have not uploaded a ${kind}.`,
      });
    }

    const access = await PrivateFileStorageService.createDownloadUrl(
      userId,
      kind,
      file.path,
    );

    return {
      ...getFileMetadata(file),
      ...access,
    };
  },
};
