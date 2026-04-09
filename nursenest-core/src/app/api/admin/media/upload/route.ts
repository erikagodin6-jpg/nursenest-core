import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { parseUploadKind, uploadAdminFileToSpaces } from "@/lib/storage/admin-upload-file-to-spaces";
import { isSpacesUploadConfigured } from "@/lib/storage/spaces-config";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function parseTags(raw: string | null): string[] {
  if (!raw?.trim()) return [];
  return Array.from(
    new Set(
      raw
        .split(/[,]+/)
        .map((s) => s.trim().toLowerCase().replace(/\s+/g, "-"))
        .filter((s) => s.length > 0 && s.length < 64),
    ),
  ).slice(0, 24);
}

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  if (!isSpacesUploadConfigured()) {
    return NextResponse.json({ error: "Spaces upload not configured (SPACES_KEY / SPACES_SECRET)" }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart body" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file field" }, { status: 400 });
  }

  const kind = parseUploadKind(form.get("kind"));
  const altText = typeof form.get("altText") === "string" ? form.get("altText")!.trim().slice(0, 2000) : "";
  const tags = parseTags(typeof form.get("tags") === "string" ? (form.get("tags") as string) : null);

  const up = await uploadAdminFileToSpaces(file, kind);
  if (!up.ok) {
    return NextResponse.json({ error: up.error, code: up.code }, { status: up.status });
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
      altText: altText || null,
      tags,
      uploadedById: gate.admin.userId,
      usageRefCount: 0,
      usageRefs: [],
    },
  });

  safeServerLog("storage", "admin_media_upload_ok", {
    mediaId: row.id,
    kind: result.assetKind,
    bytes: result.fileSizeBytes,
  });

  return NextResponse.json({
    asset: {
      id: row.id,
      publicUrl: row.publicUrl,
      storageKey: row.storageKey,
      filename: row.filename,
      mimeType: row.mimeType,
      kind: row.kind,
      altText: row.altText,
      tags: row.tags,
      createdAt: row.createdAt.toISOString(),
    },
    objectKey: result.objectKey,
    contentType: result.contentType,
    compressed: result.compressed,
  });
}
