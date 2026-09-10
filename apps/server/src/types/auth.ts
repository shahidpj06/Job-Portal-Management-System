import { UserRole } from "../generated/prisma/enums.js";

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: UserRole;
};

export type AuthUser = AuthenticatedUser & {
  firstName: string;
  lastName: string;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};
