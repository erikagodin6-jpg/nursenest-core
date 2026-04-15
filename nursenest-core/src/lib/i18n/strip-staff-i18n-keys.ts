import { isAdminOnlyFlatI18nKey } from "@shared/i18n-admin-key-policy";

/** Removes staff-only keys from a flat bundle (e.g. legacy monolith JSON served before shard split). */
export function stripStaffKeysFromPublicMergedBundle(m: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(m)) {
    if (!isAdminOnlyFlatI18nKey(k)) out[k] = v;
  }
  return out;
}
