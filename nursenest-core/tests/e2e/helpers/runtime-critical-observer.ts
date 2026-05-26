import { expect, type Page, type TestInfo } from "@playwright/test";

type RuntimeFailure = {
  kind: "console" | "pageerror" | "requestfailed" | "response" | "runtime-event";
  message: string;
  url?: string;
};

export type RuntimeCriticalObserver = {
  failures: RuntimeFailure[];
  navigationPaths: string[];
  dispose: () => void;
};

const BLOCKING_CONSOLE_PATTERNS = [
  /\[nn-runtime\]\s+route_transition_failure/i,
  /\[nn-runtime\]\s+cat_runtime_bootstrap_failed/i,
  /\[nn-runtime\]\s+activity_bootstrap_failure/i,
  /\[nn-runtime\]\s+chunk_load_failed/i,
  /\[nn-runtime\]\s+malformed_session_detected/i,
  /ChunkLoadError|Loading chunk .* failed/i,
  /Hydration failed|Minified React error|ReferenceError|TypeError/i,
  /Cannot read properties of undefined|Cannot read properties of null/i,
];

const NON_BLOCKING_CONSOLE_PATTERNS = [
  /favicon|ResizeObserver|Download the React DevTools|webpack-hmr/i,
  /marketing_message_key_missing|homepage-marketing-copy|Missing marketing message key/i,
  /pathway_lessons hub_list_db_unavailable_fail_closed|route_render_fallback_used/i,
  /blog_public_db_read_failed|home_stats_fail_soft|home_blog_teaser/i,
  /Stripe.*missing|STRIPE_SECRET_KEY is missing/i,
  /next-image-unconfigured-qualities|is using quality .* not configured/i,
];

const CRITICAL_API_OR_ASSET_PATTERNS = [
  /\/api\/practice-tests/i,
  /\/api\/flashcards\/custom-session/i,
  /\/api\/auth\/session/i,
  /\/_next\/static\/chunks\//i,
];

function isBlockingConsole(text: string): boolean {
  if (NON_BLOCKING_CONSOLE_PATTERNS.some((pattern) => pattern.test(text))) return false;
  return BLOCKING_CONSOLE_PATTERNS.some((pattern) => pattern.test(text));
}

function isCriticalUrl(url: string): boolean {
  return CRITICAL_API_OR_ASSET_PATTERNS.some((pattern) => pattern.test(url));
}

function compactFailure(failure: RuntimeFailure): string {
  const url = failure.url ? ` ${failure.url}` : "";
  return `${failure.kind}${url}: ${failure.message}`.slice(0, 1_000);
}

/**
 * Runtime regression sentinel for Codex/Cursor-driven browser checks.
 *
 * It intentionally watches only runtime-blocking signals so marketing copy gaps and local DB fail-soft
 * diagnostics do not drown out CAT/bootstrap/theme failures.
 */
export async function attachRuntimeCriticalObserver(
  page: Page,
  testInfo?: TestInfo,
): Promise<RuntimeCriticalObserver> {
  const failures: RuntimeFailure[] = [];
  const navigationPaths: string[] = [];

  await page.addInitScript(() => {
    const bucket = "__NN_E2E_RUNTIME_ERRORS__";
    const w = window as typeof window & { [bucket]?: Array<{ kind: string; message: string }> };
    w[bucket] = w[bucket] ?? [];
    window.addEventListener("error", (event) => {
      w[bucket]?.push({ kind: "window_error", message: String(event.message || event.error || "unknown") });
    });
    window.addEventListener("unhandledrejection", (event) => {
      w[bucket]?.push({ kind: "unhandled_rejection", message: String(event.reason || "unknown") });
    });
  });

  const onConsole = (msg: import("@playwright/test").ConsoleMessage) => {
    const text = msg.text();
    if (msg.type() === "info" && /^\[nn-runtime\]/.test(text)) {
      if (isBlockingConsole(text)) failures.push({ kind: "runtime-event", message: text, url: page.url() });
      return;
    }
    if (msg.type() === "error" && isBlockingConsole(text)) {
      failures.push({ kind: "console", message: text, url: page.url() });
    }
  };

  const onPageError = (error: Error) => {
    const message = error.stack || error.message;
    if (isBlockingConsole(message)) failures.push({ kind: "pageerror", message, url: page.url() });
  };

  const onRequestFailed = (request: import("@playwright/test").Request) => {
    const url = request.url();
    const failure = request.failure();
    if (failure?.errorText === "net::ERR_ABORTED") return;
    if (/Load request cancelled/i.test(failure?.errorText ?? "")) return;
    if (isCriticalUrl(url)) {
      failures.push({
        kind: "requestfailed",
        message: failure?.errorText ?? "request failed",
        url,
      });
    }
  };

  const onResponse = (response: import("@playwright/test").Response) => {
    const url = response.url();
    if (!isCriticalUrl(url)) return;
    if (response.status() >= 500 || /\/_next\/static\/chunks\//i.test(url) && response.status() >= 400) {
      failures.push({ kind: "response", message: `HTTP ${response.status()}`, url });
    }
  };

  const onFrameNavigated = (frame: import("@playwright/test").Frame) => {
    if (frame !== page.mainFrame()) return;
    try {
      navigationPaths.push(new URL(frame.url()).pathname);
    } catch {
      navigationPaths.push(frame.url());
    }
  };

  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  page.on("requestfailed", onRequestFailed);
  page.on("response", onResponse);
  page.on("framenavigated", onFrameNavigated);

  return {
    failures,
    navigationPaths,
    dispose: () => {
      page.off("console", onConsole);
      page.off("pageerror", onPageError);
      page.off("requestfailed", onRequestFailed);
      page.off("response", onResponse);
      page.off("framenavigated", onFrameNavigated);
      if (testInfo && failures.length > 0) {
        void testInfo.attach("runtime-critical-failures.json", {
          body: JSON.stringify({ failures, navigationPaths }, null, 2),
          contentType: "application/json",
        });
      }
    },
  };
}

export async function expectRuntimeHealthy(
  page: Page,
  observer: RuntimeCriticalObserver,
  opts?: { maxSamePathNavigations?: number },
): Promise<void> {
  const browserErrors = await page.evaluate(() => {
    const bucket = "__NN_E2E_RUNTIME_ERRORS__";
    const w = window as typeof window & { [bucket]?: Array<{ kind: string; message: string }> };
    return w[bucket] ?? [];
  });
  for (const error of browserErrors) {
    if (isBlockingConsole(error.message)) {
      observer.failures.push({ kind: "pageerror", message: `${error.kind}: ${error.message}`, url: page.url() });
    }
  }

  const maxSamePathNavigations = opts?.maxSamePathNavigations ?? 4;
  const counts = new Map<string, number>();
  for (const path of observer.navigationPaths) counts.set(path, (counts.get(path) ?? 0) + 1);
  const loops = [...counts.entries()].filter(([, count]) => count > maxSamePathNavigations);
  if (loops.length > 0) {
    observer.failures.push({
      kind: "runtime-event",
      message: `possible route loop: ${loops.map(([path, count]) => `${path} x${count}`).join(", ")}`,
      url: page.url(),
    });
  }

  expect(observer.failures.map(compactFailure)).toEqual([]);
}
