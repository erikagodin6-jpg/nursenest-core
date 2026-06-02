import type { LegacyBlogPostExportV1 } from "@/lib/legacy/legacy-blog-post-export-types";
import { LEGACY_BLOG_POST_EXPORT_VERSION } from "@/lib/legacy/legacy-blog-post-export-types";

const MAX_PAGE_FETCHES = 50;
const FETCH_TIMEOUT_MS = 12_000;

async function fetchText(url: string): Promise<string | null> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ac.signal,
      headers: { "user-agent": "NurseNestLegacyBlogCollector/1.0" },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function extractLocsFromSitemapXml(xml: string): string[] {
  const locs: string[] = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const loc = m[1]?.trim();
    if (loc) locs.push(loc);
  }
  return locs;
}

function titleFromHtml(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]{1,300})<\/title>/i);
  return m?.[1]?.replace(/\s+/g, " ").trim() || null;
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function blogSlugFromPathname(pathname: string): string | null {
  const segs = pathname.split("/").filter(Boolean);
  const bi = segs.indexOf("blog");
  if (bi < 0 || bi >= segs.length - 1) return null;
  const after = segs.slice(bi + 1);
  const head = after[0]?.toLowerCase() ?? "";
  if (["tag", "tags", "category", "categories", "sitemap", "rss", "feed", "page"].includes(head)) {
    return null;
  }
  const slug = after[0];
  if (!slug || slug.length > 200) return null;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)) return null;
  return slug.toLowerCase();
}

/**
 * Best-effort crawl when no JSON export exists: discover `/blog/{slug}` URLs from sitemap and fetch titles + a short text body.
 */
export async function collectLegacyBlogPostsFromSite(baseUrl: string): Promise<LegacyBlogPostExportV1 | null> {
  const origin = baseUrl.replace(/\/$/, "");
  const locs: string[] = [];
  for (const sm of [`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`]) {
    const xml = await fetchText(sm);
    if (xml && xml.includes("<loc>")) {
      locs.push(...extractLocsFromSitemapXml(xml));
      break;
    }
  }

  const candidates = locs.filter((u) => {
    try {
      const slug = blogSlugFromPathname(new URL(u).pathname);
      return slug != null;
    } catch {
      return false;
    }
  });

  const seen = new Set<string>();
  const blogPosts: LegacyBlogPostExportV1["blogPosts"] = [];
  let fetches = 0;

  for (const url of candidates) {
    if (fetches >= MAX_PAGE_FETCHES) break;
    let pathname: string;
    try {
      pathname = new URL(url).pathname;
    } catch {
      continue;
    }
    const slug = blogSlugFromPathname(pathname);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    fetches += 1;
    const html = (await fetchText(url)) ?? "";
    const title = titleFromHtml(html) || slug.replace(/-/g, " ");
    const bodyText = stripTags(html).slice(0, 12_000);
    const body =
      bodyText.length > 80
        ? `<p>${bodyText.slice(0, 8000)}</p>`
        : `<p>Legacy crawl recovered minimal body for <code>${slug}</code>. Re-import from full export when available.</p>`;

    blogPosts.push({
      legacyId: `crawl:${slug}`,
      title,
      slug,
      body,
      excerpt: bodyText.slice(0, 280),
      category: null,
      tags: [],
      template: null,
      legacySource: "legacy-site-crawl",
      legacyUrl: url,
      status: "published",
      publishAt: new Date().toISOString(),
    });
  }

  if (blogPosts.length === 0) return null;
  return { version: LEGACY_BLOG_POST_EXPORT_VERSION, blogPosts };
}
