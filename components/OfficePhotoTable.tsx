'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
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
import { deleteOfficePhoto } from '@/actions/office-photos';

interface OfficePhoto {
  id: string;
  image: string;
  order: number;
}

interface OfficePhotoTableProps {
  photos: OfficePhoto[];
}

export function OfficePhotoTable({ photos }: OfficePhotoTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<OfficePhoto | null>(null);

  const handleDelete = async (photo: OfficePhoto) => {
    setIsDeleting(photo.id);

    try {
      const result = await deleteOfficePhoto(photo.id);

      if (result.success) {
        toast.success('Office photo deleted');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete office photo');
      }
    } catch (error) {
      toast.error('Failed to delete office photo');
    } finally {
      setIsDeleting(null);
      setPhotoToDelete(null);
    }
  };

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border bg-muted/30">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">No Office Photos Found</p>
          <p className="text-sm text-foreground/60 mb-4">Start by creating your first office photo</p>
          <Button onClick={() => router.push('/dashboard/contact-information/location/office-photos/create')}>
            Create Photo
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {photos.map((photo) => (
                <tr
                  key={photo.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border">
                      <Image
                        src={photo.image}
                        alt="Office photo"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/80">{photo.order}</td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/contact-information/location/office-photos/${photo.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/contact-information/location/office-photos/edit?id=${photo.id}`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setPhotoToDelete(photo)}
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
      <AlertDialog open={!!photoToDelete} onOpenChange={(open) => !open && setPhotoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Office Photo?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this office photo? This action can be undone from the trash.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => photoToDelete && handleDelete(photoToDelete)}
              disabled={isDeleting === photoToDelete?.id}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting === photoToDelete?.id ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
