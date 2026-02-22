"use client";

import { useState, useEffect, use } from "react";
import {
  ArrowLeft,
  BarChart3,
  LayoutDashboard,
  MessageCircleMore,
  Bell,
  MonitorSpeaker,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { ErrorBoundary } from "@/components/error-boundary";
import { ProductionTab } from "@/components/lease/production/production-tab";
import { DashboardTab } from "@/components/lease/dashboard/dashboard-tab";
import { AlarmsTab } from "@/components/alarms/alarms-tab";
import { MessagesTab } from "@/components/lease/messages/messages-tab";

const TABS = [
  { id: "production", label: "Production", icon: BarChart3 },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "messages", label: "Messages", icon: MessageCircleMore },
  { id: "alarms", label: "Alarms", icon: Bell },
  { id: "device-info", label: "Device Info", icon: MonitorSpeaker },
] as const;

type TabId = (typeof TABS)[number]["id"];

function useProductionData(id: string, enabled: boolean) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
  }, [id, enabled]);

  return { data, isLoading, error };
}

function useDashboardData(id: string, enabled: boolean) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
  }, [id, enabled]);

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
  params: Promise<{ id: string }>;
}

export default function LeasePage({ params }: LeasePageProps) {
  const router = useRouter();
  const { id: id } = use(params);

  const [activeTab, setActiveTab] = useState<TabId>("production");
  const [visitedTabs, setVisitedTabs] = useState<Set<TabId>>(
    new Set(["production"]),
  );

  function handleTabChange(id: TabId) {
    setActiveTab(id);
    setVisitedTabs((prev) => new Set([...prev, id]));
  }

  const { data: prodData, isLoading: prodLoading } = useProductionData(
    id,
    visitedTabs.has("production"),
  );

  const { data: dashData, isLoading: dashLoading } = useDashboardData(
    id,
    visitedTabs.has("dashboard"),
  );

  return (
    <ErrorBoundary>
      <div className="space-y-4 lg:space-y-5">
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

        <div className="flex items-center w-fit gap-1 rounded-[12px] p-2 bg-[#191C22]">
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
              compressors={dashData?.compressor}
              wells={dashData?.wells}
              teamMembers={dashData?.teamMembers}
              isLoading={dashLoading}
            />
          )}

          {activeTab === "messages" && <MessagesTab />}
          {activeTab === "alarms" && <AlarmsTab title="Alarm" />}
          {activeTab === "device-info" && <ComingSoon label="Device Info" />}
        </div>
      </div>
    </ErrorBoundary>
  );
}
