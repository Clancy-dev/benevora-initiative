'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { deleteEvent, getEvent } from '@/actions/events';
import toast from 'react-hot-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  order: number;
  createdAt: Date;
}

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const result = await getEvent(eventId);

        if (result.success && result.data) {
          setEvent(result.data as Event);
        } else {
          toast.error('Event not found')
          router.push('/dashboard/events');
        }
      } catch (error) {
        toast.error('Failed to load event')
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, toast, router]);

  const handleDelete = async () => {
    if (!event) return;

    setIsDeleting(true);

    try {
      const result = await deleteEvent(event.id);

      if (result.success) {
        toast.success('Event has been moved to trash.')
        router.push('/dashboard/events');
      } else {
        toast.error(result.error || 'Failed to delete event')
      }
    } catch (error) {
      toast.error('Failed to delete event')
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-foreground/60">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/events" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{event.title}</h1>
          <p className="text-foreground/60 mt-1">View event details</p>
        </div>
      </div>

      {/* Main Content */}
      <Card className='w-full max-w-3xl mx-auto'>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>View complete information about this event</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Event Image */}
          <div>
            <label className="block text-sm font-semibold mb-3">Event Image</label>
            <div className="relative w-full h-96 rounded-lg overflow-hidden border border-border">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Title</label>
            <p className="text-foreground/80">{event.title}</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
            <p className="text-foreground/80 whitespace-pre-wrap">{event.description}</p>
          </div>

          {/* Date and Order */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Event Date</label>
              <p className="text-foreground/80">{event.date}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Display Order</label>
              <p className="text-foreground/80">{event.order}</p>
            </div>
          </div>

          {/* Created Date */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Created</label>
            <p className="text-foreground/80">
              {new Date(event.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Link href={`/dashboard/events/edit?id=${event.id}`} className="flex-1">
              <Button className="w-full gap-2 cursor-pointer">
                <Edit className="h-4 w-4" />
                Edit Event
              </Button>
            </Link>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="gap-2 cursor-pointer"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Event?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-semibold">{event.title}</span>? You can restore it from the trash later.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-background hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
