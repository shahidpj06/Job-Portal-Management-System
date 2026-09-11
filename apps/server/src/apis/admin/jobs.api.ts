import { Router, type Request } from "express";
import { ApiError } from "../../tools/api-error.js";
import { AuthenticatedUser } from "../../types/auth.js";
import { UserRole } from "../../generated/prisma/enums.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import {
  getValidatedBody,
  getValidatedParams,
  getValidatedQuery,
  validateBody,
  validateParams,
  validateQuery,
} from "../../middlewares/validate-request.middleware.js";
import {
  CreateJobInput,
  createJobSchema,
  JobIdParams,
  jobIdParamsSchema,
  ListJobsQuery,
  listJobsQuerySchema,
  UpdateJobInput,
  updateJobSchema,
} from "../../schemas/job.schema.js";
import { asyncHandler } from "../../tools/async-handler.helper.js";
import { JobDataService } from "../../services/job.data-service.js";
import { sendSuccess } from "../../tools/api-response.js";

const getAuthenticatedUser = (request: Request): AuthenticatedUser => {
  const authenticatedUser = request.authenticatedUser;

  if (!authenticatedUser) {
    throw new ApiError({
      statusCode: 401,
      code: "MISSING_AUTHENTICATED_USER",
      message: "Authentication is required.",
    });
  }
  return authenticatedUser;
};

export const adminJobsRouter = Router();

adminJobsRouter.use(authenticate, authorize(UserRole.ADMIN));

adminJobsRouter.delete(
  "/:jobId",
  validateParams(jobIdParamsSchema),
  asyncHandler(async (request, response) => {
    const { jobId } = getValidatedParams<JobIdParams>(request);

    await JobDataService.delete(jobId);

    return sendSuccess(response, {
      data: null,
      message: "Job deleted successfully",
    });
  }),
);

adminJobsRouter.get(
  "/",
  validateQuery(listJobsQuerySchema),
  asyncHandler(async (request, response) => {
    const query = getValidatedQuery<ListJobsQuery>(request);
    const result = await JobDataService.list(query);

    return sendSuccess(response, {
      data: result,
      message: "Jobs retrieved successfully.",
    });
  }),
);

adminJobsRouter.get(
  "/:jobId",
  validateParams(jobIdParamsSchema),
  asyncHandler(async (request, response) => {
    const { jobId } = getValidatedParams<JobIdParams>(request);
    const job = await JobDataService.getById(jobId);

    return sendSuccess(response, {
      data: {
        job,
      },
      message: "Job retrieved successfully",
    });
  }),
);

adminJobsRouter.patch(
  "/:jobId",
  validateParams(jobIdParamsSchema),
  validateBody(updateJobSchema),
  asyncHandler(async (request, response) => {
    const { jobId } = getValidatedParams<JobIdParams>(request);
    const input = getValidatedBody<UpdateJobInput>(request);
    const job = await JobDataService.update(jobId, input);

    return sendSuccess(response, {
      data: {
        job,
      },
      message: "Job updated successfully.",
    });
  }),
);

adminJobsRouter.post(
  "/",
  validateBody(createJobSchema),
  asyncHandler(async (request, response) => {
    const authenticatedUser = getAuthenticatedUser(request);
    const input = getValidatedBody<CreateJobInput>(request);
    const job = await JobDataService.create(input, authenticatedUser.id);

    return sendSuccess(response, {
      statusCode: 201,
      data: {
        job,
      },
      message: "Job created successfully.",
    });
  }),
);
