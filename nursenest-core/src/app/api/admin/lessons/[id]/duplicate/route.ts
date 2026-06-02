import { NextResponse } from "next/server";
import { ContentStatus } from "@prisma/client";
import { ensureUniqueContentItemSlug } from "@/lib/admin/ensure-unique-content-slug";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { bodyStringFromContentJson, bodyStringToContentJson } from "@/lib/prisma/content-item-body";
import { contentStatusToDb } from "@/lib/prisma/content-status";
import { contentItemLessonTaxonomyFromCorpus } from "@/lib/taxonomy/content-write-taxonomy";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

/** Deep copy lesson as DRAFT with a new slug (ContentItem). */
export async function POST(req: Request, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;

  const src = await prisma.contentItem.findUnique({ where: { id } });
  if (!src || src.type !== "lesson") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const baseSlug = `${src.slug}-copy`;
  const slug = await ensureUniqueContentItemSlug(baseSlug);
  const title = src.title.trim().endsWith("(copy)") ? src.title : `${src.title} (copy)`;

  const bodyStr = bodyStringFromContentJson(src.content);
  const taxonomy = contentItemLessonTaxonomyFromCorpus({
    title,
    summary: src.summary,
    body: bodyStr,
    tags: [...src.tags],
    categoryHint: src.category,
    systemHint: src.bodySystem,
  });
  if (taxonomy.violations.length > 0) {
    return NextResponse.json(
      { error: "Taxonomy classification invalid", violations: taxonomy.violations, code: "taxonomy_invalid" },
      { status: 422 },
    );
  }
  const created = await prisma.contentItem.create({
    data: {
      title,
      slug,
      summary: src.summary,
      type: "lesson",
      content: bodyStringToContentJson(bodyStr),
      tier: src.tier,
      status: contentStatusToDb(ContentStatus.DRAFT),
      regionScope: src.regionScope ?? "BOTH",
      tags: [...src.tags],
      category: src.category,
      bodySystem: taxonomy.bodySystem,
      seoTitle: src.seoTitle,
      seoDescription: src.seoDescription,
      seoKeywords: [...src.seoKeywords],
      primaryKeyword: src.primaryKeyword,
      secondaryKeywords: [...src.secondaryKeywords],
      versionKey: src.versionKey,
      clinicalSafetyReview: src.clinicalSafetyReview,
      autoPublish: false,
    },
  });

  return NextResponse.json({ lesson: created }, { status: 201 });
}
