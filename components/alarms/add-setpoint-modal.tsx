"use client";

import * as React from "react";
import { X, Info } from "lucide-react";

interface AddSetpointModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    assetName: string;
    lease: string;
    minValue: number;
    maxValue: number;
  }) => void;
}

export function AddSetpointModal({
  open,
  onClose,
  onSubmit,
}: AddSetpointModalProps) {
  const [assetName, setAssetName] = React.useState("");
  const [lease, setLease] = React.useState("");
  const [minValue, setMinValue] = React.useState("0");
  const [maxValue, setMaxValue] = React.useState("100");

  if (!open) return null;

  function handleSubmit() {
    onSubmit?.({
      assetName,
      lease,
      minValue: Number(minValue),
      maxValue: Number(maxValue),
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#1e2127] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-white">Add Setpoint</h2>
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-sm text-[#34C759] hover:text-[#28a745]"
          >
            Close <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs text-white/60 mb-1.5">
              Asset Name <Info className="h-3 w-3" />
            </label>
            <input
              type="text"
              placeholder="e.g Water Tank #3"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#252930] px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#34C759]/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs text-white/60 mb-1.5">
              Lease <Info className="h-3 w-3" />
            </label>
            <input
              type="text"
              placeholder="e.g Johnson Lease"
              value={lease}
              onChange={(e) => setLease(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#252930] px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#34C759]/50 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs text-white/60 mb-1.5">
                Min Value <Info className="h-3 w-3" />
              </label>
              <input
                type="number"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#252930] px-3 py-2.5 text-sm text-white focus:border-[#34C759]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs text-white/60 mb-1.5">
                Max Value <Info className="h-3 w-3" />
              </label>
              <input
                type="number"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#252930] px-3 py-2.5 text-sm text-white focus:border-[#34C759]/50 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full rounded-lg bg-[#34C759] py-3 text-sm font-semibold text-black hover:bg-[#28a745] transition-colors"
        >
          Add Setpoint
        </button>
      </div>
    </div>
  );
}
