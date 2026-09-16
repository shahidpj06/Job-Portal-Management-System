import { SlidersHorizontal, TrendingUp } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import type { IPublicJobListQuery } from '@/types';

import {
  CATEGORY_OPTIONS,
  DATE_POSTED_OPTIONS,
  EMPLOYMENT_OPTIONS,
  EXPERIENCE_OPTIONS,
  WORK_MODE_OPTIONS
} from './jobs-query';

const ALL_FILTER_VALUE = 'all';
const DEFAULT_CURRENCY = 'INR';
const DEFAULT_SALARY = 0;
const MAXIMUM_SALARY = 350_000;
const MIDDLE_SALARY = 175_000;
const SALARY_STEP = 10_000;

interface FilterOption {
  label: string;
  value: string;
}

interface JobsFilterCounts {
  category?: Record<string, number>;
  employmentType?: Record<string, number>;
  workMode?: Record<string, number>;
}

interface JobsFiltersProps {
  counts?: JobsFilterCounts;
  mobileOpen?: boolean;
  onChange: (key: string, value: string) => void;
  onReset: () => void;
  onToggle: (key: 'employmentType' | 'experienceLevel', value: string) => void;
  query: IPublicJobListQuery;
}

interface JobsCheckboxFilterGroupProps {
  counts?: Record<string, number>;
  groupId: string;
  label: string;
  onToggle: (value: string) => void;
  options: FilterOption[];
  selectedValues: Set<string>;
}

interface JobsRadioFilterGroupProps {
  counts?: Record<string, number>;
  groupId: string;
  label: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  value: string;
}

const JobsCheckboxFilterGroup = ({
  counts,
  groupId,
  label,
  onToggle,
  options,
  selectedValues
}: JobsCheckboxFilterGroupProps) => (
  <fieldset className='space-y-3'>
    <legend className='text-xs font-semibold'>{label}</legend>

    {options.map((option) => {
      const inputId = `${groupId}-${option.value}`;
      const optionCount = counts?.[option.value];

      return (
        <div key={option.value} className='flex items-center gap-2'>
          <Checkbox
            checked={selectedValues.has(option.value)}
            className='size-3.5 rounded-[2px]'
            id={inputId}
            onCheckedChange={() => onToggle(option.value)}
          />

          <Label
            className='flex flex-1 cursor-pointer items-center justify-between gap-2 text-xs font-normal text-muted-foreground'
            htmlFor={inputId}
          >
            {option.label}

            {optionCount !== undefined && (
              <Badge className='h-4 bg-primary/10 px-1.5 text-[10px]' variant='secondary'>
                {optionCount}
              </Badge>
            )}
          </Label>
        </div>
      );
    })}
  </fieldset>
);

const JobsRadioFilterGroup = ({
  counts,
  groupId,
  label,
  onChange,
  options,
  value
}: JobsRadioFilterGroupProps) => {
  const labelId = `${groupId}-label`;

  return (
    <fieldset className='space-y-3'>
      <legend id={labelId} className='text-xs font-semibold'>
        {label}
      </legend>

      <RadioGroup
        aria-labelledby={labelId}
        className='gap-3'
        onValueChange={onChange}
        value={value}
      >
        {options.map((option) => {
          const inputId = `${groupId}-${option.value}`;
          const optionCount = counts?.[option.value];

          return (
            <div key={option.value} className='flex items-center gap-2'>
              <RadioGroupItem className='size-3.5' id={inputId} value={option.value} />

              <Label
                className='flex flex-1 cursor-pointer items-center justify-between gap-2 text-xs font-normal text-muted-foreground'
                htmlFor={inputId}
              >
                {option.label}

                {optionCount !== undefined && (
                  <Badge className='h-4 bg-primary/10 px-1.5 text-[10px]' variant='secondary'>
                    {optionCount}
                  </Badge>
                )}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </fieldset>
  );
};

export const JobsFilters = ({
  counts,
  mobileOpen,
  onChange,
  onReset,
  onToggle,
  query
}: JobsFiltersProps) => {
  const filterId = useId();

  const [salaryPreview, setSalaryPreview] = useState(query.minSalary ?? DEFAULT_SALARY);

  useEffect(() => {
    setSalaryPreview(query.minSalary ?? DEFAULT_SALARY);
  }, [query.minSalary]);

  const salaryLabel =
    salaryPreview === DEFAULT_SALARY
      ? 'Any salary'
      : new Intl.NumberFormat('en-US', {
          currency: query.currency ?? DEFAULT_CURRENCY,
          maximumFractionDigits: 0,
          notation: 'compact',
          style: 'currency'
        }).format(salaryPreview);

  const handleDatePostedChange = (value: string) => {
    onChange('datePosted', value);
  };

  const handleSalaryCommit = (value: number | readonly number[]) => {
    const salary = typeof value === 'number' ? value : (value[0] ?? DEFAULT_SALARY);

    onChange('minSalary', salary > DEFAULT_SALARY ? String(salary) : ALL_FILTER_VALUE);
  };

  const handleSalaryPreviewChange = (value: number | readonly number[]) => {
    const salary = typeof value === 'number' ? value : (value[0] ?? DEFAULT_SALARY);

    setSalaryPreview(salary);
  };

  return (
    <Card
      className={cn(
        'rounded-2xl border-0 bg-surface py-5 shadow-none ring-0',
        mobileOpen === false && 'hidden md:flex'
      )}
    >
      <CardHeader className='flex flex-row items-center justify-between px-5'>
        <h2 className='flex items-center gap-2 text-sm font-semibold'>
          <SlidersHorizontal aria-hidden='true' className='size-4 text-primary' />
          Filters
        </h2>

        <Button
          className='h-auto p-0 text-xs'
          onClick={onReset}
          size='sm'
          type='button'
          variant='link'
        >
          Reset all
        </Button>
      </CardHeader>

      <CardContent className='space-y-7 px-5 pt-5'>
        <JobsRadioFilterGroup
          counts={counts?.category}
          groupId={`${filterId}-category`}
          label='Department'
          onChange={(value) => onChange('category', value)}
          options={[
            {
              label: 'All departments',
              value: ALL_FILTER_VALUE
            },
            ...CATEGORY_OPTIONS
          ]}
          value={query.category ?? ALL_FILTER_VALUE}
        />

        <JobsRadioFilterGroup
          counts={counts?.workMode}
          groupId={`${filterId}-work-mode`}
          label='Workplace Type'
          onChange={(value) => onChange('workMode', value)}
          options={[
            {
              label: 'All modes',
              value: ALL_FILTER_VALUE
            },
            ...WORK_MODE_OPTIONS
          ]}
          value={query.workMode ?? ALL_FILTER_VALUE}
        />

        <JobsCheckboxFilterGroup
          counts={counts?.employmentType}
          groupId={`${filterId}-employment-type`}
          label='Employment Type'
          onToggle={(value) => onToggle('employmentType', value)}
          options={EMPLOYMENT_OPTIONS}
          selectedValues={new Set<string>(query.employmentType ?? [])}
        />

        <JobsCheckboxFilterGroup
          groupId={`${filterId}-experience-level`}
          label='Seniority Level'
          onToggle={(value) => onToggle('experienceLevel', value)}
          options={EXPERIENCE_OPTIONS}
          selectedValues={new Set<string>(query.experienceLevel ?? [])}
        />

        <section aria-labelledby={`${filterId}-salary`} className='space-y-3'>
          <div className='flex items-center justify-between gap-2'>
            <h3 id={`${filterId}-salary`} className='text-xs font-semibold'>
              Salary Target
            </h3>

            <span className='text-xs font-semibold text-primary'>
              {salaryLabel}
              {salaryPreview > DEFAULT_SALARY ? '+' : ''}
            </span>
          </div>

          <Slider
            max={MAXIMUM_SALARY}
            min={DEFAULT_SALARY}
            onValueChange={handleSalaryPreviewChange}
            onValueCommitted={handleSalaryCommit}
            step={SALARY_STEP}
            thumbLabel='Salary target'
            value={[salaryPreview]}
          />

          <div className='flex justify-between text-[10px] text-muted-foreground'>
            <span>Any</span>
            <span>{`${MIDDLE_SALARY / 1000}k`}</span>
            <span>{`${MAXIMUM_SALARY / 1000}k+`}</span>
          </div>

          <p className='text-[10px] leading-relaxed text-muted-foreground'>
            {query.currency ?? DEFAULT_CURRENCY} only when a salary target is selected. Matches
            advertised maximum salaries at or above your target.
          </p>
        </section>

        <JobsRadioFilterGroup
          groupId={`${filterId}-date-posted`}
          label='Date Posted'
          onChange={handleDatePostedChange}
          options={[
            {
              label: 'Any time',
              value: ALL_FILTER_VALUE
            },
            ...DATE_POSTED_OPTIONS
          ]}
          value={query.datePosted ?? ALL_FILTER_VALUE}
        />

        <div className='space-y-2 rounded-xl bg-primary/10 p-3'>
          <p className='flex items-center gap-1.5 text-xs font-semibold text-primary'>
            <TrendingUp aria-hidden='true' className='size-4' />
            Salary Transparency
          </p>

          <p className='text-xs leading-relaxed text-muted-foreground'>
            Salary ranges are provided by employers. Jobs without a disclosed salary remain visible
            when no salary target is set.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
