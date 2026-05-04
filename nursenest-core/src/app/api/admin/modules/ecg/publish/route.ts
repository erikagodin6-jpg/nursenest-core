import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { assertEcgModuleCanPublish, summarizeEcgModuleGates } from "@/lib/ecg-module/ecg-module-readiness";
import { setEcgModuleStatus } from "@/lib/ecg-module/ecg-module-status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  try {
    const readiness = await assertEcgModuleCanPublish();
    const status = await setEcgModuleStatus("published");
    return NextResponse.json({ ok: true, status, readiness });
  } catch (error) {
    const readiness = (error as { readiness?: Awaited<ReturnType<typeof assertEcgModuleCanPublish>> }).readiness;
    const failures = readiness ? summarizeEcgModuleGates(readiness) : [(error as Error).message];
    return NextResponse.json({ ok: false, code: "ecg_publish_blocked", failures, readiness }, { status: 409 });
  }
}
