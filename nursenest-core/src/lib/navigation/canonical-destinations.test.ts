import test from "node:test";
import assert from "node:assert/strict";
import { marketingExamPrepHubs } from "@/lib/marketing/marketing-exam-navigation";
import {
  learnerMarketingPathwayIdFromSession,
  offeringIdForTier,
  publicExamPrepHubDestinations,
  publicMarketingExploreDestinations,
} from "./canonical-destinations";

test("publicExamPrepHubDestinations matches marketingExamPrepHubs (US/CA)", () => {
  for (const region of ["US", "CA"] as const) {
    assert.deepEqual(publicExamPrepHubDestinations(region), marketingExamPrepHubs(region));
  }
});

test("publicMarketingExploreDestinations exposes stable marketing keys", () => {
  const us = publicMarketingExploreDestinations("US");
  assert.equal(us.pricing, "/pricing");
  assert.equal(us.lessons, "/lessons");
  assert.equal(us.practiceQuestions, "/question-bank");
  const ca = publicMarketingExploreDestinations("CA");
  assert.equal(ca.practiceQuestions, "/question-bank");
});

test("offeringIdForTier + learnerMarketingPathwayIdFromSession align with default pathway ids", () => {
  assert.equal(offeringIdForTier("RN"), "rn");
  assert.equal(offeringIdForTier("NP"), "np");
  const id = learnerMarketingPathwayIdFromSession({ tier: "RN", country: "US" });
  assert.equal(id, "us-rn-nclex-rn");
  assert.equal(learnerMarketingPathwayIdFromSession(null), null);
  assert.equal(learnerMarketingPathwayIdFromSession({ tier: "PRE_NURSING", country: "US" }), null);
  assert.equal(learnerMarketingPathwayIdFromSession({ tier: "NEW_GRAD", country: "US" }), null);
});
