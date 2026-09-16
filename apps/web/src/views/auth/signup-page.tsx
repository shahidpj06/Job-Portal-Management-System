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

import {
  SIGNUP_DEFAULT_VALUES,
  signupSchema,
  type SignupFormData
} from '../../schemas/auth-form.schemas';

export const SignupPage = () => {
  const { isLoading, register: registerAccount } = useAuthSession();
  const navigate = useNavigate();

  const signupFormMethods = useForm<SignupFormData>({
    defaultValues: SIGNUP_DEFAULT_VALUES,
    resolver: zodResolver(signupSchema)
  });

  const {
    formState: { isSubmitting }
  } = signupFormMethods;

  const handleSubmit: SubmitHandler<SignupFormData> = async (formData) => {
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
  };

  const isFormSubmitting = isSubmitting || isLoading;

  return (
    <AuthPageCard
      description='Start your job search journey today — free forever'
      footer={
        <>
          Already have an account?{' '}
          <Link className='font-medium text-primary hover:underline' to={paths.auth.login}>
            Sign in
          </Link>
        </>
      }
      title='Create your account'
    >
      <SimpleForm className='space-y-4' methods={signupFormMethods} onSubmit={handleSubmit}>
        <div className='grid gap-3 sm:grid-cols-2'>
          <Field.Text<SignupFormData>
            autoComplete='given-name'
            id='signup-first-name'
            label='First name'
            name='firstName'
            placeholder='Jane'
          />

          <Field.Text<SignupFormData>
            autoComplete='family-name'
            id='signup-last-name'
            label='Last name'
            name='lastName'
            placeholder='Doe'
          />
        </div>

        <Field.Text<SignupFormData>
          autoComplete='email'
          id='signup-email'
          label='Email'
          name='email'
          placeholder='you@example.com'
          type='email'
        />

        <Field.Password<SignupFormData>
          autoComplete='new-password'
          id='signup-password'
          label='Password'
          name='password'
          placeholder='Min. 8 characters'
        />

        <Field.Password<SignupFormData>
          autoComplete='new-password'
          id='signup-confirm-password'
          label='Confirm password'
          name='confirmPassword'
          placeholder='Repeat password'
        />

        <Button className='w-full' disabled={isFormSubmitting} type='submit'>
          {isFormSubmitting ? 'Creating account…' : 'Create Account'}
        </Button>
      </SimpleForm>
    </AuthPageCard>
  );
};
