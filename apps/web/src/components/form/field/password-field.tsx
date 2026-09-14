import { useCallback, useId, useState, type ComponentProps, type ReactNode } from 'react';
import { useController, type FieldPath, type FieldValues } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { FieldError } from './field-error';

export interface IPasswordFieldProps<TFieldValues extends FieldValues> extends Omit<
  ComponentProps<typeof Input>,
  'defaultValue' | 'name' | 'onBlur' | 'onChange' | 'type' | 'value'
> {
  helperText?: ReactNode;
  label?: string;
  labelAction?: ReactNode;
  name: FieldPath<TFieldValues>;
}

export const PasswordField = <TFieldValues extends FieldValues>({
  className,
  helperText,
  id,
  label,
  labelAction,
  name,
  ...inputProps
}: IPasswordFieldProps<TFieldValues>) => {
  const generatedId = useId();
  const inputId = id ?? `${name}-${generatedId}`;
  const errorId = `${inputId}-error`;
  const helperTextId = `${inputId}-helper`;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    field,
    fieldState: { error }
  } = useController<TFieldValues>({
    name,
    disabled: inputProps.disabled
  });

  const handleVisibilityToggle = useCallback(() => {
    setIsPasswordVisible((currentValue) => !currentValue);
  }, []);

  const describedBy = error ? errorId : helperText ? helperTextId : undefined;

  return (
    <div className='grid gap-2'>
      {(label || labelAction) && (
        <div className='flex items-center justify-between gap-4'>
          {label && <Label htmlFor={inputId}>{label}</Label>}
          {labelAction}
        </div>
      )}

      <div className='relative'>
        <Input
          {...inputProps}
          {...field}
          id={inputId}
          type={isPasswordVisible ? 'text' : 'password'}
          value={field.value == null ? '' : String(field.value)}
          className={cn('pr-10', className)}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
        />

        <Button
          type='button'
          variant='ghost'
          size='icon-sm'
          className='absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground'
          aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isPasswordVisible}
          onClick={handleVisibilityToggle}
        >
          {isPasswordVisible ? <EyeOff aria-hidden='true' /> : <Eye aria-hidden='true' />}
        </Button>
      </div>

      <FieldError id={errorId} message={error?.message} />

      {!error && helperText && (
        <p id={helperTextId} className='text-sm text-muted-foreground'>
          {helperText}
        </p>
      )}
    </div>
  );
};
