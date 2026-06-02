import type { IntlRnLintMarket } from "@/lib/international-rn/intl-rn-country-site-matrix";

export type IntlRnContentLintHit = {
  ruleId: string;
  pattern: string;
  excerpt: string;
};

/** Same-chunk waiver for explicit comparison / parallel-prep language (not titles). */
const COMPARISON_CONTEXT_RE =
  /\b(compare|comparison|comparing|versus|vs\.?|parallel|not (a |the )?(substitute|copy|replacement)|when you|where those|abroad|north american|transferable)\b/i;

function splitLintChunks(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);
}

function excerptAround(text: string, index: number, radius = 72): string {
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + radius);
  const slice = text.slice(start, end).replace(/\s+/g, " ").trim();
  return slice.length < text.length ? `…${slice}…` : slice;
}

const RULES_ALL_NON_CA = [
  { ruleId: "rex-pn", re: /\bREx-PN\b/i },
  { ruleId: "canadian-provincial-registration", re: /Canadian provincial registration/i },
] as const;

const RULES_GB = [
  { ruleId: "nclex-rn", re: /\bNCLEX-RN\b/i },
  { ruleId: "ncsbn", re: /\bNCSBN\b/i },
  { ruleId: "state-board", re: /state board/i },
  { ruleId: "provincial-college", re: /provincial college/i },
  ...RULES_ALL_NON_CA,
] as const;

const RULES_AU = [
  { ruleId: "nclex-rn", re: /\bNCLEX-RN\b/i },
  { ruleId: "state-board", re: /state board/i },
  { ruleId: "provincial-college", re: /provincial college/i },
  { ruleId: "nmc-cbt", re: /\bNMC CBT\b/i },
  ...RULES_ALL_NON_CA,
] as const;

const RULES_PH = [
  { ruleId: "nclex-rn", re: /\bNCLEX-RN\b/i },
  { ruleId: "nmc-cbt", re: /\bNMC CBT\b/i },
  { ruleId: "ahpra-nmba", re: /\bAHPRA\b|\bNMBA\b/i },
  ...RULES_ALL_NON_CA,
] as const;

/** India: avoid US/Canada exam framing and UK/AU regulator-only labels in standalone copy. */
const RULES_IN = [
  { ruleId: "nclex-rn", re: /\bNCLEX-RN\b/i },
  { ruleId: "ncsbn", re: /\bNCSBN\b/i },
  { ruleId: "state-board", re: /state board/i },
  { ruleId: "provincial-college", re: /provincial college/i },
  { ruleId: "nmc-cbt", re: /\bNMC CBT\b/i },
  { ruleId: "ahpra-nmba", re: /\bAHPRA\b|\bNMBA\b/i },
  ...RULES_ALL_NON_CA,
] as const;

const RULES_NG = [
  { ruleId: "nclex-rn", re: /\bNCLEX-RN\b/i },
  { ruleId: "nmc-cbt", re: /\bNMC CBT\b/i },
  { ruleId: "ahpra-nmba", re: /\bAHPRA\b|\bNMBA\b/i },
  { ruleId: "state-board", re: /state board/i },
  { ruleId: "provincial-college", re: /provincial college/i },
  ...RULES_ALL_NON_CA,
] as const;

const RULES_SA = [
  { ruleId: "nclex-rn", re: /\bNCLEX-RN\b/i },
  { ruleId: "nmc-cbt", re: /\bNMC CBT\b/i },
  { ruleId: "state-board", re: /state board/i },
  { ruleId: "provincial-college", re: /provincial college/i },
  ...RULES_ALL_NON_CA,
] as const;

function rulesForMarket(market: IntlRnLintMarket): readonly { ruleId: string; re: RegExp }[] {
  switch (market) {
    case "gb":
      return RULES_GB;
    case "au":
      return RULES_AU;
    case "ph":
      return RULES_PH;
    case "in":
      return RULES_IN;
    case "ng":
      return RULES_NG;
    case "sa":
      return RULES_SA;
    default:
      return RULES_ALL_NON_CA;
  }
}

function shouldSuppressForComparisonChunk(ruleId: string, chunk: string): boolean {
  if (!COMPARISON_CONTEXT_RE.test(chunk)) return false;
  return (
    ruleId === "nclex-rn" ||
    ruleId === "nmc-cbt" ||
    ruleId === "ahpra-nmba" ||
    ruleId === "ncsbn" ||
    ruleId === "state-board" ||
    ruleId === "provincial-college"
  );
}

/** Negated mentions ("not the NMC CBT", "not … AHPRA") are regulator-safe disclaimers. */
function isNegatedCrossRegulatorChunk(chunk: string): boolean {
  return /\bnot\b.{0,160}\b(NMC CBT|NMC\b|AHPRA|NMBA)\b/i.test(chunk);
}

function findHitsInChunk(chunk: string, rules: readonly { ruleId: string; re: RegExp }[]): IntlRnContentLintHit[] {
  const out: IntlRnContentLintHit[] = [];
  for (const { ruleId, re } of rules) {
    const m = re.exec(chunk);
    if (!m || m.index === undefined) continue;
    if (shouldSuppressForComparisonChunk(ruleId, chunk)) continue;
    if ((ruleId === "ncsbn" || ruleId === "ahpra-nmba") && /not affiliated/i.test(chunk)) continue;
    if ((ruleId === "nmc-cbt" || ruleId === "ahpra-nmba") && isNegatedCrossRegulatorChunk(chunk)) continue;
    out.push({ ruleId, pattern: re.source, excerpt: excerptAround(chunk, m.index) });
  }
  return out;
}

/**
 * Lint user-facing copy for regulator-unsafe or wrong-country phrases.
 * Comparison / parallel-prep language in the same chunk suppresses selected cross-exam false positives.
 */
export function lintIntlRnMarketCorpus(market: IntlRnLintMarket, corpus: string): IntlRnContentLintHit[] {
  const rules = rulesForMarket(market);
  const hits: IntlRnContentLintHit[] = [];
  for (const chunk of splitLintChunks(corpus)) {
    hits.push(...findHitsInChunk(chunk, rules));
  }
  return hits;
}
