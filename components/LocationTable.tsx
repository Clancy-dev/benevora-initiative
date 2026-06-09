'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import toast from 'react-hot-toast';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { deleteLocation } from '@/actions/location';

interface Location {
  id: string;
  organizationName: string;
  addressLine1: string;
  city: string;
  country: string;
  order: number;
}

interface LocationTableProps {
  locations: Location[];
}

export function LocationTable({ locations }: LocationTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);

  const handleDelete = async (location: Location) => {
    setIsDeleting(location.id);

    try {
      const result = await deleteLocation(location.id);

      if (result.success) {
        toast.success('Location deleted and moved to trash');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete location');
      }
    } catch (error) {
      toast.error('Failed to delete location');
    } finally {
      setIsDeleting(null);
      setLocationToDelete(null);
    }
  };

  if (locations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border bg-muted/30">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">No Locations Found</p>
          <p className="text-sm text-foreground/60 mb-4">Start by creating your first location</p>
          <Button onClick={() => router.push('/dashboard/contact-information/location/location-address/create')}>
            Create Location
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Organization</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Address</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">City</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Country</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {locations.map((location) => (
                <tr key={location.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{location.organizationName}</td>
                  <td className="px-6 py-4 text-sm text-foreground/80">{location.addressLine1}</td>
                  <td className="px-6 py-4 text-sm text-foreground/80">{location.city}</td>
                  <td className="px-6 py-4 text-sm text-foreground/80">{location.country}</td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/contact-information/location/location-address/${location.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/contact-information/location/location-address/edit?id=${location.id}`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setLocationToDelete(location)}
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

      <AlertDialog open={!!locationToDelete} onOpenChange={(open) => !open && setLocationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Location?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-semibold">{locationToDelete?.organizationName}</span>? This action can be undone from the trash.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => locationToDelete && handleDelete(locationToDelete)}
              disabled={isDeleting === locationToDelete?.id}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting === locationToDelete?.id ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
