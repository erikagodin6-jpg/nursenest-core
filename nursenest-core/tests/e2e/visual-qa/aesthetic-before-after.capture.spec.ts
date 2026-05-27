/**
 * Real-site captures for aesthetic before/after review (Ocean / Blossom / Midnight × desktop / mobile).
 *
 * Outputs:
 *   docs/screenshots/aesthetic-before-after/before/before-{pageId}-{theme}-{viewport}.png
 *   docs/screenshots/aesthetic-before-after/capture-manifest.json
 *
 * Post-process (generates after/, comparisons/, report):
 *   npm run aesthetic-before-after:build
 *
 *   cd nursenest-core && npx playwright test -c playwright.aesthetic-audit.config.ts \
 *     tests/e2e/visual-qa/aesthetic-before-after.capture.spec.ts
 *
 * Learner routes need playwright/.auth/learner-paid.json (`npm run visual-qa:auth`).
 *
 * **Stability:** If `next dev` resets mid-run (`ERR_CONNECTION_RESET` / `ECONNREFUSED`), run against a
 * stable origin: `PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=https://your-preview… npm run aesthetic-before-after:capture`.
 * The build step merges any `before/*.png` missing from `capture-manifest.json` so partial captures still produce comparisons.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";
import {
  applyLearnerTheme,
  applyMarketingTheme,
  assertHtmlTheme,
  measureBodyContrastHint,
  VIEWPORTS,
  type AestheticThemeId,
} from "../helpers/aesthetic-audit-shared";
import { VISUAL_QA_LEARNER_AUTH_FILE } from "../helpers/auth-state-paths";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import { requireOrigin, seedUsMarketingCookie } from "../helpers/navigation-e2e";
import { learnerAppMainLandmark, PAID_E2E_DEFAULT_PATHWAY_ID } from "../helpers/paid-learner-shell";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..", "..", "..");
const ROOT = path.join(REPO_ROOT, "docs", "screenshots", "aesthetic-before-after");
const BEFORE_DIR = path.join(ROOT, "before");

const THEMES = ["ocean", "blossom", "midnight"] as const satisfies readonly AestheticThemeId[];
type BeforeTheme = (typeof THEMES)[number];

const pid = PAID_E2E_DEFAULT_PATHWAY_ID;

if (existsSync(VISUAL_QA_LEARNER_AUTH_FILE)) {
  test.use({ storageState: VISUAL_QA_LEARNER_AUTH_FILE });
}

export interface CaptureManifestRow {
  pageId: string;
  route: string;
  theme: BeforeTheme;
  viewport: "desktop" | "mobile";
  beforeRelPath: string;
  capturedAt: string;
  contrastHint: number | null;
  docOverflowPx: number;
  mockupStrategy: "safe-readability-pass" | "document-only-banner";
  severity: "low" | "moderate" | "major";
  recommendations: string[];
  figmaApprovalRequired: boolean;
  implementationRisk: "low" | "medium" | "high";
  likelyAffectedFiles: string[];
  notes: string;
}

const manifest: CaptureManifestRow[] = [];

function beforeFilename(pageId: string, theme: BeforeTheme, vp: "desktop" | "mobile"): string {
  return `before-${pageId}-${theme}-${vp}.png`;
}

function beforeAbs(pageId: string, theme: BeforeTheme, vp: "desktop" | "mobile"): string {
  return path.join(BEFORE_DIR, beforeFilename(pageId, theme, vp));
}

function relFromRepo(abs: string): string {
  return path.relative(REPO_ROOT, abs).split(path.sep).join("/");
}

async function settleMarketing(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  await dismissMarketingScrims(page);
  await page.waitForLoadState("networkidle", { timeout: 90_000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready).catch(() => {});
}

async function settleLearner(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  await learnerAppMainLandmark(page).waitFor({ state: "visible", timeout: 120_000 });
  await page.waitForLoadState("networkidle", { timeout: 90_000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready).catch(() => {});
}

async function docOverflow(page: Page): Promise<number> {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

function buildRecommendations(args: {
  pageId: string;
  contrast: number | null;
  overflow: number;
  marketing: boolean;
}): { list: string[]; mockupStrategy: CaptureManifestRow["mockupStrategy"]; figma: boolean; severity: CaptureManifestRow["severity"] } {
  const list: string[] = [];
  let figma = false;
  let severity: CaptureManifestRow["severity"] = "low";
  let mockupStrategy: CaptureManifestRow["mockupStrategy"] = "safe-readability-pass";

  if (args.overflow > 2) {
    list.push(
      `Fix document-level horizontal overflow (~${args.overflow}px): prefer inner \`overflow-x-auto\` on tables/code blocks; audit full-bleed marketing bands.`,
    );
    figma = true;
    severity = "major";
    mockupStrategy = "document-only-banner";
  }
  if (args.contrast != null && args.contrast < 2.2) {
    list.push(
      "Improve body/surface contrast using semantic tokens (`--semantic-text-*`, `--semantic-bg-*`, `--semantic-border-soft`) across the active theme.",
    );
    if (severity === "low") severity = "moderate";
  }
  if (args.marketing && args.pageId === "home") {
    list.push(
      "Reduce excess vertical whitespace between hero and first proof strip; keep section order and i18n keys unchanged (spacing tokens / section wrappers only).",
    );
    figma = true;
    if (severity !== "major") severity = "moderate";
    mockupStrategy = "document-only-banner";
  }
  if (args.pageId === "lesson-detail") {
    list.push(
      "Improve long-form reading rhythm (measure column width, heading spacing, code/figure margins) without changing lesson slug routes or paywall.",
    );
    figma = true;
    severity = "major";
    mockupStrategy = "document-only-banner";
  }
  if (["dashboard", "lessons-hub", "flashcards-hub", "practice-hub", "cat-hub"].includes(args.pageId)) {
    list.push(
      "Strengthen card hierarchy (title → supporting meta → primary action) using existing learner shells (`LearnerSurfaceCard`, semantic panel tokens) — no new routes.",
    );
    figma = true;
    if (severity === "low") severity = "moderate";
    mockupStrategy = "document-only-banner";
  }
  if (args.pageId === "report-card") {
    list.push(
      "Use multi-hue semantic chart bands for KPI rows (`--semantic-chart-1`…`5`) so analytics reads premium, not single-brand wash.",
    );
    figma = true;
    if (severity !== "major") severity = "moderate";
  }
  if (args.pageId === "account-settings") {
    list.push(
      "Tighten form vertical rhythm and section labels for scanability (tokenized spacing only); do not change account API contracts.",
    );
    if (!figma) mockupStrategy = "safe-readability-pass";
  }
  if (args.pageId === "rt-hub" || args.pageId === "mlt-hub") {
    list.push(
      "Align occupation hub module cards to pathway premium module spacing scale; keep `alliedProfession` query scoping intact.",
    );
    figma = true;
    if (severity !== "major") severity = "moderate";
    mockupStrategy = "document-only-banner";
  }
  if (list.length === 0) {
    list.push(
      "Optional: validate screenshot legibility after theme switch — any change should stay within semantic token guardrails.",
    );
  }
  return { list, mockupStrategy, figma, severity };
}

function likelyFiles(pageId: string, marketing: boolean): string[] {
  if (marketing) {
    if (pageId === "home") return ["nursenest-core/src/components/marketing/home/**", "nursenest-core/src/app/globals.css"];
    if (pageId === "rt-hub" || pageId === "mlt-hub") {
      return ["nursenest-core/src/app/(marketing)/(default)/allied/**", "nursenest-core/src/app/semantic-status-tokens.css"];
    }
    return ["nursenest-core/src/app/(marketing)/**"];
  }
  const base = ["nursenest-core/src/app/(app)/app/(learner)/**", "nursenest-core/src/app/semantic-status-tokens.css"];
  if (pageId === "lesson-detail") return [...base, "nursenest-core/src/components/lessons/**"];
  if (pageId === "account-settings") return [...base, "nursenest-core/src/app/(app)/app/(learner)/account/**"];
  return base;
}

function pushManifest(row: Omit<CaptureManifestRow, "beforeRelPath"> & { absPath: string }): void {
  const { absPath, ...rest } = row;
  manifest.push({ ...rest, beforeRelPath: relFromRepo(absPath) });
}

// Do not use serial mode: if Next dev resets mid-run (OOM / connection reset),
// serial would skip the entire remaining matrix. Captures are independent.
test.beforeAll(() => {
  mkdirSync(BEFORE_DIR, { recursive: true });
});

test.afterAll(() => {
  const manifestPath = path.join(ROOT, "capture-manifest.json");
  writeFileSync(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), captures: manifest }, null, 2));
});

const MARKETING: readonly { pageId: string; route: string; readySelector: string }[] = [
  { pageId: "home", route: "/", readySelector: ".nn-home-marketing-rich-hero, main" },
  { pageId: "rt-hub", route: "/allied/respiratory", readySelector: "main h1, .nn-premium-pathway-hub, main" },
  { pageId: "mlt-hub", route: "/allied/mlt", readySelector: "main h1, .nn-premium-pathway-hub, main" },
];

test.describe("Before/after — marketing (real pages)", () => {
  test.use({ reducedMotion: "reduce" });

  for (const m of MARKETING) {
    for (const theme of THEMES) {
      for (const vpName of ["desktop", "mobile"] as const) {
        test(`${m.pageId} — ${theme} — ${vpName}`, async ({ page, baseURL }) => {
          const origin = requireOrigin(baseURL);
          await seedUsMarketingCookie(page, origin);

          await page.setViewportSize(VIEWPORTS[vpName]);
          const res = await page.goto(`${origin.replace(/\/$/, "")}${m.route}`, {
            waitUntil: "domcontentloaded",
            timeout: 180_000,
          });
          expect(res?.ok(), `${m.route} HTTP ${res?.status()}`).toBeTruthy();

          await settleMarketing(page);
          await page.locator(m.readySelector).first().waitFor({ state: "visible", timeout: 120_000 });

          await applyMarketingTheme(page, theme);
          await assertHtmlTheme(page, theme);

          const contrast = await measureBodyContrastHint(page);
          const overflow = await docOverflow(page);
          const rec = buildRecommendations({
            pageId: m.pageId,
            contrast: contrast.ratio,
            overflow,
            marketing: true,
          });

          const abs = beforeAbs(m.pageId, theme, vpName);
          await page.screenshot({ path: abs, fullPage: true });

          pushManifest({
            pageId: m.pageId,
            route: m.route,
            theme,
            viewport: vpName,
            absPath: abs,
            capturedAt: new Date().toISOString(),
            contrastHint: contrast.ratio,
            docOverflowPx: overflow,
            mockupStrategy: rec.mockupStrategy,
            severity: rec.severity,
            recommendations: rec.list,
            figmaApprovalRequired: rec.figma,
            implementationRisk: rec.figma ? "medium" : "low",
            likelyAffectedFiles: likelyFiles(m.pageId, true),
            notes: "Marketing capture — US region cookie; real DOM + branding.",
          });
        });
      }
    }
  }
});

const LEARNER: readonly { pageId: string; route: string; readySelector: string }[] = [
  { pageId: "dashboard", route: "/app", readySelector: "#nn-learner-main, [data-nn-learner-main], .nn-learner-app main" },
  {
    pageId: "lessons-hub",
    route: `/app/lessons?pathwayId=${encodeURIComponent(pid)}`,
    readySelector: "#nn-learner-main, [data-nn-learner-main]",
  },
  {
    pageId: "flashcards-hub",
    route: `/app/flashcards?pathwayId=${encodeURIComponent(pid)}`,
    readySelector: "#nn-learner-main, [data-nn-learner-main]",
  },
  {
    pageId: "practice-hub",
    route: `/app/practice-tests?pathwayId=${encodeURIComponent(pid)}`,
    readySelector: "#nn-learner-main, [data-nn-learner-main]",
  },
  {
    pageId: "cat-hub",
    route: `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(pid)}`,
    readySelector: "#nn-learner-main, [data-nn-learner-main]",
  },
  { pageId: "report-card", route: "/app/account/report", readySelector: "#nn-learner-main, [data-nn-learner-main], main" },
  {
    pageId: "account-settings",
    route: "/app/account/settings",
    readySelector: "#nn-learner-main, [data-nn-learner-main], main",
  },
];

const learnerDescribe = existsSync(VISUAL_QA_LEARNER_AUTH_FILE) ? test.describe : test.describe.skip;

learnerDescribe("Before/after — learner (real pages)", () => {
  test.use({ reducedMotion: "reduce" });

  for (const L of LEARNER) {
    for (const theme of THEMES) {
      for (const vpName of ["desktop", "mobile"] as const) {
        test(`${L.pageId} — ${theme} — ${vpName}`, async ({ page, baseURL }) => {
          if (!existsSync(VISUAL_QA_LEARNER_AUTH_FILE)) {
            test.skip();
            return;
          }
          const origin = requireOrigin(baseURL).replace(/\/$/, "");
          await page.setViewportSize(VIEWPORTS[vpName]);
          const res = await page.goto(`${origin}${L.route}`, { waitUntil: "domcontentloaded", timeout: 180_000 });
          expect(res?.ok(), `${L.route} HTTP ${res?.status()}`).toBeTruthy();
          if (page.url().includes("/login") || page.url().includes("/sign-in")) {
            test.skip(true, "Redirected to login — refresh visual-qa auth.");
          }

          await applyLearnerTheme(page, theme);
          await assertHtmlTheme(page, theme);
          await page.locator(L.readySelector).first().waitFor({ state: "visible", timeout: 120_000 });
          await settleLearner(page);

          const contrast = await measureBodyContrastHint(page);
          const overflow = await docOverflow(page);
          const rec = buildRecommendations({
            pageId: L.pageId,
            contrast: contrast.ratio,
            overflow,
            marketing: false,
          });

          const abs = beforeAbs(L.pageId, theme, vpName);
          await page.screenshot({ path: abs, fullPage: true });

          pushManifest({
            pageId: L.pageId,
            route: L.route,
            theme,
            viewport: vpName,
            absPath: abs,
            capturedAt: new Date().toISOString(),
            contrastHint: contrast.ratio,
            docOverflowPx: overflow,
            mockupStrategy: rec.mockupStrategy,
            severity: rec.severity,
            recommendations: rec.list,
            figmaApprovalRequired: rec.figma,
            implementationRisk: rec.figma ? "medium" : "low",
            likelyAffectedFiles: likelyFiles(L.pageId, false),
            notes: "Learner shell capture — pathway query preserved.",
          });
        });
      }
    }
  }

  for (const theme of THEMES) {
    for (const vpName of ["desktop", "mobile"] as const) {
      test(`lesson-detail — ${theme} — ${vpName}`, async ({ page, baseURL }) => {
        if (!existsSync(VISUAL_QA_LEARNER_AUTH_FILE)) {
          test.skip();
          return;
        }
        const origin = requireOrigin(baseURL).replace(/\/$/, "");
        await page.setViewportSize(VIEWPORTS[vpName]);
        const hub = `${origin}/app/lessons?pathwayId=${encodeURIComponent(pid)}`;
        const res = await page.goto(hub, { waitUntil: "domcontentloaded", timeout: 180_000 });
        expect(res?.ok(), hub).toBeTruthy();
        if (page.url().includes("/login")) test.skip(true, "Login required");

        await applyLearnerTheme(page, theme);
        await assertHtmlTheme(page, theme);
        await settleLearner(page);

        const link = page.locator('#nn-learner-main a[href^="/app/lessons/"]').first();
        if ((await link.count()) === 0) {
          test.skip(true, "No lesson hub links — seed lessons for QA account.");
        }
        await link.click();
        await page.waitForLoadState("domcontentloaded");
        await settleLearner(page);

        const contrast = await measureBodyContrastHint(page);
        const overflow = await docOverflow(page);
        const rec = buildRecommendations({ pageId: "lesson-detail", contrast: contrast.ratio, overflow, marketing: false });

        const abs = beforeAbs("lesson-detail", theme, vpName);
        await page.screenshot({ path: abs, fullPage: true });

        const routePath = (() => {
          try {
            const u = new URL(page.url());
            return u.pathname + u.search;
          } catch {
            return "/app/lessons/…";
          }
        })();

        pushManifest({
          pageId: "lesson-detail",
          route: routePath,
          theme,
          viewport: vpName,
          absPath: abs,
          capturedAt: new Date().toISOString(),
          contrastHint: contrast.ratio,
          docOverflowPx: overflow,
          mockupStrategy: rec.mockupStrategy,
          severity: rec.severity,
          recommendations: rec.list,
          figmaApprovalRequired: rec.figma,
          implementationRisk: "high",
          likelyAffectedFiles: likelyFiles("lesson-detail", false),
          notes: "First lesson link from hub — slug is data-dependent.",
        });
      });
    }
  }
});
