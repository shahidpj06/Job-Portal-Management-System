import { apiService } from '@/services/api';
import type { ApiSuccessResponse, ICompanyListResult } from '@/types';
import { routes } from '@/utils/routes';

const COMPANY_LIST_TAG = {
  id: 'LIST',
  type: 'Company'
} as const;

export const companyApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    listAdminCompanies: builder.query<ApiSuccessResponse<ICompanyListResult>, void>({
      query: () => ({
        method: 'GET',
        url: routes.admin.companies.root
      }),
      providesTags: [COMPANY_LIST_TAG]
    })
  })
});

export const { useListAdminCompaniesQuery } = companyApi;
