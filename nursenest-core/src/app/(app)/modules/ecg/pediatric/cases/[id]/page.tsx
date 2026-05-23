"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Heart,
  Shield,
  XCircle,
} from "lucide-react";
import {
  PEDIATRIC_CASE_SIMULATIONS,
  type PediatricCaseSimulation,
  type ClinicalDecisionPoint,
} from "@/lib/ecg-module/ecg-pediatric-case-simulations";
import { cn } from "@/lib/utils";

// ─── Decision point interaction component ────────────────────────────────────

function DecisionPointCard({
  dp,
  index,
  onAnswered,
}: {
  dp: ClinicalDecisionPoint;
  index: number;
  onAnswered: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const submitted = selected !== null;

  return (
    <div
      className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] overflow-hidden"
      data-testid={`decision-point-${index}`}
    >
      {/* Decision prompt */}
      <div className="border-b border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_04%,var(--semantic-surface))] px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-brand)]">
          Decision Point {index + 1}
        </p>
        <p className="mt-1.5 text-sm font-semibold leading-snug text-[var(--semantic-text-primary)]">
          {dp.scenario}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2.5 p-5">
        {dp.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = opt.isCorrect;
          const showResult = submitted;

          let containerCls = "rounded-xl border px-4 py-3 text-left text-sm transition-all";
          let icon: React.ReactNode = null;

          if (!showResult) {
            containerCls += isSelected
              ? " border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))]"
              : " border-[var(--semantic-border-soft)] hover:border-[var(--semantic-brand)] cursor-pointer";
          } else if (isSelected && isCorrect) {
            containerCls += " border-[var(--semantic-success)] bg-[color-mix(in_srgb,var(--semantic-success)_06%,var(--semantic-surface))]";
            icon = <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />;
          } else if (isSelected && !isCorrect) {
            containerCls += " border-[var(--semantic-danger)] bg-[color-mix(in_srgb,var(--semantic-danger)_06%,var(--semantic-surface))]";
            icon = <XCircle className="h-4 w-4 shrink-0 text-[var(--semantic-danger)]" aria-hidden />;
          } else if (!isSelected && isCorrect && showResult) {
            containerCls += " border-[var(--semantic-success)] opacity-70";
            icon = <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />;
          } else {
            containerCls += " border-[var(--semantic-border-soft)] opacity-40";
          }

          return (
            <button
              key={i}
              type="button"
              disabled={submitted}
              className={cn("w-full", containerCls)}
              onClick={() => {
                setSelected(i);
                onAnswered(opt.isCorrect);
              }}
              aria-pressed={isSelected}
            >
              <div className="flex items-start gap-3">
                {icon}
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-sm font-medium text-[var(--semantic-text-primary)]">
                    {opt.action}
                  </p>
                  {showResult && isSelected && (
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                      {opt.consequence}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Teaching point (revealed after answer) */}
      {submitted && (
        <div className="border-t border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_04%,var(--semantic-surface))] px-5 py-4">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-info)]">
            <Shield className="h-3.5 w-3.5" aria-hidden />
            Teaching point
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
            {dp.teachingPoint}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Vitals display ──────────────────────────────────────────────────────────

function VitalsBar({ c }: { c: PediatricCaseSimulation }) {
  const vitals = [
    { label: "HR", value: `${c.presentingVitals.heartRate} bpm` },
    { label: "RR", value: `${c.presentingVitals.respRate}/min` },
    { label: "SpO₂", value: `${c.presentingVitals.spO2}%`, danger: c.presentingVitals.spO2 < 92 },
    ...(c.presentingVitals.bpSystolic
      ? [{ label: "BP", value: `${c.presentingVitals.bpSystolic}/${c.presentingVitals.bpDiastolic} mmHg` }]
      : []),
    ...(c.presentingVitals.capRefillSeconds !== undefined
      ? [{ label: "Cap refill", value: `${c.presentingVitals.capRefillSeconds}s`, danger: c.presentingVitals.capRefillSeconds > 2 }]
      : []),
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {vitals.map((v) => (
        <div
          key={v.label}
          className={cn(
            "rounded-xl border px-3 py-2 text-center",
            (v as { danger?: boolean }).danger
              ? "border-[color-mix(in_srgb,var(--semantic-danger)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_06%,var(--semantic-surface))]"
              : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]",
          )}
        >
          <p className="text-[9px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            {v.label}
          </p>
          <p className={cn("text-sm font-bold", (v as { danger?: boolean }).danger ? "text-[var(--semantic-danger)]" : "text-[var(--semantic-text-primary)]")}>
            {v.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Case page ───────────────────────────────────────────────────────────────

export default function PediatricCaseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const caseData = PEDIATRIC_CASE_SIMULATIONS.find((c) => c.id === params.id);
  if (!caseData) notFound();

  const [answeredPoints, setAnsweredPoints] = useState<Record<number, boolean>>({});
  const totalAnswered = Object.keys(answeredPoints).length;
  const allAnswered = totalAnswered === caseData.decisionPoints.length;
  const correctCount = Object.values(answeredPoints).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/modules/ecg/pediatric/cases"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--semantic-text-muted)] hover:text-[var(--semantic-brand)]"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
        PALS Cases
      </Link>

      {/* Header */}
      <header className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 sm:p-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-text-muted)_08%,var(--semantic-surface))] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            {caseData.ageDescription}
          </span>
          <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_08%,var(--semantic-surface))] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-brand)]">
            {caseData.setting.split(" ")[0]}
          </span>
        </div>
        <h1 className="text-xl font-bold text-[var(--semantic-text-primary)] sm:text-2xl">
          {caseData.title}
        </h1>

        {/* Presenting complaint */}
        <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          <span className="font-semibold text-[var(--semantic-text-primary)]">Chief complaint: </span>
          {caseData.chiefComplaint}
        </p>

        {/* Setting */}
        <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">{caseData.setting}</p>

        {/* Vitals */}
        <div className="mt-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            Presenting vitals
          </p>
          <VitalsBar c={caseData} />
        </div>

        {/* Clinical findings */}
        {caseData.presentingFindings.length > 0 && (
          <div className="mt-4">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              Findings
            </p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {caseData.presentingFindings.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-xs text-[var(--semantic-text-secondary)]">
                  <span className="h-1 w-1 rounded-full bg-[var(--semantic-text-muted)]" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hemodynamic findings — pulsus paradoxus framing */}
        {caseData.hemodynamicFindings.length > 0 && (
          <div className="mt-4 space-y-2">
            {caseData.hemodynamicFindings.map((hf) => (
              <div
                key={hf.findingName}
                className={cn(
                  "rounded-xl border px-4 py-3",
                  hf.isNotRhythm
                    ? "border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_05%,var(--semantic-surface))]"
                    : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]",
                )}
                role={hf.isNotRhythm ? "note" : undefined}
                aria-label={hf.isNotRhythm ? `Hemodynamic finding: ${hf.findingName}` : undefined}
              >
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-info)]">
                  {hf.isNotRhythm && (
                    <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden />
                  )}
                  {hf.isNotRhythm
                    ? `Hemodynamic finding — NOT a rhythm: ${hf.findingName}`
                    : hf.findingName}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                  {hf.assessmentDescription}
                </p>
                <p className="mt-1 text-xs font-medium text-[var(--semantic-text-primary)]">
                  {hf.clinicalSignificance}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Monitor rhythm */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-danger)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_05%,var(--semantic-surface))] px-3 py-1.5">
          <Heart className="h-3.5 w-3.5 text-[var(--semantic-danger)]" aria-hidden />
          <span className="text-xs font-semibold text-[var(--semantic-text-primary)]">
            Monitor: <span className="text-[var(--semantic-danger)]">{caseData.monitorRhythm}</span>
          </span>
        </div>
      </header>

      {/* Decision points */}
      <section aria-labelledby="decision-points-heading">
        <h2
          id="decision-points-heading"
          className="mb-4 text-base font-semibold text-[var(--semantic-text-primary)]"
        >
          Clinical Decision Points
        </h2>
        <div className="space-y-5">
          {caseData.decisionPoints.map((dp, i) => (
            <DecisionPointCard
              key={i}
              dp={dp}
              index={i}
              onAnswered={(correct) =>
                setAnsweredPoints((prev) => ({ ...prev, [i]: correct }))
              }
            />
          ))}
        </div>
      </section>

      {/* Case summary — revealed when all decision points answered */}
      {allAnswered && (
        <section
          className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_04%,var(--semantic-surface))] p-5 sm:p-6"
          aria-labelledby="case-summary-heading"
          data-testid="case-summary"
        >
          <h2
            id="case-summary-heading"
            className="mb-3 text-base font-semibold text-[var(--semantic-text-primary)]"
          >
            Case Summary
          </h2>

          <p className="mb-3 text-sm text-[var(--semantic-text-secondary)]">
            <strong className="text-[var(--semantic-text-primary)]">{correctCount}</strong> of{" "}
            <strong className="text-[var(--semantic-text-primary)]">{caseData.decisionPoints.length}</strong> decision points answered correctly.
          </p>

          {/* PALS branch */}
          <div className="mb-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_20%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-4 py-3">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-success)]">
              PALS Algorithm
            </p>
            <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              {caseData.palsBranch}
            </p>
          </div>

          {/* Nursing error traps */}
          <div className="mb-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-warning-contrast)]">
              Common nursing error traps
            </p>
            <ul className="space-y-1.5">
              {caseData.nursingErrorTraps.map((trap) => (
                <li key={trap} className="flex items-start gap-2 text-xs text-[var(--semantic-text-secondary)]">
                  <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--semantic-warning-contrast)]" aria-hidden />
                  {trap}
                </li>
              ))}
            </ul>
          </div>

          {/* Learning objectives */}
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-success)]">
              Learning objectives
            </p>
            <ul className="space-y-1.5">
              {caseData.learningObjectives.map((obj) => (
                <li key={obj} className="flex items-start gap-2 text-xs text-[var(--semantic-text-secondary)]">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Navigation */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/modules/ecg/pediatric/cases"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All cases
        </Link>
        <Link
          href="/modules/ecg/pediatric"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--role-cta)] px-4 py-2.5 text-sm font-semibold text-[var(--role-cta-foreground)] shadow-sm"
        >
          Pediatric ECG curriculum
        </Link>
      </div>
    </div>
  );
}
