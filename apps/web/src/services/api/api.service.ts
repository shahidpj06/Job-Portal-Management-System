import {
  createApi,
  fetchBaseQuery,
  type BaseQueryApi,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';

import { clearSession, setSession } from '@/services/auth/auth.slice';
import type { RootState } from '@/services/store';
import type { ApiSuccessResponse, AuthSession } from '@/types';
import { APP_CONFIG } from '@/utils/global-config';
import { routes } from '@/utils/routes';

type QueryArgs = string | FetchArgs;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: APP_CONFIG.apiBaseUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const { accessToken } = (getState() as RootState).auth;

    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`);
    }

    return headers;
  }
});

const authLifecycleRoutes = new Set<string>([
  routes.auth.login,
  routes.auth.logout,
  routes.auth.refresh,
  routes.auth.register
]);

const getRequestUrl = (args: QueryArgs): string => {
  return typeof args === 'string' ? args : args.url;
};

let refreshSessionPromise: Promise<boolean> | null = null;

const refreshSession = async (api: BaseQueryApi, extraOptions: object): Promise<boolean> => {
  const refreshResult = await rawBaseQuery(
    {
      url: routes.auth.refresh,
      method: 'POST'
    },
    api,
    extraOptions
  );

  const response = refreshResult.data as ApiSuccessResponse<AuthSession> | undefined;

  if (response?.success && response.data.accessToken) {
    api.dispatch(setSession(response.data));

    return true;
  }

  api.dispatch(clearSession());

  return false;
};

const baseQueryWithReauth: BaseQueryFn<QueryArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const isUnauthorized = result.error?.status === 401;
  const isAuthLifecycleRequest = authLifecycleRoutes.has(getRequestUrl(args));

  if (isUnauthorized && !isAuthLifecycleRequest) {
    if (!refreshSessionPromise) {
      refreshSessionPromise = refreshSession(api, extraOptions).finally(() => {
        refreshSessionPromise = null;
      });
    }

    const sessionRestored = await refreshSessionPromise;

    if (sessionRestored) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const apiService = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Job', 'Company', 'Application', 'Profile', 'ProfileFile'],
  endpoints: () => ({})
});
