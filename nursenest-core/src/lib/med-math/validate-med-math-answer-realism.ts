/**
 * Exam/clinical-style realism gates for medication math numeric answers and rounding metadata.
 * Use during migration/import and in contract tests — not a substitute for clinical verification.
 */

export type MedMathNumericQuestion = {
  id: string;
  statement: string;
  answer: number;
  unit: string;
  steps?: string[];
  rationale?: string;
  safetyNote?: string;
};

const ROUNDING_RE =
  /\b(round|rounding|nearest|whole\s+number|to\s+the\s+(nearest|whole)|tenth|hundredth|truncate)\b/i;

export function hasRoundingInstruction(q: MedMathNumericQuestion, globalCorpusPolicy?: string): boolean {
  const blob = [q.statement, q.rationale, q.safetyNote, ...(q.steps ?? [])].filter(Boolean).join("\n");
  if (ROUNDING_RE.test(blob)) return true;
  if (globalCorpusPolicy && globalCorpusPolicy.trim().length >= 80) return true;
  return false;
}

export function decimalPlaces(n: number): number {
  if (!Number.isFinite(n)) return 99;
  const s = n.toString();
  if (s.includes("e") || s.includes("E")) {
    const [, exp] = s.split(/e/i);
    const e = parseInt(exp ?? "0", 10);
    const base = s.split(/e/i)[0] ?? s;
    const i = base.indexOf(".");
    const frac = i < 0 ? 0 : base.length - i - 1;
    return Math.max(0, frac - e);
  }
  const i = s.indexOf(".");
  return i < 0 ? 0 : s.length - i - 1;
}

function unitLower(u: string): string {
  return u.trim().toLowerCase();
}

/** True if value is a multiple of 0.25 (workable tablet fractions). */
export function isQuarterTabletIncrement(answer: number): boolean {
  if (!Number.isFinite(answer) || answer < 0 || answer > 64) return false;
  const x = answer * 4;
  return Math.abs(x - Math.round(x)) < 1e-6;
}

function isTabletLikeUnit(u: string): boolean {
  return /\b(tablet|tablets|capsule|capsules|pill|pills|tab)\b/i.test(u);
}

function isVolumeMl(u: string): boolean {
  const x = unitLower(u);
  if (x.includes("ml/hr") || x.includes("ml / hr")) return false;
  if (x.includes("gtt")) return false;
  return x.includes("ml") || x.includes("m l");
}

function isMlPerHour(u: string): boolean {
  const x = unitLower(u);
  return x.includes("ml/hr") || x.includes("ml / hr") || x === "ml/hr";
}

function isGttPerMin(u: string): boolean {
  const x = unitLower(u);
  return x.includes("gtt/min") || x.includes("gtt / min");
}

function isHoursUnit(u: string): boolean {
  const x = unitLower(u);
  return /\bhours?\b/.test(x) && !x.includes("ml");
}

/**
 * Returns human-readable issues for one legacy-style numeric med-math row.
 * Pass `globalCorpusPolicy` (e.g. exported deck policy paragraph) to satisfy rounding when items lack per-row wording.
 */
export function validateMedMathNumericQuestion(
  q: MedMathNumericQuestion,
  opts?: { globalCorpusPolicy?: string },
): string[] {
  const issues: string[] = [];
  const u = q.unit?.trim() ?? "";
  if (!u) issues.push(`${q.id}: missing unit`);

  if (!hasRoundingInstruction(q, opts?.globalCorpusPolicy)) {
    issues.push(`${q.id}: missing rounding instruction (add per-item text or a vetted global corpus policy)`);
  }

  const a = q.answer;
  if (!Number.isFinite(a)) {
    issues.push(`${q.id}: answer is not a finite number`);
    return issues;
  }

  if (isGttPerMin(u)) {
    if (!Number.isInteger(a)) issues.push(`${q.id}: gtt/min must be a whole number (got ${a})`);
  } else if (isMlPerHour(u)) {
    if (decimalPlaces(a) > 1) issues.push(`${q.id}: mL/hr should have at most 1 decimal (${a})`);
  } else if (isVolumeMl(u)) {
    if (decimalPlaces(a) > 1) issues.push(`${q.id}: mL volume should have at most 1 decimal (${a})`);
  } else if (isTabletLikeUnit(u)) {
    if (!isQuarterTabletIncrement(a)) {
      issues.push(`${q.id}: tablet/capsule answer must use workable fractions (multiples of 0.25 tab; got ${a})`);
    }
  } else if (isHoursUnit(u)) {
    if (decimalPlaces(a) > 2) issues.push(`${q.id}: hours should have at most 2 decimal places (${a})`);
  } else if (unitLower(u) === "mg" || unitLower(u).endsWith(" mg")) {
    if (decimalPlaces(a) > 2) issues.push(`${q.id}: mg answer has excessive decimals (${a})`);
    if (Math.abs(a) < 100 && decimalPlaces(a) > 1) {
      issues.push(`${q.id}: small mg doses should usually be rounded to ≤1 decimal for exam-style clarity (${a})`);
    }
  }

  return issues;
}

export function validateMedMathNumericCorpus(
  questions: MedMathNumericQuestion[],
  opts?: { globalCorpusPolicy?: string },
): string[] {
  const out: string[] = [];
  for (const q of questions) {
    out.push(...validateMedMathNumericQuestion(q, opts));
  }
  return out;
}
