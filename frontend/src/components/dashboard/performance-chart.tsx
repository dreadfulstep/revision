"use client"

import { TrendingUp } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const performanceData = [
  { day: "Mon", accuracy: 65, quizzes: 3 },
  { day: "Tue", accuracy: 72, quizzes: 4 },
  { day: "Wed", accuracy: 68, quizzes: 2 },
  { day: "Thu", accuracy: 78, quizzes: 5 },
  { day: "Fri", accuracy: 82, quizzes: 4 },
  { day: "Sat", accuracy: 75, quizzes: 3 },
  { day: "Sun", accuracy: 85, quizzes: 6 },
]

const chartConfig = {
  accuracy: {
    label: "Accuracy",
    color: "var(--color-primary)",
  },
  quizzes: {
    label: "Quizzes",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig

export function PerformanceChart() {
  return (
    <section aria-labelledby="performance-heading" className="rounded-2xl border border-border bg-card p-5">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="performance-heading" className="text-lg font-semibold">
            Weekly Performance
          </h2>
          <p className="text-sm text-muted-foreground">
            Your accuracy trend over the past week
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-1.5">
          <TrendingUp className="size-4 text-primary" />
          <span className="text-sm font-medium text-primary">+12% vs last week</span>
        </div>
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="h-50 sm:h-70 w-full">
        <AreaChart
          data={performanceData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(label) => label}
                formatter={(value, name) => (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{name}:</span>
                    <span className="font-medium">
                      {name === "Accuracy" ? `${value}%` : value}
                    </span>
                  </div>
                )}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="accuracy"
            stroke="var(--color-primary)"
            strokeWidth={2}
            fill="url(#accuracyGradient)"
            dot={{
              fill: "var(--color-primary)",
              strokeWidth: 2,
              r: 4,
              stroke: "var(--color-card)",
            }}
            activeDot={{
              fill: "var(--color-primary)",
              strokeWidth: 2,
              r: 6,
              stroke: "var(--color-card)",
            }}
          />
        </AreaChart>
      </ChartContainer>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Accuracy %</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-chart-2" />
          <span className="text-xs text-muted-foreground">Quizzes completed</span>
        </div>
      </div>
    </section>
  )
}
