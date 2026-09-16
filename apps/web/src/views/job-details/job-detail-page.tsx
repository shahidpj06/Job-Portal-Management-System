import { skipToken } from '@reduxjs/toolkit/query';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { ErrorState, LoadingState } from '@/components/common';
import { Button } from '@/components/ui/button';
import { useSubmitApplicationMutation } from '@/services/application/application.api';
import { getApiErrorMessage } from '@/services/api';
import { useAuthSession } from '@/services/auth';
import { useGetPublicJobDetailsQuery } from '@/services/job';
import { useLazyGetProfileQuery } from '@/services/profile/profile.api';
import type { ISubmitApplicationRequest } from '@/types/application';
import type { IProfileFile } from '@/types/profile';
import { paths } from '@/utils/paths';

import { CompanyDetailsCard } from './components/company-details-card';
import { JobApplicationDialog } from './components/job-application-dialog';
import { JobDetailsContent } from './components/job-details-content';
import { JobDetailsHeader } from './components/job-details-header';
import { JobDetailsOverview } from './components/job-details-overview';

const CANDIDATE_ROLE = 'USER';
const RESUME_FILE_KIND = 'RESUME';

interface ApplicationDialogContext {
  jobId: string;
  savedResume?: IProfileFile;
  userId: string;
}

export const JobDetailPage = () => {
  const navigate = useNavigate();
  const { id: jobId } = useParams<{ id: string }>();
  const { isAuthenticated, status, user } = useAuthSession();
  const applicationRequestIdentifierReference = useRef(0);
  const [loadProfile, { isFetching: isLoadingApplicationProfile }] = useLazyGetProfileQuery();

  const [applicationContext, setApplicationContext] = useState<ApplicationDialogContext | null>(
    null
  );

  const [submitApplication, { isLoading: isSubmittingApplication }] =
    useSubmitApplicationMutation();

  const {
    currentData: publicJobDetailsResponse,
    error,
    isError,
    isFetching,
    refetch
  } = useGetPublicJobDetailsQuery(jobId && status !== 'checking' ? jobId : skipToken);

  const job = publicJobDetailsResponse?.data.job;
  const isLoadingJobDetails = Boolean(jobId) && (status === 'checking' || isFetching);

  const isJobNotFound =
    !jobId || (error !== undefined && 'status' in error && error.status === 404);

  const errorDescription = isJobNotFound
    ? 'This job is unavailable. It may have been removed or is no longer published.'
    : getApiErrorMessage(error, 'Unable to load this job. Please try again.');

  useEffect(() => {
    window.scrollTo({
      behavior: 'instant',
      top: 0
    });
  }, [jobId]);

  useEffect(() => {
    setApplicationContext(null);

    return () => {
      applicationRequestIdentifierReference.current += 1;
    };
  }, [jobId, user?.id]);

  const handleApplicationClose = () => {
    applicationRequestIdentifierReference.current += 1;
    setApplicationContext(null);
  };

  const handleApply = async () => {
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

    if (user.role !== CANDIDATE_ROLE) {
      toast.info('Only candidate accounts can apply for jobs.');
      return;
    }

    const applicationRequestIdentifier = ++applicationRequestIdentifierReference.current;

    try {
      const profileResponse = await loadProfile(user.id, false).unwrap();

      if (applicationRequestIdentifier !== applicationRequestIdentifierReference.current) {
        return;
      }

      const profile = profileResponse.data.profile;

      if (profile.id !== user.id) {
        toast.error('Your session changed. Please try again.');
        return;
      }

      const savedResume = profile.profileFiles.find(
        (profileFile) => profileFile.kind === RESUME_FILE_KIND
      );

      setApplicationContext({
        jobId: job.id,
        savedResume,
        userId: user.id
      });
    } catch (error) {
      if (applicationRequestIdentifier !== applicationRequestIdentifierReference.current) {
        return;
      }

      toast.error(
        getApiErrorMessage(error, 'Unable to load your resume. Click Apply to try again.')
      );
    }
  };

  const handleApplicationSubmit = async (applicationRequest: ISubmitApplicationRequest) => {
    if (
      !isAuthenticated ||
      user?.role !== CANDIDATE_ROLE ||
      !applicationContext ||
      applicationContext.userId !== user.id ||
      applicationContext.jobId !== jobId ||
      applicationRequest.jobId !== applicationContext.jobId
    ) {
      throw {
        data: {
          message: 'Your session or selected job changed. Reopen the application.'
        }
      };
    }

    const applicationRequestIdentifier = applicationRequestIdentifierReference.current;
    const applicationResponse = await submitApplication(applicationRequest).unwrap();

    if (applicationRequestIdentifier === applicationRequestIdentifierReference.current) {
      toast.success(applicationResponse.message);
    }
  };

  const handleRetry = () => {
    if (jobId && status !== 'checking') {
      void refetch();
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      toast.success('Job link copied.');
    } catch {
      toast.error('Unable to copy the link. You can copy it from your address bar.');
    }
  };

  return (
    <div className='mx-auto max-w-[1200px] px-4 py-8 md:px-8'>
      <Button asChild className='mb-4 -ml-2' size='sm' variant='ghost'>
        <Link to={paths.jobs}>
          <ArrowLeft aria-hidden='true' className='mr-1.5 size-4' />
          Back to Jobs
        </Link>
      </Button>

      <div aria-busy={isLoadingJobDetails}>
        {isLoadingJobDetails && (
          <p className='mb-4 text-sm text-muted-foreground' role='status'>
            Loading job details…
          </p>
        )}

        {!job && isLoadingJobDetails && <LoadingState />}

        {(isJobNotFound || isError) && (
          <ErrorState
            description={errorDescription}
            onRetry={isJobNotFound ? undefined : handleRetry}
            title={isJobNotFound ? 'Job not found' : 'Unable to load job'}
          />
        )}

        {!isJobNotFound && !isError && job && (
          <div className='grid items-start gap-6 lg:grid-cols-3'>
            <div className='min-w-0 space-y-6 lg:col-span-2'>
              <JobDetailsHeader job={job} onApply={handleApply} onShare={handleShare} />

              <JobDetailsContent job={job} />
            </div>

            <aside aria-label='Job and company information' className='min-w-0 space-y-4'>
              <JobDetailsOverview job={job} />

              <CompanyDetailsCard company={job.company} />

              <Button className='w-full' onClick={handleApply}>
                Apply for This Job
              </Button>
            </aside>
          </div>
        )}
      </div>

      {isLoadingApplicationProfile && (
        <p className='mt-4 text-sm text-muted-foreground' role='status'>
          Preparing your application…
        </p>
      )}

      {job &&
        isAuthenticated &&
        user?.role === CANDIDATE_ROLE &&
        applicationContext &&
        applicationContext.jobId === job.id &&
        applicationContext.userId === user.id && (
          <JobApplicationDialog
            key={`${applicationContext.userId}:${applicationContext.jobId}`}
            jobId={applicationContext.jobId}
            jobTitle={job.title}
            onClose={handleApplicationClose}
            onSubmit={handleApplicationSubmit}
            savedResume={applicationContext.savedResume}
          />
        )}
    </div>
  );
};
