import { BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyBlogPublishSchemaColumns } from "@/lib/blog/blog-publish-db-guard";
import { prisma } from "@/lib/db";
import { classifyBlogCorpus, collectClassificationViolations, isPublishBlockedByTaxonomy } from "@/lib/taxonomy/content-write-taxonomy";

const rowSchema = z.object({
  slug: z.string().min(3).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(3).max(220),
  excerpt: z.string().min(10).max(500),
  body: z.string().min(20),
  category: z.string().max(120).optional().nullable(),
  exam: z.string().max(80).optional().nullable(),
  tags: z.array(z.string().min(1).max(80)).max(20).optional(),
  status: z.enum(["draft", "scheduled", "published"]).optional(),
  scheduledAt: z.string().datetime().optional().nullable(),
  publishedAt: z.string().datetime().optional().nullable(),
});

const payloadSchema = z.object({
  posts: z.array(rowSchema).min(1).max(25),
  dryRun: z.boolean().optional(),
});

function mapStatus(input: z.infer<typeof rowSchema>): BlogPostStatus {
  if (input.status === "published") return BlogPostStatus.PUBLISHED;
  if (input.status === "scheduled" || input.scheduledAt) return BlogPostStatus.SCHEDULED;
  return BlogPostStatus.DRAFT;
}

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
        error: "Blog schema is not ready for imports.",
        missingColumns: schema.missing,
        checkedAt: schema.checkedAt,
        reason: schema.reason ?? null,
      },
      { status: 503 },
    );
  }

  const parsed = payloadSchema.safeParse(await req.json().catch(() => undefined));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const dryRun = parsed.data.dryRun === true;
  const slugSet = new Set<string>();
  for (const row of parsed.data.posts) {
    if (slugSet.has(row.slug)) {
      return NextResponse.json({ error: `Duplicate slug in import payload: ${row.slug}` }, { status: 400 });
    }
    slugSet.add(row.slug);
  }

  let created = 0;
  let updated = 0;
  let skippedPublished = 0;
  let taxonomyHeldAsDraft = 0;
  const skipped: Array<{ slug: string; reason: string }> = [];

  for (const row of parsed.data.posts) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: row.slug },
      select: { id: true, postStatus: true },
    });

    if (existing?.postStatus === BlogPostStatus.PUBLISHED) {
      skippedPublished += 1;
      skipped.push({ slug: row.slug, reason: "already_published" });
      continue;
    }

    let postStatus = mapStatus(row);
    const scheduledAt = row.scheduledAt ? new Date(row.scheduledAt) : null;
    let publishAt: Date | null =
      row.publishedAt != null
        ? new Date(row.publishedAt)
        : scheduledAt != null && postStatus !== BlogPostStatus.DRAFT
          ? scheduledAt
          : null;

    const blogTax = classifyBlogCorpus({
      title: row.title,
      body: row.body,
      category: row.category ?? null,
      tags: row.tags ?? [],
    });
    const taxonomyViolations = collectClassificationViolations(blogTax);
    if (taxonomyViolations.length > 0) {
      skipped.push({ slug: row.slug, reason: `taxonomy_invalid:${taxonomyViolations[0]?.slice(0, 120)}` });
      continue;
    }
    let workflowStatus: BlogWorkflowStatus =
      postStatus === BlogPostStatus.PUBLISHED ? BlogWorkflowStatus.PUBLISHED : BlogWorkflowStatus.GENERATED;
    if (
      (postStatus === BlogPostStatus.PUBLISHED || postStatus === BlogPostStatus.SCHEDULED) &&
      isPublishBlockedByTaxonomy(blogTax)
    ) {
      postStatus = BlogPostStatus.DRAFT;
      publishAt = null;
      workflowStatus = BlogWorkflowStatus.GENERATED;
      taxonomyHeldAsDraft += 1;
    }

    if (dryRun) {
      if (existing) updated += 1;
      else created += 1;
      continue;
    }

    const data = {
      title: row.title,
      excerpt: row.excerpt,
      body: row.body,
      category: blogTax.category,
      exam: row.exam ?? null,
      tags: row.tags ?? [],
      postStatus,
      scheduledAt,
      publishAt,
      workflowStatus,
    };

    if (existing) {
      await prisma.blogPost.update({
        where: { id: existing.id },
        data,
      });
      updated += 1;
    } else {
      await prisma.blogPost.create({
        data: {
          slug: row.slug,
          ...data,
        },
      });
      created += 1;
    }
  }

  return NextResponse.json({
    ok: true,
    dryRun,
    created,
    updated,
    skippedPublished,
    taxonomyHeldAsDraft,
    skipped,
  });
}
