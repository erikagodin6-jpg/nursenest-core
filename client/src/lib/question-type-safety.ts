const SAFE_TYPE_MAP: Record<string, string> = {
  "multiple_choice": "multiple-choice",
  "multiple-choice": "multiple-choice",
  "mcq": "multiple-choice",
  "mcq_single": "multiple-choice",
  "mcq-single": "multiple-choice",
  "priority": "multiple-choice",
  "prioritization": "multiple-choice",
  "delegation": "multiple-choice",
  "scenario-based": "multiple-choice",
  "scenario_based": "multiple-choice",
  "clinical-judgment": "multiple-choice",
  "clinical_judgment": "multiple-choice",
  "drag_drop": "multiple-choice",
  "drag-drop": "multiple-choice",
  "hotspot": "multiple-choice",
  "image_hotspot": "multiple-choice",
  "image-hotspot": "multiple-choice",
  "ranking": "multiple-choice",
  "ordered": "multiple-choice",
  "sata": "multiple-select",
  "select_all": "multiple-select",
  "select-all": "multiple-select",
  "select_all_that_apply": "multiple-select",
  "select-all-that-apply": "multiple-select",
  "multiple_select": "multiple-select",
  "multiple-select": "multiple-select",
};

export type SafeQuestionType = "multiple-choice" | "multiple-select";

export function normalizeQuestionType(raw: string | undefined | null): SafeQuestionType {
  if (!raw) return "multiple-choice";
  const normalized = raw.toLowerCase().replace(/_/g, "-").trim();
  const mapped = SAFE_TYPE_MAP[normalized];
  if (mapped) return mapped as SafeQuestionType;

  const withUnderscores = raw.toLowerCase().trim();
  const mapped2 = SAFE_TYPE_MAP[withUnderscores];
  if (mapped2) return mapped2 as SafeQuestionType;

  console.warn(`[QuestionTypeSafety] Unknown question type "${raw}", falling back to multiple-choice`);
  logUnsupportedType(raw, undefined);
  return "multiple-choice";
}

export function isKnownType(raw: string | undefined | null): boolean {
  if (!raw) return true;
  const normalized = raw.toLowerCase().replace(/_/g, "-").trim();
  return normalized in SAFE_TYPE_MAP || raw.toLowerCase().trim() in SAFE_TYPE_MAP;
}

const loggedTypes = new Set<string>();
let logQueue: Array<{ type: string; questionId?: string }> = [];
let logTimer: ReturnType<typeof setTimeout> | null = null;

export function logUnsupportedType(type: string, questionId: string | undefined) {
  const key = `${type}:${questionId || "unknown"}`;
  if (loggedTypes.has(key)) return;
  loggedTypes.add(key);

  logQueue.push({ type, questionId });

  if (!logTimer) {
    logTimer = setTimeout(flushUnsupportedTypeLogs, 2000);
  }
}

function flushUnsupportedTypeLogs() {
  logTimer = null;
  if (logQueue.length === 0) return;
  const batch = logQueue.splice(0);
  try {
    fetch("/api/telemetry/unsupported-question-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: batch }),
    }).catch(() => {});
  } catch {}
}

const ALLOWED_GENERATOR_TYPES = new Set([
  "multiple_choice",
  "MCQ",
  "SATA",
  "select_all_that_apply",
]);

const DISALLOWED_GENERATOR_TYPES = new Set([
  "priority",
  "drag_drop",
  "hotspot",
  "ranking",
  "DRAG_DROP",
  "HOTSPOT",
  "RANKING",
  "ORDERED",
  "IMAGE_HOTSPOT",
  "DRAG_DROP_CLOZE",
  "BOWTIE",
  "MATRIX",
  "MATCHING_GRID",
  "HIGHLIGHT_TEXT",
  "CALCULATION_NUMERIC",
]);

export function enforceGeneratorType(type: string): string {
  if (ALLOWED_GENERATOR_TYPES.has(type)) return type;
  if (DISALLOWED_GENERATOR_TYPES.has(type)) return "multiple_choice";
  return "multiple_choice";
}
