"use client";

import * as React from "react";
import {
  ArrowLeft,
  BarChart3,
  LayoutDashboard,
  MessageSquare,
  Bell,
  Cpu,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { ErrorBoundary } from "@/components/error-boundary";
import { ProductionTab } from "@/components/lease/production/production-tab";
import { DashboardTab } from "@/components/lease/dashboard/dashboard-tab";

const TABS = [
  { id: "production", label: "Production", icon: BarChart3 },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "alarms", label: "Alarms", icon: Bell },
  { id: "device-info", label: "Device Info", icon: Cpu },
] as const;

type TabId = (typeof TABS)[number]["id"];

function useProductionData(leaseId: string, enabled: boolean) {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!enabled) return;
    // setIsLoading(true);
    // setError(null);
    // fetch(`/api/tago/production?leaseId=${leaseId}`)
    //   .then((r) => r.json())
    //   .then((json) => setData(json))
    //   .catch((e) => setError(e.message))
    //   .finally(() => setIsLoading(false));
  }, [leaseId, enabled]);

  return { data, isLoading, error };
}

function useDashboardData(leaseId: string, enabled: boolean) {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!enabled) return;
    // setIsLoading(true);
    // setError(null);
    // fetch(`/api/tago/dashboard?leaseId=${leaseId}`)
    //   .then((r) => r.json())
    //   .then((json) => setData(json))
    //   .catch((e) => setError(e.message))
    //   .finally(() => setIsLoading(false));
  }, [leaseId, enabled]);

  return { data, isLoading, error };
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex h-48 items-center justify-center rounded-xl border border-white/10 bg-[#1e2025] text-sm text-white/30">
      {label} — coming soon
    </div>
  );
}

interface LeasePageProps {
  params: { id: string };
}

export default function LeasePage({ params }: LeasePageProps) {
  const router = useRouter();
  const leaseId = params.id;

  const [activeTab, setActiveTab] = React.useState<TabId>("production");

  const [visitedTabs, setVisitedTabs] = React.useState<Set<TabId>>(
    new Set(["production"])
  );

  function handleTabChange(id: TabId) {
    setActiveTab(id);
    setVisitedTabs((prev) => new Set([...prev, id]));
  }

  const { data: prodData, isLoading: prodLoading } = useProductionData(
    leaseId,
    visitedTabs.has("production")
  );

  const { data: dashData, isLoading: dashLoading } = useDashboardData(
    leaseId,
    visitedTabs.has("dashboard")
  );

  return (
    <ErrorBoundary>
      <div className="space-y-4 lg:space-y-5">
        {/* ── Page header ── */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#252930] transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">
            Johnson Lease
          </h1>
        </div>

        {/* ── Tab bar ── */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#34C759] text-black"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            );
          })}
        </div>

        {/* ── Tab content ── */}
        <div>
          {activeTab === "production" && (
            <ProductionTab
              productionData={prodData?.records}
              stats={prodData?.stats}
              leaseScore={prodData?.leaseScore}
              returnRisk={prodData?.returnRisk}
              allocatedWells={prodData?.allocatedWells}
              moreInfo={prodData?.moreInfo}
              isLoading={prodLoading}
            />
          )}

          {activeTab === "dashboard" && (
            <DashboardTab
              oilTanks={dashData?.oilTanks}
              compressor={dashData?.compressor}
              wells={dashData?.wells}
              teamMembers={dashData?.teamMembers}
              isLoading={dashLoading}
            />
          )}

          {activeTab === "messages" && <ComingSoon label="Messages" />}
          {activeTab === "alarms" && <ComingSoon label="Alarms" />}
          {activeTab === "device-info" && <ComingSoon label="Device Info" />}
        </div>
      </div>
    </ErrorBoundary>
  );
}
