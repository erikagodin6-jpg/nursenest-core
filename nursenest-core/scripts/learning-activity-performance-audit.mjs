#!/usr/bin/env node
/**
 * Read-only learning activity performance audit.
 *
 * Static source trace plus optional live cold/warm HTTP timing when
 * LEARNING_PERF_BASE_URL is provided.
 */
import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";

const root = process.cwd();
const outPath = path.join(root, "docs", "reports", "learning-activity-performance.md");

const FLOWS = [
  {
    name: "Lesson launcher",
    route: "/app/lessons",
    files: ["src/app/(app)/app/(learner)/lessons/page.tsx", "src/components/student/learner-lessons-responsive-results.tsx"],
    api: ["src/app/api/lessons/route.ts"],
  },
  {
    name: "Lesson detail",
    route: "/app/lessons/[id]",
    files: ["src/app/(app)/app/(learner)/lessons/[id]/page.tsx", "src/components/lessons/pathway-lesson-study-loop-orchestrator.tsx"],
    api: ["src/app/api/learner/pathway-lesson-practice-questions/route.ts"],
  },
  {
    name: "Flashcard launcher",
    route: "/app/flashcards",
    files: ["src/app/(app)/app/(learner)/flashcards/page.tsx", "src/components/flashcards/flashcards-hub-client.tsx"],
    api: ["src/app/api/flashcards/inventory/route.ts", "src/app/api/flashcards/custom-session/route.ts"],
  },
  {
    name: "Flashcard session",
    route: "/app/flashcards/[deckRef]",
    files: [
      "src/app/(app)/app/(learner)/flashcards/[deckRef]/page.tsx",
      "src/lib/flashcards/build-flashcard-custom-session.ts",
      "src/lib/flashcards/flashcard-session-hydration.server.ts",
      "src/lib/flashcards/flashcard-session-dal.server.ts",
    ],
    api: ["src/app/api/flashcards/custom-session/route.ts", "src/app/api/flashcards/decks/[deckRef]/study/route.ts"],
  },
  {
    name: "Practice launcher",
    route: "/app/practice-tests",
    files: ["src/app/(app)/app/(learner)/practice-tests/page.tsx", "src/components/student/practice-tests-hub-client.tsx", "src/components/student/practice-exam-launcher-client.tsx"],
    api: ["src/app/api/practice-tests/route.ts", "src/app/api/questions/discovery/route.ts"],
  },
  {
    name: "Practice session",
    route: "/app/practice-tests/[id]",
    files: ["src/app/(app)/app/(learner)/practice-tests/[id]/page.tsx", "src/components/student/practice-test-runner-client.tsx", "src/lib/practice-tests/load-practice-test-shell-bootstrap.ts"],
    api: ["src/app/api/practice-tests/[id]/route.ts", "src/app/api/practice-tests/[id]/question/route.ts"],
  },
  {
    name: "CAT launcher",
    route: "/app/practice-tests/cat-launch",
    files: ["src/app/(app)/app/(learner)/practice-tests/cat-launch/page.tsx", "src/app/(app)/app/(learner)/cat/page.tsx", "src/components/student/pathway-cat-session-start-client.tsx"],
    api: ["src/app/api/practice-tests/cat-readiness/route.ts", "src/app/api/practice-tests/route.ts"],
  },
  {
    name: "CAT session",
    route: "/app/practice-tests/[id]?mode=cat",
    files: ["src/components/student/practice-test-runner-client.tsx", "src/lib/practice-tests/cat-pool.ts", "src/lib/practice-tests/cat-session.ts", "src/lib/cat/answer-history.ts", "src/lib/cat/session-persistence.ts"],
    api: ["src/app/api/practice-tests/[id]/route.ts", "src/app/api/practice-tests/[id]/question/route.ts"],
  },
];

const TOKEN_PATTERNS = {
  prisma: /\bprisma\./g,
  findMany: /\.findMany\s*\(/g,
  findFirst: /\.findFirst\s*\(/g,
  findUnique: /\.findUnique\s*\(/g,
  count: /\.count\s*\(/g,
  transaction: /\$transaction\s*\(/g,
  rawQuery: /\$queryRaw/g,
  fetch: /\bfetch\s*\(/g,
  useState: /\buseState\s*\(/g,
  useEffect: /\buseEffect\s*\(/g,
  suspense: /<Suspense\b/g,
  include: /\binclude\s*:/g,
  select: /\bselect\s*:/g,
};

function count(src, re) {
  return (src.match(re) ?? []).length;
}

async function readFile(rel) {
  const abs = path.join(root, rel);
  if (!fssync.existsSync(abs)) return null;
  return { rel, bytes: (await fs.stat(abs)).size, src: await fs.readFile(abs, "utf8") };
}

function summarizeFiles(files) {
  const totals = { bytes: 0 };
  for (const key of Object.keys(TOKEN_PATTERNS)) totals[key] = 0;
  const details = [];
  for (const file of files) {
    if (!file) continue;
    const row = { file: file.rel, bytes: file.bytes };
    totals.bytes += file.bytes;
    for (const [key, re] of Object.entries(TOKEN_PATTERNS)) {
      row[key] = count(file.src, re);
      totals[key] += row[key];
    }
    const apiCalls = [...file.src.matchAll(/fetch\s*\(\s*[`'"]([^`'"]+)/g)].map((m) => m[1]);
    const prismaCalls = [...file.src.matchAll(/prisma\.([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)/g)].map((m) => `${m[1]}.${m[2]}`);
    row.apiCalls = [...new Set(apiCalls)].slice(0, 12);
    row.prismaCalls = [...new Set(prismaCalls)].slice(0, 20);
    details.push(row);
  }
  return { totals, details };
}

function waitDiagnosis(name, s) {
  if (name === "Lesson launcher") return "Users wait on entitlement/profile resolution, contentItem count, pathwayLesson sample/list pagination, then client-side filter fetches.";
  if (name === "Lesson detail") return "Users wait on duplicated learnerPath/profile reads, pathwayLesson lookup, legacy ContentItem fallback checks, measurement preference lookup, and related/practice hydration.";
  if (name === "Flashcard launcher") return "Users wait on session + entitlement, compatible pathway bootstrap, profile lookup, and flashcard inventory aggregate transaction before the client can trust counts.";
  if (name === "Flashcard session") return "Users wait on custom pool generation: dedicated flashcards, virtual question-derived cards, progress filters, option hydration, and session persistence/hydration.";
  if (name === "Practice launcher") return "Users wait mostly after shell render: discovery counts, weak-area/readiness/performance-summary calls, then practice test creation when launching.";
  if (name === "Practice session") return "Users wait on practice test bootstrap plus repeated client saves/question fetches during the session; runner is a large client component.";
  if (name === "CAT launcher") return "Users wait on cat-readiness and POST /api/practice-tests; route shell is light but launch API is heavy.";
  return "Users wait on CAT pool count/findMany, answer history, adaptive state persistence, and per-question adaptive selection/feedback queries.";
}

async function timedFetch(base, route) {
  if (!base) return null;
  const url = new URL(route.replace("[id]", "placeholder").replace("[deckRef]", "foundation"), base);
  const t0 = performance.now();
  try {
    const res = await fetch(url, { redirect: "manual" });
    const text = await res.text();
    return { status: res.status, ms: Math.round(performance.now() - t0), bytes: Buffer.byteLength(text), location: res.headers.get("location") ?? "" };
  } catch (error) {
    return { status: "error", ms: Math.round(performance.now() - t0), bytes: 0, location: error instanceof Error ? error.message : String(error) };
  }
}

async function main() {
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  const base = process.env.LEARNING_PERF_BASE_URL || "";
  const rows = [];
  for (const flow of FLOWS) {
    const files = await Promise.all([...flow.files, ...flow.api].map(readFile));
    const summary = summarizeFiles(files);
    const cold = await timedFetch(base, flow.route);
    const warm = await timedFetch(base, flow.route);
    rows.push({ ...flow, summary, cold, warm, diagnosis: waitDiagnosis(flow.name, summary) });
  }

  const rank = [...rows].sort((a, b) => {
    const score = (r) => r.summary.totals.prisma * 4 + r.summary.totals.fetch * 3 + r.summary.totals.bytes / 5000 + r.summary.totals.findMany * 5 + r.summary.totals.transaction * 8;
    return score(b) - score(a);
  });

  const md = [
    "# Learning Activity Performance Investigation",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Measurement Status",
    "",
    base
      ? `- Live cold/warm HTTP timing used \`${base}\`. Protected routes may redirect if no authenticated cookie is supplied.`
      : "- Live authenticated cold/warm timings were not executed because `LEARNING_PERF_BASE_URL` and an authenticated session were not provided. This report uses static source tracing, route/API payload proxies, and known instrumentation points.",
    "- Static query count means source-level Prisma call sites in the route/API/client path, not executed SQL count. It is useful for locating likely wait points and N+1 risk.",
    "",
    "## Slowest Risk Ranking",
    "",
    "| Rank | Activity | Route | Source Size | Prisma Call Sites | findMany | Transactions | Client fetches | Cold | Warm | Where users wait |",
    "| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |",
    ...rank.map((r, i) => `| ${i + 1} | ${r.name} | \`${r.route}\` | ${Math.round(r.summary.totals.bytes / 1024)} KB | ${r.summary.totals.prisma} | ${r.summary.totals.findMany} | ${r.summary.totals.transaction} | ${r.summary.totals.fetch} | ${r.cold ? `${r.cold.status} ${r.cold.ms}ms` : "not measured"} | ${r.warm ? `${r.warm.status} ${r.warm.ms}ms` : "not measured"} | ${r.diagnosis} |`),
    "",
    "## Flow Details",
    "",
    ...rows.flatMap((r) => [
      `### ${r.name}`,
      "",
      `- Route: \`${r.route}\``,
      `- Data fetched: ${r.summary.details.flatMap((d) => d.prismaCalls).filter(Boolean).slice(0, 18).join(", ") || "mostly route/session helpers or client APIs"}`,
      `- API/client fetches: ${r.summary.details.flatMap((d) => d.apiCalls).filter(Boolean).slice(0, 12).join(", ") || "none detected in scanned files"}`,
      `- Data size proxy: ${Math.round(r.summary.totals.bytes / 1024)} KB across scanned route/API/client files.`,
      `- Query-count proxy: ${r.summary.totals.prisma} Prisma call sites; ${r.summary.totals.findMany} findMany; ${r.summary.totals.count} count; ${r.summary.totals.transaction} transactions; ${r.summary.totals.rawQuery} raw queries.`,
      `- Render-count proxy: ${r.summary.totals.useState} useState, ${r.summary.totals.useEffect} useEffect, ${r.summary.totals.suspense} Suspense boundaries across scanned client/server components.`,
      `- Cold load: ${r.cold ? `${r.cold.status} in ${r.cold.ms}ms (${r.cold.bytes} bytes${r.cold.location ? `, location=${r.cold.location}` : ""})` : "not measured"}.`,
      `- Warm load: ${r.warm ? `${r.warm.status} in ${r.warm.ms}ms (${r.warm.bytes} bytes${r.warm.location ? `, location=${r.warm.location}` : ""})` : "not measured"}.`,
      `- Exact wait point: ${r.diagnosis}`,
      "",
      "| File | Size | Prisma | findMany | count | tx | fetch | useState | useEffect |",
      "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
      ...r.summary.details.map((d) => `| \`${d.file}\` | ${Math.round(d.bytes / 1024)} KB | ${d.prisma} | ${d.findMany} | ${d.count} | ${d.transaction} | ${d.fetch} | ${d.useState} | ${d.useEffect} |`),
      "",
    ]),
    "## Highest-Impact Fix Order",
    "",
    "1. Add authenticated Playwright tracing for the eight flows with request/response byte counts, Server-Timing, and browser performance entries. Current source has budget tests, but not this full per-flow evidence matrix.",
    "2. Lesson detail: remove duplicate profile reads and make legacy ContentItem fallback a single bounded branch after pathwayLesson miss; defer related/practice blocks until after article shell.",
    "3. Flashcard session: cache/count-only custom-session responses already exist, but includeCards path still does multi-source pool generation. Persist a short-lived generated pool by filter signature before hydrating full cards.",
    "4. Practice/CAT launch: precompute readiness/discovery counts and avoid blocking launch UI on analytics panels.",
    "5. Practice/CAT session: batch adaptive question hydration and answer-history lookups so per-question progression does not repeatedly hit practiceTest/examQuestion.",
    "",
    "## Evidence Anchors",
    "",
    "- Flashcard launcher already measures server bootstrap time at `src/app/(app)/app/(learner)/flashcards/page.tsx:137` and logs `server_shell_ready` at `src/app/(app)/app/(learner)/flashcards/page.tsx:453`; its blocking inventory load starts at `src/app/(app)/app/(learner)/flashcards/page.tsx:389`.",
    "- Lesson launcher performs learner profile lookup at `src/app/(app)/app/(learner)/lessons/page.tsx:250`, then the client results component performs follow-up lesson API fetches at `src/components/student/learner-lessons-responsive-results.tsx:230` and `src/components/student/learner-lessons-responsive-results.tsx:284`.",
    "- Lesson detail repeats user/profile reads at `src/app/(app)/app/(learner)/lessons/[id]/page.tsx:317`, `src/app/(app)/app/(learner)/lessons/[id]/page.tsx:356`, and `src/app/(app)/app/(learner)/lessons/[id]/page.tsx:581`.",
    "- Flashcard session pool generation begins in `src/lib/flashcards/build-flashcard-custom-session.ts:207`; it queries dedicated flashcards at `src/lib/flashcards/build-flashcard-custom-session.ts:285` and `src/lib/flashcards/build-flashcard-custom-session.ts:424`, question-derived cards at `src/lib/flashcards/build-flashcard-custom-session.ts:459`, and progress filters at `src/lib/flashcards/build-flashcard-custom-session.ts:680` and `src/lib/flashcards/build-flashcard-custom-session.ts:733`.",
    "- Flashcard session persistence/hydration uses deck/session/attempt reads in `src/lib/flashcards/flashcard-session-dal.server.ts:66`, `src/lib/flashcards/flashcard-session-dal.server.ts:90`, `src/lib/flashcards/flashcard-session-dal.server.ts:182`, `src/lib/flashcards/flashcard-session-dal.server.ts:197`, `src/lib/flashcards/flashcard-session-dal.server.ts:204`, and `src/lib/flashcards/flashcard-session-dal.server.ts:205`.",
    "- Practice launcher client-side wait points are discovery at `src/components/student/practice-tests-hub-client.tsx:239` and session creation at `src/components/student/practice-tests-hub-client.tsx:394`.",
    "- Practice/CAT session runner fetches and saves against `/api/practice-tests/${testId}` repeatedly at `src/components/student/practice-test-runner-client.tsx:824`, `src/components/student/practice-test-runner-client.tsx:939`, `src/components/student/practice-test-runner-client.tsx:1271`, `src/components/student/practice-test-runner-client.tsx:1314`, `src/components/student/practice-test-runner-client.tsx:1360`, and `src/components/student/practice-test-runner-client.tsx:1518`; adaptive post-miss feedback is requested at `src/components/student/practice-test-runner-client.tsx:1432`.",
    "- CAT pool selection counts and fetches candidate questions in `src/lib/practice-tests/cat-pool.ts:122`, `src/lib/practice-tests/cat-pool.ts:160`, `src/lib/practice-tests/cat-pool.ts:172`, `src/lib/practice-tests/cat-pool.ts:207`, `src/lib/practice-tests/cat-pool.ts:327`, `src/lib/practice-tests/cat-pool.ts:348`, and `src/lib/practice-tests/cat-pool.ts:360`.",
    "- CAT answer history performs repeated practice-test history reads in `src/lib/cat/answer-history.ts:44`, `src/lib/cat/answer-history.ts:83`, `src/lib/cat/answer-history.ts:109`, and `src/lib/cat/answer-history.ts:176`; CAT session persistence reads/updates practice tests in `src/lib/cat/session-persistence.ts:278`, `src/lib/cat/session-persistence.ts:416`, `src/lib/cat/session-persistence.ts:435`, and `src/lib/cat/session-persistence.ts:466`.",
    "",
    "## Authenticated Timing Gap",
    "",
    "- No paid learner Playwright storage state was present at `tests/e2e/.auth/paid-user.json` or `playwright/.auth/learner-paid.json`.",
    "- No paid learner credential env vars were set (`QA_PAID_*`, `E2E_PAID_*`, `PLAYWRIGHT_TEST_*`).",
    "- Because these routes are protected, anonymous cold/warm HTTP timings would measure redirects or login shells, not the learner activities. They are intentionally excluded from the conclusion.",
    "",
  ].join("\n");

  await fs.writeFile(outPath, md, "utf8");
  console.log(`Wrote ${path.relative(root, outPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
