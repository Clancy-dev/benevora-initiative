'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { deleteLocation, getLocation } from '@/actions/location';

interface Location {
  id: string;
  organizationName: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  country: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function LocationDetailPage() {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const result = await getLocation(id);
        if (result.success && result.data) {
          setLocation(result.data as Location);
        }
      } catch (error) {
        console.error('[v0] Error fetching location:', error);
        toast.error('Failed to load location');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchLocation();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!location) return;
    setIsDeleting(true);

    try {
      const result = await deleteLocation(location.id);
      if (result.success) {
        toast.success('Location deleted and moved to trash');
        router.push('/dashboard/contact-information/location/location-address');
      } else {
        toast.error(result.error || 'Failed to delete location');
      }
    } catch (error) {
      toast.error('Failed to delete location');
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

  if (!location) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-foreground mb-4">Location not found</p>
          <Link href="/dashboard/contact-information/location/location-address">
            <Button>Back to Locations</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/contact-information/location/location-address" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{location.organizationName}</h1>
          <p className="text-foreground/60 mt-1">Location Details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Location Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Organization Name</label>
            <p className="text-foreground/80">{location.organizationName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Address Line 1</label>
            <p className="text-foreground/80">{location.addressLine1}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Address Line 2</label>
            <p className="text-foreground/80">{location.addressLine2}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Postal Code</label>
              <p className="text-foreground/80">{location.postalCode}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">City</label>
              <p className="text-foreground/80">{location.city}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Country</label>
            <p className="text-foreground/80">{location.country}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Display Order</label>
            <p className="text-foreground/80">{location.order}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Created</label>
            <p className="text-foreground/80">{new Date(location.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Last Updated</label>
            <p className="text-foreground/80">{new Date(location.updatedAt).toLocaleDateString()}</p>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Link href={`/dashboard/contact-information/location/location-address/edit?id=${location.id}`} className="flex-1">
              <Button className="w-full">Edit Location</Button>
            </Link>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Location?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-semibold">{location.organizationName}</span>? This action can be undone from the trash.
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
