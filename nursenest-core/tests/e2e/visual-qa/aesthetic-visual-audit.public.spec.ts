/**
 * Public marketing aesthetic audit — PNG inventory + layout/token guards (Ocean / Blossom / Midnight).
 * Screenshots: docs/screenshots/aesthetic-audit-2026/public/
 *
 *   cd nursenest-core && npx playwright test -c playwright.aesthetic-audit.config.ts --project=aesthetic-audit tests/e2e/visual-qa/aesthetic-visual-audit.public.spec.ts
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";
import {
  AESTHETIC_THEMES,
  applyMarketingTheme,
  assertHtmlTheme,
  assertNavChromeTokensPresent,
  assertSinglePublicSiteNav,
  measureBodyContrastHint,
  VIEWPORTS,
  warnSuspiciousAllCapsCTAs,
  type AestheticThemeId,
} from "../helpers/aesthetic-audit-shared";
import { runAestheticAudit } from "../helpers/aesthetic-audit-runner";
import { stabilizePageForCapture } from "../helpers/aesthetic-stabilization";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import { assertNoHorizontalOverflow } from "../helpers/marketing-qa";
import {
  requireOrigin,
  seedCaMarketingCookie,
  seedUsMarketingCookie,
} from "../helpers/navigation-e2e";

const HERE = path.dirname(fileURLToPath(import.meta.url));
/** tests/e2e/visual-qa -> … -> monorepo git root */
const REPO_ROOT = path.resolve(HERE, "..", "..", "..", "..");
const OUT = path.join(REPO_ROOT, "docs", "screenshots", "aesthetic-audit-2026", "public");

const PREMIUM_ZONE = '[data-nn-qa-pathway-premium-modules=""]';

type PublicRoute = {
  id: string;
  path: string;
  seed: "us" | "ca";
  readySelector: string;
  /** Run marketing nav token + single-nav checks */
  marketingChrome: boolean;
};

const PUBLIC_ROUTES: PublicRoute[] = [
  {
    id: "home",
    path: "/",
    seed: "us",
    readySelector: ".nn-home-marketing-rich-hero",
    marketingChrome: true,
  },
  {
    id: "rn-hub",
    path: "/us/rn/nclex-rn",
    seed: "us",
    readySelector: PREMIUM_ZONE,
    marketingChrome: true,
  },
  {
    id: "rpn-hub",
    path: "/canada/pn/rex-pn",
    seed: "ca",
    readySelector: PREMIUM_ZONE,
    marketingChrome: true,
  },
  {
    id: "np-hub",
    path: "/us/np/fnp",
    seed: "us",
    readySelector: PREMIUM_ZONE,
    marketingChrome: true,
  },
  {
    id: "allied-hub",
    path: "/allied/allied-health",
    seed: "us",
    readySelector: '[data-nn-nursing-tier-hub="surface"], main',
    marketingChrome: true,
  },
  /** Occupation hub — validates allied branch styling beyond global hub */
  {
    id: "allied-respiratory",
    path: "/allied/respiratory",
    seed: "us",
    readySelector: "main h1, .nn-premium-pathway-hub, main",
    marketingChrome: true,
  },
  {
    id: "allied-mlt",
    path: "/allied/mlt",
    seed: "us",
    readySelector: "main h1, .nn-premium-pathway-hub, main",
    marketingChrome: true,
  },
  {
    id: "blog",
    path: "/blog",
    seed: "us",
    readySelector: "main",
    marketingChrome: true,
  },
  {
    id: "blog-article",
    path: "/blog/clinical-judgment-on-exam-day",
    seed: "us",
    readySelector: "article, main",
    marketingChrome: true,
  },
  {
    id: "marketing-lesson",
    path: "/us/rn/nclex-rn/lessons/us-rn-pulmonary-embolism",
    seed: "us",
    readySelector: "h1.nn-lesson-page-title, article.nn-lesson-article-flow",
    marketingChrome: false,
  },
];

async function settlePublicPage(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  // Avoid `networkidle` here — marketing pages often keep long-lived connections (analytics,
  // streaming, dev tooling) open, which can stall audits until the whole test times out.
  await page.waitForLoadState("load", { timeout: 60_000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready).catch(() => {});
}

function screenshotName(routeId: string, theme: AestheticThemeId, vp: "desktop" | "mobile"): string {
  return path.join(OUT, `pub-${routeId}-${theme}-${vp}.png`);
}

test.beforeAll(() => {
  mkdirSync(OUT, { recursive: true });
});

test.describe("Aesthetic audit — public surfaces", () => {
  test.use({ reducedMotion: "reduce" });

  for (const route of PUBLIC_ROUTES) {
    for (const theme of AESTHETIC_THEMES) {
      for (const vpName of ["desktop", "mobile"] as const) {
        test(`public ${route.id} — ${theme} — ${vpName}`, async ({ page, baseURL }, testInfo) => {
          const origin = requireOrigin(baseURL);
          if (route.seed === "ca") await seedCaMarketingCookie(page, origin);
          else await seedUsMarketingCookie(page, origin);

          const vp = VIEWPORTS[vpName];
          await page.setViewportSize(vp);

          const res = await page.goto(`${origin}${route.path}`, {
            waitUntil: "domcontentloaded",
            timeout: 180_000,
          });
          if (!res?.ok() && route.path.startsWith("/blog")) {
            testInfo.skip(true, `HTTP ${res?.status()} for ${route.path} — DB/content unavailable`);
            return;
          }
          expect(res?.ok(), `${route.path} status ${res?.status()}`).toBeTruthy();

          await dismissMarketingScrims(page);
          await settlePublicPage(page);

          await page.locator(route.readySelector).first().waitFor({ state: "visible", timeout: 120_000 });

          await applyMarketingTheme(page, theme);
          await assertHtmlTheme(page, theme);

          if (route.marketingChrome) {
            await assertNavChromeTokensPresent(page);
            await assertSinglePublicSiteNav(page);
          }

          await assertNoHorizontalOverflow(page);

          const contrast = await measureBodyContrastHint(page);
          if (contrast.ratio != null && contrast.ratio < 2.5) {
            console.warn(
              `[aesthetic-audit] Low contrast hint ${contrast.ratio.toFixed(2)} on ${route.id} ${theme} (${vpName})`,
            );
          }

          await warnSuspiciousAllCapsCTAs(page, `public/${route.id}`);

          await stabilizePageForCapture(page, {
            readyLocator: page.locator(route.readySelector).first(),
            totalTimeoutMs: 120_000,
          });

          const screenshotPath = screenshotName(route.id, theme, vpName);
          await page.screenshot({
            path: screenshotPath,
            fullPage: true,
          });

          await runAestheticAudit({
            page,
            route: `public-${route.id}`,
            theme,
            viewport: vpName,
            screenshotPath,
          });

          await expect.soft(contrast.ratio == null || contrast.ratio >= 1.6).toBe(true);
        });
      }
    }
  }
});
