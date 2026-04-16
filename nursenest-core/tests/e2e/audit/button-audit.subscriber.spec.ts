/**
 * Paid subscriber — learner app inventory + pathway integrity (RN/PN/NP hubs).
 *
 * Requires: `--project=chromium-paid` and `E2E_PAID_*` credentials (setup-paid-auth).
 *
 * Artifact: `test-results/button-audit/pathway-integrity-paid.json`
 */
import { expect, test } from "@playwright/test";
import { LESSON_FLOW_PATHWAY_QA } from "../../../src/lib/qa/lesson-flow-pathways";
import { hasPaidTestCredentials } from "../helpers/paid-test-credentials";
import { attachButtonAuditObservers } from "../helpers/button-audit/observers";
import { collectInteractiveInventory } from "../helpers/button-audit/inventory-collector";
import { writePathwayReport, writeInventoryReport, BUTTON_AUDIT_DIR } from "../helpers/button-audit/report-writer";
import type { InventoryReport } from "../helpers/button-audit/types";
import { PAID_LEARNER_SEEDS } from "../helpers/button-audit/page-seeds";
import { waitForAuthenticatedLearnerShell } from "../helpers/paid-learner-shell";
import { getE2eBaseURL } from "../helpers/e2e-env";

const MAX_PER_PAGE = Number(process.env.E2E_BUTTON_AUDIT_MAX_CONTROLS ?? "60");

const describePaid = hasPaidTestCredentials() ? test.describe : test.describe.skip;

describePaid("Button audit — paid subscriber", () => {
  test("inventory: learner app seeds", async ({ page, baseURL }) => {
    test.setTimeout(600_000);
    const origin = baseURL ?? getE2eBaseURL();
    await page.goto(`${origin.replace(/\/$/, "")}/app/dashboard`, { waitUntil: "load", timeout: 180_000 });
    await waitForAuthenticatedLearnerShell(page, { timeoutMs: 180_000 });

    const obs = attachButtonAuditObservers(page);
    const pages: InventoryReport["pages"] = [];
    try {
      for (const pathname of PAID_LEARNER_SEEDS.paths) {
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
      role: "paid",
      pages,
    };
    const { jsonPath } = await writeInventoryReport(report);
    // eslint-disable-next-line no-console
    console.log(`[button-audit] paid inventory: ${jsonPath}`);
    expect(obs.pageErrors).toEqual([]);
    expect(obs.documentHttpErrors).toEqual([]);
  });

  test("pathway integrity: hub → lesson navigation stays within pathway", async ({ page, baseURL }) => {
    test.setTimeout(900_000);
    const origin = baseURL ?? getE2eBaseURL();
    await page.goto(`${origin.replace(/\/$/, "")}/app/dashboard`, { waitUntil: "load", timeout: 180_000 });
    await waitForAuthenticatedLearnerShell(page, { timeoutMs: 180_000 });

    const obs = attachButtonAuditObservers(page);
    const rows: {
      pathwayId: string;
      lessonsPath: string;
      urlAfterClick: string | null;
      forbiddenHit: string | null;
    }[] = [];

    try {
      for (const entry of LESSON_FLOW_PATHWAY_QA) {
        const lessonsUrl = `${origin.replace(/\/$/, "")}${entry.lessonsPath}`;
        await page.goto(lessonsUrl, { waitUntil: "load", timeout: 240_000 });
        await page.locator("body").waitFor({ state: "visible", timeout: 30_000 });

        const primary = page.locator('[data-nn-qa-primary-lesson="true"], a[data-nn-qa-primary-lesson]').first();
        let urlAfterClick: string | null = null;
        let forbiddenHit: string | null = null;

        if (await primary.isVisible({ timeout: 8000 }).catch(() => false)) {
          await primary.scrollIntoViewIfNeeded();
          await primary.click({ timeout: 30_000 });
          await page.waitForLoadState("domcontentloaded", { timeout: 60_000 });
          urlAfterClick = page.url();
          const path = (() => {
            try {
              return new URL(urlAfterClick).pathname;
            } catch {
              return "";
            }
          })();
          for (const re of entry.forbiddenPathPatterns) {
            if (re.test(path)) forbiddenHit = re.source;
          }
        } else {
          const fallback = page.locator('main a[href*="/lessons/"]').first();
          if (await fallback.isVisible({ timeout: 5000 }).catch(() => false)) {
            await fallback.click({ timeout: 30_000 });
            await page.waitForLoadState("domcontentloaded", { timeout: 60_000 });
            urlAfterClick = page.url();
            const path = new URL(urlAfterClick).pathname;
            for (const re of entry.forbiddenPathPatterns) {
              if (re.test(path)) forbiddenHit = re.source;
            }
          }
        }

        rows.push({
          pathwayId: entry.pathwayId,
          lessonsPath: entry.lessonsPath,
          urlAfterClick,
          forbiddenHit,
        });
      }
    } finally {
      obs.dispose();
    }

    const outPath = await writePathwayReport(
      { generatedAt: new Date().toISOString(), baseURL: origin, rows },
      "pathway-integrity-paid.json",
    );
    // eslint-disable-next-line no-console
    console.log(`[button-audit] pathway integrity: ${outPath}`);

    expect(obs.pageErrors).toEqual([]);
    for (const r of rows) {
      expect(r.forbiddenHit, `pathway ${r.pathwayId} navigated into forbidden pattern`).toBeNull();
    }
  });
});
