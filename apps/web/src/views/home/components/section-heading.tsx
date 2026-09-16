import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const SectionHeading = ({ eyebrow, title, description, action }: SectionHeadingProps) => (
  <div className='mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
    <div>
      {eyebrow && (
        <p className='mb-1 text-xs font-semibold uppercase tracking-wide text-primary'>{eyebrow}</p>
      )}

      <h2 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>{title}</h2>

      {description && (
        <p className='mt-1 text-sm text-muted-foreground sm:text-base'>{description}</p>
      )}
    </div>

    {action}
  </div>
);
