"use client";

import * as React from "react";
import { Info, User } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const STATE_OPTIONS = [
  "Texas",
  "Oklahoma",
  "New Mexico",
  "Louisiana",
  "Wyoming",
  "Colorado",
  "North Dakota",
];

const TEAM_OPTIONS = [
  { value: "team-1", label: "Operations Team" },
  { value: "team-2", label: "Engineering" },
  { value: "team-3", label: "Field Services" },
];

interface FieldWithReqProps {
  label: string;
  showInfo?: boolean;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

function FieldWithReq({
  label,
  showInfo,
  required = true,
  children,
  className,
}: FieldWithReqProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium text-white">{label}</Label>
          {showInfo && (
            <span
              className="flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-white/60"
              title={`${label} info`}
            >
              <Info className="h-2.5 w-2.5" />
            </span>
          )}
        </div>
        {required && <span className="text-xs text-white/50">req.</span>}
      </div>
      {children}
    </div>
  );
}

export function BusinessInformationTab() {
  const [businessName, setBusinessName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [zip, setZip] = React.useState("");
  const [primaryContact, setPrimaryContact] = React.useState("");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Business Information</h2>
      <div className="grid gap-6 sm:grid-cols-1">
        <FieldWithReq label="Business Name" showInfo>
          <Input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Business Name"
            className="border-white/20 bg-[#252930] text-white placeholder:text-white/40"
          />
        </FieldWithReq>
        <FieldWithReq label="Address" showInfo>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Business Address"
            className="border-white/20 bg-[#252930] text-white placeholder:text-white/40"
          />
        </FieldWithReq>
        <FieldWithReq label="City" showInfo>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Business City"
            className="border-white/20 bg-[#252930] text-white placeholder:text-white/40"
          />
        </FieldWithReq>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldWithReq label="State" showInfo>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger className="border-white/20 bg-[#252930] text-white [&>svg]:text-[#34C759]">
                <SelectValue placeholder="Business State" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#252930]">
                {STATE_OPTIONS.map((s) => (
                  <SelectItem
                    key={s}
                    value={s}
                    className="text-white focus:bg-white/10 focus:text-white"
                  >
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldWithReq>
          <FieldWithReq label="Zip">
            <Input
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="Business Zip"
              className="border-white/20 bg-[#252930] text-white placeholder:text-white/40"
            />
          </FieldWithReq>
        </div>
        <FieldWithReq label="Primary Point of Contact" showInfo>
          <Select value={primaryContact} onValueChange={setPrimaryContact}>
            <SelectTrigger className="border-white/20 bg-[#252930] text-white [&>svg]:text-[#34C759]">
              <span className="flex flex-1 items-center gap-2">
                <User className="h-4 w-4 shrink-0 text-white/40" />
                <SelectValue placeholder="Select Team" />
              </span>
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#252930]">
              {TEAM_OPTIONS.map((t) => (
                <SelectItem
                  key={t.value}
                  value={t.value}
                  className="text-white focus:bg-white/10 focus:text-white"
                >
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldWithReq>
      </div>
    </div>
  );
}
