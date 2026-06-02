import type { BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import { countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { isLongFormPathophysiologyProfile } from "@/lib/blog/blog-longform-nursing-contract";

/** Minimum words in the HTML slice before the FAQ `<h2>` (long-form pathophysiology only). */
export const LONGFORM_MIN_MAIN_BODY_WORDS_EXCLUDING_FAQ = 900;

/** When an FAQ `<h2>` exists, flag if FAQ section words / total words exceed this ratio. */
export const LONGFORM_FAQ_WORD_SHARE_FLAG_THRESHOLD = 0.38;

/** Flag when fewer than this many `recommendedInternalLinks` rows are detectable in HTML (review; not a silent pass). */
export const LONGFORM_MIN_EMBEDDED_RECOMMENDED_LINKS = 3;

/** Flag when embed count is below this target but the plan lists at least this many rows. */
export const LONGFORM_TARGET_EMBEDDED_RECOMMENDED_LINKS = 5;

export type LongformBodyEnforcementResult = {
  ok: boolean;
  /** Hard failures — pipeline should not persist. */
  errors: string[];
  /** Soft signals — merged into `plan.needsReviewFlags` before persist. */
  flags: string[];
  /** Diagnostics for admin / logs. */
  details: {
    bodyH2Count: number;
    missingOutlineH2s: string[];
    mainBodyWordCountExcludingFaq: number;
    totalBodyWordCount: number;
    faqSectionWordCount: number;
    embeddedRecommendedInternalLinkCount: number;
    recommendedInternalLinkPlanCount: number;
    breadcrumbSanityFlags: string[];
  };
};

/** Strip inner tags; collapse whitespace (matches visible heading text). */
export function stripHeadingInnerHtmlToPlain(inner: string): string {
  return inner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function extractH2PlainTextsFromBodyHtml(html: string): string[] {
  const re = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const plain = stripHeadingInnerHtmlToPlain(m[1] ?? "");
    if (plain.length > 0) out.push(plain);
  }
  return out;
}

export function normalizeHeadingForMatch(s: string): string {
  return stripHeadingInnerHtmlToPlain(s)
    .toLowerCase()
    .replace(/[^a-z0-9\u00C0-\u024F\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Whether a planned outline H2 is represented in the body (allows minor punctuation / casing drift).
 */
export function outlineH2MatchesBodyHeading(planH2: string, bodyH2PlainTexts: string[]): boolean {
  const a = normalizeHeadingForMatch(planH2);
  if (a.length < 2) return false;
  for (const raw of bodyH2PlainTexts) {
    const b = normalizeHeadingForMatch(raw);
    if (b.length < 2) continue;
    if (a === b) return true;
    if (a.length >= 10 && b.length >= 10 && (b.includes(a) || a.includes(b))) return true;
  }
  return false;
}

export function findMissingOutlineH2sInBody(plan: BlogControlPanelPlan, bodyHtml: string): string[] {
  const bodyH2s = extractH2PlainTextsFromBodyHtml(bodyHtml);
  const used = new Set<number>();
  const missing: string[] = [];
  for (const row of plan.outline) {
    let foundIdx = -1;
    for (let i = 0; i < bodyH2s.length; i++) {
      if (used.has(i)) continue;
      if (outlineH2MatchesBodyHeading(row.h2, [bodyH2s[i]!])) {
        foundIdx = i;
        break;
      }
    }
    if (foundIdx < 0) missing.push(row.h2);
    else used.add(foundIdx);
  }
  return missing;
}

export function splitBodyHtmlAtFaqHeading(html: string): { before: string; fromFaq: string } {
  const re = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const plain = stripHeadingInnerHtmlToPlain(m[1] ?? "");
    if (/^(f\.?a\.?q\.?s?|frequently\s+asked\s+questions?)$/i.test(plain)) {
      const idx = m.index ?? 0;
      return { before: html.slice(0, idx), fromFaq: html.slice(idx) };
    }
  }
  return { before: html, fromFaq: "" };
}

/**
 * Non-blocking checks that breadcrumb hrefs resemble known marketing patterns (flags only).
 * First two crumbs are assumed to satisfy plan contract (Home / Blog).
 */
export function collectBreadcrumbPathSanityFlags(
  breadcrumbs: BlogControlPanelPlan["breadcrumbs"] | undefined,
): string[] {
  const flags: string[] = [];
  const crumbs = breadcrumbs ?? [];
  if (crumbs.length < 3) return flags;

  const isArticleCrumb = (idx: number) => idx === crumbs.length - 1;

  const hubOrArticleHrefOk = (href: string, isLast: boolean): boolean => {
    const h = href.trim();
    if (!h.startsWith("/") || h.includes("//") || h.startsWith("/app") || h.startsWith("/api")) return false;
    if (isLast) return h.startsWith("/blog/");
    return (
      h.startsWith("/blog") ||
      h.startsWith("/us/") ||
      h.startsWith("/canada/") ||
      h.startsWith("/uk/") ||
      h === "/questions" ||
      h.startsWith("/questions") ||
      h === "/flashcards" ||
      h.startsWith("/flashcards") ||
      h.startsWith("/practice-exams") ||
      h.startsWith("/study-")
    );
  };

  for (let i = 2; i < crumbs.length; i++) {
    const href = crumbs[i]?.href?.trim() ?? "";
    if (!hubOrArticleHrefOk(href, isArticleCrumb(i))) {
      flags.push("breadcrumb_path_sanity");
      break;
    }
  }
  return [...new Set(flags)];
}

export function countEmbeddedRecommendedInternalLinks(plan: BlogControlPanelPlan, bodyHtml: string): number {
  let n = 0;
  for (const row of plan.recommendedInternalLinks ?? []) {
    const pathRaw = row.suggestedPath.trim().split("?")[0]?.trim() ?? "";
    const anchor = row.anchorText.trim();
    const pathOk = pathRaw.length >= 2 && bodyHtml.includes(pathRaw);
    const anchorOk = anchor.length >= 4 && bodyHtml.includes(anchor);
    if (pathOk || anchorOk) n += 1;
  }
  return n;
}

/**
 * Deterministic post-body checks for long-form pathophysiology profile only.
 * Does not call the model — enforcement for QA / persistence gates.
 */
export function enforceLongFormBodyQuality(params: {
  plan: BlogControlPanelPlan;
  bodyHtml: string;
  template: BlogPostTemplate;
  intent: BlogPostIntent;
}): LongformBodyEnforcementResult {
  const { plan, bodyHtml, template, intent } = params;
  const emptyDetails = (): LongformBodyEnforcementResult["details"] => ({
    bodyH2Count: 0,
    missingOutlineH2s: [],
    mainBodyWordCountExcludingFaq: 0,
    totalBodyWordCount: 0,
    faqSectionWordCount: 0,
    embeddedRecommendedInternalLinkCount: 0,
    recommendedInternalLinkPlanCount: plan.recommendedInternalLinks?.length ?? 0,
    breadcrumbSanityFlags: [],
  });

  if (!isLongFormPathophysiologyProfile({ template, intent })) {
    return { ok: true, errors: [], flags: [], details: emptyDetails() };
  }

  const bodyH2s = extractH2PlainTextsFromBodyHtml(bodyHtml);
  const missingOutlineH2s = findMissingOutlineH2sInBody(plan, bodyHtml);
  const errors: string[] = [];
  const flags: string[] = [];

  if (missingOutlineH2s.length > 0) {
    errors.push(
      `body_outline_mismatch: ${missingOutlineH2s.length} planned H2(s) missing or not matching body <h2> text: ${missingOutlineH2s.map((h) => JSON.stringify(h)).join(", ")}`,
    );
  }

  if (bodyH2s.length < plan.outline.length) {
    errors.push(
      `body_h2_count_low: body has ${bodyH2s.length} <h2> headings but plan outlines ${plan.outline.length} sections (possible collapsed or skipped headings).`,
    );
  }

  const { before, fromFaq } = splitBodyHtmlAtFaqHeading(bodyHtml);
  const mainBodyWordCountExcludingFaq = countWordsFromHtml(before);
  const totalBodyWordCount = countWordsFromHtml(bodyHtml);
  const faqSectionWordCount = fromFaq ? countWordsFromHtml(fromFaq) : 0;

  if (mainBodyWordCountExcludingFaq < LONGFORM_MIN_MAIN_BODY_WORDS_EXCLUDING_FAQ) {
    errors.push(
      `body_main_depth_insufficient: main content (before FAQ <h2> if present) is ${mainBodyWordCountExcludingFaq} words; require at least ${LONGFORM_MIN_MAIN_BODY_WORDS_EXCLUDING_FAQ} for long-form teaching depth.`,
    );
  }

  if (fromFaq && totalBodyWordCount > 0) {
    const share = faqSectionWordCount / totalBodyWordCount;
    if (share > LONGFORM_FAQ_WORD_SHARE_FLAG_THRESHOLD) {
      flags.push("faq_body_word_share_high");
    }
  }

  const recommendedN = plan.recommendedInternalLinks?.length ?? 0;
  const embeddedRecommended = countEmbeddedRecommendedInternalLinks(plan, bodyHtml);

  if (recommendedN > 0 && embeddedRecommended < LONGFORM_MIN_EMBEDDED_RECOMMENDED_LINKS) {
    flags.push("internal_links_not_embedded");
  } else if (
    recommendedN >= LONGFORM_TARGET_EMBEDDED_RECOMMENDED_LINKS &&
    embeddedRecommended < LONGFORM_TARGET_EMBEDDED_RECOMMENDED_LINKS
  ) {
    flags.push("recommended_internal_links_partial_embed");
  }

  const breadcrumbSanityFlags = collectBreadcrumbPathSanityFlags(plan.breadcrumbs);
  for (const f of breadcrumbSanityFlags) {
    if (!flags.includes(f)) flags.push(f);
  }

  const ok = errors.length === 0;
  return {
    ok,
    errors,
    flags,
    details: {
      bodyH2Count: bodyH2s.length,
      missingOutlineH2s,
      mainBodyWordCountExcludingFaq,
      totalBodyWordCount,
      faqSectionWordCount,
      embeddedRecommendedInternalLinkCount: embeddedRecommended,
      recommendedInternalLinkPlanCount: recommendedN,
      breadcrumbSanityFlags,
    },
  };
}

export function mergeUniqueNeedsReviewFlags(plan: BlogControlPanelPlan, flags: string[]): BlogControlPanelPlan {
  const merged = [...new Set([...(plan.needsReviewFlags ?? []), ...flags.map((f) => f.trim()).filter(Boolean)])].slice(
    0,
    24,
  );
  return { ...plan, needsReviewFlags: merged };
}
