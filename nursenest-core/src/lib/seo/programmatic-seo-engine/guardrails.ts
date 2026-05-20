/**
 * Pure quality guardrails for programmatic SEO copy (titles, descriptions, audit flags).
 */

const PLACEHOLDER_RE = /\b(lorem ipsum|todo:|tbd|coming soon|placeholder)\b/i;
const SHOUTY_RE = /!!{2,}|\bCLICK HERE\b|\bMUST READ\b/i;

/** Very short or obvious junk meta — safe to replace with auto when manual is weak. */
export function isWeakMetaDescription(text: string | null | undefined, minLen = 48): boolean {
  const t = (text ?? "").trim().replace(/\s+/g, " ");
  if (t.length < minLen) return true;
  if (PLACEHOLDER_RE.test(t)) return true;
  if (!/[.!?]\s/.test(t) && t.length < 90) return true;
  return false;
}

export function isWeakSeoTitle(text: string | null | undefined, minLen = 8): boolean {
  const t = (text ?? "").trim();
  if (t.length < minLen) return true;
  if (PLACEHOLDER_RE.test(t)) return true;
  return false;
}

export function isShoutyOrSpammyTitle(text: string | null | undefined): boolean {
  const t = (text ?? "").trim();
  if (!t) return true;
  if (SHOUTY_RE.test(t)) return true;
  return false;
}

/**
 * Prefer descriptions that read like a sentence (verb or colon structure), not keyword soup.
 * Used only as a soft signal for audits / optional merge — not a hard block.
 */
export function metaDescriptionLooksLikeKeywordSoup(text: string | null | undefined): boolean {
  const t = (text ?? "").trim();
  if (t.length < 40) return false;
  const commas = (t.match(/,/g) ?? []).length;
  if (commas >= 5 && !/[.!?]\s/.test(t)) return true;
  return false;
}

export function clampMetaDescription(text: string, max = 155): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  const slice = t.slice(0, max - 1).trimEnd();
  const lastSpace = slice.lastIndexOf(" ");
  const base = lastSpace > 40 ? slice.slice(0, lastSpace) : slice;
  return `${base}…`;
}
