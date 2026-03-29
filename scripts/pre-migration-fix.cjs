const { Pool } = require('pg');

async function run() {
  if (!process.env.DATABASE_URL) {
    console.log('[pre-migration] No DATABASE_URL, skipping');
    return;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const nullCheck = await pool.query('SELECT COUNT(*)::int AS cnt FROM users WHERE email IS NULL');
    const nullCount = nullCheck.rows[0].cnt;
    if (nullCount > 0) {
      console.log(`[pre-migration] Found ${nullCount} users with NULL email, backfilling...`);
      await pool.query(`
        UPDATE users SET email = 
          CASE 
            WHEN username ~ '^[^@]+@[^@]+\\.[^@]+$' THEN LOWER(TRIM(username))
            ELSE 'user-' || id || '@placeholder.local'
          END
        WHERE email IS NULL
      `);
      console.log(`[pre-migration] Backfilled ${nullCount} NULL emails`);
    }

    const emptyCheck = await pool.query("SELECT COUNT(*)::int AS cnt FROM users WHERE TRIM(email) = ''");
    const emptyCount = emptyCheck.rows[0].cnt;
    if (emptyCount > 0) {
      console.log(`[pre-migration] Found ${emptyCount} users with empty email, backfilling...`);
      await pool.query("UPDATE users SET email = 'user-' || id || '@placeholder.local' WHERE TRIM(email) = ''");
      console.log(`[pre-migration] Backfilled ${emptyCount} empty emails`);
    }

    const dupeCheck = await pool.query("SELECT LOWER(email) AS e, COUNT(*)::int AS c FROM users WHERE email IS NOT NULL GROUP BY LOWER(email) HAVING COUNT(*) > 1");
    for (const row of dupeCheck.rows) {
      const ids = await pool.query('SELECT id FROM users WHERE LOWER(email) = $1 ORDER BY created_at ASC NULLS FIRST', [row.e]);
      for (let i = 1; i < ids.rows.length; i++) {
        const newEmail = `dedup-${ids.rows[i].id}@placeholder.local`;
        await pool.query('UPDATE users SET email = $1 WHERE id = $2', [newEmail, ids.rows[i].id]);
        console.log(`[pre-migration] Deduplicated: user ${ids.rows[i].id}`);
      }
    }

    const finalNulls = await pool.query('SELECT COUNT(*)::int AS cnt FROM users WHERE email IS NULL');
    console.log(`[pre-migration] Complete. Remaining NULL emails: ${finalNulls.rows[0].cnt}`);
  } catch (err) {
    console.error(`[pre-migration] Warning: ${err.message}`);
  } finally {
    await pool.end();
  }
}

run();
