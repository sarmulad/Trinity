import { PermissionRow } from "./permission-row";
import { PERMISSION_ROWS } from "./example-data";
import type { RoleGroup, PermissionKey, PermissionType } from "./types";

interface PermissionsPanelProps {
  role: RoleGroup;
  onChange: (key: PermissionKey, type: PermissionType, value: boolean) => void;
}

export function PermissionsPanel({ role, onChange }: PermissionsPanelProps) {
  return (
    <div className="flex-1 rounded-xl border border-white/10 bg-[#21252A] p-6">
      <h3 className="text-base font-bold text-white mb-4">Permissions</h3>
      <div className="divide-y divide-white/10">
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
