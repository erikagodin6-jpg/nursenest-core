import fs from "node:fs";
import path from "node:path";
import type { Page } from "@playwright/test";

/**
 * Persist cookies + localStorage (per origin) so Playwright can inject them via `storageState` on later tests.
 * Used by `tests/e2e/setup/*.setup.ts` — do not call from regular specs (use project `storageState` instead).
 */
export async function saveStorageStateToFile(page: Page, filePath: string): Promise<void> {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  await page.context().storageState({ path: filePath });
}
