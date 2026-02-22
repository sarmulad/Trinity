import type { RoleGroup } from "./types";
import { Building2, Users, Map, Bell, BarChart2, User } from "lucide-react";

export const PERMISSION_ROWS: {
  key: import("./types").PermissionKey;
  label: string;
  icon: import("react").ElementType;
}[] = [
  { key: "companies", label: "Companies", icon: Building2 },
  { key: "pumpers", label: "Pumpers", icon: Users },
  { key: "areas", label: "Areas", icon: Map },
  { key: "alarms", label: "Alarms", icon: Bell },
  { key: "leases", label: "Leases", icon: BarChart2 },
  { key: "users", label: "Users", icon: User },
];

export const DEFAULT_ROLES: RoleGroup[] = [
  {
    id: "administrators",
    label: "Administrators",
    permissions: {
      companies: { read: true, write: true },
      pumpers: { read: true, write: true },
      areas: { read: true, write: true },
      alarms: { read: true, write: true },
      leases: { read: true, write: true },
      users: { read: true, write: true },
    },
  },
  {
    id: "field-superintendents",
    label: "Field Superintendents",
    permissions: {
      companies: { read: true, write: false },
      pumpers: { read: true, write: true },
      areas: { read: true, write: true },
      alarms: { read: true, write: true },
      leases: { read: true, write: true },
      users: { read: true, write: false },
    },
  },
  {
    id: "pumpers",
    label: "Pumpers",
    permissions: {
      companies: { read: false, write: false },
      pumpers: { read: false, write: false },
      areas: { read: false, write: false },
      alarms: { read: true, write: true },
      leases: { read: true, write: false },
      users: { read: false, write: false },
    },
  },
];
