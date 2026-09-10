import type { Response } from "express";

type ApiSuccessOptions<T> = {
  data: T;
  message?: string;
  statusCode?: number;
};

export const sendSuccess = <T>(
  response: Response,
  {
    data,
    message = "Request completed successfully.",
    statusCode = 200,
  }: ApiSuccessOptions<T>,
) => {
  return response.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
