import { expect, type Locator, type Page, type Request, type Response } from "@playwright/test";

/** Default max time from navigation start until meaningful content is visible. */
export const LEARNER_PERF_DEFAULT_CONTENT_BUDGET_MS = 3_000;
/** Default max time `main` may show loading (`aria-busy`, etc.). */
export const LEARNER_PERF_DEFAULT_LOADING_BUDGET_MS = 5_000;

export function perfContentBudgetMs(): number {
  const raw = process.env.E2E_PERF_CONTENT_BUDGET_MS?.trim();
  if (raw) {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return LEARNER_PERF_DEFAULT_CONTENT_BUDGET_MS;
}

export function perfLoadingBudgetMs(): number {
  const raw = process.env.E2E_PERF_LOADING_BUDGET_MS?.trim();
  if (raw) {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return LEARNER_PERF_DEFAULT_LOADING_BUDGET_MS;
}

export type ApiTimingSample = {
  method: string;
  pathname: string;
  durationMs: number;
  status: number;
  url: string;
};

export type KeyPagePerfMetrics = {
  pageLabel: string;
  path: string;
  /** Wall-clock ms from navigation start until `ready` locator is visible. */
  firstContentMs: number;
  /** `domInteractive - startTime` from Navigation Timing 2 (approximates TTI proxy). */
  timeToInteractiveApproxMs: number | null;
  apiSamples: ApiTimingSample[];
  worstApiMs: number;
};

function isTrackedApiRequest(req: Request, appOrigin: string): boolean {
  if (req.resourceType() !== "fetch" && req.resourceType() !== "xhr") return false;
  try {
    const u = new URL(req.url());
    if (u.origin !== appOrigin) return false;
    return u.pathname.startsWith("/api/");
  } catch {
    return false;
  }
}

/**
 * Collects same-origin `/api/*` fetch/XHR durations for the current navigation window.
 */
export function attachApiResponseTimeCollector(page: Page, appOrigin: string) {
  const starts = new Map<Request, number>();
  const samples: ApiTimingSample[] = [];

  const onRequest = (req: Request) => {
    if (!isTrackedApiRequest(req, appOrigin)) return;
    starts.set(req, Date.now());
  };

  const onResponse = (res: Response) => {
    const req = res.request();
    if (!isTrackedApiRequest(req, appOrigin)) return;
    const t0 = starts.get(req);
    starts.delete(req);
    if (t0 == null) return;
    let pathname = "";
    try {
      pathname = new URL(res.url()).pathname;
    } catch {
      pathname = "";
    }
    samples.push({
      method: req.method(),
      pathname,
      durationMs: Date.now() - t0,
      status: res.status(),
      url: res.url(),
    });
  };

  page.on("request", onRequest);
  page.on("response", onResponse);

  return {
    samples,
    clear: () => {
      starts.clear();
      samples.length = 0;
    },
    dispose: () => {
      page.off("request", onRequest);
      page.off("response", onResponse);
      starts.clear();
    },
  };
}

/**
 * Locator for loading UI that must not outlive the budget (Next `loading.tsx`, client shells).
 */
export function learnerMainLoadingLocator(page: Page): Locator {
  return page.locator("main").locator('[aria-busy="true"], .nn-qbank-skeleton');
}

export async function readDomInteractiveMs(page: Page): Promise<number | null> {
  return page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (!nav) return null;
    return Math.round(nav.domInteractive - nav.startTime);
  });
}

export async function measureKeyLearnerPage(page: Page, input: {
  pageLabel: string;
  path: string;
  ready: Locator;
  apiCollector: { samples: ApiTimingSample[]; clear: () => void };
  contentBudgetMs: number;
  loadingBudgetMs: number;
}): Promise<KeyPagePerfMetrics> {
  const { pageLabel, path, ready, apiCollector, contentBudgetMs, loadingBudgetMs } = input;
  apiCollector.clear();

  const navStart = Date.now();
  await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(page.url(), `${pageLabel}: unexpected redirect to /login`).not.toMatch(/\/login/i);

  await ready.first().waitFor({ state: "visible", timeout: contentBudgetMs });
  const firstContentMs = Date.now() - navStart;

  await expect(learnerMainLoadingLocator(page)).toHaveCount(0, { timeout: loadingBudgetMs });

  const timeToInteractiveApproxMs = await readDomInteractiveMs(page);
  const apiSamples = [...apiCollector.samples];
  let worstApiMs = 0;
  for (const s of apiSamples) {
    if (s.durationMs > worstApiMs) worstApiMs = s.durationMs;
  }

  return {
    pageLabel,
    path,
    firstContentMs,
    timeToInteractiveApproxMs,
    apiSamples,
    worstApiMs,
  };
}
