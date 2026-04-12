/**
 * Internal linking rules for localized blog articles.
 *
 * Enforces that localized blog articles link ONLY to destinations within their
 * own route family (locale/region/profession/exam). Prevents cross-region and
 * cross-profession content leakage.
 */

import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { REGION_CONFIG } from "@/lib/i18n/global-regions";
import type { LocalizedInternalLink } from "./blog-localization-types";

// ── Allowed link targets ─────────────────────────────────────────────────────

export type LocalizedLinkFamily = {
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  profession: string;
  exam: string;
};

export type AllowedLinkTarget = {
  label: string;
  href: string;
  type: "lessons_hub" | "question_bank" | "practice_exams" | "pricing" | "signup" | "blog_index" | "blog_article";
};

/**
 * Build the set of allowed internal link targets for a localized blog article.
 * The AI receives this as structured data, not ad-hoc instructions.
 */
export function buildAllowedLinkTargets(family: LocalizedLinkFamily): AllowedLinkTarget[] {
  const base = `/${family.locale}/${family.region}/${family.profession}/${family.exam}`;
  const regionConfig = REGION_CONFIG[family.region];
  const regionName = regionConfig?.displayName ?? family.region;
  const examLabel = family.exam.toUpperCase();

  return [
    { label: `${examLabel} Lessons — ${regionName}`, href: `${base}/lessons`, type: "lessons_hub" },
    { label: `${examLabel} Question Bank — ${regionName}`, href: `${base}/questions`, type: "question_bank" },
    { label: `${examLabel} Practice Exams — ${regionName}`, href: `${base}/practice`, type: "practice_exams" },
    { label: `${regionName} Pricing`, href: `/${family.locale}/${family.region}/pricing`, type: "pricing" },
    { label: "Sign Up", href: "/signup", type: "signup" },
    { label: `${examLabel} Blog — ${regionName}`, href: `${base}/blog`, type: "blog_index" },
  ];
}

/**
 * Validate that a set of internal links stays within the allowed route family.
 * Returns links that violate the isolation rules.
 */
export function validateInternalLinks(
  links: LocalizedInternalLink[],
  family: LocalizedLinkFamily,
): { valid: LocalizedInternalLink[]; violations: { link: LocalizedInternalLink; reason: string }[] } {
  const familyPrefix = `/${family.locale}/${family.region}/`;
  const valid: LocalizedInternalLink[] = [];
  const violations: { link: LocalizedInternalLink; reason: string }[] = [];

  for (const link of links) {
    const href = link.href;

    // Allow absolute external links (unlikely but possible)
    if (href.startsWith("http://") || href.startsWith("https://")) {
      valid.push(link);
      continue;
    }

    // Allow /signup, /pricing (global pages)
    if (href === "/signup" || href === "/pricing" || href === "/login") {
      valid.push(link);
      continue;
    }

    // Must start with the family prefix
    if (href.startsWith(familyPrefix)) {
      valid.push(link);
      continue;
    }

    // Check for cross-region leakage
    if (href.startsWith("/en/") || href.startsWith("/fr/") || href.startsWith("/es/") || href.startsWith("/tl/") || href.startsWith("/hi/")) {
      violations.push({
        link,
        reason: `Cross-region link detected: ${href} does not match family prefix ${familyPrefix}`,
      });
      continue;
    }

    // Legacy /blog/ links are allowed (they point to canonical blog)
    if (href.startsWith("/blog/")) {
      valid.push(link);
      continue;
    }

    // Legacy US/CA marketing routes — flag but don't block
    if (href.startsWith("/us/") || href.startsWith("/canada/")) {
      violations.push({
        link,
        reason: `Legacy US/CA route detected: ${href}. Consider using localized route instead.`,
      });
      continue;
    }

    // Everything else passes through (relative links, anchors, etc.)
    valid.push(link);
  }

  return { valid, violations };
}

/**
 * Format allowed link targets as a structured prompt section for the AI.
 * The AI should only use these targets for internal links.
 */
export function formatAllowedLinksForPrompt(family: LocalizedLinkFamily): string {
  const targets = buildAllowedLinkTargets(family);
  const lines = targets.map((t) => `- ${t.label}: ${t.href} (${t.type})`);
  return [
    "## Allowed Internal Link Targets",
    "You MUST only link to destinations within this route family. Do NOT invent links.",
    "",
    ...lines,
    "",
    `Region: ${family.region} | Locale: ${family.locale} | Profession: ${family.profession} | Exam: ${family.exam}`,
  ].join("\n");
}
