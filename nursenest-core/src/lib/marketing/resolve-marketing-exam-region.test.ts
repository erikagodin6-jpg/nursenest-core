import assert from "node:assert/strict";
import test from "node:test";
import { getExamLabel, getNursingRoleLabel } from "@/lib/labels/nursing-role-labels";
import {
  resolveDefaultLayoutMarketingExamRegion,
  resolveMarketingExamRegionToggle,
} from "@/lib/marketing/resolve-default-layout-marketing-exam-region";

test("resolveDefaultLayoutMarketingExamRegion prefers explicit nn_marketing_region over nn_global_region", () => {
  assert.equal(
    resolveDefaultLayoutMarketingExamRegion({
      marketingRegionCookie: "CA",
      globalRegionSlug: "us",
    }),
    "CA",
  );
  assert.equal(
    resolveDefaultLayoutMarketingExamRegion({
      marketingRegionCookie: "US",
      globalRegionSlug: "canada",
    }),
    "US",
  );
});

test("resolveDefaultLayoutMarketingExamRegion maps nn_global_region us|canada when marketing cookie absent", () => {
  assert.equal(
    resolveDefaultLayoutMarketingExamRegion({
      marketingRegionCookie: undefined,
      globalRegionSlug: "us",
    }),
    "US",
  );
  assert.equal(
    resolveDefaultLayoutMarketingExamRegion({
      marketingRegionCookie: undefined,
      globalRegionSlug: "canada",
    }),
    "CA",
  );
});

test("resolveDefaultLayoutMarketingExamRegion Canada-first when global is not us|canada and no IP", () => {
  assert.equal(
    resolveDefaultLayoutMarketingExamRegion({
      marketingRegionCookie: undefined,
      globalRegionSlug: "philippines",
    }),
    "CA",
  );
  assert.equal(
    resolveDefaultLayoutMarketingExamRegion({
      marketingRegionCookie: undefined,
      globalRegionSlug: null,
    }),
    "CA",
  );
});

test("resolveMarketingExamRegionToggle uses IP country US|CA when cookies and global are ambiguous", () => {
  assert.equal(
    resolveMarketingExamRegionToggle({
      marketingRegionCookie: undefined,
      globalRegionSlug: "philippines",
      detectedIpCountry: "US",
    }),
    "US",
  );
  assert.equal(
    resolveMarketingExamRegionToggle({
      marketingRegionCookie: undefined,
      globalRegionSlug: null,
      detectedIpCountry: "CA",
    }),
    "CA",
  );
});

test("explicit nn_marketing_region wins over IP and global", () => {
  assert.equal(
    resolveMarketingExamRegionToggle({
      marketingRegionCookie: "CA",
      globalRegionSlug: "us",
      detectedIpCountry: "US",
    }),
    "CA",
  );
});

test("nursing role labels for pricing tracks (US vs CA PN)", () => {
  assert.equal(getNursingRoleLabel({ country: "US", role: "PN" }), "LPN / LVN");
  assert.equal(getExamLabel({ country: "US", role: "PN" }), "NCLEX-PN");
  assert.equal(getNursingRoleLabel({ country: "CA", role: "PN" }), "RPN");
  assert.equal(getExamLabel({ country: "CA", role: "PN" }), "REX-PN");
});

test("RN and NP exam labels stay stable across US/CA", () => {
  assert.equal(getExamLabel({ country: "US", role: "RN" }), "NCLEX-RN");
  assert.equal(getExamLabel({ country: "CA", role: "RN" }), "NCLEX-RN");
  assert.equal(getExamLabel({ country: "US", role: "NP" }), "NP Certification Exam");
  assert.equal(getExamLabel({ country: "CA", role: "NP" }), "NP Certification Exam");
});
