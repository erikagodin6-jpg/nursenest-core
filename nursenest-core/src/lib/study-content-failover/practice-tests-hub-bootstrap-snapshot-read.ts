import "server-only";

import type { PracticeTestPathwayOption } from "@/lib/practice-tests/types";
import type { StudyPublishedSnapshotEnvelope } from "@/lib/study-content-failover/study-published-snapshot-types";
import { readStudyPublishedSnapshotFile } from "@/lib/study-content-failover/study-published-snapshot-store";

export type PracticeTestsHubBootstrapSnapshotPayload = {
  pathwayOptions: PracticeTestPathwayOption[];
  defaultPathwayId: string | null;
  catEligiblePathwayIds: string[];
};

function isPathwayOption(raw: unknown): raw is PracticeTestPathwayOption {
  if (!raw || typeof raw !== "object") return false;
  const o = raw as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.label === "string" &&
    typeof o.examFamily === "string" &&
    typeof o.examCodeLabel === "string"
  );
}

function isPayload(raw: unknown): raw is PracticeTestsHubBootstrapSnapshotPayload {
  if (!raw || typeof raw !== "object") return false;
  const o = raw as Record<string, unknown>;
  if (!Array.isArray(o.pathwayOptions) || !o.pathwayOptions.every(isPathwayOption)) return false;
  if (!Array.isArray(o.catEligiblePathwayIds) || !o.catEligiblePathwayIds.every((x) => typeof x === "string")) {
    return false;
  }
  if (o.defaultPathwayId != null && typeof o.defaultPathwayId !== "string") return false;
  return true;
}

/**
 * Secondary read for `/app/practice-tests` hub builder bootstrap (pathway picker + CAT eligibility).
 * Path: `practice-tests/hub-bootstrap-{country}-{tier}.json`
 */
export async function readPracticeTestsHubBootstrapSnapshot(params: {
  country: string;
  tier: string;
}): Promise<StudyPublishedSnapshotEnvelope<PracticeTestsHubBootstrapSnapshotPayload> | null> {
  const country = params.country.replace(/[^a-z0-9_-]/gi, "_").slice(0, 16);
  const tier = params.tier.replace(/[^a-z0-9_-]/gi, "_").slice(0, 32);
  const env = await readStudyPublishedSnapshotFile<PracticeTestsHubBootstrapSnapshotPayload>([
    "practice-tests",
    `hub-bootstrap-${country}-${tier}.json`,
  ]);
  if (!env || env.surface !== "practice_tests_hub_bootstrap") return null;
  if (!isPayload(env.payload)) return null;
  return env;
}
