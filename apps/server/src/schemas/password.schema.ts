import { Buffer } from "node:buffer";
import { z } from "zod";

export const newPasswordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(72, "Password is too long.")
  .refine((value) => Buffer.byteLength(value, "utf8") <= 72, {
    message:
      "Password exceeds the supported length. Some characters use multiple bytes.",
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Enter your current password.")
      .max(1024),
    newPassword: newPasswordSchema,
  })
  .strict()
  .refine((input) => input.currentPassword !== input.newPassword, {
    path: ["newPassword"],
    message: "Choose a password different from your current password.",
  });

export const forgotPasswordSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .max(255)
      .transform((value) => value.toLowerCase()),
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    token: z.string().regex(/^[a-f0-9]{64}$/, "The reset link is invalid."),
    newPassword: newPasswordSchema,
  })
  .strict();

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
