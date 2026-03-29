import type { CountryCode, ExamFamily, TierCode } from "@prisma/client";

/** URL segment for country (not the same as Prisma `CountryCode` string). */
export type CountrySlug = "canada" | "us";

/** License / role track in URLs — kept separate from Prisma `TierCode`. */
export type RoleTrackSlug = "rpn" | "lpn" | "rn" | "np" | "allied";

/**
 * Product lifecycle for exam tracks (especially Canadian NP transition).
 * - `active` — normal marketing + checkout where Stripe tier exists
 * - `upcoming` — indexable info / waitlist; no false “buy now”
 * - `legacy` — supported for existing users; softer acquisition
 * - `beta` — visible but flagged
 * - `hidden` — not in nav/sitemap; direct link only
 */
export type ExamPathwayStatus = "active" | "upcoming" | "legacy" | "beta" | "hidden";

export type ExamPathwayDefinition = {
  /** Stable id — store on User.learnerPath, Stripe metadata later */
  id: string;
  countrySlug: CountrySlug;
  countryCode: CountryCode;
  roleTrack: RoleTrackSlug;
  /** Last URL segment, e.g. rex-pn, nclex-rn, fnp */
  examCode: string;
  examFamily: ExamFamily;
  /** Short marketing code, e.g. REX_PN, NCLEX_RN */
  examKey: string;
  displayName: string;
  shortName: string;
  /** Stripe / subscription tier used for checkout today (Phase 1 — one tier per pathway for pricing). */
  stripeTier: TierCode;
  /**
   * Interim: filter `exam_questions.exam` (string column) until granular tagging lands.
   * Empty = pathway does not filter by exam column (inherit tier/country only).
   */
  contentExamKeys: string[];
  /** Interim: filter `content_items` tier string where applicable */
  contentItemTierHints?: string[];
  seoTitle: string;
  seoDescription: string;
  status: ExamPathwayStatus;
  /** Primary CTA tone — drives pricing / waitlist UI */
  acquisitionMode: "subscribe" | "waitlist" | "info_only";
  /** NP / multi-board: user-facing qualifier (never mix FNP vs PMHNP copy) */
  boardLabel?: string;
  /** Notes for editors — not rendered */
  internalNotes?: string;
};
