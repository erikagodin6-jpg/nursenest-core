import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { TierCode } from "@prisma/client";
import { buildLearnerEngagementEmailContext } from "@/lib/retention/learner-engagement-email-context";

describe("buildLearnerEngagementEmailContext", () => {
  it("labels NP and Allied contexts", () => {
    const np = buildLearnerEngagementEmailContext({
      name: "Sam Student",
      tier: TierCode.NP,
      learnerPath: "us-np-fnp",
      alliedProfessionKey: null,
    });
    assert.match(np.trackLabel, /NP/i);
    assert.ok(np.pathwayLabel);

    const allied = buildLearnerEngagementEmailContext({
      name: "Alex",
      tier: TierCode.ALLIED,
      learnerPath: "us-allied-core",
      alliedProfessionKey: "mlt",
    });
    assert.match(allied.trackLabel, /Allied/i);
    assert.match(allied.pathwayLabel ?? "", /mlt/i);
  });
});
