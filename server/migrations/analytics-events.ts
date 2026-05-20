import pg from "pg";

export async function runAnalyticsEventsMigration(pool?: pg.Pool) {
  if (!pool) {
    const { getPool } = await import("../db");
    pool = getPool();
  }
  console.log("[Analytics Events Migration] Running analytics_events table migration...");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      event_name TEXT NOT NULL,
      user_id VARCHAR,
      session_id TEXT,
      platform TEXT,
      timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
      metadata JSONB DEFAULT '{}'::jsonb,
      ip_address TEXT,
      user_agent TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS event_name TEXT`);
  await pool.query(`ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS session_id TEXT`);
  await pool.query(`ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS timestamp TIMESTAMP DEFAULT NOW()`);
  await pool.query(`ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb`);
  await pool.query(`ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS ip_address TEXT`);
  await pool.query(`ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS user_agent TEXT`);
  console.log("[Analytics Events Migration] ✓ analytics_events table created/synced");

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events (event_name)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events (user_id)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events (created_at)`);
  console.log("[Analytics Events Migration] ✓ indexes created (event_name, user_id, created_at)");

  console.log("[Analytics Events Migration] Migration complete.");
}
