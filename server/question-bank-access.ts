import { allowedNursingExamQuestionTiersForUser } from "./paywall-tier-rules";
import {
  getLegacyQuestionBankScopeForUser,
  legacyQuestionBankItemMatchesUserScope,
  type LegacyQuestionBankScope,
} from "./question-bank-validation";

/**
 * Central gate for legacy `question_bank` learner access: region/exam scope + paywall tier ladder.
 * Admin uses `kind: "admin"` and applies filters in routes without learner entitlement checks.
 */
export type QuestionBankLearnerGate =
  | { kind: "admin" }
  | { kind: "learner"; scope: LegacyQuestionBankScope | null; contentTiers: string[] };

export function resolveQuestionBankLearnerGate(
  user: { tier?: string | null; region?: string | null } | null | undefined,
  isAdmin: boolean,
): QuestionBankLearnerGate {
  if (isAdmin) return { kind: "admin" };
  const tiers = allowedNursingExamQuestionTiersForUser(user?.tier || "free") ?? [];
  const scope = getLegacyQuestionBankScopeForUser(user);
  return { kind: "learner", scope, contentTiers: tiers };
}

export function learnerCanAccessQuestionBankItem(
  item: { country: string; examType: string; contentTier: string | null },
  gate: QuestionBankLearnerGate,
): boolean {
  if (gate.kind === "admin") return true;
  if (!gate.scope) return false;
  if (!legacyQuestionBankItemMatchesUserScope(item, gate.scope)) return false;
  if (!item.contentTier || item.contentTier.trim() === "") return false;
  if (gate.contentTiers.length === 0) return false;
  return gate.contentTiers.includes(item.contentTier.toLowerCase());
}
