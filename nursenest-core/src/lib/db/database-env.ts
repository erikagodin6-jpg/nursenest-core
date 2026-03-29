import { databaseUrlSource } from "@/lib/db/env-bootstrap";

/**
 * Masked logging for operators. Effective URL follows `env-bootstrap` (production may copy
 * `PROD_DATABASE_URL` → `DATABASE_URL`).
 */

export function maskDatabaseUrl(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname;
    const port = u.port ? `:${u.port}` : "";
    const db = u.pathname.replace(/^\//, "") || "(no database name)";
    const search = u.search || "";
    return `${u.protocol}//***:***@${host}${port}/${db}${search}`;
  } catch {
    return "(unparseable connection string)";
  }
}

/** Log once per Node process in production so platform log drains show which env wins. */
let logged = false;
export function logDatabaseEnvOnce(): void {
  if (logged) return;
  logged = true;
  if (process.env.NODE_ENV !== "production") return;

  const db = process.env.DATABASE_URL?.trim();
  const prod = process.env.PROD_DATABASE_URL?.trim();

  console.error(
    `[nursenest-core] prisma: effectiveConnection masked=${db ? maskDatabaseUrl(db) : "(MISSING)"} source=${databaseUrlSource} PROD_DATABASE_URL=${prod ? "set" : "unset"}`,
  );

  if (prod && db && prod !== db) {
    console.error(
      "[nursenest-core] prisma: WARNING DATABASE_URL and PROD_DATABASE_URL differ — DATABASE_URL is used; unset PROD_DATABASE_URL.",
    );
  }
}
