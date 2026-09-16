import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { IJobData } from '@/types';

import { AdminJobMobileCard } from './job-mobile-card';
import { AdminJobTableRow } from './job-table-row';

interface AdminJobsTableProps {
  deletingJobId: string | null;
  jobs: IJobData[];
  onDelete: (jobId: string) => Promise<void>;
}

export const AdminJobsTable = ({ deletingJobId, jobs, onDelete }: AdminJobsTableProps) => (
  <>
    <div className='hidden overflow-x-auto rounded-lg border border-border md:block'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Actions</TableHead>
            <TableHead>Applications</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Posted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {jobs.map((job) => (
            <AdminJobTableRow
              key={job.id}
              isDeleting={deletingJobId === job.id}
              job={job}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>

    <div className='space-y-3 md:hidden'>
      {jobs.map((job) => (
        <AdminJobMobileCard
          key={job.id}
          isDeleting={deletingJobId === job.id}
          job={job}
          onDelete={onDelete}
        />
      ))}
    </div>
  </>
);
