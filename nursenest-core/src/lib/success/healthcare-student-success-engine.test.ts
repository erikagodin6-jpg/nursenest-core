import assert from "node:assert/strict";
import test from "node:test";

import {
  SUCCESS_STORY_CATEGORIES,
  SUCCESS_STORY_PROMPTS,
  buildInstitutionalOutcomeSummaries,
  buildOutcomesDashboard,
  buildSeoSuccessPage,
  buildShareableSuccessGraphic,
  buildSuccessWall,
  scoreSuccessStory,
  selectSuccessStoryPrompts,
  type SuccessStorySubmission,
} from "@/lib/success/healthcare-student-success-engine";

const baseConsent = {
  mayUseForMarketing: true,
  mayUseName: true,
  mayUsePhoto: false,
  mayUseSchool: true,
  mayUseLocation: true,
  mayUseSeoPage: true,
};

function story(overrides: Partial<SuccessStorySubmission> = {}): SuccessStorySubmission {
  return {
    id: "story-1",
    learnerId: "user-1",
    displayName: "Sarah Patel",
    school: "Northern College",
    country: "Canada",
    provinceOrState: "Ontario",
    profession: "Nursing",
    exam: "NCLEX-RN",
    category: "nclex_pass",
    outcome: "Passed NCLEX-RN",
    studyTimeWeeks: 10,
    preparationStrategy:
      "I used NurseNest for daily readiness review, mixed question sets, flashcards, and clinical reasoning practice after every missed topic.",
    featuresUsed: ["CAT Exams", "Flashcards", "Readiness Dashboard", "Lessons"],
    adviceForFutureLearners:
      "Do not only count questions. Review why each wrong option is tempting, then connect the topic to a lesson and flashcard deck.",
    story:
      "I started with weak prioritization and delegation scores. NurseNest helped me connect rationales to clinical judgment, then use readiness trends to decide what to review each week. By the final month I could explain why I was choosing an answer instead of guessing from keywords.",
    submittedAt: "2026-05-01T12:00:00.000Z",
    verifiedAt: "2026-05-10T12:00:00.000Z",
    status: "verified",
    consent: baseConsent,
    verificationEvidence: ["exam-result-attestation", "learner-email-confirmation"],
    ...overrides,
  };
}

test("success prompt registry covers required outcome categories", () => {
  assert.equal(SUCCESS_STORY_CATEGORIES.includes("nclex_pass"), true);
  assert.equal(SUCCESS_STORY_CATEGORIES.includes("rex_pn_pass"), true);
  assert.equal(SUCCESS_STORY_CATEGORIES.includes("cnple_pass"), true);
  assert.equal(SUCCESS_STORY_CATEGORIES.includes("fnp_pass"), true);
  assert.equal(SUCCESS_STORY_CATEGORIES.includes("pmhnp_pass"), true);
  assert.equal(SUCCESS_STORY_CATEGORIES.includes("hesi_a2_success"), true);
  assert.equal(SUCCESS_STORY_CATEGORIES.includes("ati_teas_success"), true);
  assert.equal(SUCCESS_STORY_CATEGORIES.includes("casper_success"), true);
  assert.equal(SUCCESS_STORY_CATEGORIES.includes("clinical_placement_success"), true);
  assert.equal(SUCCESS_STORY_CATEGORIES.includes("first_healthcare_job"), true);
  assert.ok(SUCCESS_STORY_PROMPTS.length >= 12);
});

test("selectSuccessStoryPrompts filters by profession and exam", () => {
  const prompts = selectSuccessStoryPrompts({ profession: "Pre-Nursing", exam: "ATI TEAS" });
  assert.equal(prompts.some((prompt) => prompt.id === "ati-teas-success"), true);
  assert.equal(prompts.some((prompt) => prompt.id === "passed-nclex-rn"), false);
});

test("scoreSuccessStory rewards verified, specific, educational stories", () => {
  const score = scoreSuccessStory(story());
  assert.ok(score.total >= 85);
  assert.deepEqual(score.missingFields, []);

  const weak = scoreSuccessStory(story({ featuresUsed: [], preparationStrategy: "", adviceForFutureLearners: "", story: "I passed." }));
  assert.ok(weak.total < score.total);
  assert.equal(weak.missingFields.includes("featuresUsed"), true);
});

test("buildSeoSuccessPage gates unverified or non-consented stories", () => {
  const seo = buildSeoSuccessPage(story());
  assert.equal(seo.slug, "how-sarah-passed-nclex-rn");
  assert.equal(seo.indexable, true);
  assert.equal(seo.canonicalPath, "/success-stories/how-sarah-passed-nclex-rn");
  assert.equal(seo.sections.includes("Study Plan"), true);

  const hidden = buildSeoSuccessPage(story({ status: "submitted", verifiedAt: null }));
  assert.equal(hidden.indexable, false);

  const noConsent = buildSeoSuccessPage(story({ consent: { ...baseConsent, mayUseSeoPage: false } }));
  assert.equal(noConsent.indexable, false);
});

test("buildSuccessWall only shows verified marketing-consented stories", () => {
  const wall = buildSuccessWall([
    story({ id: "verified" }),
    story({ id: "draft", status: "draft", verifiedAt: null }),
    story({ id: "no-consent", consent: { ...baseConsent, mayUseForMarketing: false } }),
  ]);

  assert.equal(wall.length, 1);
  assert.equal(wall[0]?.id, "verified");
  assert.equal(wall[0]?.verified, true);
});

test("buildOutcomesDashboard counts exam, admissions, placement, and employment outcomes", () => {
  const dashboard = buildOutcomesDashboard([
    story({ id: "nclex" }),
    story({ id: "rex", profession: "RPN/LPN", exam: "REx-PN", category: "rex_pn_pass", outcome: "Passed REx-PN" }),
    story({ id: "cnple", profession: "NP", exam: "CNPLE", category: "cnple_pass", outcome: "Passed CNPLE" }),
    story({ id: "admit", profession: "Pre-Nursing", exam: "HESI A2", category: "program_admission", outcome: "Received Program Admission" }),
    story({ id: "placement", category: "clinical_placement_success", outcome: "Completed Clinical Placement" }),
    story({ id: "job", category: "first_healthcare_job", outcome: "Obtained First Healthcare Job" }),
  ]);

  assert.equal(dashboard.totalVerifiedStories, 6);
  assert.equal(dashboard.nclexPasses, 1);
  assert.equal(dashboard.rexPnPasses, 1);
  assert.equal(dashboard.npCertifications, 1);
  assert.equal(dashboard.admissionsSuccesses, 1);
  assert.equal(dashboard.placementSuccesses, 1);
  assert.equal(dashboard.employmentOutcomes, 1);
});

test("share graphics and institutional summaries support marketing and B2B reporting", () => {
  const graphic = buildShareableSuccessGraphic(story({ category: "first_healthcare_job", exam: "Employment", outcome: "Obtained First Healthcare Job" }));
  assert.equal(graphic.headline, "Obtained First Healthcare Job");
  assert.equal(graphic.recommendedChannels.includes("linkedin"), true);

  const summaries = buildInstitutionalOutcomeSummaries([
    story({ id: "a", school: "Northern College" }),
    story({ id: "b", school: "Northern College", category: "clinical_placement_success", exam: "Clinical Placement", outcome: "Completed Clinical Placement" }),
    story({ id: "c", school: null }),
  ]);
  assert.equal(summaries.length, 1);
  assert.equal(summaries[0]?.school, "Northern College");
  assert.equal(summaries[0]?.verifiedStories, 2);
  assert.equal(summaries[0]?.professionsRepresented.includes("Nursing"), true);
});

