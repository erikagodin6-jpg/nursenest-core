import "server-only";

import { prepareBinaryForSpaces } from "@/lib/storage/prepare-binary-for-spaces";
import { buildObjectKey, putBufferToSpaces } from "@/lib/storage/spaces-upload";
import {
  assertMimeForKind,
  assertUploadSize,
  sniffMagicMatchesMime,
  UploadValidationError,
  type UploadKind,
} from "@/lib/storage/upload-limits";
import sharp from "sharp";

export type AdminSpacesUploadResult = {
  objectKey: string;
  publicUrl: string;
  contentType: string;
  compressed: boolean;
  fileSizeBytes: number;
  width?: number;
  height?: number;
};

export function parseUploadKind(v: FormDataEntryValue | null): UploadKind {
  if (typeof v !== "string") return "image";
  const s = v.toLowerCase();
  if (s === "pdf") return "pdf";
  if (s === "media") return "media";
  return "image";
}

function kindToAssetKind(kind: UploadKind): "image" | "pdf" | "media" {
  return kind;
}

/**
 * Validates, optionally transcodes images to WebP, uploads to Spaces. Used by storage and media library routes.
 */
export async function uploadAdminFileToSpaces(
  file: File,
  kind: UploadKind,
): Promise<
  | { ok: true; result: AdminSpacesUploadResult & { originalFilename: string; assetKind: "image" | "pdf" | "media" } }
  | { ok: false; status: number; error: string; code?: string }
> {
  const originalFilename = sanitizeFilename(file.name);

  try {
    assertUploadSize(kind, file.size);
  } catch (e) {
    if (e instanceof UploadValidationError) {
      return { ok: false, status: 413, error: e.message, code: "payload_too_large" };
    }
    throw e;
  }

  let mime: string;
  try {
    mime = assertMimeForKind(kind, file.type || "application/octet-stream");
  } catch (e) {
    if (e instanceof UploadValidationError) {
      return { ok: false, status: 415, error: e.message, code: "invalid_mime" };
    }
    throw e;
  }

  const buf = Buffer.from(await file.arrayBuffer());

  if (!sniffMagicMatchesMime(buf, mime)) {
    return { ok: false, status: 400, error: "File content does not match declared type", code: "magic_mismatch" };
  }

  let prepared;
  try {
    prepared = await prepareBinaryForSpaces(buf, mime, kind === "pdf" ? "pdf" : "image");
  } catch (e) {
    if (e instanceof UploadValidationError) {
      return { ok: false, status: 400, error: e.message, code: "prepare_failed" };
    }
    throw e;
  }

  try {
    assertUploadSize(kind, prepared.body.length);
  } catch (e) {
    if (e instanceof UploadValidationError) {
      return { ok: false, status: 413, error: e.message, code: "compressed_still_too_large" };
    }
    throw e;
  }

  let width: number | undefined;
  let height: number | undefined;
  if (kind !== "pdf") {
    try {
      const meta = await sharp(prepared.body).metadata();
      width = meta.width ?? undefined;
      height = meta.height ?? undefined;
    } catch {
      /* optional metadata */
    }
  }

  const objectKey = buildObjectKey(kind, prepared.extension);
  const put = await putBufferToSpaces({
    objectKey,
    body: prepared.body,
    contentType: prepared.contentType,
  });

  return {
    ok: true,
    result: {
      objectKey: put.objectKey,
      publicUrl: put.publicUrl,
      contentType: prepared.contentType,
      compressed: prepared.compressed,
      fileSizeBytes: prepared.body.length,
      width,
      height,
      originalFilename,
      assetKind: kindToAssetKind(kind),
    },
  };
}

function sanitizeFilename(name: string): string {
  const base = name.replace(/^.*[/\\]/, "").trim().slice(0, 240);
  return base || "upload";
}
