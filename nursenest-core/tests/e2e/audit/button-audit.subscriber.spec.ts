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
import { writePathwayReport, writeInventoryReport, writeSafeInteractionReport } from "../helpers/button-audit/report-writer";
import type { InventoryControl, InventoryReport, SafeInteractionReport } from "../helpers/button-audit/types";
import { PAID_LEARNER_SEEDS } from "../helpers/button-audit/page-seeds";
import { partitionFailures, runSafeInteractionOnPage } from "../helpers/button-audit/safe-interaction";
import { waitForAuthenticatedLearnerShell } from "../helpers/paid-learner-shell";
import { getE2eBaseURL } from "../helpers/e2e-env";

const MAX_PER_PAGE = Number(process.env.E2E_BUTTON_AUDIT_MAX_CONTROLS ?? "60");
const PAID_SAFE_PATH_CAP = Number(process.env.E2E_BUTTON_AUDIT_PAID_SAFE_PATHS ?? "10");

const describePaid = hasPaidTestCredentials() ? test.describe : test.describe.skip;

describePaid("Button audit — paid subscriber", () => {
  test("inventory: learner app seeds", async ({ page, baseURL }) => {
    test.setTimeout(600_000);
    const origin = baseURL ?? getE2eBaseURL();
    await page.goto(`${origin.replace(/\/$/, "")}/app/dashboard`, { waitUntil: "load", timeout: 180_000 });
    await waitForAuthenticatedLearnerShell(page, { timeoutMs: 180_000 });

    const obs = attachButtonAuditObservers(page, origin);
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
    console.log(`[button-audit] paid inventory: ${jsonPath}`);
    expect(obs.pageErrors).toEqual([]);
    expect(obs.documentHttpErrors).toEqual([]);
    if (process.env.E2E_BUTTON_AUDIT_TRACK_API === "1") {
      expect(obs.sameOriginApiErrors, JSON.stringify(obs.sameOriginApiErrors)).toEqual([]);
    }
  });

  test("pathway integrity: hub → lesson navigation stays within pathway", async ({ page, baseURL }) => {
    test.setTimeout(900_000);
    const origin = baseURL ?? getE2eBaseURL();
    await page.goto(`${origin.replace(/\/$/, "")}/app/dashboard`, { waitUntil: "load", timeout: 180_000 });
    await waitForAuthenticatedLearnerShell(page, { timeoutMs: 180_000 });

    const obs = attachButtonAuditObservers(page, origin);
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
    console.log(`[button-audit] pathway integrity: ${outPath}`);

    expect(obs.pageErrors).toEqual([]);
    for (const r of rows) {
      expect(r.forbiddenHit, `pathway ${r.pathwayId} navigated into forbidden pattern`).toBeNull();
    }
  });

  test("safe interaction: capped non-destructive controls on learner seeds", async ({ page, baseURL }) => {
    test.setTimeout(900_000);
    const origin = baseURL ?? getE2eBaseURL();
    await page.goto(`${origin.replace(/\/$/, "")}/app/dashboard`, { waitUntil: "load", timeout: 180_000 });
    await waitForAuthenticatedLearnerShell(page, { timeoutMs: 180_000 });

    const obs = attachButtonAuditObservers(page, origin);
    const allResults: SafeInteractionReport["results"] = [];
    const paths = PAID_LEARNER_SEEDS.paths.slice(0, PAID_SAFE_PATH_CAP);

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
      role: "paid",
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
