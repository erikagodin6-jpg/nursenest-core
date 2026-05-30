"use client";

import Link from "next/link";
import { useState } from "react";
import type { SimulationDefinition } from "@/lib/physiology-monitor/simulation-catalog";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SimulationCenterData {
  sessionCount: number;
  completedConditions: string[];
  totalSimulations: number;
  avgCompositeScore: number;
  estimatedHours: number;
  safeSessionRate: number;
  simulations: SimulationDefinition[];
}

// ─── Specialty category map ───────────────────────────────────────────────────

const SPECIALTY_CATEGORIES: Array<{
  label: string;
  icon: string;
  tags: string[];
  color: string;
}> = [
  { label: "Cardiac",        icon: "❤️",  tags: ["cardiac", "stemi", "afib", "vt", "heart-failure", "pulmonary-edema"], color: "var(--semantic-danger)" },
  { label: "Critical Care",  icon: "🏥",  tags: ["icu", "critical-care", "septic-shock", "mods", "vasopressor"], color: "var(--semantic-chart-2)" },
  { label: "Emergency",      icon: "🚨",  tags: ["emergency", "acls", "code", "cpr", "anaphylaxis"], color: "var(--semantic-warning)" },
  { label: "Respiratory",    icon: "🫁",  tags: ["respiratory", "ards", "ventilator", "rt", "airway"], color: "var(--semantic-info)" },
  { label: "Telemetry",      icon: "📈",  tags: ["telemetry", "arrhythmia", "ecg", "monitoring"], color: "var(--semantic-success)" },
  { label: "Neurological",   icon: "🧠",  tags: ["neuro", "stroke", "icp", "neurological"], color: "var(--semantic-chart-4)" },
  { label: "Toxicology",     icon: "💊",  tags: ["toxicology", "opioid-toxicity", "overdose"], color: "var(--semantic-chart-7)" },
  { label: "New Graduate",   icon: "🎓",  tags: ["new-grad", "sbar", "escalation", "deteriorating-patient"], color: "var(--semantic-brand)" },
  { label: "NP Advanced",    icon: "⚕️",  tags: ["np", "differential", "advanced"], color: "var(--semantic-chart-5)" },
  { label: "RT Clinical",    icon: "🌬️",  tags: ["rt", "waveform", "ventilator-management"], color: "var(--semantic-chart-3)" },
];

const DIFFICULTY_LABELS: Record<string, string> = {
  foundational: "Foundation",
  developing:   "Developing",
  proficient:   "Proficient",
  advanced:     "Advanced",
};

const DIFFICULTY_COLOR: Record<string, string> = {
  foundational: "var(--semantic-success)",
  developing:   "var(--semantic-chart-2)",
  proficient:   "var(--semantic-warning)",
  advanced:     "var(--semantic-danger)",
};

// ─── Stat tile ────────────────────────────────────────────────────────────────

function StatTile({ value, label, sub, color }: { value: string | number; label: string; sub?: string; color?: string }) {
  return (
    <div className="flex flex-col rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-4 shadow-[var(--semantic-shadow-soft)]">
      <span className="text-2xl font-black tabular-nums" style={{ color: color ?? "var(--semantic-text-primary)" }}>
        {value}
      </span>
      <span className="mt-0.5 text-xs font-semibold text-[var(--semantic-text-primary)]">{label}</span>
      {sub && <span className="text-[0.65rem] text-[var(--semantic-text-muted)]">{sub}</span>}
    </div>
  );
}

// ─── Score ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score, size = 52 }: { score: number; size?: number }) {
  const r = (size / 2) - 4;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? "var(--semantic-success)" : score >= 60 ? "var(--semantic-warning)" : "var(--semantic-danger)";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--semantic-border-soft)" strokeWidth="4" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: "stroke-dasharray 600ms ease" }}
      />
      <text x={size/2} y={size/2 + 4} textAnchor="middle" fontSize={size > 48 ? "12" : "10"} fontWeight="700" fill="var(--semantic-text-primary)">{score}</text>
    </svg>
  );
}

// ─── Specialty card ───────────────────────────────────────────────────────────

function SpecialtyCard({
  specialty,
  sims,
  completed,
}: {
  specialty: typeof SPECIALTY_CATEGORIES[number];
  sims: SimulationDefinition[];
  completed: Set<string>;
}) {
  const available = sims.length;
  const done = sims.filter((s) => completed.has(s.conditionKey)).length;
  const pct = available > 0 ? Math.round((done / available) * 100) : 0;

  if (available === 0) return null;
  return (
    <Link
      href={`/app/simulation-center?category=${encodeURIComponent(specialty.label)}`}
      className="group flex flex-col gap-2 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] hover:shadow-md no-underline"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{specialty.icon}</span>
          <span className="text-sm font-bold text-[var(--semantic-text-primary)]">{specialty.label}</span>
        </div>
        <span className="text-[0.65rem] font-bold uppercase tracking-wide" style={{ color: specialty.color }}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--semantic-border-soft)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: specialty.color }}
        />
      </div>
      <div className="flex items-center justify-between text-[0.65rem] text-[var(--semantic-text-muted)]">
        <span>{done} / {available} completed</span>
        <span>→</span>
      </div>
    </Link>
  );
}

// ─── Simulation card ──────────────────────────────────────────────────────────

function SimulationCard({
  sim,
  completed,
}: {
  sim: SimulationDefinition;
  completed: Set<string>;
}) {
  const isDone = completed.has(sim.conditionKey);
  return (
    <Link
      href={`/app/physiology-monitor?condition=${sim.conditionKey}&mode=${sim.monitorMode}&sim=${sim.id}`}
      className="group flex flex-col gap-2 rounded-2xl border bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)] transition hover:shadow-md no-underline"
      style={{
        borderColor: isDone
          ? "color-mix(in srgb, var(--semantic-success) 30%, var(--semantic-border-soft))"
          : "var(--semantic-border-soft)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[0.6rem] font-bold uppercase tracking-wide text-[var(--semantic-brand)] mb-0.5">
            {sim.profession.join(" · ")}
          </p>
          <p className="text-sm font-bold text-[var(--semantic-text-primary)] leading-tight line-clamp-2">{sim.title}</p>
        </div>
        {isDone && (
          <span className="shrink-0 text-[var(--semantic-success)] text-base leading-none mt-0.5">✓</span>
        )}
      </div>
      <p className="text-[0.68rem] text-[var(--semantic-text-secondary)] leading-relaxed line-clamp-2">{sim.patientBrief}</p>
      <div className="flex items-center gap-2 flex-wrap mt-auto">
        <span
          className="text-[0.58rem] font-bold uppercase tracking-wide rounded-full px-2 py-0.5 border"
          style={{
            color: DIFFICULTY_COLOR[sim.difficulty],
            borderColor: `color-mix(in srgb, ${DIFFICULTY_COLOR[sim.difficulty]} 30%, var(--semantic-border-soft))`,
            background: `color-mix(in srgb, ${DIFFICULTY_COLOR[sim.difficulty]} 8%, var(--semantic-surface))`,
          }}
        >
          {DIFFICULTY_LABELS[sim.difficulty]}
        </span>
        <span className="text-[0.6rem] text-[var(--semantic-text-muted)]">~{sim.estimatedMinutes} min</span>
        <span className="text-[0.6rem] text-[var(--semantic-text-muted)] ml-auto opacity-0 group-hover:opacity-100 transition">
          Start →
        </span>
      </div>
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SimulationCenterClient({ data }: { data: SimulationCenterData }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const completedSet = new Set(data.completedConditions);

  const filteredSims = data.simulations.filter((s) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return s.title.toLowerCase().includes(q)
        || s.conditionKey.replace(/_/g, " ").includes(q)
        || s.tags.some((t) => t.includes(q))
        || s.specialty.some((sp) => sp.toLowerCase().includes(q));
    }
    if (activeCategory) {
      const cat = SPECIALTY_CATEGORIES.find((c) => c.label === activeCategory);
      return cat ? s.tags.some((t) => cat.tags.includes(t)) : true;
    }
    return true;
  });

  const recommended = data.simulations.find((s) => !completedSet.has(s.conditionKey));

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-[var(--semantic-text-primary)]">Simulation Center</h1>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
            Practice clinical deterioration with live patient monitors. Build expertise across {data.totalSimulations} scenarios.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/app/simulation-center/readiness"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2 text-xs font-semibold text-[var(--semantic-text-primary)] shadow-[var(--semantic-shadow-soft)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] no-underline"
          >
            📊 Readiness Dashboard
          </Link>
          <Link
            href="/app/simulation-center/clearances"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_25%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))] px-4 py-2 text-xs font-semibold text-[var(--semantic-brand)] shadow-[var(--semantic-shadow-soft)] transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] no-underline"
          >
            🏅 Clearances
          </Link>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatTile
          value={data.sessionCount}
          label="Sessions Completed"
          sub="All time"
          color="var(--semantic-brand)"
        />
        <StatTile
          value={`${data.completedConditions.length}/${data.totalSimulations}`}
          label="Simulations"
          sub="Conditions explored"
        />
        <StatTile
          value={data.avgCompositeScore > 0 ? data.avgCompositeScore : "—"}
          label="Avg Score"
          sub="Composite"
          color={data.avgCompositeScore >= 80 ? "var(--semantic-success)" : data.avgCompositeScore >= 60 ? "var(--semantic-warning)" : "var(--semantic-text-primary)"}
        />
        <StatTile
          value={`${data.estimatedHours}h`}
          label="Hours Practiced"
          sub="Simulation time"
          color="var(--semantic-chart-2)"
        />
        <StatTile
          value={`${data.safeSessionRate}%`}
          label="Safe Sessions"
          sub="Green Harm Index"
          color={data.safeSessionRate >= 80 ? "var(--semantic-success)" : "var(--semantic-warning)"}
        />
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-4 shadow-[var(--semantic-shadow-soft)]">
          <ScoreRing score={data.avgCompositeScore || 0} />
          <span className="mt-1 text-[0.65rem] font-semibold text-[var(--semantic-text-muted)] text-center">Performance</span>
        </div>
      </div>

      {/* ── Recommended next simulation ── */}
      {recommended && (
        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_4%,var(--semantic-surface))] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <p className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-brand)] mb-1">Recommended Next</p>
              <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">{recommended.title}</h2>
              <p className="mt-0.5 text-xs text-[var(--semantic-text-secondary)] max-w-xl">{recommended.patientBrief}</p>
              <div className="mt-2 flex items-center gap-3 text-[0.65rem] text-[var(--semantic-text-muted)] flex-wrap">
                <span>{recommended.profession.join(" · ")}</span>
                <span>·</span>
                <span>{DIFFICULTY_LABELS[recommended.difficulty]}</span>
                <span>·</span>
                <span>~{recommended.estimatedMinutes} min</span>
              </div>
            </div>
            <Link
              href={`/app/physiology-monitor?condition=${recommended.conditionKey}&mode=${recommended.monitorMode}&sim=${recommended.id}`}
              className="shrink-0 inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold nn-text-on-solid-fill shadow-md transition hover:opacity-95 no-underline"
              style={{ background: "var(--role-cta, var(--semantic-brand))" }}
            >
              Start Simulation →
            </Link>
          </div>
        </div>
      )}

      {/* ── Specialty categories ── */}
      <div>
        <h2 className="mb-3 text-sm font-bold text-[var(--semantic-text-primary)]">Browse by Specialty</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {SPECIALTY_CATEGORIES.map((cat) => {
            const catSims = data.simulations.filter((s) =>
              s.tags.some((t) => cat.tags.includes(t))
            );
            return (
              <SpecialtyCard
                key={cat.label}
                specialty={cat}
                sims={catSims}
                completed={completedSet}
              />
            );
          })}
        </div>
      </div>

      {/* ── Search + filter bar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-sm font-bold text-[var(--semantic-text-primary)]">All Simulations</h2>
        <div className="flex-1 min-w-[200px]">
          <input
            type="search"
            placeholder="Search simulations…"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setActiveCategory(null); }}
            className="w-full rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs text-[var(--semantic-text-primary)] placeholder:text-[var(--semantic-text-muted)] outline-none focus:border-[var(--semantic-brand)]"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => { setActiveCategory(null); setSearchQuery(""); }}
            className="rounded-full border px-3 py-1 text-[0.65rem] font-semibold transition"
            style={{
              borderColor: !activeCategory ? "var(--semantic-brand)" : "var(--semantic-border-soft)",
              background: !activeCategory ? "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))" : "var(--semantic-surface)",
              color: !activeCategory ? "var(--semantic-brand)" : "var(--semantic-text-secondary)",
            }}
          >
            All ({data.totalSimulations})
          </button>
          {SPECIALTY_CATEGORIES.slice(0, 6).map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => { setActiveCategory(cat.label); setSearchQuery(""); }}
              className="rounded-full border px-3 py-1 text-[0.65rem] font-semibold transition"
              style={{
                borderColor: activeCategory === cat.label ? cat.color : "var(--semantic-border-soft)",
                background: activeCategory === cat.label ? `color-mix(in srgb, ${cat.color} 10%, var(--semantic-surface))` : "var(--semantic-surface)",
                color: activeCategory === cat.label ? cat.color : "var(--semantic-text-secondary)",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Simulation grid ── */}
      {filteredSims.length === 0 ? (
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-8 text-center text-sm text-[var(--semantic-text-muted)]">
          No simulations found for &ldquo;{searchQuery}&rdquo;
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSims.map((sim) => (
            <SimulationCard key={sim.id} sim={sim} completed={completedSet} />
          ))}
        </div>
      )}

      {/* ── Bottom CTA ── */}
      <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-5 text-center space-y-3">
        <p className="text-sm font-bold text-[var(--semantic-text-primary)]">Track your clinical readiness</p>
        <p className="text-xs text-[var(--semantic-text-secondary)]">
          Every simulation updates your readiness scores across 7 clinical domains. Complete scenarios to earn unit clearances.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/app/simulation-center/readiness" className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2 text-xs font-semibold text-[var(--semantic-text-primary)] no-underline transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))]">
            View Readiness Dashboard
          </Link>
          <Link href="/app/simulation-center/clearances" className="inline-flex items-center gap-1.5 rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_25%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))] px-4 py-2 text-xs font-semibold text-[var(--semantic-brand)] no-underline transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))]">
            View Clearances
          </Link>
        </div>
      </div>

    </div>
  );
}
