import path from "node:path";

/**
 * Flatten heterogeneous Replit JSON exports into candidate question objects.
 * Supports: root arrays, `questions` / `items` / `data`, and `ai_cache`-style rows with `output_json`.
 */
export function extractQuestionLikeRecords(parsed: unknown, sourceFileBasename: string): unknown[] {
  const base = path.basename(sourceFileBasename).toLowerCase();

  const pushParsedOutput = (out: unknown[], oj: unknown) => {
    if (typeof oj === "string") {
      try {
        const inner = JSON.parse(oj) as unknown;
        if (Array.isArray(inner)) {
          for (const x of inner) out.push(x);
        } else if (inner && typeof inner === "object") {
          out.push(inner);
        }
      } catch {
        /* skip malformed */
      }
      return;
    }
    if (Array.isArray(oj)) {
      for (const x of oj) out.push(x);
    } else if (oj && typeof oj === "object") {
      out.push(oj);
    }
  };

  if (Array.isArray(parsed)) {
    const out: unknown[] = [];
    const looksLikeAiCache =
      base.includes("ai_cache") ||
      (parsed.length > 0 &&
        parsed[0] &&
        typeof parsed[0] === "object" &&
        "output_json" in (parsed[0] as object));

    if (looksLikeAiCache) {
      for (const row of parsed) {
        if (row && typeof row === "object" && "output_json" in row) {
          pushParsedOutput(out, (row as { output_json: unknown }).output_json);
        } else {
          out.push(row);
        }
      }
      return out;
    }

    return [...parsed];
  }

  if (parsed && typeof parsed === "object") {
    const o = parsed as Record<string, unknown>;
    for (const key of ["questions", "items", "data", "records", "rows"] as const) {
      const arr = o[key];
      if (Array.isArray(arr)) return [...arr];
    }
  }

  return [];
}
