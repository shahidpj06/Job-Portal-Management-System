import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { AuthPageCard } from '@/components/auth/auth-page-card';
import { Field, SimpleForm } from '@/components/form';
import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/services/api';
import { useAuthSession } from '@/services/auth';
import { paths } from '@/utils/paths';

import { SIGNUP_DEFAULT_VALUES, signupSchema, type SignupFormData } from '../../schemas/auth-form.schemas';

export const SignupPage = () => {
  const { isLoading, register: registerAccount } = useAuthSession();
  const navigate = useNavigate();

  const methods = useForm<SignupFormData>({
    defaultValues: SIGNUP_DEFAULT_VALUES,
    resolver: zodResolver(signupSchema)
  });

  const {
    formState: { isSubmitting }
  } = methods;

  const onSubmit = useCallback<SubmitHandler<SignupFormData>>(
    async (formData) => {
      try {
        await registerAccount({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password
        });

        toast.success('Your account has been created.');

        navigate(paths.jobs, { replace: true });
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Unable to create your account.'));
      }
    },
    [navigate, registerAccount]
  );

  const isSubmittingForm = isSubmitting || isLoading;

  return (
    <AuthPageCard
      title='Create your account'
      description='Start your job search journey today — free forever'
      footer={
        <>
          Already have an account?{' '}
          <Link className='font-medium text-primary hover:underline' to={paths.auth.login}>
            Sign in
          </Link>
        </>
      }
    >
      <SimpleForm methods={methods} onSubmit={onSubmit} className='space-y-4'>
        <div className='grid gap-3 sm:grid-cols-2'>
          <Field.Text<SignupFormData>
            name='firstName'
            id='signup-first-name'
            label='First name'
            placeholder='Jane'
            autoComplete='given-name'
          />

          <Field.Text<SignupFormData>
            name='lastName'
            id='signup-last-name'
            label='Last name'
            placeholder='Doe'
            autoComplete='family-name'
          />
        </div>

        <Field.Text<SignupFormData>
          name='email'
          id='signup-email'
          type='email'
          label='Email'
          placeholder='you@example.com'
          autoComplete='email'
        />

        <Field.Password<SignupFormData>
          name='password'
          id='signup-password'
          label='Password'
          placeholder='Min. 8 characters'
          autoComplete='new-password'
        />

        <Field.Password<SignupFormData>
          name='confirmPassword'
          id='signup-confirm-password'
          label='Confirm password'
          placeholder='Repeat password'
          autoComplete='new-password'
        />

        <Button className='w-full' disabled={isSubmittingForm} type='submit'>
          {isSubmittingForm ? 'Creating account…' : 'Create Account'}
        </Button>
      </SimpleForm>
    </AuthPageCard>
  );
};
