import type { RequestHandler } from "express";
import multer from "multer";

import { PROFILE_UPLOAD_RULES } from "../config/upload.js";
import { ApiError } from "../tools/api-error.js";

const receiveFile = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: PROFILE_UPLOAD_RULES.resume.maxBytes,
    files: 1,
    fields: 5,
    parts: 7,
    fieldNameSize: 100,
    fieldSize: 20 * 1024,
  },
}).single("file");

export const receiveApplicationUpload: RequestHandler = (
  request,
  response,
  next,
) => {
  if (!request.is("multipart/form-data")) {
    return next(
      new ApiError({
        statusCode: 415,
        code: "INVALID_APPLICATION_CONTENT_TYPE",
        message: "Submit the application using multipart/form-data.",
      }),
    );
  }

  receiveFile(request, response, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      const isTooLarge = error.code === "LIMIT_FILE_SIZE";

      return next(
        new ApiError({
          statusCode: isTooLarge ? 413 : 400,
          code: isTooLarge
            ? "APPLICATION_RESUME_TOO_LARGE"
            : "INVALID_APPLICATION_UPLOAD",
          message: isTooLarge
            ? "Your resume must be no larger than 5 MB."
            : "Submit one resume using the field name 'file' and the supported application fields.",
        }),
      );
    }

    if (error) {
      return next(
        new ApiError({
          statusCode: 400,
          code: "INVALID_MULTIPART_REQUEST",
          message: "The application request could not be read.",
        }),
      );
    }

    if (request.file && request.file.size === 0) {
      return next(
        new ApiError({
          statusCode: 422,
          code: "EMPTY_APPLICATION_RESUME",
          message: "Choose a non-empty PDF resume.",
        }),
      );
    }

    return next();
  });
};
