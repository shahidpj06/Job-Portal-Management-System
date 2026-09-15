import { Router } from "express";

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
  companyIdParamsSchema,
  createCompanySchema,
  listCompaniesQuerySchema,
  updateCompanySchema,
  type CompanyIdParams,
  type CreateCompanyInput,
  type ListCompaniesQuery,
  type UpdateCompanyInput,
} from "../../schemas/company.schema.js";
import { CompanyDataService } from "../../services/company.data-service.js";
import { sendSuccess } from "../../tools/api-response.js";
import { asyncHandler } from "../../tools/async-handler.helper.js";

export const adminCompaniesRouter = Router();

adminCompaniesRouter.use(authenticate, authorize(UserRole.ADMIN));

adminCompaniesRouter.use((_request, response, next) => {
  response.setHeader("Cache-Control", "no-store");
  next();
});

adminCompaniesRouter.get(
  "/",
  validateQuery(listCompaniesQuerySchema),
  asyncHandler(async (request, response) => {
    const query = getValidatedQuery<ListCompaniesQuery>(request);
    const result = await CompanyDataService.list(query);

    return sendSuccess(response, {
      data: result,
      message: "Companies retrieved successfully.",
    });
  }),
);

adminCompaniesRouter.get(
  "/:companyId",
  validateParams(companyIdParamsSchema),
  asyncHandler(async (request, response) => {
    const { companyId } = getValidatedParams<CompanyIdParams>(request);
    const company = await CompanyDataService.getById(companyId);

    return sendSuccess(response, {
      data: { company },
      message: "Company retrieved successfully.",
    });
  }),
);

adminCompaniesRouter.post(
  "/",
  validateBody(createCompanySchema),
  asyncHandler(async (request, response) => {
    const input = getValidatedBody<CreateCompanyInput>(request);
    const company = await CompanyDataService.create(input);

    return sendSuccess(response, {
      statusCode: 201,
      data: { company },
      message: "Company created successfully.",
    });
  }),
);

adminCompaniesRouter.patch(
  "/:companyId",
  validateParams(companyIdParamsSchema),
  validateBody(updateCompanySchema),
  asyncHandler(async (request, response) => {
    const { companyId } = getValidatedParams<CompanyIdParams>(request);
    const input = getValidatedBody<UpdateCompanyInput>(request);
    const company = await CompanyDataService.update(companyId, input);

    return sendSuccess(response, {
      data: { company },
      message: "Company updated successfully.",
    });
  }),
);

adminCompaniesRouter.delete(
  "/:companyId",
  validateParams(companyIdParamsSchema),
  asyncHandler(async (request, response) => {
    const { companyId } = getValidatedParams<CompanyIdParams>(request);

    await CompanyDataService.delete(companyId);

    return sendSuccess(response, {
      data: null,
      message: "Company deleted successfully.",
    });
  }),
);
