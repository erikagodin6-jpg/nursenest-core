/**
 * Pure sitemap `<urlset>` XML serialization — no Prisma, no `server-only`, safe for lightweight tests.
 */
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";

export type SitemapUrlEntry = {
  loc: string;
  lastmod?: string;
};

function normalizeOriginLite(origin: string): string {
  return origin.endsWith("/") ? origin.slice(0, -1) : origin;
}

function safeLastmodDate(): string {
  try {
    return new Date().toISOString().slice(0, 10);
  } catch {
    return "1970-01-01";
  }
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Public: reusable urlset builder from absolute URLs (used by blog sitemap and `/sitemap.xml`). */
export function buildSitemapUrlsetFromAbsoluteUrls(urls: string[] | SitemapUrlEntry[]): string {
  if (urls.length === 0) return minimalUrlsetSingleHome();
  const defaultLastmod = safeLastmodDate();
  const body = urls
    .map((u) => {
      const locValue = typeof u === "string" ? u : u.loc;
      const entryLastmod = typeof u === "string" ? defaultLastmod : (u.lastmod?.slice(0, 25) || defaultLastmod);
      const loc = escapeXml(locValue);
      const lastmod = escapeXml(entryLastmod);
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

export function minimalUrlsetSingleHome(): string {
  const base = normalizeOriginLite(resolveCanonicalSiteOrigin());
  const loc = escapeXml(`${base}/`);
  const lastmod = safeLastmodDate();
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>
</urlset>
`;
}

/** @deprecated */
export function minimalSitemapXml(): string {
  return minimalUrlsetSingleHome();
}

/**
 * Sitemap **index** (`<sitemapindex>`) listing child urlset URLs — used at `/sitemap.xml`.
 * Each `loc` must be an absolute HTTPS URL to a child sitemap document.
 */
export function buildSitemapIndexXml(childAbsoluteUrls: readonly string[]): string {
  const defaultLastmod = safeLastmodDate();
  const body = childAbsoluteUrls
    .map((locValue) => {
      const loc = escapeXml(locValue);
      const lastmod = escapeXml(defaultLastmod);
      return `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`;
}
