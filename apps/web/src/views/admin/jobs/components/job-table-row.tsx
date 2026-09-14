import { memo } from 'react';

import { TableCell, TableRow } from '@/components/ui/table';
import type { IJobData } from '@/types';
import { formatEmploymentType, formatRelativeDate } from '@/utils/formatters';
import { AdminJobStatusBadge } from './job-status-badge';
import { AdminJobActions } from './job-actions';



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

      <TableCell className='text-muted-foreground'>{job.applicationCount}</TableCell>

      <TableCell className='text-muted-foreground'>{formatRelativeDate(job.createdAt)}</TableCell>

      <TableCell className='text-right'>
        <AdminJobActions isDeleting={isDeleting} job={job} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
};

export const AdminJobTableRow = memo(AdminJobTableRowComponent);
