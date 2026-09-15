import { useCallback, useId, useMemo, useRef, type ChangeEvent, type ReactNode } from 'react';
import { useController, type FieldPath, type FieldValues } from 'react-hook-form';
import { FileText, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { FieldError } from './field-error';

export interface IFileFieldProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  accept: string;
  existingFilename?: string;
  helperText?: ReactNode;
  disabled?: boolean;
}

export const FileField = <TFieldValues extends FieldValues>(
  props: IFileFieldProps<TFieldValues>
) => {
  const { name, label, accept, existingFilename, helperText, disabled = false } = props;

  const generatedId = useId();
  const buttonId = `file-${generatedId}`;
  const filenameId = `${buttonId}-filename`;
  const errorId = `${buttonId}-error`;
  const helperId = `${buttonId}-helper`;

  const inputRef = useRef<HTMLInputElement>(null);

  const {
    field,
    fieldState: { error }
  } = useController<TFieldValues>({ name });

  const { onChange, onBlur, ref: fieldRef } = field;
  const isDisabled = disabled || Boolean(field.disabled);
  const fieldValue: unknown = field.value;

  const selectedFile = useMemo(
    () => (fieldValue instanceof File ? fieldValue : null),
    [fieldValue]
  );

  const filename = useMemo(
    () => selectedFile?.name || existingFilename || 'No file selected',
    [selectedFile, existingFilename]
  );

  const describedBy = [filenameId, error ? errorId : helperText ? helperId : undefined]
    .filter(Boolean)
    .join(' ');

  const onChooseFile = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onFileSelected = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.[0];

      // Allow choosing the same file again.
      event.currentTarget.value = '';

      if (!file || isDisabled) {
        return;
      }

      onChange(file);
      onBlur();
    },
    [isDisabled, onChange, onBlur]
  );

  const onClearSelection = useCallback(() => {
    onChange(null);
    onBlur();

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onChange, onBlur]);

  return (
    <div className='grid gap-2'>
      <Label htmlFor={buttonId}>{label}</Label>

      <div className='flex min-w-0 items-center gap-2 text-sm'>
        <FileText aria-hidden='true' className='size-4 shrink-0 text-muted-foreground' />

        <span id={filenameId} aria-live='polite' className='min-w-0 break-all text-foreground'>
          {filename}
        </span>
      </div>

      <input
        ref={inputRef}
        type='file'
        accept={accept}
        disabled={isDisabled}
        onChange={onFileSelected}
        hidden
      />

      <div className='flex flex-wrap items-center gap-2'>
        <Button asChild variant='outline' size='sm'>
          <button
            ref={fieldRef}
            id={buttonId}
            type='button'
            disabled={isDisabled}
            onClick={onChooseFile}
            onBlur={onBlur}
            aria-describedby={describedBy}
            aria-invalid={Boolean(error)}
          >
            <Upload aria-hidden='true' />
            {selectedFile || existingFilename ? 'Change file' : 'Choose file'}
          </button>
        </Button>

        {selectedFile && (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            disabled={isDisabled}
            onClick={onClearSelection}
          >
            {existingFilename ? 'Use saved file' : 'Remove selection'}
          </Button>
        )}
      </div>

      <FieldError id={errorId} message={error?.message} />

      {!error && helperText && (
        <p id={helperId} className='text-sm text-muted-foreground'>
          {helperText}
        </p>
      )}
    </div>
  );
};
