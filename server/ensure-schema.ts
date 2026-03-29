import pg from "pg";

export async function ensureSchemaSync(pool: pg.Pool): Promise<void> {
  const client = await pool.connect();

  try {
    console.log("[SchemaSync] Starting safe schema check");

    /* =========================
       CRITICAL CORE TABLES ONLY
    ========================= */

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id varchar PRIMARY KEY,
        email text,
        tier text DEFAULT 'free',
        created_at timestamp DEFAULT now()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS exam_questions (
        id varchar PRIMARY KEY,
        stem text NOT NULL,
        options jsonb NOT NULL,
        correct_answer integer NOT NULL,
        status text DEFAULT 'draft',
        tier text,
        difficulty integer DEFAULT 3,
        created_at timestamp DEFAULT now()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS tutor_conversations (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        context_type TEXT DEFAULT 'general',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS tutor_messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER,
        role TEXT,
        content TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id varchar PRIMARY KEY,
        user_id varchar,
        tier text DEFAULT 'free',
        status text DEFAULT 'active',
        created_at timestamp DEFAULT now()
      )
    `);

    /* =========================
       SAFE INDEXES (NON-BLOCKING)
    ========================= */

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_exam_questions_status
      ON exam_questions(status)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_exam_questions_tier
      ON exam_questions(tier)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tutor_messages_conv
      ON tutor_messages(conversation_id)
    `);

    console.log("[SchemaSync] Core schema ensured");

  } catch (err: any) {
    console.error("[SchemaSync] FAILED:", err.message);
    throw err;
  } finally {
    client.release();
  }
}