import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Field, SimpleForm } from '@/components/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import type { ICompany, ICreateCompanyRequest } from '@/types';

const companyFormSchema = z.object({
  name: z.string().trim().min(2, 'Enter a company name.').max(150),
  description: z.string().trim().max(10000),
  websiteUrl: z
    .string()
    .trim()
    .max(2048)
    .refine(
      (value) => {
        if (!value) {
          return true;
        }

        try {
          const url = new URL(value);
          return url.protocol === 'https:' || url.protocol === 'http:';
        } catch {
          return false;
        }
      },
      { message: 'Enter a valid HTTP or HTTPS website URL.' }
    )
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface CompanyFormDialogProps {
  company?: ICompany;
  isSaving: boolean;
  errorMessage?: string;
  onClose: () => void;
  onSave: (data: ICreateCompanyRequest) => Promise<void>;
}

export const CompanyFormDialog = (props: CompanyFormDialogProps) => {
  const defaultValues = useMemo(
    () => ({
      name: props.company?.name ?? '',
      description: props.company?.description ?? '',
      websiteUrl: props.company?.websiteUrl ?? ''
    }),
    [props.company]
  );

  const methods = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues
  });

  const isBusy = props.isSaving || methods.formState.isSubmitting;

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open && !isBusy) {
        props.onClose();
      }
    },
    [isBusy, props.onClose]
  );

  const onSubmit = useCallback(
    async (values: CompanyFormValues) => {
      await props.onSave({
        name: values.name,
        description: values.description || null,
        websiteUrl: values.websiteUrl || null
      });
    },
    [props.onSave]
  );

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent
        className='max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg'
        showCloseButton={!isBusy}
      >
        <DialogHeader>
          <DialogTitle>{props.company ? 'Edit company' : 'Create company'}</DialogTitle>
          <DialogDescription>
            Manage the company information shown on job listings.
          </DialogDescription>
        </DialogHeader>

        <SimpleForm methods={methods} onSubmit={onSubmit} className='space-y-4'>
          <fieldset disabled={isBusy} className='space-y-4'>
            <Field.Text<CompanyFormValues>
              name='name'
              label='Company name'
              placeholder='Company name'
              maxLength={150}
              required
            />

            <Field.Text<CompanyFormValues>
              name='websiteUrl'
              label='Website'
              placeholder='https://example.com'
              type='url'
              maxLength={2048}
            />

            <Field.Textarea<CompanyFormValues>
              name='description'
              label='Description'
              placeholder='Describe the company'
              rows={5}
              maxLength={10000}
            />
          </fieldset>

          {props.errorMessage && (
            <p role='alert' className='text-sm text-destructive'>
              {props.errorMessage}
            </p>
          )}

          <div className='flex justify-end gap-2 border-t pt-4'>
            <Button type='button' variant='outline' disabled={isBusy} onClick={props.onClose}>
              Cancel
            </Button>

            <Button type='submit' disabled={isBusy}>
              {isBusy ? 'Saving…' : 'Save company'}
            </Button>
          </div>
        </SimpleForm>
      </DialogContent>
    </Dialog>
  );
};
