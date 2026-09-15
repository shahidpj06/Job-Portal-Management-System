import { memo } from 'react';

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { IApplicationListItem } from '@/types/application';

import { ApplicationTableRow } from './application-table-row';

interface ApplicationsTableProps {
  applications: IApplicationListItem[];
  onView: (applicationId: string) => void;
  onFilterJob: (jobId: string) => void;
}

export const ApplicationsTable = memo((props: ApplicationsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Applicant</TableHead>
          <TableHead>Job</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead className='text-right'>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {props.applications.map((application) => (
          <ApplicationTableRow
            key={application.id}
            application={application}
            onView={props.onView}
            onFilterJob={props.onFilterJob}
          />
        ))}
      </TableBody>
    </Table>
  );
});

ApplicationsTable.displayName = 'ApplicationsTable';
