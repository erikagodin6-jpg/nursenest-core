import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { contentBulkBlogBodySchema } from "@/lib/admin/content-bulk/content-bulk-request-body";
import { BLOG_BULK_CHUNK_SIZE } from "@/lib/admin/content-bulk/blog-bulk-schema";
import { countBlogBulkTargets, resolveBlogBulkTargets } from "@/lib/admin/content-bulk/resolve-blog-bulk-ids";
import { prisma } from "@/lib/db";

const utilityPreviewSchema = z.object({
  kind: z.enum(["sitemap_revalidate", "question_stem_hashes"]),
});

const bodySchema = z.union([
  z.object({ scope: z.literal("blog"), blog: contentBulkBlogBodySchema }),
  z.object({ scope: z.literal("utility"), utility: utilityPreviewSchema }),
]);

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const body = parsed.data;
  if (body.scope === "utility") {
    if (body.utility.kind === "sitemap_revalidate") {
      return NextResponse.json({
        scope: "utility",
        kind: "sitemap_revalidate",
        dryRun: true,
        summary: "Queues a single background job that calls revalidateBlogPublishingSurfaces() (blog + related marketing paths).",
        estimatedJobs: 1,
      });
    }
    const pendingStem = await prisma.examQuestion.count({ where: { stemHash: null } });
    return NextResponse.json({
      scope: "utility",
      kind: "question_stem_hashes",
      dryRun: true,
      summary: "Queues the existing stem-hash recompute worker (processes up to 500 rows per job run).",
      examQuestionsMissingStemHash: pendingStem,
      estimatedJobs: 1,
    });
  }

  const { operation, filters, taxonomy } = body.blog;
  const totalMatching = await countBlogBulkTargets(filters);
  const rows = await resolveBlogBulkTargets(filters);
  const chunks = Math.max(1, Math.ceil(rows.length / BLOG_BULK_CHUNK_SIZE));

  const warnings: string[] = [];
  if (operation === "blog_seo_columns_force") {
    warnings.push("seo_columns_force overwrites manual seoTitle / seoDescription / meta variants.");
  }
  if (operation === "blog_publish" || operation === "blog_unpublish_draft") {
    warnings.push("Publishing changes are immediate for matched posts (no draft preview in this tool).");
  }
  if (totalMatching > rows.length) {
    warnings.push(`Matched ${totalMatching} posts; preview and run are capped at ${rows.length} (maxPosts / default cap).`);
  }

  return NextResponse.json({
    scope: "blog",
    dryRun: true,
    operation,
    taxonomy: taxonomy ?? null,
    totalMatching,
    willProcess: rows.length,
    chunkSize: BLOG_BULK_CHUNK_SIZE,
    estimatedChunkJobs: chunks,
    sample: rows.slice(0, 25),
    warnings,
  });
}
