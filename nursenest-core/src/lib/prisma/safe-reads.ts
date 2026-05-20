/**
 * Noncritical Prisma reads: missing tables, schema drift, or connection blips must not take down routes.
 */

import { classifyDatabaseFallbackKind } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Prisma / Postgres signals for optional tables or drifted schema (P2010, P2021, etc.). */
export function isNonFatalPrismaSchemaError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  const code = typeof e === "object" && e !== null && "code" in e ? String((e as { code?: string }).code) : "";
  return (
    /does not exist|relation [^ ]+ does not exist|table|Unknown table|column/i.test(msg) ||
    /P2010|P2021|P2022|P2003|P1017/i.test(msg + code)
  );
}

export async function safePrismaCount(
  label: string,
  run: () => Promise<number>,
): Promise<{ value: number; warning?: string }> {
  if (isRuntimeSafeMode()) {
    return { value: 0, warning: `[${label}] runtime_safe_mode` };
  }
  try {
    return { value: await run() };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const hint = isNonFatalPrismaSchemaError(e) ? "schema_or_table" : "query";
    const kind = classifyDatabaseFallbackKind(e);
    safeServerLog("prisma", kind, { label, detail: msg.slice(0, 200) });
    safeServerLog("prisma", "fallback_used", { label, reason: kind });
    return {
      value: 0,
      warning: `[${label}] ${hint}: ${msg.slice(0, 280)}`,
    };
  }
}

export async function safePrismaCountTimeout(
  label: string,
  run: () => Promise<number>,
  timeoutMs: number,
): Promise<{ value: number; warning?: string }> {
  return withPrismaReadFallbackTimeout(label, run, 0, timeoutMs);
}

export async function withPrismaReadFallback<T>(
  label: string,
  run: () => Promise<T>,
  fallback: T,
): Promise<{ value: T; warning?: string }> {
  if (isRuntimeSafeMode()) {
    return { value: fallback, warning: `[${label}] runtime_safe_mode` };
  }
  try {
    return { value: await run() };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const kind = classifyDatabaseFallbackKind(e);
    safeServerLog("prisma", kind, { label, detail: msg.slice(0, 200) });
    safeServerLog("prisma", "fallback_used", { label, reason: kind });
    return {
      value: fallback,
      warning: `[${label}] ${isNonFatalPrismaSchemaError(e) ? "schema_or_table" : "read"}: ${msg.slice(0, 280)}`,
    };
  }
}

export async function withPrismaReadFallbackTimeout<T>(
  label: string,
  run: () => Promise<T>,
  fallback: T,
  timeoutMs: number,
): Promise<{ value: T; warning?: string }> {
  if (isRuntimeSafeMode()) {
    return { value: fallback, warning: `[${label}] runtime_safe_mode` };
  }
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return {
      value: await Promise.race([
        run(),
        new Promise<T>((_, reject) => {
          timer = setTimeout(() => reject(new Error(DEADLINE_ERROR)), timeoutMs);
        }),
      ]),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const kind = e instanceof Error && e.message === DEADLINE_ERROR ? "db_timeout" : classifyDatabaseFallbackKind(e);
    safeServerLog("prisma", kind, {
      label,
      ...(kind === "db_timeout" ? { timeout_ms: timeoutMs } : { detail: msg.slice(0, 200) }),
    });
    safeServerLog("prisma", "fallback_used", {
      label,
      reason: kind,
      ...(kind === "db_timeout" ? { timeout_ms: timeoutMs } : {}),
    });
    return {
      value: fallback,
      warning: `[${label}] ${kind === "db_timeout" ? "timeout" : isNonFatalPrismaSchemaError(e) ? "schema_or_table" : "read"}: ${msg.slice(0, 280)}`,
    };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

const DEADLINE_ERROR = "prisma_read_deadline";

/**
 * Application-level deadline for a **single** read (or small composed read). On timeout returns `fallback`
 * without rethrowing. Other errors propagate — callers must handle.
 *
 * Does not cancel the underlying Prisma work (Postgres `statement_timeout` is the hard cap); use for UX
 * degradation when aggregations exceed SLA. Pair with parallelized sub-queries to reduce wall time.
 */
export async function withPrismaReadDeadline<T>(label: string, run: () => Promise<T>, fallback: T, timeoutMs: number): Promise<T> {
  if (isRuntimeSafeMode()) return fallback;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      run(),
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(DEADLINE_ERROR)), timeoutMs);
      }),
    ]);
  } catch (e) {
    if (e instanceof Error && e.message === DEADLINE_ERROR) {
      safeServerLog("prisma", "db_timeout", { label, timeout_ms: timeoutMs });
      safeServerLog("prisma", "fallback_used", { label, reason: "db_timeout", timeout_ms: timeoutMs });
      return fallback;
    }
    throw e;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
