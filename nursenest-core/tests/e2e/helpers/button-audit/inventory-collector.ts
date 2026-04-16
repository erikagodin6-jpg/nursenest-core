import type { Page } from "@playwright/test";
import { isLikelyDestructive } from "./destructive-patterns";
import type { InventoryControl, PageInventory } from "./types";

/**
 * Collects visible interactive controls using a single `page.evaluate` pass.
 * Caps results to avoid huge JSON on dense pages.
 */
export async function collectInteractiveInventory(
  page: Page,
  opts: { maxControls: number; pathname: string },
): Promise<PageInventory> {
  const maxControls = Math.max(1, opts.maxControls);
  const raw = await page.evaluate((max) => {
    type Hint = "navigate" | "submit" | "toggle" | "dialog" | "unknown";
    const out: {
      index: number;
      tag: string;
      role: string | null;
      text: string;
      ariaLabel: string | null;
      href: string | null;
      dataTestId: string | null;
      disabled: boolean;
      visible: boolean;
      interactionHint: Hint;
      rect: { top: number; left: number; width: number; height: number };
    }[] = [];

    const sel = [
      "button",
      '[role="button"]',
      'input[type="button"]',
      'input[type="submit"]',
      'details summary',
      "a[role=\"button\"]",
      "a[data-testid]",
      "a[data-nn-qa-primary-lesson]",
      "a[data-nn-qa-practice-hub-start-test]",
    ].join(", ");

    const nodes = document.querySelectorAll(sel);
    for (const node of nodes) {
      if (!(node instanceof HTMLElement)) continue;
      if (out.length >= max) break;

      const disabled =
        (node instanceof HTMLButtonElement && node.disabled) ||
        (node instanceof HTMLInputElement && node.disabled) ||
        node.getAttribute("aria-disabled") === "true";

      const r = node.getBoundingClientRect();
      const visible =
        r.width >= 2 &&
        r.height >= 2 &&
        r.bottom >= -200 &&
        r.top <= window.innerHeight + 400 &&
        getComputedStyle(node).visibility !== "hidden" &&
        getComputedStyle(node).display !== "none";

      if (!visible) continue;

      const tag = node.tagName.toLowerCase();
      const role = node.getAttribute("role");
      const text = (node.textContent || "").replace(/\s+/g, " ").trim().slice(0, 280);
      const ariaLabel = node.getAttribute("aria-label");
      const dataTestId = node.getAttribute("data-testid");
      let href: string | null = null;
      if (node instanceof HTMLAnchorElement) {
        href = node.getAttribute("href");
      }

      const ariaHaspopup = node.getAttribute("aria-haspopup");
      const ariaExpanded = node.getAttribute("aria-expanded");
      const type = node instanceof HTMLInputElement ? node.type : null;

      let interactionHint: Hint = "unknown";
      if (href) interactionHint = "navigate";
      else if (tag === "input" && type === "submit") interactionHint = "submit";
      else if (ariaHaspopup === "dialog" || ariaHaspopup === "true") interactionHint = "dialog";
      else if (ariaExpanded === "true" || ariaExpanded === "false") interactionHint = "toggle";

      out.push({
        index: out.length,
        tag,
        role,
        text: text || (dataTestId ? `[${dataTestId}]` : `[${tag}]`),
        ariaLabel,
        href,
        dataTestId,
        disabled,
        visible: true,
        interactionHint,
        rect: { top: r.top, left: r.left, width: r.width, height: r.height },
      });
    }

    const truncated = out.length >= max;
    return { rows: out, truncated };
  }, maxControls);

  const controls: InventoryControl[] = raw.rows.map((row) => ({
    ...row,
    destructiveHeuristic: isLikelyDestructive({
      text: row.text,
      ariaLabel: row.ariaLabel,
      dataTestId: row.dataTestId,
    }),
  }));

  return {
    pathname: opts.pathname,
    url: page.url(),
    collectedAt: new Date().toISOString(),
    controls,
    truncated: raw.truncated,
    maxControls,
  };
}
