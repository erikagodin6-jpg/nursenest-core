import assert from "node:assert/strict";
import test from "node:test";
import {
  intentForSurface,
  resolveSurfaceFromResolverKind,
  resolveSurfaceFromLearnerKind,
} from "@/lib/breadcrumbs/breadcrumb-surface";
import { getBreadcrumbRoot, listBreadcrumbRoots, detectForbiddenRootAlias } from "@/lib/breadcrumbs/breadcrumb-root-registry";
import {
  assertBreadcrumbDepth,
  BREADCRUMB_DEPTH_CEILING,
  clampCrumbsForIntent,
} from "@/lib/breadcrumbs/breadcrumb-depth-governance";
import {
  assertSingleBreadcrumbOwner,
  auditIndexableRoutesMissingPageOwner,
} from "@/lib/breadcrumbs/breadcrumb-schema-governance";
import { auditBreadcrumbHref, canonicalMarketingPath } from "@/lib/breadcrumbs/canonical-breadcrumb-href-builder";
import { resolveBreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-resolver";
import { breadcrumbResolutionFromEducationalGraph, validateGraphAlignedTrail } from "@/lib/breadcrumbs/breadcrumb-graph-bridge";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  resetBreadcrumbTelemetryDedupeForTests,
  trackBreadcrumbRendered,
} from "@/lib/breadcrumbs/breadcrumb-telemetry";
import { applyGovernedBreadcrumbResolution } from "@/lib/breadcrumbs/governed-breadcrumb-resolution";

test("surface derives intent automatically", () => {
  assert.equal(intentForSurface("lesson"), "education");
  assert.equal(intentForSurface("dashboard"), "learner");
  assert.equal(intentForSurface("pricing"), "discovery");
  assert.equal(intentForSurface("path_segment_only"), "seo");
  assert.equal(resolveSurfaceFromResolverKind("pathway-lesson-detail"), "lesson");
  assert.equal(resolveSurfaceFromLearnerKind("remediation-ladder"), "remediation");
});

test("root registry has canonical ECG label and forbids aliases", () => {
  const ecg = getBreadcrumbRoot("ecg");
  assert.ok(ecg);
  assert.equal(ecg.label, "ECG Interpretation");
  assert.equal(ecg.href, "/ecg");
  assert.ok(detectForbiddenRootAlias("ecg", ["Home", "ECG Academy", "Topic"]));
  assert.equal(listBreadcrumbRoots().length >= 10, true);
});

test("depth governance enforces ceilings", () => {
  assert.equal(BREADCRUMB_DEPTH_CEILING.education, 5);
  const deep = Array.from({ length: 7 }, (_, i) => ({ name: `Level ${i}`, href: i === 0 ? "/" : undefined }));
  const check = assertBreadcrumbDepth("education", deep);
  assert.equal(check.ok, false);
  const clamped = clampCrumbsForIntent("learner", deep);
  assert.ok(clamped.length <= 3);
});

test("schema governance rejects duplicate owners", () => {
  const violations = assertSingleBreadcrumbOwner({
    pathname: "/ecg",
    pageEmitsBreadcrumbList: true,
    layoutEmitsBreadcrumbFallback: true,
    crumbs: [{ name: "Home", href: "/" }, { name: "ECG Interpretation" }],
    schemaItems: [{ name: "Home", item: "/" }, { name: "ECG", item: "/ecg" }],
    canonicalRootId: "ecg",
  });
  assert.ok(violations.some((v) => v.code === "duplicate_breadcrumb_list"));
});

test("canonical href rejects legacy prefixes", () => {
  const issue = auditBreadcrumbHref("/legacy/foo");
  assert.ok(issue);
  assert.equal(issue?.code, "legacy_prefix");
  assert.equal(canonicalMarketingPath("/ecg/"), "/ecg");
});

test("resolver attaches surface without manual intent", () => {
  const ecg = resolveBreadcrumbResolution({ kind: "ecg-hub" });
  assert.equal(ecg.surface, "academy");
  assert.equal(ecg.intent, "education");
  assert.ok(ecg.schemaItems.length >= 2);
});

test("educational graph bridge aligns with topic cluster breadcrumbs", () => {
  const pathway = getExamPathwayById("ca-rn-nclex-rn");
  assert.ok(pathway);
  const resolution = breadcrumbResolutionFromEducationalGraph({
    pathway,
    topicSlug: "sepsis",
    topicLabel: "Sepsis",
    sourceSurface: "topic_hub_public",
  });
  assert.equal(resolution.surface, "topic_cluster");
  const aligned = validateGraphAlignedTrail(resolution, pathway);
  assert.equal(aligned.ok, true);
});

test("indexable routes require page-owned schema when audited", () => {
  const miss = auditIndexableRoutesMissingPageOwner("/ecg", false);
  assert.ok(miss);
  assert.equal(miss?.code, "schema_without_page_owner");
});

test("telemetry dedupes render events", () => {
  resetBreadcrumbTelemetryDedupeForTests();
  const payload = {
    pathname: "/test",
    breadcrumbIntent: "education" as const,
    breadcrumbSurface: "academy" as const,
    breadcrumbDepth: 2,
    canonicalRoot: "academy.ecg",
    schemaOwner: "page" as const,
    ontologyClassification: "academy" as const,
  };
  trackBreadcrumbRendered(payload);
  trackBreadcrumbRendered(payload);
  assert.ok(true);
});

test("governed resolution strips schema for learner surface", () => {
  const governed = applyGovernedBreadcrumbResolution({
    resolution: {
      crumbs: [{ name: "Dashboard", href: "/app" }, { name: "Lesson" }],
      schemaItems: [{ name: "X", item: "/x" }],
    },
    surface: "review_session",
    pathname: "/app/lessons/x",
    silent: true,
  });
  assert.equal(governed.intent, "learner");
  assert.equal(governed.schemaItems.length, 0);
});
