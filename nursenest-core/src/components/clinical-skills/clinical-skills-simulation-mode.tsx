"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ClinicalSkillDefinition } from "@/lib/clinical-skills/clinical-skills-catalog";

type DecisionKey =
  | "assess"
  | "recognize"
  | "intervene"
  | "monitor"
  | "document"
  | "escalate";

const DECISIONS: Array<{
  key: DecisionKey;
  label: string;
  safe: string;
  unsafe: string;
}> = [
  {
    key: "assess",
    label: "Assess",
    safe: "Assess baseline status and compare new findings before acting.",
    unsafe: "Start the task before checking whether the patient is stable.",
  },
  {
    key: "recognize",
    label: "Recognize",
    safe: "Identify the safety risk and name what could deteriorate.",
    unsafe: "Treat the finding as routine because the skill is common.",
  },
  {
    key: "intervene",
    label: "Intervene",
    safe: "Take the scope-appropriate action that protects airway, circulation, infection control, or medication safety.",
    unsafe: "Continue the procedure despite an unresolved safety concern.",
  },
  {
    key: "monitor",
    label: "Monitor",
    safe: "Reassess response and watch for worsening cues after the intervention.",
    unsafe: "Leave the room immediately after the technical step.",
  },
  {
    key: "document",
    label: "Document",
    safe: "Chart assessment, action, patient response, teaching, and notification.",
    unsafe: "Chart only that the task was completed.",
  },
  {
    key: "escalate",
    label: "Escalate",
    safe: "Notify the right clinician when findings exceed routine care or require orders.",
    unsafe: "Wait until the next scheduled round to report deterioration.",
  },
];

export function ClinicalSkillsSimulationMode({
  skill,
}: {
  skill: ClinicalSkillDefinition;
}) {
  const [safeDecisions, setSafeDecisions] = useState<DecisionKey[]>([]);
  const unsafeCount = DECISIONS.length - safeDecisions.length;
  const outcome = useMemo(() => {
    if (safeDecisions.length === DECISIONS.length)
      return "Patient stabilized and competency demonstrated.";
    if (safeDecisions.length >= 4)
      return "Patient improving, but unresolved risks remain.";
    return "Patient status remains unsafe. Reassess the omitted steps.";
  }, [safeDecisions.length]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-alt)] p-4">
        <p className="text-sm font-bold text-[var(--semantic-text-primary)]">
          Scenario: status changes during {skill.title}
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-secondary)]">
          The patient develops an unexpected finding tied to{" "}
          {skill.simulationFocus ?? skill.summary}. Select the safe decision in
          each phase to stabilize, document, and escalate appropriately.
        </p>
      </div>

      <div className="grid gap-3">
        {DECISIONS.map((decision) => {
          const selected = safeDecisions.includes(decision.key);
          return (
            <div
              key={decision.key}
              className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3"
            >
              <p className="text-sm font-bold text-[var(--semantic-text-primary)]">
                {decision.label}
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setSafeDecisions((prev) =>
                      prev.includes(decision.key)
                        ? prev
                        : [...prev, decision.key],
                    )
                  }
                  className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_07%,var(--semantic-surface))] p-3 text-left text-xs leading-5 text-[var(--semantic-text-secondary)]"
                >
                  {decision.safe}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSafeDecisions((prev) =>
                      prev.filter((item) => item !== decision.key),
                    )
                  }
                  className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_07%,var(--semantic-surface))] p-3 text-left text-xs leading-5 text-[var(--semantic-text-secondary)]"
                >
                  {decision.unsafe}
                </button>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold">
                {selected ? (
                  <>
                    <CheckCircle2
                      className="h-3.5 w-3.5 text-[var(--semantic-success)]"
                      aria-hidden
                    />
                    <span className="text-[var(--semantic-success)]">
                      Safe decision recorded
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle
                      className="h-3.5 w-3.5 text-[var(--semantic-warning)]"
                      aria-hidden
                    />
                    <span className="text-[var(--semantic-warning)]">
                      Omission or safety error still present
                    </span>
                  </>
                )}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-alt)] p-4">
        <p className="text-sm font-bold text-[var(--semantic-text-primary)]">
          Simulation outcome
        </p>
        <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
          {outcome}
        </p>
        <p className="mt-2 text-xs font-semibold text-[var(--semantic-text-muted)]">
          Omission / safety errors remaining: {unsafeCount}
        </p>
      </div>
    </div>
  );
}
