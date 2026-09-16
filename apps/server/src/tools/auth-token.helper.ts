import { createHash, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import type { UserRole } from "../generated/prisma/client.js";
import { env } from "../config/env.js";

type AccessTokenUser = {
  id: string;
  role: UserRole;
};

export type AccessTokenPayload = {
  sub: string;
  role: UserRole;
  sessionVersion: number;
};

export const createAccessToken = (
  { id, role }: AccessTokenUser,
  sessionVersion: number,
): string => {
  return jwt.sign(
    {
      sub: id,
      role,
      sessionVersion,
    },
    env.JWT_ACCESS_SECRET,
    {
      algorithm: "HS256",
      expiresIn: env.JWT_ACCESS_TOKEN_TTL as jwt.SignOptions["expiresIn"],
    },
  );
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, {
    algorithms: ["HS256"],
  });

  if (
    typeof payload === "string" ||
    typeof payload.sub !== "string" ||
    !payload.sub ||
    (payload.role !== "USER" && payload.role !== "ADMIN") ||
    typeof payload.sessionVersion !== "number" ||
    !Number.isSafeInteger(payload.sessionVersion) ||
    payload.sessionVersion < 0 ||
    typeof payload.exp !== "number"
  ) {
    throw new Error("Invalid access-token payload.");
  }

  return {
    sub: payload.sub,
    role: payload.role,
    sessionVersion: payload.sessionVersion,
  };
};

export const createRefreshToken = (): string => {
  return randomBytes(64).toString("hex");
};

export const hashRefreshToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

export const getRefreshTokenExpiry = (): Date => {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * millisecondsPerDay);
};
