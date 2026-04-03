export interface Permission {
  read: boolean;
  write: boolean;
}

export interface RolePermissions {
  companies: Permission;
  pumpers: Permission;
  areas: Permission;
  alarms: Permission;
  leases: Permission;
  users: Permission;
}

export interface RoleGroup {
  id: string;
  label: string;
  permissions: RolePermissions;
}

export type PermissionKey = keyof RolePermissions;
export type PermissionType = "read" | "write";
