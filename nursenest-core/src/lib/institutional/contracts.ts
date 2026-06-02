/**
 * Phase 7 — institutional / cohort **service contracts** (TypeScript only; no Zod).
 *
 * **Permission boundaries (non-normative for enforcement — see `admin-path-policy` + `ensure-admin`):**
 * - `Organization` / `Cohort` metadata is **not** implied to be readable by learners; org-admin is a **future** role.
 * - `CohortAnalyticsSnapshot` and aggregate DTOs must stay **server-only** with minimum-necessary PII (see cohort-analytics-dto).
 * - Assignments reference content ids only; entitlement to *attempt* content still flows through `getUserAccess` / `resolveEntitlement`.
 *
 * **Prisma direction (documentation only — no migration in this phase):**
 * - `Organization` → future `Organization` table (slug, billingAccountId optional FK to Stripe customer at org level).
 * - `Cohort` → `Cohort` (organizationId, name, pathwayScopeId).
 * - `CohortMembership` → join `User` ↔ `Cohort` with role `learner` | `instructor` | `auditor`.
 * - Assignments → `CohortAssignment` or polymorphic assignment rows keyed by cohortId + content ref.
 */

/** Stable org identifier (future DB: cuid). */
export type OrganizationId = string;

/** Cohort / class identifier (future DB: cuid). */
export type CohortId = string;

/** User id — today `User.id` (cuid). */
export type UserId = string;

/** Exam pathway key from product catalog (e.g. NCLEX RN hub id). */
export type ExamPathwayId = string;

export type OrganizationStatus = "active" | "suspended" | "archived";

/**
 * Purchaser / contract holder (school, hospital system, reseller).
 * Billing touchpoint: **future** org-level Stripe customer; today all billing remains user-scoped (see report).
 */
export interface Organization {
  id: OrganizationId;
  name: string;
  slug: string;
  status: OrganizationStatus;
  /** When seat licensing exists: hard cap on active seats (null = unlimited / not configured). */
  seatCap: number | null;
  /** IANA or org policy timezone for cohort reporting windows. */
  primaryTimezone: string | null;
  createdAtIso: string;
  updatedAtIso: string;
}

export type CohortLifecycleStatus = "draft" | "active" | "completed" | "archived";

/**
 * A bounded group of learners under an organization (class, cohort, residency block).
 */
export interface Cohort {
  id: CohortId;
  organizationId: OrganizationId;
  name: string;
  /** Optional anchor pathway for analytics scoping (does not override per-learner `targetExamPathwayId` alone). */
  defaultPathwayId: ExamPathwayId | null;
  status: CohortLifecycleStatus;
  startsAtIso: string | null;
  endsAtIso: string | null;
  createdAtIso: string;
  updatedAtIso: string;
}

/**
 * Staff or external faculty teaching the cohort — **not** the same as `UserRole` staff (admin).
 * Future: may still be a `User` with an `InstructorProfile` or SSO subject.
 */
export interface InstructorRef {
  userId: UserId;
  /** Display for audit logs / UI; not a permission source. */
  displayName: string | null;
  /** Future: linkage to org HR id. */
  externalId: string | null;
}

export type CohortMemberRole = "learner" | "instructor" | "auditor";

/**
 * Membership row — **authorization** to cohort surfaces must still verify org + membership server-side.
 */
export interface CohortMembership {
  cohortId: CohortId;
  userId: UserId;
  role: CohortMemberRole;
  invitedAtIso: string | null;
  joinedAtIso: string | null;
}

export type AssignmentContentKind = "pathway" | "lesson" | "practice_exam" | "question_set";

/**
 * Org or instructor push of a learning track — does **not** grant billing entitlement by itself.
 */
export interface AssignedPathway {
  id: string;
  cohortId: CohortId;
  pathwayId: ExamPathwayId;
  assignedByUserId: UserId;
  dueAtIso: string | null;
  createdAtIso: string;
}

export interface AssignedLesson {
  id: string;
  cohortId: CohortId;
  lessonSlug: string;
  pathwayId: ExamPathwayId | null;
  assignedByUserId: UserId;
  dueAtIso: string | null;
  createdAtIso: string;
}

export interface AssignedPracticeExam {
  id: string;
  cohortId: CohortId;
  /** Preset or blueprint key — product-specific string. */
  examPresetKey: string;
  assignedByUserId: UserId;
  dueAtIso: string | null;
  createdAtIso: string;
}

export type RemediationAssignmentSource = "instructor" | "system_weak_topic" | "system_remediation_queue";

/**
 * Directed remediation — maps conceptually to `UserRemediationQueue` / weak-topic flows per learner.
 */
export interface RemediationAssignment {
  id: string;
  cohortId: CohortId;
  learnerUserId: UserId;
  topicKey: string;
  pathwayId: ExamPathwayId | null;
  source: RemediationAssignmentSource;
  assignedByUserId: UserId | null;
  dueAtIso: string | null;
  createdAtIso: string;
}

/**
 * Pre-aggregated cohort metrics for dashboards — **no raw attempt rows**.
 * Privacy: prefer k-anonymized bands when cohort n is small (enforced at query layer later).
 */
export interface CohortAnalyticsSnapshot {
  cohortId: CohortId;
  computedAtIso: string;
  /** Counts for seat / engagement reporting. */
  activeMemberCount: number;
  /** 0–100 aggregate readiness band (definition TBD — product analytics). */
  medianReadinessBand: number | null;
  /** Top normalized topic keys struggling across members (cap list server-side). */
  weakTopicClusters: readonly string[];
  completionRatePct: number | null;
  remediationOpenCount: number | null;
}
