"use client";

import * as React from "react";
import { RoleSidebar } from "./role-sidebar";
import { PermissionsPanel } from "./permissions-panel";
import { DEFAULT_ROLES } from "./example-data";
import type { RoleGroup, PermissionKey, PermissionType } from "./types";

export function PermissionsTab() {
  const [roles, setRoles] = React.useState<RoleGroup[]>(DEFAULT_ROLES);
  const [selectedRoleId, setSelectedRoleId] = React.useState("administrators");

  const selectedRole = roles.find((r) => r.id === selectedRoleId)!;

  function handleChange(
    key: PermissionKey,
    type: PermissionType,
    value: boolean,
  ) {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === selectedRoleId
          ? {
              ...r,
              permissions: {
                ...r.permissions,
                [key]: { ...r.permissions[key], [type]: value },
              },
            }
          : r,
      ),
    );
  }

  return (
    <div className="flex gap-4 min-h-[500px] rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-10 ">
      <RoleSidebar
        roles={roles}
        selectedRoleId={selectedRoleId}
        onSelect={setSelectedRoleId}
      />
      <PermissionsPanel role={selectedRole} onChange={handleChange} />
    </div>
  );
}
