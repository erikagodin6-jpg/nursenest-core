import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentEcgModuleAccess, ecgApiDeniedResponse } from "@/lib/ecg-module/ecg-module.server";
import { ecgWorksheetCategoryWhere, normalizeEcgLevel } from "@/lib/ecg-module/ecg-module-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const access = await getCurrentEcgModuleAccess();
  if (!access.ok) return ecgApiDeniedResponse(access.reason);

  const url = new URL(req.url);
  const level = normalizeEcgLevel(url.searchParams.get("level"));
  if (!level) return NextResponse.json({ ok: false, code: "invalid_ecg_level" }, { status: 400 });
  const rows = await prisma.printableProduct.findMany({
    where: {
      category: { in: ecgWorksheetCategoryWhere(level) },
    },
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    take: 40,
    select: {
      id: true,
      title: true,
      description: true,
    },
  });

  const items = rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    accessState: "admin_preview" as const,
    previewBlurred: false,
    downloadUrl: null,
  }));

  return NextResponse.json({ ok: true, items });
}
