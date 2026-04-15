/**
 * Free-tier user login once; storage reused by `chromium-free` (see playwright.config.ts).
 */
import fs from "node:fs";
import path from "node:path";
import { test as setup } from "@playwright/test";
import { FREE_USER_AUTH_FILE } from "../helpers/auth-state-paths";
import { loginWithCredentials } from "../helpers/learner-login";

setup("save free-user storage state", async ({ page }) => {
  const email = process.env.E2E_FREE_EMAIL?.trim();
  const password = process.env.E2E_FREE_PASSWORD;
  if (!email || !password) {
    throw new Error("E2E_FREE_EMAIL / E2E_FREE_PASSWORD missing (playwright.config should gate free projects).");
  }

  await loginWithCredentials(page, email, password);

  fs.mkdirSync(path.dirname(FREE_USER_AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: FREE_USER_AUTH_FILE });
});
