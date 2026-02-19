"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative flex min-h-screen bg-[#0f1419]"
      style={{
        backgroundImage: "url('/images/dashboard-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-[#1B1E20]/90 backdrop-blur-sm" />

      <Sidebar />

      <div className="relative ml-[280px] flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
