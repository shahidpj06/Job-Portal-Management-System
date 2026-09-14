import { memo } from 'react';

import type { IJobData } from '@/types';
import { formatRelativeDate } from '@/utils/formatters';
import { AdminJobActions } from './job-actions';
import { AdminJobStatusBadge } from './job-status-badge';


interface IAdminJobMobileCardProps {
  isDeleting: boolean;
  job: IJobData;
  onDelete: (jobId: string) => Promise<void>;
}

const AdminJobMobileCardComponent = ({ isDeleting, job, onDelete }: IAdminJobMobileCardProps) => {
  return (
    <article className='rounded-lg border border-border p-4'>
      <div className='flex items-start justify-between gap-2'>
        <div>
          <h2 className='font-medium'>{job.title}</h2>

          <p className='text-sm text-muted-foreground'>{job.company.name}</p>
        </div>

        <AdminJobStatusBadge status={job.status} />
      </div>

      <div className='mt-3 flex items-center justify-between gap-2'>
        <span className='text-xs text-muted-foreground'>
          {job.applicationCount} {job.applicationCount === 1 ? 'applicant' : 'applicants'}
          {' · '}
          {formatRelativeDate(job.createdAt)}
        </span>

        <AdminJobActions isDeleting={isDeleting} job={job} onDelete={onDelete} />
      </div>
    </article>
  );
};

export const AdminJobMobileCard = memo(AdminJobMobileCardComponent);
