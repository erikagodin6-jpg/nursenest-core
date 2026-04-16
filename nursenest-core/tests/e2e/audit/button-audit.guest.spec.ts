/**
 * Guest (unauthenticated) — control inventory + safe interaction audit.
 *
 * Artifacts: `test-results/button-audit/inventory-guest.json`, `safe-interaction-guest.json`
 *
 * @see tests/e2e/audit/README-button-audit.md
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { attachButtonAuditObservers } from "../helpers/button-audit/observers";
import { collectInteractiveInventory } from "../helpers/button-audit/inventory-collector";
import { isLikelyDestructive } from "../helpers/button-audit/destructive-patterns";
import type { InventoryControl, InventoryReport, SafeInteractionReport } from "../helpers/button-audit/types";
import { writeInventoryReport, writeSafeInteractionReport, BUTTON_AUDIT_DIR } from "../helpers/button-audit/report-writer";
import { GUEST_SEEDS, parseAllowlistEnv } from "../helpers/button-audit/page-seeds";
import { partitionFailures, runSafeInteractionOnPage } from "../helpers/button-audit/safe-interaction";
import { getE2eBaseURL } from "../helpers/e2e-env";

const MAX_PER_PAGE = Number(process.env.E2E_BUTTON_AUDIT_MAX_CONTROLS ?? "60");
const ROLE = "guest";

test.describe.configure({ mode: "serial", timeout: 900_000 });

test.describe("Button audit — guest", () => {
  test("inventory: collect interactive controls on marketing + pathway seeds", async ({ page, baseURL }) => {
    test.setTimeout(900_000);
    const origin = baseURL ?? getE2eBaseURL();
    const allowOverride = parseAllowlistEnv();
    const paths = allowOverride ?? GUEST_SEEDS.paths;
    const pages: InventoryReport["pages"] = [];
    const obs = attachButtonAuditObservers(page);

    try {
      for (const pathname of paths) {
        const url = `${origin.replace(/\/$/, "")}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
        const nav = await page.goto(url, { waitUntil: "load", timeout: 240_000 }).catch(() => null);
        if (!nav?.ok()) {
          pages.push({
            pathname,
            url: page.url(),
            collectedAt: new Date().toISOString(),
            controls: [],
            truncated: false,
            maxControls: MAX_PER_PAGE,
          });
          continue;
        }
        await page.locator("body").waitFor({ state: "visible", timeout: 30_000 });
        const inv = await collectInteractiveInventory(page, { maxControls: MAX_PER_PAGE, pathname });
        pages.push(inv);
      }
    } finally {
      obs.dispose();
    }

    const destructiveHints = pages.flatMap((p) =>
      p.controls
        .filter((c) => isLikelyDestructive({ text: c.text, ariaLabel: c.ariaLabel, dataTestId: c.dataTestId }))
        .map((c) => ({ pathname: p.pathname, text: c.text.slice(0, 120) })),
    );

    const report: InventoryReport = {
      generatedAt: new Date().toISOString(),
      baseURL: origin,
      auditKind: "inventory",
      role: ROLE,
      pages,
    };

    const { jsonPath, mdPath } = await writeInventoryReport(report);
    await mkdir(path.join(BUTTON_AUDIT_DIR, "meta"), { recursive: true });
    await writeFile(
      path.join(BUTTON_AUDIT_DIR, "meta", "guest-inventory-observers.json"),
      JSON.stringify(
        { pageErrors: obs.pageErrors, documentHttpErrors: obs.documentHttpErrors, destructiveHints },
        null,
        2,
      ),
      "utf8",
    );

    // eslint-disable-next-line no-console
    console.log(`[button-audit] inventory written: ${jsonPath}, ${mdPath}`);
    expect(obs.pageErrors, `page/console errors: ${obs.pageErrors.join(" | ")}`).toEqual([]);
    expect(obs.documentHttpErrors, `document HTTP errors: ${JSON.stringify(obs.documentHttpErrors)}`).toEqual([]);
  });

  test("safe interaction: non-destructive controls (capped)", async ({ page, baseURL }) => {
    test.setTimeout(900_000);
    const origin = baseURL ?? getE2eBaseURL();
    const allowOverride = parseAllowlistEnv();
    const paths = (allowOverride ?? GUEST_SEEDS.paths).slice(0, 12);
    const obs = attachButtonAuditObservers(page);
    const allResults: SafeInteractionReport["results"] = [];

    try {
      for (const pathname of paths) {
        const url = `${origin.replace(/\/$/, "")}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
        const nav = await page.goto(url, { waitUntil: "load", timeout: 240_000 }).catch(() => null);
        if (!nav?.ok()) continue;
        await page.locator("body").waitFor({ state: "visible", timeout: 30_000 });
        const inv = await collectInteractiveInventory(page, { maxControls: MAX_PER_PAGE, pathname });
        const chunk = await runSafeInteractionOnPage({
          page,
          origin,
          pathname,
          controls: inv.controls as InventoryControl[],
        });
        allResults.push(...chunk);
      }
    } finally {
      obs.dispose();
    }

    const failures = partitionFailures(allResults);
    const report: SafeInteractionReport = {
      generatedAt: new Date().toISOString(),
      baseURL: origin,
      auditKind: "safe_interaction",
      role: ROLE,
      results: allResults,
      failures,
    };
    const { jsonPath, mdPath } = await writeSafeInteractionReport(report);
    // eslint-disable-next-line no-console
    console.log(`[button-audit] safe interaction written: ${jsonPath}, ${mdPath}; failures: ${failures.length}`);

    expect(obs.pageErrors, obs.pageErrors.join("\n")).toEqual([]);
    expect(obs.documentHttpErrors).toEqual([]);
    expect(failures, `safe interaction failures: ${JSON.stringify(failures, null, 2)}`).toEqual([]);
  });
});
