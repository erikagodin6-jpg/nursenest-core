/**
 * Admin i18n diagnostics optionally write JSON under repo `reports/`.
 * In production, default is **no disk writes** so the container never accumulates artifacts.
 */
export function allowDiagnosticsDiskWrite(): boolean {
  if (process.env.ALLOW_DIAGNOSTICS_DISK_WRITE === "true") return true;
  return process.env.NODE_ENV !== "production";
}
