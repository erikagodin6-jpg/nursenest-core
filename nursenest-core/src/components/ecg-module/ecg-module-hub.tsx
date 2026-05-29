import Link from "next/link";
import { Activity, ChevronRight, Gauge, Zap, BookOpen, ShieldCheck, Baby } from "lucide-react";
import { EcgTelemetryReadinessBand } from "@/components/ecg-module/ecg-telemetry-readiness-band";
import { EcgTierScopesPanel } from "@/components/ecg-module/ecg-tier-scopes-panel";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { ECG_CURRICULUM } from "@/lib/ecg-module/ecg-curriculum-content";

const HERO_WAVE_HEIGHTS = [18, 42, 28, 55, 35, 62, 40, 48, 33, 58, 44, 52, 30, 46, 38, 50, 36, 44, 32, 56, 41, 47, 29, 53] as const;

function WaveformStrip({ className }: { className?: string }) {
  return (
    <div
      className={`flex h-16 items-end justify-between gap-px overflow-hidden rounded-lg border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_55%,var(--semantic-surface))] px-2 py-2 sm:h-20 ${className ?? ""}`}
      aria-hidden
      role="presentation"
    >
      {HERO_WAVE_HEIGHTS.map((h, i) => {
        const hue = i % 5;
        const chartVar =
          hue === 0 ? "var(--semantic-chart-1)"
          : hue === 1 ? "var(--semantic-chart-2)"
          : hue === 2 ? "var(--semantic-chart-3)"
          : hue === 3 ? "var(--semantic-chart-4)"
          : "var(--semantic-chart-5)";
        return (
          <span
            key={i}
            className="w-full max-w-[6px] min-w-[2px] rounded-full opacity-90"
            style={{ height: `${h}%`, background: `color-mix(in srgb, ${chartVar} 82%, var(--semantic-border-soft))` }}
          />
        );
      })}
    </div>
  );
}

const LEVEL_ACCENTS = {
  1: {
    eyebrowColor: "text-[color-mix(in_srgb,var(--semantic-chart-4)_85%,var(--semantic-text-primary))]",
    border: "border-[color-mix(in_srgb,var(--semantic-chart-4)_18%,var(--semantic-border-soft))]",
    bg: "bg-[color-mix(in_srgb,var(--semantic-chart-4)_04%,var(--semantic-surface))]",
    chipBorder: "border-[color-mix(in_srgb,var(--semantic-chart-4)_28%,var(--semantic-border-soft))]",
    chipBg: "bg-[color-mix(in_srgb,var(--semantic-chart-4)_06%,var(--semantic-surface))]",
    icon: Gauge,
    iconColor: "text-[color-mix(in_srgb,var(--semantic-chart-4)_88%,var(--semantic-text-primary))]",
  },
  2: {
    eyebrowColor: "text-[color-mix(in_srgb,var(--semantic-info)_85%,var(--semantic-text-primary))]",
    border: "border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))]",
    bg: "bg-[color-mix(in_srgb,var(--semantic-info)_04%,var(--semantic-surface))]",
    chipBorder: "border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))]",
    chipBg: "bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))]",
    icon: BookOpen,
    iconColor: "text-[color-mix(in_srgb,var(--semantic-info)_88%,var(--semantic-text-primary))]",
  },
  3: {
    eyebrowColor: "text-[color-mix(in_srgb,var(--semantic-warning)_85%,var(--semantic-text-primary))]",
    border: "border-[color-mix(in_srgb,var(--semantic-warning)_18%,var(--semantic-border-soft))]",
    bg: "bg-[color-mix(in_srgb,var(--semantic-warning)_04%,var(--semantic-surface))]",
    chipBorder: "border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))]",
    chipBg: "bg-[color-mix(in_srgb,var(--semantic-warning)_06%,var(--semantic-surface))]",
    icon: Zap,
    iconColor: "text-[color-mix(in_srgb,var(--semantic-warning)_88%,var(--semantic-text-primary))]",
  },
} as const;

export function EcgModuleHub({ t }: { t: LearnerMarketingT }) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-12 sm:px-6 lg:px-8">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_38%,var(--semantic-surface))] p-7 shadow-[var(--semantic-shadow-soft)] sm:p-10"
        aria-labelledby="ecg-hub-hero-heading"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_20%_20%,var(--semantic-info)_0px,transparent_55%),radial-gradient(circle_at_80%_0%,var(--semantic-chart-3)_0px,transparent_50%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
          <div className="min-w-0 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info-soft)_55%,var(--semantic-surface))] text-[var(--semantic-info)]">
                <Activity className="h-5 w-5" aria-hidden />
              </span>
              <p className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-info)_90%,var(--semantic-text-primary))]">
                ECG Learning System
              </p>
            </div>
            <h1 id="ecg-hub-hero-heading" className="text-3xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-4xl">
              {t("learner.studyHome.quickLaunch.ecgTitle")}
            </h1>
            <p className="max-w-prose text-base leading-relaxed text-[var(--semantic-text-secondary)]">
              Master telemetry through interactive ECG simulation — animated rhythm strips, pause-and-measure tools, adaptive interpretation, and bedside clinical reasoning built for real-world cardiac care.
            </p>
            <div className="max-w-md">
              <EcgTelemetryReadinessBand />
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/modules/ecg/basic/lessons"
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--role-cta)] px-5 text-sm font-semibold text-[var(--role-cta-foreground)] shadow-[0_2px_10px_var(--role-cta-shadow)]"
              >
                Start Level 1 — Foundations
              </Link>
              <Link
                href="/modules/ecg-advanced"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] px-5 text-sm font-semibold text-[color-mix(in_srgb,var(--semantic-warning)_92%,var(--semantic-text-primary))] shadow-[var(--semantic-shadow-soft)]"
              >
                Upgrade for Advanced ECG
              </Link>
            </div>
            {/* Feature chips */}
            <ul className="flex flex-wrap gap-2 pt-3" aria-label="Module features">
              {[
                "Animated telemetry strips",
                "Pause-and-measure intervals",
                "Guided + independent modes",
                "Learn · retrieve · discriminate · transfer",
                "Tier-scoped clinical pathways",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_05%,var(--semantic-surface))] px-3 py-1 text-[11px] font-medium text-[var(--semantic-text-primary)]"
                >
                  <ShieldCheck className="h-3 w-3 shrink-0 text-[var(--semantic-info)]" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              ECG strip preview
            </p>
            <WaveformStrip />
            <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              {t("learner.studyHome.quickLaunch.ecgDesc")}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="ecg-tier-pathways-heading" className="space-y-4">
        <div>
          <h2 id="ecg-tier-pathways-heading" className="text-xl font-semibold text-[var(--semantic-text-primary)]">
            Tier-scoped telemetry pathways
          </h2>
          <p className="mt-1 max-w-prose text-sm text-[var(--semantic-text-secondary)]">
            RN acute telemetry, RPN rhythm safety, and NP advanced cardiac reasoning — each with distinct report-card signals and remediation focus.
          </p>
        </div>
        <EcgTierScopesPanel />
      </section>

      {/* ── Curriculum Roadmap ────────────────────────────────────────────── */}
      <section aria-labelledby="ecg-curriculum-heading">
        <div className="mb-9">
          <h2 id="ecg-curriculum-heading" className="text-xl font-semibold text-[var(--semantic-text-primary)] sm:text-2xl">
            Curriculum Roadmap
          </h2>
          <p className="mt-1 max-w-prose text-sm text-[var(--semantic-text-secondary)]">
            Three progressive levels. Each level builds on the previous one. Complete Level 1 before moving to core rhythms, and core rhythms before advanced critical care interpretation.
          </p>
        </div>

        <div className="space-y-8">
          {ECG_CURRICULUM.map((currLevel) => {
            const accent = LEVEL_ACCENTS[currLevel.level];
            const Icon = accent.icon;

            return (
              <div
                key={currLevel.id}
                className={`rounded-2xl border ${accent.border} ${accent.bg} p-6 shadow-[var(--semantic-shadow-soft)] sm:p-9`}
                data-testid={`ecg-curriculum-level-${currLevel.level}`}
              >
                {/* Level header */}
                <div className="flex items-start justify-between gap-3 border-b border-[var(--semantic-border-soft)] pb-6">
                  <div className="min-w-0">
                    <p className={`text-[11px] font-bold uppercase tracking-wide ${accent.eyebrowColor}`}>
                      {currLevel.eyebrow}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">
                      {currLevel.title}
                    </h3>
                    <p className="mt-1 max-w-prose text-sm text-[var(--semantic-text-secondary)]">
                      {currLevel.description}
                    </p>
                    {currLevel.prerequisite ? (
                      <p className="mt-1.5 text-[11px] font-semibold text-[var(--semantic-text-muted)]">
                        Prerequisite: {currLevel.prerequisite}
                      </p>
                    ) : null}
                  </div>
                  <Icon className={`mt-1 h-5 w-5 shrink-0 ${accent.iconColor}`} aria-hidden />
                </div>

                {/* Topics covered */}
                <div className="mt-7">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                    Topics covered
                  </p>
                  <ul className="flex flex-wrap gap-2" aria-label={`Level ${currLevel.level} topics`}>
                    {currLevel.units.map((unit) => (
                      <li
                        key={unit.id}
                        className={`rounded-full border ${accent.chipBorder} ${accent.chipBg} px-2.5 py-1 text-[11px] font-medium text-[var(--semantic-text-primary)]`}
                      >
                        {unit.title}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href={currLevel.startHref}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[var(--role-cta)] px-5 text-sm font-semibold text-[var(--role-cta-foreground)] shadow-[0_2px_8px_var(--role-cta-shadow)]"
                    data-testid={`ecg-level-${currLevel.level}-start-btn`}
                  >
                    Start Level {currLevel.level}
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </Link>
                  {currLevel.level === 1 ? (
                    <Link
                      href="/modules/ecg/basic/quizzes"
                      className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                    >
                      Level 1 quizzes
                    </Link>
                  ) : currLevel.level === 2 ? (
                    <Link
                      href="/modules/ecg/basic/quizzes"
                      className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                    >
                      Practice quizzes
                    </Link>
                  ) : (
                    <Link
                      href="/modules/ecg/advanced/video-drills"
                      className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                    >
                      Advanced drills
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Pediatric ECG Lane ───────────────────────────────────────────── */}
      <section
        className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_04%,var(--semantic-surface))] p-7 sm:p-10"
        aria-labelledby="ecg-pediatric-heading"
        data-testid="ecg-pediatric-lane-card"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-5">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_25%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_12%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-3)_90%,var(--semantic-text-primary))]">
                <Baby className="h-4 w-4" aria-hidden />
              </span>
              <p className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-chart-3)_88%,var(--semantic-text-primary))]">
                Pediatric ECG
              </p>
            </div>
            <h2
              id="ecg-pediatric-heading"
              className="text-xl font-semibold text-[var(--semantic-text-primary)]"
            >
              Pediatric Rhythm Recognition & PALS Scenarios
            </h2>
            <p className="max-w-prose text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              Age-specific rate ranges, PALS algorithm integration, and hemodynamic
              deterioration case simulations — including RSA as a normal variant and
              why it must not be over-escalated.
            </p>
            <ul
              className="flex flex-wrap gap-2"
              aria-label="Pediatric ECG topics covered"
            >
              {[
                "Respiratory sinus arrhythmia",
                "Pediatric SVT vs sinus tach",
                "Hypoxic bradycardia",
                "PALS arrest rhythms",
                "Post-op JET recognition",
                "Long QT / torsades risk",
              ].map((topic) => (
                <li
                  key={topic}
                  className="rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-3)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_06%,var(--semantic-surface))] px-2.5 py-1 text-[11px] font-medium text-[var(--semantic-text-primary)]"
                >
                  {topic}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href="/modules/ecg/pediatric"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--semantic-chart-3)_85%,var(--semantic-text-primary))] px-5 text-sm font-semibold text-white shadow-sm"
                data-testid="ecg-pediatric-start-btn"
              >
                Start Pediatric ECG
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/modules/ecg/pediatric/cases"
                className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
              >
                PALS case simulations
              </Link>
            </div>
          </div>
          <Baby className="mt-1 hidden h-6 w-6 shrink-0 text-[color-mix(in_srgb,var(--semantic-chart-3)_60%,var(--semantic-text-muted))] lg:block" aria-hidden />
        </div>
      </section>

      {/* ── How This Module Works ────────────────────────────────────────── */}
      <section
        className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_04%,var(--semantic-surface))] p-7 sm:p-10"
        aria-labelledby="ecg-how-heading"
      >
        <h2 id="ecg-how-heading" className="text-lg font-semibold text-[var(--semantic-text-primary)]">
          How this module teaches ECG
        </h2>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "1",
              title: "See the strip",
              body: "View the ECG or live strip. Explore it before any question appears.",
            },
            {
              step: "2",
              title: "Analyze with the 7-step method",
              body: "Rate → Rhythm → P waves → PR → QRS → ST/T → Diagnosis. Complete each step before seeing the options.",
            },
            {
              step: "3",
              title: "Select and submit",
              body: "Choose your answer, then click Submit. Answers are never revealed before submission.",
            },
            {
              step: "4",
              title: "Learn the mechanism",
              body: "After submitting, expand the deep lesson — mechanism, conduction path, hemodynamics, NCLEX traps, nursing priorities.",
            },
          ].map((card) => (
            <div
              key={card.step}
              className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_16%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-6"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-success)_15%,var(--semantic-surface))] text-sm font-bold text-[var(--semantic-success)]">
                {card.step}
              </span>
              <p className="mt-2 text-sm font-semibold text-[var(--semantic-text-primary)]">{card.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{card.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
