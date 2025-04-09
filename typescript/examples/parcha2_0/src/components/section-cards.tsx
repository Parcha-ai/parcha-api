import { CheckCircle2Icon, AlertTriangleIcon, BuildingIcon, ClipboardCheckIcon, UserIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import reviewsData from "@/app/reviews/data.json"
import businessesData from "@/app/businesses/data.json" 
import individualsData from "@/app/individuals/data.json"

export function SectionCards() {
  // Calculate business metrics
  const activeBusinesses = businessesData.filter(b => b.status === "Active").length;
  const totalBusinessRevenue = businessesData.reduce((sum, business) => {
    const revenue = business.revenue.replace(/[^0-9.]/g, '');
    return sum + parseFloat(revenue);
  }, 0);
  const highRiskBusinesses = businessesData.filter(b => b.riskLevel === "High").length;
  const mediumRiskBusinesses = businessesData.filter(b => b.riskLevel === "Medium").length;
  const lowRiskBusinesses = businessesData.filter(b => b.riskLevel === "Low").length;
  
  // Calculate reviews metrics
  const pendingReviews = reviewsData.filter(r => r.status === "Pending").length;
  const inProgressReviews = reviewsData.filter(r => r.status === "In Progress").length;
  const completedReviews = reviewsData.filter(r => r.status === "Completed").length;
  const overallCompletionRate = reviewsData.reduce((sum, review) => sum + review.completionRate, 0) / reviewsData.length;
  
  // Calculate risk metrics
  const highRiskReviews = reviewsData.filter(r => r.riskLevel === "High").length;
  const mediumRiskReviews = reviewsData.filter(r => r.riskLevel === "Medium").length;
  const lowRiskReviews = reviewsData.filter(r => r.riskLevel === "Low").length;
  
  // Calculate individuals metrics
  const activeIndividuals = individualsData.filter(i => i.status === "Active").length;
  const pendingIndividuals = individualsData.filter(i => i.status === "Pending").length;
  const highRiskIndividuals = individualsData.filter(i => i.riskLevel === "High").length;
  const mediumRiskIndividuals = individualsData.filter(i => i.riskLevel === "Medium").length;
  const lowRiskIndividuals = individualsData.filter(i => i.riskLevel === "Low").length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
        <CardHeader className="relative pb-5">
          <div className="flex justify-between items-start mb-1">
            <CardDescription>Active Businesses</CardDescription>
            <Badge variant="outline" className="flex gap-1 px-2 py-1 rounded-lg">
              <BuildingIcon className="size-3.5" />
            </Badge>
          </div>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {activeBusinesses}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex w-full justify-between items-center">
            <span className="text-red-700 flex items-center gap-1">
              <AlertTriangleIcon className="size-3.5" /> {highRiskBusinesses}
            </span>
            <span className="text-amber-700 flex items-center gap-1">
              <AlertTriangleIcon className="size-3.5" /> {mediumRiskBusinesses}
            </span>
            <span className="text-green-700 flex items-center gap-1">
              <CheckCircle2Icon className="size-3.5" /> {lowRiskBusinesses}
            </span>
          </div>
          <div className="text-muted-foreground">
            {reviewsData.filter(r => r.type.includes("Business")).length} active reviews
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
        <CardHeader className="relative pb-5">
          <div className="flex justify-between items-start mb-1">
            <CardDescription>Active Individuals</CardDescription>
            <Badge variant="outline" className="flex gap-1 px-2 py-1 rounded-lg">
              <UserIcon className="size-3.5" />
            </Badge>
          </div>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {activeIndividuals}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex w-full justify-between items-center">
            <span className="text-red-700 flex items-center gap-1">
              <AlertTriangleIcon className="size-3.5" /> {highRiskIndividuals}
            </span>
            <span className="text-amber-700 flex items-center gap-1">
              <AlertTriangleIcon className="size-3.5" /> {mediumRiskIndividuals}
            </span>
            <span className="text-green-700 flex items-center gap-1">
              <CheckCircle2Icon className="size-3.5" /> {lowRiskIndividuals}
            </span>
          </div>
          <div className="text-muted-foreground">
            {reviewsData.filter(r => r.type.includes("Individual")).length} active reviews
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
        <CardHeader className="relative pb-5">
          <div className="flex justify-between items-start mb-1">
            <CardDescription>Compliance Reviews</CardDescription>
            <Badge variant="outline" className="flex gap-1 px-2 py-1 rounded-lg">
              <ClipboardCheckIcon className="size-3.5" />
            </Badge>
          </div>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            450+
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex w-full justify-between items-center">
            <span className="flex items-center gap-1">
              <BuildingIcon className="text-blue-500 size-3.5" /> 290
            </span>
            <span className="flex items-center gap-1">
              <UserIcon className="text-indigo-500 size-3.5" /> 160
            </span>
          </div>
          <div className="text-muted-foreground">
            Business vs Individual reviews
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card bg-gradient-to-t from-primary/5 to-card">
        <CardHeader className="relative pb-5">
          <div className="flex justify-between items-start mb-1">
            <CardDescription>Risk Level Distribution</CardDescription>
            <Badge variant="outline" className="flex gap-1 px-2 py-1 rounded-lg bg-amber-100 text-amber-700 border-amber-200">
              <AlertTriangleIcon className="size-3.5" />
            </Badge>
          </div>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            470+
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="flex w-full justify-between items-center">
            <span className="flex items-center gap-1 text-red-700">
              <AlertTriangleIcon className="size-3.5" /> ~{highRiskReviews + highRiskBusinesses + highRiskIndividuals}
            </span>
            <span className="flex items-center gap-1 text-amber-700">
              <AlertTriangleIcon className="size-3.5" /> ~{mediumRiskReviews + mediumRiskBusinesses + mediumRiskIndividuals}
            </span>
            <span className="flex items-center gap-1 text-green-700">
              <CheckCircle2Icon className="size-3.5" /> ~{lowRiskReviews + lowRiskBusinesses + lowRiskIndividuals}
            </span>
          </div>
          <div className="text-muted-foreground">
            Total entities with risk flags
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
