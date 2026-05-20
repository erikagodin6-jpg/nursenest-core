import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  EcosystemAnalyticsHook,
  MarketplaceOfferKind,
  ModerationPipelineState,
  PlatformCapabilityKind,
} from "@/lib/platform/phase10";
import { InstitutionalCapability } from "@/lib/rbac/institutional-capabilities";

describe("phase10 platform contracts", () => {
  it("exports stable capability and marketplace enums", () => {
    assert.equal(PlatformCapabilityKind.analyticsEventSink, "analytics_event_sink");
    assert.equal(MarketplaceOfferKind.premiumModule, "premium_module");
    assert.equal(ModerationPipelineState.pendingReview, "pending_review");
    assert.ok(Object.values(EcosystemAnalyticsHook).every((v) => typeof v === "string" && v.startsWith("ecosystem.")));
  });

  it("keeps RBAC institutional capabilities aligned with instructor futures", () => {
    assert.equal(InstitutionalCapability.CohortInstructorAssign, "cohort_instructor_assign");
  });
});
