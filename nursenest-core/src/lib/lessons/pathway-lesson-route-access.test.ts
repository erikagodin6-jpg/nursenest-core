import assert from "node:assert/strict";
import { test } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { hasFullMarketingPathwayLessonAccess } from "@/lib/lessons/pathway-lesson-access";
import {
  pathwayLessonEligibleForPublicMarketingSurface,
  resolveMarketingPathwayLessonRouteResolution,
} from "@/lib/lessons/pathway-lesson-route-access";

const pathway: ExamPathwayDefinition = {
  id: "us-rn-nclex-rn",
  countrySlug: "us",
  roleTrack: "rn",
  examCode: "nclex-rn",
  countryCode: "US",
  examFamily: "NCLEX_RN" as never,
  stripeTier: "RN" as never,
  displayName: "NCLEX-RN",
  shortName: "NCLEX-RN",
  status: "live",
} as ExamPathwayDefinition;

test("incomplete lesson → ready (preview marketing detail; indexing handled in metadata)", () => {
  const lesson = {
    slug: "x",
    structuralQuality: { publicComplete: false, issues: ["a"], warnings: [], structureMode: "legacy" as const },
  } as unknown as PathwayLessonRecord;
  const r = resolveMarketingPathwayLessonRouteResolution({
    pathway,
    lesson,
    lessonLoadFailed: false,
    userId: "",
    entitlement: "error",
    learnerPathResolved: null,
  });
  assert.equal(r.kind, "ready");
  if (r.kind === "ready") {
    assert.equal(r.fullAccess, false);
    assert.equal(r.entitlementError, true);
  }
});

test("public complete + anonymous → ready, fullAccess false", () => {
  const lesson = {
    slug: "x",
    structuralQuality: {
      publicComplete: true,
      issues: [],
      warnings: [],
      structureMode: "legacy" as const,
      internalStudyLinkCount: 3,
    },
  } as unknown as PathwayLessonRecord;
  const r = resolveMarketingPathwayLessonRouteResolution({
    pathway,
    lesson,
    lessonLoadFailed: false,
    userId: "",
    entitlement: "error",
    learnerPathResolved: null,
  });
  assert.equal(r.kind, "ready");
  if (r.kind === "ready") {
    assert.equal(r.fullAccess, false);
    assert.equal(r.entitlementError, true);
  }
});

test("pathwayLessonEligible matches structural gate", () => {
  assert.equal(
    pathwayLessonEligibleForPublicMarketingSurface({
      structuralQuality: { publicComplete: true },
    } as PathwayLessonRecord),
    true,
  );
});

test("staffFullLessonAccess grants fullAccess when subscription scope is anonymous", () => {
  const lesson = {
    slug: "x",
    structuralQuality: {
      publicComplete: true,
      issues: [],
      warnings: [],
      structureMode: "legacy" as const,
      internalStudyLinkCount: 3,
    },
  } as unknown as PathwayLessonRecord;
  const r = resolveMarketingPathwayLessonRouteResolution({
    pathway,
    lesson,
    lessonLoadFailed: false,
    userId: "",
    entitlement: { hasAccess: false, reason: "no_access", tier: null, country: null, alliedCareer: null },
    learnerPathResolved: null,
    staffFullLessonAccess: true,
  });
  assert.equal(r.kind, "ready");
  if (r.kind === "ready") {
    assert.equal(r.fullAccess, true);
  }
});

test("hasFullMarketingPathwayLessonAccess: staff bypass without subscription scope", () => {
  const scope = {
    hasAccess: false,
    reason: "no_access" as const,
    tier: null,
    country: null,
    alliedCareer: null,
  };
  assert.equal(hasFullMarketingPathwayLessonAccess(scope, pathway, null, false), false);
  assert.equal(hasFullMarketingPathwayLessonAccess(scope, pathway, null, true), true);
});

test("admin_override scope grants fullAccess on marketing lesson without staffFullLessonAccess DB flag", () => {
  const npPathway = getExamPathwayById("us-np-pmhnp")!;
  const lesson = {
    slug: "x",
    structuralQuality: {
      publicComplete: true,
      issues: [],
      warnings: [],
      structureMode: "legacy" as const,
      internalStudyLinkCount: 3,
    },
  } as unknown as PathwayLessonRecord;
  const r = resolveMarketingPathwayLessonRouteResolution({
    pathway: npPathway,
    lesson,
    lessonLoadFailed: false,
    userId: "staff-user",
    entitlement: {
      hasAccess: true,
      reason: "admin_override",
      tier: "NP",
      country: "US",
      alliedCareer: null,
    },
    learnerPathResolved: "us-np-fnp",
    staffFullLessonAccess: false,
  });
  assert.equal(r.kind, "ready");
  if (r.kind === "ready") {
    assert.equal(r.fullAccess, true);
  }
});

test("staffFullLessonAccess grants fullAccess for incomplete marketing lesson (editorial visibility)", () => {
  const lesson = {
    slug: "x",
    structuralQuality: { publicComplete: false, issues: ["a"], warnings: [], structureMode: "legacy" as const },
  } as unknown as PathwayLessonRecord;
  const r = resolveMarketingPathwayLessonRouteResolution({
    pathway,
    lesson,
    lessonLoadFailed: false,
    userId: "",
    entitlement: { hasAccess: false, reason: "no_access", tier: null, country: null, alliedCareer: null },
    learnerPathResolved: null,
    staffFullLessonAccess: true,
  });
  assert.equal(r.kind, "ready");
  if (r.kind === "ready") {
    assert.equal(r.fullAccess, true);
  }
});
