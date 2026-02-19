import * as React from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

/**
 * PageHeader component for consistent page titles and descriptions
 * @param title - Main page title
 * @param description - Optional page description
 * @param actions - Optional action buttons or components
 * @param className - Additional classes
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="space-y-1">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-pretty text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
