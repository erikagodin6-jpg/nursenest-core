/**
 * Platform shell/navigation consistency audit.
 *
 * PNG evidence:
 *   docs/screenshots/premium-shell-navigation-audit/
 *
 * Focus:
 * - Standard public + learner pages keep NurseNest brand/nav shell.
 * - Active CAT sessions keep only the minimal branded exam shell.
 * - Ocean, Blossom, Midnight, Sunset, and Aurora remain in the audited theme matrix.
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import { MARKETING_PUBLIC_SELECTOR } from "../helpers/navigation-e2e";
import {
  PAID_E2E_DEFAULT_PATHWAY_ID,
  waitForAuthenticatedLearnerShell,
} from "../helpers/paid-learner-shell";
import {
  PUBLIC_MARKETING_THEME_ALLOWLIST,
  THEME_STORAGE_KEY,
} from "@/lib/theme/theme-registry";

const SCREENSHOT_DIR = join("docs", "screenshots", "premium-shell-navigation-audit");
const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";
const REQUIRED_AUDIT_THEMES = ["ocean", "blossom", "midnight", "sunset", "aurora"] as const;
const PATHWAY_ID = PAID_E2E_DEFAULT_PATHWAY_ID;

mkdirSync(SCREENSHOT_DIR, { recursive: true });

type ShellAuditTarget = {
  id: string;
  path: string;
  kind: "public" | "learner";
  ready: (page: Page) => Locator;
  captureThemes?: boolean;
};

const PUBLIC_TARGETS: ShellAuditTarget[] = [
  { id: "home", path: "/", kind: "public", ready: (page) => page.locator(MARKETING_PUBLIC_SELECTOR).first(), captureThemes: true },
  { id: "pricing", path: "/pricing", kind: "public", ready: (page) => page.locator("main").first() },
  { id: "auth-login", path: "/login", kind: "public", ready: (page) => page.locator("main").first() },
  { id: "rn-hub", path: "/us/rn/nclex-rn", kind: "public", ready: (page) => page.locator(MARKETING_PUBLIC_SELECTOR).first() },
  { id: "allied-health", path: "/allied-health", kind: "public", ready: (page) => page.locator(MARKETING_PUBLIC_SELECTOR).or(page.locator("main")).first() },
  { id: "new-grad", path: "/us/new-grad", kind: "public", ready: (page) => page.locator(MARKETING_PUBLIC_SELECTOR).or(page.locator("main")).first() },
  { id: "pre-nursing", path: "/pre-nursing", kind: "public", ready: (page) => page.locator(MARKETING_PUBLIC_SELECTOR).or(page.locator("main")).first() },
];

const LEARNER_TARGETS: ShellAuditTarget[] = [
  { id: "dashboard", path: "/app", kind: "learner", ready: (page) => page.locator("#nn-learner-main").first(), captureThemes: true },
  {
    id: "lessons",
    path: `/app/lessons?pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
    kind: "learner",
    ready: (page) => page.locator("#nn-learner-main").first(),
  },
  {
    id: "flashcards",
    path: `/app/flashcards?pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
    kind: "learner",
    ready: (page) => page.locator("#nn-learner-main").first(),
  },
  {
    id: "practice-exams",
    path: `/app/practice-tests?pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
    kind: "learner",
    ready: (page) => page.locator("#nn-learner-main").first(),
  },
  {
    id: "cat-launch",
    path: `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
    kind: "learner",
    ready: (page) => page.locator("#nn-learner-main").first(),
  },
  {
    id: "report-card",
    path: "/app/account/analytics",
    kind: "learner",
    ready: (page) => page.locator("#nn-learner-main").first(),
  },
  {
    id: "settings",
    path: "/app/account/settings",
    kind: "learner",
    ready: (page) => page.locator("#nn-learner-main").first(),
  },
];

function safeFilePart(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function applyTheme(page: Page, themeId: string): Promise<void> {
  await page.evaluate(
    ({ key, id }) => {
      localStorage.setItem(key, id);
      document.documentElement.setAttribute("data-theme", id);
    },
    { key: THEME_STORAGE_KEY, id: themeId },
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", themeId, { timeout: 15_000 });
}

async function preparePage(page: Page, path: string, themeId = "ocean"): Promise<void> {
  await page.addInitScript(
    ({ dismissedKey, themeKey, theme }) => {
      localStorage.setItem(dismissedKey, "1");
      localStorage.setItem(themeKey, theme);
      document.documentElement?.setAttribute("data-theme", theme);
    },
    { dismissedKey: SELECTOR_DISMISSED_LS, themeKey: THEME_STORAGE_KEY, theme: themeId },
  );
  const response = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 180_000 });
  expect(response?.ok(), `HTTP ${response?.status()} for ${path}`).toBeTruthy();
  await applyTheme(page, themeId);
}

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    return {
      innerWidth: window.innerWidth,
      rootScrollWidth: root.scrollWidth,
      bodyScrollWidth: body.scrollWidth,
      delta: Math.max(root.scrollWidth, body.scrollWidth) - window.innerWidth,
    };
  });
  expect(overflow.delta, JSON.stringify(overflow)).toBeLessThanOrEqual(2);
}

async function expectNoVisibleElementOverlap(page: Page, selectors: string[]): Promise<void> {
  const result = await page.evaluate((rawSelectors) => {
    const nodes = rawSelectors
      .flatMap((selector) => Array.from(document.querySelectorAll<HTMLElement>(selector)))
      .filter((node) => {
        const cs = getComputedStyle(node);
        const r = node.getBoundingClientRect();
        return cs.display !== "none" && cs.visibility !== "hidden" && r.width > 1 && r.height > 1;
      })
      .map((node) => {
        const r = node.getBoundingClientRect();
        return {
          label:
            node.getAttribute("data-testid") ||
            node.getAttribute("data-nn-header-band") ||
            node.getAttribute("aria-label") ||
            node.className.toString().slice(0, 80),
          rect: { left: r.left, top: r.top, right: r.right, bottom: r.bottom },
        };
      });

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i]!;
        const b = nodes[j]!;
        const x = Math.max(0, Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left));
        const y = Math.max(0, Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top));
        if (x > 2 && y > 2) return { ok: false, a, b, overlap: { x, y } };
      }
    }
    return { ok: true, count: nodes.length };
  }, selectors);

  expect(result.ok, JSON.stringify(result)).toBe(true);
}

async function expectPublicShell(page: Page): Promise<void> {
  const header = page.locator("header[data-nn-header-layout]").first();
  await expect(header).toBeVisible({ timeout: 90_000 });
  await expect(header.locator("[data-nn-header-lockup='leaf']").first()).toBeVisible();
  await expect(header.locator("[data-nn-header-lockup='wordmark']").first()).toContainText(/NurseNest/i);
  await expect(
    page.locator(".nn-header-main-marketing-nav").or(page.getByRole("button", { name: /menu/i })).first(),
  ).toBeVisible();
  await expect(page.locator("[data-cat-exam-root]")).toHaveCount(0);
}

async function expectLearnerShell(page: Page): Promise<void> {
  await waitForAuthenticatedLearnerShell(page, { timeoutMs: 120_000 });
  const shell = page.getByTestId("learner-shell");
  await expect(shell).toBeVisible({ timeout: 90_000 });
  await expect(shell.getByRole("link", { name: /NurseNest|home/i }).first()).toBeVisible();
  await expect(page.getByRole("navigation", { name: /Learner primary actions|Learner bottom navigation/i })).toBeVisible();
  await expect(page.locator("[data-cat-exam-root]")).toHaveCount(0);
}

async function capture(page: Page, testInfo: TestInfo, label: string): Promise<void> {
  const path = join(SCREENSHOT_DIR, `${safeFilePart(testInfo.project.name)}-${safeFilePart(label)}.png`);
  await page.screenshot({ path, fullPage: false });
  await testInfo.attach(label, { path, contentType: "image/png" });
}

test.beforeEach(async ({ context }) => {
  await context.addInitScript(
    ({ dismissedKey, themeKey }) => {
      localStorage.setItem(dismissedKey, "1");
      localStorage.setItem(themeKey, "ocean");
      document.documentElement?.setAttribute("data-theme", "ocean");
    },
    { dismissedKey: SELECTOR_DISMISSED_LS, themeKey: THEME_STORAGE_KEY },
  );
});

test.describe("Premium shell navigation consistency audit — public", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("required theme matrix remains complete", async () => {
    expect(new Set(PUBLIC_MARKETING_THEME_ALLOWLIST)).toEqual(new Set(REQUIRED_AUDIT_THEMES));
  });

  for (const viewport of [
    { name: "desktop", width: 1280, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ] as const) {
    test(`standard public shell remains branded, navigable, and non-overlapping on ${viewport.name}`, async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name.includes("paid"), "Public shell audit runs in anonymous browser projects.");
      test.setTimeout(900_000);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      for (const target of PUBLIC_TARGETS) {
        const themes = target.captureThemes ? REQUIRED_AUDIT_THEMES : ["ocean"];
        for (const themeId of themes) {
          await test.step(`${target.id} ${viewport.name} ${themeId}`, async () => {
            await preparePage(page, target.path, themeId);
            await target.ready(page).waitFor({ state: "visible", timeout: 90_000 });
            await dismissMarketingScrims(page);
            await expectPublicShell(page);
            await expectNoHorizontalOverflow(page);
            await expectNoVisibleElementOverlap(page, [
              "header[data-nn-header-layout]",
              "[data-nn-header-band='utility']",
              "[data-nn-header-band='tier']",
              "[role='dialog']",
            ]);
            await capture(page, testInfo, `public-${target.id}-${viewport.name}-${themeId}`);
          });
        }
      }
    });
  }
});

test.describe("Premium shell navigation consistency audit — learner", () => {
  for (const viewport of [
    { name: "desktop", width: 1280, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ] as const) {
    test(`standard learner shell remains branded, navigable, and non-overlapping on ${viewport.name}`, async ({
      page,
    }, testInfo) => {
      test.skip(!testInfo.project.name.includes("paid"), "Learner shell audit requires paid browser storage.");
      test.setTimeout(900_000);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      for (const target of LEARNER_TARGETS) {
        const themes = target.captureThemes ? REQUIRED_AUDIT_THEMES : ["ocean"];
        for (const themeId of themes) {
          await test.step(`${target.id} ${viewport.name} ${themeId}`, async () => {
            await preparePage(page, target.path, themeId);
            await target.ready(page).waitFor({ state: "visible", timeout: 120_000 });
            await expectLearnerShell(page);
            await expectNoHorizontalOverflow(page);
            await expectNoVisibleElementOverlap(page, [
              ".nn-learner-shell-sticky",
              "[data-nn-learner-shell-study-nav]",
              "[role='dialog']",
            ]);
            await capture(page, testInfo, `learner-${target.id}-${viewport.name}-${themeId}`);
          });
        }
      }
    });
  }

  test("active CAT session isolates global learner chrome and keeps minimal NurseNest identity", async ({
    page,
  }, testInfo) => {
    test.skip(!testInfo.project.name.includes("paid"), "CAT shell audit requires paid browser storage.");
    test.setTimeout(360_000);
    await page.setViewportSize({ width: 1280, height: 900 });
    await preparePage(page, `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PATHWAY_ID)}`);
    await waitForAuthenticatedLearnerShell(page, { timeoutMs: 120_000 });
    await page.locator("[data-nn-qa-practice-hub-start-test]").click();
    await page.getByRole("button", { name: /^Begin exam$/i }).click();
    await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });
    await expect(page.locator("[data-cat-exam-root]")).toBeVisible({ timeout: 120_000 });

    await expect(page.locator("[data-nn-cat-minimal-brand-shell]")).toBeVisible({ timeout: 30_000 });
    await expect(page.locator("[data-nn-cat-minimal-brand-shell]").getByText("NurseNest")).toBeVisible();
    await expect(page.locator(".nn-learner-shell-sticky")).toHaveCSS("display", "none");
    await expect(page.locator("[data-nn-learner-shell-study-nav]").filter({ visible: true })).toHaveCount(0);
    await expect(page.locator("[data-nn-qa-cat-live-transparency]")).toHaveCount(0);
    await expect(page.locator(".nn-question-session-rationale")).toHaveCount(0);
    await expect(page.locator("[data-cat-exam-root]")).toHaveAttribute("data-nn-cat-premium-convergence", "");
    await expectNoHorizontalOverflow(page);
    await capture(page, testInfo, "cat-exam-isolated-desktop-ocean");
  });
});
