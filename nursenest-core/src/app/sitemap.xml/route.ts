/**
 * Lightweight public sitemap.
 *
 * Keep this route independent from Prisma, Stripe, auth/session state, external fetches,
 * lesson body loaders, and dynamic blog/lesson detail inventories. It must always return
 * a valid XML response for crawlers, even when optional content systems are degraded.
 */
export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 3600;

const DEFAULT_ORIGIN = "https://www.nursenest.ca";

const STATIC_SITEMAP_PATHS = [
  "/",
  "/pricing",
  "/login",
  "/blog",
  "/us/rn/nclex-rn",
  "/us/rn/nclex-rn/lessons",
  "/us/pn/nclex-pn",
  "/us/pn/nclex-pn/lessons",
  "/us/np/fnp",
  "/us/np/fnp/lessons",
  "/canada/rn/nclex-rn",
  "/canada/rn/nclex-rn/lessons",
  "/canada/pn/rex-pn",
  "/canada/pn/rex-pn/lessons",
  "/canada/np/cnple",
  "/canada/np/cnple/lessons",
] as const;

function normalizeOrigin(value: string | undefined): string {
  const raw = value?.trim();
  if (!raw) return DEFAULT_ORIGIN;

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withProtocol).origin.replace(/\/+$/, "");
  } catch {
    return DEFAULT_ORIGIN;
  }
}

function xmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildStaticSitemapXml(origin: string): string {
  const urls = STATIC_SITEMAP_PATHS.map((path) => {
    const loc = `${origin}${path === "/" ? "" : path}`;
    return `  <url><loc>${xmlEscape(loc)}</loc></url>`;
  }).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
}

export function GET(): Response {
  const origin = normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL);
  const xml = buildStaticSitemapXml(origin);

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
    },
  });
}
