import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

/**
 * ------------------------------
 * CONSTANTS
 * ------------------------------
 */

const NURSING_DOMAINS = [
  "Cardiovascular", "Respiratory", "Neurological", "Gastrointestinal",
  "Renal", "Endocrine", "Hematology", "Musculoskeletal",
  "Maternity", "Pediatrics", "Mental Health", "Pharmacology",
  "Infection Control", "Safety", "Leadership"
];

/**
 * ------------------------------
 * HELPERS
 * ------------------------------
 */

function safeJsonParse(input: any, fallback: any = {}) {
  if (!input) return fallback;
  if (typeof input === "object") return input;
  try {
    return JSON.parse(input);
  } catch {
    return fallback;
  }
}

function calculatePlanLength(readinessLevel: string, examDate: Date | null): number {
  if (examDate) {
    const diffMs = examDate.getTime() - Date.now();
    const weeks = Math.max(1, Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000)));
    return Math.min(weeks, 12);
  }

  switch (readinessLevel) {
    case "Exam Ready": return 2;
    case "Moderate": return 4;
    case "Borderline": return 6;
    case "Very Low": return 8;
    default: return 4;
  }
}

/**
 * ------------------------------
 * SCHEDULE GENERATOR
 * ------------------------------
 */

function buildWeeklySchedule(
  weakTopics: string[],
  strongTopics: string[],
  weeks: number,
  minutesPerDay: number
) {
  const topicSet = new Set([
    ...weakTopics,
    ...NURSING_DOMAINS.filter(d => !strongTopics.includes(d))
  ]);

  const topics = Array.from(topicSet);
  const schedule: any[] = [];

  for (let w = 1; w <= weeks; w++) {
    const isReviewWeek = w === weeks;
    const days: any[] = [];

    for (let d = 1; d <= 7; d++) {
      let remaining = minutesPerDay;
      const tasks: any[] = [];

      if (isReviewWeek) {
        const reviewMinutes = Math.min(Math.floor(remaining * 0.5), remaining);
        tasks.push({
          type: "review",
          domain: "All Domains",
          title: `Comprehensive Review - Day ${d}`,
          minutes: reviewMinutes,
        });

        remaining -= reviewMinutes;

        if (remaining > 0) {
          tasks.push({
            type: "practice",
            domain: weakTopics[d % (weakTopics.length || 1)] || "General",
            title: "Practice Questions - Weak Areas",
            minutes: remaining,
          });
        }
      } else {
        const idx = ((w - 1) * 7 + (d - 1)) % topics.length;
        const topic = topics[idx];
        const isWeak = weakTopics.includes(topic);

        const lesson = Math.floor(remaining * 0.4);
        tasks.push({ type: "lesson", domain: topic, title: `Study: ${topic}`, minutes: lesson });
        remaining -= lesson;

        const practice = Math.floor(remaining * (isWeak ? 0.7 : 0.5));
        tasks.push({ type: "practice", domain: topic, title: `Practice: ${topic}`, minutes: practice });
        remaining -= practice;

        if (remaining > 0) {
          tasks.push({
            type: isWeak ? "remediation" : "flashcard",
            domain: topic,
            title: isWeak ? `Remediation: ${topic}` : `Flashcards: ${topic}`,
            minutes: remaining,
          });
        }
      }

      days.push({
        dayNum: d,
        title: isReviewWeek ? `Review Day ${d}` : `Week ${w} - Day ${d}`,
        focusDomains: [topics[((w - 1) * 7 + (d - 1)) % topics.length] || "General"],
        tasks,
      });
    }

    schedule.push({
      weekNum: w,
      title: isReviewWeek ? "Final Review Week" : `Week ${w}`,
      days,
    });
  }

  return schedule;
}

/**
 * ------------------------------
 * ROUTES
 * ------------------------------
 */

export function setupStudyPathRoutes(app: Express): void {

  /**
   * GENERATE PLAN
   */
  app.post("/api/study-plan/generate", async (req, res) => {
    try {
      const {
        userId,
        trialSessionId,
        examKey,
        region,
        examDate,
        minutesPerDay,
        stylePreference,
      } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      let weakTopics: string[] = [];
      let strongTopics: string[] = [];
      let readinessLevel = "Moderate";
      let tier = "rpn";
      let domainScores = {};
      let quizResults: any = null;

      /**
       * TRIAL DATA
       */
      if (trialSessionId) {
        const r = await pool.query("SELECT * FROM trial_sessions WHERE id = $1", [trialSessionId]);
        const session = r.rows[0];

        if (session) {
          const report = safeJsonParse(session.report);
          domainScores = safeJsonParse(session.domain_scores);

          weakTopics = report.weakDomains || [];
          strongTopics = report.strongDomains || [];
          readinessLevel = session.readiness_level || "Moderate";
          tier = session.tier || "rpn";

          quizResults = {
            source: "trial",
            score: report.percentage || 0,
            totalQuestions: report.totalQuestions || 0,
            domainScores,
          };
        }
      }

      /**
       * MOCK DATA
       */
      if (!trialSessionId && examKey) {
        const r = await pool.query(
          `SELECT report, tier FROM mock_exam_attempts
           WHERE user_id = $1 AND status = 'completed'
           ORDER BY completed_at DESC LIMIT 1`,
          [userId]
        );

        const mock = r.rows[0];

        if (mock) {
          const report = safeJsonParse(mock.report);

          weakTopics = report.weakDomains || [];
          strongTopics = report.strongDomains || [];
          readinessLevel = report.readinessLevel || "Moderate";
          domainScores = report.domainScores || {};
          tier = mock.tier || "rpn";

          quizResults = {
            source: "mock_exam",
            score: report.percentage || 0,
            totalQuestions: report.totalQuestions || 0,
            domainScores,
          };
        }
      }

      if (weakTopics.length === 0) {
        weakTopics = NURSING_DOMAINS.slice(0, 5);
      }

      const examDateParsed = examDate ? new Date(examDate) : null;
      const weeks = calculatePlanLength(readinessLevel, examDateParsed);
      const minutes = minutesPerDay || 30;

      const schedule = buildWeeklySchedule(weakTopics, strongTopics, weeks, minutes);

      /**
       * DEACTIVATE OLD
       */
      await pool.query(
        `UPDATE study_plans SET is_active=false WHERE user_id=$1`,
        [userId]
      );

      /**
       * INSERT PLAN
       */
      const planRes = await pool.query(
        `INSERT INTO study_plans (
          id, user_id, tier, timeframe_weeks, minutes_per_day,
          exam_date, exam_type, style_preference,
          domain_ratings, quiz_results, preferences,
          is_active, progress_percent, career_type
        ) VALUES (
          gen_random_uuid(), $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true,0,'nursing'
        ) RETURNING *`,
        [
          userId,
          tier,
          weeks,
          minutes,
          examDateParsed,
          examKey || null,
          stylePreference || "read_then_practice",
          JSON.stringify(domainScores),
          JSON.stringify(quizResults),
          JSON.stringify({ region, weakTopics, strongTopics, readinessLevel }),
        ]
      );

      const plan = planRes.rows[0];

      /**
       * INSERT DAYS + TASKS (optimized)
       */
      for (const week of schedule) {
        for (const day of week.days) {

          const dayRes = await pool.query(
            `INSERT INTO study_plan_days (id, study_plan_id, week_num, day_num, title, focus_domains)
             VALUES (gen_random_uuid(), $1,$2,$3,$4,$5) RETURNING id`,
            [plan.id, week.weekNum, day.dayNum, day.title, JSON.stringify(day.focusDomains)]
          );

          const dayId = dayRes.rows[0].id;

          const taskValues = day.tasks.map((t: any) =>
            `(gen_random_uuid(),'${dayId}','${t.type}','${t.domain}','${t.title}',${t.minutes},'todo')`
          ).join(",");

          await pool.query(
            `INSERT INTO study_plan_tasks (id, day_id, type, domain, title, minutes, status)
             VALUES ${taskValues}`
          );
        }
      }

      res.json({ ...plan, weeklySchedule: schedule });

    } catch (err: any) {
      console.error("[StudyPlan] Generate error:", err.message);
      res.status(500).json({ error: "Failed to generate study plan" });
    }
  });

  /**
   * GET PLAN
   */
  app.get("/api/study-plan/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      const r = await pool.query(
        `SELECT * FROM study_plans WHERE user_id=$1 AND is_active=true ORDER BY created_at DESC LIMIT 1`,
        [userId]
      );

      const plan = r.rows[0];
      if (!plan) return res.status(404).json({ error: "No active plan" });

      const days = await pool.query(
        `SELECT * FROM study_plan_days WHERE study_plan_id=$1 ORDER BY week_num, day_num`,
        [plan.id]
      );

      const dayIds = days.rows.map((d: any) => d.id);

      const tasks = dayIds.length
        ? await pool.query(`SELECT * FROM study_plan_tasks WHERE day_id = ANY($1)`, [dayIds])
        : { rows: [] };

      const tasksByDay: Record<string, any[]> = {};
      for (const t of tasks.rows) {
        if (!tasksByDay[t.day_id]) tasksByDay[t.day_id] = [];
        tasksByDay[t.day_id].push(t);
      }

      res.json({
        ...plan,
        weeklySchedule: days.rows.map((d: any) => ({
          ...d,
          tasks: tasksByDay[d.id] || [],
        })),
      });

    } catch (err: any) {
      console.error("[StudyPlan] Fetch error:", err.message);
      res.status(500).json({ error: "Failed to get plan" });
    }
  });

  /**
   * ADMIN ANALYTICS
   */
  app.get("/api/admin/study-plans/analytics", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const stats = await pool.query(`
      SELECT COUNT(*)::int total,
             COUNT(*) FILTER (WHERE is_active) active,
             ROUND(AVG(progress_percent),1) avg_progress
      FROM study_plans
    `);

    res.json(stats.rows[0]);
  });
}