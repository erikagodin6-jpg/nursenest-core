import { requireAdmin } from "@/lib/auth/guards";
import { analyzeTrend } from "@/lib/observability/trend-analytics";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// ─── Data loading ─────────────────────────────────────────────────────────────

const ONE_HOUR_MS  = 60 * 60 * 1000;
const ONE_DAY_MS   = 24 * ONE_HOUR_MS;
const SEVEN_DAY_MS = 7 * ONE_DAY_MS;

type DbSnapshot = {
  snapshotDate: Date;
  score: number;
  status: string;
  p95StartupMs: number | null;
  errorRate: number | null;
};

async function loadSnapshots(featureId: string, sinceMs: number): Promise<DbSnapshot[]> {
  if (!isDatabaseUrlConfigured()) return [];
  try {
    return await prisma.featureHealthSnapshot.findMany({
      where: { featureId, snapshotDate: { gte: new Date(Date.now() - sinceMs) } },
      orderBy: { snapshotDate: "asc" },
      select: { snapshotDate: true, score: true, status: true, p95StartupMs: true, errorRate: true },
    });
  } catch { return []; }
}

async function countErrors(windowMs: number) {
  if (!isDatabaseUrlConfigured()) return { criticalRoutes: 0, fallbackDelivery: 0 };
  const since = new Date(Date.now() - windowMs);
  try {
    const [cr, fd] = await Promise.all([
      prisma.criticalRouteErrors.count({ where: { createdAt: { gte: since } } }),
      prisma.fallbackDeliveryEvents.count({ where: { createdAt: { gte: since } } }),
    ]);
    return { criticalRoutes: cr, fallbackDelivery: fd };
  } catch { return { criticalRoutes: 0, fallbackDelivery: 0 }; }
}

function uptimePct(rows: DbSnapshot[]): string {
  if (rows.length === 0) return "—";
  const h = rows.filter(r => r.status === "healthy").length;
  return ((h / rows.length) * 100).toFixed(1) + "%";
}

function incidents(rows: DbSnapshot[]): number {
  return rows.filter(r => r.status === "critical" || r.status === "degraded").length;
}

function avgLatency(rows: DbSnapshot[]): number | null {
  const vals = rows.map(r => r.p95StartupMs).filter((v): v is number => v !== null);
  if (vals.length === 0) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

// Produce a simple fixed-width sparkline from an array of values
function textSparkline(values: number[], width = 20): string {
  if (values.length === 0) return "—";
  const BARS = "▁▂▃▄▅▆▇█";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const sampled = values.length <= width
    ? values
    : Array.from({ length: width }, (_, i) => values[Math.floor((i / width) * values.length)]!);
  return sampled.map(v => BARS[Math.min(7, Math.floor(((v - min) / range) * 8))] ?? "▁").join("");
}

// ─── Presentational components ────────────────────────────────────────────────

const DIRECTION_COLORS = {
  improving: "var(--semantic-success)",
  stable: "#6b7280",
  declining: "var(--semantic-error)",
  "insufficient-data": "#6b7280",
} as const;

const DIRECTION_LABELS = {
  improving: "↑ Improving",
  stable: "→ Stable",
  declining: "↓ Declining",
  "insufficient-data": "Insufficient data",
} as const;

function TrendChip({ direction }: { direction: keyof typeof DIRECTION_LABELS }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{
        color: DIRECTION_COLORS[direction],
        background: `color-mix(in srgb, ${DIRECTION_COLORS[direction]} 12%, transparent)`,
      }}
    >
      {DIRECTION_LABELS[direction]}
    </span>
  );
}

function SummaryCard({
  label, value, sub, color,
}: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3">
      <p className="font-mono text-xl font-bold" style={{ color: color ?? "var(--semantic-text-primary)" }}>
        {value}
      </p>
      <p className="mt-0.5 text-xs font-medium text-[var(--semantic-text-secondary)]">{label}</p>
      {sub && <p className="mt-0.5 text-[10px] text-[var(--semantic-text-tertiary)]">{sub}</p>}
    </div>
  );
}

function SectionHeader({ title, sub, href }: { title: string; sub?: string; href?: string }) {
  return (
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">{title}</h2>
        {sub && <p className="mt-0.5 text-xs text-[var(--semantic-text-secondary)]">{sub}</p>}
      </div>
      {href && (
        <a href={href} className="text-xs text-[var(--semantic-brand)] hover:underline">
          Current snapshot →
        </a>
      )}
    </div>
  );
}

function WindowTab({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
      style={active
        ? { background: "var(--semantic-brand)", color: "#fff" }
        : { background: "var(--semantic-surface-muted)", color: "var(--semantic-text-tertiary)" }
      }
    >
      {label}
    </span>
  );
}

function LatencyRow({ label, ms, warn = 2000, crit = 4000 }: { label: string; ms: number | null; warn?: number; crit?: number }) {
  const color = ms === null ? "#6b7280" : ms >= crit ? "var(--semantic-error)" : ms >= warn ? "#f59e0b" : "var(--semantic-success)";
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <dt className="text-[var(--semantic-text-secondary)]">{label}</dt>
      <dd className="font-mono font-semibold" style={{ color }}>
        {ms !== null ? `${ms} ms` : "—"}
      </dd>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PlatformHealthHistoryPage() {
  await requireAdmin();

  // Load all data concurrently
  const [
    dbRows7d, redisRows7d, rlRows7d,
    errors1h, errors24h, errors7d,
  ] = await Promise.all([
    loadSnapshots("infra.db.readiness", SEVEN_DAY_MS),
    loadSnapshots("infra.redis.primary", SEVEN_DAY_MS),
    loadSnapshots("infra.ratelimit.fallback", SEVEN_DAY_MS),
    countErrors(ONE_HOUR_MS),
    countErrors(ONE_DAY_MS),
    countErrors(SEVEN_DAY_MS),
  ]);

  const cut24h = Date.now() - ONE_DAY_MS;
  const cut1h  = Date.now() - ONE_HOUR_MS;

  const dbRows24h  = dbRows7d.filter(r => r.snapshotDate.getTime() >= cut24h);
  const dbRows1h   = dbRows7d.filter(r => r.snapshotDate.getTime() >= cut1h);
  const redisRows24h = redisRows7d.filter(r => r.snapshotDate.getTime() >= cut24h);
  const rlRows24h    = rlRows7d.filter(r => r.snapshotDate.getTime() >= cut24h);

  // In-process ring buffer trends
  const dbTrend    = analyzeTrend("infra.db.latency_ms", "7d", { lowerIsBetter: true });
  const redisTrend = analyzeTrend("infra.redis.reachable", "7d");
  const rlTrend    = analyzeTrend("infra.ratelimit.fallback_events", "7d", { lowerIsBetter: true });
  const errTrend   = analyzeTrend("infra.errors.critical_routes", "7d", { lowerIsBetter: true });

  // Sparklines from ring buffer
  const dbSparkValues    = dbTrend.dataPoints.map(p => p.value);
  const errorSparkValues = errTrend.dataPoints.map(p => p.value);
  const rlSparkValues    = rlTrend.dataPoints.map(p => p.value);

  // DB snapshot sparkline (latency values over 7d)
  const dbSnapshotLatencies = dbRows7d.map(r => r.p95StartupMs ?? 0);

  const now = new Date().toISOString();
  const hasDatabaseHistory = dbRows7d.length > 0;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="mb-8 space-y-1">
        <div className="flex items-center gap-3">
          <a href="/admin/platform-health" className="text-xs text-[var(--semantic-text-tertiary)] hover:underline">← Current state</a>
          <span className="text-xs text-[var(--semantic-text-tertiary)]">·</span>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">History</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)]">Platform Health — Trends</h1>
        <p className="text-sm text-[var(--semantic-text-secondary)]">
          Historical visibility for database, Redis, rate limiting, and errors.
          DB-backed snapshots every 5 min. In-process ring buffer resets on deploy.
        </p>
        <p className="text-xs text-[var(--semantic-text-tertiary)]">{now} · {dbRows7d.length} DB snapshots (7d)</p>
      </header>

      {/* ── No-data notice ───────────────────────────────────────────────── */}
      {!hasDatabaseHistory && (
        <div className="mb-8 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-5 text-sm text-[var(--semantic-text-secondary)]">
          <p className="font-semibold text-[var(--semantic-text-primary)]">No historical snapshots yet.</p>
          <p className="mt-1">
            Snapshots are written every 5 minutes when the{" "}
            <a href="/admin/platform-health" className="text-[var(--semantic-brand)] hover:underline">current health page</a>
            {" "}is loaded. Check back after a few admin page visits.
          </p>
        </div>
      )}

      {/* ── Phase 5: Operational Summary Cards ──────────────────────────── */}
      <section className="mb-10">
        <SectionHeader
          title="Operational Summary"
          sub="Derived from 5-min snapshots. Percentages show fraction of probes that were healthy."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Today / 24h */}
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
            <div className="mb-4 flex items-center gap-2">
              <WindowTab label="Today / 24h" active />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <SummaryCard label="DB uptime" value={uptimePct(dbRows24h)}
                color={dbRows24h.length === 0 ? "#6b7280" : uptimePct(dbRows24h) === "100.0%" ? "var(--semantic-success)" : "#f59e0b"} />
              <SummaryCard label="DB incidents" value={incidents(dbRows24h)}
                color={incidents(dbRows24h) > 0 ? "var(--semantic-error)" : "var(--semantic-success)"} />
              <SummaryCard label="Redis uptime" value={uptimePct(redisRows24h)}
                color={redisRows24h.length === 0 ? "#6b7280" : uptimePct(redisRows24h) === "100.0%" ? "var(--semantic-success)" : "#f59e0b"} />
              <SummaryCard label="RL fallback" value={rlRows24h.filter(r => r.score > 0).length}
                sub="snapshots with fallback" color={rlRows24h.some(r => r.score > 0) ? "#f59e0b" : "var(--semantic-success)"} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <SummaryCard label="Slow DB" value={dbRows24h.filter(r => (r.p95StartupMs ?? 0) > 2000).length}
                sub=">2 s probes" color={dbRows24h.some(r => (r.p95StartupMs ?? 0) > 2000) ? "#f59e0b" : undefined} />
              <SummaryCard label="Redis outages" value={redisRows24h.filter(r => r.status === "critical").length}
                color={redisRows24h.some(r => r.status === "critical") ? "var(--semantic-error)" : "var(--semantic-success)"} />
              <SummaryCard label="Critical errors" value={errors24h.criticalRoutes} />
              <SummaryCard label="Fallback delivers" value={errors24h.fallbackDelivery} />
            </div>
          </div>

          {/* Last 7 days */}
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
            <div className="mb-4 flex items-center gap-2">
              <WindowTab label="Last 7 days" active />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <SummaryCard label="DB uptime" value={uptimePct(dbRows7d)}
                color={dbRows7d.length === 0 ? "#6b7280" : uptimePct(dbRows7d) === "100.0%" ? "var(--semantic-success)" : "#f59e0b"} />
              <SummaryCard label="DB incidents" value={incidents(dbRows7d)}
                color={incidents(dbRows7d) > 0 ? "var(--semantic-error)" : "var(--semantic-success)"} />
              <SummaryCard label="Redis uptime" value={uptimePct(redisRows7d)}
                color={redisRows7d.length === 0 ? "#6b7280" : uptimePct(redisRows7d) === "100.0%" ? "var(--semantic-success)" : "#f59e0b"} />
              <SummaryCard label="RL fallback" value={rlRows7d.filter(r => r.score > 0).length}
                sub="snapshots with fallback" color={rlRows7d.some(r => r.score > 0) ? "#f59e0b" : undefined} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <SummaryCard label="Slow DB" value={dbRows7d.filter(r => (r.p95StartupMs ?? 0) > 2000).length}
                sub=">2 s probes" color={dbRows7d.some(r => (r.p95StartupMs ?? 0) > 2000) ? "#f59e0b" : undefined} />
              <SummaryCard label="Redis outages" value={redisRows7d.filter(r => r.status === "critical").length}
                color={redisRows7d.some(r => r.status === "critical") ? "var(--semantic-error)" : "var(--semantic-success)"} />
              <SummaryCard label="Critical errors" value={errors7d.criticalRoutes} />
              <SummaryCard label="Fallback delivers" value={errors7d.fallbackDelivery} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Phase 1: Database Trends ─────────────────────────────────────── */}
      <section className="mb-10 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
        <SectionHeader
          title="Database Trends"
          sub="Readiness probe latency. Snapshots every 5 min, retained 7 d."
          href="/admin/platform-health"
        />
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <TrendChip direction={dbTrend.direction} />
          {dbTrend.movingAverage !== null && (
            <span className="text-xs text-[var(--semantic-text-secondary)]">
              7d moving avg: <span className="font-mono font-semibold">{dbTrend.movingAverage} ms</span>
            </span>
          )}
          {dbTrend.percentChange !== null && (
            <span className="text-xs text-[var(--semantic-text-secondary)]">
              vs baseline: <span className="font-mono font-semibold" style={{ color: dbTrend.percentChange < 0 ? "var(--semantic-success)" : "var(--semantic-error)" }}>
                {dbTrend.percentChange > 0 ? "+" : ""}{dbTrend.percentChange}%
              </span>
            </span>
          )}
        </div>

        {/* Sparklines */}
        <div className="mb-4 space-y-2">
          {dbSparkValues.length > 0 && (
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">Ring buffer — latency (ms)</p>
              <p className="font-mono text-sm tracking-widest text-[var(--semantic-text-primary)]">{textSparkline(dbSparkValues)}</p>
            </div>
          )}
          {dbSnapshotLatencies.length > 0 && (
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">DB snapshots — 7d latency</p>
              <p className="font-mono text-sm tracking-widest text-[var(--semantic-text-primary)]">{textSparkline(dbSnapshotLatencies, 40)}</p>
            </div>
          )}
        </div>

        {/* Window breakdown */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Last hour", rows: dbRows1h },
            { label: "Last 24 hours", rows: dbRows24h },
            { label: "Last 7 days", rows: dbRows7d },
          ].map(({ label, rows }) => (
            <div key={label} className="rounded-xl border border-[var(--semantic-border-soft)] px-4 py-3">
              <p className="mb-2 text-xs font-semibold text-[var(--semantic-text-secondary)]">{label}</p>
              <dl className="divide-y divide-[var(--semantic-border-soft)]">
                <LatencyRow label="Avg latency" ms={avgLatency(rows)} />
                <div className="flex justify-between py-1.5 text-sm">
                  <dt className="text-[var(--semantic-text-secondary)]">Uptime</dt>
                  <dd className="font-mono font-semibold">{uptimePct(rows)}</dd>
                </div>
                <div className="flex justify-between py-1.5 text-sm">
                  <dt className="text-[var(--semantic-text-secondary)]">Incidents</dt>
                  <dd className="font-mono font-semibold" style={{ color: incidents(rows) > 0 ? "var(--semantic-error)" : undefined }}>
                    {incidents(rows)}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5 text-sm">
                  <dt className="text-[var(--semantic-text-secondary)]">Slow (&gt;2 s)</dt>
                  <dd className="font-mono font-semibold" style={{ color: rows.some(r => (r.p95StartupMs ?? 0) > 2000) ? "#f59e0b" : undefined }}>
                    {rows.filter(r => (r.p95StartupMs ?? 0) > 2000).length}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5 text-sm">
                  <dt className="text-[var(--semantic-text-secondary)]">Snapshots</dt>
                  <dd className="font-mono font-semibold text-[var(--semantic-text-tertiary)]">{rows.length}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* ── Phase 2: Redis Trends ────────────────────────────────────────── */}
      <section className="mb-10 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
        <SectionHeader
          title="Redis Trends"
          sub="Reachability state over time. Score 100 = reachable, 50 = unavailable (unconfigured), 0 = unreachable."
          href="/admin/platform-health"
        />
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <TrendChip direction={redisTrend.direction} />
        </div>

        {redisTrend.dataPoints.length > 0 && (
          <div className="mb-4">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">Ring buffer — reachability (1 = up)</p>
            <p className="font-mono text-sm tracking-widest text-[var(--semantic-text-primary)]">
              {textSparkline(redisTrend.dataPoints.map(p => p.value))}
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "Last 24 hours", rows: redisRows24h },
            { label: "Last 7 days", rows: redisRows7d },
          ].map(({ label, rows }) => (
            <div key={label} className="rounded-xl border border-[var(--semantic-border-soft)] px-4 py-3">
              <p className="mb-2 text-xs font-semibold text-[var(--semantic-text-secondary)]">{label}</p>
              <dl className="divide-y divide-[var(--semantic-border-soft)]">
                <div className="flex justify-between py-1.5 text-sm">
                  <dt className="text-[var(--semantic-text-secondary)]">Uptime</dt>
                  <dd className="font-mono font-semibold" style={{ color: "var(--semantic-success)" }}>{uptimePct(rows)}</dd>
                </div>
                <div className="flex justify-between py-1.5 text-sm">
                  <dt className="text-[var(--semantic-text-secondary)]">Reachable snapshots</dt>
                  <dd className="font-mono font-semibold">{rows.filter(r => r.status === "healthy").length}</dd>
                </div>
                <div className="flex justify-between py-1.5 text-sm">
                  <dt className="text-[var(--semantic-text-secondary)]">Unavailable snapshots</dt>
                  <dd className="font-mono font-semibold text-[var(--semantic-text-tertiary)]">{rows.filter(r => r.status === "degraded").length}</dd>
                </div>
                <div className="flex justify-between py-1.5 text-sm">
                  <dt className="text-[var(--semantic-text-secondary)]">Outage snapshots</dt>
                  <dd className="font-mono font-semibold" style={{ color: rows.some(r => r.status === "critical") ? "var(--semantic-error)" : undefined }}>
                    {rows.filter(r => r.status === "critical").length}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5 text-sm">
                  <dt className="text-[var(--semantic-text-secondary)]">Total snapshots</dt>
                  <dd className="font-mono font-semibold text-[var(--semantic-text-tertiary)]">{rows.length}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* ── Phase 3: Rate Limiting Trends ──────────────────────────────── */}
      <section className="mb-10 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
        <SectionHeader
          title="Rate Limiting Trends"
          sub="In-process fallback activations and bucket usage. Score = total fallback events at snapshot time."
          href="/admin/platform-health"
        />
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <TrendChip direction={rlTrend.direction} />
          {rlTrend.currentValue !== null && (
            <span className="text-xs text-[var(--semantic-text-secondary)]">
              Current fallback event count: <span className="font-mono font-semibold">{rlTrend.currentValue}</span>
            </span>
          )}
        </div>

        {rlSparkValues.length > 0 && (
          <div className="mb-4">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">Ring buffer — fallback events (cumulative)</p>
            <p className="font-mono text-sm tracking-widest text-[var(--semantic-text-primary)]">{textSparkline(rlSparkValues)}</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "Last 24 hours", rows: rlRows24h },
            { label: "Last 7 days", rows: rlRows7d },
          ].map(({ label, rows }) => (
            <div key={label} className="rounded-xl border border-[var(--semantic-border-soft)] px-4 py-3">
              <p className="mb-2 text-xs font-semibold text-[var(--semantic-text-secondary)]">{label}</p>
              <dl className="divide-y divide-[var(--semantic-border-soft)]">
                <div className="flex justify-between py-1.5 text-sm">
                  <dt className="text-[var(--semantic-text-secondary)]">Snapshots with fallback active</dt>
                  <dd className="font-mono font-semibold" style={{ color: rows.some(r => r.score > 0) ? "#f59e0b" : "var(--semantic-success)" }}>
                    {rows.filter(r => r.score > 0).length}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5 text-sm">
                  <dt className="text-[var(--semantic-text-secondary)]">Peak fallback events</dt>
                  <dd className="font-mono font-semibold">
                    {rows.length > 0 ? Math.max(...rows.map(r => r.score)) : "—"}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5 text-sm">
                  <dt className="text-[var(--semantic-text-secondary)]">Peak bucket usage</dt>
                  <dd className="font-mono font-semibold">
                    {rows.length > 0
                      ? (Math.max(...rows.map(r => Number(r.errorRate ?? 0))) * 100).toFixed(1) + "%"
                      : "—"}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5 text-sm">
                  <dt className="text-[var(--semantic-text-secondary)]">Total snapshots</dt>
                  <dd className="font-mono font-semibold text-[var(--semantic-text-tertiary)]">{rows.length}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* ── Phase 4: Error Trends ────────────────────────────────────────── */}
      <section className="mb-10 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
        <SectionHeader
          title="Error Trends"
          sub="critical_route_errors and fallback_delivery_events tables. Counts in rolling windows."
        />
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <TrendChip direction={errTrend.direction} />
        </div>

        {errorSparkValues.length > 0 && (
          <div className="mb-4 space-y-2">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">Critical route errors — ring buffer trend</p>
              <p className="font-mono text-sm tracking-widest" style={{ color: errTrend.direction === "declining" ? "var(--semantic-error)" : "var(--semantic-text-primary)" }}>
                {textSparkline(errorSparkValues)}
              </p>
            </div>
          </div>
        )}

        {/* Window breakdown table */}
        <div className="overflow-x-auto rounded-xl border border-[var(--semantic-border-soft)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--semantic-border-soft)] text-left">
                <th className="px-4 py-2.5 text-xs font-semibold text-[var(--semantic-text-secondary)]">Window</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-[var(--semantic-text-secondary)]">Critical route errors</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-[var(--semantic-text-secondary)]">Fallback deliveries</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Last hour",    e: errors1h },
                { label: "Last 24 hours", e: errors24h },
                { label: "Last 7 days",  e: errors7d },
              ].map(({ label, e }) => (
                <tr key={label} className="border-b border-[var(--semantic-border-soft)] last:border-0">
                  <td className="px-4 py-2.5 text-xs text-[var(--semantic-text-secondary)]">{label}</td>
                  <td className="px-4 py-2.5 font-mono text-xs font-semibold"
                    style={{ color: e.criticalRoutes > 0 ? "var(--semantic-error)" : undefined }}>
                    {e.criticalRoutes.toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs font-semibold"
                    style={{ color: e.fallbackDelivery > 10 ? "#f59e0b" : undefined }}>
                    {e.fallbackDelivery.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Legend ──────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
        <h2 className="mb-3 text-sm font-semibold text-[var(--semantic-text-primary)]">Data sources</h2>
        <dl className="grid gap-2 sm:grid-cols-2">
          {[
            { source: "Ring buffer", desc: "In-process Map, max 500 data points per metric. Resets on deploy. Updated on every platform-health page load." },
            { source: "FeatureHealthSnapshot DB", desc: "Written every 5 min per feature when health page is loaded. Survives deploys. Used for 24h and 7d windows." },
            { source: "critical_route_errors", desc: "Raw DB table of 500/error responses. Queried live at page load for error trend counts." },
            { source: "fallback_delivery_events", desc: "Raw DB table of content fallback delivery events. Queried live for fallback trend counts." },
          ].map(({ source, desc }) => (
            <div key={source}>
              <dt className="text-xs font-semibold text-[var(--semantic-text-primary)]">{source}</dt>
              <dd className="text-xs text-[var(--semantic-text-secondary)]">{desc}</dd>
            </div>
          ))}
        </dl>
      </section>

    </main>
  );
}
