/**
 * Freemium / free-tier subscriber — learner app control inventory (same seeds as paid; entitlements may differ).
 *
 * Requires: `E2E_FREE_EMAIL`, `E2E_FREE_PASSWORD`, `--project=audit-free`
 */
import { expect, test } from "@playwright/test";
import { attachButtonAuditObservers } from "../helpers/button-audit/observers";
import { collectInteractiveInventory } from "../helpers/button-audit/inventory-collector";
import { writeInventoryReport } from "../helpers/button-audit/report-writer";
import type { InventoryReport } from "../helpers/button-audit/types";
import { FREE_LEARNER_SEEDS } from "../helpers/button-audit/page-seeds";
import { waitForAuthenticatedLearnerShell } from "../helpers/paid-learner-shell";
import { getE2eBaseURL } from "../helpers/e2e-env";

const MAX_PER_PAGE = Number(process.env.E2E_BUTTON_AUDIT_MAX_CONTROLS ?? "60");

test("inventory: free subscriber learner surfaces", async ({ page, baseURL }) => {
  test.setTimeout(600_000);
  const origin = baseURL ?? getE2eBaseURL();
  await page.goto(`${origin.replace(/\/$/, "")}/app/dashboard`, { waitUntil: "load", timeout: 180_000 });
  await waitForAuthenticatedLearnerShell(page, { timeoutMs: 180_000 });

  const obs = attachButtonAuditObservers(page);
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
});
