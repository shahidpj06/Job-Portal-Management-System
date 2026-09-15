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
    const previousUserId = listenerApi.getOriginalState().auth.user?.id;

    const currentUserId = listenerApi.getState().auth.user?.id;

    if (clearSession.match(action) || previousUserId !== currentUserId) {
      listenerApi.dispatch(apiService.util.resetApiState());
    }
  }
});
