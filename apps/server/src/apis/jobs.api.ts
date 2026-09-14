import { Router } from "express";

import {
  getValidatedParams,
  getValidatedQuery,
  validateParams,
  validateQuery,
} from "../middlewares/validate-request.middleware.js";
import {
  jobIdParamsSchema,
  listPublicJobsQuerySchema,
  type JobIdParams,
  type ListPublicJobsQuery,
} from "../schemas/job.schema.js";
import { JobDataService } from "../services/job.data-service.js";
import { sendSuccess } from "../tools/api-response.js";
import { asyncHandler } from "../tools/async-handler.helper.js";

export const jobsRouter = Router();

jobsRouter.get(
  "/",
  validateQuery(listPublicJobsQuerySchema),
  asyncHandler(async (request, response) => {
    const query = getValidatedQuery<ListPublicJobsQuery>(request);
    const result = await JobDataService.listPublic(query);

    return sendSuccess(response, {
      data: result,
      message: "Jobs retrieved successfully.",
    });
  }),
);

jobsRouter.get(
  "/:jobId",
  validateParams(jobIdParamsSchema),
  asyncHandler(async (request, response) => {
    const { jobId } = getValidatedParams<JobIdParams>(request);
    const job = await JobDataService.getPublicById(jobId);

    return sendSuccess(response, {
      data: { job },
      message: "Job retrieved successfully.",
    });
  }),
);
