import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { AuthPageCard } from '@/components/auth/auth-page-card';
import { Field, SimpleForm } from '@/components/form';
import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/services/api';
import { useAuthSession } from '@/services/auth';
import { PATHS } from '@/utils/paths';

import { LOGIN_DEFAULT_VALUES, loginSchema, type LoginFormData } from './auth-form.schemas';

export const LoginPage = () => {
  const { isAdmin, isAuthenticated, isLoading, login } = useAuthSession();
  const navigate = useNavigate();

  const methods = useForm<LoginFormData>({
    defaultValues: LOGIN_DEFAULT_VALUES,
    resolver: zodResolver(loginSchema)
  });

  const {
    formState: { isSubmitting }
  } = methods;

  const onSubmit = useCallback<SubmitHandler<LoginFormData>>(
    async (formData) => {
      try {
        const user = await login(formData);

        toast.success('Welcome back.');

        navigate(user.role === 'ADMIN' ? PATHS.ADMIN.DASHBOARD : PATHS.JOBS, { replace: true });
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Unable to sign in.'));
      }
    },
    [login, navigate]
  );

  if (isAuthenticated) {
    return <Navigate replace to={isAdmin ? PATHS.ADMIN.DASHBOARD : PATHS.JOBS} />;
  }

  const isSubmittingForm = isSubmitting || isLoading;

  return (
    <AuthPageCard
      title='Welcome back'
      description='Sign in to your account to continue'
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link className='font-medium text-primary hover:underline' to={PATHS.SIGNUP}>
            Sign up free
          </Link>
        </>
      }
    >
      <SimpleForm methods={methods} onSubmit={onSubmit} className='space-y-4'>
        <Field.Text<LoginFormData>
          name='email'
          id='login-email'
          type='email'
          label='Email'
          placeholder='you@example.com'
          autoComplete='email'
        />

        <Field.Password<LoginFormData>
          name='password'
          id='login-password'
          label='Password'
          placeholder='••••••••'
          autoComplete='current-password'
          labelAction={
            <Link className='text-xs text-primary hover:underline' to={PATHS.FORGOT_PASSWORD}>
              Forgot password?
            </Link>
          }
        />

        <Button className='w-full' disabled={isSubmittingForm} type='submit'>
          {isSubmittingForm ? 'Signing in…' : 'Sign In'}
        </Button>
      </SimpleForm>
    </AuthPageCard>
  );
};
