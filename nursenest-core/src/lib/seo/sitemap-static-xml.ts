/**
 * Synchronous sitemap URL lists: no Prisma, no filesystem i18n, no network.
 * Split into index + child sitemaps by route family for GSC reliability.
 */

import { buildExamPathwayPath, getExamPathwayById, listPublicExamPathways } from "@/lib/exam-pathways/exam-product-registry";
import {
  getPathwayLessons,
  listPathwayIdsWithLessons,
  listTopicClusters,
} from "@/lib/lessons/pathway-lesson-loader";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import { CORE_HOSTED_MARKETING_LOCALES } from "@/lib/i18n/marketing-locale-policy";
import { getAllProgrammaticSlugs } from "@/lib/seo/programmatic-registry";
import { getAllToolSlugs } from "@/lib/tools/tool-registry";

const SORTED_LOCALES = [...CORE_HOSTED_MARKETING_LOCALES].sort();

export function resolveSitemapOrigin(): string {
  return resolveCanonicalSiteOrigin();
}

export function normalizeOrigin(origin: string): string {
  return origin.endsWith("/") ? origin.slice(0, -1) : origin;
}

/** Exam hub URLs: /{country}/{role}/{exam} + pricing + questions landing */
export function collectExamPathwayUrls(origin: string): string[] {
  const o = normalizeOrigin(origin);
  const urls: string[] = [];
  for (const p of listPublicExamPathways()) {
    urls.push(`${o}${buildExamPathwayPath(p)}`);
    urls.push(`${o}${buildExamPathwayPath(p, "pricing")}`);
    urls.push(`${o}${buildExamPathwayPath(p, "questions")}`);
  }
  return urls;
}

/** Pathway lesson hubs, topic clusters, and lesson detail pages (JSON catalog). */
export function collectPathwayLessonSeoUrls(origin: string): string[] {
  const o = normalizeOrigin(origin);
  const urls: string[] = [];
  urls.push(`${o}/exam-lessons`);
  for (const pid of listPathwayIdsWithLessons()) {
    const p = getExamPathwayById(pid);
    if (!p || p.status === "hidden") continue;
    urls.push(`${o}${buildExamPathwayPath(p, "lessons")}`);
    for (const t of listTopicClusters(pid)) {
      urls.push(`${o}${buildExamPathwayPath(p, `lessons/topics/${t.topicSlug}`)}`);
    }
    for (const l of getPathwayLessons(pid)) {
      urls.push(`${o}${buildExamPathwayPath(p, `lessons/${l.slug}`)}`);
    }
  }
  return urls;
}

/** Child sitemap `<loc>` entries (stable order for deterministic index). */
export function getChildSitemapLocs(origin: string): string[] {
  const o = normalizeOrigin(origin);
  const children: string[] = [
    `${o}/sitemaps/core.xml`,
    `${o}/sitemaps/seo-pages.xml`,
    `${o}/sitemaps/blog.xml`,
    `${o}/sitemaps/tools.xml`,
  ];
  for (const code of SORTED_LOCALES) {
    children.push(`${o}/sitemaps/locale-${code}.xml`);
  }
  return children;
}

function safeLastmodDate(): string {
  try {
    return new Date().toISOString().slice(0, 10);
  } catch {
    return "1970-01-01";
  }
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Public: reusable urlset builder from absolute URLs (used by blog sitemap). */
export function buildSitemapUrlsetFromAbsoluteUrls(urls: string[]): string {
  if (urls.length === 0) return minimalUrlsetSingleHome();
  const lastmod = safeLastmodDate();
  const body = urls
    .map((u) => {
      const loc = escapeXml(u);
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

/** Sitemap index document. */
export function buildSitemapIndexXml(): string {
  const origin = normalizeOrigin(resolveSitemapOrigin());
  const lastmod = safeLastmodDate();
  const locs = getChildSitemapLocs(origin);
  const body = locs
    .map((loc) => {
      const escaped = escapeXml(loc);
      return `  <sitemap>
    <loc>${escaped}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`;
}

/**
 * core.xml — Default-locale marketing shell only (no locale prefix, no programmatic slugs).
 */
export function collectCoreUrls(origin: string): string[] {
  const o = normalizeOrigin(origin);
  const add = (path: string) => {
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${o}${p}`;
  };
  const base = [
    add("/"),
    add("/pricing"),
    add("/for-institutions"),
    add("/blog"),
    add("/faq"),
    add("/tools"),
    add("/pre-nursing"),
    add("/case-studies"),
  ];
  return [...base, ...collectExamPathwayUrls(o), ...collectPathwayLessonSeoUrls(o)];
}

/** seo-pages.xml — English canonical programmatic URLs at `/{slug}` (rewritten to /seo/[slug] internally). */
export function collectSeoPagesUrls(origin: string): string[] {
  const o = normalizeOrigin(origin);
  return getAllProgrammaticSlugs().map((slug) => `${o}/${slug}`);
}

/**
 * Per-locale marketing + programmatic (tools live in tools.xml).
 * `locale` must be a non-default hosted locale code (e.g. fr, es).
 */
export function collectLocaleMarketingUrls(origin: string, locale: string): string[] {
  const o = normalizeOrigin(origin);
  const add = (path: string) => {
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${o}${p}`;
  };
  const urls: string[] = [];
  urls.push(add(`/${locale}`));
  urls.push(add(`/${locale}/pricing`));
  urls.push(add(`/${locale}/for-institutions`));
  for (const slug of getAllProgrammaticSlugs()) {
    urls.push(add(`/${locale}/${slug}`));
  }
  return urls;
}

export function collectToolsUrls(origin: string): string[] {
  const o = normalizeOrigin(origin);
  const add = (path: string) => {
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${o}${p}`;
  };
  const urls: string[] = [];
  urls.push(add("/tools"));
  for (const slug of getAllToolSlugs()) {
    urls.push(add(`/tools/${slug}`));
  }
  for (const loc of CORE_HOSTED_MARKETING_LOCALES) {
    urls.push(add(`/${loc}/tools`));
    for (const slug of getAllToolSlugs()) {
      urls.push(add(`/${loc}/tools/${slug}`));
    }
  }
  return urls;
}

export function buildCoreSitemapXml(): string {
  try {
    return buildSitemapUrlsetFromAbsoluteUrls(collectCoreUrls(resolveSitemapOrigin()));
  } catch {
    return minimalUrlsetSingleHome();
  }
}

export function buildSeoPagesSitemapXml(): string {
  try {
    const urls = collectSeoPagesUrls(resolveSitemapOrigin());
    if (urls.length === 0) return minimalUrlsetSingleHome();
    return buildSitemapUrlsetFromAbsoluteUrls(urls);
  } catch {
    return minimalUrlsetSingleHome();
  }
}

export function buildToolsSitemapXml(): string {
  try {
    return buildSitemapUrlsetFromAbsoluteUrls(collectToolsUrls(resolveSitemapOrigin()));
  } catch {
    return minimalUrlsetSingleHome();
  }
}

export function buildLocaleSitemapXml(locale: string): string {
  try {
    return buildSitemapUrlsetFromAbsoluteUrls(collectLocaleMarketingUrls(resolveSitemapOrigin(), locale));
  } catch {
    return minimalUrlsetSingleHome();
  }
}

export function buildSitemapIndexXmlSafe(): string {
  try {
    return buildSitemapIndexXml();
  } catch {
    return minimalSitemapIndexXml();
  }
}

export function minimalUrlsetSingleHome(): string {
  const base = normalizeOrigin(resolveSitemapOrigin());
  const loc = escapeXml(`${base}/`);
  const lastmod = safeLastmodDate();
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>
</urlset>
`;
}

export function minimalSitemapIndexXml(): string {
  const origin = normalizeOrigin(resolveSitemapOrigin());
  const lastmod = safeLastmodDate();
  const loc = escapeXml(`${origin}/sitemaps/core.xml`);
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>
`;
}

/** @deprecated */
export function minimalSitemapXml(): string {
  return minimalUrlsetSingleHome();
}
