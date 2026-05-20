import type { Express } from "express";
import { resolveAuthUser } from "./admin-auth";
import {
  ensureExamPlannerTable,
  getOrCreatePlannerSettings,
  updatePlannerSettings,
  generateFullStudyPlan,
  getStudyPhase,
} from "./exam-planner-engine";

const VALID_INTENSITIES = ["light", "balanced", "intensive"];
const VALID_DATE_TYPES = ["booked", "target"];

export function registerExamPlannerRoutes(app: Express) {
  ensureExamPlannerTable().catch(err => console.error("Exam planner table error:", err));

  app.get("/api/exam-planner/settings", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const settings = await getOrCreatePlannerSettings(user.id, user.tier, user.careerType);
      res.json(settings);
    } catch (e: any) {
      console.error("Exam planner settings error:", e);
      res.status(500).json({ error: "Failed to load planner settings" });
    }
  });

  app.put("/api/exam-planner/settings", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const { studyPlanIntensity, examDateType, planWithoutDateWeeks } = req.body;

      if (studyPlanIntensity && !VALID_INTENSITIES.includes(studyPlanIntensity)) {
        return res.status(400).json({ error: "Invalid intensity. Must be light, balanced, or intensive." });
      }
      if (examDateType && !VALID_DATE_TYPES.includes(examDateType)) {
        return res.status(400).json({ error: "Invalid date type. Must be booked or target." });
      }
      if (planWithoutDateWeeks !== undefined && planWithoutDateWeeks !== null) {
        const weeks = Number(planWithoutDateWeeks);
        if (isNaN(weeks) || weeks < 1 || weeks > 52) {
          return res.status(400).json({ error: "Weeks must be between 1 and 52." });
        }
      }

      const settings = await updatePlannerSettings(user.id, req.body);
      res.json(settings);
    } catch (e: any) {
      console.error("Exam planner settings update error:", e);
      res.status(500).json({ error: "Failed to update planner settings" });
    }
  });

  app.get("/api/exam-planner/plan", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const settings = await getOrCreatePlannerSettings(user.id, user.tier, user.careerType);

      if (settings.generated_plan) {
        const plan = typeof settings.generated_plan === "string"
          ? JSON.parse(settings.generated_plan)
          : settings.generated_plan;

        const hasExamDate = !!settings.exam_date;
        const hasPlanWithoutDate = settings.plan_without_date;

        if (hasExamDate || hasPlanWithoutDate) {
          let daysRemaining = 56;
          if (hasExamDate) {
            daysRemaining = Math.max(0, Math.ceil(
              (new Date(settings.exam_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            ));
          } else if (settings.plan_without_date_weeks) {
            daysRemaining = settings.plan_without_date_weeks * 7;
          }
          plan.phase = getStudyPhase(daysRemaining);
        }

        return res.json({
          settings,
          plan,
          hasExamDate: !!settings.exam_date,
          hasPlan: true,
        });
      }

      res.json({
        settings,
        plan: null,
        hasExamDate: !!settings.exam_date,
        hasPlan: false,
      });
    } catch (e: any) {
      console.error("Exam planner plan fetch error:", e);
      res.status(500).json({ error: "Failed to load study plan" });
    }
  });

  app.post("/api/exam-planner/generate", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const { examDate, examDateType, intensity, planWithoutDate, planWithoutDateWeeks } = req.body;

      if (intensity && !VALID_INTENSITIES.includes(intensity)) {
        return res.status(400).json({ error: "Invalid intensity. Must be light, balanced, or intensive." });
      }
      if (examDateType && !VALID_DATE_TYPES.includes(examDateType)) {
        return res.status(400).json({ error: "Invalid date type. Must be booked or target." });
      }
      if (planWithoutDateWeeks !== undefined && planWithoutDateWeeks !== null) {
        const weeks = Number(planWithoutDateWeeks);
        if (isNaN(weeks) || weeks < 1 || weeks > 52) {
          return res.status(400).json({ error: "Weeks must be between 1 and 52." });
        }
      }
      if (examDate) {
        const parsed = new Date(examDate);
        if (isNaN(parsed.getTime())) {
          return res.status(400).json({ error: "Invalid exam date." });
        }
      }

      const settingsUpdate: Record<string, any> = {};

      if (planWithoutDate) {
        settingsUpdate.planWithoutDate = true;
        settingsUpdate.planWithoutDateWeeks = planWithoutDateWeeks || 8;
        settingsUpdate.examDate = null;
      } else if (examDate) {
        settingsUpdate.examDate = new Date(examDate).toISOString();
        settingsUpdate.examDateType = examDateType || "target";
        settingsUpdate.planWithoutDate = false;
        settingsUpdate.planWithoutDateWeeks = null;
      }

      if (intensity) {
        settingsUpdate.studyPlanIntensity = intensity;
      }

      if (Object.keys(settingsUpdate).length > 0) {
        await updatePlannerSettings(user.id, settingsUpdate);
      }

      const plan = await generateFullStudyPlan(user.id, user.tier || "rn", user.careerType || "nursing");

      const updatedSettings = await getOrCreatePlannerSettings(user.id);
      res.json({
        settings: updatedSettings,
        plan,
        hasExamDate: !!updatedSettings.exam_date,
        hasPlan: true,
      });
    } catch (e: any) {
      console.error("Exam planner generate error:", e);
      res.status(500).json({ error: "Failed to generate study plan" });
    }
  });

  app.post("/api/exam-planner/regenerate", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const plan = await generateFullStudyPlan(user.id, user.tier || "rn", user.careerType || "nursing");
      const settings = await getOrCreatePlannerSettings(user.id);

      res.json({
        settings,
        plan,
        hasExamDate: !!settings.exam_date,
        hasPlan: true,
      });
    } catch (e: any) {
      console.error("Exam planner regenerate error:", e);
      res.status(500).json({ error: "Failed to regenerate study plan" });
    }
  });

  app.delete("/api/exam-planner/plan", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      await updatePlannerSettings(user.id, {
        examDate: null,
        planWithoutDate: false,
        planWithoutDateWeeks: null,
      });

      const { pool } = await import("./storage");
      await pool.query(
        `UPDATE exam_planner_settings SET generated_plan = NULL, planner_last_updated = NULL, updated_at = NOW() WHERE user_id = $1`,
        [user.id]
      );

      res.json({ ok: true });
    } catch (e: any) {
      console.error("Exam planner reset error:", e);
      res.status(500).json({ error: "Failed to reset study plan" });
    }
  });
}
