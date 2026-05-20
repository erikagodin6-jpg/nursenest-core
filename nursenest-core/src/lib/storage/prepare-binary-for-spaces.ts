import sharp from "sharp";
import { UploadValidationError, type UploadKind } from "./upload-limits";

const MAX_IMAGE_DIMENSION = 2048;
const WEBP_QUALITY = 82;

export type PreparedBlob = {
  body: Buffer;
  contentType: string;
  extension: string;
  compressed: boolean;
};

/**
 * PDF: validate magic only. Images: resize (bounded) + WebP encode to save bandwidth and Spaces egress.
 */
export async function prepareBinaryForSpaces(
  buffer: Buffer,
  mime: string,
  kind: UploadKind,
): Promise<PreparedBlob> {
  const baseMime = mime.split(";")[0]?.trim().toLowerCase() || "";

  if (kind === "pdf") {
    if (buffer.slice(0, 5).toString("utf8") !== "%PDF-") {
      throw new UploadValidationError("invalid_pdf_magic");
    }
    return { body: buffer, contentType: "application/pdf", extension: "pdf", compressed: false };
  }

  try {
    const img = sharp(buffer, { failOn: "truncated" });
    const meta = await img.metadata();
    const w = meta.width ?? 0;
    const h = meta.height ?? 0;
    let pipeline = img.rotate();

    if (w > MAX_IMAGE_DIMENSION || h > MAX_IMAGE_DIMENSION) {
      pipeline = pipeline.resize({
        width: w >= h ? MAX_IMAGE_DIMENSION : undefined,
        height: h > w ? MAX_IMAGE_DIMENSION : undefined,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    const out = await pipeline.webp({ quality: WEBP_QUALITY, effort: 4 }).toBuffer();
    return {
      body: out,
      contentType: "image/webp",
      extension: "webp",
      compressed: baseMime !== "image/webp" || out.length < buffer.length,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new UploadValidationError(`image_process_failed: ${msg.slice(0, 200)}`);
  }
}
