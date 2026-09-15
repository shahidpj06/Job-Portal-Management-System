import { memo } from 'react';
import { Briefcase, Clock, TrendingUp, Users, type LucideIcon } from 'lucide-react';

import { ErrorState } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { IDashboardSummary } from '@/types/dashboard';

interface DashboardSummaryProps {
  summary?: IDashboardSummary;
  isLoading: boolean;
  errorMessage?: string;
  onRetry: () => void;
}

interface SummaryCard {
  key: keyof IDashboardSummary;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const SUMMARY_CARDS: SummaryCard[] = [
  {
    key: 'totalJobs',
    label: 'Total Jobs',
    description: 'All job listings',
    icon: Briefcase,
    color: 'bg-blue-50 text-blue-600'
  },
  {
    key: 'activeJobs',
    label: 'Active Jobs',
    description: 'Currently published',
    icon: TrendingUp,
    color: 'bg-emerald-50 text-emerald-600'
  },
  {
    key: 'totalApplications',
    label: 'Applications',
    description: 'Total applications submitted',
    icon: Users,
    color: 'bg-purple-50 text-purple-600'
  },
  {
    key: 'jobsPostedThisMonth',
    label: 'This Month',
    description: 'Jobs created this month · UTC',
    icon: Clock,
    color: 'bg-orange-50 text-orange-600'
  }
];

export const DashboardSummary = memo((props: DashboardSummaryProps) => {
  if (props.errorMessage && !props.isLoading) {
    return (
      <Card>
        <CardContent>
          <ErrorState
            title='Could not load dashboard counts'
            description={props.errorMessage}
            onRetry={props.onRetry}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4' aria-busy={props.isLoading}>
      {SUMMARY_CARDS.map(({ key, label, description, icon: Icon, color }) => (
        <Card key={key}>
          <CardContent>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-medium text-muted-foreground'>{label}</p>

              <div className={`rounded-lg p-1 ${color}`}>
                <Icon aria-hidden='true' className='h-7 w-7' />
              </div>
            </div>

            {props.isLoading ? (
              <Skeleton className='mt-2 h-9 w-20' />
            ) : (
              <p className='text-4xl font-bold'>
                {props.summary?.[key].toLocaleString() ?? '—'}
              </p>
            )}

            <p className='mt-1 text-xs text-muted-foreground'>{description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

DashboardSummary.displayName = 'DashboardSummary';
