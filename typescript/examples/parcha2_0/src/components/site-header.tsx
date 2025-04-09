import React from "react"
import { useLocation } from "react-router-dom"
import { 
  LayoutDashboardIcon, 
  BuildingIcon, 
  ClipboardCheckIcon, 
  UserIcon, 
  FileTextIcon,
  BarChartIcon,
  UsersIcon
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  const location = useLocation()
  
  const getPageInfo = () => {
    const path = location.pathname
    if (path.includes("/dashboard")) return { title: "Dashboard", icon: LayoutDashboardIcon }
    if (path.includes("/businesses")) return { title: "Businesses", icon: BuildingIcon }
    if (path.includes("/reviews")) return { title: "Reviews", icon: ClipboardCheckIcon }
    if (path.includes("/individuals")) return { title: "Individuals", icon: UserIcon }
    if (path.includes("/documents")) return { title: "Documents", icon: FileTextIcon }
    if (path.includes("/reporting")) return { title: "Reporting", icon: BarChartIcon }
    if (path.includes("/agents")) return { title: "Agents", icon: UsersIcon }
    return { title: "Dashboard", icon: LayoutDashboardIcon }
  }

  const pageInfo = getPageInfo()
  const Icon = pageInfo.icon

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <h1 className="text-base font-medium">{pageInfo.title}</h1>
        </div>
      </div>
    </header>
  )
}
