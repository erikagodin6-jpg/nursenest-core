import { NextResponse } from "next/server";
import { ContentStatus } from "@prisma/client";
import { z } from "zod";
import { ensureUniqueContentItemSlug } from "@/lib/admin/ensure-unique-content-slug";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { bodyStringFromContentJson, bodyStringToContentJson } from "@/lib/prisma/content-item-body";
import { contentStatusToDb } from "@/lib/prisma/content-status";
import { tierCodeToContentItemTier } from "@/lib/prisma/exam-question-maps";
import { contentItemLessonTaxonomyFromCorpus } from "@/lib/taxonomy/content-write-taxonomy";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  targetTier: z.enum(["RPN", "LVN_LPN", "RN", "NP", "ALLIED"]),
  targetCountry: z.enum(["CA", "US"]),
  /** Optional suffix for title (e.g. " — US RN") */
  titleSuffix: z.string().max(120).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Clone a lesson for another pathway (tier) and/or country (region scope).
 * New row is always DRAFT for editorial review.
 */
export async function POST(req: Request, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;

  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }
  const { targetTier, targetCountry, titleSuffix } = parsed.data;

  const src = await prisma.contentItem.findUnique({ where: { id } });
  if (!src || src.type !== "lesson") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const tierDb = tierCodeToContentItemTier(targetTier);
  const region = targetCountry === "CA" ? "CA_ONLY" : "US_ONLY";
  const cc = targetCountry.toLowerCase();
  const slugBase = `${src.slug}-${cc}-${tierDb}`;
  const slug = await ensureUniqueContentItemSlug(slugBase);
  const title = `${src.title}${titleSuffix ?? ` (${targetCountry} · ${targetTier.replace("_", "/")})`}`;

  const bodyStr = bodyStringFromContentJson(src.content);
  const versionKey = src.versionKey?.length
    ? `${src.versionKey}:${tierDb}:${cc}`
    : `adapted:${src.id.slice(0, 8)}:${tierDb}:${cc}`;

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
      tier: tierDb,
      status: contentStatusToDb(ContentStatus.DRAFT),
      regionScope: region,
      tags: [...src.tags],
      category: src.category,
      bodySystem: taxonomy.bodySystem,
      seoTitle: src.seoTitle,
      seoDescription: src.seoDescription,
      seoKeywords: [...src.seoKeywords],
      primaryKeyword: src.primaryKeyword,
      secondaryKeywords: [...src.secondaryKeywords],
      versionKey,
      clinicalSafetyReview: false,
      autoPublish: false,
    },
  });

  return NextResponse.json({ lesson: created, adaptedFromId: src.id }, { status: 201 });
}
