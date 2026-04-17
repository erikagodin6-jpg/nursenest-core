/**
 * Mostly synchronous sitemap URL lists (no filesystem i18n, no network).
 * Pathway lesson URLs may query Postgres via the shared loader (DB-first, catalog fallback).
 *
 * **Public surface:** a single merged urlset is served at `/sitemap.xml` (see `sitemap-all-xml.ts`).
 *
 * ## When URL volume forces a split (not urgent until thresholds hit)
 *
 * **Trigger:** Combined URL count in the single urlset approaches **50,000** (search engine limit) or XML generation
 * routinely exceeds **~20–30s** / memory spikes in production.
 *
 * **Mitigations today:** `MAX_PATHWAY_DERIVED_SITEMAP_URLS` caps pathway-derived URLs; blog uses `take` cap.
 *
 * **If splitting becomes necessary:** introduce additional **sitemap index + chunk urlsets** only if required by size
 * or timeouts; keep `/sitemap.xml` as the one crawler entry in `robots.txt` and GSC.
 */
export const SITEMAP_SINGLE_URLSET_SOFT_WARN_URLS = 45_000;

import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import {
  alliedHealthLessonsIndexPath,
  alliedHealthSegmentPath,
  preNursingLessonDetailPath,
  PRE_NURSING_LESSONS_INDEX_PATH,
} from "@/lib/lessons/lesson-routes";
import { PRE_NURSING_MODULE_REGISTRY } from "@/content/pre-nursing/pre-nursing-registry";
import { getPreNursingOverlaySlugsForLocale } from "@/lib/i18n/pre-nursing-content-overlay";
import { PROGRAMMATIC_SLUG_TO_PATHWAY_PATH } from "@/lib/exam-pathways/programmatic-slug-redirects";
import { LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT } from "@/lib/marketing/canonical-pathway-hubs";
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  isPathwayPublishedForPublicSite,
  listPublishedExamPathwaysForPublicSite,
} from "@/lib/navigation/country-exam-launch-readiness";
import { listNpPracticeTestSegmentPaths } from "@/lib/exam-pathways/np-practice-test-segments";
import {
  PATHWAY_LESSON_SITEMAP_BATCH,
  listPathwayIdsWithLessons,
  listPathwayLessonSlugBatch,
  listTopicClusters,
} from "@/lib/lessons/pathway-lesson-loader";
import { PATHWAY_LESSON_SITEMAP_LOCALE } from "@/lib/lessons/pathway-lesson-locale";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { logSeoEmittedUrlBatch } from "@/lib/seo/seo-url-emission-audit";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import { getSitemapIncludedLocales } from "@/lib/i18n/language-readiness";
import {
  getAllProgrammaticSlugs,
  MAX_PROGRAMMATIC_SEO_SITEMAP_SLUGS,
} from "@/lib/seo/programmatic-registry";
import { getAllProgrammaticQuestionTopicSlugs } from "@/lib/seo/programmatic-question-topic-registry";
import { getAllToolSlugs } from "@/lib/tools/tool-registry";
import { collectPathwayTopicProgrammaticPublicPaths } from "@/lib/seo/pathway-topic-programmatic-registry";
import {
  isRegionalMarketingUrlPublished,
  listPublishedExpansionExamMarketingPaths,
} from "@/lib/marketing/published-regional-marketing-urls";
import { getNpPracticeTestLandingCopy } from "@/lib/exam-pathways/np-practice-test-segments";
import { stripForbiddenLocalePrefixedPathwayTopics } from "@/lib/seo/sitemap-locale-prefixed-path-guard";

/** Locales included in merged urlset tooling (full + partial tier); sorted for deterministic URL lists. */
const SORTED_SITEMAP_LOCALES = [...getSitemapIncludedLocales()].sort();

/** Hard cap for pathway lesson + topic URLs in core sitemap (prevents multi‑GB XML / OOM). */
const MAX_PATHWAY_DERIVED_SITEMAP_URLS = 48_000;

/** Programmatic SEO slugs for sitemap URL lists (bounded; logs if registry exceeds cap). */
function getProgrammaticSlugsForSitemap(): string[] {
  const all = getAllProgrammaticSlugs();
  if (all.length <= MAX_PROGRAMMATIC_SEO_SITEMAP_SLUGS) return all;
  safeServerLog("seo", "programmatic_sitemap_slug_cap", {
    total: all.length,
    cap: MAX_PROGRAMMATIC_SEO_SITEMAP_SLUGS,
  });
  return all.slice(0, MAX_PROGRAMMATIC_SEO_SITEMAP_SLUGS);
}

export function resolveSitemapOrigin(): string {
  return resolveCanonicalSiteOrigin();
}

export function normalizeOrigin(origin: string): string {
  return origin.endsWith("/") ? origin.slice(0, -1) : origin;
}

/** NP keyword practice-test hubs (`/us/np/aanp-practice-test`, …) — indexable alongside canonical exam codes. */
export function collectNpPracticeTestHubUrls(origin: string): string[] {
  const o = normalizeOrigin(origin);
  return listNpPracticeTestSegmentPaths()
    .filter(({ countrySlug, roleTrack, segment }) => {
      const copy = getNpPracticeTestLandingCopy(countrySlug, roleTrack, segment);
      if (!copy) return false;
      return isPathwayPublishedForPublicSite(copy.pathwayId);
    })
    .map(({ countrySlug, roleTrack, segment }) => `${o}/${countrySlug}/${roleTrack}/${segment}`);
}

/** Pathway hub long-tail programmatic SEO (`/{country}/{role}/{exam}/{seoSlug}`). */
export function collectPathwayTopicProgrammaticUrls(origin: string): string[] {
  const o = normalizeOrigin(origin);
  return collectPathwayTopicProgrammaticPublicPaths().map((p) => `${o}${p}`);
}

/** Exam hub URLs: /{country}/{role}/{exam} + pricing + questions landing */
export function collectExamPathwayUrls(origin: string): string[] {
  const o = normalizeOrigin(origin);
  const urls: string[] = [];
  for (const p of listPublishedExamPathwaysForPublicSite()) {
    urls.push(`${o}${buildExamPathwayPath(p)}`);
    urls.push(`${o}${buildExamPathwayPath(p, "pricing")}`);
    urls.push(`${o}${buildExamPathwayPath(p, "questions")}`);
  }
  return urls;
}

/** Allied marketing hub + profession guides + lesson index pages (not every paginated query string). */
export function collectAlliedMarketingUrls(origin: string): string[] {
  const o = normalizeOrigin(origin);
  const urls: string[] = [`${o}/allied-health`];
  for (const p of ALLIED_PROFESSIONS) {
    urls.push(`${o}${alliedHealthSegmentPath(p.segment)}`);
    urls.push(`${o}${alliedHealthLessonsIndexPath(p.professionKey)}`);
  }
  return urls;
}

/** Pre-Nursing public hub, lesson index, study planning, and module pages (registry-backed). */
export function collectPreNursingSeoUrls(origin: string): string[] {
  const o = normalizeOrigin(origin);
  const urls = [`${o}/pre-nursing`, `${o}${PRE_NURSING_LESSONS_INDEX_PATH}`, `${o}/pre-nursing/study-plan`];
  for (const m of PRE_NURSING_MODULE_REGISTRY) {
    urls.push(`${o}${preNursingLessonDetailPath(m.slug)}`);
  }
  return urls;
}

/** Pathway lesson hubs, topic clusters, and lesson detail pages (DB-first loader). */
export async function collectPathwayLessonSeoUrls(origin: string): Promise<string[]> {
  const o = normalizeOrigin(origin);
  const urls: string[] = [];
  let pathwayDerived = 0;
  const push = (loc: string): boolean => {
    if (pathwayDerived >= MAX_PATHWAY_DERIVED_SITEMAP_URLS) return false;
    urls.push(loc);
    pathwayDerived += 1;
    return true;
  };

  if (!push(`${o}/lessons`)) {
    safeServerLog("seo", "sitemap_pathway_derived_cap", { cap: MAX_PATHWAY_DERIVED_SITEMAP_URLS, phase: "lessons-index" });
    return urls;
  }

  const pathwayIds = await listPathwayIdsWithLessons();
  for (const pid of pathwayIds) {
    if (!isPathwayPublishedForPublicSite(pid)) continue;
    const p = getExamPathwayById(pid);
    if (!p || p.status === "hidden") continue;
    if (!push(`${o}${buildExamPathwayPath(p, "lessons")}`)) {
      safeServerLog("seo", "sitemap_pathway_derived_cap", { cap: MAX_PATHWAY_DERIVED_SITEMAP_URLS, phase: "pathway-hub" });
      return urls;
    }
    const topics = await listTopicClusters(pid, PATHWAY_LESSON_SITEMAP_LOCALE);
    for (const t of topics) {
      if (!push(`${o}${buildExamPathwayPath(p, `lessons/topics/${t.topicSlug}`)}`)) {
        safeServerLog("seo", "sitemap_pathway_derived_cap", { cap: MAX_PATHWAY_DERIVED_SITEMAP_URLS, phase: "topic" });
        return urls;
      }
    }
    let skip = 0;
    for (;;) {
      const batch = await listPathwayLessonSlugBatch(pid, skip, PATHWAY_LESSON_SITEMAP_BATCH, PATHWAY_LESSON_SITEMAP_LOCALE, {
        restrictToPublicMarketingSurface: true,
      });
      if (batch.length === 0) break;
      for (const l of batch) {
        if (!push(`${o}${buildExamPathwayPath(p, `lessons/${l.slug}`)}`)) {
          safeServerLog("seo", "sitemap_pathway_derived_cap", { cap: MAX_PATHWAY_DERIVED_SITEMAP_URLS, phase: "lesson-detail" });
          return urls;
        }
      }
      skip += batch.length;
      if (batch.length < PATHWAY_LESSON_SITEMAP_BATCH) break;
    }
  }
  logSeoEmittedUrlBatch("sitemap_pathway_lesson_urls", urls);
  return urls;
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

export type SitemapUrlEntry = {
  loc: string;
  lastmod?: string;
};

/** Public: reusable urlset builder from absolute URLs (used by blog sitemap). */
export function buildSitemapUrlsetFromAbsoluteUrls(urls: string[] | SitemapUrlEntry[]): string {
  if (urls.length === 0) return minimalUrlsetSingleHome();
  const defaultLastmod = safeLastmodDate();
  const body = urls
    .map((u) => {
      const locValue = typeof u === "string" ? u : u.loc;
      const entryLastmod = typeof u === "string" ? defaultLastmod : (u.lastmod?.slice(0, 25) || defaultLastmod);
      const loc = escapeXml(locValue);
      const lastmod = escapeXml(entryLastmod);
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

/**
 * Default-locale “core” slice (merged into `/sitemap.xml` via `collectCoreUrls`).
 *
 * Omits auth/account routes (`/login`, `/signup`, …) — they are `noindex` (see
 * `sitemap-marketing-exclusions.ts` and merge-time filtering in `sitemap-all-xml.ts`).
 */
export async function collectCoreUrls(origin: string): Promise<string[]> {
  const o = normalizeOrigin(origin);
  const add = (path: string) => {
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${o}${p}`;
  };
  /** Regional long-tail URLs (not `/exams/…` hubs — those come from {@link listPublishedExpansionExamMarketingPaths}). */
  const regionalTopicPaths = [
    "/india/nursing-exams",
    "/india/aiims-nursing",
    "/india/nursing-registration",
    "/middle-east/prometric-nursing-exam",
    "/middle-east/dha-exam",
    "/middle-east/haad-exam",
    "/middle-east/dataflow-guide",
    "/australia/ahpra-registration",
    "/australia/osce-nursing",
    "/australia/oba-nursing",
    "/australia/nursing-pathway",
    "/china/nursing-exam",
    "/china/work-abroad",
    "/korea/nursing-exam",
    "/japan/nursing-exam",
    "/japan/how-to-become-a-nurse",
    "/japan/work-abroad",
    "/japan/nclex-for-japanese-nurses",
    "/germany/nurse-recognition",
    "/germany/kenntnisprufung",
    "/germany/work-as-a-nurse",
    "/germany/german-language-for-nurses",
    "/france/nurse-registration",
    "/france/how-to-become-a-nurse",
    "/france/work-abroad",
    "/italy/nurse-registration",
    "/italy/how-to-become-a-nurse",
    "/italy/work-abroad",
    "/hungary/nurse-registration",
    "/hungary/how-to-become-a-nurse",
    "/hungary/work-abroad",
    "/portugal/nurse-registration",
    "/portugal/how-to-become-a-nurse",
    "/portugal/work-abroad",
    "/mexico/nurse-registration",
    "/mexico/how-to-become-a-nurse",
    "/mexico/nclex-for-mexican-nurses",
    "/mexico/work-abroad",
  ].filter((p) => isRegionalMarketingUrlPublished(p));

  const base = [
    add("/"),
    add("/about"),
    add("/question-bank"),
    ...getAllProgrammaticQuestionTopicSlugs().map((s) => add(`/questions/${s}`)),
    add("/practice-exams"),
    add("/lessons"),
    add("/pricing"),
    add("/for-institutions"),
    add("/blog"),
    add("/faq"),
    add("/terms"),
    add("/privacy"),
    add("/refund-policy"),
    add("/acceptable-use"),
    add("/disclaimer"),
    add("/editorial-policy"),
    add("/content-review-policy"),
    add("/contact"),
    add("/tools"),
    add("/case-studies"),
    ...listPublishedExpansionExamMarketingPaths().map((p) => add(p)),
    ...regionalTopicPaths.map((p) => add(p)),
  ];
  const lessonUrls = await collectPathwayLessonSeoUrls(o);
  return [
    ...base,
    ...collectExamPathwayUrls(o),
    ...collectNpPracticeTestHubUrls(o),
    ...collectPathwayTopicProgrammaticUrls(o),
    ...collectAlliedMarketingUrls(o),
    ...collectPreNursingSeoUrls(o),
    ...lessonUrls,
  ];
}

/** seo-pages.xml — English canonical programmatic URLs at `/{slug}` (rewritten to /seo/[slug] internally). */
export function collectSeoPagesUrls(origin: string): string[] {
  const o = normalizeOrigin(origin);
  return getProgrammaticSlugsForSitemap()
    .filter((slug) => !(slug in PROGRAMMATIC_SLUG_TO_PATHWAY_PATH))
    .filter((slug) => !LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT.has(slug))
    .map((slug) => `${o}/${slug}`);
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
  urls.push(add(`/${locale}/lessons`));
  urls.push(add(`/${locale}/question-bank`));
  urls.push(add(`/${locale}/practice-exams`));
  urls.push(add(`/${locale}/pre-nursing`));
  // Only include lesson URLs for slugs that have an overlay file for this locale.
  // All 27 registry slugs are valid for English (default route), but localized routes
  // guard with notFound() when no overlay exists — so we must not submit those to search engines.
  const overlaySlugs = getPreNursingOverlaySlugsForLocale(locale);
  for (const mod of PRE_NURSING_MODULE_REGISTRY) {
    if (overlaySlugs.has(mod.slug)) {
      urls.push(add(`/${locale}/pre-nursing/lessons/${mod.slug}`));
    }
  }
  urls.push(add(`/${locale}/for-institutions`));
  urls.push(add(`/${locale}/faq`));
  urls.push(add(`/${locale}/terms`));
  urls.push(add(`/${locale}/privacy`));
  urls.push(add(`/${locale}/refund-policy`));
  urls.push(add(`/${locale}/acceptable-use`));
  urls.push(add(`/${locale}/disclaimer`));
  urls.push(add(`/${locale}/editorial-policy`));
  urls.push(add(`/${locale}/content-review-policy`));
  urls.push(add(`/${locale}/contact`));
  for (const slug of getProgrammaticSlugsForSitemap()) {
    if (slug in PROGRAMMATIC_SLUG_TO_PATHWAY_PATH) continue;
    if (LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT.has(slug)) continue;
    urls.push(add(`/${locale}/${slug}`));
  }
  // Exam-hub long-tail programmatic pages (`/{country}/{role}/{examCode}/{seoSlug}`) live only on the
  // default marketing shell — there is no `/{lang}/…` duplicate route. Prefixing `/${locale}` here
  // produced five-segment URLs like `/fr/us/np/fnp/...` that do not match any page (404 in GSC).
  // Canonical URLs for those pages are already emitted in `collectCoreUrls` via
  // `collectPathwayTopicProgrammaticUrls`.
  const stripped = stripForbiddenLocalePrefixedPathwayTopics(urls, o, locale);
  if (stripped.removed > 0) {
    safeServerLog("seo", "sitemap_locale_strip_prefixed_pathway_topics", {
      locale,
      removed: stripped.removed,
    });
  }
  return stripped.urls;
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
  for (const loc of SORTED_SITEMAP_LOCALES) {
    urls.push(add(`/${loc}/tools`));
    for (const slug of getAllToolSlugs()) {
      urls.push(add(`/${loc}/tools/${slug}`));
    }
  }
  return urls;
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

/** @deprecated */
export function minimalSitemapXml(): string {
  return minimalUrlsetSingleHome();
}
