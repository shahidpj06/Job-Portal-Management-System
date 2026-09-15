import { apiService } from '@/services/api';
import type { ApiSuccessResponse } from '@/types';
import type { IDashboardSummary } from '@/types/dashboard';
import { routes } from '@/utils/routes';

export const dashboardApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<ApiSuccessResponse<IDashboardSummary>, string>({
      query: () => ({
        url: routes.admin.dashboard.summary,
        method: 'GET'
      }),
      providesTags: [
        { type: 'Job', id: 'LIST' },
        { type: 'Application', id: 'LIST' }
      ],
      keepUnusedDataFor: 0
    })
  })
});

export const { useGetDashboardSummaryQuery } = dashboardApi;
