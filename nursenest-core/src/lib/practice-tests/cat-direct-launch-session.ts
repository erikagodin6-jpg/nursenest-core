import { buildCatExamSimulationCreatePayload } from "@/components/student/pathway-cat-start-payload";
import type { PracticeTestPathwayClientShell } from "@/lib/practice-tests/types";
import type { CatPracticeReadinessResult } from "@/lib/practice-tests/cat-practice-readiness";

/** Single-flight CAT launch must not hang indefinitely on slow DB — abort and surface a clear error. */
const CAT_DIRECT_LAUNCH_FETCH_TIMEOUT_MS = 28_000;

export type CatDirectLaunchSessionResult =
  | { ok: true; practiceTestId: string }
  | { ok: false; phase: "readiness" | "create"; message: string; code: string | null };

function launchKey(pathwayId: string, shell: PracticeTestPathwayClientShell): string {
  return `${pathwayId}:${shell.id}:${shell.examCode}:${shell.countrySlug}:${shell.roleTrack}`;
}

function fetchWithTimeout(
  fetchImpl: typeof fetch,
  input: RequestInfo | URL,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
  const { timeoutMs = CAT_DIRECT_LAUNCH_FETCH_TIMEOUT_MS, ...rest } = init;
  const ctl = new AbortController();
  const id = setTimeout(() => ctl.abort(), timeoutMs);
  return fetchImpl(input, { ...rest, signal: ctl.signal }).finally(() => clearTimeout(id));
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
      let resReady: Response;
      try {
        resReady = await fetchWithTimeout(
          fetchImpl,
          `/api/practice-tests/cat-readiness?pathwayId=${encodeURIComponent(pathwayId)}`,
          { method: "GET", credentials: "include", cache: "no-store" },
        );
      } catch {
        return {
          ok: false,
          phase: "readiness",
          message:
            "Timed out while verifying the CAT question pool. Your connection may be slow, or the service is busy — wait a moment and try again, or open full setup below.",
          code: "readiness_timeout",
        };
      }
      if (!resReady.ok) {
        const status = resReady.status;
        return {
          ok: false,
          phase: "readiness",
          message:
            status === 429
              ? "Too many readiness checks in a short window. Please wait a few seconds and try again."
              : status === 503
                ? "The readiness service is temporarily unavailable. Try again shortly or use full setup below."
                : `Readiness check failed (HTTP ${status}). Try again or open full setup below.`,
          code: `readiness_http_${status}`,
        };
      }
      let readiness: CatPracticeReadinessResult;
      try {
        readiness = (await resReady.json()) as CatPracticeReadinessResult;
      } catch {
        return {
          ok: false,
          phase: "readiness",
          message: "Received an invalid response from the readiness check. Refresh the page and try again.",
          code: "readiness_bad_json",
        };
      }
      if (!readiness.ok) {
        return {
          ok: false,
          phase: "readiness",
          message: readiness.message,
          code: typeof readiness.code === "string" ? readiness.code : null,
        };
      }
      const payload = buildCatExamSimulationCreatePayload(pathwayShell);
      let res: Response;
      try {
        res = await fetchWithTimeout(fetchImpl, "/api/practice-tests", {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            "x-nn-study-launch-surface": "practice_exams",
          },
          body: JSON.stringify(payload),
        });
      } catch {
        return {
          ok: false,
          phase: "create",
          message:
            "Timed out while starting your exam session. Check your connection, wait a moment, and try again — or use full setup below.",
          code: "create_timeout",
        };
      }
      let data: { id?: string; error?: string; code?: string };
      try {
        data = (await res.json()) as { id?: string; error?: string; code?: string };
      } catch {
        return {
          ok: false,
          phase: "create",
          message: "Received an invalid response when starting the session. Refresh and try again.",
          code: "create_bad_json",
        };
      }
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
