import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { readAdminLearnerQaPublicState } from "@/lib/admin/admin-learner-qa-simulation";

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const state = await readAdminLearnerQaPublicState(gate.admin.userId);
  return NextResponse.json({ ok: true, state });
}
