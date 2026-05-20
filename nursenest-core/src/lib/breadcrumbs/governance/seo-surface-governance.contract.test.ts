import assert from "node:assert/strict";
import test from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  auditSeoSurfaceTrail,
  resolvePathwayOverviewSeoBreadcrumbs,
  resolveProgrammaticSeoSurfaceBreadcrumbs,
} from "@/lib/breadcrumbs/governance/seo-surface-breadcrumb-governance";

test("pathway overview uses discovery intent", () => {
  const pathway = getExamPathwayById("ca-rn-nclex-rn");
  assert.ok(pathway);
  const res = resolvePathwayOverviewSeoBreadcrumbs(pathway, {
    pathname: "/canada/rn/nclex-rn",
  });
  assert.equal(res.intent, "discovery");
  assert.ok(res.crumbs.length >= 3);
});

test("programmatic surface rejects ECG alias labels", () => {
  const issues = auditSeoSurfaceTrail(
    {
      crumbs: [
        { name: "Home", href: "/" },
        { name: "ECG Academy", href: "/ecg" },
        { name: "Page" },
      ],
      schemaItems: [],
    },
    { pathname: "/test-page", canonicalRootId: "ecg", surfaceKind: "programmatic" },
  );
  assert.ok(issues.some((i) => i.code === "alias_leakage"));
});

test("programmatic governed resolution has schema", () => {
  const res = resolveProgrammaticSeoSurfaceBreadcrumbs(
    {
      slug: "nclex-prep",
      h1: "NCLEX Prep",
      title: "NCLEX Prep",
      description: "Test",
    } as import("@/lib/seo/programmatic-registry").SeoPageDefinition,
    "en",
    { pathname: "/nclex-prep" },
  );
  assert.equal(res.intent, "discovery");
  assert.ok(res.schemaItems.length >= 1);
});
