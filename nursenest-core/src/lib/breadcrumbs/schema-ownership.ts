/**
 * JSON-LD `BreadcrumbList` ownership — exactly one emitter per page.
 *
 * Priority:
 * 1. Page-owned (`Breadcrumbs` / `BreadcrumbsFromResolution`) — highest
 * 2. Resolver-generated on page — same as (1)
 * 3. Layout fallback (`MarketingMainI18nShards`) — last resort only
 */

import { isPathwayMarketingPathname } from "@/lib/breadcrumbs/layout-fallback-policy";

/** Path prefixes where a dedicated resolver owns breadcrumbs (no layout fallback). */
export const PAGE_OWNED_BREADCRUMB_PREFIXES = [
  "/blog",
  "/pricing",
  "/pre-nursing",
  "/allied-health",
  "/allied/",
  "/cnple",
  "/question-bank",
  "/lessons",
  "/flashcards",
  "/case-studies",
  "/exams/",
  "/nursing/",
  "/tools",
  "/how-it-works",
  "/for-institutions",
  "/seo/",
  "/glossary",
  "/ecg",
  "/advanced-ecg",
  "/ecg-interpretation",
  "/ecg-telemetry",
  "/ecg-practice-questions",
  "/pediatric-ecg",
  "/pals-rhythms",
  "/acls-rhythms",
  "/telemetry-nursing",
  "/labs-interpretation",
  "/advanced-labs",
  "/advanced-labs-interpretation",
  "/clinical-modules",
  "/hemodynamic",
  "/hemodynamics",
  "/cardiac-output",
  "/pulmonary-artery",
  "/arterial-line",
  "/shock-and-perfusion",
  "/critical-care-bundle",
  "/advanced-hemodynamic",
  "/nursing-mechanisms",
  "/canada/np/cnple",
  "/canada/rpn/rex-pn",
  "/canada/new-grad",
  "/us/new-grad",
] as const;

function normalizePathname(pathname: string): string {
  const raw = pathname.trim() || "/";
  const withoutQuery = raw.split("?")[0]?.split("#")[0] ?? "/";
  const withLeading = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  return (withLeading.replace(/\/{2,}/g, "/").replace(/\/$/, "") || "/").toLowerCase();
}

/** Page has dedicated breadcrumb ownership (resolver or explicit component). */
export function pageOwnsBreadcrumbSchema(pathname: string | null | undefined): boolean {
  const p = normalizePathname(pathname ?? "/");
  if (p === "/") return false;
  if (isPathwayMarketingPathname(p)) return true;
  return PAGE_OWNED_BREADCRUMB_PREFIXES.some((prefix) => p === prefix || p.startsWith(prefix));
}

/** Layout may emit path-segment fallback `BreadcrumbList` only when no page owner exists. */
export function shouldEmitLayoutBreadcrumbFallback(pathname: string | null | undefined): boolean {
  if (pageOwnsBreadcrumbSchema(pathname)) return false;
  const p = normalizePathname(pathname ?? "/");
  if (p === "/") return false;
  const segments = p.split("/").filter(Boolean);
  return segments.length >= 1;
}
