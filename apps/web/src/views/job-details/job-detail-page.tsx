import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import type { IProfileFile } from '@/types/profile';
import { useSubmitApplicationMutation } from '@/services/application/application.api';
import { useAuthSession } from '@/services/auth';
import { useLazyGetProfileQuery } from '@/services/profile/profile.api';
import { JobApplicationDialog } from './components/job-application-dialog';
import type { ISubmitApplicationRequest } from '@/types/application';

interface IApplicationDialogContext {
  jobId: string;
  userId: string;
  savedResume?: IProfileFile;
}

export const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, status, user } = useAuthSession();
  const applicationRequestIdRef = useRef(0);
  const [loadProfile, { isFetching: isLoadingApplicationProfile }] = useLazyGetProfileQuery();

  const [submitApplication, { isLoading: isSubmittingApplication }] =
    useSubmitApplicationMutation();

  const [applicationContext, setApplicationContext] = useState<IApplicationDialogContext | null>(
    null
  );

  const {
    currentData: response,
    error,
    isError,
    isFetching,
    refetch
  } = useGetPublicJobDetailsQuery(id && status !== 'checking' ? id : skipToken);

  const job = response?.data.job;

  const isLoadingJobDetails = useMemo(
    () => Boolean(id) && (status === 'checking' || isFetching),
    [id, status, isFetching]
  );

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

  useEffect(() => {
    setApplicationContext(null);

    return () => {
      applicationRequestIdRef.current += 1;
    };
  }, [id, user?.id]);

  const onRetry = useCallback(() => {
    if (id && status !== 'checking') {
      void refetch();
    }
  }, [id, status, refetch]);

  const onApply = useCallback(async () => {
    if (
      !job ||
      status === 'checking' ||
      isLoadingApplicationProfile ||
      isSubmittingApplication ||
      applicationContext
    ) {
      return;
    }

    if (!isAuthenticated || !user) {
      toast.info('Sign in as a candidate to apply.');
      navigate(paths.auth.login);
      return;
    }

    if (user.role !== 'USER') {
      toast.info('Only candidate accounts can apply for jobs.');
      return;
    }

    const requestId = ++applicationRequestIdRef.current;

    try {
      const profileResponse = await loadProfile(user.id, false).unwrap();

      if (requestId !== applicationRequestIdRef.current) {
        return;
      }

      const profile = profileResponse.data.profile;

      if (profile.id !== user.id) {
        toast.error('Your session changed. Please try again.');
        return;
      }

      setApplicationContext({
        jobId: job.id,
        userId: user.id,
        savedResume: profile.profileFiles.find((file) => file.kind === 'RESUME')
      });
    } catch (error) {
      if (requestId !== applicationRequestIdRef.current) {
        return;
      }

      toast.error(
        getApiErrorMessage(error, 'Unable to load your resume. Click Apply to try again.')
      );
    }
  }, [
    applicationContext,
    isAuthenticated,
    isLoadingApplicationProfile,
    isSubmittingApplication,
    job,
    loadProfile,
    navigate,
    status,
    user
  ]);

  const onCloseApplication = useCallback(() => {
    applicationRequestIdRef.current += 1;
    setApplicationContext(null);
  }, []);

  const onSubmitApplication = useCallback(
    async (request: ISubmitApplicationRequest) => {
      if (
        !isAuthenticated ||
        user?.role !== 'USER' ||
        !applicationContext ||
        applicationContext.userId !== user.id ||
        applicationContext.jobId !== id ||
        request.jobId !== applicationContext.jobId
      ) {
        throw {
          data: {
            message: 'Your session or selected job changed. Reopen the application.'
          }
        };
      }

      const requestId = applicationRequestIdRef.current;
      const response = await submitApplication(request).unwrap();

      if (requestId === applicationRequestIdRef.current) {
        toast.success(response.message);
      }
    },
    [applicationContext, id, isAuthenticated, submitApplication, user]
  );

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

      <div aria-busy={isLoadingJobDetails}>
        {isLoadingJobDetails && (
          <p role='status' className='mb-4 text-sm text-muted-foreground'>
            Loading job details…
          </p>
        )}

        {!job && isLoadingJobDetails && <LoadingState />}

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
      {isLoadingApplicationProfile && (
        <p role='status' className='mt-4 text-sm text-muted-foreground'>
          Preparing your application…
        </p>
      )}

      {job &&
        isAuthenticated &&
        user?.role === 'USER' &&
        applicationContext &&
        applicationContext.jobId === job.id &&
        applicationContext.userId === user.id && (
          <JobApplicationDialog
            key={`${applicationContext.userId}:${applicationContext.jobId}`}
            jobId={applicationContext.jobId}
            jobTitle={job.title}
            savedResume={applicationContext.savedResume}
            onClose={onCloseApplication}
            onSubmit={onSubmitApplication}
          />
        )}
    </div>
  );
};
