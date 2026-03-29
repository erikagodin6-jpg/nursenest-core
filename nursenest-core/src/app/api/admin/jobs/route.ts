import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { enqueueJob } from "@/lib/jobs/enqueue";
import { prisma } from "@/lib/db";

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const jobs = await prisma.backgroundJob.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      type: true,
      status: true,
      attempts: true,
      maxAttempts: true,
      lastError: true,
      scheduledFor: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ jobs });
}

const enqueueSchema = z.object({
  type: z.string().min(2),
  payload: z.any().default({}),
});

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const parsed = enqueueSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const job = await enqueueJob(parsed.data.type, parsed.data.payload as Prisma.InputJsonValue);
  return NextResponse.json({ job }, { status: 201 });
}
