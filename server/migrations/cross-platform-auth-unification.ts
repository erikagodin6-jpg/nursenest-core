import pg from "pg";

export async function runCrossPlatformAuthMigration(pool?: pg.Pool) {
  if (!pool) {
    const { getPool } = await import("../db");
    pool = getPool();
  }
  console.log("[Auth Migration] Running cross-platform auth unification migration...");

  await runStep(pool, "add user profile columns", async () => {
    await pool!.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name TEXT`);
    await pool!.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS exam_track TEXT`);
    await pool!.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT false`);

    const countryCheck = await pool!.query(`
      SELECT 1 FROM information_schema.columns 
      WHERE table_name='users' AND column_name='country'
    `);
    if (countryCheck.rows.length === 0) {
      await pool!.query(`ALTER TABLE users ADD COLUMN country TEXT`);
    }
  });

  await runStep(pool, "create password_reset_tokens table", async () => {
    await pool!.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    const tokenIndexExists = await pool!.query(`
      SELECT 1 FROM pg_indexes WHERE tablename='password_reset_tokens' AND indexname='idx_password_reset_tokens_user'
    `);
    if (tokenIndexExists.rows.length === 0) {
      await pool!.query(`CREATE INDEX idx_password_reset_tokens_user ON password_reset_tokens (user_id)`);
    }

    const expiryIndexExists = await pool!.query(`
      SELECT 1 FROM pg_indexes WHERE tablename='password_reset_tokens' AND indexname='idx_password_reset_tokens_expiry'
    `);
    if (expiryIndexExists.rows.length === 0) {
      await pool!.query(`CREATE INDEX idx_password_reset_tokens_expiry ON password_reset_tokens (expires_at) WHERE used_at IS NULL`);
    }
  });

  console.log("[Auth Migration] Cross-platform auth unification migration complete.");
}

async function runStep(pool: pg.Pool, name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`[Auth Migration] ✓ ${name}`);
  } catch (err: any) {
    console.error(`[Auth Migration] ✗ ${name}: ${err.message}`);
    throw err;
  }
}
