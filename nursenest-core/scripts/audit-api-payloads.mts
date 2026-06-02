import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

type ApiRisk = {
  route: string;
  file: string;
  fileBytes: number;
  lineCount: number;
  thresholdClass: "<100KB" | "100KB+" | "250KB+" | "500KB+" | "1MB+";
  riskScore: number;
  reasons: string[];
  heavyFields: string[];
  protections: string[];
  recommendations: string[];
};

const ROOT = process.cwd();
const API_ROOT = path.join(ROOT, "src/app/api");

const HEAVY_FIELD_PATTERNS: Array<[string, RegExp]> = [
  ["rationale", /\brationale\b/g],
  ["options", /\boptions\b/g],
  ["answerKey/correctAnswer", /\b(answerKey|correctAnswer|correctAnswerLine)\b/g],
  ["body/content", /\b(body|content|localizedBody|bodyHtmlSnapshot)\b/g],
  ["sections", /\bsections\b/g],
  ["exhibitData", /\bexhibitData\b/g],
  ["images/media", /\b(images|coverImage|fileAsset|imageUrl|media)\b/g],
  ["questionIds/full pools", /\b(questionIds|candidateIds|pool|allRows|allQuestions|allFlashcards)\b/g],
  ["flashcard back/pearls", /\b(back|clinicalPearl|memoryAnchor|commonMistake|keyTakeaway)\b/g],
  ["localized full text", /\b(localizedBody|canonical\.body|bodyHtmlSnapshot)\b/g],
];

function apiRouteFromFile(file: string): string {
  const rel = path.relative(API_ROOT, file).replaceAll(path.sep, "/");
  return `/api/${rel.replace(/\/route\.(ts|js)$/, "").replace(/\[(.+?)\]/g, ":$1").replace(/\/index$/, "")}`;
}

async function walk(dir: string): Promise<string[]> {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(abs)));
    } else if (entry.isFile() && /^route\.(ts|js)$/.test(entry.name)) {
      files.push(abs);
    }
  }
  return files;
}

function countMatches(text: string, regex: RegExp): number {
  return [...text.matchAll(regex)].length;
}

function hasUnboundedFindMany(text: string): boolean {
  const matches = [...text.matchAll(/findMany\s*\(\s*\{[\s\S]{0,1600}?\}\s*\)/g)];
  return matches.some((match) => !/\btake\s*:|\blimit\s*:/.test(match[0]));
}

function hasHeavyInclude(text: string): boolean {
  return /include\s*:\s*\{[\s\S]{0,1200}?\b(true|include\s*:)\b/.test(text);
}

function hasFullMode(text: string): boolean {
  return /mode.*full|responseMode\s*===\s*["']full["']|fields:\s*responseMode/.test(text);
}

function thresholdForScore(score: number): ApiRisk["thresholdClass"] {
  if (score >= 18) return "1MB+";
  if (score >= 13) return "500KB+";
  if (score >= 8) return "250KB+";
  if (score >= 4) return "100KB+";
  return "<100KB";
}

function analyzeRoute(file: string, text: string): ApiRisk {
  const reasons: string[] = [];
  const protections: string[] = [];
  const recommendations: string[] = [];
  const heavyFields: string[] = [];

  let riskScore = 0;
  const fileBytes = Buffer.byteLength(text, "utf8");
  const lineCount = text.split(/\r?\n/).length;
  const route = apiRouteFromFile(file);

  for (const [label, regex] of HEAVY_FIELD_PATTERNS) {
    const count = countMatches(text, regex);
    if (count > 0) {
      heavyFields.push(`${label} (${count})`);
      riskScore += Math.min(4, count);
    }
  }

  const findManyCount = countMatches(text, /findMany\s*\(/g);
  const rawQueryCount = countMatches(text, /\$queryRaw/g);
  const jsonCount = countMatches(text, /(NextResponse|Response)\.json|jsonResponseGuarded/g);
  const selectCount = countMatches(text, /select\s*:\s*\{/g);
  const includeCount = countMatches(text, /include\s*:\s*\{/g);

  if (findManyCount > 0) {
    reasons.push(`${findManyCount} findMany call(s)`);
    riskScore += findManyCount;
  }
  if (rawQueryCount > 0) {
    reasons.push(`${rawQueryCount} raw SQL call(s)`);
    riskScore += rawQueryCount;
  }
  if (hasUnboundedFindMany(text)) {
    reasons.push("one or more findMany blocks lack an obvious take/limit in the local call");
    riskScore += 5;
    recommendations.push("Add explicit take/pageSize caps or move to cursor/snapshot pagination.");
  }
  if (hasHeavyInclude(text)) {
    reasons.push("include-heavy Prisma response shape detected");
    riskScore += 4;
    recommendations.push("Replace include-heavy reads with route-specific select shapes.");
  }
  if (hasFullMode(text)) {
    reasons.push("full response mode or full-content branch detected");
    riskScore += 5;
    recommendations.push("Default to summary/preview mode and hydrate full detail on demand.");
  }
  if (/\b(body|content|sections|rationale|options)\s*:\s*true/.test(text)) {
    reasons.push("large text/json fields explicitly selected");
    riskScore += 4;
    recommendations.push("Split body/rationale/options/sections into detail endpoints or first-batch hydration.");
  }
  if (/\bquestionIds\b|\bcardIds\b|\bsessionPool\b|\bcandidateIds\b/.test(text)) {
    reasons.push("large ID array or pool state may be serialized");
    riskScore += 3;
    recommendations.push("Return a session id plus first batch instead of full pool arrays where possible.");
  }
  if (selectCount > 0) protections.push(`${selectCount} select shape(s)`);
  if (includeCount > 0) protections.push(`${includeCount} include shape(s) to review`);
  if (/jsonResponseGuarded/.test(text)) protections.push("jsonResponseGuarded hard cap");
  if (/logLargeApiResponse|estimateJsonUtf8Bytes|QUESTION_PAYLOAD_WARN_BYTES/.test(text)) protections.push("payload-size instrumentation");
  if (/parseBoundedPageSize|parseLessonLibraryLimit|MAX_QUESTION_PAGE_SIZE|API_LIST_PAGE_SIZE_HARD_MAX|Math\.min\([^)]*(pageSize|limit|take|MAX_BATCH)/.test(text)) {
    protections.push("bounded page size");
  }
  if (/cursor|page|skip|take/.test(text)) protections.push("pagination/cursor parameters");
  if (jsonCount === 0) protections.push("no JSON response detected");

  if (recommendations.length === 0) {
    if (riskScore >= 4) recommendations.push("Verify measured payload in live audit and keep response under 100KB.");
    else recommendations.push("No immediate reduction needed; keep select shape and pagination.");
  }

  return {
    route,
    file: path.relative(ROOT, file).replaceAll(path.sep, "/"),
    fileBytes,
    lineCount,
    thresholdClass: thresholdForScore(riskScore),
    riskScore,
    reasons,
    heavyFields,
    protections,
    recommendations: [...new Set(recommendations)],
  };
}

function csvCell(value: unknown): string {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function csv(rows: ApiRisk[]): string {
  const header = [
    "Route",
    "File",
    "Payload Risk Class",
    "Risk Score",
    "File Bytes",
    "Line Count",
    "Reasons",
    "Heavy Fields",
    "Protections",
    "Recommendations",
  ];
  const lines = rows.map((row) =>
    [
      row.route,
      row.file,
      row.thresholdClass,
      row.riskScore,
      row.fileBytes,
      row.lineCount,
      row.reasons.join("; "),
      row.heavyFields.join("; "),
      row.protections.join("; "),
      row.recommendations.join("; "),
    ]
      .map(csvCell)
      .join(","),
  );
  return [header.map(csvCell).join(","), ...lines].join("\n");
}

function table(rows: ApiRisk[]): string {
  const header = "| Route | Risk | File | Why It Can Be Large | Protections | Recommended Reduction |";
  const divider = "|---|---|---|---|---|---|";
  const body = rows
    .map((row) =>
      [
        row.route,
        row.thresholdClass,
        row.file,
        [...row.reasons, ...row.heavyFields.slice(0, 4)].join("; ") || "Low static payload risk",
        row.protections.join("; ") || "None detected",
        row.recommendations.join("; "),
      ]
        .map((cell) => String(cell).replaceAll("|", "\\|"))
        .join(" | "),
    )
    .map((line) => `| ${line} |`)
    .join("\n");
  return `${header}\n${divider}\n${body}`;
}

async function main(): Promise<void> {
  const files = await walk(API_ROOT);
  const rows = (
    await Promise.all(
      files.map(async (file) => {
        const text = await readFile(file, "utf8");
        return analyzeRoute(file, text);
      }),
    )
  ).sort((a, b) => b.riskScore - a.riskScore || b.fileBytes - a.fileBytes);

  const byThreshold = new Map<ApiRisk["thresholdClass"], number>();
  for (const row of rows) byThreshold.set(row.thresholdClass, (byThreshold.get(row.thresholdClass) ?? 0) + 1);

  const highRisk = rows.filter((row) => row.thresholdClass !== "<100KB");
  const topRoutes = rows.slice(0, 35);
  const publicLearningRoutes = rows.filter((row) =>
    /\/api\/(questions|lessons|flashcards|practice-tests|learner\/pathway-lessons|study-tools|cat)/.test(row.route),
  );

  const report = `# API Payload Audit

Generated: ${new Date().toISOString()}

## Scope

- API route files inspected: ${rows.length}
- Static analysis target: identify response shapes likely to exceed 100KB, 250KB, 500KB, or 1MB.
- Live response capture: not run in this pass because authenticated API measurements require a running app session. The CSV output is structured so measured payload bytes can be added in a follow-up Playwright/API probe.

## Threshold Summary

| Threshold Class | Route Count |
|---|---:|
| <100KB | ${byThreshold.get("<100KB") ?? 0} |
| 100KB+ | ${byThreshold.get("100KB+") ?? 0} |
| 250KB+ | ${byThreshold.get("250KB+") ?? 0} |
| 500KB+ | ${byThreshold.get("500KB+") ?? 0} |
| 1MB+ | ${byThreshold.get("1MB+") ?? 0} |

## Highest-Risk API Responses

${table(topRoutes)}

## Learning Payload Routes

${table(publicLearningRoutes)}

## Findings

1. **Question bank payloads are the primary learner-facing risk.** \`/api/questions\` supports \`full\` mode and explicitly selects \`rationale\`, \`options\`, \`exhibitData\`, and \`images\`. It has page-size limits and \`jsonResponseGuarded\`, but full-mode responses can still approach the 500KB hard guard.
2. **Practice test session endpoints can serialize full session state.** Practice test routes contain large route handlers, multiple findMany calls, question IDs, configs, rationales, and session payloads. These should return shell + first batch + session id wherever possible.
3. **Flashcard study endpoints are bounded but carry rich card backs.** The deck study route caps batches at 40 and logs large responses, but back/clinical pearl/memory/exam fields can still push responses above 100KB when the requested count is high.
4. **Lesson list APIs are mostly protected.** Pathway lesson list endpoints return card summaries, paginate, and avoid sections/body in list rows. Detail/admin lesson endpoints that return sections/body are the payload risks.
5. **Admin/content-generation APIs are the highest non-learner risk.** Admin blog, localized blog, draft, and pathway lesson authoring routes intentionally move full body/section payloads. These should not be on learner conversion paths, but they need pagination and editor-specific lazy hydration.

## Reduction Plan

- Keep list endpoints under 100KB by returning summary fields only: id, slug, title, excerpt/summary, status, counts, and progress.
- Move rationales, answer keys, lesson sections, localized bodies, full blog HTML, and flashcard backs to detail or first-batch endpoints.
- For practice/CAT/flashcard sessions, return \`sessionId\`, metadata, and the first item batch. Hydrate review/results/remediation panels lazily.
- Replace include-heavy Prisma reads with explicit \`select\` projections.
- Keep \`API_LIST_PAGE_SIZE_HARD_MAX = 50\`, but use stricter endpoint-level caps for rich content: questions full mode <= 20, flashcard study <= 20, practice review batches <= 10.
- Enable \`jsonResponseGuarded\` on every learner/content API route that can return arrays or rich text.

## Target State

Most API responses should stay below 100KB. Responses above 250KB should be exceptional and logged. Responses above 500KB should be rejected or split. No API response should exceed 1MB.
`;

  await mkdir(path.join(ROOT, "docs/reports"), { recursive: true });
  await mkdir(path.join(ROOT, "reports"), { recursive: true });
  await writeFile(path.join(ROOT, "docs/reports/api-payload-audit.md"), report);
  await writeFile(path.join(ROOT, "reports/api-payload-audit.csv"), csv(rows));

  console.log(`Inspected ${rows.length} API routes.`);
  console.log(`Flagged ${highRisk.length} routes at 100KB+ static payload risk.`);
  console.log("Wrote docs/reports/api-payload-audit.md");
  console.log("Wrote reports/api-payload-audit.csv");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

