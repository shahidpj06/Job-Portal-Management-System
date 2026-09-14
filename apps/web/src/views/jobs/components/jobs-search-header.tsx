import { useCallback, useState, type FormEvent } from 'react';
import { ArrowRight, MapPin, SlidersHorizontal } from 'lucide-react';

import { SearchInput } from '@/components/search/search-input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface JobsSearchHeaderProps {
  initialQuery: string;
  initialLocation: string;
  activeFilterCount: number;
  filtersOpen: boolean;
  filterPanelId: string;
  onSearch: (query: string, location: string) => void;
  onToggleFilters: () => void;
}

export const JobsSearchHeader = (props: JobsSearchHeaderProps) => {
  const [query, setQuery] = useState(props.initialQuery);
  const [location, setLocation] = useState(props.initialLocation);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      props.onSearch(query.trim(), location.trim());
    },
    [props.onSearch, query, location]
  );

  return (
    <section className='border-b border-primary/5 bg-primary/[0.035]'>
      <div className='mx-auto max-w-[1200px] px-4 py-8 md:px-8 md:py-10'>
        <div className='mb-5 space-y-3'>
          <p className='inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary'>
            <span aria-hidden='true' className='size-1.5 rounded-full bg-primary' />
            Live Talent Marketplace
          </p>

          <h1 className='max-w-3xl text-2xl font-bold leading-tight tracking-tight md:text-3xl'>
            Find your next career defining role
          </h1>

          <p className='max-w-2xl text-sm leading-relaxed text-muted-foreground'>
            Discover opportunities across companies, locations and career levels.
          </p>
        </div>

        <form
          role='search'
          aria-label='Search job listings'
          onSubmit={onSubmit}
          className='grid grid-cols-2 gap-2 rounded-xl bg-surface p-2.5 shadow-sm md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]'
        >
          <SearchInput
            value={query}
            onValueChange={setQuery}
            maxLength={100}
            placeholder='Job title or company'
            aria-label='Job title or company'
            wrapperClassName='col-span-2 min-w-0 md:col-span-1'
            className='h-11 rounded-lg border-0 bg-primary/5 text-sm shadow-none'
          />

          <div className='relative col-span-2 min-w-0 md:col-span-1'>
            <MapPin
              aria-hidden='true'
              className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground'
            />

            <Input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              maxLength={100}
              placeholder='City, country or Remote'
              aria-label='Job location'
              className='h-11 rounded-lg border-0 bg-primary/5 pl-9 text-sm shadow-none'
            />
          </div>

          <Button
            type='button'
            variant='secondary'
            onClick={props.onToggleFilters}
            aria-expanded={props.filtersOpen}
            aria-controls={props.filterPanelId}
            className='h-11 rounded-lg bg-primary/10 text-muted-background md:hidden'
          >
            <SlidersHorizontal aria-hidden='true' className='size-4' />
            Filters
            {props.activeFilterCount > 0 && (
              <Badge className='h-5 min-w-5 justify-center px-1 text-[10px]'>
                {props.activeFilterCount}
              </Badge>
            )}
          </Button>

          <Button type='submit' className='h-11 rounded-lg px-6'>
            Search Jobs
            <ArrowRight aria-hidden='true' className='size-4' />
          </Button>
        </form>
      </div>
    </section>
  );
};
