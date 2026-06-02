import { requireAdmin } from "@/lib/admin/ensure-admin";
import { buildSeoAuditContext, validateInternalPath } from "@/lib/admin/seo-audit-engine";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const path = typeof (body as { path?: unknown })?.path === "string" ? (body as { path: string }).path.trim() : "";
  if (!path) {
    return NextResponse.json({ error: "path required" }, { status: 400 });
  }

  const ctx = await buildSeoAuditContext(prisma);
  const result = validateInternalPath(path, ctx);
  return NextResponse.json(result);
}
