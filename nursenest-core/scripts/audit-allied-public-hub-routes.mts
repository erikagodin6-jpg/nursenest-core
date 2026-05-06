/**
 * Lists published Allied Health marketing pathways and verifies {@link buildExamPathwayPath}
 * resolves to the single global marketing hub (`/allied/allied-health`) for every registry row.
 *
 * Usage (from `nursenest-core/`):
 *   npx tsx scripts/audit-allied-public-hub-routes.mts
 */
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-pathways-catalog";
import { isPathwayPublishedForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";
import { isAlliedHealthPathway } from "@/lib/allied/allied-global-pathway";

function main() {
  const allied = EXAM_PATHWAYS.filter((p) => isAlliedHealthPathway(p) && p.status !== "hidden");
  const rows = allied.map((p) => ({
    pathwayId: p.id,
    country: p.countrySlug,
    hub: buildExamPathwayPath(p),
    publishedForPublicSite: isPathwayPublishedForPublicSite(p.id),
  }));
  console.log(JSON.stringify({ count: rows.length, hubs: rows }, null, 2));
  const expected = "/allied/allied-health";
  for (const row of rows) {
    if (row.hub !== expected) {
      console.error("Unexpected allied hub path (expected global hub)", { ...row, expected });
      process.exitCode = 1;
    }
  }
}

main();
