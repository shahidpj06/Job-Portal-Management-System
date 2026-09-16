import type { ReactNode } from 'react';

interface StatMetricCardProps {
  icon?: ReactNode;
  value: string;
  label: string;
}

export const StatMetricCard = ({ value, label }: StatMetricCardProps) => (
  <div className='flex flex-col items-center gap-2 text-center'>
    <span className='text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl'>
      {value}
    </span>

    <span className='text-sm font-medium text-muted-foreground'>{label}</span>
  </div>
);
