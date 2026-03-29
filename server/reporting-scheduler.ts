import { pool } from "./storage";
import { emitStructuredLog } from "./log-sink";
import { tryGoogleSearchConsole, getInternalSearchMetrics } from "./search-performance-routes";
import { tryAcquireSchedulerLease, SCHEDULER_LOCK_NAMES } from "./scheduler-db-lock";

let weeklyReportTimer: NodeJS.Timeout | null = null;
let searchSnapshotTimer: NodeJS.Timeout | null = null;
let weeklyReportRunning = false;
let searchSnapshotRunning = false;

function getWeekBounds(weeksAgo: number = 0): { start: Date; end: Date } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset - weeksAgo * 7);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday, end: sunday };
}

async function computeWeeklyContentCounts(start: Date, end: Date) {
  const startStr = start.toISOString();
  const endStr = end.toISOString();

  const [lessons, blogs, flashcards, examQuestions, seoArticles] = await Promise.all([
    pool.query(
      `SELECT COUNT(*)::int as count FROM content_items WHERE type = 'lesson' AND created_at >= $1 AND created_at <= $2`,
      [startStr, endStr]
    ).catch(() => ({ rows: [{ count: 0 }] })),
    pool.query(
      `SELECT COUNT(*)::int as count FROM content_items WHERE type = 'blog' AND created_at >= $1 AND created_at <= $2`,
      [startStr, endStr]
    ).catch(() => ({ rows: [{ count: 0 }] })),
    pool.query(
      `SELECT COUNT(*)::int as count FROM flashcard_bank WHERE created_at >= $1 AND created_at <= $2`,
      [startStr, endStr]
    ).catch(() => ({ rows: [{ count: 0 }] })),
    pool.query(
      `SELECT COUNT(*)::int as count FROM exam_questions WHERE created_at >= $1 AND created_at <= $2`,
      [startStr, endStr]
    ).catch(() => ({ rows: [{ count: 0 }] })),
    pool.query(
      `SELECT COUNT(*)::int as count FROM seo_articles WHERE created_at >= $1 AND created_at <= $2`,
      [startStr, endStr]
    ).catch(() => ({ rows: [{ count: 0 }] })),
  ]);

  return {
    lessonsCreated: Number(lessons.rows[0]?.count || 0),
    blogPostsCreated: Number(blogs.rows[0]?.count || 0),
    flashcardsCreated: Number(flashcards.rows[0]?.count || 0),
    examQuestionsCreated: Number(examQuestions.rows[0]?.count || 0),
    seoArticlesCreated: Number(seoArticles.rows[0]?.count || 0),
  };
}

async function generateWeeklyReport() {
  if (weeklyReportRunning) {
    emitStructuredLog(
      {
        level: "warn",
        type: "reporting_scheduler_skip",
        job: "weekly_report",
        reason: "overlapping_run",
      },
      "warn",
    );
    return;
  }
  weeklyReportRunning = true;
  const startedAt = Date.now();
  emitStructuredLog({
    level: "info",
    type: "reporting_scheduler_start",
    job: "weekly_report",
  });
  try {
    const lease = await tryAcquireSchedulerLease(SCHEDULER_LOCK_NAMES.REPORTING_WEEKLY, 900);
    if (!lease) {
      emitStructuredLog({
        level: "info",
        type: "reporting_scheduler_skip",
        job: "weekly_report",
        reason: "db_lease_held",
        durationMs: Date.now() - startedAt,
      });
      return;
    }

    const prevWeekBounds = getWeekBounds(1);

    const existing = await pool.query(
      `SELECT id FROM content_weekly_reports WHERE week_start = $1`,
      [prevWeekBounds.start.toISOString()]
    ).catch(() => ({ rows: [] }));

    if (existing.rows.length > 0) {
      emitStructuredLog({
        level: "info",
        type: "reporting_scheduler_skip",
        job: "weekly_report",
        reason: "already_exists",
        durationMs: Date.now() - startedAt,
      });
      return;
    }

    const counts = await computeWeeklyContentCounts(prevWeekBounds.start, prevWeekBounds.end);
    const total = counts.lessonsCreated + counts.blogPostsCreated +
      counts.flashcardsCreated + counts.examQuestionsCreated + counts.seoArticlesCreated;

    const twoWeeksAgo = getWeekBounds(2);
    const prevCounts = await computeWeeklyContentCounts(twoWeeksAgo.start, twoWeeksAgo.end);
    const prevTotal = prevCounts.lessonsCreated + prevCounts.blogPostsCreated +
      prevCounts.flashcardsCreated + prevCounts.examQuestionsCreated + prevCounts.seoArticlesCreated;

    const wowChange = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : (total > 0 ? 100 : 0);

    await pool.query(
      `INSERT INTO content_weekly_reports
       (id, week_start, week_end, lessons_created, blog_posts_created, flashcards_created,
        exam_questions_created, seo_articles_created, total_content_created,
        previous_week_total, week_over_week_change, breakdown_json, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())`,
      [
        prevWeekBounds.start.toISOString(), prevWeekBounds.end.toISOString(),
        counts.lessonsCreated, counts.blogPostsCreated, counts.flashcardsCreated,
        counts.examQuestionsCreated, counts.seoArticlesCreated, total,
        prevTotal, Math.round(wowChange * 10) / 10,
        JSON.stringify({ ...counts, previousWeek: prevCounts }),
      ]
    );

    emitStructuredLog({
      level: "info",
      type: "reporting_scheduler_finish",
      job: "weekly_report",
      durationMs: Date.now() - startedAt,
      totalContent: total,
      msg: `Weekly report generated: ${total} content items`,
    });
  } catch (error) {
    emitStructuredLog(
      {
        level: "error",
        type: "reporting_scheduler_failure",
        job: "weekly_report",
        durationMs: Date.now() - startedAt,
        msg: error instanceof Error ? error.message : String(error),
      },
      "error",
    );
  } finally {
    weeklyReportRunning = false;
  }
}

async function captureSearchSnapshot() {
  if (searchSnapshotRunning) {
    emitStructuredLog(
      {
        level: "warn",
        type: "reporting_scheduler_skip",
        job: "search_snapshot",
        reason: "overlapping_run",
      },
      "warn",
    );
    return;
  }
  searchSnapshotRunning = true;
  const startedAt = Date.now();
  emitStructuredLog({
    level: "info",
    type: "reporting_scheduler_start",
    job: "search_snapshot",
  });
  try {
    const lease = await tryAcquireSchedulerLease(SCHEDULER_LOCK_NAMES.REPORTING_SEARCH_SNAPSHOT, 900);
    if (!lease) {
      emitStructuredLog({
        level: "info",
        type: "reporting_scheduler_skip",
        job: "search_snapshot",
        reason: "db_lease_held",
        durationMs: Date.now() - startedAt,
      });
      return;
    }

    let metrics = await tryGoogleSearchConsole();
    if (!metrics) {
      metrics = await getInternalSearchMetrics();
    }

    const indexedPages = metrics.indexedPages || 0;

    await pool.query(
      `INSERT INTO search_performance_snapshots
       (id, snapshot_date, indexed_pages, total_impressions, total_clicks,
        average_ctr, average_position, top_keywords_json, top_pages_json, data_source, created_at)
       VALUES (gen_random_uuid(), NOW(), $1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [
        indexedPages,
        metrics.totalImpressions || 0,
        metrics.totalClicks || 0,
        metrics.averageCtr || 0,
        metrics.averagePosition || 0,
        JSON.stringify(metrics.topKeywords || []),
        JSON.stringify(metrics.topPages || []),
        metrics.dataSource === "google_search_console" ? "gsc" : "internal",
      ]
    );

    emitStructuredLog({
      level: "info",
      type: "reporting_scheduler_finish",
      job: "search_snapshot",
      durationMs: Date.now() - startedAt,
      indexedPages,
      provider: metrics.dataSource === "google_search_console" ? "google_search_console" : "internal",
      dataSource: metrics.dataSource,
      msg: `Search snapshot captured (${metrics.dataSource}): ${indexedPages} indexed pages`,
    });
  } catch (error) {
    emitStructuredLog(
      {
        level: "error",
        type: "reporting_scheduler_failure",
        job: "search_snapshot",
        durationMs: Date.now() - startedAt,
        msg: error instanceof Error ? error.message : String(error),
      },
      "error",
    );
  } finally {
    searchSnapshotRunning = false;
  }
}

function getNextMondayMorning(): Date {
  const now = new Date();
  const toronto = new Date(now.toLocaleString("en-US", { timeZone: "America/Toronto" }));
  const target = new Date(toronto);
  const dayOfWeek = target.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 7 : 8 - dayOfWeek;
  target.setDate(target.getDate() + daysUntilMonday);
  target.setHours(3, 0, 0, 0);

  const diffMs = target.getTime() - toronto.getTime();
  return new Date(now.getTime() + diffMs);
}

function getNextSnapshotTime(): Date {
  const now = new Date();
  const toronto = new Date(now.toLocaleString("en-US", { timeZone: "America/Toronto" }));
  const target = new Date(toronto);
  target.setHours(4, 0, 0, 0);

  if (target <= toronto) {
    target.setDate(target.getDate() + 1);
  }

  const diffMs = target.getTime() - toronto.getTime();
  return new Date(now.getTime() + diffMs);
}

function scheduleWeeklyReport() {
  const nextRun = getNextMondayMorning();
  const delayMs = nextRun.getTime() - Date.now();

  emitStructuredLog({
    level: "info",
    type: "reporting_scheduler_scheduled",
    job: "weekly_report",
    msg: `Next weekly report at ${nextRun.toISOString()} (${Math.round(delayMs / 3600000)}h from now)`,
    nextRunAt: nextRun.toISOString(),
  });

  weeklyReportTimer = setTimeout(async () => {
    await generateWeeklyReport();
    scheduleWeeklyReport();
  }, delayMs);
}

function scheduleDailySnapshot() {
  const nextRun = getNextSnapshotTime();
  const delayMs = nextRun.getTime() - Date.now();

  emitStructuredLog({
    level: "info",
    type: "reporting_scheduler_scheduled",
    job: "search_snapshot",
    msg: `Next search snapshot at ${nextRun.toISOString()} (${Math.round(delayMs / 3600000)}h from now)`,
    nextRunAt: nextRun.toISOString(),
  });

  searchSnapshotTimer = setTimeout(async () => {
    await captureSearchSnapshot();
    scheduleDailySnapshot();
  }, delayMs);
}

export function startReportingScheduler() {
  emitStructuredLog({
    level: "info",
    type: "reporting_scheduler_init",
    job: "reporting_scheduler",
    msg: "Reporting scheduler initialized",
  });
  scheduleWeeklyReport();
  scheduleDailySnapshot();
}

export function stopReportingScheduler() {
  if (weeklyReportTimer) {
    clearTimeout(weeklyReportTimer);
    weeklyReportTimer = null;
  }
  if (searchSnapshotTimer) {
    clearTimeout(searchSnapshotTimer);
    searchSnapshotTimer = null;
  }
  emitStructuredLog({
    level: "info",
    type: "reporting_scheduler_stop",
    job: "reporting_scheduler",
    msg: "Scheduler stopped",
  });
}
