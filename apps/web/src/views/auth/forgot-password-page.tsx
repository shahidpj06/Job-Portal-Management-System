import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowLeft, MailCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { AuthPageCard } from '@/components/auth/auth-page-card';
import { Field, SimpleForm } from '@/components/form';
import { Button } from '@/components/ui/button';
import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormData
} from '@/schemas/password.schema';
import { useForgotPasswordMutation } from '@/services/auth/auth.api';
import { paths } from '@/utils/paths';

const ERROR_MESSAGE = {
  FAILED_TO_SEND: 'Failed to send reset link. Please try again.',
  UNEXPECTED: 'An unexpected error occurred. Please try again.'
};

type ForgotPasswordApiError = {
  data?: {
    error?: {
      message?: string;
    };
    message?: string;
  };
};

const getForgotPasswordErrorMessage = (error: unknown) => {
  if (!error || typeof error !== 'object' || !('data' in error)) {
    return ERROR_MESSAGE.UNEXPECTED;
  }

  const apiError = error as ForgotPasswordApiError;

  return (
    apiError.data?.error?.message ??
    apiError.data?.message ??
    ERROR_MESSAGE.FAILED_TO_SEND
  );
};

export const ForgotPasswordPage = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [isSuccess, setIsSuccess] = useState(false);

  const methods = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: ''
    },
    resolver: zodResolver(forgotPasswordFormSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setErrorMessage(null);

    try {
      await forgotPassword(data).unwrap();

      setIsSuccess(true);
    } catch (error: unknown) {
      setErrorMessage(getForgotPasswordErrorMessage(error));
    }
  };

  return (
    <AuthPageCard
      description='Enter your email address and we will send you instructions to reset your password.'
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link
            className='font-medium text-primary hover:underline'
            to={paths.auth['sign-up']}
          >
            Sign up free
          </Link>
        </>
      }
      title='Forgot your password?'
    >
      {isSuccess ? (
        <div className='space-y-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-5 text-center'>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600'>
            <MailCheck className='h-6 w-6' />
          </div>

          <h3 className='font-semibold text-emerald-900 dark:text-emerald-300'>
            Reset link sent
          </h3>

          <p className='text-sm text-emerald-700 dark:text-emerald-400'>
            If an account exists for that email, we&apos;ve sent instructions to
            reset your password.
          </p>
        </div>
      ) : (
        <SimpleForm
          className='space-y-4'
          methods={methods}
          noValidate
          onSubmit={onSubmit}
        >
          {errorMessage && (
            <div className='flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive'>
              <AlertCircle className='h-4 w-4 shrink-0' />
              <span>{errorMessage}</span>
            </div>
          )}

          <Field.Text<ForgotPasswordFormData>
            autoComplete='email'
            id='forgot-password-email'
            label='Email address'
            name='email'
            placeholder='you@example.com'
            type='email'
          />

          <Button
            className='w-full'
            disabled={isLoading}
            type='submit'
          >
            {isLoading ? 'Sending reset link…' : 'Send Reset Link'}
          </Button>
        </SimpleForm>
      )}

      <div className='mt-6 text-center'>
        <Link
          className='inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground'
          to={paths.auth.login}
        >
          <ArrowLeft className='h-4 w-4' />
          Back to sign in
        </Link>
      </div>
    </AuthPageCard>
  );
};