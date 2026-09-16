import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useMemo, useState, type MouseEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { EmptyState, ErrorState, LoadingState, PageHeader } from '@/components/common';
import { ResultsPagination } from '@/components/pagination/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getApiErrorMessage } from '@/services/api/get-api-error-message';
import {
  useGetAdminApplicationDetailsQuery,
  useListAdminApplicationsQuery,
  useUpdateApplicationStatusMutation
} from '@/services/application/application.api';
import { useAuthSession } from '@/services/auth';
import type { ApplicationStatus, IApplicationDetailsArguments } from '@/types/application';
import { paths } from '@/utils/paths';

import { ApplicationDetailsDialog } from './components/application-details-dialog';
import { ApplicationsTable } from './components/applications-table';

const ADMIN_ROLE = 'ADMIN';
const DEFAULT_PAGE = 1;
const PAGE_SIZE = 10;
const RESUME_LINK_EXPIRY_BUFFER_MILLISECONDS = 5_000;

export const AdminApplicationsPage = () => {
  const { isAuthenticated, user } = useAuthSession();
  const [searchParameters, setSearchParameters] = useSearchParams();
  const [resumeMessage, setResumeMessage] = useState('');
  const [selectedApplication, setSelectedApplication] =
    useState<IApplicationDetailsArguments | null>(null);

  const [updateApplicationStatus, { isLoading: isUpdatingStatus }] =
    useUpdateApplicationStatusMutation();

  const jobId = searchParameters.get('jobId') || undefined;
  const viewerId = isAuthenticated && user?.role === ADMIN_ROLE ? user.id : undefined;

  const page = useMemo(() => {
    const pageValue = Number(searchParameters.get('page') ?? DEFAULT_PAGE);

    if (!Number.isSafeInteger(pageValue) || pageValue <= 0) {
      return DEFAULT_PAGE;
    }

    return pageValue;
  }, [searchParameters]);

  const listArguments = useMemo(
    () =>
      viewerId
        ? {
            jobId,
            limit: PAGE_SIZE,
            page,
            viewerId
          }
        : skipToken,
    [jobId, page, viewerId]
  );

  const {
    currentData: applicationsResponse,
    error: applicationsError,
    isError: isApplicationsError,
    isFetching: isFetchingApplications,
    refetch: refetchApplications
  } = useListAdminApplicationsQuery(listArguments);

  const detailsArguments = useMemo(
    () =>
      viewerId && selectedApplication?.viewerId === viewerId ? selectedApplication : skipToken,
    [selectedApplication, viewerId]
  );

  const {
    currentData: applicationDetailsResponse,
    error: applicationDetailsError,
    isError: isApplicationDetailsError,
    isFetching: isFetchingApplicationDetails,
    refetch: refetchApplicationDetails
  } = useGetAdminApplicationDetailsQuery(detailsArguments, {
    refetchOnMountOrArgChange: true
  });

  const applications = applicationsResponse?.data.items ?? [];
  const pagination = applicationsResponse?.data.pagination;
  const application = applicationDetailsResponse?.data.application;
  const isApplicationDetailsOpen = detailsArguments !== skipToken;

  const applicationsErrorMessage = useMemo(
    () => (isApplicationsError ? getApiErrorMessage(applicationsError) : undefined),
    [applicationsError, isApplicationsError]
  );

  const applicationDetailsErrorMessage = useMemo(
    () => (isApplicationDetailsError ? getApiErrorMessage(applicationDetailsError) : undefined),
    [applicationDetailsError, isApplicationDetailsError]
  );

  const description = useMemo(() => {
    if (!pagination) {
      return 'Review candidate applications.';
    }

    return `${pagination.totalItems.toLocaleString()} applications${
      jobId ? ' for the selected job' : ''
    }`;
  }, [jobId, pagination]);

  const handleApplicationDetailsClose = useCallback(() => {
    setSelectedApplication(null);
    setResumeMessage('');
  }, []);

  const handleApplicationDetailsRetry = useCallback(() => {
    if (isApplicationDetailsOpen) {
      void refetchApplicationDetails();
    }
  }, [isApplicationDetailsOpen, refetchApplicationDetails]);

  const handleApplicationsRetry = useCallback(() => {
    if (viewerId) {
      void refetchApplications();
    }
  }, [refetchApplications, viewerId]);

  const handleClearJobFilter = useCallback(() => {
    setSearchParameters((currentSearchParameters) => {
      const nextSearchParameters = new URLSearchParams(currentSearchParameters);
      nextSearchParameters.delete('jobId');
      nextSearchParameters.delete('page');

      return nextSearchParameters;
    });
  }, [setSearchParameters]);

  const handleFilterJob = useCallback(
    (nextJobId: string) => {
      setSearchParameters((currentSearchParameters) => {
        const nextSearchParameters = new URLSearchParams(currentSearchParameters);
        nextSearchParameters.set('jobId', nextJobId);
        nextSearchParameters.delete('page');

        return nextSearchParameters;
      });
    },
    [setSearchParameters]
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setSearchParameters((currentSearchParameters) => {
        const nextSearchParameters = new URLSearchParams(currentSearchParameters);
        nextSearchParameters.set('page', String(nextPage));

        return nextSearchParameters;
      });
    },
    [setSearchParameters]
  );

  const handleFirstPage = useCallback(() => {
    handlePageChange(DEFAULT_PAGE);
  }, [handlePageChange]);

  const handleResumeClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      const resume = application?.resume;

      if (!resume || !isApplicationDetailsOpen) {
        event.preventDefault();
        return;
      }

      const resumeExpiryTime = Date.parse(resume.expiresAt);

      const hasValidResumeLink =
        Number.isFinite(resumeExpiryTime) &&
        resumeExpiryTime > Date.now() + RESUME_LINK_EXPIRY_BUFFER_MILLISECONDS;

      if (hasValidResumeLink) {
        return;
      }

      event.preventDefault();

      setResumeMessage('Refreshing the résumé link…');

      void refetchApplicationDetails().then((result) => {
        if (result.error) {
          setResumeMessage('Could not refresh the link. Please try again.');
          return;
        }

        setResumeMessage('Link refreshed. Click Download résumé again.');
      });
    },
    [application?.resume, isApplicationDetailsOpen, refetchApplicationDetails]
  );

  const handleViewApplication = useCallback(
    (applicationId: string) => {
      if (!viewerId) {
        return;
      }

      setResumeMessage('');

      setSelectedApplication({
        applicationId,
        viewerId
      });
    },
    [viewerId]
  );

  const handleUpdateStatus = useCallback(
    (applicationId: string, status: ApplicationStatus) => {
      void updateApplicationStatus({ applicationId, status })
        .unwrap()
        .then(() => {
          toast.success('Application status updated successfully.');
        })
        .catch((error: unknown) => {
          toast.error(getApiErrorMessage(error));
        });
    },
    [updateApplicationStatus]
  );

  return (
    <div className='space-y-5 p-4 md:p-6'>
      <PageHeader description={description} title='Applications' />

      <Card>
        <CardContent className='space-y-4 p-4'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <p className='text-sm text-muted-foreground'>
              {jobId
                ? 'Showing applications for one job.'
                : 'Click a job title to filter its applications.'}
            </p>

            <div className='flex flex-wrap gap-2'>
              <Button asChild size='sm' variant='outline'>
                <Link to={paths.admin.jobs}>Choose a job</Link>
              </Button>

              {jobId && (
                <Button onClick={handleClearJobFilter} size='sm' type='button' variant='ghost'>
                  Clear job filter
                </Button>
              )}
            </div>
          </div>

          {!viewerId || isFetchingApplications ? (
            <LoadingState />
          ) : applicationsErrorMessage ? (
            <ErrorState description={applicationsErrorMessage} onRetry={handleApplicationsRetry} />
          ) : applications.length > 0 ? (
            <>
              <ApplicationsTable
                applications={applications}
                onFilterJob={handleFilterJob}
                onView={handleViewApplication}
              />

              {pagination && (
                <ResultsPagination
                  itemLabel='applications'
                  onPageChange={handlePageChange}
                  page={pagination.page}
                  pageCount={pagination.totalPages}
                  totalItems={pagination.totalItems}
                />
              )}
            </>
          ) : (
            <EmptyState
              action={
                page > DEFAULT_PAGE ? (
                  <Button onClick={handleFirstPage} type='button' variant='outline'>
                    Go to first page
                  </Button>
                ) : undefined
              }
              description={
                jobId
                  ? 'There are no applications to display for this job on this page.'
                  : 'Submitted applications will appear here.'
              }
              title={
                pagination?.totalItems ? 'No applications on this page' : 'No applications yet'
              }
            />
          )}
        </CardContent>
      </Card>

      <ApplicationDetailsDialog
        application={isApplicationDetailsOpen ? application : undefined}
        errorMessage={applicationDetailsErrorMessage}
        isLoading={isFetchingApplicationDetails}
        isUpdatingStatus={isUpdatingStatus}
        onClose={handleApplicationDetailsClose}
        onResumeClick={handleResumeClick}
        onRetry={handleApplicationDetailsRetry}
        onUpdateStatus={handleUpdateStatus}
        open={isApplicationDetailsOpen}
        resumeMessage={resumeMessage}
      />
    </div>
  );
};
