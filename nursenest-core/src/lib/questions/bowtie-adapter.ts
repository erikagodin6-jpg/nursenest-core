/**
 * Bowtie / Trend NGN — defensive parsing of structured `options` JSON.
 * Never throws; returns null when the payload is incomplete or malformed.
 */

export const BOWTIE_SLOT_KEYS = ["condition", "intervention", "monitoring"] as const;
export type BowtieSlotKey = (typeof BOWTIE_SLOT_KEYS)[number];

export type BowtieBankItem = { id: string; label: string };

/** Normalized shape for the BowtieQuestionRenderer. */
export type NormalizedBowtiePayload = {
  /** Clinical vignette — prefer stem; optional override from options.scenario */
  scenario: string;
  slotLabels: Record<BowtieSlotKey, string>;
  bank: BowtieBankItem[];
};

/** Serialized learner answer (stored in session JSON). */
export type BowtieUserAnswer = {
  type: "bowtie";
  mapping: Record<BowtieSlotKey, string>;
};

const DEFAULT_LABELS: Record<BowtieSlotKey, string> = {
  condition: "2 conditions",
  intervention: "1 intervention",
  monitoring: "1 monitoring parameter",
};

export function isBowtieQuestionType(questionType: string | null | undefined): boolean {
  const u = (questionType ?? "").trim().toUpperCase();
  if (!u) return false;
  return u.includes("BOWTIE") || u === "TREND" || u.includes("TREND");
}

function trimNonEmpty(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  return t.length > 0 ? t : null;
}

function parseBank(raw: unknown): BowtieBankItem[] | null {
  if (!Array.isArray(raw) || raw.length < 3) return null;
  const out: BowtieBankItem[] = [];
  for (let i = 0; i < raw.length; i++) {
    const row = raw[i];
    if (row && typeof row === "object" && !Array.isArray(row)) {
      const o = row as Record<string, unknown>;
      const id = trimNonEmpty(o.id) ?? trimNonEmpty(o.key);
      const label = trimNonEmpty(o.text) ?? trimNonEmpty(o.label) ?? trimNonEmpty(o.value);
      if (!id || !label) return null;
      out.push({ id, label });
      continue;
    }
    if (typeof row === "string") {
      const label = row.trim();
      if (!label) return null;
      out.push({ id: `opt_${i}`, label });
      continue;
    }
    return null;
  }
  return out.length >= 3 ? out : null;
}

/** Merge editorial labels with defaults so partial overrides are allowed. */
function mergeSlotLabels(raw: unknown): Record<BowtieSlotKey, string> {
  const out: Record<BowtieSlotKey, string> = { ...DEFAULT_LABELS };
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  const o = raw as Record<string, unknown>;
  for (const k of BOWTIE_SLOT_KEYS) {
    const t = trimNonEmpty(o[k]);
    if (t) out[k] = t;
  }
  return out;
}

/**
 * Attempt to normalize bowtie display data from `exam_questions.options` Json.
 * Accepts:
 * - `{ format: "bowtie", bank: [...], slotLabels?: {...}, scenario?: string }`
 * - `{ bowtie: { bank, slotLabels, scenario } }` (nested)
 * - Legacy `bank` / `slotLabels` at top level when `format` hints bowtie
 */
export function tryNormalizeBowtiePayload(
  questionType: string | null | undefined,
  stem: string | null | undefined,
  optionsJson: unknown,
): NormalizedBowtiePayload | null {
  if (!isBowtieQuestionType(questionType)) return null;
  if (!optionsJson || typeof optionsJson !== "object" || Array.isArray(optionsJson)) return null;

  const root = optionsJson as Record<string, unknown>;
  const nested =
    root.bowtie && typeof root.bowtie === "object" && !Array.isArray(root.bowtie)
      ? (root.bowtie as Record<string, unknown>)
      : root;

  const fmt = trimNonEmpty(nested.format) ?? trimNonEmpty(root.format);
  if (fmt && fmt.toLowerCase() !== "bowtie") return null;

  const bankRaw = nested.bank ?? root.bank;
  const bank = parseBank(bankRaw);
  if (!bank) return null;

  const slotLabels = mergeSlotLabels(nested.slotLabels ?? root.slotLabels);

  const scenarioExtra =
    trimNonEmpty(nested.scenario) ?? trimNonEmpty(root.scenario) ?? trimNonEmpty(root.vignette);
  const stemText = trimNonEmpty(stem) ?? "";
  const scenario = scenarioExtra ?? stemText;
  if (!trimNonEmpty(scenario)) return null;

  return {
    scenario,
    slotLabels,
    bank,
  };
}

export function buildBowtieUserAnswer(mapping: Record<BowtieSlotKey, string>): BowtieUserAnswer {
  return { type: "bowtie", mapping: { ...mapping } };
}

export function isBowtieUserAnswer(value: unknown): value is BowtieUserAnswer {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const o = value as Record<string, unknown>;
  if (o.type !== "bowtie") return false;
  if (!o.mapping || typeof o.mapping !== "object" || Array.isArray(o.mapping)) return false;
  const m = o.mapping as Record<string, unknown>;
  for (const k of BOWTIE_SLOT_KEYS) {
    const v = m[k];
    if (typeof v !== "string" || !v.trim()) return false;
  }
  return true;
}

export function isBowtieAnswerComplete(value: unknown): boolean {
  return isBowtieUserAnswer(value);
}

/** Answer key on the question row: `{ correctMapping: { condition, intervention, monitoring } }`. */
export function parseBowtieCorrectMapping(correctAnswer: unknown): Record<BowtieSlotKey, string> | null {
  if (!correctAnswer || typeof correctAnswer !== "object" || Array.isArray(correctAnswer)) return null;
  const cm = (correctAnswer as Record<string, unknown>).correctMapping;
  if (!cm || typeof cm !== "object" || Array.isArray(cm)) return null;
  const out: Partial<Record<BowtieSlotKey, string>> = {};
  const m = cm as Record<string, unknown>;
  for (const k of BOWTIE_SLOT_KEYS) {
    const v = m[k];
    if (typeof v !== "string" || !v.trim()) return null;
    out[k] = v.trim();
  }
  return out as Record<BowtieSlotKey, string>;
}

function parseMappingFromUnknown(m: unknown): Record<BowtieSlotKey, string> | null {
  if (!m || typeof m !== "object" || Array.isArray(m)) return null;
  const o = m as Record<string, unknown>;
  const out: Partial<Record<BowtieSlotKey, string>> = {};
  for (const k of BOWTIE_SLOT_KEYS) {
    const v = o[k];
    if (typeof v !== "string" || !v.trim()) return null;
    out[k] = v.trim();
  }
  return out as Record<BowtieSlotKey, string>;
}

/** Parse learner payload — prefers `{ type: "bowtie", mapping }`. */
export function parseBowtieUserMapping(userAnswer: unknown): Record<BowtieSlotKey, string> | null {
  if (!userAnswer || typeof userAnswer !== "object" || Array.isArray(userAnswer)) return null;
  const o = userAnswer as Record<string, unknown>;
  if (o.type === "bowtie") {
    return parseMappingFromUnknown(o.mapping);
  }
  if (o.mapping && typeof o.mapping === "object") {
    return parseMappingFromUnknown(o.mapping);
  }
  return null;
}

export function bowtieCorrectIdsList(correctAnswer: unknown): string[] {
  const m = parseBowtieCorrectMapping(correctAnswer);
  if (!m) return [];
  return BOWTIE_SLOT_KEYS.map((k) => m[k]);
}

/** Partial in-progress mapping from stored session answer (allows empty strings). */
export function coerceBowtieDraftAnswer(value: unknown): Record<BowtieSlotKey, string> {
  const empty: Record<BowtieSlotKey, string> = { condition: "", intervention: "", monitoring: "" };
  if (!value || typeof value !== "object" || Array.isArray(value)) return empty;
  const o = value as Record<string, unknown>;
  if (o.type !== "bowtie" || !o.mapping || typeof o.mapping !== "object" || Array.isArray(o.mapping)) return empty;
  const m = o.mapping as Record<string, unknown>;
  for (const k of BOWTIE_SLOT_KEYS) {
    const v = m[k];
    empty[k] = typeof v === "string" ? v : "";
  }
  return empty;
}
