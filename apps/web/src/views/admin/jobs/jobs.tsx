import { useCallback, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { EmptyState, ErrorState, LoadingState, PageHeader } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDebouncedValue } from '@/hooks';
import { getApiErrorMessage } from '@/services/api';
import { useDeleteJobMutation, useListJobsQuery } from '@/services/job';
import type { IJobListQuery } from '@/types';
import { paths } from '@/utils/paths';

import {
  AdminJobsFilters,
  ALL_JOB_FILTER_VALUE,
  type AdminJobCategoryFilter,
  type AdminJobExperienceFilter
} from './components/jobs-filters';
import { AdminJobsTable } from './components/jobs-table';
import { ResultsPagination } from '@/components/pagination/pagination';

const JOBS_PER_PAGE = 10;

export const AdminJobsPage = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [category, setCategory] = useState<AdminJobCategoryFilter>(ALL_JOB_FILTER_VALUE);
  const [deleteJob] = useDeleteJobMutation();
  const debouncedSearch = useDebouncedValue(searchInput.trim());

  const [experienceLevel, setExperienceLevel] =
    useState<AdminJobExperienceFilter>(ALL_JOB_FILTER_VALUE);

  const queryArguments = useMemo<IJobListQuery>(
    () => ({
      category: category === ALL_JOB_FILTER_VALUE ? undefined : category,
      experienceLevel: experienceLevel === ALL_JOB_FILTER_VALUE ? undefined : experienceLevel,
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
  } = useListJobsQuery(queryArguments);

  const jobs = jobsResponse?.data.items ?? [];
  const pagination = jobsResponse?.data.pagination;

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value as AdminJobCategoryFilter);
    setPage(1);
  }, []);

  const handleExperienceChange = useCallback((value: string) => {
    setExperienceLevel(value as AdminJobExperienceFilter);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleDelete = useCallback(
    async (jobId: string) => {
      setDeletingJobId(jobId);

      try {
        await deleteJob(jobId).unwrap();

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
    [deleteJob, jobs.length, page]
  );

  const hasActiveFilters =
    Boolean(debouncedSearch) ||
    category !== ALL_JOB_FILTER_VALUE ||
    experienceLevel !== ALL_JOB_FILTER_VALUE;

  return (
    <div className='space-y-5 p-4 md:p-6'>
      <PageHeader
        title='Job Listings'
        description={`${pagination?.totalItems ?? 0} jobs total`}
        actions={
          <Button asChild>
            <Link to={paths.admin['new-job']}>
              <Plus aria-hidden='true' className='mr-1.5 h-4 w-4' />
              Post New Job
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className='p-4'>
          <AdminJobsFilters
            category={category}
            experienceLevel={experienceLevel}
            search={searchInput}
            onCategoryChange={handleCategoryChange}
            onExperienceChange={handleExperienceChange}
            onSearchChange={handleSearchChange}
          />

          {isLoading ? <LoadingState /> : null}

          {isError && !jobsResponse ? (
            <ErrorState
              title='Could not load jobs'
              description={getApiErrorMessage(error, 'Unable to load job listings.')}
              onRetry={handleRetry}
            />
          ) : null}

          {!isLoading && !isError && jobs.length === 0 ? (
            <EmptyState
              title={hasActiveFilters ? 'No jobs match your filters' : 'No job listings yet'}
              description={
                hasActiveFilters
                  ? 'Try changing or clearing the current filters.'
                  : 'Create your first job listing to get started.'
              }
              action={
                !hasActiveFilters ? (
                  <Button asChild>
                    <Link to={paths.admin['new-job']}>Post New Job</Link>
                  </Button>
                ) : undefined
              }
            />
          ) : null}

          {jobs.length > 0 ? (
            <div
              className={
                isFetching
                  ? 'pointer-events-none opacity-60 transition-opacity'
                  : 'transition-opacity'
              }
              aria-busy={isFetching}
            >
              <AdminJobsTable deletingJobId={deletingJobId} jobs={jobs} onDelete={handleDelete} />

              {pagination ? (
                <ResultsPagination
                  page={pagination.page}
                  pageCount={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  itemLabel='jobs'
                  disabled={isFetching}
                  onPageChange={handlePageChange}
                  className='mt-4'
                />
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};
