/**
 * Mutable label for which env var supplied `DATABASE_URL` after bootstrap.
 * Updated only from `env-bootstrap.ts` (Node / Prisma startup).
 *
 * Kept **without** `import "server-only"` so modules like `database-env.ts` can read
 * it for logging without transitively importing `env-bootstrap` (which must stay
 * server-only and run before Prisma).
 */
export type DatabaseUrlSource = "database_url" | "missing";

export const databaseUrlSource: { value: DatabaseUrlSource } = { value: "missing" };
