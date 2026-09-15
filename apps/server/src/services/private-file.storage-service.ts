import { randomUUID } from "node:crypto";

import { env } from "../config/env.js";
import { storageClient } from "../config/storage.js";
import {
  PRIVATE_FILE_URL_TTL_SECONDS,
  type ProfileUploadKind,
} from "../config/upload.js";
import { ApiError } from "../tools/api-error.js";
import { IValidatedUpload } from "../types/upload-file.js";

const PRIVATE_BUCKETS: Record<ProfileUploadKind, string> = {
  avatar: env.SUPABASE_AVATARS_BUCKET,
  resume: env.SUPABASE_RESUMES_BUCKET,
};

const assertOwnedPath = (userId: string, path: string): void => {
  const segments = path.split("/");

  if (
    segments.length !== 2 ||
    segments[0] !== userId ||
    !segments[1] ||
    segments[1] === "." ||
    segments[1] === ".." ||
    path.includes("\\")
  ) {
    throw new ApiError({
      statusCode: 403,
      code: "FILE_ACCESS_DENIED",
      message: "You cannot access this file.",
    });
  }
};

export const PrivateFileStorageService = {
  uploadFile: async (
    userId: string,
    kind: ProfileUploadKind,
    file: IValidatedUpload,
  ) => {
    const path = `${userId}/${randomUUID()}.${file.extension}`;

    const { error } = await storageClient.storage
      .from(PRIVATE_BUCKETS[kind])
      .upload(path, file.buffer, {
        contentType: file.contentType,
        cacheControl: "0",
        upsert: false,
      });

    if (error) {
      throw new ApiError({
        statusCode: 502,
        code: "FILE_UPLOAD_FAILED",
        message: "The file could not be uploaded. Please try again.",
      });
    }

    return {
      path,
      filename: file.filename,
      contentType: file.contentType,
      size: file.size,
    };
  },

  createDownloadUrl: async (
    userId: string,
    kind: ProfileUploadKind,
    path: string,
  ) => {
    assertOwnedPath(userId, path);

    const { data, error } = await storageClient.storage
      .from(PRIVATE_BUCKETS[kind])
      .createSignedUrl(
        path,
        PRIVATE_FILE_URL_TTL_SECONDS,
        kind === "resume" ? { download: "resume.pdf" } : {},
      );

    if (error || !data?.signedUrl) {
      throw new ApiError({
        statusCode: 502,
        code: "FILE_ACCESS_FAILED",
        message: "The file could not be accessed. Please try again.",
      });
    }

    return {
      url: data.signedUrl,
      expiresAt: new Date(
        Date.now() + PRIVATE_FILE_URL_TTL_SECONDS * 1000,
      ).toISOString(),
    };
  },

  deleteFile: async (
    userId: string,
    kind: ProfileUploadKind,
    path: string,
  ): Promise<void> => {
    assertOwnedPath(userId, path);

    const { error } = await storageClient.storage
      .from(PRIVATE_BUCKETS[kind])
      .remove([path]);

    if (error) {
      throw new ApiError({
        statusCode: 502,
        code: "FILE_DELETE_FAILED",
        message: "The stored file could not be removed.",
      });
    }
  },
};
