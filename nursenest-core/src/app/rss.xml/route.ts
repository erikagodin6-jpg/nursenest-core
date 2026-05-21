import { buildBlogRssFeedResponse } from "@/lib/blog/blog-rss-feed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  return buildBlogRssFeedResponse();
}
