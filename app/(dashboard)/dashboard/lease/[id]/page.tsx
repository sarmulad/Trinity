"use client";

import { useState, useEffect, use } from "react";
import {
  ArrowLeft,
  ArrowLeftRight,
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
import { DeviceInfoTab } from "@/components/lease/device-info/device-info-tab";
import { CompareToolModal } from "@/components/compare/compare-tool-modal";
import { DASHBOARD_TREE } from "@/data/dashboard-tree";

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

interface LeasePageProps {
  params: Promise<{ id: string }>;
}

export default function LeasePage({ params }: LeasePageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [leaseCompareOpen, setLeaseCompareOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<TabId>("production");
  const [visitedTabs, setVisitedTabs] = useState<Set<TabId>>(
    new Set(["production"]),
  );

  function handleTabChange(tabId: TabId) {
    setActiveTab(tabId);
    setVisitedTabs((prev) => new Set([...prev, tabId]));
  }

  const { data: prodData, isLoading: prodLoading } = useProductionData(
    id,
    visitedTabs.has("production"),
  );
  const { data: dashData, isLoading: dashLoading } = useDashboardData(
    id,
    visitedTabs.has("dashboard"),
  );
  const leaseMeta = DASHBOARD_TREE.flatMap((company) => company.routes ?? [])
    .flatMap((route) => route.leases ?? [])
    .find((lease) => lease.id === id);
  const displayLeaseName = leaseMeta?.name ?? "Johnson Lease";

  return (
    <ErrorBoundary>
      <div className="space-y-4 lg:space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-gray-100 transition-colors hover:bg-black/10 dark:border-white/10 dark:bg-[#252930] dark:hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 text-black dark:text-white" />
            </button>
            <h1 className="text-2xl font-bold text-black dark:text-white lg:text-3xl">
              {displayLeaseName}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setLeaseCompareOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-black/10 bg-gray-100 px-3 py-1.5 text-xs font-medium text-black/70 transition-colors hover:border-[#34C759]/50 hover:text-black dark:border-white/10 dark:bg-[#252930] dark:text-white/70 dark:hover:text-white"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            Compare
          </button>
        </div>

        <div className="flex w-fit items-center gap-1 rounded-[12px] bg-gray-100 p-2 dark:bg-[#191C22]">
          {TABS.map(({ id: tabId, label, icon: Icon }) => {
            const isActive = activeTab === tabId;
            return (
              <button
                key={tabId}
                onClick={() => handleTabChange(tabId)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#34C759] text-black"
                    : "text-black/50 hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white"
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
            />
          )}
          {activeTab === "messages" && <MessagesTab />}
          {activeTab === "alarms" && <AlarmsTab title="Alarm" />}
          {activeTab === "device-info" && <DeviceInfoTab />}
        </div>
      </div>
      <CompareToolModal
        open={leaseCompareOpen}
        onOpenChange={setLeaseCompareOpen}
        scope="lease"
        leaseId={id}
        leaseName={displayLeaseName}
      />
    </ErrorBoundary>
  );
}
