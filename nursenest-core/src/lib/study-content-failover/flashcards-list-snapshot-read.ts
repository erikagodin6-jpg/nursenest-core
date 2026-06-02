import "server-only";

import type { StudyPublishedSnapshotEnvelope } from "@/lib/study-content-failover/study-published-snapshot-types";
import { readStudyPublishedSnapshotFile } from "@/lib/study-content-failover/study-published-snapshot-store";

/** Mirrors the subscriber GET /api/flashcards list body (pre-telemetry fields). */
export type FlashcardsSubscriberListSnapshotPayload = {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
  flashcards: Array<{
    id: string;
    front: string;
    back: string;
    examFamily: string;
    category: { name: string; slug: string };
    explanation?: string;
  }>;
};

function isPayload(raw: unknown): raw is FlashcardsSubscriberListSnapshotPayload {
  if (!raw || typeof raw !== "object") return false;
  const o = raw as Record<string, unknown>;
  return (
    typeof o.page === "number" &&
    typeof o.pageSize === "number" &&
    typeof o.total === "number" &&
    typeof o.pageCount === "number" &&
    Array.isArray(o.flashcards)
  );
}

/**
 * Secondary list read keyed by entitlement profile (export job must write matching file).
 * Path: `flashcards/subscriber-list-{tier}-{country}-{locale}.json`
 */
export async function readFlashcardsSubscriberListSnapshot(params: {
  tier: string;
  country: string;
  locale: string;
}): Promise<StudyPublishedSnapshotEnvelope<FlashcardsSubscriberListSnapshotPayload> | null> {
  const tier = params.tier.replace(/[^a-z0-9_-]/gi, "_").slice(0, 32);
  const country = params.country.replace(/[^a-z0-9_-]/gi, "_").slice(0, 16);
  const locale = params.locale.replace(/[^a-z0-9_-]/gi, "_").slice(0, 16);
  const rel = ["flashcards", `subscriber-list-${tier}-${country}-${locale}.json`];
  const env = await readStudyPublishedSnapshotFile<FlashcardsSubscriberListSnapshotPayload>(rel);
  if (!env || env.surface !== "flashcards_subscriber_list") return null;
  if (!isPayload(env.payload)) return null;
  return env;
}
