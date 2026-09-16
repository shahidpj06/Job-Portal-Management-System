import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import type { IJobData } from '@/types';
import { formatRelativeDate } from '@/utils/formatters';
import { paths } from '@/utils/paths';

import { AdminJobStatusBadge } from './job-status-badge';
import { AdminJobActions } from './job-actions';

interface AdminJobMobileCardProps {
  isDeleting: boolean;
  job: IJobData;
  onDelete: (jobId: string) => Promise<void>;
}

export const AdminJobMobileCard = ({ isDeleting, job, onDelete }: AdminJobMobileCardProps) => (
  <article className='rounded-lg border border-border p-4'>
    <div className='flex items-start justify-between gap-2'>
      <div className='min-w-0'>
        <h2 className='break-words font-medium'>{job.title}</h2>

        <p className='text-sm text-muted-foreground'>{job.company.name}</p>
      </div>

      <AdminJobStatusBadge status={job.status} />
    </div>

    <div className='mt-2 flex items-center justify-between gap-3'>
      <div className='text-xs text-muted-foreground'>
        <Button asChild className='h-auto p-0 text-xs' variant='link'>
          <Link
            aria-label={`View applications for ${job.title}`}
            to={`${paths.admin.applications}?jobId=${encodeURIComponent(job.id)}`}
          >
            {job.applicationCount} {job.applicationCount === 1 ? 'applicant' : 'applicants'}
          </Link>
        </Button>

        <span>
          {' · '}
          {formatRelativeDate(job.createdAt)}
        </span>
      </div>

      <AdminJobActions
        isDeleting={isDeleting}
        jobId={job.id}
        jobTitle={job.title}
        onDelete={onDelete}
      />
    </div>
  </article>
);
