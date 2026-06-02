import assert from "node:assert/strict";
import test from "node:test";
import {
  auditPageStructuredDataEmissions,
  detectDuplicateBreadcrumbSchema,
  resolveSchemaOwnership,
} from "@/lib/breadcrumbs/structured-data-governance";

test("duplicate BreadcrumbList on page-owned ECG route", () => {
  const issue = detectDuplicateBreadcrumbSchema({
    pathname: "/ecg",
    pageEmitsBreadcrumbList: true,
    layoutEmitsBreadcrumbList: true,
  });
  assert.ok(issue);
  assert.equal(issue?.code, "duplicate_schema");
});

test("learner route forbids BreadcrumbList emission", () => {
  assert.equal(resolveSchemaOwnership("/app/coach", "BreadcrumbList"), "forbidden");
  const issues = auditPageStructuredDataEmissions(
    "/app/coach",
    { BreadcrumbList: true },
    false,
  );
  assert.equal(issues.length, 1);
  assert.equal(issues[0]?.code, "forbidden_schema");
});

test("FAQPage + layout fallback on owned academy flagged", () => {
  const issues = auditPageStructuredDataEmissions(
    "/ecg",
    { FAQPage: true, BreadcrumbList: true },
    true,
  );
  assert.ok(issues.some((i) => i.code === "duplicate_schema" || i.code === "duplicate_faq"));
});

test("LearningResource + MedicalWebPage conflict", () => {
  const issues = auditPageStructuredDataEmissions("/clinical-interpretation/abg", {
    LearningResource: true,
    MedicalWebPage: true,
  });
  assert.ok(issues.some((i) => i.code === "duplicate_medical_web_page"));
});

test("interpretation and glossary routes are page-owned for breadcrumbs", () => {
  assert.equal(resolveSchemaOwnership("/clinical-interpretation", "BreadcrumbList"), "page");
  assert.equal(resolveSchemaOwnership("/nursing-glossary/term", "DefinedTerm"), "page");
});
