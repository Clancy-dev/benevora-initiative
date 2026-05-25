'use client';
import Link from 'next/link';
import { 
  Home, 
  FileText, 
  Calendar, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Heart 
} from 'lucide-react';

const bannerPages = [
  {
    id: 'home',
    title: 'Home',
    description: 'Manage banners on the home page',
    href: '/dashboard/banners/home',
    icon: Home,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'about',
    title: 'About',
    description: 'Edit banners on the about page',
    href: '/dashboard/banners/about',
    icon: FileText,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'events',
    title: 'Events',
    description: 'Manage event page banners',
    href: '/dashboard/banners/events',
    icon: Calendar,
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'blogs',
    title: 'Blogs',
    description: 'Update blog section banners',
    href: '/dashboard/banners/blogs',
    icon: BookOpen,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'membership',
    title: 'Membership',
    description: 'Customize membership page banners',
    href: '/dashboard/banners/membership',
    icon: Users,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'contact',
    title: 'Contact',
    description: 'Manage contact page banners',
    href: '/dashboard/banners/contact',
    icon: MessageSquare,
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'donate',
    title: 'Donate',
    description: 'Edit donation page banners',
    href: '/dashboard/banners/donate',
    icon: Heart,
    color: 'from-red-500 to-red-600'
  }
];

export default function BannersPage() {
  return (
      <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
              Banner Management
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage banners for each section of your website
            </p>
          </div>

          {/* Banner Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bannerPages.map((page) => {
              const Icon = page.icon;
              return (
                <Link
                  key={page.id}
                  href={page.href}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/50 active:scale-95"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${page.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Content */}
                  <div className="relative p-6 flex flex-col h-48">
                    {/* Icon Container */}
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br ${page.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {page.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {page.description}
                      </p>
                    </div>

                    {/* Arrow Indicator */}
                    <div className="mt-auto pt-4">
                      <div className="inline-flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-sm font-medium mr-1">Edit</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Stats Section */}
          <div className="mt-16 pt-12 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-lg bg-card border border-border p-6">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total Pages
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {bannerPages.length}
                </p>
              </div>
              <div className="rounded-lg bg-card border border-border p-6">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Banners Available
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {bannerPages.length}
                </p>
              </div>
              <div className="rounded-lg bg-card border border-border p-6">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Status
                </p>
                <p className="text-3xl font-bold text-foreground text-green-600">
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
