import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  assignInstitutionSeat,
  removeInstitutionSeat,
} from "@/lib/institutional/licensing-admin.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ institutionId: string }> },
) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;
  if (gate.admin.tier !== "super") {
    return NextResponse.json({ ok: false, error: "Super admin access required." }, { status: 403 });
  }

  const { institutionId } = await params;
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const action = typeof body?.action === "string" ? body.action : "assign";
    if (action === "remove") {
      const userId = typeof body?.userId === "string" ? body.userId : "";
      if (!userId) return NextResponse.json({ ok: false, error: "userId is required." }, { status: 400 });
      await removeInstitutionSeat({ organizationId: institutionId, userId, actorUserId: gate.admin.userId });
      return NextResponse.json({ ok: true });
    }

    const result = await assignInstitutionSeat({
      organizationId: institutionId,
      email: body?.email,
      role: body?.role,
      actorUserId: gate.admin.userId,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to update institution seats." },
      { status: 400 },
    );
  }
}
