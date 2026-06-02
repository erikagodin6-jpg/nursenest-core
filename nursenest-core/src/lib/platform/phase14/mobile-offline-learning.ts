/**
 * Phase 14D — **Offline learning** typed contracts (interfaces only).
 *
 * Describes hydration boundaries, sync semantics, retry/reconciliation, cache invalidation keys,
 * and media policies without prescribing storage engines or Service Worker code.
 */

import type { MobileClientPlatform } from "@/lib/platform/phase14/mobile-platform-contracts";

/** Coarse offline feature posture for UX copy and capability gating (server still authoritative). */
export type OfflineLearningCapability = {
  readonly mayCacheLessonCardsForList: boolean;
  readonly mayCacheSingleLessonBodyForStudy: boolean;
  readonly mayQueueFlashcardReviewsOffline: boolean;
  readonly mayQueuePracticeExamAttemptsOffline: boolean;
  readonly adaptiveRecommendationsRequireNetwork: true;
};

/** Single-lesson hydration boundary: list views stay lightweight vs detail body. */
export type OfflineLessonHydrationBoundary = {
  readonly listPayloadMaxKind: "card_metadata_only";
  readonly detailPayloadIncludes: readonly ["markdown_or_blocks", "media_refs", "question_links"];
  readonly excludes: readonly ["admin_drafts", "unpublished_revisions"];
};

/** Flashcard sync: client-held queue vs server reconciliation. */
export type OfflineFlashcardSyncIntent = {
  readonly direction: "client_to_server_reviews" | "server_to_client_due_snapshot";
  readonly conflictPolicy: "server_wins_on_version" | "merge_non_overlapping_intervals";
};

/** Practice exam / CAT attempts: offline queue item before server accepts attempt. */
export type OfflinePracticeExamSyncEnvelope = {
  readonly localAttemptId: string;
  readonly practiceTestId: string;
  readonly capturedAtMs: number;
  readonly payloadIntegrityTag: string;
};

/** Adaptive recommendations remain online-first; offline may retain last snapshot only. */
export type OfflineAdaptiveRecommendationSnapshot = {
  readonly snapshotVersion: number;
  readonly validUntilMs: number;
  readonly mustShowStaleBannerWhenExpired: true;
};

/** Queued progress events while offline (ordering + idempotency hints). */
export type OfflineProgressQueueSemantics = {
  readonly ordering: "per_device_monotonic_sequence";
  readonly idempotencyKeyShape: `progress.${string}.${string}`;
  readonly maxQueuedEventsPerDevice: number;
};

/** Retry ladder for sync worker (declarative, not an implementation). */
export type OfflineRetryPolicyShape = {
  readonly backoffKind: "exponential_jitter";
  readonly maxAttempts: number;
  readonly nonRetryableHttpStatuses: readonly number[];
};

/** Reconciliation outcome after replaying queued events. */
export type OfflineReconciliationResultKind =
  | "all_applied"
  | "partially_applied_with_conflicts"
  | "server_rejected_stale";

/** Keys used to invalidate cached lesson or media blobs after publish pipeline changes. */
export type OfflineStaleContentInvalidationKey =
  | `lesson:${string}:rev:${string}`
  | `pathway:${string}:index:${string}`
  | `flashcard_deck:${string}:etag:${string}`;

/** Image and media caching policy hints (no binary format mandates). */
export type OfflineImageMediaCachePolicy = {
  readonly preferSignedUrlsWithShortTtl: true;
  readonly avoidRawVendorUrlsInOfflineStore: true;
  readonly maxConcurrentPrefetch: number;
};

/** ECG / video-heavy modules may require streaming; document incompatibility classes. */
export type OfflineEcgVideoStreamingCompatibility = {
  readonly ecgInteractiveRequiresNetwork: true;
  readonly videoQuestionRequiresNetworkOrAdaptiveBitrate: true;
  readonly offlineFallback: "static_frame_or_text_stub_allowed";
};

export type OfflineLearningClientContext = {
  readonly platform: MobileClientPlatform;
  readonly capability: OfflineLearningCapability;
};
