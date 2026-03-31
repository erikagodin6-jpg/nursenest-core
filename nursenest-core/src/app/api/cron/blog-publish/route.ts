import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { promoteScheduledBlogPosts } from "@/lib/blog/blog-publish-scheduler";

/**
 * Promotes scheduled blog posts whose publishAt has passed to PUBLISHED.
 * Call from your scheduler (e.g. hourly) with Authorization: Bearer CRON_SECRET.
 * Public pages already show SCHEDULED posts when publishAt <= now; this keeps status aligned for ops.
 */
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const { count } = await promoteScheduledBlogPosts();
  revalidatePath("/blog");
  revalidatePath("/blog", "layout");
  return NextResponse.json({ ok: true, promoted: count });
}
