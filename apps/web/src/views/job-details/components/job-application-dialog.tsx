import { useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';

import { Field, SimpleForm } from '@/components/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { getApiErrorMessage } from '@/services/api';
import type { IProfileFile, ISubmitApplicationRequest } from '@/types';
import { applicationFormSchema, type ApplicationFormValues } from '@/schemas/job-application-schema';

interface IJobApplicationDialogProps {
  jobId: string;
  jobTitle: string;
  savedResume?: IProfileFile;
  onClose: () => void;
  onSubmit: (request: ISubmitApplicationRequest) => Promise<void>;
}

export const JobApplicationDialog = (props: IJobApplicationDialogProps) => {
  const { jobId, jobTitle, onClose, onSubmit } = props;
  const submissionInProgressRef = useRef(false);
  const [savedResume] = useState(() => (props.savedResume ? { ...props.savedResume } : undefined));

  const formSchema = useMemo(
    () =>
      applicationFormSchema.refine((values) => Boolean(values.resumeFile || savedResume), {
        message: 'Choose a resume before submitting.',
        path: ['resumeFile']
      }),
    [savedResume]
  );

  const methods = useForm<ApplicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeFile: null,
      coverLetter: ''
    },
    mode: 'onChange'
  });

  const {
    clearErrors,
    setError,
    formState: { errors, isSubmitting }
  } = methods;

  const onCancel = useCallback(() => {
    if (!submissionInProgressRef.current && !isSubmitting) {
      onClose();
    }
  }, [isSubmitting, onClose]);

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onCancel();
      }
    },
    [onCancel]
  );

  const onSubmitForm = useCallback(
    async (values: ApplicationFormValues) => {
      if (submissionInProgressRef.current) {
        return;
      }

      clearErrors('root');

      let request: ISubmitApplicationRequest;

      if (values.resumeFile) {
        request = {
          jobId,
          coverLetter: values.coverLetter,
          resumeSource: 'upload',
          file: values.resumeFile
        };
      } else if (savedResume) {
        request = {
          jobId,
          coverLetter: values.coverLetter,
          resumeSource: 'profile',
          resumeFileId: savedResume.id,
          resumeUpdatedAt: savedResume.updatedAt
        };
      } else {
        setError(
          'resumeFile',
          {
            type: 'manual',
            message: 'Choose a resume before submitting.'
          },
          { shouldFocus: true }
        );

        return;
      }

      submissionInProgressRef.current = true;

      try {
        await onSubmit(request);
        onClose();
      } catch (error) {
        setError('root.server', {
          type: 'server',
          message: getApiErrorMessage(error, 'Unable to submit your application. Please try again.')
        });
      } finally {
        submissionInProgressRef.current = false;
      }
    },
    [clearErrors, jobId, onClose, onSubmit, savedResume, setError]
  );

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent
        className='max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg'
        showCloseButton={!isSubmitting}
      >
        <DialogHeader className='pr-8'>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>

          <DialogDescription>
            Choose your resume and optionally include a cover letter.
          </DialogDescription>
        </DialogHeader>

        <SimpleForm
          methods={methods}
          onSubmit={onSubmitForm}
          className='grid gap-5'
          aria-busy={isSubmitting}
        >
          <fieldset disabled={isSubmitting} className='min-w-0 space-y-5'>
            <Field.File<ApplicationFormValues>
              name='resumeFile'
              label='Resume'
              accept='.pdf,application/pdf'
              existingFilename={savedResume?.filename}
              helperText='PDF, up to 5 MB. A replacement is used only for this application.'
            />

            <Field.Textarea<ApplicationFormValues>
              name='coverLetter'
              label='Cover letter (optional)'
              placeholder='Tell the employer why you are interested in this role.'
              rows={6}
              maxLength={5000}
              helperText='Maximum 5,000 characters.'
            />
          </fieldset>

          {errors.root?.server?.message && (
            <p role='alert' className='text-sm text-destructive'>
              {errors.root.server.message}
            </p>
          )}

          <DialogFooter>
            <Button type='button' variant='outline' disabled={isSubmitting} onClick={onCancel}>
              Cancel
            </Button>

            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting && <LoaderCircle aria-hidden='true' className='size-4 animate-spin' />}

              {isSubmitting ? 'Submitting…' : 'Submit application'}
            </Button>
          </DialogFooter>
        </SimpleForm>
      </DialogContent>
    </Dialog>
  );
};
