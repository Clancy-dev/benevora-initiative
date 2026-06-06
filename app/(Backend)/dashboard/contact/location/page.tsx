'use client';

import Link from 'next/link';
import { MapPin, Map, Image } from 'lucide-react';

const locationOptions = [
  {
    id: 'address',
    title: 'Address',
    description: 'View and manage our office address',
    href: '/contact/location/address',
    icon: MapPin,
    accentColor: 'from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400'
  },
  {
    id: 'maps',
    title: 'Google Maps Snippet',
    description: 'Embed and manage map location',
    href: '/contact/location/maps',
    icon: Map,
    accentColor: 'from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400'
  },
  {
    id: 'photos',
    title: 'Office Photos',
    description: 'Upload and manage office gallery',
    href: '/contact/location/photos',
    icon: Image,
    accentColor: 'from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400'
  }
];

export default function LocationPage() {
  return (
    <main className="min-h-screen bg-background px-8 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <Link href="/dashboard/contact" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6">
            <span>←</span>
            <span className="text-sm font-medium">Back to Contact Information</span>
          </Link>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground mb-4">
            Location
          </h1>
          <p className="text-pretty text-lg text-muted-foreground">
            Manage all location-related information and media
          </p>
        </div>

        {/* Location Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {locationOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Link key={option.id} href={option.href}>
                <div className="group relative h-full overflow-hidden rounded-xl bg-card border border-border p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
                  {/* Gradient Background Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${option.accentColor} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    {/* Icon Container */}
                    <div className="mb-6 inline-flex">
                      <div
                        className={`rounded-full bg-gradient-to-br ${option.accentColor} p-3`}
                      >
                        <Icon className="size-6 text-card" />
                      </div>
                    </div>

                    {/* Text Content */}
                    <div>
                      <h2 className="mb-2 text-xl font-semibold text-foreground">
                        {option.title}
                      </h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        {option.description}
                      </p>
                    </div>

                    {/* Arrow Indicator */}
                    <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                      <span className="text-sm font-medium">Edit</span>
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
