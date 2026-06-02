import { EXAM_PATHWAYS_SEGMENT_A } from "@/lib/exam-pathways/exam-pathways-data-segment-a";
import { EXAM_PATHWAYS_SEGMENT_C } from "@/lib/exam-pathways/exam-pathways-data-segment-c";
import type { NormalizeErr, NormalizeOk } from "@/lib/replit-import/replit-question-normalize";
import type { NormalizedExamQuestion } from "@/lib/replit-import/replit-question-types";
import { inferCountryFromRaw, mapTrackAndCountryToExamFields } from "@/lib/replit-import/replit-exam-country-map";
import type { ImportCountry } from "@/lib/replit-import/replit-question-types";

/**
 * NP pathways today: Canadian NP in segment A, US NP specialties in segment C.
 * Keep in sync with `exam-product-registry` ordering — do not drop keys if NP rows move segments.
 */
const NP_PATHWAYS_FOR_REGISTRY_KEYS = [
  ...EXAM_PATHWAYS_SEGMENT_A.filter((p) => p.roleTrack === "np"),
  ...EXAM_PATHWAYS_SEGMENT_C,
];

/** Registry NP `contentExamKeys` (uppercase) for matching export `exam` labels. */
const NP_EXAM_FROM_REGISTRY = new Set(
  NP_PATHWAYS_FOR_REGISTRY_KEYS.flatMap((p) => p.contentExamKeys.map((k) => k.toUpperCase())),
);

/**
 * Additional `exam` strings seen on Replit `exam_questions.json` that are NP boards/tracks
 * but may not appear verbatim in pathway `contentExamKeys`.
 */
const NP_EXAM_EXTRA_LABELS = new Set([
  "AANP",
  "ANCC",
  "ENP",
  "AACNP",
  "NONPF",
]);

function examSignalsNp(examRaw: string): boolean {
  const u = examRaw.trim().toUpperCase();
  if (!u) return false;
  if (NP_EXAM_FROM_REGISTRY.has(u)) return true;
  if (NP_EXAM_EXTRA_LABELS.has(u)) return true;
  if (u.includes("FNP") || u.includes("PMHNP") || u.includes("AGPCNP") || u.includes("AGNP")) return true;
  return false;
}

/**
 * Whether a raw `exam_questions.json` row should be treated as NP for recovery.
 * Signals: `tier` (case-insensitive) === `np`, or `exam` matches NP registry / known board labels.
 */
export function isExamQuestionsJsonNpCandidate(raw: Record<string, unknown>): boolean {
  const tier = typeof raw.tier === "string" ? raw.tier.trim().toLowerCase() : "";
  if (tier === "np") return true;
  const exam = typeof raw.exam === "string" ? raw.exam : "";
  return examSignalsNp(exam);
}

function isNpNormalizedRow(row: NormalizedExamQuestion): boolean {
  return row.tier.toLowerCase() === "np";
}

/**
 * Source-specific pass for `data/replit-exports/exam_questions.json`:
 * `inferTrackFromRaw` does not inspect `exam`, so rows with `exam: "AANP"` and a missing/wrong `tier`
 * would not map to NP. Force NP mapping when {@link isExamQuestionsJsonNpCandidate} matches.
 * Keeps `exam` column as the canonical aggregate key `NP` (pathway coverage), not the board label.
 */
export function applyExamQuestionsJsonNpRecovery(
  raw: Record<string, unknown>,
  result: NormalizeOk | NormalizeErr,
  defaultCountry: ImportCountry,
): NormalizeOk | NormalizeErr {
  if (!result.ok) return result;
  if (!isExamQuestionsJsonNpCandidate(raw)) return result;
  if (isNpNormalizedRow(result.row)) return result;

  const country = inferCountryFromRaw(raw, defaultCountry);
  const mapped = mapTrackAndCountryToExamFields("NP", country);
  const row: NormalizedExamQuestion = {
    ...result.row,
    tier: mapped.tier,
    exam: mapped.exam,
    regionScope: mapped.regionScope,
    countryCode: mapped.countryCode,
    careerType: mapped.careerType,
  };
  return { ok: true, row };
}
