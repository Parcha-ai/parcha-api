import { AppSidebar } from "@/components/app-sidebar"
import { DocumentsDataTable } from "@/components/documents-data-table"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { FileTextIcon } from "lucide-react"

import data from "./data.json"

export default function DocumentsPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 py-2 lg:px-6">
                <div className="flex items-center gap-2 mb-1">
                  <FileTextIcon className="h-6 w-6 text-primary" />
                  <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
                </div>
                <p className="text-muted-foreground">
                  Manage and access all your important documents in one place.
                </p>
              </div>
              <DocumentsDataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 