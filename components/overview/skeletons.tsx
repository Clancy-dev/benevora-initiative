export function StatCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-3">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-8 w-16 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-8 w-8 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-lg border border-border bg-card p-4">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted animate-pulse" />
      <div className="flex flex-1 flex-col justify-between gap-2">
        <div className="flex flex-col gap-2">
          <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-3 w-20 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-lg border border-border bg-card p-4">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted animate-pulse" />
      <div className="flex flex-1 flex-col justify-between gap-2">
        <div className="flex flex-col gap-2">
          <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
        </div>
        <div className="h-3 w-20 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function GreetingSkeleton() {
  return (
    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2">
        <div className="h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
