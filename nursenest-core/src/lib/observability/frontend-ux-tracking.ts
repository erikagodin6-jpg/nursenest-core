"use client";

/**
 * User-visible failure signals for Sentry (tags + contexts). Use when the UI is wrong, empty, or stuck.
 * Pair with Session Replay; never put secrets or full PII in `message` / `extra`.
 */
import { stripMarketingLocalePrefix } from "@/lib/i18n/marketing-path";
import { readMarketingRegionFromDocument } from "@/lib/observability/learner-analytics-context.client";

type SentryScope = import("@sentry/nextjs").Scope;
type SentrySeverityLevel = import("@sentry/nextjs").SeverityLevel;

export type UxFailureKind =
  | "runtime_exception"
  | "hydration_error"
  | "fetch_failed"
  | "stuck_loading"
  | "paywall_proof_unavailable"
  | "render_failure"
  | "route_transition_failed"
  | "error_boundary_fallback"
  | "manual_retry"
  | "auto_retry_succeeded";

export type UxTrackingContext = {
  route: string;
  locale: string;
  country: string;
  deviceClass: "mobile" | "tablet" | "desktop";
};

function coarseDeviceClass(): UxTrackingContext["deviceClass"] {
  if (typeof window === "undefined") return "desktop";
  try {
    if (window.matchMedia?.("(max-width: 640px)").matches) return "mobile";
    if (window.matchMedia?.("(max-width: 1024px)").matches) return "tablet";
  } catch {
    /* ignore */
  }
  const ua = navigator.userAgent || "";
  if (/Mobile|Android|iPhone|iPad/i.test(ua)) return /iPad|Tablet/i.test(ua) ? "tablet" : "mobile";
  return "desktop";
}

/** Safe context for every UX event (route, locale, region, device). */
export function getUxTrackingContext(): UxTrackingContext {
  if (typeof window === "undefined") {
    return { route: "", locale: "en", country: "US", deviceClass: "desktop" };
  }
  const route = window.location.pathname.slice(0, 240);
  const { locale } = stripMarketingLocalePrefix(route);
  let country: string;
  try {
    country = readMarketingRegionFromDocument();
  } catch {
    country = "US";
  }
  return {
    route,
    locale,
    country,
    deviceClass: coarseDeviceClass(),
  };
}

function applyUxContextToScope(scope: SentryScope, ctx: UxTrackingContext): void {
  scope.setTag("ux.route", ctx.route.slice(0, 120));
  scope.setTag("ux.locale", ctx.locale);
  scope.setTag("ux.country", ctx.country);
  scope.setTag("ux.device_class", ctx.deviceClass);
  scope.setContext("ux", {
    route: ctx.route,
    locale: ctx.locale,
    country: ctx.country,
    deviceClass: ctx.deviceClass,
  });
}

/** Tag the *current* Sentry event (e.g. ErrorBoundary capture) without emitting a second issue. */
export function enrichSentryScopeWithUx(
  scope: SentryScope,
  opts: {
    kind: UxFailureKind | string;
    fallbackShown?: boolean;
    retrySucceeded?: boolean;
  },
): void {
  applyUxContextToScope(scope, getUxTrackingContext());
  scope.setTag("ux.kind", String(opts.kind).slice(0, 64));
  scope.setTag("ux.user_visible", "true");
  if (opts.fallbackShown !== undefined) scope.setTag("ux.fallback_shown", opts.fallbackShown ? "true" : "false");
  if (opts.retrySucceeded !== undefined) scope.setTag("ux.retry_succeeded", opts.retrySucceeded ? "true" : "false");
}

export type CaptureUxFailureOpts = {
  kind: UxFailureKind | string;
  message: string;
  level?: SentrySeverityLevel;
  error?: unknown;
  /** User saw a recovery / empty / paywall fallback instead of real content. */
  fallbackShown?: boolean;
  /** Explicit retry path succeeded (manual button or auto retry fired). */
  retrySucceeded?: boolean;
  extra?: Record<string, string | number | boolean | undefined>;
};

let lastHydrationLog = 0;

/**
 * Report a user-visible or user-impacting failure. Prefer `warning` for degraded UX, `error` for broken UI.
 */
export function captureUxFailure(opts: CaptureUxFailureOpts): void {
  if (process.env.NEXT_PUBLIC_SENTRY_ENABLED !== "true") {
    if (process.env.NODE_ENV === "development") {
      console.warn("[nn-ux]", opts.kind, opts.message, opts.extra);
    }
    return;
  }

  const ctx = getUxTrackingContext();
  const level: "error" | "warning" = opts.level === "error" ? "error" : "warning";
  const crumb = {
    category: "ux",
    message: `${opts.kind}: ${opts.message.slice(0, 200)}`,
    level,
    data: {
      kind: opts.kind,
      fallbackShown: opts.fallbackShown,
      retrySucceeded: opts.retrySucceeded,
      ...opts.extra,
    },
  };
  void import("@sentry/nextjs")
    .then((Sentry) => {
      Sentry.addBreadcrumb(crumb);
      Sentry.withScope((scope) => {
        applyUxContextToScope(scope, ctx);
        scope.setTag("ux.kind", String(opts.kind).slice(0, 64));
        scope.setTag("ux.user_visible", "true");
        if (opts.fallbackShown !== undefined) scope.setTag("ux.fallback_shown", opts.fallbackShown ? "true" : "false");
        if (opts.retrySucceeded !== undefined) scope.setTag("ux.retry_succeeded", opts.retrySucceeded ? "true" : "false");
        if (opts.extra) scope.setContext("ux_extra", opts.extra as Record<string, unknown>);

        if (opts.error instanceof Error) {
          scope.setFingerprint(["ux", String(opts.kind), opts.error.name]);
          Sentry.captureException(opts.error);
          return;
        }

        scope.setFingerprint(["ux", String(opts.kind), opts.message.slice(0, 40)]);
        Sentry.captureMessage(opts.message, opts.level ?? "warning");
      });
    })
    .catch(() => {});
}

/** Deduped hydration signal (browser may emit multiple error events). */
export function captureHydrationUxHint(message: string): void {
  const now = Date.now();
  if (now - lastHydrationLog < 3000) return;
  lastHydrationLog = now;
  captureUxFailure({
    kind: "hydration_error",
    level: "error",
    message: message.slice(0, 300),
    fallbackShown: true,
  });
}

let uxGlobalsMounted = false;

/** Call on client navigations (e.g. pathname change) to correlate chunk failures with route changes. */
let lastNavigationAt = Date.now();
export function touchUxNavigation(): void {
  lastNavigationAt = Date.now();
}

/** Window-level hints: hydration text, chunk / dynamic import failures during navigation. */
export function mountGlobalUxListeners(): void {
  if (typeof window === "undefined" || uxGlobalsMounted) return;
  uxGlobalsMounted = true;

  window.addEventListener(
    "error",
    (event) => {
      const msg = [event.message, (event.error as Error)?.message].filter(Boolean).join(" ");
      if (/hydration|did not match|Hydration failed|hydrating/i.test(msg)) {
        captureHydrationUxHint(msg);
      }
    },
    true,
  );

  window.addEventListener("unhandledrejection", (ev) => {
    const r = ev.reason;
    const text = r instanceof Error ? r.message : String(r);
    if (/Loading chunk \d+ failed|Failed to fetch dynamically imported module|ChunkLoadError|Importing a module script failed/i.test(text)) {
      captureUxFailure({
        kind: "route_transition_failed",
        level: "error",
        message: text.slice(0, 240),
        extra: {
          reason: "dynamic_import_or_chunk",
          msSinceLastNavigation: Date.now() - lastNavigationAt,
        },
      });
    }
  });
}
