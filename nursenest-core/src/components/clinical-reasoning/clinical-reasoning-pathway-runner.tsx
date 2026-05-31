"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AlertTriangle, Brain, CheckCircle2, ChevronRight, GitBranch, Stethoscope } from "lucide-react";
import { LearnerSurfaceCard } from "@/components/ui/learner-surface-card";
import {
  NCJMM_STEPS,
  PROFESSION_TRACKS,
  THINKING_ERROR_LABELS,
  scoreClinicalReasoningAttempt,
  type ClinicalReasoningPathway,
  type ClinicalReasoningProfession,
  type ClinicalReasoningStepKey,
} from "@/lib/clinical-reasoning/clinical-reasoning-pathways-engine";

export function ClinicalReasoningPathwayRunner({
  pathways,
}: {
  pathways: ClinicalReasoningPathway[];
}) {
  const [pathwayId, setPathwayId] = useState(pathways[0]?.id ?? "");
  const [profession, setProfession] = useState<ClinicalReasoningProfession>("rn");
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selections, setSelections] = useState<Partial<Record<ClinicalReasoningStepKey, string>>>({});

  const pathway = pathways.find((item) => item.id === pathwayId) ?? pathways[0];
  const activeStep = pathway.steps[activeStepIndex];
  const selectedId = selections[activeStep.key];
  const selectedOption = activeStep.options.find((option) => option.id === selectedId) ?? null;
  const score = useMemo(() => scoreClinicalReasoningAttempt(pathway, { pathwayId: pathway.id, selections }), [pathway, selections]);
  const availableProfessions = pathway.professions;

  function choose(step: ClinicalReasoningStepKey, optionId: string) {
    setSelections((current) => ({ ...current, [step]: optionId }));
  }

  return (
    <div className="space-y-6" data-nn-clinical-reasoning-engine="">
      <LearnerSurfaceCard className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--semantic-brand)]">Clinical Reasoning Pathways Engine</p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--theme-heading-text)]">{pathway.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--theme-muted-text)]">{pathway.summary}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:w-[28rem]">
            <label className="space-y-1 text-sm">
              <span className="font-semibold text-[var(--theme-heading-text)]">Pathway</span>
              <select
                value={pathwayId}
                onChange={(event) => {
                  setPathwayId(event.target.value);
                  setSelections({});
                  setActiveStepIndex(0);
                }}
                className="min-h-10 w-full rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3"
              >
                {pathways.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-semibold text-[var(--theme-heading-text)]">Profession Track</span>
              <select
                value={profession}
                onChange={(event) => setProfession(event.target.value as ClinicalReasoningProfession)}
                className="min-h-10 w-full rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3"
              >
                {availableProfessions.map((key) => (
                  <option key={key} value={key}>
                    {PROFESSION_TRACKS[key].label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </LearnerSurfaceCard>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <LearnerSurfaceCard className="p-5 sm:p-6">
            <div className="flex flex-wrap gap-2">
              {NCJMM_STEPS.map((step, index) => {
                const active = index === activeStepIndex;
                const done = Boolean(selections[step.key]);
                return (
                  <button
                    key={step.key}
                    type="button"
                    onClick={() => setActiveStepIndex(index)}
                    className={`min-h-10 rounded-full border px-3 text-xs font-bold transition ${
                      active
                        ? "border-[var(--semantic-brand)] bg-[var(--semantic-brand)] text-[var(--semantic-on-brand)]"
                        : done
                          ? "border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] text-[var(--semantic-success)]"
                          : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--theme-muted-text)]"
                    }`}
                  >
                    {step.label}
                  </button>
                );
              })}
            </div>
          </LearnerSurfaceCard>

          <LearnerSurfaceCard className="p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-brand)]">
                <Brain className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--semantic-brand)]">{activeStep.ncjmmLabel}</p>
                <h2 className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">{activeStep.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--theme-body-text)]">{activeStep.prompt}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {activeStep.options.map((option) => {
                const selected = selectedId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => choose(activeStep.key, option.id)}
                    className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[var(--semantic-shadow-soft)] ${
                      selected
                        ? "border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_9%,var(--semantic-surface))]"
                        : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]"
                    }`}
                  >
                    <span className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                          selected ? "border-[var(--semantic-brand)] bg-[var(--semantic-brand)] text-[var(--semantic-on-brand)]" : "border-[var(--semantic-border-soft)]"
                        }`}
                      >
                        {selected ? <CheckCircle2 className="h-4 w-4" aria-hidden /> : null}
                      </span>
                      <span className="font-semibold text-[var(--theme-heading-text)]">{option.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedOption ? (
              <div className="mt-5 rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_7%,var(--semantic-surface))] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[var(--semantic-surface)] px-3 py-1 text-xs font-bold uppercase text-[var(--semantic-brand)]">
                    {selectedOption.quality}
                  </span>
                  {selectedOption.thinkingError ? (
                    <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-warning)_12%,var(--semantic-surface))] px-3 py-1 text-xs font-bold text-[var(--semantic-warning)]">
                      {THINKING_ERROR_LABELS[selectedOption.thinkingError]}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--theme-body-text)]">{selectedOption.feedback}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--theme-muted-text)]">
                  <strong>Outcome:</strong> {selectedOption.consequence}
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <button
                type="button"
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex((index) => Math.max(0, index - 1))}
                className="min-h-10 rounded-full border border-[var(--semantic-border-soft)] px-4 text-sm font-semibold disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="button"
                disabled={activeStepIndex === pathway.steps.length - 1}
                onClick={() => setActiveStepIndex((index) => Math.min(pathway.steps.length - 1, index + 1))}
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--semantic-brand)] px-4 text-sm font-bold text-[var(--semantic-on-brand)] disabled:opacity-50"
              >
                Next Step <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </LearnerSurfaceCard>

          <div className="grid gap-6 xl:grid-cols-2">
            <ReasoningPanel title="Expert Thinking" icon={<Stethoscope className="h-5 w-5" aria-hidden />} lines={[activeStep.expertThinking]} />
            <ReasoningPanel title="Novice Trap" icon={<AlertTriangle className="h-5 w-5" aria-hidden />} lines={[activeStep.noviceThinking]} warning />
          </div>

          <LearnerSurfaceCard className="p-5 sm:p-6">
            <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">Reasoning Breakpoints</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {activeStep.breakpointQuestions.map((question) => (
                <div key={question} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm font-semibold">
                  {question}
                </div>
              ))}
            </div>
          </LearnerSurfaceCard>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-4 lg:self-start">
          <LearnerSurfaceCard className="p-5">
            <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Reasoning Score</h2>
            <p className="mt-1 text-sm text-[var(--theme-muted-text)]">Overall {score.overall}%</p>
            <ScoreBar label="Cue Recognition" value={score.cueRecognition} />
            <ScoreBar label="Analysis" value={score.analysis} />
            <ScoreBar label="Prioritization" value={score.prioritization} />
            <ScoreBar label="Decision Making" value={score.decisionMaking} />
            <ScoreBar label="Evaluation" value={score.evaluation} />
          </LearnerSurfaceCard>

          <LearnerSurfaceCard className="p-5">
            <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Profession Focus</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--theme-body-text)]">{PROFESSION_TRACKS[profession].focus}</p>
          </LearnerSurfaceCard>

          <LearnerSurfaceCard className="p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--theme-heading-text)]">
              <GitBranch className="h-5 w-5 text-[var(--semantic-brand)]" aria-hidden />
              Deterioration Track
            </h2>
            <ol className="mt-4 space-y-3">
              {pathway.deteriorationTrack.map((stage) => (
                <li key={stage.stage} className="rounded-xl border border-[var(--semantic-border-soft)] p-3">
                  <p className="text-sm font-bold capitalize text-[var(--theme-heading-text)]">{stage.stage}</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--theme-muted-text)]">{stage.signs.join(", ")}</p>
                  <p className="mt-2 text-xs font-semibold text-[var(--semantic-brand)]">{stage.escalationPoint}</p>
                </li>
              ))}
            </ol>
          </LearnerSurfaceCard>

          <LearnerSurfaceCard className="p-5">
            <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Connected Learning</h2>
            <ul className="mt-3 space-y-2">
              {pathway.integrations.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </LearnerSurfaceCard>
        </aside>
      </div>
    </div>
  );
}

function ReasoningPanel({ title, icon, lines, warning = false }: { title: string; icon: ReactNode; lines: string[]; warning?: boolean }) {
  return (
    <LearnerSurfaceCard className={`p-5 ${warning ? "border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))]" : ""}`}>
      <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--theme-heading-text)]">
        <span className={warning ? "text-[var(--semantic-warning)]" : "text-[var(--semantic-brand)]"}>{icon}</span>
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-6 text-[var(--theme-body-text)]">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </LearnerSurfaceCard>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="mt-4">
      <div className="flex justify-between gap-3 text-xs font-semibold">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--semantic-text-muted)_12%,var(--semantic-surface))]">
        <div className="h-full rounded-full bg-[var(--semantic-brand)]" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}
