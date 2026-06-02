import { normalizeOrigin } from "@/lib/seo/sitemap-static-xml";
import { buildSitemapIndexXml } from "@/lib/seo/sitemap-urlset-build";

/**
 * Child urlsets referenced from `/sitemap.xml` (sitemap index). Order is stable for ETag + tests.
 * Robots.txt lists only the index URL (engines follow child `loc`s).
 */
export const SITEMAP_INDEX_CHILD_FILENAMES = [
  "sitemap-en.xml",
  "sitemap-fr.xml",
  "sitemap-es.xml",
  "sitemap-hi.xml",
  "sitemap-pt.xml",
  "sitemap-ar.xml",
  "sitemap-de.xml",
  "sitemap-jp.xml",
  "sitemap-ko.xml",
  "sitemap-zh.xml",
  "sitemap-zh-tw.xml",
  "sitemap-it.xml",
  "sitemap-tl.xml",
  "sitemap-core.xml",
  "sitemap-blog.xml",
  "sitemap-fr-blog.xml",
  "sitemap-es-blog.xml",
  "sitemap-pathways.xml",
  "sitemap-lessons.xml",
  "sitemap-localized.xml",
  "sitemap-clinical-modules.xml",
  "sitemap-allied.xml",
  "sitemap-new-grad.xml",
  // CNPLE topical authority cluster — Canadian NP exam SEO lane
  "sitemap-cnple.xml",
  // Fast-ranking authority clusters for CNPLE, REx-PN, and Respiratory Therapy.
  "sitemap-authority-clusters.xml",
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
  "/nclex-question-bank",
  "/nclex-study-plan",
  "/rex-pn-study-plan",
  "/nclex-vs-rex-pn",
  "/nclex-next-gen-question-types",
  "/cat-nclex-simulator",
  "/free-nclex-practice-questions",
  "/best-nclex-prep-course",
  "/lpn-nclex-prep",
  "/lvn-nclex-prep",
  "/canadian-nclex-guide",
  "/how-to-pass-nclex-2026",
  "/adaptive-nclex-testing",
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
  "/canada/np/cnple/simulation",
  "/canada/np/cnple/flashcards",
  "/canada/np/cnple/report-card",
  // CNPLE SEO content hubs
  "/cnple",
  "/cnple-practice-questions",
  "/cnple-simulation-exam",
  "/cnple-study-guide",
  "/cnple-flashcards",
  "/cnple-case-studies",
  "/cnple-clinical-judgment",
  "/cnple-prescribing-questions",
  "/cnple-lab-interpretation",
  "/cnple-differential-diagnosis",
  "/cnple-primary-care",
  "/cnple-pediatrics",
  "/cnple-womens-health",
  "/cnple-geriatrics",
  "/cnple-mental-health",
] as const;

/** Core segment fallback: no `/blog`, no pathway-lesson `/…/lessons`, no exam hubs (owned by `/sitemap-pathways.xml`). */
export const SITEMAP_FALLBACK_CORE_PATHS = SITEMAP_FALLBACK_PATHS_ALL.filter((p) => {
  if (p === "/blog") return false;
  if (p === "/lessons") return false;
  if (p.endsWith("/lessons")) return false;
  // Exam pathway hubs — emitted only from `/sitemap-pathways.xml` when collectors fail here.
  const pathwayHubOnly = new Set([
    "/us/rn/nclex-rn",
    "/us/pn/nclex-pn",
    "/us/np/fnp",
    "/canada/rn/nclex-rn",
    "/canada/pn/rex-pn",
    "/canada/np/cnple",
  ]);
  if (pathwayHubOnly.has(p)) return false;
  return true;
}) as readonly string[];

/**
 * Lessons segment fallback when lesson-detail collector fails — representative lesson-detail URLs only
 * (no pathway hubs or `/lessons` index; those live under `/sitemap-pathways.xml`).
 */
export const SITEMAP_FALLBACK_LESSON_DETAIL_PATHS = [
  "/us/rn/nclex-rn/lessons/fluid-balance",
  "/canada/rn/nclex-rn/lessons/fluid-balance",
] as const;

/** @deprecated Use {@link SITEMAP_FALLBACK_LESSON_DETAIL_PATHS}. */
export const SITEMAP_FALLBACK_LESSONS_PATHS = SITEMAP_FALLBACK_LESSON_DETAIL_PATHS;

/** Pathways segment fallback: `/lessons`, exam hubs, pricing, questions, per-pathway lesson index (no lesson-detail slugs). */
export const SITEMAP_FALLBACK_PATHWAYS_PATHS = [
  "/lessons",
  "/us/rn/nclex-rn",
  "/us/rn/nclex-rn/pricing",
  "/us/rn/nclex-rn/questions",
  "/us/rn/nclex-rn/test-bank",
  "/us/rn/nclex-rn/lessons",
  "/us/pn/nclex-pn",
  "/us/pn/nclex-pn/pricing",
  "/us/pn/nclex-pn/questions",
  "/us/pn/nclex-pn/lessons",
  "/us/np/fnp",
  "/us/np/fnp/pricing",
  "/us/np/fnp/questions",
  "/us/np/fnp/test-bank",
  "/us/np/fnp/lessons",
  "/us/np/agpcnp/test-bank",
  "/canada/rn/nclex-rn",
  "/canada/rn/nclex-rn/pricing",
  "/canada/rn/nclex-rn/questions",
  "/canada/rn/nclex-rn/lessons",
  "/canada/pn/rex-pn",
  "/canada/pn/rex-pn/pricing",
  "/canada/pn/rex-pn/questions",
  "/canada/pn/rex-pn/lessons",
  "/canada/np/cnple",
  "/canada/np/cnple/pricing",
  "/canada/np/cnple/questions",
  "/canada/np/cnple/test-bank",
  "/canada/np/cnple/lessons",
  "/canada/np/cnple/simulation",
  "/canada/np/cnple/flashcards",
  "/canada/np/cnple/report-card",
  "/canada/rpn/rex-pn/test-bank",
] as const;

/** Localized segment fallback when DB/registry collectors throw — representative tier-full locale slice. */
export const SITEMAP_FALLBACK_LOCALIZED_PATHS = ["/fr", "/fr/pricing", "/fr/lessons"] as const;

/** Clinical-modules segment fallback — ECG specialty pages + tool teasers (OSCE pathway hubs require runtime flags). */
export const SITEMAP_FALLBACK_CLINICAL_MODULES_PATHS = [
  "/ecg-interpretation",
  "/ecg-telemetry-mastery",
  "/advanced-ecg-nursing",
  "/tools/lab-values",
  "/tools/med-math",
] as const;
