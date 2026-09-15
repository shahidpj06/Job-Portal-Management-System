import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useMemo, useState } from 'react';

import { EmptyState, ErrorState, LoadingState, PageHeader } from '@/components/common';
import { ResultsPagination } from '@/components/pagination/pagination';
import { SearchInput } from '@/components/search/search-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDebouncedValue } from '@/hooks';
import { getApiErrorMessage } from '@/services/api/get-api-error-message';
import { useAuthSession } from '@/services/auth';
import { useListAdminUsersQuery } from '@/services/user/user.api';

import { UsersTable } from './components/users-table';

const PAGE_SIZE = 10;

export const AdminUsersPage = () => {
  const { user, isAuthenticated } = useAuthSession();
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(searchInput);
  const isSearchPending = searchInput !== debouncedSearch;
  const viewerId = isAuthenticated && user?.role === 'ADMIN' ? user.id : undefined;

  const queryArguments = useMemo(
    () =>
      viewerId
        ? {
            viewerId,
            page,
            limit: PAGE_SIZE,
            search: debouncedSearch.trim() || undefined
          }
        : skipToken,
    [viewerId, page, debouncedSearch]
  );

  const {
    currentData: response,
    isFetching,
    isError,
    error,
    refetch
  } = useListAdminUsersQuery(queryArguments, {
    refetchOnMountOrArgChange: true
  });

  const users = response?.data.items;
  const pagination = response?.data.pagination;

  const description = useMemo(
    () =>
      pagination && !isError && !isSearchPending
        ? `${pagination.totalItems.toLocaleString()} ${
            debouncedSearch.trim() ? 'matching users' : 'registered users'
          }`
        : 'Browse registered users.',
    [pagination, isError, isSearchPending, debouncedSearch]
  );

  const onSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    setPage(1);
  }, []);

  const onClearSearch = useCallback(() => {
    setSearchInput('');
    setPage(1);
  }, []);

  const onFirstPage = useCallback(() => {
    setPage(1);
  }, []);

  const onRetry = useCallback(() => {
    if (viewerId) {
      void refetch();
    }
  }, [viewerId, refetch]);

  if (!viewerId) {
    return <LoadingState />;
  }

  return (
    <div className='space-y-5 p-4 md:p-6'>
      <PageHeader title='Users' description={description} />

      <Card>
        <CardContent className='space-y-4 p-4'>
          <div className='flex flex-wrap items-center gap-3'>
            <SearchInput
              value={searchInput}
              onValueChange={onSearchChange}
              placeholder='Search by name or email'
              aria-label='Search users by name or email'
              maxLength={100}
              wrapperClassName='w-full sm:max-w-sm'
            />

            {searchInput && (
              <Button type='button' variant='ghost' onClick={onClearSearch}>
                Clear search
              </Button>
            )}
          </div>

          {isFetching || isSearchPending ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState description={getApiErrorMessage(error)} onRetry={onRetry} />
          ) : users?.length ? (
            <>
              <UsersTable users={users} />

              {pagination && (
                <ResultsPagination
                  page={pagination.page}
                  pageCount={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  itemLabel='users'
                  onPageChange={setPage}
                />
              )}
            </>
          ) : (
            <EmptyState
              title='No users found'
              description={
                searchInput.trim()
                  ? 'Try another name or email address.'
                  : 'There are no users to display on this page.'
              }
              action={
                page > 1 ? (
                  <Button type='button' variant='outline' onClick={onFirstPage}>
                    Go to first page
                  </Button>
                ) : undefined
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
