import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface JobsActiveFilter {
  field: string;
  id: string;
  label: string;
  value?: string;
}

interface JobsActiveFiltersProps {
  filters: JobsActiveFilter[];
  onRemove: (filter: JobsActiveFilter) => void;
  onReset: () => void;
}

export const JobsActiveFilters = ({ filters, onRemove, onReset }: JobsActiveFiltersProps) => (
  <div className='flex min-w-0 items-center gap-2 rounded-xl md:bg-surface md:px-3 md:py-2'>
    <span className='hidden shrink-0 text-[10px] font-medium uppercase text-muted-foreground md:block'>
      Active filters:
    </span>

    <div className='flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-1 md:flex-wrap'>
      {filters.length === 0 && (
        <span className='text-xs text-muted-foreground'>All published jobs</span>
      )}

      {filters.map((filter) => (
        <Badge
          key={filter.id}
          className='h-auto shrink-0 gap-1 rounded-full bg-primary/10 py-0.5 pl-2.5 pr-1 text-xs font-normal text-muted-background'
          variant='secondary'
        >
          <span className='max-w-40 truncate font-semibold'>{filter.label}</span>

          <Button
            aria-label={`Remove ${filter.label} filter`}
            className='size-6 rounded-full hover:bg-primary/10'
            onClick={() => onRemove(filter)}
            size='icon'
            type='button'
            variant='ghost'
          >
            <X aria-hidden='true' className='size-3' />
          </Button>
        </Badge>
      ))}
    </div>

    {filters.length > 0 && (
      <Button
        className='h-auto shrink-0 p-0 text-xs'
        onClick={onReset}
        type='button'
        variant='link'
      >
        Clear all
      </Button>
    )}
  </div>
);
