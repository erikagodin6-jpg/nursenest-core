import type { Page } from "@playwright/test";
import { loginWithCredentials } from "./learner-login";

/** @deprecated Prefer `loginWithCredentials` — kept for existing imports. */
export async function loginPaidUser(page: Page, email: string, password: string): Promise<void> {
  await loginWithCredentials(page, email, password);
}
