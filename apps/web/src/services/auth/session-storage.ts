const SESSION_INDICATOR_KEY = 'jobnest_has_session';

export const hasSavedSession = (): boolean => {
  try {
    return localStorage.getItem(SESSION_INDICATOR_KEY) === 'true';
  } catch {
    return false;
  }
};

export const markSavedSession = (): void => {
  try {
    localStorage.setItem(SESSION_INDICATOR_KEY, 'true');
  } catch {
    // Ignore storage errors in restricted browser environments
  }
};

export const clearSavedSession = (): void => {
  try {
    localStorage.removeItem(SESSION_INDICATOR_KEY);
  } catch {
    // Ignore storage errors
  }
};
