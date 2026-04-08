import { isProgrammaticSeoSlug } from "@/lib/seo/programmatic-registry";

/**
 * Maps legacy SPA paths from `shared/platform-manifest` and marketing copy to NurseNest Core routes.
 * External deep links fall back to the public marketing site when not implemented in Core.
 */
const PUBLIC_SITE = process.env.NEXT_PUBLIC_NURSENEST_ASSETS_BASE?.replace(/\/$/, "") ?? "https://www.nursenest.ca";

const EXACT: Record<string, string> = {
  /** Legacy / alternate URLs → canonical institutional page */
  "/institutional-pricing": "/for-institutions",
  "/pricing/institutional": "/for-institutions",
  "/for-schools": "/for-institutions",
  "/exam-prep": "/pricing",
  "/register": "/signup",
  "/rex-pn": "/pricing",
  "/nclex-rn": "/pricing",
  "/np-exam-practice-questions": "/np-exam-practice-questions",
  "/nursing-certifications": `${PUBLIC_SITE}/nursing-certifications`,
  "/newgrad": `${PUBLIC_SITE}/newgrad`,
  "/new-grad": `${PUBLIC_SITE}/new-grad`,
  /** Public marketing landings (do not map these to /app/*). */
  "/lessons": "/lessons",
  "/exam-lessons": "/lessons",
  "/flashcards": "/flashcards",
  "/mock-exams": "/practice-exams",
  "/mock-exam": "/practice-exams",
  "/study": "/question-bank",
  "/test-bank": "/question-bank",
  "/analytics": "/app",
  "/clinical-scenarios": "/lessons",
  "/languages": `${PUBLIC_SITE}/languages`,
  "/free-practice": "/question-bank",
  "/study-plan": "/app/study-plan",
  "/reports": "/app",
  "/career-journey": `${PUBLIC_SITE}/career-journey`,
  "/career-journey/nursing": `${PUBLIC_SITE}/career-journey/nursing`,
  "/start-free": "/signup",
  "/faq": "/faq",
  "/rex-pn-guide": `${PUBLIC_SITE}/rex-pn-guide`,
  "/nclex-rn-guide": `${PUBLIC_SITE}/nclex-rn-guide`,
  "/shop": `${PUBLIC_SITE}/shop`,
  "/pre-nursing": "/pre-nursing",
  "/rex-pn-practice-questions": "/rex-pn-practice-questions",
  "/nclex-rn-practice-questions": "/nclex-rn-practice-questions",
  "/nursing-specialties": "/lessons",
  "/new-graduate-support": `${PUBLIC_SITE}/new-graduate-support`,
  "/healthcare-careers": `${PUBLIC_SITE}/healthcare-careers`,
  "/blog": "/blog",
  "/case-studies": "/case-studies",
  "/paramedic": `${PUBLIC_SITE}/allied-health/paramedic`,
  "/rrt": `${PUBLIC_SITE}/allied-health/rrt`,
  "/mlt": `${PUBLIC_SITE}/allied-health/mlt`,
  "/imaging": `${PUBLIC_SITE}/allied-health/imaging`,
};

/** Core-hosted Allied marketing (must not be rewritten to the legacy public site). */
export function isCoreAlliedMarketingPath(href: string): boolean {
  if (href === "/allied-health" || href.startsWith("/allied-health/")) return true;
  if (href === "/allied-health-exam-prep" || href.startsWith("/allied-health-exam-prep/")) return true;
  return false;
}

export function mapLegacyMarketingHref(href: string): string {
  if (isCoreAlliedMarketingPath(href)) return href;
  if (href.startsWith("/allied-health") || href.startsWith("/shop")) {
    return `${PUBLIC_SITE}${href}`;
  }
  return EXACT[href] ?? href;
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
    isCoreAlliedMarketingPath(mapped)
  ) {
    return mapped;
  }
  return `${PUBLIC_SITE}${mapped.startsWith("/") ? mapped : `/${mapped}`}`;
}

export function marketingAssetUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${PUBLIC_SITE}${path.startsWith("/") ? path : `/${path}`}`;
}
