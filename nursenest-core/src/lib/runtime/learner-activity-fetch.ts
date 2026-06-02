"use client";

import { logDedupedClientDiagnostic, type ClientDiagnosticMeta } from "@/lib/runtime/client-diagnostic-log";
import { fetchWithRetry, type FetchWithRetryOptions } from "@/lib/runtime/fetch-with-retry";

export type LearnerActivityFetchOptions = {
  signal?: AbortSignal;
  timeoutMs?: number;
  attempts?: number;
  diagnosticScope: string;
  diagnosticKey?: string;
  diagnosticMeta?: ClientDiagnosticMeta;
  init?: RequestInit;
};

export type LearnerActivityJsonResult<T> =
  | { ok: true; response: Response; data: T }
  | { ok: false; response?: Response; error: string; aborted: boolean };

function abortSignalAny(signals: AbortSignal[]): AbortSignal {
  const active = signals.filter(Boolean);
  if (active.length === 1) return active[0]!;
  const controller = new AbortController();
  const abort = () => controller.abort();
  for (const signal of active) {
    if (signal.aborted) {
      controller.abort();
      break;
    }
    signal.addEventListener("abort", abort, { once: true });
  }
  return controller.signal;
}

export function createLearnerActivityAbortController(timeoutMs: number): {
  controller: AbortController;
  signal: AbortSignal;
  cleanup: () => void;
} {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), Math.max(1, timeoutMs));
  return {
    controller,
    signal: controller.signal,
    cleanup: () => window.clearTimeout(timeout),
  };
}

export async function fetchLearnerActivityJson<T>(
  url: string,
  options: LearnerActivityFetchOptions,
): Promise<LearnerActivityJsonResult<T>> {
  const {
    diagnosticScope,
    diagnosticKey = url,
    diagnosticMeta,
    signal,
    timeoutMs = 12_000,
    attempts = 2,
    init,
  } = options;
  const timeout = createLearnerActivityAbortController(timeoutMs);
  const combinedSignal = signal ? abortSignalAny([signal, timeout.signal]) : timeout.signal;
  const fetchOptions: FetchWithRetryOptions = { attempts, timeoutMs: 0 };

  try {
    const response = await fetchWithRetry(
      url,
      {
        credentials: "include",
        cache: "no-store",
        ...init,
        signal: combinedSignal,
      },
      fetchOptions,
    );
    let data: T;
    try {
      data = (await response.json()) as T;
    } catch (error) {
      logDedupedClientDiagnostic(diagnosticScope, "json_parse_failed", diagnosticKey, {
        ...diagnosticMeta,
        httpStatus: response.status,
        message: error instanceof Error ? error.message : "unknown",
      });
      return { ok: false, response, error: "invalid_json", aborted: combinedSignal.aborted };
    }
    if (!response.ok) {
      logDedupedClientDiagnostic(diagnosticScope, "http_failed", diagnosticKey, {
        ...diagnosticMeta,
        httpStatus: response.status,
      });
      return { ok: false, response, error: `http_${response.status}`, aborted: combinedSignal.aborted };
    }
    return { ok: true, response, data };
  } catch (error) {
    const aborted = combinedSignal.aborted;
    if (!aborted) {
      logDedupedClientDiagnostic(diagnosticScope, "network_failed", diagnosticKey, {
        ...diagnosticMeta,
        message: error instanceof Error ? error.message : "unknown",
      });
    }
    return { ok: false, error: aborted ? "aborted" : "network_failed", aborted };
  } finally {
    timeout.cleanup();
  }
}
