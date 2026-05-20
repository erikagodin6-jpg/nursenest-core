import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { weakAreaLaunchUrl } from "./weak-area-launch-url";

describe("weakAreaLaunchUrl", () => {
  it("builds canonical weak-area remediation URLs", () => {
    const href = weakAreaLaunchUrl({
      pathwayId: "ca-rn-nclex-rn",
      practiceHubIds: ["pharmacology", "fundamentals_safety"],
      count: 20,
    });

    assert.ok(href.startsWith("/app/questions/session?"));

    const qs = new URLSearchParams(href.split("?")[1] ?? "");

    assert.equal(qs.get("pathwayId"), "ca-rn-nclex-rn");
    assert.equal(qs.get("source"), "weak_areas");
    assert.equal(qs.get("mode"), "weak_area");
    assert.equal(qs.get("studyFilter"), "weak");
    assert.equal(qs.get("shuffle"), "true");
    assert.equal(qs.get("practiceHubIds"), "pharmacology,fundamentals_safety");
  });

  it("normalizes invalid counts back to 20", () => {
    const href = weakAreaLaunchUrl({
      pathwayId: "ca-rn-nclex-rn",
      count: 999,
    });

    const qs = new URLSearchParams(href.split("?")[1] ?? "");

    assert.equal(qs.get("count"), "20");
  });

  it("supports launches without practice hub filters", () => {
    const href = weakAreaLaunchUrl({
      pathwayId: "ca-rn-nclex-rn",
    });

    const qs = new URLSearchParams(href.split("?")[1] ?? "");

    assert.equal(qs.get("practiceHubIds"), null);
    assert.equal(qs.get("source"), "weak_areas");
  });
});
