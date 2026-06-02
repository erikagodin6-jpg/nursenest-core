/**
 * Maps free-text `BlogPost.category` to stable badge styling + archive links.
 * Uses semantic tokens / shared badge classes — no random hex per row.
 */

export type BlogTopicBadgeVariant = "success" | "info" | "warning" | "danger" | "brand" | "muted";

type Rule = { test: (s: string) => boolean; variant: BlogTopicBadgeVariant; shortLabel: string };

const RULES: Rule[] = [
  {
    test: (s) => /pathophysiology/i.test(s),
    variant: "info",
    shortLabel: "Pathophysiology",
  },
  {
    test: (s) => /pharmacology|pharm\b/i.test(s),
    variant: "warning",
    shortLabel: "Pharmacology",
  },
  {
    test: (s) => /exam\s*strategy|test\s*taking|nclex\s*strategy/i.test(s),
    variant: "brand",
    shortLabel: "Exam strategy",
  },
  {
    test: (s) => /clinical\s*judgment|clinical\s*reasoning/i.test(s),
    variant: "success",
    shortLabel: "Clinical judgment",
  },
  {
    test: (s) => /study\s*plan/i.test(s),
    variant: "danger",
    shortLabel: "Study plan",
  },
];

export function resolveBlogTopicPresentation(category: string | null | undefined): {
  variant: BlogTopicBadgeVariant;
  /** Title-case label for badge (derived or original category). */
  displayLabel: string;
  /** Archive URL when category is non-empty (exact DB match). */
  categoryArchiveHref: string | null;
} {
  const raw = typeof category === "string" ? category.trim() : "";
  if (!raw) {
    return { variant: "muted", displayLabel: "", categoryArchiveHref: null };
  }
  for (const rule of RULES) {
    if (rule.test(raw)) {
      return {
        variant: rule.variant,
        displayLabel: rule.shortLabel,
        categoryArchiveHref: `/blog/category/${encodeURIComponent(raw)}`,
      };
    }
  }
  return {
    variant: "muted",
    displayLabel: raw,
    categoryArchiveHref: `/blog/category/${encodeURIComponent(raw)}`,
  };
}
