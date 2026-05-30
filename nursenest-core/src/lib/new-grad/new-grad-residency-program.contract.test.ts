import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  NEW_GRAD_COMMERCIAL_PACKAGES,
  NEW_GRAD_COMPETENCY_DOMAINS,
  NEW_GRAD_READINESS_DIMENSIONS,
  NEW_GRAD_RESIDENCY_TRACKS,
  NEW_GRAD_ROADMAP_MILESTONES,
  NEW_GRAD_SHIFT_READINESS_MODULES,
  NEW_GRAD_SIMULATION_CASES,
  NEW_GRAD_SURVIVAL_GUIDES,
  calculateNewGradCompetencyCompletion,
  calculateNewGradSpecialtyReadinessScore,
  listNewGradResidencyTracksForPackage,
  listNewGradResidencyTracksMissingWorkAreaHubs,
} from "./new-grad-residency-program";

const here = dirname(fileURLToPath(import.meta.url));
const landingSource = readFileSync(
  join(here, "..", "..", "components", "marketing", "new-grad-marketing-landing.tsx"),
  "utf8",
);

describe("New Grad residency program foundation", () => {
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
    assert.ok(landingSource.includes("NEW_GRAD_RESIDENCY_TRACKS"));
    assert.ok(landingSource.includes("NEW_GRAD_COMPETENCY_DOMAINS"));
    assert.ok(landingSource.includes("NEW_GRAD_SHIFT_READINESS_MODULES"));
    assert.ok(landingSource.includes("Open residency lessons"));
  });
});
