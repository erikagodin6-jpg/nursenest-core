import path from "node:path";

/** Single source of truth for saved auth JSON (setup + playwright.config `storageState`). */
export const PAID_USER_AUTH_FILE =
  process.env.PLAYWRIGHT_PAID_AUTH_STATE ?? path.join(process.cwd(), "e2e", ".auth", "paid-user.json");
