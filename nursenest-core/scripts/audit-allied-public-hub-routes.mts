/**
 * Lists published Allied Health marketing hubs and verifies {@link buildExamPathwayPath}
 * resolves to regional URLs (`/us/allied/allied-health`, `/canada/allied/allied-health`).
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
  for (const row of rows) {
    const ok =
      row.country === "us"
        ? row.hub === "/us/allied/allied-health"
        : row.country === "canada"
          ? row.hub === "/canada/allied/allied-health"
          : false;
    if (!ok) {
      console.error("Unexpected allied hub path", row);
      process.exitCode = 1;
    }
  }
}

main();
