import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { EventForm } from '@/components/events/EventForm';

export const metadata = {
  title: 'Create Event',
  description: 'Create a new event',
};

export default function CreateEventPage() {
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/events" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Event</h1>
          <p className="text-foreground/60 mt-1">Add a new event to your system</p>
        </div>
      </div>

      <EventForm mode="create" />
    </div>
  );
}
