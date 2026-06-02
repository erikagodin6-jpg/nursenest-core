#!/usr/bin/env npx tsx
/**
 * Static audit: lesson index files + automatic-internal-links source symbols (no Prisma / server-only).
 *
 * Run from `nursenest-core/`: `npm run audit:related-content-links`
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..");
const INDEX_DIR = join(APP_ROOT, "src/content/pathway-lessons/generated-indexes");
const LINKS_SRC = join(APP_ROOT, "src/lib/linking/automatic-internal-links.ts");

const SAMPLE_PATHWAYS = [
  "us-rn-nclex-rn",
  "ca-rn-nclex-rn",
  "us-lpn-nclex-pn",
  "ca-rpn-rex-pn",
  "us-np-fnp",
  "ca-np-cnple",
  "us-allied-core",
  "ca-allied-core",
  "us-rn-new-grad-transition",
] as const;

function main() {
  const indexFiles = existsSync(INDEX_DIR) ? readdirSync(INDEX_DIR).filter((f) => f.endsWith(".json")) : [];
  const missingIndexes: string[] = [];
  let lessonRows = 0;
  for (const pid of SAMPLE_PATHWAYS) {
    const p = join(INDEX_DIR, `${pid}.json`);
    if (!existsSync(p)) {
      missingIndexes.push(pid);
      continue;
    }
    try {
      const j = JSON.parse(readFileSync(p, "utf8")) as { summaries?: unknown[] };
      lessonRows += Array.isArray(j.summaries) ? j.summaries.length : 0;
    } catch {
      missingIndexes.push(`${pid} (parse error)`);
    }
  }

  const linksSrc = readFileSync(LINKS_SRC, "utf8");
  const checks = [
    ["fetchRelatedBlogCandidatesForPathwayLesson", /fetchRelatedBlogCandidatesForPathwayLesson/],
    ["tier gate pathwayIdForBlogPost", /pathwayIdForBlogPost\(\{ exam: r\.exam/],
    ["lesson merge blogs bucket", /blogs: \[dbLessonBlogs, registry\.blogs\]/],
    ["export fetchRelatedBlogReadingLinksForPathwayLesson", /fetchRelatedBlogReadingLinksForPathwayLesson/],
  ] as const;
  const failed = checks.filter(([, re]) => !re.test(linksSrc)).map(([name]) => name);

  const report = {
    indexFileCount: indexFiles.length,
    samplePathwaysChecked: SAMPLE_PATHWAYS.length,
    sampleLessonIndexRowsSummed: lessonRows,
    missingOrBrokenIndexes: missingIndexes,
    automaticInternalLinksSourceChecksFailed: failed,
    ok: missingIndexes.length === 0 && failed.length === 0,
  };
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 1;
}

main();
