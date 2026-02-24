import * as React from "react";
import { Check } from "lucide-react";

interface PermissionToggleProps {
  enabled: boolean;
  label: string;
  onChange: (value: boolean) => void;
}

export function PermissionToggle({
  enabled,
  label,
  onChange,
}: PermissionToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="flex items-center gap-1.5"
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
          enabled ? "border-[#34C759]" : "border-white/20"
        }`}
      >
        {enabled && <Check className="h-3 w-3 text-[#34C759]" />}
      </span>
      <span
        className={`text-sm font-medium transition-colors ${
          enabled ? "text-[#34C759]" : "text-white/40"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
