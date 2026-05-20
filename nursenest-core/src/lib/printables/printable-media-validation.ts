import type { MediaAsset } from "@prisma/client";

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const THUMB_MIMES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);

export type PrintableMediaValidationFail = { ok: false; code: string; message: string };
export type PrintableMediaValidationOk = { ok: true };

function baseMime(mime: string | null | undefined): string {
  return (mime ?? "").split(";")[0]?.trim().toLowerCase() ?? "";
}

/** Primary printable file must be PDF MIME (reject DOCX / mis-tagged assets). */
export function validatePrintablePdfMediaAsset(
  a: Pick<MediaAsset, "kind" | "mimeType">,
): PrintableMediaValidationOk | PrintableMediaValidationFail {
  if (a.kind !== "pdf") {
    return { ok: false, code: "not_pdf_kind", message: "Printable file must be MediaAsset kind pdf" };
  }
  const mime = baseMime(a.mimeType);
  if (!mime) {
    return { ok: false, code: "pdf_mime_required", message: "Printable primary file must declare application/pdf" };
  }
  if (mime === DOCX_MIME || mime.includes("wordprocessingml") || mime.includes("msword")) {
    return {
      ok: false,
      code: "docx_not_allowed",
      message: "DOCX/Word uploads are not allowed for printables; convert to PDF before learner access",
    };
  }
  if (mime !== "application/pdf") {
    return { ok: false, code: "pdf_mime_required", message: "Printable primary file must be application/pdf" };
  }
  return { ok: true };
}

/** Thumbnail: PNG, JPEG, or WebP only. */
export function validatePrintableThumbnailMediaAsset(
  a: Pick<MediaAsset, "kind" | "mimeType">,
): PrintableMediaValidationOk | PrintableMediaValidationFail {
  if (a.kind !== "image") {
    return { ok: false, code: "not_image_kind", message: "Thumbnail must be MediaAsset kind image" };
  }
  const mime = baseMime(a.mimeType);
  if (!THUMB_MIMES.has(mime)) {
    return {
      ok: false,
      code: "thumbnail_mime",
      message: "Thumbnail must be image/png, image/jpeg, or image/webp",
    };
  }
  return { ok: true };
}
