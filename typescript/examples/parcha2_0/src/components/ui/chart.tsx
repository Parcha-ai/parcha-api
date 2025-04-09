"use client"

import * as React from "react"
import { ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export interface ChartConfig {
  [key: string]: {
    label: string
    color?: string
  }
}

interface ChartContainerProps extends React.ComponentProps<"div"> {
  config: ChartConfig
  children: React.ReactNode
}

export function ChartContainer({
  config,
  children,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <div
      className={cn("h-full w-full", className)}
      style={
        {
          "--color-desktop": config?.desktop?.color,
          "--color-mobile": config?.mobile?.color,
        } as React.CSSProperties
      }
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    color: string
    payload: {
      [key: string]: string | number
    }
    value: number
  }>
  label?: string
  labelFormatter?: (value: string) => string
  className?: string
  indicator?: "dot" | "line"
}

export function ChartTooltipContent({
  className,
  payload,
  label,
  labelFormatter,
  active,
  indicator = "dot",
}: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-background px-3 py-2 shadow-md",
        className
      )}
    >
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {labelFormatter?.(label as string) ?? label}
          </p>
        </div>
        <div className="grid gap-0.5">
          {payload.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                {indicator === "dot" ? (
                  <div
                    className="size-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                ) : (
                  <div
                    className="h-0.5 w-3"
                    style={{ backgroundColor: item.color }}
                  />
                )}

                <p className="text-sm font-medium text-muted-foreground">
                  {item.name}
                </p>
              </div>
              <p className="text-right text-sm font-medium tabular-nums">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { RechartsTooltip as ChartTooltip }
