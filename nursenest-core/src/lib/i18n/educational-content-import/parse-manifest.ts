import type { EducationalTranslationSourceKind, EducationalTranslationStatus } from "@prisma/client";
import {
  EducationalTranslationSourceKind as SK,
  EducationalTranslationStatus as ST,
} from "@prisma/client";
import type { EducationalOverlayImportRow, ManifestJsonV1 } from "./types";

const KINDS = new Set<string>(Object.values(SK));
const STATUSES = new Set<string>(Object.values(ST));

function normalizeKind(raw: string): EducationalTranslationSourceKind | null {
  const u = String(raw).trim();
  if (KINDS.has(u)) return u as EducationalTranslationSourceKind;
  return null;
}

function normalizeStatus(raw: string): EducationalTranslationStatus | null {
  const u = String(raw).trim().toUpperCase();
  if (STATUSES.has(u)) return u as EducationalTranslationStatus;
  return null;
}

export function parseManifestJson(raw: unknown, sourceRef: string): { ok: true; rows: EducationalOverlayImportRow[] } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") return { ok: false, error: `${sourceRef}: root must be an object` };
  const m = raw as Partial<ManifestJsonV1>;
  if (typeof m.locale !== "string" || !m.locale.trim()) {
    return { ok: false, error: `${sourceRef}: manifest.locale required` };
  }
  if (!Array.isArray(m.items)) {
    return { ok: false, error: `${sourceRef}: manifest.items must be an array` };
  }

  const rows: EducationalOverlayImportRow[] = [];
  for (let i = 0; i < m.items.length; i++) {
    const it = m.items[i] as Record<string, unknown>;
    const kind = normalizeKind(String(it?.sourceKind ?? ""));
    if (!kind) {
      return { ok: false, error: `${sourceRef}: items[${i}].sourceKind invalid` };
    }
    const sourceId = typeof it.sourceId === "string" ? it.sourceId.trim() : "";
    if (sourceId.length < 2 || sourceId.length > 512) {
      return { ok: false, error: `${sourceRef}: items[${i}].sourceId invalid length` };
    }
    const status = normalizeStatus(String(it?.status ?? ""));
    if (!status) {
      return { ok: false, error: `${sourceRef}: items[${i}].status invalid` };
    }
    const payload = it.payload;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return { ok: false, error: `${sourceRef}: items[${i}].payload must be an object` };
    }
    rows.push({
      sourceKind: kind,
      sourceId,
      locale: m.locale.trim(),
      status,
      payload: { ...(payload as Record<string, unknown>) },
      reviewedAt: typeof it.reviewedAt === "string" ? it.reviewedAt : it.reviewedAt === null ? null : undefined,
      reviewerNote: typeof it.reviewerNote === "string" ? it.reviewerNote : undefined,
      _sourceRef: `${sourceRef}#items[${i}]`,
    });
  }

  return { ok: true, rows };
}
