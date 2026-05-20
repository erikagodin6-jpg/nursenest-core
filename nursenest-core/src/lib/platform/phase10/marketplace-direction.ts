/**
 * Phase 10 marketplace direction types (metadata only).
 * See reports/phase-10-ecosystem-platform.md
 */

export const MarketplaceOfferKind = {
  premiumModule: "premium_module",
  instructorGeneratedPack: "instructor_generated_pack",
  institutionBundle: "institution_bundle",
  ecgVideoPack: "ecg_video_pack",
  simulationLibrary: "simulation_library",
  specialtyReview: "specialty_review",
} as const;

export type MarketplaceOfferKind = (typeof MarketplaceOfferKind)[keyof typeof MarketplaceOfferKind];

export const ModerationPipelineState = {
  draft: "draft",
  pendingReview: "pending_review",
  approved: "approved",
  rejected: "rejected",
  suspended: "suspended",
} as const;

export type ModerationPipelineState = (typeof ModerationPipelineState)[keyof typeof ModerationPipelineState];

export type MarketplaceListingMetadata = {
  listingId: string;
  sku: string;
  offerKind: MarketplaceOfferKind;
  ownerRef: { kind: "platform" | "instructor" | "institution"; id: string };
  moderation: ModerationPipelineState;
  entitlementProductCode?: string;
  analyticsNamespace: string;
};
