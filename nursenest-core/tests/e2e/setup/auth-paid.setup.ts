/**
 * One-time login; saves storage state for reuse by `chromium-paid` (see playwright.config.ts).
 *
 * Projects `setup-paid-auth` + `chromium-paid` register only when E2E_PAID_EMAIL and E2E_PAID_PASSWORD are set.
 */
import fs from "node:fs";
import path from "node:path";
import { test as setup } from "@playwright/test";
import { PAID_USER_AUTH_FILE } from "../helpers/auth-state-paths";
import { loginWithCredentials } from "../helpers/learner-login";

setup("save paid-user storage state", async ({ page }) => {
  const email = process.env.E2E_PAID_EMAIL?.trim();
  const password = process.env.E2E_PAID_PASSWORD;
  if (!email || !password) {
    throw new Error("E2E_PAID_EMAIL / E2E_PAID_PASSWORD missing (playwright.config should gate paid projects).");
  }

  await loginWithCredentials(page, email, password);

  fs.mkdirSync(path.dirname(PAID_USER_AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: PAID_USER_AUTH_FILE });
});
