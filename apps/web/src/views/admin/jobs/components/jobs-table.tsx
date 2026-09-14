import { memo } from 'react';

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { IJobData } from '@/types';
import { AdminJobTableRow } from './job-table-row';
import { AdminJobMobileCard } from './job-mobile-card';


interface IAdminJobsTableProps {
  deletingJobId: string | null;
  jobs: IJobData[];
  onDelete: (jobId: string) => Promise<void>;
}

const AdminJobsTableComponent = ({ deletingJobId, jobs, onDelete }: IAdminJobsTableProps) => {
  return (
    <>
      <div className='hidden overflow-x-auto rounded-lg border border-border md:block'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
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
};

export const AdminJobsTable = memo(AdminJobsTableComponent);
