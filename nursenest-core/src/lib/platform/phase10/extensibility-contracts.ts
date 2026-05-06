/**
 * Phase 10 — platform extensibility **contracts only** (no runtime registry, no public HTTP surface).
 *
 * Callers must still enforce entitlements with `getUserAccess` / `requireSubscriberSession` / `requireAdmin`
 * on every server path. Fields here named `*Hint` are non-authoritative telemetry or UX context only.
 *
 * @see reports/phase-10-ecosystem-platform.md
 */

/** Declared capability buckets for future plugin-style registration (internal allowlists only). */
export const PlatformCapabilityKind = {
  externalContentIngest: "external_content_ingest",
  analyticsEventSink: "analytics_event_sink",
  simulationModuleHost: "simulation_module_host",
  thirdPartyStudyToolEmbed: "third_party_study_tool_embed",
  institutionalConfigExtension: "institutional_config_extension",
  lmsOutboundSync: "lms_outbound_sync",
} as const;

export type PlatformCapabilityKind = (typeof PlatformCapabilityKind)[keyof typeof PlatformCapabilityKind];

/** Descriptor for a future internal module — not loaded dynamically from disk in production without review. */
export type PluginRegistrationDescriptor = {
  moduleId: string;
  semverRange: string;
  declaredCapabilities: readonly PlatformCapabilityKind[];
  /** Reserved for signed internal bundles; never trust client-supplied registration payloads. */
  integrityClass: "unsigned_dev_only" | "internal_signed_v1";
};

/** Envelope for staged external content before canonical normalization (no raw HTML here). */
export type ExternalContentIngestionEnvelope = {
  sourceSystem: string;
  externalStableId: string;
  contentKind: "lesson_outline" | "assessment_item_bank" | "media_manifest" | "simulation_config";
  /** Hex or base64url fingerprint of canonical normalized bytes. */
  contentChecksum: string;
  /** Suggested pathway scope — server must re-validate against exam-pathway policy. */
  suggestedPathwayIds: readonly string[];
};

/** Opaque analytics hook names — map to server-only emitters; avoid PII in values. */
export const EcosystemAnalyticsHook = {
  integrationDeliveryAttempt: "ecosystem.integration_delivery_attempt",
  marketplaceListingView: "ecosystem.marketplace_listing_view",
  instructorAuthoringSave: "ecosystem.instructor_authoring_save",
  moderationStateTransition: "ecosystem.moderation_state_transition",
} as const;

export type EcosystemAnalyticsHook = (typeof EcosystemAnalyticsHook)[keyof typeof EcosystemAnalyticsHook];

/**
 * Minimal context for extension hooks — **never** use for authorization decisions alone.
 * Security-sensitive checks must re-load `UserAccess` / staff session from DB-backed sources.
 */
export type EntitlementAwareExtensionContext = {
  userId: string;
  pathwayId: string | null;
  accessTierHint: string | null;
  accessCountryHint: string | null;
  hasPaidAccessHint: boolean;
};
