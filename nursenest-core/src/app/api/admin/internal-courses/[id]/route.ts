import { NextResponse } from "next/server";
import { InternalCourseStatus } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const patchSchema = z
  .object({
    status: z.nativeEnum(InternalCourseStatus),
  })
  .strict();

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const existing = await prisma.internalCourse.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.internalCourse.update({
    where: { id },
    data: { status: parsed.data.status },
    select: {
      id: true,
      code: true,
      title: true,
      status: true,
      pathwayIds: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    course: {
      ...updated,
      updatedAt: updated.updatedAt.toISOString(),
    },
  });
}
