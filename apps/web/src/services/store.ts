import { configureStore } from '@reduxjs/toolkit';

import { apiService } from '@/services/api/api.service';
import authReducer from '@/services/auth/auth.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiService.reducerPath]: apiService.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiService.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
