import type { AuthenticatedUser } from "./auth.js";

export type ValidatedRequestData = {
  body?: unknown;
  params?: unknown;
  query?: unknown;
};

declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: AuthenticatedUser;
      validated?: ValidatedRequestData;
    }
  }
}
