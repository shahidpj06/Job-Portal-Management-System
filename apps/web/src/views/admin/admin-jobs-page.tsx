import { useCallback, useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { EmptyState, ErrorState, LoadingState, PageHeader } from '@/components/common';
import { JobListPagination } from '@/components/jobs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useDebouncedValue } from '@/hooks';
import { getApiErrorMessage } from '@/services/api';
import { useDeleteAdminJobMutation, useListAdminJobsQuery } from '@/services/job';
import type { ExperienceLevel, IJobListQuery, JobCategoryCode, JobStatus } from '@/types';
import { formatEmploymentType, formatExperience, formatRelativeDate } from '@/utils/formatters';
import { PATHS } from '@/utils/paths';

import { AdminJobActions } from './components/admin-job-actions';

const JOBS_PER_PAGE = 10;
const ALL_FILTER_VALUE = 'ALL';

const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  CLOSED: 'border-border bg-muted text-muted-foreground',
  DRAFT: 'border-yellow-200 bg-yellow-50 text-yellow-700',
  PUBLISHED: 'border-emerald-200 bg-emerald-50 text-emerald-700'
};

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

const EXPERIENCE_OPTIONS: ExperienceLevel[] = [
  'ENTRY_LEVEL',
  'MID_LEVEL',
  'SENIOR_LEVEL',
  'DIRECTOR',
  'EXECUTIVE'
];

export function AdminJobsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState<JobCategoryCode | typeof ALL_FILTER_VALUE>(
    ALL_FILTER_VALUE
  );
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | typeof ALL_FILTER_VALUE>(
    ALL_FILTER_VALUE
  );
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(searchInput.trim());

  const queryArguments = useMemo<IJobListQuery>(
    () => ({
      category: category === ALL_FILTER_VALUE ? undefined : category,
      experienceLevel: experienceLevel === ALL_FILTER_VALUE ? undefined : experienceLevel,
      limit: JOBS_PER_PAGE,
      page,
      search: debouncedSearch || undefined
    }),
    [category, debouncedSearch, experienceLevel, page]
  );

  const {
    data: jobsResponse,
    error,
    isError,
    isFetching,
    isLoading,
    refetch
  } = useListAdminJobsQuery(queryArguments);

  const [deleteAdminJob] = useDeleteAdminJobMutation();

  const jobs = jobsResponse?.data.items ?? [];
  const pagination = jobsResponse?.data.pagination;

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value as JobCategoryCode | typeof ALL_FILTER_VALUE);
    setPage(1);
  }, []);

  const handleExperienceChange = useCallback((value: string) => {
    setExperienceLevel(value as ExperienceLevel | typeof ALL_FILTER_VALUE);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const handleDelete = useCallback(
    async (jobId: string) => {
      setDeletingJobId(jobId);

      try {
        await deleteAdminJob(jobId).unwrap();

        toast.success('Job listing deleted successfully.');

        if (jobs.length === 1 && page > 1) {
          setPage((currentPage) => currentPage - 1);
        }
      } catch (deleteError) {
        toast.error(getApiErrorMessage(deleteError, 'Unable to delete the job listing.'));
      } finally {
        setDeletingJobId(null);
      }
    },
    [deleteAdminJob, jobs.length, page]
  );

  const hasActiveFilters =
    Boolean(debouncedSearch) ||
    category !== ALL_FILTER_VALUE ||
    experienceLevel !== ALL_FILTER_VALUE;

  return (
    <div className='space-y-5 p-4 md:p-6'>
      <PageHeader
        actions={
          <Button asChild>
            <Link to={PATHS.ADMIN.NEW_JOB}>
              <Plus className='mr-1.5 h-4 w-4' />
              Post New Job
            </Link>
          </Button>
        }
        description={`${pagination?.totalItems ?? 0} jobs total`}
        title='Job Listings'
      />

      <Card>
        <CardContent className='p-4'>
          <div className='mb-4 grid gap-3 md:grid-cols-[minmax(220px,1fr)_200px_200px]'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />

              <Input
                className='pl-9'
                id='admin-job-search'
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder='Search by job or company…'
                value={searchInput}
              />
            </div>

            <Select onValueChange={handleCategoryChange} value={category}>
              <SelectTrigger aria-label='Filter by category'>
                <SelectValue placeholder='All categories' />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>All categories</SelectItem>

                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={handleExperienceChange} value={experienceLevel}>
              <SelectTrigger aria-label='Filter by experience level'>
                <SelectValue placeholder='All experience levels' />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>All experience levels</SelectItem>

                {EXPERIENCE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {formatExperience(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading && <LoadingState />}

          {isError && !jobsResponse && (
            <ErrorState
              description={getApiErrorMessage(error, 'Unable to load job listings.')}
              onRetry={() => {
                void refetch();
              }}
              title='Could not load jobs'
            />
          )}

          {!isLoading && !isError && jobs.length === 0 && (
            <EmptyState
              action={
                !hasActiveFilters ? (
                  <Button asChild>
                    <Link to={PATHS.ADMIN.NEW_JOB}>Post New Job</Link>
                  </Button>
                ) : undefined
              }
              description={
                hasActiveFilters
                  ? 'Try changing or clearing the current filters.'
                  : 'Create your first job listing to get started.'
              }
              title={hasActiveFilters ? 'No jobs match your filters' : 'No job listings yet'}
            />
          )}

          {jobs.length > 0 && (
            <div
              className={
                isFetching
                  ? 'pointer-events-none opacity-60 transition-opacity'
                  : 'transition-opacity'
              }
            >
              <div className='hidden overflow-x-auto rounded-lg border border-border md:block'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className='font-medium'>{job.title}</TableCell>

                        <TableCell className='text-muted-foreground'>{job.company.name}</TableCell>

                        <TableCell className='text-muted-foreground'>
                          {formatEmploymentType(job.employmentType)}
                        </TableCell>

                        <TableCell>
                          <Badge className={`border text-xs ${JOB_STATUS_COLORS[job.status]}`}>
                            {job.status}
                          </Badge>
                        </TableCell>

                        <TableCell className='text-muted-foreground'>
                          {job.applicationCount}
                        </TableCell>

                        <TableCell className='text-muted-foreground'>
                          {formatRelativeDate(job.createdAt)}
                        </TableCell>

                        <TableCell className='text-right'>
                          <AdminJobActions
                            isDeleting={deletingJobId === job.id}
                            job={job}
                            onDelete={handleDelete}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className='space-y-3 md:hidden'>
                {jobs.map((job) => (
                  <div className='rounded-lg border border-border p-4' key={job.id}>
                    <div className='flex items-start justify-between gap-2'>
                      <div>
                        <p className='font-medium'>{job.title}</p>
                        <p className='text-sm text-muted-foreground'>{job.company.name}</p>
                      </div>

                      <Badge className={`border text-xs ${JOB_STATUS_COLORS[job.status]}`}>
                        {job.status}
                      </Badge>
                    </div>

                    <div className='mt-3 flex items-center justify-between gap-2'>
                      <span className='text-xs text-muted-foreground'>
                        {job.applicationCount} applicants · {formatRelativeDate(job.createdAt)}
                      </span>

                      <AdminJobActions
                        isDeleting={deletingJobId === job.id}
                        job={job}
                        onDelete={handleDelete}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {pagination && (
                <JobListPagination
                  onPageChange={handlePageChange}
                  page={pagination.page}
                  pageCount={pagination.totalPages}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
