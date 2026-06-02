import { mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Locator, Page } from "@playwright/test";
import { isSafeForDefaultAudit } from "./destructive-patterns";
import type { InventoryControl, SafeClickOutcome, SafeClickResult } from "./types";
import { BUTTON_AUDIT_DIR } from "./report-writer";

const MAX_SAFE_CLICKS_PER_PAGE = Number(process.env.E2E_BUTTON_AUDIT_MAX_SAFE_CLICKS ?? "8");

function internalPathname(href: string, origin: string): string | null {
  try {
    const u = new URL(href, origin);
    if (u.origin !== new URL(origin).origin) return null;
    return `${u.pathname}${u.search}`;
  } catch {
    return null;
  }
}

export function controlToLocator(page: Page, origin: string, c: InventoryControl): Locator | null {
  if (c.dataTestId) {
    return page.getByTestId(c.dataTestId).first();
  }
  if (c.href) {
    const p = internalPathname(c.href, origin);
    if (!p) return null;
    return page.locator(`a[href="${CSS.escape(c.href)}"]`).first();
  }
  if (c.tag === "a") return null;
  const name = c.ariaLabel || c.text.slice(0, 120);
  if (name.length > 2) {
    return page.getByRole("button", { name: new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").slice(0, 60), "i") }).first();
  }
  return null;
}

async function screenshotFail(page: Page, slug: string): Promise<string | undefined> {
  try {
    await mkdir(path.join(BUTTON_AUDIT_DIR, "screenshots"), { recursive: true });
    const fp = path.join(BUTTON_AUDIT_DIR, "screenshots", `${slug}-${randomUUID().slice(0, 8)}.png`);
    await page.screenshot({ path: fp, fullPage: false });
    return fp;
  } catch {
    return undefined;
  }
}

/**
 * Clicks up to N safe controls per page (testid / internal href preferred).
 */
export async function runSafeInteractionOnPage(args: {
  page: Page;
  origin: string;
  pathname: string;
  controls: InventoryControl[];
}): Promise<SafeClickResult[]> {
  const { page, origin, pathname, controls } = args;
  const results: SafeClickResult[] = [];
  const candidates = controls.filter((c) => isSafeForDefaultAudit(c)).slice(0, MAX_SAFE_CLICKS_PER_PAGE);

  for (const c of candidates) {
    const urlBefore = page.url();
    const locator = controlToLocator(page, origin, c);
    if (!locator) {
      results.push({
        pathname,
        urlBefore,
        urlAfter: urlBefore,
        control: {
          tag: c.tag,
          text: c.text,
          href: c.href,
          dataTestId: c.dataTestId,
          interactionHint: c.interactionHint,
        },
        outcome: "skipped_unstable",
        detail: "no stable locator (add data-testid or use internal href)",
      });
      continue;
    }

    const visible = await locator.isVisible({ timeout: 3000 }).catch(() => false);
    if (!visible) {
      results.push({
        pathname,
        urlBefore,
        urlAfter: page.url(),
        control: {
          tag: c.tag,
          text: c.text,
          href: c.href,
          dataTestId: c.dataTestId,
          interactionHint: c.interactionHint,
        },
        outcome: "skipped_unstable",
        detail: "locator not visible",
      });
      continue;
    }

    try {
      await locator.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
      await locator.click({ timeout: 15_000, noWaitAfter: false });
      await page.waitForLoadState("domcontentloaded", { timeout: 30_000 }).catch(() => {});
      await new Promise((r) => setTimeout(r, 400));

      const urlAfter = page.url();
      let outcome: SafeClickOutcome = "no_op_but_ok";
      if (urlAfter !== urlBefore) outcome = "navigated";

      const dialog = page.locator('[role="dialog"], [data-state="open"][data-radix-collection-item]');
      if ((await dialog.count()) > 0 && (await dialog.first().isVisible().catch(() => false))) {
        outcome = "dialog_opened";
        await page.keyboard.press("Escape").catch(() => {});
        await new Promise((r) => setTimeout(r, 200));
      }

      results.push({
        pathname,
        urlBefore,
        urlAfter,
        control: {
          tag: c.tag,
          text: c.text,
          href: c.href,
          dataTestId: c.dataTestId,
          interactionHint: c.interactionHint,
        },
        outcome,
      });

      if (urlAfter !== urlBefore && urlBefore.includes(pathname)) {
        await page.goBack({ waitUntil: "domcontentloaded", timeout: 30_000 }).catch(() => {});
        await new Promise((r) => setTimeout(r, 300));
      }
    } catch (e) {
      const shot = await screenshotFail(page, "safe-click-error");
      results.push({
        pathname,
        urlBefore,
        urlAfter: page.url(),
        control: {
          tag: c.tag,
          text: c.text,
          href: c.href,
          dataTestId: c.dataTestId,
          interactionHint: c.interactionHint,
        },
        outcome: "error",
        detail: e instanceof Error ? e.message : String(e),
        screenshotPath: shot,
      });
    }
  }

  return results;
}

export function partitionFailures(results: SafeClickResult[]): SafeClickResult[] {
  return results.filter((r) => r.outcome === "error" || r.outcome === "skipped_unstable");
}
