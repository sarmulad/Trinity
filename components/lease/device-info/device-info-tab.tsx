"use client";

import * as React from "react";
import { EXAMPLE_DEVICE_INFO } from "./example-data";
import type { DeviceInfoItem } from "./types";

interface DeviceInfoTabProps {
  devices?: DeviceInfoItem[];
}

export function DeviceInfoTab({ devices = EXAMPLE_DEVICE_INFO }: DeviceInfoTabProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-black dark:text-white">
        Device Info
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {devices.map((device) => (
          <div
            key={device.id}
            className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#1e2025]"
          >
            <div className="flex items-start justify-between mb-3">
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
              {device.historyAvailable ? (
                <button className="text-xs text-[#34C759] underline underline-offset-2 hover:text-[#28a745]">
                  View History
                </button>
              ) : (
                <p className="text-xs text-black/35 dark:text-white/35">
                  History unavailable
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
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
