import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin, resolveAuthUser } from "./admin-auth";
import crypto from "crypto";

export function registerImagingGrowthRoutes(app: Express) {

  app.post("/api/imaging/leads", async (req, res) => {
    try {
      const { email, name, source, trigger, examType, country, quizScore, quizData, referralCode, referredBy, tags } = req.body;
      if (!email) return res.status(400).json({ error: "Email is required" });

      const existing = await pool.query(`SELECT id FROM imaging_leads WHERE email = $1`, [email]);
      if (existing.rows.length > 0) {
        await pool.query(
          `UPDATE imaging_leads SET source = COALESCE($2, source), trigger = COALESCE($3, trigger), exam_type = COALESCE($4, exam_type), country = COALESCE($5, country), quiz_score = COALESCE($6, quiz_score), quiz_data = COALESCE($7, quiz_data), updated_at = NOW() WHERE email = $1`,
          [email, source, trigger, examType, country, quizScore, quizData ? JSON.stringify(quizData) : null]
        );
        return res.json({ id: existing.rows[0].id, updated: true });
      }

      const genCode = crypto.randomBytes(4).toString("hex");
      const result = await pool.query(
        `INSERT INTO imaging_leads (id, email, name, source, trigger, exam_type, country, quiz_score, quiz_data, referral_code, referred_by, tags, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW()) RETURNING id`,
        [email, name || null, source || "general", trigger || "manual", examType || null, country || null, quizScore || null, quizData ? JSON.stringify(quizData) : null, genCode, referredBy || null, tags || []]
      );

      if (referredBy) {
        await pool.query(
          `INSERT INTO imaging_referrals (id, referrer_code, referrer_email, referred_email, status, created_at)
           VALUES (gen_random_uuid(), $1, (SELECT email FROM imaging_leads WHERE referral_code = $1 LIMIT 1), $2, 'completed', NOW())`,
          [referredBy, email]
        ).catch(() => {});

        await checkAndGrantReferralRewards(referredBy);
      }

      const seqResult = await pool.query(
        `SELECT id FROM imaging_nurture_sequences WHERE trigger = $1 AND is_active = true LIMIT 1`,
        [trigger || "general"]
      );
      if (seqResult.rows.length > 0) {
        await pool.query(
          `INSERT INTO imaging_nurture_enrollments (id, lead_id, sequence_id, current_step, status, next_send_at, created_at)
           VALUES (gen_random_uuid(), $1, $2, 0, 'active', NOW() + INTERVAL '1 day', NOW())`,
          [result.rows[0].id, seqResult.rows[0].id]
        ).catch(() => {});
      }

      res.json({ id: result.rows[0].id, referralCode: genCode });
    } catch (e: any) {
      console.error("Lead capture error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging/leads", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { source, status, limit = "50", offset = "0" } = req.query;
      let query = `SELECT * FROM imaging_leads WHERE 1=1`;
      const params: any[] = [];
      if (source) { params.push(source); query += ` AND source = $${params.length}`; }
      if (status) { params.push(status); query += ` AND status = $${params.length}`; }
      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(Number(limit), Number(offset));
      const result = await pool.query(query, params);
      const countResult = await pool.query(`SELECT COUNT(*)::int as total FROM imaging_leads`);
      res.json({ leads: result.rows, total: countResult.rows[0]?.total || 0 });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging/nurture-sequences", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const result = await pool.query(`SELECT * FROM imaging_nurture_sequences ORDER BY created_at DESC`);
      res.json(result.rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/imaging/nurture-sequences", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { name, trigger, steps, isActive } = req.body;
      if (!name || !trigger) return res.status(400).json({ error: "Name and trigger are required" });
      const result = await pool.query(
        `INSERT INTO imaging_nurture_sequences (id, name, trigger, steps, is_active, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
        [name, trigger, JSON.stringify(steps || []), isActive !== false]
      );
      res.json(result.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/imaging/nurture-sequences/seed-defaults", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const defaults = [
        {
          name: "Welcome Sequence",
          trigger: "general",
          steps: [
            { day: 0, subject: "Welcome to Medical Imaging Study Hub!", type: "welcome", body: "Thank you for joining! Here's what you'll find: practice questions, positioning guides, flashcards, and exam simulators." },
            { day: 2, subject: "Your Personalized Study Plan is Ready", type: "study_plan", body: "Based on your exam goals, we've created a customized study plan. Start with the fundamentals and build up." },
            { day: 5, subject: "Top 5 Study Tips for Radiography Students", type: "tips", body: "Master these strategies: spaced repetition, image-based practice, positioning drills, physics concepts, and timed exams." },
            { day: 8, subject: "Practice Makes Perfect: Try Our Artifact Recognition", type: "practice", body: "Can you spot the motion blur? Test your artifact recognition skills with our interactive practice module." },
            { day: 12, subject: "Flashcard Recommendations Based on Your Progress", type: "flashcards", body: "We've curated flashcard sets matching your study areas. Review positioning landmarks, physics formulas, and key terminology." },
            { day: 18, subject: "Ready to Level Up? Unlock Premium Features", type: "upgrade", body: "Get unlimited practice exams, advanced case studies, and personalized analytics. Upgrade to premium today." },
          ]
        },
        {
          name: "Quiz Result Follow-Up",
          trigger: "quiz_result",
          steps: [
            { day: 0, subject: "Your Radiography Readiness Score", type: "quiz_result", body: "Here's your detailed score breakdown and personalized recommendations based on your quiz results." },
            { day: 3, subject: "Strengthen Your Weak Areas", type: "remediation", body: "Based on your quiz, focus on these areas to improve your readiness score." },
            { day: 7, subject: "Retake the Quiz and See Your Progress", type: "retake", body: "It's been a week — retake the readiness quiz to measure your improvement!" },
          ]
        },
        {
          name: "Study Plan Follow-Up",
          trigger: "study_plan",
          steps: [
            { day: 1, subject: "Your Study Plan: Week 1 Tasks", type: "reminder", body: "Here are your study tasks for this week. Stay on track!" },
            { day: 7, subject: "Week 1 Check-In: How Did It Go?", type: "checkin", body: "Review your first week and adjust your plan if needed." },
          ]
        },
        {
          name: "Practice Question Usage",
          trigger: "practice_questions",
          steps: [
            { day: 1, subject: "Great Start! Keep Practicing", type: "encouragement", body: "You've started practicing — consistency is key to exam success." },
            { day: 5, subject: "Track Your Progress Over Time", type: "progress", body: "See how your scores are improving across different topics." },
          ]
        },
        {
          name: "Flashcard Usage",
          trigger: "flashcard_usage",
          steps: [
            { day: 1, subject: "Flashcard Study Tips for Maximum Retention", type: "tips", body: "Use spaced repetition and active recall for best results with your flashcards." },
          ]
        }
      ];

      for (const seq of defaults) {
        const existing = await pool.query(`SELECT id FROM imaging_nurture_sequences WHERE trigger = $1 LIMIT 1`, [seq.trigger]);
        if (existing.rows.length === 0) {
          await pool.query(
            `INSERT INTO imaging_nurture_sequences (id, name, trigger, steps, is_active, created_at, updated_at)
             VALUES (gen_random_uuid(), $1, $2, $3, true, NOW(), NOW())`,
            [seq.name, seq.trigger, JSON.stringify(seq.steps)]
          );
        }
      }
      res.json({ ok: true, seeded: defaults.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/imaging/marketing-events", async (req, res) => {
    try {
      const { eventType, page, sessionId, leadId, metadata } = req.body;
      if (!eventType) return res.status(400).json({ error: "eventType required" });
      await pool.query(
        `INSERT INTO imaging_marketing_events (id, event_type, page, session_id, lead_id, metadata, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())`,
        [eventType, page || null, sessionId || null, leadId || null, metadata ? JSON.stringify(metadata) : "{}"]
      );
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging/marketing-analytics", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { days = "30" } = req.query;
      const daysNum = Number(days);

      const safeDays = Math.max(1, Math.min(365, Math.floor(daysNum)));
      const cutoff = `NOW() - INTERVAL '${safeDays} days'`;

      const [
        totalLeads,
        leadsBySource,
        leadsByDay,
        eventsByType,
        topPages,
        quizStarts,
        signups,
        referralCount,
        nurtureStats,
        studyPlanCount,
      ] = await Promise.all([
        pool.query(`SELECT COUNT(*)::int as total FROM imaging_leads WHERE created_at > ${cutoff}`),
        pool.query(`SELECT source, COUNT(*)::int as count FROM imaging_leads WHERE created_at > ${cutoff} GROUP BY source ORDER BY count DESC`),
        pool.query(`SELECT DATE(created_at) as date, COUNT(*)::int as count FROM imaging_leads WHERE created_at > ${cutoff} GROUP BY DATE(created_at) ORDER BY date`),
        pool.query(`SELECT event_type, COUNT(*)::int as count FROM imaging_marketing_events WHERE created_at > ${cutoff} GROUP BY event_type ORDER BY count DESC`),
        pool.query(`SELECT page, COUNT(*)::int as count FROM imaging_marketing_events WHERE page IS NOT NULL AND created_at > ${cutoff} GROUP BY page ORDER BY count DESC LIMIT 20`),
        pool.query(`SELECT COUNT(*)::int as count FROM imaging_marketing_events WHERE event_type = 'quiz_start' AND created_at > ${cutoff}`),
        pool.query(`SELECT COUNT(*)::int as count FROM imaging_leads WHERE source = 'signup' AND created_at > ${cutoff}`),
        pool.query(`SELECT COUNT(*)::int as count FROM imaging_referrals WHERE created_at > ${cutoff}`),
        pool.query(`SELECT status, COUNT(*)::int as count FROM imaging_nurture_enrollments GROUP BY status`),
        pool.query(`SELECT COUNT(*)::int as count FROM imaging_study_plans WHERE created_at > ${cutoff}`),
      ]);

      res.json({
        totalLeads: totalLeads.rows[0]?.total || 0,
        leadsBySource: leadsBySource.rows,
        leadsByDay: leadsByDay.rows,
        eventsByType: eventsByType.rows,
        topPages: topPages.rows,
        quizStarts: quizStarts.rows[0]?.count || 0,
        signups: signups.rows[0]?.count || 0,
        referralCount: referralCount.rows[0]?.count || 0,
        nurtureStats: nurtureStats.rows,
        studyPlanCount: studyPlanCount.rows[0]?.count || 0,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/imaging/study-plans", async (req, res) => {
    try {
      const { email, examType, examDate, hoursPerWeek, confidenceLevel } = req.body;
      if (!examType || !hoursPerWeek || !confidenceLevel) {
        return res.status(400).json({ error: "examType, hoursPerWeek, and confidenceLevel are required" });
      }

      const planData = generateStudyPlan(examType, examDate, hoursPerWeek, confidenceLevel);

      let leadId = null;
      if (email) {
        const leadResult = await pool.query(`SELECT id FROM imaging_leads WHERE email = $1`, [email]);
        if (leadResult.rows.length > 0) {
          leadId = leadResult.rows[0].id;
        }
      }

      const result = await pool.query(
        `INSERT INTO imaging_study_plans (id, email, lead_id, exam_type, exam_date, hours_per_week, confidence_level, plan_data, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING id`,
        [email || null, leadId, examType, examDate || null, hoursPerWeek, confidenceLevel, JSON.stringify(planData)]
      );

      await pool.query(
        `INSERT INTO imaging_marketing_events (id, event_type, page, metadata, created_at)
         VALUES (gen_random_uuid(), 'study_plan_generated', '/medical-imaging/study-plan-generator', $1, NOW())`,
        [JSON.stringify({ examType, confidenceLevel })]
      ).catch(() => {});

      res.json({ id: result.rows[0].id, plan: planData });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/imaging/quiz-submit", async (req, res) => {
    try {
      const { answers, email, name } = req.body;
      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: "Answers array required" });
      }

      const quizQuestions = getReadinessQuizQuestions();
      let correct = 0;
      const breakdown: Record<string, { correct: number; total: number }> = {};

      answers.forEach((answer: any, idx: number) => {
        const q = quizQuestions[idx];
        if (!q) return;
        const cat = q.category;
        if (!breakdown[cat]) breakdown[cat] = { correct: 0, total: 0 };
        breakdown[cat].total++;
        if (answer === q.correctIndex) {
          correct++;
          breakdown[cat].correct++;
        }
      });

      const totalScore = Math.round((correct / quizQuestions.length) * 100);

      const recommendations = [];
      for (const [cat, data] of Object.entries(breakdown)) {
        const pct = Math.round((data.correct / data.total) * 100);
        if (pct < 60) {
          recommendations.push({ category: cat, score: pct, level: "needs-improvement", suggestion: `Focus on ${cat} — review fundamentals and practice more questions.` });
        } else if (pct < 80) {
          recommendations.push({ category: cat, score: pct, level: "developing", suggestion: `Good progress in ${cat} — keep practicing to solidify your knowledge.` });
        } else {
          recommendations.push({ category: cat, score: pct, level: "proficient", suggestion: `Strong in ${cat} — maintain with periodic review.` });
        }
      }

      let leadId = null;
      if (email) {
        const quizDataStr = JSON.stringify({ breakdown, recommendations });
        const leadRes = await pool.query(
          `INSERT INTO imaging_leads (id, email, name, source, trigger, quiz_score, quiz_data, created_at, updated_at)
           VALUES (gen_random_uuid(), $1, $2, 'readiness_quiz', 'quiz_result', $3, $4, NOW(), NOW())
           ON CONFLICT (email) DO UPDATE SET quiz_score = $3, quiz_data = $4, name = COALESCE($2, imaging_leads.name), updated_at = NOW()
           RETURNING id`,
          [email, name || null, totalScore, quizDataStr]
        ).catch((err) => { console.error("Quiz lead upsert error:", err); return null; });
        if (leadRes) leadId = leadRes.rows[0]?.id;
      }

      await pool.query(
        `INSERT INTO imaging_marketing_events (id, event_type, page, lead_id, metadata, created_at)
         VALUES (gen_random_uuid(), 'quiz_complete', '/radiography-readiness-quiz', $1, $2, NOW())`,
        [leadId, JSON.stringify({ score: totalScore })]
      ).catch(() => {});

      res.json({ score: totalScore, correct, total: quizQuestions.length, breakdown, recommendations });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging/quiz-questions", (_req, res) => {
    res.json(getReadinessQuizQuestions().map(q => ({
      question: q.question,
      options: q.options,
      category: q.category,
    })));
  });

  app.post("/api/imaging/referrals", async (req, res) => {
    try {
      const { referrerEmail, referredEmail } = req.body;
      if (!referrerEmail || !referredEmail) return res.status(400).json({ error: "Both emails required" });
      if (referrerEmail === referredEmail) return res.status(400).json({ error: "Cannot refer yourself" });

      const referrer = await pool.query(`SELECT id, referral_code FROM imaging_leads WHERE email = $1`, [referrerEmail]);
      if (referrer.rows.length === 0) return res.status(404).json({ error: "Referrer not found" });

      const existing = await pool.query(`SELECT id FROM imaging_referrals WHERE referrer_code = $1 AND referred_email = $2`, [referrer.rows[0].referral_code, referredEmail]);
      if (existing.rows.length > 0) return res.status(400).json({ error: "Already referred" });

      await pool.query(
        `INSERT INTO imaging_referrals (id, referrer_email, referrer_code, referred_email, status, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, 'pending', NOW())`,
        [referrerEmail, referrer.rows[0].referral_code, referredEmail]
      );

      res.json({ ok: true, referralCode: referrer.rows[0].referral_code });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging/referral-status/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const lead = await pool.query(`SELECT referral_code FROM imaging_leads WHERE referral_code = $1`, [code]);
      if (lead.rows.length === 0) return res.status(404).json({ error: "Not found" });

      const referrals = await pool.query(
        `SELECT status, reward_granted, created_at FROM imaging_referrals WHERE referrer_code = $1 ORDER BY created_at DESC`,
        [code]
      );

      const count = referrals.rows.filter((r: any) => r.status === "completed").length;
      const rewards = [];
      if (count >= 3) rewards.push({ threshold: 3, reward: "Unlock Flashcard Deck", unlocked: true });
      else rewards.push({ threshold: 3, reward: "Unlock Flashcard Deck", unlocked: false });
      if (count >= 5) rewards.push({ threshold: 5, reward: "Unlock Practice Exam", unlocked: true });
      else rewards.push({ threshold: 5, reward: "Unlock Practice Exam", unlocked: false });
      if (count >= 10) rewards.push({ threshold: 10, reward: "Premium Drills (7 days)", unlocked: true });
      else rewards.push({ threshold: 10, reward: "Premium Drills (7 days)", unlocked: false });

      res.json({
        referralCode: lead.rows[0].referral_code,
        referrals: referrals.rows,
        completedCount: count,
        rewards,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imaging/content-carousels", async (_req, res) => {
    try {
      const [questions, flashcards, positioning, physics] = await Promise.all([
        pool.query(`SELECT id, stem, body_system, difficulty, tags FROM imaging_questions WHERE status = 'published' ORDER BY created_at DESC LIMIT 20`).catch(() => ({ rows: [] })),
        pool.query(`SELECT id, front, category, difficulty FROM imaging_flashcards WHERE status = 'published' ORDER BY created_at DESC LIMIT 20`).catch(() => ({ rows: [] })),
        pool.query(`SELECT id, projection_name, body_region, slug FROM imaging_positioning_entries WHERE status = 'published' ORDER BY created_at DESC LIMIT 10`).catch(() => ({ rows: [] })),
        pool.query(`SELECT id, title, category, slug FROM imaging_physics_topics WHERE status = 'published' ORDER BY created_at DESC LIMIT 10`).catch(() => ({ rows: [] })),
      ]);

      res.json({
        mostPopular: questions.rows.slice(0, 6),
        bestForBeginners: questions.rows.filter((q: any) => q.difficulty <= 2).slice(0, 6),
        imagePractice: flashcards.rows.filter((f: any) => f.category?.includes("Image") || f.category?.includes("Artifact")).slice(0, 6),
        positioningPractice: positioning.rows.slice(0, 6),
        quickReviewFlashcards: flashcards.rows.slice(0, 6),
        physicsTopics: physics.rows.slice(0, 6),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}

async function checkAndGrantReferralRewards(referrerCode: string) {
  try {
    const result = await pool.query(
      `SELECT COUNT(*)::int as count FROM imaging_referrals WHERE referrer_code = $1 AND status = 'completed'`,
      [referrerCode]
    );
    const count = result.rows[0]?.count || 0;
    const rewards: string[] = [];
    if (count >= 3) rewards.push("flashcard_deck");
    if (count >= 5) rewards.push("practice_exam");
    if (count >= 10) rewards.push("premium_drills_7d");

    for (const reward of rewards) {
      await pool.query(
        `UPDATE imaging_referrals SET reward_granted = $1
         WHERE id = (SELECT id FROM imaging_referrals WHERE referrer_code = $2 AND reward_granted IS NULL AND status = 'completed' LIMIT 1)`,
        [reward, referrerCode]
      ).catch((err) => { console.error("Referral reward update error:", err); });
    }
  } catch (e) {
    console.error("Referral reward check error:", e);
  }
}

function generateStudyPlan(examType: string, examDate: string | null, hoursPerWeek: number, confidenceLevel: string) {
  const examNames: Record<string, string> = {
    "arrt-radiography": "ARRT Radiography",
    "camrt-radiography": "CAMRT Radiography",
    "arrt-ct": "ARRT CT",
    "arrt-mri": "ARRT MRI",
    "general": "General Radiography",
  };

  const weeksAvailable = examDate ? Math.max(1, Math.ceil((new Date(examDate).getTime() - Date.now()) / (7 * 24 * 60 * 60 * 1000))) : 12;
  const intensity = confidenceLevel === "low" ? "intensive" : confidenceLevel === "medium" ? "moderate" : "maintenance";

  const topics = [
    { name: "Radiation Protection & Safety", weight: 0.18, difficulty: "medium" },
    { name: "Equipment Operation & Quality Control", weight: 0.12, difficulty: "medium" },
    { name: "Image Production & Evaluation", weight: 0.20, difficulty: "high" },
    { name: "Radiographic Procedures & Positioning", weight: 0.25, difficulty: "high" },
    { name: "Patient Care & Education", weight: 0.15, difficulty: "low" },
    { name: "Image Artifacts & Troubleshooting", weight: 0.10, difficulty: "medium" },
  ];

  const weeks = [];
  const totalWeeks = Math.min(weeksAvailable, 16);

  for (let w = 1; w <= totalWeeks; w++) {
    const phase = w <= Math.ceil(totalWeeks * 0.3) ? "Foundation" :
                  w <= Math.ceil(totalWeeks * 0.7) ? "Deep Study" : "Review & Practice";

    const weekTopics = topics
      .filter((_t, i) => {
        if (phase === "Foundation") return i >= 4 || i === 0;
        if (phase === "Deep Study") return true;
        return true;
      })
      .slice(0, phase === "Foundation" ? 3 : 4);

    const hoursPerTopic = Math.round((hoursPerWeek / weekTopics.length) * 10) / 10;

    weeks.push({
      week: w,
      phase,
      topics: weekTopics.map(t => ({
        name: t.name,
        hours: hoursPerTopic,
        activities: phase === "Foundation"
          ? ["Read lesson content", "Review flashcards", "Complete 10 practice questions"]
          : phase === "Deep Study"
          ? ["Study positioning guides", "Practice artifact recognition", "Complete 20 practice questions", "Review weak areas"]
          : ["Full practice exam", "Review missed questions", "Flashcard rapid review", "Timed drills"],
      })),
    });
  }

  return {
    examType,
    examName: examNames[examType] || examType,
    examDate,
    hoursPerWeek,
    confidenceLevel,
    intensity,
    totalWeeks,
    weeks,
    recommendedResources: [
      { type: "lessons", label: "Radiographic Positioning Lessons", link: "/medical-imaging/canada/lessons" },
      { type: "flashcards", label: "Imaging Flashcard Decks", link: "/medical-imaging/canada/flashcards" },
      { type: "practice", label: "Practice Exam Simulator", link: "/medical-imaging/canada/exam-simulator" },
      { type: "positioning", label: "Positioning Reference Guide", link: "/medical-imaging/canada/positioning" },
      { type: "physics", label: "Physics Review Topics", link: "/medical-imaging/canada/physics" },
    ],
  };
}

function getReadinessQuizQuestions() {
  return [
    {
      question: "What is the primary purpose of using a grid in radiography?",
      options: ["To increase patient dose", "To reduce scatter radiation reaching the image receptor", "To increase exposure time", "To magnify the image"],
      correctIndex: 1,
      category: "Basic Knowledge",
    },
    {
      question: "Which of the following controls radiographic density/brightness?",
      options: ["kVp", "mAs", "SID", "Focal spot size"],
      correctIndex: 1,
      category: "Basic Knowledge",
    },
    {
      question: "What is the standard SID for a chest radiograph?",
      options: ["36 inches", "40 inches", "48 inches", "72 inches"],
      correctIndex: 3,
      category: "Basic Knowledge",
    },
    {
      question: "For an AP projection of the shoulder, the central ray is directed to:",
      options: ["The acromioclavicular joint", "1 inch inferior to the coracoid process", "The mid-clavicle", "The glenohumeral joint"],
      correctIndex: 1,
      category: "Positioning Familiarity",
    },
    {
      question: "Which position best demonstrates the right SI joints?",
      options: ["AP", "Left posterior oblique (LPO)", "Right posterior oblique (RPO)", "Lateral"],
      correctIndex: 1,
      category: "Positioning Familiarity",
    },
    {
      question: "The Waters method is used to demonstrate which anatomy?",
      options: ["Mastoid processes", "Maxillary sinuses", "Zygomatic arches", "Temporomandibular joints"],
      correctIndex: 1,
      category: "Positioning Familiarity",
    },
    {
      question: "For a lateral projection of the lumbar spine, the patient is positioned:",
      options: ["Prone", "Supine", "On the affected side", "With knees flexed and a support under the waist"],
      correctIndex: 3,
      category: "Positioning Familiarity",
    },
    {
      question: "Motion artifact on a radiograph appears as:",
      options: ["Dark spots", "Blurred or streaked image", "White lines", "Grid lines"],
      correctIndex: 1,
      category: "Artifact Recognition",
    },
    {
      question: "What causes a grid cutoff artifact?",
      options: ["Patient motion", "Improper grid alignment or centering", "Overexposure", "Underexposure"],
      correctIndex: 1,
      category: "Artifact Recognition",
    },
    {
      question: "A double-exposure artifact is caused by:",
      options: ["Using the wrong kVp", "Exposing the same image receptor twice", "Using a damaged grid", "Incorrect SID"],
      correctIndex: 1,
      category: "Artifact Recognition",
    },
    {
      question: "Which artifact appears as a white tree-like branching pattern on a CR image?",
      options: ["Phantom image", "Static discharge artifact", "Fog", "Pi lines"],
      correctIndex: 1,
      category: "Artifact Recognition",
    },
    {
      question: "What is the ALARA principle?",
      options: ["Always Limit And Reduce Artifacts", "As Low As Reasonably Achievable", "Always Look At Radiation Amounts", "Adjusted Limits And Radiation Assessment"],
      correctIndex: 1,
      category: "Basic Knowledge",
    },
    {
      question: "Increasing kVp will primarily affect:",
      options: ["Image contrast", "Image density only", "Patient positioning", "Focal spot size"],
      correctIndex: 0,
      category: "Basic Knowledge",
    },
    {
      question: "For a PA chest radiograph, the patient's chin should be:",
      options: ["Tucked down", "Extended upward", "Turned to the left", "Resting on the Bucky"],
      correctIndex: 1,
      category: "Positioning Familiarity",
    },
    {
      question: "Quantum mottle (noise) on a digital image is caused by:",
      options: ["Too much radiation", "Too little radiation", "Patient motion", "Wrong collimation"],
      correctIndex: 1,
      category: "Artifact Recognition",
    },
  ];
}
