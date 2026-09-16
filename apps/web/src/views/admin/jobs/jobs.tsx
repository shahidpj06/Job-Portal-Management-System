import { Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { EmptyState, ErrorState, LoadingState, PageHeader } from '@/components/common';
import { ResultsPagination } from '@/components/pagination/pagination';
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

const DEFAULT_PAGE = 1;
const JOBS_PER_PAGE = 10;

export const AdminJobsPage = () => {
  const [category, setCategory] = useState<AdminJobCategoryFilter>(ALL_JOB_FILTER_VALUE);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [searchInput, setSearchInput] = useState('');
  const [deleteJob] = useDeleteJobMutation();
  const [experienceLevel, setExperienceLevel] =
    useState<AdminJobExperienceFilter>(ALL_JOB_FILTER_VALUE);


  const debouncedSearch = useDebouncedValue(searchInput.trim());

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

  const hasActiveFilters =
    Boolean(debouncedSearch) ||
    category !== ALL_JOB_FILTER_VALUE ||
    experienceLevel !== ALL_JOB_FILTER_VALUE;

  const errorMessage = useMemo(
    () => getApiErrorMessage(error, 'Unable to load job listings.'),
    [error]
  );

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value as AdminJobCategoryFilter);
    setPage(DEFAULT_PAGE);
  }, []);

  const handleDelete = useCallback(
    async (jobId: string) => {
      setDeletingJobId(jobId);

      try {
        await deleteJob(jobId).unwrap();

        toast.success('Job listing deleted successfully.');

        if (jobs.length === 1 && page > DEFAULT_PAGE) {
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

  const handleExperienceChange = useCallback((value: string) => {
    setExperienceLevel(value as AdminJobExperienceFilter);
    setPage(DEFAULT_PAGE);
  }, []);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    setPage(DEFAULT_PAGE);
  }, []);

  return (
    <div className='space-y-5 p-4 md:p-6'>
      <PageHeader
        actions={
          <Button asChild>
            <Link to={paths.admin['new-job']}>
              <Plus aria-hidden='true' className='mr-1.5 size-4' />
              Post New Job
            </Link>
          </Button>
        }
        description={`${pagination?.totalItems ?? 0} jobs total`}
        title='Job Listings'
      />

      <Card>
        <CardContent className='p-4'>
          <AdminJobsFilters
            category={category}
            experienceLevel={experienceLevel}
            onCategoryChange={handleCategoryChange}
            onExperienceChange={handleExperienceChange}
            onSearchChange={handleSearchChange}
            search={searchInput}
          />

          {isLoading && <LoadingState />}

          {isError && !jobsResponse && (
            <ErrorState
              description={errorMessage}
              onRetry={handleRetry}
              title='Could not load jobs'
            />
          )}

          {!isLoading && !isError && jobs.length === 0 && (
            <EmptyState
              action={
                !hasActiveFilters ? (
                  <Button asChild>
                    <Link to={paths.admin['new-job']}>Post New Job</Link>
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
              aria-busy={isFetching}
              className={
                isFetching
                  ? 'pointer-events-none opacity-60 transition-opacity'
                  : 'transition-opacity'
              }
            >
              <AdminJobsTable deletingJobId={deletingJobId} jobs={jobs} onDelete={handleDelete} />

              {pagination && (
                <ResultsPagination
                  className='mt-4'
                  disabled={isFetching}
                  itemLabel='jobs'
                  onPageChange={handlePageChange}
                  page={pagination.page}
                  pageCount={pagination.totalPages}
                  totalItems={pagination.totalItems}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
