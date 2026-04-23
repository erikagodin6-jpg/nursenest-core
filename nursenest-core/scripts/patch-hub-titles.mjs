import fs from "node:fs";

const learnerPath = new URL("../public/i18n/en/learner.json", import.meta.url);
const pagesPath = new URL("../public/i18n/en/pages.json", import.meta.url);

const learner = JSON.parse(fs.readFileSync(learnerPath, "utf8"));
const pages = JSON.parse(fs.readFileSync(pagesPath, "utf8"));

const learnerPatches = {
  "learner.flashcards.hub.subtitle": "Quick review of high-yield concepts",
  "learner.practiceTests.title": "Practice Test",
  "learner.practiceTests.subtitle.subscriber":
    "Answer fixed-length question sets with explanations when you want them. Timed or untimed, auto-save, resume anytime, and review scores with topic breakdowns.",
  "learner.practiceTests.subtitle.locked":
    "Answer question sets with explanations, save progress, and review scores with topic breakdowns—included with an active plan.",
  "learner.practiceTests.pageHero.catInsightsLead":
    "See trends across completed adaptive sessions in the",
  "learner.practiceTests.pageHero.catInsightsLink": "confidence dashboard",
  "learner.profile.quickLinks.catPractice": "Adaptive Test",
  "learner.reportCard.section.practiceTestsSub": "Adaptive tests and other practice sessions you have completed.",
  "learner.practiceTests.run.catStudyMode": "Adaptive Test · rationales each item",
  "learner.practiceTests.run.catTestMode": "Adaptive Test · board-style run",
  "learner.practiceTests.run.adaptiveExamShort": "Adaptive Test",
  "learner.practiceTests.run.adaptiveSessionShort": "Adaptive Test",
  "learner.practiceTests.run.linearPracticeMode": "With rationales as you go",
  "learner.practiceTests.run.linearExamMode": "Rationales when you finish",
  "learner.practiceTests.run.practiceMode": "Practice Test",
  "learner.practiceTests.run.nclexSimulationMode": "NCLEX-style adaptive simulation",
  "learner.practiceTests.run.npSimulationMode": "NP adaptive simulation · AANP-style",
  "learner.practiceTests.hub.builderTitle": "Start a session",
  "learner.practiceTests.hub.builderIntro":
    "Build a practice test with explanations you control, or launch an adaptive session that adjusts difficulty like the real board experience. Questions match your plan’s tier and region.",
  "learner.practiceTests.hub.pathwayLabel": "Exam pathway (filters the pool)",
  "learner.practiceTests.hub.selectionLabel": "Session type",
  "learner.practiceTests.hub.selection.random": "Mixed quiz",
  "learner.practiceTests.hub.selection.targeted": "Targeted topics",
  "learner.practiceTests.hub.selection.weak": "Weak areas",
  "learner.practiceTests.hub.selection.cat": "Adaptive Test",
  "learner.practiceTests.hub.selectionHelp.targeted": "Pick one or more topics below (required).",
  "learner.practiceTests.hub.selectionHelp.weak": "Uses topics you’ve missed on recent scored practice.",
  "learner.practiceTests.hub.selectionHelp.cat.examSim.np":
    "AANP-style readiness simulation: 75–150 items, four-domain blueprint when questions are tagged, adaptive stops. Not the live AANP format.",
  "learner.practiceTests.hub.selectionHelp.cat.examSim.rn":
    "Readiness simulation: length and blueprint follow your selected pathway when items are tagged, with adaptive stops. Not an official licensure result.",
  "learner.practiceTests.hub.selectionHelp.cat.practice":
    "Starts near mid difficulty, then moves up or down; may stop early when the estimate stabilizes.",
  "learner.practiceTests.hub.selectionHelp.linear":
    "Optional topic filters narrow the pool; leave empty for a broad mix.",
  "learner.practiceTests.hub.sessionModeLabel": "How rationales appear",
  "learner.practiceTests.hub.sessionMode.tutor": "As you answer",
  "learner.practiceTests.hub.sessionMode.exam": "When you finish",
  "learner.practiceTests.hub.rationaleVisibilityLabel": "Explanation timing",
  "learner.practiceTests.hub.rationale.afterEach": "After each item",
  "learner.practiceTests.hub.rationale.endOnly": "Only at the end",
  "learner.practiceTests.hub.sessionModeHelp":
    "As you answer shows rationales right after each response. When you finish holds them until the end of the set.",
  "learner.practiceTests.hub.catFormatLabel": "Adaptive format",
  "learner.practiceTests.hub.catFormat.practice": "Adaptive practice",
  "learner.practiceTests.hub.catFormat.examSim": "Readiness simulation",
  "learner.practiceTests.hub.catFormatHelp":
    "Adaptive practice keeps shorter runs and weak-area boosts. Readiness simulation uses your selected pathway length, timing, and blueprint when items are tagged. Enable server flags documented in ops guides for simulation UI.",
  "learner.practiceTests.hub.poolLabel": "Pool for adaptive draws",
  "learner.practiceTests.hub.poolBroadMix": "Broad mix",
  "learner.practiceTests.hub.poolFiltered": "Filtered topics",
  "learner.practiceTests.hub.poolWeakFirst": "Weak areas first",
  "learner.practiceTests.hub.poolHelp": "Same tier rules apply. Weak-area mode needs prior scored practice history.",
  "learner.practiceTests.hub.catFeedbackHeading": "During adaptive practice",
  "learner.practiceTests.hub.catFeedbackIntro": "Same adaptive engine—choose how rationales appear.",
  "learner.practiceTests.hub.catCardLearnTitle": "Learn while answering",
  "learner.practiceTests.hub.catCardLearnDesc": "Rationale after each item keeps the session instructional.",
  "learner.practiceTests.hub.catCardBoardTitle": "Board-style pacing",
  "learner.practiceTests.hub.catCardBoardDesc": "Hold rationales until the set ends—closer to exam day.",
  "learner.practiceTests.hub.startCta": "Start session",
  "learner.practiceTests.hub.building": "Building…",
  "learner.practiceTests.hub.emptyStateCta": "Configure session",
  "learner.practiceTests.hub.catBlockedTitle": "Adaptive not available yet",
  "learner.practiceTests.hub.error.noAdaptive":
    "No adaptive tracks are available for your plan right now. Use a mixed quiz or pick a pathway with an active adaptive pool.",
  "learner.practiceTests.hub.error.pathwayRequired": "Choose an exam pathway before starting an adaptive session.",
  "learner.practiceTests.hub.catUnavailableBody":
    "Adaptive sessions are not available for your current pathways yet. Use a mixed quiz or pick a track with an active adaptive pool.",
  "learner.practiceTests.hub.multiPathwayHint":
    "Your plan includes more than one adaptive track—pick which pathway this session uses so items stay exam-scoped.",
  "learner.practiceTests.hub.multiPathwaySub": "We need your pathway before starting so the adaptive pool matches the right exam.",
  "learner.practiceTests.hub.pathwayPlaceholder": "Choose which exam pathway…",
  "learner.practiceTests.hub.weakFocusBanner": "Weak-area focus is active so recommendations stay targeted.",
  "learner.practiceTests.hub.resumeHint": "You have an in-progress session ready to resume.",
  "learner.practiceTests.hub.reviewRecentHint": "Recent completions are highlighted for quick review.",
  "learner.practiceTests.hub.topicsLabel": "Topics (optional unless targeted)",
  "learner.practiceTests.hub.addFromBank": "Add from bank…",
  "learner.practiceTests.hub.customTopicPlaceholder": "Custom topic label",
  "learner.practiceTests.hub.add": "Add",
  "learner.practiceTests.hub.difficultyMin": "Difficulty min (1–5, optional)",
  "learner.practiceTests.hub.difficultyMax": "Difficulty max (1–5, optional)",
  "learner.practiceTests.hub.difficultyFootnote":
    "Bank uses numeric difficulty when set; items without a level still qualify when filters are loose.",
  "learner.practiceTests.hub.timedMode": "Timed mode",
  "learner.practiceTests.hub.timeLimitMinutes": "Time limit (minutes)",
  "learner.practiceTests.hub.untimedHint": "Untimed. Elapsed time is still recorded when you finish.",
  "learner.practiceTests.hub.savedHistoryTitle": "Saved sessions",
  "learner.practiceTests.hub.savedHistoryIntro": "Resume in-progress work or review completed scores.",
  "learner.practiceTests.hub.loading": "Loading…",
  "learner.practiceTests.hub.emptyBody":
    "You have not saved any sessions yet. Start one above and your in-progress work and recent scores will show up here.",
  "learner.practiceTests.hub.rowUntitled": "Practice Test",
  "learner.practiceTests.hub.rowBadge.readinessSim": "Readiness simulation",
  "learner.practiceTests.hub.rowBadge.adaptiveLearn": "Adaptive · rationales each item",
  "learner.practiceTests.hub.rowBadge.adaptiveBoard": "Adaptive · board-style",
  "learner.practiceTests.hub.rowTimed": "timed",
  "learner.practiceTests.hub.rowUntimed": "untimed",
  "learner.practiceTests.hub.rowInProgress": "in progress",
  "learner.practiceTests.hub.rowAbandoned": "abandoned",
  "learner.practiceTests.hub.pathwayNpHint":
    "NP tracks use the NP question bank and AANP-style blueprint when you run readiness simulation.",
  "learner.practiceTests.hub.pathwayExamHint":
    "{{exam}} uses the pathway-scoped bank and tagged blueprint when you run readiness simulation.",
  "learner.practiceTests.hub.pathwayGenericHint":
    "Each exam track uses its own pathway-scoped bank and tagged blueprint when you run readiness simulation.",
};

for (const [k, v] of Object.entries(learnerPatches)) {
  learner[k] = v;
}

const pagesPatches = {
  "pages.publicFlashcardsHub.h1": "Flashcards",
  "pages.publicFlashcardsHub.intro":
    "Quick review of high-yield concepts. Browse topic previews here—full study lives in the app after you sign in.",
  "pages.publicPracticeExams.h1": "Practice Test",
  "pages.publicPracticeExams.intro":
    "Answer exam-style questions with explanations you control. Sign in to run sessions, review history, and open adaptive practice where your plan includes it.",
  "pages.publicPracticeExams.breadcrumbCurrent": "Practice Test",
  "pages.publicPracticeExams.sectionCatTitle": "Adaptive Test",
  "pages.publicPracticeExams.catLinkPracticeTests": "practice tests",
  "pages.publicPracticeExams.ctaPrimary": "Open Practice Test",
};

for (const [k, v] of Object.entries(pagesPatches)) {
  pages[k] = v;
}

fs.writeFileSync(learnerPath, JSON.stringify(learner));
fs.writeFileSync(pagesPath, JSON.stringify(pages));
console.log("Patched en learner + pages hub titles.");
