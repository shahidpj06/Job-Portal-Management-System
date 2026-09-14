import { PasswordField } from './password-field';
import { TextField } from './text-field';

export const Field = {
  Password: PasswordField,
  Text: TextField
} as const;

export type { IPasswordFieldProps } from './password-field';
export type { ITextFieldProps } from './text-field';