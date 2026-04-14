import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { createDemoUser } from "@/lib/demo-users/create-demo-user";
import { prisma } from "@/lib/db";

const postBodySchema = z.object({
  pathwayId: z.string().min(1),
  completedLessonCount: z.coerce.number().int().min(0).max(500).optional(),
  lessonCompletionPercent: z.coerce.number().min(0).max(100).optional(),
  readinessScoreTarget: z.coerce.number().min(0).max(100).optional(),
});

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const users = await prisma.user.findMany({
    where: { isDemoUser: true },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      email: true,
      name: true,
      tier: true,
      country: true,
      learnerPath: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = postBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = await createDemoUser(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.message, code: result.code }, { status: 400 });
  }

  return NextResponse.json(result);
}

const deleteQuerySchema = z.object({
  userId: z.string().min(1),
});

export async function DELETE(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const url = new URL(req.url);
  const parsed = deleteQuerySchema.safeParse({ userId: url.searchParams.get("userId") ?? "" });
  if (!parsed.success) {
    return NextResponse.json({ error: "userId query required" }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({
    where: { id: parsed.data.userId, isDemoUser: true },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Demo user not found" }, { status: 404 });
  }

  await prisma.user.delete({ where: { id: existing.id } });
  return NextResponse.json({ ok: true });
}
