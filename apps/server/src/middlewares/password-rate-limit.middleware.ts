import { rateLimit } from "express-rate-limit";

import { getAuthenticatedUser } from "../tools/authenticated-user.helper.js";

const rateLimitMessage = {
  success: false,
  error: {
    code: "PASSWORD_ATTEMPTS_EXCEEDED",
    message: "Too many attempts. Please try again in 15 minutes.",
  },
};

export const passwordChangeIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: rateLimitMessage,
});

export const passwordChangeAccountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (request) => getAuthenticatedUser(request).id,
  message: rateLimitMessage,
});

export const passwordResetIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: rateLimitMessage,
});
