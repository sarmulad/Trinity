"use client";

import * as React from "react";
import { CreditCard, PanelLeftClose, PanelLeftOpen, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/error-boundary";
import { cn } from "@/lib/utils";

import { ApplicationPlaceholderSection } from "./application-setup/application-placeholder-section";
import { AreasSection } from "./application-setup/areas-section";
import { BatteriesSection } from "./application-setup/batteries-section";
import { BatteryDetailSection } from "./application-setup/battery-detail-section";
import { CompanyInfoSection } from "./application-setup/company-info-section";
import { LeasesSection } from "./application-setup/leases-section";
import { MenuBreadcrumbsSection } from "./application-setup/menu-breadcrumbs-section";
import { RoutesSection } from "./application-setup/routes-section";
import { TransportSection } from "./application-setup/transport-section";
import type { BatteryRow } from "./application-setup/mock-data";
import { InvoicesTab } from "./invoices-tab";
import { PlatformPreferencesTab } from "./platform-preferences-tab";
import { PermissionsTab } from "@/components/teams/permissions/permissions-tab";
import {
  SETTINGS_NAV,
  getActiveNavId,
  getAddLabel,
  getMainTitle,
  type SettingsSectionId,
  type SettingsViewState,
} from "./settings-navigation";

export function SettingsPage() {
  const [view, setView] = React.useState<SettingsViewState>({
    type: "section",
    id: "company",
  });
  const [settingsNavCollapsed, setSettingsNavCollapsed] = React.useState(false);

  const activeNavId = getActiveNavId(view);
  const title = getMainTitle(view);
  const addLabel = getAddLabel(view);

  const goSection = React.useCallback((id: SettingsSectionId) => {
    setView({ type: "section", id });
  }, []);

  const openBattery = React.useCallback((battery: BatteryRow) => {
    setView({ type: "battery-detail", battery });
  }, []);

  const backToBatteries = React.useCallback(() => {
    setView({ type: "section", id: "batteries" });
  }, []);

  const renderMain = () => {
    if (view.type === "battery-detail") {
      return (
        <BatteryDetailSection
          battery={view.battery}
          onBackToBatteries={backToBatteries}
        />
      );
    }

    switch (view.id) {
      case "company":
        return <CompanyInfoSection />;
      case "areas":
        return <AreasSection />;
      case "routes":
        return <RoutesSection />;
      case "leases":
        return <LeasesSection />;
      case "batteries":
        return <BatteriesSection onOpenBattery={openBattery} />;
      case "assets":
        return (
          <ApplicationPlaceholderSection
            title="Assets"
            description="Assets are managed within each battery. Select a battery from the batteries list to manage its assets."
            onGoToBatteries={() => goSection("batteries")}
          />
        );
      case "wells":
        return (
          <ApplicationPlaceholderSection
            title="Wells"
            description="Wells are managed within each battery. Select a battery from the batteries list to manage its wells."
            onGoToBatteries={() => goSection("batteries")}
          />
        );
      case "transport":
        return <TransportSection />;
      case "breadcrumbs":
        return <MenuBreadcrumbsSection />;
      case "platform":
        return <PlatformPreferencesTab />;
      case "invoices":
        return <InvoicesTab />;
      case "permissions":
        return <PermissionsTab />;
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <Card className="border-black/10 bg-white dark:border-white/10 dark:bg-[#1A1C1E]/95">
          <CardContent className="p-0">
            <div className="flex min-h-[560px] flex-col lg:flex-row">
              <aside
                className={cn(
                  "w-full shrink-0 border-b border-black/10 bg-black/[0.02] transition-[width] duration-200 dark:border-white/10 dark:bg-[#1E2126]/80",
                  "lg:border-b-0 lg:border-r",
                  settingsNavCollapsed ? "lg:w-[60px]" : "lg:w-56",
                )}
              >
                <div
                  className={cn(
                    "px-3 py-3",
                    settingsNavCollapsed && "lg:px-2 lg:py-2",
                  )}
                >
                  <div
                    className={cn(
                      "mb-3 hidden lg:flex",
                      settingsNavCollapsed ? "justify-center" : "justify-end",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setSettingsNavCollapsed((c) => !c)}
                      aria-expanded={!settingsNavCollapsed}
                      title={
                        settingsNavCollapsed
                          ? "Expand navigation"
                          : "Collapse navigation"
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-md text-black/50 transition-colors hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                      {settingsNavCollapsed ? (
                        <PanelLeftOpen className="h-5 w-5" />
                      ) : (
                        <PanelLeftClose className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <p
                    className={cn(
                      "px-2 pb-2 text-[11px] font-medium uppercase tracking-wide text-black/45 dark:text-white/45",
                      settingsNavCollapsed && "lg:sr-only",
                    )}
                  >
                    Application setup
                  </p>
                  <nav className="flex flex-col gap-0.5" aria-label="Settings sections">
                    {SETTINGS_NAV.filter((n) => n.group === "setup").map((item) => (
                      <div key={item.id}>
                        {item.separatorBefore && (
                          <div
                            className={cn(
                              "my-2 h-px bg-black/10 dark:bg-white/10",
                              settingsNavCollapsed && "lg:my-1.5",
                            )}
                            aria-hidden
                          />
                        )}
                        <button
                          type="button"
                          title={settingsNavCollapsed ? item.label : undefined}
                          onClick={() => goSection(item.id)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors",
                            item.indent && "pl-6",
                            settingsNavCollapsed &&
                              "lg:justify-center lg:px-2 lg:py-2.5 lg:pl-2",
                            activeNavId === item.id
                              ? "bg-[#34C759]/15 font-medium text-[#14532d] dark:text-[#86efac]"
                              : "text-black/65 hover:bg-black/[0.04] hover:text-black dark:text-white/65 dark:hover:bg-white/[0.06] dark:hover:text-white",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-4 w-4 shrink-0 opacity-70",
                              settingsNavCollapsed && "lg:h-5 lg:w-5",
                            )}
                            aria-hidden
                          />
                          <span
                            className={cn(settingsNavCollapsed && "lg:sr-only")}
                          >
                            {item.label}
                          </span>
                        </button>
                      </div>
                    ))}
                  </nav>

                  <div
                    className={cn(
                      "mt-4 border-t border-black/10 pt-3 dark:border-white/10",
                      settingsNavCollapsed && "lg:mt-2 lg:pt-2",
                    )}
                  >
                    <p
                      className={cn(
                        "px-2 pb-2 text-[11px] font-medium uppercase tracking-wide text-black/45 dark:text-white/45",
                        settingsNavCollapsed && "lg:sr-only",
                      )}
                    >
                      Account
                    </p>
                    <nav className="flex flex-col gap-0.5" aria-label="Account settings">
                      {SETTINGS_NAV.filter((n) => n.group === "app").map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          title={settingsNavCollapsed ? item.label : undefined}
                          onClick={() => goSection(item.id)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors",
                            settingsNavCollapsed &&
                              "lg:justify-center lg:px-2 lg:py-2.5",
                            activeNavId === item.id
                              ? "bg-[#34C759]/15 font-medium text-[#14532d] dark:text-[#86efac]"
                              : "text-black/65 hover:bg-black/[0.04] hover:text-black dark:text-white/65 dark:hover:bg-white/[0.06] dark:hover:text-white",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-4 w-4 shrink-0 opacity-70",
                              settingsNavCollapsed && "lg:h-5 lg:w-5",
                            )}
                            aria-hidden
                          />
                          <span
                            className={cn(settingsNavCollapsed && "lg:sr-only")}
                          >
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </aside>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-col gap-3 border-b border-black/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
                  <h2 className="text-base font-semibold text-black dark:text-white">
                    {title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    {view.type === "section" && view.id === "invoices" && (
                      <Button
                        type="button"
                        variant="outline"
                        className="border-[#34C759] bg-transparent text-[#1a7f37] hover:bg-[#34C759]/10 dark:text-[#34C759]"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Payment method
                      </Button>
                    )}
                    {addLabel && (
                      <button
                        type="button"
                        className="flex shrink-0 items-center gap-2 rounded-lg bg-[#34C759] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#28a745]"
                      >
                        <PlusCircle className="h-4 w-4" />
                        {addLabel}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 sm:p-6">
                  {renderMain()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
