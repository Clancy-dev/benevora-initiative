'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { deleteWork } from '@/actions/work';
import toast from 'react-hot-toast';

interface WorkDeleteButtonProps {
  workId: string;
  caption: string;
}

export function WorkDeleteButton({ workId, caption }: WorkDeleteButtonProps) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteWork(workId);

      if (result.success) {
        toast.success('Work has been moved to trash.')
        router.replace('/dashboard/work');
      } else {
        toast.error(result.error || 'Failed to delete work')
      }
    } catch (error) {
        toast.error('Failed to delete work')
     
    } finally {
      setIsDeleting(false);
      setShowDialog(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setShowDialog(true)}
        disabled={isDeleting}
        className="gap-2 cursor-pointer"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Work?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-semibold">{caption}</span>? This action can be undone from the trash.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-background hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
