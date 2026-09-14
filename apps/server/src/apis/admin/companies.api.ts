import { Router } from "express";

import { UserRole } from "../../generated/prisma/enums.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { CompanyDataService } from "../../services/company.data-service.js";
import { asyncHandler } from "../../tools/async-handler.helper.js";
import { sendSuccess } from "../../tools/api-response.js";

export const adminCompaniesRouter = Router();

adminCompaniesRouter.use(authenticate, authorize(UserRole.ADMIN));

adminCompaniesRouter.get(
  "/",
  asyncHandler(async (_request, response) => {
    const result = await CompanyDataService.list();

    return sendSuccess(response, {
      data: result,
      message: "Companies retrieved successfully.",
    });
  }),
);
