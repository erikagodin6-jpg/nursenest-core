import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

export function registerSeoProgressRoutes(app: Express) {
  app.get("/api/admin/seo-progress", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const professionsResult = await pool.query(
        `SELECT id, slug, name, short_name, status, modules, question_count, color
         FROM professions ORDER BY sort_order, name`
      ).catch(() => ({ rows: [] }));
      const professions = professionsResult.rows;

      const contentItemsResult = await pool.query(
        `SELECT type, status, COUNT(*) as count FROM content_items GROUP BY type, status`
      ).catch(() => ({ rows: [] }));

      const blogPostsResult = await pool.query(
        `SELECT status, COUNT(*) as count FROM content_items WHERE type = 'blog' GROUP BY status`
      ).catch(() => ({ rows: [] }));
      const totalBlogPosts = blogPostsResult.rows.reduce((sum: number, r: any) => sum + Number(r.count), 0);
      const publishedBlogPosts = blogPostsResult.rows.find((r: any) => r.status === "published")?.count || 0;

      const seoPagesResult = await pool.query(
        `SELECT COUNT(*) as count FROM seo_pages WHERE 1=1`
      ).catch(() => ({ rows: [{ count: 0 }] }));

      const seoArticlesResult = await pool.query(
        `SELECT status, COUNT(*) as count FROM seo_articles GROUP BY status`
      ).catch(() => ({ rows: [] }));
      const totalSeoArticles = seoArticlesResult.rows.reduce((sum: number, r: any) => sum + Number(r.count), 0);
      const publishedSeoArticles = seoArticlesResult.rows.find((r: any) => r.status === "published")?.count || 0;

      const imagingSeoResult = await pool.query(
        `SELECT COUNT(*) as count FROM imaging_seo_pages`
      ).catch(() => ({ rows: [{ count: 0 }] }));

      const examQuestionsResult = await pool.query(
        `SELECT status, COUNT(*) as count FROM exam_questions GROUP BY status`
      ).catch(() => ({ rows: [] }));
      const totalExamQuestions = examQuestionsResult.rows.reduce((sum: number, r: any) => sum + Number(r.count), 0);
      const publishedExamQuestions = examQuestionsResult.rows.find((r: any) => r.status === "published")?.count || 0;

      const alliedQuestionsResult = await pool.query(
        `SELECT career_type, status, COUNT(*) as count FROM allied_questions GROUP BY career_type, status`
      ).catch(() => ({ rows: [] }));

      const imagingQuestionsResult = await pool.query(
        `SELECT status, COUNT(*) as count FROM imaging_questions GROUP BY status`
      ).catch(() => ({ rows: [] }));
      const totalImagingQuestions = imagingQuestionsResult.rows.reduce((sum: number, r: any) => sum + Number(r.count), 0);

      const flashcardBankResult = await pool.query(
        `SELECT COUNT(*) as count FROM flashcard_bank`
      ).catch(() => ({ rows: [{ count: 0 }] }));

      const imagingFlashcardsResult = await pool.query(
        `SELECT COUNT(*) as count FROM imaging_flashcards`
      ).catch(() => ({ rows: [{ count: 0 }] }));

      const studyGuidesResult = await pool.query(
        `SELECT category, COUNT(*) as count FROM paramedic_study_guides GROUP BY category`
      ).catch(() => ({ rows: [] }));
      const totalStudyGuides = studyGuidesResult.rows.reduce((sum: number, r: any) => sum + Number(r.count), 0);

      const emailSubscribersResult = await pool.query(
        `SELECT COUNT(*) as count FROM email_subscribers`
      ).catch(() => ({ rows: [{ count: 0 }] }));

      const imagingLeadsResult = await pool.query(
        `SELECT COUNT(*) as count FROM imaging_leads`
      ).catch(() => ({ rows: [{ count: 0 }] }));

      const nurtureSequencesResult = await pool.query(
        `SELECT COUNT(*) as count FROM imaging_nurture_sequences`
      ).catch(() => ({ rows: [{ count: 0 }] }));

      const practicePagesResult = await pool.query(
        `SELECT COUNT(*) as count FROM practice_pages`
      ).catch(() => ({ rows: [{ count: 0 }] }));

      const seoClustersResult = await pool.query(
        `SELECT COUNT(*) as count FROM seo_clusters`
      ).catch(() => ({ rows: [{ count: 0 }] }));

      const blogClustersResult = await pool.query(
        `SELECT COUNT(*) as count FROM blog_clusters`
      ).catch(() => ({ rows: [{ count: 0 }] }));

      const encyclopediaResult = await pool.query(
        `SELECT COUNT(*) as count FROM encyclopedia_entries`
      ).catch(() => ({ rows: [{ count: 0 }] }));

      const programmaticSeoResult = await pool.query(
        `SELECT COUNT(*) as count FROM programmatic_seo_pages`
      ).catch(() => ({ rows: [{ count: 0 }] }));

      const alliedByCareerType: Record<string, { total: number; approved: number }> = {};
      for (const row of alliedQuestionsResult.rows) {
        const ct = row.career_type || "unknown";
        if (!alliedByCareerType[ct]) alliedByCareerType[ct] = { total: 0, approved: 0 };
        alliedByCareerType[ct].total += Number(row.count);
        if (row.status === "approved") alliedByCareerType[ct].approved += Number(row.count);
      }

      const contentByType: Record<string, { total: number; published: number }> = {};
      for (const row of contentItemsResult.rows) {
        const t = row.type || "unknown";
        if (!contentByType[t]) contentByType[t] = { total: 0, published: 0 };
        contentByType[t].total += Number(row.count);
        if (row.status === "published") contentByType[t].published += Number(row.count);
      }

      const professionCoverage = professions.map((p: any) => {
        let modules: Record<string, boolean> = {};
        try {
          modules = typeof p.modules === "string" ? JSON.parse(p.modules) : (p.modules || {});
        } catch { modules = {}; }
        const careerType = p.slug.replace(/-/g, "");
        const alliedData = alliedByCareerType[careerType] ||
          alliedByCareerType[p.slug] ||
          alliedByCareerType[p.short_name?.toLowerCase()] ||
          { total: 0, approved: 0 };

        return {
          id: p.id,
          slug: p.slug,
          name: p.name,
          shortName: p.short_name,
          status: p.status,
          color: p.color,
          questionCount: Number(p.question_count) || 0,
          alliedQuestions: alliedData.total,
          alliedApproved: alliedData.approved,
          enabledModules: modules,
          contentTypes: {
            lessons: modules.lessons ? "enabled" : "disabled",
            flashcards: modules.flashcards ? "enabled" : "disabled",
            practiceExams: modules.practiceExams ? "enabled" : "disabled",
            seoPages: modules.seoPages ? "enabled" : "disabled",
            studyPacks: modules.studyPacks ? "enabled" : "disabled",
          },
        };
      });

      const report = {
        summary: {
          totalProfessions: professions.length,
          activeProfessions: professions.filter((p: any) => p.status === "active" || p.status === "launched").length,
          launchedProfessions: professions.filter((p: any) => p.status === "launched").length,
          draftProfessions: professions.filter((p: any) => p.status === "draft").length,
        },
        content: {
          blogPosts: { total: Number(totalBlogPosts), published: Number(publishedBlogPosts) },
          seoPages: { total: Number(seoPagesResult.rows[0]?.count || 0) },
          seoArticles: { total: Number(totalSeoArticles), published: Number(publishedSeoArticles) },
          imagingSeoPages: { total: Number(imagingSeoResult.rows[0]?.count || 0) },
          practicePages: { total: Number(practicePagesResult.rows[0]?.count || 0) },
          programmaticSeoPages: { total: Number(programmaticSeoResult.rows[0]?.count || 0) },
          encyclopediaEntries: { total: Number(encyclopediaResult.rows[0]?.count || 0) },
          contentByType,
        },
        questions: {
          examQuestions: { total: Number(totalExamQuestions), published: Number(publishedExamQuestions) },
          alliedQuestions: alliedByCareerType,
          imagingQuestions: { total: Number(totalImagingQuestions) },
          totalAllQuestions:
            Number(totalExamQuestions) +
            Object.values(alliedByCareerType).reduce((s, v) => s + v.total, 0) +
            Number(totalImagingQuestions),
        },
        flashcards: {
          flashcardBank: { total: Number(flashcardBankResult.rows[0]?.count || 0) },
          imagingFlashcards: { total: Number(imagingFlashcardsResult.rows[0]?.count || 0) },
        },
        studyGuides: {
          total: Number(totalStudyGuides),
          byCategory: studyGuidesResult.rows.reduce((acc: any, r: any) => {
            acc[r.category || "uncategorized"] = Number(r.count);
            return acc;
          }, {}),
        },
        emailCapture: {
          subscribers: { total: Number(emailSubscribersResult.rows[0]?.count || 0) },
          imagingLeads: { total: Number(imagingLeadsResult.rows[0]?.count || 0) },
          nurtureSequences: { total: Number(nurtureSequencesResult.rows[0]?.count || 0) },
        },
        seoClusters: {
          topicClusters: { total: Number(seoClustersResult.rows[0]?.count || 0) },
          blogClusters: { total: Number(blogClustersResult.rows[0]?.count || 0) },
        },
        professionCoverage,
        generatedAt: new Date().toISOString(),
      };

      res.json(report);
    } catch (e: any) {
      console.error("SEO progress report error:", e);
      res.status(500).json({ error: "Failed to generate SEO progress report" });
    }
  });
}
