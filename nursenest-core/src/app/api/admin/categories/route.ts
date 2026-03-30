import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";

const MAX_PAGE_SIZE = 500;
const MAX_PAGE = 200;

export async function GET(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const page = Math.max(1, Math.min(MAX_PAGE, Number(req.nextUrl.searchParams.get("page") ?? "1")));
  const pageSize = Math.max(
    1,
    Math.min(MAX_PAGE_SIZE, Number(req.nextUrl.searchParams.get("pageSize") ?? String(MAX_PAGE_SIZE))),
  );

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.category.count(),
  ]);

  return NextResponse.json({
    categories,
    page,
    pageSize,
    total,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
    maxPageSize: MAX_PAGE_SIZE,
  });
}
