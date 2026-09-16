import { type PropsWithChildren, useCallback, useEffect, useRef } from 'react';

import { clearSession, hasSavedSession, setSession, useRefreshMutation } from '@/services/auth';
import { useAppDispatch } from '@/services/hooks';

export const AuthSessionProvider = ({ children }: PropsWithChildren) => {
  const dispatch = useAppDispatch();
  const hasRestoredSession = useRef(false);
  const [refresh] = useRefreshMutation();

  const restoreSession = useCallback(async () => {
    try {
      const response = await refresh().unwrap();

      dispatch(setSession(response.data));
    } catch {
      dispatch(clearSession());
    }
  }, [dispatch, refresh]);

  useEffect(() => {
    if (hasRestoredSession.current) {
      return;
    }

    hasRestoredSession.current = true;

    if (!hasSavedSession()) {
      return;
    }

    void restoreSession();
  }, [restoreSession]);

  return children;
};
