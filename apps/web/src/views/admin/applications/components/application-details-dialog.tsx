import { useCallback, useMemo, useState, type MouseEvent } from 'react';

import { ErrorState, LoadingState } from '@/components/common';
import { ApplicationStatusBadge } from '@/components/jobs/application-status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { ApplicationStatus, IApplicationDetails } from '@/types/application';
import { formatApplicationStatus } from '@/utils/formatters';

const APPLICATION_STATUSES: ApplicationStatus[] = [
  'SUBMITTED',
  'REVIEWING',
  'INTERVIEWING',
  'OFFER',
  'REJECTED',
  'HIRED'
];

interface ApplicationDetailsDialogProps {
  open: boolean;
  application?: IApplicationDetails;
  isLoading: boolean;
  errorMessage?: string;
  resumeMessage?: string;
  isUpdatingStatus?: boolean;
  onClose: () => void;
  onRetry: () => void;
  onResumeClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  onUpdateStatus: (applicationId: string, status: ApplicationStatus) => void;
}

export const ApplicationDetailsDialog = ((props: ApplicationDetailsDialogProps) => {
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | ''>('');

  const applicantName = useMemo(() => {
    if (!props.application) {
      return 'Applicant details';
    }

    const { firstName, lastName } = props.application.user;

    return `${firstName} ${lastName}`.trim();
  }, [props.application]);

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        props.onClose();
      }
    },
    [props.onClose]
  );

  // Reset selected status whenever a new application is opened
  const application = props.application;
  const currentStatus = application?.status;

  const handleStatusChange = useCallback((value: string) => {
    setSelectedStatus(value as ApplicationStatus);
  }, []);

  const handleSaveStatus = useCallback(() => {
    if (!application || !selectedStatus || selectedStatus === currentStatus) return;
    props.onUpdateStatus(application.id, selectedStatus as ApplicationStatus);
    setSelectedStatus('');
  }, [application, currentStatus, selectedStatus, props.onUpdateStatus]);

  const isSaveDisabled =
    !selectedStatus ||
    selectedStatus === currentStatus ||
    props.isUpdatingStatus ||
    props.isLoading;

  return (
    <Dialog open={props.open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader className='pr-8'>
          <DialogTitle>{applicantName}</DialogTitle>
          <DialogDescription>
            Review the applicant's current profile and submitted application.
          </DialogDescription>
        </DialogHeader>

        {props.isLoading ? (
          <LoadingState />
        ) : props.errorMessage ? (
          <ErrorState description={props.errorMessage} onRetry={props.onRetry} />
        ) : application ? (
          <div className='space-y-6'>
            <section className='space-y-2'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <h2 className='font-semibold'>{application.job.title}</h2>
                <ApplicationStatusBadge status={application.status} />
              </div>

              <p className='text-sm text-muted-foreground'>{application.job.company.name}</p>
            </section>

            <section className='space-y-3 border-t pt-4'>
              <h2 className='font-semibold'>Contact details</h2>

              <dl className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <dt className='text-sm text-muted-foreground'>Email</dt>
                  <dd className='break-words'>{application.user.email}</dd>
                </div>

                <div>
                  <dt className='text-sm text-muted-foreground'>Phone</dt>
                  <dd>{application.user.phone || 'Not provided'}</dd>
                </div>

                <div>
                  <dt className='text-sm text-muted-foreground'>Location</dt>
                  <dd>{application.user.location || 'Not provided'}</dd>
                </div>

                <div>
                  <dt className='text-sm text-muted-foreground'>Headline</dt>
                  <dd>{application.user.headline || 'Not provided'}</dd>
                </div>
              </dl>
            </section>

            <section className='space-y-2 border-t pt-4'>
              <h2 className='font-semibold'>About</h2>
              <p className='whitespace-pre-wrap break-words text-sm text-muted-foreground'>
                {application.user.bio || 'Not provided'}
              </p>
            </section>

            <section className='space-y-2 border-t pt-4'>
              <h2 className='font-semibold'>Skills</h2>

              {application.user.skills.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                  {application.user.skills.map((skill, index) => (
                    <Badge key={`${skill}-${index}`} variant='outline'>
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-muted-foreground'>No skills provided.</p>
              )}
            </section>

            <section className='space-y-2 border-t pt-4'>
              <h2 className='font-semibold'>Cover letter</h2>
              <p className='whitespace-pre-wrap break-words text-sm text-muted-foreground'>
                {application.coverLetter || 'No cover letter submitted.'}
              </p>
            </section>

            <section className='space-y-3 border-t pt-4'>
              <h2 className='font-semibold'>Submitted résumé</h2>

              {application.resume ? (
                <>
                  <p className='break-words text-sm text-muted-foreground'>
                    {application.resume.filename}
                  </p>

                  <Button asChild variant='outline'>
                    <a
                      href={application.resume.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      referrerPolicy='no-referrer'
                      onClick={props.onResumeClick}
                    >
                      Download résumé
                    </a>
                  </Button>
                </>
              ) : (
                <p className='text-sm text-muted-foreground'>
                  No résumé is available for this application.
                </p>
              )}

              {props.resumeMessage && (
                <p role='status' className='text-sm text-muted-foreground'>
                  {props.resumeMessage}
                </p>
              )}
            </section>
          </div>
        ) : null}

        <DialogFooter className='flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          {application && (
            <div className='flex items-center gap-2'>
              <Select
                value={selectedStatus || application.status}
                onValueChange={handleStatusChange}
                disabled={props.isUpdatingStatus || props.isLoading}
              >
                <SelectTrigger className='w-40'>
                  <SelectValue placeholder='Change status' />
                </SelectTrigger>
                <SelectContent>
                  {APPLICATION_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {formatApplicationStatus(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type='button'
                size='sm'
                onClick={handleSaveStatus}
                disabled={isSaveDisabled}
              >
                {props.isUpdatingStatus ? 'Saving…' : 'Save'}
              </Button>
            </div>
          )}

          <Button type='button' variant='outline' onClick={props.onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});