import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PATHS } from '@/utils/paths';

interface HeroSearchConsoleProps {
  initialQuery?: string;
  initialLocation?: string;
  className?: string;
}

export function HeroSearchConsole({
  initialQuery = '',
  initialLocation = '',
  className = ''
}: HeroSearchConsoleProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (location.trim()) params.set('location', location.trim());

    const queryString = params.toString();
    navigate(queryString ? `${PATHS.JOBS}?${queryString}` : PATHS.JOBS);
  }

  return (
    <form
      onSubmit={handleSearch}
      className={`w-full max-w-2xl mx-auto rounded-2xl bg-surface p-2 sm:p-2.5 border border-border/80 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.08),0_8px_10px_-6px_rgba(15,23,42,0.04)] transition-all focus-within:border-primary/50 focus-within:shadow-[0_14px_35px_-5px_rgba(79,70,229,0.12),0_8px_10px_-6px_rgba(15,23,42,0.04)] ${className}`}
    >
      <div className='flex flex-col gap-2 md:flex-row md:items-center'>
        {/* Field 1: Keywords */}
        <div className='relative flex-1 flex items-center'>
          <Search className='absolute left-3.5 h-4 w-4 text-muted-foreground shrink-0 pointer-events-none' />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Job title, skills, or company...'
            className='h-12 border-0 bg-transparent pl-10 pr-3 text-sm md:text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70'
          />
        </div>

        {/* Divider (Desktop) */}
        <div className='hidden h-7 w-px bg-border/80 md:block' />

        {/* Field 2: Location */}
        <div className='relative flex-1 flex items-center'>
          <MapPin className='absolute left-3.5 h-4 w-4 text-muted-foreground shrink-0 pointer-events-none' />
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder='City, state, or remote'
            className='h-12 border-0 bg-transparent pl-10 pr-3 text-sm md:text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70'
          />
        </div>

        {/* Submit Button */}
        <Button
          type='submit'
          size='lg'
          className='h-12 px-7 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shrink-0 shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2'
        >
          <span>Search Jobs</span>
          <ArrowRight className='h-4 w-4' />
        </Button>
      </div>
    </form>
  );
}
