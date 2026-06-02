"use client";

import { CheckCircle2, Clock, TrendingDown, TrendingUp } from "lucide-react";
import type { ClinicalScenarioPerformanceReport } from "@/lib/clinical-scenarios/clinical-scenario-performance-report";
import { cn } from "@/lib/utils";

export function ClinicalScenarioPerformanceReportCard({ report }: { report: ClinicalScenarioPerformanceReport }) {
  return (
    <section className="nn-clinical-scenarios-report" data-testid="clinical-scenario-performance-report">
      <header className="nn-clinical-scenarios-report__head">
        <p className="nn-clinical-scenarios-report__eyebrow">Performance report</p>
        <h3 className="text-lg font-semibold text-[var(--semantic-text-primary)]">{report.patientOutcomeLabel}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{report.headline}</p>
        <p className="mt-2 text-sm capitalize text-[var(--semantic-text-primary)]">
          Outcome classification: <span className="font-semibold">{report.outcome}</span>
        </p>
      </header>

      <div className="nn-clinical-scenarios-report__grid">
        <div className="nn-clinical-scenarios-report__panel nn-clinical-scenarios-report__panel--positive">
          <p className="flex items-center gap-1 text-xs font-semibold text-[var(--semantic-success)]">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden />
            {report.strengths.title}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--semantic-text-secondary)]">
            {report.strengths.items.map((item) => (
              <li key={item} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="nn-clinical-scenarios-report__panel nn-clinical-scenarios-report__panel--warning">
          <p className="flex items-center gap-1 text-xs font-semibold text-[var(--semantic-warning)]">
            <TrendingDown className="h-3.5 w-3.5" aria-hidden />
            {report.needsImprovement.title}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--semantic-text-secondary)]">
            {report.needsImprovement.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {report.timeline.length > 0 ? (
        <div className="nn-clinical-scenarios-report__timeline">
          <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            Decision timeline replay
          </p>
          <ol className="mt-3 space-y-2">
            {report.timeline.map((step, i) => (
              <li
                key={`${step.stageOrder}-${i}`}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm",
                  step.isCorrect
                    ? "border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_8%,var(--semantic-surface))]"
                    : "border-[color-mix(in_srgb,var(--semantic-danger)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_6%,var(--semantic-surface))]",
                )}
              >
                <span className="text-xs font-semibold text-[var(--semantic-text-secondary)]">Stage {step.stageOrder + 1}</span>
                <p className="font-medium text-[var(--semantic-text-primary)]">{step.label}</p>
                <p className="text-xs text-[var(--semantic-text-secondary)]">Trajectory: {step.trajectory}</p>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {report.escalationNotes.length > 0 ? (
        <div className="mt-4 rounded-lg border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_20%,var(--semantic-surface))] p-3">
          <p className="text-xs font-semibold text-[var(--semantic-info)]">Escalation & timing</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--semantic-text-secondary)]">
            {report.escalationNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-4 text-sm text-[var(--semantic-text-secondary)]">{report.summary}</p>
    </section>
  );
}
