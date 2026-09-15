import { apiService } from '@/services/api';
import type { ApiSuccessResponse } from '@/types';
import type { IUserDirectoryQuery, IUserDirectoryResult } from '@/types/user-directory';
import { routes } from '@/utils/routes';

export const userApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    listAdminUsers: builder.query<ApiSuccessResponse<IUserDirectoryResult>, IUserDirectoryQuery>({
      query: ({ page, limit, search }) => ({
        method: 'GET',
        url: routes.admin.users.root,
        params: { page, limit, search }
      }),
      keepUnusedDataFor: 0
    })
  })
});

export const { useListAdminUsersQuery } = userApi;
