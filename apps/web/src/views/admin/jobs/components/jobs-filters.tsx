import { memo } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { ExperienceLevel, JobCategoryCode } from '@/types';
import { formatExperience } from '@/utils/formatters';
import { SearchInput } from '@/components/search/search-input';

export const ALL_JOB_FILTER_VALUE = 'ALL' as const;

export type AdminJobCategoryFilter = JobCategoryCode | typeof ALL_JOB_FILTER_VALUE;

export type AdminJobExperienceFilter = ExperienceLevel | typeof ALL_JOB_FILTER_VALUE;

interface IJobsFiltersProps {
  category: AdminJobCategoryFilter;
  experienceLevel: AdminJobExperienceFilter;
  onCategoryChange: (value: string) => void;
  onExperienceChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  search: string;
}

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

const JobsFilters = ({
  category,
  experienceLevel,
  onCategoryChange,
  onExperienceChange,
  onSearchChange,
  search
}: IJobsFiltersProps) => {
  return (
    <div className='mb-4 grid gap-3 md:grid-cols-[minmax(220px,1fr)_200px_200px]'>
      <SearchInput
        id='admin-job-search'
        value={search}
        onValueChange={onSearchChange}
        placeholder='Search by job or company…'
        aria-label='Search job listings'
      />

      <Select value={category} onValueChange={onCategoryChange}>
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

      <Select value={experienceLevel} onValueChange={onExperienceChange}>
        <SelectTrigger aria-label='Filter by experience level'>
          <SelectValue placeholder='All experience levels' />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value={ALL_JOB_FILTER_VALUE}>All experience levels</SelectItem>

          {EXPERIENCE_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {formatExperience(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export const AdminJobsFilters = memo(JobsFilters);
