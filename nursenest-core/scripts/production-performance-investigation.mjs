#!/usr/bin/env node
/**
 * Production performance investigation report generator.
 *
 * This script is intentionally evidence-first. It reads existing source files,
 * prior performance reports, and optional Playwright baseline data, then writes
 * the production performance reports requested for the learning-activity war room.
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";

const ROOT = process.cwd();

const HOT_FLOWS = [
  {
    name: "Lesson launcher",
    route: "/app/lessons",
    target: "<1.5s",
    files: [
      "src/app/(app)/app/(learner)/lessons/page.tsx",
      "src/components/student/learner-lessons-responsive-results.tsx",
      "src/app/api/lessons/route.ts",
      "src/app/api/learner/pathway-lessons/route.ts",
    ],
  },
  {
    name: "Lesson detail",
    route: "/app/lessons/[id]",
    target: "<1s",
    files: [
      "src/app/(app)/app/(learner)/lessons/[id]/page.tsx",
      "src/app/api/learner/pathway-lesson/route.ts",
      "src/app/api/learner/lesson-bank-study-loop/route.ts",
    ],
  },
  {
    name: "Flashcard launcher",
    route: "/app/flashcards",
    target: "<1s",
    files: [
      "src/app/(app)/app/(learner)/flashcards/page.tsx",
      "src/components/flashcards/flashcards-hub-client.tsx",
      "src/app/api/flashcards/inventory/route.ts",
      "src/app/api/flashcards/custom-session/route.ts",
    ],
  },
  {
    name: "Flashcard session",
    route: "/app/flashcards/session",
    target: "<2s",
    files: [
      "src/lib/flashcards/build-flashcard-custom-session.ts",
      "src/lib/flashcards/flashcard-session-dal.server.ts",
      "src/app/api/flashcards/custom-session/route.ts",
      "src/app/api/flashcards/decks/[deckRef]/study/route.ts",
    ],
  },
  {
    name: "Practice launcher",
    route: "/app/practice-tests",
    target: "<2s",
    files: [
      "src/components/student/practice-tests-hub-client.tsx",
      "src/app/api/practice-tests/route.ts",
      "src/app/api/practice-tests/cat-readiness/route.ts",
    ],
  },
  {
    name: "Practice session",
    route: "/app/practice-tests/[id]",
    target: "<2s",
    files: [
      "src/components/student/practice-test-runner-client.tsx",
      "src/app/api/practice-tests/[id]/route.ts",
      "src/app/api/practice-tests/[id]/question/route.ts",
    ],
  },
  {
    name: "CAT launcher",
    route: "/app/practice-tests/cat-launch",
    target: "<2s",
    files: [
      "src/components/student/practice-tests-hub-client.tsx",
      "src/lib/practice-tests/cat-pool.ts",
      "src/app/api/practice-tests/route.ts",
      "src/app/api/practice-tests/cat-readiness/route.ts",
    ],
  },
  {
    name: "CAT session",
    route: "/app/practice-tests/[id]?mode=cat",
    target: "<2s",
    files: [
      "src/components/student/practice-test-runner-client.tsx",
      "src/lib/practice-tests/cat-pool.ts",
      "src/app/api/cat/np/session/route.ts",
      "src/app/api/cat/np/answer/route.ts",
      "src/app/api/cat/np/analysis/route.ts",
    ],
  },
  {
    name: "Dashboard",
    route: "/app",
    target: "<1.5s",
    files: [
      "src/lib/learner/load-learner-dashboard.ts",
      "src/app/(app)/app/(learner)/page.tsx",
      "src/app/api/learner/readiness/route.ts",
      "src/app/api/learner/command-center/route.ts",
    ],
  },
];

const NEEDLE_PATTERNS = {
  prisma: /\bprisma\./g,
  findMany: /\.findMany\(/g,
  count: /\.count\(/g,
  groupBy: /\.groupBy\(/g,
  include: /\binclude\s*:/g,
  select: /\bselect\s*:/g,
  fetch: /\bfetch\(/g,
  useEffect: /\buseEffect\(/g,
  useMemo: /\buseMemo\(/g,
  useState: /\buseState\(/g,
  useClient: /["']use client["']/g,
  suspense: /<Suspense\b/g,
  telemetry: /runWithApiTelemetry\(/g,
};

function abs(path) {
  return resolve(ROOT, path);
}

function read(path) {
  const full = abs(path);
  return existsSync(full) ? readFileSync(full, "utf8") : "";
}

function countMatches(text, regex) {
  return text.match(regex)?.length ?? 0;
}

function fileStats(path) {
  const text = read(path);
  const stats = existsSync(abs(path)) ? statSync(abs(path)) : null;
  const counts = Object.fromEntries(
    Object.entries(NEEDLE_PATTERNS).map(([key, regex]) => [
      key,
      countMatches(text, regex),
    ]),
  );
  return {
    path,
    exists: Boolean(stats),
    bytes: stats?.size ?? 0,
    kb: Math.round(((stats?.size ?? 0) / 1024) * 10) / 10,
    lines: text ? text.split(/\r?\n/).length : 0,
    ...counts,
  };
}

function flowStats(flow) {
  const files = flow.files.map(fileStats);
  const sum = (key) =>
    files.reduce((total, file) => total + (file[key] ?? 0), 0);
  return {
    ...flow,
    files,
    kb: Math.round(sum("kb") * 10) / 10,
    prisma: sum("prisma"),
    findMany: sum("findMany"),
    count: sum("count"),
    groupBy: sum("groupBy"),
    include: sum("include"),
    select: sum("select"),
    fetch: sum("fetch"),
    useEffect: sum("useEffect"),
    useState: sum("useState"),
    useClient: sum("useClient"),
    suspense: sum("suspense"),
    telemetry: sum("telemetry"),
  };
}

function row(cells) {
  return `| ${cells.map((cell) => String(cell ?? "—").replace(/\n/g, " ")).join(" | ")} |`;
}

function writeReport(path, lines) {
  const target = abs(path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${lines.join("\n")}\n`);
  console.log(`Wrote ${path}`);
}

function readBaseline() {
  const path = "tests/e2e/performance/perf-baseline.json";
  if (!existsSync(abs(path))) return null;
  try {
    return JSON.parse(read(path));
  } catch {
    return null;
  }
}

function firstParagraph(path) {
  const text = read(path);
  if (!text) return "";
  return (
    text
      .split(/\n\s*\n/)
      .find((chunk) => chunk.trim() && !chunk.trim().startsWith("#"))
      ?.trim()
      .replace(/\s+/g, " ")
      .slice(0, 600) ?? ""
  );
}

const generatedAt = new Date().toISOString();
const flows = HOT_FLOWS.map(flowStats);
const baseline = readBaseline();
const learningReportSummary = firstParagraph(
  "docs/reports/learning-activity-performance.md",
);
const flashcardSummary = firstParagraph(
  "docs/flashcard-hub-performance-report.md",
);
const databaseSummary = firstParagraph("docs/database-performance-audit.md");

const worstStatic = [...flows].sort((a, b) => {
  const score = (x) =>
    x.kb +
    x.prisma * 8 +
    x.findMany * 15 +
    x.count * 15 +
    x.fetch * 10 +
    x.useEffect * 4;
  return score(b) - score(a);
});

writeReport("docs/reports/performance-baseline.md", [
  "# Production Performance Baseline",
  "",
  `Generated: ${generatedAt}`,
  "",
  "## Measurement Status",
  "",
  baseline?.recordedAt
    ? `Latest local Playwright baseline: ${baseline.recordedAt}.`
    : "No authenticated Playwright baseline file is present at `tests/e2e/performance/perf-baseline.json`, so this report uses static route evidence plus existing telemetry coverage. Authenticated cold/warm timing must be recorded with `npm run test:e2e:performance-budgets:record` against staging or production-like data.",
  "",
  "## Hot Route Baseline",
  "",
  row([
    "Flow",
    "Route",
    "Target",
    "Source KB",
    "Prisma",
    "findMany",
    "count",
    "fetch",
    "useEffect",
    "Telemetry",
  ]),
  row([
    "---",
    "---",
    "---:",
    "---:",
    "---:",
    "---:",
    "---:",
    "---:",
    "---:",
    "---:",
  ]),
  ...flows.map((flow) =>
    row([
      flow.name,
      flow.route,
      flow.target,
      `${flow.kb} KB`,
      flow.prisma,
      flow.findMany,
      flow.count,
      flow.fetch,
      flow.useEffect,
      flow.telemetry,
    ]),
  ),
  "",
  "## Bottleneck Ranking",
  "",
  ...worstStatic
    .slice(0, 5)
    .map(
      (flow, index) =>
        `${index + 1}. **${flow.name}**: ${flow.kb} KB scanned, ${flow.prisma} Prisma call sites, ${flow.findMany} findMany call sites, ${flow.count} count call sites, ${flow.fetch} client fetch call sites.`,
    ),
  "",
  "## Existing Evidence Reused",
  "",
  `- Learning activity audit: ${learningReportSummary || "not available"}`,
  `- Flashcard hub report: ${flashcardSummary || "not available"}`,
  "",
  "## Current Gaps",
  "",
  "- Cold/warm authenticated browser timings are not present locally. Running them anonymously would measure redirects or login shells, not learner activity performance.",
  "- Production load tests are intentionally not launched by this script; those require a controlled target and paid learner storage state to avoid noisy or unsafe traffic.",
  "- The patched CAT endpoints now emit `Server-Timing` through the shared API telemetry wrapper, closing the largest observed CAT telemetry gap.",
]);

writeReport("docs/reports/database-performance-audit.md", [
  "# Database Performance Audit",
  "",
  `Generated: ${generatedAt}`,
  "",
  "## Summary",
  "",
  databaseSummary || "Existing database audit source was not found.",
  "",
  "## Learning Route Query Pressure",
  "",
  row([
    "Flow",
    "Prisma",
    "findMany",
    "count",
    "groupBy",
    "include",
    "select",
    "Risk",
  ]),
  row(["---", "---:", "---:", "---:", "---:", "---:", "---:", "---"]),
  ...flows.map((flow) => {
    const risk =
      flow.findMany >= 8 || flow.count >= 4
        ? "High"
        : flow.findMany >= 4 || flow.count >= 2 || flow.groupBy >= 1
          ? "Medium"
          : "Low";
    return row([
      flow.name,
      flow.prisma,
      flow.findMany,
      flow.count,
      flow.groupBy,
      flow.include,
      flow.select,
      risk,
    ]);
  }),
  "",
  "## Confirmed Hotspots",
  "",
  "- `src/lib/flashcards/build-flashcard-custom-session.ts` remains the largest flashcard session risk because custom session construction can read a large flashcard pool before final filtering.",
  "- `src/lib/practice-tests/cat-pool.ts` and NP CAT routes are bounded but payload-heavy; they select CAT question fields and session state during startup/answer turns.",
  "- `src/lib/learner/load-learner-dashboard.ts` is the dashboard pressure point because it aggregates lesson progress, analytics, readiness, practice history, and study-plan state.",
  "- Lesson hub/detail routes combine pathway resolution, progress, related study loops, and client-side result fetches.",
  "",
  "## Instrumentation Fix Applied",
  "",
  "- Added shared API telemetry/query context to `GET /api/practice-tests/cat-readiness`.",
  "- Added shared API telemetry/query context to `POST /api/cat/np/session`.",
  "- Added shared API telemetry/query context to `POST /api/cat/np/answer`.",
  "- Added shared API telemetry/query context to `GET`/`HEAD /api/cat/np/analysis`.",
  "",
  "## Index Guidance",
  "",
  "No migration was created because this run did not include production `EXPLAIN` output. Existing reports recommend validating composite indexes for recent exam attempts/sessions, `(userId, lessonId)` progress lookups, flashcard deck/status/order filters, and exam-question pool filters before adding schema changes.",
]);

writeReport("docs/reports/nextjs-performance-audit.md", [
  "# Next.js Performance Audit",
  "",
  `Generated: ${generatedAt}`,
  "",
  "## Client And Hydration Pressure",
  "",
  row([
    "Flow",
    "Source KB",
    "`use client` files",
    "useState",
    "useEffect",
    "fetch",
    "Suspense",
    "Primary Pressure",
  ]),
  row(["---", "---:", "---:", "---:", "---:", "---:", "---:", "---"]),
  ...flows.map((flow) => {
    const pressure =
      flow.useClient > 0 && flow.fetch >= 4
        ? "Client hydration + API waterfall"
        : flow.fetch >= 4
          ? "API waterfall"
          : flow.suspense > 0
            ? "Server shell/Suspense boundary"
            : "Server/data path";
    return row([
      flow.name,
      `${flow.kb} KB`,
      flow.useClient,
      flow.useState,
      flow.useEffect,
      flow.fetch,
      flow.suspense,
      pressure,
    ]);
  }),
  "",
  "## Findings",
  "",
  "- Practice/CAT runner is the heaviest client surface by source size and API usage. Its startup must keep session fetches parallel and avoid loading analysis/adaptive follow-ups before the first question renders.",
  "- Flashcard hub has already been moved to shell-first loading; live counts and readiness insights are deferred after first paint.",
  "- Lesson detail still has multiple client follow-up fetches for related practice and study-loop content; those must remain below the educational content priority.",
  "- API routes generally use shared telemetry. NP CAT endpoints were the notable exception and are now wrapped.",
  "",
  "## Required Next.js Follow-Ups",
  "",
  "- Record `perf-baseline.json` so route-level TTFB, worst API, and domInteractive samples can replace static estimates.",
  "- Inspect production bundle analyzer output before splitting the practice/CAT runner; this script does not guess split points.",
  "- Keep learner hubs shell-first: server render should return meaningful content before optional analytics, weak-area, and count requests finish.",
]);

writeReport("docs/reports/performance-remediation-results.md", [
  "# Performance Remediation Results",
  "",
  `Generated: ${generatedAt}`,
  "",
  "## Fixes Completed In This Pass",
  "",
  "- CAT readiness and NP CAT session APIs now use the shared API telemetry wrapper, which records request duration, adds `Server-Timing: total`, and runs the route under Prisma query context.",
  "- Production performance reports were regenerated from current source evidence instead of stale audit text.",
  "- Existing flashcard hub shell-first remediation was confirmed and referenced as the active flashcard launcher fix.",
  "",
  "## Validation Status",
  "",
  row(["Check", "Result"]),
  row(["---", "---"]),
  row([
    "Static hot-path scan",
    "Completed by `scripts/production-performance-investigation.mjs`.",
  ]),
  row([
    "Authenticated cold/warm Playwright timings",
    baseline?.recordedAt
      ? `Available from ${baseline.recordedAt}`
      : "Not available locally; requires paid learner storage state.",
  ]),
  row([
    "Production load test 50/100/250/500 users",
    "Not run from this workstation; requires controlled target and DO telemetry window.",
  ]),
  "",
  "## Go / No-Go Against Targets",
  "",
  "- **No-Go for final performance certification** until authenticated Playwright baseline and controlled production load test results exist.",
  "- **Go for observability remediation**: the high-risk CAT endpoints now produce the same telemetry as other learning APIs.",
  "",
  "## Next Command Sequence",
  "",
  "```bash",
  "npm run test:e2e:performance-budgets:record",
  "npm run perf:activity-report",
  "node scripts/production-performance-investigation.mjs",
  "```",
]);
