import type {
  EmploymentType,
  ExperienceLevel,
  IPublicJobListQuery,
  JobCategoryCode,
  JobDatePosted,
  JobSort,
  WorkMode
} from '@/types';

const DEFAULT_CURRENCY = 'USD';
const DEFAULT_PAGE = 1;
const DEFAULT_SORT: JobSort = 'newest';
const JOBS_PER_PAGE = 6;
const MAXIMUM_SALARY = 350_000;
const MAXIMUM_SEARCH_LENGTH = 100;

const QUERY_PARAMETER = {
  CATEGORY: 'category',
  CURRENCY: 'currency',
  DATE_POSTED: 'datePosted',
  EMPLOYMENT_TYPE: 'employmentType',
  EXPERIENCE_LEVEL: 'experienceLevel',
  LOCATION: 'location',
  MINIMUM_SALARY: 'minSalary',
  PAGE: 'page',
  SEARCH: 'q',
  SENIORITY: 'seniority',
  SORT: 'sort',
  WORK_MODE: 'workMode'
} as const;

interface FilterOption<Value extends string = string> {
  label: string;
  value: Value;
}

export const CATEGORY_OPTIONS: FilterOption<JobCategoryCode>[] = [
  { label: 'Design', value: 'DESIGN' },
  { label: 'Engineering', value: 'ENGINEERING' },
  { label: 'Marketing', value: 'MARKETING' },
  { label: 'Operations', value: 'OPERATIONS' },
  { label: 'Product', value: 'PRODUCT' },
  { label: 'Sales', value: 'SALES' }
];

export const CURRENCY_OPTIONS: FilterOption[] = [
  { label: 'EUR', value: 'EUR' },
  { label: 'GBP', value: 'GBP' },
  { label: 'INR', value: 'INR' },
  { label: 'USD', value: 'USD' }
];

export const DATE_POSTED_OPTIONS: FilterOption<JobDatePosted>[] = [
  { label: 'Past 24 hours', value: '24h' },
  { label: 'Past month', value: '30d' },
  { label: 'Past week', value: '7d' }
];

export const EMPLOYMENT_OPTIONS: FilterOption<EmploymentType>[] = [
  { label: 'Contract', value: 'CONTRACT' },
  { label: 'Freelance', value: 'FREELANCE' },
  { label: 'Full-time', value: 'FULL_TIME' },
  { label: 'Internship', value: 'INTERNSHIP' },
  { label: 'Part-time', value: 'PART_TIME' }
];

export const EXPERIENCE_OPTIONS: FilterOption<ExperienceLevel>[] = [
  { label: 'Director', value: 'DIRECTOR' },
  { label: 'Entry level', value: 'ENTRY_LEVEL' },
  { label: 'Executive', value: 'EXECUTIVE' },
  { label: 'Mid level', value: 'MID_LEVEL' },
  { label: 'Senior level', value: 'SENIOR_LEVEL' }
];

export const SALARY_OPTIONS: FilterOption[] = [
  { label: '50,000+', value: '50000' },
  { label: '100,000+', value: '100000' },
  { label: '150,000+', value: '150000' },
  { label: '200,000+', value: '200000' },
  { label: '500,000+', value: '500000' },
  { label: '1,000,000+', value: '1000000' }
];

export const SORT_OPTIONS: FilterOption<JobSort>[] = [
  { label: 'Highest salary', value: 'highest_salary' },
  { label: 'Newest first', value: 'newest' }
];

export const WORK_MODE_OPTIONS: FilterOption<WorkMode>[] = [
  { label: 'Hybrid', value: 'HYBRID' },
  { label: 'On-site', value: 'ON_SITE' },
  { label: 'Remote', value: 'REMOTE' }
];

const readMultipleOptions = <Value extends string>(
  options: FilterOption<Value>[],
  value: string | null
): Value[] | undefined => {
  const requestedValues = new Set(value?.split(',') ?? []);

  const selectedValues = options
    .filter((option) => requestedValues.has(option.value))
    .map((option) => option.value);

  if (selectedValues.length === 0) {
    return undefined;
  }

  return selectedValues;
};

const readOption = <Value extends string>(
  options: FilterOption<Value>[],
  value: string | null
): Value | undefined => {
  return options.find((option) => option.value === value)?.value;
};

export const readPublicJobsQuery = (searchParameters: URLSearchParams): IPublicJobListQuery => {
  const requestedPage = Number(searchParameters.get(QUERY_PARAMETER.PAGE));

  const requestedSalary = Number(searchParameters.get(QUERY_PARAMETER.MINIMUM_SALARY));

  const minimumSalary =
    Number.isInteger(requestedSalary) && requestedSalary > 0 && requestedSalary <= MAXIMUM_SALARY
      ? requestedSalary
      : undefined;

  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : DEFAULT_PAGE;

  return {
    category: readOption(CATEGORY_OPTIONS, searchParameters.get(QUERY_PARAMETER.CATEGORY)),
    currency:
      readOption(CURRENCY_OPTIONS, searchParameters.get(QUERY_PARAMETER.CURRENCY)) ??
      DEFAULT_CURRENCY,
    datePosted: readOption(DATE_POSTED_OPTIONS, searchParameters.get(QUERY_PARAMETER.DATE_POSTED)),
    employmentType: readMultipleOptions(
      EMPLOYMENT_OPTIONS,
      searchParameters.get(QUERY_PARAMETER.EMPLOYMENT_TYPE)
    ),
    experienceLevel: readMultipleOptions(
      EXPERIENCE_OPTIONS,
      searchParameters.get(QUERY_PARAMETER.EXPERIENCE_LEVEL) ??
        searchParameters.get(QUERY_PARAMETER.SENIORITY)
    ),
    limit: JOBS_PER_PAGE,
    location:
      searchParameters.get(QUERY_PARAMETER.LOCATION)?.trim().slice(0, MAXIMUM_SEARCH_LENGTH) ||
      undefined,
    minSalary: minimumSalary,
    page,
    search:
      searchParameters.get(QUERY_PARAMETER.SEARCH)?.trim().slice(0, MAXIMUM_SEARCH_LENGTH) ||
      undefined,
    sort: readOption(SORT_OPTIONS, searchParameters.get(QUERY_PARAMETER.SORT)) ?? DEFAULT_SORT,
    workMode: readOption(WORK_MODE_OPTIONS, searchParameters.get(QUERY_PARAMETER.WORK_MODE))
  };
};
