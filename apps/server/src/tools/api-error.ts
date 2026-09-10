type ApiErrorOptions = {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
};

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor({ statusCode, code, message, details }: ApiErrorOptions) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
