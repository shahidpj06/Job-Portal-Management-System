import { memo, useCallback, useMemo } from 'react';

import { ApplicationStatusBadge } from '@/components/jobs/application-status-badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import type { IApplicationListItem } from '@/types/application';

interface ApplicationTableRowProps {
  application: IApplicationListItem;
  onView: (applicationId: string) => void;
  onFilterJob: (jobId: string) => void;
}

export const ApplicationTableRow = memo((props: ApplicationTableRowProps) => {
  const applicantName = useMemo(
    () => `${props.application.user.firstName} ${props.application.user.lastName}`.trim(),
    [props.application.user.firstName, props.application.user.lastName]
  );

  const submittedDate = useMemo(
    () =>
      new Intl.DateTimeFormat('en', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(new Date(props.application.createdAt)),
    [props.application.createdAt]
  );

  const onView = useCallback(() => {
    props.onView(props.application.id);
  }, [props.onView, props.application.id]);

  const onFilterJob = useCallback(() => {
    props.onFilterJob(props.application.job.id);
  }, [props.onFilterJob, props.application.job.id]);

  return (
    <TableRow>
      <TableCell>
        <p className='font-medium'>{applicantName}</p>
        <p className='text-sm text-muted-foreground'>{props.application.user.email}</p>
      </TableCell>

      <TableCell>
        <Button
          type='button'
          variant='link'
          className='h-auto justify-start p-0 text-left'
          onClick={onFilterJob}
          aria-label={`Filter applications for ${props.application.job.title}`}
        >
          {props.application.job.title}
        </Button>

        <p className='text-sm text-muted-foreground'>{props.application.job.company.name}</p>
      </TableCell>

      <TableCell>
        <ApplicationStatusBadge status={props.application.status} />
      </TableCell>

      <TableCell className='text-muted-foreground'>{submittedDate}</TableCell>

      <TableCell className='text-right'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={onView}
          aria-label={`View application from ${applicantName} for ${props.application.job.title}`}
        >
          View details
        </Button>
      </TableCell>
    </TableRow>
  );
});

ApplicationTableRow.displayName = 'ApplicationTableRow';
