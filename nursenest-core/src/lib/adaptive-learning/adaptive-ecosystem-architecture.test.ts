import assert from "node:assert/strict";
import test from "node:test";

import {
  evaluateAdaptiveEcosystemReadiness,
  REQUIRED_ADAPTIVE_ECOSYSTEM_CAPABILITIES,
  REQUIRED_ADAPTIVE_ECOSYSTEM_SURFACES,
} from "@/lib/adaptive-learning/adaptive-ecosystem-architecture";

test("passes only when all adaptive surfaces and transparency capabilities are present", () => {
  const result = evaluateAdaptiveEcosystemReadiness({
    surfaces: REQUIRED_ADAPTIVE_ECOSYSTEM_SURFACES,
    capabilities: REQUIRED_ADAPTIVE_ECOSYSTEM_CAPABILITIES,
    sharedLayoutTokens: true,
    sharedReasoningPanel: true,
    sharedAdaptiveExplanationPattern: true,
    publicReleaseReady: true,
    protectedActivitySurfacesUntouched: true,
    evidence: {
      tests: ["adaptive ecosystem contract", "clinical adaptive engine"],
      auditedRoutes: ["/app", "/app/lessons", "/app/flashcards", "/app/practice-tests"],
    },
  });

  assert.equal(result.enterpriseReady, true);
  assert.equal(result.publicReleaseAllowed, true);
  assert.equal(result.issues.length, 0);
});

test("blocks fragmented adaptive ecosystems from enterprise readiness", () => {
  const result = evaluateAdaptiveEcosystemReadiness({
    surfaces: ["lessons", "flashcards"],
    capabilities: ["adaptive_feed", "readiness_dashboard"],
    sharedLayoutTokens: false,
    sharedReasoningPanel: false,
    sharedAdaptiveExplanationPattern: false,
    publicReleaseReady: false,
    protectedActivitySurfacesUntouched: true,
    evidence: {
      tests: [],
      auditedRoutes: [],
      knownGaps: ["reasoning visualization is not unified"],
    },
  });

  assert.equal(result.enterpriseReady, false);
  assert.equal(result.publicReleaseAllowed, false);
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_SURFACE"));
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_CAPABILITY"));
  assert.ok(result.issues.some((issue) => issue.code === "FRAGMENTED_LAYOUT_LANGUAGE"));
  assert.ok(result.issues.some((issue) => issue.code === "OPAQUE_ADAPTIVE_LOGIC"));
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_VERIFICATION_EVIDENCE"));
});

test("public release remains blocked when known gaps remain even if architecture is otherwise connected", () => {
  const result = evaluateAdaptiveEcosystemReadiness({
    surfaces: REQUIRED_ADAPTIVE_ECOSYSTEM_SURFACES,
    capabilities: REQUIRED_ADAPTIVE_ECOSYSTEM_CAPABILITIES,
    sharedLayoutTokens: true,
    sharedReasoningPanel: true,
    sharedAdaptiveExplanationPattern: true,
    publicReleaseReady: false,
    protectedActivitySurfacesUntouched: true,
    evidence: {
      tests: ["adaptive ecosystem contract"],
      auditedRoutes: ["/app"],
      knownGaps: ["public route screenshots not verified"],
    },
  });

  assert.equal(result.enterpriseReady, true);
  assert.equal(result.publicReleaseAllowed, false);
  assert.deepEqual(
    result.issues.map((issue) => issue.code),
    ["PUBLIC_RELEASE_NOT_READY"],
  );
});

test("protected activity surface changes fail architecture-only readiness", () => {
  const result = evaluateAdaptiveEcosystemReadiness({
    surfaces: REQUIRED_ADAPTIVE_ECOSYSTEM_SURFACES,
    capabilities: REQUIRED_ADAPTIVE_ECOSYSTEM_CAPABILITIES,
    sharedLayoutTokens: true,
    sharedReasoningPanel: true,
    sharedAdaptiveExplanationPattern: true,
    publicReleaseReady: true,
    protectedActivitySurfacesUntouched: false,
    evidence: {
      tests: ["adaptive ecosystem contract"],
      auditedRoutes: ["/app"],
    },
  });

  assert.equal(result.enterpriseReady, false);
  assert.ok(result.issues.some((issue) => issue.code === "PROTECTED_ACTIVITY_SURFACE_CHANGED"));
});
