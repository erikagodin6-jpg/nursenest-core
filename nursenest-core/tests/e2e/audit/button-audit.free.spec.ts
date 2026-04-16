/**
 * Freemium / free-tier subscriber — learner app inventory + safe interaction (same seeds as paid).
 *
 * Requires: `E2E_FREE_EMAIL`, `E2E_FREE_PASSWORD`, `--project=audit-free`
 */
import { expect, test } from "@playwright/test";
import { attachButtonAuditObservers } from "../helpers/button-audit/observers";
import { collectInteractiveInventory } from "../helpers/button-audit/inventory-collector";
import { writeInventoryReport, writeSafeInteractionReport } from "../helpers/button-audit/report-writer";
import type { InventoryControl, InventoryReport, SafeInteractionReport } from "../helpers/button-audit/types";
import { FREE_LEARNER_SEEDS } from "../helpers/button-audit/page-seeds";
import { partitionFailures, runSafeInteractionOnPage } from "../helpers/button-audit/safe-interaction";
import { waitForAuthenticatedLearnerShell } from "../helpers/paid-learner-shell";
import { getE2eBaseURL } from "../helpers/e2e-env";

const MAX_PER_PAGE = Number(process.env.E2E_BUTTON_AUDIT_MAX_CONTROLS ?? "60");
const FREE_SAFE_PATH_CAP = Number(process.env.E2E_BUTTON_AUDIT_FREE_SAFE_PATHS ?? "8");

test.describe.configure({ mode: "serial", timeout: 900_000 });

test.describe("Button audit — free subscriber", () => {
  test("inventory: learner surfaces", async ({ page, baseURL }) => {
    test.setTimeout(600_000);
    const origin = baseURL ?? getE2eBaseURL();
    await page.goto(`${origin.replace(/\/$/, "")}/app/dashboard`, { waitUntil: "load", timeout: 180_000 });
    await waitForAuthenticatedLearnerShell(page, { timeoutMs: 180_000 });

    const obs = attachButtonAuditObservers(page, origin);
    const pages: InventoryReport["pages"] = [];
    try {
      for (const pathname of FREE_LEARNER_SEEDS.paths) {
        const url = `${origin.replace(/\/$/, "")}${pathname}`;
        const nav = await page.goto(url, { waitUntil: "load", timeout: 180_000 }).catch(() => null);
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

    const report: InventoryReport = {
      generatedAt: new Date().toISOString(),
      baseURL: origin,
      auditKind: "inventory",
      role: "free",
      pages,
    };
    await writeInventoryReport(report);
    expect(obs.pageErrors).toEqual([]);
    expect(obs.documentHttpErrors).toEqual([]);
    if (process.env.E2E_BUTTON_AUDIT_TRACK_API === "1") {
      expect(obs.sameOriginApiErrors, JSON.stringify(obs.sameOriginApiErrors)).toEqual([]);
    }
  });

  test("safe interaction: capped non-destructive controls", async ({ page, baseURL }) => {
    test.setTimeout(900_000);
    const origin = baseURL ?? getE2eBaseURL();
    await page.goto(`${origin.replace(/\/$/, "")}/app/dashboard`, { waitUntil: "load", timeout: 180_000 });
    await waitForAuthenticatedLearnerShell(page, { timeoutMs: 180_000 });

    const obs = attachButtonAuditObservers(page, origin);
    const allResults: SafeInteractionReport["results"] = [];
    const paths = FREE_LEARNER_SEEDS.paths.slice(0, FREE_SAFE_PATH_CAP);

    try {
      for (const pathname of paths) {
        const url = `${origin.replace(/\/$/, "")}${pathname}`;
        const nav = await page.goto(url, { waitUntil: "load", timeout: 180_000 }).catch(() => null);
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
      role: "free",
      results: allResults,
      failures,
    };
    await writeSafeInteractionReport(report);

    expect(obs.pageErrors).toEqual([]);
    expect(obs.documentHttpErrors).toEqual([]);
    if (process.env.E2E_BUTTON_AUDIT_TRACK_API === "1") {
      expect(obs.sameOriginApiErrors, JSON.stringify(obs.sameOriginApiErrors)).toEqual([]);
    }
    expect(failures, JSON.stringify(failures, null, 2)).toEqual([]);
  });
});
