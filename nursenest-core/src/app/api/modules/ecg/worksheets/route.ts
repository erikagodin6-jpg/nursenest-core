import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserAccess } from "@/lib/entitlements/get-user-access";
import { getCurrentEcgModuleAccess, ecgApiDeniedResponse } from "@/lib/ecg-module/ecg-module.server";
import { ecgWorksheetCategoryWhere, normalizeEcgLevel } from "@/lib/ecg-module/ecg-module-config";
import {
  evaluatePrintableLearnerAccess,
  userHasPaidPrintableAccess,
} from "@/lib/printables/printable-entitlement";
import { isPrintableStoreEnabledForLearners } from "@/lib/printables/printable-store-flags";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const access = await getCurrentEcgModuleAccess();
  if (!access.ok) return ecgApiDeniedResponse(access.reason);
  if (!isPrintableStoreEnabledForLearners()) {
    return NextResponse.json({ ok: false, code: "printable_store_locked" }, { status: 404 });
  }

  const url = new URL(req.url);
  const level = normalizeEcgLevel(url.searchParams.get("level"));
  if (!level) return NextResponse.json({ ok: false, code: "invalid_ecg_level" }, { status: 400 });

  const userAccess = await getUserAccess(access.userId);
  const rows = await prisma.printableProduct.findMany({
    where: {
      isPublished: true,
      category: { in: ecgWorksheetCategoryWhere(level) },
    },
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    take: 40,
    select: {
      id: true,
      title: true,
      description: true,
      isPublished: true,
      isFree: true,
      isPremiumIncluded: true,
      priceCents: true,
      pathwayId: true,
    },
  });

  const items = await Promise.all(
    rows.map(async (row) => {
      const gate = evaluatePrintableLearnerAccess(row, userAccess);
      let unlocked = gate.ok;
      if (!unlocked && !gate.ok && gate.reason === "purchase_required") {
        unlocked = await userHasPaidPrintableAccess(access.userId, row.id);
      }
      const accessState = row.isFree
        ? "free"
        : row.isPremiumIncluded && unlocked
          ? "premium_included"
          : unlocked
            ? "unlocked"
            : "locked";
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        accessState,
        previewBlurred: !unlocked,
        downloadUrl: unlocked ? `/api/printables/${encodeURIComponent(row.id)}/download` : null,
      };
    }),
  );

  return NextResponse.json({ ok: true, items });
}
