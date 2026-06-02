const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const PDF_TYPE = "application/pdf";

export function maxUploadBytes(): number {
  const raw = process.env.MAX_UPLOAD_BYTES?.trim();
  if (!raw) return DEFAULT_MAX_BYTES;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 64 * 1024 || n > 50 * 1024 * 1024) return DEFAULT_MAX_BYTES;
  return Math.floor(n);
}

export type UploadKind = "image" | "pdf" | "media";

export function assertUploadSize(kind: UploadKind, byteLength: number): void {
  const max = maxUploadBytes();
  if (byteLength > max) {
    throw new UploadValidationError(`file_too_large: ${byteLength} bytes (max ${max})`);
  }
  if (byteLength < 16) {
    throw new UploadValidationError("file_too_small");
  }
}

export class UploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadValidationError";
  }
}

export function assertMimeForKind(kind: UploadKind, mime: string): string {
  const m = mime.split(";")[0]?.trim().toLowerCase() || "";
  if (kind === "pdf") {
    if (m !== PDF_TYPE) throw new UploadValidationError(`invalid_mime_for_pdf: ${mime}`);
    return PDF_TYPE;
  }
  if (kind === "image" || kind === "media") {
    if (!IMAGE_TYPES.has(m)) throw new UploadValidationError(`invalid_mime_for_image: ${mime}`);
    return m;
  }
  throw new UploadValidationError(`unknown_kind: ${kind}`);
}

export function sniffMagicMatchesMime(buffer: Buffer, mime: string): boolean {
  if (buffer.length < 12) return false;
  const m = mime.split(";")[0]?.trim().toLowerCase() || "";
  if (m === "image/jpeg") return buffer[0] === 0xff && buffer[1] === 0xd8;
  if (m === "image/png") return buffer.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (m === "image/webp") return buffer.slice(0, 4).toString() === "RIFF" && buffer.slice(8, 12).toString() === "WEBP";
  if (m === "application/pdf") return buffer.slice(0, 5).toString("utf8") === "%PDF-";
  return true;
}
