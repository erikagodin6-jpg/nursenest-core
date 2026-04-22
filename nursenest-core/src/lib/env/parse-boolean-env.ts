/**
 * Shared env → boolean parsing for feature flags (trimmed, case-insensitive).
 *
 * **Opt-in switches** (e.g. admin AI): unset or empty → `false`.
 * Unknown non-empty strings → `false` (fail closed).
 */
export function parseBooleanEnv(raw: string | undefined): boolean {
  if (raw === undefined) return false;
  const t = raw.trim();
  if (!t) return false;
  const l = t.toLowerCase();
  if (l === "true" || l === "1" || l === "yes" || l === "on") return true;
  if (l === "false" || l === "0" || l === "no" || l === "off") return false;
  return false;
}
