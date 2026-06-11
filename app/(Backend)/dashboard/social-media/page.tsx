'use client';

import Link from 'next/link';

import { FaLinkedin } from "react-icons/fa6";
import { SiFacebook, SiInstagram, SiX, SiWhatsapp } from "react-icons/si";

const socialMediaOptions = [
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    description: 'Integrate your Whatsapp handle to the website',
    href: '/dashboard/social-media/whatsapp',
    icon: SiWhatsapp,
    accentColor: 'bg-green-500',
  },
  {
    id: 'facebook',
    title: 'Facebook',
    description: 'Integrate your Facebook page to the website',
    href: '/dashboard/social-media/facebook',
    icon: SiFacebook,
    accentColor: 'bg-blue-600',
  },
  {
    id: 'instagram',
    title: 'Instagram',
    description: 'Integrate your Instagram page to the website',
    href: '/dashboard/social-media/instagram',
    icon: SiInstagram,
    accentColor: 'bg-pink-600',
  },
  {
    id: 'x',
    title: 'X / Formerly Twitter',
    description: 'Integrate your X page to the website',
    href: '/dashboard/social-media/x',
    icon: SiX,
    accentColor: 'bg-black',
  },
  {
    id: 'linkedin',
    title: 'LinkedIn',
    description: 'Integrate your LinkedIn page to the website',
    href: '/dashboard/social-media/linkedin',
    icon: FaLinkedin,
    accentColor: 'bg-blue-700',
  }
];

export default function SocialMediaPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground mb-4">
            Social Media Handles
          </h1>
          <p className="text-pretty text-lg text-muted-foreground">
            Manage your social media presence across all platforms
          </p>
        </div>

        {/* Social Media Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {socialMediaOptions.map((option) => {
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
                        <Icon className="size-8 text-background dark:text-white" />
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
                      <span className="text-sm font-medium">Manage</span>
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
