import type { EducationalTranslationSourceKind, EducationalTranslationStatus } from "@prisma/client";
import {
  EducationalTranslationSourceKind as SK,
  EducationalTranslationStatus as ST,
} from "@prisma/client";
import type { EducationalOverlayImportRow } from "./types";

const KINDS = new Set<string>(Object.values(SK));
const STATUSES = new Set<string>(Object.values(ST));

/** RFC4180-style: fields may be quoted; double-quote escapes. */
export function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let i = 0;
  let inQuotes = false;

  const pushField = () => {
    row.push(field);
    field = "";
  };
  const pushRow = () => {
    rows.push(row);
    row = [];
  };

  while (i < text.length) {
    const c = text[i]!;
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += c;
      i += 1;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (c === ",") {
      pushField();
      i += 1;
      continue;
    }
    if (c === "\n") {
      pushField();
      pushRow();
      i += 1;
      continue;
    }
    if (c === "\r") {
      if (text[i + 1] === "\n") i += 1;
      pushField();
      pushRow();
      i += 1;
      continue;
    }
    field += c;
    i += 1;
  }
  pushField();
  if (row.length > 1 || (row.length === 1 && row[0]!.length > 0)) pushRow();
  return rows;
}

/**
 * CSV columns: sourceKind, sourceId, locale, status, payload_json
 * Header row required. payload_json is a JSON object string (quoted in CSV).
 */
export function parseOverlayCsv(text: string, sourceRef: string): { ok: true; rows: EducationalOverlayImportRow[] } | { ok: false; error: string } {
  const table = parseCsvRows(text.trim());
  if (table.length < 2) return { ok: false, error: `${sourceRef}: CSV needs header + data rows` };
  const header = table[0]!.map((h) => h.trim().toLowerCase());
  const idx = {
    sourceKind: header.indexOf("sourcekind"),
    sourceId: header.indexOf("sourceid"),
    locale: header.indexOf("locale"),
    status: header.indexOf("status"),
    payload: header.indexOf("payload_json"),
  };
  if (idx.sourceKind < 0 || idx.sourceId < 0 || idx.locale < 0 || idx.status < 0 || idx.payload < 0) {
    return {
      ok: false,
      error: `${sourceRef}: CSV header must include sourceKind, sourceId, locale, status, payload_json`,
    };
  }

  const rows: EducationalOverlayImportRow[] = [];
  for (let r = 1; r < table.length; r++) {
    const line = table[r]!;
    const kindRaw = (line[idx.sourceKind] ?? "").trim();
    const sourceId = (line[idx.sourceId] ?? "").trim();
    const locale = (line[idx.locale] ?? "").trim();
    const statusRaw = (line[idx.status] ?? "").trim().toUpperCase();
    const payloadRaw = (line[idx.payload] ?? "").trim();
    if (!kindRaw || !sourceId || !locale || !statusRaw || !payloadRaw) {
      return { ok: false, error: `${sourceRef}: row ${r + 1} has empty required cells` };
    }
    if (!KINDS.has(kindRaw)) return { ok: false, error: `${sourceRef}: row ${r + 1} invalid sourceKind` };
    if (!STATUSES.has(statusRaw)) return { ok: false, error: `${sourceRef}: row ${r + 1} invalid status` };
    let payload: Record<string, unknown>;
    try {
      const parsed = JSON.parse(payloadRaw) as unknown;
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return { ok: false, error: `${sourceRef}: row ${r + 1} payload_json must be a JSON object` };
      }
      payload = parsed as Record<string, unknown>;
    } catch {
      return { ok: false, error: `${sourceRef}: row ${r + 1} payload_json is not valid JSON` };
    }
    rows.push({
      sourceKind: kindRaw as EducationalTranslationSourceKind,
      sourceId,
      locale,
      status: statusRaw as EducationalTranslationStatus,
      payload,
      _sourceRef: `${sourceRef}#csv-row-${r + 1}`,
    });
  }
  return { ok: true, rows };
}
