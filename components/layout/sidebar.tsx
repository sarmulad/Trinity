"use client";

import { AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { Avatar } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  GitBranch,
  Bell,
  FileText,
  Users,
  Menu,
  Search,
  ArrowUpDown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Logo from "./logo";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    title: "Daily Summary",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    title: "Routes",
    href: "/dashboard/routes",
    icon: GitBranch,
  },
  {
    title: "Alarms",
    href: "/dashboard/alarms",
    icon: Bell,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
  },
  {
    title: "Teams",
    href: "/dashboard/teams",
    icon: Users,
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed = false, onCollapse }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[280px] flex-col border-r border-white/10 bg-[#26282C]">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <Logo />
      </div>

      <div className="flex-1 px-6 py-6">
        <div className="grid grid-cols-2 gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-2 rounded-lg border p-6 transition-colors",
                  isActive
                    ? "border-[#34C759] bg-[#34C759]/10"
                    : "border-white/10 bg-[#252930] hover:border-[#34C759]/50"
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6",
                    isActive ? "text-[#34C759]" : "text-white/60"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium text-center",
                    isActive ? "text-[#34C759]" : "text-white/80"
                  )}
                >
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Dashboards Section */}
        <div className="mt-8">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white"
          >
            <Menu className="h-4 w-4" />
            <span>Dashboards</span>
          </button>

          {/* Search & Filter */}
          <div className="mt-3 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 bg-transparent text-white/60 hover:bg-white/5 hover:text-white"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 bg-transparent text-white/60 hover:bg-white/5 hover:text-white"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg border border-white/0 bg-[#252930] px-4 py-3 hover:border-[#34C759]/50"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded bg-white/10">
            <svg viewBox="0 0 100 100" className="h-5 w-5 fill-white">
              <path d="M50 10 L90 90 L10 90 Z" />
            </svg>
          </div>
          <span className="flex-1 text-left text-sm font-medium text-white">
            Trinity Energy
          </span>
          <ChevronDown className="h-4 w-4 text-white/60" />
        </button>
      </div>
    </aside>
  );
}
