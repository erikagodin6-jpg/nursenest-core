import * as fs from "fs";

/** Parse export file into row array (same rules as replit-export-import/helpers). */
export function loadJsonRows(filePath: string): Record<string, unknown>[] {
  const raw = fs.readFileSync(filePath, "utf8");
  const trimmed = raw.trim();
  if (!trimmed) return [];
  const parsed: unknown = JSON.parse(trimmed);
  if (Array.isArray(parsed)) {
    return parsed.filter((x) => x && typeof x === "object" && !Array.isArray(x)) as Record<string, unknown>[];
  }
  if (parsed && typeof parsed === "object") {
    const o = parsed as Record<string, unknown>;
    for (const k of ["rows", "data", "records", "items"]) {
      const inner = o[k];
      if (Array.isArray(inner)) {
        return inner.filter((x) => x && typeof x === "object" && !Array.isArray(x)) as Record<string, unknown>[];
      }
    }
    return [o];
  }
  return [];
}

export type TopLevelKind = "array" | "object" | "empty" | "invalid";

export function describeTopLevel(filePath: string): {
  kind: TopLevelKind;
  rawKeys: string[];
} {
  const raw = fs.readFileSync(filePath, "utf8").trim();
  if (!raw) return { kind: "empty", rawKeys: [] };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return { kind: "array", rawKeys: [] };
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return { kind: "object", rawKeys: Object.keys(parsed as object) };
    }
    return { kind: "invalid", rawKeys: [] };
  } catch {
    return { kind: "invalid", rawKeys: [] };
  }
}
