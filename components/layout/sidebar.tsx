"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  GitBranch,
  Bell,
  FileText,
  Users,
  Search,
  ArrowUpDown,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from "./logo";
import { DashboardTree } from "./dashboard-tree";
import { DASHBOARD_TREE } from "@/data/dashboard-tree";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const navItems: NavItem[] = [
  { title: "Daily Summary", href: "/dashboard", icon: LayoutGrid, exact: true },
  { title: "Routes", href: "/dashboard/routes", icon: GitBranch },
  { title: "Alarms", href: "/dashboard/alarms", icon: Bell },
  { title: "Reports", href: "/dashboard/reports", icon: FileText },
  { title: "Teams", href: "/dashboard/teams", icon: Users },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: () => void;
  onExpand?: () => void;
  onClose?: () => void;
}

export function Sidebar({
  collapsed,
  onCollapse,
  onExpand,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname?.startsWith(`${item.href}/`);
  }

  if (collapsed) {
    return (
      <aside className="flex h-screen w-[60px] flex-col items-center border-r border-black/10 bg-white py-4 dark:border-white/10 dark:bg-[#26282C]">
        <button
          onClick={onExpand}
          title="Expand sidebar"
          className="mb-6 flex h-8 w-8 items-center justify-center rounded-md text-black/40 transition-colors hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </button>
        <nav className="flex flex-col items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.title}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  active
                    ? "bg-[#34C759]/10 text-[#34C759]"
                    : "text-black/60 hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white",
                )}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </nav>
      </aside>
    );
  }

  return (
    <aside className="flex h-screen w-[280px] flex-col border-r border-black/10 bg-white dark:border-white/10 dark:bg-[#26282C]">
      <div className="flex h-20 items-center justify-between border-b border-black/10 px-6 dark:border-white/10">
        <Logo />
        <button
          onClick={() => {
            onCollapse?.();
            onClose?.();
          }}
          title="Collapse sidebar"
          className="flex h-8 w-8 items-center justify-center rounded-md text-black/40 transition-colors hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <PanelLeftClose className="h-5 w-5" />
        </button>
      </div>

      {!searchFocused && (
        <div className="px-4 pt-4">
          <div className="grid grid-cols-2 gap-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-colors",
                    item.exact && "col-span-2",
                    active
                      ? "border-[#34C759] bg-[#34C759]/10"
                      : "border-black/10 bg-gray-50 hover:border-[#34C759]/50 dark:border-white/10 dark:bg-[#252930] dark:hover:border-[#34C759]/50",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6",
                      active
                        ? "text-[#34C759]"
                        : "text-black/60 dark:text-white/60",
                    )}
                  />
                  <span
                    className={cn(
                      "text-center text-sm font-medium",
                      active
                        ? "text-[#34C759]"
                        : "text-black/80 dark:text-white/80",
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden px-4 pt-6">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40">
            Dashboards
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSearchOpen((v) => !v);
                setSearchQuery("");
                setSearchFocused(false);
              }}
              className={cn(
                "h-7 w-7",
                searchOpen
                  ? "text-[#34C759]"
                  : "text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white",
              )}
            >
              <Search className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSortAsc((v) => !v)}
              className={cn(
                "h-7 w-7",
                !sortAsc
                  ? "text-[#34C759]"
                  : "text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white",
              )}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {searchOpen && (
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-black/30 dark:text-white/30" />
            <input
              autoFocus
              type="text"
              placeholder="Search dashboards..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchFocused(e.target.value.length > 0);
              }}
              className="w-full rounded-lg border border-black/10 bg-black/5 py-1.5 pl-8 pr-3 text-xs text-black placeholder:text-black/30 focus:border-[#34C759]/50 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30"
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <DashboardTree
            data={DASHBOARD_TREE}
            searchQuery={searchQuery}
            sortAsc={sortAsc}
          />
        </div>
      </div>

      <div className="border-t border-black/10 p-4 dark:border-white/10">
        <div className="flex w-full items-center gap-3 rounded-lg border border-transparent bg-gray-100 px-4 py-3 hover:border-[#34C759]/50 dark:bg-[#252930]">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-black/10 dark:bg-white/10">
            <svg
              viewBox="0 0 100 100"
              className="h-5 w-5 fill-black dark:fill-white"
            >
              <path d="M50 10 L90 90 L10 90 Z" />
            </svg>
          </div>
          <span className="flex-1 text-left text-sm font-medium text-black dark:text-white">
            Trinity Energy
          </span>
          <ChevronDown className="h-4 w-4 text-black/60 dark:text-white/60" />
        </div>
      </div>
    </aside>
  );
}
