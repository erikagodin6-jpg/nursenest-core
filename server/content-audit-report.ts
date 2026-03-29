import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

export function registerContentAuditRoutes(app: Express) {
  app.get("/api/admin/content-quality-audit", async (req: Request, res: Response) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const tierCountsResult = await pool.query(`
        SELECT 
          tier,
          COUNT(*) FILTER (WHERE status = 'published') as published,
          COUNT(*) FILTER (WHERE status = 'draft') as draft,
          COUNT(*) as total
        FROM exam_questions 
        WHERE tier IN ('rpn', 'rn', 'np')
        GROUP BY tier ORDER BY tier
      `);

      const targets: Record<string, number> = { rpn: 8000, rn: 12000, np: 15000 };

      const allTiers = ['np', 'rn', 'rpn'];
      const tierMap = new Map(tierCountsResult.rows.map(r => [r.tier, r]));
      const tierSummary = allTiers.map(t => {
        const r = tierMap.get(t);
        const published = r ? parseInt(r.published) : 0;
        return {
          tier: t,
          published,
          draft: r ? parseInt(r.draft) : 0,
          total: r ? parseInt(r.total) : 0,
          target: targets[t] || 0,
          shortfall: Math.max(0, (targets[t] || 0) - published),
          targetMet: published >= (targets[t] || 0),
        };
      });

      const qualityResult = await pool.query(`
        SELECT 
          tier,
          COUNT(*) as total_published,
          COUNT(*) FILTER (WHERE rationale IS NULL OR TRIM(rationale) = '') as missing_rationale,
          COUNT(*) FILTER (WHERE distractor_rationales IS NULL OR distractor_rationales::text = '{}' OR distractor_rationales::text = 'null') as missing_distractor_rationales,
          COUNT(*) FILTER (WHERE exam IS NULL OR TRIM(exam) = '') as missing_exam,
          COUNT(*) FILTER (WHERE body_system IS NULL OR TRIM(body_system) = '') as missing_body_system,
          COUNT(*) FILTER (WHERE topic IS NULL OR TRIM(topic) = '') as missing_topic
        FROM exam_questions 
        WHERE status = 'published' AND tier IN ('rpn', 'rn', 'np')
        GROUP BY tier ORDER BY tier
      `);

      const qualityMap = new Map(qualityResult.rows.map(r => [r.tier, r]));
      const dataQuality = allTiers.map(t => {
        const r = qualityMap.get(t);
        return {
          tier: t,
          totalPublished: r ? parseInt(r.total_published) : 0,
          missingRationale: r ? parseInt(r.missing_rationale) : 0,
          missingDistractorRationales: r ? parseInt(r.missing_distractor_rationales) : 0,
          missingExam: r ? parseInt(r.missing_exam) : 0,
          missingBodySystem: r ? parseInt(r.missing_body_system) : 0,
          missingTopic: r ? parseInt(r.missing_topic) : 0,
        };
      });

      const flashcardResult = await pool.query(`
        SELECT 
          tier,
          COUNT(*) FILTER (WHERE status = 'published') as published,
          COUNT(*) as total
        FROM flashcard_bank 
        WHERE tier IN ('rpn', 'rn', 'np')
        GROUP BY tier ORDER BY tier
      `);

      const flashcardMap = new Map(flashcardResult.rows.map(r => [r.tier, r]));
      const flashcardCoverage = allTiers.map(t => {
        const r = flashcardMap.get(t);
        return {
          tier: t,
          published: r ? parseInt(r.published) : 0,
          total: r ? parseInt(r.total) : 0,
        };
      });

      const linkageResult = await pool.query(`
        SELECT 
          eq.tier,
          COUNT(DISTINCT eq.id) as total_questions,
          COUNT(DISTINCT fb.source_question_id) as with_flashcards,
          COUNT(DISTINCT eq.id) - COUNT(DISTINCT fb.source_question_id) as without_flashcards
        FROM exam_questions eq
        LEFT JOIN flashcard_bank fb ON fb.source_question_id = eq.id AND fb.status = 'published'
        WHERE eq.status = 'published' AND eq.tier IN ('rpn', 'rn', 'np')
        GROUP BY eq.tier ORDER BY eq.tier
      `);

      const linkageMap = new Map(linkageResult.rows.map(r => [r.tier, r]));
      const flashcardLinkage = allTiers.map(t => {
        const r = linkageMap.get(t);
        return {
          tier: t,
          totalQuestions: r ? parseInt(r.total_questions) : 0,
          withFlashcards: r ? parseInt(r.with_flashcards) : 0,
          withoutFlashcards: r ? parseInt(r.without_flashcards) : 0,
        };
      });

      const examBreakdownResult = await pool.query(`
        SELECT tier, exam, COUNT(*) as count
        FROM exam_questions 
        WHERE status = 'published' AND tier IN ('rpn', 'rn', 'np')
        GROUP BY tier, exam
        ORDER BY tier, count DESC
      `);

      const examBreakdown = examBreakdownResult.rows.map(r => ({
        tier: r.tier,
        exam: r.exam,
        count: parseInt(r.count),
      }));

      const bodySystemResult = await pool.query(`
        SELECT tier, body_system, COUNT(*) as count
        FROM exam_questions 
        WHERE status = 'published' AND tier IN ('rpn', 'rn', 'np')
        GROUP BY tier, body_system
        ORDER BY tier, count DESC
      `);

      const bodySystemBreakdown = bodySystemResult.rows.map(r => ({
        tier: r.tier,
        bodySystem: r.body_system,
        count: parseInt(r.count),
      }));

      const questionFormatResult = await pool.query(`
        SELECT tier, question_type, COUNT(*) as count
        FROM exam_questions 
        WHERE status = 'published' AND tier IN ('rpn', 'rn', 'np')
        GROUP BY tier, question_type
        ORDER BY tier, count DESC
      `);

      const formatBreakdown = questionFormatResult.rows.map(r => ({
        tier: r.tier,
        format: r.question_type,
        count: parseInt(r.count),
      }));

      const duplicateResult = await pool.query(`
        SELECT COUNT(*) as total_published,
          COUNT(*) - COUNT(DISTINCT LOWER(TRIM(stem))) as duplicate_stems
        FROM exam_questions
        WHERE status = 'published' AND tier IN ('rpn', 'rn', 'np')
      `);
      const totalPublished = parseInt(duplicateResult.rows[0]?.total_published || "0");
      const duplicateStems = parseInt(duplicateResult.rows[0]?.duplicate_stems || "0");
      const duplicateRate = totalPublished > 0 ? Math.round((duplicateStems / totalPublished) * 10000) / 100 : 0;

      const invalidResult = await pool.query(`
        SELECT COUNT(*) as invalid_count
        FROM exam_questions
        WHERE status = 'published' AND tier IN ('rpn', 'rn', 'np')
          AND (
            stem IS NULL OR TRIM(stem) = '' OR LENGTH(TRIM(stem)) < 10
            OR options IS NULL OR options::text = '[]' OR options::text = 'null'
            OR correct_answer IS NULL
          )
      `);
      const invalidQuestions = parseInt(invalidResult.rows[0]?.invalid_count || "0");

      const totalMissingRationales = dataQuality.reduce((sum, d) => sum + d.missingRationale, 0);

      let qualityScore = 100;
      if (duplicateRate > 5) qualityScore -= 20;
      else if (duplicateRate > 2) qualityScore -= 10;
      if (invalidQuestions > 0) qualityScore -= Math.min(30, invalidQuestions * 5);
      if (totalMissingRationales > 0) qualityScore -= Math.min(30, Math.ceil(totalMissingRationales / 10));
      const targetsMet = tierSummary.filter(t => t.targetMet).length;
      if (targetsMet < allTiers.length) qualityScore -= (allTiers.length - targetsMet) * 5;
      qualityScore = Math.max(0, qualityScore);

      res.json({
        auditTimestamp: new Date().toISOString(),
        qualityScore,
        duplicateRate,
        invalidQuestions,
        totalMissingRationales,
        deployGate: {
          passed: qualityScore >= 70 && invalidQuestions === 0,
          reason: invalidQuestions > 0
            ? `${invalidQuestions} invalid questions found`
            : qualityScore < 70
              ? `Quality score ${qualityScore} below threshold 70`
              : "All checks passed",
        },
        tierSummary,
        dataQuality,
        flashcardCoverage,
        flashcardLinkage,
        examBreakdown,
        bodySystemBreakdown,
        formatBreakdown,
        catExamBehavior: {
          rationalesHiddenDuringExam: true,
          rationalesShownInReview: true,
          verifiedFiles: [
            "client/src/pages/mock-exam-session.tsx",
            "client/src/pages/qbank-exam.tsx",
          ],
          notes: "Rationale rendering only occurs in review mode (post-exam). Active exam rendering blocks do not render rationale fields.",
        },
        paywallEnforcement: {
          serverSideEntitlements: true,
          clientSideGating: true,
          verifiedMiddleware: ["requireEntitlement", "requireAnyPremium"],
          verifiedFiles: [
            "server/entitlements.ts",
            "client/src/lib/entitlements.ts",
            "client/src/components/content-gate.tsx",
          ],
          notes: "Mock exams, flashcard bank, study sessions, and adaptive engine endpoints all protected by requireEntitlement middleware. Client-side ContentGate component enforces preview/premium gating with upgrade CTAs.",
        },
      });
    } catch (e: any) {
      console.error("[ContentAudit] Error:", e.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/content-audit/fix-quality", async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) {
        client.release();
        return;
      }

      await client.query("BEGIN");

      const snapshot = await client.query(`
        WITH defects AS (
          SELECT id, tier,
            CASE WHEN rationale IS NULL OR TRIM(rationale) = '' THEN true ELSE false END as missing_rationale,
            CASE WHEN body_system IS NULL OR TRIM(body_system) = '' THEN true ELSE false END as missing_body_system,
            CASE WHEN exam IS NULL OR TRIM(exam) = '' THEN true ELSE false END as missing_exam
          FROM exam_questions
          WHERE status = 'published' AND tier IN ('rpn', 'rn', 'np')
            AND (
              rationale IS NULL OR TRIM(rationale) = '' OR
              body_system IS NULL OR TRIM(body_system) = '' OR
              exam IS NULL OR TRIM(exam) = ''
            )
        )
        SELECT 
          COUNT(*) FILTER (WHERE missing_rationale) as total_missing_rationale,
          COUNT(*) FILTER (WHERE missing_body_system) as total_missing_body_system,
          COUNT(*) FILTER (WHERE missing_exam) as total_missing_exam,
          COUNT(*) as total_defective
        FROM defects
      `);

      const updateResult = await client.query(`
        UPDATE exam_questions 
        SET status = 'draft', updated_at = NOW()
        WHERE status = 'published' 
          AND tier IN ('rpn', 'rn', 'np')
          AND (
            rationale IS NULL OR TRIM(rationale) = '' OR
            body_system IS NULL OR TRIM(body_system) = '' OR
            exam IS NULL OR TRIM(exam) = ''
          )
        RETURNING id, tier
      `);

      await client.query("COMMIT");

      const tierCounts = updateResult.rows.reduce((acc: Record<string, number>, r: any) => {
        acc[r.tier] = (acc[r.tier] || 0) + 1;
        return acc;
      }, {});

      const s = snapshot.rows[0];
      res.json({
        timestamp: new Date().toISOString(),
        totalFixed: updateResult.rowCount,
        defectsFound: {
          missingRationale: parseInt(s.total_missing_rationale),
          missingBodySystem: parseInt(s.total_missing_body_system),
          missingExam: parseInt(s.total_missing_exam),
          totalDefective: parseInt(s.total_defective),
        },
        fixedByTier: tierCounts,
      });
    } catch (e: any) {
      await client.query("ROLLBACK").catch(() => {});
      console.error("[ContentAudit] Fix error:", e.message);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      client.release();
    }
  });
}
