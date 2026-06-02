import { NextResponse } from "next/server";
import type { PrintableAccessSource } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUserAccess } from "@/lib/entitlements/get-user-access";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import {
  evaluatePrintableLearnerAccess,
  userHasPaidPrintableAccess,
} from "@/lib/printables/printable-entitlement";
import { printableDownloadSourceForEvent } from "@/lib/printables/printable-download-source";
import { fetchPrintableAssetBodyFromSpaces } from "@/lib/printables/fetch-printable-asset-from-spaces";
import { validatePrintablePdfMediaAsset } from "@/lib/printables/printable-media-validation";
import { hashPrintablePrivacyPart } from "@/lib/printables/printable-privacy-hash";
import { isPrintableStoreEnabledForLearners } from "@/lib/printables/printable-store-flags";

export const runtime = "nodejs";

const PRIVATE = { headers: mergeSubscriberPrivateCacheHeaders() } as const;

function clientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() ?? "unknown";
  return "unknown";
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isPrintableStoreEnabledForLearners()) {
    return NextResponse.json({ ok: false, code: "printable_store_locked" }, { status: 404, headers: PRIVATE.headers });
  }

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401, headers: PRIVATE.headers });
  }

  const { id } = await ctx.params;
  const product = await prisma.printableProduct.findUnique({
    where: { id },
    include: { fileAsset: { select: { storageKey: true, mimeType: true, filename: true, kind: true } } },
  });
  if (!product) {
    return NextResponse.json({ ok: false, code: "not_found" }, { status: 404, headers: PRIVATE.headers });
  }

  const userAccess = await getUserAccess(userId);
  const gate = evaluatePrintableLearnerAccess(product, userAccess);
  if (!gate.ok && gate.reason !== "purchase_required") {
    const status = gate.reason === "not_published" ? 404 : 403;
    return NextResponse.json({ ok: false, code: gate.reason }, { status, headers: PRIVATE.headers });
  }

  let paidAccessSource: PrintableAccessSource | null = null;
  if (!product.isFree && !product.isPremiumIncluded) {
    const okPaid = await userHasPaidPrintableAccess(userId, product.id);
    if (!okPaid) {
      return NextResponse.json({ ok: false, code: "purchase_required" }, { status: 403, headers: PRIVATE.headers });
    }
    const access = await prisma.printableAccess.findFirst({
      where: { userId, printableProductId: product.id },
      orderBy: { createdAt: "desc" },
      select: { source: true },
    });
    paidAccessSource = access?.source ?? null;
  }

  const ua = req.headers.get("user-agent");
  const source = printableDownloadSourceForEvent({
    isFree: product.isFree,
    isPremiumIncluded: product.isPremiumIncluded,
    paidAccessSource,
  });

  const pdfOk = validatePrintablePdfMediaAsset(product.fileAsset);
  if (!pdfOk.ok) {
    return NextResponse.json({ ok: false, code: pdfOk.code, error: pdfOk.message }, { status: 400, headers: PRIVATE.headers });
  }

  await prisma.printableDownloadEvent.create({
    data: {
      printableProductId: product.id,
      userId,
      pathwayId: userAccess.allowedExam.pathwayId,
      source,
      userAgentHash: hashPrintablePrivacyPart("ua", ua),
      ipHash: hashPrintablePrivacyPart("ip", clientIp(req)),
    },
  });

  const fetched = await fetchPrintableAssetBodyFromSpaces(product.fileAsset.storageKey);
  if (!fetched) {
    return NextResponse.json({ ok: false, code: "file_missing" }, { status: 502, headers: PRIVATE.headers });
  }

  const filename = product.fileAsset.filename || "printable.pdf";
  return new NextResponse(Buffer.from(fetched.body), {
    status: 200,
    headers: {
      ...PRIVATE.headers,
      "Content-Type": fetched.contentType || product.fileAsset.mimeType || "application/pdf",
      "Content-Disposition": `attachment; filename="${filename.replace(/"/g, "")}"`,
      "Cache-Control": "no-store",
    },
  });
}
