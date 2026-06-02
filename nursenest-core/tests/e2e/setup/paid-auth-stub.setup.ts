/**
 * No-op setup when paid E2E credentials are absent — keeps `setup-paid-auth` project registered
 * so `npx playwright test --project=setup-paid-auth` always resolves (see `playwright.config.ts`).
 */
import { test as setup } from "@playwright/test";

setup("paid-auth stub — set E2E_PAID_EMAIL + E2E_PAID_PASSWORD for real auth.setup.ts", async () => {});
