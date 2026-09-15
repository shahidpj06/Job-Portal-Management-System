import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Clock, MapPin, Zap } from 'lucide-react';

import { CompanyLogo } from '@/components/avatar/company-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { IJobData } from '@/types';
import {
  formatEmploymentType,
  formatExperience,
  formatRelativeDate,
  formatSalary
} from '@/utils/formatters';
import { paths } from '@/utils/paths';

interface JobCardProps {
  job: IJobData;
  isFeatured?: boolean;
  isSaved?: boolean;
  isSaving?: boolean;
  onApply: (jobId: string) => void;
  onSave?: (jobId: string) => void;
}

export const JobCard = (props: JobCardProps) => {
  const salaryLabel = useMemo(() => {
    return formatSalary(props.job.salaryMin, props.job.salaryMax, props.job.currency);
  }, [props.job.salaryMin, props.job.salaryMax, props.job.currency]);

  const postedLabel = useMemo(() => {
    return formatRelativeDate(props.job.createdAt);
  }, [props.job.createdAt]);

  const jobTags = useMemo(() => {
    return [
      ...new Set([
        ...props.job.skills.slice(0, 3),
        formatEmploymentType(props.job.employmentType),
        formatExperience(props.job.experienceLevel)
      ])
    ];
  }, [props.job.skills, props.job.employmentType, props.job.experienceLevel]);

  const onApply = useCallback(() => {
    props.onApply(props.job.id);
  }, [props.onApply, props.job.id]);

  const onSave = useCallback(() => {
    props.onSave?.(props.job.id);
  }, [props.onSave, props.job.id]);

  return (
    <article>
      <Card
        className={cn(
          'relative overflow-hidden rounded-2xl border border-transparent',
          'py-0 shadow-sm ring-0 transition-shadow hover:shadow-md'
        )}
      >
        <CardContent
          className={cn(
            'grid grid-cols-[3rem_minmax(0,1fr)] gap-x-3 gap-y-4 p-5',
            'md:grid-cols-[3rem_minmax(0,1fr)_auto]',
            'md:gap-x-4 md:gap-y-2'
          )}
        >
          <CompanyLogo
            name={props.job.company.name}
            logoUrl={props.job.company.logoUrl}
            className='col-start-1 row-start-1 size-12 md:row-span-2'
          />

          <div
            className={cn(
              'col-start-2 row-start-1 min-w-0 self-center',
              'md:col-start-2 md:row-start-2'
            )}
          >
            <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs'>
              <span className='font-semibold'>{props.job.company.name}</span>

              <span className='inline-flex items-start gap-1 text-muted-foreground'>
                <MapPin aria-hidden='true' className='mt-0.5 size-3 shrink-0' />
                {props.job.location}
              </span>

              <span className='inline-flex items-center gap-1 text-muted-foreground'>
                <Clock aria-hidden='true' className='size-3 shrink-0' />
                <time dateTime={props.job.createdAt}>{postedLabel}</time>
              </span>
            </div>
          </div>

          <div
            className={cn(
              'col-span-2 row-start-2 min-w-0',
              'md:col-span-1 md:col-start-2 md:row-start-1'
            )}
          >
            <div className='flex flex-wrap items-center gap-2'>
              <h2 className='text-xl font-bold leading-snug tracking-tight md:text-base'>
                <Link
                  to={paths['job-details'](props.job.id)}
                  className='transition-colors hover:text-primary'
                >
                  {props.job.title}
                </Link>
              </h2>

              {props.isFeatured && (
                <Badge className='h-5 bg-emerald-700 px-2 text-[10px] text-white'>Featured</Badge>
              )}
            </div>
          </div>

          <p
            className={cn(
              'hidden text-sm leading-relaxed text-muted-foreground',
              'md:col-span-3 md:row-start-3 md:mt-2 md:line-clamp-2'
            )}
          >
            {props.job.summary}
          </p>

          <div
            className={cn(
              'col-span-2 row-start-3',
              'md:col-span-1 md:col-start-3 md:row-start-4',
              'md:self-center md:text-right'
            )}
          >
            <span className='inline-block rounded-full bg-primary/5 px-2 py-1 text-sm font-semibold text-emerald-800 dark:text-emerald-300 md:bg-transparent md:p-0'>
              {salaryLabel}
            </span>
          </div>

          <div
            className={cn(
              'col-span-2 row-start-4 flex flex-wrap items-center gap-1.5',
              'md:row-start-4 md:mt-2'
            )}
          >
            {jobTags.map((tag) => (
              <Badge
                key={tag}
                variant='secondary'
                className='h-auto rounded-full bg-primary/5 px-2.5 py-1 text-[11px] text-muted-background font-normal'
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div
            className={cn(
              'col-span-2 row-start-5 flex items-center gap-2 pt-1',
              'md:col-span-1 md:col-start-3 md:row-span-2 md:row-start-1',
              'md:self-start md:pt-0'
            )}
          >
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={onSave}
              disabled={props.isSaving || !props.onSave}
              aria-label={props.isSaved ? `Unsave ${props.job.title}` : `Save ${props.job.title}`}
              aria-pressed={Boolean(props.isSaved)}
              title={props.onSave ? undefined : 'Saving jobs is not available yet'}
              className='size-11 shrink-0 rounded-lg bg-primary/5 text-muted-foreground hover:bg-primary/10 md:size-8'
            >
              <Bookmark
                aria-hidden='true'
                className='size-4'
                fill={props.isSaved ? 'currentColor' : 'none'}
              />
            </Button>

            <Button
              type='button'
              onClick={onApply}
              className='h-11 flex-1 rounded-lg px-5 font-semibold md:h-8 md:flex-none md:px-4 md:text-xs'
            >
              View More
            </Button>
          </div>
        </CardContent>
      </Card>
    </article>
  );
};
