import { NextResponse } from "next/server";
import { type Prisma } from "@prisma/client";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin/ensure-admin";
import { revalidateSurfacesAfterPathwayLessonMutation } from "@/lib/admin/revalidate-pathway-lesson-surfaces";
import { prisma } from "@/lib/db";
import { invalidatePathwayLessonPaidStaleCache } from "@/lib/lessons/invalidate-pathway-lesson-paid-stale-cache";
import { computeStructuralPublicCompleteFromDbRow } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

const patchSchema = z
  .object({
    body: z.string().max(80_000),
    heading: z.string().min(1).max(240).optional(),
    allowEmpty: z.boolean().optional(),
  })
  .strict();

function sanitizeLessonSectionBody(input: string): string {
  return input
    .replace(/\r\n?/g, "\n")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .trim();
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string; sectionId: string }> },
) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id, sectionId } = await ctx.params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const cleanBody = sanitizeLessonSectionBody(parsed.data.body);
  if (!cleanBody && parsed.data.allowEmpty !== true) {
    return NextResponse.json(
      { error: "Section body cannot be empty unless allowEmpty is true", code: "empty_section_body" },
      { status: 422 },
    );
  }

  const existing = await prisma.pathwayLesson.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const rawSections = Array.isArray(existing.sections) ? (existing.sections as unknown[]) : [];
  const index = rawSections.findIndex((section) => {
    if (!isObjectRecord(section)) return false;
    return String(section.id ?? "") === sectionId;
  });

  if (index < 0) {
    return NextResponse.json(
      { error: "Section not found on this lesson", code: "section_not_found" },
      { status: 404 },
    );
  }

  const nextSections = rawSections.map((section, i) => {
    if (i !== index || !isObjectRecord(section)) return section;
    return {
      ...section,
      ...(parsed.data.heading ? { heading: parsed.data.heading.trim() } : {}),
      body: cleanBody,
    };
  });

  const structuralPublicComplete = computeStructuralPublicCompleteFromDbRow({
    ...existing,
    sections: nextSections as Prisma.JsonValue,
  });

  const updated = await prisma.pathwayLesson.update({
    where: { id },
    data: {
      sections: nextSections as Prisma.InputJsonValue,
      structuralPublicComplete,
      content_version: { increment: 1 },
      published_by_user_id: gate.admin.userId,
    },
  });

  invalidatePathwayLessonPaidStaleCache(updated.id);
  revalidateSurfacesAfterPathwayLessonMutation({
    pathwayLessonId: updated.id,
    pathwayId: updated.pathwayId,
    slug: updated.slug,
    indexingImpact: false,
  });

  safeServerLog("admin_pathway_lesson_inline_edit", "section_saved", {
    pathwayLessonId: updated.id,
    pathwayId: updated.pathwayId,
    sectionId,
    adminUserId: gate.admin.userId.slice(0, 8),
  });

  return NextResponse.json({
    ok: true,
    section: nextSections[index],
    lesson: {
      id: updated.id,
      updatedAt: updated.updatedAt,
      contentVersion: updated.content_version,
      structuralPublicComplete: updated.structuralPublicComplete,
    },
  });
}
