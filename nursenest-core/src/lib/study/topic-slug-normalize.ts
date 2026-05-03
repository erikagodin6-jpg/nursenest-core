/**
 * Canonical topic slug rules for pathway lessons and cross-study linking.
 * Lowercase kebab-case; trims whitespace; collapses inner whitespace to single hyphens.
 */

const NON_KEBAB = /[^a-z0-9-]+/g;
const MULTI_HYPHEN = /-+/g;

export function normalizeTopicSlugInput(raw: string | null | undefined): string {
  return (raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(NON_KEBAB, "-")
    .replace(MULTI_HYPHEN, "-")
    .replace(/^-+|-+$/g, "");
}

/** True when value is non-empty, lowercase, kebab-case, no leading/trailing hyphen. */
export function isStrictKebabTopicSlug(s: string | null | undefined): boolean {
  if (s == null || typeof s !== "string") return false;
  const t = s.trim();
  if (!t) return false;
  if (t !== t.toLowerCase()) return false;
  if (t.startsWith("-") || t.endsWith("-")) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(t);
}

export type TopicSlugIssueKind =
  | "missing"
  | "invalid_chars"
  | "uppercase"
  | "whitespace_edges"
  | "inner_whitespace"
  | "non_kebab";

export function auditTopicSlugValue(raw: string | null | undefined): TopicSlugIssueKind[] {
  const issues: TopicSlugIssueKind[] = [];
  if (raw == null || !String(raw).trim()) {
    issues.push("missing");
    return issues;
  }
  const s = String(raw);
  if (s !== s.trim()) issues.push("whitespace_edges");
  if (/\s/.test(s.trim())) issues.push("inner_whitespace");
  if (s.trim() !== s.trim().toLowerCase()) issues.push("uppercase");
  const n = normalizeTopicSlugInput(s);
  if (!n) {
    issues.push("invalid_chars");
    return issues;
  }
  if (!isStrictKebabTopicSlug(n)) issues.push("non_kebab");
  if (/[^a-z0-9-]/.test(s.trim().toLowerCase().replace(/\s+/g, "-"))) issues.push("invalid_chars");
  return issues;
}

/** Derive a slug from a human topic title (for repair suggestions only). */
export function topicTitleToSlugSuggestion(title: string | null | undefined): string {
  return normalizeTopicSlugInput(title ?? "");
}
