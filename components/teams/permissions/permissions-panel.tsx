import { PermissionRow } from "./permission-row";
import { PERMISSION_ROWS } from "./example-data";
import type { RoleGroup, PermissionKey, PermissionType } from "./types";

interface PermissionsPanelProps {
  role: RoleGroup;
  onChange: (key: PermissionKey, type: PermissionType, value: boolean) => void;
}

export function PermissionsPanel({ role, onChange }: PermissionsPanelProps) {
  return (
    <div className="flex-1 rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#21252A]">
      <h3 className="text-base font-bold text-black mb-4 dark:text-white">
        Permissions
      </h3>
      <div className="divide-y divide-black/10 dark:divide-white/10">
        {PERMISSION_ROWS.map(({ key, label, icon }) => (
          <PermissionRow
            key={key}
            permKey={key}
            label={label}
            icon={icon}
            permission={role.permissions[key]}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}
