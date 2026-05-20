/**
 * Audit: clinical images in inventory + lesson-image-map vs merged bundled catalogs.
 *
 * Usage (from nursenest-core): node scripts/audit-image-backed-missing-lessons.mjs [--json]
 */
import catalog from "@/content/pathway-lessons/catalog.json";
import { getInventoryKeys } from "@/lib/education-images/inventory";
import { auditAllMappedLessonImages } from "@/lib/lessons/image-backed-lesson-audit";
import { getCatalogLessonsRawFromBundledOnly } from "@/lib/lessons/pathway-lesson-catalog-sync";

const jsonMode = process.argv.includes("--json");

const pathwayIds = Object.keys((catalog as { pathways: Record<string, unknown> }).pathways ?? {}).sort();
const lessonsByPathway = new Map<string, ReadonlyArray<{ slug: string; title?: string }>>();
for (const id of pathwayIds) {
  lessonsByPathway.set(id, getCatalogLessonsRawFromBundledOnly(id));
}

const rows = auditAllMappedLessonImages({
  inventoryKeys: [...getInventoryKeys()],
  lessonsByPathway,
});

if (jsonMode) {
  // eslint-disable-next-line no-console -- CLI
  console.log(JSON.stringify({ pathwayIds, rows }, null, 2));
} else {
  // eslint-disable-next-line no-console -- CLI
  console.log("objectKey\tstatus\tinferredTopic\tmatches");
  for (const r of rows) {
    const matchStr =
      r.matches.length === 0
        ? ""
        : r.matches.map((m) => `${m.pathwayId}:${m.slug}`).join("; ");
    // eslint-disable-next-line no-console -- CLI
    console.log(`${r.objectKey}\t${r.status}\t${r.inferredTopic.replace(/\t/g, " ")}\t${matchStr}`);
  }
}

const missing = rows.filter((r) => r.status === "missing").length;
const matched = rows.filter((r) => r.status === "matched").length;
const skipped = rows.filter((r) => r.status === "skip").length;
// eslint-disable-next-line no-console -- CLI
console.error(`Summary: matched=${matched} missing=${missing} skip=${skipped} pathways=${pathwayIds.length}`);
