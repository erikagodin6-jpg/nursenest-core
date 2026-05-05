/**
 * Canonical `ExamQuestion.exam` values.
 *
 * The DB column is still a string, so every write/import path must normalize
 * loose values (case, spaces, underscores) before records reach Prisma.
 */
export const CANONICAL_EXAM_QUESTION_EXAM_KEYS = [
  "NCLEX-RN",
  "NCLEX-PN",
  "REx-PN",
  "NP",
  "FNP",
  "NP-FNP",
  "AGPCNP",
  "AGNP",
  "PMHNP",
  "PSYCH-NP",
  "WHNP",
  "NP-WHNP",
  "WOMENS-HEALTH-NP",
  "PNP-PC",
  "PNP_PC",
  "PEDIATRIC-PC-NP",
  "CNPLE",
  "CAN-NP",
  "ALLIED",
] as const;

export type CanonicalExamQuestionExamKey = (typeof CANONICAL_EXAM_QUESTION_EXAM_KEYS)[number];

const CANONICAL_BY_NORMALIZED = new Map<string, CanonicalExamQuestionExamKey>(
  CANONICAL_EXAM_QUESTION_EXAM_KEYS.flatMap((key) => [
    [normalizeLooseExamKey(key), key],
    [normalizeLooseExamKey(key.replace(/-/g, "_")), key],
    [normalizeLooseExamKey(key.replace(/-/g, " ")), key],
  ]),
);

const EXPLICIT_ALIASES: ReadonlyArray<readonly [string, CanonicalExamQuestionExamKey]> = [
  ["nclexrn", "NCLEX-RN"],
  ["rn", "NCLEX-RN"],
  ["registered nurse", "NCLEX-RN"],
  ["nclexpn", "NCLEX-PN"],
  ["nclex pn", "NCLEX-PN"],
  ["pn", "NCLEX-PN"],
  ["lpn", "NCLEX-PN"],
  ["lvn", "NCLEX-PN"],
  ["rexpn", "REx-PN"],
  ["rex pn", "REx-PN"],
  ["rpn", "REx-PN"],
  ["ca-rpn", "REx-PN"],
  ["canada-rpn", "REx-PN"],
  ["np fnp", "NP-FNP"],
  ["np_fnp", "NP-FNP"],
  ["psych np", "PSYCH-NP"],
  ["psych_np", "PSYCH-NP"],
  ["womens health np", "WOMENS-HEALTH-NP"],
  ["women's health np", "WOMENS-HEALTH-NP"],
  ["pnp pc", "PNP-PC"],
  ["pnp_pc", "PNP-PC"],
  ["pediatric pc np", "PEDIATRIC-PC-NP"],
  ["pediatric_pc_np", "PEDIATRIC-PC-NP"],
  ["can np", "CAN-NP"],
  ["can_np", "CAN-NP"],
];

for (const [alias, canonical] of EXPLICIT_ALIASES) {
  CANONICAL_BY_NORMALIZED.set(normalizeLooseExamKey(alias), canonical);
}

function normalizeLooseExamKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function canonicalizeExamQuestionExam(value: string): CanonicalExamQuestionExamKey | null {
  const normalized = normalizeLooseExamKey(value);
  if (!normalized) return null;
  return CANONICAL_BY_NORMALIZED.get(normalized) ?? null;
}

export function assertCanonicalExamQuestionExam(value: string): CanonicalExamQuestionExamKey {
  const canonical = canonicalizeExamQuestionExam(value);
  if (!canonical) {
    throw new Error(
      `Invalid ExamQuestion.exam "${value}". Expected one of: ${CANONICAL_EXAM_QUESTION_EXAM_KEYS.join(", ")}`,
    );
  }
  return canonical;
}
