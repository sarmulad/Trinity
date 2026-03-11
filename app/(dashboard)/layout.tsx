"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-[#0f1419]">
      <div
        className="fixed inset-0 z-0 hidden dark:block"
        style={{
          backgroundImage: "url('/images/dashboard-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-[#1B1E20]/90 backdrop-blur-sm" />
      </div>

      {/* Light mode subtle background */}
      <div className="fixed inset-0 z-0 block dark:hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100" />

      <div className="relative z-10 flex min-h-screen">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:w-[280px] lg:flex-shrink-0">
          <div className="fixed inset-y-0 left-0 w-[280px]">
            <Sidebar />
          </div>
        </div>

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </>
        )}

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
