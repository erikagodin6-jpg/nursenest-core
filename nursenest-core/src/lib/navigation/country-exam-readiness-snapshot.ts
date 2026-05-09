/**
 * Committed pathway lesson/question counts for **public** launch checks (no DB).
 * Regenerate via `npm run readiness:emit-snapshot`.
 */
import pathwayReadinessSnapshot from "@/config/pathway-readiness-snapshot.json" with { type: "json" };

type SnapshotRow = { lessons?: number; questions?: number };
type SnapshotDocument = Record<string, SnapshotRow | string | undefined>;

function getPathwayReadinessSnapshot(): SnapshotDocument {
  return pathwayReadinessSnapshot as SnapshotDocument;
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
