import { NextResponse } from "next/server";
import { ContentStatus } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";

const patchSchema = z
  .object({
    title: z.string().min(4).optional(),
    country: z.enum(["CA", "US"]).optional(),
    tier: z.enum(["RPN", "LVN_LPN", "RN", "NP", "ALLIED"]).optional(),
    status: z.nativeEnum(ContentStatus).optional(),
    examFamily: z.enum(["NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "ALLIED", "GENERIC"]).optional(),
  })
  .strict();

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;
  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const exam = await prisma.exam.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ exam });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;
  await prisma.exam.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
