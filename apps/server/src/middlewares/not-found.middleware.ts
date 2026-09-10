import type { RequestHandler } from "express";
import { ApiError } from "../tools/api-error.js";

export const notFoundHandler: RequestHandler = (request, _response, next) => {
  next(
    new ApiError({
      statusCode: 404,
      code: "ROUTE_NOT_FOUND",
      message: `Route ${request.method} ${request.originalUrl} was not found.`,
    }),
  );
};
