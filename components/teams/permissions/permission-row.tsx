import * as React from "react";
import { PermissionToggle } from "./permission-toggle";
import type { Permission, PermissionKey, PermissionType } from "./types";

interface PermissionRowProps {
  permKey: PermissionKey;
  label: string;
  icon: React.ElementType;
  permission: Permission;
  onChange: (key: PermissionKey, type: PermissionType, value: boolean) => void;
}

export function PermissionRow({
  permKey,
  label,
  icon: Icon,
  permission,
  onChange,
}: PermissionRowProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-black/50 dark:text-white/50" />
        <span className="text-sm text-black dark:text-white">{label}</span>
      </div>
      <div className="flex items-center gap-6">
        <PermissionToggle
          enabled={permission.read}
          label="Read"
          onChange={(v) => onChange(permKey, "read", v)}
        />
        <PermissionToggle
          enabled={permission.write}
          label="Write"
          onChange={(v) => onChange(permKey, "write", v)}
        />
      </div>
    </div>
  );
}
