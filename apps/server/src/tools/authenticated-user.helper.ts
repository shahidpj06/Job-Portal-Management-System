import type { Request } from "express";

import { ApiError } from "./api-error.js";

export const getAuthenticatedUser = (request: Request) => {
  if (!request.authenticatedUser) {
    throw new ApiError({
      statusCode: 401,
      code: "AUTHENTICATION_REQUIRED",
      message: "Authentication is required.",
    });
  }

  return request.authenticatedUser;
};
