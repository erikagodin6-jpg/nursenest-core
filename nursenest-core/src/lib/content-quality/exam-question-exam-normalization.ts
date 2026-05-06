import { EXAM_PATHWAYS } from "../exam-pathways/exam-pathways-catalog";

/**
 * Normalize `ExamQuestion.exam` strings for storage and pathway `exam IN (contentExamKeys)` matching.
 * Postgres string equality is case-sensitive; Prisma `exam: { in: keys }` must match exactly.
 */

/** Collapse spacing/underscores for matching only (not for display). */
export function normExamKeyForMatching(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * When multiple pathway `contentExamKeys` collapse to the same norm, prefer this canonical string.
 * (Hyphenated display forms preferred over legacy underscore enums.)
 */
const COLLISION_CANONICAL_BY_NORM: Readonly<Record<string, string>> = {
  "nclex-rn": "NCLEX-RN",
  "nclex-pn": "NCLEX-PN",
  "rex-pn": "REx-PN",
};

/**
 * Legacy / import labels that should map onto pathway `contentExamKeys` so CAT / practice / flashcards
 * stay pathway-isolated without widening IN lists everywhere.
 */
const LEGACY_EXAM_ALIAS_BY_NORM: Readonly<Record<string, string>> = {
  "rn-cat": "NCLEX-RN",
  "rpn-cat": "NCLEX-PN",
  "np-cat": "NP",
  "np-advanced": "NP",
  aanp: "FNP",
  "aanp-fnp": "NP-FNP",
  /** DB / import typos that do not normalize to pathway keys via spacing alone */
  "np-fnp": "NP-FNP",
  nclexrn: "NCLEX-RN",
  nclexpn: "NCLEX-PN",
  /** Some exports used condensed tokens */
  rexpn: "REx-PN",
};

/** Allied board / discipline codes stored on `ExamQuestion.exam` (tier is often `allied` or profession-specific). */
export const ALLIED_EXAM_QUESTION_BOARD_KEYS: readonly string[] = [
  "ALLIED",
  "RDCS-AE",
  "RRT Mixed",
  "TMC",
  "CSCT-CARDIAC",
  "CCI-RCS",
  "NBRC-TMC",
  "NPTE-PT",
  "NBCOT-OT",
  "ASCP-MLT",
  "NREMT-EMT",
  "NREMT-P",
] as const;

function collectPathwayContentExamKeys(): string[] {
  const s = new Set<string>();
  for (const p of EXAM_PATHWAYS) {
    for (const k of p.contentExamKeys) {
      if (k.trim()) s.add(k);
    }
  }
  return [...s];
}

function buildNormToCanonicalFromPathways(): Map<string, string> {
  const m = new Map<string, string>();
  for (const k of collectPathwayContentExamKeys()) {
    const n = normExamKeyForMatching(k);
    if (!m.has(n)) m.set(n, k);
  }
  for (const [n, canon] of Object.entries(COLLISION_CANONICAL_BY_NORM)) {
    m.set(n, canon);
  }
  return m;
}

const NORM_TO_CANONICAL_PATHWAY = buildNormToCanonicalFromPathways();

/** Union of pathway keys + allied board keys allowed on publish (after normalization). */
export function examQuestionExamPublishAllowlist(): ReadonlySet<string> {
  const s = new Set<string>();
  for (const k of collectPathwayContentExamKeys()) s.add(k);
  for (const k of ALLIED_EXAM_QUESTION_BOARD_KEYS) s.add(k);
  for (const canon of Object.values(COLLISION_CANONICAL_BY_NORM)) s.add(canon);
  for (const canon of Object.values(LEGACY_EXAM_ALIAS_BY_NORM)) s.add(canon);
  return s;
}

const PUBLISH_ALLOWLIST = examQuestionExamPublishAllowlist();

/** Deterministic casing for keys that share the same norm (pathway + allied allowlist). */
function resolveCanonicalFromPublishAllowlistByNorm(n: string): string | null {
  let best: string | null = null;
  for (const k of PUBLISH_ALLOWLIST) {
    if (normExamKeyForMatching(k) !== n) continue;
    if (best == null || k.localeCompare(best) < 0) best = k;
  }
  return best;
}

/**
 * Returns the canonical `exam` string to persist, or `null` if the value is empty.
 * Unknown non-empty values are returned trimmed unchanged (callers may reject on publish).
 */
export function normalizeExamQuestionExamForStorage(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const n = normExamKeyForMatching(trimmed);
  const legacy = LEGACY_EXAM_ALIAS_BY_NORM[n];
  if (legacy) return legacy;
  const fromPathway = NORM_TO_CANONICAL_PATHWAY.get(n);
  if (fromPathway) return fromPathway;
  const fromAllowlist = resolveCanonicalFromPublishAllowlistByNorm(n);
  if (fromAllowlist) return fromAllowlist;
  return trimmed;
}

/**
 * Use for all `ExamQuestion` create/update `exam` assignments so DB values match pathway `contentExamKeys`
 * casing (Postgres equality is case-sensitive).
 */
export function canonicalExamQuestionExamForDbWrite(raw: string): string {
  const n = normalizeExamQuestionExamForStorage(raw);
  return (n ?? raw.trim()).trim();
}

/**
 * Order `exam` rewrite steps for a backfill so chained updates apply correctly
 * (e.g. `a`→`b` then `b`→`c`). If a cycle is present, falls back to lexicographic `from` order.
 */
export function orderExamQuestionExamRewritesForBackfill<T extends { from: string; to: string }>(plan: T[]): T[] {
  const items = [...plan];
  const out: T[] = [];
  while (items.length) {
    const idx = items.findIndex((p) => !items.some((q) => q !== p && q.to === p.from));
    if (idx === -1) {
      items.sort((a, b) => a.from.localeCompare(b.from));
      out.push(...items);
      break;
    }
    out.push(items.splice(idx, 1)[0]!);
  }
  return out;
}

export function isExamQuestionExamPublishAllowed(canonicalExam: string): boolean {
  return PUBLISH_ALLOWLIST.has(canonicalExam);
}
