import type { LucideIcon } from "lucide-react";
import {
  Battery,
  Building2,
  Droplets,
  FileText,
  GripHorizontal,
  MapPinned,
  Package,
  Receipt,
  ShieldCheck,
  SlidersHorizontal,
  Truck,
  Waypoints,
} from "lucide-react";

import type { BatteryRow } from "./application-setup/mock-data";

export type SettingsSectionId =
  | "company"
  | "areas"
  | "routes"
  | "leases"
  | "batteries"
  | "assets"
  | "wells"
  | "transport"
  | "breadcrumbs"
  | "platform"
  | "invoices"
  | "permissions";

export type SettingsViewState =
  | { type: "section"; id: SettingsSectionId }
  | { type: "battery-detail"; battery: BatteryRow };

export type SettingsNavEntry = {
  id: SettingsSectionId;
  label: string;
  icon: LucideIcon;
  indent?: boolean;
  addLabel?: string;
  separatorBefore?: boolean;
  group: "setup" | "app";
};

export const SETTINGS_NAV: SettingsNavEntry[] = [
  {
    id: "company",
    label: "Company info",
    icon: Building2,
    group: "setup",
  },
  { id: "areas", label: "Areas", icon: MapPinned, addLabel: "Add area", group: "setup" },
  { id: "routes", label: "Routes", icon: Waypoints, addLabel: "Add route", group: "setup" },
  { id: "leases", label: "Leases", icon: FileText, addLabel: "Add lease", group: "setup" },
  {
    id: "batteries",
    label: "Batteries",
    icon: Battery,
    addLabel: "Add battery",
    group: "setup",
  },
  {
    id: "assets",
    label: "Assets",
    icon: Package,
    indent: true,
    addLabel: "Add asset",
    group: "setup",
  },
  {
    id: "wells",
    label: "Wells",
    icon: Droplets,
    indent: true,
    addLabel: "Add well",
    group: "setup",
  },
  {
    id: "transport",
    label: "Transport companies",
    icon: Truck,
    addLabel: "Add company",
    separatorBefore: true,
    group: "setup",
  },
  {
    id: "breadcrumbs",
    label: "Menu / breadcrumbs",
    icon: GripHorizontal,
    group: "setup",
  },
  {
    id: "platform",
    label: "Platform preferences",
    icon: SlidersHorizontal,
    separatorBefore: true,
    group: "app",
  },
  {
    id: "invoices",
    label: "Invoices",
    icon: Receipt,
    group: "app",
  },
  {
    id: "permissions",
    label: "Permissions",
    icon: ShieldCheck,
    group: "app",
  },
];

export function getActiveNavId(view: SettingsViewState): SettingsSectionId {
  if (view.type === "battery-detail") return "batteries";
  return view.id;
}

export function getMainTitle(view: SettingsViewState): string {
  if (view.type === "battery-detail") return view.battery.name;
  const entry = SETTINGS_NAV.find((n) => n.id === view.id);
  return entry?.label ?? "Settings";
}

export function getAddLabel(view: SettingsViewState): string | undefined {
  if (view.type === "battery-detail") return undefined;
  const entry = SETTINGS_NAV.find((n) => n.id === view.id);
  return entry?.addLabel;
}
