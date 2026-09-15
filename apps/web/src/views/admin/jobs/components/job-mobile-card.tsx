import { memo } from 'react';

import type { IJobData } from '@/types';
import { formatRelativeDate } from '@/utils/formatters';
import { AdminJobStatusBadge } from './job-status-badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { paths } from '@/utils/paths';

interface IAdminJobMobileCardProps {
  isDeleting?: boolean;
  job: IJobData;
  onDelete?: (jobId: string) => Promise<void>;
}

const AdminJobMobileCardComponent = ({ job }: IAdminJobMobileCardProps) => {
  return (
    <article className='rounded-lg border border-border p-4'>
      <div className='flex items-start justify-between gap-2'>
        <div>
          <h2 className='font-medium'>{job.title}</h2>

          <p className='text-sm text-muted-foreground'>{job.company.name}</p>
        </div>

        <AdminJobStatusBadge status={job.status} />
      </div>

      <div className='text-xs text-muted-foreground'>
        <Button asChild variant='link' className='h-auto p-0 text-xs'>
          <Link
            to={`${paths.admin.applications}?jobId=${encodeURIComponent(job.id)}`}
            aria-label={`View applications for ${job.title}`}
          >
            {job.applicationCount} {job.applicationCount === 1 ? 'applicant' : 'applicants'}
          </Link>
        </Button>

        <span>
          {' · '}
          {formatRelativeDate(job.createdAt)}
        </span>
      </div>
    </article>
  );
};

export const AdminJobMobileCard = memo(AdminJobMobileCardComponent);
