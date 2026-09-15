import type { RequestHandler } from "express";
import { AuthDataService } from "../services/auth.data-service.js";
import { asyncHandler } from "../tools/async-handler.helper.js";
import { ApiError } from "../tools/api-error.js";
import { verifyAccessToken } from "../tools/auth-token.helper.js";

export const authenticate: RequestHandler = asyncHandler(
  async (request, _response, next) => {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader?.startsWith("Bearer ")) {
      throw new ApiError({
        statusCode: 401,
        code: "MISSING_ACCESS_TOKEN",
        message: "Authentication is required.",
      });
    }

    const accessToken = authorizationHeader.slice("Bearer ".length);

    try {
      const payload = verifyAccessToken(accessToken);

      request.authenticatedUser = await AuthDataService.getById(payload.sub);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError({
        statusCode: 401,
        code: "INVALID_ACCESS_TOKEN",
        message: "Your access token is invalid or expired.",
      });
    }

    return next();
  },
);
