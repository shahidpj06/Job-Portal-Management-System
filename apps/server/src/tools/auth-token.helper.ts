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
};

export const createAccessToken = ({ id, role }: AccessTokenUser): string => {
  return jwt.sign(
    {
      sub: id,
      role,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_TOKEN_TTL as jwt.SignOptions["expiresIn"],
    },
  );
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
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
