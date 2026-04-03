"use client";

import * as React from "react";
import { X, Info, Mail, Phone, Search } from "lucide-react";
import type { Route } from "./types";

interface InviteTeamModalProps {
  open: boolean;
  onClose: () => void;
  onInvite?: (data: {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    phone: string;
    company: string;
    route: string;
  }) => void;
  routes?: Route[];
  companies?: string[];
  roles?: string[];
}

export function InviteTeamModal({
  open,
  onClose,
  onInvite,
  routes = [],
  companies = ["Trinity Energy"],
  roles = ["Pumper", "Field service", "Superintendent", "Foreman", "Admin"],
}: InviteTeamModalProps) {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [route, setRoute] = React.useState("");

  if (!open) return null;

  function handleInvite() {
    onInvite?.({ firstName, lastName, role, email, phone, company, route });
    onClose();
  }

  const inputClass =
    "w-full rounded-lg border border-black/10 bg-black/5 px-3 py-2.5 text-sm text-black placeholder:text-black/25 focus:border-[#34C759]/50 focus:outline-none dark:border-white/10 dark:bg-[#252930] dark:text-white dark:placeholder:text-white/25";

  const selectClass =
    "w-full rounded-lg border border-black/10 bg-black/5 px-3 py-2.5 text-sm text-black/50 focus:border-[#34C759]/50 focus:outline-none appearance-none cursor-pointer dark:border-white/10 dark:bg-[#252930] dark:text-white/50";

  const Label = ({
    children,
    req,
  }: {
    children: React.ReactNode;
    req?: boolean;
  }) => (
    <label className="flex items-center gap-1.5 text-xs text-black/60 mb-1.5 dark:text-white/60">
      {children}
      <Info className="h-3 w-3" />
      {req && (
        <span className="ml-auto text-xs text-black/40 dark:text-white/40">
          req.
        </span>
      )}
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-black/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#1e2127]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-black dark:text-white">
            New Team Member
          </h2>
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-sm text-[#34C759] hover:text-[#28a745]"
          >
            Close <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>First Name</Label>
              <input
                type="text"
                placeholder="Chris"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <input
                type="text"
                placeholder="Kurz"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <Label>Role</Label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={selectClass}
              >
                <option value="">Select role</option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30">
                ▾
              </span>
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/30 dark:text-white/30" />
              <input
                type="email"
                placeholder="chriskurz@trinity.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <Label req>Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/30 dark:text-white/30" />
              <input
                type="tel"
                placeholder="123-456-7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <Label>Company</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/30 dark:text-white/30" />
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={`${selectClass} pl-9`}
              >
                <option value="">Select company</option>
                {companies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30">
                ▾
              </span>
            </div>
          </div>

          <div>
            <Label>Route</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/30 dark:text-white/30" />
              <select
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                className={`${selectClass} pl-9`}
              >
                <option value="">Select Route</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30">
                ▾
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleInvite}
          className="mt-6 w-full rounded-lg bg-[#34C759] py-3 text-sm font-semibold text-black hover:bg-[#28a745] transition-colors"
        >
          Invite New Team Member
        </button>
      </div>
    </div>
  );
}
