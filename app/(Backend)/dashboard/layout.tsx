import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Providers from '@/app/providers/providers';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getServerSession } from 'next-auth';
import React from 'react'

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

   const session = await getServerSession(authOptions);

  return (
    <Providers session={session}>
      <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar role={session?.user?.role as "ADMIN" | "USER"} variant="inset" />
      <SidebarInset>
        {
          session && (
            <SiteHeader/>
          )
        }
        <div className="flex flex-1 flex-col bg-white dark:bg-background rounded-br-xl rounded-bl-xl">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
    </Providers>
    
  )
}
