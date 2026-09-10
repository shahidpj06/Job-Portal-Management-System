import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { ApiError } from "../tools/api-error.js";

export const validateBody = (schema: ZodType): RequestHandler => {
  return (request, _response, next) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      return next(
        new ApiError({
          statusCode: 422,
          code: "VALIDATION_ERROR",
          message: "One or more fields are invalid.",
          details: result.error.flatten().fieldErrors,
        }),
      );
    }

    request.body = result.data;
    return next();
  };
};
