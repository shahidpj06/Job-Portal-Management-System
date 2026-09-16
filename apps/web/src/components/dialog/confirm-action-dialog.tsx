import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface ConfirmActionDialogProps {
  cancelLabel?: string;
  confirmLabel: string;
  description: string;
  errorMessage?: string;
  isLoading?: boolean;
  loadingLabel?: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  open: boolean;
  title: string;
  variant?: 'default' | 'destructive';
}

export const ConfirmActionDialog = ({
  cancelLabel = 'Cancel',
  confirmLabel,
  description,
  errorMessage,
  isLoading = false,
  loadingLabel = 'Processing…',
  onClose,
  onConfirm,
  open,
  title,
  variant = 'default'
}: ConfirmActionDialogProps) => {
  const handleConfirm = useCallback(() => {
    void onConfirm();
  }, [onConfirm]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen && !isLoading) {
        onClose();
      }
    },
    [isLoading, onClose]
  );

  return (
    <AlertDialog onOpenChange={handleOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>

          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {errorMessage && (
          <p className='text-sm text-destructive' role='alert'>
            {errorMessage}
          </p>
        )}

        <AlertDialogFooter>
          <Button disabled={isLoading} onClick={onClose} type='button' variant='outline'>
            {cancelLabel}
          </Button>

          <Button disabled={isLoading} onClick={handleConfirm} type='button' variant={variant}>
            {isLoading ? loadingLabel : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
