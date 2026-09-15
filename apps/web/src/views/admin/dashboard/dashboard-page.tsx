import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

import { LoadingState } from '@/components/common';
import { ApplicationStatusBadge } from '@/components/jobs/application-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getApiErrorMessage } from '@/services/api/get-api-error-message';
import { useListAdminApplicationsQuery } from '@/services/application/application.api';
import { useAuthSession } from '@/services/auth';
import { useGetDashboardSummaryQuery } from '@/services/dashboard/dashboard.api';
import { useListJobsQuery } from '@/services/job/job.api';
import { formatRelativeDate } from '@/utils/formatters';
import { paths } from '@/utils/paths';
import { AdminJobStatusBadge } from '../jobs/components/job-status-badge';
import { DashboardSummary } from './components/dashboard-summary';
import { DashboardListSection } from './components/dashboard-list-section';

const RECENT_LIST_QUERY = {
  page: 1,
  limit: 5
};

export const AdminDashboardPage = () => {
  const { user, isAuthenticated } = useAuthSession();

  const viewerId = isAuthenticated && user?.role === 'ADMIN' ? user.id : undefined;

  const applicationArguments = useMemo(
    () => (viewerId ? { viewerId, ...RECENT_LIST_QUERY } : skipToken),
    [viewerId]
  );

  const {
    currentData: summaryResponse,
    isFetching: isFetchingSummary,
    isError: isSummaryError,
    error: summaryError,
    refetch: refetchSummary
  } = useGetDashboardSummaryQuery(viewerId ?? skipToken, {
    refetchOnMountOrArgChange: true
  });

  const {
    currentData: jobsResponse,
    isFetching: isFetchingJobs,
    isError: isJobsError,
    error: jobsError,
    refetch: refetchJobs
  } = useListJobsQuery(viewerId ? RECENT_LIST_QUERY : skipToken, {
    refetchOnMountOrArgChange: true
  });

  const {
    currentData: applicationsResponse,
    isFetching: isFetchingApplications,
    isError: isApplicationsError,
    error: applicationsError,
    refetch: refetchApplications
  } = useListAdminApplicationsQuery(applicationArguments, {
    refetchOnMountOrArgChange: true
  });

  const onRetrySummary = useCallback(() => {
    if (viewerId) {
      void refetchSummary();
    }
  }, [viewerId, refetchSummary]);

  const onRetryJobs = useCallback(() => {
    if (viewerId) {
      void refetchJobs();
    }
  }, [viewerId, refetchJobs]);

  const onRetryApplications = useCallback(() => {
    if (viewerId) {
      void refetchApplications();
    }
  }, [viewerId, refetchApplications]);

  const recentJobItems = useMemo(
    () =>
      (jobsResponse?.data.items ?? []).map((job) => (
        <Link
          key={job.id}
          to={paths.admin['edit-job'](job.id)}
          className='flex items-center justify-between gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        >
          <div className='min-w-0'>
            <p className='truncate text-sm font-medium'>{job.title}</p>
            <p className='text-xs text-muted-foreground'>
              {job.company.name} · {formatRelativeDate(job.createdAt)}
            </p>
          </div>

          <span className='shrink-0'>
            <AdminJobStatusBadge status={job.status} />
          </span>
        </Link>
      )),
    [jobsResponse]
  );

  const recentApplicationItems = useMemo(
    () =>
      (applicationsResponse?.data.items ?? []).map((application) => (
        <Link
          key={application.id}
          to={`${paths.admin.applications}?jobId=${encodeURIComponent(application.job.id)}`}
          className='flex items-center justify-between gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        >
          <div className='min-w-0'>
            <p className='truncate text-sm font-medium'>
              {application.user.firstName} {application.user.lastName}
            </p>

            <p className='text-xs text-muted-foreground'>
              {application.job.title} · {formatRelativeDate(application.createdAt)}
            </p>
          </div>

          <span className='shrink-0'>
            <ApplicationStatusBadge status={application.status} />
          </span>
        </Link>
      )),
    [applicationsResponse]
  );

  if (!viewerId) {
    return <LoadingState />;
  }

  return (
    <div className='space-y-6 p-4 md:p-6'>
      <DashboardSummary
        summary={summaryResponse?.data}
        isLoading={isFetchingSummary}
        errorMessage={isSummaryError ? getApiErrorMessage(summaryError) : undefined}
        onRetry={onRetrySummary}
      />

      <div className='grid gap-6 lg:grid-cols-2'>
        <DashboardListSection
          title='Recent Jobs'
          viewAllPath={paths.admin.jobs}
          isLoading={isFetchingJobs}
          isEmpty={recentJobItems.length === 0}
          emptyMessage='No jobs yet'
          errorMessage={isJobsError ? getApiErrorMessage(jobsError) : undefined}
          onRetry={onRetryJobs}
        >
          {recentJobItems}
        </DashboardListSection>

        <DashboardListSection
          title='Recent Applications'
          viewAllPath={paths.admin.applications}
          isLoading={isFetchingApplications}
          isEmpty={recentApplicationItems.length === 0}
          emptyMessage='No applications yet'
          errorMessage={isApplicationsError ? getApiErrorMessage(applicationsError) : undefined}
          onRetry={onRetryApplications}
        >
          {recentApplicationItems}
        </DashboardListSection>
      </div>

      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>Quick Actions</CardTitle>
        </CardHeader>

        <CardContent className='flex flex-wrap gap-3 pt-0'>
          <Button asChild>
            <Link to={paths.admin['new-job']}>
              <Plus aria-hidden='true' className='mr-1.5 h-4 w-4' />
              Post New Job
            </Link>
          </Button>

          <Button asChild variant='outline'>
            <Link to={paths.admin.jobs}>Manage Jobs</Link>
          </Button>

          <Button asChild variant='outline'>
            <Link to={paths.admin.applications}>View Applications</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
