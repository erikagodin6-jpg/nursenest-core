/**
 * Playwright-only guards for visible marketing DOM — complements `marketing-message-value-policy.ts`
 * and shard/build validators.
 *
 * **Why this file exists:** static JSON checks and TSX greps cannot prove that composed RSC + client
 * trees, `formatSentenceCase`, and hydration never surface placeholder or mirror-stub strings in the
 * final **visible** document. These matchers run on `innerText()` (script/style contents excluded).
 */

/** Trimmed line equals one of these (case-insensitive) → treat as leaked placeholder / stub. */
export const FORBIDDEN_MARKETING_STANDALONE_LINES = new Set(
  [
    "title",
    "description",
    "button",
    "kicker",
    "eyebrow",
    "intro",
    "lead",
    "subtitle",
    "cta",
    "label",
    "heading",
    "question",
    "answer",
    "text",
    "placeholder",
    "lorem",
    "stub",
    "todo",
    "tbd",
    "copy",
    "string",
    "value1",
    "value2",
    "value3",
    "included1",
  ].map((s) => s.toLowerCase()),
);

/** Case-insensitive substring checks on collapsed body text (phrases / markers, not single words). */
export const FORBIDDEN_MARKETING_SUBSTRINGS = [
  "[missing:",
  "{{missing",
  "lorem ipsum",
  "content unavailable right now. please refresh the page.",
  "value1 title",
  "value2 title",
  "value3 title",
  "included heading",
  "not included heading",
  "worth it question",
  "after pay question",
  "tbd —",
  "tbd--",
  "<<stub",
] as const;

/**
 * Shouty design-system / CMS tokens (word boundaries). Uppercase only so we do not flag clinical
 * acronyms like `RN` or normal words like `lead` in prose.
 */
export const FORBIDDEN_SHOUTY_DESIGN_TOKEN_RE = new RegExp(
  String.raw`\b(?:KICKER|LABEL|TITLE|DESCRIPTION|LEAD|SUBTITLE|CTA|BUTTON|HEADING|EYEBROW|INTRO|STUB|TODO|TBD|PLACEHOLDER)\b`,
);

export function normalizeMarketingDomText(raw: string): string {
  return raw
    .replace(/\u00a0/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function splitNonEmptyLines(innerText: string): string[] {
  return innerText
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

export function looksLikeLeakedFlatI18nKeyLine(line: string): boolean {
  const t = line.trim();
  if (t.length < 6 || t.length > 200) return false;
  if (!/^[a-z][a-z0-9_.]+$/i.test(t)) return false;
  return (
    t.startsWith("pages.") ||
    t.startsWith("nav.") ||
    t.startsWith("footer.") ||
    t.startsWith("components.") ||
    t.startsWith("brand.") ||
    t.startsWith("learner.")
  );
}

export type MarketingDomPlaceholderViolation =
  | { kind: "standalone_line"; line: string }
  | { kind: "substring"; needle: string }
  | { kind: "shouty_token"; token: string }
  | { kind: "leaked_key_line"; line: string };

export function collectMarketingDomPlaceholderViolations(visibleBodyInnerText: string): MarketingDomPlaceholderViolation[] {
  const normalized = normalizeMarketingDomText(visibleBodyInnerText);
  const lowerCollapsed = normalized.toLowerCase();
  const out: MarketingDomPlaceholderViolation[] = [];

  for (const line of splitNonEmptyLines(normalized)) {
    const low = line.toLowerCase();
    if (FORBIDDEN_MARKETING_STANDALONE_LINES.has(low)) {
      out.push({ kind: "standalone_line", line });
    }
    if (looksLikeLeakedFlatI18nKeyLine(line)) {
      out.push({ kind: "leaked_key_line", line });
    }
  }

  for (const needle of FORBIDDEN_MARKETING_SUBSTRINGS) {
    if (lowerCollapsed.includes(needle.toLowerCase())) {
      out.push({ kind: "substring", needle });
    }
  }

  const shouty = normalized.match(FORBIDDEN_SHOUTY_DESIGN_TOKEN_RE);
  if (shouty) {
    out.push({ kind: "shouty_token", token: shouty[0]! });
  }

  return out;
}

export function formatMarketingDomViolationMessage(
  route: string,
  violations: MarketingDomPlaceholderViolation[],
): string {
  const parts = violations.slice(0, 12).map((v) => {
    switch (v.kind) {
      case "standalone_line":
        return `standalone_line:${JSON.stringify(v.line.slice(0, 120))}`;
      case "substring":
        return `substring:${JSON.stringify(v.needle)}`;
      case "shouty_token":
        return `shouty_token:${v.token}`;
      case "leaked_key_line":
        return `leaked_key_line:${JSON.stringify(v.line.slice(0, 160))}`;
      default:
        return String(v);
    }
  });
  const suffix = violations.length > 12 ? ` (+${violations.length - 12} more)` : "";
  return `[marketing-placeholder-dom] ${route}: ${parts.join(" | ")}${suffix}`;
}
