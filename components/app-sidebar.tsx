"use client";

import * as React from "react";
import {
  IconBuilding,
  IconDashboard,
  IconFileAnalytics,
  IconFileText,
  IconReceipt,
  IconSettings,
  IconUser,
  IconUserCircle,
  IconUsers,
  IconWorld,

} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Accept role as prop
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role?: "ADMIN" | "USER";
}

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  // Filter nav items based on role
  const navMainItems = [
    {
      title: "Overview",
      url: "/dashboard/overview",
      icon: IconDashboard,
    },
    {
      title: "Receipts",
      url: "/dashboard/receipt/receipts",
      icon: IconReceipt,
    },
    {
      title: "Logs",
      url: "/dashboard/logs",
      icon: IconFileText,
    },
    // Only show these to ADMIN
    ...(role === "ADMIN"
      ? [
          {
            title: "Users",
            url: "/dashboard/users",
            icon: IconUsers,
          },
          {
            title: "All Logs",
            url: "/dashboard/allLogs",
            icon: IconFileAnalytics,
          },
        ]
      : []),
    {
      title: "Company Configuration",
      url: "/dashboard/companyConfiguration",
      icon: IconBuilding,
    },
    {
      title: "Account",
      url: "/dashboard/account",
      icon: IconUserCircle,
    },
     {
      title: "View Site",
      url: "/",
      icon: IconWorld,
    },
    
  ];



  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="/dashboard/overview">
                <span className="text-base font-semibold flex gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <IconReceipt className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h1 className="text-lg font-semibold">Receipt Generator</h1>
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMainItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}