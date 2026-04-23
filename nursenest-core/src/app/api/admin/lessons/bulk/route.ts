import { NextResponse } from "next/server";
import { ContentStatus } from "@prisma/client";
import { z } from "zod";
import { governContentItemLessonPublish, validateLessonForPublish } from "@/lib/content/publish-validation";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { takeForIdIn } from "@/lib/db/prisma-find-many-bounds";
import { bodyStringFromContentJson } from "@/lib/prisma/content-item-body";
import { contentStatusToDb } from "@/lib/prisma/content-status";
import { contentItemLessonTaxonomyFromCorpus } from "@/lib/taxonomy/content-write-taxonomy";

export const dynamic = "force-dynamic";

const schema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("set_status"),
    ids: z.array(z.string()).min(1).max(500),
    status: z.nativeEnum(ContentStatus),
  }),
  z.object({
    action: z.literal("tag"),
    ids: z.array(z.string()).min(1).max(500),
    tags: z.array(z.string()),
    mode: z.enum(["replace", "append"]).default("replace"),
  }),
  z.object({
    action: z.literal("delete"),
    ids: z.array(z.string()).min(1).max(200),
  }),
]);

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const body = parsed.data;
  if (body.action === "delete") {
    const res = await prisma.contentItem.deleteMany({ where: { id: { in: body.ids }, type: "lesson" } });
    return NextResponse.json({ deleted: res.count });
  }

  if (body.action === "set_status") {
    const rows = await prisma.contentItem.findMany({
      where: { id: { in: body.ids }, type: "lesson" },
      select: { id: true, title: true, summary: true, content: true, tags: true, category: true },
      take: takeForIdIn(body.ids, 500),
    });
    const blocked: { id: string; reasons: string[] }[] = [];
    let updated = 0;
    for (const row of rows) {
      const bodyStr = bodyStringFromContentJson(row.content);
      const taxonomy = contentItemLessonTaxonomyFromCorpus({
        title: row.title,
        summary: row.summary,
        body: bodyStr,
        tags: row.tags ?? [],
        categoryHint: row.category,
      });
      if (taxonomy.violations.length > 0) {
        blocked.push({ id: row.id, reasons: taxonomy.violations });
        continue;
      }
      if (body.status === ContentStatus.PUBLISHED) {
        if (!taxonomy.publishable) {
          blocked.push({
            id: row.id,
            reasons: [
              `taxonomy_publish_blocked: domain=${taxonomy.classification.domain} category=${taxonomy.classification.category}`,
            ],
          });
          continue;
        }
        const v = validateLessonForPublish({
          title: row.title,
          summary: row.summary ?? "",
          body: bodyStr,
        });
        if (!v.ok) {
          blocked.push({ id: row.id, reasons: v.reasons });
          continue;
        }
        const gov = governContentItemLessonPublish(
          { title: row.title, summary: row.summary ?? "", body: bodyStr },
          { acknowledgeBelowQualityBar: false },
        );
        if (!gov.ok) {
          blocked.push({ id: row.id, reasons: gov.reasons });
          continue;
        }
      }
      await prisma.contentItem.update({
        where: { id: row.id },
        data: { status: contentStatusToDb(body.status), bodySystem: taxonomy.bodySystem },
      });
      updated += 1;
    }
    if (blocked.length > 0) {
      return NextResponse.json(
        {
          error:
            body.status === ContentStatus.PUBLISHED
              ? "Bulk publish blocked: some rows fail editorial policy or taxonomy gate"
              : "Bulk status blocked: some rows have invalid taxonomy classification",
          blocked,
        },
        { status: 422 },
      );
    }
    return NextResponse.json({ updated });
  }

  const rows = await prisma.contentItem.findMany({
    where: { id: { in: body.ids }, type: "lesson" },
    select: { id: true, title: true, summary: true, content: true, tags: true, category: true },
    take: takeForIdIn(body.ids, 500),
  });

  let updated = 0;
  for (const r of rows) {
    const next =
      body.mode === "replace" ? body.tags : Array.from(new Set([...r.tags, ...body.tags]));
    const bodyStr = bodyStringFromContentJson(r.content);
    const taxonomy = contentItemLessonTaxonomyFromCorpus({
      title: r.title,
      summary: r.summary,
      body: bodyStr,
      tags: next,
      categoryHint: r.category,
    });
    if (taxonomy.violations.length > 0) {
      return NextResponse.json(
        { error: "Taxonomy classification invalid after tag merge", id: r.id, violations: taxonomy.violations },
        { status: 422 },
      );
    }
    await prisma.contentItem.update({
      where: { id: r.id },
      data: { tags: next, bodySystem: taxonomy.bodySystem },
    });
    updated += 1;
  }

  return NextResponse.json({ updated });
}
