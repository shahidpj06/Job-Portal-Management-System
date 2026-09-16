import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Briefcase, ArrowLeft, CheckCircle2, AlertTriangle, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Field, SimpleForm } from '@/components/form';
import { paths } from '@/utils/paths';
import { APP_CONFIG } from '@/utils/global-config';
import { resetPasswordFormSchema, type ResetPasswordFormData } from '@/schemas/password.schema';
import { useResetPasswordMutation } from '@/services/auth/auth.api';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const methods = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setErrorMessage('Reset token is missing from the link.');
      return;
    }

    setErrorMessage(null);
    try {
      await resetPassword({
        token,
        newPassword: data.newPassword
      }).unwrap();
      setIsSuccess(true);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'data' in err) {
        const apiErr = err as { data?: { error?: { message?: string }; message?: string } };
        setErrorMessage(
          apiErr.data?.error?.message ||
            apiErr.data?.message ||
            'This reset link is invalid or expired. Please request a new link.'
        );
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className='flex min-h-[calc(90vh-4rem)] flex-col items-center justify-center px-4 py-12 bg-muted/30'>
      <Card className='w-full max-w-md shadow-lg border-border/50'>
        <CardHeader className='text-center'>
          <Link
            to={paths.home}
            className='mx-auto mb-4 flex w-fit items-center gap-2 text-lg font-bold text-primary transition-opacity hover:opacity-90'
          >
            <Briefcase className='h-6 w-6 text-primary' />
            {APP_CONFIG.name}
          </Link>
          <CardTitle className='text-2xl font-bold tracking-tight'>Set new password</CardTitle>
          <CardDescription>
            Choose a strong password with at least 8 characters, containing uppercase, lowercase,
            numbers, and special characters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!token ? (
            <div className='rounded-lg bg-amber-500/10 border border-amber-500/20 p-5 text-center space-y-3'>
              <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-600'>
                <AlertTriangle className='h-6 w-6' />
              </div>
              <h3 className='font-semibold text-amber-900 dark:text-amber-300'>
                Invalid reset link
              </h3>
              <p className='text-sm text-amber-700 dark:text-amber-400'>
                This password reset link is invalid or missing a security token. Please request a
                new password reset link.
              </p>
              <div className='pt-2'>
                <Button asChild variant='outline' className='w-full'>
                  <Link to={paths.auth['forgot-password']}>Request new link</Link>
                </Button>
              </div>
            </div>
          ) : isSuccess ? (
            <div className='rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-5 text-center space-y-4'>
              <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600'>
                <CheckCircle2 className='h-6 w-6' />
              </div>
              <div>
                <h3 className='font-semibold text-emerald-900 dark:text-emerald-300 text-lg'>
                  Password reset complete
                </h3>
                <p className='text-sm text-emerald-700 dark:text-emerald-400 mt-1'>
                  Your password has been successfully updated. You can now sign in with your new
                  password.
                </p>
              </div>
              <Button onClick={() => navigate(paths.auth.login)} className='w-full font-medium'>
                Sign in to your account
              </Button>
            </div>
          ) : (
            <SimpleForm methods={methods} onSubmit={onSubmit} className='space-y-4' noValidate>
              {errorMessage && (
                <div className='flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive'>
                  <AlertTriangle className='h-4 w-4 shrink-0 mt-0.5' />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Field.Password<ResetPasswordFormData>
                id='reset-new-password'
                name='newPassword'
                label='New password'
                placeholder='••••••••'
                autoComplete='new-password'
              />

              <Field.Password<ResetPasswordFormData>
                id='reset-confirm-password'
                name='confirmPassword'
                label='Confirm new password'
                placeholder='••••••••'
                autoComplete='new-password'
              />

              <Button type='submit' className='w-full font-medium' disabled={isLoading}>
                {isLoading ? (
                  'Updating password…'
                ) : (
                  <span className='flex items-center gap-2'>
                    <KeyRound className='h-4 w-4' /> Reset password
                  </span>
                )}
              </Button>
            </SimpleForm>
          )}

          <div className='mt-6 text-center'>
            <Link
              to={paths.auth.login}
              className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'
            >
              <ArrowLeft className='h-4 w-4' /> Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
