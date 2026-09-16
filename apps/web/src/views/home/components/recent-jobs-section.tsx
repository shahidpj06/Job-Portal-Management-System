import { ArrowRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { IJobData } from '@/types';
import { Button } from '@/components/ui/button';
import { paths } from '@/utils/paths';
import { JobCard } from '@/views/jobs/components/job-card';

import { SectionHeading } from './section-heading';

const RECENT_JOBS_SKELETON_KEYS = [
  'recent-job-skeleton-1',
  'recent-job-skeleton-2',
  'recent-job-skeleton-3',
  'recent-job-skeleton-4',
  'recent-job-skeleton-5',
  'recent-job-skeleton-6'
];

interface RecentJobsSectionProps {
  isError?: boolean;
  isLoading?: boolean;
  jobs: IJobData[];
  onApply: (jobId: string) => void;
}

export const RecentJobsSection = ({
  isError,
  isLoading,
  jobs,
  onApply
}: RecentJobsSectionProps) => (
  <section className='border-t border-border/80 bg-muted/30 px-4 py-16 md:py-20'>
    <div className='mx-auto max-w-[1200px]'>
      <SectionHeading
        action={
          <Button
            asChild
            className='self-start rounded-xl border-border font-semibold hover:bg-muted sm:self-auto'
            size='sm'
            variant='outline'
          >
            <Link to={paths.jobs}>
              <span>Browse all jobs</span>
              <ArrowRight className='ml-1.5 h-3.5 w-3.5' />
            </Link>
          </Button>
        }
        description='Explore the newest job openings from verified hiring companies'
        eyebrow='Latest Opportunities'
        title='Recent Jobs'
      />

      {isLoading ? (
        <div className='grid gap-4'>
          {RECENT_JOBS_SKELETON_KEYS.map((skeletonKey) => (
            <div
              key={skeletonKey}
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
          asChild
          className='rounded-xl bg-primary px-6 font-semibold text-primary-foreground shadow-sm hover:bg-primary/90'
          size='lg'
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
