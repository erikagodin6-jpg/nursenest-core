"use client";

import { ATPPathwayModule } from "@/content/pre-nursing/modules/pre-nursing-atp-pathway";
import { PreNursingAdaptiveCheckpointSection } from "@/components/pre-nursing/pre-nursing-adaptive-checkpoint-section";
import { PreNursingLessonMiniAssessment } from "@/components/pre-nursing/pre-nursing-lesson-mini-assessment";
import { PRE_NURSING_ATP_PATHWAY_CHECKPOINT_IDS } from "@/content/pre-nursing/pre-nursing-interactive-checkpoints";
import { PRE_NURSING_ATP_MINI_ASSESSMENT } from "@/content/pre-nursing/pre-nursing-mini-assessments";

export function ATPPathwayInteractiveModule() {
  return (
    <div className="space-y-10">
      <ATPPathwayModule />

      <PreNursingAdaptiveCheckpointSection
        ids={PRE_NURSING_ATP_PATHWAY_CHECKPOINT_IDS}
        remediationTitle="Strengthen ATP and oxygenation foundations"
        remediationWeakArea="Aerobic metabolism, oxygen-dependent ATP production, and compensatory physiology"
        remediationExplanation="Learners often memorize glycolysis, ATP, lactate, and DKA terminology separately without connecting them into a unified oxygenation-and-energy framework."
        remediationActions={[
          "Revisit aerobic vs anaerobic metabolism.",
          "Review why oxygen is required for high-yield ATP production.",
          "Connect lactate elevation to tissue hypoxia and poor perfusion.",
          "Review how Kussmaul respirations compensate for metabolic acidosis.",
        ]}
        remediationRelatedConcepts={[
          "oxygenation",
          "cellular energy",
          "lactate",
          "metabolic acidosis",
          "perfusion",
        ]}
      />

      <PreNursingLessonMiniAssessment
        title="ATP pathway mastery check"
        description="Confirm that you can connect oxygen availability, ATP production, lactate, tissue hypoxia, and DKA compensation into one clinical reasoning framework."
        checkpoints={PRE_NURSING_ATP_MINI_ASSESSMENT}
        masteryThreshold={80}
      />
    </div>
  );
}
