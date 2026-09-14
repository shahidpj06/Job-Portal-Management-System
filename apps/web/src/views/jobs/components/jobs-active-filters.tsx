import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface JobsActiveFilter {
  id: string;
  field: string;
  label: string;
  value?: string;
}

interface JobsActiveFiltersProps {
  filters: JobsActiveFilter[];
  onRemove: (filter: JobsActiveFilter) => void;
  onReset: () => void;
}

export const JobsActiveFilters = (props: JobsActiveFiltersProps) => {
  return (
    <div className='flex min-w-0 items-center gap-2 rounded-xl md:bg-surface md:px-3 md:py-2'>
      <span className='hidden shrink-0 text-[10px] font-medium uppercase text-muted-foreground md:block'>
        Active filters:
      </span>

      <div className='flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-1 md:flex-wrap'>
        {props.filters.length === 0 && (
          <span className='text-xs text-muted-foreground'>All published jobs</span>
        )}

        {props.filters.map((filter) => (
          <Badge
            key={filter.id}
            variant='secondary'
            className='h-auto shrink-0 gap-1 rounded-full bg-primary/10 py-0.5 pl-2.5 pr-1 text-xs text-muted-background font-normal'
          >
            <span className='max-w-40 truncate font-semibold'>{filter.label}</span>

            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => props.onRemove(filter)}
              aria-label={`Remove ${filter.label} filter`}
              className='size-6 rounded-full hover:bg-primary/10'
            >
              <X aria-hidden='true' className='size-3' />
            </Button>
          </Badge>
        ))}
      </div>

      {props.filters.length > 0 && (
        <Button
          type='button'
          variant='link'
          onClick={props.onReset}
          className='h-auto shrink-0 p-0 text-xs'
        >
          Clear all
        </Button>
      )}
    </div>
  );
};
