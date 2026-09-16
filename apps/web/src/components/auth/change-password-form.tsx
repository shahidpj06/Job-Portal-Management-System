import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Field, SimpleForm } from '@/components/form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  changePasswordFormSchema,
  type ChangePasswordFormData
} from '@/schemas/password.schema';
import type { ChangePasswordRequest } from '@/types/auth';

interface ChangePasswordFormProps {
  onSave: (request: ChangePasswordRequest) => Promise<void>;
}

const DEFAULT_VALUES: ChangePasswordFormData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
};

export const ChangePasswordForm = (
  props: ChangePasswordFormProps
) => {
  const { onSave } = props;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const methods = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: DEFAULT_VALUES
  });

  const {
    reset,
    formState: { isSubmitting }
  } = methods;

  const onSubmit = useCallback(
    async (values: ChangePasswordFormData) => {
      setErrorMessage(null);

      try {
        await onSave({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword
        });

        reset(DEFAULT_VALUES);
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unable to change your password. Please try again.'
        );
      }
    },
    [onSave, reset]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>

        <p className='text-sm text-muted-foreground'>
          After changing your password, you will need to sign in again
          on all devices.
        </p>
      </CardHeader>

      <CardContent>
        <SimpleForm methods={methods} onSubmit={onSubmit}>
          <fieldset
            disabled={isSubmitting}
            className='min-w-0 space-y-5'
          >
            <legend className='sr-only'>Change your password</legend>

            <Field.Password<ChangePasswordFormData>
              name='currentPassword'
              label='Current password'
              autoComplete='current-password'
            />

            <Field.Password<ChangePasswordFormData>
              name='newPassword'
              label='New password'
              autoComplete='new-password'
              helperText='Use at least 8 characters. A long, unique passphrase works well.'
            />

            <Field.Password<ChangePasswordFormData>
              name='confirmPassword'
              label='Confirm new password'
              autoComplete='new-password'
            />

            {errorMessage && (
              <p role='alert' className='text-sm text-destructive'>
                {errorMessage}
              </p>
            )}

            <Button
              type='submit'
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className='w-full sm:w-auto'
            >
              {isSubmitting ? 'Updating password…' : 'Update password'}
            </Button>
          </fieldset>
        </SimpleForm>
      </CardContent>
    </Card>
  );
};