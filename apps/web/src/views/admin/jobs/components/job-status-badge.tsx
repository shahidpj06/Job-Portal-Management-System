import { memo } from 'react';

import { Badge } from '@/components/ui/badge';
import type { JobStatus } from '@/types';
import { formatJobStatus } from '@/utils/formatters';

interface IAdminJobStatusBadgeProps {
  status: JobStatus;
}

const JOB_STATUS_STYLES: Record<JobStatus, string> = {
  CLOSED: 'border-border bg-muted text-muted-foreground',
  DRAFT: 'border-yellow-200 bg-yellow-50 text-yellow-700',
  PUBLISHED: 'border-emerald-200 bg-emerald-50 text-emerald-700'
};

const AdminJobStatusBadgeComponent = ({ status }: IAdminJobStatusBadgeProps) => {
  return (
    <Badge className={`border text-xs ${JOB_STATUS_STYLES[status]}`}>
      {formatJobStatus(status)}
    </Badge>
  );
};

export const AdminJobStatusBadge = memo(AdminJobStatusBadgeComponent);
