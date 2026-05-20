import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

const PLATFORM_CONFIGS: Record<string, {
  name: string;
  maxCaptionLength: number;
  maxHashtags: number;
  aspectRatios: { name: string; width: number; height: number }[];
  bestPostTimes: string[];
  hashtagStrategy: string;
}> = {
  instagram: {
    name: "Instagram",
    maxCaptionLength: 2200,
    maxHashtags: 30,
    aspectRatios: [
      { name: "Feed Post", width: 1080, height: 1080 },
      { name: "Story/Reel", width: 1080, height: 1920 },
      { name: "Carousel", width: 1080, height: 1350 },
    ],
    bestPostTimes: ["9:00 AM", "12:00 PM", "5:00 PM"],
    hashtagStrategy: "Mix of broad (#nursing, #healthcare) and niche (#NCLEXprep, #nursingexam). Use 15-25 hashtags. Include branded hashtag #NurseNest.",
  },
  tiktok: {
    name: "TikTok",
    maxCaptionLength: 4000,
    maxHashtags: 10,
    aspectRatios: [
      { name: "Video", width: 1080, height: 1920 },
    ],
    bestPostTimes: ["7:00 AM", "10:00 AM", "7:00 PM"],
    hashtagStrategy: "Use 3-5 trending + 3-5 niche hashtags. Include #StudyTok #NurseTok #MedTok. Keep hashtags discoverable.",
  },
  pinterest: {
    name: "Pinterest",
    maxCaptionLength: 500,
    maxHashtags: 20,
    aspectRatios: [
      { name: "Standard Pin", width: 1000, height: 1500 },
      { name: "Long Pin", width: 1000, height: 2100 },
      { name: "Square Pin", width: 1000, height: 1000 },
    ],
    bestPostTimes: ["2:00 PM", "8:00 PM", "11:00 PM"],
    hashtagStrategy: "Use keyword-rich descriptions. 5-10 relevant hashtags. Focus on searchable terms like 'nursing study guide' and 'exam prep tips'.",
  },
  linkedin: {
    name: "LinkedIn",
    maxCaptionLength: 3000,
    maxHashtags: 5,
    aspectRatios: [
      { name: "Post Image", width: 1200, height: 627 },
      { name: "Article Cover", width: 1200, height: 644 },
      { name: "Square", width: 1080, height: 1080 },
    ],
    bestPostTimes: ["8:00 AM", "12:00 PM", "5:30 PM"],
    hashtagStrategy: "Use 3-5 professional hashtags. Focus on #HealthcareEducation #NursingCareer #AlliedHealth. Keep tone professional.",
  },
};

type ContentType = "study_tip" | "quiz_question" | "clinical_pearl" | "infographic_spec";

interface GeneratedSocialContent {
  platform: string;
  contentType: ContentType;
  title: string;
  caption: string;
  hashtags: string[];
  imageSpec: {
    width: number;
    height: number;
    format: string;
    elements: string[];
  } | null;
  sourceType: string;
  sourceId: string | null;
  sourceTitle: string | null;
}

const PLATFORM_HASHTAGS: Record<string, Record<ContentType, string[]>> = {
  instagram: {
    study_tip: ["#StudyTip", "#NursingStudent", "#ExamPrep", "#NCLEXprep", "#NurseNest", "#HealthcareStudents", "#NursingSchool", "#StudyMotivation", "#NursingLife", "#MedicalStudents"],
    quiz_question: ["#NursingQuiz", "#TestYourself", "#NCLEXquestion", "#NurseNest", "#ExamPrep", "#NursingKnowledge", "#HealthcareQuiz", "#StudyWithMe", "#NursingEducation"],
    clinical_pearl: ["#ClinicalPearl", "#NursingTips", "#MedicalKnowledge", "#NurseNest", "#HealthcarePro", "#ClinicalNursing", "#PatientCare", "#NursingWisdom"],
    infographic_spec: ["#NursingInfographic", "#StudyGuide", "#VisualLearning", "#NurseNest", "#MedicalChart", "#HealthcareEducation", "#NursingReference"],
  },
  tiktok: {
    study_tip: ["#StudyTok", "#NurseTok", "#ExamPrep", "#NurseNest", "#MedTok", "#HealthcareStudents"],
    quiz_question: ["#NursingQuiz", "#NurseTok", "#TestYourself", "#NurseNest", "#StudyTok", "#MedTok"],
    clinical_pearl: ["#ClinicalPearl", "#NurseTok", "#MedTok", "#NurseNest", "#HealthcareTips", "#LearnOnTikTok"],
    infographic_spec: ["#StudyTok", "#NurseTok", "#InfographicTok", "#NurseNest", "#LearnOnTikTok", "#HealthcareEducation"],
  },
  pinterest: {
    study_tip: ["#NursingStudyTips", "#ExamPrep", "#NCLEXstudy", "#NurseNest", "#HealthcareEducation", "#StudyGuide", "#NursingSchool"],
    quiz_question: ["#NursingPracticeQuestions", "#NCLEXprep", "#NurseNest", "#ExamPractice", "#NursingQuiz", "#HealthcareStudents"],
    clinical_pearl: ["#ClinicalNursing", "#NursingTips", "#NurseNest", "#HealthcareProfessional", "#MedicalKnowledge", "#PatientCare"],
    infographic_spec: ["#NursingInfographic", "#MedicalChart", "#StudyGuide", "#NurseNest", "#HealthcareVisual", "#NursingReference", "#ExamStudy"],
  },
  linkedin: {
    study_tip: ["#HealthcareEducation", "#NursingCareer", "#ProfessionalDevelopment", "#NurseNest", "#AlliedHealth"],
    quiz_question: ["#HealthcareEducation", "#ContinuingEducation", "#NurseNest", "#MedicalKnowledge", "#AlliedHealth"],
    clinical_pearl: ["#ClinicalExcellence", "#HealthcareProfessional", "#NurseNest", "#EvidenceBasedPractice", "#AlliedHealth"],
    infographic_spec: ["#HealthcareEducation", "#InfographicDesign", "#NurseNest", "#MedicalEducation", "#AlliedHealth"],
  },
};

function generateStudyTipContent(sourceContent: any, platform: string): GeneratedSocialContent {
  const config = PLATFORM_CONFIGS[platform];
  const tips = sourceContent.clinicalPearls || sourceContent.examTips || sourceContent.studyTips || [];
  const tip = tips.length > 0 ? tips[Math.floor(Math.random() * tips.length)] : sourceContent.title;
  const title = `Study Tip: ${(sourceContent.title || "Healthcare Exam Prep").substring(0, 60)}`;

  let caption = "";
  if (platform === "instagram") {
    caption = `STUDY TIP\n\n${tip}\n\nFrom our lesson on "${sourceContent.title || "Exam Prep"}"\n\nSave this post for your next study session!\nTag a classmate who needs this tip\n\nMore tips at NurseNest.ca`;
  } else if (platform === "tiktok") {
    caption = `Study tip that could change your exam score ${tip} - Save this for later! #StudyTok #NurseTok`;
  } else if (platform === "pinterest") {
    caption = `${title} | ${tip} | Complete study resources and practice questions available at NurseNest.ca | Pin for your next study session`;
  } else if (platform === "linkedin") {
    caption = `💡 Healthcare Education Insight\n\n${tip}\n\nThis is one of the key takeaways from our comprehensive lesson on "${sourceContent.title || "Healthcare Exam Preparation"}".\n\nAt NurseNest, we help healthcare students and professionals prepare with evidence-based study resources.\n\n#HealthcareEducation #ContinuingEducation`;
  }

  caption = caption.substring(0, config.maxCaptionLength);
  const hashtags = (PLATFORM_HASHTAGS[platform]?.study_tip || []).slice(0, config.maxHashtags);
  const aspectRatio = config.aspectRatios[0];

  return {
    platform,
    contentType: "study_tip",
    title,
    caption,
    hashtags,
    imageSpec: {
      width: aspectRatio.width,
      height: aspectRatio.height,
      format: "png",
      elements: ["Brand header with NurseNest logo", `Tip text: "${tip.substring(0, 120)}"`, "Source topic label", "Call-to-action footer"],
    },
    sourceType: sourceContent._sourceType || "lesson",
    sourceId: sourceContent._sourceId || null,
    sourceTitle: sourceContent.title || null,
  };
}

function generateQuizQuestionContent(sourceContent: any, platform: string): GeneratedSocialContent {
  const config = PLATFORM_CONFIGS[platform];
  const questions = sourceContent.practiceQuestions || sourceContent.questions || [];
  const q = questions.length > 0 ? questions[Math.floor(Math.random() * questions.length)] : null;
  const title = `Quiz: ${(sourceContent.title || "Test Your Knowledge").substring(0, 60)}`;

  let caption = "";
  if (q) {
    const stem = q.stem || q.question || "Test your knowledge!";
    const options = q.options || [];
    if (platform === "instagram") {
      caption = `🧠 POP QUIZ TIME!\n\n${stem}\n\n${options.map((o: string, i: number) => `${String.fromCharCode(65 + i)}) ${o}`).join("\n")}\n\n💬 Comment your answer below!\n📌 Save & share with your study group\n\n✅ Answer revealed in stories!`;
    } else if (platform === "tiktok") {
      caption = `Can you answer this? 🧠 ${stem.substring(0, 150)} Comment your answer! #NursingQuiz #NurseTok`;
    } else if (platform === "pinterest") {
      caption = `Practice Question: ${stem.substring(0, 200)} | Test your knowledge with more questions at NurseNest.ca`;
    } else if (platform === "linkedin") {
      caption = `🎯 Healthcare Knowledge Check\n\n${stem}\n\n${options.map((o: string, i: number) => `${String.fromCharCode(65 + i)}) ${o}`).join("\n")}\n\nShare your answer in the comments! Full explanation available on NurseNest.ca\n\n#HealthcareEducation #ContinuingEducation`;
    }
  } else {
    caption = `Test your knowledge on ${sourceContent.title || "healthcare concepts"}! Visit NurseNest.ca for practice questions.`;
  }

  caption = caption.substring(0, config.maxCaptionLength);
  const hashtags = (PLATFORM_HASHTAGS[platform]?.quiz_question || []).slice(0, config.maxHashtags);
  const aspectRatio = config.aspectRatios[0];

  return {
    platform,
    contentType: "quiz_question",
    title,
    caption,
    hashtags,
    imageSpec: q ? {
      width: aspectRatio.width,
      height: aspectRatio.height,
      format: "png",
      elements: ["Quiz header with question mark icon", `Question: "${(q.stem || q.question || "").substring(0, 100)}"`, "Answer options A-D", "NurseNest branding footer"],
    } : null,
    sourceType: sourceContent._sourceType || "lesson",
    sourceId: sourceContent._sourceId || null,
    sourceTitle: sourceContent.title || null,
  };
}

function generateClinicalPearlContent(sourceContent: any, platform: string): GeneratedSocialContent {
  const config = PLATFORM_CONFIGS[platform];
  const pearls = sourceContent.clinicalPearls || sourceContent.examTips || [];
  const pearl = pearls.length > 0 ? pearls[Math.floor(Math.random() * pearls.length)] : `Key concept from ${sourceContent.title || "clinical practice"}`;
  const title = `Clinical Pearl: ${(sourceContent.title || "Clinical Knowledge").substring(0, 50)}`;

  let caption = "";
  if (platform === "instagram") {
    caption = `CLINICAL PEARL\n\n${pearl}\n\nFrom: "${sourceContent.title || "Clinical Resource"}"\n\nThis is commonly tested on exams!\nSave this for review\nShare with your cohort`;
  } else if (platform === "tiktok") {
    caption = `Clinical pearl every student should know 💎 ${pearl.substring(0, 200)} #ClinicalPearl #NurseTok #MedTok`;
  } else if (platform === "pinterest") {
    caption = `Clinical Pearl: ${pearl.substring(0, 300)} | Essential knowledge for healthcare professionals | More at NurseNest.ca`;
  } else if (platform === "linkedin") {
    caption = `💎 Clinical Pearl\n\n${pearl}\n\nUnderstanding these nuances is critical for both exam success and clinical practice excellence.\n\nExplore more clinical insights at NurseNest.ca\n\n#ClinicalExcellence #HealthcareProfessional`;
  }

  caption = caption.substring(0, config.maxCaptionLength);
  const hashtags = (PLATFORM_HASHTAGS[platform]?.clinical_pearl || []).slice(0, config.maxHashtags);
  const aspectRatio = config.aspectRatios[0];

  return {
    platform,
    contentType: "clinical_pearl",
    title,
    caption,
    hashtags,
    imageSpec: {
      width: aspectRatio.width,
      height: aspectRatio.height,
      format: "png",
      elements: ["Diamond icon header", `Pearl text: "${pearl.substring(0, 120)}"`, "Source label", "NurseNest branding"],
    },
    sourceType: sourceContent._sourceType || "lesson",
    sourceId: sourceContent._sourceId || null,
    sourceTitle: sourceContent.title || null,
  };
}

function generateInfographicSpec(sourceContent: any, platform: string): GeneratedSocialContent {
  const config = PLATFORM_CONFIGS[platform];
  const title = `Infographic: ${(sourceContent.title || "Visual Study Guide").substring(0, 50)}`;
  const topics = sourceContent.sections?.map((s: any) => s.title || s.id).filter(Boolean).slice(0, 5) || [sourceContent.title || "Key Concepts"];

  let caption = "";
  if (platform === "instagram") {
    caption = `📊 INFOGRAPHIC: ${sourceContent.title || "Study Guide"}\n\nKey topics covered:\n${topics.map((t: string) => `✅ ${t}`).join("\n")}\n\n📌 Save this visual reference!\n🔗 Full resource at NurseNest.ca`;
  } else if (platform === "tiktok") {
    caption = `Visual study guide for ${sourceContent.title || "exam prep"} 📊 Save for later! #StudyTok #InfographicTok`;
  } else if (platform === "pinterest") {
    caption = `${sourceContent.title || "Healthcare Study Guide"} Infographic | Visual reference covering: ${topics.join(", ")} | Pin to your study board | NurseNest.ca`;
  } else if (platform === "linkedin") {
    caption = `📊 New Educational Infographic\n\n"${sourceContent.title || "Healthcare Concepts"}"\n\nThis visual reference covers:\n${topics.map((t: string) => `• ${t}`).join("\n")}\n\nVisual learning resources like these help healthcare professionals quickly review key concepts.\n\nView the full resource at NurseNest.ca`;
  }

  caption = caption.substring(0, config.maxCaptionLength);
  const hashtags = (PLATFORM_HASHTAGS[platform]?.infographic_spec || []).slice(0, config.maxHashtags);
  const pinRatio = platform === "pinterest" ? config.aspectRatios[0] : config.aspectRatios[0];

  return {
    platform,
    contentType: "infographic_spec",
    title,
    caption,
    hashtags,
    imageSpec: {
      width: pinRatio.width,
      height: pinRatio.height,
      format: "png",
      elements: [
        "Header with topic title",
        ...topics.map((t: string) => `Section: ${t}`),
        "Key facts/stats callout boxes",
        "NurseNest.ca branding and CTA",
      ],
    },
    sourceType: sourceContent._sourceType || "lesson",
    sourceId: sourceContent._sourceId || null,
    sourceTitle: sourceContent.title || null,
  };
}

function generateContentForAllPlatforms(sourceContent: any, contentType: ContentType): GeneratedSocialContent[] {
  const platforms = ["instagram", "tiktok", "pinterest", "linkedin"];
  const generators: Record<ContentType, (source: any, platform: string) => GeneratedSocialContent> = {
    study_tip: generateStudyTipContent,
    quiz_question: generateQuizQuestionContent,
    clinical_pearl: generateClinicalPearlContent,
    infographic_spec: generateInfographicSpec,
  };

  const generator = generators[contentType];
  if (!generator) return [];

  return platforms.map(platform => generator(sourceContent, platform));
}

async function ensureSocialContentTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS social_content (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      platform TEXT NOT NULL,
      content_type TEXT NOT NULL,
      title TEXT NOT NULL,
      caption TEXT NOT NULL,
      hashtags TEXT[] DEFAULT '{}',
      image_spec JSONB DEFAULT '{}',
      source_type TEXT,
      source_id TEXT,
      source_title TEXT,
      status TEXT DEFAULT 'draft',
      scheduled_at TIMESTAMP,
      published_at TIMESTAMP,
      reviewed_by TEXT,
      reviewed_at TIMESTAMP,
      edit_notes TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

async function saveSocialContent(content: GeneratedSocialContent): Promise<string> {
  const r = await pool.query(
    `INSERT INTO social_content (platform, content_type, title, caption, hashtags, image_spec, source_type, source_id, source_title, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'draft') RETURNING id`,
    [
      content.platform,
      content.contentType,
      content.title,
      content.caption,
      content.hashtags,
      JSON.stringify(content.imageSpec),
      content.sourceType,
      content.sourceId,
      content.sourceTitle,
    ]
  );
  return r.rows[0].id;
}

export async function generateFromLessonsAndBlogs(): Promise<{ generated: number; details: any }> {
  await ensureSocialContentTable();

  let generated = 0;
  const details: any = { lessons: 0, blogs: 0, byPlatform: {}, byType: {} };

  const lessons = await pool.query(
    `SELECT id, title, body FROM content_items
     WHERE type IN ('lesson', 'page', 'blog', 'blog-post', 'article')
     AND title IS NOT NULL AND body IS NOT NULL
     ORDER BY RANDOM() LIMIT 5`
  ).catch(() => ({ rows: [] }));

  for (const lesson of lessons.rows) {
    let parsed: any = {};
    try {
      if (typeof lesson.body === "string" && (lesson.body.startsWith("{") || lesson.body.startsWith("["))) {
        parsed = JSON.parse(lesson.body);
      }
    } catch {}

    const sourceContent = {
      title: lesson.title,
      clinicalPearls: parsed.clinicalPearls || parsed.examTips || [],
      practiceQuestions: parsed.practiceQuestions || parsed.questions || [],
      studyTips: parsed.studyTips || [],
      sections: parsed.sections || [],
      _sourceType: "lesson",
      _sourceId: lesson.id,
    };

    const contentTypes: ContentType[] = ["study_tip", "quiz_question", "clinical_pearl", "infographic_spec"];
    const selectedType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
    const contents = generateContentForAllPlatforms(sourceContent, selectedType);

    for (const content of contents) {
      const existing = await pool.query(
        `SELECT id FROM social_content WHERE source_id = $1 AND platform = $2 AND content_type = $3 AND created_at > NOW() - INTERVAL '7 days'`,
        [lesson.id, content.platform, content.contentType]
      ).catch(() => ({ rows: [] }));

      if (existing.rows.length === 0) {
        await saveSocialContent(content);
        generated++;
        details.byPlatform[content.platform] = (details.byPlatform[content.platform] || 0) + 1;
        details.byType[content.contentType] = (details.byType[content.contentType] || 0) + 1;
      }
    }
    details.lessons++;
  }

  const blogs = await pool.query(
    `SELECT id, title, content FROM publishing_queue
     WHERE content_type IN ('blog', 'article') AND status IN ('published', 'pending_review')
     AND title IS NOT NULL
     ORDER BY RANDOM() LIMIT 3`
  ).catch(() => ({ rows: [] }));

  for (const blog of blogs.rows) {
    let parsed: any = {};
    try {
      if (typeof blog.content === "string") {
        parsed = JSON.parse(blog.content);
      } else if (blog.content) {
        parsed = blog.content;
      }
    } catch {}

    const sourceContent = {
      title: blog.title || parsed.title,
      clinicalPearls: parsed.clinicalPearls || [],
      practiceQuestions: parsed.practiceQuestions || [],
      studyTips: parsed.studyTips || [],
      sections: parsed.sections || [],
      _sourceType: "blog",
      _sourceId: blog.id,
    };

    const contentTypes: ContentType[] = ["study_tip", "clinical_pearl", "quiz_question"];
    const selectedType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
    const contents = generateContentForAllPlatforms(sourceContent, selectedType);

    for (const content of contents) {
      const existing = await pool.query(
        `SELECT id FROM social_content WHERE source_id = $1 AND platform = $2 AND content_type = $3 AND created_at > NOW() - INTERVAL '7 days'`,
        [blog.id, content.platform, content.contentType]
      ).catch(() => ({ rows: [] }));

      if (existing.rows.length === 0) {
        await saveSocialContent(content);
        generated++;
        details.byPlatform[content.platform] = (details.byPlatform[content.platform] || 0) + 1;
        details.byType[content.contentType] = (details.byType[content.contentType] || 0) + 1;
      }
    }
    details.blogs++;
  }

  return { generated, details };
}

let socialContentTimer: NodeJS.Timeout | null = null;
const SOCIAL_CONTENT_INTERVAL_MS = 6 * 60 * 60 * 1000;

async function runSocialContentGeneration() {
  try {
    console.log("[Social Content] Starting scheduled content generation...");
    const result = await generateFromLessonsAndBlogs();
    console.log(`[Social Content] Generated ${result.generated} items. Details:`, JSON.stringify(result.details));
  } catch (e: any) {
    console.error("[Social Content] Generation failed:", e.message);
  }
}

function startSocialContentScheduler() {
  console.log("[Social Content] Scheduler initialized - runs every 6 hours");
  socialContentTimer = setInterval(runSocialContentGeneration, SOCIAL_CONTENT_INTERVAL_MS);
  setTimeout(runSocialContentGeneration, 60000);
}

function stopSocialContentScheduler() {
  if (socialContentTimer) {
    clearInterval(socialContentTimer);
    socialContentTimer = null;
  }
}

export function registerSocialContentRoutes(app: Express) {
  ensureSocialContentTable().catch(console.error);

  app.get("/api/admin/social-content", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { platform, contentType, status, page = "1", limit = "25" } = req.query;
      const conditions: string[] = [];
      const params: any[] = [];
      let idx = 1;

      if (platform) { conditions.push(`platform = $${idx++}`); params.push(platform); }
      if (contentType) { conditions.push(`content_type = $${idx++}`); params.push(contentType); }
      if (status) { conditions.push(`status = $${idx++}`); params.push(status); }

      const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
      const limitVal = Math.min(parseInt(String(limit)) || 25, 100);
      const offset = ((parseInt(String(page)) || 1) - 1) * limitVal;

      const countRes = await pool.query(`SELECT COUNT(*) as total FROM social_content ${where}`, params);
      params.push(limitVal);
      params.push(offset);
      const r = await pool.query(
        `SELECT * FROM social_content ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx}`,
        params
      );

      res.json({
        items: r.rows,
        total: parseInt(countRes.rows[0].total),
        page: parseInt(String(page)) || 1,
        totalPages: Math.ceil(parseInt(countRes.rows[0].total) / limitVal),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/social-content/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const r = await pool.query("SELECT * FROM social_content WHERE id = $1", [req.params.id]);
      if (!r.rows[0]) return res.status(404).json({ error: "Not found" });
      res.json(r.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/social-content/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { caption, hashtags, status, scheduledAt, editNotes } = req.body;
      const updates: string[] = [];
      const params: any[] = [];
      let idx = 1;

      if (caption !== undefined) { updates.push(`caption = $${idx++}`); params.push(String(caption)); }
      if (hashtags !== undefined) { updates.push(`hashtags = $${idx++}`); params.push(Array.isArray(hashtags) ? hashtags : []); }
      if (status !== undefined) {
        const validStatuses = ["draft", "approved", "rejected", "scheduled", "published"];
        if (!validStatuses.includes(status)) return res.status(400).json({ error: `Invalid status. Allowed: ${validStatuses.join(", ")}` });
        updates.push(`status = $${idx++}`);
        params.push(status);
        if (status === "approved" || status === "rejected") {
          updates.push(`reviewed_by = $${idx++}`);
          params.push(admin.id);
          updates.push(`reviewed_at = NOW()`);
        }
        if (status === "published") {
          updates.push(`published_at = NOW()`);
        }
      }
      if (scheduledAt !== undefined) { updates.push(`scheduled_at = $${idx++}`); params.push(scheduledAt ? new Date(scheduledAt) : null); }
      if (editNotes !== undefined) { updates.push(`edit_notes = $${idx++}`); params.push(editNotes); }

      if (updates.length === 0) return res.status(400).json({ error: "No updates provided" });
      params.push(req.params.id);

      const r = await pool.query(
        `UPDATE social_content SET ${updates.join(", ")} WHERE id = $${idx} RETURNING *`,
        params
      );
      if (!r.rows[0]) return res.status(404).json({ error: "Not found" });
      res.json(r.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/social-content/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      await pool.query("DELETE FROM social_content WHERE id = $1", [req.params.id]);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/social-content/generate", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const result = await generateFromLessonsAndBlogs();
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/social-content/bulk-action", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { ids, action } = req.body;
      if (!ids?.length || !action) return res.status(400).json({ error: "ids and action required" });
      if (!["approve", "reject", "delete"].includes(action)) {
        return res.status(400).json({ error: "Invalid action. Allowed: approve, reject, delete" });
      }

      let affected = 0;
      for (const id of ids) {
        if (action === "delete") {
          await pool.query("DELETE FROM social_content WHERE id = $1", [id]);
        } else if (action === "approve") {
          await pool.query("UPDATE social_content SET status = 'approved', reviewed_by = $1, reviewed_at = NOW() WHERE id = $2", [admin.id, id]);
        } else if (action === "reject") {
          await pool.query("UPDATE social_content SET status = 'rejected', reviewed_by = $1, reviewed_at = NOW() WHERE id = $2", [admin.id, id]);
        }
        affected++;
      }
      res.json({ affected });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/social-content/stats", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const [byPlatform, byType, byStatus, total, recentCount] = await Promise.all([
        pool.query("SELECT platform, COUNT(*)::int as count FROM social_content GROUP BY platform ORDER BY count DESC"),
        pool.query("SELECT content_type, COUNT(*)::int as count FROM social_content GROUP BY content_type ORDER BY count DESC"),
        pool.query("SELECT status, COUNT(*)::int as count FROM social_content GROUP BY status ORDER BY count DESC"),
        pool.query("SELECT COUNT(*)::int as total FROM social_content"),
        pool.query("SELECT COUNT(*)::int as count FROM social_content WHERE created_at > NOW() - INTERVAL '24 hours'"),
      ]);

      res.json({
        total: total.rows[0]?.total || 0,
        recentlyGenerated: recentCount.rows[0]?.count || 0,
        byPlatform: byPlatform.rows,
        byType: byType.rows,
        byStatus: byStatus.rows,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/social-content/platform-configs", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      res.json(PLATFORM_CONFIGS);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // startSocialContentScheduler(); // Disabled: AI generation now admin-triggered only via AI Jobs
}
