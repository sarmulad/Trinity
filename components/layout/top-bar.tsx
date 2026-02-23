"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Bell,
  Settings,
  User,
  LogOut,
  Calendar,
  HelpCircle,
  ArrowLeftRight,
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

interface Ticker {
  id: string;
  icon: string;
  label: string;
  value: string;
}

const tickerData: Ticker[] = [
  { id: "1", icon: "NG", label: "NG", value: "$4/MCF" },
  { id: "2", icon: "BRENT", label: "BRENT", value: "$75/BBL" },
  { id: "3", icon: "WT1", label: "WT1", value: "$75/BBL" },
  { id: "4", icon: "NG", label: "NG", value: "$4/MCF" },
  { id: "5", icon: "BRENT", label: "BRENT", value: "$75/BBL" },
  { id: "6", icon: "WT1", label: "WT1", value: "$75/BBL" },
];

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Daily Summary",
  "/dashboard/reports": "Report",
  "/dashboard/wells": "Wells",
  "/dashboard/routes": "Routes",
  "/dashboard/alarms": "Alarms",
  "/dashboard/teams": "Teams",
};

function getPageTitle(pathname: string | null): string {
  if (!pathname) return "Daily Summary";
  const matched = Object.keys(PAGE_TITLES)
    .filter((path) => pathname === path || pathname.startsWith(path + "/"))
    .sort((a, b) => b.length - a.length)[0];
  return matched ? PAGE_TITLES[matched] : "Daily Summary";
}

export function TopBar() {
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
      {/* Main Header */}
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-transparent px-8">
        {/* Left Section - Title */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{displayTitle}</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="bg-transparent text-white/60 hover:bg-white/5 hover:text-white"
          >
            <ArrowLeftRight />
            Compare
          </Button>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center gap-3">
          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="bg-transparent text-white/60 hover:bg-white/5 hover:text-white"
          >
            <Settings className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative bg-transparent text-white/60 hover:bg-white/5 hover:text-white"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34C759] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34C759]" />
            </span>
          </Button>

          {/* Date */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-white/0 bg-transparent text-white/60 hover:bg-white/5 hover:text-white"
          >
            <Calendar className="h-4 w-4" />
            <span className="text-sm text-[#FFFFFF]">{formattedDate}</span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 bg-transparent hover:bg-white/5"
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
              className="w-72 border-white/10 bg-[#252930]"
            >
              <DropdownMenuLabel className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback className="bg-[#34C759] text-black">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-white">
                      TRINITY INTERNAL SUPER USER
                    </p>
                    <p className="text-xs text-white/60">
                      christian@isug-us.com
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-white hover:bg-white/5">
                <User className="mr-2 h-4 w-4" />
                <span>My Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-white/5">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Learn More</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <div className="px-2 py-1.5">
                <p className="text-xs text-white/60">
                  Powered by Instrumentation service Group LLC
                </p>
              </div>
              <DropdownMenuSeparator className="bg-white/10" />
              <div className="px-2 py-1.5">
                <p className="text-xs text-white/60">v0.0.0</p>
              </div>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="text-white hover:bg-white/5"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Scrolling Ticker */}
      <div className="relative h-12 overflow-hidden border-b border-white/10 bg-[#0a0e14]">
        <div className="flex h-full animate-marquee items-center gap-8 whitespace-nowrap">
          {[...tickerData, ...tickerData].map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {item.icon === "NG" && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20">
                    <svg
                      className="h-3 w-3 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <circle cx="10" cy="10" r="8" />
                    </svg>
                  </div>
                )}
                {item.icon === "BRENT" && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/20">
                    <svg
                      className="h-3 w-3 text-orange-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2 L14 10 L10 18 L6 10 Z" />
                    </svg>
                  </div>
                )}
                {item.icon === "WT1" && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
                    <svg
                      className="h-3 w-3 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2 L14 10 L10 18 L6 10 Z" />
                    </svg>
                  </div>
                )}
                <span className="text-sm font-medium text-white/60">
                  {item.label}:
                </span>
                <span className="text-sm font-bold text-white">
                  {item.value}
                </span>
              </div>
              <span className="text-white/20">•</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </>
  );
}
