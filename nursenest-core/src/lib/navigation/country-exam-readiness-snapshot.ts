/**
 * Committed pathway lesson/question counts for **public** launch checks (no DB).
 * Regenerate via `npm run readiness:emit-snapshot`.
 */

type SnapshotRow = { lessons?: number; questions?: number };
type SnapshotDocument = Record<string, SnapshotRow | string | undefined>;

let pathwayReadinessSnapshotCache: SnapshotDocument | null = null;

function getPathwayReadinessSnapshot(): SnapshotDocument {
  if (pathwayReadinessSnapshotCache) return pathwayReadinessSnapshotCache;
  pathwayReadinessSnapshotCache = require("@/config/pathway-readiness-snapshot.json") as SnapshotDocument;
  return pathwayReadinessSnapshotCache;
}

export function getSnapshotCounts(pathwayId: string): { lessons: number; questions: number } {
  if (pathwayId.startsWith("_")) return { lessons: 0, questions: 0 };
  const raw = getPathwayReadinessSnapshot();
  const row = raw[pathwayId];
  if (!row || typeof row !== "object" || Array.isArray(row)) return { lessons: 0, questions: 0 };
  const lessons = typeof row.lessons === "number" && Number.isFinite(row.lessons) ? row.lessons : 0;
  const questions = typeof row.questions === "number" && Number.isFinite(row.questions) ? row.questions : 0;
  return { lessons, questions };
}
