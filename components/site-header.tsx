"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "./theme-toggle"

const pageTitles: Record<string, string> = {
  "/dashboard/overview": "Overview",
  "dashboard/account/edit": "Edit Your Profile",
  "/dashboard/account": "Account",
  "/dashboard/companyConfiguration": "Company Configuration",
  "/dashboard/allLogs": "All Logs",
  "/dashboard/logs": "Logs",
  "/dashboard/users": "Users",
  "/dashboard/userslogs": "Users Logs",
  "/dashboard/receipt/create": "Create Receipt",
  "/dashboard/receipt/edit": "Edit Receipt",
  "/dashboard/receipt/receipts": "All Receipts",
  "/dashboard/receipt/view": "View Receipt",
  
  
}

export function SiteHeader() {
  const pathname = usePathname()

  const title = pageTitles[pathname] || "Dashboard"
  

  

  return (
    <header className="bg-white dark:bg-card rounded-tr-xl rounded-tl-xl flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle/>
        </div>
      </div>
    </header>
  )
}
