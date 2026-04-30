"use client";

import { useMemo, useState } from "react";
import { CANONICAL_STUDY_CATEGORIES } from "@/lib/study/normalize-study-category";
import {
  patientTrajectoryFromConsequence,
  trajectoryLabelText,
  type PatientTrajectory,
} from "@/lib/clinical-scenarios/clinical-scenario-trajectory";

export type ClinicalScenarioStagePreview = {
  id: string;
  orderIndex: number;
  scenarioText: string;
  vitals: unknown;
  assessmentFindings: string;
  labUpdates: unknown | null;
  questionStem: string;
  optionsJson: unknown;
  correctOptionId: string;
  rationale: string;
  whyWrongByOptionId: unknown;
  clinicalJudgmentFocus: string;
  consequencesByOptionId: unknown;
  nextStageOrder: number | null;
};

export type ClinicalScenarioPreviewModel = {
  id: string;
  title: string;
  pathwayId: string;
  canonicalCategoryId: string;
  tierFocus: string;
  difficulty: string;
  patientAgeContext: string;
  presentingConcern: string;
  briefHistory: string;
  medicationsAllergies: string | null;
  initialVitals: unknown;
  assessmentFindings: string;
  labsDiagnostics: unknown | null;
  publishStatus: string;
  stages: ClinicalScenarioStagePreview[];
};

function asOptionList(raw: unknown): { id: string; label: string }[] {
  if (!Array.isArray(raw)) return [];
  const out: { id: string; label: string }[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    const id = typeof o.id === "string" ? o.id : "";
    const label = typeof o.label === "string" ? o.label : "";
    if (id && label) out.push({ id, label });
  }
  return out;
}

function asStringMap(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object") return {};
  const o = raw as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(o)) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
}

function renderKeyValuePanel(title: string, data: unknown) {
  if (data == null) return null;
  const entries =
    typeof data === "object" && !Array.isArray(data) && data !== null
      ? Object.entries(data as Record<string, unknown>).filter(([, v]) => v != null && String(v).trim() !== "")
      : [];
  if (!entries.length) return null;
  return (
    <section className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,var(--bg-card))] p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-info)]">{title}</h3>
      <dl className="mt-2 grid gap-2 text-sm text-[var(--semantic-text-primary)] sm:grid-cols-2">
        {entries.map(([k, v]) => (
          <div key={k} className="rounded-md bg-[var(--bg-muted)]/60 px-2 py-1">
            <dt className="text-[10px] font-semibold uppercase text-[var(--theme-body-text)]">{k}</dt>
            <dd className="text-[var(--semantic-text-primary)]">{String(v)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ClinicalScenarioUnfoldingPreview({ scenario }: { scenario: ClinicalScenarioPreviewModel }) {
  const [stageIdx, setStageIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const stage = scenario.stages[stageIdx];
  const options = useMemo(() => (stage ? asOptionList(stage.optionsJson) : []), [stage]);
  const consequences = useMemo(() => (stage ? asStringMap(stage.consequencesByOptionId) : {}), [stage]);
  const whyWrong = useMemo(() => (stage ? asStringMap(stage.whyWrongByOptionId) : {}), [stage]);

  const trajectory: PatientTrajectory | null = useMemo(() => {
    if (!stage || !picked) return null;
    return patientTrajectoryFromConsequence(consequences[picked]);
  }, [picked, stage, consequences]);

  const categoryLabel =
    CANONICAL_STUDY_CATEGORIES.find((c) => c.id === scenario.canonicalCategoryId)?.label ?? scenario.canonicalCategoryId;

  if (!stage) {
    return <p className="text-sm text-[var(--theme-body-text)]">This scenario has no stages yet.</p>;
  }

  return (
    <div className="space-y-4">
      <header className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_10%,var(--bg-card))] p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-success)]">Scenario intro</p>
        <h2 className="mt-1 text-xl font-semibold text-[var(--semantic-text-primary)]">{scenario.title}</h2>
        <p className="mt-2 text-sm text-[var(--theme-body-text)]">
          {scenario.pathwayId} · {categoryLabel} · {scenario.tierFocus.replace(/_/g, " ")} · {scenario.difficulty}
        </p>
        <p className="mt-1 text-xs text-[var(--semantic-chart-3)]">Status: {scenario.publishStatus}</p>
      </header>

      <section className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-chart-2)]">Patient snapshot</h3>
        <p className="mt-2 text-sm text-[var(--semantic-text-primary)]">
          <span className="font-semibold">Age / context:</span> {scenario.patientAgeContext}
        </p>
        <p className="mt-2 text-sm text-[var(--semantic-text-primary)]">
          <span className="font-semibold">Presenting concern:</span> {scenario.presentingConcern}
        </p>
        <p className="mt-2 text-sm text-[var(--theme-body-text)]">{scenario.briefHistory}</p>
        {scenario.medicationsAllergies ? (
          <p className="mt-2 text-sm text-[var(--semantic-warning)]">
            <span className="font-semibold">Meds / allergies:</span> {scenario.medicationsAllergies}
          </p>
        ) : null}
      </section>

      {renderKeyValuePanel("Initial vitals (case baseline)", scenario.initialVitals)}
      {renderKeyValuePanel("Admission assessment", { "Key findings": scenario.assessmentFindings })}
      {renderKeyValuePanel("Labs & diagnostics", scenario.labsDiagnostics)}

      <section className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_10%,var(--bg-card))] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-warning)]">
            Case stage {stage.orderIndex + 1} of {scenario.stages.length}
          </h3>
          {trajectory ? (
            <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--bg-muted)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-primary)]">
              Trajectory: {trajectoryLabelText(trajectory)}
            </span>
          ) : null}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-primary)]">{stage.scenarioText}</p>
        {renderKeyValuePanel("Vitals (stage)", stage.vitals)}
        <p className="mt-3 text-sm text-[var(--semantic-text-primary)]">
          <span className="font-semibold">Assessment:</span> {stage.assessmentFindings}
        </p>
        {renderKeyValuePanel("Lab / diagnostic updates", stage.labUpdates)}
      </section>

      <section className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">Clinical judgment check</h3>
        <p className="mt-2 text-sm font-medium text-[var(--semantic-text-primary)]">{stage.questionStem}</p>
        <p className="mt-1 text-xs text-[var(--theme-body-text)]">Focus: {stage.clinicalJudgmentFocus}</p>
        <div className="mt-3 flex flex-col gap-2">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                picked === o.id
                  ? "border-[color-mix(in_srgb,var(--semantic-brand)_55%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--bg-muted))]"
                  : "border-[var(--semantic-border-soft)] bg-[var(--bg-muted)]/40 hover:border-[color-mix(in_srgb,var(--semantic-info)_40%,var(--semantic-border-soft))]"
              }`}
              onClick={() => setPicked(o.id)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </section>

      {picked ? (
        <section className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,var(--bg-card))] p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-info)]">Rationale</h3>
          <p className="mt-2 text-sm text-[var(--semantic-text-primary)]">{stage.rationale}</p>
          {whyWrong[picked] && picked !== stage.correctOptionId ? (
            <p className="mt-2 text-sm text-[var(--semantic-danger)]">
              <span className="font-semibold">Why this option is wrong:</span> {whyWrong[picked]}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {stageIdx < scenario.stages.length - 1 ? (
              <button
                type="button"
                className="rounded-full bg-[var(--semantic-brand)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-on-brand)]"
                onClick={() => {
                  setStageIdx((i) => i + 1);
                  setPicked(null);
                }}
              >
                Next stage
              </button>
            ) : (
              <p className="text-sm font-medium text-[var(--semantic-success)]">End-of-case — review takeaways with your educator.</p>
            )}
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-dashed border-[var(--semantic-border-soft)] bg-[var(--bg-muted)]/30 p-3 text-xs text-[var(--theme-body-text)]">
        <p className="font-semibold text-[var(--semantic-text-primary)]">Case timeline</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          {scenario.stages.map((s, i) => (
            <li key={s.id} className={i === stageIdx ? "font-semibold text-[var(--semantic-text-primary)]" : ""}>
              Stage {i + 1}: {s.questionStem.slice(0, 72)}
              {s.questionStem.length > 72 ? "…" : ""}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
