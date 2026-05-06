import type { StaffTier } from "@/lib/auth/staff-roles";

/**
 * Cross-cutting capabilities for **future** institutional surfaces (cohort admin, org analytics, instructor tools).
 *
 * **Today:** production enforcement remains `getStaffSession` + `isPathAllowedForStaffTier` (`admin-path-policy.ts`)
 * and `requireAdmin` (`ensure-admin.ts`). This matrix documents intent and powers **narrow** helpers
 * (`staffTierHasInstitutionalCapability`) without widening access.
 *
 * Phase 10 ecosystem map: `reports/phase-10-ecosystem-platform.md`.
 */
export const InstitutionalCapability = {
  /** DTC learner — app study surfaces only (no admin). */
  LearnerStudy: "learner_study",
  /** Future: cohort-facing instructor — assign + view cohort analytics scoped to org. */
  CohortInstructorAssign: "cohort_instructor_assign",
  CohortInstructorAnalyticsRead: "cohort_instructor_analytics_read",
  /** Support staff — today mapped to `support` tier path allowlist. */
  SupportOpsRead: "support_ops_read",
  /** Content admin — authoring, lessons, bulk tools. */
  ContentAuthoring: "content_authoring",
  /** Super / legacy admin — dangerous ops, exports, fraud, debug auth. */
  SuperDangerousOps: "super_dangerous_ops",
  /** Future: org billing admin — seat assignment, invoices (not implemented). */
  OrgBillingAdmin: "org_billing_admin",
  /** Future: read-only BI / accreditation export — aggregate only. */
  ReadOnlyInstitutionalAnalytics: "read_only_institutional_analytics",
} as const;

export type InstitutionalCapability = (typeof InstitutionalCapability)[keyof typeof InstitutionalCapability];

const SUPER_SET = new Set<InstitutionalCapability>(Object.values(InstitutionalCapability));

const SUPPORT_SET = new Set<InstitutionalCapability>([
  InstitutionalCapability.LearnerStudy,
  InstitutionalCapability.SupportOpsRead,
  /** Narrow aggregate analytics — must stay aligned with support allowlist when routes ship. */
  InstitutionalCapability.ReadOnlyInstitutionalAnalytics,
]);

const CONTENT_SET = new Set<InstitutionalCapability>([
  InstitutionalCapability.LearnerStudy,
  InstitutionalCapability.ContentAuthoring,
  InstitutionalCapability.CohortInstructorAssign,
  InstitutionalCapability.CohortInstructorAnalyticsRead,
]);

const TIER_CAPABILITIES: Record<StaffTier, ReadonlySet<InstitutionalCapability>> = {
  super: SUPER_SET,
  support: SUPPORT_SET,
  content: CONTENT_SET,
};

/**
 * Institutional capability check — **additive** to path RBAC, not a replacement.
 * Use for super-only batch ops, future cohort gates, etc.
 */
export function staffTierHasInstitutionalCapability(
  tier: StaffTier,
  capability: InstitutionalCapability,
): boolean {
  return TIER_CAPABILITIES[tier]?.has(capability) ?? false;
}
