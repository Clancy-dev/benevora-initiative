'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
  deleteInstagram,
  permanentlyDeleteInstagram,
  restoreInstagram,
} from '@/actions/instagram';

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

import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  RotateCcw,
} from 'lucide-react';

interface InstagramLink {
  id: string;
  handle: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface InstagramTableProps {
  data: InstagramLink[];
  showDeleted?: boolean;
}

export function InstagramTable({
  data,
  showDeleted = false,
}: InstagramTableProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [instagramToDelete, setInstagramToDelete] =
    useState<InstagramLink | null>(null);

  const [instagramToPermanentDelete, setInstagramToPermanentDelete] =
    useState<InstagramLink | null>(null);

  const handleDelete = async (item: InstagramLink) => {
    setIsDeleting(item.id);

    try {
      const result = await deleteInstagram(item.id);

      if (result.success) {
        toast.success('Instagram link deleted successfully');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsDeleting(null);
      setInstagramToDelete(null);
    }
  };

  const handleRestore = async (id: string) => {
    setLoading(true);

    try {
      const result = await restoreInstagram(id);

      if (result.success) {
        toast.success('Instagram link restored successfully');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to restore');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePermanentDelete = async (item: InstagramLink) => {
    setIsDeleting(item.id);

    try {
      const result = await permanentlyDeleteInstagram(item.id);

      if (result.success) {
        toast.success('Instagram link permanently deleted');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to permanently delete');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsDeleting(null);
      setInstagramToPermanentDelete(null);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border bg-muted/30">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">
            No Instagram Link Found
          </p>

          {!showDeleted && (
            <>
              <p className="text-sm text-foreground/60 mb-4">
                Start by creating your Instagram link
              </p>

              <Button
                onClick={() =>
                  router.push(
                    '/dashboard/social-media/instagram/create'
                  )
                }
                className="cursor-pointer dark:text-foreground"
              >
                Create Instagram Link
              </Button>
            </>
          )}
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Handle
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-foreground">
                    {item.handle}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        item.isActive
                          ? 'bg-green-100/80 text-green-700'
                          : 'bg-yellow-100/80 text-yellow-700'
                      }`}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 cursor-pointer dark:hover:text-white"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        {!showDeleted ? (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/dashboard/social-media/instagram/${item.id}`
                                )
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/dashboard/social-media/instagram/edit?id=${item.id}`
                                )
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                setInstagramToDelete(item)
                              }
                              className="text-red-600 focus:bg-red-50 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleRestore(item.id)}
                              disabled={loading}
                            >
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Restore
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                setInstagramToPermanentDelete(item)
                              }
                              className="text-red-600 focus:bg-red-50 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Permanently Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Soft Delete Dialog */}
      <AlertDialog
        open={!!instagramToDelete}
        onOpenChange={(open) =>
          !open && setInstagramToDelete(null)
        }
      >
        <AlertDialogContent>
          <AlertDialogTitle>
            Delete Instagram Link?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-semibold">
              {instagramToDelete?.handle}
            </span>
            ? This action can be undone from the trash.
          </AlertDialogDescription>

          <div className="flex gap-4 justify-end">
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() =>
                instagramToDelete &&
                handleDelete(instagramToDelete)
              }
              disabled={
                isDeleting === instagramToDelete?.id
              }
              className="bg-destructive text-background hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting === instagramToDelete?.id
                ? 'Deleting...'
                : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Dialog */}
      <AlertDialog
        open={!!instagramToPermanentDelete}
        onOpenChange={(open) =>
          !open &&
          setInstagramToPermanentDelete(null)
        }
      >
        <AlertDialogContent>
          <AlertDialogTitle>
            Permanently Delete Instagram Link?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to permanently delete{' '}
            <span className="font-semibold">
              {instagramToPermanentDelete?.handle}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>

          <div className="flex gap-4 justify-end">
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() =>
                instagramToPermanentDelete &&
                handlePermanentDelete(instagramToPermanentDelete)
              }
              disabled={
                isDeleting === instagramToPermanentDelete?.id
              }
              className="bg-destructive text-background hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting === instagramToPermanentDelete?.id
                ? 'Deleting...'
                : 'Permanently Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}