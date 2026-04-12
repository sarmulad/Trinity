"use client";

import * as React from "react";
import { X } from "lucide-react";
import { EXAMPLE_DEVICE_INFO } from "./example-data";
import type { DeviceInfoItem } from "./types";

interface DeviceInfoTabProps {
  devices?: DeviceInfoItem[];
}

export function DeviceInfoTab({ devices = EXAMPLE_DEVICE_INFO }: DeviceInfoTabProps) {
  const [selectedDevice, setSelectedDevice] =
    React.useState<DeviceInfoItem | null>(null);

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-base font-bold text-black dark:text-white">
          Device Info
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {devices.map((device) => {
            const interactive = Boolean(
              device.historyAvailable && (device.history?.length ?? 0) > 0,
            );

            return (
              <button
                key={device.id}
                type="button"
                onClick={() => interactive && setSelectedDevice(device)}
                disabled={!interactive}
                className={`rounded-xl border p-4 text-left transition-all ${
                  interactive
                    ? "cursor-pointer border-black/10 bg-white hover:border-[#34C759]/35 hover:bg-[#34C759]/5 dark:border-white/10 dark:bg-[#1e2025] dark:hover:border-[#34C759]/35 dark:hover:bg-[#34C759]/10"
                    : "cursor-default border-black/10 bg-white dark:border-white/10 dark:bg-[#1e2025]"
                }`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-black dark:text-white">
                      {device.name}
                    </p>
                    <p className="text-xs text-black/45 dark:text-white/45">
                      {device.type}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      device.status === "Online"
                        ? "bg-[#34C759]/20 text-[#34C759]"
                        : device.status === "Warning"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {device.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <Metric label="Battery" value={device.battery} />
                  <Metric label="Solar" value={device.solar} />
                  <Metric label="Signal" value={device.signal} />
                  <Metric label="Uptime" value={device.uptime} />
                  <Metric label="Last Seen" value={device.lastSeen} />
                  <Metric label="Firmware" value={device.firmware} />
                </div>

                <div className="mt-3">
                  {interactive ? (
                    <p className="text-xs text-[#34C759]">
                      Hover and click to view history
                    </p>
                  ) : (
                    <p className="text-xs text-black/35 dark:text-white/35">
                      History unavailable
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedDevice && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setSelectedDevice(null)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl overflow-y-auto border-l border-black/10 bg-[#f8fafc] shadow-2xl dark:border-white/10 dark:bg-[#16181d]">
            <div className="space-y-5 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white">
                    Device History
                  </h3>
                  <p className="mt-1 text-xs text-black/50 dark:text-white/45">
                    {selectedDevice.name} • {selectedDevice.type}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDevice(null)}
                  className="rounded-md p-1 text-black/60 hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <Metric label="Battery" value={selectedDevice.battery} />
                <Metric label="Solar" value={selectedDevice.solar} />
                <Metric label="Signal" value={selectedDevice.signal} />
                <Metric label="Uptime" value={selectedDevice.uptime} />
                <Metric label="Last Seen" value={selectedDevice.lastSeen} />
                <Metric label="Firmware" value={selectedDevice.firmware} />
              </div>

              <div className="overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/[0.03]">
                <div className="border-b border-black/10 px-4 py-3 dark:border-white/10">
                  <p className="text-sm font-semibold text-black dark:text-white">
                    History
                  </p>
                </div>
                <div className="max-h-[420px] overflow-auto">
                  <table className="min-w-full border-collapse">
                    <thead className="sticky top-0 bg-[#f4f6f8] dark:bg-[#20242b]">
                      <tr className="text-left">
                        <th className="px-4 py-2 text-xs font-medium text-black/55 dark:text-white/50">
                          Timestamp
                        </th>
                        <th className="px-4 py-2 text-xs font-medium text-black/55 dark:text-white/50">
                          Event
                        </th>
                        <th className="px-4 py-2 text-xs font-medium text-black/55 dark:text-white/50">
                          Detail
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedDevice.history ?? []).map((entry, index) => (
                        <tr
                          key={`${entry.timestamp}-${index}`}
                          className="border-t border-black/10 dark:border-white/10"
                        >
                          <td className="px-4 py-2 text-xs text-black/80 dark:text-white/80">
                            {entry.timestamp}
                          </td>
                          <td className="px-4 py-2 text-xs text-black/75 dark:text-white/75">
                            {entry.event}
                          </td>
                          <td className="px-4 py-2 text-xs text-black/60 dark:text-white/60">
                            {entry.detail}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-black/45 dark:text-white/45">{label}</p>
      <p className="text-xs font-semibold text-black dark:text-white">{value}</p>
    </div>
  );
}
