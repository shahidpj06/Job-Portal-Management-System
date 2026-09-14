import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ApplicationStatusBadge } from '@/components/jobs';
import { EmptyState } from '@/components/common';
import { mockApplications } from '@/mocks';
import { formatDate } from '@/utils/formatters';
import { paths } from '@/utils/paths';

export function ApplicationsPage() {
  const myApps = mockApplications;

  return (
    <div className='mx-auto max-w-[1200px] px-4 py-8 md:px-8'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>My Applications</h1>
        <p className='mt-1 text-muted-foreground'>
          {myApps.length} application{myApps.length !== 1 ? 's' : ''} submitted
        </p>
      </div>

      {myApps.length === 0 ? (
        <EmptyState
          title='No applications yet'
          description='Start applying to jobs and track your progress here.'
          action={
            <Button asChild>
              <Link to={paths.jobs}>Browse Jobs</Link>
            </Button>
          }
        />
      ) : (
        <div className='space-y-4'>
          {myApps.map((app) => {
            const job = app.job;
            if (!job) return null;
            return (
              <Card key={app.id} className='border border-border bg-surface'>
                <CardContent className='p-5'>
                  <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex items-start gap-4'>
                      <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-lg font-bold text-muted-foreground'>
                        {job.company.name.charAt(0)}
                      </div>
                      <div>
                        <Link
                          to={paths['job-details'](job.id)}
                          className='font-semibold hover:text-primary transition-colors'
                        >
                          {job.title}
                        </Link>
                        <div className='mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-muted-foreground'>
                          <span className='flex items-center gap-1'>
                            <Briefcase className='h-3.5 w-3.5' />
                            {job.company.name}
                          </span>
                          <span className='flex items-center gap-1'>
                            <MapPin className='h-3.5 w-3.5' />
                            {job.location}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Clock className='h-3.5 w-3.5' />
                            Applied {formatDate(app.appliedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='sm:text-right'>
                      <ApplicationStatusBadge status={app.status} />
                      <p className='mt-1 text-xs text-muted-foreground'>
                        Updated {formatDate(app.updatedAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
