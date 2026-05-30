import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ALLIED_PROFESSION_MAPS,
  CROSS_PROFESSION_IDS,
  CROSS_PROFESSION_PROFILES,
  CROSS_PROFESSION_QA_REQUIREMENTS,
  PREMIUM_EXPERIENCE_CONTRACTS,
  SHARED_THEME_CONTRACT,
  assertNoRnOnlyPremiumExperience,
  getCrossProfessionProfile,
  listAlliedProfessionMaps,
  professionsMissingExperience,
  type PremiumExperienceId,
} from "./cross-profession-design-system";

describe("cross-profession design system expansion", () => {
  it("treats every requested learner group as a first-class premium ecosystem", () => {
    assert.deepEqual(CROSS_PROFESSION_IDS, [
      "rn",
      "rpn",
      "np",
      "rt",
      "allied",
      "new-grad",
      "ecg",
      "advanced-ecg",
    ]);

    for (const profile of CROSS_PROFESSION_PROFILES) {
      assert.ok(profile.competencyDomains.length >= 4, `${profile.id} needs competency domains`);
      assert.ok(profile.clinicalSkillFocus.length >= 4, `${profile.id} needs clinical skills focus`);
      assert.ok(profile.simulationOpportunities.length >= 3, `${profile.id} needs simulation opportunities`);
      assert.ok(profile.analyticsDomains.length >= 4, `${profile.id} needs analytics domains`);
    }
  });

  it("keeps premium experiences shared rather than RN-only", () => {
    const expected: readonly PremiumExperienceId[] = [
      "flashcards",
      "practice-questions",
      "analytics",
      "pharmacology",
      "clinical-skills",
      "simulations",
    ];

    assert.deepEqual(PREMIUM_EXPERIENCE_CONTRACTS.map((contract) => contract.id), expected);
    for (const experience of expected) {
      assert.equal(assertNoRnOnlyPremiumExperience(experience), true, `${experience} must not be RN-only`);
    }
  });

  it("guarantees premium flashcard parity across RN, RPN, NP, RT, Allied, and New Grad", () => {
    const flashcards = PREMIUM_EXPERIENCE_CONTRACTS.find((contract) => contract.id === "flashcards");
    assert.ok(flashcards);
    assert.deepEqual(flashcards.requiredProfessions, ["rn", "rpn", "np", "rt", "allied", "new-grad"]);

    for (const capability of [
      "rationales",
      "tutor-mode",
      "hint-system",
      "si-conv",
      "community-performance",
      "confidence-tracking",
      "adaptive-remediation",
      "theme-aware-visuals",
      "mobile-optimization",
    ]) {
      assert.ok(flashcards.requiredCapabilities.includes(capability), `${capability} missing from flashcards`);
    }
  });

  it("guarantees advanced assessment formats are available to every appropriate profession", () => {
    const questions = PREMIUM_EXPERIENCE_CONTRACTS.find((contract) => contract.id === "practice-questions");
    assert.ok(questions);
    assert.deepEqual(questions.requiredProfessions, ["rn", "rpn", "np", "rt", "allied", "new-grad"]);

    for (const format of ["mcq", "sata", "bowtie", "matrix", "prioritization", "delegation", "sequencing", "case-studies"]) {
      assert.ok(questions.requiredCapabilities.includes(format), `${format} format missing`);
    }
  });

  it("keeps analytics shared while allowing competencies to differ", () => {
    const analytics = PREMIUM_EXPERIENCE_CONTRACTS.find((contract) => contract.id === "analytics");
    assert.ok(analytics);
    assert.deepEqual(analytics.requiredProfessions, CROSS_PROFESSION_IDS);

    for (const capability of [
      "weak-areas",
      "mastered-topics",
      "confidence-trends",
      "study-activity",
      "performance-heat-maps",
      "competency-tracking",
      "learning-streaks",
      "community-benchmarks",
    ]) {
      assert.ok(analytics.requiredCapabilities.includes(capability), `${capability} analytics missing`);
    }
    assert.ok(analytics.contentDiffersOnlyBy.includes("competency labels"));
  });

  it("maps profession-specific pharmacology without forking the layout system", () => {
    assert.ok(getCrossProfessionProfile("rn").pharmacologyFocus.includes("medical-surgical medications"));
    assert.ok(getCrossProfessionProfile("rpn").pharmacologyFocus.includes("entry-to-practice medication administration"));
    assert.ok(getCrossProfessionProfile("np").pharmacologyFocus.includes("advanced prescribing and therapeutics"));
    assert.ok(getCrossProfessionProfile("rt").pharmacologyFocus.includes("respiratory rescue therapies"));
    assert.ok(getCrossProfessionProfile("allied").pharmacologyFocus.includes("profession-specific medications where applicable"));
    assert.ok(getCrossProfessionProfile("new-grad").pharmacologyFocus.includes("medication confidence curriculum"));

    const pharmacology = PREMIUM_EXPERIENCE_CONTRACTS.find((contract) => contract.id === "pharmacology");
    assert.equal(pharmacology?.sharedPrimitive, "premium-pharmacology-framework");
  });

  it("defines clinical skills as a shared architecture with profession-specific skill maps", () => {
    const skills = PREMIUM_EXPERIENCE_CONTRACTS.find((contract) => contract.id === "clinical-skills");
    assert.ok(skills);
    for (const capability of [
      "lesson",
      "flashcards-link",
      "questions-link",
      "common-errors",
      "clinical-reasoning",
      "escalation-criteria",
      "practice-scenarios",
      "simulation-links",
    ]) {
      assert.ok(skills.requiredCapabilities.includes(capability), `${capability} clinical skills capability missing`);
    }
  });

  it("creates Allied profession maps for competencies, skills, pharmacology, judgment, simulation, and analytics", () => {
    assert.deepEqual(
      listAlliedProfessionMaps().map((profession) => profession.id),
      [
        "respiratory-therapy",
        "medical-laboratory",
        "diagnostic-imaging",
        "paramedicine",
        "occupational-therapy",
        "physiotherapy",
        "speech-language-pathology",
        "social-work",
        "other-allied",
      ],
    );

    for (const profession of ALLIED_PROFESSION_MAPS) {
      assert.ok(profession.competencies.length >= 3, `${profession.id} competencies missing`);
      assert.ok(profession.skills.length >= 3, `${profession.id} skills missing`);
      assert.ok(profession.pharmacology.length >= 1, `${profession.id} pharmacology missing`);
      assert.ok(profession.clinicalJudgment.length >= 2, `${profession.id} clinical judgment missing`);
      assert.ok(profession.simulationOpportunities.length >= 2, `${profession.id} simulations missing`);
      assert.ok(profession.analyticsDomains.length >= 3, `${profession.id} analytics missing`);
    }
  });

  it("keeps all shared experiences theme-compatible across the five NurseNest themes", () => {
    assert.deepEqual(SHARED_THEME_CONTRACT, ["ocean", "blossom", "midnight", "aurora", "sunset"]);
    for (const contract of PREMIUM_EXPERIENCE_CONTRACTS) {
      assert.ok(contract.requiredCapabilities.includes("theme-aware-visuals") || contract.id === "practice-questions" || contract.id === "analytics" || contract.id === "clinical-skills");
      assert.ok(contract.sharedPrimitive.startsWith("premium-"), `${contract.id} must use premium shared primitive`);
    }
  });

  it("requires QA across RN, RPN, NP, RT, Allied, and New Grad before major features ship", () => {
    const featureRelease = CROSS_PROFESSION_QA_REQUIREMENTS.find((requirement) => requirement.id === "feature-release-matrix");
    assert.ok(featureRelease);
    assert.deepEqual(featureRelease.professions, ["rn", "rpn", "np", "rt", "allied", "new-grad"]);
    assert.deepEqual(featureRelease.themes, SHARED_THEME_CONTRACT);
    assert.ok(featureRelease.artifacts.includes("visual regression report"));
  });

  it("does not mark ECG-only products as missing from non-ECG profession-specific activities", () => {
    assert.deepEqual(professionsMissingExperience("flashcards"), ["ecg", "advanced-ecg"]);
    assert.deepEqual(professionsMissingExperience("simulations"), ["ecg", "advanced-ecg"]);
    assert.deepEqual(professionsMissingExperience("analytics"), []);
  });
});
