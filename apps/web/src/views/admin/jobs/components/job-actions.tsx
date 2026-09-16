import {
  Edit,
  Trash2
} from 'lucide-react';
import {
  useCallback,
  useState
} from 'react';
import { Link } from 'react-router-dom';

import { ConfirmActionDialog } from '@/components/dialog/confirm-action-dialog';
import { Button } from '@/components/ui/button';
import { paths } from '@/utils/paths';

interface AdminJobActionsProps {
  isDeleting: boolean;
  jobId: string;
  jobTitle: string;
  onDelete: (
    jobId: string
  ) => Promise<void>;
}

export const AdminJobActions = ({
  isDeleting,
  jobId,
  jobTitle,
  onDelete
}: AdminJobActionsProps) => {
  const [
    isDeleteDialogOpen,
    setIsDeleteDialogOpen
  ] = useState(false);

  const handleDelete = useCallback(
    async () => {
      await onDelete(jobId);

      setIsDeleteDialogOpen(false);
    },
    [
      jobId,
      onDelete
    ]
  );

  const handleDeleteDialogClose =
    useCallback(() => {
      if (!isDeleting) {
        setIsDeleteDialogOpen(false);
      }
    }, [isDeleting]);

  const handleDeleteDialogOpen =
    useCallback(() => {
      setIsDeleteDialogOpen(true);
    }, []);

  return (
    <>
      <div className='flex justify-end gap-2'>
        <Button
          asChild
          size='icon'
          variant='outline'
        >
          <Link
            aria-label={`Edit ${jobTitle}`}
            to={paths.admin['edit-job'](
              jobId
            )}
          >
            <Edit
              aria-hidden='true'
              className='size-4'
            />
          </Link>
        </Button>

        <Button
          aria-label={`Delete ${jobTitle}`}
          disabled={isDeleting}
          onClick={handleDeleteDialogOpen}
          size='icon'
          type='button'
          variant='ghost'
        >
          <Trash2
            aria-hidden='true'
            className='size-4'
          />
        </Button>
      </div>

      <ConfirmActionDialog
        confirmLabel='Delete job'
        description={`Delete ${jobTitle}? This action cannot be undone.`}
        isLoading={isDeleting}
        loadingLabel='Deleting…'
        onClose={handleDeleteDialogClose}
        onConfirm={handleDelete}
        open={isDeleteDialogOpen}
        title='Delete job?'
        variant='destructive'
      />
    </>
  );
};