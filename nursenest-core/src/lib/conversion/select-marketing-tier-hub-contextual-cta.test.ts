import test from "node:test";
import assert from "node:assert/strict";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { selectMarketingTierHubContextualCta } from "@/lib/conversion/select-marketing-tier-hub-contextual-cta";

const usRn = getExamPathwayById("us-rn-nclex-rn");
if (!usRn) throw new Error("fixture pathway missing");

test("selectMarketingTierHubContextualCta — anonymous → practice CTA", () => {
  const d = selectMarketingTierHubContextualCta({
    pathway: usRn,
    viewerSignedIn: false,
    viewerHasPathwayLessonAccess: false,
    practiceQuestionsHref: "/us/rn/nclex-rn/questions",
  });
  assert.ok(d);
  assert.equal(d.variant, "anonymous_start_track_practice");
  assert.equal(d.primaryHref, "/us/rn/nclex-rn/questions");
});

test("selectMarketingTierHubContextualCta — signed in without access → unlock", () => {
  const d = selectMarketingTierHubContextualCta({
    pathway: usRn,
    viewerSignedIn: true,
    viewerHasPathwayLessonAccess: false,
    practiceQuestionsHref: "/us/rn/nclex-rn/questions",
  });
  assert.ok(d);
  assert.equal(d.variant, "unlock_pathway_premium");
  assert.ok(d.primaryHref.includes("pricing"));
});

test("selectMarketingTierHubContextualCta — subscriber → null (resume strip handles continue)", () => {
  const d = selectMarketingTierHubContextualCta({
    pathway: usRn,
    viewerSignedIn: true,
    viewerHasPathwayLessonAccess: true,
    practiceQuestionsHref: "/us/rn/nclex-rn/questions",
  });
  assert.equal(d, null);
});
