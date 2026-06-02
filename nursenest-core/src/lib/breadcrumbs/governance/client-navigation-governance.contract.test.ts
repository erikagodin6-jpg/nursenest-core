import assert from "node:assert/strict";
import { test } from "node:test";
import {
  assertClientTransitionContinuity,
  compareBreadcrumbHydrationParity,
} from "@/lib/breadcrumbs/governance/client-navigation-governance";

test("hydration parity detects trail mismatch", () => {
  const snap = compareBreadcrumbHydrationParity({
    pathname: "/ecg",
    ssrCrumbs: [{ name: "Home", href: "/" }, { name: "ECG", href: "/ecg" }],
    hydratedCrumbs: [{ name: "Home", href: "/" }, { name: "ECG Interpretation", href: "/ecg" }],
    breadcrumbListCount: 1,
  });
  assert.equal(snap.matched, false);
  assert.ok(snap.issues.includes("hydration_trail_mismatch"));
});

test("client glossary transition stays within schema budget", () => {
  const issues = assertClientTransitionContinuity({
    fromPath: "/nursing-glossary",
    toPath: "/nursing-glossary/hyperkalemia",
    fromBreadcrumbListCount: 1,
    toBreadcrumbListCount: 1,
  });
  assert.deepEqual(issues, []);
});
