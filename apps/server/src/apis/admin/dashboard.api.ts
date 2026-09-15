import { Router } from "express";

import { UserRole } from "../../generated/prisma/enums.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { DashboardDataService } from "../../services/dashboard.data-service.js";
import { sendSuccess } from "../../tools/api-response.js";
import { asyncHandler } from "../../tools/async-handler.helper.js";

export const adminDashboardRouter = Router();

adminDashboardRouter.use(authenticate, authorize(UserRole.ADMIN));

adminDashboardRouter.use((_request, response, next) => {
  response.setHeader("Cache-Control", "no-store");
  next();
});

adminDashboardRouter.get(
  "/summary",
  asyncHandler(async (_request, response) => {
    const summary = await DashboardDataService.getDashboardSummary();

    return sendSuccess(response, {
      data: summary,
      message: "Dashboard summary retrieved successfully.",
    });
  }),
);
