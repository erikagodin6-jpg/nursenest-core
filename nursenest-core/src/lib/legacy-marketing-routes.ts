import { resolveAlliedProfessionFromRouteSlug } from "@/lib/allied/allied-professions-registry";
import { alliedHealthLessonDetailPath, alliedHealthLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { CANONICAL_PATHWAY_HUB } from "@/lib/marketing/canonical-pathway-hubs";
import { marketingPublicSiteOrigin } from "@/lib/marketing/marketing-public-site-origin";

function normalizeHref(href: string): string {
  if (!href) return "/";

  try {
    const decoded = decodeURIComponent(href.trim());
    return decoded.startsWith("/") ? decoded : `/${decoded}`;
  } catch {
    return href.startsWith("/") ? href : `/${href}`;
  }
}

function splitPathAndQuery(href: string): { path: string; query: string } {
  const idx = href.indexOf("?");
  if (idx === -1) return { path: href, query: "" };

  return {
    path: href.slice(0, idx),
    query: href.slice(idx),
  };
}

/* =========================
   ALLIED LESSON ROUTES
   ========================= */

function mapAlliedHealthLessonsLegacyHref(href: string): string | null {
  const m = href.match(/^\/allied-health\/([^/]+)\/lessons(?:\/([^/]+))?$/i);
  if (!m) return null;

  const slug = decodeURIComponent(m[1]!);
  const prof = resolveAlliedProfessionFromRouteSlug(slug);
  if (!prof) return null;

  const lessonSeg = m[2];

  if (lessonSeg) {
    return alliedHealthLessonDetailPath(
      prof.professionKey,
      decodeURIComponent(lessonSeg),
    );
  }

  return alliedHealthLessonsIndexPath(prof.professionKey);
}

/* =========================
   MARKETING HUB DETECTION
   ========================= */

function isMarketingExamHubScopedPath(mapped: string): boolean {
  const path = mapped.split("?")[0] ?? "";

  return /^\/(us|canada)\/(pn|rpn|lpn|rn|np|allied)\/[a-z0-9-]+$/i.test(path);
}

/* =========================
   ROUTE TABLE
   ========================= */

let legacyRoutes: Record<string, string> | null = null;

function getLegacyRoutes(): Record<string, string> {
  if (legacyRoutes) return legacyRoutes;

  legacyRoutes = {
    "/institutional-pricing": "/for-institutions",
    "/pricing/institutional": "/for-institutions",
    "/for-schools": "/for-institutions",
    "/institutions": "/for-institutions",
    "/schools": "/for-institutions",

    "/exam-prep": "/lessons",
    "/register": "/signup",

    "/rex-pn": "/canada/rpn/rex-pn",
    "/nclex-rn": "/lessons",

    "/np-exam-practice-questions": CANONICAL_PATHWAY_HUB.usNp,

    "/exam-lessons": "/lessons",
    "/lessons": "/lessons",
    "/flashcards": "/flashcards",

    "/med-math": "/tools/med-math",

    "/mock-exams": "/practice-exams",
    "/mock-exam": "/practice-exams",

    "/study": "/lessons",
    "/test-bank": "/lessons",

    "/analytics": "/app",

    "/clinical-scenarios": "/lessons",

    "/free-practice": "/lessons",
    "/study-plan": "/app/study-plan",

    "/start-free": "/signup",

    "/faq": "/faq",
    "/blog": "/blog",

    "/terms-of-service": "/terms",

    "/case-studies": "/case-studies",

    "/pre-nursing": "/pre-nursing",

    "/anatomy": "/tools",
  };

  return legacyRoutes;
}

/* =========================
   CORE PATH RULES
   ========================= */

export function isCoreAlliedMarketingPath(href: string): boolean {
  return (
    href === "/allied-health" ||
    href.startsWith("/allied-health/") ||
    href.startsWith("/us/allied/") ||
    href.startsWith("/canada/allied/") ||
    href === "/allied-health-exam-prep" ||
    href.startsWith("/allied-health-exam-prep/")
  );
}

function isCorePreNursingMarketingPath(href: string): boolean {
  return href === "/pre-nursing" || href.startsWith("/pre-nursing/");
}

/* =========================
   MAIN MAPPING
   ========================= */

export function mapLegacyMarketingHref(hrefRaw: string): string {
  const href = normalizeHref(hrefRaw);

  const allied = mapAlliedHealthLessonsLegacyHref(href);
  if (allied) return allied;

  if (isCoreAlliedMarketingPath(href)) return href;
  if (isCorePreNursingMarketingPath(href)) return href;

  if (href.startsWith("/shop")) {
    return `${marketingPublicSiteOrigin()}${href}`;
  }

  return getLegacyRoutes()[href] ?? href;
}

/* =========================
   FINAL RESOLUTION
   ========================= */

export function resolveMarketingHref(hrefRaw: string): string {
  if (!hrefRaw) return "/";

  if (hrefRaw.startsWith("http")) return hrefRaw;

  const { path, query } = splitPathAndQuery(normalizeHref(hrefRaw));

  const mapped = mapLegacyMarketingHref(path);

  if (mapped.startsWith("http")) return mapped + query;

  if (
    mapped.startsWith("/app") ||
    mapped === "/pricing" ||
    mapped === "/for-institutions" ||
    mapped === "/lessons" ||
    mapped === "/flashcards" ||
    mapped.startsWith("/tools") ||
    mapped === "/login" ||
    mapped === "/signup" ||
    mapped === "/" ||
    mapped === "/faq" ||
    mapped === "/blog" ||
    isCorePreNursingMarketingPath(mapped) ||
    isCoreAlliedMarketingPath(mapped) ||
    isMarketingExamHubScopedPath(mapped)
  ) {
    return mapped + query;
  }

  return `${marketingPublicSiteOrigin()}${mapped}${query}`;
}

/* =========================
   ASSET URL
   ========================= */

export function marketingAssetUrl(path: string): string {
  if (!path) return "";

  if (path.startsWith("http")) return path;

  const normalized = path.startsWith("/") ? path : `/${path}`;

  return `${marketingPublicSiteOrigin()}${normalized}`;
}