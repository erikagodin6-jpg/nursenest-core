/**
 * Static audit: pathway catalog + scoped gold merged lessons vs public structural gate.
 * Writes repo-root data/audit/lesson-route-enforcement-audit.json and lesson-route-enforcement-summary.md
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getCatalogLessonsRaw, normalizeLesson } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { pathwayLessonEligibleForPublicMarketingSurface } from "@/lib/lessons/pathway-lesson-route-access";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..", "..", "data", "audit");

type Row = {
  pathwayId: string;
  slug: string;
  publicComplete: boolean;
  structureMode?: string;
  issues: string[];
};

function auditPathway(pathwayId: string): Row[] {
  const out: Row[] = [];
  for (const raw of getCatalogLessonsRaw(pathwayId)) {
    const lesson = normalizeLesson(raw, pathwayId);
    const publicComplete = pathwayLessonEligibleForPublicMarketingSurface(lesson);
    out.push({
      pathwayId,
      slug: lesson.slug,
      publicComplete,
      structureMode: lesson.structuralQuality?.structureMode,
      issues: lesson.structuralQuality?.issues ?? [],
    });
  }
  return out;
}

const PATHWAYS = [
  "us-rn-nclex-rn",
  "ca-rn-nclex-rn",
  "us-lpn-nclex-pn",
  "ca-rpn-rex-pn",
];

const rows: Row[] = [];
for (const pid of PATHWAYS) {
  rows.push(...auditPathway(pid));
}

const incomplete = rows.filter((r) => !r.publicComplete);
const complete = rows.filter((r) => r.publicComplete);

const payload = {
  generatedAt: new Date().toISOString(),
  pathways: PATHWAYS,
  totals: {
    rows: rows.length,
    publicComplete: complete.length,
    notPublicComplete: incomplete.length,
  },
  notPublicCompleteSlugs: incomplete.map((r) => ({
    pathwayId: r.pathwayId,
    slug: r.slug,
    structureMode: r.structureMode,
    issueSample: r.issues.slice(0, 3),
  })),
  notes: {
    hubListing: "Hub/topic lists use sortAndFilterLessonsForPathwayContext which filters !publicComplete.",
    detailRoute:
      "Marketing lesson detail uses resolveMarketingPathwayLessonRouteResolution (notFound when !publicComplete).",
    paywall:
      "Unauthorized users: visibleSectionsForLesson + sanitizePaywallPreviewSection; JSON-LD description truncated; no full audio/editorial notices.",
    sitemap:
      "listPathwayLessonSlugBatch may still list slugs that 404 on detail until batching filters public-complete rows.",
  },
};

mkdirSync(ROOT, { recursive: true });
writeFileSync(join(ROOT, "lesson-route-enforcement-audit.json"), `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const md = `# Lesson route enforcement audit

Generated: ${payload.generatedAt}

## Summary

| Metric | Count |
|--------|------:|
| Pathways scanned | ${PATHWAYS.length} |
| Lesson rows (catalog merge per pathway) | ${rows.length} |
| \`publicComplete\` | ${complete.length} |
| Not public-complete (detail → **404**, hub **hidden**) | ${incomplete.length} |

## Enforcement (code)

- **Decision:** \`resolveMarketingPathwayLessonRouteResolution\` / \`getLessonRouteAccessDecision\` — \`src/lib/lessons/pathway-lesson-route-access.ts\`.
- **Completeness:** \`pathwayLessonEligibleForPublicMarketingSurface\` → \`structuralQuality.publicComplete\`.
- **Hubs:** \`sortAndFilterLessonsForPathwayContext\` drops incomplete lessons.
- **Paywall:** First-section preview only; \`sanitizePaywallPreviewSection\` strips figures/checkpoints/recall for unpaid users.

## Sample incomplete slugs (first 40)

${incomplete
  .slice(0, 40)
  .map((r) => `- \`${r.pathwayId}\` / \`${r.slug}\` (${r.structureMode ?? "?"})`)
  .join("\n")}

## Notes

- ${payload.notes.sitemap}
`;

writeFileSync(join(ROOT, "lesson-route-enforcement-summary.md"), md, "utf8");

console.log(JSON.stringify(payload.totals, null, 2));
