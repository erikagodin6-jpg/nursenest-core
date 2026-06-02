import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, CheckCircle2, Heart, Zap } from "lucide-react";
import {
  PEDIATRIC_CASE_SIMULATIONS,
  type PediatricCaseSimulation,
} from "@/lib/ecg-module/ecg-pediatric-case-simulations";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pediatric PALS Case Simulations | NurseNest ECG",
  description:
    "PALS-oriented pediatric deterioration case simulations: SVT, hypoxic bradycardia, JET, long QT, hyperkalemia, and asthma with pulsus paradoxus.",
  robots: { index: false, follow: true },
};

const PALS_BRANCH_COLOR: Record<string, string> = {
  "Tachycardia": "text-[var(--semantic-danger)]",
  "Bradycardia": "text-[var(--semantic-warning-contrast)]",
  "Arrest": "text-[var(--semantic-danger)]",
  "Respiratory": "text-[var(--semantic-info)]",
};

function caseAccentClass(c: PediatricCaseSimulation): string {
  const palsBranch = c.palsBranch.toLowerCase();
  if (palsBranch.includes("arrest")) return "border-[color-mix(in_srgb,var(--semantic-danger)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_03%,var(--semantic-surface))]";
  if (palsBranch.includes("tachycardia")) return "border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_03%,var(--semantic-surface))]";
  if (palsBranch.includes("bradycardia") || palsBranch.includes("respiratory")) return "border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_03%,var(--semantic-surface))]";
  return "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]";
}

export default function PediatricCasesPage() {
  return (
    <div className="space-y-8">
      {/* Back */}
      <Link
        href="/modules/ecg/pediatric"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--semantic-text-muted)] hover:text-[var(--semantic-brand)]"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
        Pediatric ECG
      </Link>

      {/* Header */}
      <header>
        <div className="mb-2 flex items-center gap-2">
          <Zap className="h-5 w-5 text-[var(--semantic-warning-contrast)]" aria-hidden />
          <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] px-3 py-0.5 text-xs font-semibold text-[var(--semantic-warning-contrast)]">
            PALS Case Simulations
          </span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)] sm:text-3xl">
          Pediatric Deterioration Scenarios
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          Structured clinical cases with decision points, nursing error traps, and PALS algorithm
          pathways. Each case teaches clinical reasoning, not just rhythm identification.
        </p>

        {/* Pulsus paradoxus governance notice */}
        <div
          className="mt-4 flex items-start gap-2.5 rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] px-4 py-3"
          role="note"
          aria-label="Pulsus paradoxus classification"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-info)]" aria-hidden />
          <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
            <span className="font-semibold text-[var(--semantic-text-primary)]">
              Hemodynamic finding — not an ECG rhythm:{" "}
            </span>
            Pulsus paradoxus appears in these cases as a blood pressure assessment finding
            (inspiratory SBP drop &gt; 10 mmHg), not as an ECG waveform or rhythm tag.
            It is assessed by BP cuff — not by reading the cardiac monitor.
          </p>
        </div>
      </header>

      {/* Case grid */}
      <section aria-label="PALS case simulations">
        <div className="grid gap-5 lg:grid-cols-2">
          {PEDIATRIC_CASE_SIMULATIONS.map((c, idx) => (
            <article
              key={c.id}
              className={`rounded-2xl border p-5 shadow-[var(--semantic-shadow-soft)] ${caseAccentClass(c)}`}
              aria-labelledby={`case-title-${c.id}`}
              data-testid={`pediatric-case-${c.id}`}
            >
              {/* Case number + title */}
              <div className="mb-3 flex items-start gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-sm font-bold text-[var(--semantic-text-muted)]"
                  aria-hidden
                >
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                    {c.ageDescription}
                  </p>
                  <h3
                    id={`case-title-${c.id}`}
                    className="text-sm font-semibold text-[var(--semantic-text-primary)] leading-snug"
                  >
                    {c.title}
                  </h3>
                </div>
              </div>

              {/* Scenario snippet */}
              <p className="mb-3 text-xs leading-relaxed text-[var(--semantic-text-secondary)] line-clamp-3">
                {c.chiefComplaint}
              </p>

              {/* Key stats */}
              <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--semantic-text-muted)]">
                <span>
                  <Heart className="mb-0.5 inline h-3 w-3" aria-hidden /> HR {c.presentingVitals.heartRate} bpm
                </span>
                <span>SpO₂ {c.presentingVitals.spO2}%</span>
                <span>RR {c.presentingVitals.respRate}/min</span>
                <span>{c.decisionPoints.length} decision points</span>
              </div>

              {/* Hemodynamic findings (including pulsus paradoxus) */}
              {c.hemodynamicFindings.some((f) => f.isNotRhythm) && (
                <div className="mb-3 rounded-lg bg-[color-mix(in_srgb,var(--semantic-info)_08%,var(--semantic-surface))] px-3 py-2">
                  <p className="text-[10px] font-semibold text-[var(--semantic-info)]">
                    Hemodynamic finding — NOT a rhythm:
                  </p>
                  {c.hemodynamicFindings
                    .filter((f) => f.isNotRhythm)
                    .map((f) => (
                      <p key={f.findingName} className="text-[11px] text-[var(--semantic-text-secondary)]">
                        {f.findingName}
                      </p>
                    ))}
                </div>
              )}

              {/* Learning objectives preview */}
              <div className="mb-4">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                  Learning objectives
                </p>
                <ul className="space-y-1">
                  {c.learningObjectives.slice(0, 2).map((o) => (
                    <li key={o} className="flex items-start gap-1.5 text-[11px] text-[var(--semantic-text-secondary)]">
                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                      {o}
                    </li>
                  ))}
                  {c.learningObjectives.length > 2 && (
                    <li className="text-[11px] text-[var(--semantic-text-muted)]">
                      + {c.learningObjectives.length - 2} more
                    </li>
                  )}
                </ul>
              </div>

              {/* PALS branch summary */}
              <p className="mb-4 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-[11px] leading-relaxed text-[var(--semantic-text-secondary)]">
                <span className="font-semibold text-[var(--semantic-text-primary)]">PALS: </span>
                {c.palsBranch}
              </p>

              <Link
                href={`/modules/ecg/pediatric/cases/${c.id}`}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--role-cta)] px-4 py-2.5 text-sm font-semibold text-[var(--role-cta-foreground)] shadow-sm"
                data-testid={`start-case-${c.id}`}
              >
                Work through case
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
