import "server-only";

import type { StudyPublishedSnapshotEnvelope } from "@/lib/study-content-failover/study-published-snapshot-types";
import { readStudyPublishedSnapshotFile } from "@/lib/study-content-failover/study-published-snapshot-store";

/** Minimal default exam row for subscriber flows when DB is down (same fields as `resolveDefaultExamForUser`). */
export type DefaultPublishedExamSnapshotPayload = {
  exam: { id: string; title: string } | null;
};

/**
 * Secondary read for default published exam resolution.
 * Path: `practice-exams/default-exam-{country}-{tier}.json`
 */
export async function readDefaultPublishedExamSnapshot(params: {
  country: string;
  tier: string;
}): Promise<StudyPublishedSnapshotEnvelope<DefaultPublishedExamSnapshotPayload> | null> {
  const country = params.country.replace(/[^a-z0-9_-]/gi, "_").slice(0, 8);
  const tier = params.tier.replace(/[^a-z0-9_-]/gi, "_").slice(0, 24);
  const env = await readStudyPublishedSnapshotFile<DefaultPublishedExamSnapshotPayload>([
    "practice-exams",
    `default-exam-${country}-${tier}.json`,
  ]);
  if (!env || env.surface !== "practice_exams_default") return null;
  if (!env.payload || typeof env.payload !== "object") return null;
  return env;
}
