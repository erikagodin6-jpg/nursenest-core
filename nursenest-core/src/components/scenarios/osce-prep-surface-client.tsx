"use client";

import { useMemo, useState } from "react";
import { getPathwayBodySystemGroups } from "@/lib/learner-study-hub/body-system-data";
import { devSampleOsceStations } from "@/lib/scenarios/dev-sample-scenario-content";
import { ScenarioStudyShell } from "@/components/scenarios/ScenarioStudyShell";
import { ScenarioCategorySelector } from "@/components/scenarios/ScenarioCategorySelector";
import { OsceStationCard } from "@/components/scenarios/OsceStationCard";
import { OsceChecklist } from "@/components/scenarios/OsceChecklist";
import { ScenarioRationalePanel } from "@/components/scenarios/ScenarioRationalePanel";
import { ScenarioEmptyState } from "@/components/scenarios/ScenarioEmptyState";
import { isNursingPathwayForScenarioSurfaces } from "@/lib/scenarios/scenario-pathway-guard";

export function OscePrepSurfaceClient({
  pathwayId,
  showDevSamples,
}: {
  pathwayId: string | null;
  showDevSamples: boolean;
}) {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const groups = useMemo(() => getPathwayBodySystemGroups(pathwayId), [pathwayId]);
  const stations = showDevSamples ? devSampleOsceStations() : [];
  const nursing = isNursingPathwayForScenarioSurfaces(pathwayId);

  const checklistItems = useMemo(
    () => [
      { id: "intro", label: "Introduce self and confirm patient identity" },
      { id: "wash", label: "Perform hand hygiene" },
      { id: "close", label: "Close loop: summarize plan and safety checks" },
    ],
    [],
  );

  if (!nursing) {
    return (
      <ScenarioStudyShell
        eyebrow="OSCE prep"
        title="Not available for this pathway yet"
        subtitle="OSCE prep is being rolled out for RN, PN/RPN, NP, and New Grad nursing tracks first."
        pathwayId={pathwayId}
      >
        <ScenarioEmptyState
          title="No stations for this track"
          description="Switch to a nursing pathway or check back after we extend OSCE prep to additional tracks."
        />
      </ScenarioStudyShell>
    );
  }

  return (
    <ScenarioStudyShell
      eyebrow="OSCE prep"
      title="Station library (shell)"
      subtitle="Timed station mode, checklist scoring, examiner feedback, and learner reflection will attach to authored stations. This page wires navigation, categories, and empty states only."
      pathwayId={pathwayId}
    >
      <ScenarioCategorySelector groups={groups} value={categoryId} onChange={setCategoryId} label="Filter by clinical area" />
      {stations.length === 0 ? (
        <ScenarioEmptyState
          title="No published stations yet"
          description="Authoring tools and bank-backed stations will populate this library. Production stays empty until content ships."
          footnote={showDevSamples ? undefined : "Dev-only samples appear when NODE_ENV !== production and the public flag is on."}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {stations.map((s) => (
            <OsceStationCard key={s.id} title={s.title} family={s.family} minutes={s.minutes} />
          ))}
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <OsceChecklist items={checklistItems} title="Sample examiner checklist (interactive shell)" />
        <ScenarioRationalePanel body="Rationales and red lines will render from authored station JSON. This block demonstrates the panel layout only." />
      </div>
    </ScenarioStudyShell>
  );
}
