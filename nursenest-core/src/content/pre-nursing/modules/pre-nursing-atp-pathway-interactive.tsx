"use client";

import { ATPPathwayModule } from "@/content/pre-nursing/modules/pre-nursing-atp-pathway";
import { PreNursingCheckpointCluster } from "@/components/pre-nursing/pre-nursing-checkpoint-cluster";
import { PRE_NURSING_ATP_PATHWAY_CHECKPOINT_IDS } from "@/content/pre-nursing/pre-nursing-interactive-checkpoints";

export function ATPPathwayInteractiveModule() {
  return (
    <div className="space-y-10">
      <ATPPathwayModule />

      <PreNursingCheckpointCluster
        ids={PRE_NURSING_ATP_PATHWAY_CHECKPOINT_IDS}
        title="Clinical energy-pathway checkpoints"
        description="Strengthen your understanding of ATP production, oxygen-dependent metabolism, tissue hypoxia, lactic acidosis, and DKA compensation using clinically framed active-recall checkpoints."
      />
    </div>
  );
}
