import { useMemo } from 'react';
import { Building2, Clock, MapPin, Share2 } from 'lucide-react';

import { CompanyLogo } from '@/components/avatar/company-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { IJobData } from '@/types';
import {
  formatEmploymentType,
  formatExperience,
  formatRelativeDate,
  formatSalary,
  formatWorkMode
} from '@/utils/formatters';

interface JobDetailsHeaderProps {
  job: IJobData;
  onApply: () => void;
  onShare: () => void;
}

export const JobDetailsHeader = (props: JobDetailsHeaderProps) => {
  const salary = useMemo(() => {
    return formatSalary(props.job.salaryMin, props.job.salaryMax, props.job.currency);
  }, [props.job.salaryMin, props.job.salaryMax, props.job.currency]);

  const postedAt = useMemo(() => {
    return formatRelativeDate(props.job.createdAt);
  }, [props.job.createdAt]);

  const labels = useMemo(() => {
    return [
      formatEmploymentType(props.job.employmentType),
      formatWorkMode(props.job.workMode),
      formatExperience(props.job.experienceLevel)
    ];
  }, [props.job.employmentType, props.job.workMode, props.job.experienceLevel]);

  const categoryLabel = useMemo(() => {
    return props.job.category.charAt(0) + props.job.category.slice(1).toLowerCase();
  }, [props.job.category]);

  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex items-start gap-4'>
          <CompanyLogo
            name={props.job.company.name}
            logoUrl={props.job.company.logoUrl}
            className='size-16'
          />

          <div className='min-w-0 flex-1'>
            <h1 className='break-words text-xl font-bold sm:text-2xl'>{props.job.title}</h1>

            <div className='mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground'>
              <span className='inline-flex items-center gap-1'>
                <Building2 aria-hidden='true' className='size-4 shrink-0' />
                {props.job.company.name}
              </span>

              <span className='inline-flex items-center gap-1'>
                <MapPin aria-hidden='true' className='size-4 shrink-0' />
                {props.job.location}
              </span>

              <span className='inline-flex items-center gap-1'>
                <Clock aria-hidden='true' className='size-4 shrink-0' />
                Posted {postedAt}
              </span>
            </div>

            <div className='mt-3 flex flex-wrap gap-2'>
              {labels.map((label) => (
                <Badge key={label} variant='secondary' className='bg-primary/10 text-foreground'>
                  {label}
                </Badge>
              ))}

              <Badge variant='outline'>{categoryLabel}</Badge>
            </div>
          </div>
        </div>

        <div className='mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='text-xs text-muted-foreground'>Salary Range</p>
            <p className='text-lg font-bold text-primary'>{salary}</p>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              aria-label='Copy job link'
              onClick={props.onShare}
            >
              <Share2 aria-hidden='true' className='size-4' />
            </Button>

            <Button type='button' size='sm' onClick={props.onApply}>
              Apply Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
