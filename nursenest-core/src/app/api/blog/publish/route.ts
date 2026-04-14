import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { verifyBlogPublishSchemaColumns } from "@/lib/blog/blog-publish-db-guard";
import { promoteScheduledBlogPosts } from "@/lib/blog/blog-publish-scheduler";

/**
 * Lightweight publish endpoint for external schedulers.
 * Run this endpoint every 5-10 minutes.
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
        error: "Blog schema is not ready for publishing.",
        missingColumns: schema.missing,
        checkedAt: schema.checkedAt,
        reason: schema.reason ?? null,
      },
      { status: 503 },
    );
  }

  const result = await promoteScheduledBlogPosts();
  revalidatePath("/blog");
  revalidatePath("/blog", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/sitemaps/blog.xml");
  revalidatePath("/sitemaps/localized-blog.xml");

  return NextResponse.json({
    ok: true,
    promoted: result.count,
    considered: result.considered,
    skippedMaxRetries: result.skippedMaxRetries,
    failedCount: result.failures.length,
    failures: result.failures,
  });
}
