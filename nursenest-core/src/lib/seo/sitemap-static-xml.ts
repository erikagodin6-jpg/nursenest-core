/**
 * Mostly synchronous sitemap URL lists (no filesystem i18n, no network).
 * Pathway lesson URLs may query Postgres via the shared loader (DB-first, catalog fallback).
 *
 * **Public surface:** `/sitemap.xml` is served by `src/app/sitemap.xml/route.ts` (static url list + canonical origin).
 *
 * ## When URL volume forces a split (not urgent until thresholds hit)
 *
 * **Trigger:** Combined URL count in the single urlset approaches **50,000** (search engine limit) or XML generation
 * routinely exceeds **~20–30s** / memory spikes in production.
 *
 * **Mitigations today:** `MAX_PATHWAY_DERIVED_SITEMAP_URLS` caps pathway-derived URLs; blog uses `take` cap.
 *
 * **If splitting becomes necessary:** introduce additional **sitemap index + chunk urlsets** only if required by size
 * or timeouts; `robots.txt` lists the merged `/sitemap.xml` plus focused urlsets (e.g. allied, new grad) on the same origin.
 */
export const SITEMAP_SINGLE_URLSET_SOFT_WARN_URLS = 45_000;

import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import { alliedHealthSegmentPath, preNursingLessonDetailPath, PRE_NURSING_LESSONS_INDEX_PATH } from "@/lib/lessons/lesson-routes";
import { PRE_NURSING_MODULE_REGISTRY } from "@/content/pre-nursing/pre-nursing-registry";
import { getPreNursingOverlaySlugsForLocale } from "@/lib/i18n/pre-nursing-content-overlay";
import { PROGRAMMATIC_SLUG_TO_PATHWAY_PATH } from "@/lib/exam-pathways/programmatic-slug-redirects";
import { LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT } from "@/lib/marketing/canonical-pathway-hubs";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { listNpPracticeTestSegmentPaths } from "@/lib/exam-pathways/np-practice-test-segments";
import { PATHWAY_LESSON_SITEMAP_LOCALE } from "@/lib/lessons/pathway-lesson-locale";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { logSeoEmittedUrlBatch } from "@/lib/seo/seo-url-emission-audit";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import { shouldSkipDbBackedSitemapUrlsForBuild } from "@/lib/seo/sitemap-build-skip";
import { getSitemapIncludedLocales } from "@/lib/i18n/language-readiness";
import { MAX_PROGRAMMATIC_SEO_SITEMAP_SLUGS } from "@/lib/seo/programmatic-registry-constants";
import { getAllProgrammaticSlugs } from "@/lib/seo/programmatic-registry-slugs";
import { getAllProgrammaticQuestionTopicSlugs } from "@/lib/seo/programmatic-question-topic-registry-slugs";
import { getAllToolSlugs } from "@/lib/tools/tool-registry";
import {
  isRegionalMarketingUrlPublished,
  listPublishedExpansionExamMarketingPaths,
} from "@/lib/marketing/published-regional-marketing-urls";
import { getNpPracticeTestLandingCopy } from "@/lib/exam-pathways/np-practice-test-segments";
import { stripForbiddenLocalePrefixedPathwayTopics } from "@/lib/seo/sitemap-locale-prefixed-path-guard";
import { shouldReduceNonCriticalBuildWork } from "@/lib/build/build-safe-mode";
import { listPublishedExamPathwaysForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";
import { collectOsceScenariosMarketingHubUrls } from "@/lib/scenarios/scenario-marketing-sitemap-urls";
import { collectPathwayTopicProgrammaticPublicPaths } from "@/lib/seo/pathway-topic-programmatic-registry";
export {
  buildSitemapUrlsetFromAbsoluteUrls,
  minimalUrlsetSingleHome,
  minimalSitemapXml,
  type SitemapUrlEntry,
} from "@/lib/seo/sitemap-urlset-build";

/** Locales included in merged urlset tooling (tier=full only); sorted for deterministic URL lists. */
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
export async function collectNpPracticeTestHubUrls(origin: string): Promise<string[]> {
  const o = normalizeOrigin(origin);
  const { isPathwayPublishedForPublicSite } = await import("@/lib/navigation/country-exam-launch-readiness");
  return listNpPracticeTestSegmentPaths()
    .filter(({ countrySlug, roleTrack, segment }) => {
      const copy = getNpPracticeTestLandingCopy(countrySlug, roleTrack, segment);
      if (!copy) return false;
      return isPathwayPublishedForPublicSite(copy.pathwayId);
    })
    .map(({ countrySlug, roleTrack, segment }) => `${o}/${countrySlug}/${roleTrack}/${segment}`);
}

/** Pathway hub long-tail programmatic SEO (`/{country}/{role}/{exam}/{seoSlug}`). */
export async function collectPathwayTopicProgrammaticUrls(origin: string): Promise<string[]> {
  const o = normalizeOrigin(origin);
  const { collectPathwayTopicProgrammaticPublicPaths } = await import("@/lib/seo/pathway-topic-programmatic-registry");
  return collectPathwayTopicProgrammaticPublicPaths().map((p) => `${o}${p}`);
}

/**
 * Data-backed body-system study hubs (`…/study-resources/{bodyKey}`) — only URLs that pass lesson + bank + intro gates.
 * Bounded by {@link MAX_CONTENT_BACKED_STUDY_RESOURCE_SITEMAP_URLS} inside the loader module.
 */
export async function collectContentBackedStudyResourceHubUrls(origin: string): Promise<string[]> {
  const o = normalizeOrigin(origin);
  if (shouldSkipDbBackedSitemapUrlsForBuild()) return [];
  const { listPublishedExamPathwaysForPublicSite } = await import("@/lib/navigation/country-exam-launch-readiness");
  const { listContentBackedStudyResourceHubSitemapRows, MAX_CONTENT_BACKED_STUDY_RESOURCE_SITEMAP_URLS } = await import(
    "@/lib/seo/content-backed-study-resource-hub"
  );
  const urls: string[] = [];
  for (const pathway of listPublishedExamPathwaysForPublicSite()) {
    const rows = await listContentBackedStudyResourceHubSitemapRows(pathway);
    for (const r of rows) {
      if (urls.length >= MAX_CONTENT_BACKED_STUDY_RESOURCE_SITEMAP_URLS) {
        logSeoEmittedUrlBatch("sitemap_content_backed_study_resources", urls);
        return urls;
      }
      urls.push(`${o}${buildExamPathwayPath(r.pathway, `study-resources/${r.bodyKey}`)}`);
    }
  }
  logSeoEmittedUrlBatch("sitemap_content_backed_study_resources", urls);
  return urls;
}

/**
 * Programmatic study SEO pages (`…/study/{lessonSlug}`) — registry + same loader gates as the live route.
 */
export async function collectProgrammaticStudySeoUrls(origin: string): Promise<string[]> {
  const o = normalizeOrigin(origin);
  if (shouldSkipDbBackedSitemapUrlsForBuild()) return [];
  const { getProgrammaticStudySeoRegistry, MAX_PROGRAMMATIC_STUDY_SEO_SITEMAP_URLS } = await import(
    "@/lib/seo/programmatic-study-seo-registry"
  );
  const { getExamPathwayById } = await import("@/lib/exam-pathways/exam-product-registry");
  const { isProgrammaticStudySeoUrlEligibleForSitemap } = await import("@/lib/seo/programmatic-study-seo-load");
  const { marketingProgrammaticStudySeoPath } = await import("@/lib/lessons/lesson-routes");
  const { isPathwayPublishedForPublicSite } = await import("@/lib/navigation/country-exam-launch-readiness");
  const urls: string[] = [];
  const seen = new Set<string>();
  for (const row of getProgrammaticStudySeoRegistry()) {
    if (urls.length >= MAX_PROGRAMMATIC_STUDY_SEO_SITEMAP_URLS) break;
    const pathway = getExamPathwayById(row.pathwayId);
    if (!pathway || !isPathwayPublishedForPublicSite(pathway.id)) continue;
    const path = marketingProgrammaticStudySeoPath(pathway, row.lessonSlug);
    if (!path) continue;
    const dedupe = `${row.pathwayId}::${row.lessonSlug}`;
    if (seen.has(dedupe)) continue;
    seen.add(dedupe);
    const ok = await isProgrammaticStudySeoUrlEligibleForSitemap(pathway, row.lessonSlug);
    if (!ok) continue;
    urls.push(`${o}${path}`);
  }
  logSeoEmittedUrlBatch("sitemap_programmatic_study_seo", urls);
  return urls;
}

/** Exam hub URLs: /{country}/{role}/{exam} + pricing + questions landing */
export async function collectExamPathwayUrls(origin: string): Promise<string[]> {
  const o = normalizeOrigin(origin);
  const { listPublishedExamPathwaysForPublicSite } = await import("@/lib/navigation/country-exam-launch-readiness");
  const urls: string[] = [];
  for (const p of listPublishedExamPathwaysForPublicSite()) {
    urls.push(`${o}${buildExamPathwayPath(p)}`);
    urls.push(`${o}${buildExamPathwayPath(p, "pricing")}`);
    urls.push(`${o}${buildExamPathwayPath(p, "questions")}`);
  }
  return urls;
}

/**
 * Allied marketing hub + per-occupation hero segments (`/allied-health/{segment}-exam-prep`).
 * Pathway lesson indexes use `?alliedProfession=` and are intentionally omitted here — they fail
 * {@link isValidPublicUrl} (`has_query_or_hash`) and never survived `/sitemap.xml` filtering anyway.
 */
export function collectAlliedMarketingUrls(origin: string): string[] {
  const o = normalizeOrigin(origin);
  const urls: string[] = [`${o}/allied-health`];
  for (const p of ALLIED_PROFESSIONS) {
    urls.push(`${o}${alliedHealthSegmentPath(p.segment)}`);
  }
  return urls;
}

/**
 * Root-relative public New Grad marketing URLs (`/new-grad`, `/new-grad/{unit}`).
 * Single source for `/sitemap-new-grad.xml` — no `/app`, no query/hash, no learner shell paths.
 */
export const NEW_GRAD_MARKETING_SITEMAP_PATHS = [
  "/new-grad",
  "/new-grad/icu",
  "/new-grad/med-surg",
  "/new-grad/emergency",
  "/new-grad/pediatrics",
  "/new-grad/picu",
  "/new-grad/cardiac-icu",
  "/new-grad/neuro-icu",
  "/new-grad/trauma",
  "/new-grad/surgery",
  "/new-grad/renal-dialysis",
  "/new-grad/long-term-care",
  "/new-grad/community-health",
  "/new-grad/hem-onc",
  "/new-grad/clinics",
] as const;

/** New Grad marketing hub + unit landing paths for the dedicated sitemap only. */
export function collectNewGradMarketingUrls(origin: string): string[] {
  const o = normalizeOrigin(origin);
  return NEW_GRAD_MARKETING_SITEMAP_PATHS.map((p) => `${o}${p}`);
}

/**
 * Pathway lesson **hub/index** URLs only (launch snapshot; no Postgres, no per-lesson detail URLs).
 */
export function collectPathwayLessonHubUrlsOnly(origin: string): string[] {
  const o = normalizeOrigin(origin);
  const urls: string[] = [`${o}/lessons`];
  for (const p of listPublishedExamPathwaysForPublicSite()) {
    urls.push(`${o}${buildExamPathwayPath(p, "lessons")}`);
  }
  return urls;
}

/** Pre-nursing hub + lesson index + study plan (no per-module lesson detail URLs). */
export function collectPreNursingSitemapHubUrlsOnly(origin: string): string[] {
  const o = normalizeOrigin(origin);
  return [`${o}/pre-nursing`, `${o}${PRE_NURSING_LESSONS_INDEX_PATH}`, `${o}/pre-nursing/study-plan`];
}

/**
 * Locale marketing URLs for sitemap without DB: no localized pre-nursing lesson slugs, no `/{locale}/{programmatic}` fan-out.
 */
export function collectLocaleMarketingSitemapSafeUrls(origin: string, locale: string): string[] {
  const o = normalizeOrigin(origin);
  const add = (path: string) => {
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${o}${p}`;
  };
  const urls: string[] = [
    add(`/${locale}`),
    add(`/${locale}/pricing`),
    add(`/${locale}/lessons`),
    add(`/${locale}/question-bank`),
    add(`/${locale}/practice-exams`),
    add(`/${locale}/pre-nursing`),
    add(`/${locale}/for-institutions`),
    add(`/${locale}/faq`),
    add(`/${locale}/terms`),
    add(`/${locale}/privacy`),
    add(`/${locale}/refund-policy`),
    add(`/${locale}/acceptable-use`),
    add(`/${locale}/disclaimer`),
    add(`/${locale}/editorial-policy`),
    add(`/${locale}/content-review-policy`),
    add(`/${locale}/contact`),
  ];
  const pathwayTopicPublicPaths = collectPathwayTopicProgrammaticPublicPaths();
  const stripped = stripForbiddenLocalePrefixedPathwayTopics(urls, o, locale, pathwayTopicPublicPaths);
  if (stripped.removed > 0) {
    safeServerLog("seo", "sitemap_locale_strip_prefixed_pathway_topics", {
      locale,
      removed: stripped.removed,
    });
  }
  return stripped.urls;
}

export type CollectCoreUrlsOptions = {
  /**
   * Merged `/sitemap.xml` mode: no Prisma, no pathway lesson detail URLs, no content-backed study hub DB slice.
   */
  productionSafeStatic?: boolean;
};

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
export async function collectPathwayLessonSeoUrls(
  origin: string,
  opts?: { deadlineEpochMs?: number },
): Promise<string[]> {
  const o = normalizeOrigin(origin);
  if (shouldSkipDbBackedSitemapUrlsForBuild()) {
    safeServerLog("seo", "sitemap_pathway_urls_skipped_for_build", {
      reason: "build_time_db_skip",
    });
    return [`${o}/lessons`];
  }
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

  const { isPathwayPublishedForPublicSite } = await import("@/lib/navigation/country-exam-launch-readiness");
  const {
    PATHWAY_LESSON_SITEMAP_BATCH,
    listPathwayIdsWithLessons,
    listPathwayLessonSlugBatch,
    listTopicClustersForSitemap,
  } = await import("@/lib/lessons/pathway-lesson-loader");
  const { marketingPathwayLessonTopicClusterPath } = await import("@/lib/lessons/lesson-routes");
  const pathwayIds = await listPathwayIdsWithLessons();
  const { getExamPathwayById } = await import("@/lib/exam-pathways/exam-pathways-catalog");
  for (const pid of pathwayIds) {
    if (opts?.deadlineEpochMs != null && Date.now() > opts.deadlineEpochMs) {
      safeServerLog("seo", "sitemap_pathway_lesson_deadline_stop", {
        phase: "pathway_iter",
        urlsSoFar: String(urls.length),
      });
      logSeoEmittedUrlBatch("sitemap_pathway_lesson_urls", urls);
      return urls;
    }
    if (!isPathwayPublishedForPublicSite(pid)) continue;
    const p = getExamPathwayById(pid);
    if (!p || p.status === "hidden") continue;
    if (!push(`${o}${buildExamPathwayPath(p, "lessons")}`)) {
      safeServerLog("seo", "sitemap_pathway_derived_cap", { cap: MAX_PATHWAY_DERIVED_SITEMAP_URLS, phase: "pathway-hub" });
      return urls;
    }
    const topics = await listTopicClustersForSitemap(pid);
    for (const t of topics) {
      if (!push(`${o}${marketingPathwayLessonTopicClusterPath(p, t.topicSlug)}`)) {
        safeServerLog("seo", "sitemap_pathway_derived_cap", { cap: MAX_PATHWAY_DERIVED_SITEMAP_URLS, phase: "topic" });
        return urls;
      }
    }
    let skip = 0;
    for (;;) {
      if (opts?.deadlineEpochMs != null && Date.now() > opts.deadlineEpochMs) {
        safeServerLog("seo", "sitemap_pathway_lesson_deadline_stop", {
          phase: "lesson_slug_batch",
          pathwayId: String(pid),
          urlsSoFar: String(urls.length),
        });
        logSeoEmittedUrlBatch("sitemap_pathway_lesson_urls", urls);
        return urls;
      }
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

/**
 * Default-locale “core” slice (merged into `/sitemap.xml` via `collectCoreUrls`).
 *
 * Unless {@link CollectCoreUrlsOptions.productionSafeStatic} is set, omits `/login` (noindex auth surface).
 */
export async function collectCoreUrls(origin: string, opts?: CollectCoreUrlsOptions): Promise<string[]> {
  const o = normalizeOrigin(origin);
  const productionSafe = opts?.productionSafeStatic === true;
  const add = (path: string) => {
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${o}${p}`;
  };
  const reduceForBuildSafeMode = shouldReduceNonCriticalBuildWork();
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
    ...(productionSafe ? [add("/login")] : []),
  ];
  if (reduceForBuildSafeMode) {
    safeServerLog("seo", "sitemap_build_safe_mode_core_only", {
      reason: "nn_build_safe_mode",
    });
    return base;
  }
  const expandedBase = [
    ...base,
    ...SORTED_SITEMAP_LOCALES.flatMap((loc) => collectLocaleMarketingSitemapSafeUrls(o, loc)),
    ...getAllProgrammaticQuestionTopicSlugs().map((s) => add(`/questions/${s}`)),
    add("/tools"),
    add("/case-studies"),
    ...listPublishedExpansionExamMarketingPaths().map((p) => add(p)),
    ...regionalTopicPaths.map((p) => add(p)),
  ];
  if (productionSafe) {
    const pathwayTopicUrls = await collectPathwayTopicProgrammaticUrls(o);
    const [examHubUrls, npPracticeHubUrls] = await Promise.all([
      collectExamPathwayUrls(o),
      collectNpPracticeTestHubUrls(o),
    ]);
    const lessonHubUrls = collectPathwayLessonHubUrlsOnly(o);
    const osceScenarioHubUrls = collectOsceScenariosMarketingHubUrls(o);
    return [
      ...expandedBase,
      ...examHubUrls,
      ...npPracticeHubUrls,
      ...pathwayTopicUrls,
      ...collectAlliedMarketingUrls(o),
      ...collectPreNursingSitemapHubUrlsOnly(o),
      ...lessonHubUrls,
      ...osceScenarioHubUrls,
    ];
  }
  /**
   * Pathway lesson URLs are the dominant sitemap cost. Cap wall time (override via `SITEMAP_PATHWAY_BUDGET_MS`).
   * Blog index and posts are not emitted from this heavy pathway path; `/sitemap.xml` lists `/blog` in the static route.
   */
  const pathwayBudgetMs = (() => {
    const raw = process.env.SITEMAP_PATHWAY_BUDGET_MS?.trim();
    const n = raw ? Number.parseInt(raw, 10) : 8000;
    if (!Number.isFinite(n)) return 8000;
    return Math.min(60_000, Math.max(2000, n));
  })();
  const pathwayLessonDeadlineMs = Date.now() + pathwayBudgetMs;
  const lessonUrls = await collectPathwayLessonSeoUrls(o, { deadlineEpochMs: pathwayLessonDeadlineMs });
  const pathwayTopicUrls = await collectPathwayTopicProgrammaticUrls(o);
  const [examHubUrls, npPracticeHubUrls, contentBackedStudyHubUrls, programmaticStudySeoUrls] = await Promise.all([
    collectExamPathwayUrls(o),
    collectNpPracticeTestHubUrls(o),
    collectContentBackedStudyResourceHubUrls(o),
    collectProgrammaticStudySeoUrls(o),
  ]);
  const osceScenarioHubUrls = collectOsceScenariosMarketingHubUrls(o);
  return [
    ...expandedBase,
    ...examHubUrls,
    ...npPracticeHubUrls,
    ...pathwayTopicUrls,
    ...contentBackedStudyHubUrls,
    ...programmaticStudySeoUrls,
    ...collectAlliedMarketingUrls(o),
    ...collectPreNursingSeoUrls(o),
    ...lessonUrls,
    ...osceScenarioHubUrls,
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
export async function collectLocaleMarketingUrls(origin: string, locale: string): Promise<string[]> {
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
  const { collectPathwayTopicProgrammaticPublicPaths } = await import("@/lib/seo/pathway-topic-programmatic-registry");
  const pathwayTopicPublicPaths = collectPathwayTopicProgrammaticPublicPaths();
  const stripped = stripForbiddenLocalePrefixedPathwayTopics(urls, o, locale, pathwayTopicPublicPaths);
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
