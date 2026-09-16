import { Bookmark, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const MAXIMUM_VISIBLE_SKILLS = 3;

interface JobCardProps {
  isFeatured?: boolean;
  isSaved?: boolean;
  isSaving?: boolean;
  job: IJobData;
  onApply: (jobId: string) => void;
  onSave?: (jobId: string) => void;
}

export const JobCard = ({ isFeatured, isSaved, isSaving, job, onApply, onSave }: JobCardProps) => {
  const jobTags = [
    ...new Set([
      ...job.skills.slice(0, MAXIMUM_VISIBLE_SKILLS),
      formatEmploymentType(job.employmentType),
      formatExperience(job.experienceLevel)
    ])
  ];

  const postedLabel = formatRelativeDate(job.createdAt);

  const salaryLabel = formatSalary(job.salaryMin, job.salaryMax, job.currency);

  const handleApply = () => {
    onApply(job.id);
  };

  const handleSave = () => {
    onSave?.(job.id);
  };

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
            className='col-start-1 row-start-1 size-12 md:row-span-2'
            logoUrl={job.company.logoUrl}
            name={job.company.name}
          />

          <div
            className={cn(
              'col-start-2 row-start-1 min-w-0 self-center',
              'md:col-start-2 md:row-start-2'
            )}
          >
            <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs'>
              <span className='font-semibold'>{job.company.name}</span>

              <span className='inline-flex items-start gap-1 text-muted-foreground'>
                <MapPin aria-hidden='true' className='mt-0.5 size-3 shrink-0' />
                {job.location}
              </span>

              <span className='inline-flex items-center gap-1 text-muted-foreground'>
                <Clock aria-hidden='true' className='size-3 shrink-0' />

                <time dateTime={job.createdAt}>{postedLabel}</time>
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
                  className='transition-colors hover:text-primary'
                  to={paths['job-details'](job.id)}
                >
                  {job.title}
                </Link>
              </h2>

              {isFeatured && (
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
            {job.summary}
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
                className='h-auto rounded-full bg-primary/5 px-2.5 py-1 text-[11px] font-normal text-muted-background'
                variant='secondary'
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
              aria-label={isSaved ? `Unsave ${job.title}` : `Save ${job.title}`}
              aria-pressed={Boolean(isSaved)}
              className='size-11 shrink-0 rounded-lg bg-primary/5 text-muted-foreground hover:bg-primary/10 md:size-8'
              disabled={isSaving || !onSave}
              onClick={handleSave}
              size='icon'
              title={onSave ? undefined : 'Saving jobs is not available yet'}
              type='button'
              variant='ghost'
            >
              <Bookmark
                aria-hidden='true'
                className='size-4'
                fill={isSaved ? 'currentColor' : 'none'}
              />
            </Button>

            <Button
              className='h-11 flex-1 rounded-lg px-5 font-semibold md:h-8 md:flex-none md:px-4 md:text-xs'
              onClick={handleApply}
              type='button'
            >
              View More
            </Button>
          </div>
        </CardContent>
      </Card>
    </article>
  );
};
