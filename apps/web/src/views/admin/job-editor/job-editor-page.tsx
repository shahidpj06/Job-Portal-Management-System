import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { EmptyState, ErrorState, LoadingState, PageHeader } from '@/components/common';
import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/services/api';
import { useListAdminCompaniesQuery } from '@/services/company';
import { useCreateJobMutation, useGetJobDetailsQuery, useUpdateJobMutation } from '@/services/job';
import type { ICreateJobRequest } from '@/types';
import { paths } from '@/utils/paths';

import { JobBasicInformation } from './components/job-basic-information';
import { JobDetails } from './components/job-details';
import { JobSalaryRange } from './components/job-salary-range';
import { JOB_EDITOR_DEFAULT_VALUES, jobEditorSchema, type JobEditorFormData } from '@/schemas/job-editor-schema';


export const AdminJobEditorPage = () => {
  const navigate = useNavigate();
  const { id: jobId } = useParams<{
    id?: string;
  }>();

  const isEditing = Boolean(jobId);

  const {
    data: companiesResponse,
    error: companiesError,
    isError: isCompaniesError,
    isLoading: isCompaniesLoading,
    refetch: refetchCompanies
  } = useListAdminCompaniesQuery();

  const {
    data: jobResponse,
    error: jobError,
    isError: isJobError,
    isLoading: isJobLoading,
    refetch: refetchJob
  } = useGetJobDetailsQuery(jobId ?? '', {
    skip: !isEditing
  });

  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();

  const jobEditorFormMethods = useForm<JobEditorFormData>({
    defaultValues: JOB_EDITOR_DEFAULT_VALUES,
    resolver: zodResolver(jobEditorSchema)
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
    reset
  } = jobEditorFormMethods;

  const companies = companiesResponse?.data.items ?? [];
  const existingJob = jobResponse?.data.job;
  const isSaving = isCreating || isSubmitting || isUpdating;

  const pageDescription = useMemo(
    () =>
      isEditing
        ? `Editing: ${existingJob?.title ?? 'job listing'}`
        : 'Fill in the details to create a new listing.',
    [existingJob?.title, isEditing]
  );

  const pageTitle = useMemo(() => (isEditing ? 'Edit Job' : 'Post New Job'), [isEditing]);

  useEffect(() => {
    if (!existingJob) {
      return;
    }

    reset({
      category: existingJob.category,
      companyId: existingJob.company.id,
      currency: existingJob.currency,
      description: existingJob.description,
      employmentType: existingJob.employmentType,
      experienceLevel: existingJob.experienceLevel,
      location: existingJob.location,
      salaryMax: existingJob.salaryMax ?? 0,
      salaryMin: existingJob.salaryMin ?? 0,
      status: existingJob.status,
      summary: existingJob.summary,
      title: existingJob.title,
      workMode: existingJob.workMode
    });
  }, [existingJob, reset]);

  const handleCompaniesRetry = useCallback(() => {
    void refetchCompanies();
  }, [refetchCompanies]);

  const handleJobRetry = useCallback(() => {
    void refetchJob();
  }, [refetchJob]);

  const handleJobSubmit = useCallback<SubmitHandler<JobEditorFormData>>(
    async (formData) => {
      const createJobRequest: ICreateJobRequest = {
        ...formData,
        currency: formData.currency.toUpperCase()
      };

      try {
        if (isEditing && jobId) {
          await updateJob({
            data: createJobRequest,
            jobId
          }).unwrap();

          toast.success('Job listing updated successfully.');
        } else {
          await createJob(createJobRequest).unwrap();

          toast.success('Job listing created successfully.');
        }

        navigate(paths.admin.jobs);
      } catch (error) {
        toast.error(
          getApiErrorMessage(
            error,
            isEditing ? 'Unable to update the job listing.' : 'Unable to create the job listing.'
          )
        );
      }
    },
    [createJob, isEditing, jobId, navigate, updateJob]
  );

  if (isCompaniesLoading || (isEditing && isJobLoading)) {
    return (
      <div className='p-4 md:p-6'>
        <LoadingState />
      </div>
    );
  }

  if (isCompaniesError) {
    return (
      <div className='p-4 md:p-6'>
        <ErrorState
          description={getApiErrorMessage(companiesError, 'Unable to load companies.')}
          onRetry={handleCompaniesRetry}
          title='Could not load companies'
        />
      </div>
    );
  }

  if (isEditing && isJobError) {
    return (
      <div className='p-4 md:p-6'>
        <ErrorState
          description={getApiErrorMessage(jobError, 'Unable to load the job listing.')}
          onRetry={handleJobRetry}
          title='Could not load job'
        />
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className='p-4 md:p-6'>
        <EmptyState
          description='At least one company is required before a job can be created.'
          title='No companies available'
        />
      </div>
    );
  }

  return (
    <div className='space-y-5 p-4 md:p-6'>
      <Button asChild className='-ml-2' size='sm' variant='ghost'>
        <Link to={paths.admin.jobs}>
          <ArrowLeft aria-hidden='true' className='mr-1.5 size-4' />
          Back to Jobs
        </Link>
      </Button>

      <PageHeader description={pageDescription} title={pageTitle} />

      <FormProvider {...jobEditorFormMethods}>
        <form noValidate onSubmit={handleSubmit(handleJobSubmit)}>
          <div className='grid gap-6 lg:grid-cols-3'>
            <div className='space-y-5 lg:col-span-2'>
              <JobBasicInformation companies={companies} />

              <JobSalaryRange />
            </div>

            <div className='space-y-5'>
              <JobDetails />

              <Button className='w-full' disabled={isSaving} type='submit'>
                {isSaving ? 'Saving…' : isEditing ? 'Save Changes' : 'Post Job'}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
