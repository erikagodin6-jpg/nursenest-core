import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canonicalProfessionKeyForAlliedCareer,
  isValidAlliedCareerKey,
  resolveAlliedEntitlementFromProfile,
} from "@/lib/allied/allied-billing-career-resolution";

describe("allied-billing-career-resolution", () => {
  it("maps billing career keys to canonical lesson profession keys", () => {
    assert.equal(canonicalProfessionKeyForAlliedCareer("rrt"), "respiratory");
    assert.equal(canonicalProfessionKeyForAlliedCareer("mlt"), "mlt");
    assert.equal(canonicalProfessionKeyForAlliedCareer("paramedic"), "paramedic");
  });

  it("validates allied career enum strings", () => {
    assert.equal(isValidAlliedCareerKey("rrt"), true);
    assert.equal(isValidAlliedCareerKey("bogus"), false);
    assert.equal(isValidAlliedCareerKey(""), false);
    assert.equal(isValidAlliedCareerKey(null), false);
  });

  it("prefers subscription alliedCareer over profile when valid", () => {
    const r = resolveAlliedEntitlementFromProfile({
      subscriptionAlliedCareer: "mlt",
      userAlliedProfessionKey: "respiratory",
    });
    assert.equal(r.career, "mlt");
    assert.equal(r.professionKey, "mlt");
    assert.equal(r.pendingOccupation, false);
  });

  it("falls back from marketing profession slug to career when subscription empty", () => {
    const r = resolveAlliedEntitlementFromProfile({
      subscriptionAlliedCareer: null,
      userAlliedProfessionKey: "respiratory",
    });
    assert.equal(r.career, "rrt");
    assert.equal(r.professionKey, "respiratory");
    assert.equal(r.pendingOccupation, false);
  });

  it("marks pending when tier is allied but occupation unknown", () => {
    const r = resolveAlliedEntitlementFromProfile({
      subscriptionAlliedCareer: "",
      userAlliedProfessionKey: "unknown-profession",
    });
    assert.equal(r.career, null);
    assert.equal(r.pendingOccupation, true);
  });
});
