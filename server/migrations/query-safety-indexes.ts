import pg from "pg";

export async function runQuerySafetyIndexMigration(pool?: pg.Pool) {
  if (!pool) {
    const { getPool } = await import("../db");
    pool = getPool();
  }
  console.log("[Query Safety Indexes] Adding performance indexes...");

  const indexes = [
    { table: "exam_questions", ddl: "CREATE INDEX IF NOT EXISTS idx_exam_questions_status_publish_at ON exam_questions (status, publish_at) WHERE status = 'scheduled'" },
    { table: "exam_questions", ddl: "CREATE INDEX IF NOT EXISTS idx_exam_questions_tier_exam ON exam_questions (tier, exam)" },
    { table: "question_bank", ddl: "CREATE INDEX IF NOT EXISTS idx_question_bank_country_exam ON question_bank (country, exam_type)" },
    { table: "imaging_questions", ddl: "CREATE INDEX IF NOT EXISTS idx_imaging_questions_country_exam ON imaging_questions (country, exam)" },
    { table: "mlt_lab_image_links", ddl: "CREATE INDEX IF NOT EXISTS idx_mlt_lab_image_links_target ON mlt_lab_image_links (linked_type, linked_id)" },
    { table: "question_bank_results", ddl: "CREATE INDEX IF NOT EXISTS idx_question_bank_results_user_id ON question_bank_results (user_id)" },
    { table: "test_results", ddl: "CREATE INDEX IF NOT EXISTS idx_test_results_user_completed ON test_results (user_id, completed_at DESC)" },
    { table: "user_progress", ddl: "CREATE INDEX IF NOT EXISTS idx_user_progress_user_accessed ON user_progress (user_id, last_accessed DESC)" },
    { table: "content_items", ddl: "CREATE INDEX IF NOT EXISTS idx_content_items_status_published ON content_items (status, published_at DESC) WHERE status = 'published'" },
    { table: "social_posts", ddl: "CREATE INDEX IF NOT EXISTS idx_social_posts_status_scheduled ON social_posts (status, scheduled_at) WHERE status = 'scheduled'" },
    { table: "page_views", ddl: "CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views (created_at)" },
    { table: "friend_connections", ddl: "CREATE INDEX IF NOT EXISTS idx_friend_connections_users ON friend_connections (user_a_id, user_b_id)" },
    { table: "case_studies", ddl: "CREATE INDEX IF NOT EXISTS idx_case_studies_tier_status ON case_studies (tier, status)" },
    { table: "mlt_lab_images", ddl: "CREATE INDEX IF NOT EXISTS idx_mlt_lab_images_discipline ON mlt_lab_images (discipline, status)" },
    { table: "exam_questions", ddl: "CREATE INDEX IF NOT EXISTS idx_exam_questions_tier_status_diff ON exam_questions (tier, status, difficulty) WHERE status = 'published'" },
    { table: "exam_questions", ddl: "CREATE INDEX IF NOT EXISTS idx_exam_questions_region_status ON exam_questions (region_scope, status) WHERE status = 'published'" },
    { table: "exam_attempts", ddl: "CREATE INDEX IF NOT EXISTS idx_exam_attempts_user_id ON exam_attempts (user_id)" },
    { table: "mock_exam_attempts", ddl: "CREATE INDEX IF NOT EXISTS idx_mock_exam_attempts_user_status ON mock_exam_attempts (user_id, status)" },
    { table: "analytics_events", ddl: "CREATE INDEX IF NOT EXISTS idx_analytics_events_name_created ON analytics_events (event_name, created_at)" },
  ];

  for (const { table, ddl } of indexes) {
    try {
      const tableCheck = await pool.query(
        "SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1",
        [table]
      );
      if (tableCheck.rows.length === 0) continue;
      await pool.query(ddl);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("already exists")) continue;
      console.warn(`[Query Safety Indexes] Warning creating index on ${table}: ${msg}`);
    }
  }

  console.log("[Query Safety Indexes] Performance indexes applied");
}
