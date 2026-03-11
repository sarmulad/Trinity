"use client";

import * as React from "react";
import { CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/error-boundary";
import { BusinessInformationTab } from "./business-information-tab";
import { InvoicesTab } from "./invoices-tab";
import { cn } from "@/lib/utils";

type SettingsTabId = "business" | "invoices";

const TABS: { id: SettingsTabId; label: string }[] = [
  { id: "business", label: "Business Information" },
  { id: "invoices", label: "Invoices" },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<SettingsTabId>("business");

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <Card className="border-black/10 bg-white dark:border-white/10 dark:bg-[#1A1C1E]/95">
          <CardContent className="p-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-black/10 px-6 py-4 dark:border-white/10">
              <div className="flex gap-1 rounded-lg border border-black/10 bg-black/5 p-1 dark:border-white/10 dark:bg-[#252930]/80">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                      activeTab === tab.id
                        ? "bg-[#34C759] text-black"
                        : "text-black/60 hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {activeTab === "invoices" && (
                <Button
                  variant="outline"
                  className="border-[#34C759] bg-transparent text-[#34C759] hover:bg-[#34C759]/10 hover:text-[#34C759]"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Method
                </Button>
              )}
            </div>

            <div className="p-6">
              {activeTab === "business" && <BusinessInformationTab />}
              {activeTab === "invoices" && <InvoicesTab />}
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
