"use client";

import Link from "next/link";
import {
  READINESS_DOMAIN_LABELS,
  type ReadinessProfile,
  type ReadinessDomain,
} from "@/lib/physiology-monitor/readiness-score-engine";
import type { CLEARANCE_REQUIREMENTS, ClearanceData } from "./page";

type ClearanceReqs = typeof CLEARANCE_REQUIREMENTS;

// ─── Progress ring (small) ────────────────────────────────────────────────────

function ProgressRing({ pct, color, size = 48 }: { pct: number; color: string; size?: number }) {
  const r = (size / 2) - 4;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--semantic-border-soft)" strokeWidth="4" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: "stroke-dasharray 700ms ease" }}
      />
      <text x={size/2} y={size/2 + 4} textAnchor="middle" fontSize="11" fontWeight="700"
        fill="var(--semantic-text-primary)">{Math.round(pct)}%</text>
    </svg>
  );
}

// ─── Clearance card ───────────────────────────────────────────────────────────

function ClearanceCard({
  domain,
  req,
  ds,
  sessionCount,
  conditionsPracticed,
}: {
  domain: ReadinessDomain;
  req: ClearanceReqs[ReadinessDomain];
  ds: ReadinessProfile["domains"][ReadinessDomain];
  sessionCount: number;
  conditionsPracticed: string[];
}) {
  const scoreOk = ds.score >= req.requiredScore;
  const sessionsOk = sessionCount >= req.minSessions;
  const practicedRequired = req.requiredConditions.filter((c) => conditionsPracticed.includes(c));
  const conditionsOk = practicedRequired.length === req.requiredConditions.length;
  const allMet = scoreOk && sessionsOk && conditionsOk;
  const cleared = ds.cleared && allMet;

  const totalReqs = 3;
  const metReqs = (scoreOk ? 1 : 0) + (sessionsOk ? 1 : 0) + (conditionsOk ? 1 : 0);
  const pct = Math.round((metReqs / totalReqs) * 100);

  const color = cleared ? "var(--semantic-success)"
    : pct >= 66 ? "var(--semantic-warning)"
    : "var(--semantic-text-muted)";

  return (
    <div
      className="flex flex-col gap-4 rounded-2xl border bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]"
      style={{
        borderColor: cleared
          ? "color-mix(in srgb, var(--semantic-success) 35%, var(--semantic-border-soft))"
          : "var(--semantic-border-soft)",
        background: cleared
          ? "color-mix(in srgb, var(--semantic-success) 3%, var(--semantic-surface))"
          : "var(--semantic-surface)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {cleared && (
            <div className="mb-1 inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_8%,var(--semantic-surface))] px-2.5 py-0.5 text-[0.6rem] font-bold text-[color-mix(in_srgb,var(--semantic-success)_80%,var(--semantic-text-primary))] uppercase tracking-wide">
              🏅 Cleared
            </div>
          )}
          <h3 className="text-sm font-black text-[var(--semantic-text-primary)]">{req.badgeLabel}</h3>
          <p className="text-[0.62rem] text-[var(--semantic-text-muted)] mt-0.5">{req.unit}</p>
        </div>
        <ProgressRing pct={pct} color={color} size={52} />
      </div>

      {/* Description */}
      <p className="text-[0.68rem] text-[var(--semantic-text-secondary)] leading-relaxed">{req.badgeDescription}</p>

      {/* Requirements checklist */}
      <div className="space-y-2">
        <p className="text-[0.58rem] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Requirements</p>

        {/* Score requirement */}
        <div className="flex items-center gap-2.5">
          <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[0.6rem] font-bold ${scoreOk ? "bg-[var(--semantic-success)] text-white" : "bg-[var(--semantic-border-soft)] text-[var(--semantic-text-muted)]"}`}>
            {scoreOk ? "✓" : "○"}
          </span>
          <div className="flex items-center justify-between flex-1 gap-2">
            <span className="text-[0.65rem] text-[var(--semantic-text-secondary)]">
              Readiness score ≥ {req.requiredScore}
            </span>
            <span className={`text-[0.65rem] font-bold tabular-nums ${scoreOk ? "text-[var(--semantic-success)]" : "text-[var(--semantic-text-muted)]"}`}>
              {ds.score}/{req.requiredScore}
            </span>
          </div>
        </div>

        {/* Sessions requirement */}
        <div className="flex items-center gap-2.5">
          <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[0.6rem] font-bold ${sessionsOk ? "bg-[var(--semantic-success)] text-white" : "bg-[var(--semantic-border-soft)] text-[var(--semantic-text-muted)]"}`}>
            {sessionsOk ? "✓" : "○"}
          </span>
          <div className="flex items-center justify-between flex-1 gap-2">
            <span className="text-[0.65rem] text-[var(--semantic-text-secondary)]">
              Complete {req.minSessions}+ sessions
            </span>
            <span className={`text-[0.65rem] font-bold tabular-nums ${sessionsOk ? "text-[var(--semantic-success)]" : "text-[var(--semantic-text-muted)]"}`}>
              {Math.min(sessionCount, req.minSessions)}/{req.minSessions}
            </span>
          </div>
        </div>

        {/* Required conditions */}
        {req.requiredConditions.length > 0 && (
          <div className="flex items-start gap-2.5">
            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[0.6rem] font-bold mt-0.5 ${conditionsOk ? "bg-[var(--semantic-success)] text-white" : "bg-[var(--semantic-border-soft)] text-[var(--semantic-text-muted)]"}`}>
              {conditionsOk ? "✓" : "○"}
            </span>
            <div className="flex-1">
              <span className="text-[0.65rem] text-[var(--semantic-text-secondary)]">
                Practice required scenarios: {practicedRequired.length}/{req.requiredConditions.length}
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {req.requiredConditions.map((c) => {
                  const done = conditionsPracticed.includes(c);
                  return (
                    <span
                      key={c}
                      className="rounded-full px-2 py-0.5 text-[0.58rem] font-semibold border"
                      style={{
                        borderColor: done ? "color-mix(in srgb, var(--semantic-success) 28%, var(--semantic-border-soft))" : "var(--semantic-border-soft)",
                        background: done ? "color-mix(in srgb, var(--semantic-success) 8%, var(--semantic-surface))" : "var(--semantic-surface)",
                        color: done ? "color-mix(in srgb, var(--semantic-success) 75%, var(--semantic-text-primary))" : "var(--semantic-text-muted)",
                      }}
                    >
                      {done ? "✓ " : ""}{c.replace(/_/g, " ")}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      {cleared ? (
        <div className="rounded-xl bg-[color-mix(in_srgb,var(--semantic-success)_6%,var(--semantic-surface))] border border-[color-mix(in_srgb,var(--semantic-success)_18%,var(--semantic-border-soft))] px-3 py-2 text-center">
          <p className="text-[0.65rem] font-bold text-[color-mix(in_srgb,var(--semantic-success)_75%,var(--semantic-text-primary))]">
            🏅 {req.badgeLabel} earned
          </p>
        </div>
      ) : (
        <Link
          href="/app/simulation-center"
          className="block rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_25%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] px-3 py-2 text-center text-[0.65rem] font-semibold text-[var(--semantic-brand)] no-underline transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))]"
        >
          {pct >= 66 ? "Almost there — complete remaining requirements →" : "Start working toward this clearance →"}
        </Link>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ClearanceCenterClient({
  data,
  requirements,
}: {
  data: ClearanceData;
  requirements: ClearanceReqs;
}) {
  const clearedCount = data.profile.clearedDomains.length;
  const totalDomains = Object.keys(requirements).length;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="mb-1">
            <Link href="/app/simulation-center" className="text-[0.65rem] text-[var(--semantic-text-muted)] hover:text-[var(--semantic-text-secondary)] no-underline">
              ← Simulation Center
            </Link>
          </div>
          <h1 className="text-2xl font-black text-[var(--semantic-text-primary)]">Clinical Clearances</h1>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
            Earn unit-specific clearances by demonstrating clinical competency in simulations.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-3 shadow-[var(--semantic-shadow-soft)]">
          <div className="text-right">
            <p className="text-2xl font-black text-[var(--semantic-brand)]">{clearedCount}</p>
            <p className="text-[0.65rem] text-[var(--semantic-text-muted)]">of {totalDomains} clearances</p>
          </div>
          <div className="h-10 w-0.5 bg-[var(--semantic-border-soft)]" />
          <div>
            <p className="text-sm font-bold text-[var(--semantic-text-primary)]">{data.sessionCount}</p>
            <p className="text-[0.65rem] text-[var(--semantic-text-muted)]">sessions</p>
          </div>
        </div>
      </div>

      {/* What clearances are */}
      <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_3%,var(--semantic-surface))] p-4 sm:p-5">
        <h2 className="text-sm font-bold text-[var(--semantic-text-primary)] mb-1">What are clinical clearances?</h2>
        <p className="text-[0.72rem] text-[var(--semantic-text-secondary)] leading-relaxed max-w-3xl">
          Clearances are verifiable milestones that certify your readiness for specific clinical environments.
          Each clearance requires a minimum readiness score, a set number of simulation sessions, and practice
          with scenario-specific conditions. Clearances can be shared with educators and employers as evidence
          of simulation-based competency.
        </p>
      </div>

      {/* No sessions prompt */}
      {data.sessionCount === 0 && (
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-8 text-center space-y-3">
          <p className="text-base font-bold text-[var(--semantic-text-primary)]">No simulations completed yet</p>
          <p className="text-sm text-[var(--semantic-text-secondary)]">Complete simulations to track progress toward your clearances.</p>
          <Link
            href="/app/simulation-center"
            className="inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold nn-text-on-solid-fill shadow-md no-underline transition hover:opacity-95"
            style={{ background: "var(--role-cta, var(--semantic-brand))" }}
          >
            Start First Simulation →
          </Link>
        </div>
      )}

      {/* Clearance grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(Object.entries(requirements) as Array<[ReadinessDomain, ClearanceReqs[ReadinessDomain]]>).map(
          ([domain, req]) => (
            <ClearanceCard
              key={domain}
              domain={domain}
              req={req}
              ds={data.profile.domains[domain]}
              sessionCount={data.sessionCount}
              conditionsPracticed={data.conditionsPracticed}
            />
          )
        )}
      </div>

    </div>
  );
}
