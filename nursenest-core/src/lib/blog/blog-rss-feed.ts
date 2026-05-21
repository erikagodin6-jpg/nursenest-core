import "server-only";

import { expectedCanonicalBlogPath } from "@/lib/blog/generated-blog-post-publish";
import { getPublishedBlogPostsPage } from "@/lib/blog/safe-blog-queries";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import { normalizeOrigin } from "@/lib/seo/sitemap-static-xml";

const RSS_HEADERS = {
  "Content-Type": "application/rss+xml; charset=utf-8",
  "Cache-Control": "public, max-age=300, s-maxage=900, stale-while-revalidate=3600",
} as const;

function escapeXml(value: string | null | undefined): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rssDate(value: Date | string | null | undefined): string {
  const d = value instanceof Date ? value : value ? new Date(value) : new Date();
  return Number.isFinite(d.getTime()) ? d.toUTCString() : new Date().toUTCString();
}

export async function buildBlogRssFeedResponse(): Promise<Response> {
  const origin = normalizeOrigin(resolveCanonicalSiteOrigin());
  const { posts } = await getPublishedBlogPostsPage(1, 50, undefined, { includeTotal: false });
  const now = new Date();

  const items = posts
    .map((post) => {
      const path = expectedCanonicalBlogPath(post.slug, null);
      const url = `${origin}${path}`;
      const published = post.publishAt ?? post.updatedAt ?? post.createdAt ?? now;
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <description>${escapeXml(post.excerpt)}</description>`,
        post.category ? `      <category>${escapeXml(post.category)}</category>` : "",
        `      <pubDate>${rssDate(published)}</pubDate>`,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const latestDate = posts[0]?.publishAt ?? posts[0]?.updatedAt ?? now;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>NurseNest Blog</title>
    <link>${escapeXml(`${origin}/blog`)}</link>
    <description>Exam-focused nursing education for NCLEX-RN, NCLEX-PN, REx-PN, NP, allied health, ECG, pharmacology, and clinical readiness.</description>
    <language>en</language>
    <lastBuildDate>${rssDate(latestDate)}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    status: 200,
    headers: RSS_HEADERS,
  });
}
