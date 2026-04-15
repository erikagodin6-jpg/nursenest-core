import path from "node:path";

export const FREE_USER_AUTH_FILE =
  process.env.PLAYWRIGHT_FREE_AUTH_STATE ?? path.join(process.cwd(), "e2e", ".auth", "free-user.json");
