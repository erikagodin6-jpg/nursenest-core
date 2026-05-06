import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { parseUploadKind, uploadAdminFileToSpaces } from "@/lib/storage/admin-upload-file-to-spaces";
import { isSpacesUploadConfigured } from "@/lib/storage/spaces-config";
import { assertPrintableAdminSurface } from "@/lib/printables/printable-admin-gate";
import {
  validatePrintablePdfMediaAsset,
  validatePrintableThumbnailMediaAsset,
} from "@/lib/printables/printable-media-validation";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";

export const runtime = "nodejs";

const PRIVATE = { headers: mergeSubscriberPrivateCacheHeaders() } as const;

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const surface = assertPrintableAdminSurface();
  if (surface) return surface;
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  if (!isSpacesUploadConfigured()) {
    return NextResponse.json({ error: "Spaces upload not configured" }, { status: 503, headers: PRIVATE.headers });
  }

  const { id } = await ctx.params;
  const product = await prisma.printableProduct.findUnique({ where: { id }, select: { id: true } });
  if (!product) return NextResponse.json({ ok: false, code: "not_found" }, { status: 404, headers: PRIVATE.headers });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart body" }, { status: 400, headers: PRIVATE.headers });
  }

  const confirmIntent = form.get("confirmIntent");
  if (confirmIntent !== "printable-admin-upload-confirm") {
    return NextResponse.json(
      {
        error: "confirmIntent must be printable-admin-upload-confirm",
        code: "printable_upload_intent_required",
      },
      { status: 400, headers: PRIVATE.headers },
    );
  }

  const role = form.get("role");
  const kind = role === "thumbnail" ? parseUploadKind("image") : parseUploadKind("pdf");
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file field" }, { status: 400, headers: PRIVATE.headers });
  }

  const up = await uploadAdminFileToSpaces(file, kind);
  if (!up.ok) {
    return NextResponse.json({ error: up.error, code: up.code }, { status: up.status, headers: PRIVATE.headers });
  }

  const { result } = up;

  const row = await prisma.mediaAsset.create({
    data: {
      publicUrl: result.publicUrl,
      storageKey: result.objectKey,
      filename: result.originalFilename,
      mimeType: result.contentType,
      kind: result.assetKind,
      fileSizeBytes: result.fileSizeBytes,
      width: result.width ?? null,
      height: result.height ?? null,
      altText: null,
      tags: [],
      uploadedById: gate.admin.userId,
      usageRefCount: null,
      usageRefs: Prisma.JsonNull,
    },
  });

  const mediaCheck =
    kind === "pdf" ? validatePrintablePdfMediaAsset(row) : validatePrintableThumbnailMediaAsset(row);
  if (!mediaCheck.ok) {
    await prisma.mediaAsset.delete({ where: { id: row.id } }).catch(() => undefined);
    return NextResponse.json(
      { ok: false, code: mediaCheck.code, error: mediaCheck.message },
      { status: 400, headers: PRIVATE.headers },
    );
  }

  if (kind === "pdf") {
    await prisma.printableProduct.update({
      where: { id },
      data: {
        fileAssetId: row.id,
        version: { increment: 1 },
        updatedByUserId: gate.admin.userId,
      },
    });
  } else {
    await prisma.printableProduct.update({
      where: { id },
      data: { thumbnailAssetId: row.id, updatedByUserId: gate.admin.userId },
    });
  }

  safeServerLog("storage", "printable_admin_upload_ok", {
    printableId: id,
    mediaId: row.id,
    role: role === "thumbnail" ? "thumbnail" : "pdf",
  });

  return NextResponse.json(
    {
      ok: true,
      asset: {
        id: row.id,
        filename: row.filename,
        mimeType: row.mimeType,
        kind: row.kind,
        createdAt: row.createdAt.toISOString(),
      },
    },
    { headers: PRIVATE.headers },
  );
}
