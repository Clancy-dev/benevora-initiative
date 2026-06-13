'use client';

import Image from 'next/image';
import Link from 'next/link';

interface BlogCardProps {
  id: string;
  title: string;
  category: string;
  image?: string;
  createdAt: Date;
}

export function BlogCard({ id, title, category, image, createdAt }: BlogCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link href={`/dashboard/blogs/${id}`}>
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
            <p className="text-xs text-muted-foreground">{category}</p>
          </div>
          <p className="text-xs text-muted-foreground">{formatDate(createdAt)}</p>
        </div>
      </div>
    </Link>
  );
}
