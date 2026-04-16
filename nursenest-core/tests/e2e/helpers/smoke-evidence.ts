import type { Page, TestInfo } from "@playwright/test";
import type { PageObservers } from "./attach-observers";

/** Mirrors public smoke filtering so dev-only Auth.js noise does not fail production deploy smoke. */
export function seriousPublicSmokeConsoleErrors(errors: string[]): string[] {
  const hasAuthMisconfigNoise = errors.some(
    (t) =>
      /assertConfig|@auth_core|authjs\.dev#autherror/i.test(t) ||
      /ClientFetchError:.*server configuration|There was a problem with the server configuration/i.test(t),
  );
  return errors.filter((t) => {
    if (/assertConfig|@auth_core|authjs\.dev#autherror/i.test(t)) return false;
    if (/ClientFetchError:.*server configuration|There was a problem with the server configuration/i.test(t)) {
      return false;
    }
    if (
      hasAuthMisconfigNoise &&
      /Failed to load resource: the server responded with a status of 500/i.test(t)
    ) {
      return false;
    }
    if (/background:.*light-dark.*Server\s*$/i.test(t) || /at Auth \(.*@auth_core/i.test(t)) return false;
    return true;
  });
}

export type SmokeCapture = {
  finalUrl: string;
  consoleErrors: string[];
  failedRequests: string[];
  /** Optional: filled when using {@link attachSlowRequestTap}. */
  slowRequestsMs?: { url: string; ms: number }[];
  redirects?: string[];
};

export async function attachSmokeCapture(testInfo: TestInfo, label: string, data: SmokeCapture): Promise<void> {
  await testInfo.attach(`${label}-smoke-capture.json`, {
    body: Buffer.from(JSON.stringify(data, null, 2), "utf-8"),
    contentType: "application/json",
  });
}

export async function attachSmokeFailureScreenshot(page: Page, testInfo: TestInfo, name: string): Promise<void> {
  const buf = await page.screenshot({ fullPage: true }).catch(() => null);
  if (buf) {
    await testInfo.attach(name, { body: buf, contentType: "image/png" });
  }
}

/** Same-origin XHR/fetch/document responses with status >= 400, plus /api/admin hits for status audit. */
export function attachAdminResponseTap(
  page: Page,
  baseOrigin: string,
  out: { url: string; status: number; method: string }[],
  errors: { url: string; status: number; method: string }[],
  adminHits: { url: string; status: number; method: string }[],
) {
  const onResponse = (response: import("@playwright/test").Response) => {
    const req = response.request();
    const rt = req.resourceType();
    if (rt !== "xhr" && rt !== "fetch" && rt !== "document") return;
    let u: URL;
    try {
      u = new URL(response.url());
    } catch {
      return;
    }
    if (u.origin !== baseOrigin) return;
    const status = response.status();
    const row = { url: response.url(), status, method: req.method() };
    out.push(row);
    if (status >= 400 || status === 0) errors.push(row);
    if (u.pathname.startsWith("/api/admin")) adminHits.push(row);
  };
  page.on("response", onResponse);
  return () => page.off("response", onResponse);
}

export function attachSlowRequestTap(
  page: Page,
  baseOrigin: string,
  slow: { url: string; ms: number }[],
  thresholdMs: number,
) {
  const onFinished = (request: import("@playwright/test").Request) => {
    let u: URL;
    try {
      u = new URL(request.url());
    } catch {
      return;
    }
    if (u.origin !== baseOrigin) return;
    const timing = request.timing();
    const total = timing.responseEnd - timing.startTime;
    if (total >= thresholdMs) slow.push({ url: request.url(), ms: Math.round(total) });
  };
  page.on("requestfinished", onFinished);
  return () => page.off("requestfinished", onFinished);
}

export function attachRedirectLog(page: Page, redirects: string[]) {
  const onFramenavigated = (frame: import("@playwright/test").Frame) => {
    if (frame === page.mainFrame()) {
      redirects.push(frame.url());
    }
  };
  page.on("framenavigated", onFramenavigated);
  return () => page.off("framenavigated", onFramenavigated);
}

export function buildCaptureFromObservers(
  page: Page,
  observers: PageObservers,
  extra?: Partial<Pick<SmokeCapture, "slowRequestsMs" | "redirects">>,
): SmokeCapture {
  return {
    finalUrl: page.url(),
    consoleErrors: observers.consoleErrors,
    failedRequests: observers.failedRequests,
    ...extra,
  };
}
