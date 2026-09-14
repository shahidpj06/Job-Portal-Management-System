import { useCallback, useEffect, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query';
import { toast } from 'sonner';

import { ErrorState, LoadingState } from '@/components/common';
import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/services/api';
import { useGetPublicJobDetailsQuery } from '@/services/job';
import { paths } from '@/utils/paths';

import { JobDetailsContent } from './components/job-details-content';
import { JobDetailsHeader } from './components/job-details-header';
import { JobDetailsOverview } from './components/job-details-overview';
import { CompanyDetailsCard } from './components/company-details-card';

export const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    currentData: response,
    error,
    isError,
    isFetching,
    refetch
  } = useGetPublicJobDetailsQuery(id || skipToken);

  const job = response?.data.job;

  const isNotFound = useMemo(() => {
    return !id || (error !== undefined && 'status' in error && error.status === 404);
  }, [id, error]);

  const errorDescription = useMemo(() => {
    if (isNotFound) {
      return 'This job is unavailable. It may have been removed or is no longer published.';
    }

    return getApiErrorMessage(error, 'Unable to load this job. Please try again.');
  }, [error, isNotFound]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  const onRetry = useCallback(() => {
    if (id) {
      void refetch();
    }
  }, [id, refetch]);

  const onApply = useCallback(() => {
    toast.info('Application submission is not available yet.');
  }, []);

  const onShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Job link copied.');
    } catch {
      toast.error('Unable to copy the link. You can copy it from your address bar.');
    }
  }, []);

  return (
    <div className='mx-auto max-w-[1200px] px-4 py-8 md:px-8'>
      <Button variant='ghost' size='sm' className='mb-4 -ml-2' asChild>
        <Link to={paths.jobs}>
          <ArrowLeft aria-hidden='true' className='mr-1.5 size-4' />
          Back to Jobs
        </Link>
      </Button>

      <div aria-busy={isFetching}>
        {isFetching && (
          <p role='status' className='mb-4 text-sm text-muted-foreground'>
            Loading job details…
          </p>
        )}

        {!job && isFetching && <LoadingState />}

        {(isNotFound || isError) && (
          <ErrorState
            title={isNotFound ? 'Job not found' : 'Unable to load job'}
            description={errorDescription}
            onRetry={isNotFound ? undefined : onRetry}
          />
        )}

        {!isNotFound && !isError && job && (
          <div className='grid items-start gap-6 lg:grid-cols-3'>
            <div className='min-w-0 space-y-6 lg:col-span-2'>
              <JobDetailsHeader job={job} onApply={onApply} onShare={onShare} />

              <JobDetailsContent job={job} />
            </div>

            <aside aria-label='Job and company information' className='min-w-0 space-y-4'>
              <JobDetailsOverview job={job} />

              <CompanyDetailsCard company={job.company} />

              <Button className='w-full' onClick={onApply}>
                Apply for This Job
              </Button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};
