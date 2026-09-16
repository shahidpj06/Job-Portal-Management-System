import { useCallback, useMemo } from 'react';

import type { LoginRequest, RegisterRequest } from '@/types';
import { useAppDispatch, useAppSelector } from '@/services/hooks';

import { useLoginMutation, useLogoutMutation, useRegisterMutation } from './auth.api';
import { clearSession, setSession } from './auth.slice';

export const useAuthSession = () => {
  const dispatch = useAppDispatch();
  const { accessToken, status, user } = useAppSelector((state) => state.auth);

  const [loginRequest, loginState] = useLoginMutation();
  const [registerRequest, registerState] = useRegisterMutation();
  const [logoutRequest, logoutState] = useLogoutMutation();

  const login = useCallback(
    async (input: LoginRequest) => {
      const response = await loginRequest(input).unwrap();
      
      dispatch(setSession(response.data));

      return response.data.user;
    },
    [dispatch, loginRequest]
  );

  const register = useCallback(
    async (input: RegisterRequest) => {
      const response = await registerRequest(input).unwrap();

      dispatch(setSession(response.data));

      return response.data.user;
    },
    [dispatch, registerRequest]
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest().unwrap();
    } finally {
      dispatch(clearSession());
    }
  }, [dispatch, logoutRequest]);

  return useMemo(
    () => ({
      accessToken,
      isAdmin: user?.role === 'ADMIN',
      isAuthenticated: status === 'authenticated',
      isLoading: loginState.isLoading || registerState.isLoading || logoutState.isLoading,
      login,
      logout,
      register,
      status,
      user
    }),
    [
      accessToken,
      login,
      loginState.isLoading,
      logout,
      logoutState.isLoading,
      register,
      registerState.isLoading,
      status,
      user
    ]
  );
};
