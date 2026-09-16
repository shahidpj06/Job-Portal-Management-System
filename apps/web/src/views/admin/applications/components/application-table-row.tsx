import { useCallback, useMemo } from 'react';

import { ApplicationStatusBadge } from '@/components/jobs/application-status-badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import type { IApplicationListItem } from '@/types/application';

interface ApplicationTableRowProps {
  application: IApplicationListItem;
  onFilterJob: (jobId: string) => void;
  onView: (applicationId: string) => void;
}

export const ApplicationTableRow = ({
  application,
  onFilterJob,
  onView
}: ApplicationTableRowProps) => {
  const applicantName = useMemo(
    () => `${application.user.firstName} ${application.user.lastName}`.trim(),
    [application.user.firstName, application.user.lastName]
  );

  const submittedDate = useMemo(
    () =>
      new Intl.DateTimeFormat('en', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(new Date(application.createdAt)),
    [application.createdAt]
  );

  const handleFilterJob = useCallback(() => {
    onFilterJob(application.job.id);
  }, [application.job.id, onFilterJob]);

  const handleViewApplication = useCallback(() => {
    onView(application.id);
  }, [application.id, onView]);

  return (
    <TableRow>
      <TableCell>
        <p className='font-medium'>{applicantName}</p>

        <p className='text-sm text-muted-foreground'>{application.user.email}</p>
      </TableCell>

      <TableCell>
        <Button
          aria-label={`Filter applications for ${application.job.title}`}
          className='h-auto justify-start p-0 text-left'
          onClick={handleFilterJob}
          type='button'
          variant='link'
        >
          {application.job.title}
        </Button>

        <p className='text-sm text-muted-foreground'>{application.job.company.name}</p>
      </TableCell>

      <TableCell>
        <ApplicationStatusBadge status={application.status} />
      </TableCell>

      <TableCell className='text-muted-foreground'>{submittedDate}</TableCell>

      <TableCell className='text-right'>
        <Button
          aria-label={`View application from ${applicantName} for ${application.job.title}`}
          onClick={handleViewApplication}
          size='sm'
          type='button'
          variant='outline'
        >
          View details
        </Button>
      </TableCell>
    </TableRow>
  );
};
