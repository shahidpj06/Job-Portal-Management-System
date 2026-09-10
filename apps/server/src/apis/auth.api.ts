import { Router, type Request } from "express";

import { ApiError } from "../tools/api-error.js";
import { AuthCookieHelper } from "../tools/auth-cookie.helper.js";
import { AuthDataService } from "../services/auth.data-service.js";
import { asyncHandler } from "../tools/async-handler.helper.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { sendSuccess } from "../tools/api-response.js";
import { validateBody } from "../middlewares/validate-request.middleware.js";

export const authRouter = Router();

const getRefreshTokenFromRequest = (request: Request): string => {
  const refreshToken = request.cookies[AuthCookieHelper.refreshTokenName] as
    string | undefined;

  if (!refreshToken) {
    throw new ApiError({
      statusCode: 401,
      code: "MISSING_REFRESH_TOKEN",
      message: "Your session has expired. Please log in again.",
    });
  }

  return refreshToken;
};

authRouter.post(
  "/register",
  validateBody(registerSchema),
  asyncHandler(async (request, response) => {
    const session = await AuthDataService.register(request.body);

    AuthCookieHelper.setRefreshToken(response, session.refreshToken);

    return sendSuccess(response, {
      statusCode: 201,
      message: "Account created successfully.",
      data: {
        user: session.user,
        accessToken: session.accessToken,
      },
    });
  }),
);

authRouter.post(
  "/login",
  validateBody(loginSchema),
  asyncHandler(async (request, response) => {
    const session = await AuthDataService.login(request.body);

    AuthCookieHelper.setRefreshToken(response, session.refreshToken);

    return sendSuccess(response, {
      message: "Logged in successfully.",
      data: {
        user: session.user,
        accessToken: session.accessToken,
      },
    });
  }),
);

authRouter.get(
  "/me",
  authenticate,
  asyncHandler(async (request, response) => {
    const user = request.authenticatedUser;

    if (!user) {
      throw new ApiError({
        statusCode: 401,
        code: "MISSING_AUTHENTICATED_USER",
        message: "Authentication is required.",
      });
    }

    return sendSuccess(response, {
      message: "Current user retrieved successfully.",
      data: {
        user,
      },
    });
  }),
);

authRouter.post(
  "/refresh",
  asyncHandler(async (request, response) => {
    const session = await AuthDataService.refresh(
      getRefreshTokenFromRequest(request),
    );

    AuthCookieHelper.setRefreshToken(response, session.refreshToken);

    return sendSuccess(response, {
      message: "Session refreshed successfully.",
      data: {
        user: session.user,
        accessToken: session.accessToken,
      },
    });
  }),
);

authRouter.post(
  "/logout",
  asyncHandler(async (request, response) => {
    const refreshToken = request.cookies[AuthCookieHelper.refreshTokenName] as
      string | undefined;

    if (refreshToken) {
      await AuthDataService.logout(refreshToken);
    }

    AuthCookieHelper.clearRefreshToken(response);

    return sendSuccess(response, {
      message: "Logged out successfully.",
      data: null,
    });
  }),
);
