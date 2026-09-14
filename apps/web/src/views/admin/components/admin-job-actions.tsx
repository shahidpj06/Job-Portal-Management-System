import { memo, useCallback } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import type { IJobData } from '@/types';
import { PATHS } from '@/utils/paths';

interface IAdminJobActionsProps {
  isDeleting: boolean;
  job: Pick<IJobData, 'id' | 'title'>;
  onDelete: (jobId: string) => Promise<void>;
}

const AdminJobActionsComponent = ({ isDeleting, job, onDelete }: IAdminJobActionsProps) => {
  const handleDelete = useCallback(() => {
    void onDelete(job.id);
  }, [job.id, onDelete]);

  return (
    <div className='flex items-center justify-end gap-1'>
      <Button asChild className='h-8 w-8' size='icon' variant='ghost'>
        <Link aria-label={`Edit ${job.title}`} to={PATHS.ADMIN.EDIT_JOB(job.id)}>
          <Edit className='h-4 w-4' />
        </Link>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            aria-label={`Delete ${job.title}`}
            className='h-8 w-8 text-destructive hover:text-destructive'
            disabled={isDeleting}
            size='icon'
            variant='ghost'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete job listing?</AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently remove &ldquo;{job.title}&rdquo;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const AdminJobActions = memo(AdminJobActionsComponent);
