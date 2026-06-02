import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { getRedisHealthSnapshot } from "@/lib/server/redis";
import { getContentCacheHealthState } from "@/lib/cache/redis-content-cache";
import { getFallbackLimiterStats } from "@/lib/server/credentials-login-rate-limit";
import { getMemoryCacheStats } from "@/lib/cache/memory-cache";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { checkDatabaseReadiness } from "@/lib/db/prisma-readiness";
import { recordPlatformHealthSnapshot } from "@/lib/admin/platform-health-recorder";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store, no-cache, must-revalidate" } as const;

export type PlatformHealthStatus = "healthy" | "degraded" | "critical";

export type RedisHealthSection = {
  primaryClient: ReturnType<typeof getRedisHealthSnapshot>;
  contentCacheClient: ReturnType<typeof getContentCacheHealthState>;
  /** True when rate limiting is running on in-process fallback */
  rateLimitFallbackActive: boolean;
};

export type RateLimitSection = ReturnType<typeof getFallbackLimiterStats>;

export type MemoryCacheSection = ReturnType<typeof getMemoryCacheStats>;

export type DatabaseSection = {
  urlConfigured: boolean;
  reachable: boolean | null;
  latencyMs: number | null;
  error: string | null;
};

export type PlatformHealthPayload = {
  ok: true;
  checkedAt: string;
  overall: PlatformHealthStatus;
  alerts: PlatformAlert[];
  redis: RedisHealthSection;
  rateLimit: RateLimitSection;
  memoryCache: MemoryCacheSection;
  database: DatabaseSection;
};

export type PlatformAlert = {
  level: "warning" | "critical";
  code: string;
  message: string;
};

async function probeDatabase(): Promise<DatabaseSection> {
  if (!isDatabaseUrlConfigured()) {
    return { urlConfigured: false, reachable: null, latencyMs: null, error: "DATABASE_URL not configured" };
  }
  const start = Date.now();
  try {
    const result = await Promise.race([
      checkDatabaseReadiness(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 3_500)
      ),
    ]);
    const latencyMs = Date.now() - start;
    const ok = typeof result === "object" && result !== null && "ok" in result
      ? (result as { ok: boolean }).ok
      : true;
    return { urlConfigured: true, reachable: ok, latencyMs, error: null };
  } catch (e) {
    return {
      urlConfigured: true,
      reachable: false,
      latencyMs: Date.now() - start,
      error: e instanceof Error ? e.message.slice(0, 160) : "unknown",
    };
  }
}

function deriveAlerts(
  redis: RedisHealthSection,
  rl: RateLimitSection,
  db: DatabaseSection,
): PlatformAlert[] {
  const alerts: PlatformAlert[] = [];

  if (redis.primaryClient.state === "misconfigured") {
    alerts.push({ level: "critical", code: "REDIS_MISCONFIGURED", message: "Redis credentials are present but malformed. Rate limiting is running on in-process fallback only." });
  }
  if (redis.primaryClient.state === "unreachable") {
    alerts.push({ level: "critical", code: "REDIS_UNREACHABLE", message: "Redis is configured but not responding. Rate limiting is on in-process fallback. Session recovery is degraded." });
  }
  if (redis.primaryClient.state === "unavailable") {
    alerts.push({ level: "warning", code: "REDIS_UNAVAILABLE", message: "Redis is not configured. Rate limiting is on in-process fallback. Content caches are disabled." });
  }
  if (rl.eventCountSinceStart > 0) {
    alerts.push({ level: "warning", code: "RL_FALLBACK_ACTIVE", message: `Rate limit fallback has been used ${rl.eventCountSinceStart.toLocaleString()} time(s) since process start. Redis may be unavailable or credentials are missing.` });
  }
  if (!db.urlConfigured) {
    alerts.push({ level: "critical", code: "DB_URL_MISSING", message: "DATABASE_URL is not configured. The application cannot serve any database-backed content." });
  } else if (db.reachable === false) {
    alerts.push({ level: "critical", code: "DB_UNREACHABLE", message: `Database is not responding (${db.error ?? "unknown error"}). All learner content is unavailable.` });
  } else if (db.latencyMs !== null && db.latencyMs > 2_000) {
    alerts.push({ level: "warning", code: "DB_SLOW", message: `Database readiness probe took ${db.latencyMs} ms — above the 2 s warning threshold.` });
  }

  return alerts;
}

function deriveOverallStatus(alerts: PlatformAlert[]): PlatformHealthStatus {
  if (alerts.some(a => a.level === "critical")) return "critical";
  if (alerts.some(a => a.level === "warning")) return "degraded";
  return "healthy";
}

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const [db] = await Promise.all([probeDatabase()]);

  const redisSnapshot = getRedisHealthSnapshot();
  const redis: RedisHealthSection = {
    primaryClient: redisSnapshot,
    contentCacheClient: getContentCacheHealthState(),
    rateLimitFallbackActive: getFallbackLimiterStats().eventCountSinceStart > 0,
  };
  const rl = getFallbackLimiterStats();
  const mc = getMemoryCacheStats();

  const alerts = deriveAlerts(redis, rl, db);
  const overall = deriveOverallStatus(alerts);

  // Fire-and-forget — never delays the response
  void recordPlatformHealthSnapshot({
    db: { reachable: db.reachable, latencyMs: db.latencyMs },
    redisState: redisSnapshot.state,
    rlFallbackEvents: rl.eventCountSinceStart,
    rlBucketCount: rl.bucketCount,
  });

  const payload: PlatformHealthPayload = {
    ok: true,
    checkedAt: new Date().toISOString(),
    overall,
    alerts,
    redis,
    rateLimit: rl,
    memoryCache: mc,
    database: db,
  };

  return NextResponse.json(payload, { headers: NO_STORE });
}
