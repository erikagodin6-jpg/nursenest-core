import type { ExamPathwayDefinition } from "./types";

/**
 * Pure marketing hub URL builder (no registry / Prisma). Kept separate so learner chrome and
 * other call sites can format paths without importing the full exam product facade.
 */
export function buildExamPathwayPath(
  p: Pick<ExamPathwayDefinition, "countrySlug" | "roleTrack" | "examCode">,
  subpath?: string,
): string {
  const roleSlug = p.roleTrack === "lpn" || p.roleTrack === "rpn" ? "pn" : p.roleTrack;
  const base = `/${p.countrySlug}/${roleSlug}/${p.examCode}`;
  if (!subpath) return base;
  return `${base}/${subpath.replace(/^\//, "")}`;
}
