import { NextResponse } from "next/server";
import { ContentStatus } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { contentStatusToDb } from "@/lib/prisma/content-status";

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
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const body = parsed.data;
  if (body.action === "delete") {
    const res = await prisma.examQuestion.deleteMany({ where: { id: { in: body.ids } } });
    return NextResponse.json({ deleted: res.count });
  }

  if (body.action === "set_status") {
    const res = await prisma.examQuestion.updateMany({
      where: { id: { in: body.ids } },
      data: { status: contentStatusToDb(body.status) },
    });
    return NextResponse.json({ updated: res.count });
  }

  const rows = await prisma.examQuestion.findMany({
    where: { id: { in: body.ids } },
    select: { id: true, tags: true },
  });

  let updated = 0;
  for (const r of rows) {
    const next =
      body.mode === "replace" ? body.tags : Array.from(new Set([...r.tags, ...body.tags]));
    await prisma.examQuestion.update({ where: { id: r.id }, data: { tags: next } });
    updated += 1;
  }

  return NextResponse.json({ updated });
}
