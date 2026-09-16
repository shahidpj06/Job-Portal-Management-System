import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { paths } from '@/utils/paths';

interface CtaBannerProps {
  title: string;
  description: string;
  isAuthenticated?: boolean;
}

export const CtaBanner = ({ title, description, isAuthenticated }: CtaBannerProps) => (
  <section className='bg-gradient-to-r from-primary via-indigo-600 to-indigo-700 px-4 py-16 text-center text-primary-foreground md:py-20'>
    <div className='mx-auto max-w-2xl space-y-4'>
      <h2 className='text-3xl font-extrabold tracking-tight text-white sm:text-4xl'>{title}</h2>

      <p className='mx-auto max-w-xl text-base leading-relaxed text-indigo-100 sm:text-lg'>
        {description}
      </p>

      <div className='flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row'>
        {!isAuthenticated && (
          <Button
            size='lg'
            asChild
            className='w-full rounded-xl bg-surface font-bold text-primary shadow-md hover:bg-surface/90 sm:w-auto'
          >
            <Link to={paths.auth['sign-up']}>Create Free Account</Link>
          </Button>
        )}

        <Button
          variant='outline'
          size='lg'
          asChild
          className='w-full rounded-xl border-white/30 bg-white/10 font-semibold text-white backdrop-blur-sm hover:bg-white/20 sm:w-auto'
        >
          <Link to={paths.jobs}>Browse Jobs</Link>
        </Button>
      </div>
    </div>
  </section>
);

