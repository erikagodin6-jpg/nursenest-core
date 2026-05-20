import assert from "node:assert/strict";
import test from "node:test";
import { auditBreadcrumbHref, canonicalMarketingPath } from "@/lib/breadcrumbs/canonical-breadcrumb-href-builder";

test("canonical path collapses duplicate slashes and trailing slash", () => {
  assert.equal(canonicalMarketingPath("//ecg//topic/"), "/ecg/topic");
});

test("rejects legacy rex-pn alias prefix", () => {
  const issue = auditBreadcrumbHref("/rpn/rex-pn/questions");
  assert.equal(issue?.code, "legacy_prefix");
});

test("rejects mixed glossary prefix outside nursing-glossary hub", () => {
  const issue = auditBreadcrumbHref("/glossary/some-term");
  assert.equal(issue?.code, "non_canonical");
});
