import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { FileText, Calendar, Image as ImageIcon } from 'lucide-react';
import { Suspense } from 'react';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getOverviewData } from '@/actions/overview';
import { GreetingSection } from '@/components/overview/greeting-section';
import { StatCard } from '@/components/overview/stat-card';
import { BlogCard } from '@/components/overview/blog-card';
import { EventCard } from '@/components/overview/event-card';
import { QuickActions } from '@/components/overview/quick-actions';
import { BlogCardSkeleton, EventCardSkeleton, GreetingSkeleton, StatCardSkeleton } from '@/components/overview/skeletons';
import Link from 'next/link';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

async function OverviewContent() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const firstName = session?.user?.firstName ?? '';
  const role = session?.user?.role ?? '';

  const result = await getOverviewData();

  if (!result.success || !result.data) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center text-destructive">
        Failed to load overview data. Please try again later.
      </div>
    );
  }

  const { totalBlogs, totalEvents, workInAction, recentBlogs, recentEvents } = result.data;

  return (
    <>
      {/* Greeting Section */}
      <div className="mb-8 border-b border-border pb-8">
        <GreetingSection greeting={getGreeting()} firstName={firstName} role={role} />
        <p className="text-sm text-muted-foreground">Welcome back to Benevora Initiative</p>
        <p className="mt-1 text-sm font-medium text-foreground">
          Here&apos;s what&apos;s happening on your website today.
        </p>
      </div>

      {/* Statistics Cards */}
      <section className="mb-12">
        <h2 className="mb-6 text-lg font-semibold text-foreground">Statistics</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Total Blogs" value={totalBlogs} icon={<FileText className="h-8 w-8" />} />
          <StatCard label="Total Events" value={totalEvents} icon={<Calendar className="h-8 w-8" />} />
          <StatCard label="Work in Action" value={workInAction} icon={<ImageIcon className="h-8 w-8" />} />
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Blog Posts</h2>
          {recentBlogs.length > 0 && (
            <Link
              href="/dashboard/blogs"
              className="text-sm text-primary transition-colors hover:text-primary/80"
            >
              View all →
            </Link>
          )}
        </div>
        {recentBlogs.length > 0 ? (
          <div className="space-y-4">
            {recentBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                title={blog.title}
                category={blog.category}
                image={blog.image}
                createdAt={blog.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">No blog posts yet. Create your first one!</p>
          </div>
        )}
      </section>

      {/* Events */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Events</h2>
          {recentEvents.length > 0 && (
            <Link
              href="/dashboard/events"
              className="text-sm text-primary transition-colors hover:text-primary/80"
            >
              View all →
            </Link>
          )}
        </div>
        {recentEvents.length > 0 ? (
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                image={event.image}
                createdAt={event.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">No events yet. Create your first one!</p>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <QuickActions />
    </>
  );
}

function OverviewLoading() {
  return (
    <>
      {/* Greeting Skeleton */}
      <div className="mb-8 border-b border-border pb-8">
        <GreetingSkeleton />
        <div className="h-3 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-3 w-96 animate-pulse rounded bg-muted" />
      </div>

      {/* Statistics Skeletons */}
      <section className="mb-12">
        <div className="mb-6 h-6 w-24 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 md:grid-cols-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </section>

      {/* Recent Blogs Skeletons */}
      <section className="mb-12">
        <div className="mb-6 h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="space-y-4">
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </div>
      </section>

      {/* Events Skeletons */}
      <section className="mb-12">
        <div className="mb-6 h-6 w-24 animate-pulse rounded bg-muted" />
        <div className="space-y-4">
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
        </div>
      </section>
    </>
  );
}

export default function OverviewPage() {
  return (
    <main className="space-y-8 px-4 py-8 sm:px-6 md:px-8">
      <Suspense fallback={<OverviewLoading />}>
        <OverviewContent />
      </Suspense>
    </main>
  );
}
