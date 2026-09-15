import { Router } from "express";

import { UserRole } from "../../generated/prisma/enums.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import {
  getValidatedQuery,
  validateQuery,
} from "../../middlewares/validate-request.middleware.js";
import {
  listUsersQuerySchema,
  type ListUsersQuery,
} from "../../schemas/user.schema.js";
import { UserDataService } from "../../services/user.data-service.js";
import { sendSuccess } from "../../tools/api-response.js";
import { asyncHandler } from "../../tools/async-handler.helper.js";

export const adminUsersRouter = Router();

adminUsersRouter.use(authenticate, authorize(UserRole.ADMIN));

adminUsersRouter.use((_request, response, next) => {
  response.setHeader("Cache-Control", "no-store");
  next();
});

adminUsersRouter.get(
  "/",
  validateQuery(listUsersQuerySchema),
  asyncHandler(async (request, response) => {
    const query = getValidatedQuery<ListUsersQuery>(request);
    const result = await UserDataService.list(query);

    return sendSuccess(response, {
      data: result,
      message: "Users retrieved successfully.",
    });
  }),
);
