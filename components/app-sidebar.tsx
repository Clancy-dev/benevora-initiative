"use client";

import * as React from "react";
import {
  IconActivity,
  IconAddressBook,
  IconArticle,
  IconBuilding,
  IconCalendarEvent,
  IconCrown,
  IconDashboard,
  IconFileAnalytics,
  IconFileText,
  IconHeart,
  IconHeartHandshake,
  IconLayout,
  IconLayoutDashboard,
  IconPhoto,
  IconReceipt,
  IconSettings,
  IconShare,
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
import Image from "next/image";
import { useTheme } from "next-themes";

// Accept role as prop
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role?: "ADMIN" | "USER";
}

export function AppSidebar({ role, ...props }: AppSidebarProps) {

  const { theme } = useTheme();

  // Filter nav items based on role
  const navMainItems = [
    {
      title: "Overview",
      url: "/dashboard/overview",
      icon: IconLayoutDashboard,
    },
    {
      title: "Banners",
      url: "/dashboard/banners",
      icon: IconPhoto,
    },
    {
      title: "Contact Information",
      url: "/dashboard/contact-information",
      icon: IconAddressBook,
    },
    {
      title: "Social Media",
      url: "/dashboard/social-media",
      icon: IconShare,
    },
     {
      title: "Events",
      url: "/dashboard/events",
      icon: IconCalendarEvent,
    },
    {
      title: "Blogs",
      url: "/dashboard/blogs",
      icon: IconArticle,
    },
     {
      title: "Office Photos",
      url: "/dashboard/office-photos",
      icon: IconBuilding,
    },
    {
      title: "Donation Information",
      url: "/dashboard/donation-information",
      icon: IconHeart,
    },
     {
      title: "Founders",
      url: "/dashboard/founders",
      icon: IconCrown,
    },
     {
      title: "My Activity",
      url: "/dashboard/my-activity",
      icon: IconActivity,
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
            title: "Global Activity",
            url: "/dashboard/global-activity",
            icon: IconFileText,
          },
        ]
      : []),

       {
      title: "View Site",
      url: "/",
      icon: IconWorld,
    },
     {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
  
   
    
  ];



  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="/dashboard/overview" className="flex items-center gap-3">
  <div className="relative w-8 h-8">
    <Image
      src={theme === "dark" ? "/logo-dark.png" : "/logo.png"}
      alt="Benevora Initiative"
      fill
      className="object-contain"
    />
  </div>

  <div className="flex flex-col leading-tight">
    <span className="text-sm font-bold text-primary">
      Benevora
    </span>
    <span className="text-xs text-muted-foreground">
      Initiative
    </span>
  </div>
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