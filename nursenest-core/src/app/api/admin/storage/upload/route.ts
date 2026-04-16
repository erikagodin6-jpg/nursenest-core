import { requireAdmin } from "@/lib/admin/ensure-admin";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { parseUploadKind, uploadAdminFileToSpaces } from "@/lib/storage/admin-upload-file-to-spaces";
import { isSpacesUploadConfigured } from "@/lib/storage/spaces-config";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
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

  const up = await uploadAdminFileToSpaces(file, kind);
  if (!up.ok) {
    return NextResponse.json({ error: up.error, code: up.code }, { status: up.status });
  }

  const { result } = up;

  safeServerLog("storage", "admin_upload_ok", {
    kind,
    objectKeyPrefix: result.objectKey.split("/")[0] ?? "",
    compressed: result.compressed ? 1 : 0,
    bytes: result.fileSizeBytes,
  });

  return NextResponse.json({
    objectKey: result.objectKey,
    publicUrl: result.publicUrl,
    contentType: result.contentType,
    compressed: result.compressed,
  });
}
