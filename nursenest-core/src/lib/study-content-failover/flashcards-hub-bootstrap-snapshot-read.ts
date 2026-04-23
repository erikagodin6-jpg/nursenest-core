import "server-only";

import type { StudyPublishedSnapshotEnvelope } from "@/lib/study-content-failover/study-published-snapshot-types";
import { readStudyPublishedSnapshotFile } from "@/lib/study-content-failover/study-published-snapshot-store";

/**
 * Published snapshot for `/app/flashcards` pathway bootstrap when primary DB reads fail.
 * `compatibleRows` mirrors {@link listPathwaysCompatibleWithSubscription} output shape; callers re-run
 * {@link resolveSubscribedQuestionBankPathways} with live `requestedPathwayId` and `learnerPath: null`
 * (DB unavailable) so URL deep-links still resolve when possible.
 */
export type FlashcardsHubPathwayBootstrapSnapshotPayload = {
  pathwayOptions: { id: string; label: string }[];
  compatibleRows: { id: string; shortName: string }[];
};

function isCompatibleRow(raw: unknown): raw is { id: string; shortName: string } {
  if (!raw || typeof raw !== "object") return false;
  const o = raw as Record<string, unknown>;
  return typeof o.id === "string" && typeof o.shortName === "string";
}

function isPayload(raw: unknown): raw is FlashcardsHubPathwayBootstrapSnapshotPayload {
  if (!raw || typeof raw !== "object") return false;
  const o = raw as Record<string, unknown>;
  if (!Array.isArray(o.pathwayOptions)) return false;
  for (const row of o.pathwayOptions) {
    if (!row || typeof row !== "object") return false;
    const p = row as Record<string, unknown>;
    if (typeof p.id !== "string" || typeof p.label !== "string") return false;
  }
  if (!Array.isArray(o.compatibleRows) || !o.compatibleRows.every(isCompatibleRow)) return false;
  return true;
}

/**
 * Secondary read for `/app/flashcards` pathway bootstrap when primary DB reads fail.
 * Path: `flashcards/hub-bootstrap-{country}-{tier}.json`
 */
export async function readFlashcardsHubPathwayBootstrapSnapshot(params: {
  country: string;
  tier: string;
}): Promise<StudyPublishedSnapshotEnvelope<FlashcardsHubPathwayBootstrapSnapshotPayload> | null> {
  const country = params.country.replace(/[^a-z0-9_-]/gi, "_").slice(0, 16);
  const tier = params.tier.replace(/[^a-z0-9_-]/gi, "_").slice(0, 32);
  const env = await readStudyPublishedSnapshotFile<FlashcardsHubPathwayBootstrapSnapshotPayload>([
    "flashcards",
    `hub-bootstrap-${country}-${tier}.json`,
  ]);
  if (!env || env.surface !== "flashcards_hub_pathway_bootstrap") return null;
  if (!isPayload(env.payload)) return null;
  return env;
}
