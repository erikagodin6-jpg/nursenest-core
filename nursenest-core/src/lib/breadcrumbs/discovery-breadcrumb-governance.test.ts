import assert from "node:assert/strict";
import test from "node:test";
import {
  auditDiscoveryTrailLabels,
  resolveDiscoveryBreadcrumbResolution,
} from "@/lib/breadcrumbs/discovery-breadcrumb-governance";
import { assertSingleBreadcrumbOwner } from "@/lib/breadcrumbs/breadcrumb-schema-governance";

test("discovery resolution uses discovery intent and depth ceiling", () => {
  const res = resolveDiscoveryBreadcrumbResolution({
    hubLabel: "REx-PN",
    hubPath: "/canada/pn/rex-pn",
    leafLabel: "Overview",
    pathname: "/canada/pn/rex-pn/overview",
  });
  assert.equal(res.intent, "discovery");
  assert.ok(res.crumbs.length >= 2 && res.crumbs.length <= 4);
  assert.ok(res.schemaItems.length >= 2);
});

test("discovery audit rejects forbidden ECG aliases", () => {
  const issue = auditDiscoveryTrailLabels([
    { name: "Home", href: "/" },
    { name: "ECG Academy", href: "/ecg" },
    { name: "Topic" },
  ]);
  assert.ok(issue?.toLowerCase().includes("ecg academy"));
});

test("schema governance flags duplicate home in BreadcrumbList", () => {
  const violations = assertSingleBreadcrumbOwner({
    pathname: "/canada/pn/rex-pn",
    pageEmitsBreadcrumbList: true,
    schemaItems: [
      { name: "Home", item: "https://nursenest.com/" },
      { name: "Home", item: "https://nursenest.com/" },
      { name: "Leaf", item: "https://nursenest.com/canada/pn/rex-pn" },
    ],
  });
  assert.ok(violations.some((v) => v.code === "duplicate_schema_id"));
});
