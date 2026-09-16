import type { JobsActiveFilter } from '@/views/jobs/components/jobs-active-filters';
import {
  readPublicJobsQuery,
  CATEGORY_OPTIONS,
  DATE_POSTED_OPTIONS,
  WORK_MODE_OPTIONS,
  EMPLOYMENT_OPTIONS,
  EXPERIENCE_OPTIONS,
  SORT_OPTIONS
} from '@/views/jobs/components/jobs-query';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const DEFAULT_CURRENCY = 'USD';
const DEFAULT_SORT = 'newest';
const HIGHEST_SALARY_SORT = 'highest_salary';
const REMOTE_LOCATION = 'remote';
const REMOTE_WORK_MODE = 'REMOTE';

export const useJobsQuery = () => {
  const [searchParameters, setSearchParameters] = useSearchParams();

  const query = useMemo(() => {
    return readPublicJobsQuery(searchParameters);
  }, [searchParameters]);

  const isSalaryScopeEnabled = query.minSalary !== undefined || query.sort === HIGHEST_SALARY_SORT;

  const queryArguments = {
    ...query,
    currency: isSalaryScopeEnabled ? query.currency : undefined
  };

  const activeFilters = useMemo(() => {
    const filters: JobsActiveFilter[] = [];

    if (query.search) {
      filters.push({
        field: 'q',
        id: 'search',
        label: query.search
      });
    }

    if (query.location) {
      filters.push({
        field: 'location',
        id: 'location',
        label: query.location
      });
    }

    const singleFilters = [
      {
        field: 'category',
        options: CATEGORY_OPTIONS,
        value: query.category
      },
      {
        field: 'datePosted',
        options: DATE_POSTED_OPTIONS,
        value: query.datePosted
      },
      {
        field: 'workMode',
        options: WORK_MODE_OPTIONS,
        value: query.workMode
      }
    ];

    singleFilters.forEach((filter) => {
      const selectedOption = filter.options.find((option) => option.value === filter.value);

      if (selectedOption) {
        filters.push({
          field: filter.field,
          id: filter.field,
          label: selectedOption.label
        });
      }
    });

    EMPLOYMENT_OPTIONS.forEach((option) => {
      if (query.employmentType?.includes(option.value)) {
        filters.push({
          field: 'employmentType',
          id: `employment-${option.value}`,
          label: option.label,
          value: option.value
        });
      }
    });

    EXPERIENCE_OPTIONS.forEach((option) => {
      if (query.experienceLevel?.includes(option.value)) {
        filters.push({
          field: 'experienceLevel',
          id: `experience-${option.value}`,
          label: option.label,
          value: option.value
        });
      }
    });

    if (query.minSalary !== undefined) {
      filters.push({
        field: 'minSalary',
        id: 'salary',
        label: `Salary target: ${query.minSalary.toLocaleString()}+`
      });
    }

    if (isSalaryScopeEnabled) {
      filters.push({
        field: 'salaryCurrency',
        id: 'salary-currency',
        label: `Currency: ${query.currency ?? DEFAULT_CURRENCY}`
      });
    }

    return filters;
  }, [isSalaryScopeEnabled, query]);

  const sortLabel = useMemo(() => {
    const selectedSort = SORT_OPTIONS.find((option) => option.value === query.sort);

    if (query.sort === HIGHEST_SALARY_SORT) {
      return `${selectedSort?.label} (${query.currency ?? DEFAULT_CURRENCY})`;
    }

    return selectedSort?.label;
  }, [query.currency, query.sort]);

  const updateSearchParameters = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParameters((currentSearchParameters) => {
        const nextSearchParameters = new URLSearchParams(currentSearchParameters);

        Object.entries(updates).forEach(([key, value]) => {
          if (value === null || value === '' || value === 'all') {
            nextSearchParameters.delete(key);
            return;
          }

          nextSearchParameters.set(key, value);
        });

        if (!Object.prototype.hasOwnProperty.call(updates, 'page')) {
          nextSearchParameters.delete('page');
        }

        if (Object.prototype.hasOwnProperty.call(updates, 'experienceLevel')) {
          nextSearchParameters.delete('seniority');
        }

        return nextSearchParameters;
      });
    },
    [setSearchParameters]
  );

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      updateSearchParameters({
        [key]: value
      });
    },
    [updateSearchParameters]
  );

  const handleFilterToggle = useCallback(
    (key: 'employmentType' | 'experienceLevel', value: string) => {
      const selectedValues = new Set<string>(query[key] ?? []);

      if (selectedValues.has(value)) {
        selectedValues.delete(value);
      } else {
        selectedValues.add(value);
      }

      updateSearchParameters({
        [key]: [...selectedValues].join(',')
      });
    },
    [query, updateSearchParameters]
  );

  const handleFilterRemove = useCallback(
    (filter: JobsActiveFilter) => {
      if (
        (filter.field === 'employmentType' || filter.field === 'experienceLevel') &&
        filter.value
      ) {
        handleFilterToggle(filter.field, filter.value);
        return;
      }

      if (filter.field === 'salaryCurrency') {
        updateSearchParameters({
          currency: null,
          minSalary: null,
          sort: DEFAULT_SORT
        });
        return;
      }

      updateSearchParameters({
        [filter.field]: null
      });
    },
    [handleFilterToggle, updateSearchParameters]
  );

  const handleFiltersReset = useCallback(() => {
    setSearchParameters(new URLSearchParams());
  }, [setSearchParameters]);

  const handleSearch = useCallback(
    (keyword: string, location: string) => {
      const normalizedLocation = location.trim();
      const isRemoteSearch = normalizedLocation.toLowerCase() === REMOTE_LOCATION;

      updateSearchParameters({
        location: isRemoteSearch ? null : normalizedLocation.slice(0, 100),
        q: keyword.trim().slice(0, 100),
        ...(isRemoteSearch
          ? {
              workMode: REMOTE_WORK_MODE
            }
          : {})
      });
    },
    [updateSearchParameters]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      updateSearchParameters({
        sort: value
      });
    },
    [updateSearchParameters]
  );

  return {
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
  };
};
