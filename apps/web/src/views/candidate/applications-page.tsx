import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query';

import { EmptyState, ErrorState, LoadingState } from '@/components/common';
import { ResultsPagination } from '@/components/pagination/pagination';
import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/services/api';
import { useListCandidateApplicationsQuery } from '@/services/application/application.api';
import { useAuthSession } from '@/services/auth';
import { paths } from '@/utils/paths';

import { ApplicationCard } from './components/application-card';

export const ApplicationsPage = () => {
  const { isAuthenticated, user } = useAuthSession();
  const [page, setPage] = useState(1);

  const queryArguments = useMemo(
    () =>
      isAuthenticated && user?.role === 'USER' ? { viewerId: user.id, page, limit: 10 } : skipToken,
    [isAuthenticated, user?.id, user?.role, page]
  );

  const {
    currentData: response,
    error,
    isError,
    isFetching,
    refetch
  } = useListCandidateApplicationsQuery(queryArguments);

  const applications = response?.data.items;
  const pagination = response?.data.pagination;

  const summary = useMemo(() => {
    if (!pagination) {
      return 'Track your submitted applications.';
    }

    const count = pagination.totalItems;

    return `${count} application${count === 1 ? '' : 's'} submitted`;
  }, [pagination]);

  const errorMessage = useMemo(
    () => getApiErrorMessage(error, 'Unable to load your applications.'),
    [error]
  );

  const onRetry = useCallback(() => {
    if (queryArguments !== skipToken) {
      void refetch();
    }
  }, [queryArguments, refetch]);

  const onPageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const onFirstPage = useCallback(() => {
    setPage(1);
  }, []);

  return (
    <div className='mx-auto max-w-[1200px] px-4 py-8 md:px-8'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>My Applications</h1>
        <p className='mt-1 text-muted-foreground'>{summary}</p>
      </div>

      <div aria-busy={isFetching}>
        {isFetching && (
          <p role='status' className='mb-4 text-sm text-muted-foreground'>
            Loading applications…
          </p>
        )}

        {!response && isFetching && <LoadingState />}

        {isError ? (
          <ErrorState
            title='Unable to load applications'
            description={errorMessage}
            onRetry={onRetry}
          />
        ) : applications && pagination ? (
          <>
            {applications.length > 0 ? (
              <div className='space-y-4'>
                {applications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))}
              </div>
            ) : pagination.totalItems === 0 ? (
              <EmptyState
                title='No applications yet'
                description='Start applying to jobs and track your progress here.'
                action={
                  <Button asChild>
                    <Link to={paths.jobs}>Browse Jobs</Link>
                  </Button>
                }
              />
            ) : (
              <EmptyState
                title='No applications on this page'
                action={<Button onClick={onFirstPage}>Go to first page</Button>}
              />
            )}

            {pagination.totalPages > 0 && (
              <ResultsPagination
                className='mt-6'
                page={pagination.page}
                pageCount={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemLabel='applications'
                disabled={isFetching}
                onPageChange={onPageChange}
              />
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};
