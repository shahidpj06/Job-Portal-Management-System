import { X } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { EmptyState, ErrorState, LoadingState } from '@/components/common';
import { ResultsPagination } from '@/components/pagination/pagination';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { getApiErrorMessage } from '@/services/api';
import { useListPublicJobsQuery } from '@/services/job';
import { paths } from '@/utils/paths';

import { JobCard } from './components/job-card';
import { JobsActiveFilters } from './components/jobs-active-filters';
import { JobsFilters } from './components/jobs-filters';
import { SORT_OPTIONS } from './components/jobs-query';
import { JobsSearchHeader } from './components/jobs-search-header';
import { useJobsQuery } from './hooks/use-jobs-query';

const DEFAULT_PAGE = 1;
const DEFAULT_SORT = 'newest';

export const JobsPage = () => {
  const navigate = useNavigate();

  const [areFiltersOpen, setAreFiltersOpen] = useState(false);
  const [searchResetKey, setSearchResetKey] = useState(0);

  const filterPanelId = useId();
  const resultsHeadingReference = useRef<HTMLHeadingElement>(null);
  const sortId = useId();

  const {
    activeFilters,
    handleFilterChange,
    handleFilterRemove,
    handleFiltersReset,
    handleFilterToggle,
    handleSearch,
    handleSortChange,
    query,
    queryArguments,
    sortLabel,
    updateSearchParameters
  } = useJobsQuery();

  const {
    currentData: publicJobsResponse,
    error,
    isError,
    isFetching,
    refetch
  } = useListPublicJobsQuery(queryArguments);

  const currentPage = query.page ?? DEFAULT_PAGE;
  const jobs = publicJobsResponse?.data.items;
  const pagination = publicJobsResponse?.data.pagination;

  const handleFiltersToggle = () => {
    setAreFiltersOpen((areCurrentlyOpen) => !areCurrentlyOpen);
  };

  const handleJobsApply = (jobId: string) => {
    navigate(paths['job-details'](jobId));

    window.scrollTo({
      behavior: 'instant',
      top: 0
    });
  };

  const handlePageChange = (page: number) => {
    updateSearchParameters({
      page: String(page)
    });

    resultsHeadingReference.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleRetry = () => {
    void refetch();
  };

  const handleReset = () => {
    handleFiltersReset();
    setSearchResetKey((currentKey) => currentKey + 1);
  };

  const handleFirstPage = () => {
    handlePageChange(DEFAULT_PAGE);
  };

  return (
    <div className='min-h-screen bg-primary/[0.025]'>
      <JobsSearchHeader
        key={JSON.stringify([query.search, query.location, searchResetKey])}
        activeFilterCount={activeFilters.length}
        filterPanelId={filterPanelId}
        filtersOpen={areFiltersOpen}
        initialLocation={query.location ?? ''}
        initialQuery={query.search ?? ''}
        onSearch={handleSearch}
        onToggleFilters={handleFiltersToggle}
      />

      <section className='mx-auto max-w-[1200px] px-4 py-8 md:px-8'>
        <div className='grid grid-cols-1 items-start gap-5 md:grid-cols-[240px_minmax(0,1fr)] md:gap-6'>
          <div className='order-1 flex flex-wrap items-center justify-between gap-3 md:order-none md:col-span-2 md:row-start-1'>
            <h2
              ref={resultsHeadingReference}
              className='scroll-mt-24 text-sm font-semibold md:text-base'
            >
              {pagination
                ? `Showing ${pagination.totalItems.toLocaleString()} open jobs`
                : 'Find open jobs'}
            </h2>

            <div className='flex items-center gap-2'>
              <label className='hidden text-xs text-muted-foreground md:block' htmlFor={sortId}>
                Sort by:
              </label>

              <Select onValueChange={handleSortChange} value={query.sort ?? DEFAULT_SORT}>
                <SelectTrigger
                  aria-label='Sort jobs'
                  className='h-9 min-w-36 rounded-lg border-0 bg-surface text-xs shadow-sm'
                  id={sortId}
                >
                  <SelectValue>{sortLabel}</SelectValue>
                </SelectTrigger>

                <SelectContent align='end'>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <aside
            aria-label='Job filters'
            className='order-3 hidden min-w-0 md:order-none md:col-start-1 md:row-start-2 md:block'
          >
            <JobsFilters
              onChange={handleFilterChange}
              onReset={handleReset}
              onToggle={handleFilterToggle}
              query={query}
            />
          </aside>

          {areFiltersOpen && (
            <div className='fixed inset-0 z-50 md:hidden'>
              <div
                aria-hidden='true'
                className='absolute inset-0 bg-black/40'
                onClick={handleFiltersToggle}
              />

              <div
                aria-label='Job filters'
                aria-modal='true'
                className='absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-surface p-4 shadow-xl'
                id={filterPanelId}
                role='dialog'
              >
                <div className='mb-3 flex items-center justify-between'>
                  <h3 className='text-sm font-semibold'>Filters</h3>

                  <button
                    aria-label='Close filters'
                    className='rounded-full p-1 text-muted-foreground hover:bg-muted'
                    onClick={handleFiltersToggle}
                    type='button'
                  >
                    <X className='h-5 w-5' />
                  </button>
                </div>

                <JobsFilters
                  onChange={handleFilterChange}
                  onReset={handleReset}
                  onToggle={handleFilterToggle}
                  query={query}
                />

                <Button className='mt-4 w-full' onClick={handleFiltersToggle}>
                  Show results
                </Button>
              </div>
            </div>
          )}

          <div className='order-2 min-w-0 space-y-4 md:order-none md:col-start-2 md:row-start-2'>
            <JobsActiveFilters
              filters={activeFilters}
              onRemove={handleFilterRemove}
              onReset={handleReset}
            />

            <div aria-busy={isFetching} className='space-y-4'>
              {isFetching && (
                <p className='text-xs text-muted-foreground' role='status'>
                  Updating job results…
                </p>
              )}

              {!publicJobsResponse && isFetching && <LoadingState />}

              {isError && (
                <ErrorState
                  description={getApiErrorMessage(
                    error,
                    'Please try again. Your selected filters have been kept.'
                  )}
                  onRetry={handleRetry}
                  title='Unable to load jobs'
                />
              )}

              {!isError && jobs?.length === 0 && (
                <EmptyState
                  action={
                    <Button
                      onClick={currentPage > DEFAULT_PAGE ? handleFirstPage : handleReset}
                      variant='outline'
                    >
                      {currentPage > DEFAULT_PAGE ? 'First page' : 'Clear filters'}
                    </Button>
                  }
                  description={
                    currentPage > DEFAULT_PAGE
                      ? 'The results may have changed. Return to the first page.'
                      : 'Try another search or clear your filters.'
                  }
                  title={currentPage > DEFAULT_PAGE ? 'No jobs on this page' : 'No matching jobs'}
                />
              )}

              {!isError &&
                jobs?.map((job) => <JobCard key={job.id} job={job} onApply={handleJobsApply} />)}

              {!isError &&
                pagination &&
                pagination.totalPages > 0 &&
                pagination.page <= pagination.totalPages && (
                  <ResultsPagination
                    disabled={isFetching}
                    itemLabel='roles'
                    onPageChange={handlePageChange}
                    page={pagination.page}
                    pageCount={pagination.totalPages}
                    totalItems={pagination.totalItems}
                  />
                )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
