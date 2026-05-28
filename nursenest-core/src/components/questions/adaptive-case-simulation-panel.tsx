"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, ClipboardList, Clock, Stethoscope } from "lucide-react";
import type {
  AdaptiveCaseDecision,
  AdaptiveCaseSimulation,
  AdaptiveCaseVitalFlag,
} from "@/lib/questions/adaptive-case-simulation";

function flagClass(flag: AdaptiveCaseVitalFlag | undefined): string {
  switch (flag) {
    case "critical":
      return "border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))] bg-[var(--semantic-danger-soft)] text-[var(--semantic-danger-contrast)]";
    case "urgent":
      return "border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] text-[var(--semantic-warning-contrast)]";
    case "watch":
      return "border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] text-[var(--semantic-info-contrast)]";
    default:
      return "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-primary)]";
  }
}

function decisionClass(decision: AdaptiveCaseDecision): string {
  switch (decision.priorityLevel) {
    case "optimal":
      return "border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[var(--semantic-success-soft)]";
    case "acceptable":
      return "border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)]";
    case "delayed":
      return "border-[color-mix(in_srgb,var(--semantic-warning)_32%,var(--semantic-border-soft))] bg-[var(--semantic-panel-warm)]";
    case "unsafe":
      return "border-[color-mix(in_srgb,var(--semantic-danger)_32%,var(--semantic-border-soft))] bg-[var(--semantic-danger-soft)]";
  }
}

export function AdaptiveCaseSimulationPanel({ simulation }: { simulation: AdaptiveCaseSimulation }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);
  const visibleStages = simulation.stages.slice(0, stageIndex + 1);
  const activeStage = simulation.stages[stageIndex] ?? simulation.stages[0];
  const selectedDecision = useMemo(
    () => simulation.decisions.find((decision) => decision.id === selectedDecisionId) ?? null,
    [selectedDecisionId, simulation.decisions],
  );

  useEffect(() => {
    setStageIndex(0);
    setSelectedDecisionId(null);
  }, [simulation.id]);

  if (!activeStage) return null;

  return (
    <section
      className="relative z-[1] mt-5 overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_58%,var(--semantic-surface))] shadow-[var(--semantic-shadow-soft)]"
      data-testid="adaptive-case-simulation"
      aria-label="Adaptive evolving case simulation"
    >
      <div className="flex flex-col gap-3 border-b border-[var(--semantic-border-soft)] px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
            <Activity className="h-3.5 w-3.5" aria-hidden />
            Adaptive NGN case
          </p>
          <h3 className="mt-1 text-sm font-semibold text-[var(--semantic-text-primary)]">{simulation.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{simulation.focus}</p>
        </div>
        <div className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1 text-[0.7rem] font-semibold text-[var(--semantic-text-secondary)]">
          Dynamic bedside cues
        </div>
      </div>

      <div className="grid gap-3 p-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="space-y-3">
          <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
              Patient summary
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--semantic-text-primary)]">{simulation.patientSummary}</p>
          </div>

          <div className="space-y-2">
            {visibleStages.map((stage, index) => (
              <button
                key={stage.id}
                type="button"
                onClick={() => {
                  setStageIndex(index);
                  setSelectedDecisionId(null);
                }}
                className={`flex w-full items-start gap-3 rounded-xl border px-3 py-2 text-left text-sm transition ${
                  index === stageIndex
                    ? "border-[color-mix(in_srgb,var(--semantic-brand)_36%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))]"
                    : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] hover:bg-[var(--semantic-panel-muted)]"
                }`}
              >
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-brand)]" aria-hidden />
                <span className="min-w-0">
                  <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--semantic-text-muted)]">
                    {stage.timeLabel}
                  </span>
                  <span className="block font-semibold text-[var(--semantic-text-primary)]">{stage.title}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3">
            <p className="flex items-center gap-2 text-xs font-semibold text-[var(--semantic-text-primary)]">
              <Stethoscope className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
              {activeStage.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{activeStage.narrative}</p>
            {activeStage.nursingNote ? (
              <p className="mt-2 rounded-lg bg-[var(--semantic-panel-muted)] px-3 py-2 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                <strong className="text-[var(--semantic-text-primary)]">Nursing note:</strong> {activeStage.nursingNote}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {activeStage.vitals.map((vital) => (
              <div key={`${activeStage.id}-${vital.label}`} className={`rounded-xl border px-3 py-2 ${flagClass(vital.flag)}`}>
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] opacity-75">{vital.label}</p>
                <p className="mt-1 text-sm font-bold">
                  {vital.value}
                  {vital.unit ? <span className="ml-1 text-xs font-semibold opacity-75">{vital.unit}</span> : null}
                </p>
              </div>
            ))}
          </div>

          {activeStage.providerOrders?.length ? (
            <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-[var(--semantic-text-primary)]">
                <ClipboardList className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
                New provider orders / anticipated next steps
              </p>
              <ul className="mt-2 space-y-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                {activeStage.providerOrders.map((order) => (
                  <li key={order} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-brand)]" aria-hidden />
                    <span>{order}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3">
            <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">Choose a bedside response</p>
            <div className="mt-2 grid gap-2">
              {simulation.decisions.map((decision) => {
                const selected = decision.id === selectedDecisionId;
                return (
                  <button
                    key={decision.id}
                    type="button"
                    onClick={() => setSelectedDecisionId(decision.id)}
                    className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold leading-relaxed transition ${
                      selected ? decisionClass(decision) : "border-[var(--semantic-border-soft)] hover:bg-[var(--semantic-panel-muted)]"
                    }`}
                  >
                    {decision.label}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDecision ? (
            <div className={`rounded-xl border p-3 ${decisionClass(selectedDecision)}`} role="status">
              <p className="flex items-center gap-2 text-sm font-semibold text-[var(--semantic-text-primary)]">
                {selectedDecision.priorityLevel === "optimal" ? (
                  <CheckCircle2 className="h-4 w-4 text-[var(--semantic-success)]" aria-hidden />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-[var(--semantic-warning)]" aria-hidden />
                )}
                {selectedDecision.responseTitle}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{selectedDecision.response}</p>
              {selectedDecision.followUpVitals?.length ? (
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {selectedDecision.followUpVitals.map((vital) => (
                    <div key={`${selectedDecision.id}-${vital.label}`} className={`rounded-lg border px-2 py-1.5 ${flagClass(vital.flag)}`}>
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] opacity-75">{vital.label}</p>
                      <p className="text-xs font-bold">
                        {vital.value}
                        {vital.unit ? <span className="ml-1 opacity-75">{vital.unit}</span> : null}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
              {stageIndex < simulation.stages.length - 1 ? (
                <button
                  type="button"
                  className="mt-3 inline-flex rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
                  onClick={() => {
                    setStageIndex((index) => Math.min(index + 1, simulation.stages.length - 1));
                    setSelectedDecisionId(null);
                  }}
                >
                  Reveal next clinical update
                </button>
              ) : null}
            </div>
          ) : null}

          <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_22%,var(--semantic-border-soft))] bg-[var(--semantic-success-soft)] px-3 py-2">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--semantic-success-contrast)]">
              Transferable thinking
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{simulation.teachingPoint}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
