import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AuthSession, AuthUser } from '@/types';

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

interface AuthState {
  accessToken: string | null;
  status: AuthStatus;
  user: AuthUser | null;
}

const initialState: AuthState = {
  accessToken: null,
  status: 'checking',
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearSession: (state) => {
      state.accessToken = null;
      state.status = 'unauthenticated';
      state.user = null;
    },

    setSession: (state, action: PayloadAction<AuthSession>) => {
      state.accessToken = action.payload.accessToken;
      state.status = 'authenticated';
      state.user = action.payload.user;
    }
  }
});

export const { clearSession, setSession } = authSlice.actions;

export default authSlice.reducer;
