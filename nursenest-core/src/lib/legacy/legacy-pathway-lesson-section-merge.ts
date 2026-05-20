import { countWords, stripToPlainText } from "@/lib/content-quality/plain-text";
import type { PathwayLessonExamFocus, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

const WEAK_SECTION_WORDS = 100;
/** Legacy body must be materially longer to replace a non-weak current section. */
const LEGACY_RICHNESS_RATIO = 1.22;

function asSectionArray(raw: unknown): PathwayLessonSection[] {
  if (!Array.isArray(raw)) return [];
  const out: PathwayLessonSection[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const kind = typeof o.kind === "string" ? o.kind.trim() : "";
    const body = typeof o.body === "string" ? o.body : "";
    const heading = typeof o.heading === "string" ? o.heading : "";
    const id = typeof o.id === "string" && o.id.trim() ? o.id.trim() : "";
    if (!kind) continue;
    const sec: PathwayLessonSection = {
      id: id || stableSectionId(kind, body),
      heading: heading || kind,
      kind: kind as PathwayLessonSection["kind"],
      body,
    };
    if (o.examFocus && typeof o.examFocus === "object") {
      sec.examFocus = o.examFocus as PathwayLessonExamFocus;
    }
    out.push(sec);
  }
  return out;
}

function stableSectionId(kind: string, body: string): string {
  let h = 2166136261;
  const seed = `${kind}:${body.slice(0, 120)}`;
  for (let i = 0; i < seed.length; i += 1) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return `legacy-merge-${kind}-${(h >>> 0).toString(36)}`;
}

/** Split on paragraph breaks first; strip collapses internal whitespace so must not run before newline split. */
function lineSet(text: string): Set<string> {
  const lines = String(text)
    .split(/\n+/)
    .map((l) => stripToPlainText(l).trim().toLowerCase())
    .filter((l) => l.length > 12);
  return new Set(lines);
}

function appendDedupedLines(existingBody: string, legacyBody: string): string {
  const have = lineSet(existingBody);
  const cand = String(legacyBody)
    .split(/\n+/)
    .map((l) => stripToPlainText(l).trim())
    .filter((l) => l.length > 12);
  const add: string[] = [];
  for (const line of cand) {
    const k = line.toLowerCase();
    if (have.has(k)) continue;
    have.add(k);
    add.push(line);
  }
  if (add.length === 0) return existingBody;
  const block = add.map((l) => `- ${l}`).join("\n");
  return `${existingBody.trim()}\n\n**Legacy supplement (deduped)**\n\n${block}`;
}

function mergeExamFocus(
  current: PathwayLessonExamFocus | undefined,
  legacy: PathwayLessonExamFocus | undefined,
): PathwayLessonExamFocus | undefined {
  if (!legacy && !current) return undefined;
  const out: PathwayLessonExamFocus = { ...(current ?? {}) };
  for (const [k, v] of Object.entries(legacy ?? {})) {
    if (v == null) continue;
    const key = k as keyof PathwayLessonExamFocus;
    if (typeof v !== "string") continue;
    const vs = v.trim();
    if (vs.length < 8) continue;
    const prev = out[key];
    const ps = typeof prev === "string" ? prev.trim() : "";
    if (!ps || vs.length > ps.length * 1.12) {
      (out as Record<string, string>)[k] = vs;
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export type LegacySectionMergeResult = {
  sections: PathwayLessonSection[];
  notes: string[];
  changed: boolean;
};

/**
 * Merges legacy section JSON into the current pathway lesson without duplicating blocks:
 * - Missing `kind` rows are appended.
 * - Weak current bodies may be replaced when legacy is clearly richer.
 * - Otherwise unique legacy lines are appended in a short deduped supplement block.
 */
export function mergeLegacySectionsIntoCurrent(
  currentSections: unknown,
  legacySections: unknown,
): LegacySectionMergeResult {
  const notes: string[] = [];
  const cur = asSectionArray(currentSections);
  const leg = asSectionArray(legacySections);
  if (leg.length === 0) {
    return { sections: cur, notes: ["merge_skipped_no_legacy_sections"], changed: false };
  }

  const firstIndexByKind = new Map<string, number>();
  for (let i = 0; i < cur.length; i += 1) {
    const k = String(cur[i]!.kind);
    if (!firstIndexByKind.has(k)) firstIndexByKind.set(k, i);
  }

  let changed = false;

  for (const sec of leg) {
    const kind = String(sec.kind);
    const idx = firstIndexByKind.get(kind);

    if (idx === undefined) {
      cur.push({
        ...sec,
        id: sec.id || stableSectionId(kind, sec.body),
      });
      firstIndexByKind.set(kind, cur.length - 1);
      notes.push(`appended_section:${kind}`);
      changed = true;
      continue;
    }

    const existing = cur[idx]!;
    const wc = countWords(existing.body);
    const wl = countWords(sec.body);
    if (wl < 12) {
      notes.push(`skip_thin_legacy:${kind}`);
      continue;
    }

    const mergedFocus = mergeExamFocus(existing.examFocus, sec.examFocus);

    /** Only replace body when the current section is thin — never swap a strong modern section for older prose. */
    if (wc < WEAK_SECTION_WORDS && wl > Math.max(wc, 1) * LEGACY_RICHNESS_RATIO) {
      cur[idx] = {
        ...existing,
        body: sec.body,
        heading: existing.heading?.trim() ? existing.heading : sec.heading,
        examFocus: mergedFocus ?? existing.examFocus,
      };
      notes.push(`replaced_weak_section:${kind}:${wc}->${wl}`);
      changed = true;
      continue;
    }

    if (mergedFocus && JSON.stringify(mergedFocus) !== JSON.stringify(existing.examFocus)) {
      cur[idx] = { ...existing, examFocus: mergedFocus };
      notes.push(`merged_exam_focus:${kind}`);
      changed = true;
    }

    const appended = appendDedupedLines(existing.body, sec.body);
    if (appended !== existing.body) {
      cur[idx] = { ...existing, body: appended };
      notes.push(`appended_deduped_lines:${kind}`);
      changed = true;
    }
  }

  return { sections: cur, notes, changed };
}
