import { apiService } from '@/services/api';
import type {
  ApiSuccessResponse,
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
    })
  })
});

export const { useSubmitApplicationMutation } = applicationApi;
