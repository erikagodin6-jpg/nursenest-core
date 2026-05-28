"use client";

import { ClipboardList, Users } from "lucide-react";
import type { ClinicalScenarioPreviewModel } from "@/components/clinical-scenarios/clinical-scenario-unfolding-preview";

export function ClinicalScenarioSimulationHandoff({
  scenario,
  tierNarrative,
  categoryLabel,
}: {
  scenario: ClinicalScenarioPreviewModel;
  tierNarrative: string | null;
  categoryLabel: string;
}) {
  return (
    <section className="nn-clinical-scenarios-handoff">
      <div className="nn-clinical-scenarios-handoff__badge">
        <ClipboardList className="h-4 w-4" aria-hidden />
        Clinical handoff
      </div>
      <h2 className="mt-2 text-xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-2xl">{scenario.title}</h2>
      <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
        {scenario.pathwayId} · {categoryLabel} · {scenario.tierFocus.replace(/_/g, " ")} · {scenario.difficulty}
      </p>
      {tierNarrative ? <p className="mt-2 text-xs leading-relaxed text-[var(--semantic-info)]">{tierNarrative}</p> : null}

      <div className="nn-clinical-scenarios-handoff__grid mt-4">
        <div className="nn-clinical-scenarios-handoff__card">
          <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">Patient</p>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{scenario.patientAgeContext}</p>
          <p className="mt-2 text-sm font-medium text-[var(--semantic-text-primary)]">{scenario.presentingConcern}</p>
        </div>
        <div className="nn-clinical-scenarios-handoff__card">
          <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">Shift context</p>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{scenario.briefHistory}</p>
          {scenario.medicationsAllergies ? (
            <p className="mt-2 text-sm text-[var(--semantic-warning)]">
              <span className="font-semibold">Meds / allergies:</span> {scenario.medicationsAllergies}
            </p>
          ) : null}
        </div>
        <div className="nn-clinical-scenarios-handoff__card nn-clinical-scenarios-handoff__card--accent">
          <p className="flex items-center gap-1 text-xs font-semibold text-[var(--semantic-brand)]">
            <Users className="h-3.5 w-3.5" aria-hidden />
            Your assignment
          </p>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
            You are responsible for this patient now. Every decision below changes vitals, trajectory, and outcomes — not a static quiz.
          </p>
        </div>
      </div>
    </section>
  );
}
