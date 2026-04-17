import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(dir, "..", "..");

type QueryExpectation = {
  file: string;
  label: string;
  pattern: RegExp;
};

function readTarget(relPath: string): string {
  return readFileSync(join(srcRoot, relPath), "utf8");
}

function collectSourceFiles(root: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(root)) {
    const abs = join(root, entry);
    const st = statSync(abs);
    if (st.isDirectory()) {
      out.push(...collectSourceFiles(abs));
      continue;
    }
    if (abs.endsWith(".ts") || abs.endsWith(".tsx")) {
      out.push(abs);
    }
  }
  return out;
}

const EXPECTATIONS: QueryExpectation[] = [
  {
    file: "lib/learner/load-progress-page-payload.ts",
    label: "progress page recent mocks uses take 60 with createdAt desc",
    pattern:
      /prisma\.examAttempt\.findMany\(\{[\s\S]*?where:\s*\{\s*userId\s*\}[\s\S]*?orderBy:\s*\{\s*createdAt:\s*"desc"\s*\}[\s\S]*?take:\s*60[\s\S]*?exam:\s*\{\s*select:\s*\{\s*title:\s*true\s*\}\s*\}/m,
  },
  {
    file: "lib/learner/load-progress-page-payload.ts",
    label: "progress page recent practice tests uses take 12 with createdAt desc",
    pattern:
      /prisma\.practiceTest[\s\S]*?findMany\(\{[\s\S]*?completedAt:\s*\{\s*not:\s*null\s*\}[\s\S]*?orderBy:\s*\[\s*\{\s*completedAt:\s*"desc"\s*\},\s*\{\s*createdAt:\s*"desc"\s*\}\s*\][\s\S]*?take:\s*12/m,
  },
  {
    file: "lib/study/analytics-data.ts",
    label: "analytics readiness trend uses take 12 with createdAt desc",
    pattern:
      /function loadReadinessTrend[\s\S]*?prisma\.practiceTest\.findMany\(\{[\s\S]*?orderBy:\s*\[\s*\{\s*completedAt:\s*"desc"\s*\},\s*\{\s*createdAt:\s*"desc"\s*\}\s*\][\s\S]*?take:\s*12/m,
  },
  {
    file: "lib/study/analytics-data.ts",
    label: "analytics readiness trend pagination uses take 12 with createdAt desc",
    pattern:
      /function loadMoreReadinessTrend[\s\S]*?prisma\.practiceTest\.findMany\(\{[\s\S]*?orderBy:\s*\[\s*\{\s*completedAt:\s*"desc"\s*\},\s*\{\s*createdAt:\s*"desc"\s*\}\s*\][\s\S]*?take:\s*12/m,
  },
  {
    file: "lib/study/analytics-data.ts",
    label: "analytics confidence scatter uses take 60 with createdAt desc",
    pattern:
      /function loadConfidenceScatterPoints[\s\S]*?prisma\.examAttempt\.findMany\(\{[\s\S]*?orderBy:\s*\{\s*createdAt:\s*"desc"\s*\}[\s\S]*?take:\s*60/m,
  },
  {
    file: "lib/study/analytics-data.ts",
    label: "analytics confidence patterns uses take 60 with createdAt desc",
    pattern:
      /function loadConfidencePatterns[\s\S]*?prisma\.examAttempt\.findMany\(\{[\s\S]*?orderBy:\s*\{\s*createdAt:\s*"desc"\s*\}[\s\S]*?take:\s*60/m,
  },
  {
    file: "lib/study/analytics-data.ts",
    label: "analytics time metrics uses take 12 with createdAt desc",
    pattern:
      /function loadTimeMetrics[\s\S]*?prisma\.practiceTest\.findMany\(\{[\s\S]*?orderBy:\s*\[\s*\{\s*completedAt:\s*"desc"\s*\},\s*\{\s*createdAt:\s*"desc"\s*\}\s*\][\s\S]*?take:\s*12/m,
  },
  {
    file: "lib/study/analytics-data.ts",
    label: "analytics question type breakdown uses take 60 with createdAt desc",
    pattern:
      /function loadQuestionTypeBreakdown[\s\S]*?prisma\.examAttempt\.findMany\(\{[\s\S]*?orderBy:\s*\{\s*createdAt:\s*"desc"\s*\}[\s\S]*?take:\s*60/m,
  },
  {
    file: "lib/learner/load-report-card-data.ts",
    label: "report card mock attempts uses take 60 with createdAt desc",
    pattern:
      /prisma\.examAttempt\.findMany\(\{[\s\S]*?orderBy:\s*\{\s*createdAt:\s*"desc"\s*\}[\s\S]*?take:\s*60/m,
  },
  {
    file: "lib/learner/load-report-card-data.ts",
    label: "report card exam sessions uses take 12 with createdAt desc",
    pattern:
      /prisma\.examSession\.findMany\(\{[\s\S]*?orderBy:\s*\[\s*\{\s*updatedAt:\s*"desc"\s*\},\s*\{\s*createdAt:\s*"desc"\s*\}\s*\][\s\S]*?take:\s*12/m,
  },
  {
    file: "lib/learner/load-report-card-data.ts",
    label: "report card practice tests uses take 12 with createdAt desc",
    pattern:
      /prisma\.practiceTest\.findMany\(\{[\s\S]*?completedAt:\s*\{\s*not:\s*null\s*\}[\s\S]*?orderBy:\s*\[\s*\{\s*completedAt:\s*"desc"\s*\},\s*\{\s*createdAt:\s*"desc"\s*\}\s*\][\s\S]*?take:\s*12/m,
  },
  {
    file: "lib/learner/load-readiness-page-payload.ts",
    label: "readiness page cat signal uses take 12 with createdAt desc",
    pattern:
      /prisma\.practiceTest\.findMany\(\{[\s\S]*?config:\s*\{\s*path:\s*\["selectionMode"\],\s*equals:\s*"cat"\s*\}[\s\S]*?orderBy:\s*\[\s*\{\s*completedAt:\s*"desc"\s*\},\s*\{\s*createdAt:\s*"desc"\s*\}\s*\][\s\S]*?take:\s*12/m,
  },
  {
    file: "lib/learner/load-learner-profile-activity.ts",
    label: "profile activity mocks uses take 60 with createdAt desc",
    pattern:
      /prisma\.examAttempt\.findMany\(\{[\s\S]*?orderBy:\s*\{\s*createdAt:\s*"desc"\s*\}[\s\S]*?take:\s*60/m,
  },
  {
    file: "lib/learner/load-learner-profile-activity.ts",
    label: "profile activity practice tests uses take 12 with createdAt desc",
    pattern:
      /prisma\.practiceTest\.findMany\(\{[\s\S]*?orderBy:\s*\[\s*\{\s*updatedAt:\s*"desc"\s*\},\s*\{\s*createdAt:\s*"desc"\s*\}\s*\][\s\S]*?take:\s*12/m,
  },
  {
    file: "lib/admin/load-admin-user-support-detail.ts",
    label: "admin support detail recent exam attempts uses take 60 with createdAt desc",
    pattern:
      /prisma\.examAttempt\.findMany\(\{[\s\S]*?orderBy:\s*\{\s*createdAt:\s*"desc"\s*\}[\s\S]*?take:\s*60/m,
  },
  {
    file: "lib/admin/load-admin-user-support-detail.ts",
    label: "admin support detail recent practice tests uses take 12 with createdAt desc",
    pattern:
      /prisma\.practiceTest\.findMany\(\{[\s\S]*?orderBy:\s*\[\s*\{\s*updatedAt:\s*"desc"\s*\},\s*\{\s*createdAt:\s*"desc"\s*\}\s*\][\s\S]*?take:\s*12/m,
  },
  {
    file: "lib/admin/load-admin-user-support-detail.ts",
    label: "admin support detail recent exam sessions uses take 12 with createdAt desc",
    pattern:
      /prisma\.examSession\.findMany\(\{[\s\S]*?orderBy:\s*\[\s*\{\s*updatedAt:\s*"desc"\s*\},\s*\{\s*createdAt:\s*"desc"\s*\}\s*\][\s\S]*?take:\s*12/m,
  },
  {
    file: "lib/insights/weighted-session-grading.ts",
    label: "weighted session grading uses take 12 with createdAt desc",
    pattern:
      /prisma\.examSession\.findMany\(\{[\s\S]*?orderBy:\s*\[\s*\{\s*updatedAt:\s*"desc"\s*\},\s*\{\s*createdAt:\s*"desc"\s*\}\s*\][\s\S]*?take:\s*12/m,
  },
  {
    file: "lib/study/motivation-data.ts",
    label: "motivation weekly activity exam attempts uses take 60 with createdAt desc",
    pattern:
      /prisma\.examAttempt\.findMany\(\{[\s\S]*?createdAt:\s*\{\s*gte:\s*since\s*\}[\s\S]*?orderBy:\s*\{\s*createdAt:\s*"desc"\s*\}[\s\S]*?take:\s*60/m,
  },
  {
    file: "lib/study/motivation-data.ts",
    label: "motivation weekly activity practice tests uses take 12 with createdAt desc",
    pattern:
      /prisma\.practiceTest\.findMany\(\{[\s\S]*?completedAt:\s*\{\s*not:\s*null,\s*gte:\s*since\s*\}[\s\S]*?orderBy:\s*\[\s*\{\s*completedAt:\s*"desc"\s*\},\s*\{\s*createdAt:\s*"desc"\s*\}\s*\][\s\S]*?take:\s*12/m,
  },
  {
    file: "lib/study/motivation-data.ts",
    label: "motivation recent readiness uses take 12 with createdAt desc",
    pattern:
      /function loadRecentReadiness[\s\S]*?prisma\.practiceTest\.findMany\(\{[\s\S]*?orderBy:\s*\[\s*\{\s*completedAt:\s*"desc"\s*\},\s*\{\s*createdAt:\s*"desc"\s*\}\s*\][\s\S]*?take:\s*12/m,
  },
  {
    file: "lib/learner/readiness-dashboard-data.ts",
    label: "readiness dashboard dimension breakdown uses take 60 with createdAt desc",
    pattern:
      /function loadDimensionBreakdown[\s\S]*?prisma\.examAttempt\.findMany\(\{[\s\S]*?orderBy:\s*\{\s*createdAt:\s*"desc"\s*\}[\s\S]*?take:\s*60/m,
  },
  {
    file: "lib/learner/readiness-dashboard-data.ts",
    label: "readiness dashboard cat trend uses take 12 with createdAt desc",
    pattern:
      /function loadCatTrend[\s\S]*?prisma\.practiceTest\.findMany\(\{[\s\S]*?orderBy:\s*\[\s*\{\s*completedAt:\s*"desc"\s*\},\s*\{\s*createdAt:\s*"desc"\s*\}\s*\][\s\S]*?take:\s*12/m,
  },
  {
    file: "lib/learner/weak-topics-from-sessions.ts",
    label: "weak topics from sessions uses take 12 with createdAt desc",
    pattern:
      /prisma\.examSession\.findMany\(\{[\s\S]*?orderBy:\s*\[\s*\{\s*updatedAt:\s*"desc"\s*\},\s*\{\s*createdAt:\s*"desc"\s*\}\s*\][\s\S]*?take:\s*12/m,
  },
  {
    file: "lib/learner/session-grading-aggregate.ts",
    label: "session grading aggregate uses take 12 with createdAt desc",
    pattern:
      /prisma\.examSession\.findMany\(\{[\s\S]*?orderBy:\s*\[\s*\{\s*updatedAt:\s*"desc"\s*\},\s*\{\s*createdAt:\s*"desc"\s*\}\s*\][\s\S]*?take:\s*12/m,
  },
  {
    file: "lib/study/unified-review-engine.ts",
    label: "unified review engine uses take 60 with createdAt desc",
    pattern:
      /prisma\.examAttempt\.findMany\(\{[\s\S]*?orderBy:\s*\{\s*createdAt:\s*"desc"\s*\}[\s\S]*?take:\s*60/m,
  },
  {
    file: "lib/study/review-queue-data.ts",
    label: "review queue initial load uses take 60 with createdAt desc",
    pattern:
      /function loadReviewQueueInitialData[\s\S]*?prisma\.examAttempt\.findMany\(\{[\s\S]*?orderBy:\s*\{\s*createdAt:\s*"desc"\s*\}[\s\S]*?take:\s*60/m,
  },
  {
    file: "lib/study/review-queue-data.ts",
    label: "review queue pagination uses take 60 with createdAt desc",
    pattern:
      /function loadReviewQueuePage[\s\S]*?prisma\.examAttempt\.findMany\(\{[\s\S]*?orderBy:\s*\{\s*createdAt:\s*"desc"\s*\}[\s\S]*?take:\s*60/m,
  },
  {
    file: "lib/cat/answer-history.ts",
    label: "answer history full load uses take 12 with createdAt desc",
    pattern:
      /function loadAnswerHistory[\s\S]*?prisma\.practiceTest\.findMany\(\{[\s\S]*?orderBy:\s*\[\s*\{\s*startedAt:\s*"desc"\s*\},\s*\{\s*createdAt:\s*"desc"\s*\}\s*\][\s\S]*?take:\s*12/m,
  },
  {
    file: "lib/cat/answer-history.ts",
    label: "answer history engagement summary uses take 12 with createdAt desc",
    pattern:
      /function loadNpCatEngagementSummary[\s\S]*?prisma\.practiceTest\.findMany\(\{[\s\S]*?orderBy:\s*\[\s*\{\s*completedAt:\s*"desc"\s*\},\s*\{\s*createdAt:\s*"desc"\s*\}\s*\][\s\S]*?take:\s*12/m,
  },
  {
    file: "lib/cat/answer-history.ts",
    label: "answer history recent exclusions uses take 12 with createdAt desc",
    pattern:
      /function recentlyAnsweredIds[\s\S]*?prisma\.practiceTest\.findMany\(\{[\s\S]*?orderBy:\s*\[\s*\{\s*startedAt:\s*"desc"\s*\},\s*\{\s*createdAt:\s*"desc"\s*\}\s*\][\s\S]*?take:\s*12/m,
  },
  {
    file: "lib/insights/cat-flash-loaders.ts",
    label: "cat flash loaders uses take 12 with createdAt desc",
    pattern:
      /prisma\.practiceTest\.findMany\(\{[\s\S]*?orderBy:\s*\[\s*\{\s*completedAt:\s*"desc"\s*\},\s*\{\s*createdAt:\s*"desc"\s*\}\s*\][\s\S]*?take:\s*12/m,
  },
];

test("bounded read regression: targeted examAttempt/session queries use exact 60/12 windows and createdAt desc ordering", () => {
  const offenders: string[] = [];

  const cached = new Map<string, string>();
  for (const expectation of EXPECTATIONS) {
    const src = cached.get(expectation.file) ?? readTarget(expectation.file);
    cached.set(expectation.file, src);
    if (!expectation.pattern.test(src)) {
      offenders.push(`${expectation.file}: ${expectation.label}`);
    }
  }

  const sourceFiles = collectSourceFiles(srcRoot);
  for (const absPath of sourceFiles) {
    if (absPath.endsWith("prisma-bounded-read-regression.test.ts")) continue;
    const src = readFileSync(absPath, "utf8");
    if (src.includes('lessonId: { startsWith: "pathway:" }') || src.includes("lessonId: { startsWith: 'pathway:' }")) {
      offenders.push(`${absPath.replace(`${srcRoot}/`, "")}: remove lessonId startsWith('pathway:') scan`);
    }
  }

  assert.deepEqual(offenders, []);
});
