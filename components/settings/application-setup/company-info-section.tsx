"use client";

import * as React from "react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const inputClass =
  "border-black/20 bg-black/5 text-black placeholder:text-black/40 dark:border-white/20 dark:bg-[#252930] dark:text-white dark:placeholder:text-white/40";

export function CompanyInfoSection() {
  const [companyName, setCompanyName] = React.useState("Sterling Drilling");
  const [address, setAddress] = React.useState("Wichita, KS");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");

  return (
    <div className="mx-auto w-full max-w-md space-y-5">
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-black/70 dark:text-white/70">
          Company name
        </Label>
        <Input
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-black/70 dark:text-white/70">
          Logo
        </Label>
        <button
          type="button"
          className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-black/25 bg-black/[0.02] text-xs text-black/45 transition-colors hover:border-[#34C759]/50 hover:bg-[#34C759]/5 hover:text-black/70 dark:border-white/25 dark:bg-white/[0.02] dark:text-white/45 dark:hover:text-white/70"
        >
          <Upload className="h-4 w-4" aria-hidden />
          Upload
        </button>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-black/70 dark:text-white/70">
          Address
        </Label>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-black/70 dark:text-white/70">
            Phone
          </Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(316) 555-0100"
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-black/70 dark:text-white/70">
            Email
          </Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="office@sterlingdrilling.com"
            className={inputClass}
          />
        </div>
      </div>

      <Button
        type="button"
        className="bg-[#34C759] font-medium text-black hover:bg-[#28a745]"
      >
        Save changes
      </Button>
    </div>
  );
}
