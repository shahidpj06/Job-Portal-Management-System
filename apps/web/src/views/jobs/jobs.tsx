import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
import { JobsActiveFilters, type JobsActiveFilter } from './components/jobs-active-filters';
import { JobsFilters } from './components/jobs-filters';
import {
  CATEGORY_OPTIONS,
  DATE_POSTED_OPTIONS,
  EMPLOYMENT_OPTIONS,
  EXPERIENCE_OPTIONS,
  SORT_OPTIONS,
  WORK_MODE_OPTIONS,
  readPublicJobsQuery
} from './components/jobs-query';
import { JobsSearchHeader } from './components/jobs-search-header';

export const JobsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchResetKey, setSearchResetKey] = useState(0);

  const filterPanelId = useId();
  const sortId = useId();
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  const query = useMemo(() => {
    return readPublicJobsQuery(searchParams);
  }, [searchParams]);

  const salaryScopeEnabled = useMemo(() => {
    return query.minSalary !== undefined || query.sort === 'highest_salary';
  }, [query.minSalary, query.sort]);

  const queryArguments = useMemo(() => {
    return {
      ...query,
      currency: salaryScopeEnabled ? query.currency : undefined
    };
  }, [query, salaryScopeEnabled]);

  const {
    currentData: jobsResponse,
    error,
    isError,
    isFetching,
    refetch
  } = useListPublicJobsQuery(queryArguments);

  const jobs = jobsResponse?.data.items;
  const pagination = jobsResponse?.data.pagination;
  const currentPage = query.page ?? 1;

  const activeFilters = useMemo(() => {
    const filters: JobsActiveFilter[] = [];

    if (query.search) {
      filters.push({
        id: 'search',
        field: 'q',
        label: query.search
      });
    }

    if (query.location) {
      filters.push({
        id: 'location',
        field: 'location',
        label: query.location
      });
    }

    const singleFilters = [
      {
        field: 'category',
        value: query.category,
        options: CATEGORY_OPTIONS
      },
      {
        field: 'workMode',
        value: query.workMode,
        options: WORK_MODE_OPTIONS
      },
      {
        field: 'datePosted',
        value: query.datePosted,
        options: DATE_POSTED_OPTIONS
      }
    ];

    singleFilters.forEach((filter) => {
      const option = filter.options.find((item) => item.value === filter.value);

      if (option) {
        filters.push({
          id: filter.field,
          field: filter.field,
          label: option.label
        });
      }
    });

    EMPLOYMENT_OPTIONS.forEach((option) => {
      if (query.employmentType?.includes(option.value)) {
        filters.push({
          id: `employment-${option.value}`,
          field: 'employmentType',
          value: option.value,
          label: option.label
        });
      }
    });

    EXPERIENCE_OPTIONS.forEach((option) => {
      if (query.experienceLevel?.includes(option.value)) {
        filters.push({
          id: `experience-${option.value}`,
          field: 'experienceLevel',
          value: option.value,
          label: option.label
        });
      }
    });

    if (query.minSalary !== undefined) {
      filters.push({
        id: 'salary',
        field: 'minSalary',
        label: `Salary target: ${query.minSalary.toLocaleString()}+`
      });
    }

    if (salaryScopeEnabled) {
      filters.push({
        id: 'salary-currency',
        field: 'salaryCurrency',
        label: `Currency: ${query.currency ?? 'USD'}`
      });
    }

    return filters;
  }, [query, salaryScopeEnabled]);

  const sortLabel = useMemo(() => {
    const label = SORT_OPTIONS.find((option) => option.value === query.sort)?.label;

    return query.sort === 'highest_salary' ? `${label} (${query.currency ?? 'USD'})` : label;
  }, [query.sort, query.currency]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams((currentParams) => {
        const nextParams = new URLSearchParams(currentParams);

        Object.entries(updates).forEach(([key, value]) => {
          if (value === null || value === '' || value === 'all') {
            nextParams.delete(key);
          } else {
            nextParams.set(key, value);
          }
        });

        if (!Object.prototype.hasOwnProperty.call(updates, 'page')) {
          nextParams.delete('page');
        }

        if (Object.prototype.hasOwnProperty.call(updates, 'experienceLevel')) {
          nextParams.delete('seniority');
        }

        return nextParams;
      });
    },
    [setSearchParams]
  );

  const onSearch = useCallback(
    (keyword: string, location: string) => {
      const normalizedLocation = location.trim();
      const isRemoteSearch = normalizedLocation.toLowerCase() === 'remote';

      updateParams({
        q: keyword.trim().slice(0, 100),
        location: isRemoteSearch ? null : normalizedLocation.slice(0, 100),
        ...(isRemoteSearch ? { workMode: 'REMOTE' } : {})
      });
    },
    [updateParams]
  );

  const onFilterChange = useCallback(
    (key: string, value: string) => {
      updateParams({ [key]: value });
    },
    [updateParams]
  );

  const onToggleFilter = useCallback(
    (key: 'employmentType' | 'experienceLevel', value: string) => {
      const selected = new Set<string>(query[key] ?? []);

      if (selected.has(value)) {
        selected.delete(value);
      } else {
        selected.add(value);
      }

      updateParams({ [key]: [...selected].join(',') });
    },
    [query, updateParams]
  );

  const onRemoveFilter = useCallback(
    (filter: JobsActiveFilter) => {
      if (
        (filter.field === 'employmentType' || filter.field === 'experienceLevel') &&
        filter.value
      ) {
        onToggleFilter(filter.field, filter.value);
        return;
      }

      if (filter.field === 'salaryCurrency') {
        updateParams({
          currency: null,
          minSalary: null,
          sort: 'newest'
        });
        return;
      }

      updateParams({ [filter.field]: null });
    },
    [onToggleFilter, updateParams]
  );

  const onResetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
    setSearchResetKey((value) => value + 1);
  }, [setSearchParams]);

  const onToggleFilters = useCallback(() => {
    setFiltersOpen((value) => !value);
  }, []);

  const onSortChange = useCallback(
    (value: string) => {
      updateParams({ sort: value });
    },
    [updateParams]
  );

  const onPageChange = useCallback(
    (page: number) => {
      updateParams({ page: String(page) });
      resultsHeadingRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    },
    [updateParams]
  );

  const onFirstPage = useCallback(() => {
    onPageChange(1);
  }, [onPageChange]);

  const onRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const onApply = useCallback(
    (jobId: string) => {
      navigate(paths['job-details'](jobId));
      window.scrollTo({ top: 0, behavior: 'instant' });
    },
    [navigate]
  );

  return (
    <div className='min-h-screen bg-primary/[0.025]'>
      <JobsSearchHeader
        key={JSON.stringify([query.search, query.location, searchResetKey])}
        initialQuery={query.search ?? ''}
        initialLocation={query.location ?? ''}
        activeFilterCount={activeFilters.length}
        filtersOpen={filtersOpen}
        filterPanelId={filterPanelId}
        onSearch={onSearch}
        onToggleFilters={onToggleFilters}
      />

      <section className='mx-auto max-w-[1200px] px-4 py-8 md:px-8'>
        <div className='grid grid-cols-1 items-start gap-5 md:grid-cols-[240px_minmax(0,1fr)] md:gap-6'>
          <div className='order-1 flex flex-wrap items-center justify-between gap-3 md:order-none md:col-span-2 md:row-start-1'>
            <h2 ref={resultsHeadingRef} className='scroll-mt-24 text-sm font-semibold md:text-base'>
              {pagination
                ? `Showing ${pagination.totalItems.toLocaleString()} open jobs`
                : 'Find open jobs'}
            </h2>

            <div className='flex items-center gap-2'>
              <label htmlFor={sortId} className='hidden text-xs text-muted-foreground md:block'>
                Sort by:
              </label>

              <Select value={query.sort ?? 'newest'} onValueChange={onSortChange}>
                <SelectTrigger
                  id={sortId}
                  aria-label='Sort jobs'
                  className='h-9 min-w-36 rounded-lg border-0 bg-surface text-xs shadow-sm'
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
              query={query}
              onChange={onFilterChange}
              onToggle={onToggleFilter}
              onReset={onResetFilters}
            />
          </aside>

          {filtersOpen && (
            <div className='fixed inset-0 z-50 md:hidden'>
              <div
                className='absolute inset-0 bg-black/40'
                onClick={onToggleFilters}
                aria-hidden='true'
              />

              <div
                id={filterPanelId}
                role='dialog'
                aria-modal='true'
                aria-label='Job filters'
                className='absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-surface p-4 shadow-xl'
              >
                <div className='mb-3 flex items-center justify-between'>
                  <h3 className='text-sm font-semibold'>Filters</h3>
                  <button
                    type='button'
                    onClick={onToggleFilters}
                    aria-label='Close filters'
                    className='rounded-full p-1 text-muted-foreground hover:bg-muted'
                  >
                    <X className='h-5 w-5' />
                  </button>
                </div>

                <JobsFilters
                  query={query}
                  onChange={onFilterChange}
                  onToggle={onToggleFilter}
                  onReset={onResetFilters}
                />

                <Button className='mt-4 w-full' onClick={onToggleFilters}>
                  Show results
                </Button>
              </div>
            </div>
          )}

          <div className='order-2 min-w-0 space-y-4 md:order-none md:col-start-2 md:row-start-2'>
            <JobsActiveFilters
              filters={activeFilters}
              onRemove={onRemoveFilter}
              onReset={onResetFilters}
            />

            <div className='space-y-4' aria-busy={isFetching}>
              {isFetching && (
                <p role='status' className='text-xs text-muted-foreground'>
                  Updating job results…
                </p>
              )}

              {!jobsResponse && isFetching && <LoadingState />}

              {isError && (
                <ErrorState
                  title='Unable to load jobs'
                  description={getApiErrorMessage(
                    error,
                    'Please try again. Your selected filters have been kept.'
                  )}
                  onRetry={onRetry}
                />
              )}

              {!isError && jobs?.length === 0 && (
                <EmptyState
                  title={currentPage > 1 ? 'No jobs on this page' : 'No matching jobs'}
                  description={
                    currentPage > 1
                      ? 'The results may have changed. Return to the first page.'
                      : 'Try another search or clear your filters.'
                  }
                  action={
                    <Button
                      variant='outline'
                      onClick={currentPage > 1 ? onFirstPage : onResetFilters}
                    >
                      {currentPage > 1 ? 'First page' : 'Clear filters'}
                    </Button>
                  }
                />
              )}

              {!isError && jobs?.map((job) => <JobCard key={job.id} job={job} onApply={onApply} />)}

              {!isError &&
                pagination &&
                pagination.totalPages > 0 &&
                pagination.page <= pagination.totalPages && (
                  <ResultsPagination
                    page={pagination.page}
                    pageCount={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    itemLabel='roles'
                    disabled={isFetching}
                    onPageChange={onPageChange}
                  />
                )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
