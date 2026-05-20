import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { getTaxonomyWriteHealthSummary } from "@/lib/taxonomy/taxonomy-write-health";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const summary = await getTaxonomyWriteHealthSummary(prisma);
  return NextResponse.json(summary);
}
