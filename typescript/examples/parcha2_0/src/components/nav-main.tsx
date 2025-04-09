"use client"

import { Link, useLocation, useNavigate } from 'react-router-dom'
import * as React from "react"
import { 
  PlusCircleIcon, 
  UploadIcon, 
  ChevronDownIcon, 
  UserPlusIcon,
  BuildingIcon,
  ClipboardCheckIcon,
  ChevronRightIcon,
  type LucideIcon 
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    submenu?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State to track expanded submenus
  const [expandedMenus, setExpandedMenus] = React.useState<Record<string, boolean>>({});
  
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(url);
  };
  
  // Toggle submenu expanded state
  const toggleSubmenu = (title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };
  
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip="Quick Action"
                  className="min-w-8 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 duration-200 ease-linear group-data-[collapsible=icon]:!justify-center shadow-sm"
                >
                  <PlusCircleIcon className="text-indigo-600" />
                  <span className="flex-1 text-center group-data-[collapsible=icon]:hidden">Quick Action</span>
                  <ChevronDownIcon className="ml-1 h-4 w-4 group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:ml-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <ClipboardCheckIcon className="mr-2 h-4 w-4" />
                  <span>New Review</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BuildingIcon className="mr-2 h-4 w-4" />
                  <span>New Business</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserPlusIcon className="mr-2 h-4 w-4" />
                  <span>New Individual</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  <span>Bulk Upload</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = location.pathname.includes(item.url) && item.url !== "#";
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = expandedMenus[item.title];
            
            // Check if any submenu item is active
            const isAnySubmenuActive = hasSubmenu && 
              item.submenu?.some(subItem => {
                const searchParams = new URLSearchParams(new URL(subItem.url, window.location.origin).search);
                const statusParam = searchParams.get('status');
                return location.pathname.includes(item.url) && 
                  location.search.includes(`status=${statusParam}`);
              });
            
            return (
              <React.Fragment key={item.title}>
                <SidebarMenuItem>
                  {hasSubmenu ? (
                    <SidebarMenuButton 
                      tooltip={item.title}
                      className={(isActive || isAnySubmenuActive) ? "bg-muted" : ""}
                    >
                      <div className="flex items-center w-full">
                        {item.icon && <item.icon className={(isActive || isAnySubmenuActive) ? "text-primary" : ""} size={16} />}
                        <span className={(isActive || isAnySubmenuActive) ? "ml-2 font-medium text-primary" : "ml-2"}>{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton 
                      tooltip={item.title}
                      asChild
                      className={isActive ? "bg-muted" : ""}
                    >
                      <Link 
                        to={item.url} 
                        className="flex items-center gap-2"
                        onClick={(e) => handleNavigation(e, item.url)}
                      >
                        {item.icon && <item.icon className={isActive ? "text-primary" : ""} size={16} />}
                        <span className={isActive ? "font-medium text-primary" : ""}>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
                
                {/* Submenu items */}
                {hasSubmenu && (
                  <div className="relative pl-7 space-y-1 my-1">
                    {/* Vertical line connecting to parent icon */}
                    <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gray-200 ml-[8px]"></div>
                    
                    {item.submenu?.map(subItem => {
                      const searchParams = new URLSearchParams(new URL(subItem.url, window.location.origin).search);
                      const statusParam = searchParams.get('status');
                      const isSubActive = location.pathname.includes(item.url) && 
                        location.search.includes(`status=${statusParam}`);
                      
                      return (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton 
                            tooltip={subItem.title}
                            asChild
                            className={`text-sm py-1 ${isSubActive ? "bg-muted" : ""}`}
                          >
                            <Link 
                              to={subItem.url} 
                              className="flex items-center"
                              onClick={(e) => handleNavigation(e, subItem.url)}
                            >
                              <span className={isSubActive ? "font-medium text-primary" : ""}>{subItem.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
