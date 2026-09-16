import { apiService } from '@/services/api';
import type {
  ApiSuccessResponse,
  AuthSession,
  AuthUser,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest
} from '@/types';
import { routes } from '@/utils/routes';

export const authApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiSuccessResponse<AuthSession>, RegisterRequest>({
      query: (body) => ({
        url: routes.auth.register,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Auth']
    }),

    login: builder.mutation<ApiSuccessResponse<AuthSession>, LoginRequest>({
      query: (body) => ({
        url: routes.auth.login,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Auth']
    }),

    refresh: builder.mutation<ApiSuccessResponse<AuthSession>, void>({
      query: () => ({
        url: routes.auth.refresh,
        method: 'POST'
      })
    }),

    logout: builder.mutation<ApiSuccessResponse<null>, void>({
      query: () => ({
        url: routes.auth.logout,
        method: 'POST'
      }),
      invalidatesTags: ['Auth']
    }),

    changePassword: builder.mutation<ApiSuccessResponse<null>, ChangePasswordRequest>({
      query: (body) => ({
        url: routes.auth.changePassword,
        method: 'POST',
        body
      })
    }),

    forgotPassword: builder.mutation<ApiSuccessResponse<null>, ForgotPasswordRequest>({
      query: (body) => ({
        url: routes.auth.forgotPassword,
        method: 'POST',
        body
      })
    }),

    resetPassword: builder.mutation<ApiSuccessResponse<null>, ResetPasswordRequest>({
      query: (body) => ({
        url: routes.auth.resetPassword,
        method: 'POST',
        body
      })
    }),

    getCurrentUser: builder.query<ApiSuccessResponse<AuthUser>, void>({
      query: () => ({
        url: routes.auth.me,
        method: 'GET'
      }),
      providesTags: ['Auth']
    })
  })
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = authApi;
