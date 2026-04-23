import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { buildSchemaSummaryPayload } from "@/lib/blog/blog-seo-automation";
import { parseInternalLinkPlanJson } from "@/lib/blog/blog-image-workflow";
import { generateBlogSEOFromPostRow } from "@/lib/blog/blog-generate-seo";
import {
  clampSerpDescription,
  clampSerpTitle,
  rebuildSeoBundleFromStoredBlogPost,
} from "@/lib/blog/blog-seo-package";
import { prisma } from "@/lib/db";

const bodySchema = z.object({
  /** When true, refresh `seoTitle` / `seoDescription` columns from deterministic SEO (not only the JSON bundle). */
  overwrite: z.boolean().optional(),
});

function faqItemsLen(faqBlock: unknown): number {
  if (!faqBlock || typeof faqBlock !== "object") return 0;
  const items = (faqBlock as { items?: unknown }).items;
  return Array.isArray(items) ? items.length : 0;
}

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }
  const overwrite = parsed.data.overwrite === true;

  const row = await prisma.blogPost.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      seoTitle: true,
      seoDescription: true,
      tags: true,
      category: true,
      exam: true,
      countryTarget: true,
      coverImage: true,
      targetKeyword: true,
      faqBlock: true,
      internalLinkPlan: true,
    },
  });
  if (!row) return NextResponse.json({ error: "Blog post not found" }, { status: 404 });

  const faqCount = faqItemsLen(row.faqBlock);
  const bundle = rebuildSeoBundleFromStoredBlogPost(
    {
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      seoTitle: row.seoTitle,
      seoDescription: row.seoDescription,
      tags: row.tags,
      category: row.category,
      exam: row.exam,
      countryTarget: row.countryTarget,
      coverImage: row.coverImage,
      targetKeyword: row.targetKeyword,
      faqItemCount: faqCount,
    },
    { ignoreStoredMeta: overwrite },
  );

  const planJson = row.internalLinkPlan;
  const base =
    planJson && typeof planJson === "object" && planJson !== null && !Array.isArray(planJson)
      ? { ...(planJson as Record<string, unknown>) }
      : {};
  const parsedPlan = parseInternalLinkPlanJson(row.internalLinkPlan);
  const mergedPlan: Prisma.InputJsonValue = {
    ...base,
    lessons: parsedPlan.lessons,
    imagePlacements: parsedPlan.imagePlacements,
    imageAttachments: parsedPlan.imageAttachments,
    seo: bundle,
  } as Prisma.InputJsonValue;

  const schemaSummary = buildSchemaSummaryPayload(bundle);

  const auto = generateBlogSEOFromPostRow({
    title: row.title,
    slug: row.slug,
    category: row.category,
    tags: row.tags,
    exam: row.exam,
    countryTarget: row.countryTarget,
  });

  const data: Prisma.BlogPostUpdateInput = {
    internalLinkPlan: mergedPlan,
    schemaSummary,
  };
  if (overwrite) {
    const st = clampSerpTitle(auto.seoTitle, 70);
    const sd = clampSerpDescription(auto.metaDescription, 120, 155);
    data.seoTitle = st;
    data.seoDescription = sd;
    data.metaTitleVariant = st;
    data.metaDescriptionVariant = sd;
  }

  const updated = await prisma.blogPost.update({
    where: { id },
    data,
    select: {
      id: true,
      slug: true,
      title: true,
      seoTitle: true,
      seoDescription: true,
      internalLinkPlan: true,
      schemaSummary: true,
      excerpt: true,
      tags: true,
      category: true,
      coverImage: true,
    },
  });

  return NextResponse.json({ ok: true, post: updated, seoBundle: bundle });
}
