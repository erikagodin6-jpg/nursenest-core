import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertReplayDeterminism,
  captureGraphRuntimeReplay,
  replayDashboardActions,
} from "@/lib/educational-graph/graph-runtime-replay";
import { buildDashboardGraphActions } from "@/lib/educational-graph/dashboard-graph-actions";
import { resolveUnifiedEducationalSubstrate } from "@/lib/educational-graph/unified-educational-substrate";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";

describe("Graph runtime replay", () => {
  it("dashboard replay is deterministic for same substrate", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const substrate = resolveUnifiedEducationalSubstrate({
      pathwayId: pathway.id,
      topicSlugs: ["sepsis"],
      sourceSurface: "dashboard_feed",
    });
    const actions = buildDashboardGraphActions(substrate);
    const a = replayDashboardActions(actions, pathway.id);
    const b = replayDashboardActions(actions, pathway.id);
    assert.equal(assertReplayDeterminism(a, b), null);
    assert.ok(a.lineage.continuityCheckpointId.length > 0);
  });

  it("replay snapshot preserves ontology revision", () => {
    const snap = captureGraphRuntimeReplay({
      kind: "interpretation_entry",
      pathwayId: "us-rn-nclex-rn",
      steps: [],
      sourceSurface: "topic_hub_public",
    });
    assert.match(snap.lineage.ontologyRevision, /nursenest\.rn\.educational_graph/);
  });
});
