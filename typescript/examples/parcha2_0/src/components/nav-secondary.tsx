"use client"

import * as React from "react"
import { Link, useLocation } from 'react-router-dom'
import { LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const location = useLocation();
  
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = location.pathname.includes(item.url) && item.url !== "#";
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className={isActive ? "bg-muted" : ""}>
                  <Link to={item.url}>
                    <item.icon className={isActive ? "text-primary" : ""} />
                    <span className={isActive ? "font-medium text-primary" : ""}>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
