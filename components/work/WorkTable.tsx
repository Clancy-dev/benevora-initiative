'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { deleteWork } from '@/actions/work';
import toast from 'react-hot-toast';

interface Work {
  id: string;
  caption: string;
  image: string;
  order: number;
}

interface WorkTableProps {
  works: Work[];
}

export function WorkTable({ works }: WorkTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [workToDelete, setWorkToDelete] = useState<Work | null>(null);

  const handleDelete = async (work: Work) => {
    setIsDeleting(work.id);

    try {
      const result = await deleteWork(work.id);

      if (result.success) {
        toast.success('Work has been moved to trash.')
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete work')
        
      }
    } catch (error) {
      toast.error('Failed to delete work')
    } finally {
      setIsDeleting(null);
      setWorkToDelete(null);
    }
  };

  if (works.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border bg-muted/30">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">No Works Found</p>
          <p className="text-sm text-foreground/60 mb-4">Start by creating your first work item</p>
          <Button onClick={() => router.push('/dashboard/work/create')}>
            Create Work
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Image</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Caption</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {works.map((work) => (
                <tr
                  key={work.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border">
                      <Image
                        src={work.image}
                        alt={work.caption}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{work.caption}</td>
                  <td className="px-6 py-4 text-sm text-foreground/80">{work.order}</td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/work/${work.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/work/edit?id=${work.id}`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setWorkToDelete(work)}
                          className="text-red-600 focus:bg-red-50 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!workToDelete} onOpenChange={(open) => !open && setWorkToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Work?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-semibold">{workToDelete?.caption}</span>? This action can be undone from the trash.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => workToDelete && handleDelete(workToDelete)}
              disabled={isDeleting === workToDelete?.id}
              className="bg-destructive text-background hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting === workToDelete?.id ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
