/**
 * Guards internal HESI / TEAS pathway scaffolding: hidden registry rows, no public sitemap pollution,
 * optional QA resolution behind NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getExamPathwayByRoute,
  resolveExamPathwayFromMarketingHubSegment,
} from "@/lib/exam-pathways/exam-product-registry";
import {
  INTERNAL_ADMISSIONS_PREP_PATHWAY_IDS,
  isInternalAdmissionsPrepPathwayId,
} from "@/lib/exam-pathways/admissions-prep-internal-pathways";
import { listPublishedExamPathwaysForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";

describe("admissions prep internal pathways", () => {
  it("registry ids stay aligned with segment F definitions", () => {
    for (const id of INTERNAL_ADMISSIONS_PREP_PATHWAY_IDS) {
      assert.ok(isInternalAdmissionsPrepPathwayId(id), id);
    }
  });

  it("does not expose internal pathways through public marketing resolution", () => {
    assert.equal(resolveExamPathwayFromMarketingHubSegment("us", "allied", "hesi-a2"), undefined);
    assert.equal(resolveExamPathwayFromMarketingHubSegment("us", "allied", "hesi-exit"), undefined);
    assert.equal(resolveExamPathwayFromMarketingHubSegment("us", "allied", "ati-teas"), undefined);
  });

  it("still resolves by canonical route map for registry lookups", () => {
    const p = getExamPathwayByRoute("us", "allied", "hesi-a2");
    assert.ok(p);
    assert.equal(p.id, "us-allied-hesi-a2");
    assert.equal(p.status, "hidden");
  });

  it("omits internal pathways from listPublishedExamPathwaysForPublicSite", () => {
    const pub = listPublishedExamPathwaysForPublicSite();
    for (const id of INTERNAL_ADMISSIONS_PREP_PATHWAY_IDS) {
      assert.ok(!pub.some((p) => p.id === id), `unexpected public pathway ${id}`);
    }
  });
});
