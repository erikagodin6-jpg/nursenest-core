import assert from "node:assert/strict";
import test from "node:test";
import { formatLaunchWorkflowTargetKey, parseLaunchWorkflowTargetKey } from "@/lib/admin/pathway-launch-workflow-target";

test("parseLaunchWorkflowTargetKey accepts pathway and region", () => {
  assert.deepEqual(parseLaunchWorkflowTargetKey("pathway:us-rn-nclex-rn"), { kind: "pathway", pathwayId: "us-rn-nclex-rn" });
  assert.deepEqual(parseLaunchWorkflowTargetKey("region:japan"), { kind: "region", region: "japan" });
  assert.equal(parseLaunchWorkflowTargetKey("invalid"), null);
  assert.equal(parseLaunchWorkflowTargetKey("region:invalid-region-xyz"), null);
});

test("formatLaunchWorkflowTargetKey round-trips", () => {
  const a = { kind: "pathway" as const, pathwayId: "ca-rn-nclex-rn" };
  assert.equal(formatLaunchWorkflowTargetKey(a), "pathway:ca-rn-nclex-rn");
  const b = { kind: "region" as const, region: "philippines" as const };
  assert.equal(formatLaunchWorkflowTargetKey(b), "region:philippines");
});
