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
import { deleteMap } from '@/actions/map';

interface MapEmbed {
  id: string;
  embedUrl: string;
  order: number;
}

interface MapTableProps {
  maps: MapEmbed[];
}

export function MapTable({ maps }: MapTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [mapToDelete, setMapToDelete] = useState<MapEmbed | null>(null);

  const handleDelete = async (map: MapEmbed) => {
    setIsDeleting(map.id);

    try {
      const result = await deleteMap(map.id);

      if (result.success) {
        toast.success('Map deleted and moved to trash');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete map');
      }
    } catch (error) {
      toast.error('Failed to delete map');
    } finally {
      setIsDeleting(null);
      setMapToDelete(null);
    }
  };

  if (maps.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border bg-muted/30">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">No Maps Found</p>
          <p className="text-sm text-foreground/60 mb-4">Start by creating your first map embed</p>
          <Button onClick={() => router.push('/dashboard/contact-information/location/map/create')}>
            Create Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground w-[400px]">
                  Embed URL
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground w-[120px]">
                  Order
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground w-[120px]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {maps.map((map) => (
                <tr key={map.id} className="hover:bg-muted/30 transition-colors">
                  
                  {/* Embed URL (FIXED) */}
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">
                    <div
                      className="truncate w-[400px]"
                      title={map.embedUrl}
                    >
                      {map.embedUrl}
                    </div>
                  </td>

                  {/* Order */}
                  <td className="px-6 py-4 text-sm text-foreground/80">
                    {map.order}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/dashboard/contact-information/location/map/${map.id}`)
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/dashboard/contact-information/location/map/edit?id=${map.id}`)
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => setMapToDelete(map)}
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

      {/* DELETE MODAL */}
      <AlertDialog open={!!mapToDelete} onOpenChange={(open) => !open && setMapToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Map?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this map embed? This action can be undone from the trash.
          </AlertDialogDescription>

          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => mapToDelete && handleDelete(mapToDelete)}
              disabled={isDeleting === mapToDelete?.id}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting === mapToDelete?.id ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}