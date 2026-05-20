/**
 * Static admin-only registry for Phase 10B ecosystem readiness (no DB, no public HTTP).
 * Do not import from marketing, learner, or public routes — see `audit:phase10-public-surface`.
 */

import type { IntegrationEventDomain } from "@/lib/platform/phase10/integration-events";
import type { MarketplaceOfferKind, ModerationPipelineState } from "@/lib/platform/phase10/marketplace-direction";
import type { PlatformCapabilityKind } from "@/lib/platform/phase10/extensibility-contracts";

/** Admin-facing lifecycle label (not persisted). */
export type EcosystemReadinessLifecycle =
  | "contract_only"
  | "planned"
  | "internal_preview"
  | "blocked"
  | "ready_for_implementation";

export type CapabilityReadinessRow = {
  capability: PlatformCapabilityKind;
  title: string;
  lifecycle: EcosystemReadinessLifecycle;
  notes: string;
};

export type PluginPlanRow = {
  moduleId: string;
  lifecycle: EcosystemReadinessLifecycle;
  declaredCapabilities: readonly PlatformCapabilityKind[];
  integrityClass: "unsigned_dev_only" | "internal_signed_v1";
};

export type MarketplaceSampleRow = {
  listingId: string;
  sku: string;
  offerKind: MarketplaceOfferKind;
  moderation: ModerationPipelineState;
  lifecycle: EcosystemReadinessLifecycle;
};

export type IntegrationContractRow = {
  domain: IntegrationEventDomain;
  lifecycle: EcosystemReadinessLifecycle;
  dispatcher: "none_contract_only";
};

export type GovernanceSampleRow = {
  moduleKey: string;
  owningTeam: string;
  escalationTier: "l1" | "l2" | "security";
  lifecycle: EcosystemReadinessLifecycle;
};

export type ModerationPipelineSampleRow = {
  state: ModerationPipelineState;
  lifecycle: EcosystemReadinessLifecycle;
  description: string;
};

export function loadAdminEcosystemReadinessRegistry() {
  return {
    capabilities: [
      {
        capability: "analytics_event_sink",
        title: "Analytics event sink",
        lifecycle: "contract_only",
        notes: "Hook names defined; server emitters remain staff/cron gated.",
      },
      {
        capability: "external_content_ingest",
        title: "External content ingest",
        lifecycle: "planned",
        notes: "Envelope contract only — normalization pipeline not wired.",
      },
      {
        capability: "simulation_module_host",
        title: "Simulation module host",
        lifecycle: "internal_preview",
        notes: "Descriptor shape only; no dynamic host loading.",
      },
      {
        capability: "third_party_study_tool_embed",
        title: "Third-party study tool embed",
        lifecycle: "blocked",
        notes: "Security review required before any embed surface.",
      },
      {
        capability: "institutional_config_extension",
        title: "Institutional config extension",
        lifecycle: "ready_for_implementation",
        notes: "Align with existing institutional RBAC; no new public API.",
      },
      {
        capability: "lms_outbound_sync",
        title: "LMS outbound sync",
        lifecycle: "planned",
        notes: "Event taxonomy reserved; no outbound worker.",
      },
    ] as const satisfies readonly CapabilityReadinessRow[],

    plannedPlugins: [
      {
        moduleId: "nn-ecg-pack-bridge",
        lifecycle: "planned" as const,
        declaredCapabilities: ["external_content_ingest", "third_party_study_tool_embed"] as const,
        integrityClass: "unsigned_dev_only" as const,
      },
      {
        moduleId: "nn-sim-host-adapter",
        lifecycle: "contract_only" as const,
        declaredCapabilities: ["simulation_module_host", "analytics_event_sink"] as const,
        integrityClass: "internal_signed_v1" as const,
      },
    ] as const satisfies readonly PluginPlanRow[],

    marketplaceSamples: [
      {
        listingId: "lst_preview_premium_module",
        sku: "SKU-PREVIEW-MOD-001",
        offerKind: "premium_module",
        moderation: "draft",
        lifecycle: "contract_only",
      },
      {
        listingId: "lst_preview_institution_bundle",
        sku: "SKU-PREVIEW-INST-002",
        offerKind: "institution_bundle",
        moderation: "pending_review",
        lifecycle: "internal_preview",
      },
    ] as const satisfies readonly MarketplaceSampleRow[],

    integrationContracts: [
      { domain: "entitlement.changed", lifecycle: "contract_only", dispatcher: "none_contract_only" },
      { domain: "cohort.assignment_published", lifecycle: "planned", dispatcher: "none_contract_only" },
      { domain: "content.moderation_updated", lifecycle: "ready_for_implementation", dispatcher: "none_contract_only" },
      { domain: "marketplace.purchase_completed", lifecycle: "blocked", dispatcher: "none_contract_only" },
      { domain: "analytics.export_ready", lifecycle: "planned", dispatcher: "none_contract_only" },
    ] as const satisfies readonly IntegrationContractRow[],

    governance: [
      {
        moduleKey: "platform.phase10.ecosystem",
        owningTeam: "platform-core",
        escalationTier: "l2",
        lifecycle: "contract_only",
      },
      {
        moduleKey: "marketplace.listings",
        owningTeam: "growth-ops",
        escalationTier: "l1",
        lifecycle: "planned",
      },
    ] as const satisfies readonly GovernanceSampleRow[],

    moderationStates: [
      { state: "draft", lifecycle: "contract_only", description: "Authoring only — not buyer-visible." },
      { state: "pending_review", lifecycle: "internal_preview", description: "Staff queue not implemented." },
      { state: "approved", lifecycle: "planned", description: "Gated listing metadata only; no storefront." },
      { state: "rejected", lifecycle: "contract_only", description: "Terminal moderation state (metadata)." },
      { state: "suspended", lifecycle: "planned", description: "Requires audit log wiring (governance types)." },
    ] as const satisfies readonly ModerationPipelineSampleRow[],
  };
}
