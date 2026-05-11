import { safeServerLog } from "@/lib/observability/safe-server-log";

function enabled(): boolean {
  return process.env.NN_MEMORY_DIAGNOSTICS === "1" || process.env.NN_MEMORY_DIAGNOSTICS === "true";
}

/**
 * Opt-in heap/RSS snapshot for isolating large in-memory loads (lesson catalogs, sitemap, etc.).
 * Enable with `NN_MEMORY_DIAGNOSTICS=1` in the App Platform / runtime env (stderr via `safeServerLog`).
 */
export function logRuntimeMemoryDiagnostic(label: string, extra?: Record<string, unknown>): void {
  if (!enabled()) return;
  try {
    const m = process.memoryUsage();
    safeServerLog("perf", "runtime_memory_diag", {
      label: label.slice(0, 120),
      heapUsedMb: Math.round(m.heapUsed / 1024 / 1024),
      rssMb: Math.round(m.rss / 1024 / 1024),
      externalMb: Math.round((m.external ?? 0) / 1024 / 1024),
      arrayBuffersMb: Math.round((m.arrayBuffers ?? 0) / 1024 / 1024),
      ...(extra && typeof extra === "object" ? extra : {}),
    });
  } catch {
    // ignore
  }
}
