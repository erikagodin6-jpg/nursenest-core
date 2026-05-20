import { prisma } from "@/lib/db";
import { classifyDatabaseErrorMessage, type DatabaseHealthClassification } from "@/lib/db/db-error-classification";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export type ReadinessResult =
  | { ok: true; skipped: true }
  | { ok: true; latencyMs: number }
  | { ok: false; error: string; classification: DatabaseHealthClassification };

/**
 * Single bounded `SELECT 1` — shared by readiness (`/api/health/ready`), admin system status DB card, etc.
 * Caller must ensure `isDatabaseUrlConfigured()` before invoking (readiness skips when unset).
 */
export async function boundedSelectOne(
  timeoutMs: number,
): Promise<
  { ok: true; latencyMs: number } | { ok: false; error: string; classification: DatabaseHealthClassification }
> {
  const started = Date.now();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise<never>((_, rej) => {
        timer = setTimeout(() => rej(new Error("database_probe_timeout")), timeoutMs);
      }),
    ]);
    return { ok: true, latencyMs: Date.now() - started };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const slice = msg.slice(0, 240);
    return { ok: false, error: slice, classification: classifyDatabaseErrorMessage(slice) };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Lightweight DB probe for readiness probes (not for liveness — use `/healthz`).
 * Uses Promise.race so a wedged pool does not hang the request forever.
 */
export async function checkDatabaseReadiness(timeoutMs = 3000): Promise<ReadinessResult> {
  if (!isDatabaseUrlConfigured()) {
    return { ok: true, skipped: true };
  }
  const r = await boundedSelectOne(timeoutMs);
  if (!r.ok) return { ok: false, error: r.error, classification: r.classification };
  return { ok: true, latencyMs: r.latencyMs };
}
