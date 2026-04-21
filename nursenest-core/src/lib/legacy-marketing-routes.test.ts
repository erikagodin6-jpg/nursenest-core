import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapLegacyMarketingHref, resolveMarketingHref } from "@/lib/legacy-marketing-routes";

describe("legacy-marketing-routes", () => {
  it("maps footer study-tool paths to Core routes", () => {
    assert.equal(mapLegacyMarketingHref("/med-math"), "/tools/med-math");
    assert.equal(mapLegacyMarketingHref("/anatomy"), "/tools");
    assert.equal(mapLegacyMarketingHref("/free-practice"), "/lessons");
    assert.equal(mapLegacyMarketingHref("/exam-lessons"), "/lessons");
  });

  it("keeps allied-health on Core, not the public monolith", () => {
    assert.equal(mapLegacyMarketingHref("/allied-health"), "/allied-health");
    assert.equal(mapLegacyMarketingHref("/allied-health/rrt-exam-prep"), "/allied-health/rrt-exam-prep");
  });

  it("resolveMarketingHref leaves mapped Core paths on-origin", () => {
    assert.equal(resolveMarketingHref("/med-math"), "/tools/med-math");
    assert.equal(resolveMarketingHref("/tools/med-math"), "/tools/med-math");
    assert.equal(resolveMarketingHref("/anatomy"), "/tools");
    assert.equal(resolveMarketingHref("/lessons"), "/lessons");
  });

  it("maps legacy /terms-of-service to canonical /terms and keeps it on-origin", () => {
    assert.equal(mapLegacyMarketingHref("/terms-of-service"), "/terms");
    assert.equal(resolveMarketingHref("/terms-of-service"), "/terms");
  });

  it("maps legacy institutional marketing paths to /for-institutions", () => {
    assert.equal(mapLegacyMarketingHref("/institutions"), "/for-institutions");
    assert.equal(mapLegacyMarketingHref("/schools"), "/for-institutions");
    assert.equal(resolveMarketingHref("/institutions"), "/for-institutions");
  });
});
