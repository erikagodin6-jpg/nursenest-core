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
  incorrectAnswerRationale?: unknown;
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

function fallbackTakeawayFromText(text: string | null | undefined): string | null {
  const clean = stripToPlainText(text);
  if (clean.length < 16) return null;
  const sentence = clean.split(/(?<=[.!?])\s+/).find((s) => s.trim().length >= 16) ?? clean;
  const compact = sentence.trim().replace(/\s+/g, " ");
  if (!compact) return null;
  const oneSentence = compact.replace(/([.!?]).*$/, "$1");
  return oneSentence.length > 180 ? `${oneSentence.slice(0, 177).trim()}...` : oneSentence;
}

/** Build labeled sections from real DB fields only (no invented facts). */
export function buildRationaleSectionsFromQuestion(row: QuestionRationaleFields): RationaleSection[] {
  const out: RationaleSection[] = [];

  const push = (heading: string, body: string | null | undefined) => {
    const t = stripToPlainText(body);
    if (t.length < 2) return;
    out.push({ heading, body: t });
  };

  const distractors = stringifyDistractors(row.distractorRationales) ?? stringifyDistractors(row.incorrectAnswerRationale);
  const fallbackTakeaway = row.keyTakeaway ?? fallbackTakeawayFromText(row.rationale) ?? fallbackTakeawayFromText(row.correctAnswerExplanation);

  push("Correct answer", row.correctAnswerExplanation ?? "Answer rationale is loading.");
  push("Why this is correct", row.rationale ?? row.clinicalReasoning ?? "Clinical explanation is not available yet.");
  push("Why the other options are wrong", distractors ?? "Distractor-specific explanations were not provided for this item.");
  push(
    "Clinical takeaway",
    fallbackTakeaway ?? "Takeaway unavailable. This question should be reviewed in the admin quality queue.",
  );
  push("Exam strategy", row.examStrategy ?? "Apply safety, prioritization, and scope-of-practice rules to select the next best action.");
  push("Clinical pearl", row.clinicalPearl);
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
    stringifyDistractors(row.incorrectAnswerRationale),
    row.memoryHook,
    row.clinicalTrap,
  ]);
  const rationaleQuality = classifyRationaleWordCount(wc);
  const sections = buildRationaleSectionsFromQuestion(row);
  return { rationaleQuality, sections };
}
