/**
 * Entitlement & billing state matrix — **documentation for audits** (support, compliance, incident review).
 *
 * **Runtime resolution**: {@link getUserAccess} (Prisma `Subscription` + `User`).
 * **Stripe → DB mirror**: {@link applyStripeWebhookEvent}, {@link mapStripeSubscriptionStatus}.
 *
 * Access is never granted from browser query params or checkout redirects alone — only DB-backed `getUserAccess`
 * after webhooks / server checkout handlers persist state.
 *
 * ---
 *
 * ## Decision order in {@link getUserAccess} (first match wins)
 *
 * 1. **Staff / student-ops roles** → `hasPremium: true`, `reason: admin_override` (not a paid subscription; full learner
 *    access for internal QA — see {@link isLearnerEntitlementStaffBypassRole}).
 * 2. **Subscription row** in `ACTIVE_LIKE` (`ACTIVE`, `GRACE`, `PAST_DUE`), newest history window — see below.
 * 3. **`ACTIVE`** → `active_subscription`; tier/country from {@link effectiveTierCountryForAccess} (Stripe plan snapshot
 *    wins when `planTier` / `planCountry` set).
 * 4. **`GRACE`** (DB) → `grace_period`, premium until policy/row semantics elsewhere set status.
 * 5. **`PAST_DUE`** → `past_due_grace` only if {@link pastDueSubscriptionGrantsPremium} (`ENTITLEMENT_PAST_DUE_POLICY=grace`
 *    and within window); else falls through (no premium from this row).
 * 6. **App trial** (`User.trialStatus === ACTIVE` and `trialEndsAt` in future) → `active_trial` (uses **profile** tier/country,
 *    not Stripe plan fields — subscription snapshot may still appear on `plan` for UI).
 * 7. Else → `hasPremium: false`, `reason: no_access` (includes `CANCELLED`, expired trial, denied past_due, no rows).
 *
 * **Scheduled cancellation:** While Stripe still reports `active` with `cancel_at_period_end`, webhooks should keep DB
 * **`ACTIVE`** with `cancelAtPeriodEnd: true` — user keeps premium until period end. If DB is **`CANCELLED`** early,
 * `getUserAccess` does **not** treat period end as access (deny until data fixed or trial applies).
 *
 * **Duration / plan code:** Exposed on `UserAccess.plan` for UI; content gates use **effective tier + country**, not plan
 * string alone.
 */
/** Stripe `subscription.status` values we explicitly map in `mapStripeSubscriptionStatus` (see implementation for null/default cases). */
export const STRIPE_STATUS_DB_MAPPING_NOTES: ReadonlyArray<{
  stripe: string;
  db: string;
  note: string;
}> = [
  { stripe: "active", db: "ACTIVE", note: "Paid access period." },
  { stripe: "trialing", db: "ACTIVE", note: "Trial billed through Stripe." },
  { stripe: "past_due", db: "PAST_DUE", note: "Entitlement may still grant via past-due policy." },
  { stripe: "unpaid", db: "PAST_DUE", note: "Mapped to same DB bucket as past_due." },
  { stripe: "canceled", db: "CANCELLED", note: "Stripe ended; access stops unless User trial still active." },
  { stripe: "incomplete_expired", db: "CANCELLED", note: "Checkout abandoned / expired." },
  {
    stripe: "incomplete",
    db: "null_skip_overwrite",
    note: "Do not blindly overwrite — checkout handler may have set ACTIVE.",
  },
  { stripe: "paused", db: "null_skip_overwrite", note: "Collection paused — reconcile carefully." },
  {
    stripe: "(unknown)",
    db: "CANCELLED_default_unknown",
    note: "Defensive default in mapper — should be rare.",
  },
];

/** DB statuses that can participate in `ACTIVE_LIKE` selection in `getUserAccess`. */
export const DB_ACTIVE_LIKE_LABELS = ["ACTIVE", "GRACE", "PAST_DUE"] as const;

/**
 * `UserAccess.reason` → premium outcome for learners (staff bypass uses `admin_override` — full access, not a “paid” row).
 */
export const GET_USER_ACCESS_REASON_PREMIUM: ReadonlyArray<{
  reason: string;
  typicallyPremium: boolean;
  note: string;
}> = [
  { reason: "active_subscription", typicallyPremium: true, note: "Stripe-backed ACTIVE row." },
  { reason: "grace_period", typicallyPremium: true, note: "DB GRACE period." },
  {
    reason: "past_due_grace",
    typicallyPremium: true,
    note: "PAST_DUE + ENTITLEMENT_PAST_DUE_* policy grants continued access.",
  },
  { reason: "active_trial", typicallyPremium: true, note: "App trial on User." },
  { reason: "admin_override", typicallyPremium: true, note: "Staff — not Stripe subscription emulation." },
  { reason: "no_access", typicallyPremium: false, note: "CANCELLED, denied past_due, expired trial, etc." },
];

/** DB / Prisma read failures**: `getUserAccess` **throws**; API gates return **503** (`access_verify_failed`), RSC returns `"error"` — never silent `no_access`. */
export const ENTITLEMENT_FAILURE_MODES = {
  apiSubscriberGate: "503 + access_verify_failed",
  pageRsc: 'resolveEntitlementForPage → "error"',
} as const;

/**
 * **App DB / product state → premium flag** (after staff bypass). Mirrors `getUserAccess` branches.
 * "—" = field ignored for that row. CANCELLED with future `currentPeriodEnd` still means no premium unless trial applies.
 */
export const DB_SUBSCRIPTION_TO_PREMIUM_MATRIX: ReadonlyArray<{
  dbSubscriptionStatus: string;
  userTrialActiveInWindow: boolean;
  pastDuePolicyGrants: boolean;
  hasPremium: boolean;
  reason: string;
  note: string;
}> = [
  {
    dbSubscriptionStatus: "ACTIVE",
    userTrialActiveInWindow: false,
    pastDuePolicyGrants: false,
    hasPremium: true,
    reason: "active_subscription",
    note: "Includes cancel_at_period_end while Stripe/DB still ACTIVE.",
  },
  {
    dbSubscriptionStatus: "GRACE",
    userTrialActiveInWindow: false,
    pastDuePolicyGrants: false,
    hasPremium: true,
    reason: "grace_period",
    note: "Internal / legacy GRACE bucket.",
  },
  {
    dbSubscriptionStatus: "PAST_DUE",
    userTrialActiveInWindow: false,
    pastDuePolicyGrants: true,
    hasPremium: true,
    reason: "past_due_grace",
    note: "Only when ENTITLEMENT_PAST_DUE_POLICY=grace and within grace window.",
  },
  {
    dbSubscriptionStatus: "PAST_DUE",
    userTrialActiveInWindow: false,
    pastDuePolicyGrants: false,
    hasPremium: false,
    reason: "no_access",
    note: "Default strict policy — then app trial may still grant below.",
  },
  {
    dbSubscriptionStatus: "CANCELLED",
    userTrialActiveInWindow: true,
    pastDuePolicyGrants: false,
    hasPremium: true,
    reason: "active_trial",
    note: "Trial on User, not Stripe trialing row.",
  },
  {
    dbSubscriptionStatus: "CANCELLED",
    userTrialActiveInWindow: false,
    pastDuePolicyGrants: false,
    hasPremium: false,
    reason: "no_access",
    note: "Expired or never subscribed.",
  },
];

/**
 * **Content SQL gates** (server-side only): {@link questionAccessWhere}, {@link lessonAccessWhere}, {@link userCanAccessExam}.
 * Requires `hasAccess` + non-null **country** + **tier** for learners (staff bypass uses broader region rules).
 * Unknown/invalid country → `normalizeCountryCodeForEntitlement` → **null** → **no question/lesson rows** (deny by default).
 */
export const CONTENT_GATE_RULES = {
  tier: "Effective tier from entitlement drives ladder (NP ⊃ RN ⊃ …); exam/content tier must be in subscriber ladder.",
  region: "CA subscriber: CA_ONLY + BOTH; US: US_ONLY + BOTH — cross-region content denied.",
  staff: "admin_override: region-filtered published content, not subscription tier emulation.",
} as const;
