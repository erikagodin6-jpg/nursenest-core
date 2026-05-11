/**
 * Stability helpers — make every screenshot deterministic so the regression
 * engine doesn't accumulate noise from font swaps, lazy media, or skeleton
 * fade-ins. Specs should call {@link stabilizePageForCapture} *after* navigation
 * settles and *before* {@link Page.screenshot}.
 */
import type { Locator, Page } from "@playwright/test";

export interface StabilizationOptions {
  /** Maximum total wait for fonts + load state + custom ready locator. */
  totalTimeoutMs?: number;
  /** Selector that must be visible before we consider the page "ready". */
  readyLocator?: Locator;
  /** How long to give animations to settle after we appear loaded. */
  animationSettleMs?: number;
  /** Inject reduced-motion CSS even when the browser flag is set. */
  forceReducedMotion?: boolean;
  /** Hide ephemeral indicators that drift across runs (timestamps, ticks). */
  hideSelectors?: readonly string[];
}

const DEFAULT_HIDE_SELECTORS = [
  "[data-nn-relative-time]",
  "[data-nn-server-timestamp]",
  "[data-nn-volatile]",
  ".nn-skeleton",
  "[data-state='loading']",
] as const;

/**
 * Best-effort multi-pass settle. Each step is wrapped in `.catch(() => {})` so
 * a flaky network or missing optional locator never breaks the audit — the
 * goal is "stable enough for screenshot", not perfect determinism.
 */
export async function stabilizePageForCapture(
  page: Page,
  opts: StabilizationOptions = {},
): Promise<void> {
  const total = opts.totalTimeoutMs ?? 60_000;
  const start = Date.now();
  const left = () => Math.max(2_000, total - (Date.now() - start));

  if (opts.forceReducedMotion !== false) {
    await injectReducedMotionStyles(page).catch(() => {});
  }

  await page.waitForLoadState("domcontentloaded", { timeout: left() }).catch(() => {});

  if (opts.readyLocator) {
    await opts.readyLocator
      .first()
      .waitFor({ state: "visible", timeout: left() })
      .catch(() => {});
  }

  await page.evaluate(() => document.fonts.ready).catch(() => {});

  await page.waitForLoadState("networkidle", { timeout: Math.min(20_000, left()) }).catch(() => {});

  // Pause any running web animations so screenshots don't catch mid-tween.
  await page
    .evaluate(() => {
      try {
        for (const anim of document.getAnimations()) {
          anim.pause();
        }
      } catch {
        /* ignore — older browsers without getAnimations */
      }
    })
    .catch(() => {});

  // Hide ephemeral / time-sensitive indicators.
  const hide = opts.hideSelectors ?? DEFAULT_HIDE_SELECTORS;
  if (hide.length > 0) {
    await page
      .addStyleTag({
        content: hide.map((sel) => `${sel}{visibility:hidden!important;animation:none!important;}`).join("\n"),
      })
      .catch(() => {});
  }

  await page.waitForTimeout(opts.animationSettleMs ?? 120);
}

async function injectReducedMotionStyles(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        scroll-behavior: auto !important;
      }
      html { caret-color: transparent !important; }
    `,
  });
}

/**
 * Retry a flake-prone capture step. Used by specs that interact with the page
 * (clicks, form fills) before screenshotting. Linear backoff keeps the spec
 * budget predictable; default 2 retries on top of the initial attempt.
 */
export async function withAntiFlakeRetry<T>(
  fn: (attempt: number) => Promise<T>,
  retries = 2,
  baseDelayMs = 500,
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastErr = err;
      if (attempt === retries) break;
      await new Promise((resolve) => setTimeout(resolve, baseDelayMs * (attempt + 1)));
    }
  }
  throw lastErr;
}
