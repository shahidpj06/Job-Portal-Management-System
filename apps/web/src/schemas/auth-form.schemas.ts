import { z } from 'zod';
import { newPasswordSchema } from './password.schema';

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.')
});

export const signupSchema = z
  .object({
    confirmPassword: z.string(),
    email: z.string().trim().email('Please enter a valid email.'),
    firstName: z.string().trim().min(1, 'First name is required.'),
    lastName: z.string().trim().min(1, 'Last name is required.'),
    password: newPasswordSchema
  })
  .refine((formData) => formData.password === formData.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword']
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

export const LOGIN_DEFAULT_VALUES: LoginFormData = {
  email: '',
  password: ''
};

export const SIGNUP_DEFAULT_VALUES: SignupFormData = {
  confirmPassword: '',
  email: '',
  firstName: '',
  lastName: '',
  password: ''
};
