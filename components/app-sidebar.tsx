"use client";

import * as React from "react";
import {
  IconActivity,
  IconAddressBook,
  IconArticle,
  IconBuilding,
  IconBuildingCommunity,
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
  IconUsersGroup,
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
      title: "Founders",
      url: "/dashboard/founders",
      icon: IconCrown,
    },
     {
      title: "Our Work",
      url: "/dashboard/work",
      icon: IconHeartHandshake,
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
      title: "Contact Information",
      url: "/dashboard/contact-information",
      icon: IconAddressBook,
    },
    {
      title: "Social Media",
      url: "/dashboard/social-media",
      icon: IconShare,
    }, 
    

    // Only show these to ADMIN
    ...(role === "ADMIN"
      ? [
          {
            title: "Users",
            url: "/dashboard/users",
            icon: IconUsers,
          },
          
        ]
      : []),

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
            <SidebarMenuButton asChild className="p-1.5 hover:bg-transparent focus:bg-transparent active:bg-transparent cursor-default">
              
              <div className="flex items-center gap-3 ">
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
</div>
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