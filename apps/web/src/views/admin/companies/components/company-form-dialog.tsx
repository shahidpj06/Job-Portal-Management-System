import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';

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
import { companyFormSchema, type CompanyFormValues } from '@/schemas/company-form-schema';

const MAXIMUM_COMPANY_DESCRIPTION_LENGTH = 10_000;
const MAXIMUM_COMPANY_NAME_LENGTH = 150;
const MAXIMUM_WEBSITE_URL_LENGTH = 2_048;

interface CompanyFormDialogProps {
  company?: ICompany;
  errorMessage?: string;
  isSaving: boolean;
  onClose: () => void;
  onSave: (companyRequest: ICreateCompanyRequest) => Promise<void>;
}

export const CompanyFormDialog = ({
  company,
  errorMessage,
  isSaving,
  onClose,
  onSave
}: CompanyFormDialogProps) => {
  const defaultValues = useMemo<CompanyFormValues>(
    () => ({
      description: company?.description ?? '',
      name: company?.name ?? '',
      websiteUrl: company?.websiteUrl ?? ''
    }),
    [company]
  );

  const companyFormMethods = useForm<CompanyFormValues>({
    defaultValues,
    resolver: zodResolver(companyFormSchema)
  });

  const isBusy = isSaving || companyFormMethods.formState.isSubmitting;

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen && !isBusy) {
        onClose();
      }
    },
    [isBusy, onClose]
  );

  const handleSubmit = useCallback(
    async (formValues: CompanyFormValues) => {
      await onSave({
        description: formValues.description || null,
        name: formValues.name,
        websiteUrl: formValues.websiteUrl || null
      });
    },
    [onSave]
  );

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent
        className='max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg'
        showCloseButton={!isBusy}
      >
        <DialogHeader>
          <DialogTitle>{company ? 'Edit company' : 'Create company'}</DialogTitle>

          <DialogDescription>
            Manage the company information shown on job listings.
          </DialogDescription>
        </DialogHeader>

        <SimpleForm className='space-y-4' methods={companyFormMethods} onSubmit={handleSubmit}>
          <fieldset className='space-y-4' disabled={isBusy}>
            <Field.Text<CompanyFormValues>
              label='Company name'
              maxLength={MAXIMUM_COMPANY_NAME_LENGTH}
              name='name'
              placeholder='Company name'
              required
            />

            <Field.Text<CompanyFormValues>
              label='Website'
              maxLength={MAXIMUM_WEBSITE_URL_LENGTH}
              name='websiteUrl'
              placeholder='https://example.com'
              type='url'
            />

            <Field.Textarea<CompanyFormValues>
              label='Description'
              maxLength={MAXIMUM_COMPANY_DESCRIPTION_LENGTH}
              name='description'
              placeholder='Describe the company'
              rows={5}
            />
          </fieldset>

          {errorMessage && (
            <p className='text-sm text-destructive' role='alert'>
              {errorMessage}
            </p>
          )}

          <div className='flex justify-end gap-2 border-t pt-4'>
            <Button disabled={isBusy} onClick={onClose} type='button' variant='outline'>
              Cancel
            </Button>

            <Button disabled={isBusy} type='submit'>
              {isBusy ? 'Saving…' : 'Save company'}
            </Button>
          </div>
        </SimpleForm>
      </DialogContent>
    </Dialog>
  );
};
