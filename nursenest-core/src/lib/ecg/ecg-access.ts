import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { EcgCatalogEntry } from "@/lib/ecg/ecg-catalog";

/** Premium lesson-catalog access unlocks non-preview ECG modules (included with Premium; no separate SKU). */
export function ecgModuleUnlocked(entry: EcgCatalogEntry, lessonAccess: AccessScope | "error"): boolean {
  if (lessonAccess === "error") return false;
  return entry.previewFree || lessonAccess.hasAccess;
}
