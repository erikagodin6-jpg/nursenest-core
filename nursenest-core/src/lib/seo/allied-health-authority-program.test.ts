import { strict as assert } from "node:assert";
import test from "node:test";
import {
  buildAlliedAuthorityPath,
  buildAlliedSkillPath,
  getAlliedAuthorityInterviewQuestions,
  getAlliedAuthorityProfiles,
  getAlliedAuthoritySkillStaticParams,
  validateAlliedAuthorityProgram,
} from "./allied-health-authority-program";

const REQUIRED_CLUSTERS = [
  "educational",
  "career",
  "placement",
  "study",
  "interview",
  "clinicalSkills",
  "exam",
  "salary",
  "certification",
] as const;

test("allied authority program covers the primary professions", () => {
  const profiles = getAlliedAuthorityProfiles();
  assert.deepEqual(
    profiles.map((profile) => profile.key),
    [
      "respiratory-therapy",
      "paramedicine",
      "occupational-therapy",
      "physiotherapy",
      "medical-laboratory-technology",
      "psw",
    ],
  );
});

test("every profession has SEO keyword clusters and core authority routes", () => {
  for (const profile of getAlliedAuthorityProfiles()) {
    for (const cluster of REQUIRED_CLUSTERS) {
      assert.ok(profile.keywordClusters[cluster].length >= 3, `${profile.label} needs ${cluster} keywords`);
    }
    assert.match(buildAlliedAuthorityPath(profile, "career"), /^\/allied-health\/.+\/career$/);
    assert.match(buildAlliedAuthorityPath(profile, "interview-questions"), /^\/allied-health\/.+\/interview-questions$/);
    assert.match(buildAlliedAuthorityPath(profile, "placement-guide"), /^\/allied-health\/.+\/placement-guide$/);
    assert.match(buildAlliedAuthorityPath(profile, "study-guide"), /^\/allied-health\/.+\/study-guide$/);
  }
});

test("interview hubs generate 50 profession-specific questions", () => {
  for (const profile of getAlliedAuthorityProfiles()) {
    const questions = getAlliedAuthorityInterviewQuestions(profile);
    assert.equal(questions.length, 50, profile.label);
    assert.ok(questions.some((question) => question.toLowerCase().includes(profile.shortLabel.toLowerCase().split(" ")[0])));
  }
});

test("clinical skill pages include education, FAQs, practice activities, and internal links", () => {
  const params = getAlliedAuthoritySkillStaticParams();
  assert.ok(params.length >= 24);
  const paths = new Set<string>();
  for (const profile of getAlliedAuthorityProfiles()) {
    for (const skill of profile.clinicalSkills) {
      const path = buildAlliedSkillPath(profile, skill);
      assert.ok(!paths.has(path), `duplicate skill path ${path}`);
      paths.add(path);
      assert.ok(skill.learningObjectives.length >= 3);
      assert.ok(skill.clinicalContext.length >= 2);
      assert.ok(skill.coreSteps.length >= 4);
      assert.ok(skill.practiceActivities.length >= 3);
      assert.ok(skill.faqs.length >= 2);
      assert.ok(skill.related.length >= 5);
    }
  }
});

test("authority program quality gate passes", () => {
  assert.deepEqual(validateAlliedAuthorityProgram(), []);
});
