import { ArrowRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

import { JobCard } from '@/views/jobs/components/job-card';
import { Button } from '@/components/ui/button';
import { paths } from '@/utils/paths';
import type { IJobData } from '@/types';
import { SectionHeading } from './section-heading';

interface RecentJobsSectionProps {
  jobs: IJobData[];
  isLoading?: boolean;
  isError?: boolean;
  onApply: (jobId: string) => void;
}

export const RecentJobsSection = ({
  jobs,
  isLoading,
  isError,
  onApply
}: RecentJobsSectionProps) => (
  <section className='border-t border-border/80 bg-muted/30 px-4 py-16 md:py-20'>
    <div className='mx-auto max-w-[1200px]'>
      <SectionHeading
        eyebrow='Latest Opportunities'
        title='Recent Jobs'
        description='Explore the newest job openings from verified hiring companies'
        action={
          <Button
            variant='outline'
            size='sm'
            asChild
            className='self-start rounded-xl border-border font-semibold hover:bg-muted sm:self-auto'
          >
            <Link to={paths.jobs}>
              <span>Browse all jobs</span>
              <ArrowRight className='ml-1.5 h-3.5 w-3.5' />
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <div className='grid gap-4'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='h-48 animate-pulse rounded-2xl border border-border/60 bg-card p-5'
            />
          ))}
        </div>
      ) : isError ? (
        <div className='rounded-2xl border border-border/80 bg-card p-8 text-center text-muted-foreground'>
          <p>Unable to load recent jobs right now. Please try again later.</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className='rounded-2xl border border-border/80 bg-card p-8 text-center text-muted-foreground'>
          <Briefcase className='mx-auto mb-2 h-8 w-8 text-muted-foreground/60' />
          <p className='font-medium'>No job postings available yet.</p>
        </div>
      ) : (
        <div className='grid gap-4'>
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onApply={onApply} />
          ))}
        </div>
      )}

      <div className='mt-10 text-center'>
        <Button
          size='lg'
          asChild
          className='rounded-xl bg-primary px-6 font-semibold text-primary-foreground shadow-sm hover:bg-primary/90'
        >
          <Link to={paths.jobs}>
            <span>View All Jobs</span>
            <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </Button>
      </div>
    </div>
  </section>
);
