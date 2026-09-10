import type { RequestHandler } from "express";
import type { UserRole } from "../generated/prisma/client.js";
import { ApiError } from "../tools/api-error.js";

export const authorize = (...allowedRoles: UserRole[]): RequestHandler => {
  return (request, _response, next) => {
    const user = request.authenticatedUser;

    if (!user) {
      return next(
        new ApiError({
          statusCode: 401,
          code: "MISSING_AUTHENTICATED_USER",
          message: "Authentication is required.",
        }),
      );
    }

    if (!allowedRoles.includes(user.role)) {
      return next(
        new ApiError({
          statusCode: 403,
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action.",
        }),
      );
    }

    return next();
  };
};
