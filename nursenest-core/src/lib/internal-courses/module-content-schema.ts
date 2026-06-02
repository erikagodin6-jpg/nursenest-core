import { z } from "zod";
import type { InternalCourseModuleType } from "@prisma/client";

const ecgSchema = z.object({
  title: z.string().min(1),
  stripSummary: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  rationale: z.string().min(1),
});

const scenarioDecisionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  outcome: z.string().min(1),
});

const scenarioSchema = z.object({
  stem: z.string().min(1),
  decisions: z.array(scenarioDecisionSchema).min(1),
});

const quizOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

const quizSchema = z.object({
  question: z.string().min(1),
  options: z.array(quizOptionSchema).min(2),
  correctId: z.string().min(1),
  rationale: z.string().min(1),
});

const treeNodeSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  choices: z.array(
    z.object({
      label: z.string().min(1),
      next: z.string().min(1),
    }),
  ),
});

const decisionTreeSchema = z.object({
  rootId: z.string().min(1),
  nodes: z.array(treeNodeSchema).min(1),
});

export type ParsedEcgContent = z.infer<typeof ecgSchema>;
export type ParsedScenarioContent = z.infer<typeof scenarioSchema>;
export type ParsedQuizContent = z.infer<typeof quizSchema>;
export type ParsedDecisionTreeContent = z.infer<typeof decisionTreeSchema>;

export type ValidatedModuleContent =
  | { ok: true; type: "ecg"; data: ParsedEcgContent }
  | { ok: true; type: "scenario"; data: ParsedScenarioContent }
  | { ok: true; type: "quiz"; data: ParsedQuizContent }
  | { ok: true; type: "decision_tree"; data: ParsedDecisionTreeContent }
  | { ok: false; issues: string[] };

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw != null && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : null;
}

/**
 * Validates persisted {@link InternalCourseModule} JSON without rendering raw payloads.
 * Invalid shapes return `ok: false` with human-readable issues (UI shows a warning card).
 */
export function validateInternalCourseModuleContent(
  type: InternalCourseModuleType,
  raw: unknown,
): ValidatedModuleContent {
  const rec = asRecord(raw);
  if (!rec) {
    return { ok: false, issues: ["Module content must be a JSON object."] };
  }
  try {
    if (type === "ecg") {
      const r = ecgSchema.safeParse(raw);
      return r.success ? { ok: true, type: "ecg", data: r.data } : { ok: false, issues: r.error.issues.map((i) => i.message) };
    }
    if (type === "scenario") {
      const r = scenarioSchema.safeParse(raw);
      return r.success
        ? { ok: true, type: "scenario", data: r.data }
        : { ok: false, issues: r.error.issues.map((i) => i.message) };
    }
    if (type === "quiz") {
      const r = quizSchema.safeParse(raw);
      if (!r.success) return { ok: false, issues: r.error.issues.map((i) => i.message) };
      const ids = new Set(r.data.options.map((o) => o.id));
      if (!ids.has(r.data.correctId)) {
        return { ok: false, issues: ["correctId must match one of the option ids."] };
      }
      return { ok: true, type: "quiz", data: r.data };
    }
    if (type === "decision_tree") {
      const r = decisionTreeSchema.safeParse(raw);
      if (!r.success) return { ok: false, issues: r.error.issues.map((i) => i.message) };
      const nodeIds = new Set(r.data.nodes.map((n) => n.id));
      if (!nodeIds.has(r.data.rootId)) {
        return { ok: false, issues: ["rootId must match a node id."] };
      }
      for (const n of r.data.nodes) {
        for (const c of n.choices) {
          if (c.next !== n.id && !nodeIds.has(c.next)) {
            return { ok: false, issues: [`Unknown next node "${c.next}" from "${n.id}".`] };
          }
        }
      }
      return { ok: true, type: "decision_tree", data: r.data };
    }
    return { ok: false, issues: [`Unsupported module type: ${String(type)}`] };
  } catch {
    return { ok: false, issues: ["Unable to parse module content."] };
  }
}
