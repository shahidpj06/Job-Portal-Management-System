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

export const JobDetailsHeader = ({ job, onApply, onShare }: JobDetailsHeaderProps) => {
  const categoryLabel = job.category.charAt(0) + job.category.slice(1).toLowerCase();

  const jobLabels = [
    formatEmploymentType(job.employmentType),
    formatExperience(job.experienceLevel),
    formatWorkMode(job.workMode)
  ].sort();

  const postedLabel = formatRelativeDate(job.createdAt);
  const salaryLabel = formatSalary(job.salaryMin, job.salaryMax, job.currency);

  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex items-start gap-4'>
          <CompanyLogo className='size-16' logoUrl={job.company.logoUrl} name={job.company.name} />

          <div className='min-w-0 flex-1'>
            <h1 className='break-words text-xl font-bold sm:text-2xl'>{job.title}</h1>

            <div className='mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground'>
              <span className='inline-flex items-center gap-1'>
                <Building2 aria-hidden='true' className='size-4 shrink-0' />
                {job.company.name}
              </span>

              <span className='inline-flex items-center gap-1'>
                <MapPin aria-hidden='true' className='size-4 shrink-0' />
                {job.location}
              </span>

              <span className='inline-flex items-center gap-1'>
                <Clock aria-hidden='true' className='size-4 shrink-0' />
                Posted {postedLabel}
              </span>
            </div>

            <div className='mt-3 flex flex-wrap gap-2'>
              {jobLabels.map((label) => (
                <Badge key={label} className='bg-primary/10 text-foreground' variant='secondary'>
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

            <p className='text-lg font-bold text-primary'>{salaryLabel}</p>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              aria-label='Copy job link'
              onClick={onShare}
              size='sm'
              type='button'
              variant='outline'
            >
              <Share2 aria-hidden='true' className='size-4' />
            </Button>

            <Button onClick={onApply} size='sm' type='button'>
              Apply Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
