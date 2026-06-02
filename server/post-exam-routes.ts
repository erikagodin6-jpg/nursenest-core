import type { Express } from "express";
import { pool } from "./storage";
import { resolveAuthUser } from "./admin-auth";
import { createRateLimiter, abuseEscalationMiddleware } from "./abuse-protection";

export function registerPostExamRoutes(app: Express) {
  const postExamLimiter = createRateLimiter("content_browse");
  const recoveryPlanLimiter = createRateLimiter("ai_generation");

  app.use("/api/post-exam", abuseEscalationMiddleware);

  app.get("/api/post-exam/check", postExamLimiter, async (req, res) => {
    try {
      const user = await resolveAuthUser(req);
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const profileResult = await pool.query(
        `SELECT exam_date, exam_followup_completed, exam_result_status, new_exam_date
         FROM student_study_profiles WHERE user_id = $1`,
        [user.id]
      );

      if (profileResult.rows.length === 0) {
        return res.json({ shouldShow: false, reason: "no_profile" });
      }

      const profile = profileResult.rows[0];

      if (profile.exam_followup_completed && profile.exam_result_status !== "waiting") {
        return res.json({ shouldShow: false, reason: "already_completed", status: profile.exam_result_status });
      }

      const examDate = profile.new_exam_date || profile.exam_date;
      if (!examDate) {
        return res.json({ shouldShow: false, reason: "no_exam_date" });
      }

      const now = new Date();
      const examTime = new Date(examDate);
      const hoursSinceExam = (now.getTime() - examTime.getTime()) / (1000 * 60 * 60);

      if (hoursSinceExam < 24) {
        return res.json({ shouldShow: false, reason: "too_early", hoursUntilPrompt: Math.ceil(24 - hoursSinceExam) });
      }

      return res.json({ shouldShow: true, examDate: examDate });
    } catch (err: any) {
      console.error("[PostExam] Check error:", err.message);
      res.status(500).json({ error: "Failed to check post-exam status" });
    }
  });

  app.post("/api/post-exam/submit-result", async (req, res) => {
    try {
      const user = await resolveAuthUser(req);
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const { status, weakAreas, newExamDate } = req.body;
      const validStatuses = ["passed", "waiting", "didnt_pass", "postponed", "skipped"];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
      }

      const isCompleted = status !== "waiting";

      const existing = await pool.query(
        `SELECT id FROM student_study_profiles WHERE user_id = $1`,
        [user.id]
      );

      if (existing.rows.length === 0) {
        const insertParams: any[] = [user.id, status, isCompleted];
        let extraCols = "";
        let extraVals = "";
        if (status === "didnt_pass" && weakAreas && Array.isArray(weakAreas)) {
          insertParams.push(JSON.stringify(weakAreas));
          extraCols += ", exam_weak_areas";
          extraVals += `, $${insertParams.length}::jsonb`;
        }
        if (status === "postponed" && newExamDate) {
          insertParams.push(new Date(newExamDate));
          extraCols += ", new_exam_date";
          extraVals += `, $${insertParams.length}`;
        }
        await pool.query(
          `INSERT INTO student_study_profiles (id, user_id, exam_result_status, exam_followup_completed, exam_result_date, updated_at, created_at${extraCols})
           VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW(), NOW()${extraVals})`,
          insertParams
        );
      } else {
        const updates: string[] = [
          `exam_followup_completed = $2`,
          `exam_result_status = $3`,
          "exam_result_date = NOW()",
          "updated_at = NOW()",
        ];
        const params: any[] = [user.id, isCompleted, status];

        if (status === "didnt_pass" && weakAreas && Array.isArray(weakAreas)) {
          params.push(JSON.stringify(weakAreas));
          updates.push(`exam_weak_areas = $${params.length}::jsonb`);
        }

        if (status === "postponed" && newExamDate) {
          params.push(new Date(newExamDate));
          updates.push(`new_exam_date = $${params.length}`);
        }

        await pool.query(
          `UPDATE student_study_profiles SET ${updates.join(", ")} WHERE user_id = $1`,
          params
        );
      }

      if (status === "postponed" && newExamDate) {
        await pool.query(
          `UPDATE user_exam_profile SET exam_date = $1, updated_at = NOW() WHERE user_id = $2`,
          [new Date(newExamDate), user.id]
        );
      }

      res.json({ ok: true, status });
    } catch (err: any) {
      console.error("[PostExam] Submit result error:", err.message);
      res.status(500).json({ error: "Failed to submit exam result" });
    }
  });

  app.get("/api/post-exam/status", async (req, res) => {
    try {
      const user = await resolveAuthUser(req);
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const profileResult = await pool.query(
        `SELECT exam_date, exam_followup_completed, exam_result_status, exam_weak_areas,
                exam_result_date, post_exam_offer_shown, new_exam_date
         FROM student_study_profiles WHERE user_id = $1`,
        [user.id]
      );

      if (profileResult.rows.length === 0) {
        return res.json({ hasResult: false });
      }

      const profile = profileResult.rows[0];

      if (!profile.exam_followup_completed || !profile.exam_result_status) {
        return res.json({ hasResult: false });
      }

      const result: any = {
        hasResult: true,
        status: profile.exam_result_status,
        resultDate: profile.exam_result_date,
        weakAreas: profile.exam_weak_areas || [],
        offerShown: profile.post_exam_offer_shown,
        newExamDate: profile.new_exam_date,
        examDate: profile.exam_date,
      };

      if (profile.exam_result_status === "didnt_pass") {
        const perfResult = await pool.query(
          `SELECT top_weak_domains, weakness_vector, readiness_score, projected_pass_probability
           FROM user_performance_summary WHERE user_id = $1
           ORDER BY updated_at DESC LIMIT 1`,
          [user.id]
        );
        if (perfResult.rows.length > 0) {
          const perf = perfResult.rows[0];
          result.readinessData = {
            topWeakDomains: perf.top_weak_domains || [],
            weaknessVector: perf.weakness_vector || {},
            readinessScore: perf.readiness_score || 0,
            passProbability: perf.projected_pass_probability || 0,
          };
        }
      }

      res.json(result);
    } catch (err: any) {
      console.error("[PostExam] Status error:", err.message);
      res.status(500).json({ error: "Failed to get post-exam status" });
    }
  });

  app.post("/api/post-exam/mark-offer-shown", async (req, res) => {
    try {
      const user = await resolveAuthUser(req);
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      await pool.query(
        `UPDATE student_study_profiles SET post_exam_offer_shown = true, updated_at = NOW()
         WHERE user_id = $1`,
        [user.id]
      );

      res.json({ ok: true });
    } catch (err: any) {
      console.error("[PostExam] Mark offer shown error:", err.message);
      res.status(500).json({ error: "Failed to mark offer shown" });
    }
  });

  app.post("/api/post-exam/update-exam-date", async (req, res) => {
    try {
      const user = await resolveAuthUser(req);
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const { newExamDate } = req.body;
      if (!newExamDate) {
        return res.status(400).json({ error: "newExamDate is required" });
      }

      const parsedDate = new Date(newExamDate);
      if (isNaN(parsedDate.getTime()) || parsedDate <= new Date()) {
        return res.status(400).json({ error: "Exam date must be in the future" });
      }

      const existing = await pool.query(
        `SELECT id FROM student_study_profiles WHERE user_id = $1`,
        [user.id]
      );

      if (existing.rows.length === 0) {
        await pool.query(
          `INSERT INTO student_study_profiles (id, user_id, new_exam_date, exam_date, exam_result_status, exam_followup_completed, updated_at, created_at)
           VALUES (gen_random_uuid(), $1, $2, $2, 'postponed', true, NOW(), NOW())`,
          [user.id, parsedDate]
        );
      } else {
        await pool.query(
          `UPDATE student_study_profiles
           SET new_exam_date = $1, exam_date = $1, exam_result_status = 'postponed',
               exam_followup_completed = true, updated_at = NOW()
           WHERE user_id = $2`,
          [parsedDate, user.id]
        );
      }

      await pool.query(
        `UPDATE user_exam_profile SET exam_date = $1, updated_at = NOW() WHERE user_id = $2`,
        [parsedDate, user.id]
      );

      res.json({ ok: true, newExamDate: parsedDate });
    } catch (err: any) {
      console.error("[PostExam] Update exam date error:", err.message);
      res.status(500).json({ error: "Failed to update exam date" });
    }
  });

  app.post("/api/post-exam/generate-recovery-plan", recoveryPlanLimiter, async (req, res) => {
    try {
      const user = await resolveAuthUser(req);
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const { weakAreas, minutesPerDay } = req.body;
      if (!weakAreas || !Array.isArray(weakAreas) || weakAreas.length === 0) {
        return res.status(400).json({ error: "weakAreas array is required" });
      }

      await pool.query(
        `UPDATE student_study_profiles SET exam_weak_areas = $1::jsonb, updated_at = NOW()
         WHERE user_id = $2`,
        [JSON.stringify(weakAreas), user.id]
      );

      const perfResult = await pool.query(
        `SELECT top_weak_domains, strengths_vector FROM user_performance_summary
         WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1`,
        [user.id]
      );

      const strongTopics: string[] = [];
      if (perfResult.rows.length > 0) {
        const strengths = perfResult.rows[0].strengths_vector;
        if (strengths && typeof strengths === "object") {
          Object.entries(strengths).forEach(([k, v]) => {
            if (typeof v === "number" && v > 0.7) strongTopics.push(k);
          });
        }
      }

      const NURSING_DOMAINS = [
        "Cardiovascular", "Respiratory", "Neurological", "Gastrointestinal",
        "Renal", "Endocrine", "Hematology", "Musculoskeletal",
        "Maternity", "Pediatrics", "Mental Health", "Pharmacology",
        "Infection Control", "Safety", "Leadership"
      ];

      const planLengthWeeks = 6;
      const effectiveMinutes = minutesPerDay || 30;
      const topicSet = new Set([...weakAreas, ...NURSING_DOMAINS.filter(d => !strongTopics.includes(d))]);
      const allTopics = Array.from(topicSet);
      const weeks: any[] = [];

      for (let w = 1; w <= planLengthWeeks; w++) {
        const isReviewWeek = w === planLengthWeeks;
        const weekDays: any[] = [];

        for (let d = 1; d <= 7; d++) {
          const tasks: any[] = [];
          let remainingMinutes = effectiveMinutes;

          if (isReviewWeek) {
            tasks.push({
              type: "review",
              domain: "All Domains",
              title: `Comprehensive Review - Day ${d}`,
              minutes: Math.min(Math.floor(remainingMinutes * 0.5), remainingMinutes),
            });
            remainingMinutes -= tasks[0].minutes;
            if (remainingMinutes > 0) {
              tasks.push({
                type: "practice",
                domain: weakAreas[d % weakAreas.length] || "General",
                title: "Practice Questions - Weak Areas",
                minutes: remainingMinutes,
              });
            }
          } else {
            const topicIndex = ((w - 1) * 7 + (d - 1)) % allTopics.length;
            const primaryTopic = allTopics[topicIndex];
            const isWeakTopic = weakAreas.includes(primaryTopic);

            const lessonMinutes = Math.floor(remainingMinutes * 0.4);
            tasks.push({
              type: "lesson",
              domain: primaryTopic,
              title: `Study: ${primaryTopic}`,
              minutes: lessonMinutes,
            });
            remainingMinutes -= lessonMinutes;

            const practiceMinutes = Math.floor(remainingMinutes * (isWeakTopic ? 0.7 : 0.5));
            tasks.push({
              type: "practice",
              domain: primaryTopic,
              title: `Practice Questions: ${primaryTopic}`,
              minutes: practiceMinutes,
            });
            remainingMinutes -= practiceMinutes;

            if (remainingMinutes > 0) {
              tasks.push({
                type: isWeakTopic ? "remediation" : "flashcard",
                domain: primaryTopic,
                title: isWeakTopic ? `Remediation: ${primaryTopic}` : `Flashcard Review: ${primaryTopic}`,
                minutes: remainingMinutes,
              });
            }
          }

          weekDays.push({
            dayNum: d,
            title: isReviewWeek ? `Review Day ${d}` : `Week ${w} - Day ${d}`,
            focusDomains: [allTopics[((w - 1) * 7 + (d - 1)) % allTopics.length] || "General"],
            tasks,
          });
        }

        weeks.push({
          weekNum: w,
          title: isReviewWeek ? "Final Review Week" : `Week ${w}: Focus Recovery`,
          days: weekDays,
        });
      }

      await pool.query(
        `UPDATE study_plans SET is_active = false, updated_at = NOW()
         WHERE user_id = $1 AND is_active = true`,
        [user.id]
      );

      const planResult = await pool.query(
        `INSERT INTO study_plans (
          id, user_id, tier, timeframe_weeks, minutes_per_day,
          style_preference, preferences, is_active, progress_percent, career_type, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, 'rpn', $2, $3,
          'recovery', $4, true, 0, 'nursing', NOW(), NOW()
        ) RETURNING *`,
        [
          user.id,
          planLengthWeeks,
          effectiveMinutes,
          JSON.stringify({
            type: "recovery",
            weakTopics: weakAreas,
            strongTopics,
            readinessLevel: "Recovery",
          }),
        ]
      );

      const plan = planResult.rows[0];

      for (const week of weeks) {
        for (const day of week.days) {
          const dayResult = await pool.query(
            `INSERT INTO study_plan_days (id, study_plan_id, week_num, day_num, title, focus_domains)
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING id`,
            [plan.id, week.weekNum, day.dayNum, day.title, JSON.stringify(day.focusDomains)]
          );
          const dayId = dayResult.rows[0].id;

          for (const task of day.tasks) {
            await pool.query(
              `INSERT INTO study_plan_tasks (id, day_id, type, domain, title, minutes, status)
               VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'todo')`,
              [dayId, task.type, task.domain, task.title, task.minutes]
            );
          }
        }
      }

      res.json({
        ok: true,
        planId: plan.id,
        weakAreas,
        planLengthWeeks,
        weeklySchedule: weeks,
      });
    } catch (err: any) {
      console.error("[PostExam] Generate recovery plan error:", err.message);
      res.status(500).json({ error: "Failed to generate recovery plan" });
    }
  });
}
