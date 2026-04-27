/**
 * Build `src/content/lessons/lesson-library.json` from bundled catalogs + scoped-gold (per pathway),
 * deduped globally by `slug`, with normalized `topic` and premiumized `title`.
 *
 * Run from `nursenest-core`: `npx tsx scripts/build-lesson-library.mts`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getCatalogLessonsRawFromBundledOnly } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { normalizeLessonCategory, premiumizeLessonDisplayTitle } from "@/lib/lessons/lesson-taxonomy";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CORE = path.resolve(__dirname, "..");
const OUT_JSON = path.join(CORE, "src/content/lessons/lesson-library.json");
const OUT_REPORT = path.join(CORE, "..", "reports", "lesson-refactor-report.md");

const PATHWAYS = [
  "us-rn-nclex-rn",
  "ca-rn-nclex-rn",
  "ca-rpn-rex-pn",
  "us-lpn-nclex-pn",
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-pmhnp",
  "us-np-whnp",
  "us-np-pnp-pc",
  "ca-np-cnple",
] as const;

function main(): void {
  let rawRowCount = 0;
  const bySlug = new Map<
    string,
    {
      lesson: Record<string, unknown>;
      pathwayIds: Set<string>;
    }
  >();

  for (const pid of PATHWAYS) {
    const rows = getCatalogLessonsRawFromBundledOnly(pid);
    rawRowCount += rows.length;
    for (const row of rows) {
      const slug = typeof row.slug === "string" ? row.slug : "";
      if (!slug) continue;
      const topic = typeof row.topic === "string" ? row.topic : "";
      const title = typeof row.title === "string" ? row.title : "";
      const hit = bySlug.get(slug);
      if (!hit) {
        const nextTopic = normalizeLessonCategory(topic);
        const nextTitle = premiumizeLessonDisplayTitle(title, slug);
        const lesson = { ...(row as unknown as Record<string, unknown>), topic: nextTopic, title: nextTitle };
        bySlug.set(slug, { lesson, pathwayIds: new Set([pid]) });
      } else {
        hit.pathwayIds.add(pid);
      }
    }
  }

  const lessons = [...bySlug.entries()].map(([slug, v]) => ({
    ...v.lesson,
    slug,
    pathwayIds: [...v.pathwayIds].sort(),
  }));

  const dir = path.dirname(OUT_JSON);
  fs.mkdirSync(dir, { recursive: true });
  const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    lessons,
  };
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  const reportDir = path.dirname(OUT_REPORT);
  fs.mkdirSync(reportDir, { recursive: true });
  const duplicateSlotsMerged = rawRowCount - lessons.length;
  const report = `# Lesson library refactor (generated)

- **Generated at:** ${payload.generatedAt}
- **Source:** bundled \`catalog.json\` + allied + new-grad + scoped-gold via \`getCatalogLessonsRawFromBundledOnly\` per pathway.
- **Pathways merged:** ${PATHWAYS.join(", ")}

## Counts

| Metric | Value |
|--------|------:|
| Total lesson rows summed across pathways (before global dedupe) | ${rawRowCount} |
| Unique slugs in \`lesson-library.json\` (after) | ${lessons.length} |
| Rows consolidated by shared slug across pathways | ${duplicateSlotsMerged} |

## Notes

- Each library row includes \`pathwayIds\` listing every pathway that referenced that slug.
- \`topic\` is normalized with \`normalizeLessonCategory\`; \`title\` with \`premiumizeLessonDisplayTitle\` (incl. NP integrated-review rewrite and ≤6-word clamp).
- Runtime loads this file when present; see \`getCatalogLessonsRaw\` in \`pathway-lesson-catalog-sync.ts\`.
`;
  fs.writeFileSync(OUT_REPORT, report, "utf8");

  console.log(`Wrote ${lessons.length} lessons → ${OUT_JSON}`);
  console.log(`Wrote report → ${OUT_REPORT}`);
}

void main();
