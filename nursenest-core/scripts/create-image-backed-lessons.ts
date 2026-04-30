/**
 * Plan / queue creation of catalog lessons for image-map rows with no catalog match.
 * Default --dryRun=true: prints JSON only. When --dryRun=false, writes a draft queue file (does not mutate catalog.json).
 *
 * Usage:
 *   node scripts/create-image-backed-lessons.mjs --dryRun=true --limit=5
 *   node scripts/create-image-backed-lessons.mjs --dryRun=false --limit=1 --pathway=ca-rn-nclex-rn --publish=false
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import catalog from "@/content/pathway-lessons/catalog.json";
import { getInventoryKeys } from "@/lib/education-images/inventory";
import { auditAllMappedLessonImages } from "@/lib/lessons/image-backed-lesson-audit";
import { LESSON_IMAGE_MAP } from "@/lib/lessons/lesson-image-map";
import { getCatalogLessonsRawFromBundledOnly } from "@/lib/lessons/pathway-lesson-catalog-sync";

function parseArg(name: string, def: string | null): string | null {
  const raw = process.argv.find((a) => a.startsWith(`${name}=`));
  if (!raw) return def;
  const v = raw.slice(name.length + 1).trim();
  return v.length ? v : def;
}

const dryRun = (parseArg("dryRun", "true") ?? "true").toLowerCase() !== "false";
const publish = (parseArg("publish", "false") ?? "false").toLowerCase() === "true";
const limitRaw = parseArg("limit", "10") ?? "10";
const limit = Math.max(1, Math.min(500, Number.parseInt(limitRaw, 10) || 10));
const pathwayFilter = parseArg("pathway", null);

const pathwayIds = Object.keys((catalog as { pathways: Record<string, unknown> }).pathways ?? {}).sort();
const lessonsByPathway = new Map<string, ReadonlyArray<{ slug: string; title?: string }>>();
for (const id of pathwayIds) {
  lessonsByPathway.set(id, getCatalogLessonsRawFromBundledOnly(id));
}

const rows = auditAllMappedLessonImages({
  inventoryKeys: [...getInventoryKeys()],
  lessonsByPathway,
});

let missing = rows.filter((r) => r.status === "missing");
if (pathwayFilter) {
  missing = missing.filter((r) => r.suggestedPathways.includes(pathwayFilter));
}
missing = missing.slice(0, limit);

const proposals = missing.map((r) => {
  const entry = LESSON_IMAGE_MAP.find((e) => e.objectKey.replace(/^\/+/, "") === r.objectKey);
  const primarySlug = entry?.slugs?.[0] ?? r.objectKey.replace(/\.(png|jpe?g|webp)$/i, "");
  return {
    objectKey: r.objectKey,
    suggestedSlug: primarySlug,
    inferredTopic: r.inferredTopic,
    suggestedPathways: [...r.suggestedPathways],
    publishRequested: publish,
    note: "Review clinical scope before merging into pathway expansion JSON or catalog. This tool does not auto-edit catalog.json.",
  };
});

const payload = { generatedAt: new Date().toISOString(), dryRun, publish, limit, pathwayFilter, proposals };

if (dryRun) {
  // eslint-disable-next-line no-console -- CLI
  console.log(JSON.stringify(payload, null, 2));
  // eslint-disable-next-line no-console -- CLI
  console.error(`Dry run: ${proposals.length} missing image(s) queued (cap limit=${limit}).`);
  process.exit(0);
}

const outDir = join(process.cwd(), "data", "image-backed-lesson-drafts");
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, `create-queue-${Date.now()}.json`);
writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
// eslint-disable-next-line no-console -- CLI
console.error(`Wrote draft queue (${proposals.length} proposals) → ${outFile}`);
