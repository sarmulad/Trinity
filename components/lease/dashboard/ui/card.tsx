import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  interactive = false,
  className,
  onClick,
  onKeyDown,
  role,
  tabIndex,
}: {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  role?: React.AriaRole;
  tabIndex?: number;
}) {
  return (
    <div
      onClick={onClick}
      onKeyDown={onKeyDown}
      role={role}
      tabIndex={tabIndex}
      className={cn(
        "rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#1e2025]",
        interactive &&
          "cursor-pointer transition-all hover:border-[#34C759]/45 hover:bg-black/[0.02] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] dark:hover:bg-white/[0.03]",
        className,
      )}
    >
      {children}
    </div>
  );
}
