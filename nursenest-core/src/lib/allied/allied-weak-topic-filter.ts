/**
 * ## Allied weak-topic filtering (entitlement-first)
 *
 * **Canonical entry points for production callers**
 * - {@link filterWeakTopicsForAlliedEntitlement}
 * - {@link filterTopicRowsForAlliedEntitlement}
 *
 * ### Allied marketing core (`us-allied-core`, `ca-allied-core`, …)
 * - **Exclusive topics**: `exclusiveWinningProfessionForTopic` assigns a single owner profession per topic slug.
 *   Subscribers see weak-topic rows only when **owner === subscriber canonical occupation** (from Stripe-backed
 *   `AccessScope`, not only `User.alliedProfessionKey`).
 * - **Shared / hub-unregistered slugs**: when `exclusiveWinningProfessionForTopic` returns **null** (no registry
 *   claimant or unresolved multi-claimant edge), the row is treated as **shared Allied core** and **allowed**.
 *   **Caveat:** today “null winner” also covers **unknown** analytics labels that never appear in the registry;
 *   use {@link SHARED_ALLIED_WEAK_TOPIC_SLUG_ALLOWLIST} and {@link classifyAlliedCoreWeakTopicSemantics} to move
 *   toward explicit **shared** vs **unknown** handling without relying permanently on absence-in-registry = shared.
 *
 * ### Historical analytics contamination (pre–entitlement-aware filter)
 * Weak-topic rows derived from **past** sessions may include cross-profession noise for ALLIED users before
 * dashboard/study snapshot filtering used `subscriberCanonicalAlliedProfessionKey` + exclusive-topic rules.
 * **No automatic DB rewrite** is attempted here. Options for product/data:
 * - **Invalidate** cached aggregates if any materialized weak-topic rollups exist (none in this module).
 * - **Rebuild** topic-performance snapshots on next session activity (natural decay) or run a one-off backfill job
 *   that recomputes weak topics from question-level rows with current `questionAccessWhereWithPathway` gates.
 * - **Accept** short-term UI drift until learners accumulate new gated attempts.
 *
 * ### Non–allied-core learner pathways + ALLIED tier
 * - **Occupation present**: legacy narrowing via `topicSlugsIn` on {@link getAlliedProfessionByProfessionKey} —
 *   {@link filterWeakTopicsForAlliedProfession} (deprecated for new code).
 * - **Missing occupation**: **fail closed** — return **empty** lists (cannot prove topics are shared-core).
 *
 * ### Missing Allied occupation metadata (subscription)
 * - On **allied core**: exclusive rows **removed**; shared/unregistered slugs may remain (recovery UX elsewhere).
 * - On **non–allied-core**: **empty** weak topics (fail closed).
 *
 * ### Staff / admin learner QA bypass
 * - {@link accessScopeIsStaffLearnerEntitlementBypass} → lists pass through **unfiltered** for QA surfaces.
 *
 * ### Legacy helpers
 * - {@link filterWeakTopicsForAlliedProfession} / {@link filterTopicRowsForAlliedProfession} are **deprecated**
 *   for new call sites — prefer entitlement-aware functions above.
 */

import { TierCode } from "@prisma/client";
import type { AlliedProfessionMarketing } from "@/lib/allied/allied-professions-registry";
import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
import {
  alliedProfessionClaimantsForTopic,
  exclusiveWinningProfessionForTopic,
} from "@/lib/allied/allied-profession-lesson-exclusive-scope";
import { subscriberCanonicalAlliedProfessionKey } from "@/lib/entitlements/allied-occupation-entitlement";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";

/**
 * Explicit allowlist of weak-topic **slugs** that are intentionally **shared Allied core** (not inferred).
 * Populate as product/catalog defines shared weak areas; until then, “no exclusive winner” still allows the row.
 */
export const SHARED_ALLIED_WEAK_TOPIC_SLUG_ALLOWLIST: readonly string[] = [];

/** How a topic slug relates to Allied occupation scoping on a marketing-core pathway. */
export type AlliedWeakTopicSlugSemantics =
  | { kind: "shared_core"; detail: "allowlisted" | "no_exclusive_winner" }
  | { kind: "exclusive"; ownerProfessionKey: string }
  /** Multiple registry claimants but no resolved owner yet — same UX as shared until catalog/graph is repaired. */
  | { kind: "contested_registry"; claimants: readonly string[] }
  /** Non–allied-core: `topicSlugsIn` match for subscriber profession (legacy registry field). */
  | { kind: "profession_primary_legacy" };

export function classifyAlliedCoreWeakTopicSemantics(pathwayId: string, slug: string): AlliedWeakTopicSlugSemantics {
  const t = slug.trim().toLowerCase();
  if (!t) return { kind: "shared_core", detail: "no_exclusive_winner" };

  if (SHARED_ALLIED_WEAK_TOPIC_SLUG_ALLOWLIST.includes(t)) {
    return { kind: "shared_core", detail: "allowlisted" };
  }

  const claimants = alliedProfessionClaimantsForTopic(pathwayId, t);
  const winner = exclusiveWinningProfessionForTopic(pathwayId, t);
  if (winner) {
    return { kind: "exclusive", ownerProfessionKey: winner };
  }
  if (claimants.length > 1) {
    return { kind: "contested_registry", claimants };
  }
  return { kind: "shared_core", detail: "no_exclusive_winner" };
}

function topicMatchesSlug(topicLabel: string, slug: string): boolean {
  const topic = topicLabel.trim().toLowerCase();
  const s = slug.trim().toLowerCase();
  if (!topic || !s) return false;
  if (topic === s) return true;
  const tDash = topic.replace(/\s+/g, "-");
  const sSpaces = s.replace(/-/g, " ");
  return tDash.includes(s) || topic.includes(sSpaces) || tDash === s;
}

/**
 * @deprecated For **new** code use {@link filterWeakTopicsForAlliedEntitlement} with `AccessScope` + learner pathway.
 * Retained for non–allied-core `topicSlugsIn` narrowing and internal delegation from entitlement filter.
 */
export function filterWeakTopicsForAlliedProfession(
  weakTopics: WeakTopicRow[],
  prof: Pick<AlliedProfessionMarketing, "topicSlugsIn"> | null | undefined,
): WeakTopicRow[] {
  const slugs = prof?.topicSlugsIn?.filter(Boolean) ?? [];
  if (slugs.length === 0) return weakTopics;
  return weakTopics.filter((w) => slugs.some((slug) => topicMatchesSlug(w.topic, slug)));
}

/**
 * @deprecated For **new** code use {@link filterTopicRowsForAlliedEntitlement}.
 */
export function filterTopicRowsForAlliedProfession<T extends { topic: string }>(
  rows: T[],
  prof: Pick<AlliedProfessionMarketing, "topicSlugsIn"> | null | undefined,
): T[] {
  const slugs = prof?.topicSlugsIn?.filter(Boolean) ?? [];
  if (slugs.length === 0) return rows;
  return rows.filter((w) => slugs.some((slug) => topicMatchesSlug(w.topic, slug)));
}

type TopicLike = { topic: string; normalizedTopic?: string | null };

function topicSlugForAlliedEntitlement(row: TopicLike): string {
  return (row.normalizedTopic ?? normalizeTopicKey(row.topic)).trim().toLowerCase();
}

function weakTopicAllowedOnAlliedCorePathway(
  row: TopicLike,
  entitlement: AccessScope,
  pathwayId: string,
): boolean {
  const slug = topicSlugForAlliedEntitlement(row);
  if (!slug) return true;

  const semantics = classifyAlliedCoreWeakTopicSemantics(pathwayId, slug);
  if (semantics.kind === "shared_core" || semantics.kind === "contested_registry") {
    return true;
  }
  if (semantics.kind !== "exclusive") return true;

  const pk = subscriberCanonicalAlliedProfessionKey(entitlement);
  if (!pk) return false;
  return semantics.ownerProfessionKey === pk;
}

/**
 * Dashboard / Study Next / adaptive weak-topic lists — **subscription occupation** + pathway hub,
 * not only `User.alliedProfessionKey` (Stripe metadata is source of truth via {@link subscriberCanonicalAlliedProfessionKey}).
 *
 * - **Allied marketing core**: {@link classifyAlliedCoreWeakTopicSemantics} drives allow/deny for exclusive rows.
 * - **Other pathways**: legacy `topicSlugsIn` narrowing when occupation exists; **missing occupation → empty**
 *   (fail closed — cannot prove topic is shared).
 */
export function filterWeakTopicsForAlliedEntitlement(
  weakTopics: WeakTopicRow[],
  entitlement: AccessScope,
  learnerPathwayId: string | null | undefined,
): WeakTopicRow[] {
  if (accessScopeIsStaffLearnerEntitlementBypass(entitlement)) return weakTopics;
  if (entitlement.tier !== TierCode.ALLIED || !entitlement.hasAccess) return weakTopics;

  const pid = learnerPathwayId?.trim() ?? "";

  if (pid && isAlliedMarketingCorePathwayId(pid)) {
    return weakTopics.filter((w) => weakTopicAllowedOnAlliedCorePathway(w, entitlement, pid));
  }

  const pk = subscriberCanonicalAlliedProfessionKey(entitlement);
  if (pk) {
    const ap = getAlliedProfessionByProfessionKey(pk);
    return filterWeakTopicsForAlliedProfession(weakTopics, ap);
  }

  return [];
}

/** Trends / strong-topic rows — same rules as {@link filterWeakTopicsForAlliedEntitlement}. */
export function filterTopicRowsForAlliedEntitlement<T extends TopicLike>(
  rows: T[],
  entitlement: AccessScope,
  learnerPathwayId: string | null | undefined,
): T[] {
  if (accessScopeIsStaffLearnerEntitlementBypass(entitlement)) return rows;
  if (entitlement.tier !== TierCode.ALLIED || !entitlement.hasAccess) return rows;

  const pid = learnerPathwayId?.trim() ?? "";

  if (pid && isAlliedMarketingCorePathwayId(pid)) {
    return rows.filter((w) => weakTopicAllowedOnAlliedCorePathway(w, entitlement, pid));
  }

  const pk = subscriberCanonicalAlliedProfessionKey(entitlement);
  if (pk) {
    const ap = getAlliedProfessionByProfessionKey(pk);
    return filterTopicRowsForAlliedProfession(rows, ap);
  }

  return [];
}
