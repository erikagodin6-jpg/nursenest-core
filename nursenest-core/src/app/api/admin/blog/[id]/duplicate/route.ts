import { BlogPostStatus, BlogWorkflowStatus, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { seedBlogAdminPublishLog } from "@/lib/blog/blog-admin-publish-log";
import { prisma } from "@/lib/db";

/** Prisma create/update reject raw `null` on optional Json fields; map DB-null reads back to `DbNull`. */
function blogOptionalJsonForCreate(
  value: Prisma.JsonValue | null | undefined,
): Prisma.InputJsonValue | typeof Prisma.DbNull | undefined {
  if (value === undefined) return undefined;
  if (value === null) return Prisma.DbNull;
  return value as Prisma.InputJsonValue;
}

type Props = { params: Promise<{ id: string }> };

async function uniqueBlogSlug(base: string): Promise<string> {
  let candidate = base.replace(/[^a-z0-9-]/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 100);
  if (candidate.length < 3) candidate = "blog-copy";
  let n = 0;
  let trySlug = candidate.slice(0, 120);
  while (await prisma.blogPost.findUnique({ where: { slug: trySlug }, select: { id: true } })) {
    n += 1;
    trySlug = `${candidate}-${n}`.slice(0, 120);
  }
  return trySlug;
}

/**
 * Clone a post into a new DRAFT row (new slug). Admin-only.
 */
export async function POST(_req: Request, { params }: Props) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const src = await prisma.blogPost.findUnique({ where: { id } });
  if (!src) return NextResponse.json({ error: "Blog post not found" }, { status: 404 });

  const newSlug = await uniqueBlogSlug(`${src.slug}-copy`);
  const {
    id: _omitId,
    createdAt: _c,
    updatedAt: _u,
    outlineJson,
    internalLinkPlan,
    faqBlock,
    checklistBlock,
    quickReferenceBlock,
    sourcesJson,
    adminPublishLog: _prevLog,
    ...rest
  } = src;

  const created = await prisma.blogPost.create({
    data: {
      ...rest,
      outlineJson: blogOptionalJsonForCreate(outlineJson),
      internalLinkPlan: blogOptionalJsonForCreate(internalLinkPlan),
      faqBlock: blogOptionalJsonForCreate(faqBlock),
      checklistBlock: blogOptionalJsonForCreate(checklistBlock),
      quickReferenceBlock: blogOptionalJsonForCreate(quickReferenceBlock),
      sourcesJson: blogOptionalJsonForCreate(sourcesJson),
      slug: newSlug,
      title: `${src.title.slice(0, 200)} (copy)`,
      postStatus: BlogPostStatus.DRAFT,
      publishAt: null,
      workflowStatus: BlogWorkflowStatus.GENERATED,
      campaignId: null,
      adminPublishLog: seedBlogAdminPublishLog("duplicated", `Duplicated from ${src.slug} (${src.id})`),
    },
    select: {
      id: true,
      slug: true,
      title: true,
      postStatus: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ post: created }, { status: 201 });
}
