import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="space-y-1">
        {description && (
          <p className="text-pretty text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
