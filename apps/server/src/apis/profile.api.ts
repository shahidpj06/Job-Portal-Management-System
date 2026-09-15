import { Router, type Request } from "express";

import { authenticate } from "../middlewares/authenticate.middleware.js";
import {
  getValidatedBody,
  validateBody,
} from "../middlewares/validate-request.middleware.js";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "../schemas/profile.schema.js";
import { ProfileDataService } from "../services/profile.data-service.js";
import { ApiError } from "../tools/api-error.js";
import { sendSuccess } from "../tools/api-response.js";
import { asyncHandler } from "../tools/async-handler.helper.js";
import { ProfileUploadKind } from "../config/upload.js";
import { receiveProfileUpload } from "../middlewares/upload-file.middleware.js";
import { ProfileFileDataService } from "../services/profile-file.data-service.js";

export const profileRouter = Router();

const profileFileKinds: ProfileUploadKind[] = ["avatar", "resume"];

const getAuthenticatedUserId = (request: Request): string => {
  const userId = request.authenticatedUser?.id;

  if (!userId) {
    throw new ApiError({
      statusCode: 401,
      code: "AUTHENTICATION_REQUIRED",
      message: "Authentication is required.",
    });
  }

  return userId;
};

profileRouter.use(authenticate);

profileRouter.use((_request, response, next) => {
  response.setHeader("Cache-Control", "no-store");
  next();
});

profileRouter.get(
  "/",
  asyncHandler(async (request, response) => {
    const profile = await ProfileDataService.getProfile(
      getAuthenticatedUserId(request),
    );

    return sendSuccess(response, {
      data: { profile },
      message: "Profile retrieved successfully.",
    });
  }),
);

profileRouter.patch(
  "/",
  validateBody(updateProfileSchema),
  asyncHandler(async (request, response) => {
    const input = getValidatedBody<UpdateProfileInput>(request);

    const profile = await ProfileDataService.updateProfile(
      getAuthenticatedUserId(request),
      input,
    );

    return sendSuccess(response, {
      data: { profile },
      message: "Profile updated successfully.",
    });
  }),
);

profileFileKinds.forEach((kind) => {
  profileRouter.put(
    `/${kind}`,
    receiveProfileUpload(kind),
    asyncHandler(async (request, response) => {
      if (!request.file) {
        throw new ApiError({
          statusCode: 400,
          code: "UPLOAD_REQUIRED",
          message: "Choose a file to upload.",
        });
      }

      const file = await ProfileFileDataService.replaceFile(
        getAuthenticatedUserId(request),
        kind,
        request.file,
      );

      return sendSuccess(response, {
        data: { file },
        message: `${kind === "avatar" ? "Profile image" : "Resume"} saved successfully.`,
      });
    }),
  );

  profileRouter.get(
    `/${kind}`,
    asyncHandler(async (request, response) => {
      const file = await ProfileFileDataService.getFileAccess(
        getAuthenticatedUserId(request),
        kind,
      );

      return sendSuccess(response, {
        data: { file },
        message: "File access retrieved successfully.",
      });
    }),
  );
});
