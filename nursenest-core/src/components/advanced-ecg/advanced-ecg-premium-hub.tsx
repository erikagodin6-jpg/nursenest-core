"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Gauge,
  HeartPulse,
  Lock,
  Monitor,
  Shield,
  Stethoscope,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { AdvancedEcgAccessDecision } from "@/lib/advanced-ecg/advanced-ecg-access";
import type { AdvancedEcgCurriculumUnit } from "@/lib/advanced-ecg/advanced-ecg-curriculum";
import {
  ADVANCED_ECG_MODULE_CHECKOUT_ANCHOR,
  ADVANCED_ECG_PRICING_ANCHOR,
} from "@/lib/advanced-ecg/advanced-ecg-module-config";
import { EcgLiveStrip } from "@/components/study/ecg-live-strip";
import { defaultEcgStripConfigForRhythm } from "@/lib/ecg-module/ecg-waveform-generator";

/* ── telemetry waveform decoration ──────────────────────────────────── */

const HERO_PEAKS = [
  10, 18, 14, 55, 38, 62, 44, 50, 35, 60, 46, 54, 32, 48, 40, 52, 38, 46, 34, 58, 43, 49, 31, 55,
  12, 20, 16, 58, 40, 65, 46, 52, 37, 63, 48, 56, 34, 50, 42, 54, 40, 48, 36, 60,
] as const;

function TelemetryBar({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      role="presentation"
      className={`flex h-10 items-end gap-px overflow-hidden ${className ?? ""}`}
    >
      {HERO_PEAKS.map((h, i) => (
        <span
          key={i}
          className="w-full min-w-[2px] max-w-[5px] shrink-0 rounded-full opacity-70"
          style={{
            height: `${h}%`,
            background:
              i % 5 === 0 ? "var(--semantic-chart-1)"
              : i % 5 === 1 ? "var(--semantic-chart-2)"
              : i % 5 === 2 ? "var(--semantic-chart-3)"
              : i % 5 === 3 ? "var(--semantic-chart-4)"
              : "var(--semantic-chart-5)",
          }}
        />
      ))}
    </div>
  );
}

/* ── specialty badge ─────────────────────────────────────────────────── */

function TelemetryBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-1)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-1)_10%,var(--semantic-surface))] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[color-mix(in_srgb,var(--semantic-chart-1)_90%,var(--semantic-text-primary))]">
      <Activity className="h-3 w-3 shrink-0" aria-hidden />
      {label}
    </span>
  );
}

/* ── stat card ───────────────────────────────────────────────────────── */

function StatCard({ value, label, icon: Icon }: { value: string; label: string; icon: typeof Activity }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--semantic-surface))] px-4 py-3 text-center">
      <Icon className="h-4 w-4 text-[var(--semantic-chart-3)]" aria-hidden />
      <span className="text-xl font-bold tracking-tight text-[var(--semantic-text-primary)]">{value}</span>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--semantic-text-muted)]">{label}</span>
    </div>
  );
}

/* ── difficulty pill ─────────────────────────────────────────────────── */

type Difficulty = "intermediate" | "advanced" | "expert";

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  intermediate: "border-[color-mix(in_srgb,var(--semantic-chart-3)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_08%,transparent)] text-[color-mix(in_srgb,var(--semantic-chart-3)_90%,var(--semantic-text-primary))]",
  advanced: "border-[color-mix(in_srgb,var(--semantic-warning)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,transparent)] text-[color-mix(in_srgb,var(--semantic-warning)_88%,var(--semantic-text-primary))]",
  expert: "border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_07%,transparent)] text-[color-mix(in_srgb,var(--semantic-danger)_88%,var(--semantic-text-primary))]",
};

function DifficultyPill({ level }: { level: Difficulty }) {
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${DIFFICULTY_STYLES[level]}`}>
      {level}
    </span>
  );
}

/* ── unit card metadata ──────────────────────────────────────────────── */

const UNIT_META: Record<string, { difficulty: Difficulty; icon: typeof Activity; accent: string; questions: number; tags: string[] }> = {
  foundations: { difficulty: "intermediate", icon: Gauge, accent: "var(--semantic-chart-3)", questions: 12, tags: ["Lead placement", "Intervals", "Axis"] },
  "twelve-lead-interpretation": { difficulty: "advanced", icon: Monitor, accent: "var(--semantic-chart-1)", questions: 18, tags: ["Localization", "Reciprocal", "12-lead"] },
  "ischemia-infarction": { difficulty: "expert", icon: HeartPulse, accent: "var(--semantic-danger)", questions: 25, tags: ["STEMI", "Equivalents", "Posterior"] },
  "conduction-blocks": { difficulty: "advanced", icon: TrendingUp, accent: "var(--semantic-chart-4)", questions: 20, tags: ["AV blocks", "BBB", "Fascicular"] },
  pacemakers: { difficulty: "advanced", icon: Zap, accent: "var(--semantic-chart-2)", questions: 15, tags: ["Capture", "Malfunction", "CRT"] },
  "electrolytes-toxicology": { difficulty: "advanced", icon: Brain, accent: "var(--semantic-chart-5)", questions: 20, tags: ["Hyperkalemia", "QT", "Tox"] },
  "critical-care-telemetry": { difficulty: "expert", icon: Target, accent: "var(--semantic-warning)", questions: 15, tags: ["ICU", "Escalation", "Surveillance"] },
  "acls-ecg-decision-making": { difficulty: "expert", icon: Shield, accent: "var(--semantic-danger)", questions: 18, tags: ["ACLS", "Shockable", "Decision"] },
  "case-studies": { difficulty: "expert", icon: Stethoscope, accent: "var(--semantic-brand)", questions: 20, tags: ["Integrated", "Clinical", "Progression"] },
};

const LOCKED_STRIP_CONFIG = defaultEcgStripConfigForRhythm("ventricular_tachycardia");

/* ── launch tile ─────────────────────────────────────────────────────── */

function LaunchTile({
  href, icon: Icon, label, desc, tone,
}: {
  href: string; icon: typeof BookOpen; label: string; desc: string;
  tone: "primary" | "warning" | "chart3" | "chart4";
}) {
  const wrapStyle: Record<string, string> = {
    primary: "border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] hover:bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))]",
    warning: "border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_06%,var(--semantic-surface))] hover:bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))]",
    chart3: "border-[color-mix(in_srgb,var(--semantic-chart-3)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_06%,var(--semantic-surface))] hover:bg-[color-mix(in_srgb,var(--semantic-chart-3)_10%,var(--semantic-surface))]",
    chart4: "border-[color-mix(in_srgb,var(--semantic-chart-4)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_07%,var(--semantic-surface))] hover:bg-[color-mix(in_srgb,var(--semantic-chart-4)_11%,var(--semantic-surface))]",
  };
  const iconStyle: Record<string, string> = {
    primary: "text-[var(--semantic-info)]",
    warning: "text-[var(--semantic-warning)]",
    chart3: "text-[color-mix(in_srgb,var(--semantic-chart-3)_90%,var(--semantic-text-primary))]",
    chart4: "text-[color-mix(in_srgb,var(--semantic-chart-4)_90%,var(--semantic-text-primary))]",
  };
  return (
    <Link
      href={href}
      className={`group flex flex-col justify-between gap-3 rounded-2xl border p-4 shadow-[var(--semantic-shadow-soft)] transition-colors ${wrapStyle[tone]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconStyle[tone]}`} aria-hidden />
        <ChevronRight className="h-4 w-4 shrink-0 text-[var(--semantic-text-muted)] transition group-hover:translate-x-0.5" aria-hidden />
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{label}</p>
        <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{desc}</p>
      </div>
    </Link>
  );
}

/* ── main component ──────────────────────────────────────────────────── */

export type AdvancedEcgPremiumHubProps = {
  access: AdvancedEcgAccessDecision;
  curriculum: readonly AdvancedEcgCurriculumUnit[];
};

export function AdvancedEcgPremiumHub({ access, curriculum }: AdvancedEcgPremiumHubProps) {
  const unlocked = access.ok;
  const [stripMounted, setStripMounted] = useState(false);

  useEffect(() => {
    setStripMounted(true);
  }, []);

  return (
    <div className="space-y-6" data-nn-qa-advanced-ecg-premium-hub="">

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-1)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_32%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-7"
        aria-labelledby="adv-ecg-hero-heading"
        data-nn-advanced-ecg-hero=""
      >
        {/* ambient radial */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 90% 15%, var(--semantic-chart-1), transparent), radial-gradient(ellipse 55% 45% at 10% 80%, var(--semantic-chart-3), transparent)",
          }}
        />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] xl:gap-10 xl:items-center">
          {/* left */}
          <div className="min-w-0 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <TelemetryBadge label="Advanced ECG & Telemetry Mastery" />
              <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_08%,transparent)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-success)]">
                {unlocked ? "Unlocked" : "Add-On Module"}
              </span>
            </div>

            <div>
              <h2 id="adv-ecg-hero-heading" className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-3xl lg:text-4xl">
                ICU-grade ECG interpretation.{" "}
                <span
                  className="bg-clip-text"
                  style={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundImage: "linear-gradient(135deg, var(--semantic-chart-1) 0%, var(--semantic-chart-3) 100%)",
                  }}
                >
                  Clinician-reviewed.
                </span>
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:text-base">
                160+ clinician-reviewed questions across complex ventricular rhythms, advanced ischemia, pacemakers, toxicology, critical-care telemetry, and integrated case scenarios. Engineered for RN/NP, ICU, ER, CCU, and telemetry nurses.
              </p>
            </div>

            <TelemetryBar />

            {/* stats */}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
              <StatCard value="160+" label="Curated questions" icon={Activity} />
              <StatCard value="8" label="Clinical tracks" icon={BookOpen} />
              <StatCard value="ICU/CCU" label="Focused" icon={Monitor} />
              <StatCard value="ACLS" label="Integrated" icon={Shield} />
            </div>

            {/* clinical badges */}
            <ul className="flex flex-wrap gap-2" aria-label="Coverage areas">
              {["Ventricular rhythms", "STEMI equivalents", "Conduction disease", "Pacemakers", "Tox & electrolytes", "Telemetry triage", "ACLS decision-making"].map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--semantic-text-secondary)]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          {/* right — live strip panel */}
          <div className="min-w-0 space-y-3 xl:pl-2">
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-1)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_28%,var(--semantic-surface))] p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
                  Lead II · VT Pattern
                </span>
                <span className="flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_08%,transparent)] px-2 py-0.5 text-[10px] font-bold text-[color-mix(in_srgb,var(--semantic-danger)_88%,var(--semantic-text-primary))]">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--semantic-danger)]" aria-hidden />
                  Critical
                </span>
              </div>
              {stripMounted ? (
                <EcgLiveStrip
                  config={{
                    ...LOCKED_STRIP_CONFIG,
                    rate: 165,
                  }}
                  mode="live"
                  title="Monomorphic VT · 165 bpm"
                  className="mt-1"
                />
              ) : (
                <div className="mt-2 aspect-[18/5] w-full animate-pulse rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)]" />
              )}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[{ v: "165", l: "bpm" }, { v: "0.18s", l: "QRS" }, { v: "Wide", l: "complex" }].map(({ v, l }) => (
                  <div key={l} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-1.5">
                    <p className="text-sm font-bold tabular-nums text-[var(--semantic-text-primary)]">{v}</p>
                    <p className="text-[10px] font-medium text-[var(--semantic-text-muted)]">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* who this is for */}
            <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">Designed for</p>
              <ul className="mt-2 space-y-1.5">
                {["RN / NP — Telemetry, ICU, ER, CCU", "ACLS certification prep", "Step-down / progressive care", "Advanced cardiac specialty nursing"].map((line) => (
                  <li key={line} className="flex items-center gap-2 text-xs text-[var(--semantic-text-secondary)]">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACCESS STATE ──────────────────────────────────────────────── */}
      {unlocked ? (
        <UnlockedLaunchSection />
      ) : (
        <LockedUpgradeSection reason={(access as Extract<AdvancedEcgAccessDecision, { ok: false }>).reason} />
      )}

      {/* ── CURRICULUM TRACKS ─────────────────────────────────────────── */}
      <section id="curriculum" aria-labelledby="curriculum-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">Curriculum</p>
            <h3 id="curriculum-heading" className="text-lg font-semibold text-[var(--semantic-text-primary)] sm:text-xl">
              9 clinical tracks · 160+ questions
            </h3>
          </div>
          <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1 text-[11px] font-semibold text-[var(--semantic-text-muted)]">
            All tracks included
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {curriculum.map((unit, index) => {
            const meta = UNIT_META[unit.slug] ?? {
              difficulty: "advanced" as Difficulty,
              icon: Activity,
              accent: "var(--semantic-chart-1)",
              questions: 15,
              tags: [],
            };
            const Icon = meta.icon;
            return (
              <article
                key={unit.slug}
                className="group relative overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)] transition-shadow hover:shadow-md"
                data-nn-qa-advanced-ecg-unit={unit.slug}
              >
                {/* top accent stripe */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[2px] opacity-70"
                  style={{ background: `linear-gradient(90deg, ${meta.accent}, transparent)` }}
                />
                <div className="flex items-start justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border"
                      style={{
                        borderColor: `color-mix(in srgb, ${meta.accent} 30%, var(--semantic-border-soft))`,
                        background: `color-mix(in srgb, ${meta.accent} 10%, var(--semantic-surface))`,
                        color: meta.accent,
                      }}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
                      Track {index + 1}
                    </p>
                  </div>
                  <DifficultyPill level={meta.difficulty} />
                </div>

                <h4 className="mt-3 text-sm font-semibold leading-snug text-[var(--semantic-text-primary)]">{unit.title}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{unit.summary}</p>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-[var(--semantic-text-muted)]">{meta.questions}+ Q</span>
                  <span className="text-[var(--semantic-border-soft)]">·</span>
                  {meta.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[var(--semantic-border-soft)] bg-transparent px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── GOVERNANCE NOTICE ─────────────────────────────────────────── */}
      <section
        className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_05%,var(--semantic-surface))] p-4 sm:p-5"
        aria-label="Clinical governance"
      >
        <div className="flex flex-wrap items-start gap-4">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[var(--semantic-success)]" aria-hidden />
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Clinician-reviewed · Evidence-anchored</p>
            <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              Every question carries a clinician review timestamp, QA status, and publish-safety classification.
              Strip configurations are deterministic and validated against clinical templates before learner exposure.
              High-risk rhythms (R-on-T, complete heart block, malignant tachycardias) are contextualized with explicit clinical framing.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              {["Clinician-reviewed 2026", "QA status: approved", "Publish safety: verified", "RN/NP scope-locked"].map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-1 text-[10px] font-semibold text-[var(--semantic-success)]"
                >
                  <CheckCircle2 className="h-3 w-3" aria-hidden />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── unlocked launch section ──────────────────────────────────────── */

function UnlockedLaunchSection() {
  return (
    <section id="launch" aria-labelledby="launch-heading" className="space-y-4">
      <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_06%,var(--semantic-surface))] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))]">
              <CheckCircle2 className="h-5 w-5 text-[var(--semantic-success)]" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Advanced ECG unlocked</p>
              <p className="text-xs text-[var(--semantic-text-secondary)]">Full access to all 9 tracks and 160+ curated questions</p>
            </div>
          </div>
          <Link
            href="/modules/ecg/advanced/lessons"
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--semantic-success)] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90"
          >
            Start Advanced Lessons
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <LaunchTile href="/modules/ecg/advanced/lessons" icon={BookOpen} label="Advanced Lessons" desc="High-acuity ECG interpretation with clinical context framing." tone="primary" />
        <LaunchTile href="/modules/ecg/advanced/video-drills" icon={Zap} label="Video Drills" desc="Rapid-fire recognition drills for high-stakes rhythm identification." tone="warning" />
        <LaunchTile href="/modules/ecg/advanced/scenarios" icon={Stethoscope} label="Clinical Scenarios" desc="Integrated cases with vitals, intervention reasoning, and escalation logic." tone="chart3" />
        <LaunchTile href="/modules/ecg/advanced/worksheets" icon={Target} label="Worksheets" desc="Multi-strip comparison and clinical reasoning prompts." tone="chart4" />
      </div>
    </section>
  );
}

/* ── locked upgrade section ───────────────────────────────────────── */

type BlockedReason = Extract<AdvancedEcgAccessDecision, { ok: false }>["reason"];

const UPGRADE_COPY: Record<BlockedReason, { heading: string; body: string; primaryLabel: string; primaryHref: string }> = {
  sign_in_required: {
    heading: "Sign in to continue",
    body: "Advanced ECG is a separate paid add-on for RN and NP learners. Sign in first to check your access or proceed to add the module.",
    primaryLabel: "Sign in",
    primaryHref: "/login?callbackUrl=%2Fmodules%2Fecg-advanced",
  },
  module_unavailable: {
    heading: "Module coming online",
    body: "Advanced ECG is being prepared for your cohort. Core ECG telemetry content is available now.",
    primaryLabel: "Try Core ECG",
    primaryHref: "/modules/ecg",
  },
  base_subscription_required: {
    heading: "Start with a base subscription",
    body: "Advanced ECG requires an active RN or NP base subscription first, then the add-on unlocks as an additional tier.",
    primaryLabel: "View plans",
    primaryHref: "/pricing",
  },
  tier_not_eligible: {
    heading: "RN and NP learners only",
    body: "Advanced ECG is scoped to RN and NP clinical practice. It is not available for RPN/PN or Allied pathways.",
    primaryLabel: "Back to your dashboard",
    primaryHref: "/app",
  },
  advanced_ecg_upgrade_required: {
    heading: "Add Advanced ECG to your plan",
    body: "Advanced ECG is a separate paid add-on — it is not included in base RN/NP subscriptions. Add it once to unlock all 9 tracks and 160+ clinician-reviewed questions.",
    primaryLabel: "View add-on pricing",
    primaryHref: ADVANCED_ECG_PRICING_ANCHOR,
  },
};

function LockedUpgradeSection({ reason }: { reason: BlockedReason }) {
  const copy = UPGRADE_COPY[reason] ?? UPGRADE_COPY.advanced_ecg_upgrade_required;
  return (
    <section
      aria-labelledby="upgrade-heading"
      className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-1)_25%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-7"
      id="upgrade"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-1)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-1)_10%,var(--semantic-surface))]">
          <Lock className="h-5 w-5 text-[var(--semantic-chart-1)]" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 id="upgrade-heading" className="text-base font-semibold text-[var(--semantic-text-primary)] sm:text-lg">
            {copy.heading}
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{copy.body}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={copy.primaryHref}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--role-cta)] px-5 py-2.5 text-sm font-semibold text-[var(--role-cta-foreground)] shadow-[0_2px_10px_var(--role-cta-shadow)] hover:opacity-90"
            >
              {copy.primaryLabel}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            {reason === "advanced_ecg_upgrade_required" && (
              <Link
                href={ADVANCED_ECG_MODULE_CHECKOUT_ANCHOR}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface-alt)]"
              >
                What&apos;s included
              </Link>
            )}
          </div>
          {reason === "advanced_ecg_upgrade_required" && (
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {[
                "160+ clinician-reviewed advanced questions",
                "9 clinical tracks: VT, ischemia, pacemakers, tox, ACLS",
                "RN/NP scope — ICU, ER, CCU, telemetry focus",
                "Separate add-on — does not overlap with core ECG",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-[var(--semantic-text-secondary)]">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--semantic-chart-1)]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
