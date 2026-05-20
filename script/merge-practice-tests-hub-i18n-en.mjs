/**
 * Merges Practice Tests hub i18n (flat keys) into tools/i18n/marketing/marketing-en.json,
 * then run `npm run i18n:compile` from nursenest-core to propagate to public shards.
 */
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const marketingPath = join(repoRoot, "tools/i18n/marketing/marketing-en.json");
const patchHubTitlesPath = join(repoRoot, "nursenest-core/scripts/patch-hub-titles.mjs");

function extractLearnerPatchesFromPatchHubTitles() {
  const src = fs.readFileSync(patchHubTitlesPath, "utf8");
  const i = src.indexOf("const learnerPatches = ");
  const j = src.indexOf("\n};", i);
  let slice = src.slice(i + "const learnerPatches = ".length, j).trim();
  if (!slice.endsWith("}")) slice += "\n}";
  return Function(`"use strict";return (${slice})`)();
}

const rawPatches = extractLearnerPatchesFromPatchHubTitles();
const hub = Object.fromEntries(
  Object.entries(rawPatches).filter(([k]) => k.startsWith("learner.practiceTests")),
);

const overrides = {
  "learner.practiceTests.title": "Practice Tests",
  "learner.practiceTests.hub.kind.catExam": "CAT Exam",
  "learner.practiceTests.hub.kind.practiceExam": "Practice Exam",
  "learner.practiceTests.hub.kind.practiceQuestions": "Practice Questions",
  "learner.practiceTests.hub.startPracticeExam": "Start Practice Exam",
  "learner.practiceTests.hub.startPracticeQuestions": "Start Practice Questions",
  "learner.practiceTests.hub.selection.cat": "CAT Exam",
  "learner.practiceTests.hub.rowUntitled": "Practice Test",
  "learner.practiceTests.examFirst.ctaCat": "Start CAT Exam",
  "learner.practiceTests.examFirst.ctaCatSublabel":
    "NCLEX-style adaptivity with readiness cues—results are practice estimates, not a licensure guarantee.",
  "learner.practiceTests.examFirst.ctaCustom": "Create Practice Test",
  "learner.practiceTests.examFirst.ctaCustomSublabel":
    "Pick body systems, length, and difficulty. Tutor mode or timed exam mode.",
  "learner.practiceTests.examFirst.ctaContinue": "Continue Previous Session",
  "learner.practiceTests.examFirst.heroSubtitle":
    "Start with a CAT Exam when you want adaptivity, or build a Practice Test that matches what you are studying.",
  "learner.practiceTests.examFirst.studyToolsRailTitle": "Study tools",
  "learner.practiceTests.examFirst.studyToolsRailIntro":
    "Warm up in the Question Bank, Lessons, Flashcards, Study Planner, Report Card, Review Queue, or Passing Probability & Readiness.",
  "learner.practiceTests.examFirst.mobileStudyToolsSummary": "More study links",
  "learner.practiceTests.examFirst.lessonInventoryIntro":
    "Published pathway lessons and linked checks use the same catalog as your Lessons hub. Practice sessions below still draw from the indexed question bank.",
  "learner.practiceTests.examFirst.lessonInventorySrHeading": "Pathway lesson study inventory",
  "learner.practiceTests.examFirst.publishedLessonsLabel": "Published lessons",
  "learner.practiceTests.examFirst.lessonLinkedMcqsLabel": "Lesson-linked MCQs",
  "learner.practiceTests.examFirst.lessonLinkedFlashcardsLabel": "Lesson-linked flashcards",
  "learner.practiceTests.examFirst.lessonsBySystemLabel": "Lessons by system (catalog)",
  "learner.account.nav.report": "Report Card",
  "learner.account.nav.readiness": "Passing Probability & Readiness",
  "learner.account.nav.reviewQueue": "Review Queue",
  "learner.profile.quickLinks.studyPlanner": "Study Planner",
  "learner.practiceTests.examFirst.openPathwayQuestionBank": "Open pathway Question Bank",
};

const missingHub = {
  "learner.practiceTests.hub.error.loadTests": "We could not load your saved sessions.",
  "learner.practiceTests.hub.error.createTest": "We could not start that session.",
  "learner.practiceTests.hub.error.generic": "Something went wrong. Try again in a moment.",
  "learner.practiceTests.hub.notApplicable": "—",
  "learner.practiceTests.hub.questionCount.catExamNp": "NP readiness simulations typically run 75–150 items when the bank supports it.",
  "learner.practiceTests.hub.questionCount.catExamRn":
    "{{exam}} readiness simulations follow tagged blueprint length when the bank supports it.",
  "learner.practiceTests.hub.questionCount.catCap": "Adaptive practice caps at 75 items for quicker calibration sessions.",
  "learner.practiceTests.hub.questionCount.linear": "Pick a fixed length for linear practice or exam-style sets.",
  "learner.practiceTests.hub.defaultExamLabel": "this exam",
  "learner.practiceTests.hub.customizeSessionTitle": "Customize session",
  "learner.practiceTests.hub.optionalTitleLabel": "Optional title",
  "learner.practiceTests.hub.titlePlaceholder": "e.g., Cardio mixed set",
  "learner.practiceTests.hub.timingLabel": "Timing",
  "learner.practiceTests.hub.untimedShort": "Untimed",
  "learner.practiceTests.hub.timedShort": "Timed",
  "learner.practiceTests.hub.sessionFeelLabel": "Session feel",
  "learner.practiceTests.hub.rationalesShortLabel": "Rationales",
  "learner.practiceTests.hub.afterEachShort": "After each",
  "learner.practiceTests.hub.atEndShort": "At the end",
  "learner.practiceTests.hub.linearAllowReviewNavLabel": "Allow item-to-item review navigation (exam mode)",
  "learner.practiceTests.hub.linearAllowReviewNavHelp":
    "When off, navigation stays closer to board-style pacing until the section completes.",
  "learner.practiceTests.hub.adaptiveStyleLabel": "Adaptive style",
  "learner.practiceTests.hub.catSessionStyleAdaptiveTitle": "Adaptive (CAT)",
  "learner.practiceTests.hub.catSessionStyleAdaptiveDesc": "Classic adaptive difficulty—best for calibration and mixed review.",
  "learner.practiceTests.hub.catSessionStyleGuidedTitle": "Guided CAT",
  "learner.practiceTests.hub.catSessionStyleGuidedDesc": "Structured prompts with adaptive stops—helpful when you want more coaching.",
  "learner.practiceTests.hub.advancedFiltersTitle": "Advanced filters",
  "learner.practiceTests.hub.questionFocusSection": "Question focus",
  "learner.practiceTests.hub.poolMissedReview": "Missed review",
  "learner.practiceTests.hub.selection.unseen": "Unseen",
  "learner.practiceTests.hub.topicLabelsSection": "Topic labels",
  "learner.practiceTests.hub.difficultySection": "Difficulty",
  "learner.practiceTests.hub.difficultyAny": "Any",
  "learner.practiceTests.hub.difficultyLevel": "Level {{level}}",
  "learner.practiceTests.hub.startFootnote": "You can adjust length, timing, and rationales before you begin.",
  "learner.practiceTests.hub.emptyHeadline": "No saved sessions yet",
  "learner.practiceTests.hub.rowUnseen": "Unseen",
  "learner.practiceTests.hub.rowQuestionCount": "{{count}} questions",
  "learner.practiceTests.hub.resumeCta": "Resume",
  "learner.practiceTests.hub.reviewCta": "Review",
};

const marketing = JSON.parse(fs.readFileSync(marketingPath, "utf8"));
Object.assign(marketing, hub, missingHub, overrides);
fs.writeFileSync(marketingPath, `${JSON.stringify(marketing, null, 2)}\n`);
console.log("Merged practice-tests hub keys into marketing-en.json");
