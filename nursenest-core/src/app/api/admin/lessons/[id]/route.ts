import { NextResponse } from "next/server";
import { ContentStatus } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { validateLessonForPublish } from "@/lib/content/publish-validation";
import { prisma } from "@/lib/db";
import { bodyStringFromContentJson, bodyStringToContentJson } from "@/lib/prisma/content-item-body";
import { contentStatusToDb } from "@/lib/prisma/content-status";
import { tierCodeToContentItemTier } from "@/lib/prisma/exam-question-maps";

const patchSchema = z
  .object({
    title: z.string().min(4).optional(),
    slug: z.string().min(4).optional(),
    summary: z.string().min(10).optional(),
    body: z.string().min(20).optional(),
    country: z.enum(["CA", "US"]).optional(),
    tier: z.enum(["RPN", "LVN_LPN", "RN", "NP", "ALLIED"]).optional(),
    categoryId: z.string().optional(),
    status: z.nativeEnum(ContentStatus).optional(),
    examFamily: z.enum(["NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "ALLIED", "GENERIC"]).optional(),
    difficulty: z.enum(["FOUNDATION", "INTERMEDIATE", "ADVANCED"]).nullable().optional(),
    topicTag: z.string().nullable().optional(),
    systemTag: z.string().nullable().optional(),
    tags: z.array(z.string()).optional(),
    sourceNotes: z.string().nullable().optional(),
  })
  .strict();

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;

  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const existing = await prisma.contentItem.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const d = parsed.data;
  const bodyStr = d.body ?? bodyStringFromContentJson(existing.content);
  const merged = {
    title: d.title ?? existing.title,
    summary: d.summary ?? existing.summary ?? "",
    body: bodyStr,
  };

  const nextStatus = d.status ? contentStatusToDb(d.status) : existing.status;
  if (d.status === ContentStatus.PUBLISHED) {
    const v = validateLessonForPublish({ title: merged.title, summary: merged.summary, body: merged.body });
    if (!v.ok) return NextResponse.json({ error: "Publish validation failed", reasons: v.reasons }, { status: 400 });
  }

  let category = existing.category;
  if (d.categoryId) {
    const cat = await prisma.category.findUnique({ where: { id: d.categoryId } });
    category = cat?.name ?? cat?.slug ?? category;
  }

  const lesson = await prisma.contentItem.update({
    where: { id },
    data: {
      title: d.title,
      slug: d.slug,
      summary: d.summary,
      content: d.body !== undefined ? bodyStringToContentJson(d.body) : undefined,
      tier: d.tier ? tierCodeToContentItemTier(d.tier) : undefined,
      status: d.status ? nextStatus : undefined,
      regionScope: d.country ? (d.country === "CA" ? "CA_ONLY" : "US_ONLY") : undefined,
      tags: d.tags,
      category: category ?? undefined,
      bodySystem: d.systemTag ?? d.topicTag ?? undefined,
    },
  });

  return NextResponse.json({ lesson });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;
  await prisma.contentItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
