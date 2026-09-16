import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import type { IJobData } from '@/types';
import { formatEmploymentType, formatRelativeDate } from '@/utils/formatters';
import { paths } from '@/utils/paths';

import { AdminJobActions } from './job-actions';
import { AdminJobStatusBadge } from './job-status-badge';

interface AdminJobTableRowProps {
  isDeleting: boolean;
  job: IJobData;
  onDelete: (jobId: string) => Promise<void>;
}

export const AdminJobTableRow = ({ isDeleting, job, onDelete }: AdminJobTableRowProps) => (
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
      <Button asChild className='h-auto p-0' variant='link'>
        <Link
          aria-label={`View applications for ${job.title}`}
          to={`${paths.admin.applications}?jobId=${encodeURIComponent(job.id)}`}
        >
          {job.applicationCount}
        </Link>
      </Button>
    </TableCell>

    <TableCell className='text-muted-foreground'>{formatRelativeDate(job.createdAt)}</TableCell>

    <TableCell className='text-right'>
      <AdminJobActions
        isDeleting={isDeleting}
        jobId={job.id}
        jobTitle={job.title}
        onDelete={onDelete}
      />
    </TableCell>
  </TableRow>
);
