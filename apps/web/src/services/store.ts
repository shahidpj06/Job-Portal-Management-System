import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import { apiService } from '@/services/api/api.service';
import authReducer, { clearSession, setSession } from '@/services/auth/auth.slice';

const sessionListener = createListenerMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiService.reducerPath]: apiService.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(sessionListener.middleware).concat(apiService.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const startSessionListening = sessionListener.startListening.withTypes<RootState, AppDispatch>();

startSessionListening({
  matcher: isAnyOf(clearSession, setSession),
  effect: (action, listenerApi) => {
    const previousAuth = listenerApi.getOriginalState().auth;
    const currentAuth = listenerApi.getState().auth;
    const hadSession = Boolean(previousAuth.accessToken || previousAuth.user);

    if (clearSession.match(action)) {
      if (hadSession) {
        listenerApi.dispatch(apiService.util.resetApiState());
      }
      return;
    }

    if (previousAuth.user?.id !== currentAuth.user?.id && hadSession) {
      listenerApi.dispatch(apiService.util.resetApiState());
    }
  }
});
