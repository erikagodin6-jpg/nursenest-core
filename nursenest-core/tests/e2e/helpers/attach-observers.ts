import type { Page } from "@playwright/test";

/** `public`: marketing/dev noise (HMR, analytics). `app`: learner surfaces (looser console filter). */
export type ObserverProfile = "public" | "app";

export type PageObservers = {
  consoleErrors: string[];
  failedRequests: string[];
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
    /hydration mismatch|hydrated but some attributes of the server rendered HTML|emitPendingHydrationWarnings/i.test(text)
  );
}

function shouldIgnoreConsoleApp(text: string): boolean {
  return /favicon|ResizeObserver|Failed to load resource.*404.*\.ico/i.test(text);
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
export function attachPageObservers(page: Page, opts?: { profile?: ObserverProfile }): PageObservers {
  const profile: ObserverProfile = opts?.profile ?? "public";
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];

  const onConsole = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() !== "error") return;
    const t = msg.text();
    const ignore = profile === "app" ? shouldIgnoreConsoleApp(t) : shouldIgnoreConsolePublic(t);
    if (ignore) return;
    consoleErrors.push(t);
  };

  const onRequestFailed = (req: import("@playwright/test").Request) => {
    const url = req.url();
    const ignore =
      profile === "app" ? shouldIgnoreFailedRequestApp(url) : shouldIgnoreFailedRequestPublic(url);
    if (ignore) return;
    const fail = req.failure();
    failedRequests.push(`${fail?.errorText ?? "failed"} ${url}`);
  };

  page.on("console", onConsole);
  page.on("requestfailed", onRequestFailed);

  return {
    consoleErrors,
    failedRequests,
    dispose: () => {
      page.off("console", onConsole);
      page.off("requestfailed", onRequestFailed);
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
