"use client";

/**
 * Provider-agnostic **product / conversion** analytics facade.
 *
 * **Implementation:** delegates to {@link trackClientEvent} (PostHog today). Swap that module
 * or add a multiplexer here to route to another vendor without touching call sites.
 *
 * ## Event schema (common dimensions)
 *
 * Use **snake_case** property names for PostHog. Prefer these when applicable:
 *
 * | Property | Meaning |
 * |----------|---------|
 * | `marketing_locale` | UI locale (BCP-47 / app code, e.g. `en`, `fr`) |
 * | `marketing_region` | Cookie region `US` \| `CA` |
 * | `country_slug` | Pathway URL country: `us` \| `canada` |
 * | `pathway_id` | Stable pathway id (`us-rn-nclex-rn`, …) |
 * | `role_track` | URL segment: `rn`, `lpn`, `rpn`, `np`, `allied` |
 * | `exam_code` | URL segment: `nclex-rn`, `fnp`, … |
 * | `exam_key` | Product exam key (e.g. `NCLEX_RN`) |
 * | `stripe_tier` | Prisma `TierCode` string |
 * | `topic_slug` | Lesson topic slug when known |
 * | `topic_label` | Human topic / body-system label |
 * | `hub_path` | Request path for hub / lesson / cat |
 * | `surface` | Placement id (e.g. `home_hero_primary`, `tier_hub_cat`) |
 *
 * ## Server-side / already wired elsewhere
 *
 * - **Checkout session created:** `checkout_session_created` (API)
 * - **Subscription converted:** `learner_conversion_subscribed` (Stripe webhook)
 * - **CAT session started (app):** `learner_cat_exam_started` (practice-tests API)
 *
 * @see PH in `posthog-conversion-events.ts` for canonical event name strings.
 */

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { initPosthogClient, trackClientEvent } from "@/lib/observability/posthog-client";

export type ProductAnalyticsScalar = string | number | boolean | undefined;

/** Pathway fields commonly attached to funnel events. */
export function pathwayAnalyticsDimensions(
  p: Pick<ExamPathwayDefinition, "id" | "countrySlug" | "roleTrack" | "examCode" | "examKey" | "stripeTier">,
): Record<string, string> {
  return {
    pathway_id: p.id,
    country_slug: p.countrySlug,
    role_track: p.roleTrack,
    exam_code: p.examCode,
    exam_key: p.examKey,
    stripe_tier: String(p.stripeTier),
  };
}

/**
 * Non-blocking, SSR-safe: no-ops on server and swallows provider errors.
 * Uses a microtask so click handlers return before network work is scheduled.
 */
export function trackProductEvent(
  event: string,
  props?: Record<string, ProductAnalyticsScalar>,
): void {
  if (typeof window === "undefined") return;
  initPosthogClient();
  queueMicrotask(() => {
    try {
      trackClientEvent(event, props);
    } catch {
      /* analytics must never break UX */
    }
  });
}
