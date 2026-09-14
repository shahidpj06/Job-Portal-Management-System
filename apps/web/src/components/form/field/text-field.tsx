import { useId, type ComponentProps, type ReactNode } from 'react';
import { useController, type FieldPath, type FieldValues } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { FieldError } from './field-error';

export interface ITextFieldProps<TFieldValues extends FieldValues> extends Omit<
  ComponentProps<typeof Input>,
  'defaultValue' | 'name' | 'onBlur' | 'onChange' | 'value'
> {
  helperText?: ReactNode;
  label?: string;
  name: FieldPath<TFieldValues>;
}

export const TextField = <TFieldValues extends FieldValues>({
  helperText,
  id,
  label,
  name,
  ...inputProps
}: ITextFieldProps<TFieldValues>) => {
  const generatedId = useId();
  const inputId = id ?? `${name}-${generatedId}`;
  const errorId = `${inputId}-error`;
  const helperTextId = `${inputId}-helper`;

  const {
    field,
    fieldState: { error }
  } = useController<TFieldValues>({
    name,
    disabled: inputProps.disabled
  });

  const describedBy = error ? errorId : helperText ? helperTextId : undefined;

  return (
    <div className='grid gap-2'>
      {label && <Label htmlFor={inputId}>{label}</Label>}

      <Input
        {...inputProps}
        {...field}
        id={inputId}
        value={field.value == null ? '' : String(field.value)}
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
      />

      <FieldError id={errorId} message={error?.message} />

      {!error && helperText && (
        <p id={helperTextId} className='text-sm text-muted-foreground'>
          {helperText}
        </p>
      )}
    </div>
  );
};
