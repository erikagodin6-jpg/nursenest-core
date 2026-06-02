import { buildAlliedGlobalHubPath } from "@/lib/allied/allied-global-hub-path";

/**
 * Middle URL segment for `/{country}/{role}/{exam}/…` marketing hubs.
 * Canada RPN (`roleTrack: rpn`) and US/CA practical-nurse tracks (`lpn`) publish under **`pn`**
 * so breadcrumbs and links must not use the internal Prisma role slug (`rpn`) alone.
 */
export function marketingHubRoleSegment(pathway: { roleTrack: string }): string {
  return pathway.roleTrack === "lpn" || pathway.roleTrack === "rpn" ? "pn" : pathway.roleTrack;
}

/**
 * Pure marketing hub URL builder (no registry / Prisma). Kept separate so learner chrome and
 * other call sites can format paths without importing the full exam product facade.
 */
export function buildExamPathwayPath(
  p: { countrySlug: string; roleTrack: string; examCode: string },
  subpath?: string,
): string {
  if (p.roleTrack === "allied" && p.examCode === "allied-health") {
    return buildAlliedGlobalHubPath(subpath);
  }
  const roleSlug = marketingHubRoleSegment(p);
  const base = `/${p.countrySlug}/${roleSlug}/${p.examCode}`;
  if (!subpath) return base;
  return `${base}/${subpath.replace(/^\//, "")}`;
}
