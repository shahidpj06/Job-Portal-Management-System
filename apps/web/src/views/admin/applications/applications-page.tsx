import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useMemo, useState, type MouseEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { EmptyState, ErrorState, LoadingState, PageHeader } from '@/components/common';
import { ResultsPagination } from '@/components/pagination/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getApiErrorMessage } from '@/services/api/get-api-error-message';
import {
  useGetAdminApplicationDetailsQuery,
  useListAdminApplicationsQuery
} from '@/services/application/application.api';
import { useAuthSession } from '@/services/auth';
import type { IApplicationDetailsArguments } from '@/types/application';
import { paths } from '@/utils/paths';

import { ApplicationDetailsDialog } from './components/application-details-dialog';
import { ApplicationsTable } from './components/applications-table';

const PAGE_SIZE = 10;

export const AdminApplicationsPage = () => {
  const { user, isAuthenticated } = useAuthSession();
  const [searchParams, setSearchParams] = useSearchParams();
  const [resumeMessage, setResumeMessage] = useState('');
  const jobId = searchParams.get('jobId') || undefined;
  const viewerId = isAuthenticated && user?.role === 'ADMIN' ? user.id : undefined;

  const [selectedApplication, setSelectedApplication] =
    useState<IApplicationDetailsArguments | null>(null);

  const page = useMemo(() => {
    const value = Number(searchParams.get('page') ?? '1');

    return Number.isSafeInteger(value) && value > 0 ? value : 1;
  }, [searchParams]);

  const listArguments = useMemo(
    () => (viewerId ? { viewerId, page, limit: PAGE_SIZE, jobId } : skipToken),
    [viewerId, page, jobId]
  );

  const {
    currentData: listResponse,
    isFetching: isFetchingApplications,
    isError: isListError,
    error: listError,
    refetch: refetchApplications
  } = useListAdminApplicationsQuery(listArguments);

  const detailsArguments = useMemo(
    () =>
      viewerId && selectedApplication?.viewerId === viewerId ? selectedApplication : skipToken,
    [viewerId, selectedApplication]
  );

  const {
    currentData: detailsResponse,
    isFetching: isFetchingDetails,
    isError: isDetailsError,
    error: detailsError,
    refetch: refetchDetails
  } = useGetAdminApplicationDetailsQuery(detailsArguments, {
    refetchOnMountOrArgChange: true
  });

  const applications = listResponse?.data.items;
  const pagination = listResponse?.data.pagination;
  const application = detailsResponse?.data.application;
  const isDetailsOpen = detailsArguments !== skipToken;

  const description = useMemo(() => {
    if (!pagination) {
      return 'Review candidate applications.';
    }

    return `${pagination.totalItems.toLocaleString()} applications${
      jobId ? ' for the selected job' : ''
    }`;
  }, [pagination, jobId]);

  const onPageChange = useCallback(
    (nextPage: number) => {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);
        next.set('page', String(nextPage));
        return next;
      });
    },
    [setSearchParams]
  );

  const onFilterJob = useCallback(
    (nextJobId: string) => {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);
        next.set('jobId', nextJobId);
        next.delete('page');
        return next;
      });
    },
    [setSearchParams]
  );

  const onClearJobFilter = useCallback(() => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      next.delete('jobId');
      next.delete('page');
      return next;
    });
  }, [setSearchParams]);

  const onFirstPage = useCallback(() => {
    onPageChange(1);
  }, [onPageChange]);

  const onViewApplication = useCallback(
    (applicationId: string) => {
      if (!viewerId) {
        return;
      }

      setResumeMessage('');
      setSelectedApplication({ viewerId, applicationId });
    },
    [viewerId]
  );

  const onCloseDetails = useCallback(() => {
    setSelectedApplication(null);
    setResumeMessage('');
  }, []);

  const onRetryApplications = useCallback(() => {
    if (viewerId) {
      void refetchApplications();
    }
  }, [viewerId, refetchApplications]);

  const onRetryDetails = useCallback(() => {
    if (isDetailsOpen) {
      void refetchDetails();
    }
  }, [isDetailsOpen, refetchDetails]);

  const onResumeClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      const resume = application?.resume;

      if (!resume || !isDetailsOpen) {
        event.preventDefault();
        return;
      }

      const expiresAt = Date.parse(resume.expiresAt);

      if (Number.isFinite(expiresAt) && expiresAt > Date.now() + 5000) {
        return;
      }

      event.preventDefault();
      setResumeMessage('Refreshing the résumé link…');

      void refetchDetails().then((result) => {
        setResumeMessage(
          result.error
            ? 'Could not refresh the link. Please try again.'
            : 'Link refreshed. Click Download résumé again.'
        );
      });
    },
    [application?.resume, isDetailsOpen, refetchDetails]
  );

  return (
    <div className='space-y-5 p-4 md:p-6'>
      <PageHeader title='Applications' description={description} />

      <Card>
        <CardContent className='space-y-4 p-4'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <p className='text-sm text-muted-foreground'>
              {jobId
                ? 'Showing applications for one job.'
                : 'Click a job title to filter its applications.'}
            </p>

            <div className='flex flex-wrap gap-2'>
              <Button asChild variant='outline' size='sm'>
                <Link to={paths.admin.jobs}>Choose a job</Link>
              </Button>

              {jobId && (
                <Button type='button' variant='ghost' size='sm' onClick={onClearJobFilter}>
                  Clear job filter
                </Button>
              )}
            </div>
          </div>

          {!viewerId || isFetchingApplications ? (
            <LoadingState />
          ) : isListError ? (
            <ErrorState description={getApiErrorMessage(listError)} onRetry={onRetryApplications} />
          ) : applications?.length ? (
            <>
              <ApplicationsTable
                applications={applications}
                onView={onViewApplication}
                onFilterJob={onFilterJob}
              />

              {pagination && (
                <ResultsPagination
                  page={pagination.page}
                  pageCount={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  itemLabel='applications'
                  onPageChange={onPageChange}
                />
              )}
            </>
          ) : (
            <EmptyState
              title={
                pagination?.totalItems ? 'No applications on this page' : 'No applications yet'
              }
              description={
                jobId
                  ? 'There are no applications to display for this job on this page.'
                  : 'Submitted applications will appear here.'
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

      <ApplicationDetailsDialog
        open={isDetailsOpen}
        application={isDetailsOpen ? application : undefined}
        isLoading={isFetchingDetails}
        errorMessage={isDetailsError ? getApiErrorMessage(detailsError) : undefined}
        resumeMessage={resumeMessage}
        onClose={onCloseDetails}
        onRetry={onRetryDetails}
        onResumeClick={onResumeClick}
      />
    </div>
  );
};
