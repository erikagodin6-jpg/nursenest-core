import type { GlobalExamContext } from "@/lib/exam-context/global-exam-context";

/** Strings that must not appear in Canadian PN (REx-PN) learner-facing content. */
const CA_PN_FORBIDDEN = [/NCLEX-PN\b/i, /\bNCLEX_PN\b/i];

/** Strings that must not appear in US NCLEX-PN learner-facing content. */
const US_PN_FORBIDDEN = [/\bREx-PN\b/i, /\bREX_PN\b/i, /Canadian Practical Nurse Exam/i];

export type ContentGuardrailViolation = {
  code: "forbidden_phrase";
  detail: string;
};

/**
 * Runtime check for rendered copy — log and optionally strip in dev.
 * Does not mutate CAT / scoring.
 */
export function validateLearnerCopyForExamContext(
  text: string,
  ctx: GlobalExamContext,
): ContentGuardrailViolation[] {
  const out: ContentGuardrailViolation[] = [];
  if (!text?.trim()) return out;

  if (ctx.country === "CA" && ctx.exam === "REX_PN") {
    for (const re of CA_PN_FORBIDDEN) {
      if (re.test(text)) {
        out.push({ code: "forbidden_phrase", detail: `Canadian PN context must not match ${re}` });
      }
    }
  }
  if (ctx.country === "US" && ctx.exam === "NCLEX_PN") {
    for (const re of US_PN_FORBIDDEN) {
      if (re.test(text)) {
        out.push({ code: "forbidden_phrase", detail: `US NCLEX-PN context must not match ${re}` });
      }
    }
  }
  return out;
}
