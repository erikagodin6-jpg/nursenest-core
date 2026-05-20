/**
 * Phase 14A — **Capability boundaries** between marketing web, learner product, future native,
 * and admin/staff surfaces (type-level documentation only).
 *
 * Each boundary is a named contract: actual routing and RBAC remain in Next.js routes and
 * `requireAdmin` (or equivalent) on the server.
 */

import type { MobileCapabilitySurface } from "@/lib/platform/phase14/mobile-platform-contracts";

/** Declares which surfaces may share an auth session context (design intent, not enforcement). */
export type MobileCrossSurfaceSessionPolicy = {
  readonly marketingPublic: { readonly mayShareAnonContextWith: readonly MobileCapabilitySurface[] };
  readonly learnerApp: { readonly mayShareAuthenticatedContextWith: readonly ["learner_app"] };
  readonly futureNativeLearner: {
    readonly mustMirror: "learner_app";
    readonly mustNotEmbed: readonly ["admin_staff", "internal_ops"];
  };
  readonly adminStaff: {
    readonly isolatedFrom: readonly ["marketing_public", "learner_app", "future_native_learner"];
  };
};

/** Data classes that must never traverse from admin APIs into learner/native clients. */
export type MobileAdminDataExfiltrationClass =
  | "other_user_pii"
  | "billing_admin_diagnostics"
  | "raw_question_bank_exports"
  | "ops_runbooks_and_secrets_hints";

/** Positive list: learner-authenticated JSON APIs intended for study loops (conceptual). */
export type MobileLearnerApiFamily =
  | "pathway_lessons_and_lesson_detail"
  | "flashcards_due_and_review"
  | "practice_tests_and_cat"
  | "questions_grade_and_fetch"
  | "progress_and_readiness"
  | "personal_profile_and_settings";

/** Marketing-only JSON helpers (public or lightly personalized). */
export type MobileMarketingApiFamily =
  | "public_stats_or_tags"
  | "pricing_options_catalog"
  | "assets_and_i18n_shards";
