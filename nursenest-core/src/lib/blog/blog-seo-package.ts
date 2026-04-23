/**
 * Production SEO package helpers: clamp SERP fields, normalize taxonomy tags,
 * derive category labels, and assemble BlogSeoBundle rows for simple AI drafts.
 */

import { BlogPostTemplate, type CountryCode } from "@prisma/client";
import type { BlogSeoBundle } from "@/lib/blog/blog-seo-automation";
import {
  BLOG_SEO_BUNDLE_VERSION,
  normalizeBlogBreadcrumbsForStorage,
  sanitizeCanonicalPath,
} from "@/lib/blog/blog-seo-automation";
import { generateBlogSEOFromPostRow } from "@/lib/blog/blog-generate-seo";

const TEMPLATE_CATEGORY_LABEL: Partial<Record<BlogPostTemplate, string>> = {
  HOW_TO_PASS: "Exam strategy",
  TOPIC_EXPLAINED: "Clinical topics",
  TOP_MISTAKES: "Mistakes to avoid",
  PRACTICE_QUESTIONS: "Practice questions",
  STUDY_PLAN: "Study planning",
  EXAM_GUIDE: "Exam guides",
  MEDICATION_REVIEW: "Pharmacology",
  LAB_VALUES_GUIDE: "Lab values",
  DISEASE_PROCESS_EXPLAINER: "Pathophysiology",
  PRIORITIZATION_ARTICLE: "Prioritization",
  COMPARISON_ARTICLE: "Comparisons",
  CHECKLIST_ARTICLE: "Checklists",
  FAQ_STYLE: "FAQ",
  GLOSSARY: "Glossary",
};

export function clampSerpTitle(raw: string, maxLen = 70): string {
  return raw.replace(/\s+/g, " ").trim().slice(0, maxLen);
}

export function clampSerpDescription(raw: string, minLen = 120, maxLen = 155): string {
  let t = raw.replace(/\s+/g, " ").trim();
  if (t.length > maxLen) {
    const slice = t.slice(0, maxLen - 1);
    const sp = slice.lastIndexOf(" ");
    t = sp > minLen * 0.6 ? slice.slice(0, sp) : slice;
  }
  if (t.length >= minLen) return t;
  const pad = " Practice with rationales and adaptive review in NurseNest.";
  return (t + pad).replace(/\s+/g, " ").trim().slice(0, maxLen);
}

function tagKey(s: string): string {
  return s.trim().toLowerCase();
}

export function normalizeBlogTagsForStorage(primary: string[], extras: string[], max = 12): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (raw: string) => {
    const s = raw.trim();
    if (s.length < 2 || s.length > 64) return;
    const k = tagKey(s);
    if (seen.has(k)) return;
    seen.add(k);
    out.push(s);
  };
  for (const p of primary) push(p);
  for (const e of extras) push(e);
  return out.slice(0, max);
}

export function deriveBlogCategoryForPersist(input: {
  keywordCluster?: string | null;
  template: BlogPostTemplate;
}): string | null {
  const k = input.keywordCluster?.trim();
  if (k && k.length >= 2 && k.length <= 80) return k.slice(0, 80);
  return TEMPLATE_CATEGORY_LABEL[input.template] ?? null;
}

export function buildSeoBundleForSimpleAiDraft(params: {
  slug: string;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  tags: string[];
  primaryKeyword: string;
  emitFaqSchema?: boolean;
}): BlogSeoBundle {
  const focus = normalizeBlogTagsForStorage(params.tags, [params.primaryKeyword]);
  const primary = params.primaryKeyword.trim().slice(0, 160) || focus[0] || params.h1.slice(0, 80);
  const secondary = focus.filter((k) => tagKey(k) !== tagKey(primary)).slice(0, 8);
  const excerpt = params.excerpt.trim().slice(0, 500) || `${params.h1.slice(0, 200)}.`;
  const metaTitle = clampSerpTitle(params.seoTitle, 70);
  const metaDesc = clampSerpDescription(params.seoDescription, 120, 155);

  return {
    version: BLOG_SEO_BUNDLE_VERSION,
    normalizedBreadcrumbs: normalizeBlogBreadcrumbsForStorage(params.slug, params.h1, []),
    canonicalPath: sanitizeCanonicalPath(params.slug, `/blog/${params.slug}`),
    openGraphTitle: metaTitle.slice(0, 120),
    openGraphDescription: metaDesc.slice(0, 200),
    openGraphImageUrl: null,
    twitterTitle: metaTitle.slice(0, 120),
    twitterDescription: metaDesc.slice(0, 200),
    suggestedExcerpt: excerpt,
    emitFaqSchema: Boolean(params.emitFaqSchema),
    focusKeywords: focus.length ? focus : [primary].filter(Boolean),
    primaryKeyword: primary,
    secondaryKeywords: secondary.length ? secondary : undefined,
    heroImageAlt: null,
    imageAlts: [],
  };
}

export function mergeOpenGraphImageIntoSeoBundle(
  bundle: BlogSeoBundle,
  coverImageUrl: string | null | undefined,
): BlogSeoBundle {
  const u = coverImageUrl?.trim();
  if (!u || !/^https:\/\//i.test(u)) return bundle;
  try {
    const parsed = new URL(u);
    if (parsed.protocol !== "https:" || !parsed.hostname.includes(".")) return bundle;
  } catch {
    return bundle;
  }
  return { ...bundle, openGraphImageUrl: u.slice(0, 2000) };
}

export type RebuildSeoBundleFromStoredBlogPostOptions = {
  /**
   * When true, ignore stored `seoTitle` / `seoDescription` and rebuild meta strings from
   * deterministic `generateBlogSEOFromPostRow` output (explicit “regenerate meta” flows).
   */
  ignoreStoredMeta?: boolean;
};

/** Recompute persisted {@link BlogSeoBundle} from current row fields (deterministic; no full article regen). */
export function rebuildSeoBundleFromStoredBlogPost(
  row: {
    slug: string;
    title: string;
    excerpt: string;
    seoTitle: string | null;
    seoDescription: string | null;
    tags: string[];
    category: string | null;
    exam: string | null;
    countryTarget: CountryCode | null;
    coverImage: string | null;
    targetKeyword: string | null;
    faqItemCount: number;
  },
  options?: RebuildSeoBundleFromStoredBlogPostOptions,
): BlogSeoBundle {
  const auto = generateBlogSEOFromPostRow({
    title: row.title,
    slug: row.slug,
    category: row.category,
    tags: row.tags,
    exam: row.exam,
    countryTarget: row.countryTarget,
  });
  const primary = (row.targetKeyword?.trim() || row.title).trim().slice(0, 160);
  const seoTitle = clampSerpTitle(
    options?.ignoreStoredMeta ? auto.seoTitle : row.seoTitle?.trim() || auto.seoTitle,
    70,
  );
  const seoDesc = clampSerpDescription(
    options?.ignoreStoredMeta ? auto.metaDescription : row.seoDescription?.trim() || auto.metaDescription,
    120,
    155,
  );
  const focus = normalizeBlogTagsForStorage(row.tags, [primary]);
  const base = buildSeoBundleForSimpleAiDraft({
    slug: row.slug,
    h1: row.title.slice(0, 220),
    seoTitle,
    seoDescription: seoDesc,
    excerpt: row.excerpt.trim().slice(0, 500) || `${row.title.slice(0, 200)}.`,
    tags: focus,
    primaryKeyword: primary,
    emitFaqSchema: row.faqItemCount >= 1,
  });
  return mergeOpenGraphImageIntoSeoBundle(base, row.coverImage);
}
