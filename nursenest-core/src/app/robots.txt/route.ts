import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";

/**
 * Explicit `text/plain` robots.txt — no DB/i18n; always 200 for crawlers.
 * Internal `/seo/*` rewrite targets are disallowed to avoid duplicate indexing with public `/{slug}` URLs.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROBOTS_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
} as const;

export async function GET() {
  try {
    const origin = resolveCanonicalSiteOrigin();
    const body = `User-agent: *
Allow: /
Disallow: /app/
Disallow: /admin/
Disallow: /api/
Disallow: /seo/

Sitemap: ${origin}/sitemap.xml
`;
    return new Response(body, { status: 200, headers: ROBOTS_HEADERS });
  } catch {
    return new Response(
      `User-agent: *\nAllow: /\nDisallow: /app/\nDisallow: /admin/\nDisallow: /api/\nDisallow: /seo/\n\nSitemap: https://www.nursenest.ca/sitemap.xml\n`,
      { status: 200, headers: ROBOTS_HEADERS },
    );
  }
}
