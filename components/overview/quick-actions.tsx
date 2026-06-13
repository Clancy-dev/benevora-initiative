'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function QuickActions() {
  return (
    <section className="mt-12">
      <h2 className="mb-6 text-xl font-semibold text-foreground">Quick Actions</h2>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/dashboard/blogs/new">+ Add Blog Post</Link>
        </Button>
        <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
          <Link href="/dashboard/events/new">+ Create Event</Link>
        </Button>
      </div>
    </section>
  );
}
