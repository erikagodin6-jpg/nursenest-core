import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  createInstitutionalOrganization,
  loadInstitutionalDashboardData,
} from "@/lib/institutional/licensing-admin.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const organizationId = req.nextUrl.searchParams.get("organizationId");
  const data = await loadInstitutionalDashboardData(organizationId);
  return NextResponse.json({ ok: true, data });
}

export async function POST(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;
  if (gate.admin.tier !== "super") {
    return NextResponse.json({ ok: false, error: "Super admin access required." }, { status: 403 });
  }

  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const result = await createInstitutionalOrganization(body ?? {}, gate.admin.userId);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to create institution." },
      { status: 400 },
    );
  }
}
