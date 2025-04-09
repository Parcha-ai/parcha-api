"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import reviewsData from "@/app/reviews/data.json"

// Define interfaces for our data
interface ChartDataPoint {
  date: string;
  completed: number;
  inProgress: number;
  pending: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

// Generate weekly data
const generateWeeklyData = (): ChartDataPoint[] => {
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const currentMonth = new Date().toLocaleString('default', { month: 'short' });
  
  // Starting values - reduced to approximately half
  let completed = 310;
  let inProgress = 75;
  let pending = 15;
  let high = 22;     // Fewer high risk
  let medium = 48;    // More medium risk
  let low = 330;     // Mostly low risk
  
  return weeks.map((week, index) => {
    // Create weekly fluctuations that match the requested pattern
    if (index === 0) {
      // Week 1: ~400 reviews
      high = 22;
      medium = 48;
      low = 330;
      completed = 310;
      inProgress = 75;
      pending = 15;
    } else if (index === 1) {
      // Week 2: ~500 reviews with increased Medium Risk
      high = 30;
      medium = 85;  // Notable increase in Medium Risk reviews
      low = 385;
      completed = 375;
      inProgress = 100;
      pending = 25;
    } else if (index === 2) {
      // Week 3: ~425 reviews with increased High Risk
      high = 42;     // Notable increase in High Risk reviews
      medium = 50;
      low = 333;
      completed = 325;
      inProgress = 85;
      pending = 15;
    } else {
      // Week 4: ~450 reviews
      high = 28;
      medium = 55;
      low = 367;
      completed = 340;
      inProgress = 90;
      pending = 20;
    }
    
    const total = high + medium + low;
    
    return {
      date: `${week}, ${currentMonth}`,
      completed,
      inProgress,
      pending,
      high,
      medium,
      low,
      total
    };
  });
};

// Generate monthly data
const generateTimelineData = (): ChartDataPoint[] => {
  // Create a 6-month dataset with trend patterns
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const currentYear = new Date().getFullYear();
  
  // Starting values - reduced to approximately half
  let completed = 340;
  let inProgress = 90;
  let pending = 20;
  let high = 28;
  let medium = 55;
  let low = 367;
  
  return months.map((month, index) => {
    // Create realistic growth patterns
    completed += Math.floor(Math.random() * 25) + 10;
    inProgress += Math.floor(Math.random() * 15) - 5;
    pending += Math.floor(Math.random() * 10) - 3;
    
    high += Math.floor(Math.random() * 5) + 1;
    medium += Math.floor(Math.random() * 10) + 3;
    low += Math.floor(Math.random() * 40) + 15;
    
    // Ensure no negative values
    inProgress = Math.max(inProgress, 75);
    pending = Math.max(pending, 15);
    
    const total = high + medium + low;
    
    return {
      date: `${month} ${currentYear}`,
      completed,
      inProgress,
      pending,
      high,
      medium,
      low,
      total
    };
  });
};

// Generate quarterly data
const generateQuarterlyData = (): ChartDataPoint[] => {
  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  const currentYear = new Date().getFullYear();
  
  // Adjusted starting values - reduced to approximately half
  let completed = 900;
  let inProgress = 275;
  let pending = 75;
  let high = 80;
  let medium = 170;
  let low = 1000;
  
  return quarters.map((quarter) => {
    completed += Math.floor(Math.random() * 100) + 50;
    inProgress += Math.floor(Math.random() * 50) - 15;
    pending += Math.floor(Math.random() * 25) - 5;
    
    high += Math.floor(Math.random() * 20) + 10;
    medium += Math.floor(Math.random() * 30) + 15;
    low += Math.floor(Math.random() * 150) + 75;
    
    inProgress = Math.max(inProgress, 250);
    pending = Math.max(pending, 50);
    
    const total = high + medium + low;
    
    return {
      date: `${quarter} ${currentYear}`,
      completed,
      inProgress,
      pending,
      high,
      medium,
      low,
      total
    };
  });
};

// Get data based on selected timeframe
const getFilteredData = (timeframe: string): ChartDataPoint[] => {
  switch (timeframe) {
    case "week":
      return generateWeeklyData();
    case "month":
      return generateTimelineData();
    case "quarter":
      return generateQuarterlyData();
    default:
      return generateWeeklyData();
  }
};

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("week")
  const [chartView, setChartView] = React.useState<"status" | "risk" | "total">("risk")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("week")
    }
  }, [isMobile])

  const chartData = React.useMemo(() => {
    return getFilteredData(timeRange);
  }, [timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader className="pb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
          <div>
            <CardTitle>Compliance Review Trends</CardTitle>
            <CardDescription>
              <span className="@[540px]/card:block hidden">
                {chartView === "status" 
                  ? "Review volume by status over time" 
                  : chartView === "risk"
                  ? "Review volume by risk level over time"
                  : "Total reviews over time"}
              </span>
              <span className="@[540px]/card:hidden">Review trends</span>
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row items-end sm:items-center mt-2 sm:mt-0">
            <ToggleGroup
              type="single"
              value={chartView}
              onValueChange={(value) => value && setChartView(value as "status" | "risk" | "total")}
              className="mb-2 sm:mb-0 sm:mr-3"
              size="sm"
            >
              <ToggleGroupItem value="status" className="text-xs px-2 h-6">
                Status
              </ToggleGroupItem>
              <ToggleGroupItem value="risk" className="text-xs px-2 h-6">
                Risk
              </ToggleGroupItem>
              <ToggleGroupItem value="total" className="text-xs px-2 h-6">
                Total
              </ToggleGroupItem>
            </ToggleGroup>
            
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="@[767px]/card:flex hidden"
              size="sm"
            >
              <ToggleGroupItem value="week" className="text-xs px-2 h-6">
                Week
              </ToggleGroupItem>
              <ToggleGroupItem value="month" className="text-xs px-2 h-6">
                Month
              </ToggleGroupItem>
              <ToggleGroupItem value="quarter" className="text-xs px-2 h-6">
                Quarter
              </ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="@[767px]/card:hidden flex w-24 h-7 text-xs"
                aria-label="Select a timeframe"
              >
                <SelectValue placeholder="Week" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="week" className="rounded-lg text-xs">
                  Week
                </SelectItem>
                <SelectItem value="month" className="rounded-lg text-xs">
                  Month
                </SelectItem>
                <SelectItem value="quarter" className="rounded-lg text-xs">
                  Quarter
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="aspect-auto h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartView === "status" ? (
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11 }}
                  width={35}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    value, 
                    name === "completed" ? "Completed" : 
                    name === "inProgress" ? "In Progress" : 
                    "Pending"
                  ]}
                />
                <Legend 
                  formatter={(value) => 
                    value === "completed" ? "Completed" : 
                    value === "inProgress" ? "In Progress" : 
                    "Pending"
                  }
                  wrapperStyle={{ fontSize: '11px', marginTop: '10px' }}
                  iconSize={8}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stackId="1"
                  stroke="#10b981"
                  fill="url(#colorCompleted)"
                  name="completed"
                />
                <Area
                  type="monotone"
                  dataKey="inProgress"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="url(#colorInProgress)"
                  name="inProgress"
                />
                <Area
                  type="monotone"
                  dataKey="pending"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="url(#colorPending)"
                  name="pending"
                />
              </AreaChart>
            ) : chartView === "risk" ? (
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11 }}
                  width={35}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    value, 
                    name === "high" ? "High Risk" : 
                    name === "medium" ? "Medium Risk" : 
                    "Low Risk"
                  ]}
                />
                <Legend 
                  formatter={(value) => 
                    value === "high" ? "High Risk" : 
                    value === "medium" ? "Medium Risk" : 
                    "Low Risk"
                  }
                  wrapperStyle={{ fontSize: '11px', marginTop: '10px' }}
                  iconSize={8}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="high"
                  stackId="1"
                  stroke="#ef4444"
                  fill="url(#colorHigh)"
                  name="high"
                />
                <Area
                  type="monotone"
                  dataKey="medium"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="url(#colorMedium)"
                  name="medium"
                />
                <Area
                  type="monotone"
                  dataKey="low"
                  stackId="1"
                  stroke="#10b981"
                  fill="url(#colorLow)"
                  name="low"
                />
              </AreaChart>
            ) : (
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11 }}
                  width={35}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#8884d8"
                  fill="url(#colorTotal)"
                  name="Total Reviews"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
