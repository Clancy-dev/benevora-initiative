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
import { deleteMap, getMap } from '@/actions/map';

interface MapEmbed {
  id: string;
  embedUrl: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function MapDetailPage() {
  const [map, setMap] = useState<MapEmbed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const result = await getMap(id);
        if (result.success && result.data) {
          setMap(result.data as MapEmbed);
        }
      } catch (error) {
        toast.error('Failed to load map');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMap();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!map) return;
    setIsDeleting(true);

    try {
      const result = await deleteMap(map.id);
      if (result.success) {
        toast.success('Map deleted and moved to trash');
        router.push('/dashboard/contact-information/location/map');
      } else {
        toast.error(result.error || 'Failed to delete map');
      }
    } catch (error) {
      toast.error('Failed to delete map');
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

  if (!map) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-foreground mb-4">Map not found</p>
          <Link href="/dashboard/contact-information/location/map">
            <Button>Back to Maps</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/contact-information/location/map" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Map Details</h1>
          <p className="text-foreground/60 mt-1">View and manage map embed</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Map Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Embed URL</label>
            <p className="text-foreground/80 break-all text-sm">{map.embedUrl}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Display Order</label>
            <p className="text-foreground/80">{map.order}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Created</label>
            <p className="text-foreground/80">{new Date(map.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Last Updated</label>
            <p className="text-foreground/80">{new Date(map.updatedAt).toLocaleDateString()}</p>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Link href={`/dashboard/contact-information/location/map/edit?id=${map.id}`} className="flex-1">
              <Button className="w-full">Edit Map</Button>
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
          <AlertDialogTitle>Delete Map?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this map? This action can be undone from the trash.
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
