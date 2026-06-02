"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { isClientDurabilityNonCriticalDisabled } from "@/lib/durability/client-durability-flags";
import { isLearnerShell } from "@/lib/navigation/learner-shell";

type LearnerActivity =
  | "questions"
  | "flashcards"
  | "lessons"
  | "clinical-skills"
  | "pharmacology"
  | "ecg"
  | "cat"
  | "loft"
  | "analytics"
  | "dashboard"
  | "study-plan"
  | "smart-review"
  | "readiness";

type LifecycleEvent =
  | "activity_started"
  | "activity_completed"
  | "activity_abandoned"
  | "activity_error"
  | "activity_resume";

type LifecyclePayload = {
  activity: LearnerActivity;
  event: LifecycleEvent;
  route: string;
  sessionId: string;
  durationMs?: number;
  completionRatio?: number;
  reason?: "navigation" | "timeout" | "error" | "unknown";
  errorMessage?: string;
};

const ACTIVITY_PREFIXES: Array<{ activity: LearnerActivity; prefixes: string[] }> = [
  { activity: "cat", prefixes: ["/app/cat", "/app/practice-tests/cat-launch", "/app/practice-tests/cat-insights"] },
  { activity: "questions", prefixes: ["/app/questions", "/app/practice-tests", "/app/practice"] },
  { activity: "flashcards", prefixes: ["/app/flashcards", "/app/study-tools/flashcards"] },
  { activity: "lessons", prefixes: ["/app/lessons"] },
  { activity: "clinical-skills", prefixes: ["/app/clinical-skills"] },
  { activity: "pharmacology", prefixes: ["/app/pharmacology", "/app/medication-drills"] },
  { activity: "ecg", prefixes: ["/app/ecg-video-quiz", "/modules/ecg", "/modules/ecg-advanced", "/modules/ecg-interpretation"] },
  { activity: "loft", prefixes: ["/app/osce", "/app/loft", "/app/simulations", "/app/clinical-scenarios", "/app/cases/cnple"] },
  { activity: "readiness", prefixes: ["/app/account/readiness", "/app/account/report-card"] },
  { activity: "study-plan", prefixes: ["/app/study-plan", "/app/exam-plan", "/app/study-coach", "/app/coach"] },
  { activity: "smart-review", prefixes: ["/app/review", "/app/account/review-queue"] },
  { activity: "analytics", prefixes: ["/app/account/analytics", "/app/account/progress", "/app/account/activity"] },
];

function normalizePathname(pathname: string | null): string {
  return (pathname ?? "").split("?")[0]?.replace(/\/+$/, "").toLowerCase() || "/";
}

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function activityFromPathname(pathname: string | null): LearnerActivity | null {
  const normalized = normalizePathname(pathname);
  if (normalized === "/app" || normalized === "/app/command-center" || normalized === "/app/start-studying") {
    return "dashboard";
  }

  for (const route of ACTIVITY_PREFIXES) {
    if (route.prefixes.some((prefix) => matchesPrefix(normalized, prefix))) {
      return route.activity;
    }
  }

  return null;
}

function makeSessionId(activity: LearnerActivity, route: string): string {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${activity}:${route}:${id}`.slice(0, 128);
}

function sendLifecycle(payload: LifecyclePayload, keepalive = true): void {
  const body = JSON.stringify(payload);
  if (keepalive && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon("/api/learner/activity-lifecycle", blob)) return;
  }

  void fetch("/api/learner/activity-lifecycle", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive,
  }).catch(() => {
    /* observability must never disrupt studying */
  });
}

export function LearnerActivityLifecycleBeacon() {
  const pathname = usePathname();
  const startedKey = useRef<string | null>(null);
  const sessionRef = useRef<{ activity: LearnerActivity; route: string; sessionId: string; startedAt: number } | null>(
    null,
  );

  const activity = useMemo(() => activityFromPathname(pathname), [pathname]);

  useEffect(() => {
    if (isClientDurabilityNonCriticalDisabled()) return;
    if (!pathname || !isLearnerShell(pathname) || !activity) return;

    const route = normalizePathname(pathname);
    const key = `${activity}:${route}`;
    if (startedKey.current === key) return;
    startedKey.current = key;

    const sessionId = makeSessionId(activity, route);
    const startedAt = performance.now();
    sessionRef.current = { activity, route, sessionId, startedAt };

    sendLifecycle({ activity, event: "activity_started", route, sessionId }, false);

    const onVisibilityChange = () => {
      const active = sessionRef.current;
      if (!active) return;
      const durationMs = Math.max(0, Math.round(performance.now() - active.startedAt));
      if (document.visibilityState === "hidden") {
        sendLifecycle({
          activity: active.activity,
          event: "activity_abandoned",
          route: active.route,
          sessionId: active.sessionId,
          durationMs,
          reason: "navigation",
        });
      } else {
        sendLifecycle({
          activity: active.activity,
          event: "activity_resume",
          route: active.route,
          sessionId: active.sessionId,
          durationMs,
        }, false);
      }
    };

    const onError = (event: ErrorEvent) => {
      const active = sessionRef.current;
      if (!active) return;
      sendLifecycle({
        activity: active.activity,
        event: "activity_error",
        route: active.route,
        sessionId: active.sessionId,
        errorMessage: event.message || "window error",
        reason: "error",
      });
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const active = sessionRef.current;
      if (!active) return;
      const reason = event.reason instanceof Error ? event.reason.message : String(event.reason ?? "unhandled rejection");
      sendLifecycle({
        activity: active.activity,
        event: "activity_error",
        route: active.route,
        sessionId: active.sessionId,
        errorMessage: reason.slice(0, 200),
        reason: "error",
      });
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      const active = sessionRef.current;
      if (active?.sessionId === sessionId) {
        const durationMs = Math.max(0, Math.round(performance.now() - active.startedAt));
        sendLifecycle({
          activity: active.activity,
          event: "activity_abandoned",
          route: active.route,
          sessionId: active.sessionId,
          durationMs,
          reason: "navigation",
        });
      }
    };
  }, [activity, pathname]);

  return null;
}
