import { memo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { EmptyState, ErrorState, LoadingState } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardListSectionProps {
  title: string;
  viewAllPath: string;
  isLoading: boolean;
  isEmpty: boolean;
  emptyMessage: string;
  errorMessage?: string;
  onRetry: () => void;
  children: ReactNode;
}

export const DashboardListSection = memo((props: DashboardListSectionProps) => {
  return (
    <Card className='min-w-0'>
      <CardHeader className='flex flex-row items-center justify-between gap-2 pb-3'>
        <CardTitle className='text-base'>{props.title}</CardTitle>

        <Button asChild variant='ghost' size='sm'>
          <Link to={props.viewAllPath}>
            View all
            <ArrowRight aria-hidden='true' className='ml-1 h-4 w-4' />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className='space-y-3 pt-0'>
        {props.isLoading ? (
          <LoadingState />
        ) : props.errorMessage ? (
          <ErrorState description={props.errorMessage} onRetry={props.onRetry} />
        ) : props.isEmpty ? (
          <EmptyState title={props.emptyMessage} />
        ) : (
          props.children
        )}
      </CardContent>
    </Card>
  );
});

DashboardListSection.displayName = 'DashboardListSection';
