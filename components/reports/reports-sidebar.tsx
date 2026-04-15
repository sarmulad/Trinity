"use client";

import * as React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { cn } from "@/lib/utils";

import { SIDEBAR_GROUPS } from "./report-constants";
import type { SidebarSectionKey } from "./types";

type ReportsSidebarProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  activeKey: SidebarSectionKey;
  onSelectSection: (key: SidebarSectionKey) => void;
};

export function ReportsSidebar({
  collapsed,
  onToggleCollapsed,
  activeKey,
  onSelectSection,
}: ReportsSidebarProps) {
  return (
    <aside
      className={cn(
        "w-full shrink-0 border-b border-black/10 bg-gray-50/70 p-4 transition-[width,padding] duration-200 dark:border-white/10 dark:bg-[#252930]/70",
        "lg:border-b-0 lg:border-r",
        collapsed ? "lg:w-[60px] lg:p-2" : "lg:w-[240px]",
      )}
    >
      <div
        className={cn(
          "mb-3 hidden lg:flex",
          collapsed ? "justify-center" : "justify-end",
        )}
      >
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand navigation" : "Collapse navigation"}
          className="flex h-8 w-8 items-center justify-center rounded-md text-black/50 transition-colors hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      {SIDEBAR_GROUPS.map((group, groupIndex) => (
        <div key={group.title} className="mb-3">
          <p
            className={cn(
              "mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40",
              collapsed && "lg:sr-only",
            )}
          >
            {group.title}
          </p>
          <div className="space-y-1">
            {group.items.map(({ key, label, icon: Icon }) => {
              const active = activeKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  title={collapsed ? label : undefined}
                  onClick={() => onSelectSection(key)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                    collapsed && "lg:justify-center lg:px-2 lg:py-2.5",
                    active
                      ? "bg-[#34C759]/10 font-medium text-[#34C759]"
                      : "text-black/70 hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      collapsed && "lg:h-5 lg:w-5",
                    )}
                  />
                  <span className={cn(collapsed && "lg:sr-only")}>{label}</span>
                </button>
              );
            })}
          </div>
          {groupIndex < SIDEBAR_GROUPS.length - 1 && (
            <div
              className={cn(
                "mx-2 mt-3 border-t border-black/10 dark:border-white/10",
                collapsed && "lg:mx-0 lg:mt-2",
              )}
            />
          )}
        </div>
      ))}
    </aside>
  );
}
