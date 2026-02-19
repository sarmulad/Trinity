'use client';

import * as React from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

/**
 * EmptyState component for empty data scenarios
 * @param icon - Optional icon
 * @param title - Empty state title
 * @param description - Optional description
 * @param action - Optional action button
 * @param className - Additional classes
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
        <h3 className="mb-1 text-lg font-semibold">{title}</h3>
        {description && (
          <p className="mb-4 text-sm text-muted-foreground">{description}</p>
        )}
        {action && (
          <Button onClick={action.onClick}>
            <Plus className="mr-2 h-4 w-4" />
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
