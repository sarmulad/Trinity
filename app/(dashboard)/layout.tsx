"use client";

import "@/lib/ag-grid-config";
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-[#0f1419]">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/images/dashboard-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-white/68 backdrop-blur-[1px] bg-[#f3f3f3]/80 dark:bg-[#1B1E20]/90 dark:backdrop-blur-sm" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div
            className={`fixed inset-y-0 left-0 ${sidebarCollapsed ? "w-[60px]" : "w-[280px]"}`}
          >
            <Sidebar
              collapsed={sidebarCollapsed}
              onCollapse={() => setSidebarCollapsed(true)}
              onExpand={() => setSidebarCollapsed(false)}
            />
          </div>
        </div>

        <div
          className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${sidebarCollapsed ? "w-[60px]" : "w-[280px]"}`}
        />

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

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
