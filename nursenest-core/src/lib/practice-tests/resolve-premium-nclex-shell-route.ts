import { pathwayUsesPremiumNclexExamShell } from "@/lib/practice-tests/premium-exam-shell-pathways";

export type PremiumNclexShellRoute = "cat" | "practice";

function readConfigString(cfg: Record<string, unknown>, key: string): string | null {
  const v = cfg[key];
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : null;
}

/**
 * Selects the dedicated NCLEX exam shell for in-progress practice tests.
 * Returns null when the session should use `PracticeTestRunnerClient` (legacy linear, guided CAT study, etc.).
 */
export function resolvePremiumNclexShellRoute(args: {
  config: Record<string, unknown> | null | undefined;
  pathwayId: string | null | undefined;
}): PremiumNclexShellRoute | null {
  const cfg = args.config;
  if (!cfg) return null;
  if (!pathwayUsesPremiumNclexExamShell(args.pathwayId)) return null;

  if (cfg.catPresentationMode === "exam_simulation") {
    return "cat";
  }

  if (cfg.catAdaptiveSessionType === "practice") {
    return null;
  }

  // Unified setup CAT launches use the dedicated fixed-viewport exam shell even
  // when the feature flag leaves presentationMode as "practice".
  if (cfg.selectionMode === "cat") {
    return "cat";
  }

  // Hub "Practice Exams" and learning-mode linear sessions share the dedicated exam workspace.
  if (cfg.linearDeliveryMode === "exam" || cfg.linearDeliveryMode === "practice") {
    return "practice";
  }

  return null;
}

/** Parse stored practice test config + pathway id from Prisma JSON. */
export function practiceTestConfigRecord(
  raw: unknown,
): { config: Record<string, unknown>; pathwayId: string | null } | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const config = raw as Record<string, unknown>;
  const pathwayId = readConfigString(config, "pathwayId");
  return { config, pathwayId };
}
