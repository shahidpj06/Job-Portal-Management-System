import type { RequestHandler } from "express";
import multer from "multer";

import {
  PROFILE_UPLOAD_RULES,
  type ProfileUploadKind,
} from "../config/upload.js";
import { ApiError } from "../tools/api-error.js";

export const receiveProfileUpload = (
  kind: ProfileUploadKind,
): RequestHandler => {
  const rules = PROFILE_UPLOAD_RULES[kind];

  const receiveFile = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: rules.maxBytes,
      files: 1,
      fields: 0,
      parts: 2,
    },
  }).single("file");

  return (request, response, next) => {
    receiveFile(request, response, (error: unknown) => {
      if (error instanceof multer.MulterError) {
        const isTooLarge = error.code === "LIMIT_FILE_SIZE";

        return next(
          new ApiError({
            statusCode: isTooLarge ? 413 : 400,
            code: isTooLarge ? "UPLOAD_TOO_LARGE" : "INVALID_UPLOAD",
            message: isTooLarge
              ? `The ${kind} exceeds the ${
                  rules.maxBytes / (1024 * 1024)
                } MB limit.`
              : "Upload exactly one file using the field name 'file'.",
          }),
        );
      }

      if (error) {
        return next(
          new ApiError({
            statusCode: 400,
            code: "INVALID_MULTIPART_REQUEST",
            message: "The upload request could not be read.",
          }),
        );
      }

      if (!request.file || request.file.size === 0) {
        return next(
          new ApiError({
            statusCode: 400,
            code: "UPLOAD_REQUIRED",
            message: "Choose a non-empty file to upload.",
          }),
        );
      }

      return next();
    });
  };
};
