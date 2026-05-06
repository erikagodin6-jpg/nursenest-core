/**
 * Tolerant parsing of model-emitted editorial-plan JSON.
 * Logs/repairs common defects; callers fall back to {@link buildReliableFallbackBlogControlPanelPlan} when all parses fail.
 */

export type EditorialPlanJsonParseResult =
  | { ok: true; value: unknown; warnings: string[] }
  | { ok: false; error: string; warnings: string[] };

/** Best-effort title/topic hints from raw model text (for logs when JSON is unusable). */
export function extractTopicTitleHintsFromRawModelOutput(raw: string): { h1?: string; topic?: string; primaryKeyword?: string } {
  const out: { h1?: string; topic?: string; primaryKeyword?: string } = {};
  const pick = (re: RegExp): string | undefined => {
    const m = re.exec(raw);
    const v = m?.[1]?.trim();
    return v && v.length > 0 ? v.slice(0, 220) : undefined;
  };
  out.h1 = pick(/"h1"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  out.topic = pick(/"topic"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  out.primaryKeyword = pick(/"primaryKeyword"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  return out;
}

/**
 * Extracts the first top-level `{ ... }` using brace depth and double-quoted string rules
 * (skips trailing model commentary after a well-formed object).
 */
export function sliceBalancedJsonObject(input: string): string {
  const s = input.trim().replace(/^\ufeff/, "");
  const start = s.indexOf("{");
  if (start < 0) throw new SyntaxError("no_object_start");
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i]!;
    if (!inStr) {
      if (c === '"') {
        inStr = true;
        continue;
      }
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) return s.slice(start, i + 1);
      }
      continue;
    }
    if (esc) {
      esc = false;
      continue;
    }
    if (c === "\\") {
      esc = true;
      continue;
    }
    if (c === '"') {
      inStr = false;
      continue;
    }
  }
  throw new SyntaxError("unbalanced_braces");
}

function stripMarkdownJsonFence(raw: string): string {
  let t = raw.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/im.exec(t);
  if (fence) t = fence[1]!.trim();
  return t;
}

/** Common model mistakes: smart quotes, duplicate commas, trailing commas before } or ]. */
export function repairCommonJsonModelDefects(jsonish: string): string {
  let t = jsonish;
  t = t.replace(/[\u201c\u201d]/g, '"');
  t = t.replace(/[\u2018\u2019]/g, "'");
  t = t.replace(/,\s*,/g, ",");
  t = t.replace(/,\s*([}\]])/g, "$1");
  return t;
}

/**
 * First parse: balanced slice + strict parse.
 * Second parse (one repair pass): {@link repairCommonJsonModelDefects} then balanced slice + parse.
 * Optional third: legacy first-{ to last-} slice + trailing-comma-only repair (already in repairCommon).
 */
export function parseEditorialPlanJsonFromModel(raw: string): EditorialPlanJsonParseResult {
  const warnings: string[] = [];
  const hints = extractTopicTitleHintsFromRawModelOutput(raw);

  const tryOnce = (label: string, text: string): unknown => {
    let slice: string;
    try {
      slice = sliceBalancedJsonObject(text);
    } catch {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start < 0 || end <= start) throw new SyntaxError("no_json_object_slice");
      slice = text.slice(start, end + 1);
      warnings.push(`${label}:used_first_last_brace_slice`);
    }
    return JSON.parse(slice) as unknown;
  };

  const fenced = stripMarkdownJsonFence(raw);

  try {
    const value = tryOnce("pass1", fenced);
    return { ok: true, value, warnings };
  } catch (e1) {
    const msg1 = e1 instanceof Error ? e1.message : String(e1);
    warnings.push(`pass1_json_parse_failed:${msg1}`);
  }

  try {
    const repaired = repairCommonJsonModelDefects(fenced);
    const value = tryOnce("pass2_repaired", repaired);
    warnings.push("pass2:applied_common_json_repairs_then_parse_ok");
    if (hints.h1 || hints.topic) {
      warnings.push(`heuristic_hints:h1=${hints.h1 ?? "—"};topic=${hints.topic ?? "—"}`);
    }
    return { ok: true, value, warnings };
  } catch (e2) {
    const msg2 = e2 instanceof Error ? e2.message : String(e2);
    warnings.push(`pass2_json_parse_failed:${msg2}`);
  }

  const hintStr = [hints.h1 && `h1≈${hints.h1.slice(0, 80)}`, hints.topic && `topic≈${hints.topic.slice(0, 80)}`]
    .filter(Boolean)
    .join(" | ");
  return {
    ok: false,
    error: `Editorial plan JSON could not be parsed after repair pass (${hintStr || "no_title_hints"})`,
    warnings,
  };
}
