import { NextRequest, NextResponse } from "next/server";
import { ContentStatus } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";

const createSchema = z.object({
  title: z.string().min(4),
  country: z.enum(["CA", "US"]),
  tier: z.enum(["RPN", "LVN_LPN", "RN", "NP", "ALLIED"]),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  examFamily: z.enum(["NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "ALLIED", "GENERIC"]).optional(),
});

export async function GET(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? "1"));
  const pageSize = Math.min(100, Math.max(10, Number(req.nextUrl.searchParams.get("pageSize") ?? "50")));

  const [total, exams] = await Promise.all([
    prisma.exam.count(),
    prisma.exam.findMany({
      select: { id: true, title: true, country: true, tier: true, status: true, examFamily: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({ page, pageSize, total, exams });
}

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const exam = await prisma.exam.create({
    data: { ...parsed.data, examFamily: parsed.data.examFamily ?? "GENERIC" },
  });
  return NextResponse.json({ exam }, { status: 201 });
}
