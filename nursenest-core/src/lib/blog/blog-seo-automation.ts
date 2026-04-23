/**
 * SEO automation for AI blog drafts: normalized breadcrumbs, canonical/OG hints,
 * excerpt, FAQ/schema flags — persisted under `internalLinkPlan.seo`.
 */

import { z } from "zod";
import type { BreadcrumbCrumb, BreadcrumbSchemaItem } from "@/lib/seo/breadcrumb-types";
import { blogPostBreadcrumbsWithOptionalCategory } from "@/lib/seo/pathway-breadcrumbs";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import { isAllowedBlogInternalHref } from "@/lib/blog/blog-internal-lesson-links";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const BLOG_SEO_BUNDLE_VERSION = 1 as const;

const breadcrumbRowSchema = z.object({
  label: z.string().min(1).max(80),
  href: z.string().min(1).max(500),
});

export const blogSeoBundleSchema = z.object({
  version: z.literal(BLOG_SEO_BUNDLE_VERSION),
  normalizedBreadcrumbs: z.array(breadcrumbRowSchema).max(12),
  /** When null/omit, marketing uses default `/blog/{slug}`. */
  canonicalPath: z.string().max(220).nullable().optional(),
  openGraphTitle: z.string().max(120).nullable().optional(),
  openGraphDescription: z.string().max(320).nullable().optional(),
  /** Absolute https URL for og:image / twitter:image when cover art is not yet attached. */
  openGraphImageUrl: z.string().max(2000).nullable().optional(),
  twitterTitle: z.string().max(120).nullable().optional(),
  twitterDescription: z.string().max(320).nullable().optional(),
  suggestedExcerpt: z.string().min(1).max(500),
  emitFaqSchema: z.boolean(),
  focusKeywords: z.array(z.string().min(1).max(80)).max(12),
  /** Primary SERP / editorial keyword phrase (persisted for audits and admin QA). */
  primaryKeyword: z.string().max(160).nullable().optional(),
  /** Supporting phrases (normalized, deduped at persist time). */
  secondaryKeywords: z.array(z.string().min(1).max(80)).max(10).optional(),
  heroImageAlt: z.string().max(240).nullable().optional(),
  imageAlts: z
    .array(
      z.object({
        slotKey: z.string().max(48),
        alt: z.string().max(240),
      }),
    )
    .max(10),
});

export type BlogSeoBundle = z.infer<typeof blogSeoBundleSchema>;

export function parseBlogSeoBundle(raw: unknown): BlogSeoBundle | null {
  if (raw === null || raw === undefined) return null;
  const p = blogSeoBundleSchema.safeParse(raw);
  return p.success ? p.data : null;
}

function defaultSlotKey(i: number): string {
  return i === 0 ? "hero" : `inline_${i}`;
}

/** Only allow canonical override that matches this post (prevents arbitrary URL injection). */
export function sanitizeCanonicalPath(slug: string, raw: string | null | undefined): string | null {
  const c = raw?.trim();
  if (!c) return null;
  const norm = c.replace(/\/+$/, "") || "/";
  const expected = `/blog/${slug}`;
  if (norm === expected) return expected;
  return null;
}

/**
 * Ensures Home → Blog → … → article with safe internal hrefs; fixes article title + path.
 */
/** Exported for {@link blog-seo-package} and other callers that assemble bundles without a full control-panel plan. */
export function normalizeBlogBreadcrumbsForStorage(
  slug: string,
  pageTitle: string,
  rows: { label: string; href: string }[],
): { label: string; href: string }[] {
  const postPath = `/blog/${slug}`;
  const safeTitle = pageTitle.trim().replace(/\s+/g, " ").slice(0, 200) || "Article";

  const filtered = rows
    .map((r) => ({
      label: r.label.trim().replace(/\s+/g, " ").slice(0, 80),
      href: (r.href.trim().split("?")[0] ?? "").split("#")[0] ?? "",
    }))
    .filter((r) => r.label.length > 0);

  const lastHrefOk = (h: string) => h === postPath || h === "";
  const middleHrefOk = (h: string, isLast: boolean) => {
    if (isLast) return lastHrefOk(h);
    if (h === "/" || h === "/blog") return true;
    return isAllowedBlogInternalHref(h);
  };

  const isSafeTrail =
    filtered.length >= 3 &&
    filtered[0].href === "/" &&
    filtered[1].href === "/blog" &&
    filtered.every((r, i) => middleHrefOk(r.href, i === filtered.length - 1));

  if (!isSafeTrail) {
    return [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: safeTitle.slice(0, 80), href: postPath },
    ];
  }

  return [...filtered.slice(0, -1), { label: safeTitle.slice(0, 80), href: postPath }];
}

/**
 * Minimal valid SEO bundle when {@link buildPersistedSeoBundle} throws (malformed plan fields, etc.).
 * Keeps blog draft persistence from failing on secondary SEO assembly.
 */
export function buildMinimalSeoBundleFallback(plan: BlogControlPanelPlan, slug: string, tags: string[]): BlogSeoBundle {
  const pageTitle = (plan.h1?.trim() || plan.titleOptions?.[0]?.trim() || "Article").slice(0, 200) || "Article";
  const excerpt =
    plan.suggestedExcerpt?.trim()?.slice(0, 500) ||
    plan.metaDescription?.trim()?.slice(0, 500) ||
    `${pageTitle.slice(0, 200)}.`;
  const safeExcerpt = excerpt.trim().length >= 1 ? excerpt.trim().slice(0, 500) : "Draft article excerpt.";
  const fromTags = tags.map((t) => t.trim()).filter(Boolean).slice(0, 12);
  const mt = plan.metaTitle?.trim() ? plan.metaTitle.trim().slice(0, 80) : pageTitle.slice(0, 80);
  const focus = (fromTags.length ? fromTags : [mt]).filter(Boolean).slice(0, 12);
  return {
    version: BLOG_SEO_BUNDLE_VERSION,
    normalizedBreadcrumbs: normalizeBlogBreadcrumbsForStorage(slug, pageTitle, []),
    canonicalPath: null,
    openGraphTitle: null,
    openGraphDescription: null,
    openGraphImageUrl: null,
    twitterTitle: mt.slice(0, 120),
    twitterDescription: safeExcerpt.slice(0, 320),
    suggestedExcerpt: safeExcerpt,
    emitFaqSchema: false,
    focusKeywords: focus.length ? focus : ["draft"],
    primaryKeyword: mt.slice(0, 160),
    secondaryKeywords: focus.length > 1 ? focus.slice(1, 9) : undefined,
    heroImageAlt: null,
    imageAlts: [],
  };
}

export function buildPersistedSeoBundle(
  plan: BlogControlPanelPlan,
  slug: string,
  tags: string[],
): BlogSeoBundle {
  const normalizedBreadcrumbs = normalizeBlogBreadcrumbsForStorage(slug, plan.h1, plan.breadcrumbs);
  const fromPlan = plan.seoFocusKeywords?.map((k) => k.trim()).filter(Boolean).slice(0, 8) ?? [];
  const fromTags = tags.map((t) => t.trim()).filter(Boolean).slice(0, 8);
  const focus = fromPlan.length ? fromPlan : fromTags.length ? fromTags : [plan.metaTitle.trim().slice(0, 80)];

  const primaryKeywordRaw =
    plan.seoFocusKeywords?.map((k) => k.trim()).find((k) => k.length >= 2) ?? focus[0] ?? plan.metaTitle.trim();
  const primaryKeyword = primaryKeywordRaw.slice(0, 160) || null;
  const secondaryKeywords = focus
    .filter((k) => k && (!primaryKeyword || k.toLowerCase() !== primaryKeyword.toLowerCase()))
    .slice(0, 8);

  const ogTitle = plan.openGraphTitle?.trim() ? plan.openGraphTitle.trim().slice(0, 120) : null;
  const ogDesc = plan.openGraphDescription?.trim() ? plan.openGraphDescription.trim().slice(0, 320) : null;
  const metaTitle = plan.metaTitle.trim().slice(0, 200);
  const metaDesc = plan.metaDescription.trim().slice(0, 500);

  return {
    version: BLOG_SEO_BUNDLE_VERSION,
    normalizedBreadcrumbs,
    canonicalPath: sanitizeCanonicalPath(slug, plan.canonicalPath ?? null),
    openGraphTitle: ogTitle,
    openGraphDescription: ogDesc,
    openGraphImageUrl: null,
    twitterTitle: (ogTitle ?? metaTitle).slice(0, 120),
    twitterDescription: (ogDesc ?? metaDesc).slice(0, 320),
    suggestedExcerpt: plan.suggestedExcerpt.trim().slice(0, 500),
    emitFaqSchema: plan.faqs.length >= 1,
    focusKeywords: focus.filter(Boolean).slice(0, 12),
    primaryKeyword,
    secondaryKeywords: secondaryKeywords.length ? secondaryKeywords : undefined,
    heroImageAlt: plan.imagePlacements[0]?.altIdea?.trim().slice(0, 240) ?? null,
    imageAlts: plan.imagePlacements.map((p, i) => ({
      slotKey: (p.slotKey ?? defaultSlotKey(i)).slice(0, 48),
      alt: p.altIdea.trim().slice(0, 240),
    })),
  };
}

export type BlogSchemaSummaryExtra = {
  /** Editorial suggestions — implementation may emit JSON-LD after validation. */
  schemaOpportunities?: Array<{ type: string; rationale: string }>;
};

/** `schemaSummary` JSON for legacy readers + sitemap-style hints (version bumps when fields added). */
export function buildSchemaSummaryPayload(seo: BlogSeoBundle, extra?: BlogSchemaSummaryExtra): string {
  return JSON.stringify({
    version: 4,
    type: "BlogPosting",
    breadcrumbs: seo.normalizedBreadcrumbs,
    canonicalPath: seo.canonicalPath,
    emitFaqSchema: seo.emitFaqSchema,
    focusKeywords: seo.focusKeywords,
    primaryKeyword: seo.primaryKeyword ?? null,
    secondaryKeywords: seo.secondaryKeywords ?? [],
    openGraphImageUrl: seo.openGraphImageUrl ?? null,
    twitterTitle: seo.twitterTitle ?? null,
    twitterDescription: seo.twitterDescription ?? null,
    ...(extra?.schemaOpportunities?.length ? { schemaOpportunities: extra.schemaOpportunities } : {}),
  });
}

export function resolvePublicCanonicalUrl(slug: string, seo: BlogSeoBundle | null): string {
  const path = seo?.canonicalPath && sanitizeCanonicalPath(slug, seo.canonicalPath) ? seo.canonicalPath : `/blog/${slug}`;
  return absoluteUrl(path);
}

export function resolveOpenGraphCopy(
  seo: BlogSeoBundle | null,
  fallbackTitle: string,
  fallbackDescription: string,
): { title: string; description: string } {
  return {
    title: (seo?.openGraphTitle?.trim() || fallbackTitle).slice(0, 120),
    description: (seo?.openGraphDescription?.trim() || fallbackDescription).slice(0, 320),
  };
}

/**
 * Visible crumbs: use stored trail when valid; JSON-LD stays the standard blog post chain
 * (Home → Blog → article) per `blogPostBreadcrumbsWithOptionalCategory` policy.
 */
function isUsableStoredBlogCrumbs(rows: { label: string; href: string }[], slug: string): boolean {
  const postPath = `/blog/${slug}`;
  if (rows.length < 3) return false;
  if (rows[0].href !== "/" || rows[1].href !== "/blog") return false;
  const last = rows[rows.length - 1];
  return Boolean(last && last.href === postPath);
}

export function blogDisplayCrumbsFromSeo(
  seo: BlogSeoBundle | null,
  title: string,
  slug: string,
  category: string | null | undefined,
): BreadcrumbCrumb[] {
  const fallback = blogPostBreadcrumbsWithOptionalCategory(title, slug, category).crumbs;
  const rows = seo?.normalizedBreadcrumbs;
  if (!rows?.length || !isUsableStoredBlogCrumbs(rows, slug)) return fallback;

  const postPath = `/blog/${slug}`;
  return rows.map((row, i, arr) => {
    const isLast = i === arr.length - 1;
    if (isLast) return { name: row.label, href: undefined };
    if (row.href === postPath) return { name: row.label, href: undefined };
    return { name: row.label, href: row.href };
  });
}

export function blogPostSchemaItemsForPublic(
  title: string,
  slug: string,
  category: string | null | undefined,
): BreadcrumbSchemaItem[] {
  return blogPostBreadcrumbsWithOptionalCategory(title, slug, category).schemaItems;
}

export function blogSchemaKeywords(seo: BlogSeoBundle | null, tags: string[]): string[] {
  const a = seo?.focusKeywords?.length ? seo.focusKeywords : tags;
  return [...new Set(a.map((s) => s.trim()).filter(Boolean))].slice(0, 12);
}
