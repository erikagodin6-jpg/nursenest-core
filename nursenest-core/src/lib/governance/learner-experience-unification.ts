export type UnifiedLearnerPathway =
  | "rn"
  | "rpn_pn"
  | "np"
  | "allied_health"
  | "new_grad"
  | "pre_nursing"
  | "ecg"
  | "clinical_skills"
  | "pharmacology"
  | "future_specialty";

export type UnifiedLearnerExperienceKey =
  | "questions"
  | "flashcards"
  | "lessons"
  | "cat"
  | "loft"
  | "simulations"
  | "clinical_skills"
  | "pharmacology"
  | "analytics"
  | "readiness"
  | "profile"
  | "progress"
  | "study_plans";

export type UnifiedLearnerSurface = {
  key: UnifiedLearnerExperienceKey;
  canonicalRoute: string;
  shellOwner: string;
  contentVariesBy: "pathway" | "profession" | "specialty" | "exam_engine" | "none";
  allowedEngines?: readonly string[];
  forbiddenForks: readonly string[];
};

export type UnifiedLearnerPathwayPolicy = {
  pathway: UnifiedLearnerPathway;
  inheritsExperiences: readonly UnifiedLearnerExperienceKey[];
  contentDifferentiators: readonly string[];
};

export type LearnerExperienceGovernanceViolation = {
  code:
    | "missing_shared_experience"
    | "route_fork"
    | "shell_fork"
    | "missing_forbidden_fork_guard";
  detail: string;
};

export const UNIFIED_LEARNER_PATHWAYS: readonly UnifiedLearnerPathway[] = [
  "rn",
  "rpn_pn",
  "np",
  "allied_health",
  "new_grad",
  "pre_nursing",
  "ecg",
  "clinical_skills",
  "pharmacology",
  "future_specialty",
] as const;

export const MANDATORY_SHARED_EXPERIENCES: readonly UnifiedLearnerExperienceKey[] = [
  "questions",
  "flashcards",
  "lessons",
  "cat",
  "loft",
  "simulations",
  "clinical_skills",
  "pharmacology",
  "analytics",
  "readiness",
  "profile",
  "progress",
  "study_plans",
] as const;

export const UNIFIED_LEARNER_SURFACES: readonly UnifiedLearnerSurface[] = [
  {
    key: "questions",
    canonicalRoute: "/app/practice-tests",
    shellOwner: "components/student/practice-question-session-client.tsx",
    contentVariesBy: "pathway",
    forbiddenForks: ["rn-question-layout", "np-question-layout", "allied-question-layout", "new-grad-question-layout"],
  },
  {
    key: "flashcards",
    canonicalRoute: "/app/flashcards",
    shellOwner: "components/flashcards/*",
    contentVariesBy: "pathway",
    forbiddenForks: ["allied-flashcard-layout", "new-grad-flashcard-layout", "np-flashcard-layout"],
  },
  {
    key: "lessons",
    canonicalRoute: "/app/lessons",
    shellOwner: "components/pathway-lessons/*",
    contentVariesBy: "pathway",
    forbiddenForks: ["allied-lesson-experience", "new-grad-lesson-experience", "np-lesson-experience"],
  },
  {
    key: "cat",
    canonicalRoute: "/app/practice-tests",
    shellOwner: "components/student/practice-test-runner-client.tsx",
    contentVariesBy: "exam_engine",
    allowedEngines: ["NCLEX CAT", "REx-PN CAT", "CPNRE CAT", "profession-specific CAT"],
    forbiddenForks: ["rn-cat-shell", "rpn-cat-shell", "allied-cat-shell"],
  },
  {
    key: "loft",
    canonicalRoute: "/app/cases/cnple",
    shellOwner: "components/cases/cnple-longitudinal-case-shell.tsx",
    contentVariesBy: "exam_engine",
    allowedEngines: ["CNPLE LOFT", "future LOFT-compatible profession engines"],
    forbiddenForks: ["np-loft-shell", "cnple-only-layout-copy"],
  },
  {
    key: "simulations",
    canonicalRoute: "/app/clinical-scenarios",
    shellOwner: "components/cases/* + components/clinical-scenarios/*",
    contentVariesBy: "specialty",
    allowedEngines: ["longitudinal_case", "loft_simulation", "clinical_scenario", "future profession simulation"],
    forbiddenForks: ["rn-simulation-app", "allied-simulation-app", "new-grad-simulation-app"],
  },
  {
    key: "clinical_skills",
    canonicalRoute: "/app/clinical-skills",
    shellOwner: "components/clinical-skills/*",
    contentVariesBy: "profession",
    forbiddenForks: ["rn-clinical-skills-layout", "allied-clinical-skills-layout", "new-grad-skills-app"],
  },
  {
    key: "pharmacology",
    canonicalRoute: "/app/pharmacology",
    shellOwner: "components/pharmacology/pharmacology-hub-client.tsx",
    contentVariesBy: "pathway",
    forbiddenForks: ["rn-pharmacology-layout", "np-pharmacology-layout", "allied-pharmacology-layout", "new-grad-pharmacology-layout"],
  },
  {
    key: "analytics",
    canonicalRoute: "/app/account/progress",
    shellOwner: "components/student/dashboard/* + components/study/*",
    contentVariesBy: "pathway",
    forbiddenForks: ["allied-analytics-dashboard", "new-grad-analytics-dashboard", "np-analytics-dashboard"],
  },
  {
    key: "readiness",
    canonicalRoute: "/app/account/readiness",
    shellOwner: "components/study/*",
    contentVariesBy: "pathway",
    forbiddenForks: ["rn-readiness-engine", "np-readiness-engine", "allied-readiness-engine"],
  },
  {
    key: "profile",
    canonicalRoute: "/app/profile",
    shellOwner: "components/learner-account-ui/*",
    contentVariesBy: "none",
    forbiddenForks: ["allied-profile", "new-grad-profile", "np-profile"],
  },
  {
    key: "progress",
    canonicalRoute: "/app/account/progress",
    shellOwner: "components/student/learner-progress-page-content.tsx",
    contentVariesBy: "pathway",
    forbiddenForks: ["allied-progress-page", "new-grad-progress-page", "np-progress-page"],
  },
  {
    key: "study_plans",
    canonicalRoute: "/app/study-coach",
    shellOwner: "components/study/* + components/student/study-planner-shell.tsx",
    contentVariesBy: "pathway",
    forbiddenForks: ["allied-study-plan-ui", "new-grad-study-plan-ui", "np-study-plan-ui"],
  },
] as const;

const UNIVERSAL_EXPERIENCES = new Set(MANDATORY_SHARED_EXPERIENCES);

export const UNIFIED_LEARNER_PATHWAY_POLICIES: readonly UnifiedLearnerPathwayPolicy[] = [
  {
    pathway: "rn",
    inheritsExperiences: MANDATORY_SHARED_EXPERIENCES,
    contentDifferentiators: ["NCLEX-RN", "NGN", "clinical judgment", "CAT readiness"],
  },
  {
    pathway: "rpn_pn",
    inheritsExperiences: MANDATORY_SHARED_EXPERIENCES,
    contentDifferentiators: ["REx-PN", "CPNRE", "foundational nursing", "practical nursing scope"],
  },
  {
    pathway: "np",
    inheritsExperiences: MANDATORY_SHARED_EXPERIENCES,
    contentDifferentiators: ["CNPLE", "LOFT", "diagnostic reasoning", "prescribing decisions"],
  },
  {
    pathway: "allied_health",
    inheritsExperiences: MANDATORY_SHARED_EXPERIENCES,
    contentDifferentiators: ["profession-specific competencies", "scope-specific scenarios", "allied readiness"],
  },
  {
    pathway: "new_grad",
    inheritsExperiences: MANDATORY_SHARED_EXPERIENCES,
    contentDifferentiators: [
      "telemetry",
      "ICU",
      "emergency",
      "maternal",
      "pediatrics",
      "mental health",
      "leadership",
      "transition-to-practice",
      "residency preparation",
      "orientation readiness",
    ],
  },
  {
    pathway: "pre_nursing",
    inheritsExperiences: MANDATORY_SHARED_EXPERIENCES,
    contentDifferentiators: ["foundations", "confidence building", "pre-program readiness"],
  },
  {
    pathway: "ecg",
    inheritsExperiences: MANDATORY_SHARED_EXPERIENCES,
    contentDifferentiators: ["telemetry", "rhythm interpretation", "clinical response", "medication implications"],
  },
  {
    pathway: "clinical_skills",
    inheritsExperiences: MANDATORY_SHARED_EXPERIENCES,
    contentDifferentiators: ["competency checks", "procedural simulation", "skill catalogs"],
  },
  {
    pathway: "pharmacology",
    inheritsExperiences: MANDATORY_SHARED_EXPERIENCES,
    contentDifferentiators: ["drug classes", "medication safety", "calculations", "clinical decision-making"],
  },
  {
    pathway: "future_specialty",
    inheritsExperiences: MANDATORY_SHARED_EXPERIENCES,
    contentDifferentiators: ["specialty content", "profession scope", "exam engine when needed"],
  },
] as const;

export function surfaceForExperience(key: UnifiedLearnerExperienceKey): UnifiedLearnerSurface {
  const surface = UNIFIED_LEARNER_SURFACES.find((item) => item.key === key);
  if (!surface) throw new Error(`Missing unified learner surface for ${key}`);
  return surface;
}

export function policyForPathway(pathway: UnifiedLearnerPathway): UnifiedLearnerPathwayPolicy {
  const policy = UNIFIED_LEARNER_PATHWAY_POLICIES.find((item) => item.pathway === pathway);
  if (!policy) throw new Error(`Missing learner pathway policy for ${pathway}`);
  return policy;
}

export function resolveUnifiedLearnerExperience(
  pathway: UnifiedLearnerPathway,
  experience: UnifiedLearnerExperienceKey,
): UnifiedLearnerSurface {
  const policy = policyForPathway(pathway);
  if (!policy.inheritsExperiences.includes(experience)) {
    throw new Error(`${pathway} does not inherit ${experience}`);
  }
  return surfaceForExperience(experience);
}

export function auditLearnerExperienceUnification(): LearnerExperienceGovernanceViolation[] {
  const violations: LearnerExperienceGovernanceViolation[] = [];
  const surfaceKeys = new Set(UNIFIED_LEARNER_SURFACES.map((surface) => surface.key));

  for (const experience of MANDATORY_SHARED_EXPERIENCES) {
    if (!surfaceKeys.has(experience)) {
      violations.push({
        code: "missing_shared_experience",
        detail: `No canonical surface registered for ${experience}.`,
      });
    }
  }

  for (const policy of UNIFIED_LEARNER_PATHWAY_POLICIES) {
    for (const experience of UNIVERSAL_EXPERIENCES) {
      if (!policy.inheritsExperiences.includes(experience)) {
        violations.push({
          code: "missing_shared_experience",
          detail: `${policy.pathway} does not inherit ${experience}.`,
        });
      }
    }
  }

  for (const surface of UNIFIED_LEARNER_SURFACES) {
    if (!surface.canonicalRoute.startsWith("/app/")) {
      violations.push({
        code: "route_fork",
        detail: `${surface.key} must resolve to learner app route, got ${surface.canonicalRoute}.`,
      });
    }
    if (!surface.shellOwner || !surface.shellOwner.includes("components/")) {
      violations.push({
        code: "shell_fork",
        detail: `${surface.key} must name a shared component owner.`,
      });
    }
    if (surface.forbiddenForks.length === 0) {
      violations.push({
        code: "missing_forbidden_fork_guard",
        detail: `${surface.key} must declare forbidden duplicate interface patterns.`,
      });
    }
  }

  return violations;
}
