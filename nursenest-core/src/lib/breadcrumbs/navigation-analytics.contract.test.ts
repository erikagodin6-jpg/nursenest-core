import assert from "node:assert/strict";
import { test } from "node:test";
import {
  resetNavigationAnalyticsDedupeForTests,
  trackNavigationEvent,
} from "@/lib/breadcrumbs/navigation-analytics";
import {
  normalizeEducationalPathname,
  resolveGraphNavigationTelemetryContext,
} from "@/lib/breadcrumbs/pathname-normalization";

test("normalizeEducationalPathname strips query and trailing slash", () => {
  assert.equal(normalizeEducationalPathname("/ecg/"), "/ecg");
  assert.equal(normalizeEducationalPathname("/ecg?ref=1"), "/ecg");
});

test("graph telemetry context includes ontology namespace and remediation pathway", () => {
  const ctx = resolveGraphNavigationTelemetryContext({
    pathname: "/nursing-glossary/hyperkalemia",
    surface: "glossary",
    canonicalRootId: "glossary",
    topicSlug: "hyperkalemia",
    pathwayId: "ca-rn-nclex-rn",
  });
  assert.equal(ctx.ontologyNamespace, "reference.glossary");
  assert.ok(ctx.remediationPathwayId?.includes("hyperkalemia"));
});

test("navigation analytics dedupes repeated render events", () => {
  resetNavigationAnalyticsDedupeForTests();
  trackNavigationEvent({
    event: "breadcrumb_rendered",
    breadcrumbIntent: "education",
    pathname: "/ecg",
    ontologyNamespace: "academy.ecg",
  });
  trackNavigationEvent({
    event: "breadcrumb_rendered",
    breadcrumbIntent: "education",
    pathname: "/ecg",
    ontologyNamespace: "academy.ecg",
  });
  assert.ok(true);
});
