import assert from "node:assert/strict";
import { test } from "node:test";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
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

test("incomplete lesson → not_found", () => {
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
  assert.equal(r.kind, "not_found");
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
