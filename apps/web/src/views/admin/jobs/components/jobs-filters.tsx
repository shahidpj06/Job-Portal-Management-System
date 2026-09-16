import { SearchInput } from '@/components/search/search-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { ExperienceLevel, JobCategoryCode } from '@/types';
import { formatExperience } from '@/utils/formatters';

export const ALL_JOB_FILTER_VALUE = 'ALL' as const;

export type AdminJobCategoryFilter = JobCategoryCode | typeof ALL_JOB_FILTER_VALUE;

export type AdminJobExperienceFilter = ExperienceLevel | typeof ALL_JOB_FILTER_VALUE;

const CATEGORY_OPTIONS: Array<{
  label: string;
  value: JobCategoryCode;
}> = [
  {
    label: 'Design',
    value: 'DESIGN'
  },
  {
    label: 'Engineering',
    value: 'ENGINEERING'
  },
  {
    label: 'Marketing',
    value: 'MARKETING'
  },
  {
    label: 'Operations',
    value: 'OPERATIONS'
  },
  {
    label: 'Product',
    value: 'PRODUCT'
  },
  {
    label: 'Sales',
    value: 'SALES'
  }
];

const EXPERIENCE_OPTIONS: ExperienceLevel[] = [
  'DIRECTOR',
  'ENTRY_LEVEL',
  'EXECUTIVE',
  'MID_LEVEL',
  'SENIOR_LEVEL'
];

interface AdminJobsFiltersProps {
  category: AdminJobCategoryFilter;
  experienceLevel: AdminJobExperienceFilter;
  onCategoryChange: (value: string) => void;
  onExperienceChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  search: string;
}

export const AdminJobsFilters = ({
  category,
  experienceLevel,
  onCategoryChange,
  onExperienceChange,
  onSearchChange,
  search
}: AdminJobsFiltersProps) => (
  <div className='mb-4 grid gap-3 md:grid-cols-[minmax(220px,1fr)_200px_200px]'>
    <SearchInput
      aria-label='Search job listings'
      id='admin-job-search'
      onValueChange={onSearchChange}
      placeholder='Search by job or company…'
      value={search}
    />

    <Select onValueChange={onCategoryChange} value={category}>
      <SelectTrigger aria-label='Filter by category'>
        <SelectValue placeholder='All categories' />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value={ALL_JOB_FILTER_VALUE}>All categories</SelectItem>

        {CATEGORY_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select onValueChange={onExperienceChange} value={experienceLevel}>
      <SelectTrigger aria-label='Filter by experience level'>
        <SelectValue placeholder='All experience levels' />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value={ALL_JOB_FILTER_VALUE}>All experience levels</SelectItem>

        {EXPERIENCE_OPTIONS.map((experienceOption) => (
          <SelectItem key={experienceOption} value={experienceOption}>
            {formatExperience(experienceOption)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

