import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { EmptyState, ErrorState, LoadingState } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardListSectionProps {
  children: ReactNode;
  emptyMessage: string;
  errorMessage?: string;
  isEmpty: boolean;
  isLoading: boolean;
  onRetry: () => void;
  title: string;
  viewAllPath: string;
}

export const DashboardListSection = ({
  children,
  emptyMessage,
  errorMessage,
  isEmpty,
  isLoading,
  onRetry,
  title,
  viewAllPath
}: DashboardListSectionProps) => {
  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (errorMessage) {
      return <ErrorState description={errorMessage} onRetry={onRetry} />;
    }

    if (isEmpty) {
      return <EmptyState title={emptyMessage} />;
    }

    return children;
  };

  return (
    <Card className='min-w-0'>
      <CardHeader className='flex flex-row items-center justify-between gap-2 pb-3'>
        <CardTitle className='text-base'>{title}</CardTitle>

        <Button asChild size='sm' variant='ghost'>
          <Link to={viewAllPath}>
            View all
            <ArrowRight aria-hidden='true' className='ml-1 size-4' />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className='space-y-3 pt-0'>{renderContent()}</CardContent>
    </Card>
  );
};
