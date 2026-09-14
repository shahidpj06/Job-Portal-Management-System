import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { SlidersHorizontal, TrendingUp } from 'lucide-react';

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

interface JobsFilterCounts {
  category?: Record<string, number>;
  workMode?: Record<string, number>;
  employmentType?: Record<string, number>;
}

interface JobsFiltersProps {
  query: IPublicJobListQuery;
  mobileOpen?: boolean;
  counts?: JobsFilterCounts;
  onChange: (key: string, value: string) => void;
  onToggle: (key: 'employmentType' | 'experienceLevel', value: string) => void;
  onReset: () => void;
}

export const JobsFilters = (props: JobsFiltersProps) => {
  const id = useId();
  const [salaryPreview, setSalaryPreview] = useState(props.query.minSalary ?? 0);

  useEffect(() => {
    setSalaryPreview(props.query.minSalary ?? 0);
  }, [props.query.minSalary]);

  const radioGroups = useMemo(
    () => [
      {
        key: 'category',
        label: 'Department',
        value: props.query.category ?? 'all',
        options: [{ label: 'All departments', value: 'all' }, ...CATEGORY_OPTIONS],
        counts: props.counts?.category
      },
      {
        key: 'workMode',
        label: 'Workplace Type',
        value: props.query.workMode ?? 'all',
        options: [{ label: 'All modes', value: 'all' }, ...WORK_MODE_OPTIONS],
        counts: props.counts?.workMode
      }
    ],
    [props.query.category, props.query.workMode, props.counts?.category, props.counts?.workMode]
  );

  const checkboxGroups = useMemo(
    () => [
      {
        key: 'employmentType' as const,
        label: 'Employment Type',
        options: EMPLOYMENT_OPTIONS,
        selected: new Set<string>(props.query.employmentType ?? []),
        counts: props.counts?.employmentType
      },
      {
        key: 'experienceLevel' as const,
        label: 'Seniority Level',
        options: EXPERIENCE_OPTIONS,
        selected: new Set<string>(props.query.experienceLevel ?? []),
        counts: undefined
      }
    ],
    [props.query.employmentType, props.query.experienceLevel, props.counts?.employmentType]
  );

  const salaryLabel = useMemo(() => {
    if (salaryPreview === 0) {
      return 'Any salary';
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: props.query.currency ?? 'USD',
      notation: 'compact',
      maximumFractionDigits: 0
    }).format(salaryPreview);
  }, [salaryPreview, props.query.currency]);

  const onSalaryPreviewChange = useCallback((value: number | readonly number[]) => {
    setSalaryPreview(typeof value === 'number' ? value : (value[0] ?? 0));
  }, []);

  const onSalaryCommit = useCallback(
    (value: number | readonly number[]) => {
      const amount = typeof value === 'number' ? value : (value[0] ?? 0);

      props.onChange('minSalary', amount > 0 ? String(amount) : 'all');
    },
    [props.onChange]
  );

  const onDatePostedChange = useCallback(
    (value: string) => {
      props.onChange('datePosted', value);
    },
    [props.onChange]
  );

  return (
    <Card
      className={cn(
        'rounded-2xl border-0 bg-surface py-5 shadow-none ring-0',
        props.mobileOpen === false && 'hidden md:flex'
      )}
    >
      <CardHeader className='flex flex-row items-center justify-between px-5'>
        <h2 className='flex items-center gap-2 text-sm font-semibold'>
          <SlidersHorizontal aria-hidden='true' className='size-4 text-primary' />
          Filters
        </h2>

        <Button
          type='button'
          variant='link'
          size='sm'
          onClick={props.onReset}
          className='h-auto p-0 text-xs'
        >
          Reset all
        </Button>
      </CardHeader>

      <CardContent className='space-y-7 px-5 pt-5'>
        {radioGroups.map((group) => (
          <fieldset key={group.key} className='space-y-3'>
            <legend id={`${id}-${group.key}-label`} className='text-xs font-semibold'>
              {group.label}
            </legend>

            <RadioGroup
              value={group.value}
              aria-labelledby={`${id}-${group.key}-label`}
              onValueChange={(value: string) => props.onChange(group.key, value)}
              className='gap-3'
            >
              {group.options.map((option) => {
                const inputId = `${id}-${group.key}-${option.value}`;
                const count = group.counts?.[option.value];

                return (
                  <div key={option.value} className='flex items-center gap-2'>
                    <RadioGroupItem id={inputId} value={option.value} className='size-3.5' />

                    <Label
                      htmlFor={inputId}
                      className='flex flex-1 cursor-pointer items-center justify-between gap-2 text-xs font-normal text-muted-foreground'
                    >
                      {option.label}

                      {count !== undefined && (
                        <Badge variant='secondary' className='h-4 bg-primary/10 px-1.5 text-[10px]'>
                          {count}
                        </Badge>
                      )}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </fieldset>
        ))}

        {checkboxGroups.map((group) => (
          <fieldset key={group.key} className='space-y-3'>
            <legend className='text-xs font-semibold'>{group.label}</legend>

            {group.options.map((option) => {
              const inputId = `${id}-${group.key}-${option.value}`;
              const count = group.counts?.[option.value];

              return (
                <div key={option.value} className='flex items-center gap-2'>
                  <Checkbox
                    id={inputId}
                    checked={group.selected.has(option.value)}
                    onCheckedChange={() => props.onToggle(group.key, option.value)}
                    className='size-3.5 rounded-[2px]'
                  />

                  <Label
                    htmlFor={inputId}
                    className='flex flex-1 cursor-pointer items-center justify-between gap-2 text-xs font-normal text-muted-foreground'
                  >
                    {option.label}

                    {count !== undefined && (
                      <Badge variant='secondary' className='h-4 bg-primary/10 px-1.5 text-[10px]'>
                        {count}
                      </Badge>
                    )}
                  </Label>
                </div>
              );
            })}
          </fieldset>
        ))}

        <section className='space-y-3' aria-labelledby={`${id}-salary`}>
          <div className='flex items-center justify-between gap-2'>
            <h3 id={`${id}-salary`} className='text-xs font-semibold'>
              Salary Target
            </h3>

            <span className='text-xs font-semibold text-primary'>
              {salaryLabel}
              {salaryPreview > 0 ? '+' : ''}
            </span>
          </div>

          <Slider
            value={[salaryPreview]}
            min={0}
            max={350_000}
            step={10_000}
            onValueChange={onSalaryPreviewChange}
            onValueCommitted={onSalaryCommit}
            thumbLabel='Salary target'
          />

          <div className='flex justify-between text-[10px] text-muted-foreground'>
            <span>Any</span>
            <span>175k</span>
            <span>350k+</span>
          </div>

          <p className='text-[10px] leading-relaxed text-muted-foreground'>
            {props.query.currency ?? 'USD'} only when a salary target is selected. Matches
            advertised maximum salaries at or above your target.
          </p>
        </section>

        <fieldset className='space-y-3'>
          <legend id={`${id}-date-label`} className='text-xs font-semibold'>
            Date Posted
          </legend>

          <RadioGroup
            value={props.query.datePosted ?? 'all'}
            onValueChange={onDatePostedChange}
            aria-labelledby={`${id}-date-label`}
            className='gap-3'
          >
            {[{ label: 'Any time', value: 'all' }, ...DATE_POSTED_OPTIONS].map((option) => (
              <div key={option.value} className='flex items-center gap-2'>
                <RadioGroupItem
                  id={`${id}-date-${option.value}`}
                  value={option.value}
                  className='size-3.5'
                />

                <Label
                  htmlFor={`${id}-date-${option.value}`}
                  className='cursor-pointer text-xs font-normal text-muted-foreground'
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </fieldset>

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
