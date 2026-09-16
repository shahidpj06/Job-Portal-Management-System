import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { IApplicationListItem } from '@/types/application';

import { ApplicationTableRow } from './application-table-row';

interface ApplicationsTableProps {
  applications: IApplicationListItem[];
  onFilterJob: (jobId: string) => void;
  onView: (applicationId: string) => void;
}

export const ApplicationsTable = ({
  applications,
  onFilterJob,
  onView
}: ApplicationsTableProps) => {
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
        {applications.map((application) => (
          <ApplicationTableRow
            key={application.id}
            application={application}
            onFilterJob={onFilterJob}
            onView={onView}
          />
        ))}
      </TableBody>
    </Table>
  );
};
