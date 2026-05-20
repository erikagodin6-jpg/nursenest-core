import type { BreadcrumbJsonLdItem } from "@/components/seo/breadcrumb-json-ld";

const STATIC_SEGMENT_LABELS: Record<string, string> = {
  about: "About",
  blog: "Blog",
  canada: "Canada",
  usa: "United States",
  us: "United States",
  rn: "RN",
  rpn: "RPN",
  pn: "PN",
  np: "NP",
  cnple: "CNPLE",
  "nclex-rn": "NCLEX-RN",
  "rex-pn": "REx-PN",
  allied: "Allied Health",
  "allied-health": "Allied Health",
  "new-grad": "New Grad",
  "pre-nursing": "Pre-Nursing",
  ecg: "ECG",
  "ecg-interpretation": "ECG Interpretation",
  "advanced-ecg-nursing": "Advanced ECG Nursing",
  "ecg-telemetry-mastery": "ECG Telemetry Mastery",
  "clinical-modules": "Clinical Modules",
  lessons: "Lessons",
  lesson: "Lesson",
  flashcards: "Flashcards",
  questions: "Practice Questions",
  "practice-questions": "Practice Questions",
  "question-bank": "Question Bank",
  cat: "CAT Exam",
  simulation: "Simulation",
  simulations: "Simulations",
  pricing: "Pricing",
  faq: "FAQ",
  tools: "Tools",
  study: "Study",
  "study-plan": "Study Plan",
  "case-studies": "Case Studies",
  "case-simulations": "Case Simulations",
  "12-lead-stemi": "12-Lead STEMI",
  "acls-rhythms": "ACLS Rhythms",
  "pals-rhythms": "PALS Rhythms",
  "pediatric-ecg": "Pediatric ECG",
  "electrolyte-ecg-changes": "Electrolyte ECG Changes",
  "telemetry-nursing": "Telemetry Nursing",
};

const EXCLUDED_FIRST_SEGMENTS = new Set([
  "api",
  "app",
  "_next",
  "admin",
  "auth",
  "login",
  "signin",
  "sign-in",
  "signup",
  "sign-up",
  "dashboard",
]);

const EXCLUDED_FILENAMES = new Set([
  "favicon.ico",
  "manifest.json",
  "robots.txt",
  "sitemap.xml",
  "sitemap-index.xml",
]);

function normalizeMarketingPathname(pathname: string | null | undefined): string {
  const raw = (pathname ?? "/").trim() || "/";
  const withoutQuery = raw.split("?")[0]?.split("#")[0] ?? "/";
  const withLeadingSlash = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  const normalized = withLeadingSlash.replace(/\/{2,}/g, "/").replace(/\/$/, "");
  return normalized || "/";
}

function titleCaseSlug(segment: string): string {
  return segment
    .split("-")
    .filter(Boolean)
    .map((part) => {
      if (/^[a-z]+\d+$/i.test(part)) return part.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ")
    .replace(/\bNclex\b/g, "NCLEX")
    .replace(/\bRex\b/g, "REx")
    .replace(/\bCnple\b/g, "CNPLE")
    .replace(/\bEcg\b/g, "ECG")
    .replace(/\bRn\b/g, "RN")
    .replace(/\bRpn\b/g, "RPN")
    .replace(/\bNp\b/g, "NP")
    .replace(/\bPn\b/g, "PN");
}

export function marketingRouteBreadcrumbLabel(segment: string): string {
  const normalized = segment.toLowerCase().trim();
  return STATIC_SEGMENT_LABELS[normalized] ?? titleCaseSlug(normalized);
}

/**
 * SSR-safe fallback breadcrumbs for public marketing routes.
 *
 * Page-specific breadcrumbs may still override/extend this, but this guarantees the
 * default marketing surface emits valid BreadcrumbList JSON-LD instead of leaving
 * most routes invisible to Google Search Console breadcrumb detection.
 */
export function buildMarketingRouteBreadcrumbItems(
  pathname: string | null | undefined,
): BreadcrumbJsonLdItem[] {
  const normalizedPath = normalizeMarketingPathname(pathname);
  if (normalizedPath === "/") return [];

  const segments = normalizedPath.split("/").filter(Boolean);
  if (segments.length === 0) return [];

  const first = segments[0]?.toLowerCase() ?? "";
  if (EXCLUDED_FIRST_SEGMENTS.has(first)) return [];
  if (segments.length === 1 && EXCLUDED_FILENAMES.has(first)) return [];
  if (first.startsWith("sitemap")) return [];

  const crumbs: BreadcrumbJsonLdItem[] = [{ name: "Home", path: "/" }];
  let path = "";

  for (const segment of segments) {
    path += `/${segment}`;
    crumbs.push({
      name: marketingRouteBreadcrumbLabel(decodeURIComponent(segment)),
      path,
    });
  }

  return crumbs.length >= 2 ? crumbs : [];
}
