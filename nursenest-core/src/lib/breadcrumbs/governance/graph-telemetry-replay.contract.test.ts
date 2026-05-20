import assert from "node:assert/strict";
import { test } from "node:test";
import {
  captureGraphTelemetryReplayFrame,
  buildGraphTelemetryReplaySnapshot,
  replayGlossaryTraversal,
  replayRemediationChain,
  assertReplayLineageConsistent,
} from "@/lib/breadcrumbs/governance/graph-telemetry-replay";
import { captureSemanticLineageReplay } from "@/lib/breadcrumbs/governance/semantic-lineage-replay";

test("replay snapshot preserves ontology and graph version", () => {
  const frame = captureGraphTelemetryReplayFrame({
    kind: "tutoring_continuation",
    pathname: "/app/coach",
    pathwayId: "us-rn-nclex-rn",
    educationalIntent: "tutoring",
  });
  const snapshot = buildGraphTelemetryReplaySnapshot([frame]);
  assert.equal(snapshot.graphVersion, frame.stamp.graphVersion);
  assert.equal(snapshot.ontologyRevision, frame.stamp.ontologyRevision);
  assert.ok(snapshot.continuityCheckpoint.includes("/app/coach"));
});

test("glossary replay filters frames", () => {
  const frames = [
    captureGraphTelemetryReplayFrame({ kind: "glossary_traversal", pathname: "/nursing-glossary/a", pathwayId: null }),
    captureGraphTelemetryReplayFrame({ kind: "dashboard_graph_action", pathname: "/app", pathwayId: null }),
  ];
  const glossary = replayGlossaryTraversal(frames);
  assert.equal(glossary.frames.length, 1);
  assert.equal(glossary.frames[0]?.kind, "glossary_traversal");
});

test("remediation chain replay includes return recovery", () => {
  const frames = [
    captureGraphTelemetryReplayFrame({ kind: "remediation_chain", pathname: "/app/review", pathwayId: "us-rn-nclex-rn" }),
    captureGraphTelemetryReplayFrame({ kind: "remediation_return_recovery", pathname: "/app/review", pathwayId: "us-rn-nclex-rn" }),
  ];
  const chain = replayRemediationChain(frames);
  assert.equal(chain.frames.length, 2);
  assert.deepEqual(assertReplayLineageConsistent(chain), []);
});

test("semantic lineage replay captures hydration parity", () => {
  const snap = captureSemanticLineageReplay({
    pathname: "/ecg",
    pathwayId: "us-rn-nclex-rn",
    ssrCrumbs: [{ name: "Home", href: "/" }, { name: "ECG", href: "/ecg" }],
    hydratedCrumbs: [{ name: "Home", href: "/" }, { name: "ECG", href: "/ecg" }],
    breadcrumbListCount: 1,
    graphKind: "glossary_traversal",
  });
  assert.ok(snap.ssrStamp.graphVersion);
  assert.equal(snap.graphFrames.length, 1);
});
