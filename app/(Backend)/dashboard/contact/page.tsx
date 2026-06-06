'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

const contactOptions = [
  {
    id: 'phone',
    title: 'Phone Number',
    description: 'Make a change on the phone number.',
    href: '/contact/phone',
    icon: Phone,
    iconBg: 'bg-blue-500',
    hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
  },
  {
    id: 'email',
    title: 'Email',
    description: 'Make a change on the email.',
    href: '/contact/email',
    icon: Mail,
    iconBg: 'bg-purple-500',
    hoverBg: 'hover:bg-purple-50 dark:hover:bg-purple-900/20',
  },
  {
    id: 'location',
    title: 'Location',
    description: 'Make a change on the location.',
    href: '/dashboard/contact/location',
    icon: MapPin,
    iconBg: 'bg-orange-500',
    hoverBg: 'hover:bg-orange-50 dark:hover:bg-orange-900/20',
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background px-8 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground mb-4">
            Contact Information
          </h1>
          <p className="text-pretty text-lg text-muted-foreground">
            Choose your preferred way to make a change
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* PHONE */}
          <Link href="/contact/phone">
            <div className={`group relative h-full overflow-hidden rounded-xl bg-card border border-border p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-lg ${contactOptions[0].hoverBg}`}>
              <div className="relative z-10 flex h-full flex-col justify-between">

                <div className="mb-6 inline-flex">
                  <div className={`${contactOptions[0].iconBg} rounded-full p-3`}>
                    <Phone className="size-6 text-white" />
                  </div>
                </div>

                <div>
                  <h2 className="mb-2 text-xl font-semibold text-foreground">
                    Phone Number
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Make a change on the phone number.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                  <span className="text-sm font-medium">View</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>

              </div>
            </div>
          </Link>

          {/* EMAIL */}
          <Link href="/contact/email">
            <div className={`group relative h-full overflow-hidden rounded-xl bg-card border border-border p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-lg ${contactOptions[1].hoverBg}`}>
              <div className="relative z-10 flex h-full flex-col justify-between">

                <div className="mb-6 inline-flex">
                  <div className={`${contactOptions[1].iconBg} rounded-full p-3`}>
                    <Mail className="size-6 text-white" />
                  </div>
                </div>

                <div>
                  <h2 className="mb-2 text-xl font-semibold text-foreground">
                    Email
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Make a change on the email.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                  <span className="text-sm font-medium">View</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>

              </div>
            </div>
          </Link>

          {/* LOCATION */}
          <Link href="/dashboard/contact/location">
            <div className={`group relative h-full overflow-hidden rounded-xl bg-card border border-border p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-lg ${contactOptions[2].hoverBg}`}>
              <div className="relative z-10 flex h-full flex-col justify-between">

                <div className="mb-6 inline-flex">
                  <div className={`${contactOptions[2].iconBg} rounded-full p-3`}>
                    <MapPin className="size-6 text-white" />
                  </div>
                </div>

                <div>
                  <h2 className="mb-2 text-xl font-semibold text-foreground">
                    Location
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Make a change on the location.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                  <span className="text-sm font-medium">View</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>

              </div>
            </div>
          </Link>

        </div>
      </div>
    </main>
  );
}