import { JobStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { enqueueJob } from "@/lib/jobs/enqueue";
import { prisma } from "@/lib/db";
import { API_LIST_PAGE_SIZE_HARD_MAX, parseBoundedPageSize } from "@/lib/api/api-pagination-limits";

const DEFAULT_TAKE = 50;
const MAX_OFFSET = 20_000;

function parseJobStatus(raw: string | null): JobStatus | undefined {
  if (!raw) return undefined;
  return Object.values(JobStatus).includes(raw as JobStatus) ? (raw as JobStatus) : undefined;
}

export async function GET(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const takeParsed = parseBoundedPageSize(req.nextUrl.searchParams.get("take"), {
    min: 1,
    max: API_LIST_PAGE_SIZE_HARD_MAX,
    default: DEFAULT_TAKE,
  }, "take");
  if (!takeParsed.ok) {
    return NextResponse.json(
      {
        error: takeParsed.error.message,
        code: takeParsed.error.code,
        ...(takeParsed.error.maxPageSize !== undefined ? { maxTake: takeParsed.error.maxPageSize } : {}),
      },
      { status: 400 },
    );
  }
  const take = takeParsed.pageSize;
  const offset = Math.min(MAX_OFFSET, Math.max(0, Number(req.nextUrl.searchParams.get("offset") ?? "0")));
  const status = parseJobStatus(req.nextUrl.searchParams.get("status"));
  const typePrefix = req.nextUrl.searchParams.get("typePrefix")?.trim();

  const where: Prisma.BackgroundJobWhereInput = {
    ...(status ? { status } : {}),
    ...(typePrefix ? { type: { startsWith: typePrefix } } : {}),
  };

  const jobs = await prisma.backgroundJob.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: offset,
    take,
    select: {
      id: true,
      type: true,
      status: true,
      attempts: true,
      maxAttempts: true,
      lastError: true,
      scheduledFor: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    jobs,
    take,
    offset,
    maxTake: API_LIST_PAGE_SIZE_HARD_MAX,
    maxOffset: MAX_OFFSET,
    filters: { status: status ?? null, typePrefix: typePrefix ?? null },
  });
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
