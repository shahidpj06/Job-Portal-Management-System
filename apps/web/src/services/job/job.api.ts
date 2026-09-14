import { apiService } from '@/services/api';
import type {
  ApiSuccessResponse,
  ICreateJobRequest,
  IJobListQuery,
  IJobListResult,
  IJobMutationResult,
  IPublicJobListQuery,
  IUpdateJobMutationArguments
} from '@/types';
import { routes } from '@/utils/routes';

const JOB_LIST_TAG = {
  id: 'LIST',
  type: 'Job'
} as const;

export const jobApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    createJob: builder.mutation<ApiSuccessResponse<IJobMutationResult>, ICreateJobRequest>({
      query: (body) => ({
        body,
        method: 'POST',
        url: routes.admin.jobs.root
      }),
      invalidatesTags: [JOB_LIST_TAG]
    }),

    deleteJob: builder.mutation<ApiSuccessResponse<null>, string>({
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

    getJobDetails: builder.query<ApiSuccessResponse<IJobMutationResult>, string>({
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

    listJobs: builder.query<ApiSuccessResponse<IJobListResult>, IJobListQuery>({
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

    listPublicJobs: builder.query<ApiSuccessResponse<IJobListResult>, IPublicJobListQuery>({
      query: ({ employmentType, experienceLevel, ...params }) => ({
        method: 'GET',
        url: routes.jobs.root,
        params: {
          ...params,
          employmentType: employmentType?.length ? employmentType.join(',') : undefined,
          experienceLevel: experienceLevel?.length ? experienceLevel.join(',') : undefined
        }
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

    getPublicJobDetails: builder.query<ApiSuccessResponse<IJobMutationResult>, string>({
      query: (jobId) => ({
        method: 'GET',
        url: routes.jobs.byId(jobId)
      }),
      providesTags: (_result, _error, jobId) => [
        {
          id: jobId,
          type: 'Job'
        }
      ]
    }),

    updateJob: builder.mutation<
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
  useCreateJobMutation,
  useDeleteJobMutation,
  useGetJobDetailsQuery,
  useGetPublicJobDetailsQuery,
  useListJobsQuery,
  useListPublicJobsQuery,
  useUpdateJobMutation
} = jobApi;
