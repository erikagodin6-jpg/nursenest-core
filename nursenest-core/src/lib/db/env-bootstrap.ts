/**
 * Import this module before constructing `PrismaClient` (directly or via `@/lib/db`).
 *
 * Production (DigitalOcean, etc.): **`DATABASE_URL` wins** when set — use it for the managed Postgres URI.
 * If `DATABASE_URL` is unset and `PROD_DATABASE_URL` is set, copy prod → `DATABASE_URL` (legacy alias).
 * `schema.prisma` references `env("DATABASE_URL")` only.
 */
export type DatabaseUrlSource = "prod_override" | "database_url" | "missing";

export let databaseUrlSource: DatabaseUrlSource = "missing";

export function applyDatabaseUrlFromEnv(): void {
  const direct = process.env.DATABASE_URL?.trim();
  const prod = process.env.PROD_DATABASE_URL?.trim();

  if (process.env.NODE_ENV === "production") {
    if (direct && prod && direct !== prod) {
      console.error(
        "[nursenest-core] DATABASE_URL and PROD_DATABASE_URL differ; using DATABASE_URL. Remove or align PROD_DATABASE_URL.",
      );
    }
    if (direct) {
      databaseUrlSource = "database_url";
      return;
    }
    if (prod) {
      process.env.DATABASE_URL = prod;
      databaseUrlSource = "prod_override";
      return;
    }
    databaseUrlSource = "missing";
    return;
  }

  databaseUrlSource = direct ? "database_url" : "missing";
}

applyDatabaseUrlFromEnv();
