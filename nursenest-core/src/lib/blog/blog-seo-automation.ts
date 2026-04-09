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
  suggestedExcerpt: z.string().min(1).max(500),
  emitFaqSchema: z.boolean(),
  focusKeywords: z.array(z.string().min(1).max(80)).max(12),
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

export function buildPersistedSeoBundle(
  plan: BlogControlPanelPlan,
  slug: string,
  tags: string[],
): BlogSeoBundle {
  const normalizedBreadcrumbs = normalizeBlogBreadcrumbsForStorage(slug, plan.h1, plan.breadcrumbs);
  const fromPlan = plan.seoFocusKeywords?.map((k) => k.trim()).filter(Boolean).slice(0, 8) ?? [];
  const fromTags = tags.map((t) => t.trim()).filter(Boolean).slice(0, 8);
  const focus = fromPlan.length ? fromPlan : fromTags.length ? fromTags : [plan.metaTitle.trim().slice(0, 80)];

  return {
    version: BLOG_SEO_BUNDLE_VERSION,
    normalizedBreadcrumbs,
    canonicalPath: sanitizeCanonicalPath(slug, plan.canonicalPath ?? null),
    openGraphTitle: plan.openGraphTitle?.trim() ? plan.openGraphTitle.trim().slice(0, 120) : null,
    openGraphDescription: plan.openGraphDescription?.trim()
      ? plan.openGraphDescription.trim().slice(0, 320)
      : null,
    suggestedExcerpt: plan.suggestedExcerpt.trim().slice(0, 500),
    emitFaqSchema: plan.faqs.length >= 2,
    focusKeywords: focus.filter(Boolean).slice(0, 12),
    heroImageAlt: plan.imagePlacements[0]?.altIdea?.trim().slice(0, 240) ?? null,
    imageAlts: plan.imagePlacements.map((p, i) => ({
      slotKey: (p.slotKey ?? defaultSlotKey(i)).slice(0, 48),
      alt: p.altIdea.trim().slice(0, 240),
    })),
  };
}

/** `schemaSummary` JSON for legacy readers + sitemap-style hints. */
export function buildSchemaSummaryPayload(seo: BlogSeoBundle): string {
  return JSON.stringify({
    version: 2,
    type: "BlogPosting",
    breadcrumbs: seo.normalizedBreadcrumbs,
    canonicalPath: seo.canonicalPath,
    emitFaqSchema: seo.emitFaqSchema,
    focusKeywords: seo.focusKeywords,
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
