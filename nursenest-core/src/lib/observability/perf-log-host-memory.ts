/**
 * Host memory / cgroup sampling — uses `fs`/`os`; do not import from Edge or from `db.ts`.
 */
import fs from "node:fs";
import os from "node:os";
import { safeServerLog } from "@/lib/observability/safe-server-log";

function safeMemoryUsage(): NodeJS.MemoryUsage | null {
  try {
    const g = globalThis as unknown as { process?: { memoryUsage?: () => NodeJS.MemoryUsage } };
    const mu = g.process?.memoryUsage;
    if (typeof mu !== "function") return null;
    return mu.call(g.process);
  } catch {
    return null;
  }
}

/** cgroup v2 memory limit when running under Docker / App Platform; else null. */
function readCgroupMemoryLimitMb(): number | null {
  try {
    const raw = fs.readFileSync("/sys/fs/cgroup/memory.max", "utf8").trim();
    if (!raw || raw === "max") return null;
    const bytes = Number(raw);
    if (!Number.isFinite(bytes) || bytes <= 0) return null;
    return Math.round(bytes / 1024 / 1024);
  } catch {
    return null;
  }
}

/**
 * Periodic process memory snapshot for operators (droplet / container RSS vs limit).
 * `PERF_MEMORY_RSS_WARN_PCT` (default 70): logs `memory_pressure` instead of `memory_sample` when RSS exceeds this % of cgroup or host RAM.
 */
export function logMemoryPressureSample(context: string): void {
  const m = safeMemoryUsage();
  if (!m) return;
  const rssMb = Math.round(m.rss / 1024 / 1024);
  const heapMb = Math.round(m.heapUsed / 1024 / 1024);
  const externalMb = Math.round((m.external ?? 0) / 1024 / 1024);
  const cgroupMb = readCgroupMemoryLimitMb();
  const hostTotalMb = Math.round(os.totalmem() / 1024 / 1024);
  const limitMb = cgroupMb ?? hostTotalMb;
  const warnPct = Number(process.env.PERF_MEMORY_RSS_WARN_PCT?.trim() ?? "70");
  const threshold = Number.isFinite(warnPct) && warnPct > 0 && warnPct <= 100 ? warnPct : 70;
  const rssVsLimitPct = limitMb > 0 ? Math.round((rssMb / limitMb) * 100) : 0;
  const pressure = rssVsLimitPct >= threshold;
  safeServerLog("perf", pressure ? "memory_pressure" : "memory_sample", {
    context: context.slice(0, 80),
    rssMb,
    heapMb,
    externalMb,
    rssVsLimitPct,
    limitMb,
    limitSource: cgroupMb !== null ? "cgroup" : "host_total",
  });
}
