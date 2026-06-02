import type { Prisma } from "@prisma/client";

/**
 * Best-effort per-option “why wrong” from bank JSON (shape varies by import).
 */
export function buildDistractorNotes(
  options: string[],
  correctLabels: string[],
  distractorRationales: Prisma.JsonValue | null | undefined,
  incorrectAnswerRationale: Prisma.JsonValue | null | undefined,
): { label: string; whyWrong: string }[] {
  const correctSet = new Set(correctLabels.map(String));
  const out: { label: string; whyWrong: string }[] = [];
  const optionSet = new Set(options.map(String));

  if (distractorRationales && typeof distractorRationales === "object" && !Array.isArray(distractorRationales)) {
    for (const [label, val] of Object.entries(distractorRationales as Record<string, unknown>)) {
      if (!optionSet.has(label) || correctSet.has(label)) continue;
      if (typeof val === "string" && val.trim()) out.push({ label, whyWrong: val.trim() });
    }
  }
  if (out.length > 0) return out;

  if (Array.isArray(incorrectAnswerRationale)) {
    for (const item of incorrectAnswerRationale) {
      if (!item || typeof item !== "object") continue;
      const o = item as Record<string, unknown>;
      const label = typeof o.option === "string" ? o.option : typeof o.label === "string" ? o.label : null;
      const why =
        typeof o.why === "string"
          ? o.why
          : typeof o.rationale === "string"
            ? o.rationale
            : typeof o.text === "string"
              ? o.text
              : null;
      if (label && why?.trim() && !correctSet.has(label) && optionSet.has(label)) {
        out.push({ label, whyWrong: why.trim() });
      }
    }
  }

  return out;
}
