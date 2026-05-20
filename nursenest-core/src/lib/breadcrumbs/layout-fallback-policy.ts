import { shouldEmitLayoutBreadcrumbFallback } from "@/lib/breadcrumbs/schema-ownership";
import { buildMarketingRouteBreadcrumbItems } from "@/lib/seo/marketing-route-breadcrumbs";
import { isMarketingLocaleCode } from "@/lib/i18n/marketing-locale-policy";

export { pageOwnsBreadcrumbSchema, shouldEmitLayoutBreadcrumbFallback } from "@/lib/breadcrumbs/schema-ownership";

const EXAM_COUNTRY_SEGMENTS = new Set([
  "canada",
  "us",
  "uk",
  "australia",
  "philippines",
  "india",
  "nigeria",
  "saudi-arabia",
  "middle-east",
]);

const PATHWAY_ROLE_SEGMENTS = new Set(["rn", "rpn", "pn", "np", "lpn", "allied"]);

function normalizePathname(pathname: string): string {
  const raw = pathname.trim() || "/";
  const withoutQuery = raw.split("?")[0]?.split("#")[0] ?? "/";
  const withLeading = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  const normalized = withLeading.replace(/\/{2,}/g, "/").replace(/\/$/, "");
  return normalized || "/";
}

/** `/{locale}?/{country}/{role}/{exam}/…` marketing pathway tree. */
export function isPathwayMarketingPathname(pathname: string): boolean {
  const p = normalizePathname(pathname);
  const segments = p.split("/").filter(Boolean);
  let i = 0;
  if (segments[0] && isMarketingLocaleCode(segments[0])) i = 1;
  if (i >= segments.length) return false;
  const country = segments[i]?.toLowerCase();
  const role = segments[i + 1]?.toLowerCase();
  if (!country || !EXAM_COUNTRY_SEGMENTS.has(country)) return false;
  if (!role || !PATHWAY_ROLE_SEGMENTS.has(role)) return false;
  return segments.length > i + 2;
}

/**
 * Whether the marketing layout may emit path-segment fallback `BreadcrumbList` JSON-LD (`seo` intent).
 * Last resort only — page-owned resolver trails take priority.
 */
export function shouldEmitMarketingLayoutBreadcrumbFallback(pathname: string | null | undefined): boolean {
  if (!shouldEmitLayoutBreadcrumbFallback(pathname)) return false;
  const p = normalizePathname(pathname ?? "/");
  return buildMarketingRouteBreadcrumbItems(p).length >= 2;
}
