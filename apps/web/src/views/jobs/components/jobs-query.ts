import type {
  EmploymentType,
  ExperienceLevel,
  IPublicJobListQuery,
  JobCategoryCode,
  JobDatePosted,
  JobSort,
  WorkMode
} from '@/types';

interface FilterOption<Value extends string = string> {
  label: string;
  value: Value;
}

export const CATEGORY_OPTIONS: FilterOption<JobCategoryCode>[] = [
  { label: 'Engineering', value: 'ENGINEERING' },
  { label: 'Design', value: 'DESIGN' },
  { label: 'Product', value: 'PRODUCT' },
  { label: 'Marketing', value: 'MARKETING' },
  { label: 'Sales', value: 'SALES' },
  { label: 'Operations', value: 'OPERATIONS' }
];

export const WORK_MODE_OPTIONS: FilterOption<WorkMode>[] = [
  { label: 'Remote', value: 'REMOTE' },
  { label: 'Hybrid', value: 'HYBRID' },
  { label: 'On-site', value: 'ON_SITE' }
];

export const EMPLOYMENT_OPTIONS: FilterOption<EmploymentType>[] = [
  { label: 'Full-time', value: 'FULL_TIME' },
  { label: 'Part-time', value: 'PART_TIME' },
  { label: 'Contract', value: 'CONTRACT' },
  { label: 'Freelance', value: 'FREELANCE' },
  { label: 'Internship', value: 'INTERNSHIP' }
];

export const EXPERIENCE_OPTIONS: FilterOption<ExperienceLevel>[] = [
  { label: 'Entry level', value: 'ENTRY_LEVEL' },
  { label: 'Mid level', value: 'MID_LEVEL' },
  { label: 'Senior level', value: 'SENIOR_LEVEL' },
  { label: 'Director', value: 'DIRECTOR' },
  { label: 'Executive', value: 'EXECUTIVE' }
];

export const DATE_POSTED_OPTIONS: FilterOption<JobDatePosted>[] = [
  { label: 'Past 24 hours', value: '24h' },
  { label: 'Past week', value: '7d' },
  { label: 'Past month', value: '30d' }
];

export const SORT_OPTIONS: FilterOption<JobSort>[] = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Highest salary', value: 'highest_salary' }
];

export const CURRENCY_OPTIONS: FilterOption[] = [
  { label: 'USD', value: 'USD' },
  { label: 'INR', value: 'INR' },
  { label: 'EUR', value: 'EUR' },
  { label: 'GBP', value: 'GBP' }
];

export const SALARY_OPTIONS: FilterOption[] = [
  { label: '50,000+', value: '50000' },
  { label: '100,000+', value: '100000' },
  { label: '150,000+', value: '150000' },
  { label: '200,000+', value: '200000' },
  { label: '500,000+', value: '500000' },
  { label: '1,000,000+', value: '1000000' }
];

const readOption = <Value extends string>(
  options: FilterOption<Value>[],
  value: string | null
): Value | undefined => {
  return options.find((option) => option.value === value)?.value;
};

const readMultipleOptions = <Value extends string>(
  options: FilterOption<Value>[],
  value: string | null
): Value[] | undefined => {
  const requestedValues = new Set(value?.split(',') ?? []);

  const selectedValues = options
    .filter((option) => requestedValues.has(option.value))
    .map((option) => option.value);

  return selectedValues.length ? selectedValues : undefined;
};

export const readPublicJobsQuery = (searchParams: URLSearchParams): IPublicJobListQuery => {
  const requestedPage = Number(searchParams.get('page'));
  const requestedSalary = Number(searchParams.get('minSalary'));

  const salary =
    Number.isInteger(requestedSalary) && requestedSalary > 0 && requestedSalary <= 350_000
      ? requestedSalary
      : undefined;

  return {
    page: Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
    limit: 6,
    search: searchParams.get('q')?.trim().slice(0, 100) || undefined,
    location: searchParams.get('location')?.trim().slice(0, 100) || undefined,
    category: readOption(CATEGORY_OPTIONS, searchParams.get('category')),
    workMode: readOption(WORK_MODE_OPTIONS, searchParams.get('workMode')),
    employmentType: readMultipleOptions(EMPLOYMENT_OPTIONS, searchParams.get('employmentType')),
    experienceLevel: readMultipleOptions(
      EXPERIENCE_OPTIONS,
      searchParams.get('experienceLevel') ?? searchParams.get('seniority')
    ),
    datePosted: readOption(DATE_POSTED_OPTIONS, searchParams.get('datePosted')),
    sort: readOption(SORT_OPTIONS, searchParams.get('sort')) ?? 'newest',
    currency: readOption(CURRENCY_OPTIONS, searchParams.get('currency')) ?? 'USD',
    minSalary: salary
  };
};
