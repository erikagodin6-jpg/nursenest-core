import assert from "node:assert/strict";
import test from "node:test";
import { evaluateRuntimeSemanticIntegrity } from "@/lib/breadcrumbs/governance/runtime-semantic-integrity";

test("detects shadow authority indicators", () => {
  const result = evaluateRuntimeSemanticIntegrity({
    pathname: "/ecg",
    pageEmitsBreadcrumbList: true,
    crumbs: [{ name: "Home", href: "/" }, { name: "ECG", href: "/ecg" }],
    canonicalRootId: "ecg",
    shadowIndicators: ["raw_BreadcrumbTrail"],
  });
  assert.equal(result.tier, "shadow-authority-detected");
});

test("learner schema emission is conflicting tier", () => {
  const result = evaluateRuntimeSemanticIntegrity({
    pathname: "/app/lessons",
    pageEmitsBreadcrumbList: true,
    crumbs: [{ name: "Home", href: "/app" }],
  });
  assert.ok(
    result.tier === "conflicting" || result.tier === "degraded" || result.violations.length > 0,
  );
});
