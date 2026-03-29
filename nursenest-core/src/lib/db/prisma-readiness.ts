import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export type ReadinessResult =
  | { ok: true; skipped: true }
  | { ok: true; latencyMs: number }
  | { ok: false; error: string };

/**
 * Lightweight DB probe for readiness probes (not for liveness — use `/healthz`).
 * Uses Promise.race so a wedged pool does not hang the request forever.
 */
export async function checkDatabaseReadiness(timeoutMs = 3000): Promise<ReadinessResult> {
  if (!isDatabaseUrlConfigured()) {
    return { ok: true, skipped: true };
  }
  const started = Date.now();
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise<never>((_, rej) => {
        setTimeout(() => rej(new Error("database_probe_timeout")), timeoutMs);
      }),
    ]);
    return { ok: true, latencyMs: Date.now() - started };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg.slice(0, 240) };
  }
}
