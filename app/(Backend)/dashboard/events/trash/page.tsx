'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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
import { getDeletedEvents, permanentDeleteEvent, restoreEvent } from '@/actions/events';
import toast from 'react-hot-toast';

interface Event {
  id: string;
  title: string;
  image: string;
  date: string;
  order: number;
  deletedAt: Date;
}

export default function EventTrashPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [eventToRestore, setEventToRestore] = useState<Event | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDeletedEvents = async () => {
      try {
        const result = await getDeletedEvents();

        if (result.success && result.data) {
          setEvents(result.data as Event[]);
        } else {
          toast.error('Failed to load deleted events')
        }
      } catch (error) {
        toast.error('Failed to load deleted events')
        
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeletedEvents();
  }, [toast]);

  const handleRestore = async (event: Event) => {
    setIsRestoring(true);

    try {
      const result = await restoreEvent(event.id);

      if (result.success) {
        toast.success('Event has been restored successfully.')
        setEvents(events.filter((e) => e.id !== event.id));
      } else {
        toast.error(result.error || 'Failed to restore event')
      }
    } catch (error) {
      toast.error('Failed to restore event')
    } finally {
      setIsRestoring(false);
      setEventToRestore(null);
    }
  };

  const handlePermanentDelete = async (event: Event) => {
    setIsDeleting(true);

    try {
      const result = await permanentDeleteEvent(event.id);

      if (result.success) {
        toast.success('Event has been permanently deleted.')
        setEvents(events.filter((e) => e.id !== event.id));
      } else {
        toast.error(result.error || 'Failed to permanently delete event')
      }
    } catch (error) {
      toast.error('Failed to permanently delete event')
    } finally {
      setIsDeleting(false);
      setEventToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/events" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trash</h1>
          <p className="text-foreground/60 mt-1">Restore or permanently delete events</p>
        </div>
      </div>

      {/* Table or Empty State */}
      {events.length === 0 ? (
        <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border bg-muted/30">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground mb-2">No Deleted Events</p>
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Deleted On</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">{event.title}</td>
                    <td className="px-6 py-4 text-sm text-foreground/80">{event.date}</td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {new Date(event.deletedAt).toLocaleDateString('en-US', {
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
                            onClick={() => setEventToRestore(event)}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restore
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setEventToDelete(event)}
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
      <AlertDialog open={!!eventToRestore} onOpenChange={(open) => !open && setEventToRestore(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Restore Event?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to restore <span className="font-semibold">{eventToRestore?.title}</span>? It will be added back to your events list.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => eventToRestore && handleRestore(eventToRestore)}
              disabled={isRestoring}
              className='cursor-pointer'
            >
              {isRestoring ? 'Restoring...' : 'Restore'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Confirmation Dialog */}
      <AlertDialog open={!!eventToDelete} onOpenChange={(open) => !open && setEventToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Permanently Delete Event?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete <span className="font-semibold">{eventToDelete?.title}</span>? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => eventToDelete && handlePermanentDelete(eventToDelete)}
              disabled={isDeleting}
              className="bg-destructive text-background hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting ? 'Deleting...' : 'Permanently Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
