import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prepareBinaryForSpaces } from "@/lib/storage/prepare-binary-for-spaces";
import { isSpacesUploadConfigured } from "@/lib/storage/spaces-config";
import { buildObjectKey, putBufferToSpaces } from "@/lib/storage/spaces-upload";
import {
  assertMimeForKind,
  assertUploadSize,
  sniffMagicMatchesMime,
  UploadValidationError,
  type UploadKind,
} from "@/lib/storage/upload-limits";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function parseKind(v: FormDataEntryValue | null): UploadKind {
  if (typeof v !== "string") return "image";
  const s = v.toLowerCase();
  if (s === "pdf") return "pdf";
  if (s === "media") return "media";
  return "image";
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

  const kind = parseKind(form.get("kind"));

  try {
    assertUploadSize(kind, file.size);
  } catch (e) {
    if (e instanceof UploadValidationError) {
      return NextResponse.json({ error: e.message, code: "payload_too_large" }, { status: 413 });
    }
    throw e;
  }

  let mime: string;
  try {
    mime = assertMimeForKind(kind, file.type || "application/octet-stream");
  } catch (e) {
    if (e instanceof UploadValidationError) {
      return NextResponse.json({ error: e.message, code: "invalid_mime" }, { status: 415 });
    }
    throw e;
  }

  const buf = Buffer.from(await file.arrayBuffer());

  if (!sniffMagicMatchesMime(buf, mime)) {
    return NextResponse.json({ error: "File content does not match declared type", code: "magic_mismatch" }, { status: 400 });
  }

  let prepared;
  try {
    prepared = await prepareBinaryForSpaces(buf, mime, kind === "pdf" ? "pdf" : "image");
  } catch (e) {
    if (e instanceof UploadValidationError) {
      return NextResponse.json({ error: e.message, code: "prepare_failed" }, { status: 400 });
    }
    throw e;
  }

  try {
    assertUploadSize(kind, prepared.body.length);
  } catch (e) {
    if (e instanceof UploadValidationError) {
      return NextResponse.json({ error: e.message, code: "compressed_still_too_large" }, { status: 413 });
    }
    throw e;
  }

  const objectKey = buildObjectKey(kind, prepared.extension);
  const put = await putBufferToSpaces({
    objectKey,
    body: prepared.body,
    contentType: prepared.contentType,
  });

  safeServerLog("storage", "admin_upload_ok", {
    kind,
    objectKeyPrefix: objectKey.split("/")[0] ?? "",
    compressed: prepared.compressed ? 1 : 0,
    bytes: prepared.body.length,
  });

  return NextResponse.json({
    objectKey: put.objectKey,
    publicUrl: put.publicUrl,
    contentType: prepared.contentType,
    compressed: prepared.compressed,
  });
}
