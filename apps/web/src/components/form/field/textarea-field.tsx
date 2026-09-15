import { useId, type ComponentProps, type ReactNode } from 'react';
import { useController, type FieldPath, type FieldValues } from 'react-hook-form';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { FieldError } from './field-error';

export interface ITextareaFieldProps<TFieldValues extends FieldValues> extends Omit<
  ComponentProps<typeof Textarea>,
  'defaultValue' | 'name' | 'onBlur' | 'onChange' | 'value'
> {
  name: FieldPath<TFieldValues>;
  label?: string;
  helperText?: ReactNode;
}

export const TextareaField = <TFieldValues extends FieldValues>(
  props: ITextareaFieldProps<TFieldValues>
) => {
  const { name, label, helperText, id, ...textareaProps } = props;

  const generatedId = useId();
  const inputId = id ?? `${name}-${generatedId}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const {
    field,
    fieldState: { error }
  } = useController<TFieldValues>({
    name,
    disabled: textareaProps.disabled
  });

  const describedBy =
    [helperText ? helperId : undefined, error ? errorId : undefined].filter(Boolean).join(' ') ||
    undefined;

  return (
    <div className='grid gap-2'>
      {label && <Label htmlFor={inputId}>{label}</Label>}

      <Textarea
        {...textareaProps}
        {...field}
        id={inputId}
        value={field.value == null ? '' : String(field.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
      />

      {helperText && (
        <p id={helperId} className='text-sm text-muted-foreground'>
          {helperText}
        </p>
      )}

      <FieldError id={errorId} message={error?.message} />
    </div>
  );
};
