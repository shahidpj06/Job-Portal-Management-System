import { apiService } from '@/services/api';
import type {
  ApiSuccessResponse,
  IAdminApplicationListArguments,
  IApplicationDetails,
  IApplicationDetailsArguments,
  IApplicationListArguments,
  IApplicationListResult,
  IApplicationSubmissionResult,
  ISubmitApplicationRequest
} from '@/types';
import { routes } from '@/utils/routes';

export const applicationApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    submitApplication: builder.mutation<
      ApiSuccessResponse<IApplicationSubmissionResult>,
      ISubmitApplicationRequest
    >({
      query: (request) => {
        const body = new FormData();

        body.append('jobId', request.jobId);
        body.append('resumeSource', request.resumeSource);

        const coverLetter = request.coverLetter?.trim();

        if (coverLetter) {
          body.append('coverLetter', coverLetter);
        }

        if (request.resumeSource === 'profile') {
          body.append('resumeFileId', request.resumeFileId);
          body.append('resumeUpdatedAt', request.resumeUpdatedAt);
        } else {
          body.append('file', request.file);
        }

        return {
          url: routes.applications.root,
          method: 'POST',
          body
        };
      },
      invalidatesTags: (result) =>
        result
          ? [
              {
                type: 'Application' as const,
                id: 'LIST'
              }
            ]
          : []
    }),
    listCandidateApplications: builder.query<
      ApiSuccessResponse<IApplicationListResult>,
      IApplicationListArguments
    >({
      query: ({ page, limit }) => ({
        url: routes.applications.root,
        method: 'GET',
        params: { page, limit }
      }),
      providesTags: [{ type: 'Application', id: 'LIST' }],
      keepUnusedDataFor: 0
    }),
    listAdminApplications: builder.query<
      ApiSuccessResponse<IApplicationListResult>,
      IAdminApplicationListArguments
    >({
      query: ({ page, limit, jobId }) => ({
        url: routes.admin.applications.root,
        method: 'GET',
        params: { page, limit, jobId }
      }),
      providesTags: [{ type: 'Application', id: 'LIST' }],
      keepUnusedDataFor: 0
    }),

    getAdminApplicationDetails: builder.query<
      ApiSuccessResponse<{ application: IApplicationDetails }>,
      IApplicationDetailsArguments
    >({
      query: ({ applicationId }) => ({
        url: routes.admin.applications.byId(applicationId),
        method: 'GET'
      }),
      providesTags: (_result, _error, { applicationId }) => [
        { type: 'Application', id: applicationId }
      ],
      keepUnusedDataFor: 0
    })
  })
});

export const {
  useSubmitApplicationMutation,
  useListCandidateApplicationsQuery,
  useListAdminApplicationsQuery,
  useGetAdminApplicationDetailsQuery,
  useLazyGetAdminApplicationDetailsQuery
} = applicationApi;
