"use client";

import * as React from "react";
import { X, Info } from "lucide-react";

export interface AlarmFilters {
  lease: string;
  status: string;
  byType: string;
}

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: AlarmFilters) => void;
  leaseOptions?: string[];
  statusOptions?: string[];
  typeOptions?: string[];
}

export function FilterModal({
  open,
  onClose,
  onApply,
  leaseOptions = ["Johnson Lease", "Texas Lease"],
  statusOptions = ["Active", "Normal"],
  typeOptions = ["Oil Tank", "Water Tank", "Compressor"],
}: FilterModalProps) {
  const [lease, setLease] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [byType, setByType] = React.useState("");

  if (!open) return null;

  const selectClass =
    "w-full rounded-lg border border-white/10 bg-[#252930] px-3 py-2.5 text-sm text-white/60 focus:border-[#34C759]/50 focus:outline-none appearance-none cursor-pointer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#1e2127] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-white">Filter</h2>
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-sm text-[#34C759] hover:text-[#28a745]"
          >
            Close <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Lease */}
          <div>
            <label className="flex items-center gap-1.5 text-xs text-white/60 mb-1.5">
              Lease <Info className="h-3 w-3" />
            </label>
            <div className="relative">
              <select
                value={lease}
                onChange={(e) => setLease(e.target.value)}
                className={selectClass}
              >
                <option value="">Filter by lease</option>
                {leaseOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                ▾
              </span>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center gap-1.5 text-xs text-white/60 mb-1.5">
              Status <Info className="h-3 w-3" />
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={selectClass}
              >
                <option value="">Filter by status</option>
                {statusOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                ▾
              </span>
            </div>
          </div>

          {/* By Type */}
          <div>
            <label className="flex items-center gap-1.5 text-xs text-white/60 mb-1.5">
              By Type <Info className="h-3 w-3" />
            </label>
            <div className="relative">
              <select
                value={byType}
                onChange={(e) => setByType(e.target.value)}
                className={selectClass}
              >
                <option value="">Filter by type</option>
                {typeOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                ▾
              </span>
            </div>
          </div>
        </div>

        {/* Apply */}
        <button
          onClick={() => {
            onApply({ lease, status, byType });
            onClose();
          }}
          className="mt-6 w-full rounded-lg bg-[#34C759] py-3 text-sm font-semibold text-black hover:bg-[#28a745] transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
