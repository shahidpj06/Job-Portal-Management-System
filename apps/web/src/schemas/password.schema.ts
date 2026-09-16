import { z } from 'zod';

export const newPasswordSchema = z
  .string()
  .min(8, 'Use at least 8 characters.')
  .max(72, 'Password is too long.')
  .regex(/[A-Z]/, 'Include at least one uppercase letter.')
  .regex(/[a-z]/, 'Include at least one lowercase letter.')
  .regex(/[0-9]/, 'Include at least one number.')
  .regex(/[^A-Za-z0-9]/, 'Include at least one special character.')
  .refine((value) => new TextEncoder().encode(value).length <= 72, {
    message: 'Password exceeds the supported length. Some characters use multiple bytes.'
  });

export const changePasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Enter your current password.')
      .max(1024, 'Password is too long.'),

    newPassword: newPasswordSchema,

    confirmPassword: z.string().min(1, 'Confirm your new password.')
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.'
  })
  .refine((values) => values.currentPassword !== values.newPassword, {
    path: ['newPassword'],
    message: 'Choose a password different from your current password.'
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>;

export const forgotPasswordFormSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.')
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;

export const resetPasswordFormSchema = z
  .object({
    newPassword: newPasswordSchema,
    confirmPassword: z.string().min(1, 'Confirm your new password.')
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.'
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;
