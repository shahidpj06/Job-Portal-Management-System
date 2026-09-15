import { apiService } from '@/services/api';
import type {
  ApiSuccessResponse,
  ICompanyListQuery,
  ICompanyListResult,
  ICompanyMutationResult,
  ICreateCompanyRequest,
  IUpdateCompanyArguments
} from '@/types';
import { routes } from '@/utils/routes';

const COMPANY_LIST_TAG = {
  id: 'LIST',
  type: 'Company'
} as const;

export const companyApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    listAdminCompanies: builder.query<
      ApiSuccessResponse<ICompanyListResult>,
      ICompanyListQuery | void
    >({
      query: (query) => ({
        method: 'GET',
        url: routes.admin.companies.root,
        params: {
          page: query?.page ?? 1,
          limit: query?.limit ?? 10,
          search: query?.search || undefined
        }
      }),
      providesTags: (result) => [
        COMPANY_LIST_TAG,
        ...(result?.data.items.map((company) => ({
          type: 'Company' as const,
          id: company.id
        })) ?? [])
      ]
    }),

    getAdminCompanyDetails: builder.query<ApiSuccessResponse<ICompanyMutationResult>, string>({
      query: (companyId) => ({
        method: 'GET',
        url: routes.admin.companies.byId(companyId)
      }),
      providesTags: (_result, _error, companyId) => [{ type: 'Company', id: companyId }]
    }),

    createCompany: builder.mutation<
      ApiSuccessResponse<ICompanyMutationResult>,
      ICreateCompanyRequest
    >({
      query: (body) => ({
        method: 'POST',
        url: routes.admin.companies.root,
        body
      }),
      invalidatesTags: (_result, error) => (error ? [] : [COMPANY_LIST_TAG])
    }),

    updateCompany: builder.mutation<
      ApiSuccessResponse<ICompanyMutationResult>,
      IUpdateCompanyArguments
    >({
      query: ({ companyId, data }) => ({
        method: 'PATCH',
        url: routes.admin.companies.byId(companyId),
        body: data
      }),
      invalidatesTags: (_result, error, { companyId }) =>
        error ? [] : [COMPANY_LIST_TAG, { type: 'Company', id: companyId }, 'Job', 'Application']
    }),

    deleteCompany: builder.mutation<ApiSuccessResponse<null>, string>({
      query: (companyId) => ({
        method: 'DELETE',
        url: routes.admin.companies.byId(companyId)
      }),
      invalidatesTags: (_result, error, companyId) =>
        error ? [] : [COMPANY_LIST_TAG, { type: 'Company', id: companyId }]
    })
  })
});

export const {
  useListAdminCompaniesQuery,
  useLazyListAdminCompaniesQuery,
  useGetAdminCompanyDetailsQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation
} = companyApi;
