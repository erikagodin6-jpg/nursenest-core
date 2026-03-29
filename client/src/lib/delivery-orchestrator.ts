import { useState, useCallback } from "react";

export type ContentType = "exam" | "cat" | "flashcard" | "lesson" | "download" | "study-guide" | "question-bank" | "mock-exam";

export type DeliveryMode =
  | "primary"
  | "safe-fallback"
  | "study-mode"
  | "backup-version"
  | "static-backup"
  | "printable-backup"
  | "fixed-form-backup"
  | "downloadable-backup"
  | "mirrored-storage"
  | "manual-fulfillment"
  | "recovery-screen";

export interface DeliveryDecision {
  mode: DeliveryMode;
  reason: string;
  contentType: ContentType;
  contentId?: string;
  fallbackChainPosition: number;
  metadata?: Record<string, any>;
}

export function useDeliveryOrchestrator(contentType: ContentType, contentId?: string) {
  const [decision, setDecision] = useState<DeliveryDecision | null>(null);
  const [loading, setLoading] = useState(false);

  const evaluate = useCallback(async (options?: {
    primaryFailed?: boolean;
    requestedMode?: DeliveryMode;
    failureReason?: string;
  }) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ contentType });
      if (contentId) params.set("contentId", contentId);
      if (options?.primaryFailed) params.set("primaryFailed", "true");
      if (options?.requestedMode) params.set("mode", options.requestedMode);
      if (options?.failureReason) params.set("failureReason", options.failureReason);

      const res = await fetch(`/api/delivery/evaluate?${params}`);
      if (res.ok) {
        const data: DeliveryDecision = await res.json();
        setDecision(data);
        return data;
      }
    } catch {} finally {
      setLoading(false);
    }

    const fallback: DeliveryDecision = {
      mode: options?.primaryFailed ? "safe-fallback" : "primary",
      reason: options?.primaryFailed ? "client_fallback" : "primary_default",
      contentType,
      contentId,
      fallbackChainPosition: options?.primaryFailed ? 1 : 0,
    };
    setDecision(fallback);
    return fallback;
  }, [contentType, contentId]);

  const escalate = useCallback(async () => {
    return evaluate({ primaryFailed: true, failureReason: "user_escalated" });
  }, [evaluate]);

  const requestMode = useCallback(async (mode: DeliveryMode) => {
    return evaluate({ requestedMode: mode });
  }, [evaluate]);

  return { decision, loading, evaluate, escalate, requestMode };
}

export function logFallbackEvent(
  contentType: ContentType,
  resolvedMode: DeliveryMode,
  reason: string,
  contentId?: string,
  extra?: Record<string, any>
) {
  const event = {
    contentType,
    resolvedMode,
    reason,
    contentId,
    route: window.location.pathname,
    timestamp: new Date().toISOString(),
    ...extra,
  };

  console.warn("[FallbackEvent]", JSON.stringify(event));

  try {
    fetch("/api/resilience/incident-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentType,
        route: window.location.pathname,
        errorMessage: `Fallback activated: ${resolvedMode} (${reason})`,
        source: "delivery_orchestrator_client",
        additionalContext: event,
      }),
    }).catch(() => {});
  } catch {}
}
