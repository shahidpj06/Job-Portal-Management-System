import { skipToken } from '@reduxjs/toolkit/query';
import { Plus } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { LoadingState } from '@/components/common';
import { ApplicationStatusBadge } from '@/components/jobs/application-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getApiErrorMessage } from '@/services/api/get-api-error-message';
import { useListAdminApplicationsQuery } from '@/services/application/application.api';
import { useAuthSession } from '@/services/auth';
import { useGetDashboardSummaryQuery } from '@/services/dashboard/dashboard.api';
import { useListJobsQuery } from '@/services/job/job.api';
import type { IApplicationListItem, IJobData } from '@/types';
import { formatRelativeDate } from '@/utils/formatters';
import { paths } from '@/utils/paths';

import { AdminJobStatusBadge } from '../jobs/components/job-status-badge';
import { DashboardListSection } from './components/dashboard-list-section';
import { DashboardSummary } from './components/dashboard-summary';

const ADMIN_ROLE = 'ADMIN';

const RECENT_LIST_QUERY = {
  limit: 5,
  page: 1
};

interface RecentApplicationItemProps {
  application: IApplicationListItem;
}

interface RecentJobItemProps {
  job: IJobData;
}

const RecentApplicationItem = ({ application }: RecentApplicationItemProps) => (
  <Link
    className='flex items-center justify-between gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
    to={`${paths.admin.applications}?jobId=${encodeURIComponent(application.job.id)}`}
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
);

const RecentJobItem = ({ job }: RecentJobItemProps) => (
  <Link
    className='flex items-center justify-between gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
    to={paths.admin['edit-job'](job.id)}
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
);

export const AdminDashboardPage = () => {
  const { isAuthenticated, user } = useAuthSession();

  const viewerId = isAuthenticated && user?.role === ADMIN_ROLE ? user.id : undefined;

  const applicationQueryArguments = useMemo(
    () =>
      viewerId
        ? {
            ...RECENT_LIST_QUERY,
            viewerId
          }
        : skipToken,
    [viewerId]
  );

  const {
    currentData: dashboardSummaryResponse,
    error: dashboardSummaryError,
    isError: isDashboardSummaryError,
    isFetching: isFetchingDashboardSummary,
    refetch: refetchDashboardSummary
  } = useGetDashboardSummaryQuery(viewerId ?? skipToken, {
    refetchOnMountOrArgChange: true
  });

  const {
    currentData: jobsResponse,
    error: jobsError,
    isError: isJobsError,
    isFetching: isFetchingJobs,
    refetch: refetchJobs
  } = useListJobsQuery(viewerId ? RECENT_LIST_QUERY : skipToken, {
    refetchOnMountOrArgChange: true
  });

  const {
    currentData: applicationsResponse,
    error: applicationsError,
    isError: isApplicationsError,
    isFetching: isFetchingApplications,
    refetch: refetchApplications
  } = useListAdminApplicationsQuery(applicationQueryArguments, {
    refetchOnMountOrArgChange: true
  });

  const applications = applicationsResponse?.data.items ?? [];
  const jobs = jobsResponse?.data.items ?? [];

  const applicationsErrorMessage = useMemo(
    () => (isApplicationsError ? getApiErrorMessage(applicationsError) : undefined),
    [applicationsError, isApplicationsError]
  );

  const dashboardSummaryErrorMessage = useMemo(
    () => (isDashboardSummaryError ? getApiErrorMessage(dashboardSummaryError) : undefined),
    [dashboardSummaryError, isDashboardSummaryError]
  );

  const jobsErrorMessage = useMemo(
    () => (isJobsError ? getApiErrorMessage(jobsError) : undefined),
    [isJobsError, jobsError]
  );

  const handleApplicationsRetry = useCallback(() => {
    if (viewerId) {
      void refetchApplications();
    }
  }, [refetchApplications, viewerId]);

  const handleDashboardSummaryRetry = useCallback(() => {
    if (viewerId) {
      void refetchDashboardSummary();
    }
  }, [refetchDashboardSummary, viewerId]);

  const handleJobsRetry = useCallback(() => {
    if (viewerId) {
      void refetchJobs();
    }
  }, [refetchJobs, viewerId]);

  if (!viewerId) {
    return <LoadingState />;
  }

  return (
    <div className='space-y-6 p-4 md:p-6'>
      <DashboardSummary
        errorMessage={dashboardSummaryErrorMessage}
        isLoading={isFetchingDashboardSummary}
        onRetry={handleDashboardSummaryRetry}
        summary={dashboardSummaryResponse?.data}
      />

      <div className='grid gap-6 lg:grid-cols-2'>
        <DashboardListSection
          emptyMessage='No jobs yet'
          errorMessage={jobsErrorMessage}
          isEmpty={jobs.length === 0}
          isLoading={isFetchingJobs}
          onRetry={handleJobsRetry}
          title='Recent Jobs'
          viewAllPath={paths.admin.jobs}
        >
          {jobs.map((job) => (
            <RecentJobItem key={job.id} job={job} />
          ))}
        </DashboardListSection>

        <DashboardListSection
          emptyMessage='No applications yet'
          errorMessage={applicationsErrorMessage}
          isEmpty={applications.length === 0}
          isLoading={isFetchingApplications}
          onRetry={handleApplicationsRetry}
          title='Recent Applications'
          viewAllPath={paths.admin.applications}
        >
          {applications.map((application) => (
            <RecentApplicationItem key={application.id} application={application} />
          ))}
        </DashboardListSection>
      </div>

      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>Quick Actions</CardTitle>
        </CardHeader>

        <CardContent className='flex flex-wrap gap-3 pt-0'>
          <Button asChild>
            <Link to={paths.admin['new-job']}>
              <Plus aria-hidden='true' className='mr-1.5 size-4' />
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
