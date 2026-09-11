import type { Request, RequestHandler } from "express";
import type { ZodType } from "zod";

import { ApiError } from "../tools/api-error.js";

const RequestParts = {
  Body: "body",
  Params: "params",
  Query: "query",
} as const;

type RequestPart = (typeof RequestParts)[keyof typeof RequestParts];

const validateRequestPart = (
  requestPart: RequestPart,
  schema: ZodType,
): RequestHandler => {
  return (request, _response, next) => {
    const result = schema.safeParse(request[requestPart]);

    if (!result.success) {
      return next(
        new ApiError({
          statusCode: 422,
          code: "VALIDATION_ERROR",
          message: "One or more fields are invalid.",
          details: result.error.flatten(),
        }),
      );
    }

    request.validated = {
      ...request.validated,
      [requestPart]: result.data,
    };

    if (requestPart === RequestParts.Body) {
      request.body = result.data;
    }

    return next();
  };
};

const getValidatedRequestPart = <Data>(
  request: Request,
  requestPart: RequestPart,
): Data => {
  const validatedData = request.validated?.[requestPart];

  if (validatedData === undefined) {
    throw new ApiError({
      statusCode: 500,
      code: "MISSING_VALIDATED_REQUEST_DATA",
      message: `Validated request ${requestPart} data is unavailable.`,
    });
  }

  return validatedData as Data;
};

export const getValidatedBody = <Data>(request: Request): Data => {
  return getValidatedRequestPart<Data>(request, RequestParts.Body);
};

export const getValidatedParams = <Data>(request: Request): Data => {
  return getValidatedRequestPart<Data>(request, RequestParts.Params);
};

export const getValidatedQuery = <Data>(request: Request): Data => {
  return getValidatedRequestPart<Data>(request, RequestParts.Query);
};

export const validateBody = (schema: ZodType): RequestHandler => {
  return validateRequestPart(RequestParts.Body, schema);
};

export const validateParams = (schema: ZodType): RequestHandler => {
  return validateRequestPart(RequestParts.Params, schema);
};

export const validateQuery = (schema: ZodType): RequestHandler => {
  return validateRequestPart(RequestParts.Query, schema);
};
