"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import {
  Bell,
  Settings,
  User,
  LogOut,
  Calendar,
  HelpCircle,
  ArrowLeftRight,
  Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Ticker } from "./ticker";

interface Ticker {
  id: string;
  icon: string;
  label: string;
  value: string;
}

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Daily Summary",
  "/dashboard/reports": "Report",
  "/dashboard/wells": "Wells",
  "/dashboard/routes/submissions": "Route",
  "/dashboard/routes": "Routes",
  "/dashboard/alarms": "Alarms",
  "/dashboard/teams": "Teams",
  "/dashboard/settings": "Settings",
  "/dashboard/profile": "Profile",
};

function getPageTitle(pathname: string | null): string {
  if (!pathname) return "Daily Summary";
  const matched = Object.keys(PAGE_TITLES)
    .filter((path) => pathname === path || pathname.startsWith(path + "/"))
    .sort((a, b) => b.length - a.length)[0];
  return matched ? PAGE_TITLES[matched] : "Daily Summary";
}

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const router = useRouter();
  const pathname = usePathname();
  const displayTitle = getPageTitle(pathname ?? null);

  const handleSignOut = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-black/10 bg-white/80 backdrop-blur-sm px-4 dark:border-white/10 dark:bg-transparent lg:px-8">
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={onMenuClick}
            className="text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <h1 className="text-3xl font-bold text-black dark:text-white">
            {displayTitle}
          </h1>

          {pathname === "/dashboard" && (
            <Button
              variant="ghost"
              size="sm"
              className="hidden bg-transparent text-black/60 hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white sm:flex"
            >
              <ArrowLeftRight className="mr-1 h-4 w-4" />
              Compare
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1 lg:gap-3">
          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            className="bg-transparent text-black/60 hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
            asChild
          >
            <Link href="/dashboard/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative bg-transparent text-black/60 hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34C759] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34C759]" />
            </span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="hidden gap-2 border-transparent bg-transparent text-black/60 hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white sm:flex"
          >
            <Calendar className="h-4 w-4" />
            <span className="text-sm text-black dark:text-white">
              {formattedDate}
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 bg-transparent hover:bg-black/5 dark:hover:bg-white/5"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback className="bg-[#34C759] text-black">
                    JD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-72 border-black/10 bg-white dark:border-white/10 dark:bg-[#252930]"
            >
              <DropdownMenuLabel className="pb-3">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-bold text-black dark:text-white">
                      TRINITY INTERNAL SUPER USER
                    </p>
                    <p className="text-xs text-black/60 dark:text-white/60">
                      christian@isug-us.com
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />
              <DropdownMenuItem
                className="text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/5"
                asChild
              >
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>My Account</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />

              <DropdownMenuItem className="text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/5">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Learn More</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />
              <div className="px-2 py-1.5">
                <p className="text-xs text-black/60 dark:text-white/60">
                  Powered by Instrumentation service Group LLC
                </p>
              </div>
              <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />
              <div className="px-2 py-1.5">
                <p className="text-xs text-black/60 dark:text-white/60">
                  v0.0.0
                </p>
              </div>
              <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />
              <DropdownMenuItem
                className="text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/5"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <Ticker />
    </>
  );
}
