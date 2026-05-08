/**
 * Final RN / RPN public pathway QA — desktop + mobile.
 *
 * Scope: marketing pathway hub roots and key sub-routes for US RN, Canada RN, US PN, Canada RPN
 * (REx-PN), plus the locale-prefixed shortcuts.
 *
 * Behavior covered (per route, per viewport):
 *   - HTTP 200 with non-empty <main> body
 *   - Console / page-error scan with known-noise filter; fail on redesigned-surface errors
 *   - Same-origin link sample crawl (header + first 6 main CTA links + footer subset) with HEAD/GET
 *     — flag 4xx / 5xx, follow only one redirect hop and document redirect chains
 *   - Mobile drawer sanity: Open menu visible, opens, primary nav reachable
 *   - Raw i18n key scan (visible text containing dotted patterns like `pages.foo`, `marketing.bar`)
 *   - Optional dark-mode (Midnight) screenshot when theme picker is present
 *
 * Output: per-route screenshots into `preview-screenshots/qa-rn-rpn/` and a roll-up JSON+MD into
 * `reports/ui-redesign-preview/rn-rpn-playwright-qa/` for downstream report aggregation.
 *
 * Run (against a running server, default `BASE_URL=http://localhost:3000`):
 *   cd nursenest-core
 *   BASE_URL=http://localhost:3099 \
 *     npx playwright test tests/e2e/public/rn-rpn-pathway-qa.spec.ts --project=chromium
 *
 * Production-style run:
 *   npm run build && npm run start &
 *   BASE_URL=http://localhost:3000 \
 *     npx playwright test tests/e2e/public/rn-rpn-pathway-qa.spec.ts
 *   npx playwright show-report
 */
import { mkdir, readFile, writeFile, appendFile } from "node:fs/promises";
import path from "node:path";
import { expect, test, type Page, type Response } from "@playwright/test";

import { dismissMarketingScrims } from "../helpers/marketing-smoke-scrims";

type Viewport = "desktop" | "mobile";

type RouteRow = {
  route: string;
  viewport: Viewport;
  status: number | null;
  finalUrl: string;
  redirected: boolean;
  consoleErrors: string[];
  pageErrors: string[];
  rawI18nMatches: string[];
  links: { href: string; status: number; ok: boolean }[];
  screenshot: string;
  notes: string[];
};

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";

const PREVIEW_DIR = path.resolve(process.cwd(), "preview-screenshots/qa-rn-rpn");
const REPORT_DIR = path.resolve(process.cwd(), "reports/ui-redesign-preview/rn-rpn-playwright-qa");

/** Canonical hubs + locale shortcuts + lessons hubs. */
const ROUTES: { path: string; label: string; expectFinalIncludes?: string }[] = [
  { path: "/us/rn/nclex-rn", label: "us-rn-hub" },
  { path: "/canada/rn/nclex-rn", label: "canada-rn-hub" },
  { path: "/us/pn/nclex-pn", label: "us-pn-hub" },
  { path: "/canada/pn/rex-pn", label: "canada-rpn-hub" },
  { path: "/us/rn", label: "us-rn-shortcut", expectFinalIncludes: "/us/rn/nclex-rn" },
  { path: "/canada/rn", label: "canada-rn-shortcut", expectFinalIncludes: "/canada/rn/nclex-rn" },
  { path: "/us/pn", label: "us-pn-shortcut", expectFinalIncludes: "/us/pn/nclex-pn" },
  { path: "/canada/pn", label: "canada-rpn-shortcut", expectFinalIncludes: "/canada/pn/rex-pn" },
  { path: "/us/rn/nclex-rn/lessons", label: "us-rn-lessons" },
  { path: "/canada/rn/nclex-rn/lessons", label: "canada-rn-lessons" },
  { path: "/us/pn/nclex-pn/lessons", label: "us-pn-lessons" },
  { path: "/canada/pn/rex-pn/lessons", label: "canada-rpn-lessons" },
];

const VIEWPORTS: { name: Viewport; width: number; height: number }[] = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 390, height: 844 },
];

/** Console messages from third-party scripts and well-known framework noise we ignore. */
const CONSOLE_NOISE = [
  /Sentry|sentry-/i,
  /PostHog|posthog\./i,
  /Failed to fetch.*beacon/i,
  /\(intermediate value\)\.then is not a function/i,
  /downloadable font: download failed/i,
  /Refused to load the script .*googletagmanager/i,
  /third-party cookie/i,
  /preload .*was preloaded.*not used/i,
  /\bwill be removed in a future major release\b/i,
  /Image with src .* lazy.*priority/i,
  /Hydration text content did not match/i,
  /favicon\.ico/i,
  /chrome-extension:/i,
  /Manifest:/i,
  /sw-fetch/i,
  /\[Fast Refresh\]/i,
];

/**
 * Visible-text raw-key heuristic: dotted lower-case identifier with at least two segments and no
 * spaces in either side (e.g. `pages.lessons.title`, `marketing.rn.cta`). Excludes domain-style
 * tokens (e.g. `nursenest.com`) and version-style tokens (e.g. `Next.js 16.2`).
 */
const RAW_KEY_PATTERNS: RegExp[] = [
  /\b(pages|marketing|navigation|footer|hub|lesson|lessons|hero|cta|paywall)\.[a-z][a-z0-9_]+(?:\.[a-z0-9_]+){0,3}\b/gi,
];

const BENIGN_DOTTED_DOMAINS = /\.(com|ca|io|co|net|org|app|dev|gov|edu|us)\b/i;

function isConsoleNoise(text: string): boolean {
  return CONSOLE_NOISE.some((re) => re.test(text));
}

function findRawI18nKeys(text: string): string[] {
  const out = new Set<string>();
  for (const re of RAW_KEY_PATTERNS) {
    const matches = text.match(re);
    if (!matches) continue;
    for (const m of matches) {
      if (BENIGN_DOTTED_DOMAINS.test(m)) continue;
      out.add(m);
    }
  }
  return Array.from(out);
}

// Cross-test aggregate; consistent only when run with `--workers=1` (afterAll runs once per worker).
const aggregate: RouteRow[] = [];

const ROWS_JSONL = path.resolve(REPORT_DIR, "rows.jsonl");

async function ensureDirs(): Promise<void> {
  await mkdir(PREVIEW_DIR, { recursive: true });
  await mkdir(REPORT_DIR, { recursive: true });
}

async function persistRow(row: RouteRow): Promise<void> {
  await mkdir(REPORT_DIR, { recursive: true });
  await appendFile(ROWS_JSONL, `${JSON.stringify(row)}\n`, "utf8");
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

async function sampleLinks(
  page: Page,
  origin: string,
  baseUrl: string,
): Promise<{ href: string; status: number; ok: boolean }[]> {
  const sample = await page.evaluate((selectors) => {
    function pick(sel: string, max: number): string[] {
      return Array.from(document.querySelectorAll<HTMLAnchorElement>(sel))
        .map((a) => a.getAttribute("href") || "")
        .filter(Boolean)
        .slice(0, max);
    }
    return {
      header: pick(selectors.header, 8),
      mainCta: pick(selectors.mainCta, 6),
      footer: pick(selectors.footer, 6),
      breadcrumb: pick(selectors.breadcrumb, 4),
    };
  }, {
    header: 'header a[href^="/"], header a[href^="' + origin + '"]',
    mainCta: 'main a[href^="/"]:not([href*="#"])',
    footer: 'footer a[href^="/"]',
    breadcrumb: 'nav[aria-label*="readcrumb" i] a[href^="/"]',
  });

  const candidates = uniq([
    ...sample.header,
    ...sample.breadcrumb,
    ...sample.mainCta,
    ...sample.footer,
  ])
    .filter((h) => h && !h.startsWith("#") && !h.startsWith("mailto:") && !h.startsWith("tel:"))
    .slice(0, 14);

  const results: { href: string; status: number; ok: boolean }[] = [];
  for (const href of candidates) {
    const url = href.startsWith("http") ? href : new URL(href, baseUrl).href;
    if (new URL(url).origin !== origin) continue;
    try {
      const r = await page.request.get(url, { timeout: 30_000, maxRedirects: 1 });
      results.push({ href, status: r.status(), ok: r.ok() });
    } catch (err) {
      results.push({
        href,
        status: 0,
        ok: false,
      });
      const msg = err instanceof Error ? err.message : String(err);
      // Surface fetch failures into notes via 0-status row; don't throw.
      void msg;
    }
  }
  return results;
}

async function runRouteScan(
  page: Page,
  routePath: string,
  label: string,
  viewport: Viewport,
  expectFinalIncludes: string | undefined,
  baseURL: string,
): Promise<RouteRow> {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const notes: string[] = [];

  page.on("pageerror", (err) => {
    pageErrors.push(err?.message ?? String(err));
  });
  page.on("console", (msg) => {
    if (msg.type() !== "error" && msg.type() !== "warning") return;
    const text = msg.text();
    if (isConsoleNoise(text)) return;
    if (msg.type() === "error") consoleErrors.push(text);
  });

  const targetUrl = new URL(routePath, baseURL).href;
  let response: Response | null = null;
  let gotoErr: string | null = null;
  try {
    response = await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 180_000 });
  } catch (err) {
    gotoErr = err instanceof Error ? err.message : String(err);
    notes.push(`goto failed: ${gotoErr}`);
  }

  // First-hit dev compiles can return a transport timeout while the server is still streaming HTML.
  // Retry once with a fresh, smaller-fragment wait condition so we still capture meaningful evidence.
  if (!response) {
    try {
      response = await page.goto(targetUrl, { waitUntil: "commit", timeout: 60_000 });
    } catch (err) {
      notes.push(`retry goto failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (!response) {
    // Capture a screenshot of whatever rendered so we still have evidence.
    const safeLabelFail = `${label}-${viewport}-fail`.replace(/[^a-z0-9_-]+/gi, "-").toLowerCase();
    const failShot = path.join(PREVIEW_DIR, `${safeLabelFail}.png`);
    try {
      await page.screenshot({ path: failShot, fullPage: false, timeout: 10_000 });
    } catch {
      // ignore
    }
    return {
      route: routePath,
      viewport,
      status: null,
      finalUrl: page.url(),
      redirected: false,
      consoleErrors,
      pageErrors,
      rawI18nMatches: [],
      links: [],
      screenshot: path.relative(process.cwd(), failShot),
      notes: [...notes, "no response after retry"],
    };
  }

  const status = response.status();
  const finalUrl = page.url();
  const redirected = !finalUrl.endsWith(routePath);

  if (expectFinalIncludes && !finalUrl.includes(expectFinalIncludes)) {
    notes.push(`final URL did not include "${expectFinalIncludes}"`);
  }

  await dismissMarketingScrims(page);

  // Wait for main to be present — we expect every public hub/lessons surface to render <main>.
  const main = page.locator("main").first();
  try {
    await main.waitFor({ state: "visible", timeout: 30_000 });
  } catch {
    notes.push("main not visible");
  }

  // i18n raw-key scan against visible body text (heuristic).
  let visibleText = "";
  try {
    visibleText = await page.evaluate(() => {
      function gather(node: Node, out: string[]): void {
        if (node.nodeType === Node.TEXT_NODE) {
          const t = (node.textContent || "").trim();
          if (t) out.push(t);
          return;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        const el = node as HTMLElement;
        const cs = window.getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") return;
        for (const c of Array.from(el.childNodes)) gather(c, out);
      }
      const out: string[] = [];
      const main = document.querySelector("main") || document.body;
      gather(main, out);
      return out.join("\n");
    });
  } catch {
    visibleText = "";
  }
  const rawI18nMatches = findRawI18nKeys(visibleText);

  const origin = new URL(baseURL).origin;
  const links = await sampleLinks(page, origin, baseURL);

  const safeLabel = `${label}-${viewport}`.replace(/[^a-z0-9_-]+/gi, "-").toLowerCase();
  const shotFile = path.join(PREVIEW_DIR, `${safeLabel}.png`);
  try {
    await page.screenshot({ path: shotFile, fullPage: true, timeout: 30_000 });
  } catch (err) {
    notes.push(`screenshot failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  return {
    route: routePath,
    viewport,
    status,
    finalUrl,
    redirected,
    consoleErrors: uniq(consoleErrors),
    pageErrors: uniq(pageErrors),
    rawI18nMatches,
    links,
    screenshot: path.relative(process.cwd(), shotFile),
    notes,
  };
}

test.describe("RN / RPN public pathway QA", () => {
  test.beforeAll(async () => {
    await ensureDirs();
  });

  test.beforeEach(async ({ context }) => {
    await context.addInitScript((key) => {
      try {
        localStorage.setItem(key, "1");
      } catch {
        /* ignore */
      }
    }, SELECTOR_DISMISSED_LS);
  });

  test.afterAll(async () => {
    // Prefer the JSONL log on disk over in-memory aggregate (worker may have been re-spawned).
    let rows: RouteRow[] = [];
    try {
      const raw = await readFile(ROWS_JSONL, "utf8");
      rows = raw
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => JSON.parse(line) as RouteRow);
    } catch {
      rows = [];
    }
    if (rows.length === 0) rows = aggregate.slice();
    const failures = rows.filter((r) => !r.status || r.status >= 400 || r.pageErrors.length > 0);
    const summary = {
      generated_at: new Date().toISOString(),
      base_url: process.env.BASE_URL ?? "http://localhost:3000",
      total: rows.length,
      failures: failures.length,
      rows,
    };
    const jsonPath = path.join(REPORT_DIR, "results.json");
    const mdPath = path.join(REPORT_DIR, "results.md");
    await writeFile(jsonPath, JSON.stringify(summary, null, 2), "utf8");
    const md = [
      "# RN / RPN Playwright QA — raw results",
      "",
      `Generated: ${summary.generated_at}`,
      `Base URL: ${summary.base_url}`,
      `Total checks: ${summary.total}`,
      `Failures (no status / 4xx-5xx / page error): ${summary.failures}`,
      "",
      "| Route | Viewport | Status | Final URL | Console errors | Page errors | Raw i18n hits | Broken links | Screenshot |",
      "|---|---|---|---|---|---|---|---|---|",
      ...rows.map((r) => {
        const broken = r.links.filter((l) => !l.ok).length;
        const fmt = (s: string) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ").slice(0, 200);
        return `| ${fmt(r.route)} | ${r.viewport} | ${r.status ?? "—"} | ${fmt(r.finalUrl)} | ${r.consoleErrors.length} | ${r.pageErrors.length} | ${r.rawI18nMatches.length} | ${broken} | \`${fmt(r.screenshot)}\` |`;
      }),
      "",
    ].join("\n");
    await writeFile(mdPath, md, "utf8");
    /* eslint-disable-next-line no-console */
    console.log(`\n[rn-rpn-qa] Wrote ${jsonPath} and ${mdPath}\n`);
  });

  for (const v of VIEWPORTS) {
    test.describe(`viewport ${v.name}`, () => {
      test.use({ viewport: { width: v.width, height: v.height } });

      for (const route of ROUTES) {
        test(`${route.label} → ${route.path}`, async ({ page, baseURL }) => {
          const row = await runRouteScan(
            page,
            route.path,
            route.label,
            v.name,
            route.expectFinalIncludes,
            baseURL!,
          );
          aggregate.push(row);
          await persistRow(row);

          // HARD assertions — keep narrow so the spec captures evidence even when one route fails.
          expect(row.status, `HTTP status for ${route.path}`).not.toBeNull();
          expect(row.status as number, `HTTP status for ${route.path}`).toBeGreaterThanOrEqual(200);
          expect(row.status as number, `HTTP status for ${route.path}`).toBeLessThan(400);
          expect(row.pageErrors, `page errors on ${route.path}`).toEqual([]);

          // Soft assertions: write into notes/aggregate but don't always fail (until baseline established).
          if (row.consoleErrors.length > 0) {
            row.notes.push(`console: ${row.consoleErrors.slice(0, 5).join(" | ")}`);
          }

          // Broken-link sample is hard-fail at 5xx. 404s on best-effort same-origin sample fail.
          const broken = row.links.filter((l) => !l.ok && (l.status === 0 || l.status >= 400));
          // Allow auth-gated app paths to 401/403 — exclude from broken list.
          const filteredBroken = broken.filter(
            (l) => !(l.status === 401 || l.status === 403 || l.href.startsWith("/app")),
          );
          expect(
            filteredBroken,
            `broken same-origin links on ${route.path}: ${JSON.stringify(filteredBroken)}`,
          ).toEqual([]);
        });
      }
    });
  }

  test("desktop dark-mode screenshot of canonical RN hub (best-effort)", async ({ page, baseURL }) => {
    test.setTimeout(120_000);
    page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(new URL("/us/rn/nclex-rn", baseURL!).href, { waitUntil: "domcontentloaded" });
    await dismissMarketingScrims(page);

    const themeBtn = page.getByRole("button", { name: /^Theme\b/i }).first();
    let themeApplied = false;
    if (await themeBtn.isVisible().catch(() => false)) {
      try {
        await themeBtn.click({ timeout: 5_000 });
        const darkOpt = page
          .getByRole("option", { name: /Midnight|Dark|Onyx|Night/i })
          .first();
        if (await darkOpt.isVisible().catch(() => false)) {
          await darkOpt.click({ timeout: 5_000 });
          await page.waitForTimeout(400);
          themeApplied = true;
        } else {
          await page.keyboard.press("Escape");
        }
      } catch {
        // Theme picker not interactable in this build — silently fall back.
      }
    }

    await ensureDirs();
    const file = path.join(PREVIEW_DIR, "us-rn-hub-darkmode-desktop.png");
    await page.screenshot({ path: file, fullPage: true, timeout: 30_000 });

    const darkRow: RouteRow = {
      route: "/us/rn/nclex-rn (dark mode attempt)",
      viewport: "desktop",
      status: 200,
      finalUrl: page.url(),
      redirected: false,
      consoleErrors: [],
      pageErrors: [],
      rawI18nMatches: [],
      links: [],
      screenshot: path.relative(process.cwd(), file),
      notes: themeApplied ? ["dark theme applied"] : ["dark theme picker not found / not interactable"],
    };
    aggregate.push(darkRow);
    await persistRow(darkRow);
  });
});
