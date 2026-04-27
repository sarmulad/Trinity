import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  LicenseManager,
} from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClipboardModule,
  CellSelectionModule,
]);

const licenseKey =
  process.env.NEXT_PUBLIC_AG_GRID_LICENSE_KEY ??
  process.env.AG_GRID_LICENSE_KEY;

if (licenseKey) {
  LicenseManager.setLicenseKey(licenseKey);
} else {
  console.warn(
    "AG Grid license key not found. Set NEXT_PUBLIC_AG_GRID_LICENSE_KEY to enable enterprise features.",
  );
}

export {};
