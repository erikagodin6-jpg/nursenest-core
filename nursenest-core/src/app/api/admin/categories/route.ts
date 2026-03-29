import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
    take: 5000,
  });

  return NextResponse.json({ categories });
}
