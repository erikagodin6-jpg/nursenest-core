/**
 * Score **published pathway lessons** against question signals for rationale deep links.
 * Complements registry regex matching — prefers same-topic-cluster lessons with lexical overlap.
 */
import type { CountryCode } from "@prisma/client";
import type {
  PathwayRationaleContext,
  QuestionRationaleSignals,
  RationaleLessonLinkKind,
} from "@/lib/learner/lesson-question-rationale/types";
import { haystackFromQuestionSignals } from "@/lib/learner/lesson-question-rationale/match";

const STOP = new Set([
  "that",
  "this",
  "with",
  "from",
  "have",
  "been",
  "will",
  "your",
  "their",
  "what",
  "when",
  "which",
  "there",
  "patient",
  "clients",
  "client",
  "nurse",
  "nursing",
]);

/** Strong match — prefer over generic hub / weak registry overlap. */
export const RATIONALE_DB_EXACT_MIN_SCORE = 58;
/** Acceptable DB link when registry is thin. */
export const RATIONALE_DB_WEAK_MIN_SCORE = 44;
/** Never surface below this (irrelevant). */
export const RATIONALE_DB_HARD_FLOOR = 32;

const MED_RE =
  /\b(insulin|warfarin|heparin|digoxin|opioid|opioids|antibiotic|antibiotics|anticoag|benzodiazep|diuretic|beta[\s-]?blocker|ace\s*inhibitor|ssri|antipsychotic|chemotherapy|chemo|pharmac|medication|medications|dosage|dose|tablet|mg\b|mcg|high[\s-]?alert|interaction|contraindicat|adverse\s+effect)\b/i;

const SAFE_PRI_RE =
  /\b(fall|falls|infection|ppe|isolation|sepsis|priorit|delegat|assignment|handoff|restraint|fire\s+safety|medication\s+error|wrong[\s-]?site|time[\s-]?out|chain\s+of\s+command|urgent|emergent|first\s+action|airway)\b/i;

function tokenSet(s: string): Set<string> {
  const out = new Set<string>();
  for (const w of s.toLowerCase().split(/[^a-z0-9]+/)) {
    if (w.length < 4) continue;
    if (STOP.has(w)) continue;
    out.add(w);
  }
  return out;
}

function overlapScore(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let n = 0;
  for (const x of a) {
    if (b.has(x)) n += 1;
  }
  return Math.min(28, n * 4);
}

function inferKindFromHaystack(qHay: string, lessonHay: string): RationaleLessonLinkKind {
  const qMed = MED_RE.test(qHay);
  const lMed = MED_RE.test(lessonHay);
  if (qMed && lMed) return "medication";
  const qS = SAFE_PRI_RE.test(qHay);
  const lS = SAFE_PRI_RE.test(lessonHay);
  if (qS && lS) return /priorit|delegat|assignment|first\s+action|urgent/i.test(qHay + lessonHay)
    ? "prioritization"
    : "safety";
  return "disease_process";
}

export type PathwayLessonScoreRow = {
  id: string;
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  countryCode: CountryCode | null;
};

/**
 * Score a published lesson row against question signals. Higher = better deep-link match.
 *
 * **Signals used:** topic cluster (`topicCode`), token overlap (stem/topic/tags vs lesson title/topic/body system),
 * medication vs medication, safety/prioritization vs same, pathway country vs optional `lesson.countryCode`.
 */
export function scorePathwayLessonForQuestionSignals(
  signals: QuestionRationaleSignals,
  pathwayCtx: PathwayRationaleContext | null,
  lesson: PathwayLessonScoreRow,
  topicCodeNormalized: string | null,
): { score: number; kind: RationaleLessonLinkKind } {
  const qHay = haystackFromQuestionSignals(signals);
  const lessonHay = `${lesson.topicSlug} ${lesson.topic} ${lesson.title} ${lesson.bodySystem}`.toLowerCase();

  let score = 0;

  const tc = (topicCodeNormalized ?? "").trim().toLowerCase();
  const ls = lesson.topicSlug.trim().toLowerCase();
  if (tc && tc.length > 1) {
    if (ls === tc) score += 44;
    else if (ls.includes(tc) || tc.includes(ls)) score += 22;
  }

  const qTok = tokenSet(qHay);
  const lTok = tokenSet(lessonHay);
  score += overlapScore(qTok, lTok);

  if (MED_RE.test(qHay) && MED_RE.test(lessonHay)) score += 16;
  if (SAFE_PRI_RE.test(qHay) && SAFE_PRI_RE.test(lessonHay)) score += 14;

  if (lesson.countryCode && pathwayCtx && lesson.countryCode !== pathwayCtx.countryCode) {
    score -= 48;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  const kind = inferKindFromHaystack(qHay, lessonHay);
  return { score, kind };
}

export function rankPathwayLessonRowsForQuestion(
  signals: QuestionRationaleSignals,
  pathwayCtx: PathwayRationaleContext | null,
  rows: PathwayLessonScoreRow[],
  topicCodeNormalized: string | null,
): Array<{ row: PathwayLessonScoreRow; score: number; kind: RationaleLessonLinkKind }> {
  const scored = rows
    .map((row) => {
      const { score, kind } = scorePathwayLessonForQuestionSignals(signals, pathwayCtx, row, topicCodeNormalized);
      return { row, score, kind };
    })
    .filter((x) => x.score >= RATIONALE_DB_HARD_FLOOR)
    .sort((a, b) => b.score - a.score);
  return scored;
}
