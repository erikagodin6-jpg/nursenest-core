/**
 * Shared display helpers for admin + ops surfaces: turn internal identifiers into
 * polished, title-case (or sentence-case) labels without changing persisted values.
 */

export type DisplayLabelMode = "title" | "sentence";

export type FormatDisplayLabelOpts = {
  mode?: DisplayLabelMode;
  /** Hard cap for very long telemetry strings */
  maxLength?: number;
};

/** Whole-string overrides (exact match after trim). */
const WHOLE_STRING_LABELS: Record<string, string> = {
  NO_PUBLISHED_EXAM_QUESTIONS_IN_DB: "No Published Exam Questions Found",
  patient_safety_quality: "Patient Safety & Quality",
  LVN_LPN: "LPN/LVN",
  ALLIED: "Allied Health",
  NEW_GRAD: "New Grad",
};

/** Substring / phrase replacements applied before token formatting (message-level). */
const PHRASE_REPLACEMENTS: Array<{ match: RegExp; replace: string }> = [
  {
    match: /Editorial plan JSON failed schema validation/gi,
    replace: "Blog plan format could not be read",
  },
];

/**
 * Detects dotted i18n-style keys and common internal key prefixes that should never
 * appear verbatim in learner-facing UI.
 */
export function looksLikeRawI18nKey(s: string | null | undefined): boolean {
  if (!s) return false;
  const t = s.trim();
  if (!t) return false;
  if (/^(?:pages|footer|blog|admin|content|learner|app|nav|components|marketing)\.[a-z0-9_.-]+$/i.test(t)) {
    return true;
  }
  /** e.g. content.coverage.emptyState */
  if (/^[a-z]{2,}(?:\.[a-z0-9_-]+){2,}$/i.test(t) && t.includes(".")) {
    const head = t.split(".")[0]?.toLowerCase() ?? "";
    const DOMAIN = new Set([
      "pages",
      "footer",
      "blog",
      "admin",
      "content",
      "learner",
      "app",
      "nav",
      "components",
      "marketing",
      "seo",
      "errors",
      "forms",
    ]);
    if (DOMAIN.has(head)) return true;
  }
  return false;
}

const ACRONYM_LOWER = new Map<string, string>([
  ["ai", "AI"],
  ["api", "API"],
  ["json", "JSON"],
  ["seo", "SEO"],
  ["rn", "RN"],
  ["pn", "PN"],
  ["np", "NP"],
  ["rpn", "RPN"],
  ["lpn", "LPN"],
  ["lvn", "LVN"],
  ["cat", "CAT"],
  ["ecg", "ECG"],
  ["db", "DB"],
  ["utc", "UTC"],
  ["id", "ID"],
  ["url", "URL"],
  ["qa", "QA"],
  ["csv", "CSV"],
  ["pdf", "PDF"],
  ["html", "HTML"],
  ["css", "CSS"],
  ["js", "JS"],
  ["ts", "TS"],
  ["ui", "UI"],
  ["ux", "UX"],
  ["http", "HTTP"],
  ["https", "HTTPS"],
  ["ssl", "SSL"],
  ["tls", "TLS"],
  ["nclex", "NCLEX"],
]);

function applyAcronymFixes(s: string): string {
  let out = s;
  for (const [k, v] of ACRONYM_LOWER) {
    const re = new RegExp(`\\b${k}\\b`, "gi");
    out = out.replace(re, v);
  }
  out = out.replace(/\bNclex[\s–-]+Rn\b/gi, "NCLEX-RN");
  out = out.replace(/\bNclex[\s–-]+Pn\b/gi, "NCLEX-PN");
  out = out.replace(/\bRex[\s–-]+Pn\b/gi, "REx-PN");
  out = out.replace(/\bNclex\b/gi, "NCLEX");
  return out;
}

function splitIdentifierTokens(raw: string): string[] {
  const t = raw.trim();
  if (!t) return [];
  if (t.includes(" ")) {
    return t.split(/\s+/u).filter(Boolean);
  }
  /** SCREAMING_SNAKE or snake_case */
  if (t.includes("_")) {
    return t.split("_").filter(Boolean);
  }
  /** camelCase / PascalCase */
  const parts = t
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/\s+/u)
    .filter(Boolean);
  return parts.length ? parts : [t];
}

function titleCaseWords(words: string[]): string {
  return words
    .map((w) => {
      const lower = w.toLowerCase();
      if (ACRONYM_LOWER.has(lower)) return ACRONYM_LOWER.get(lower)!;
      if (!w) return "";
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .filter(Boolean)
    .join(" ");
}

function sentenceCaseWords(words: string[]): string {
  const t = titleCaseWords(words);
  if (!t) return "";
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/**
 * Converts identifiers and enum-like tokens to human labels.
 * Examples:
 * - BLOG_CONTROL_PANEL_PIPELINE → Blog Control Panel Pipeline
 * - topic_intent_rejected → Topic Intent Rejected (prefer {@link humanizeAdminOperationalMessage} for prose)
 * - safe mode: off → Safe Mode: Off
 */
export function formatDisplayLabel(raw: string | null | undefined, opts: FormatDisplayLabelOpts = {}): string {
  const mode = opts.mode ?? "title";
  const max = opts.maxLength ?? 240;
  if (raw == null) return "—";
  const trimmed = String(raw).trim();
  if (!trimmed) return "—";

  const whole = WHOLE_STRING_LABELS[trimmed];
  if (whole) return whole.length > max ? `${whole.slice(0, max - 1)}…` : whole;

  /** Colon-separated status lines: preserve structure, title-case segments */
  if (trimmed.includes(":")) {
    const parts = trimmed.split(":").map((p) => p.trim()).filter(Boolean);
    const rebuilt = parts
      .map((p) => {
        const words = splitIdentifierTokens(p.replace(/\s+/g, " "));
        return mode === "sentence" ? sentenceCaseWords(words) : titleCaseWords(words);
      })
      .join(": ");
    const withAc = applyAcronymFixes(rebuilt);
    return withAc.length > max ? `${withAc.slice(0, max - 1)}…` : withAc;
  }

  const words = splitIdentifierTokens(trimmed.replace(/\s+/g, " "));
  const base = mode === "sentence" ? sentenceCaseWords(words) : titleCaseWords(words);
  const withAc = applyAcronymFixes(base);
  return withAc.length > max ? `${withAc.slice(0, max - 1)}…` : withAc;
}

/**
 * Long-form admin / pipeline errors: prefer clear sentences; still applies acronym fixes.
 */
export function humanizeAdminOperationalMessage(raw: string | null | undefined): string {
  if (raw == null) return "";
  let s = String(raw).trim();
  if (!s) return "";

  for (const { match, replace } of PHRASE_REPLACEMENTS) {
    s = s.replace(match, replace);
  }

  /** topic_intent_rejected: reason → headline + optional detail */
  const ti = /^topic_intent_rejected:\s*(.*)$/i.exec(s);
  if (ti) {
    const detail = ti[1]?.trim() ?? "";
    const head = "Topic needs clinical specificity";
    if (!detail) return `${head}.`;
    const detailSentence = formatDisplayLabel(detail, { mode: "sentence" });
    return `${head}. ${detailSentence}`;
  }
  if (/^topic_intent_rejected$/i.test(s)) {
    return "Topic needs clinical specificity.";
  }

  /** duplicate_topic_intent:... */
  const dup = /^duplicate_topic_intent(?::(.+))?$/i.exec(s);
  if (dup) {
    const rest = dup[1]?.trim();
    return rest
      ? `Duplicate topic intent (${rest}).`
      : "Duplicate topic intent — this topic is already queued or published.";
  }

  if (/^[A-Z0-9_]+$/u.test(s) && s.includes("_")) {
    return formatDisplayLabel(s, { mode: "title" });
  }

  /** Mostly readable prose: light touch */
  if (s.includes(" ") && !/_/.test(s)) {
    return applyAcronymFixes(s.charAt(0).toUpperCase() + s.slice(1));
  }

  if (/_/.test(s) && !/\s/.test(s)) {
    return formatDisplayLabel(s, { mode: "sentence" });
  }

  return applyAcronymFixes(s);
}

export function formatPrismaEnumLabel(value: string | null | undefined): string {
  if (value == null) return "—";
  const t = String(value).trim();
  if (!t) return "—";
  return formatDisplayLabel(t, { mode: "title" });
}

/**
 * Short infrastructure / probe labels (DB status, HTTP probe rows).
 */
export function formatHealthStatusLabel(raw: string | null | undefined): string {
  if (raw == null) return "—";
  const t = String(raw).trim();
  if (!t) return "—";
  const lower = t.toLowerCase();
  if (lower === "ok") return "OK";
  if (lower === "fail" || lower === "failed" || lower === "error") return "Failed";
  if (lower === "yes") return "Yes";
  if (lower === "no") return "No";
  return formatDisplayLabel(t, { mode: "title" });
}
