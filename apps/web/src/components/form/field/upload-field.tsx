import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode
} from 'react';
import { useController, type FieldPath, type FieldValues } from 'react-hook-form';
import { FileText, LoaderCircle, Pencil, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { FieldError } from './field-error';

export interface IUploadedFileValue {
  id: string;
  filename: string;
  size: number;
}

export interface IUploadFieldProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  accept: string;
  maxBytes: number;
  helperText?: ReactNode;
  disabled?: boolean;
  buttonLabel?: string;
  variant?: 'default' | 'compact' | 'avatar';
  imageSrc?: string;
  initials?: string;
  onUpload: (file: File) => Promise<IUploadedFileValue>;
}

export const UploadField = <TFieldValues extends FieldValues>(
  props: IUploadFieldProps<TFieldValues>
) => {
  const {
    name,
    label,
    accept,
    maxBytes,
    helperText,
    disabled = false,
    onUpload,
    variant = 'default',
    buttonLabel,
    imageSrc,
    initials
  } = props;

  const generatedId = useId();
  const inputId = `upload-${generatedId}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  const isCompact = variant === 'compact';

  const inputRef = useRef<HTMLInputElement | null>(null);
  const uploadInProgressRef = useRef(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>();

  const {
    field,
    fieldState: { error }
  } = useController<TFieldValues>({ name });

  const { onChange: onFieldChange, onBlur: onFieldBlur, ref: fieldRef } = field;

  const savedFile = field.value as IUploadedFileValue | null | undefined;
  const errorMessage = uploadError || error?.message;
  const isDisabled = disabled || isUploading || Boolean(field.disabled);

  const savedFileSize = useMemo(() => {
    if (!savedFile) {
      return '';
    }

    if (savedFile.size < 1024 * 1024) {
      return `${Math.max(1, Math.ceil(savedFile.size / 1024))} KB`;
    }

    return `${(savedFile.size / (1024 * 1024)).toFixed(1)} MB`;
  }, [savedFile]);

  const describedBy =
    [helperText ? helperId : undefined, errorMessage ? errorId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;

  const setInputRef = useCallback(
    (element: HTMLInputElement | null) => {
      inputRef.current = element;
      fieldRef(element);
    },
    [fieldRef]
  );

  const onChooseFile = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onFileSelected = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.[0];
      event.currentTarget.value = '';

      if (!file || isDisabled || uploadInProgressRef.current) {
        return;
      }

      setUploadError(undefined);

      if (file.size === 0) {
        setUploadError('Choose a non-empty file.');
        return;
      }

      if (file.size > maxBytes) {
        setUploadError(`Choose a file no larger than ${maxBytes / (1024 * 1024)} MB.`);
        return;
      }

      uploadInProgressRef.current = true;
      setIsUploading(true);

      try {
        const uploadedFile = await onUpload(file);
        onFieldChange(uploadedFile);
        onFieldBlur();
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : 'The upload failed. Please try again.'
        );
      } finally {
        uploadInProgressRef.current = false;
        setIsUploading(false);
      }
    },
    [isDisabled, maxBytes, onUpload, onFieldChange, onFieldBlur]
  );

  if (variant === 'avatar') {
    return (
      <div className='grid justify-items-center gap-2'>
        <input
          ref={setInputRef}
          id={inputId}
          name={name}
          type='file'
          accept={accept}
          disabled={isDisabled}
          tabIndex={-1}
          className='sr-only'
          aria-label={label}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={describedBy}
          onBlur={onFieldBlur}
          onChange={onFileSelected}
        />

        <Button
          type='button'
          variant='ghost'
          disabled={isDisabled}
          aria-label={buttonLabel ?? `${savedFile ? 'Replace' : 'Upload'} ${label}`}
          aria-describedby={describedBy}
          aria-busy={isUploading}
          onClick={onChooseFile}
          onBlur={onFieldBlur}
          className='group relative size-28 overflow-hidden rounded-full border-0 p-0 ring-2 ring-border ring-offset-4 ring-offset-card hover:ring-primary'
        >
          <Avatar className='pointer-events-none size-full'>
            <AvatarImage src={imageSrc} alt='' />
            <AvatarFallback className='bg-primary/10 text-2xl text-primary'>
              {initials}
            </AvatarFallback>
          </Avatar>

          <span
            aria-hidden='true'
            className={`absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-full bg-black/55 text-white transition-opacity motion-reduce:transition-none ${
              isUploading
                ? 'opacity-100'
                : 'opacity-100 [@media(hover:hover)]:opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
            }`}
          >
            <span className='flex size-8 items-center justify-center rounded-full bg-white text-primary'>
              {isUploading ? (
                <LoaderCircle className='size-4 animate-spin' />
              ) : (
                <Pencil className='size-4' />
              )}
            </span>

            <span className='max-w-20 whitespace-normal text-center text-sm font-semibold leading-tight'>
              {isUploading
                ? 'Uploading…'
                : (buttonLabel ?? (savedFile ? 'Replace photo' : 'Upload photo'))}
            </span>
          </span>
        </Button>

        {isUploading && (
          <span role='status' className='sr-only'>
            Uploading your profile photo.
          </span>
        )}

        {helperText && (
          <p id={helperId} className='text-center text-xs text-muted-foreground'>
            {helperText}
          </p>
        )}

        <FieldError id={errorId} message={errorMessage} />
      </div>
    );
  }

  return (
    <div className='grid gap-2'>
      <Label htmlFor={inputId} className={isCompact ? 'sr-only' : undefined}>
        {label}
      </Label>

      <div
        aria-busy={isUploading}
        className={
          isCompact
            ? 'text-center'
            : 'rounded-xl border border-dashed border-border bg-muted/30 p-4 focus-within:ring-2 focus-within:ring-ring'
        }
      >
        <input
          ref={setInputRef}
          id={inputId}
          name={name}
          type='file'
          accept={accept}
          disabled={isDisabled}
          tabIndex={-1}
          className='sr-only'
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={describedBy}
          onBlur={onFieldBlur}
          onChange={onFileSelected}
        />

        {!isCompact && savedFile && (
          <div className='mb-3 flex items-start gap-3'>
            <FileText aria-hidden='true' className='mt-0.5 size-5 shrink-0 text-primary' />

            <div className='min-w-0'>
              <p className='break-words text-sm font-medium'>{savedFile.filename}</p>
              <p className='text-xs text-muted-foreground'>{savedFileSize}</p>
            </div>
          </div>
        )}

        <Button
          type='button'
          variant='outline'
          size='sm'
          disabled={isDisabled}
          aria-label={buttonLabel ?? `${savedFile ? 'Replace' : 'Upload'} ${label}`}
          aria-describedby={describedBy}
          onClick={onChooseFile}
        >
          {isUploading ? (
            <LoaderCircle aria-hidden='true' className='size-4 animate-spin' />
          ) : (
            <Upload aria-hidden='true' className='size-4' />
          )}

          {isUploading
            ? 'Uploading…'
            : (buttonLabel ?? (savedFile ? 'Replace file' : 'Choose file'))}
        </Button>

        {isUploading && (
          <p role='status' className='mt-2 text-xs text-muted-foreground'>
            Uploading your file. Please wait.
          </p>
        )}
      </div>

      {helperText && (
        <p
          id={helperId}
          className={
            isCompact
              ? 'text-center text-xs text-muted-foreground'
              : 'text-sm text-muted-foreground'
          }
        >
          {helperText}
        </p>
      )}

      <FieldError id={errorId} message={errorMessage} />
    </div>
  );
};
