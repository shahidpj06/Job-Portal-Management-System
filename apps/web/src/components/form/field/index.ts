import { PasswordField } from './password-field';
import { TextField } from './text-field';
import { TextareaField } from './textarea-field';
import { UploadField } from './upload-field';
import { FileField } from './file-field';

export const Field = {
  File: FileField,
  Password: PasswordField,
  Text: TextField,
  Textarea: TextareaField,
  Upload: UploadField
} as const;

export type { IPasswordFieldProps } from './password-field';
export type { ITextFieldProps } from './text-field';
export type { ITextareaFieldProps } from './textarea-field';
export type { IUploadedFileValue, IUploadFieldProps } from './upload-field';

