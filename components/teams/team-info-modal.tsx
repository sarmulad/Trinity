"use client";

import * as React from "react";
import { X, Phone, MessageCircle, Mail, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TeamMember, Route } from "./types";

interface TeamInfoModalProps {
  member: TeamMember | null;
  routes: Route[];
  onClose: () => void;
  onSubmit?: (memberId: string, selectedRoutes: string[]) => void;
  onDelete?: (memberId: string) => void;
}

export function TeamInfoModal({
  member,
  routes,
  onClose,
  onSubmit,
  onDelete,
}: TeamInfoModalProps) {
  const [selectedRoutes, setSelectedRoutes] = React.useState<string[]>([]);
  const [showRouteList, setShowRouteList] = React.useState(false);

  if (!member) return null;

  function toggleRoute(routeId: string) {
    setSelectedRoutes((prev) =>
      prev.includes(routeId)
        ? prev.filter((r) => r !== routeId)
        : [...prev, routeId],
    );
  }

  const infoRows = [
    { label: "First Name:", value: member.firstName },
    { label: "Last Name:", value: member.lastName },
    { label: "Email:", value: member.email },
    { label: "Phone:", value: member.phone },
    { label: "Company", value: member.company },
    { label: "Status", value: member.status },
    { label: "Assignment:", value: member.assignment, green: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#1e2127] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">{member.name}</h2>
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-sm text-[#34C759] hover:text-[#28a745]"
          >
            Close <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#252930] px-4 py-3 mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.avatarUrl} />
              <AvatarFallback className="bg-[#2d3440] text-white">
                {member.initials}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm font-semibold text-white">{member.name}</p>
          </div>
          <div className="flex gap-2">
            {[Phone, MessageCircle, Mail].map((Icon, i) => (
              <button
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#252930] p-4 mb-4">
          <p className="text-sm font-semibold text-white mb-3">
            Account Information
          </p>
          <div className="space-y-2">
            {infoRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between"
              >
                <span className="text-xs text-white/40">{row.label}</span>
                <span
                  className={`text-xs font-medium ${row.green ? "text-[#34C759]" : "text-white"}`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-1.5 text-xs text-white/60 mb-2">
            Assign to New Route <Info className="h-3 w-3" />
          </label>
          <button
            onClick={() => setShowRouteList((v) => !v)}
            className="w-full flex items-center justify-between rounded-lg border border-white/10 bg-[#252930] px-3 py-2.5 text-sm text-white/40 hover:border-white/20 transition-colors"
          >
            Select route
            <span>▾</span>
          </button>

          {showRouteList && (
            <div className="mt-1 rounded-lg border border-white/10 bg-[#252930] divide-y divide-white/5">
              {routes.map((route) => (
                <label
                  key={route.id}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5"
                >
                  <input
                    type="checkbox"
                    checked={selectedRoutes.includes(route.id)}
                    onChange={() => toggleRoute(route.id)}
                    className="h-4 w-4 rounded border-white/20 accent-[#34C759]"
                  />
                  <span className="text-sm text-white/70">{route.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => {
            onSubmit?.(member.id, selectedRoutes);
            onClose();
          }}
          className="w-full rounded-lg bg-[#34C759] py-3 text-sm font-semibold text-black hover:bg-[#28a745] transition-colors mb-3"
        >
          Submit Changes
        </button>

        <button
          onClick={() => {
            onDelete?.(member.id);
            onClose();
          }}
          className="w-full rounded-lg border border-red-500/50 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
