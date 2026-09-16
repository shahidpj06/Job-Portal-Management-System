import { Link } from 'react-router-dom';

import { HeroSearchConsole } from '@/components/jobs';
import { paths } from '@/utils/paths';

interface HeroSectionProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  popularSearches: string[];
}

export const HeroSection = ({
  eyebrow,
  title,
  subtitle,
  popularSearches
}: HeroSectionProps) => (
  <section className='relative overflow-hidden bg-gradient-to-b from-primary/5 via-surface/40 to-background px-4 pt-14 pb-16 text-center sm:pt-20 sm:pb-24 md:pt-24 md:pb-28'>
    <div
      aria-hidden='true'
      className='pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(70%_45%_at_50%_30%,rgba(79,70,229,0.15),rgba(79,70,229,0)_100%)]'
    />
    <div className='relative mx-auto max-w-4xl'>
      <p className='mb-3 inline-flex items-center gap-2 rounded-full bg-primary/5 px-5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary'>
        <span aria-hidden='true' className='size-1.5 rounded-full bg-primary' />
        {eyebrow}
      </p>

      <h1 className='text-4xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-5xl md:text-6xl'>
        {title}
      </h1>

      <p className='mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-lg'>
        {subtitle}
      </p>

      <div className='mt-8 sm:mt-10'>
        <HeroSearchConsole />
      </div>

      <div className='mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground sm:text-sm'>
        <span className='font-medium text-foreground/80'>Popular:</span>

        {popularSearches.map((term) => (
          <Link
            key={term}
            to={`${paths.jobs}?q=${encodeURIComponent(term)}`}
            className='rounded-md px-1.5 py-0.5 underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary'
          >
            {term}
          </Link>
        ))}
      </div>
    </div>
  </section>
);