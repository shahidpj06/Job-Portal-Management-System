import { memo, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ResultsPaginationProps {
  page: number;
  pageCount: number;
  totalItems?: number;
  itemLabel?: string;
  disabled?: boolean;
  className?: string;
  onPageChange: (page: number) => void;
}

type PaginationItem = number | 'start-ellipsis' | 'end-ellipsis';

const getPaginationItems = (page: number, pageCount: number): PaginationItem[] => {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const visiblePages = new Set([1, pageCount, page - 1, page, page + 1]);

  if (page <= 2) {
    visiblePages.add(2);
    visiblePages.add(3);
  }

  if (page >= pageCount - 1) {
    visiblePages.add(pageCount - 1);
    visiblePages.add(pageCount - 2);
  }

  const sortedPages = [...visiblePages]
    .filter((value) => value >= 1 && value <= pageCount)
    .sort((first, second) => first - second);

  const items: PaginationItem[] = [];

  sortedPages.forEach((value, index) => {
    const previous = sortedPages[index - 1];

    if (previous !== undefined) {
      const gap = value - previous;

      if (gap === 2) {
        items.push(previous + 1);
      } else if (gap > 2) {
        items.push(value <= page ? 'start-ellipsis' : 'end-ellipsis');
      }
    }

    items.push(value);
  });

  return items;
};

export const ResultsPagination = memo(
  ({
    page,
    pageCount,
    totalItems,
    itemLabel = 'items',
    disabled = false,
    className,
    onPageChange
  }: ResultsPaginationProps) => {
    const items = useMemo(() => getPaginationItems(page, pageCount), [page, pageCount]);

    const summary = useMemo(() => {
      const count =
        totalItems === undefined ? '' : ` (${totalItems.toLocaleString()} ${itemLabel})`;

      return `Page ${page} of ${pageCount}${count}`;
    }, [page, pageCount, totalItems, itemLabel]);

    const handlePageChange = useCallback(
      (nextPage: number) => {
        if (disabled || nextPage === page || nextPage < 1 || nextPage > pageCount) {
          return;
        }

        onPageChange(nextPage);
      },
      [disabled, page, pageCount, onPageChange]
    );

    const handlePrevious = useCallback(() => {
      handlePageChange(page - 1);
    }, [handlePageChange, page]);

    const handleNext = useCallback(() => {
      handlePageChange(page + 1);
    }, [handlePageChange, page]);

    if (pageCount < 1) {
      return null;
    }

    return (
      <nav
        aria-label='Results pagination'
        className={cn(
          'flex flex-col gap-3 rounded-xl border border-border/40',
          'bg-surface p-3 sm:flex-row sm:items-center sm:justify-between',
          className
        )}
      >
        <p className='text-xs text-muted-foreground'>{summary}</p>

        <div className='flex flex-wrap items-center justify-end gap-1'>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='size-8 rounded-md bg-primary/5 text-primary hover:bg-primary/10'
            disabled={disabled || page <= 1}
            onClick={handlePrevious}
            aria-label='Previous page'
          >
            <ChevronLeft aria-hidden='true' className='size-4' />
          </Button>

          {items.map((item) =>
            typeof item === 'number' ? (
              <Button
                key={item}
                type='button'
                variant={item === page ? 'default' : 'ghost'}
                size='icon'
                disabled={disabled}
                onClick={() => handlePageChange(item)}
                aria-label={`Go to page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                className={cn(
                  'size-8 rounded-md text-xs font-semibold',
                  item !== page && 'bg-primary/10 text-foreground hover:bg-primary/15'
                )}
              >
                {item}
              </Button>
            ) : (
              <span
                key={item}
                aria-hidden='true'
                className='flex size-6 items-center justify-center text-muted-foreground'
              >
                …
              </span>
            )
          )}

          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='size-8 rounded-md bg-primary/5 text-primary hover:bg-primary/10'
            disabled={disabled || page >= pageCount}
            onClick={handleNext}
            aria-label='Next page'
          >
            <ChevronRight aria-hidden='true' className='size-4' />
          </Button>
        </div>
      </nav>
    );
  }
);

ResultsPagination.displayName = 'ResultsPagination';
