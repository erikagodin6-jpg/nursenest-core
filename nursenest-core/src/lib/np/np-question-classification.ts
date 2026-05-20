/**
 * Canonical NP exam-style stem categories for coverage reporting.
 * Uses `question_format`, `cognitive_level`, and light stem keyword cues — not a replacement for a dedicated taxonomy column.
 */
export type NpStemType =
  | "diagnosis"
  | "next_step"
  | "management"
  | "pharmacology"
  | "interpretation"
  | "prioritization"
  | "unmapped";

const STEM = (s: string) => s.toLowerCase();

function formatHint(format: string | null | undefined): NpStemType | null {
  if (!format) return null;
  const f = format.toUpperCase();
  if (/PHARM|DRUG|MEDICATION|DOSE|PRESCRIB/i.test(f)) return "pharmacology";
  if (/LAB|ECG|EKG|IMAGING|X-?RAY|CT|MRI|INTERPRET/i.test(f)) return "interpretation";
  if (/DIAGNOSIS|DIFFERENTIAL|MOST LIKELY|LIKELY DIAG/i.test(f)) return "diagnosis";
  if (/NEXT STEP|NEXT BEST|INITIAL|PRIORITY|FIRST|EMERGENCY/i.test(f)) return "prioritization";
  if (/MANAGEMENT|TREATMENT|PLAN|THERAPY|FOLLOW/i.test(f)) return "management";
  if (/NEXT|STEP|ORDER|REFER|SCREEN/i.test(f)) return "next_step";
  return null;
}

function cognitiveHint(level: string | null | undefined): NpStemType | null {
  if (!level) return null;
  const u = level.toUpperCase();
  if (/EVALUATION|ANALYSIS|SYNTHESIS/i.test(u)) return "management";
  if (/APPLICATION/i.test(u)) return "next_step";
  return null;
}

function stemKeywordHint(stem: string): NpStemType | null {
  const s = STEM(stem);
  if (
    /\bwhich (finding|result|interpretation|ecg|ekg|x-?ray|ct|lab)\b/.test(s) ||
    /\bmost consistent with\b/.test(s) ||
    /\bserum (sodium|creatinine|troponin|hb|hemoglobin)\b/.test(s)
  ) {
    return "interpretation";
  }
  if (
    /\bmost appropriate (treatment|therapy|management|plan)\b/.test(s) ||
    /\bfirst-?line\b/.test(s) ||
    /\bstart which (medication|drug|therapy)\b/.test(s)
  ) {
    return "management";
  }
  if (
    /\bwhich (medication|drug|dose|antibiotic|insulin)\b/.test(s) ||
    /\bcontraindication\b/.test(s) ||
    /\badjust the dose\b/.test(s)
  ) {
    return "pharmacology";
  }
  if (
    /\bnext (best )?step\b/.test(s) ||
    /\bwhat should you (do|order) first\b/.test(s) ||
    /\bbefore (discharge|transfer)\b/.test(s) ||
    /\brefer (to|the patient)\b/.test(s)
  ) {
    return "next_step";
  }
  if (
    /\bmost likely diagnosis\b/.test(s) ||
    /\bwhich (diagnosis|condition) (is|best)\b/.test(s) ||
    /\bdiagnostic (impression|consideration)\b/.test(s)
  ) {
    return "diagnosis";
  }
  if (
    /\bmost (serious|urgent|immediate|priority)\b/.test(s) ||
    /\bwho (should|needs to) be seen first\b/.test(s) ||
    /\bsafety (concern|priority)\b/.test(s)
  ) {
    return "prioritization";
  }
  return null;
}

/**
 * Infer stem category for NP Canada coverage charts. Prefer explicit `question_format` when present.
 */
export function inferNpStemType(row: {
  stem: string;
  questionFormat: string | null | undefined;
  cognitiveLevel: string | null | undefined;
  questionType: string;
}): NpStemType {
  const fromFormat = formatHint(row.questionFormat ?? null);
  if (fromFormat) return fromFormat;

  const fromStem = stemKeywordHint(row.stem);
  if (fromStem) return fromStem;

  const fromCog = cognitiveHint(row.cognitiveLevel ?? null);
  if (fromCog) return fromCog;

  const qt = row.questionType.toUpperCase();
  if (qt === "SATA" || qt === "SELECT_ALL_THAT_APPLY") return "management";

  return "unmapped";
}
