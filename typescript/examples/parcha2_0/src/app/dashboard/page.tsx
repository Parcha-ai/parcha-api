import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { ReviewsDataTable } from "@/components/reviews-data-table"
import { SectionCards } from "@/components/section-cards"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AlertTriangleIcon, LayoutDashboardIcon } from "lucide-react"

import reviewsData from "@/app/reviews/data.json"

export default function Page() {
  // Filter reviews to show only High and Medium risk levels
  const highAndMediumRiskReviews = reviewsData.filter(review => 
    review.riskLevel === "High" || review.riskLevel === "Medium"
  );
  
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 py-2 lg:px-6">
                <div className="flex items-center gap-2 mb-1">
                  <LayoutDashboardIcon className="h-6 w-6 text-primary" />
                  <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                </div>
                <p className="text-muted-foreground">
                  Overview of your compliance monitoring activities.
                </p>
              </div>
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <div className="px-4 py-2 lg:px-6">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangleIcon className="h-6 w-6 text-red-500" />
                  <h1 className="text-2xl font-bold tracking-tight">High & Medium Risk Reviews</h1>
                </div>
                <p className="text-muted-foreground">
                  Reviews requiring immediate attention due to elevated risk level.
                </p>
              </div>
              <ReviewsDataTable data={highAndMediumRiskReviews} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 