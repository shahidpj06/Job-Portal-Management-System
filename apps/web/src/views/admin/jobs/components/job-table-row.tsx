import { memo } from 'react';

import { TableCell, TableRow } from '@/components/ui/table';
import type { IJobData } from '@/types';
import { formatEmploymentType, formatRelativeDate } from '@/utils/formatters';
import { AdminJobStatusBadge } from './job-status-badge';
import { AdminJobActions } from './job-actions';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { paths } from '@/utils/paths';

interface IAdminJobTableRowProps {
  isDeleting: boolean;
  job: IJobData;
  onDelete: (jobId: string) => Promise<void>;
}

const AdminJobTableRowComponent = ({ isDeleting, job, onDelete }: IAdminJobTableRowProps) => {
  return (
    <TableRow>
      <TableCell className='font-medium'>{job.title}</TableCell>
      <TableCell className='text-muted-foreground'>{job.company.name}</TableCell>

      <TableCell className='text-muted-foreground'>
        {formatEmploymentType(job.employmentType)}
      </TableCell>

      <TableCell>
        <AdminJobStatusBadge status={job.status} />
      </TableCell>

      <TableCell>
        <Button asChild variant='link' className='h-auto p-0'>
          <Link
            to={`${paths.admin.applications}?jobId=${encodeURIComponent(job.id)}`}
            aria-label={`View applications for ${job.title}`}
          >
            {job.applicationCount}
          </Link>
        </Button>
      </TableCell>

      <TableCell className='text-muted-foreground'>{formatRelativeDate(job.createdAt)}</TableCell>

      <TableCell className='text-right'>
        <AdminJobActions isDeleting={isDeleting} job={job} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
};

export const AdminJobTableRow = memo(AdminJobTableRowComponent);
