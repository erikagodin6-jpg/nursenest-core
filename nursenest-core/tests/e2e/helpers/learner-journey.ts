import fs from "fs/promises";
import path from "path";
import { expect, type ConsoleMessage, type Page, type Request, type Response, type TestInfo } from "@playwright/test";

import { loginWithCredentials } from "./learner-login";
import { assertDocumentNoHorizontalOverflow } from "./visual-layout-assertions";

export type LearnerJourneyKind = "rn" | "pn" | "np";

export type LearnerJourneyAccount = {
  kind: LearnerJourneyKind;
  label: string;
  email: string;
  password: string;
  pathwayId: string;
  source: string;
};

type BrowserIssue = {
  type: "console" | "pageerror" | "requestfailed" | "response";
  message: string;
};

const DEFAULT_PATHWAY_BY_KIND: Record<LearnerJourneyKind, string> = {
  rn: "ca-rn-nclex-rn",
  pn: "ca-rpn-rex-pn",
  np: "ca-np-cnple",
};

const LABEL_BY_KIND: Record<LearnerJourneyKind, string> = {
  rn: "RN learner",
  pn: "PN learner",
  np: "NP learner",
};

const ENV_PREFIX_BY_KIND: Record<LearnerJourneyKind, string> = {
  rn: "PLAYWRIGHT_RN",
  pn: "PLAYWRIGHT_PN",
  np: "PLAYWRIGHT_NP",
};

const BLOCKED_TEXT_RE =
  /\b(?:Pool Relax|Rationale Placeholder|Lorem ipsum|TODO|TBD|undefined|null|placeholder content|coming soon)\b/i;

const CRITICAL_CONSOLE_RE = /hydration|undefined|placeholder|Pool Relax|Rationale Placeholder/i;

const RESPONSIVE_VIEWPORTS = [
  { label: "desktop", width: 1440, height: 1000 },
  { label: "tablet", width: 1024, height: 900 },
  { label: "mobile", width: 390, height: 844 },
] as const;

export function getLearnerJourneyAccount(kind: LearnerJourneyKind): LearnerJourneyAccount | null {
  const prefix = ENV_PREFIX_BY_KIND[kind];
  const email = process.env[`${prefix}_EMAIL`]?.trim();
  const password = process.env[`${prefix}_PASSWORD`];
  if (!email || password === undefined || String(password).length === 0) return null;
  return {
    kind,
    label: LABEL_BY_KIND[kind],
    email,
    password: String(password),
    pathwayId: process.env[`${prefix}_PATHWAY_ID`]?.trim() || DEFAULT_PATHWAY_BY_KIND[kind],
    source: `${prefix}_*`,
  };
}

export async function loginAsRn(page: Page, baseURL?: string): Promise<LearnerJourneyAccount> {
  return loginAsLearner("rn", page, baseURL);
}

export async function loginAsPn(page: Page, baseURL?: string): Promise<LearnerJourneyAccount> {
  return loginAsLearner("pn", page, baseURL);
}

export async function loginAsNp(page: Page, baseURL?: string): Promise<LearnerJourneyAccount> {
  return loginAsLearner("np", page, baseURL);
}

export async function loginAsLearner(
  kind: LearnerJourneyKind,
  page: Page,
  baseURL?: string,
): Promise<LearnerJourneyAccount> {
  const account = getLearnerJourneyAccount(kind);
  expect(account, `Missing ${ENV_PREFIX_BY_KIND[kind]}_EMAIL / ${ENV_PREFIX_BY_KIND[kind]}_PASSWORD seeded account`).not.toBeNull();
  await loginWithCredentials(page, account!.email, account!.password, {
    enterLearnerApp: true,
    navigationOrigin: baseURL,
  });
  await waitForStableHydration(page);
  return account!;
}

export function installLearnerJourneyGuards(page: Page) {
  const issues: BrowserIssue[] = [];

  const onConsole = (msg: ConsoleMessage) => {
    const type = msg.type();
    if (type !== "error" && type !== "warning") return;
    const text = msg.text();
    if (type === "error" || CRITICAL_CONSOLE_RE.test(text)) {
      issues.push({ type: "console", message: `[${type}] ${text}` });
    }
  };

  const onPageError = (error: Error) => {
    issues.push({ type: "pageerror", message: error.message });
  };

  const onRequestFailed = (request: Request) => {
    const url = request.url();
    if (/\/(?:_next\/static|favicon|robots\.txt|sitemap\.xml)/.test(url)) return;
    issues.push({
      type: "requestfailed",
      message: `${request.method()} ${url} ${request.failure()?.errorText ?? "failed"}`,
    });
  };

  const onResponse = (response: Response) => {
    const url = response.url();
    if (!/\/api\//.test(url)) return;
    if (response.status() >= 500) {
      issues.push({ type: "response", message: `${response.status()} ${url}` });
    }
  };

  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  page.on("requestfailed", onRequestFailed);
  page.on("response", onResponse);

  return {
    issues,
    dispose() {
      page.off("console", onConsole);
      page.off("pageerror", onPageError);
      page.off("requestfailed", onRequestFailed);
      page.off("response", onResponse);
    },
  };
}

export async function assertLearnerJourneyGuardsClean(
  guards: ReturnType<typeof installLearnerJourneyGuards>,
): Promise<void> {
  const filtered = guards.issues.filter((issue) => !/ResizeObserver loop|AbortError|net::ERR_ABORTED/i.test(issue.message));
  expect(filtered, filtered.slice(0, 8).map((issue) => issue.message).join("\n")).toEqual([]);
}

export async function waitForStableHydration(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  await page.locator("body").waitFor({ state: "visible", timeout: 45_000 });
  await page
    .waitForFunction(() => document.readyState === "interactive" || document.readyState === "complete", undefined, {
      timeout: 45_000,
    })
    .catch(() => undefined);
  await page
    .waitForFunction(
      () => {
        const busy = Array.from(document.querySelectorAll("[aria-busy='true'], [data-loading='true']"));
        return busy.length === 0 || document.body.innerText.length > 200;
      },
      undefined,
      { timeout: 15_000 },
    )
    .catch(() => undefined);
  await page.waitForTimeout(250);
}

export async function assertNoPlaceholderContent(page: Page): Promise<void> {
  const text = await page.locator("body").innerText({ timeout: 20_000 });
  expect(text, "Visible page text should not expose placeholders, debug labels, or undefined values").not.toMatch(
    BLOCKED_TEXT_RE,
  );
  await expect(page.locator(".nn-lesson-clinical-pearls-rail__box:empty")).toHaveCount(0);
  await expect(page.locator("[data-testid*='placeholder'], [data-nn-placeholder='true']")).toHaveCount(0);
}

export async function assertNoLayoutOverlap(page: Page): Promise<void> {
  await assertDocumentNoHorizontalOverflow(page);
  const offenders = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    return Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .filter((element) => {
        const style = window.getComputedStyle(element);
        if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
        if (
          element.tagName.toLowerCase() === "img" &&
          style.pointerEvents === "none" &&
          style.position === "absolute"
        ) {
          return false;
        }
        const rect = element.getBoundingClientRect();
        if (rect.width < 24 || rect.height < 16) return false;
        return rect.left < -2 || rect.right > viewportWidth + 2;
      })
      .slice(0, 8)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          cls: element.className ? String(element.className).slice(0, 120) : "",
          text: (element.textContent ?? "").trim().slice(0, 80),
          rect: {
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            top: Math.round(rect.top),
            width: Math.round(rect.width),
          },
        };
      });
  });
  expect(offenders, JSON.stringify(offenders, null, 2)).toEqual([]);
}

export async function assertBasicAccessibility(page: Page): Promise<void> {
  const unnamedControls = await page.locator("button, a, input, select, textarea").evaluateAll((nodes) =>
    nodes
      .filter((node) => {
        const element = node as HTMLElement;
        const style = window.getComputedStyle(element);
        if (style.display === "none" || style.visibility === "hidden") return false;
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        const name =
          element.getAttribute("aria-label") ||
          element.getAttribute("title") ||
          element.textContent ||
          (element instanceof HTMLInputElement ? element.placeholder : "");
        return !name.trim();
      })
      .slice(0, 8)
      .map((node) => node.outerHTML.slice(0, 160)),
  );
  expect(unnamedControls, "Visible interactive controls must have accessible names").toEqual([]);

  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => {
    const active = document.activeElement as HTMLElement | null;
    return Boolean(active && active !== document.body && active !== document.documentElement);
  });
  expect(focused, "Keyboard tab should move focus to an interactive element").toBe(true);
}

export async function captureResponsiveScreenshots(
  page: Page,
  testInfo: TestInfo,
  kind: LearnerJourneyKind,
  name: string,
): Promise<void> {
  const screenshotDir = path.join(process.cwd(), "test-results", "screenshots", kind);
  await fs.mkdir(screenshotDir, { recursive: true });

  for (const viewport of RESPONSIVE_VIEWPORTS) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await waitForStableHydration(page);
    const filename = `${kind}-${name}-${viewport.label}.png`;
    const filePath = path.join(screenshotDir, filename);
    await page.screenshot({ path: filePath, fullPage: true });
    await testInfo.attach(filename, {
      path: filePath,
      contentType: "image/png",
    });
  }
}

export async function gotoLearnerRoute(page: Page, route: string, pathwayId: string): Promise<number> {
  const url = new URL(route, "http://nursenest.local");
  if (!url.searchParams.has("pathwayId")) {
    url.searchParams.set("pathwayId", pathwayId);
  }
  const pathAndQuery = `${url.pathname}${url.search}`;
  const started = Date.now();
  await page.goto(pathAndQuery, { waitUntil: "domcontentloaded" });
  await waitForStableHydration(page);
  const elapsed = Date.now() - started;
  expect(elapsed, `${pathAndQuery} should start rendering without a long dead zone`).toBeLessThan(15_000);
  return elapsed;
}

export async function expectVisibleAny(page: Page, selectors: string[], timeout = 45_000) {
  let locator = page.locator(selectors[0]);
  for (const selector of selectors.slice(1)) {
    locator = locator.or(page.locator(selector));
  }
  locator = locator.first();
  await expect(locator).toBeVisible({ timeout });
  return locator;
}
