/**
 * Pure hub/detail contract mappers — isolated from Prisma and `server-only` so `node --test` can load them.
 */
import test from "node:test";
import assert from "node:assert/strict";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import {
  contentItemLessonAccessToHubRowResult,
  legacyLessonAccessToHubRowResult,
  pathwayResolutionToHubRowResult,
} from "@/lib/lessons/app-lessons-hub-row-renderability.invariants";
import type { AppSubscriberPathwayLessonDetailRow } from "@/lib/lessons/app-subscriber-lesson-detail-resolve";

function pwRow(partial: Partial<AppSubscriberPathwayLessonDetailRow>): AppSubscriberPathwayLessonDetailRow {
  return {
    id: "pl-1",
    pathwayId: "us-rn-nclex-rn",
    slug: "sample-slug",
    status: "PUBLISHED",
    countryCode: "US",
    tierCode: "RN",
    ...partial,
  };
}

test("pathwayResolutionToHubRowResult: pathway_ok => kept", () => {
  const r = pathwayResolutionToHubRowResult(
    { kind: "pathway_ok", pathwayId: "us-rn-nclex-rn", record: {} as PathwayLessonRecord },
    pwRow({}),
  );
  assert.equal(r.ok, true);
});

test("pathwayResolutionToHubRowResult: empty slug after not_found => slug_invalid", () => {
  const r = pathwayResolutionToHubRowResult({ kind: "not_found" }, pwRow({ slug: "  " }));
  assert.equal(r.ok, false);
  if (r.ok) return;
  assert.equal(r.reason, "slug_invalid");
});

test("pathwayResolutionToHubRowResult: not_found with slug => detail_hydration_failed (exam mismatch, review taxonomy, etc.)", () => {
  const r = pathwayResolutionToHubRowResult({ kind: "not_found" }, pwRow({ slug: "sepsis" }));
  assert.equal(r.ok, false);
  if (r.ok) return;
  assert.equal(r.reason, "detail_hydration_failed");
});

test("pathwayResolutionToHubRowResult: out_of_plan => entitlement_gate", () => {
  const r = pathwayResolutionToHubRowResult({ kind: "out_of_plan" }, pwRow({}));
  assert.equal(r.ok, false);
  if (r.ok) return;
  assert.equal(r.reason, "entitlement_gate");
});

test("contentItemLessonAccessToHubRowResult: entitled lesson => kept", () => {
  const r = contentItemLessonAccessToHubRowResult({
    id: "ci-1",
    lessonTypeExists: true,
    entitledRowExists: true,
  });
  assert.equal(r.ok, true);
});

test("contentItemLessonAccessToHubRowResult: lesson type missing => dropped (detail contract)", () => {
  const r = contentItemLessonAccessToHubRowResult({
    id: "ci-1",
    lessonTypeExists: false,
    entitledRowExists: false,
  });
  assert.equal(r.ok, false);
  if (r.ok) return;
  assert.equal(r.reason, "detail_hydration_failed");
});

test("contentItemLessonAccessToHubRowResult: exists but not entitled => content_entitlement_miss", () => {
  const r = contentItemLessonAccessToHubRowResult({
    id: "ci-1",
    lessonTypeExists: true,
    entitledRowExists: false,
  });
  assert.equal(r.ok, false);
  if (r.ok) return;
  assert.equal(r.reason, "content_entitlement_miss");
});

test("legacyLessonAccessToHubRowResult: hit + access => kept", () => {
  const r = legacyLessonAccessToHubRowResult({ id: "free-x", lessonHit: true, canAccess: true });
  assert.equal(r.ok, true);
});

test("legacyLessonAccessToHubRowResult: no lesson => legacy_not_found", () => {
  const r = legacyLessonAccessToHubRowResult({ id: "missing", lessonHit: false, canAccess: false });
  assert.equal(r.ok, false);
  if (r.ok) return;
  assert.equal(r.reason, "legacy_not_found");
});

test("legacyLessonAccessToHubRowResult: lesson but no tier access => legacy_out_of_plan", () => {
  const r = legacyLessonAccessToHubRowResult({ id: "np-only", lessonHit: true, canAccess: false });
  assert.equal(r.ok, false);
  if (r.ok) return;
  assert.equal(r.reason, "legacy_out_of_plan");
});
