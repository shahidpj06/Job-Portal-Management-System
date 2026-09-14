import { apiService } from '@/services/api';
import type {
  ApiSuccessResponse,
  ICreateJobRequest,
  IJobListQuery,
  IJobListResult,
  IJobMutationResult,
  IUpdateJobMutationArguments
} from '@/types';
import { routes } from '@/utils/routes';

const JOB_LIST_TAG = {
  id: 'LIST',
  type: 'Job'
} as const;

export const jobApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    createAdminJob: builder.mutation<ApiSuccessResponse<IJobMutationResult>, ICreateJobRequest>({
      query: (body) => ({
        body,
        method: 'POST',
        url: routes.admin.jobs.root
      }),
      invalidatesTags: [JOB_LIST_TAG]
    }),

    deleteAdminJob: builder.mutation<ApiSuccessResponse<null>, string>({
      query: (jobId) => ({
        method: 'DELETE',
        url: routes.admin.jobs.byId(jobId)
      }),
      invalidatesTags: (_result, _error, jobId) => [
        JOB_LIST_TAG,
        {
          id: jobId,
          type: 'Job'
        }
      ]
    }),

    getAdminJob: builder.query<ApiSuccessResponse<IJobMutationResult>, string>({
      query: (jobId) => ({
        method: 'GET',
        url: routes.admin.jobs.byId(jobId)
      }),
      providesTags: (_result, _error, jobId) => [
        {
          id: jobId,
          type: 'Job'
        }
      ]
    }),

    listAdminJobs: builder.query<ApiSuccessResponse<IJobListResult>, IJobListQuery>({
      query: (params) => ({
        method: 'GET',
        params,
        url: routes.admin.jobs.root
      }),
      providesTags: (result) => {
        const jobTags =
          result?.data.items.map((job) => ({
            id: job.id,
            type: 'Job' as const
          })) ?? [];

        return [JOB_LIST_TAG, ...jobTags];
      }
    }),

    updateAdminJob: builder.mutation<
      ApiSuccessResponse<IJobMutationResult>,
      IUpdateJobMutationArguments
    >({
      query: ({ data, jobId }) => ({
        body: data,
        method: 'PATCH',
        url: routes.admin.jobs.byId(jobId)
      }),
      invalidatesTags: (_result, _error, { jobId }) => [
        JOB_LIST_TAG,
        {
          id: jobId,
          type: 'Job'
        }
      ]
    })
  })
});

export const {
  useCreateAdminJobMutation,
  useDeleteAdminJobMutation,
  useGetAdminJobQuery,
  useListAdminJobsQuery,
  useUpdateAdminJobMutation
} = jobApi;
