"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface BaseChartProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  error?: string;
  actions?: React.ReactNode;
}

export function BaseChart({
  title,
  description,
  children,
  className,
  loading = false,
  error,
  actions,
}: BaseChartProps) {
  if (error) {
    return (
      <Card className={className}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent className="flex h-80 items-center justify-center">
          <div className="text-center text-sm text-muted-foreground">
            <p className="font-medium text-destructive">Error loading chart</p>
            <p className="mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className={className}>
        {(title || description) && (
          <CardHeader>
            {title && (
              <CardTitle>
                <div className="h-6 w-48 animate-pulse rounded bg-muted" />
              </CardTitle>
            )}
            {description && (
              <CardDescription>
                <div className="h-4 w-64 animate-pulse rounded bg-muted" />
              </CardDescription>
            )}
          </CardHeader>
        )}
        <CardContent>
          <div className="h-80 animate-pulse rounded-lg bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {(title || description || actions) && (
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {actions && (
              <div className="flex items-center gap-2">{actions}</div>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div className={cn("h-80 w-full", !title && !description && "pt-6")}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

export function ChartContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative h-full w-full", className)}>{children}</div>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-80 w-full animate-pulse rounded-lg bg-muted", className)}
    />
  );
}
