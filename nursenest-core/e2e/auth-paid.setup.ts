/**
 * One-time login; saves storage state for reuse by chromium-paid (see playwright.config.ts).
 *
 * Requires: E2E_PAID_EMAIL, E2E_PAID_PASSWORD
 * Skips (and skips dependent tests) when creds are missing.
 */
import fs from "node:fs";
import path from "node:path";
import { test as setup } from "@playwright/test";
import { loginPaidUser } from "./helpers/paid-user-login";
import { PAID_USER_AUTH_FILE } from "./paid-auth-state-path";

setup("save paid-user storage state", async ({ page }) => {
  const email = process.env.E2E_PAID_EMAIL?.trim();
  const password = process.env.E2E_PAID_PASSWORD;
  // Must use conditional skip (not `if` + skip) so dependent `chromium-paid` tests skip too.
  setup.skip(!email || !password, "Set E2E_PAID_EMAIL and E2E_PAID_PASSWORD to generate auth state.");

  await loginPaidUser(page, email, password);

  fs.mkdirSync(path.dirname(PAID_USER_AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: PAID_USER_AUTH_FILE });
});
