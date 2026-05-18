"use client";

import { useMemo, useState } from "react";

import { PreNursingCheckpointCluster } from "@/components/pre-nursing/pre-nursing-checkpoint-cluster";
import { PreNursingRemediationInsightCard } from "@/components/pre-nursing/pre-nursing-remediation-insight-card";
import type { PreNursingMasteryEvent } from "@/lib/pre-nursing/pre-nursing-mastery-events";

export type PreNursingAdaptiveCheckpointSectionProps = {
  ids: readonly string[];
  remediationTitle: string;
  remediationWeakArea: string;
  remediationExplanation: string;
  remediationActions: string[];
  remediationRelatedConcepts?: string[];
};

export function PreNursingAdaptiveCheckpointSection({
  ids,
  remediationTitle,
  remediationWeakArea,
  remediationExplanation,
  remediationActions,
  remediationRelatedConcepts,
}: PreNursingAdaptiveCheckpointSectionProps) {
  const [events, setEvents] = useState<PreNursingMasteryEvent[]>([]);

  const needsRemediation = useMemo(
    () => events.some((event) => !event.correct),
    [events],
  );

  function handleAnswered(event: PreNursingMasteryEvent) {
    setEvents((current) => [...current, event]);
  }

  return (
    <div className="space-y-6" data-prenursing-adaptive-checkpoint-section="">
      <PreNursingCheckpointCluster ids={ids} onAnswered={handleAnswered} />

      {needsRemediation ? (
        <PreNursingRemediationInsightCard
          title={remediationTitle}
          weakArea={remediationWeakArea}
          explanation={remediationExplanation}
          recommendedActions={remediationActions}
          relatedConcepts={remediationRelatedConcepts}
        />
      ) : null}
    </div>
  );
}
