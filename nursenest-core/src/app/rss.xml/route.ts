import { buildBlogRssFeedResponse } from "@/lib/blog/blog-rss-feed";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET(): Promise<Response> {
  return buildBlogRssFeedResponse();
}
