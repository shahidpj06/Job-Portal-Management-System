import { Router } from "express";

import { UserRole } from "../../generated/prisma/enums.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import {
  getValidatedParams,
  getValidatedQuery,
  validateParams,
  validateQuery,
} from "../../middlewares/validate-request.middleware.js";
import {
  applicationIdParamsSchema,
  listAdminApplicationsQuerySchema,
  type ApplicationIdParams,
  type ListAdminApplicationsQuery,
} from "../../schemas/application.schema.js";
import { ApplicationReadDataService } from "../../services/application-read.data-service.js";
import { getAuthenticatedUser } from "../../tools/authenticated-user.helper.js";
import { sendSuccess } from "../../tools/api-response.js";
import { asyncHandler } from "../../tools/async-handler.helper.js";

export const adminApplicationsRouter = Router();

adminApplicationsRouter.use(authenticate, authorize(UserRole.ADMIN));

adminApplicationsRouter.use((_request, response, next) => {
  response.setHeader("Cache-Control", "no-store");
  next();
});

adminApplicationsRouter.get(
  "/",
  validateQuery(listAdminApplicationsQuerySchema),
  asyncHandler(async (request, response) => {
    const query = getValidatedQuery<ListAdminApplicationsQuery>(request);

    const result =
      await ApplicationReadDataService.listAdminApplications(query);

    return sendSuccess(response, {
      data: result,
      message: "Applications retrieved successfully.",
    });
  }),
);

adminApplicationsRouter.get(
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