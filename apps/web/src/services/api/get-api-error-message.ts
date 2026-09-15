const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage = 'Something went wrong. Please try again.'
): string => {
  if (!isRecord(error)) {
    return fallbackMessage;
  }

  if (isRecord(error.data)) {
    const responseError = error.data.error;

    if (isRecord(responseError) && typeof responseError.message === 'string') {
      return responseError.message;
    }

    if (typeof error.data.message === 'string') {
      return error.data.message;
    }
  }

  if (typeof error.error === 'string') {
    return error.error;
  }

  return fallbackMessage;
};
