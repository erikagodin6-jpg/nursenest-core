import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { ADMIN_LEARNER_QA_COOKIE } from "@/lib/admin/admin-learner-qa-simulation";
import { productEvent } from "@/lib/observability/product-events";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const jar = await cookies();
  jar.delete(ADMIN_LEARNER_QA_COOKIE);

  productEvent("admin_learner_qa_cleared", {
    userIdPrefix: gate.admin.userId.slice(0, 8),
    admin_learner_qa_simulated: 0,
  });
  safeServerLog("admin_learner_qa", "simulate_cookie_cleared", {
    userIdPrefix: gate.admin.userId.slice(0, 8),
    admin_learner_qa_simulated: 0,
  });

  return NextResponse.json({ ok: true });
}
