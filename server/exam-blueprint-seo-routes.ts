import type { Express } from "express";
import { pool } from "./storage";

export function registerExamBlueprintSeoRoutes(app: Express) {
  app.get("/api/exam-blueprint/stats/:tier", async (req, res) => {
    try {
      const { tier } = req.params;
      const validTiers = ["rpn", "rn", "np"];
      if (!validTiers.includes(tier)) {
        return res.status(400).json({ error: "Invalid tier" });
      }

      const totalResult = await pool.query(
        `SELECT COUNT(*) as total FROM exam_questions WHERE tier = $1 AND status = 'published'`,
        [tier]
      );
      const totalQuestions = parseInt(totalResult.rows[0]?.total || "0");

      const topicResult = await pool.query(
        `SELECT 
          COALESCE(body_system, topic, 'General') as category,
          COUNT(*) as count,
          ROUND(AVG(difficulty), 1) as avg_difficulty,
          COUNT(CASE WHEN difficulty <= 2 THEN 1 END) as easy_count,
          COUNT(CASE WHEN difficulty = 3 THEN 1 END) as moderate_count,
          COUNT(CASE WHEN difficulty >= 4 THEN 1 END) as hard_count
        FROM exam_questions 
        WHERE tier = $1 AND status = 'published'
        GROUP BY COALESCE(body_system, topic, 'General')
        ORDER BY count DESC`,
        [tier]
      );

      const categories = topicResult.rows.map((row: any) => ({
        category: row.category,
        count: parseInt(row.count),
        avgDifficulty: parseFloat(row.avg_difficulty) || 3,
        easyCount: parseInt(row.easy_count),
        moderateCount: parseInt(row.moderate_count),
        hardCount: parseInt(row.hard_count),
      }));

      res.json({ tier, totalQuestions, categories });
    } catch (error: any) {
      console.error("[ExamBlueprintSEO] Stats error:", error.message);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/exam-blueprint/sample-questions/:tier/:topicSlug", async (req, res) => {
    try {
      const { tier, topicSlug } = req.params;
      const validTiers = ["rpn", "rn", "np"];
      if (!validTiers.includes(tier)) {
        return res.status(400).json({ error: "Invalid tier" });
      }

      const cleanSlug = topicSlug
        .replace(/-questions$/, "")
        .replace(/-practice$/, "")
        .replace(/-advanced$/, "");
      
      const topicName = cleanSlug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase());

      const slugAliases: Record<string, string[]> = {
        "cardiac": ["cardiac", "cardiovascular", "heart failure", "myocardial infarction"],
        "pharmacology": ["pharmacology", "pharmacological"],
        "respiratory": ["respiratory", "pulmonary"],
        "mental-health": ["mental health", "psychiatry", "psychosocial"],
        "clinical-practice": ["clinical", "fundamentals", "medical-surgical"],
        "professional-practice": ["leadership", "ethics", "delegation", "safety"],
        "primary-care": ["community health", "preventive medicine", "fundamentals"],
        "differential-diagnosis": ["critical care", "emergency", "multi-system"],
      };

      const aliases = slugAliases[cleanSlug] || [topicName.toLowerCase()];
      const conditions = aliases.map((_, i) => 
        `LOWER(COALESCE(body_system, topic, '')) ILIKE $${i + 2}`
      ).join(" OR ");

      const params = [tier, ...aliases.map(a => `%${a}%`)];

      const result = await pool.query(
        `SELECT id, stem, options, correct_answer, rationale, body_system, topic, difficulty
         FROM exam_questions 
         WHERE tier = $1 AND status = 'published'
           AND (${conditions})
         ORDER BY RANDOM()
         LIMIT 5`,
        params
      );

      const questions = result.rows.map((row: any) => {
        const options = Array.isArray(row.options) ? row.options : [];
        const correctAnswer = Array.isArray(row.correct_answer) ? row.correct_answer : [];
        let correctIndex = 0;
        if (correctAnswer.length > 0 && options.length > 0) {
          const idx = options.findIndex((o: string) => o === correctAnswer[0]);
          if (idx >= 0) correctIndex = idx;
        }
        return {
          id: row.id,
          question: row.stem,
          options,
          correct: correctIndex,
          rationale: row.rationale || "",
          bodySystem: row.body_system || row.topic || "General",
          difficulty: row.difficulty || 3,
        };
      });

      res.json({ tier, topicSlug, questions });
    } catch (error: any) {
      console.error("[ExamBlueprintSEO] Sample questions error:", error.message);
      res.status(500).json({ error: "Failed to fetch sample questions" });
    }
  });
}
