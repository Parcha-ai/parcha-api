"use client"

import * as React from "react"
import { Link } from 'react-router-dom'
import {
  BarChartIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
  HelpCircleIcon,
  ZapIcon,
  FileTextIcon,
  BuildingIcon,
  ClipboardCheckIcon,
  BotIcon,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Compliance Agents",
      url: "/agents",
      icon: BotIcon
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Reviews",
      url: "/reviews",
      icon: ClipboardCheckIcon,
    },
    {
      title: "Businesses",
      url: "/businesses",
      icon: BuildingIcon,
    },
    {
      title: "Individuals",
      url: "/individuals",
      icon: UserIcon, 
    },
    {
      title: "Documents",
      url: "/documents",
      icon: FileTextIcon,
    },
    {
      title: "Reporting",
      url: "#",
      icon: BarChartIcon,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-transparent"
            >
              <div className="flex items-center w-full">
                <Link to="/dashboard" className="flex-1 flex items-center gap-3">
                  <ZapIcon className="h-5 w-5" />
                  <span className="text-base font-semibold group-data-[collapsible=icon]:hidden">Fastbank</span>
                </Link>
                <SidebarTrigger className="h-7 w-7 shrink-0 ml-auto" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
