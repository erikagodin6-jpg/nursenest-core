/**
 * Optional Canada RN entitled session (`E2E_CA_PAID_EMAIL` / `E2E_CA_PAID_PASSWORD`).
 */
import fs from "fs";
import path from "path";
import { test as setup } from "@playwright/test";
import { CA_PAID_USER_AUTH_FILE } from "../helpers/auth-state-paths";
import { attachPageObservers } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import { getCaPaidTestCredentials } from "../helpers/paid-test-credentials";
import { getE2eBaseURL } from "../helpers/e2e-env";
import { spawnWaitForAppReady } from "../helpers/spawn-wait-for-app-ready";

setup("authenticate CA paid test account and save storage state", async ({ page }) => {
  spawnWaitForAppReady();
  const creds = getCaPaidTestCredentials();
  if (!creds) {
    throw new Error("Set E2E_CA_PAID_EMAIL and E2E_CA_PAID_PASSWORD for setup-ca-paid-auth.");
  }

  attachPageObservers(page, { profile: "public", probeAuthApi: true });
  await loginWithCredentials(page, creds.email, creds.password, {
    enterLearnerApp: true,
    navigationOrigin: getE2eBaseURL(),
  });

  fs.mkdirSync(path.dirname(CA_PAID_USER_AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: CA_PAID_USER_AUTH_FILE });
});
