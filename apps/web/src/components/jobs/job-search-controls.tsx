import { BriefcaseBusiness, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { mockCategories } from '@/mocks';

interface JobSearchControlsProps {
  query: string;
  location: string;
  categoryId: string;
  onQueryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function JobSearchControls({
  query,
  location,
  categoryId,
  onQueryChange,
  onLocationChange,
  onCategoryChange
}: JobSearchControlsProps) {
  return (
    <section className='border-y border-border/60 bg-muted/50 py-5 sm:py-6'>
      <div className='mx-auto max-w-[1200px] px-4 md:px-8'>
        <div className='rounded-2xl border border-border/70 bg-surface p-2 shadow-[var(--shadow-level-1)]'>
          <div className='grid gap-2 md:grid-cols-12'>
            <label className='flex min-h-14 items-center gap-3 rounded-xl bg-muted/60 px-4 md:col-span-5'>
              <Search className='size-5 shrink-0 text-primary' aria-hidden='true' />
              <span className='min-w-0 flex-1'>
                <span className='block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground'>
                  What
                </span>
                <Input
                  value={query}
                  onChange={(event) => onQueryChange(event.target.value)}
                  placeholder='Job title, skill, or company'
                  className='h-5 border-0 bg-transparent p-0 text-sm shadow-none placeholder:text-muted-foreground focus-visible:ring-0'
                />
              </span>
            </label>
            <div className='flex min-h-14 items-center gap-3 rounded-xl bg-muted/60 px-4 md:col-span-3'>
              <MapPin className='size-5 shrink-0 text-secondary' aria-hidden='true' />
              <label className='min-w-0 flex-1'>
                <span className='block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground'>
                  Where
                </span>
                <Select value={location} onValueChange={onLocationChange}>
                  <SelectTrigger className='h-5 w-full border-0 bg-transparent p-0 text-sm shadow-none focus:ring-0'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Anywhere / Remote</SelectItem>
                    <SelectItem value='Remote'>Remote</SelectItem>
                    <SelectItem value='New York'>New York, NY</SelectItem>
                    <SelectItem value='San Francisco'>San Francisco, CA</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>
            <div className='flex min-h-14 items-center gap-3 rounded-xl bg-muted/60 px-4 md:col-span-2'>
              <BriefcaseBusiness className='size-5 shrink-0 text-tertiary' aria-hidden='true' />
              <label className='min-w-0 flex-1'>
                <span className='block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground'>
                  Field
                </span>
                <Select value={categoryId} onValueChange={onCategoryChange}>
                  <SelectTrigger className='h-5 w-full border-0 bg-transparent p-0 text-sm shadow-none focus:ring-0'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All disciplines</SelectItem>
                    {mockCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>
            <Button className='min-h-14 rounded-xl md:col-span-2' type='button'>
              Search jobs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
