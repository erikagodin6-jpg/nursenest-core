import { resolveAlliedProfessionFromRouteSlug } from "@/lib/allied/allied-professions-registry";
import { CANONICAL_PATHWAY_HUB } from "@/lib/marketing/canonical-pathway-hubs";
import { marketingPublicSiteOrigin } from "@/lib/marketing/marketing-public-site-origin";
import { alliedHealthLessonDetailPath, alliedHealthLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { isProgrammaticSeoSlug } from "@/lib/seo/programmatic-registry-slugs";

/**
 * Maps legacy SPA paths from `shared/platform-manifest` and marketing copy to NurseNest Core routes.
 * External deep links fall back to the public marketing site when not implemented in Core.
 */

let legacyMarketingExactRoutes: Record<string, string> | null = null;

/**
 * Legacy allied lesson hub/detail under `/allied-health/{slug}/lessons` → canonical pathway URLs
 * (see `canonical-lessons-hubs.ts`).
 */
function mapAlliedHealthLessonsLegacyHref(href: string): string | null {
  const m = href.match(/^\/allied-health\/([^/]+)\/lessons(?:\/([^/]+))?$/);
  if (!m) return null;
  const slug = decodeURIComponent(m[1]!);
  const prof = resolveAlliedProfessionFromRouteSlug(slug);
  if (!prof) return null;
  const lessonSeg = m[2];
  if (lessonSeg) {
    return alliedHealthLessonDetailPath(prof.professionKey, decodeURIComponent(lessonSeg));
  }
  return alliedHealthLessonsIndexPath(prof.professionKey);
}

/** `/{country}/{role}/{exam}/…` marketing exam surfaces stay on Core (not rewritten to legacy public host). */
function isMarketingExamHubScopedPath(mapped: string): boolean {
  const pathOnly = mapped.split("?")[0] ?? mapped;
  return /^\/(us|canada)\/(pn|rpn|lpn|rn|np|allied)\/[^/]+/.test(pathOnly);
}

/** Large legacy path table — built on first `mapLegacyMarketingHref` / `resolveMarketingHref` use (not at module init). */
function legacyMarketingExactRoutesTable(): Record<string, string> {
  if (legacyMarketingExactRoutes) return legacyMarketingExactRoutes;
  const origin = marketingPublicSiteOrigin();
  legacyMarketingExactRoutes = {
    /** Legacy / alternate URLs → canonical institutional page */
    "/institutional-pricing": "/for-institutions",
    "/pricing/institutional": "/for-institutions",
    "/for-schools": "/for-institutions",
    /** Alternate marketing paths → canonical institutional page. */
    "/institutions": "/for-institutions",
    "/schools": "/for-institutions",
    /** Public lesson index (exam-scoped hubs); avoid sending “exam prep” intent to pricing. */
    "/exam-prep": "/lessons",
    "/register": "/signup",
    /** PN Canada: canonical pathway hub (lessons, questions, CAT from hub). */
    "/rex-pn": "/canada/rpn/rex-pn",
    /** Legacy short path: send to public lessons index (region + exam picked there and in nav). */
    "/nclex-rn": "/lessons",
    "/np-exam-practice-questions": CANONICAL_PATHWAY_HUB.usNp,
    "/nursing-certifications": `${origin}/nursing-certifications`,
    "/newgrad": `${origin}/newgrad`,
    "/new-grad": `${origin}/new-grad`,
    /** Public marketing landings (do not map these to /app/*). */
    "/lessons": "/lessons",
    "/exam-lessons": "/lessons",
    "/flashcards": "/flashcards",
    /** Core hosts Med Math under tools; keep footer/header links on-origin. */
    "/med-math": "/tools/med-math",
    "/mock-exams": "/practice-exams",
    "/mock-exam": "/practice-exams",
    "/study": "/lessons",
    "/test-bank": "/lessons",
    "/analytics": "/app",
    "/clinical-scenarios": "/lessons",
    "/languages": `${origin}/languages`,
    "/free-practice": "/lessons",
    "/study-plan": "/app/study-plan",
    "/reports": "/app",
    "/career-journey": `${origin}/career-journey`,
    "/career-journey/nursing": `${origin}/career-journey/nursing`,
    "/start-free": "/signup",
    "/faq": "/faq",
    "/rex-pn-guide": `${origin}/rex-pn-guide`,
    "/nclex-rn-guide": `${origin}/nclex-rn-guide`,
    "/shop": `${origin}/shop`,
    "/pre-nursing": "/pre-nursing",
    /** No dedicated anatomy route in Core; tools index is the closest internal hub. */
    "/anatomy": "/tools",
    "/rex-pn-practice-questions": CANONICAL_PATHWAY_HUB.caPn,
    "/nclex-rn-practice-questions": CANONICAL_PATHWAY_HUB.usRn,
    "/nclex-pn-practice-questions": CANONICAL_PATHWAY_HUB.usPn,
    "/cnple-practice-questions": CANONICAL_PATHWAY_HUB.caNp,
    "/nursing-specialties": "/lessons",
    "/new-graduate-support": `${origin}/new-graduate-support`,
    "/healthcare-careers": `${origin}/healthcare-careers`,
    "/blog": "/blog",
    /** Legacy alternate path — canonical public Terms route is `/terms`. */
    "/terms-of-service": "/terms",
    "/case-studies": "/case-studies",
    "/paramedic": `${origin}/allied-health/paramedic`,
    "/rrt": `${origin}/allied-health/rrt`,
    "/mlt": `${origin}/allied-health/mlt`,
    "/imaging": `${origin}/allied-health/imaging`,
  };
  return legacyMarketingExactRoutes;
}

/** Core-hosted Allied marketing (must not be rewritten to the legacy public site). */
export function isCoreAlliedMarketingPath(href: string): boolean {
  if (href === "/allied-health" || href.startsWith("/allied-health/")) return true;
  if (href === "/allied-health-exam-prep" || href.startsWith("/allied-health-exam-prep/")) return true;
  return false;
}

export function mapLegacyMarketingHref(href: string): string {
  const alliedLessons = mapAlliedHealthLessonsLegacyHref(href);
  if (alliedLessons) return alliedLessons;
  if (isCoreAlliedMarketingPath(href)) return href;
  /** Monolith storefront only; Core allied marketing is handled above. */
  if (href.startsWith("/shop")) {
    return `${marketingPublicSiteOrigin()}${href}`;
  }
  return legacyMarketingExactRoutesTable()[href] ?? href;
}

/** Prefer Core routes for app/pricing/auth; send other marketing paths to the public site to avoid 404s. */
export function resolveMarketingHref(href: string): string {
  if (href.startsWith("http")) return href;
  const mapped = mapLegacyMarketingHref(href);
  if (mapped.startsWith("http")) return mapped;
  const segments = mapped.split("/").filter(Boolean);
  if (segments.length === 1 && isProgrammaticSeoSlug(segments[0]!)) {
    return `/${segments[0]}`;
  }
  if (mapped === "/blog" || mapped.startsWith("/blog/")) {
    return mapped;
  }
  if (
    mapped.startsWith("/app/") ||
    mapped === "/app" ||
    mapped === "/pricing" ||
    mapped === "/for-institutions" ||
    mapped === "/case-studies" ||
    mapped === "/pre-nursing" ||
    mapped.startsWith("/pre-nursing/") ||
    mapped === "/terms" ||
    mapped === "/privacy" ||
    mapped === "/refund-policy" ||
    mapped === "/acceptable-use" ||
    mapped === "/disclaimer" ||
    mapped === "/contact" ||
    mapped === "/faq" ||
    mapped === "/lessons" ||
    mapped === "/question-bank" ||
    mapped === "/practice-exams" ||
    mapped === "/exam-lessons" ||
    mapped === "/test-bank" ||
    mapped === "/mock-exams" ||
    mapped === "/flashcards" ||
    mapped.startsWith("/flashcards/") ||
    mapped === "/tools" ||
    mapped.startsWith("/tools/") ||
    mapped === "/login" ||
    mapped === "/signup" ||
    mapped === "/forgot-password" ||
    mapped === "/reset-password" ||
    mapped === "/" ||
    isCoreAlliedMarketingPath(mapped) ||
    isMarketingExamHubScopedPath(mapped)
  ) {
    return mapped;
  }
  return `${marketingPublicSiteOrigin()}${mapped.startsWith("/") ? mapped : `/${mapped}`}`;
}

export function marketingAssetUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${marketingPublicSiteOrigin()}${path.startsWith("/") ? path : `/${path}`}`;
}
