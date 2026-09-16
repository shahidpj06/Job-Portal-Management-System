import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Briefcase, ArrowLeft, MailCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Field, SimpleForm } from '@/components/form';
import { paths } from '@/utils/paths';
import { APP_CONFIG } from '@/utils/global-config';
import { forgotPasswordFormSchema, type ForgotPasswordFormData } from '@/schemas/password.schema';
import { useForgotPasswordMutation } from '@/services/auth/auth.api';

export function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const methods = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setErrorMessage(null);
    try {
      await forgotPassword(data).unwrap();
      setIsSuccess(true);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'data' in err) {
        const apiErr = err as { data?: { error?: { message?: string }; message?: string } };
        setErrorMessage(
          apiErr.data?.error?.message ||
            apiErr.data?.message ||
            'Failed to send reset link. Please try again.'
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
          <CardTitle className='text-2xl font-bold tracking-tight'>Reset your password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className='rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-5 text-center space-y-3'>
              <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600'>
                <MailCheck className='h-6 w-6' />
              </div>
              <h3 className='font-semibold text-emerald-900 dark:text-emerald-300'>
                Reset link sent
              </h3>
              <p className='text-sm text-emerald-700 dark:text-emerald-400'>
                If an account exists for that email, we&apos;ve sent instructions to reset your
                password.
              </p>
            </div>
          ) : (
            <SimpleForm methods={methods} onSubmit={onSubmit} className='space-y-4' noValidate>
              {errorMessage && (
                <div className='flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive'>
                  <AlertCircle className='h-4 w-4 shrink-0' />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Field.Text<ForgotPasswordFormData>
                id='fp-email'
                name='email'
                label='Email address'
                type='email'
                placeholder='you@example.com'
                autoComplete='email'
              />

              <Button type='submit' className='w-full font-medium' disabled={isLoading}>
                {isLoading ? 'Sending reset link…' : 'Send Reset Link'}
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
}
