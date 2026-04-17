import { expect, type Page, type Response, type TestInfo } from "@playwright/test";
import { MARKETING_PUBLIC_SELECTOR } from "./navigation-e2e";
import { attachPageObservers } from "./attach-observers";
import {
  attachPublicMarketingDataResponseTracker,
  classifyPublicDataResponseEntry,
  findDuplicateIdenticalDataRequestsInLoad,
  findMissingCachingHeaderViolations,
  findReloadFullFetchViolations,
  parseCacheControlDirectives,
  type PublicDataResponseClassification,
  type PublicDataResponseEntry,
} from "./public-marketing-data-request-tracker";

const FIRST_NAV_BUDGET_MS = Number(process.env.E2E_PUBLIC_FIRST_NAV_BUDGET_MS) || 15_000;
const RELOAD_NAV_BUDGET_MS = Number(process.env.E2E_PUBLIC_RELOAD_NAV_BUDGET_MS) || 12_000;
export const NAV_SLA_MS =
  process.env.E2E_PUBLIC_NAV_SLA_MS !== undefined && process.env.E2E_PUBLIC_NAV_SLA_MS !== ""
    ? Number(process.env.E2E_PUBLIC_NAV_SLA_MS)
    : undefined;

export type PublicDocumentResponseLog = {
  loadIndex: number;
  url: string;
  status: number;
  cacheControl: string | null;
  etag: string | null;
  age: string | null;
  lastModified: string | null;
  classification: PublicDataResponseClassification;
};

export type PublicCachingArtifact = {
  label: string;
  path: string;
  appOrigin: string;
  loadCount: number;
  firstNavBudgetMs: number;
  reloadNavBudgetMs: number;
  navSlaMs: number | null;
  navigationDurationsMs: number[];
  shellVisibleAfterNavMs: number[];
  documentResponses: PublicDocumentResponseLog[];
  dataResponses: PublicDataResponseEntry[];
  reloadFullFetchViolations: string[];
  missingCachingHeaderViolations: string[];
  duplicateIdenticalRequestsInLoad: string[];
  consoleErrors: string[];
  failedRequests: string[];
  warnings: string[];
};

function headerValue(headers: Record<string, string>, name: string): string | null {
  const value = headers[name];
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function buildDocumentResponseLog(loadIndex: number, response: Response): PublicDocumentResponseLog {
  const headers = response.headers();
  const log: PublicDocumentResponseLog = {
    loadIndex,
    url: response.url(),
    status: response.status(),
    cacheControl: headerValue(headers, "cache-control"),
    etag: headerValue(headers, "etag"),
    age: headerValue(headers, "age"),
    lastModified: headerValue(headers, "last-modified"),
    classification: "full_fetch",
  };
  log.classification = classifyPublicDataResponseEntry(log);
  return log;
}

function isAcceptableDocumentStatus(status: number | undefined): boolean {
  if (status === undefined) return false;
  return status === 304 || (status >= 200 && status < 400);
}

function findDocumentCachingViolations(documentResponses: PublicDocumentResponseLog[]): string[] {
  const violations: string[] = [];
  for (const response of documentResponses) {
    const reasons: string[] = [];
    const directives = parseCacheControlDirectives(response.cacheControl);
    if (!response.cacheControl) {
      reasons.push("missing Cache-Control");
    } else {
      const sMaxAge = directives["s-maxage"];
      const parsedSMaxAge = typeof sMaxAge === "string" ? Number(sMaxAge) : NaN;
      if (!Number.isFinite(parsedSMaxAge) || parsedSMaxAge <= 0) {
        reasons.push("missing positive s-maxage");
      }
    }
    if (!response.etag && !response.lastModified) {
      reasons.push("missing ETag or Last-Modified");
    }
    if (reasons.length > 0) {
      violations.push(`load ${response.loadIndex}: ${response.url} — ${reasons.join("; ")}`);
    }
  }
  return violations;
}

function findReloadDocumentFullFetchViolations(documentResponses: PublicDocumentResponseLog[]): string[] {
  const fullFetches = documentResponses.filter(
    (response) => response.loadIndex >= 1 && response.status === 200 && response.classification === "full_fetch",
  );
  if (fullFetches.length < 2) return [];
  return fullFetches.map(
    (response) =>
      `load ${response.loadIndex}: ${response.url} returned a full-fetch HTTP 200 on reload (expected 304, CDN age>0, or no request)`,
  );
}

function likelyNextDev(appOrigin: string): boolean {
  if (process.env.E2E_PUBLIC_ASSUME_PRODUCTION === "1") return false;
  return /127\.0\.0\.1|localhost/.test(appOrigin);
}

export async function runPublicCachingScenario(input: {
  label: string;
  path: string;
  page: Page;
  baseURL?: string;
  testInfo: TestInfo;
  reloadCount?: number;
  waitForSelector?: string;
}) {
  const {
    label,
    path,
    page,
    baseURL,
    testInfo,
    reloadCount = 3,
    waitForSelector = MARKETING_PUBLIC_SELECTOR,
  } = input;

  const appOrigin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
  const runningLikelyNextDev = likelyNextDev(appOrigin);
  const tracker = attachPublicMarketingDataResponseTracker(page, appOrigin);
  const observers = attachPageObservers(page, { profile: "public" });
  const navigationDurationsMs: number[] = [];
  const shellVisibleAfterNavMs: number[] = [];
  const documentResponses: PublicDocumentResponseLog[] = [];
  const warnings: string[] = [];

  if (runningLikelyNextDev) {
    warnings.push(
      "Likely running against next dev. For production-grade caching and ≤2s SLA enforcement, prefer BASE_URL=<next-start-or-prod> with PLAYWRIGHT_SKIP_WEB_SERVER=1.",
    );
  }
  if (NAV_SLA_MS !== undefined && !Number.isNaN(NAV_SLA_MS) && runningLikelyNextDev) {
    warnings.push(
      `E2E_PUBLIC_NAV_SLA_MS=${NAV_SLA_MS} is active while running against a likely dev server; expect stricter production-mode failures until you switch to next start or a deployed URL.`,
    );
  }

  try {
    for (let loadIndex = 0; loadIndex <= reloadCount; loadIndex++) {
      tracker.setLoadIndex(loadIndex);
      const t0 = Date.now();
      const response =
        loadIndex === 0
          ? await page.goto(path, { waitUntil: "domcontentloaded", timeout: 60_000 })
          : await page.reload({ waitUntil: "domcontentloaded", timeout: 60_000 });

      expect(
        isAcceptableDocumentStatus(response?.status()),
        `${label}: HTTP ${response?.status()} for ${loadIndex === 0 ? path : `reload ${loadIndex}`}`,
      ).toBeTruthy();

      const navElapsed = Date.now() - t0;
      navigationDurationsMs.push(navElapsed);
      const navBudget = loadIndex === 0 ? FIRST_NAV_BUDGET_MS : RELOAD_NAV_BUDGET_MS;
      expect(
        navElapsed,
        `${label}: navigation ${loadIndex} domcontentloaded after ${navElapsed}ms (budget ${navBudget}ms)`,
      ).toBeLessThanOrEqual(navBudget);
      if (NAV_SLA_MS !== undefined && !Number.isNaN(NAV_SLA_MS)) {
        expect(
          navElapsed,
          `${label}: SLA breach on navigation ${loadIndex} (E2E_PUBLIC_NAV_SLA_MS=${NAV_SLA_MS}) — domcontentloaded took ${navElapsed}ms`,
        ).toBeLessThanOrEqual(NAV_SLA_MS);
      }

      if (response) {
        documentResponses.push(buildDocumentResponseLog(loadIndex, response));
      }

      const tVisible = Date.now();
      await expect(page.locator(waitForSelector)).toBeVisible({ timeout: 30_000 });
      shellVisibleAfterNavMs.push(Date.now() - tVisible);
    }

    const reloadViolations = findReloadFullFetchViolations(tracker.entries);
    const documentReloadViolations = findReloadDocumentFullFetchViolations(documentResponses);
    const missingCachingHeaderViolations = runningLikelyNextDev
      ? findMissingCachingHeaderViolations(tracker.entries)
      : [
          ...findMissingCachingHeaderViolations(tracker.entries),
          ...findDocumentCachingViolations(documentResponses),
        ];
    const duplicateInLoad = findDuplicateIdenticalDataRequestsInLoad(tracker.entries);
    const reloadFullFetchViolations = runningLikelyNextDev
      ? reloadViolations
      : [...documentReloadViolations, ...reloadViolations];

    const artifact: PublicCachingArtifact = {
      label,
      path,
      appOrigin,
      loadCount: reloadCount + 1,
      firstNavBudgetMs: FIRST_NAV_BUDGET_MS,
      reloadNavBudgetMs: RELOAD_NAV_BUDGET_MS,
      navSlaMs: NAV_SLA_MS ?? null,
      navigationDurationsMs,
      shellVisibleAfterNavMs,
      documentResponses,
      dataResponses: tracker.entries,
      reloadFullFetchViolations,
      missingCachingHeaderViolations,
      duplicateIdenticalRequestsInLoad: duplicateInLoad,
      consoleErrors: observers.consoleErrors,
      failedRequests: observers.failedRequests,
      warnings,
    };

    await testInfo.attach(`${label}.json`, {
      body: Buffer.from(JSON.stringify(artifact, null, 2)),
      contentType: "application/json",
    });

    expect(
      missingCachingHeaderViolations,
      `${label}: missing cache headers or validators:\n${missingCachingHeaderViolations.join("\n")}\nSee ${label}.json.`,
    ).toEqual([]);
    expect(
      reloadFullFetchViolations,
      `${label}: repeated reload full fetch violations:\n${reloadFullFetchViolations.join("\n")}\nSee ${label}.json.`,
    ).toEqual([]);
    expect(
      duplicateInLoad,
      `${label}: duplicate identical data requests within a single load:\n${duplicateInLoad.join("\n")}\nSee ${label}.json.`,
    ).toEqual([]);
    expect(
      observers.consoleErrors,
      `${label}: console errors detected:\n${observers.consoleErrors.join("\n")}\nSee ${label}.json.`,
    ).toEqual([]);
    expect(
      observers.failedRequests,
      `${label}: failed network requests detected:\n${observers.failedRequests.join("\n")}\nSee ${label}.json.`,
    ).toEqual([]);
  } finally {
    tracker.dispose();
    observers.dispose();
  }
}
