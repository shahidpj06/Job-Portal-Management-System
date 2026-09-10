import type { CookieOptions, Response } from "express";
import { env } from "../config/env.js";

const REFRESH_TOKEN_COOKIE_NAME = "jobnest_refresh_token";

const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/v1/auth",
  maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
};

export const AuthCookieHelper = {
  setRefreshToken: (response: Response, refreshToken: string): Response => {
    return response.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      refreshTokenCookieOptions,
    );
  },

  clearRefreshToken: (response: Response): Response => {
    return response.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
      ...refreshTokenCookieOptions,
      maxAge: undefined,
    });
  },

  refreshTokenName: REFRESH_TOKEN_COOKIE_NAME,
};
