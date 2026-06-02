import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { getAdvancedEcgModuleAdminSnapshot } from "@/lib/advanced-ecg/advanced-ecg-module-admin";
import { setAdvancedEcgModuleStatus } from "@/lib/advanced-ecg/advanced-ecg-module-status";

const bodySchema = z.object({
  status: z.enum(["draft", "qa_preview", "published"]),
});

export async function POST(req: Request) {
  await requireAdmin();
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid status payload." }, { status: 400 });
  }

  if (parsed.data.status === "published") {
    const snapshot = await getAdvancedEcgModuleAdminSnapshot();
    if (!snapshot.canPublish) {
      return NextResponse.json(
        { ok: false, failures: snapshot.publishFailures },
        { status: 400 },
      );
    }
  }

  const status = await setAdvancedEcgModuleStatus(parsed.data.status);
  return NextResponse.json({ ok: true, status });
}
