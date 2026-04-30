"use client";

import { useMemo, useState } from "react";
import { getPathwayBodySystemGroups } from "@/lib/learner-study-hub/body-system-data";
import { CANONICAL_STUDY_CATEGORIES } from "@/lib/study/normalize-study-category";
import { devSampleClinicalScenarios } from "@/lib/scenarios/dev-sample-scenario-content";
import { ScenarioStudyShell } from "@/components/scenarios/ScenarioStudyShell";
import { ScenarioCategorySelector } from "@/components/scenarios/ScenarioCategorySelector";
import { ClinicalScenarioCard } from "@/components/scenarios/ClinicalScenarioCard";
import { ScenarioRationalePanel } from "@/components/scenarios/ScenarioRationalePanel";
import { ScenarioEmptyState } from "@/components/scenarios/ScenarioEmptyState";
import { isNursingPathwayForScenarioSurfaces } from "@/lib/scenarios/scenario-pathway-guard";

export function ClinicalScenariosSurfaceClient({
  pathwayId,
  showDevSamples,
}: {
  pathwayId: string | null;
  showDevSamples: boolean;
}) {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const groups = useMemo(() => getPathwayBodySystemGroups(pathwayId), [pathwayId]);
  const scenarios = showDevSamples ? devSampleClinicalScenarios() : [];
  const nursing = isNursingPathwayForScenarioSurfaces(pathwayId);

  const labelFor = (id: string) => CANONICAL_STUDY_CATEGORIES.find((c) => c.id === id)?.label ?? id;

  const filtered = useMemo(() => {
    if (!categoryId) return scenarios;
    return scenarios.filter((s) => s.categoryId === categoryId);
  }, [scenarios, categoryId]);

  if (!nursing) {
    return (
      <ScenarioStudyShell
        eyebrow="Clinical scenarios"
        title="Not available for this pathway yet"
        subtitle="Unfolding cases, vitals/labs, nursing priorities, and SBAR practice will ship for nursing tiers first."
        pathwayId={pathwayId}
      >
        <ScenarioEmptyState
          title="No scenarios for this track"
          description="Choose an RN, PN/RPN, NP, or New Grad nursing pathway to preview the shell when it is enabled."
        />
      </ScenarioStudyShell>
    );
  }

  return (
    <ScenarioStudyShell
      eyebrow="Clinical scenarios"
      title="Case-based scenarios (shell)"
      subtitle="Supports unfolding cases, vitals/labs, orders, nursing priorities, interventions, rationales, red flags, escalation criteria, SBAR practice, and deep links to lessons, questions, and flashcards once content lands."
      pathwayId={pathwayId}
    >
      <ScenarioCategorySelector groups={groups} value={categoryId} onChange={setCategoryId} />
      {filtered.length === 0 ? (
        <ScenarioEmptyState
          title="No scenarios in this filter"
          description="When the content pipeline publishes scenarios, they will appear here grouped by the same canonical body-system model as lessons and practice."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((s) => (
            <ClinicalScenarioCard
              key={s.id}
              title={s.title}
              categoryLabel={labelFor(s.categoryId)}
              summary={s.summary}
              badges={["Vitals & labs", "SBAR", "Red flags"]}
            />
          ))}
        </div>
      )}
      <ScenarioRationalePanel title="Teaching points" body="Intervention rationales and escalation criteria render here from authored scenario data." />
    </ScenarioStudyShell>
  );
}
