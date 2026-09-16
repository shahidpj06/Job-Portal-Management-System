import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { EmptyState, ErrorState, LoadingState } from '@/components/common';
import { ResultsPagination } from '@/components/pagination/pagination';
import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/services/api';
import { useListCandidateApplicationsQuery } from '@/services/application/application.api';
import { useAuthSession } from '@/services/auth';
import { paths } from '@/utils/paths';

import { ApplicationCard } from './components/application-card';

const APPLICATIONS_PER_PAGE = 10;
const CANDIDATE_ROLE = 'USER';
const DEFAULT_PAGE = 1;

export const ApplicationsPage = () => {
  const { isAuthenticated, user } = useAuthSession();

  const [page, setPage] = useState(DEFAULT_PAGE);

  const queryArguments = useMemo(
    () =>
      isAuthenticated && user?.role === CANDIDATE_ROLE
        ? {
            limit: APPLICATIONS_PER_PAGE,
            page,
            viewerId: user.id
          }
        : skipToken,
    [isAuthenticated, page, user?.id, user?.role]
  );

  const {
    currentData: candidateApplicationsResponse,
    error,
    isError,
    isFetching,
    refetch
  } = useListCandidateApplicationsQuery(queryArguments);

  const applications = candidateApplicationsResponse?.data.items;

  const pagination = candidateApplicationsResponse?.data.pagination;

  const summary = useMemo(() => {
    if (!pagination) {
      return 'Track your submitted applications.';
    }

    const applicationCount = pagination.totalItems;

    return `${applicationCount} application${applicationCount === 1 ? '' : 's'} submitted`;
  }, [pagination]);

  const errorMessage = useMemo(
    () => getApiErrorMessage(error, 'Unable to load your applications.'),
    [error]
  );

  const handleFirstPage = useCallback(() => {
    setPage(DEFAULT_PAGE);
  }, []);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const handleRetry = useCallback(() => {
    if (queryArguments !== skipToken) {
      void refetch();
    }
  }, [queryArguments, refetch]);

  const renderApplications = () => {
    if (!applications || !pagination) {
      return null;
    }

    if (applications.length > 0) {
      return (
        <div className='space-y-4'>
          {applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      );
    }

    if (pagination.totalItems === 0) {
      return (
        <EmptyState
          action={
            <Button asChild>
              <Link to={paths.jobs}>Browse Jobs</Link>
            </Button>
          }
          description='Start applying to jobs and track your progress here.'
          title='No applications yet'
        />
      );
    }

    return (
      <EmptyState
        action={<Button onClick={handleFirstPage}>Go to first page</Button>}
        title='No applications on this page'
      />
    );
  };

  return (
    <div className='mx-auto max-w-[1200px] px-4 py-8 md:px-8'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>My Applications</h1>

        <p className='mt-1 text-muted-foreground'>{summary}</p>
      </div>

      <div aria-busy={isFetching}>
        {isFetching && (
          <p className='mb-4 text-sm text-muted-foreground' role='status'>
            Loading applications…
          </p>
        )}

        {!candidateApplicationsResponse && isFetching && <LoadingState />}

        {isError ? (
          <ErrorState
            description={errorMessage}
            onRetry={handleRetry}
            title='Unable to load applications'
          />
        ) : (
          <>
            {renderApplications()}

            {pagination && pagination.totalPages > 0 && (
              <ResultsPagination
                className='mt-6'
                disabled={isFetching}
                itemLabel='applications'
                onPageChange={handlePageChange}
                page={pagination.page}
                pageCount={pagination.totalPages}
                totalItems={pagination.totalItems}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
