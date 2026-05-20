const NO_SHUFFLE_TAGS = new Set(
  ["no_option_shuffle", "disable_option_shuffle", "disableOptionShuffle"].map((s) => s.toLowerCase()),
);

/** Detect SATA / select-all from normalized type string. */
export function isSataQuestionType(questionType: string | null | undefined): boolean {
  const qt = (questionType ?? "").toUpperCase();
  return qt === "SATA" || qt === "SELECT_ALL_THAT_APPLY";
}

/**
 * Single-best-answer MCQ option shuffle is disabled when tags ask for it or when option text
 * suggests order-dependent or "all/none of the above" style stems.
 */
export function shouldDisableOptionShuffleMcq(params: {
  questionType: string | null | undefined;
  tags?: string[] | null | undefined;
  optionTexts: string[];
}): boolean {
  if (isSataQuestionType(params.questionType)) return true;
  for (const raw of params.tags ?? []) {
    const t = String(raw).trim().toLowerCase();
    if (t && NO_SHUFFLE_TAGS.has(t)) return true;
  }
  const joined = params.optionTexts.join(" ").toLowerCase();
  if (/\ball of the above\b|\bnone of the above\b|\bboth a and b\b|\bboth b and a\b/.test(joined)) {
    return true;
  }
  if (/\bfirst\b.*\bsecond\b|\bstep\s*1\b|\bstep\s*2\b|\bin order\b/.test(joined)) return true;
  return false;
}

/** xorshift32 — deterministic PRNG from a string seed (session + question bound). */
function rngFromSeed(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  let state = h >>> 0;
  if (state === 0) state = 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0xffffffff;
  };
}

/**
 * Stable display permutation for one question within a session: same inputs ⇒ same order;
 * different `sessionKey` (per-practice-test salt) ⇒ different order across sessions.
 */
export function buildExamOptionDisplayOrder(params: {
  sessionKey: string;
  questionId: string;
  canonicalKeys: string[];
}): string[] {
  const keys = params.canonicalKeys;
  if (keys.length <= 1) return [...keys];
  const rnd = rngFromSeed(`${params.sessionKey}::opts::${params.questionId}`);
  const idx = keys.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [idx[i], idx[j]] = [idx[j]!, idx[i]!];
  }
  return idx.map((i) => keys[i]!);
}
