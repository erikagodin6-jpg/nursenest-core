import "server-only";

import { isEcgModuleEnabled } from "@/lib/ecg-module/ecg-module-config";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

/**
 * Whether RN/NP marketing pathway hubs should treat the ECG module tile as **unlocked**
 * (same bar as in-app {@link getCurrentEcgModuleAccess}: env on + published internal course).
 */
export async function resolveMarketingHubEcgModulePublic(): Promise<boolean> {
  if (!isEcgModuleEnabled()) return false;
  if (!isDatabaseUrlConfigured()) return false;
  try {
    const { getEcgModuleStatus } = await import("@/lib/ecg-module/ecg-module-status");
    const status = await getEcgModuleStatus();
    return status === "published";
  } catch {
    return false;
  }
}
