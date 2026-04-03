import * as React from 'react'
import { ArrowDown, ArrowUp, TrendingUp } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface MetricCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
  className?: string
  loading?: boolean
}

/**
 * MetricCard component for displaying key metrics and statistics
 * @param title - Metric title
 * @param value - Main metric value
 * @param icon - Optional icon
 * @param trend - Optional trend data (percentage change)
 * @param description - Optional description or unit
 * @param className - Additional classes
 * @param loading - Loading state
 */
export function MetricCard({
  title,
  value,
  icon,
  trend,
  description,
  className,
  loading = false,
}: MetricCardProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </CardTitle>
          <div className="h-4 w-4 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-3 w-20 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="mt-1 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                'flex items-center gap-1 font-medium',
                trend.isPositive ? 'text-chart-2' : 'text-destructive'
              )}
            >
              {trend.isPositive ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {Math.abs(trend.value)}%
            </span>
          )}
          {description && (
            <span className="text-muted-foreground">{description}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
