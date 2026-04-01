import { stripToPlainText } from "@/lib/content-quality/plain-text";
import { classifyRationaleWordCount, totalRationaleWordCount } from "@/lib/content-quality/classify-rationale";

export type RationaleSection = { heading: string; body: string };

type QuestionRationaleFields = {
  rationale?: string | null;
  correctAnswerExplanation?: string | null;
  clinicalReasoning?: string | null;
  keyTakeaway?: string | null;
  clinicalPearl?: string | null;
  examStrategy?: string | null;
  memoryHook?: string | null;
  clinicalTrap?: string | null;
  distractorRationales?: unknown;
};

function stringifyDistractors(raw: unknown): string | null {
  if (raw == null) return null;
  if (typeof raw === "string") return raw.trim() ? raw : null;
  if (Array.isArray(raw)) {
    const lines = raw
      .map((x) => {
        if (typeof x === "string") return x;
        if (x && typeof x === "object" && "label" in x && "text" in x) {
          return `${String((x as { label?: string }).label ?? "")}: ${String((x as { text?: string }).text ?? "")}`;
        }
        return "";
      })
      .filter(Boolean);
    return lines.length ? lines.join("\n") : null;
  }
  if (typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    const lines = Object.entries(o).map(([k, v]) => `${k}: ${String(v ?? "")}`);
    return lines.join("\n").trim() || null;
  }
  return null;
}

/** Build labeled sections from real DB fields only (no invented facts). */
export function buildRationaleSectionsFromQuestion(row: QuestionRationaleFields): RationaleSection[] {
  const out: RationaleSection[] = [];

  const push = (heading: string, body: string | null | undefined) => {
    const t = stripToPlainText(body);
    if (t.length < 2) return;
    out.push({ heading, body: t });
  };

  push("Correct answer", row.correctAnswerExplanation);
  push("Explanation", row.rationale);
  push("Clinical reasoning", row.clinicalReasoning);
  push("Distractors", stringifyDistractors(row.distractorRationales));
  push("High-yield takeaway", row.keyTakeaway);
  push("Clinical pearl", row.clinicalPearl);
  push("Exam strategy", row.examStrategy);
  push("Memory hook", row.memoryHook);
  push("Common trap", row.clinicalTrap);

  const seen = new Set<string>();
  const deduped: RationaleSection[] = [];
  for (const block of out) {
    const key = `${block.heading}:${block.body.slice(0, 80)}`;
    if (seen.has(key)) continue;
    const dupBody = deduped.some((d) => d.body === block.body && d.body.length > 40);
    if (dupBody) continue;
    seen.add(key);
    deduped.push(block);
  }
  return deduped;
}

export type RationalePayloadForClient = {
  rationaleQuality: ReturnType<typeof classifyRationaleWordCount>;
  sections: RationaleSection[];
};

export function buildRationalePayloadForGradeResponse(row: QuestionRationaleFields): RationalePayloadForClient {
  const wc = totalRationaleWordCount([
    row.rationale,
    row.correctAnswerExplanation,
    row.clinicalReasoning,
    row.keyTakeaway,
    row.clinicalPearl,
    row.examStrategy,
    stringifyDistractors(row.distractorRationales),
    row.memoryHook,
    row.clinicalTrap,
  ]);
  const rationaleQuality = classifyRationaleWordCount(wc);
  const sections = buildRationaleSectionsFromQuestion(row);
  return { rationaleQuality, sections };
}
