import { requireAdmin } from "@/lib/auth/guards";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  getReliabilityCounters,
  type ReliabilityTier,
} from "@/lib/server/content-cache";
import { getRecoveryMetrics } from "@/lib/study-content-failover/self-healing-flashcard-session-cache";

export const dynamic = "force-dynamic";

const TIER_LABELS: Record<ReliabilityTier, string> = {
  tier_a: "Tier A — Cache hit",
  tier_b: "Tier B — Live generation",
  tier_c: "Tier C — Catalog/snapshot fallback",
  tier_d_error: "Tier D — Error (all tiers exhausted)",
};

const TIER_COLORS: Record<ReliabilityTier, string> = {
  tier_a: "var(--semantic-success)",
  tier_b: "var(--semantic-brand)",
  tier_c: "#f59e0b",
  tier_d_error: "var(--semantic-error)",
};

const TIERS: ReliabilityTier[] = ["tier_a", "tier_b", "tier_c", "tier_d_error"];
const DAYS_BACK = 7;

type SurfaceTotals = {
  tier_a: number;
  tier_b: number;
  tier_c: number;
  tier_d_error: number;
  total: number;
  primarySuccessRate: string;
  cacheRecoveryRate: string;
  snapshotRecoveryRate: string;
  failureRate: string;
};

function computeTotals(daily: Record<string, Record<ReliabilityTier, number>>): SurfaceTotals {
  const t = { tier_a: 0, tier_b: 0, tier_c: 0, tier_d_error: 0 };
  for (const day of Object.values(daily)) {
    t.tier_a += day.tier_a ?? 0;
    t.tier_b += day.tier_b ?? 0;
    t.tier_c += day.tier_c ?? 0;
    t.tier_d_error += day.tier_d_error ?? 0;
  }
  const total = t.tier_a + t.tier_b + t.tier_c + t.tier_d_error;
  const pct = (n: number) => (total > 0 ? ((n / total) * 100).toFixed(1) + "%" : "—");
  return {
    ...t,
    total,
    primarySuccessRate: pct(t.tier_b),
    cacheRecoveryRate: pct(t.tier_a),
    snapshotRecoveryRate: pct(t.tier_c),
    failureRate: pct(t.tier_d_error),
  };
}

export default async function AdminReliabilityPage() {
  await requireAdmin();

  const [flashcardDaily, practiceDaily, lessonDaily] = await Promise.all([
    getReliabilityCounters("flashcard", DAYS_BACK).catch(() => ({})),
    getReliabilityCounters("practice", DAYS_BACK).catch(() => ({})),
    getReliabilityCounters("lesson", DAYS_BACK).catch(() => ({})),
  ]);

  safeServerLog("admin", "reliability_dashboard_viewed", {});

  const flashcard = computeTotals(flashcardDaily);
  const practice = computeTotals(practiceDaily);
  const lesson = computeTotals(lessonDaily);
  const inProcess = getRecoveryMetrics();

  const surfaces = [
    { label: "Flashcards", slug: "flashcard", totals: flashcard, daily: flashcardDaily },
    { label: "Practice Tests", slug: "practice", totals: practice, daily: practiceDaily },
    { label: "Lessons", slug: "lesson", totals: lesson, daily: lessonDaily },
  ] as const;

  const today = new Date().toISOString().slice(0, 10);
  const dates = Array.from({ length: DAYS_BACK }, (_, i) => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    return d.toISOString().slice(0, 10);
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="mb-10 space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">Platform Reliability</p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)]">
          Recovery Dashboard
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-[var(--semantic-text-secondary)]">
          Recovery tier breakdown for flashcards, practice tests, and lessons over the last {DAYS_BACK} days.
          Counters are incremented via Redis INCR on every session delivery. Resets on Redis flush or key expiry (8-day TTL).
        </p>
        <p className="text-xs text-[var(--semantic-text-tertiary)]">As of {today} · Auto-refreshes on page load</p>
      </header>

      {/* ── Per-surface cards ───────────────────────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-3">
        {surfaces.map(({ label, slug, totals }) => (
          <section
            key={slug}
            className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-sm"
          >
            <h2 className="mb-4 text-base font-semibold text-[var(--semantic-text-primary)]">{label}</h2>
            <dl className="space-y-2">
              <div className="flex justify-between text-sm">
                <dt className="text-[var(--semantic-text-secondary)]">Total requests (7d)</dt>
                <dd className="font-mono font-semibold text-[var(--semantic-text-primary)]">{totals.total.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-[var(--semantic-text-secondary)]">Live generation (Tier B)</dt>
                <dd className="font-mono font-semibold" style={{ color: TIER_COLORS.tier_b }}>{totals.primarySuccessRate}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-[var(--semantic-text-secondary)]">Cache recovery (Tier A)</dt>
                <dd className="font-mono font-semibold" style={{ color: TIER_COLORS.tier_a }}>{totals.cacheRecoveryRate}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-[var(--semantic-text-secondary)]">Snapshot fallback (Tier C)</dt>
                <dd className="font-mono font-semibold" style={{ color: TIER_COLORS.tier_c }}>{totals.snapshotRecoveryRate}</dd>
              </div>
              <div className="mt-2 flex justify-between border-t border-[var(--semantic-border-soft)] pt-2 text-sm">
                <dt className="font-semibold text-[var(--semantic-text-secondary)]">Hard failure rate (Tier D)</dt>
                <dd className="font-mono font-semibold" style={{ color: TIER_COLORS.tier_d_error }}>{totals.failureRate}</dd>
              </div>
            </dl>

            {/* Raw counts */}
            <div className="mt-4 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted,var(--semantic-surface))] px-4 py-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">7-day raw counts</p>
              <div className="grid grid-cols-4 gap-1 text-center">
                {TIERS.map((tier) => (
                  <div key={tier}>
                    <p className="font-mono text-base font-bold text-[var(--semantic-text-primary)]">{totals[tier].toLocaleString()}</p>
                    <p className="text-[9px] font-medium uppercase text-[var(--semantic-text-tertiary)]">{tier.replace("tier_", "T").replace("_error", "↯")}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ── Daily breakdown table ───────────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="mb-4 text-base font-semibold text-[var(--semantic-text-primary)]">Daily breakdown — Flashcards (7d)</h2>
        <div className="overflow-x-auto rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--semantic-border-soft)] text-left">
                <th className="px-4 py-3 text-xs font-semibold text-[var(--semantic-text-secondary)]">Date</th>
                <th className="px-4 py-3 text-xs font-semibold" style={{ color: TIER_COLORS.tier_a }}>Tier A (Cache)</th>
                <th className="px-4 py-3 text-xs font-semibold" style={{ color: TIER_COLORS.tier_b }}>Tier B (Live)</th>
                <th className="px-4 py-3 text-xs font-semibold" style={{ color: TIER_COLORS.tier_c }}>Tier C (Snapshot)</th>
                <th className="px-4 py-3 text-xs font-semibold" style={{ color: TIER_COLORS.tier_d_error }}>Tier D (Error)</th>
                <th className="px-4 py-3 text-xs font-semibold text-[var(--semantic-text-secondary)]">Total</th>
                <th className="px-4 py-3 text-xs font-semibold text-[var(--semantic-text-secondary)]">Fail %</th>
              </tr>
            </thead>
            <tbody>
              {dates.map((date) => {
                const row = (flashcardDaily as Record<string, Record<ReliabilityTier, number>>)[date] ?? { tier_a: 0, tier_b: 0, tier_c: 0, tier_d_error: 0 };
                const rowTotal = row.tier_a + row.tier_b + row.tier_c + row.tier_d_error;
                const failPct = rowTotal > 0 ? ((row.tier_d_error / rowTotal) * 100).toFixed(1) : "—";
                return (
                  <tr key={date} className="border-b border-[var(--semantic-border-soft)] last:border-0 hover:bg-[color-mix(in_srgb,var(--semantic-brand)_3%,transparent)]">
                    <td className="px-4 py-2.5 font-mono text-xs text-[var(--semantic-text-secondary)]">{date}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{row.tier_a.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{row.tier_b.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{row.tier_c.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono text-xs" style={{ color: row.tier_d_error > 0 ? TIER_COLORS.tier_d_error : undefined }}>{row.tier_d_error.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono text-xs font-semibold text-[var(--semantic-text-primary)]">{rowTotal.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono text-xs" style={{ color: Number(failPct) > 5 ? TIER_COLORS.tier_d_error : undefined }}>{failPct}{typeof failPct === "string" && failPct !== "—" ? "%" : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── In-process counters ──────────────────────────────────────────── */}
      <section className="mt-12 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
        <h2 className="mb-2 text-base font-semibold text-[var(--semantic-text-primary)]">In-process flashcard counters</h2>
        <p className="mb-4 text-xs text-[var(--semantic-text-secondary)]">
          Counts for the current server process only. Reset on deployment or instance restart. These supplement the durable Redis counters above.
        </p>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Object.entries(inProcess).map(([key, count]) => (
            <div key={key} className="rounded-xl border border-[var(--semantic-border-soft)] px-4 py-3 text-center">
              <p className="font-mono text-lg font-bold text-[var(--semantic-text-primary)]">{count}</p>
              <p className="text-[10px] font-medium text-[var(--semantic-text-tertiary)]">{key.replace(/_/g, " ")}</p>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Tier legend ─────────────────────────────────────────────────── */}
      <section className="mt-8 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
        <h2 className="mb-3 text-sm font-semibold text-[var(--semantic-text-primary)]">Tier legend</h2>
        <dl className="grid gap-2 sm:grid-cols-2">
          {Object.entries(TIER_LABELS).map(([tier, label]) => (
            <div key={tier} className="flex items-start gap-2">
              <span
                className="mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ background: TIER_COLORS[tier as ReliabilityTier] }}
              />
              <div>
                <dt className="text-xs font-semibold text-[var(--semantic-text-primary)]">{label}</dt>
              </div>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
