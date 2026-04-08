import type { EducationalTranslationSourceKind } from "@prisma/client";
import { EducationalTranslationSourceKind as SK } from "@prisma/client";
import { DEFAULT_MARKETING_LOCALE, MARKETING_LOCALE_CODES } from "@/lib/i18n/marketing-locale-policy";
import type { EducationalOverlayImportRow } from "./types";
import { sanitizeEducationalOverlayStrings } from "./sanitize";

/** Same rules as `normalizeExamQuestionOptionsArray` in educational-content-overlay (avoid importing server-only). */
function normalizeExamQuestionOptionsArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => {
    if (typeof x === "string") return x;
    if (x && typeof x === "object" && "label" in x) return String((x as { label?: string }).label ?? "");
    return String(x);
  });
}

export function isOverlayLocaleAllowed(locale: string): boolean {
  const l = locale.trim();
  if (l === DEFAULT_MARKETING_LOCALE) return false;
  return (MARKETING_LOCALE_CODES as readonly string[]).includes(l);
}

/** Structural checks only (existence of source rows is done in the script with Prisma). */
export function validatePayloadShape(kind: EducationalTranslationSourceKind, payload: Record<string, unknown>): { ok: true } | { ok: false; reason: string } {
  if (kind === SK.EXAM_QUESTION) {
    if (payload.options !== undefined) {
      const opts = normalizeExamQuestionOptionsArray(payload.options);
      if (opts.length === 0 && Array.isArray(payload.options) && payload.options.length > 0) {
        return { ok: false, reason: "options must be an array of display strings parallel to canonical options" };
      }
    }
    return { ok: true };
  }
  if (kind === SK.PATHWAY_LESSON) {
    if (payload.sections !== undefined && (typeof payload.sections !== "object" || payload.sections === null || Array.isArray(payload.sections))) {
      return { ok: false, reason: "sections must be an object keyed by section id" };
    }
    return { ok: true };
  }
  if (kind === SK.FLASHCARD_DECK || kind === SK.FLASHCARD || kind === SK.FLASHCARD_TAG) {
    return { ok: true };
  }
  return { ok: false, reason: "unknown sourceKind" };
}

export function validateAndSanitizeRow(row: EducationalOverlayImportRow): { ok: true; row: EducationalOverlayImportRow } | { ok: false; reason: string } {
  if (!isOverlayLocaleAllowed(row.locale)) {
    return { ok: false, reason: "locale must be a supported non-English marketing locale" };
  }
  const shape = validatePayloadShape(row.sourceKind, row.payload);
  if (!shape.ok) return shape;
  const san = sanitizeEducationalOverlayStrings(row.payload, "payload");
  if (!san.ok) return { ok: false, reason: `${san.reason} at ${san.path}` };
  return {
    ok: true,
    row: {
      ...row,
      payload: san.value as Record<string, unknown>,
    },
  };
}

/**
 * Compare canonical option count to overlay options when both present.
 */
export function optionsLengthMatchesCanonical(
  kind: EducationalTranslationSourceKind,
  payload: Record<string, unknown>,
  canonicalOptionCount: number,
): { ok: true } | { ok: false; reason: string } {
  if (kind !== SK.EXAM_QUESTION) return { ok: true };
  if (payload.options === undefined) return { ok: true };
  const opts = normalizeExamQuestionOptionsArray(payload.options);
  if (opts.length !== canonicalOptionCount) {
    return {
      ok: false,
      reason: `options length ${opts.length} does not match canonical ${canonicalOptionCount}`,
    };
  }
  return { ok: true };
}
