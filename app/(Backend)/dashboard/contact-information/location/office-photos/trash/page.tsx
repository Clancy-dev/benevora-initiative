'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
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
import { ArrowLeft, RotateCcw, Trash2, MoreHorizontal } from 'lucide-react';
import { getDeletedOfficePhotos, permanentDeleteOfficePhoto, restoreOfficePhoto } from '@/actions/office-photos';

interface OfficePhoto {
  id: string;
  image: string;
  order: number;
  deletedAt: Date;
}

export default function OfficePhotoTrashPage() {
  const [photos, setPhotos] = useState<OfficePhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [photoToDelete, setPhotoToDelete] = useState<OfficePhoto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [photoToRestore, setPhotoToRestore] = useState<OfficePhoto | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDeletedPhotos = async () => {
      try {
        const result = await getDeletedOfficePhotos();

        if (result.success && result.data) {
          setPhotos(result.data as OfficePhoto[]);
        } else {
          toast.error('Failed to load deleted photos');
        }
      } catch (error) {
        toast.error('Failed to load deleted photos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeletedPhotos();
  }, []);

  const handleRestore = async (photo: OfficePhoto) => {
    setIsRestoring(true);

    try {
      const result = await restoreOfficePhoto(photo.id);

      if (result.success) {
        toast.success('Office photo restored');
        setPhotos(photos.filter((p) => p.id !== photo.id));
      } else {
        toast.error(result.error || 'Failed to restore office photo');
      }
    } catch (error) {
      toast.error('Failed to restore office photo');
    } finally {
      setIsRestoring(false);
      setPhotoToRestore(null);
    }
  };

  const handlePermanentDelete = async (photo: OfficePhoto) => {
    setIsDeleting(true);

    try {
      const result = await permanentDeleteOfficePhoto(photo.id);

      if (result.success) {
        toast.success('Office photo permanently deleted');
        setPhotos(photos.filter((p) => p.id !== photo.id));
      } else {
        toast.error(result.error || 'Failed to permanently delete office photo');
      }
    } catch (error) {
      toast.error('Failed to permanently delete office photo');
    } finally {
      setIsDeleting(false);
      setPhotoToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-foreground/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/contact-information/location/office-photos" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trash</h1>
          <p className="text-foreground/60 mt-1">Restore or permanently delete office photos</p>
        </div>
      </div>

      {/* Table or Empty State */}
      {photos.length === 0 ? (
        <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border bg-muted/30">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground mb-2">No Deleted Photos</p>
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Deleted On</th>
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
                          alt={photo.image}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/80">{photo.order}</td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {new Date(photo.deletedAt).toLocaleDateString('en-US', {
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
                            onClick={() => setPhotoToRestore(photo)}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restore
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setPhotoToDelete(photo)}
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
      <AlertDialog open={!!photoToRestore} onOpenChange={(open) => !open && setPhotoToRestore(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Restore Office Photo?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to restore this image? It will be added back to your office photos gallery.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => photoToRestore && handleRestore(photoToRestore)}
              disabled={isRestoring}
              className="bg-green-600 hover:bg-green-700"
            >
              {isRestoring ? 'Restoring...' : 'Restore'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Confirmation Dialog */}
      <AlertDialog open={!!photoToDelete} onOpenChange={(open) => !open && setPhotoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Permanently Delete Office Photo?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete this image? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => photoToDelete && handlePermanentDelete(photoToDelete)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Permanently Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
