export function recordRemediationExposure(
  userId: string,
  exposure: { exposureKey: string; kind: string; href: string },
): void {
  if (typeof window === "undefined") return;
  try {
    const key = `nn:remediation-exposure:${userId}`;
    const existing = JSON.parse(window.sessionStorage.getItem(key) ?? "[]");
    const rows = Array.isArray(existing) ? existing : [];
    rows.push({ ...exposure, at: new Date().toISOString() });
    window.sessionStorage.setItem(key, JSON.stringify(rows.slice(-25)));
  } catch {
    // Best-effort telemetry cache only.
  }
}
