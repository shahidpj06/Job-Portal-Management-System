import { apiService } from '@/services/api';
import { updateSessionProfile } from '@/services/auth/auth.slice';
import type {
  ApiSuccessResponse,
  IProfileData,
  IProfileFile,
  IProfileFileAccess,
  IProfileFileAccessArguments,
  IUpdateProfileArguments,
  IUploadProfileFileArguments
} from '@/types';
import { routes } from '@/utils/routes';

export const profileApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ApiSuccessResponse<{ profile: IProfileData }>, string>({
      query: () => ({
        url: routes.profile.root,
        method: 'GET'
      }),
      providesTags: (_result, _error, userId) => [{ type: 'Profile', id: userId }],
      keepUnusedDataFor: 0
    }),

    updateProfile: builder.mutation<
      ApiSuccessResponse<{ profile: IProfileData }>,
      IUpdateProfileArguments
    >({
      query: ({ data }) => ({
        url: routes.profile.root,
        method: 'PATCH',
        body: data
      }),

      invalidatesTags: (result, _error, { userId }) =>
        result ? [{ type: 'Profile', id: userId }, { type: 'Auth' }] : [],

      onQueryStarted: async (_arguments, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          const { id, firstName, lastName } = data.data.profile;

          dispatch(updateSessionProfile({ id, firstName, lastName }));
        } catch {
          // The submitting form displays the request error.
        }
      }
    }),

    uploadProfileFile: builder.mutation<
      ApiSuccessResponse<{ file: IProfileFile }>,
      IUploadProfileFileArguments
    >({
      query: ({ kind, file }) => {
        const body = new FormData();
        body.append('file', file);

        return {
          url: routes.profile[kind],
          method: 'PUT',
          body
        };
      },

      invalidatesTags: (result, _error, { userId, kind }) =>
        result
          ? [
              { type: 'Profile', id: userId },
              { type: 'ProfileFile', id: `${userId}:${kind}` }
            ]
          : []
    }),

    getProfileFileAccess: builder.query<
      ApiSuccessResponse<{ file: IProfileFileAccess }>,
      IProfileFileAccessArguments
    >({
      query: ({ kind }) => ({
        url: routes.profile[kind],
        method: 'GET'
      }),
      providesTags: (_result, _error, { userId, kind }) => [
        { type: 'ProfileFile', id: `${userId}:${kind}` }
      ],
      keepUnusedDataFor: 0
    })
  })
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadProfileFileMutation,
  useGetProfileFileAccessQuery,
  useLazyGetProfileFileAccessQuery
} = profileApi;
