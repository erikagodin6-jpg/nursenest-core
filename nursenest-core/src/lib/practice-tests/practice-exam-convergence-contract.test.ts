import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const runnerPath = join(__dirname, "../../components/student/practice-test-runner-client.tsx");
const hubPath = join(__dirname, "../../components/student/practice-tests-hub-client.tsx");
const marketingEnPath = join(__dirname, "../../../../tools/i18n/marketing/marketing-en.json");
const rawPracticeHubLabels = [
  "Hero Title",
  "Hero Subtitle",
  "Cta Cat",
  "Builder Headline",
  "Resume Cta",
  "Review Cta",
  "Row Question Count",
  "Study Tools Rail Title",
];

describe("Practice exam — premium convergence hooks", () => {
  const runnerSrc = readFileSync(runnerPath, "utf8");
  const hubSrc = readFileSync(hubPath, "utf8");

  it("marks linear practice sessions with convergence classes + QA attributes", () => {
    assert.equal(runnerSrc.includes("linearPracticeExamConvergence"), true);
    assert.equal(runnerSrc.includes("nn-practice-exam-convergence"), true);
    assert.equal(runnerSrc.includes("data-nn-practice-exam-convergence"), true);
    assert.equal(runnerSrc.includes("nn-practice-exam-convergence--tutor-split"), true);
    assert.equal(runnerSrc.includes("data-nn-qa-practice-exam-results-root"), true);
    assert.equal(runnerSrc.includes("data-nn-practice-scoring-rule"), true);
    assert.equal(runnerSrc.includes("data-nn-practice-partial-credit"), true);
  });

  it("tags the practice hub builder for convergence / screenshots", () => {
    assert.equal(hubSrc.includes("data-nn-practice-exam-hub-convergence"), true);
  });

  it("keeps the original launcher setup flow active before practice/CAT sessions", () => {
    assert.equal(
      hubSrc.includes('const restoreOriginalLauncherFlow = true;'),
      true,
      "practice hub must keep the restored setup flow active",
    );
    assert.equal(
      hubSrc.includes('if (!restoreOriginalLauncherFlow && examMode !== "cat")'),
      true,
      "simplified practice one-button landing must remain gated off",
    );
    assert.equal(
      hubSrc.includes('if (!restoreOriginalLauncherFlow && examMode === "cat")'),
      true,
      "simplified CAT one-button landing must remain gated off",
    );
    assert.equal(hubSrc.includes("data-nn-e2e-practice-canonical-grid"), true);
    assert.equal(hubSrc.includes("data-nn-e2e-practice-setup-panel"), true);
    assert.equal(hubSrc.includes("Configure session"), true);
    assert.equal(hubSrc.includes("Select categories"), true);
    assert.equal(hubSrc.includes("Exam mode"), true);
    assert.equal(hubSrc.includes("Question count"), true);
    assert.equal(hubSrc.includes("data-nn-e2e-question-count"), true);
    assert.equal(hubSrc.includes("data-nn-e2e-practice-resume-session"), true);
    assert.equal(hubSrc.includes('mode={examMode === "cat" ? "cat" : "practice-exam"}'), true);
    assert.equal(
      hubSrc.includes("data-nn-e2e-practice-sticky-cta"),
      false,
      "restored setup flow should not be replaced by a separate sticky-only CTA launcher",
    );
  });

  it("defines English practice hub copy so title-cased i18n fallback labels never render", () => {
    const marketingEn = JSON.parse(readFileSync(marketingEnPath, "utf8")) as Record<string, string>;
    const requiredKeys = [
      "learner.practiceTests.examFirst.heroTitle",
      "learner.practiceTests.examFirst.heroSubtitle",
      "learner.practiceTests.examFirst.ctaCat",
      "learner.practiceTests.examFirst.ctaReview",
      "learner.practiceTests.examFirst.studyToolsRailTitle",
      "learner.practiceTests.hub.builderHeadline",
      "learner.practiceTests.hub.resumeCta",
      "learner.practiceTests.hub.reviewCta",
      "learner.practiceTests.hub.rowQuestionCount",
    ];

    const failures: string[] = [];
    for (const key of requiredKeys) {
      const value = marketingEn[key];
      if (typeof value !== "string" || !value.trim()) {
        failures.push(`${key}: missing`);
        continue;
      }
      if (rawPracticeHubLabels.includes(value.trim())) {
        failures.push(`${key}: raw fallback ${value}`);
      }
    }

    assert.deepEqual(failures, []);
  });

  it("does not hardcode known raw fallback labels in the practice hub source", () => {
    for (const label of rawPracticeHubLabels) {
      assert.equal(hubSrc.includes(`>${label}<`), false, `${label} must not render as visible copy`);
    }
  });
});
