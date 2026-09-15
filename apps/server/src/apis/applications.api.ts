import { Router } from "express";

import { UserRole } from "../generated/prisma/enums.js";
import { receiveApplicationUpload } from "../middlewares/application-upload.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  getValidatedBody,
  validateBody,
} from "../middlewares/validate-request.middleware.js";
import {
  submitApplicationSchema,
  type SubmitApplicationInput,
} from "../schemas/application.schema.js";
import { ApplicationDataService } from "../services/application.data-service.js";
import { ApiError } from "../tools/api-error.js";
import { sendSuccess } from "../tools/api-response.js";
import { asyncHandler } from "../tools/async-handler.helper.js";

export const applicationsRouter = Router();

applicationsRouter.use(authenticate, authorize(UserRole.USER));

applicationsRouter.use((_request, response, next) => {
  response.setHeader("Cache-Control", "no-store");
  next();
});

applicationsRouter.post(
  "/",
  receiveApplicationUpload,
  validateBody(submitApplicationSchema),
  asyncHandler(async (request, response) => {
    const userId = request.authenticatedUser?.id;

    if (!userId) {
      throw new ApiError({
        statusCode: 401,
        code: "AUTHENTICATION_REQUIRED",
        message: "Sign in before applying for a job.",
      });
    }

    const input = getValidatedBody<SubmitApplicationInput>(request);

    const application = await ApplicationDataService.submitApplication(
      userId,
      input,
      request.file,
    );

    return sendSuccess(response, {
      statusCode: 201,
      message: "Your application has been submitted.",
      data: { application },
    });
  }),
);
