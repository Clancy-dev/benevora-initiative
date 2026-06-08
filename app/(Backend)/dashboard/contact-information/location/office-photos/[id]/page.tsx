'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { deleteOfficePhoto, getOfficePhoto } from '@/actions/office-photos';

interface OfficePhoto {
  id: string;
  image: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OfficePhotoDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [photo, setPhoto] = useState<OfficePhoto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [photoId, setPhotoId] = useState<string>('');

  useEffect(() => {
    const fetchPhoto = async () => {
      const unwrappedParams = await params;
      setPhotoId(unwrappedParams.id);

      try {
        const result = await getOfficePhoto(unwrappedParams.id);

        if (result.success && result.data) {
          setPhoto(result.data as OfficePhoto);
        } else {
          toast.error('Office photo not found');
          router.push('/dashboard/contact-information/location/office-photos');
        }
      } catch (error) {
        toast.error('Failed to load office photo');
        router.push('/dashboard/contact-information/location/office-photos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhoto();
  }, [params, router]);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteOfficePhoto(photoId);

      if (result.success) {
        toast.success('Office photo deleted');
        router.push('/dashboard/contact-information/location/office-photos');
      } else {
        toast.error(result.error || 'Failed to delete office photo');
      }
    } catch (error) {
      toast.error('Failed to delete office photo');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-foreground/60">Loading...</p>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-foreground/60">Office photo not found</p>
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
          <p className="text-foreground/60 mt-1">View office photo details</p>
        </div>
      </div>

      {/* Content */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Photo Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Photo</label>
            <div className="relative w-full max-w-2xl h-96 rounded-lg overflow-hidden border border-border">
              <Image
                src={photo.image}
                alt={photo.image}
                fill
                className="object-cover"
              />
            </div>
          </div>


          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-foreground/70">Display Order</label>
            <p className="text-foreground mt-1">{photo.order}</p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <label className="block text-sm font-medium text-foreground/70">Created</label>
              <p className="text-foreground mt-1">
                {new Date(photo.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70">Last Updated</label>
              <p className="text-foreground mt-1">
                {new Date(photo.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Link href={`/dashboard/contact-information/location/office-photos/edit?id=${photo.id}`} className="flex-1">
              <Button className="w-full">Edit Photo</Button>
            </Link>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Office Photo?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this photo? This action can be undone from the trash.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
