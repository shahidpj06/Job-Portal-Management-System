import type { ComponentProps } from 'react';
import { Link } from 'react-router-dom';

import { CareerProgressVisual } from '@/components/home';
import { Button } from '@/components/ui/button';
import { paths } from '@/utils/paths';

import { ValuePointItem } from './value-point-item';

type Milestone = ComponentProps<typeof CareerProgressVisual>['milestones'][number];

interface WhyChooseSectionProps {
  appName: string;
  isAuthenticated?: boolean;
  milestones: Milestone[];
  points: string[];
}

export const WhyChooseSection = ({ appName, isAuthenticated, milestones, points }: WhyChooseSectionProps) => (
  <section className='border-t border-border/80 px-4 py-16 md:py-24'>
    <div className='mx-auto max-w-[1200px]'>
      <div className='grid gap-12 lg:grid-cols-2 lg:items-center'>
        <div className='space-y-6'>
          <div>
            <h2 className='text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl'>
              Why Choose {appName}?
            </h2>

            <p className='mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg'>
              We make the job search smarter, faster, and more rewarding for candidates and
              employers alike.
            </p>
          </div>

          <ul className='space-y-3.5'>
            {points.map((point) => (
              <ValuePointItem key={point} text={point} />
            ))}
          </ul>

          {!isAuthenticated && (
            <div className='pt-2'>
              <Button
                size='lg'
                asChild
                className='rounded-xl bg-primary px-7 font-semibold text-primary-foreground shadow-sm hover:bg-primary/90'
              >
                <Link to={paths.auth['sign-up']}>Get Started Free</Link>
              </Button>
            </div>
          )}
        </div>

        <div>
          <CareerProgressVisual milestones={milestones} />
        </div>
      </div>
    </div>
  </section>
);

