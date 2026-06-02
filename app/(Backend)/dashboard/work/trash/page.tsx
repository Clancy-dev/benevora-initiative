'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { getDeletedWorks, permanentDeleteWork, restoreWork } from '@/actions/work';
import toast from 'react-hot-toast';

interface Work {
  id: string;
  caption: string;
  image: string;
  order: number;
  deletedAt: Date;
}

export default function WorkTrashPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [workToDelete, setWorkToDelete] = useState<Work | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [workToRestore, setWorkToRestore] = useState<Work | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDeletedWorks = async () => {
      try {
        const result = await getDeletedWorks();

        if (result.success && result.data) {
          setWorks(result.data as Work[]);
        } else {
          toast.error('Failed to load deleted works')
        }
      } catch (error) {
        toast.error('Failed to load deleted works')
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeletedWorks();
  }, [toast]);

  const handleRestore = async (work: Work) => {
    setIsRestoring(true);

    try {
      const result = await restoreWork(work.id);

      if (result.success) {
        toast.success('Work has been restored successfully.')
        setWorks(works.filter((w) => w.id !== work.id));
      } else {
        toast.error(result.error || 'Failed to restore work')
      }
    } catch (error) {
      toast.error('Failed to restore work')
    } finally {
      setIsRestoring(false);
      setWorkToRestore(null);
    }
  };

  const handlePermanentDelete = async (work: Work) => {
    setIsDeleting(true);

    try {
      const result = await permanentDeleteWork(work.id);

      if (result.success) {
        toast.success('Work has been permanently deleted.')
        setWorks(works.filter((w) => w.id !== work.id));
      } else {
        toast.error(result.error || 'Failed to permanently delete work')
      }
    } catch (error) {
      toast.error('Failed to permanently delete work')
    } finally {
      setIsDeleting(false);
      setWorkToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/work" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trash</h1>
          <p className="text-foreground/60 mt-1">Restore or permanently delete works</p>
        </div>
      </div>

      {/* Table or Empty State */}
      {works.length === 0 ? (
        <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border bg-muted/30">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground mb-2">No Deleted Works</p>
            <p className="text-sm text-foreground/60">The trash is empty</p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden bg-background">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Caption</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Deleted On</th>
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
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {new Date(work.deletedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setWorkToRestore(work)}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restore
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setWorkToDelete(work)}
                            className="text-red-600 focus:bg-red-50 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Permanently Delete
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
      )}

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={!!workToRestore} onOpenChange={(open) => !open && setWorkToRestore(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Restore Work?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to restore <span className="font-semibold">{workToRestore?.caption}</span>? It will be added back to your works list.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => workToRestore && handleRestore(workToRestore)}
              disabled={isRestoring}
              className="cursor-pointer"
            >
              {isRestoring ? 'Restoring...' : 'Restore'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Confirmation Dialog */}
      <AlertDialog open={!!workToDelete} onOpenChange={(open) => !open && setWorkToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Permanently Delete Work?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete <span className="font-semibold">{workToDelete?.caption}</span>? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => workToDelete && handlePermanentDelete(workToDelete)}
              disabled={isDeleting}
              className="bg-destructive text-background hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting ? 'Deleting...' : 'Permanently Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
