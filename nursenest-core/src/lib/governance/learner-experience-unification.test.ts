import assert from "node:assert/strict";
import test from "node:test";
import {
  auditLearnerExperienceUnification,
  MANDATORY_SHARED_EXPERIENCES,
  policyForPathway,
  resolveUnifiedLearnerExperience,
  UNIFIED_LEARNER_PATHWAYS,
  UNIFIED_LEARNER_SURFACES,
  type UnifiedLearnerExperienceKey,
  type UnifiedLearnerPathway,
} from "./learner-experience-unification";

const SHARED_INTERFACE_EXPERIENCES: readonly UnifiedLearnerExperienceKey[] = [
  "questions",
  "flashcards",
  "lessons",
  "clinical_skills",
  "pharmacology",
  "analytics",
  "readiness",
  "profile",
  "progress",
  "study_plans",
] as const;

test("all learner pathways inherit the mandatory shared experiences", () => {
  for (const pathway of UNIFIED_LEARNER_PATHWAYS) {
    const policy = policyForPathway(pathway);
    for (const experience of MANDATORY_SHARED_EXPERIENCES) {
      assert.ok(
        policy.inheritsExperiences.includes(experience),
        `${pathway} must inherit ${experience}`,
      );
    }
  }
});

test("shared interfaces resolve to one canonical surface regardless of pathway", () => {
  const pathways: readonly UnifiedLearnerPathway[] = [
    "rn",
    "rpn_pn",
    "np",
    "allied_health",
    "new_grad",
    "pre_nursing",
  ] as const;

  for (const experience of SHARED_INTERFACE_EXPERIENCES) {
    const routes = new Set(
      pathways.map((pathway) => resolveUnifiedLearnerExperience(pathway, experience).canonicalRoute),
    );
    const shellOwners = new Set(
      pathways.map((pathway) => resolveUnifiedLearnerExperience(pathway, experience).shellOwner),
    );
    assert.equal(routes.size, 1, `${experience} should not fork routes by pathway`);
    assert.equal(shellOwners.size, 1, `${experience} should not fork shell owners by pathway`);
  }
});

test("Allied Health and New Grad explicitly inherit the flagship shared ecosystem", () => {
  const allied = policyForPathway("allied_health");
  const newGrad = policyForPathway("new_grad");

  for (const experience of [
    "questions",
    "flashcards",
    "lessons",
    "analytics",
    "clinical_skills",
    "readiness",
  ] as const) {
    assert.ok(allied.inheritsExperiences.includes(experience), `Allied Health must inherit ${experience}`);
  }

  for (const experience of [
    "questions",
    "flashcards",
    "lessons",
    "analytics",
    "clinical_skills",
    "pharmacology",
    "simulations",
    "readiness",
  ] as const) {
    assert.ok(newGrad.inheritsExperiences.includes(experience), `New Grad must inherit ${experience}`);
  }

  assert.ok(newGrad.contentDifferentiators.includes("transition-to-practice"));
  assert.ok(newGrad.contentDifferentiators.includes("orientation readiness"));
  assert.ok(allied.contentDifferentiators.includes("profession-specific competencies"));
});

test("CAT and LOFT may differ by engine while preserving shared shells", () => {
  const cat = resolveUnifiedLearnerExperience("rn", "cat");
  const loft = resolveUnifiedLearnerExperience("np", "loft");

  assert.equal(cat.canonicalRoute, "/app/practice-tests");
  assert.equal(loft.canonicalRoute, "/app/cases/cnple");
  assert.ok(cat.allowedEngines?.some((engine) => engine.includes("CAT")));
  assert.ok(loft.allowedEngines?.some((engine) => engine.includes("LOFT")));
  assert.match(cat.shellOwner, /practice-test-runner/);
  assert.match(loft.shellOwner, /cnple-longitudinal-case-shell/);
});

test("every canonical surface declares forbidden duplicate interface patterns", () => {
  for (const surface of UNIFIED_LEARNER_SURFACES) {
    assert.ok(surface.forbiddenForks.length > 0, `${surface.key} needs duplicate-interface guards`);
    for (const fork of surface.forbiddenForks) {
      assert.doesNotMatch(fork, /\s/, `${surface.key} forbidden fork pattern should be machine-readable`);
    }
  }
});

test("learner experience governance audit is clean", () => {
  assert.deepEqual(auditLearnerExperienceUnification(), []);
});
