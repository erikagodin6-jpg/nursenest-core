"use client";

import Link from "next/link";
import {
  READINESS_DOMAIN_LABELS,
  READINESS_DOMAIN_DESCRIPTIONS,
  READINESS_BAND_LABELS,
  type ReadinessProfile,
  type ReadinessDomain,
} from "@/lib/physiology-monitor/readiness-score-engine";

// ─── Score ring ───────────────────────────────────────────────────────────────

function DomainRing({ score, size = 72 }: { score: number; size?: number }) {
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? "var(--semantic-success)" : score >= 65 ? "var(--semantic-warning)" : "var(--semantic-danger)";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--semantic-border-soft)" strokeWidth="5" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: "stroke-dasharray 700ms ease" }}
      />
      <text x={size/2} y={size/2 + 5} textAnchor="middle" fontSize="16" fontWeight="800"
        fill="var(--semantic-text-primary)">{score}</text>
    </svg>
  );
}

// ─── Cleared badge ────────────────────────────────────────────────────────────

function ClearedBadge({ cleared }: { cleared: boolean }) {
  return cleared ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_8%,var(--semantic-surface))] px-2.5 py-0.5 text-[0.6rem] font-bold text-[color-mix(in_srgb,var(--semantic-success)_80%,var(--semantic-text-primary))] uppercase tracking-wide">
      ✓ Cleared
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2.5 py-0.5 text-[0.6rem] font-semibold text-[var(--semantic-text-muted)] uppercase tracking-wide">
      In Progress
    </span>
  );
}

// ─── Progress bar with threshold marker ──────────────────────────────────────

function ReadinessBar({ score, threshold, color }: { score: number; threshold: number; color: string }) {
  return (
    <div className="relative h-2.5 rounded-full bg-[var(--semantic-border-soft)] overflow-visible">
      {/* Fill */}
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
        style={{ width: `${score}%`, background: color }}
      />
      {/* Threshold marker */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-[var(--semantic-text-muted)]"
        style={{ left: `${threshold}%` }}
        title={`Clearance threshold: ${threshold}`}
      />
    </div>
  );
}

// ─── Domain card ──────────────────────────────────────────────────────────────

function ReadinessDomainCard({
  domain,
  ds,
}: {
  domain: ReadinessDomain;
  ds: ReadinessProfile["domains"][ReadinessDomain];
}) {
  const color = ds.score >= 80 ? "var(--semantic-success)"
    : ds.score >= 65 ? "var(--semantic-warning)"
    : "var(--semantic-danger)";

  const clearanceThreshold = ds.components.length > 0
    ? 80 // default
    : 75;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[var(--semantic-text-primary)] leading-tight">
            {READINESS_DOMAIN_LABELS[domain]}
          </h3>
          <ClearedBadge cleared={ds.cleared} />
        </div>
        <DomainRing score={ds.score} size={64} />
      </div>

      {/* Band label */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold" style={{ color }}>{READINESS_BAND_LABELS[ds.band]}</span>
        <span className="text-[var(--semantic-text-muted)] text-[0.65rem]">Target: 80</span>
      </div>

      {/* Progress bar */}
      <ReadinessBar score={ds.score} threshold={80} color={color} />

      {/* Components */}
      {ds.components.length > 0 && (
        <div className="space-y-1.5">
          {ds.components.slice(0, 3).map((c) => (
            <div key={c.name} className="flex items-center justify-between gap-2">
              <span className="text-[0.65rem] text-[var(--semantic-text-secondary)] truncate">{c.name}</span>
              <span className="text-[0.65rem] font-bold tabular-nums" style={{ color: c.score >= 70 ? "var(--semantic-success)" : "var(--semantic-warning)" }}>
                {c.score}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Limiting factors */}
      {ds.limitingFactors.length > 0 && (
        <div className="rounded-xl bg-[color-mix(in_srgb,var(--semantic-warning)_6%,var(--semantic-surface))] border border-[color-mix(in_srgb,var(--semantic-warning)_18%,var(--semantic-border-soft))] px-3 py-2">
          <p className="text-[0.58rem] font-bold uppercase tracking-wide text-[var(--semantic-warning)] mb-1">What&apos;s holding you back</p>
          <ul className="space-y-0.5">
            {ds.limitingFactors.slice(0, 2).map((f) => (
              <li key={f} className="text-[0.65rem] text-[var(--semantic-text-secondary)] flex items-start gap-1">
                <span className="text-[var(--semantic-warning)] mt-0.5">▸</span>{f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Strengths */}
      {ds.strengths.length > 0 && (
        <div className="space-y-0.5">
          {ds.strengths.slice(0, 1).map((s) => (
            <p key={s} className="text-[0.65rem] text-[var(--semantic-text-secondary)] flex items-center gap-1">
              <span className="text-[var(--semantic-success)]">✓</span>{s}
            </p>
          ))}
        </div>
      )}

      {/* Coaching note */}
      <p className="text-[0.65rem] italic text-[var(--semantic-text-muted)] leading-relaxed border-t border-[var(--semantic-border-soft)] pt-2">
        {ds.coachingNote}
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ReadinessDashboardClient({
  profile,
  sessionCount,
  recentConditions,
}: {
  profile: ReadinessProfile;
  sessionCount: number;
  recentConditions: string[];
}) {
  const compositeColor = profile.compositeScore >= 80 ? "var(--semantic-success)"
    : profile.compositeScore >= 65 ? "var(--semantic-warning)"
    : "var(--semantic-danger)";

  const clearedCount = profile.clearedDomains.length;
  const totalDomains = Object.keys(profile.domains).length;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/app/simulation-center" className="text-[0.65rem] text-[var(--semantic-text-muted)] hover:text-[var(--semantic-text-secondary)] no-underline">
              ← Simulation Center
            </Link>
          </div>
          <h1 className="text-2xl font-black text-[var(--semantic-text-primary)]">Clinical Readiness</h1>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
            Based on {sessionCount} simulation {sessionCount === 1 ? "session" : "sessions"} · {recentConditions.length} conditions practiced
          </p>
        </div>
        <Link
          href="/app/simulation-center"
          className="inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold nn-text-on-solid-fill shadow-md transition hover:opacity-95 no-underline"
          style={{ background: "var(--role-cta, var(--semantic-brand))" }}
        >
          Run a Simulation →
        </Link>
      </div>

      {/* Composite + clearances summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:col-span-1">
          <DomainRing score={profile.compositeScore} size={80} />
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)] mb-0.5">Composite</p>
            <p className="text-lg font-black" style={{ color: compositeColor }}>
              {READINESS_BAND_LABELS[profile.compositeBand]}
            </p>
            <p className="text-[0.65rem] text-[var(--semantic-text-muted)]">
              {profile.compositeScore}/100 overall
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_5%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)] sm:col-span-1">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] text-2xl font-black text-[var(--semantic-success)]">
            {clearedCount}
          </div>
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)] mb-0.5">Clearances</p>
            <p className="text-sm font-bold text-[var(--semantic-text-primary)]">{clearedCount} of {totalDomains} Domains</p>
            <p className="text-[0.65rem] text-[var(--semantic-text-muted)]">
              {totalDomains - clearedCount} remaining
            </p>
          </div>
        </div>

        {sessionCount === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 text-center shadow-[var(--semantic-shadow-soft)] sm:col-span-1">
            <p className="text-sm font-bold text-[var(--semantic-text-primary)]">No sessions yet</p>
            <p className="mt-1 text-[0.68rem] text-[var(--semantic-text-secondary)]">Complete simulations to see your readiness scores.</p>
            <Link href="/app/simulation-center" className="mt-3 text-xs font-semibold text-[var(--semantic-brand)] no-underline hover:underline">
              Start first simulation →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:col-span-1">
            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">Priority Focus</p>
            {profile.priorityDomains.slice(0, 3).map((domain) => {
              const ds = profile.domains[domain];
              return (
                <div key={domain} className="flex items-center justify-between gap-2">
                  <span className="text-[0.68rem] text-[var(--semantic-text-secondary)] truncate">{READINESS_DOMAIN_LABELS[domain]}</span>
                  <span className="text-[0.65rem] font-bold text-[var(--semantic-warning)]">{ds.score}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All domain cards */}
      <div>
        <h2 className="mb-4 text-sm font-bold text-[var(--semantic-text-primary)]">Readiness by Domain</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(Object.keys(profile.domains) as ReadinessDomain[]).map((domain) => (
            <ReadinessDomainCard
              key={domain}
              domain={domain}
              ds={profile.domains[domain]}
            />
          ))}
        </div>
      </div>

      {/* How to improve CTA */}
      <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-5">
        <h3 className="text-sm font-bold text-[var(--semantic-text-primary)] mb-2">How to improve your readiness</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-[0.72rem] text-[var(--semantic-text-secondary)]">
          <div className="flex items-start gap-2">
            <span className="text-[var(--semantic-brand)] mt-0.5">1.</span>
            <span>Complete simulations matching your weakest domain to earn targeted score improvements.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[var(--semantic-brand)] mt-0.5">2.</span>
            <span>Review harm events in session replay — each resolved harm event raises your safety score.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[var(--semantic-brand)] mt-0.5">3.</span>
            <span>Escalate on time in 3 consecutive sessions to unlock escalation clearance gates.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
