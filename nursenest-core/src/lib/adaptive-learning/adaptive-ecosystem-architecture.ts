export type AdaptiveEcosystemSurface =
  | "lessons"
  | "flashcards"
  | "practice_exams"
  | "cat_loft_exams"
  | "simulations"
  | "analytics"
  | "remediation"
  | "ai_tutor";

export type AdaptiveEcosystemCapability =
  | "competency_map"
  | "adaptive_feed"
  | "safety_risk_indicators"
  | "readiness_dashboard"
  | "reasoning_visualization"
  | "confidence_calibration"
  | "spaced_repetition"
  | "case_progression"
  | "remediation_queue"
  | "profession_scope";

export type AdaptiveEcosystemReadinessInput = {
  surfaces: readonly AdaptiveEcosystemSurface[];
  capabilities: readonly AdaptiveEcosystemCapability[];
  sharedLayoutTokens: boolean;
  sharedReasoningPanel: boolean;
  sharedAdaptiveExplanationPattern: boolean;
  publicReleaseReady: boolean;
  protectedActivitySurfacesUntouched: boolean;
  evidence: {
    tests: readonly string[];
    auditedRoutes: readonly string[];
    knownGaps?: readonly string[];
  };
};

export type AdaptiveEcosystemIssueCode =
  | "MISSING_SURFACE"
  | "MISSING_CAPABILITY"
  | "FRAGMENTED_LAYOUT_LANGUAGE"
  | "FRAGMENTED_REASONING_DISPLAY"
  | "OPAQUE_ADAPTIVE_LOGIC"
  | "PROTECTED_ACTIVITY_SURFACE_CHANGED"
  | "PUBLIC_RELEASE_NOT_READY"
  | "MISSING_VERIFICATION_EVIDENCE";

export type AdaptiveEcosystemIssue = {
  code: AdaptiveEcosystemIssueCode;
  severity: "warning" | "error";
  message: string;
  remediation: string;
};

export type AdaptiveEcosystemReadinessResult = {
  enterpriseReady: boolean;
  publicReleaseAllowed: boolean;
  issues: AdaptiveEcosystemIssue[];
};

export const REQUIRED_ADAPTIVE_ECOSYSTEM_SURFACES = [
  "lessons",
  "flashcards",
  "practice_exams",
  "cat_loft_exams",
  "simulations",
  "analytics",
  "remediation",
  "ai_tutor",
] as const satisfies readonly AdaptiveEcosystemSurface[];

export const REQUIRED_ADAPTIVE_ECOSYSTEM_CAPABILITIES = [
  "competency_map",
  "adaptive_feed",
  "safety_risk_indicators",
  "readiness_dashboard",
  "reasoning_visualization",
  "confidence_calibration",
  "spaced_repetition",
  "case_progression",
  "remediation_queue",
  "profession_scope",
] as const satisfies readonly AdaptiveEcosystemCapability[];

function addIssue(issues: AdaptiveEcosystemIssue[], issue: AdaptiveEcosystemIssue): void {
  issues.push(issue);
}

export function evaluateAdaptiveEcosystemReadiness(
  input: AdaptiveEcosystemReadinessInput,
): AdaptiveEcosystemReadinessResult {
  const issues: AdaptiveEcosystemIssue[] = [];
  const surfaces = new Set(input.surfaces);
  const capabilities = new Set(input.capabilities);

  for (const surface of REQUIRED_ADAPTIVE_ECOSYSTEM_SURFACES) {
    if (!surfaces.has(surface)) {
      addIssue(issues, {
        code: "MISSING_SURFACE",
        severity: "error",
        message: `Adaptive ecosystem is missing surface "${surface}".`,
        remediation: "Audit the surface and connect it through the shared adaptive workflow before release.",
      });
    }
  }

  for (const capability of REQUIRED_ADAPTIVE_ECOSYSTEM_CAPABILITIES) {
    if (!capabilities.has(capability)) {
      addIssue(issues, {
        code: "MISSING_CAPABILITY",
        severity: "error",
        message: `Adaptive ecosystem is missing capability "${capability}".`,
        remediation: "Add the capability to the shared adaptive contract, learner explanation layer, or analytics model.",
      });
    }
  }

  if (!input.sharedLayoutTokens) {
    addIssue(issues, {
      code: "FRAGMENTED_LAYOUT_LANGUAGE",
      severity: "error",
      message: "Adaptive surfaces do not yet share the same visual hierarchy and layout language.",
      remediation: "Converge surfaces on shared learner shells, cards, semantic tokens, and viewport-safe workspace rules.",
    });
  }

  if (!input.sharedReasoningPanel) {
    addIssue(issues, {
      code: "FRAGMENTED_REASONING_DISPLAY",
      severity: "error",
      message: "Reasoning, rationale, and clinical cue displays are not unified.",
      remediation: "Use a shared reasoning display pattern for unsafe choices, cue relationships, priority trees, and escalation chains.",
    });
  }

  if (!input.sharedAdaptiveExplanationPattern) {
    addIssue(issues, {
      code: "OPAQUE_ADAPTIVE_LOGIC",
      severity: "error",
      message: "Learners cannot consistently see why content is resurfacing or difficulty changed.",
      remediation: "Expose adaptive reasons for resurfacing, remediation, case difficulty, readiness impact, and safety risk.",
    });
  }

  if (!input.protectedActivitySurfacesUntouched) {
    addIssue(issues, {
      code: "PROTECTED_ACTIVITY_SURFACE_CHANGED",
      severity: "error",
      message: "Protected activity surfaces were changed during an architecture-only pass.",
      remediation: "Do not modify flashcards, practice exams, lessons, CAT, or LOFT surfaces unless explicitly scoped and visually verified.",
    });
  }

  if (input.evidence.tests.length === 0 || input.evidence.auditedRoutes.length === 0) {
    addIssue(issues, {
      code: "MISSING_VERIFICATION_EVIDENCE",
      severity: "error",
      message: "Readiness evidence is incomplete.",
      remediation: "Attach targeted tests and route audits before declaring ecosystem work complete.",
    });
  }

  if (!input.publicReleaseReady || (input.evidence.knownGaps?.length ?? 0) > 0) {
    addIssue(issues, {
      code: "PUBLIC_RELEASE_NOT_READY",
      severity: "warning",
      message: "Adaptive ecosystem should remain gated from public release until known gaps are cleared.",
      remediation: "Keep public exposure behind readiness gates until tests, route audits, and protected-surface verification are complete.",
    });
  }

  const hasErrors = issues.some((issue) => issue.severity === "error");
  const hasPublicReleaseWarning = issues.some((issue) => issue.code === "PUBLIC_RELEASE_NOT_READY");

  return {
    enterpriseReady: !hasErrors,
    publicReleaseAllowed: !hasErrors && !hasPublicReleaseWarning && input.publicReleaseReady,
    issues,
  };
}
