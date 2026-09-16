import type { RequestHandler } from "express";

import { AuthDataService } from "../services/auth.data-service.js";
import { ApiError } from "../tools/api-error.js";
import { asyncHandler } from "../tools/async-handler.helper.js";
import {
  verifyAccessToken,
  type AccessTokenPayload,
} from "../tools/auth-token.helper.js";

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
    let payload: AccessTokenPayload;

    try {
      payload = verifyAccessToken(accessToken);
    } catch {
      throw new ApiError({
        statusCode: 401,
        code: "INVALID_ACCESS_TOKEN",
        message: "Your access token is invalid or expired.",
      });
    }

    request.authenticatedUser = await AuthDataService.getById(
      payload.sub,
      payload.sessionVersion,
    );

    next();
  },
);
