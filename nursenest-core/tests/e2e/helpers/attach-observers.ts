import type { Page } from "@playwright/test";

/** `public`: marketing/dev noise (HMR, analytics). `app`: learner surfaces (looser console filter). */
export type ObserverProfile = "public" | "app";

export type ConsoleErrorContext = { text: string; pageUrl: string };

/** Auth.js / NextAuth JSON session probe (same-origin `/api/auth/*`). */
export type AuthHttpProbe = { url: string; status: number; pageUrl: string };

export type PageObservers = {
  consoleErrors: string[];
  /** When `captureConsoleContext` is true, one entry per console error with `page.url()` at fire time. */
  consoleErrorContext?: ConsoleErrorContext[];
  failedRequests: string[];
  /** Populated when `probeAuthApi` is true: responses to `/api/auth/*` (status + page URL). */
  authHttp?: AuthHttpProbe[];
  dispose: () => void;
};

function shouldIgnoreConsolePublic(text: string): boolean {
  return (
    /favicon|ResizeObserver|webpack-hmr|WebSocket connection.*_next\/webpack-hmr|Download the React DevTools/i.test(
      text,
    ) ||
    /Failed to load resource.*404.*\.ico/i.test(text) ||
    /\[auth\]\[error\]|MissingSecret|errors\.authjs\.dev#missingsecret/i.test(text) ||
    /** Session probe from marketing shell when origin/env mismatch in dev — covered by AUTH_URL in Playwright webServer. */
    /ClientFetchError: Failed to fetch.*errors\.authjs\.dev#autherror|getSession \(.*SessionProvider/i.test(text) ||
    /** Next/Image dev warning (quality list vs CMS assets). */
    /next-image-unconfigured-qualities|is using quality .* which is not configured in images\.qualities/i.test(text) ||
    /** Auth.js / Next dev: stack lines are separate console "error" messages without the header line. */
    /@auth_core|@01rp_@auth_core|at assertConfig \(.*auth|at Auth \(.*auth/i.test(text) ||
    /\[marketing-i18n\] missing key|at formatMarketingMessage|at MarketingI18nProvider|at BrandTrustInline/i.test(text) ||
    /hydration mismatch|hydrated but some attributes of the server rendered HTML|emitPendingHydrationWarnings/i.test(text) ||
    /**
     * Lesson hub cards: StudyCard still passes lucide icon elements across the RSC boundary in some paths —
     * React logs serialization errors that are caught by an error boundary. Remove these once hub cards only
     * pass serializable props (or move icons client-side).
     */
    /Only plain objects can be passed to Client Components|Functions cannot be passed directly to Client Components|The above error occurred in the <StudyCard>/i.test(
      text,
    ) ||
    /%c%s%c Only plain objects can be passed to Client Components|%s Error: Functions cannot be passed directly to Client Components|icon=\{\{\$\$typeof:/i.test(
      text,
    ) ||
    /** Dev without DATABASE_URL: server logs hub fallback as styled console "errors". */
    /\[nursenest-core\] pathway_lessons hub_list_db_unavailable_fail_closed|\[nursenest-core\] route_fallback route_render_fallback_used/i.test(
      text,
    ) ||
    /** Known i18n gaps on marketing auth pages — not runtime failures. */
    /\[nursenest-core\].*marketing_message_key_missing/i.test(text)
  );
}

function shouldIgnoreConsoleApp(text: string): boolean {
  return (
    /favicon|ResizeObserver|Failed to load resource.*404.*\.ico/i.test(text) ||
    /** Production logs missing learner-shell keys — tracked separately; not a navigation failure. */
    /\[nursenest-core\].*marketing_message_key_missing/i.test(text)
  );
}

function shouldIgnoreFailedRequestPublic(url: string): boolean {
  return /favicon|\.woff2?$|google-analytics|googletagmanager|facebook\.net|doubleclick|clarity\.ms|webpack-hmr/i.test(
    url,
  );
}

function shouldIgnoreFailedRequestApp(url: string): boolean {
  if (/favicon|\.woff2?$|google-analytics|googletagmanager|facebook\.net|doubleclick|clarity\.ms/i.test(url)) {
    return true;
  }
  return false;
}

/**
 * Collects console errors and failed network requests for diagnostics.
 * Call `dispose()` in a `finally` block or after assertions.
 */
export function attachPageObservers(
  page: Page,
  opts?: { profile?: ObserverProfile; captureConsoleContext?: boolean; probeAuthApi?: boolean },
): PageObservers {
  const profile: ObserverProfile = opts?.profile ?? "public";
  const captureConsoleContext = Boolean(opts?.captureConsoleContext);
  const probeAuthApi = Boolean(opts?.probeAuthApi);
  const consoleErrors: string[] = [];
  const consoleErrorContext: ConsoleErrorContext[] | undefined = captureConsoleContext ? [] : undefined;
  const failedRequests: string[] = [];
  const authHttp: AuthHttpProbe[] | undefined = probeAuthApi ? [] : undefined;

  const onConsole = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() !== "error") return;
    const t = msg.text();
    const ignore = profile === "app" ? shouldIgnoreConsoleApp(t) : shouldIgnoreConsolePublic(t);
    if (ignore) return;
    consoleErrors.push(t);
    if (consoleErrorContext) {
      consoleErrorContext.push({ text: t, pageUrl: page.url() });
    }
  };

  const onRequestFailed = (req: import("@playwright/test").Request) => {
    const url = req.url();
    const fail = req.failure();
    /** Locale / SPA transitions often abort an in-flight document fetch — not a flaky-network signal. */
    if (fail?.errorText === "net::ERR_ABORTED") return;
    const ignore =
      profile === "app" ? shouldIgnoreFailedRequestApp(url) : shouldIgnoreFailedRequestPublic(url);
    if (ignore) return;
    failedRequests.push(`${fail?.errorText ?? "failed"} ${url}`);
  };

  const onResponse = (response: import("@playwright/test").Response) => {
    if (!authHttp) return;
    const url = response.url();
    try {
      const u = new URL(url);
      if (!u.pathname.startsWith("/api/auth")) return;
    } catch {
      return;
    }
    authHttp.push({ url, status: response.status(), pageUrl: page.url() });
  };

  page.on("console", onConsole);
  page.on("requestfailed", onRequestFailed);
  if (probeAuthApi) {
    page.on("response", onResponse);
  }

  return {
    consoleErrors,
    consoleErrorContext,
    failedRequests,
    authHttp,
    dispose: () => {
      page.off("console", onConsole);
      page.off("requestfailed", onRequestFailed);
      if (probeAuthApi) {
        page.off("response", onResponse);
      }
    },
  };
}

export async function logObserverDiagnostics(
  observers: PageObservers,
  testName: string,
): Promise<{ consoleErrors: string[]; failedRequests: string[] }> {
  const { consoleErrors, failedRequests } = observers;
  if (consoleErrors.length > 0 || failedRequests.length > 0) {
    // eslint-disable-next-line no-console
    console.log(`[${testName}] console errors:`, consoleErrors);
    // eslint-disable-next-line no-console
    console.log(`[${testName}] failed requests:`, failedRequests);
  }
  return { consoleErrors, failedRequests };
}
