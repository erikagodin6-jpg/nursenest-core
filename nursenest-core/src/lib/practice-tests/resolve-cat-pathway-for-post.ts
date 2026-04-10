/**
 * POST `/api/practice-tests` (selectionMode `cat`) — pathway id contract.
 *
 * - **Explicit `pathwayId`**: always honored (caller still validates registry + entitlement + CAT readiness).
 * - **Omitted / empty `pathwayId`**:
 *   - **Exactly one CAT-eligible pathway** for the subscription → that id is used (unambiguous).
 *   - **Zero** → {@link PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_required} (no pool / no track).
 *   - **Two or more** → {@link PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_ambiguous} — client must send
 *     `pathwayId` or the user must use a pathway-scoped launcher (e.g. `/app/practice-tests/start?pathwayId=…`).
 *
 * Intentionally **no** “first eligible pathway” fallback when multiple CAT tracks exist — avoids silent
 * mismatches (e.g. RN vs NP) when integrations omit metadata.
 */
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";

export type ResolveCatPathwayForPostResult =
  | { ok: true; pathwayId: string; source: "request" | "single_eligible_unambiguous" }
  | {
      ok: false;
      code:
        | typeof PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_required
        | typeof PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_ambiguous;
      catEligibleCount: number;
    };

export function resolveCatPathwayIdForCatPost(
  requestedPathwayId: string | null | undefined,
  catEligible: ExamPathwayDefinition[],
): ResolveCatPathwayForPostResult {
  const trimmed = typeof requestedPathwayId === "string" ? requestedPathwayId.trim() : "";
  if (trimmed.length > 0) {
    return { ok: true, pathwayId: trimmed, source: "request" };
  }
  if (catEligible.length === 0) {
    return {
      ok: false,
      code: PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_required,
      catEligibleCount: 0,
    };
  }
  if (catEligible.length === 1) {
    return {
      ok: true,
      pathwayId: catEligible[0]!.id,
      source: "single_eligible_unambiguous",
    };
  }
  return {
    ok: false,
    code: PRACTICE_TEST_CAT_CREATE_CODE.cat_pathway_ambiguous,
    catEligibleCount: catEligible.length,
  };
}
