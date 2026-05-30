import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  NEW_GRAD_COMMERCIAL_PACKAGES,
  NEW_GRAD_ADAPTIVE_COMPETENCY_PROFILE,
  NEW_GRAD_COMPETENCY_DOMAINS,
  NEW_GRAD_CONTENT_LAUNCH_TARGETS,
  NEW_GRAD_PRACTICE_READINESS_DOMAINS,
  NEW_GRAD_READINESS_DIMENSIONS,
  NEW_GRAD_RESIDENCY_CORE_MODULES,
  NEW_GRAD_RESIDENCY_MARKETING_POSITIONING,
  NEW_GRAD_RESIDENCY_PILLARS,
  NEW_GRAD_RESIDENCY_TRACKS,
  NEW_GRAD_ROADMAP_MILESTONES,
  NEW_GRAD_SHIFT_READINESS_MODULES,
  NEW_GRAD_SIMULATION_CASES,
  NEW_GRAD_SURVIVAL_GUIDES,
  buildNewGradDashboardMetrics,
  calculateNewGradCompetencyCompletion,
  calculateNewGradSpecialtyReadinessScore,
  listNewGradAdaptiveRemediationActivities,
  listNewGradResidencyTracksForPackage,
  listNewGradResidencyTracksMissingWorkAreaHubs,
} from "./new-grad-residency-program";

const here = dirname(fileURLToPath(import.meta.url));
const landingSource = readFileSync(
  join(here, "..", "..", "components", "marketing", "new-grad-marketing-landing.tsx"),
  "utf8",
);

describe("New Grad residency program foundation", () => {
  it("defines the New Graduate Nurse Residency Academy modules, activities, and positioning", () => {
    assert.equal(NEW_GRAD_RESIDENCY_MARKETING_POSITIONING.headline, "Pass The Exam. Thrive In Practice.");
    assert.deepEqual(NEW_GRAD_RESIDENCY_MARKETING_POSITIONING.audience, [
      "New grads",
      "Nurse residency programs",
      "Hospitals",
      "Academic institutions",
    ]);
    assert.deepEqual(
      NEW_GRAD_RESIDENCY_CORE_MODULES.map((module) => module.title),
      [
        "Professional Transition",
        "Time Management",
        "Prioritization",
        "Delegation",
        "Documentation",
        "Clinical Judgment",
        "Communication",
        "Shift Organization",
        "Patient Safety",
        "Code Blue Readiness",
        "Medication Safety",
        "Interprofessional Collaboration",
        "Workplace Resilience",
      ],
    );
    for (const module of NEW_GRAD_RESIDENCY_CORE_MODULES) {
      assert.ok(module.learnerOutcome.length > 50);
      assert.ok(module.requiredActivities.length >= 4);
    }
    assert.ok(
      NEW_GRAD_RESIDENCY_CORE_MODULES.some((module) =>
        module.requiredActivities.includes("shift-management-simulators"),
      ),
    );
    assert.ok(
      NEW_GRAD_RESIDENCY_CORE_MODULES.some((module) => module.requiredActivities.includes("documentation-exercises")),
    );
    assert.ok(
      NEW_GRAD_RESIDENCY_CORE_MODULES.some((module) => module.requiredActivities.includes("ngn-style-scenarios")),
    );
    assert.ok(
      NEW_GRAD_RESIDENCY_CORE_MODULES.some((module) => module.requiredActivities.includes("prioritization-challenges")),
    );
  });

  it("defines the six required residency pillars with real transition-to-practice activities", () => {
    assert.deepEqual(
      NEW_GRAD_RESIDENCY_PILLARS.map((pillar) => pillar.id),
      [
        "surviving-first-year",
        "high-risk-clinical-scenarios",
        "medication-confidence",
        "clinical-skills-mastery",
        "telemetry-ecg-essentials",
        "simulation-center",
      ],
    );
    for (const pillar of NEW_GRAD_RESIDENCY_PILLARS) {
      assert.ok(pillar.positioning.length > 50);
      assert.ok(pillar.topics.length >= 8);
      assert.ok(pillar.requiredActivities.length >= 4);
    }
    assert.ok(NEW_GRAD_RESIDENCY_PILLARS.find((pillar) => pillar.id === "medication-confidence")?.topics.includes("Insulin"));
    assert.ok(NEW_GRAD_RESIDENCY_PILLARS.find((pillar) => pillar.id === "telemetry-ecg-essentials")?.topics.includes("STEMI recognition"));
    assert.ok(NEW_GRAD_RESIDENCY_PILLARS.find((pillar) => pillar.id === "simulation-center")?.topics.includes("End-of-shift handoff"));
  });

  it("defines every requested specialty transition track with a matching work-area hub slug", () => {
    const ids = NEW_GRAD_RESIDENCY_TRACKS.map((track) => track.id);
    assert.deepEqual(ids, [
      "medical-surgical",
      "emergency",
      "icu",
      "telemetry",
      "cardiac",
      "perioperative",
      "pacu",
      "labour-delivery",
      "postpartum",
      "pediatrics",
      "nicu",
      "mental-health",
      "community",
      "home-care",
      "long-term-care",
      "dialysis",
      "oncology",
    ]);
    assert.deepEqual(listNewGradResidencyTracksMissingWorkAreaHubs(), []);
  });

  it("locks the Phase 1 launch content minimums without lowering the product target", () => {
    const minimums = Object.fromEntries(NEW_GRAD_CONTENT_LAUNCH_TARGETS.map((target) => [target.id, target.minimum]));
    assert.equal(minimums.lessons, 500);
    assert.equal(minimums.flashcards, 3000);
    assert.equal(minimums.questions, 5000);
    assert.equal(minimums["clinical-skills"], 100);
    assert.equal(minimums.simulations, 100);
    assert.equal(minimums["medication-lessons"], 250);
    assert.equal(minimums["ecg-lessons"], 100);
    assert.equal(minimums["telemetry-cases"], 250);
    assert.equal(minimums["new-grad-medication-questions"], 500);
    for (const target of NEW_GRAD_CONTENT_LAUNCH_TARGETS) {
      assert.ok(target.rationale.length > 50);
    }
  });

  it("locks the 30/60/90/180/365-day roadmap windows", () => {
    assert.deepEqual(
      NEW_GRAD_ROADMAP_MILESTONES.map((milestone) => milestone.window),
      ["30-day", "60-day", "90-day", "180-day", "365-day"],
    );
    for (const milestone of NEW_GRAD_ROADMAP_MILESTONES) {
      assert.ok(milestone.focus.length > 40);
      assert.ok(milestone.learnerCanAnswer.length >= 3);
      assert.ok(milestone.requiredActivities.includes("lessons"));
      assert.ok(milestone.requiredActivities.includes("questions"));
    }
  });

  it("tracks the required competency checklist domains with evidence sources", () => {
    assert.deepEqual(
      NEW_GRAD_COMPETENCY_DOMAINS.map((domain) => domain.id),
      [
        "knowledge",
        "clinical-skills",
        "communication",
        "documentation",
        "professional-practice",
        "clinical-judgment",
        "time-management",
        "delegation",
        "prioritization",
      ],
    );
    for (const domain of NEW_GRAD_COMPETENCY_DOMAINS) {
      assert.ok(domain.evidenceSources.length > 0);
      assert.ok(domain.description.length > 25);
    }
  });

  it("includes shift readiness, survival guides, and simulation cases for high-risk transition moments", () => {
    assert.ok(NEW_GRAD_SHIFT_READINESS_MODULES.some((module) => module.id === "first-shift"));
    assert.ok(NEW_GRAD_SHIFT_READINESS_MODULES.some((module) => module.id === "first-night-shift"));
    assert.ok(NEW_GRAD_SHIFT_READINESS_MODULES.some((module) => module.id === "first-charge-shift"));
    assert.ok(NEW_GRAD_SHIFT_READINESS_MODULES.some((module) => module.id === "first-icu-assignment"));
    assert.ok(NEW_GRAD_SHIFT_READINESS_MODULES.some((module) => module.id === "first-telemetry-assignment"));

    assert.ok(NEW_GRAD_SURVIVAL_GUIDES.some((guide) => guide.id === "icu-emergencies"));
    assert.ok(NEW_GRAD_SURVIVAL_GUIDES.some((guide) => guide.id === "telemetry-pitfalls"));
    assert.ok(NEW_GRAD_SURVIVAL_GUIDES.some((guide) => guide.id === "er-priorities"));
    assert.ok(NEW_GRAD_SURVIVAL_GUIDES.some((guide) => guide.id === "medication-errors"));
    assert.ok(NEW_GRAD_SURVIVAL_GUIDES.some((guide) => guide.id === "documentation-mistakes"));

    assert.ok(NEW_GRAD_SIMULATION_CASES.some((scenario) => scenario.id === "icu-septic-shock"));
    assert.ok(NEW_GRAD_SIMULATION_CASES.some((scenario) => scenario.id === "icu-ards-ventilation"));
    assert.ok(NEW_GRAD_SIMULATION_CASES.some((scenario) => scenario.id === "telemetry-new-afib"));
    assert.ok(NEW_GRAD_SIMULATION_CASES.some((scenario) => scenario.id === "telemetry-complete-heart-block"));
    assert.ok(NEW_GRAD_SIMULATION_CASES.some((scenario) => scenario.id === "emergency-stroke-alert"));
    assert.ok(NEW_GRAD_SIMULATION_CASES.some((scenario) => scenario.id === "emergency-stemi"));
  });

  it("defines readiness dimensions and deterministic scoring helpers", () => {
    assert.deepEqual(
      NEW_GRAD_READINESS_DIMENSIONS.map((dimension) => dimension.id),
      [
        "clinical-confidence",
        "skill-readiness",
        "medication-readiness",
        "telemetry-readiness",
        "simulation-readiness",
        "orientation-progress",
      ],
    );
    assert.equal(
      NEW_GRAD_READINESS_DIMENSIONS.reduce((sum, dimension) => sum + dimension.weight, 0),
      100,
    );
    assert.equal(
      calculateNewGradCompetencyCompletion({
        completedEvidenceSources: ["lessons", "questions"],
        requiredEvidenceSources: ["lessons", "questions", "simulations", "clinical-skills"],
      }),
      50,
    );
    assert.equal(
      calculateNewGradSpecialtyReadinessScore({
        "clinical-confidence": 80,
        "skill-readiness": 70,
        "medication-readiness": 60,
        "telemetry-readiness": 50,
        "simulation-readiness": 40,
        "orientation-progress": 90,
      }),
      64,
    );
    assert.deepEqual(
      buildNewGradDashboardMetrics({
        "clinical-confidence": 80,
        "skill-readiness": 70,
        "medication-readiness": 60,
        "telemetry-readiness": 50,
        "simulation-readiness": 40,
        "orientation-progress": 90,
      }).map((metric) => metric.label),
      [
        "Clinical Confidence",
        "Skill Readiness",
        "Medication Readiness",
        "Telemetry Readiness",
        "Simulation Readiness",
        "Orientation Progress",
        "Competency Heat Map",
      ],
    );
  });

  it("defines the requested practice-readiness domains for first-year nursing support", () => {
    assert.deepEqual(
      NEW_GRAD_PRACTICE_READINESS_DOMAINS.map((domain) => domain.label),
      [
        "Patient Safety",
        "Delegation",
        "Communication",
        "Clinical Judgment",
        "Documentation",
        "Professional Development",
        "Medication Administration",
        "Emergency Response",
      ],
    );
    for (const domain of NEW_GRAD_PRACTICE_READINESS_DOMAINS) {
      assert.ok(domain.description.length > 50);
      assert.ok(domain.evidenceSources.length >= 3);
    }
  });

  it("defines a dedicated adaptive competency profile that routes weak areas to ecosystem activities", () => {
    assert.deepEqual(
      NEW_GRAD_ADAPTIVE_COMPETENCY_PROFILE.map((profile) => profile.id),
      ["clinical-judgment", "pharmacology", "prioritization", "delegation", "communication", "documentation", "ecg", "skills"],
    );
    assert.deepEqual(listNewGradAdaptiveRemediationActivities("pharmacology"), [
      "pharmacology",
      "flashcards",
      "questions",
      "dosage-calculations",
    ]);
    assert.ok(listNewGradAdaptiveRemediationActivities("ecg").includes("rhythm-drills"));
    for (const profile of NEW_GRAD_ADAPTIVE_COMPETENCY_PROFILE) {
      assert.ok(profile.weakAreaEvidence.length >= 3);
      assert.ok(profile.remediationActivities.length >= 3);
    }
  });

  it("maps specialty tracks to commercial packages without replacing the existing NEW_GRAD tier", () => {
    assert.deepEqual(
      NEW_GRAD_COMMERCIAL_PACKAGES.map((pkg) => pkg.key),
      [
        "new-grad-base",
        "icu-specialty",
        "telemetry-specialty",
        "emergency-specialty",
        "perioperative-specialty",
        "cardiac-specialty",
        "specialty-library",
      ],
    );
    assert.deepEqual(
      listNewGradResidencyTracksForPackage("new-grad-base").map((track) => track.id),
      ["medical-surgical", "community", "home-care", "long-term-care"],
    );
    for (const pkg of NEW_GRAD_COMMERCIAL_PACKAGES) {
      assert.ok(pkg.entitlementHint.includes("NEW_GRAD") || pkg.entitlementHint.includes("add-on"));
    }
  });

  it("surfaces the residency program foundation on the New Grad marketing landing", () => {
    assert.ok(landingSource.includes("data-nn-new-grad-residency-program"));
    assert.ok(landingSource.includes("NEW_GRAD_ROADMAP_MILESTONES"));
    assert.ok(landingSource.includes("NEW_GRAD_RESIDENCY_PILLARS"));
    assert.ok(landingSource.includes("NEW_GRAD_RESIDENCY_CORE_MODULES"));
    assert.ok(landingSource.includes("NEW_GRAD_PRACTICE_READINESS_DOMAINS"));
    assert.ok(landingSource.includes("NEW_GRAD_RESIDENCY_MARKETING_POSITIONING"));
    assert.ok(landingSource.includes("NEW_GRAD_CONTENT_LAUNCH_TARGETS"));
    assert.ok(landingSource.includes("NEW_GRAD_RESIDENCY_TRACKS"));
    assert.ok(landingSource.includes("NEW_GRAD_COMPETENCY_DOMAINS"));
    assert.ok(landingSource.includes("NEW_GRAD_SHIFT_READINESS_MODULES"));
    assert.ok(landingSource.includes("Open residency lessons"));
  });
});
