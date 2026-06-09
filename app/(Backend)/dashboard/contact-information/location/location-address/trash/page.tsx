'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react';
import Link from 'next/link';
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
import { getDeletedLocations, permanentDeleteLocation, restoreLocation } from '@/actions/location';

interface Location {
  id: string;
  organizationName: string;
  addressLine1: string;
  city: string;
  country: string;
  deletedAt: Date;
}

export default function LocationTrashPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [locationToRestore, setLocationToRestore] = useState<Location | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDeletedLocations = async () => {
      try {
        const result = await getDeletedLocations();
        if (result.success && result.data) {
          setLocations(result.data as Location[]);
        }
      } catch (error) {
        toast.error('Failed to load deleted locations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeletedLocations();
  }, []);

  const handleRestore = async (location: Location) => {
    setIsRestoring(true);
    try {
      const result = await restoreLocation(location.id);
      if (result.success) {
        toast.success('Location restored successfully');
        setLocations(locations.filter((l) => l.id !== location.id));
      } else {
        toast.error(result.error || 'Failed to restore location');
      }
    } catch (error) {
      toast.error('Failed to restore location');
    } finally {
      setIsRestoring(false);
      setLocationToRestore(null);
    }
  };

  const handlePermanentDelete = async (location: Location) => {
    setIsDeleting(true);
    try {
      const result = await permanentDeleteLocation(location.id);
      if (result.success) {
        toast.success('Location permanently deleted');
        setLocations(locations.filter((l) => l.id !== location.id));
      } else {
        toast.error(result.error || 'Failed to permanently delete location');
      }
    } catch (error) {
      toast.error('Failed to permanently delete location');
    } finally {
      setIsDeleting(false);
      setLocationToDelete(null);
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
      <div className="flex items-center gap-4">
        <Link href="/dashboard/contact-information/location/location-address" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trash</h1>
          <p className="text-foreground/60 mt-1">Restore or permanently delete locations</p>
        </div>
      </div>

      {locations.length === 0 ? (
        <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border bg-muted/30">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground mb-2">No Deleted Locations</p>
            <p className="text-sm text-foreground/60">The trash is empty</p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden bg-background">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Organization</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Address</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">City</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Deleted On</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {locations.map((location) => (
                  <tr key={location.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">{location.organizationName}</td>
                    <td className="px-6 py-4 text-sm text-foreground/80">{location.addressLine1}</td>
                    <td className="px-6 py-4 text-sm text-foreground/80">{location.city}</td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {new Date(location.deletedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setLocationToRestore(location)}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restore
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setLocationToDelete(location)}
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

      <AlertDialog open={!!locationToRestore} onOpenChange={(open) => !open && setLocationToRestore(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Restore Location?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to restore <span className="font-semibold">{locationToRestore?.organizationName}</span>? It will be added back to your locations list.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => locationToRestore && handleRestore(locationToRestore)}
              disabled={isRestoring}
              className="bg-green-600 hover:bg-green-700"
            >
              {isRestoring ? 'Restoring...' : 'Restore'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!locationToDelete} onOpenChange={(open) => !open && setLocationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Permanently Delete Location?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete <span className="font-semibold">{locationToDelete?.organizationName}</span>? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => locationToDelete && handlePermanentDelete(locationToDelete)}
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
