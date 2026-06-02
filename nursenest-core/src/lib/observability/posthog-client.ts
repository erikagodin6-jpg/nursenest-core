"use client";

/** When true, learner-shell PostHog capture is skipped (admin QA simulation). */
let adminLearnerQaSessionSuppress = false;

export function setAdminLearnerQaClientAnalyticsSuppress(value: boolean): void {
  adminLearnerQaSessionSuppress = value;
}

/** Read-only — used by tests and diagnostics; true while learner shell runs verified QA simulation. */
export function isAdminLearnerQaClientAnalyticsSuppressed(): boolean {
  return adminLearnerQaSessionSuppress;
}

let initialized = false;
let posthogModulePromise: Promise<typeof import("posthog-js").default> | null = null;
let posthogClient: typeof import("posthog-js").default | null = null;

async function getPosthogClient(): Promise<typeof import("posthog-js").default | null> {
  if (typeof window === "undefined") return null;
  if (posthogClient) return posthogClient;
  if (!posthogModulePromise) {
    posthogModulePromise = import("posthog-js").then((module) => module.default);
  }
  posthogClient = await posthogModulePromise;
  return posthogClient;
}

export async function initPosthogClient(): Promise<void> {
  if (initialized || typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  if (!key) return;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com";
  const posthog = await getPosthogClient();
  if (!posthog) return;
  posthog.init(key, {
    api_host: host,
    capture_pageview: false,
    // Marketing/product analytics uses explicit captures. Disable automatic
    // autocapture/pageleave/session-recording so PostHog does not attach broad
    // DOM/lifecycle listeners to public marketing pages during the PSI window.
    autocapture: false,
    capture_pageleave: false,
    disable_session_recording: true,
    persistence: "localStorage",
    loaded: () => {
      initialized = true;
    },
  });
}

export function scheduleClientAnalyticsTask(run: () => void, timeoutMs = 2500): () => void {
  if (typeof window === "undefined") return () => {};
  if (typeof requestIdleCallback === "function") {
    const id = requestIdleCallback(run, { timeout: timeoutMs });
    return () => cancelIdleCallback(id);
  }
  const id = window.setTimeout(run, Math.min(timeoutMs, 2500));
  return () => window.clearTimeout(id);
}

async function captureClientEvent(
  event: string,
  props?: Record<string, string | number | boolean | undefined>,
): Promise<void> {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim()) return;
  try {
    const posthog = await getPosthogClient();
    if (!posthog) return;
    if (!initialized) {
      await initPosthogClient();
    }
    if (!initialized) return;
    posthog.capture(event, props);
  } catch {
    // ignore
  }
}

export async function trackClientEvent(
  event: string,
  props?: Record<string, string | number | boolean | undefined>,
): Promise<void> {
  if (typeof window === "undefined") return;
  if (adminLearnerQaSessionSuppress) return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim()) return;
  if (initialized) {
    await captureClientEvent(event, props);
    return;
  }
  scheduleClientAnalyticsTask(() => {
    void captureClientEvent(event, props);
  }, 5000);
}

export async function identifyPosthogUser(distinctId: string): Promise<void> {
  if (typeof window === "undefined") return;
  if (!initialized) {
    await initPosthogClient();
  }
  if (!initialized) return;
  try {
    const ph = await getPosthogClient();
    if (!ph) return;
    ph.identify(distinctId);
  } catch {}
}

export async function capturePosthogPageview(path: string, currentUrl: string): Promise<void> {
  if (typeof window === "undefined") return;
  if (adminLearnerQaSessionSuppress) return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim()) return;
  if (!initialized) {
    await initPosthogClient();
  }
  if (!initialized) return;
  try {
    const posthog = await getPosthogClient();
    if (!posthog) return;
    posthog.capture("$pageview", {
      path,
      $current_url: currentUrl,
    });
  } catch {
    // ignore
  }
}
