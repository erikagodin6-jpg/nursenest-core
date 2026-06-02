import { requireAdmin } from "@/lib/auth/guards";
import { getRedisHealthSnapshot } from "@/lib/server/redis";
import { getContentCacheHealthState } from "@/lib/cache/redis-content-cache";
import { getFallbackLimiterStats } from "@/lib/server/credentials-login-rate-limit";
import { getMemoryCacheStats } from "@/lib/cache/memory-cache";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { checkDatabaseReadiness } from "@/lib/db/prisma-readiness";
import type { PlatformHealthStatus, PlatformAlert } from "@/app/api/admin/platform-health/route";

export const dynamic = "force-dynamic";

// ─── Data loaders ─────────────────────────────────────────────────────────────

async function probeDatabase() {
  if (!isDatabaseUrlConfigured()) {
    return { urlConfigured: false, reachable: null as boolean | null, latencyMs: null as number | null, error: "DATABASE_URL not configured" };
  }
  const start = Date.now();
  try {
    const result = await Promise.race([
      checkDatabaseReadiness(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 3_500)),
    ]);
    const latencyMs = Date.now() - start;
    const ok = typeof result === "object" && result !== null && "ok" in result
      ? (result as { ok: boolean }).ok : true;
    return { urlConfigured: true, reachable: ok, latencyMs, error: null as string | null };
  } catch (e) {
    return { urlConfigured: true, reachable: false, latencyMs: Date.now() - start, error: e instanceof Error ? e.message.slice(0, 160) : "unknown" };
  }
}

function deriveAlerts(
  redisState: ReturnType<typeof getRedisHealthSnapshot>["state"],
  rlEvents: number,
  db: Awaited<ReturnType<typeof probeDatabase>>,
): PlatformAlert[] {
  const alerts: PlatformAlert[] = [];
  if (redisState === "misconfigured")
    alerts.push({ level: "critical", code: "REDIS_MISCONFIGURED", message: "Redis credentials are malformed. Rate limiting is running on in-process fallback only." });
  if (redisState === "unreachable")
    alerts.push({ level: "critical", code: "REDIS_UNREACHABLE", message: "Redis configured but not responding. Rate limiting fallback active. Session recovery degraded." });
  if (redisState === "unavailable")
    alerts.push({ level: "warning", code: "REDIS_UNAVAILABLE", message: "Redis is not configured. Rate limiting uses in-process fallback. Content caches disabled." });
  if (rlEvents > 0)
    alerts.push({ level: "warning", code: "RL_FALLBACK_ACTIVE", message: `Rate limit fallback used ${rlEvents.toLocaleString()} time(s) since process start.` });
  if (!db.urlConfigured)
    alerts.push({ level: "critical", code: "DB_URL_MISSING", message: "DATABASE_URL is not configured. No database-backed content is available." });
  else if (db.reachable === false)
    alerts.push({ level: "critical", code: "DB_UNREACHABLE", message: `Database not responding: ${db.error ?? "unknown"}.` });
  else if (db.latencyMs !== null && db.latencyMs > 2_000)
    alerts.push({ level: "warning", code: "DB_SLOW", message: `Database probe took ${db.latencyMs} ms — above the 2 s threshold.` });
  return alerts;
}

function deriveOverall(alerts: PlatformAlert[]): PlatformHealthStatus {
  if (alerts.some(a => a.level === "critical")) return "critical";
  if (alerts.some(a => a.level === "warning")) return "degraded";
  return "healthy";
}

// ─── Presentational helpers ───────────────────────────────────────────────────

const OVERALL_COLORS: Record<PlatformHealthStatus, string> = {
  healthy:  "var(--semantic-success)",
  degraded: "#f59e0b",
  critical: "var(--semantic-error)",
};

const OVERALL_BG: Record<PlatformHealthStatus, string> = {
  healthy:  "color-mix(in srgb, var(--semantic-success) 10%, transparent)",
  degraded: "color-mix(in srgb, #f59e0b 10%, transparent)",
  critical: "color-mix(in srgb, var(--semantic-error) 10%, transparent)",
};

const REDIS_COLORS: Record<string, string> = {
  reachable:     "var(--semantic-success)",
  unavailable:   "#6b7280",
  misconfigured: "var(--semantic-error)",
  unreachable:   "var(--semantic-error)",
  unchecked:     "#6b7280",
};

const REDIS_LABELS: Record<string, string> = {
  reachable:     "Reachable",
  unavailable:   "Not configured",
  misconfigured: "Misconfigured",
  unreachable:   "Unreachable",
  unchecked:     "Pending ping…",
};

function StatusDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
      style={{ background: color }}
    />
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3">
      <p
        className="font-mono text-xl font-bold"
        style={{ color: color ?? "var(--semantic-text-primary)" }}
      >
        {value}
      </p>
      <p className="mt-0.5 text-xs font-medium text-[var(--semantic-text-secondary)]">{label}</p>
      {sub && <p className="mt-0.5 text-[10px] text-[var(--semantic-text-tertiary)]">{sub}</p>}
    </div>
  );
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">{title}</h2>
      {sub && <p className="mt-0.5 text-xs text-[var(--semantic-text-secondary)]">{sub}</p>}
    </div>
  );
}

function MetaRow({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-sm">
      <dt className="text-[var(--semantic-text-secondary)]">{label}</dt>
      <dd className="font-mono font-semibold" style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </dd>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PlatformHealthPage() {
  await requireAdmin();

  const [db] = await Promise.all([probeDatabase()]);

  const redisSnap = getRedisHealthSnapshot();
  const rl = getFallbackLimiterStats();
  const mc = getMemoryCacheStats();

  const alerts = deriveAlerts(redisSnap.state, rl.eventCountSinceStart, db);
  const overall = deriveOverall(alerts);

  const now = new Date().toISOString();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <header className="mb-8 space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">Admin · Infrastructure</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)]">Production Health</h1>
        <p className="text-sm text-[var(--semantic-text-secondary)]">
          Infrastructure status for Redis, rate limiting, memory cache, and database.
          Data is process-local — refreshes on page load.
        </p>
        <p className="text-xs text-[var(--semantic-text-tertiary)]">{now}</p>
      </header>

      {/* ── Phase 5: Alert banners ─────────────────────────────────────────── */}
      {alerts.length > 0 && (
        <section className="mb-8 space-y-2">
          {alerts.map(alert => (
            <div
              key={alert.code}
              className="flex items-start gap-3 rounded-xl border px-4 py-3"
              style={{
                borderColor: alert.level === "critical" ? "var(--semantic-error)" : "#f59e0b",
                background: alert.level === "critical"
                  ? "color-mix(in srgb, var(--semantic-error) 8%, transparent)"
                  : "color-mix(in srgb, #f59e0b 8%, transparent)",
              }}
            >
              <span
                className="mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ background: alert.level === "critical" ? "var(--semantic-error)" : "#f59e0b" }}
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: alert.level === "critical" ? "var(--semantic-error)" : "#d97706" }}>
                  {alert.level === "critical" ? "Critical" : "Warning"} · {alert.code}
                </p>
                <p className="mt-0.5 text-sm text-[var(--semantic-text-primary)]">{alert.message}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ── Phase 4: Overall status strip ─────────────────────────────────── */}
      <section
        className="mb-8 rounded-2xl border px-6 py-5"
        style={{
          borderColor: OVERALL_COLORS[overall],
          background: OVERALL_BG[overall],
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: OVERALL_COLORS[overall] }}
            />
            <p className="text-lg font-bold" style={{ color: OVERALL_COLORS[overall] }}>
              {overall === "healthy" ? "Healthy" : overall === "degraded" ? "Degraded" : "Critical"}
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <span className="flex items-center gap-1.5">
              <StatusDot color={REDIS_COLORS[redisSnap.state]} />
              <span className="text-[var(--semantic-text-secondary)]">Redis: </span>
              <span className="font-semibold" style={{ color: REDIS_COLORS[redisSnap.state] }}>
                {REDIS_LABELS[redisSnap.state]}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <StatusDot color={rl.eventCountSinceStart > 0 ? "#f59e0b" : "var(--semantic-success)"} />
              <span className="text-[var(--semantic-text-secondary)]">Rate limit: </span>
              <span className="font-semibold" style={{ color: rl.eventCountSinceStart > 0 ? "#f59e0b" : "var(--semantic-success)" }}>
                {rl.eventCountSinceStart > 0 ? "Fallback active" : "Redis"}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <StatusDot color={db.reachable === false ? "var(--semantic-error)" : db.reachable === null ? "#6b7280" : "var(--semantic-success)"} />
              <span className="text-[var(--semantic-text-secondary)]">Database: </span>
              <span className="font-semibold" style={{ color: db.reachable === false ? "var(--semantic-error)" : db.reachable === null ? "#6b7280" : "var(--semantic-success)" }}>
                {db.reachable === null ? "Not configured" : db.reachable ? `OK${db.latencyMs !== null ? ` · ${db.latencyMs} ms` : ""}` : "Unreachable"}
              </span>
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">

        {/* ── Phase 1: Redis Health ─────────────────────────────────────────── */}
        <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
          <SectionHeader
            title="Redis Health"
            sub="Primary client uses @upstash/redis SDK. Content-cache client uses native fetch."
          />
          <dl className="divide-y divide-[var(--semantic-border-soft)]">
            <MetaRow
              label="Primary client state"
              value={
                <span className="flex items-center gap-1.5">
                  <StatusDot color={REDIS_COLORS[redisSnap.state]} />
                  {REDIS_LABELS[redisSnap.state]}
                </span>
              }
              valueColor={REDIS_COLORS[redisSnap.state]}
            />
            <MetaRow
              label="Last health check"
              value={redisSnap.checkedAt ? new Date(redisSnap.checkedAt).toISOString() : "—"}
            />
            <MetaRow
              label="Content cache client"
              value={
                <span className="flex items-center gap-1.5">
                  <StatusDot color={REDIS_COLORS[getContentCacheHealthState()]} />
                  {REDIS_LABELS[getContentCacheHealthState()]}
                </span>
              }
              valueColor={REDIS_COLORS[getContentCacheHealthState()]}
            />
            <MetaRow
              label="Rate limit fallback active"
              value={rl.eventCountSinceStart > 0 ? "Yes" : "No"}
              valueColor={rl.eventCountSinceStart > 0 ? "#f59e0b" : "var(--semantic-success)"}
            />
          </dl>
          <div className="mt-4 rounded-xl border border-[var(--semantic-border-soft)] px-4 py-3">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">State reference</p>
            <dl className="space-y-1">
              {[
                { state: "reachable",     desc: "Ping succeeded — writes and reads active" },
                { state: "unavailable",   desc: "Env vars absent — Redis not provisioned" },
                { state: "misconfigured", desc: "Env vars set but URL or token is malformed" },
                { state: "unreachable",   desc: "Credentials valid but network/auth failed" },
                { state: "unchecked",     desc: "Process just started, ping pending" },
              ].map(({ state, desc }) => (
                <div key={state} className="flex items-start gap-2 text-xs">
                  <StatusDot color={REDIS_COLORS[state]} />
                  <span>
                    <span className="font-semibold text-[var(--semantic-text-primary)]">{state}</span>
                    {" — "}
                    <span className="text-[var(--semantic-text-secondary)]">{desc}</span>
                  </span>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Phase 2: Rate Limiting ────────────────────────────────────────── */}
        <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
          <SectionHeader
            title="Rate Limiting"
            sub="Credential login protection via Redis fixed-window. In-process fallback when Redis is absent."
          />
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard
              label="Fallback events"
              value={rl.eventCountSinceStart.toLocaleString()}
              color={rl.eventCountSinceStart > 0 ? "#f59e0b" : "var(--semantic-success)"}
              sub="since process start"
            />
            <StatCard
              label="Active buckets"
              value={rl.bucketCount.toLocaleString()}
              sub={`of ${rl.bucketCapacity.toLocaleString()} max`}
            />
            <StatCard
              label="Limit ratio"
              value={(rl.limitRatio * 100).toFixed(0) + "%"}
              sub="fallback vs Redis limit"
            />
          </div>
          <dl className="divide-y divide-[var(--semantic-border-soft)]">
            <MetaRow
              label="Fallback active"
              value={rl.active ? "Yes" : "No"}
              valueColor={rl.active ? "#f59e0b" : "var(--semantic-success)"}
            />
            <MetaRow label="Last fallback activation" value={rl.lastActivatedAt ?? "Never"} />
            <MetaRow
              label="Bucket usage"
              value={`${rl.bucketCount} / ${rl.bucketCapacity}`}
              valueColor={rl.bucketCount > rl.bucketCapacity * 0.8 ? "#f59e0b" : undefined}
            />
          </dl>
          <div className="mt-4 rounded-xl border border-[var(--semantic-border-soft)] px-4 py-3 text-xs text-[var(--semantic-text-secondary)]">
            <p>
              <strong className="text-[var(--semantic-text-primary)]">When Redis is available:</strong>{" "}
              counters live in Redis (distributed, survives restarts).
            </p>
            <p className="mt-1">
              <strong className="text-[var(--semantic-text-primary)]">When Redis is absent:</strong>{" "}
              in-process Map at {(rl.limitRatio * 100).toFixed(0)}% of the Redis ceiling. Not shared across instances.
            </p>
          </div>
        </section>

        {/* ── Phase 3: Memory Cache ─────────────────────────────────────────── */}
        <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
          <SectionHeader
            title="Memory Cache"
            sub="Process-local TTL+LRU Map. Used for admin stats routes. Resets on deploy."
          />
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard
              label="Entries"
              value={mc.size}
              sub={`of ${mc.maxSize} max`}
              color={mc.size > mc.maxSize * 0.8 ? "#f59e0b" : undefined}
            />
            <StatCard label="Hit rate" value={mc.hitRate} />
            <StatCard label="Evictions" value={mc.evictions.toLocaleString()} sub="since process start" />
          </div>
          <dl className="divide-y divide-[var(--semantic-border-soft)]">
            <MetaRow label="Cache hits" value={mc.hits.toLocaleString()} />
            <MetaRow label="Cache misses" value={mc.misses.toLocaleString()} />
            <MetaRow
              label="Size vs capacity"
              value={`${mc.size} / ${mc.maxSize}`}
              valueColor={mc.size > mc.maxSize * 0.8 ? "#f59e0b" : undefined}
            />
          </dl>
        </section>

        {/* ── Phase 4: Database ────────────────────────────────────────────── */}
        <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
          <SectionHeader
            title="Database"
            sub="PostgreSQL via Prisma. Readiness probe timeout: 3.5 s."
          />
          <div className="mb-4 grid grid-cols-2 gap-3">
            <StatCard
              label="Status"
              value={db.reachable === null ? "Not configured" : db.reachable ? "Reachable" : "Unreachable"}
              color={db.reachable === null ? "#6b7280" : db.reachable ? "var(--semantic-success)" : "var(--semantic-error)"}
            />
            <StatCard
              label="Probe latency"
              value={db.latencyMs !== null ? `${db.latencyMs} ms` : "—"}
              color={db.latencyMs !== null && db.latencyMs > 2_000 ? "#f59e0b" : undefined}
            />
          </div>
          <dl className="divide-y divide-[var(--semantic-border-soft)]">
            <MetaRow
              label="DATABASE_URL configured"
              value={db.urlConfigured ? "Yes" : "No"}
              valueColor={db.urlConfigured ? "var(--semantic-success)" : "var(--semantic-error)"}
            />
            <MetaRow
              label="Reachable"
              value={db.reachable === null ? "N/A" : db.reachable ? "Yes" : "No"}
              valueColor={db.reachable === false ? "var(--semantic-error)" : undefined}
            />
            {db.error && (
              <MetaRow
                label="Error"
                value={db.error}
                valueColor="var(--semantic-error)"
              />
            )}
          </dl>
        </section>

      </div>

      {/* ── Alert legend ────────────────────────────────────────────────────── */}
      <section className="mt-8 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
        <SectionHeader title="Alert codes" sub="All codes that can appear in the banners above." />
        <dl className="grid gap-2 sm:grid-cols-2">
          {[
            { code: "REDIS_UNAVAILABLE",   level: "warning",  desc: "Redis env vars not set — use in-process rate limit fallback, content caches miss every time." },
            { code: "REDIS_MISCONFIGURED", level: "critical", desc: "One or both of UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN is present but malformed." },
            { code: "REDIS_UNREACHABLE",   level: "critical", desc: "Credentials valid but ping/first-call failed — network issue, token expired, or service down." },
            { code: "RL_FALLBACK_ACTIVE",  level: "warning",  desc: "The in-process rate limit fallback has been called at least once since process start." },
            { code: "DB_URL_MISSING",      level: "critical", desc: "DATABASE_URL is not set — no DB-backed content available." },
            { code: "DB_UNREACHABLE",      level: "critical", desc: "Database readiness probe failed or timed out." },
            { code: "DB_SLOW",             level: "warning",  desc: "Database probe took > 2 s — potential timeout risk on DB-heavy pages." },
          ].map(({ code, level, desc }) => (
            <div key={code} className="flex items-start gap-2">
              <span
                className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full"
                style={{ background: level === "critical" ? "var(--semantic-error)" : "#f59e0b" }}
              />
              <div>
                <dt className="text-xs font-semibold text-[var(--semantic-text-primary)]">
                  {code}
                  <span className="ml-1.5 text-[10px] font-normal uppercase" style={{ color: level === "critical" ? "var(--semantic-error)" : "#d97706" }}>
                    {level}
                  </span>
                </dt>
                <dd className="text-xs text-[var(--semantic-text-secondary)]">{desc}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

    </main>
  );
}
