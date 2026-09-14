import { useCallback, useEffect, useMemo } from 'react';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { EmptyState, ErrorState, LoadingState, PageHeader } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useListAdminCompaniesQuery } from '@/services/company';
import { getApiErrorMessage } from '@/services/api';
import {
  useCreateAdminJobMutation,
  useGetAdminJobQuery,
  useUpdateAdminJobMutation
} from '@/services/job';
import type {
  EmploymentType,
  ExperienceLevel,
  ICreateJobRequest,
  JobCategoryCode,
  JobStatus,
  WorkMode
} from '@/types';
import {
  formatEmploymentType,
  formatExperience,
  formatJobStatus,
  formatWorkMode
} from '@/utils/formatters';
import { PATHS } from '@/utils/paths';

const EMPLOYMENT_TYPES: EmploymentType[] = [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'FREELANCE',
  'INTERNSHIP'
];

const WORK_MODES: WorkMode[] = ['REMOTE', 'HYBRID', 'ON_SITE'];

const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  'ENTRY_LEVEL',
  'MID_LEVEL',
  'SENIOR_LEVEL',
  'DIRECTOR',
  'EXECUTIVE'
];

const JOB_STATUSES: JobStatus[] = ['PUBLISHED', 'DRAFT', 'CLOSED'];

const CATEGORY_OPTIONS: Array<{
  label: string;
  value: JobCategoryCode;
}> = [
  { label: 'Engineering', value: 'ENGINEERING' },
  { label: 'Design', value: 'DESIGN' },
  { label: 'Product', value: 'PRODUCT' },
  { label: 'Marketing', value: 'MARKETING' },
  { label: 'Sales', value: 'SALES' },
  { label: 'Operations', value: 'OPERATIONS' }
];

const EMPLOYMENT_TYPE_OPTIONS = EMPLOYMENT_TYPES.map((value) => ({
  label: formatEmploymentType(value),
  value
}));

const WORK_MODE_OPTIONS = WORK_MODES.map((value) => ({
  label: formatWorkMode(value),
  value
}));

const EXPERIENCE_LEVEL_OPTIONS = EXPERIENCE_LEVELS.map((value) => ({
  label: formatExperience(value),
  value
}));

const JOB_STATUS_OPTIONS = JOB_STATUSES.map((value) => ({
  label: formatJobStatus(value),
  value
}));

const jobFormSchema = z
  .object({
    category: z.enum(['DESIGN', 'ENGINEERING', 'MARKETING', 'OPERATIONS', 'PRODUCT', 'SALES']),
    companyId: z.string().trim().min(1, 'Company is required.'),
    currency: z.string().trim().length(3, 'Use a three-letter currency code.'),
    description: z.string().trim().min(20, 'Description must contain at least 20 characters.'),
    employmentType: z.enum(['CONTRACT', 'FREELANCE', 'FULL_TIME', 'INTERNSHIP', 'PART_TIME']),
    experienceLevel: z.enum(['DIRECTOR', 'ENTRY_LEVEL', 'EXECUTIVE', 'MID_LEVEL', 'SENIOR_LEVEL']),
    location: z.string().trim().min(2, 'Location is required.'),
    salaryMax: z.number().int().nonnegative('Maximum salary cannot be negative.'),
    salaryMin: z.number().int().nonnegative('Minimum salary cannot be negative.'),
    status: z.enum(['CLOSED', 'DRAFT', 'PUBLISHED']),
    summary: z.string().trim().min(20, 'Summary must contain at least 20 characters.'),
    title: z.string().trim().min(3, 'Title must contain at least 3 characters.'),
    workMode: z.enum(['HYBRID', 'ON_SITE', 'REMOTE'])
  })
  .superRefine((data, context) => {
    if (data.salaryMax < data.salaryMin) {
      context.addIssue({
        code: 'custom',
        message: 'Maximum salary cannot be lower than minimum salary.',
        path: ['salaryMax']
      });
    }
  });

type IJobFormData = z.infer<typeof jobFormSchema>;

const DEFAULT_VALUES: IJobFormData = {
  category: 'ENGINEERING',
  companyId: '',
  currency: 'USD',
  description: '',
  employmentType: 'FULL_TIME',
  experienceLevel: 'MID_LEVEL',
  location: '',
  salaryMax: 120000,
  salaryMin: 80000,
  status: 'DRAFT',
  summary: '',
  title: '',
  workMode: 'HYBRID'
};

export function AdminJobFormPage() {
  const { id: jobId } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(jobId);

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
  } = useGetAdminJobQuery(jobId ?? '', {
    skip: !isEdit
  });

  const [createAdminJob, { isLoading: isCreating }] = useCreateAdminJobMutation();

  const [updateAdminJob, { isLoading: isUpdating }] = useUpdateAdminJobMutation();

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue
  } = useForm<IJobFormData>({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(jobFormSchema)
  });

  const selectedCategory = useWatch({
    control,
    name: 'category'
  });

  const selectedCompanyId = useWatch({
    control,
    name: 'companyId'
  });

  const selectedEmploymentType = useWatch({
    control,
    name: 'employmentType'
  });

  const selectedExperienceLevel = useWatch({
    control,
    name: 'experienceLevel'
  });

  const selectedStatus = useWatch({
    control,
    name: 'status'
  });

  const selectedWorkMode = useWatch({
    control,
    name: 'workMode'
  });

  const companies = companiesResponse?.data.items ?? [];
  const existingJob = jobResponse?.data.job;
  const isSaving = isCreating || isUpdating || isSubmitting;

  const companySelectItems = useMemo(
    () =>
      companies.map((company) => ({
        label: company.name,
        value: company.id
      })),
    [companies]
  );

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

  const onSubmit = useCallback<SubmitHandler<IJobFormData>>(
    async (formData) => {
      const request: ICreateJobRequest = {
        ...formData,
        currency: formData.currency.toUpperCase()
      };

      try {
        if (isEdit && jobId) {
          await updateAdminJob({
            data: request,
            jobId
          }).unwrap();

          toast.success('Job listing updated successfully.');
        } else {
          await createAdminJob(request).unwrap();

          toast.success('Job listing created successfully.');
        }

        navigate(PATHS.ADMIN.JOBS);
      } catch (error) {
        toast.error(
          getApiErrorMessage(
            error,
            isEdit ? 'Unable to update the job listing.' : 'Unable to create the job listing.'
          )
        );
      }
    },
    [createAdminJob, isEdit, jobId, navigate, updateAdminJob]
  );

  if (isCompaniesLoading || (isEdit && isJobLoading)) {
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
          onRetry={() => {
            void refetchCompanies();
          }}
          title='Could not load companies'
        />
      </div>
    );
  }

  if (isEdit && isJobError) {
    return (
      <div className='p-4 md:p-6'>
        <ErrorState
          description={getApiErrorMessage(jobError, 'Unable to load the job listing.')}
          onRetry={() => {
            void refetchJob();
          }}
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
        <Link to={PATHS.ADMIN.JOBS}>
          <ArrowLeft className='mr-1.5 h-4 w-4' />
          Back to Jobs
        </Link>
      </Button>

      <PageHeader
        description={
          isEdit
            ? `Editing: ${existingJob?.title ?? 'job listing'}`
            : 'Fill in the details to create a new listing.'
        }
        title={isEdit ? 'Edit Job' : 'Post New Job'}
      />

      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-6 lg:grid-cols-3'>
          <div className='space-y-5 lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Basic Information</CardTitle>
              </CardHeader>

              <CardContent className='space-y-4'>
                <div className='space-y-1.5'>
                  <Label htmlFor='job-title'>Job title *</Label>
                  <Input
                    id='job-title'
                    placeholder='e.g. Senior Frontend Developer'
                    {...register('title')}
                  />
                  {errors.title && (
                    <p className='text-xs text-destructive'>{errors.title.message}</p>
                  )}
                </div>

                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='space-y-1.5'>
                    <Label htmlFor='job-company'>Company *</Label>

                    <Select
                      items={companySelectItems}
                      onValueChange={(value) =>
                        setValue('companyId', value, {
                          shouldValidate: true
                        })
                      }
                      value={selectedCompanyId}
                    >
                      <SelectTrigger id='job-company' className='w-full'>
                        <SelectValue placeholder='Select company' />
                      </SelectTrigger>

                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {errors.companyId && (
                      <p className='text-xs text-destructive'>{errors.companyId.message}</p>
                    )}
                  </div>

                  <div className='space-y-1.5'>
                    <Label htmlFor='job-location'>Location *</Label>
                    <Input
                      id='job-location'
                      placeholder='Remote / City, Country'
                      {...register('location')}
                    />
                    {errors.location && (
                      <p className='text-xs text-destructive'>{errors.location.message}</p>
                    )}
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='job-summary'>Summary *</Label>
                  <Textarea
                    id='job-summary'
                    placeholder='Provide a concise overview of the role.'
                    rows={3}
                    {...register('summary')}
                  />
                  {errors.summary && (
                    <p className='text-xs text-destructive'>{errors.summary.message}</p>
                  )}
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='job-description'>Full description *</Label>
                  <Textarea
                    id='job-description'
                    placeholder='Describe the responsibilities and expectations.'
                    rows={7}
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className='text-xs text-destructive'>{errors.description.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Salary Range</CardTitle>
              </CardHeader>

              <CardContent>
                <div className='grid gap-4 sm:grid-cols-3'>
                  <div className='space-y-1.5'>
                    <Label htmlFor='salary-currency'>Currency</Label>
                    <Input
                      id='salary-currency'
                      maxLength={3}
                      placeholder='INR'
                      {...register('currency')}
                    />
                    {errors.currency && (
                      <p className='text-xs text-destructive'>{errors.currency.message}</p>
                    )}
                  </div>

                  <div className='space-y-1.5'>
                    <Label htmlFor='salary-min'>Minimum</Label>
                    <Input
                      id='salary-min'
                      min={0}
                      step={1000}
                      type='number'
                      {...register('salaryMin', {
                        valueAsNumber: true
                      })}
                    />
                    {errors.salaryMin && (
                      <p className='text-xs text-destructive'>{errors.salaryMin.message}</p>
                    )}
                  </div>

                  <div className='space-y-1.5'>
                    <Label htmlFor='salary-max'>Maximum</Label>
                    <Input
                      id='salary-max'
                      min={0}
                      step={1000}
                      type='number'
                      {...register('salaryMax', {
                        valueAsNumber: true
                      })}
                    />
                    {errors.salaryMax && (
                      <p className='text-xs text-destructive'>{errors.salaryMax.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-5'>
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Job Details</CardTitle>
              </CardHeader>

              <CardContent className='space-y-4'>
                <div className='space-y-1.5'>
                  <Label htmlFor='job-category'>Category *</Label>
                  <Select
                    items={CATEGORY_OPTIONS}
                    onValueChange={(value) =>
                      setValue('category', value as JobCategoryCode, { shouldValidate: true })
                    }
                    value={selectedCategory}
                  >
                    <SelectTrigger className='w-full' id='job-category'>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='employment-type'>Employment type</Label>
                  <Select
                    onValueChange={(value) => setValue('employmentType', value as EmploymentType)}
                    value={selectedEmploymentType}
                  >
                    <SelectTrigger className='w-full' id='employment-type'>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {EMPLOYMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {formatEmploymentType(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='work-mode'>Work mode</Label>
                  <Select
                    onValueChange={(value) => setValue('workMode', value as WorkMode)}
                    value={selectedWorkMode}
                  >
                    <SelectTrigger className='w-full' id='work-mode'>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {WORK_MODES.map((mode) => (
                        <SelectItem key={mode} value={mode}>
                          {formatWorkMode(mode)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='experience-level'>Experience level</Label>
                  <Select
                    onValueChange={(value) => setValue('experienceLevel', value as ExperienceLevel)}
                    value={selectedExperienceLevel}
                  >
                    <SelectTrigger className='w-full' id='experience-level'>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {EXPERIENCE_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {formatExperience(level)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='job-status'>Status</Label>
                  <Select
                    onValueChange={(value) => setValue('status', value as JobStatus)}
                    value={selectedStatus}
                  >
                    <SelectTrigger className='w-full' id='job-status'>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {JOB_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Button className='w-full' disabled={isSaving} type='submit'>
              {isSaving ? 'Saving…' : isEdit ? 'Save Changes' : 'Post Job'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
