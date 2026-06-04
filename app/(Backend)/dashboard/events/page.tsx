import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { getAllEvents } from '@/actions/events';
import { EventTable } from '@/components/events/EventTable';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  order: number;
}

export default async function EventsPage() {
  const result = await getAllEvents();
  const events = result.success ? result.data || [] : [];

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <p className="text-foreground/60 mt-1">Manage your upcoming events</p>
        </div>
        <div className="flex gap-2">
                  <Link href="/dashboard/events/trash">
                    <Button variant="outline" size="sm" className="cursor-pointer">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Trash
                    </Button>
                  </Link>
      
          <Link href="/dashboard/events/create">
            <Button size="sm" className="gap-2 cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
          </Link>
       
        </div>
      </div>


      {/* Events Table */}
      <EventTable events={events} />
    </div>
  );
}
