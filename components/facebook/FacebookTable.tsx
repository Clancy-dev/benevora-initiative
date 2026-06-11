'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
  deleteFacebook,
  permanentlyDeleteFacebook,
  restoreFacebook,
} from '@/actions/facebook';

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

interface FacebookLink {
  id: string;
  url: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface FacebookTableProps {
  data: FacebookLink[];
  showDeleted?: boolean;
}

export function FacebookTable({
  data,
  showDeleted = false,
}: FacebookTableProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [facebookToDelete, setFacebookToDelete] =
    useState<FacebookLink | null>(null);

  const [facebookToPermanentDelete, setFacebookToPermanentDelete] =
    useState<FacebookLink | null>(null);

  const handleDelete = async (item: FacebookLink) => {
    setIsDeleting(item.id);

    try {
      const result = await deleteFacebook(item.id);

      if (result.success) {
        toast.success('Facebook link deleted successfully');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsDeleting(null);
      setFacebookToDelete(null);
    }
  };

  const handleRestore = async (id: string) => {
    setLoading(true);

    try {
      const result = await restoreFacebook(id);

      if (result.success) {
        toast.success('Facebook link restored successfully');
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

  const handlePermanentDelete = async (item: FacebookLink) => {
    setIsDeleting(item.id);

    try {
      const result = await permanentlyDeleteFacebook(item.id);

      if (result.success) {
        toast.success('Facebook link permanently deleted');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to permanently delete');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsDeleting(null);
      setFacebookToPermanentDelete(null);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border bg-muted/30">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">
            No Facebook Link Found
          </p>

          {!showDeleted && (
            <>
              <p className="text-sm text-foreground/60 mb-4">
                Start by creating your Facebook link
              </p>

              <Button
                onClick={() =>
                  router.push('/dashboard/social-media/facebook/create')
                }
                className="cursor-pointer dark:text-foreground"
              >
                Create Facebook Link
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
                  URL
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
                  <td className="px-6 py-4 text-sm text-foreground max-w-xs truncate">
                    {item.url}
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
                                  `/dashboard/social-media/facebook/${item.id}`
                                )
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/dashboard/social-media/facebook/edit?id=${item.id}`
                                )
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => setFacebookToDelete(item)}
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
                                setFacebookToPermanentDelete(item)
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
        open={!!facebookToDelete}
        onOpenChange={(open) => !open && setFacebookToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogTitle>
            Delete Facebook Link?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-semibold">
              {facebookToDelete?.url}
            </span>
            ? This action can be undone from the trash.
          </AlertDialogDescription>

          <div className="flex gap-4 justify-end">
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() =>
                facebookToDelete && handleDelete(facebookToDelete)
              }
              disabled={isDeleting === facebookToDelete?.id}
              className="bg-destructive text-background hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting === facebookToDelete?.id
                ? 'Deleting...'
                : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Dialog */}
      <AlertDialog
        open={!!facebookToPermanentDelete}
        onOpenChange={(open) =>
          !open && setFacebookToPermanentDelete(null)
        }
      >
        <AlertDialogContent>
          <AlertDialogTitle>
            Permanently Delete Facebook Link?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to permanently delete{' '}
            <span className="font-semibold">
              {facebookToPermanentDelete?.url}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>

          <div className="flex gap-4 justify-end">
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() =>
                facebookToPermanentDelete &&
                handlePermanentDelete(facebookToPermanentDelete)
              }
              disabled={isDeleting === facebookToPermanentDelete?.id}
              className="bg-destructive text-background hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting === facebookToPermanentDelete?.id
                ? 'Deleting...'
                : 'Permanently Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}