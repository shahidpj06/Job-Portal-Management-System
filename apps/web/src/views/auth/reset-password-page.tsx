import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { AuthPageCard } from '@/components/auth/auth-page-card';
import { Field, SimpleForm } from '@/components/form';
import { Button } from '@/components/ui/button';
import { resetPasswordFormSchema, type ResetPasswordFormData } from '@/schemas/password.schema';
import { getApiErrorMessage } from '@/services/api';
import { useResetPasswordMutation } from '@/services/auth/auth.api';
import { paths } from '@/utils/paths';

const RESET_PASSWORD_ERROR_MESSAGE =
  'This reset link is invalid or expired. Please request a new link.';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParameters] = useSearchParams();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const resetPasswordFormMethods = useForm<ResetPasswordFormData>({
    defaultValues: {
      confirmPassword: '',
      newPassword: ''
    },
    resolver: zodResolver(resetPasswordFormSchema)
  });

  const token = searchParameters.get('token');

  const handleResetPasswordSubmit: SubmitHandler<ResetPasswordFormData> = async (formData) => {
    if (!token) {
      return;
    }

    setErrorMessage(null);

    try {
      await resetPassword({
        newPassword: formData.newPassword,
        token
      }).unwrap();

      setIsSuccess(true);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, RESET_PASSWORD_ERROR_MESSAGE));
    }
  };

  const handleSignIn = () => {
    navigate(paths.auth.login);
  };

  return (
    <AuthPageCard
      description='Choose a strong password with at least 8 characters, containing uppercase, lowercase, numbers, and special characters.'
      footer={
        <Link
          className='inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground'
          to={paths.auth.login}
        >
          <ArrowLeft className='h-4 w-4' />
          Back to sign in
        </Link>
      }
      title='Set new password'
    >
      {!token ? (
        <div className='space-y-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-5 text-center'>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-600'>
            <AlertTriangle className='h-6 w-6' />
          </div>

          <h3 className='font-semibold text-amber-900 dark:text-amber-300'>Invalid reset link</h3>

          <p className='text-sm text-amber-700 dark:text-amber-400'>
            This password reset link is invalid or missing a security token. Please request a new
            password reset link.
          </p>

          <div className='pt-2'>
            <Button asChild className='w-full' variant='outline'>
              <Link to={paths.auth['forgot-password']}>Request new link</Link>
            </Button>
          </div>
        </div>
      ) : isSuccess ? (
        <div className='space-y-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-5 text-center'>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600'>
            <CheckCircle2 className='h-6 w-6' />
          </div>

          <div>
            <h3 className='text-lg font-semibold text-emerald-900 dark:text-emerald-300'>
              Password reset complete
            </h3>

            <p className='mt-1 text-sm text-emerald-700 dark:text-emerald-400'>
              Your password has been successfully updated. You can now sign in with your new
              password.
            </p>
          </div>

          <Button className='w-full font-medium' onClick={handleSignIn}>
            Sign in to your account
          </Button>
        </div>
      ) : (
        <SimpleForm
          className='space-y-4'
          methods={resetPasswordFormMethods}
          noValidate
          onSubmit={handleResetPasswordSubmit}
        >
          {errorMessage && (
            <div className='flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive'>
              <AlertTriangle className='mt-0.5 h-4 w-4 shrink-0' />
              <span>{errorMessage}</span>
            </div>
          )}

          <Field.Password<ResetPasswordFormData>
            autoComplete='new-password'
            id='reset-new-password'
            label='New password'
            name='newPassword'
            placeholder='••••••••'
          />

          <Field.Password<ResetPasswordFormData>
            autoComplete='new-password'
            id='reset-confirm-password'
            label='Confirm new password'
            name='confirmPassword'
            placeholder='••••••••'
          />

          <Button className='w-full font-medium' disabled={isLoading} type='submit'>
            {isLoading ? (
              'Updating password…'
            ) : (
              <span className='flex items-center gap-2'>
                <KeyRound className='h-4 w-4' />
                Reset password
              </span>
            )}
          </Button>
        </SimpleForm>
      )}
    </AuthPageCard>
  );
};
