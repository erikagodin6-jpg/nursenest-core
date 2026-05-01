/**
 * Plans SEO blog batch topics (dry-run by default). `--apply` would enqueue real generation — not wired to live OpenAI in CI.
 * Report: reports/seo-blog-generation-report.json (repo root).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { countWordsFromHtml } from "../../src/lib/blog/blog-word-count";

const here = dirname(fileURLToPath(import.meta.url));
/** Monorepo root (`nursenest-core/reports`, `data/blog-manifest`, …). */
const repoRoot = join(here, "..", "..", "..", "..");
const reportPath = join(repoRoot, "reports", "seo-blog-generation-report.json");

const TOPIC_CLUSTERS = {
  pharmacology: [
    "NCLEX pharmacology",
    "REx-PN pharmacology",
    "medication safety",
    "adverse effects",
    "cardiac medications nursing",
    "antibiotics NCLEX",
    "diabetes medications NCLEX",
    "anticoagulants nursing exam",
    "digoxin nursing priorities",
    "insulin therapy NCLEX traps",
  ],
  pathophysiology: [
    "heart failure pathophysiology NCLEX",
    "pulmonary edema nursing assessment",
    "acute kidney injury NCLEX",
    "shock types nursing",
    "sepsis nursing interventions",
    "DKA vs HHS NCLEX",
    "COPD exacerbation nursing",
    "asthma management NCLEX",
    "stroke nursing priorities",
    "myocardial infarction nursing care",
  ],
  alliedHealthTestPrep: [
    "MLT exam study guide",
    "paramedic certification prep",
    "respiratory therapy board review",
    "medical imaging exam prep",
    "pharmacy technician exam tips",
    "OTA PTA exam study plan",
    "PSW certification prep",
    "social work licensing exam prep",
    "psychotherapy exam prep nursing adjacent",
  ],
  nursingExams: [
    "NCLEX RN study strategy",
    "REx-PN Canadian PN prep",
    "NP board exam study plan",
    "new grad nursing exam prep",
    "Canadian nursing exam prep overview",
  ],
} as const;

function parseArgs(argv: string[]) {
  let apply = false;
  let limit = 5;
  for (const a of argv) {
    if (a === "--apply") apply = true;
    if (a.startsWith("--limit=")) limit = Math.max(1, Math.min(500, Number(a.slice("--limit=".length)) || 5));
  }
  return { apply, limit };
}

function main() {
  const { apply, limit } = parseArgs(process.argv.slice(2));
  if (apply && limit > 5 && !process.argv.includes("--i-understand-large-apply")) {
    throw new Error("Refusing --apply with --limit>5 unless --i-understand-large-apply is passed (safety cap).");
  }

  const topics: string[] = [];
  for (const g of Object.values(TOPIC_CLUSTERS)) {
    for (const t of g) topics.push(t);
  }
  const slice = topics.slice(0, limit);
  const planned = slice.map((topic, i) => ({
    ordinal: i + 1,
    topic,
    suggestedSlugBase: topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80),
    wouldEnqueuePipeline: apply,
    outlineSections: ["exam-focused intro", "clinical explanation", "test traps", "practice-style prompts", "key takeaways"],
    internalLinkTargets: ["lessons hub", "practice questions hub", "flashcards hub", "CAT practice entry", "related blog posts"],
  }));

  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        apply,
        limit,
        note: apply
          ? "Apply mode is a safety stub: wire to admin generation job or runBlogArticleGenerationPipeline with credentials before production use."
          : "Dry-run only: no Prisma writes. Use --apply after review (keeps --limit≤5 unless --i-understand-large-apply).",
        sampleWordCountProbeHtml: "<p>" + "word ".repeat(400) + "</p>",
        sampleWordCount: countWordsFromHtml("<p>" + "word ".repeat(400) + "</p>"),
        plannedPosts: planned,
      },
      null,
      2,
    ),
    "utf8",
  );

  // eslint-disable-next-line no-console
  console.log(`[seo-blog-batch] wrote ${reportPath} (apply=${apply}, limit=${limit})`);
}

main();
