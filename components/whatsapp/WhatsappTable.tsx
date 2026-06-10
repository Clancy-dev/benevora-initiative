'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
  deleteWhatsapp,
  permanentlyDeleteWhatsapp,
  restoreWhatsapp,
} from '@/actions/whatsapp';

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

interface WhatsappLink {
  id: string;
  phoneNumber: string;
  displayName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface WhatsappTableProps {
  data: WhatsappLink[];
  showDeleted?: boolean;
}

export function WhatsappTable({
  data,
  showDeleted = false,
}: WhatsappTableProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [whatsappToDelete, setWhatsappToDelete] =
    useState<WhatsappLink | null>(null);

  const [whatsappToPermanentDelete, setWhatsappToPermanentDelete] =
    useState<WhatsappLink | null>(null);

  const handleDelete = async (item: WhatsappLink) => {
    setIsDeleting(item.id);

    try {
      const result = await deleteWhatsapp(item.id);

      if (result.success) {
        toast.success('WhatsApp link deleted successfully');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsDeleting(null);
      setWhatsappToDelete(null);
    }
  };

  const handleRestore = async (id: string) => {
    setLoading(true);

    try {
      const result = await restoreWhatsapp(id);

      if (result.success) {
        toast.success('WhatsApp link restored successfully');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to restore');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePermanentDelete = async (
    item: WhatsappLink
  ) => {
    setIsDeleting(item.id);

    try {
      const result = await permanentlyDeleteWhatsapp(item.id);

      if (result.success) {
        toast.success(
          'WhatsApp link permanently deleted'
        );
        router.refresh();
      } else {
        toast.error(
          result.error || 'Failed to permanently delete'
        );
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsDeleting(null);
      setWhatsappToPermanentDelete(null);
    }
  };

  if (!data || data.length === 0) {
  return (
    <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border bg-muted/30">
      <div className="text-center">
        <p className="text-lg font-semibold text-foreground mb-2">
          No Whatsapp Link Found
        </p>

        {/* ❌ Hide CTA on trash page */}
        {!showDeleted && (
          <>
            <p className="text-sm text-foreground/60 mb-4">
              Start by creating your whatsapp link
            </p>

            <Button
              onClick={() =>
                router.push(
                  '/dashboard/social-media/whatsapp/create'
                )
              }
              className="cursor-pointer dark:text-foreground"
            >
              Create Whatsapp Link
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
                  Phone Number
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
                    {item.phoneNumber}
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
                                  `/dashboard/social-media/whatsapp/${item.id}`
                                )
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/dashboard/social-media/whatsapp/edit?id=${item.id}`
                                )
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                setWhatsappToDelete(item)
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
                              onClick={() =>
                                handleRestore(item.id)
                              }
                              disabled={loading}
                            >
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Restore
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                setWhatsappToPermanentDelete(
                                  item
                                )
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
        open={!!whatsappToDelete}
        onOpenChange={(open) =>
          !open && setWhatsappToDelete(null)
        }
      >
        <AlertDialogContent>
          <AlertDialogTitle>
            Delete WhatsApp Link?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-semibold">
              {whatsappToDelete?.phoneNumber}
            </span>
            ? This action can be undone from the trash.
          </AlertDialogDescription>

          <div className="flex gap-4 justify-end">
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() =>
                whatsappToDelete &&
                handleDelete(whatsappToDelete)
              }
              disabled={
                isDeleting === whatsappToDelete?.id
              }
              className="bg-destructive text-background hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting === whatsappToDelete?.id
                ? 'Deleting...'
                : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Dialog */}
      <AlertDialog
        open={!!whatsappToPermanentDelete}
        onOpenChange={(open) =>
          !open &&
          setWhatsappToPermanentDelete(null)
        }
      >
        <AlertDialogContent>
          <AlertDialogTitle>
            Permanently Delete WhatsApp Link?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to permanently
            delete{' '}
            <span className="font-semibold">
              {whatsappToPermanentDelete?.phoneNumber}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>

          <div className="flex gap-4 justify-end">
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() =>
                whatsappToPermanentDelete &&
                handlePermanentDelete(
                  whatsappToPermanentDelete
                )
              }
              disabled={
                isDeleting ===
                whatsappToPermanentDelete?.id
              }
              className="bg-destructive text-background hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting ===
              whatsappToPermanentDelete?.id
                ? 'Deleting...'
                : 'Permanently Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}