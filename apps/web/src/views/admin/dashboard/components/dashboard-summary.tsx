import { Briefcase, Clock, TrendingUp, Users, type LucideIcon } from 'lucide-react';

import { ErrorState } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { IDashboardSummary } from '@/types/dashboard';

interface DashboardSummaryProps {
  errorMessage?: string;
  isLoading: boolean;
  onRetry: () => void;
  summary?: IDashboardSummary;
}

interface SummaryCard {
  description: string;
  icon: LucideIcon;
  iconClassName: string;
  key: keyof IDashboardSummary;
  label: string;
}

const SUMMARY_CARDS: SummaryCard[] = [
  {
    description: 'All job listings',
    icon: Briefcase,
    iconClassName: 'bg-blue-50 text-blue-600',
    key: 'totalJobs',
    label: 'Total Jobs'
  },
  {
    description: 'Currently published',
    icon: TrendingUp,
    iconClassName: 'bg-emerald-50 text-emerald-600',
    key: 'activeJobs',
    label: 'Active Jobs'
  },
  {
    description: 'Total applications submitted',
    icon: Users,
    iconClassName: 'bg-purple-50 text-purple-600',
    key: 'totalApplications',
    label: 'Applications'
  },
  {
    description: 'Jobs created this month · UTC',
    icon: Clock,
    iconClassName: 'bg-orange-50 text-orange-600',
    key: 'jobsPostedThisMonth',
    label: 'This Month'
  }
];

export const DashboardSummary = ({
  errorMessage,
  isLoading,
  onRetry,
  summary
}: DashboardSummaryProps) => {
  if (errorMessage && !isLoading) {
    return (
      <Card>
        <CardContent>
          <ErrorState
            description={errorMessage}
            onRetry={onRetry}
            title='Could not load dashboard counts'
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div aria-busy={isLoading} className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {SUMMARY_CARDS.map(({ description, icon: Icon, iconClassName, key, label }) => (
        <Card key={key}>
          <CardContent>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-medium text-muted-foreground'>{label}</p>

              <div className={`rounded-lg p-1 ${iconClassName}`}>
                <Icon aria-hidden='true' className='size-7' />
              </div>
            </div>

            {isLoading ? (
              <Skeleton className='mt-2 h-9 w-20' />
            ) : (
              <p className='text-4xl font-bold'>{summary?.[key].toLocaleString() ?? '—'}</p>
            )}

            <p className='mt-1 text-xs text-muted-foreground'>{description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
