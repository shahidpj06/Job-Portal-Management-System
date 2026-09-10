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

  if (typeof error.error === 'string') {
    return error.error;
  }

  if (!isRecord(error.data)) {
    return fallbackMessage;
  }

  return typeof error.data.message === 'string' ? error.data.message : fallbackMessage;
};
