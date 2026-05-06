import { PrintableDownloadSource } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { fetchPrintableAssetBodyFromSpaces } from "@/lib/printables/fetch-printable-asset-from-spaces";
import { validatePrintablePdfMediaAsset } from "@/lib/printables/printable-media-validation";
import { hashPrintablePrivacyPart } from "@/lib/printables/printable-privacy-hash";
import { assertPrintableAdminSurface } from "@/lib/printables/printable-admin-gate";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";

export const runtime = "nodejs";

const PRIVATE = { headers: mergeSubscriberPrivateCacheHeaders() } as const;

function clientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() ?? "unknown";
  return "unknown";
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const surface = assertPrintableAdminSurface();
  if (surface) return surface;
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const product = await prisma.printableProduct.findUnique({
    where: { id },
    include: { fileAsset: { select: { storageKey: true, mimeType: true, filename: true, kind: true } } },
  });
  if (!product) return NextResponse.json({ ok: false, code: "not_found" }, { status: 404, headers: PRIVATE.headers });

  const pdfOk = validatePrintablePdfMediaAsset(product.fileAsset);
  if (!pdfOk.ok) {
    return NextResponse.json({ ok: false, code: pdfOk.code, error: pdfOk.message }, { status: 400, headers: PRIVATE.headers });
  }

  const ua = req.headers.get("user-agent");
  await prisma.printableDownloadEvent.create({
    data: {
      printableProductId: product.id,
      userId: gate.admin.userId,
      pathwayId: null,
      source: PrintableDownloadSource.ADMIN_PREVIEW,
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
