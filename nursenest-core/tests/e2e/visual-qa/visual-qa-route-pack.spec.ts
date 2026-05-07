/**
 * Captures PNGs for marketing + authenticated learner hubs (see `docs/visual-qa.md`).
 *
 * Output: `.visual-acceptance/routes/<slug>/latest/<viewport>-<label>.png`
 * Label: `VISUAL_QA_LABEL` env (e.g. `before`, `after`); default `capture`.
 */
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { LESSON_HUB_CARD_LINKS } from "../helpers/paid-content-discovery";
import { PAID_E2E_DEFAULT_PATHWAY_ID } from "../helpers/paid-learner-shell";
import { VISUAL_QA_LEARNER_AUTH_FILE } from "../helpers/auth-state-paths";

const pid = PAID_E2E_DEFAULT_PATHWAY_ID;
const label = (process.env.VISUAL_QA_LABEL?.trim() || "capture").replace(/[^a-zA-Z0-9_-]+/g, "-");

const VIEWPORTS = [
  { id: "mobile", width: 390, height: 844 },
  { id: "tablet", width: 768, height: 1024 },
  { id: "desktop", width: 1280, height: 800 },
] as const;

type Shell = "learner" | "marketing";

const ROUTES: readonly { slug: string; url: string; shell: Shell }[] = [
  /** Study home + learner dashboard both resolve to `/app` (see `docs/visual-qa.md`). */
  { slug: "study-home", url: "/app", shell: "learner" },
  { slug: "rn-hub", url: "/us/rn/nclex-rn", shell: "marketing" },
  { slug: "rpn-hub", url: "/canada/rpn/rex-pn", shell: "marketing" },
  { slug: "np-hub", url: "/us/np/fnp", shell: "marketing" },
  { slug: "allied-landing", url: "/allied/allied-health", shell: "marketing" },
  { slug: "allied-occupation-mlt", url: "/allied/mlt", shell: "marketing" },
  { slug: "new-grad-landing", url: "/us/new-grad", shell: "marketing" },
  { slug: "new-grad-work-area-canada", url: "/canada/new-grad", shell: "marketing" },
  { slug: "flashcards-hub", url: `/app/flashcards?pathwayId=${encodeURIComponent(pid)}`, shell: "learner" },
  { slug: "practice-questions", url: `/app/questions?pathwayId=${encodeURIComponent(pid)}`, shell: "learner" },
  { slug: "practice-tests", url: `/app/practice-tests?pathwayId=${encodeURIComponent(pid)}`, shell: "learner" },
  { slug: "cat-hub", url: "/us/rn/nclex-rn/cat", shell: "marketing" },
  { slug: "report-card", url: "/app/account/report", shell: "learner" },
];

function learnerMain(page: Page) {
  return page
    .locator("#nn-learner-main")
    .or(page.locator("[data-nn-learner-main]"))
    .or(page.locator(".nn-learner-app main").first());
}

async function assertShellReady(page: Page, shell: Shell): Promise<void> {
  if (shell === "learner") {
    try {
      await expect(learnerMain(page)).toBeVisible({ timeout: 90_000 });
    } catch {
      if (/\/login/i.test(page.url())) {
        test.skip(true, "Hit /login — refresh `npm run visual-qa:auth` and align NEXTAUTH_URL with PLAYWRIGHT_BASE_URL.");
      }
      throw new Error(`Learner shell not ready: ${page.url()}`);
    }
    return;
  }
  await expect(page.locator("body")).toBeVisible({ timeout: 60_000 });
}

test.describe.configure({ mode: "serial" });

test.beforeAll(({}, testInfo) => {
  if (!existsSync(VISUAL_QA_LEARNER_AUTH_FILE)) {
    testInfo.skip(true, `Missing ${VISUAL_QA_LEARNER_AUTH_FILE} — run npm run visual-qa:auth`);
  }
});

for (const route of ROUTES) {
  test.describe(route.slug, () => {
    for (const vp of VIEWPORTS) {
      test(`${vp.id} (${vp.width}x${vp.height})`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(route.url, { waitUntil: "domcontentloaded" });
        await assertShellReady(page, route.shell);

        const outDir = path.join(
          process.cwd(),
          ".visual-acceptance",
          "routes",
          route.slug,
          "latest",
        );
        await mkdir(outDir, { recursive: true });
        const filePath = path.join(outDir, `${vp.id}-${label}.png`);
        await page.screenshot({ path: filePath, fullPage: true });
      });
    }
  });
}

test.describe("lesson-detail", () => {
  for (const vp of VIEWPORTS) {
    test(`${vp.id}`, async ({ page }) => {
      if (!existsSync(VISUAL_QA_LEARNER_AUTH_FILE)) {
        test.skip(true, `Missing ${VISUAL_QA_LEARNER_AUTH_FILE}`);
      }
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`/app/lessons?pathwayId=${encodeURIComponent(pid)}`, { waitUntil: "domcontentloaded" });
      try {
        await expect(learnerMain(page)).toBeVisible({ timeout: 30_000 });
      } catch {
        if (/\/login/i.test(page.url())) {
          test.skip(true, "Login gate on lessons hub.");
        }
      }
      const first = page.locator(LESSON_HUB_CARD_LINKS).first();
      const visible = await first.isVisible().catch(() => false);
      if (!visible) {
        test.skip(true, "No lesson cards in local DB for this pathway — seed lessons or use staging.");
        return;
      }
      const href = await first.getAttribute("href");
      if (!href) {
        test.skip(true, "Lesson hub card missing href.");
        return;
      }
      await page.goto(href, { waitUntil: "domcontentloaded" });
      await assertShellReady(page, "learner");
      const outDir = path.join(process.cwd(), ".visual-acceptance", "routes", "lesson-detail", "latest");
      await mkdir(outDir, { recursive: true });
      await page.screenshot({
        path: path.join(outDir, `${vp.id}-${label}.png`),
        fullPage: true,
      });
    });
  }
});
