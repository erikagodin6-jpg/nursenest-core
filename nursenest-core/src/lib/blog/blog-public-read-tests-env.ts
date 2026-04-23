/**
 * Ensures `withDatabaseFallbackTimeout` runs the query callback in blog read-path tests.
 * No real Postgres is required when Prisma methods are stubbed; URL only satisfies `isDatabaseUrlConfigured()`.
 */
if (!process.env.DATABASE_URL?.trim()) {
  process.env.DATABASE_URL = "postgresql://127.0.0.1:1/nn_blog_public_read_tests";
}
