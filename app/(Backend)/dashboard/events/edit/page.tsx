'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getEvent } from '@/actions/events';
import { EventForm } from '@/components/events/EventForm';

export default function EditEventPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id');
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        toast({
          title: 'Error',
          description: 'Event ID not found',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      try {
        const result = await getEvent(eventId);

        if (result.success && result.data) {
          setEvent(result.data);
        } else {
          toast({
            title: 'Error',
            description: 'Failed to load event',
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load event',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, toast]);

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
    return (
      <div className="space-y-6 p-8">
        <Link href="/dashboard/events">
          <Button variant="outline">← Back to Events</Button>
        </Link>
        <div className="text-center">
          <p className="text-foreground/60">Event not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/events" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Event</h1>
          <p className="text-foreground/60 mt-1">Update event details</p>
        </div>
      </div>

      <EventForm mode="edit" initialData={event} eventId={eventId || ''} />
    </div>
  );
}
