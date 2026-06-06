'use client';

import Link from 'next/link';
import { Banknote, Phone } from 'lucide-react';

const donationOptions = [
  {
    id: 'bank',
    title: 'Bank Donation Details',
    description: 'Make a change to your bank donation details.',
    href: '/donation/bank',
    icon: Banknote,
    iconBg: 'bg-green-500 dark:bg-green-600',
    hoverBg: 'hover:bg-green-50 dark:hover:bg-green-900/20'
  },
  {
    id: 'phone',
    title: 'Phone Number Donation Details',
    description: 'Make a change to your phone number donation details.',
    href: '/donation/phone',
    icon: Phone,
    iconBg: 'bg-blue-500 dark:bg-blue-600',
    hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
  }
];

export default function DonationPage() {
  return (
    <main className="min-h-screen bg-background px-8 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground mb-4">
            Donation Information
          </h1>
          <p className="text-pretty text-lg text-muted-foreground">
            Choose your preferred way to make a change
          </p>
        </div>

        {/* Donation Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {donationOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Link key={option.id} href={option.href}>
                <div className={`group relative h-full overflow-hidden rounded-xl bg-card border border-border p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-lg ${option.hoverBg}`}>
                  {/* Content */}
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    {/* Icon Container */}
                    <div className="mb-6 inline-flex">
                      <div className={`rounded-full ${option.iconBg} p-3`}>
                        <Icon className="size-6 text-white" />
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
                      <span className="text-sm font-medium">View</span>
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
