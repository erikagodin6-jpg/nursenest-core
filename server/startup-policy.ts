/**
 * STARTUP_POLICY
 *
 * Centralized startup readiness state and deferred work utilities.
 *
 * Rules:
 * 1. No heavy seed/import work may execute before `appReady` is true.
 * 2. All seed data imports must use dynamic `import()` gated by `shouldRunSeeding()`.
 * 3. Memory guards should be checked between startup phases.
 * 4. Background monitors/jobs must be gated behind PROCESS_ROLE or ENABLE_MONITORS.
 */

let appReady = false;
const APP_START_TIME = Date.now();

function getProcessRole(): string {
  return process.env.PROCESS_ROLE || "web";
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isAppReady(): boolean {
  return appReady;
}

export function markAppReady(): void {
  appReady = true;
}

export function getAppStartTime(): number {
  return APP_START_TIME;
}

export function guardStartupReady(): void {
  if (!appReady) {
    throw new Error("Application is not ready yet — startup still in progress");
  }
}

export async function startupMemoryGuard(label: string): Promise<void> {
  const mem = process.memoryUsage();
  const heapUsedMB = Math.round(mem.heapUsed / 1024 / 1024);
  const rssMB = Math.round(mem.rss / 1024 / 1024);

  let limitMB = 512;

  try {
    const { getDetectedMemoryLimitMB } = await import("./memory-monitor");
    const detected = getDetectedMemoryLimitMB();
    if (typeof detected === "number" && detected > 0) {
      limitMB = detected;
    }
  } catch {}

  const heapThresholdMB = Math.round(limitMB * 0.6);
  const rssThresholdMB = Math.round(limitMB * 0.7);

  if (heapUsedMB > heapThresholdMB || rssMB > rssThresholdMB) {
    console.warn(
      `[MemoryGuard] ${label}: heapUsed=${heapUsedMB}MB rss=${rssMB}MB (limit: ${limitMB}MB) — forcing GC`
    );

    try {
      if (typeof global.gc === "function") {
        global.gc();
      }
    } catch {}

    await sleep(200);
  }
}

export async function runSeedStep(name: string, fn: () => Promise<void>): Promise<void> {
  const startedAt = Date.now();

  try {
    await fn();
    console.log(`[Startup Timing] ${name}: ${Date.now() - startedAt}ms`);
  } catch (e: any) {
    console.error(`[${name}] Failed:`, e?.message || e);
  }
}

export function shouldRunSeeding(): boolean {
  return getProcessRole() === "worker" || process.env.RUN_SEEDING === "true";
}

export function shouldStartMonitors(): boolean {
  return getProcessRole() === "worker" || process.env.ENABLE_MONITORS === "true";
}

export function isWorkerRole(): boolean {
  return getProcessRole() === "worker";
}

export async function shouldSkipSeed(tableName: string): Promise<boolean> {
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) return false;

  try {
    const { pool } = await import("./storage");
    const result = await pool.query(
      `SELECT EXISTS (SELECT 1 FROM ${tableName} LIMIT 1) AS has_data`
    );

    if (result.rows[0]?.has_data) {
      console.log(`[DeferredStartup] Skipping seed for ${tableName} — data already exists`);
      return true;
    }
  } catch {}

  return false;
}