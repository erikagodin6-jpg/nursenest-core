export type PremiumNclexShellRoute = "cat" | "practice";

function readConfigString(cfg: Record<string, unknown>, key: string): string | null {
  const v = cfg[key];
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : null;
}

/**
 * Selects the dedicated NCLEX exam shell for in-progress practice tests.
 * Returns null when the session should use `PracticeTestRunnerClient` (CAT study, legacy linear, etc.).
 */
export function resolvePremiumNclexShellRoute(args: {
  config: Record<string, unknown> | null | undefined;
  pathwayId: string | null | undefined;
}): PremiumNclexShellRoute | null {
  const cfg = args.config;
  if (!cfg) return null;

  if (cfg.catPresentationMode === "exam_simulation") {
    return "cat";
  }

  // CAT guided practice — legacy runner handles cat_advance + study reveal.
  if (cfg.catAdaptiveSessionType === "practice") {
    return null;
  }
  if (cfg.selectionMode === "cat") {
    return null;
  }

  // Hub "Practice Exams" and linear licensing simulations use linear exam delivery.
  if (cfg.linearDeliveryMode === "exam") {
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
