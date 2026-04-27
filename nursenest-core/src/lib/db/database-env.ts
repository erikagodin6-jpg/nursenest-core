import "server-only";

import { databaseUrlSource } from "@/lib/db/env-bootstrap";
import { maskDatabaseUrl } from "@/lib/env/mask-database-url";

export { maskDatabaseUrl } from "@/lib/env/mask-database-url";

/** Log once per Node process in production so platform log drains show which env wins. */
let logged = false;
export function logDatabaseEnvOnce(): void {
  if (logged) return;
  logged = true;
  if (process.env.NODE_ENV !== "production") return;

  const db = process.env.DATABASE_URL?.trim();

  console.error(
    `[nursenest-core] prisma: effectiveConnection masked=${db ? maskDatabaseUrl(db) : "(MISSING)"} source=${databaseUrlSource}`,
  );

  if (process.env.PROD_DATABASE_URL?.trim()) {
    console.error(
      "[nursenest-core] prisma: PROD_DATABASE_URL is set but ignored — remove it and use DATABASE_URL only.",
    );
  }
}
