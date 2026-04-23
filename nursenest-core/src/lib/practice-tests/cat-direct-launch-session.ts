import { buildCatExamSimulationCreatePayload } from "@/components/student/pathway-cat-start-payload";
import type { PracticeTestPathwayClientShell } from "@/lib/practice-tests/types";
import type { CatPracticeReadinessResult } from "@/lib/practice-tests/cat-practice-readiness";

export type CatDirectLaunchSessionResult =
  | { ok: true; practiceTestId: string }
  | { ok: false; phase: "readiness" | "create"; message: string; code: string | null };

function launchKey(pathwayId: string, shell: PracticeTestPathwayClientShell): string {
  return `${pathwayId}:${shell.id}:${shell.examCode}:${shell.countrySlug}:${shell.roleTrack}`;
}

const inflight = new Map<string, Promise<CatDirectLaunchSessionResult>>();

/**
 * Single-flight CAT direct launch for a pathway: one readiness + one POST /api/practice-tests
 * per in-flight key (survives React Strict Mode remounts and rapid re-entry with the same pathway).
 */
export function runCatDirectLaunchSessionOnce(
  pathwayId: string,
  pathwayShell: PracticeTestPathwayClientShell,
  fetchImpl: typeof fetch = fetch,
): Promise<CatDirectLaunchSessionResult> {
  const key = launchKey(pathwayId, pathwayShell);
  const existing = inflight.get(key);
  if (existing) return existing;

  const p: Promise<CatDirectLaunchSessionResult> = (async (): Promise<CatDirectLaunchSessionResult> => {
    try {
      const resReady = await fetchImpl(
        `/api/practice-tests/cat-readiness?pathwayId=${encodeURIComponent(pathwayId)}`,
        { method: "GET", credentials: "same-origin" },
      );
      const readiness = (await resReady.json()) as CatPracticeReadinessResult;
      if (!readiness.ok) {
        return {
          ok: false,
          phase: "readiness",
          message: readiness.message,
          code: typeof readiness.code === "string" ? readiness.code : null,
        };
      }
      const payload = buildCatExamSimulationCreatePayload(pathwayShell);
      const res = await fetchImpl("/api/practice-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { id?: string; error?: string; code?: string };
      if (!res.ok) {
        return {
          ok: false,
          phase: "create",
          message: typeof data.error === "string" && data.error.trim() ? data.error : "Could not start your exam.",
          code: typeof data.code === "string" ? data.code : null,
        };
      }
      if (!data.id || typeof data.id !== "string") {
        return {
          ok: false,
          phase: "create",
          message: "Your session could not be confirmed. Please try again or use full setup below.",
          code: null,
        };
      }
      return { ok: true, practiceTestId: data.id };
    } finally {
      queueMicrotask(() => {
        inflight.delete(key);
      });
    }
  })();

  inflight.set(key, p);
  return p;
}

/** @internal — tests only */
export function __resetCatDirectLaunchSessionInflightForTests(): void {
  inflight.clear();
}
