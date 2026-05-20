/**
 * Phase 14E — **Mobile observability** contracts (types only; no PostHog/Sentry imports).
 *
 * Shapes for telemetry, crash breadcrumbs, compatibility/version gates, and emergency controls.
 */

import type { MobileApiCompatibility, MobileBuildChannel } from "@/lib/platform/phase14/mobile-platform-contracts";

/** High-level mobile telemetry events (namespaced string unions). */
export type MobileTelemetryEvent =
  | "mobile.session.handoff_started"
  | "mobile.session.handoff_succeeded"
  | "mobile.session.handoff_failed"
  | "mobile.sync.progress_queue_flushed"
  | "mobile.sync.progress_queue_backoff"
  | "mobile.offline.cache_hit"
  | "mobile.offline.cache_miss"
  | "mobile.api.contract_mismatch"
  | "mobile.feature.kill_switch_engaged";

/** Crash or error envelope without SDK-specific fields. */
export type MobileCrashTelemetryShape = {
  readonly crashId: string;
  readonly occurredAtMs: number;
  readonly buildChannel: MobileBuildChannel;
  readonly lastKnownRouteKind: "learner" | "marketing" | "unknown";
  readonly apiCompatibility: MobileApiCompatibility;
};

/** Phased rollout stages for binary features (remote config consumes these labels). */
export type MobilePhasedRolloutStage =
  | "rollout.internal_only"
  | "rollout.beta_cohort"
  | "rollout.percentage"
  | "rollout.full";

/** Feature flag or kill-switch record (declarative). */
export type MobileRemoteKillSwitch = {
  readonly key: `kill.${string}`;
  readonly engaged: boolean;
  readonly reasonCode: string;
};

/** Minimum binary version gate (semver string). */
export type MobileMinAppVersionGate = {
  readonly iosMinVersion: `${number}.${number}.${number}`;
  readonly androidMinVersion: `${number}.${number}.${number}`;
};

/** API compatibility gate mirrored from server `version` or headers (design only). */
export type MobileApiCompatibilityVersionGate = {
  readonly serverObservedContractVersion: `${number}.${number}.${number}`;
  readonly clientDeclaredContractVersion: `${number}.${number}.${number}`;
  readonly mismatchPolicy: "block_mutations_allow_read" | "force_soft_update_prompt";
};

/** Emergency content disablement (e.g., retract lesson) without app store release. */
export type MobileEmergencyContentDisablement = {
  readonly contentKey: string;
  readonly disabledAtMs: number;
  readonly surfaceScope: "single_lesson" | "entire_pathway" | "question_bank_slice";
};
