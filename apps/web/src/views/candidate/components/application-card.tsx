import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, MapPin } from 'lucide-react';

import { CompanyLogo } from '@/components/avatar/company-avatar';
import { ApplicationStatusBadge } from '@/components/jobs';
import { Card, CardContent } from '@/components/ui/card';
import type { IApplicationListItem } from '@/types';
import { formatDate } from '@/utils/formatters';
import { paths } from '@/utils/paths';

interface IApplicationCardProps {
  application: IApplicationListItem;
}

export const ApplicationCard = memo(({ application }: IApplicationCardProps) => {
  const { job } = application;
  
  const appliedAt = useMemo(() => formatDate(application.createdAt), [application.createdAt]);
  const updatedAt = useMemo(() => formatDate(application.updatedAt), [application.updatedAt]);

  return (
    <Card className='border border-border bg-surface'>
      <CardContent className='p-5'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex min-w-0 items-start gap-4'>
            <CompanyLogo
              name={job.company.name}
              logoUrl={job.company.logoUrl}
              className='size-12'
            />

            <div className='min-w-0'>
              {job.status === 'PUBLISHED' ? (
                <Link
                  to={paths['job-details'](job.id)}
                  className='break-words font-semibold transition-colors hover:text-primary'
                >
                  {job.title}
                </Link>
              ) : (
                <p className='break-words font-semibold'>{job.title}</p>
              )}

              <div className='mt-0.5 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground'>
                <span className='flex items-center gap-1'>
                  <Briefcase aria-hidden='true' className='size-3.5 shrink-0' />
                  {job.company.name}
                </span>

                <span className='flex items-center gap-1'>
                  <MapPin aria-hidden='true' className='size-3.5 shrink-0' />
                  {job.location}
                </span>

                <span className='flex items-center gap-1'>
                  <Clock aria-hidden='true' className='size-3.5 shrink-0' />
                  Applied {appliedAt}
                </span>
              </div>

              {job.status !== 'PUBLISHED' && (
                <p className='mt-1 text-xs text-muted-foreground'>
                  This job is no longer published.
                </p>
              )}
            </div>
          </div>

          <div className='shrink-0 sm:text-right'>
            <ApplicationStatusBadge status={application.status} />

            <p className='mt-1 text-xs text-muted-foreground'>Updated {updatedAt}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ApplicationCard.displayName = 'ApplicationCard';
