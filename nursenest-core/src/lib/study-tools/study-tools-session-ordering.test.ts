import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { subscriptionCoversPathwayBase } from "@/lib/exam-pathways/pathway-entitlements";
import { orderingSequencesForCategories } from "@/lib/study-tools/clinical-ordering-sequences";
import { shuffleSeeded } from "@/lib/practice-tests/session-seeded-random";
import type { StudyToolOrderingItem, StudyToolsSessionPayload } from "@/lib/study-tools/study-tools-session-types";

function scope(partial: Pick<AccessScope, "hasAccess" | "reason" | "tier" | "country">): AccessScope {
  return {
    hasAccess: partial.hasAccess,
    reason: partial.reason,
    tier: partial.tier,
    country: partial.country,
    alliedCareer: null,
  };
}

/**
 * Mirrors the ordering branch of {@link buildStudyToolsSession} without importing Prisma-backed modules
 * (keeps this test file runnable in lightweight `tsx --test` runs).
 */
function buildOrderingSessionLikeServer(args: {
  pathwayId: string;
  entitlement: AccessScope;
  selectedCategories: StudyToolsSessionPayload["selectedCategories"];
  count: number;
  shuffle: boolean;
  userId: string;
  mode: StudyToolsSessionPayload["mode"];
}): { ok: true; payload: StudyToolsSessionPayload; items: StudyToolOrderingItem[] } | { ok: false } {
  const pathway = getExamPathwayById(args.pathwayId.trim());
  if (!pathway || !subscriptionCoversPathwayBase(args.entitlement, pathway)) return { ok: false };
  const payload: StudyToolsSessionPayload = {
    pathwayId: pathway.id,
    selectedCategories: args.selectedCategories,
    mode: args.mode,
    count: Math.min(50, Math.max(1, args.count)),
    shuffle: args.shuffle,
    filters: {},
  };
  const pool = orderingSequencesForCategories(args.selectedCategories);
  const shuffled = shuffleSeeded([...pool], `${args.userId}:${pathway.id}:ordering:test`).slice(0, payload.count);
  const items: StudyToolOrderingItem[] = shuffled.map((s) => ({
    kind: "ordering",
    id: `ord:${s.id}`,
    title: s.title,
    steps: [...s.steps],
    canonicalCategory: s.canonicalTags[0] ?? "fundamentals_safety",
  }));
  return { ok: true, payload, items };
}

describe("study tools ordering session (payload contract, no DB)", () => {
  it("includes pathway, selected categories, mode, count, and ordering items", () => {
    const r = buildOrderingSessionLikeServer({
      userId: "test_user",
      entitlement: scope({ hasAccess: true, reason: "active_subscription", tier: "RN", country: "CA" }),
      pathwayId: "ca-rn-nclex-rn",
      selectedCategories: ["neurological"],
      count: 2,
      shuffle: false,
      mode: "ordering",
    });
    assert.equal(r.ok, true);
    if (!r.ok) return;
    assert.equal(r.payload.mode, "ordering");
    assert.deepEqual(r.payload.selectedCategories, ["neurological"]);
    assert.ok(r.items.length >= 1 && r.items.length <= 2);
    assert.equal(r.items[0]?.kind, "ordering");
  });
});
