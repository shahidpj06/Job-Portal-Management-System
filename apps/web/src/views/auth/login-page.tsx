import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { AuthPageCard } from '@/components/auth/auth-page-card';
import { Field, SimpleForm } from '@/components/form';
import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/services/api';
import { useAuthSession } from '@/services/auth';
import { paths } from '@/utils/paths';

import {
  LOGIN_DEFAULT_VALUES,
  loginSchema,
  type LoginFormData
} from '../../schemas/auth-form.schemas';

const USER_ROLE = {
  ADMIN: 'ADMIN'
} as const;

export const LoginPage = () => {
  const { isAdmin, isAuthenticated, isLoading, login } = useAuthSession();
  const navigate = useNavigate();

  const loginFormMethods = useForm<LoginFormData>({
    defaultValues: LOGIN_DEFAULT_VALUES,
    resolver: zodResolver(loginSchema)
  });

  const {
    formState: { isSubmitting }
  } = loginFormMethods;

  const handleSubmit: SubmitHandler<LoginFormData> = async (formData) => {
    try {
      const user = await login(formData);

      toast.success('Welcome back.');

      if (user.role === USER_ROLE.ADMIN) {
        navigate(paths.admin.dashboard, { replace: true });
        return;
      }

      navigate(paths.jobs, { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to sign in.'));
    }
  };

  if (isAuthenticated) {
    if (isAdmin) {
      return <Navigate replace to={paths.admin.dashboard} />;
    }

    return <Navigate replace to={paths.jobs} />;
  }

  const isFormSubmitting = isSubmitting || isLoading;

  return (
    <AuthPageCard
      description='Sign in to your account to continue'
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link className='font-medium text-primary hover:underline' to={paths.auth['sign-up']}>
            Sign up free
          </Link>
        </>
      }
      title='Welcome back'
    >
      <SimpleForm className='space-y-4' methods={loginFormMethods} onSubmit={handleSubmit}>
        <Field.Text<LoginFormData>
          autoComplete='email'
          id='login-email'
          label='Email'
          name='email'
          placeholder='you@example.com'
          type='email'
        />

        <Field.Password<LoginFormData>
          autoComplete='current-password'
          id='login-password'
          label='Password'
          labelAction={
            <Link
              className='text-xs text-primary hover:underline'
              to={paths.auth['forgot-password']}
            >
              Forgot password?
            </Link>
          }
          name='password'
          placeholder='••••••••'
        />

        <Button className='w-full' disabled={isFormSubmitting} type='submit'>
          {isFormSubmitting ? 'Signing in…' : 'Sign In'}
        </Button>
      </SimpleForm>
    </AuthPageCard>
  );
};
