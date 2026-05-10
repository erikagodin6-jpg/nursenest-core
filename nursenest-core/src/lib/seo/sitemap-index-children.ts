import { normalizeOrigin } from "@/lib/seo/sitemap-static-xml";
import { buildSitemapIndexXml } from "@/lib/seo/sitemap-urlset-build";

/**
 * Child urlsets referenced from `/sitemap.xml` (sitemap index). Order is stable for ETag + tests.
 * Robots.txt lists only the index URL (engines follow child `loc`s).
 */
export const SITEMAP_INDEX_CHILD_FILENAMES = [
  "sitemap-core.xml",
  "sitemap-blog.xml",
  "sitemap-lessons.xml",
  "sitemap-allied.xml",
  "sitemap-new-grad.xml",
] as const;

export function absoluteUrlsForSitemapIndexChildren(origin: string): string[] {
  const o = normalizeOrigin(origin);
  return SITEMAP_INDEX_CHILD_FILENAMES.map((name) => `${o}/${name}`);
}

export function buildSitemapIndexXmlForOrigin(origin: string): string {
  return buildSitemapIndexXml(absoluteUrlsForSitemapIndexChildren(origin));
}

/** Legacy minimal static paths when DB-backed collectors throw (never 503). Split for index segmentation. */
export const SITEMAP_FALLBACK_PATHS_ALL = [
  "/",
  "/pricing",
  "/blog",
  "/about",
  "/question-bank",
  "/practice-exams",
  "/lessons",
  "/us/rn/nclex-rn",
  "/us/rn/nclex-rn/lessons",
  "/us/pn/nclex-pn",
  "/us/pn/nclex-pn/lessons",
  "/us/np/fnp",
  "/us/np/fnp/lessons",
  "/canada/rn/nclex-rn",
  "/canada/rn/nclex-rn/lessons",
  "/canada/pn/rex-pn",
  "/canada/pn/rex-pn/lessons",
  "/canada/np/cnple",
  "/canada/np/cnple/lessons",
] as const;

/** Core segment fallback: no `/blog` (owned by blog urlset) and no pathway-lesson `/…/lessons` URLs (owned by lessons urlset). */
export const SITEMAP_FALLBACK_CORE_PATHS = SITEMAP_FALLBACK_PATHS_ALL.filter((p) => {
  if (p === "/blog") return false;
  if (p === "/lessons") return false;
  if (p.endsWith("/lessons") && p !== "/lessons") return false;
  return true;
}) as readonly string[];

/** Lessons segment fallback when {@link collectPathwayLessonSeoUrls} fails — minimal pathway-lesson discovery slice. */
export const SITEMAP_FALLBACK_LESSONS_PATHS = SITEMAP_FALLBACK_PATHS_ALL.filter((p) => {
  if (p === "/lessons") return true;
  if (p.endsWith("/lessons") && p !== "/lessons") return true;
  return false;
}) as readonly string[];
