/** Shared headers for the merged `/sitemap.xml` route handler (single urlset, no sitemap index). */
export const SITEMAP_XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
} as const;

export function sitemapXmlResponse(xml: string): Response {
  return new Response(xml, { status: 200, headers: SITEMAP_XML_HEADERS });
}
