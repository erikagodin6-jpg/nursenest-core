/**
 * Admin — safe, non-destructive checks on `/admin` only (no billing / delete flows).
 *
 * Requires: `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`
 */
import { expect, test } from "@playwright/test";
import { attachButtonAuditObservers } from "../helpers/button-audit/observers";
import { collectInteractiveInventory } from "../helpers/button-audit/inventory-collector";
import { isLikelyDestructive } from "../helpers/button-audit/destructive-patterns";
import { writePathwayReport } from "../helpers/button-audit/report-writer";
import { getAdminE2eCredentials, hasAdminE2eCredentials } from "../helpers/admin-e2e-credentials";
import { marketingLoginSubmitButton } from "../helpers/marketing-login-locators";
import { getE2eBaseURL } from "../helpers/e2e-env";

test.use({ storageState: { cookies: [], origins: [] } });

const MAX_PER_PAGE = Number(process.env.E2E_BUTTON_AUDIT_MAX_CONTROLS ?? "60");

test("admin: login and inventory /admin (no destructive clicks)", async ({ page, baseURL }) => {
  test.skip(!hasAdminE2eCredentials(), "Set E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD");
  const creds = getAdminE2eCredentials();
  if (!creds) return;

  const origin = baseURL ?? getE2eBaseURL();
  const obs = attachButtonAuditObservers(page, origin);
  try {
    await page.goto("/login", { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.locator("#login-identifier").fill(creds.email);
    await page.locator("#login-password").fill(creds.password);
    await marketingLoginSubmitButton(page).click();
    await page.waitForFunction(() => !window.location.pathname.includes("/login"), undefined, { timeout: 120_000 });

    await page.goto(`${origin.replace(/\/$/, "")}/admin`, { waitUntil: "load", timeout: 180_000 });
    await page.locator("body").waitFor({ state: "visible", timeout: 30_000 });

    const inv = await collectInteractiveInventory(page, { maxControls: MAX_PER_PAGE, pathname: "/admin" });
    const destructive = inv.controls.filter((c) =>
      isLikelyDestructive({ text: c.text, ariaLabel: c.ariaLabel, dataTestId: c.dataTestId }),
    );

    const payload = {
      generatedAt: new Date().toISOString(),
      role: "admin",
      url: page.url(),
      controlCount: inv.controls.length,
      destructiveCandidates: destructive.map((c) => ({ text: c.text.slice(0, 120), dataTestId: c.dataTestId })),
      pageErrors: obs.pageErrors,
      documentHttpErrors: obs.documentHttpErrors,
    };

    const p = await writePathwayReport(payload, "inventory-admin.json");
    console.log(`[button-audit] admin inventory: ${p}`);

    expect(obs.pageErrors).toEqual([]);
    expect(obs.documentHttpErrors).toEqual([]);
  } finally {
    obs.dispose();
  }
});
