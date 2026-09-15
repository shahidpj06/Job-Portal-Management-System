import { Router } from "express";

import { UserRole } from "../generated/prisma/enums.js";
import { receiveApplicationUpload } from "../middlewares/application-upload.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  getValidatedBody,
  getValidatedParams,
  getValidatedQuery,
  validateBody,
  validateParams,
  validateQuery,
} from "../middlewares/validate-request.middleware.js";
import {
  ApplicationIdParams,
  applicationIdParamsSchema,
  ListCandidateApplicationsQuery,
  listCandidateApplicationsQuerySchema,
  submitApplicationSchema,
  type SubmitApplicationInput,
} from "../schemas/application.schema.js";
import { ApplicationDataService } from "../services/application.data-service.js";
import { ApiError } from "../tools/api-error.js";
import { sendSuccess } from "../tools/api-response.js";
import { asyncHandler } from "../tools/async-handler.helper.js";
import { ApplicationReadDataService } from "../services/application-read.data-service.js";
import { getAuthenticatedUser } from "../tools/authenticated-user.helper.js";

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

applicationsRouter.get(
  "/",
  validateQuery(listCandidateApplicationsQuerySchema),
  asyncHandler(async (request, response) => {
    const user = getAuthenticatedUser(request);
    const query = getValidatedQuery<ListCandidateApplicationsQuery>(request);

    const result = await ApplicationReadDataService.listCandidateApplications(
      user.id,
      query,
    );

    return sendSuccess(response, {
      data: result,
      message: "Your applications retrieved successfully.",
    });
  }),
);

applicationsRouter.get(
  "/:applicationId",
  validateParams(applicationIdParamsSchema),
  asyncHandler(async (request, response) => {
    const { applicationId } = getValidatedParams<ApplicationIdParams>(request);

    const application = await ApplicationReadDataService.getApplicationDetails(
      applicationId,
      getAuthenticatedUser(request),
    );

    return sendSuccess(response, {
      data: { application },
      message: "Application retrieved successfully.",
    });
  }),
);
