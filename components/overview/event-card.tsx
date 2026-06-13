'use client';

import Image from 'next/image';
import Link from 'next/link';

interface EventCardProps {
  id: string;
  title: string;
  description?: string;
  image?: string;
  createdAt: Date;
}

export function EventCard({ id, title, description, image, createdAt }: EventCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Link href={`/dashboard/events/${id}`}>
      <div className="group flex gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-md">
        {image && (
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-between gap-2">
          <div>
            <h3 className="line-clamp-2 font-semibold text-foreground transition-colors group-hover:text-primary">
              {title}
            </h3>
            {description && (
              <p className="line-clamp-2 text-sm text-muted-foreground">{truncateText(description)}</p>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{formatDate(createdAt)}</p>
        </div>
      </div>
    </Link>
  );
}
