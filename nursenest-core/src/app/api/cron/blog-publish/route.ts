import { NextResponse } from "next/server";
import { verifyBlogPublishSchemaColumns } from "@/lib/blog/blog-publish-db-guard";
import { promoteScheduledBlogPosts } from "@/lib/blog/blog-publish-scheduler";
import { revalidateBlogPublishingSurfaces } from "@/lib/blog/blog-revalidate-publishing";

/**
 * Promotes scheduled blog posts whose publishAt has passed to PUBLISHED.
 * Call from your scheduler every 5-10 minutes with Authorization: Bearer CRON_SECRET.
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

  const schema = await verifyBlogPublishSchemaColumns();
  if (!schema.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Blog publish schema mismatch",
        missingColumns: schema.missing,
        checkedAt: schema.checkedAt,
        reason: schema.reason ?? null,
      },
      { status: 503 },
    );
  }

  const result = await promoteScheduledBlogPosts();
  revalidateBlogPublishingSurfaces();
  return NextResponse.json({
    ok: true,
    promoted: result.count,
    considered: result.considered,
    skippedMaxRetries: result.skippedMaxRetries,
    failedCount: result.failures.length,
    failures: result.failures,
    recommendedCronMinutes: "5-10",
  });
}
