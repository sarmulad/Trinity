"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  GitBranch,
  Bell,
  FileText,
  Users,
  Menu,
  Search,
  ArrowUpDown,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from "./logo";

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
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortAsc, setSortAsc] = React.useState(true);

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname?.startsWith(`${item.href}/`);
  }

  const filteredNavItems = React.useMemo(() => {
    const items = searchQuery.trim()
      ? navItems.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : navItems;
    return sortAsc ? items : [...items].reverse();
  }, [searchQuery, sortAsc]);

  return (
    <aside className="flex h-screen w-[280px] flex-col border-r border-black/10 bg-white dark:border-white/10 dark:bg-[#26282C]">
      {/* Logo */}
      <div className="flex h-20 items-center justify-between border-b border-black/10 px-6 dark:border-white/10">
        <Logo />
        {onClose && (
          <button
            onClick={onClose}
            className="text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="grid grid-cols-2 gap-3">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-lg border p-6 transition-colors",
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

        {/* Dashboards section */}
        <div className="mt-8 space-y-2">
          <div className="flex w-full items-center justify-between">
            <button
              type="button"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-black/60 hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <Menu className="h-4 w-4" />
              <span>Dashboards</span>
            </button>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen((v) => !v)}
                className={cn(
                  "h-9 w-9 transition-colors",
                  searchOpen
                    ? "text-[#34C759]"
                    : "text-black/60 hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white",
                )}
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSortAsc((v) => !v)}
                className={cn(
                  "h-9 w-9 transition-colors",
                  !sortAsc
                    ? "text-[#34C759]"
                    : "text-black/60 hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white",
                )}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {searchOpen && (
            <div className="relative px-1">
              <Search className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/30 dark:text-white/30" />
              <input
                autoFocus
                type="text"
                placeholder="Search nav..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-black/10 bg-black/5 py-2 pl-8 pr-3 text-sm text-black placeholder:text-black/30 focus:border-[#34C759]/50 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30"
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-black/10 p-4 dark:border-white/10">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg border border-transparent bg-gray-100 px-4 py-3 hover:border-[#34C759]/50 dark:bg-[#252930]"
        >
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
        </button>
      </div>
    </aside>
  );
}
