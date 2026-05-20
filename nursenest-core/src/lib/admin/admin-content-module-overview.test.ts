import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildAlliedProfessionOverview,
  buildEcgModuleOverview,
  buildLabModuleOverview,
} from "@/lib/admin/admin-content-module-overview";

describe("admin content module overview model", () => {
  it("includes Allied Health profession visibility with content counts", () => {
    const allied = buildAlliedProfessionOverview({
      professionKey: "mlt",
      professionLabel: "Medical laboratory",
      pathwayId: "us-allied-core",
      lessons: 12,
      publishedLessons: 10,
      draftLessons: 2,
      flashcards: 24,
      questions: 80,
      catQuestions: 15,
      premium: 104,
      free: 10,
      publicHubVisible: true,
      learnerHubVisible: true,
    });

    assert.equal(allied.title, "Medical laboratory");
    assert.equal(allied.counts.lessons, 12);
    assert.equal(allied.counts.flashcards, 24);
    assert.equal(allied.counts.practiceQuestions, 80);
    assert.equal(allied.counts.catQuestions, 15);
    assert.equal(allied.badges.includes("Live"), true);
  });

  it("shows ECG even when the feature flag is off", () => {
    const ecg = buildEcgModuleOverview({
      enabled: false,
      status: "draft",
      totalQuestions: 320,
      stripVideoQuestions: 55,
      lessons: 25,
      flashcards: 120,
      canPublish: true,
    });

    assert.equal(ecg.key, "ecg-module");
    assert.equal(ecg.status, "hidden");
    assert.equal(ecg.badges.includes("Hidden"), true);
  });

  it("keeps ECG blocked for RPN and PN", () => {
    const ecg = buildEcgModuleOverview({
      enabled: true,
      status: "qa_preview",
      totalQuestions: 320,
      stripVideoQuestions: 55,
      lessons: 25,
      flashcards: 120,
      canPublish: true,
    });

    assert.equal(ecg.tierAccess.RN, true);
    assert.equal(ecg.tierAccess.NP, true);
    assert.equal(ecg.tierAccess.RPN, false);
    assert.equal(ecg.tierAccess.PN, false);
  });

  it("fails ECG readiness below the minimum question threshold", () => {
    const ecg = buildEcgModuleOverview({
      enabled: true,
      status: "qa_preview",
      totalQuestions: 20,
      stripVideoQuestions: 8,
      lessons: 5,
      flashcards: 10,
      canPublish: true,
      minimumQuestions: 300,
    });

    assert.equal(ecg.canPublish, false);
    assert.equal(ecg.readiness, "Admin preview");
    assert.match(ecg.warnings.join(" "), /20\/300/);
  });

  it("includes lab module counts and readiness warnings", () => {
    const lab = buildLabModuleOverview({
      enabled: false,
      lessons: 14,
      questions: 0,
      flashcards: 8,
      adultRangeCoverage: 1,
    });

    assert.equal(lab.key, "lab-values-module");
    assert.equal(lab.counts.lessons, 14);
    assert.equal(lab.counts.flashcards, 8);
    assert.equal(lab.canPublish, false);
    assert.equal(lab.badges.includes("Needs questions"), true);
  });

  it("maps draft admin-only and published statuses", () => {
    const hidden = buildEcgModuleOverview({
      enabled: false,
      status: "draft",
      totalQuestions: 0,
      stripVideoQuestions: 0,
      lessons: 0,
      flashcards: 0,
      canPublish: false,
    });
    const adminOnly = buildEcgModuleOverview({
      enabled: true,
      status: "qa_preview",
      totalQuestions: 320,
      stripVideoQuestions: 55,
      lessons: 25,
      flashcards: 120,
      canPublish: true,
    });
    const published = buildEcgModuleOverview({
      enabled: true,
      status: "published",
      totalQuestions: 320,
      stripVideoQuestions: 55,
      lessons: 25,
      flashcards: 120,
      canPublish: true,
    });

    assert.equal(hidden.status, "hidden");
    assert.equal(adminOnly.status, "admin_only");
    assert.equal(published.status, "live");
  });
});
