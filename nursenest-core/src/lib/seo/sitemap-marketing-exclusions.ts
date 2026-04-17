import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";

/**
 * Marketing routes that return 200 but intentionally use `robots: { index: false, follow: true }`
 * (sign-in, sign-up, password flows). They must not appear in `/sitemap.xml` — avoids crawl-budget
 * waste and conflicts between sitemap “URL candidate” signals vs page-level noindex.
 *
 * Keep aligned with marketing `login`, `signup`, `forgot-password`, and `reset-password` route metadata.
 */
export const AUTH_MARKETING_PATHS_NOINDEX = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
] as const;

const NOINDEX_SET = new Set<string>(AUTH_MARKETING_PATHS_NOINDEX);

/**
 * True for default-locale auth paths (`/login`, …) or localized `/{locale}/login` when `locale`
 * is a hosted marketing locale (not pathway country slugs like `us`).
 */
export function isAuthNoindexMarketingPathname(pathname: string): boolean {
  const p = (pathname.split("?")[0] ?? pathname).replace(/\/+$/, "") || "/";
  if (NOINDEX_SET.has(p)) return true;
  const parts = p.split("/").filter(Boolean);
  if (parts.length !== 2) return false;
  const [maybeLocale, leaf] = parts;
  if (!NOINDEX_SET.has(`/${leaf}`)) return false;
  return isCoreHostedNonDefaultLocale(maybeLocale);
}

/**
 * Final guard for merged sitemap `loc` values (absolute URLs). Drops auth noindex marketing URLs
 * if they ever regress into collectors.
 */
export function isEligiblePublicIndexSitemapLoc(loc: string, originNormalized: string): boolean {
  try {
    const u = new URL(loc);
    const o = originNormalized.endsWith("/") ? originNormalized.slice(0, -1) : originNormalized;
    if (u.origin !== o) return true;
    return !isAuthNoindexMarketingPathname(u.pathname);
  } catch {
    return false;
  }
}
