import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { LicenseManager } from "ag-grid-enterprise";

ModuleRegistry.registerModules([AllCommunityModule]);

const licenseKey = process.env.AG_GRID_LICENSE_KEY;

if (licenseKey) {
  LicenseManager.setLicenseKey(licenseKey);
} else {
  console.warn(
    "AG Grid license key not found. Enterprise features may be limited.",
  );
}

export {};
