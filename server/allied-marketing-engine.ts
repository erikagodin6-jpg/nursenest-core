import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import { queryParamString, routeParamString } from "./route-params";

const ALLIED_PROFESSIONS = [
  { slug: "pharmacy-tech", label: "Pharmacy Technician", exam: "PTCB/ExCPT", shortLabel: "PharmTech" },
  { slug: "respiratory-therapy", label: "Respiratory Therapy", exam: "RRT/TMC", shortLabel: "RRT" },
  { slug: "paramedic", label: "Paramedic", exam: "NREMT", shortLabel: "Paramedic" },
  { slug: "medical-lab-technologist", label: "Medical Lab Technologist", exam: "MLT/ASCP", shortLabel: "MLT" },
  { slug: "medical-imaging", label: "Medical Imaging (Radiology)", exam: "ARRT/CAMRT", shortLabel: "Imaging" },
  { slug: "ultrasound", label: "Ultrasound Technologist", exam: "ARDMS", shortLabel: "Ultrasound" },
  { slug: "physical-therapy-assistant", label: "Physical Therapy Assistant", exam: "PTA/NPTE", shortLabel: "PTA" },
  { slug: "occupational-therapy-assistant", label: "Occupational Therapy Assistant", exam: "COTA/NBCOT", shortLabel: "OTA" },
];

const BLOG_TOPICS: Record<string, string[]> = {
  "pharmacy-tech": [
    "How to Pass the PTCB Exam on Your First Try",
    "Top 50 Pharmacy Technician Practice Questions",
    "Dosage Calculations Made Easy for Pharmacy Techs",
    "Sterile Compounding: Complete Study Guide",
    "Controlled Substances: DEA Schedules Explained",
    "Pharmacy Technician Salary and Career Outlook",
    "Common Pharmacy Abbreviations You Must Know",
    "Top 200 Drugs Every Pharmacy Tech Should Know",
    "Medication Safety and Error Prevention Guide",
    "IV Admixture Preparation for Pharmacy Techs",
  ],
  "respiratory-therapy": [
    "How to Pass the RRT Exam: Complete Guide",
    "ABG Interpretation for Respiratory Therapists",
    "Ventilator Modes Explained: A to Z Guide",
    "Oxygen Delivery Devices: Complete Comparison",
    "COPD Management for Respiratory Therapists",
    "Pulmonary Function Testing Guide",
    "Neonatal Respiratory Care Essentials",
    "Airway Management Techniques for RRTs",
    "Respiratory Therapy Career Path and Salary",
    "Critical Care Ventilation Strategies",
  ],
  "paramedic": [
    "How to Pass the NREMT Paramedic Exam",
    "Trauma Assessment: Primary and Secondary Survey",
    "ACLS Algorithms Every Paramedic Must Know",
    "Prehospital Pharmacology Quick Reference",
    "12-Lead ECG Interpretation for Paramedics",
    "Pediatric Emergencies in the Field",
    "Stroke Recognition and Prehospital Care",
    "Types of Shock: Recognition and Treatment",
    "Airway Management in Prehospital Settings",
    "Paramedic Career Guide: PCP to ACP",
  ],
  "medical-lab-technologist": [
    "How to Pass the ASCP MLT Exam",
    "Complete Blood Count: Interpretation Guide",
    "Blood Bank Procedures and ABO Typing",
    "Clinical Chemistry: Key Lab Values Explained",
    "Microbiology for Medical Lab Technologists",
    "Urinalysis: Complete Interpretation Guide",
    "Hematology Case Studies for MLT Students",
    "Order of Draw: Complete Phlebotomy Guide",
    "Quality Control in the Clinical Laboratory",
    "MLT Career Path and Certification Guide",
  ],
  "medical-imaging": [
    "How to Pass the ARRT Radiography Exam",
    "Radiographic Positioning: Complete Guide",
    "Radiation Protection Principles for Techs",
    "CT Scan Protocols and Procedures",
    "MRI Safety and Contraindications Guide",
    "Image Artifact Recognition and Prevention",
    "Contrast Media: Types and Reactions",
    "Pediatric Radiography Positioning Tips",
    "Radiography Career Outlook and Salary",
    "Digital Imaging Quality Assurance",
  ],
  "ultrasound": [
    "How to Pass the ARDMS SPI Exam",
    "Abdominal Ultrasound Scanning Protocols",
    "OB/GYN Sonography: Key Measurements",
    "Vascular Ultrasound: Doppler Principles",
    "Echocardiography Basics for Sonographers",
    "Ultrasound Physics: Complete Review Guide",
    "Musculoskeletal Ultrasound Techniques",
    "Breast Ultrasound: BI-RADS Classification",
    "Sonography Career Path and Specializations",
    "Ultrasound Artifacts: Identification Guide",
  ],
  "physical-therapy-assistant": [
    "How to Pass the PTA NPTE Exam",
    "Therapeutic Exercise Fundamentals for PTAs",
    "Gait Analysis and Training Techniques",
    "Modalities in Physical Therapy: Complete Guide",
    "Orthopedic Conditions for PTA Students",
    "Neurological Rehabilitation Techniques",
    "Pediatric Physical Therapy Essentials",
    "Manual Therapy Techniques for PTAs",
    "PTA Career Outlook and Salary Guide",
    "Patient Transfer and Body Mechanics",
  ],
  "occupational-therapy-assistant": [
    "How to Pass the NBCOT COTA Exam",
    "Activities of Daily Living: OTA Assessment Guide",
    "Adaptive Equipment and Assistive Devices",
    "Pediatric Occupational Therapy Interventions",
    "Hand Therapy Fundamentals for COTAs",
    "Cognitive Rehabilitation Techniques",
    "Sensory Integration Therapy Guide",
    "Mental Health OT Interventions",
    "OTA Career Path and Certification Guide",
    "Splinting Techniques for OT Assistants",
  ],
};

const AUTHORITY_PAGES: Record<string, Array<{ type: string; title: string; slug: string; description: string }>> = {};
for (const prof of ALLIED_PROFESSIONS) {
  AUTHORITY_PAGES[prof.slug] = [
    {
      type: "top-questions",
      title: `Top 100 ${prof.label} Exam Questions`,
      slug: `${prof.slug}/top-100-exam-questions`,
      description: `Master the ${prof.exam} exam with our curated list of the top 100 practice questions. Each question includes detailed rationales and clinical pearls.`,
    },
    {
      type: "study-guide",
      title: `Complete ${prof.label} Study Guide`,
      slug: `${prof.slug}/complete-study-guide`,
      description: `Your comprehensive study guide for the ${prof.exam} certification exam. Covers all domains, key concepts, and exam strategies.`,
    },
    {
      type: "ultimate-guide",
      title: `Ultimate Guide to ${prof.label}`,
      slug: `${prof.slug}/ultimate-guide`,
      description: `Everything you need to know about becoming a ${prof.label}. Career path, certification requirements, salary expectations, and study resources.`,
    },
  ];
}

const SOCIAL_MEDIA_TEMPLATES: Record<string, Array<{ platform: string; contentType: string; template: string }>> = {};
for (const prof of ALLIED_PROFESSIONS) {
  SOCIAL_MEDIA_TEMPLATES[prof.slug] = [
    { platform: "instagram", contentType: "study_tip", template: `Study Tip for ${prof.label} students: Focus on {{topic}} - it appears frequently on the ${prof.exam} exam. Save this post for later review.` },
    { platform: "instagram", contentType: "quiz_question", template: `Pop Quiz: {{question}} - Swipe to see the answer and rationale. Tag a fellow ${prof.shortLabel} student.` },
    { platform: "instagram", contentType: "clinical_pearl", template: `Clinical Pearl: {{pearl}} - This is critical for ${prof.label} practice and commonly tested on the ${prof.exam}.` },
    { platform: "tiktok", contentType: "study_tip", template: `${prof.shortLabel} exam tip that could save your grade: {{tip}} #${prof.shortLabel.replace(/\s/g, '')}Student #ExamPrep #HealthcareStudents` },
    { platform: "tiktok", contentType: "quick_review", template: `60-second review: {{topic}} for ${prof.exam} exam prep #${prof.shortLabel.replace(/\s/g, '')} #AlliedHealth #StudyWithMe` },
    { platform: "pinterest", contentType: "infographic", template: `${prof.label} Study Guide: {{topic}} - Complete visual reference for ${prof.exam} exam preparation.` },
    { platform: "pinterest", contentType: "study_checklist", template: `${prof.exam} Exam Checklist: {{checklist}} - Pin this for your study planning.` },
    { platform: "linkedin", contentType: "career_insight", template: `Thinking about a career in ${prof.label}? Here's what you need to know about the ${prof.exam} certification: {{insight}}` },
    { platform: "linkedin", contentType: "industry_update", template: `${prof.label} industry update: {{update}} - Stay current with your continuing education.` },
  ];
}

const CTA_VARIANTS = [
  { id: "start-practicing", text: "Start Practicing Now", style: "primary", icon: "play" },
  { id: "unlock-questions", text: "Unlock Full Question Bank", style: "primary", icon: "lock-open" },
  { id: "free-mock-exam", text: "Try a Free Mock Exam", style: "secondary", icon: "clipboard-check" },
  { id: "download-guide", text: "Download Free Study Guide", style: "outline", icon: "download" },
  { id: "get-practice-questions", text: "Get Free Practice Questions", style: "primary", icon: "help-circle" },
  { id: "join-study-group", text: "Join Our Study Community", style: "secondary", icon: "users" },
];

const EMAIL_CTAS: Record<string, { title: string; subtitle: string; buttonText: string }> = {};
for (const prof of ALLIED_PROFESSIONS) {
  EMAIL_CTAS[prof.slug] = {
    title: `Get Free ${prof.label} Practice Questions`,
    subtitle: `Weekly ${prof.exam} exam prep tips, clinical pearls, and practice questions delivered to your inbox.`,
    buttonText: "Get Free Questions",
  };
}

export function setupAlliedMarketingRoutes(app: Express): void {

  app.get("/api/allied-marketing/professions", (_req: Request, res: Response) => {
    res.json(ALLIED_PROFESSIONS);
  });

  app.get("/api/allied-marketing/blog-topics", (req: Request, res: Response) => {
    const profession = queryParamString(req.query.profession as string | string[] | undefined);
    if (profession && BLOG_TOPICS[profession]) {
      res.json({ profession, topics: BLOG_TOPICS[profession] });
    } else {
      res.json(BLOG_TOPICS);
    }
  });

  app.get("/api/allied-marketing/authority-pages", (req: Request, res: Response) => {
    const profession = queryParamString(req.query.profession as string | string[] | undefined);
    if (profession && AUTHORITY_PAGES[profession]) {
      res.json({ profession, pages: AUTHORITY_PAGES[profession] });
    } else {
      res.json(AUTHORITY_PAGES);
    }
  });

  app.get("/api/allied-marketing/authority-page/:profession/:type", (req: Request, res: Response) => {
    const profession = routeParamString(req.params.profession);
    const type = routeParamString(req.params.type);
    const pages = AUTHORITY_PAGES[profession];
    if (!pages) return res.status(404).json({ error: "Profession not found" });
    const page = pages.find((p: { type: string }) => p.type === type);
    if (!page) return res.status(404).json({ error: "Page type not found" });

    const prof = ALLIED_PROFESSIONS.find(p => p.slug === profession);

    const faqItems = [
      { question: `How many questions are on the ${prof?.exam} exam?`, answer: `The ${prof?.exam} exam typically contains 100-200 questions depending on the specific certification. Check the official exam blueprint for exact numbers.` },
      { question: `What is the passing score for ${prof?.exam}?`, answer: `Passing scores vary by certification body. Most ${prof?.label} certification exams use a scaled scoring system rather than a simple percentage.` },
      { question: `How long should I study for the ${prof?.exam} exam?`, answer: `Most students study 2-4 months for the ${prof?.exam} exam. Create a structured study plan and focus on your weaker areas identified through practice tests.` },
      { question: `What are the best study resources for ${prof?.label}?`, answer: `Use a combination of textbooks, practice questions, flashcards, and mock exams. NurseNest offers comprehensive ${prof?.label} exam prep resources.` },
    ];

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
      description: page.description,
      publisher: { "@type": "EducationalOrganization", name: "NurseNest", url: "https://www.nursenest.ca" },
      educationalLevel: "Professional Certification",
      about: { "@type": "EducationalOccupationalProgram", name: prof?.label, educationalProgramMode: "online" },
      mainEntity: {
        "@type": "FAQPage",
        mainEntity: faqItems.map(faq => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    };

    res.json({
      ...page,
      profession: prof,
      faqItems,
      structuredData,
      ctaVariants: CTA_VARIANTS,
      emailCta: EMAIL_CTAS[profession],
    });
  });

  app.get("/api/allied-marketing/email-ctas", (_req: Request, res: Response) => {
    res.json(EMAIL_CTAS);
  });

  app.get("/api/allied-marketing/cta-variants", (_req: Request, res: Response) => {
    res.json(CTA_VARIANTS);
  });

  app.get("/api/allied-marketing/social-templates", (req: Request, res: Response) => {
    const profession = queryParamString(req.query.profession as string | string[] | undefined);
    const platform = queryParamString(req.query.platform as string | string[] | undefined);
    let templates = SOCIAL_MEDIA_TEMPLATES;
    if (profession && templates[profession]) {
      const filtered = templates[profession];
      if (platform) {
        res.json(filtered.filter((t) => t.platform === platform));
      } else {
        res.json(filtered);
      }
    } else {
      res.json(templates);
    }
  });

  app.post("/api/allied-marketing/generate-social-content", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { profession, platform, contentType, topic } = req.body;
      if (!profession || !platform || !contentType) {
        return res.status(400).json({ error: "profession, platform, and contentType required" });
      }

      const templates = SOCIAL_MEDIA_TEMPLATES[profession];
      if (!templates) return res.status(404).json({ error: "Profession not found" });

      const template = templates.find(t => t.platform === platform && t.contentType === contentType);
      if (!template) return res.status(404).json({ error: "Template not found" });

      const content = template.template
        .replace(/\{\{topic\}\}/g, topic || "key concepts")
        .replace(/\{\{question\}\}/g, topic || "What is the correct procedure?")
        .replace(/\{\{pearl\}\}/g, topic || "Always verify patient identity before any procedure")
        .replace(/\{\{tip\}\}/g, topic || "Review the exam blueprint to prioritize your study areas")
        .replace(/\{\{checklist\}\}/g, topic || "Domain review, practice tests, flashcards")
        .replace(/\{\{insight\}\}/g, topic || "certification requirements and career growth opportunities")
        .replace(/\{\{update\}\}/g, topic || "latest practice guidelines and standards");

      const prof = ALLIED_PROFESSIONS.find(p => p.slug === profession);
      const hashtags = [
        `#${prof?.shortLabel?.replace(/\s/g, '') || profession}`,
        "#AlliedHealth",
        "#ExamPrep",
        `#${prof?.exam?.replace(/\//g, '').replace(/\s/g, '') || "Certification"}`,
        "#HealthcareStudents",
        "#NurseNest",
      ];

      await pool.query(
        `INSERT INTO social_posts (platform, post_type, content, hashtags, status, tier, question_data)
         VALUES ($1, $2, $3, $4, 'draft', 'general', $5)`,
        [platform, `allied_${contentType}`, content, hashtags, JSON.stringify({ profession, contentType, topic })]
      ).catch(() => {});

      res.json({ content, hashtags, platform, profession, contentType });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/allied-marketing/email-capture", async (req: Request, res: Response) => {
    try {
      const { email, profession, source, trigger } = req.body;
      if (!email || !email.includes("@")) return res.status(400).json({ error: "Valid email required" });

      await pool.query(
        `CREATE TABLE IF NOT EXISTS allied_email_captures (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT NOT NULL,
          profession TEXT,
          source TEXT DEFAULT 'allied_page',
          trigger TEXT DEFAULT 'general',
          created_at TIMESTAMP DEFAULT NOW()
        )`
      );

      await pool.query(
        `INSERT INTO allied_email_captures (email, profession, source, trigger)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [email, profession || null, source || "allied_page", trigger || "general"]
      );

      await pool.query(
        `INSERT INTO email_signups (email) VALUES ($1) ON CONFLICT DO NOTHING`,
        [email]
      ).catch(() => {});

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/allied-marketing/track-event", async (req: Request, res: Response) => {
    try {
      const { eventType, profession, page, sessionId, metadata } = req.body;
      if (!eventType) return res.status(400).json({ error: "eventType required" });

      await pool.query(
        `CREATE TABLE IF NOT EXISTS allied_marketing_events (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          event_type TEXT NOT NULL,
          profession TEXT,
          page TEXT,
          session_id TEXT,
          user_id TEXT,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP DEFAULT NOW()
        )`
      );

      const userId = req.headers["x-user-id"] || null;
      await pool.query(
        `INSERT INTO allied_marketing_events (event_type, profession, page, session_id, user_id, metadata)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [eventType, profession || null, page || null, sessionId || null, userId, JSON.stringify(metadata || {})]
      );

      res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/allied-marketing/analytics", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { days = "30" } = req.query;
      const safeDays = Math.max(1, Math.min(365, Math.floor(Number(days))));
      const cutoff = `NOW() - INTERVAL '${safeDays} days'`;

      const [eventsByType, eventsByProfession, topPages, emailCaptures, emailsByProfession] = await Promise.all([
        pool.query(`SELECT event_type, COUNT(*)::int as count FROM allied_marketing_events WHERE created_at > ${cutoff} GROUP BY event_type ORDER BY count DESC`).catch(() => ({ rows: [] })),
        pool.query(`SELECT profession, COUNT(*)::int as count FROM allied_marketing_events WHERE created_at > ${cutoff} AND profession IS NOT NULL GROUP BY profession ORDER BY count DESC`).catch(() => ({ rows: [] })),
        pool.query(`SELECT page, COUNT(*)::int as count FROM allied_marketing_events WHERE page IS NOT NULL AND created_at > ${cutoff} GROUP BY page ORDER BY count DESC LIMIT 20`).catch(() => ({ rows: [] })),
        pool.query(`SELECT COUNT(*)::int as total FROM allied_email_captures WHERE created_at > ${cutoff}`).catch(() => ({ rows: [{ total: 0 }] })),
        pool.query(`SELECT profession, COUNT(*)::int as count FROM allied_email_captures WHERE created_at > ${cutoff} AND profession IS NOT NULL GROUP BY profession ORDER BY count DESC`).catch(() => ({ rows: [] })),
      ]);

      res.json({
        eventsByType: eventsByType.rows,
        eventsByProfession: eventsByProfession.rows,
        topPages: topPages.rows,
        emailCaptures: emailCaptures.rows[0]?.total || 0,
        emailsByProfession: emailsByProfession.rows,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/allied-marketing/progress-report", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const professionStats: Record<string, any> = {};

      for (const prof of ALLIED_PROFESSIONS) {
        const [seoArticles, blogPosts, seoPages, socialPosts, emailCaptures, mockExams, practiceQs] = await Promise.all([
          pool.query(`SELECT COUNT(*)::int as total, COUNT(*) FILTER (WHERE status = 'published')::int as published FROM seo_articles WHERE career_track = $1`, [prof.slug]).catch(() => ({ rows: [{ total: 0, published: 0 }] })),
          pool.query(`SELECT COUNT(*)::int as total FROM content_items WHERE type IN ('blog', 'blog-post', 'article') AND tags @> ARRAY[$1]::text[]`, [prof.slug]).catch(() => ({ rows: [{ total: 0 }] })),
          pool.query(`SELECT COUNT(*)::int as total FROM seo_pages WHERE career_track = $1 AND is_public = true`, [prof.slug]).catch(() => ({ rows: [{ total: 0 }] })),
          pool.query(`SELECT COUNT(*)::int as total FROM social_posts WHERE question_data::text ILIKE $1`, [`%${prof.slug}%`]).catch(() => ({ rows: [{ total: 0 }] })),
          pool.query(`SELECT COUNT(*)::int as total FROM allied_email_captures WHERE profession = $1`, [prof.slug]).catch(() => ({ rows: [{ total: 0 }] })),
          pool.query(`SELECT COUNT(*)::int as total FROM mock_exam_attempts WHERE career_type = $1`, [prof.slug]).catch(() => ({ rows: [{ total: 0 }] })),
          pool.query(`SELECT COUNT(*)::int as total FROM allied_questions WHERE career_type = $1`, [prof.slug]).catch(() => ({ rows: [{ total: 0 }] })),
        ]);

        professionStats[prof.slug] = {
          label: prof.label,
          exam: prof.exam,
          seoArticles: seoArticles.rows[0],
          blogPosts: blogPosts.rows[0]?.total || 0,
          seoPages: seoPages.rows[0]?.total || 0,
          socialPosts: socialPosts.rows[0]?.total || 0,
          emailCaptures: emailCaptures.rows[0]?.total || 0,
          mockExamAttempts: mockExams.rows[0]?.total || 0,
          practiceQuestions: practiceQs.rows[0]?.total || 0,
          authorityPages: AUTHORITY_PAGES[prof.slug]?.length || 0,
          blogTopicsAvailable: BLOG_TOPICS[prof.slug]?.length || 0,
          socialTemplates: SOCIAL_MEDIA_TEMPLATES[prof.slug]?.length || 0,
        };
      }

      const [totalClusters, totalArticles, totalEmails, totalSocial] = await Promise.all([
        pool.query(`SELECT COUNT(*)::int as total FROM seo_clusters WHERE site_context = 'allied'`).catch(() => ({ rows: [{ total: 0 }] })),
        pool.query(`SELECT COUNT(*)::int as total, COUNT(*) FILTER (WHERE status = 'published')::int as published, COALESCE(SUM(word_count), 0)::int as total_words FROM seo_articles WHERE site_context = 'allied'`).catch(() => ({ rows: [{ total: 0, published: 0, total_words: 0 }] })),
        pool.query(`SELECT COUNT(*)::int as total FROM allied_email_captures`).catch(() => ({ rows: [{ total: 0 }] })),
        pool.query(`SELECT COUNT(*)::int as total FROM social_posts WHERE question_data::text ILIKE '%allied%' OR post_type LIKE 'allied_%'`).catch(() => ({ rows: [{ total: 0 }] })),
      ]);

      res.json({
        professions: professionStats,
        summary: {
          totalProfessions: ALLIED_PROFESSIONS.length,
          totalSeoClusters: totalClusters.rows[0]?.total || 0,
          totalSeoArticles: totalArticles.rows[0]?.total || 0,
          publishedArticles: totalArticles.rows[0]?.published || 0,
          totalWords: totalArticles.rows[0]?.total_words || 0,
          totalEmailCaptures: totalEmails.rows[0]?.total || 0,
          totalSocialPosts: totalSocial.rows[0]?.total || 0,
          totalAuthorityPages: ALLIED_PROFESSIONS.length * 3,
          totalBlogTopics: Object.values(BLOG_TOPICS).flat().length,
          totalSocialTemplates: Object.values(SOCIAL_MEDIA_TEMPLATES).flat().length,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/allied-marketing/structured-data/:profession", (req: Request, res: Response) => {
    const profession = routeParamString(req.params.profession);
    const prof = ALLIED_PROFESSIONS.find(p => p.slug === profession);
    if (!prof) return res.status(404).json({ error: "Profession not found" });

    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: "NurseNest",
        url: "https://www.nursenest.ca",
        description: `NurseNest provides comprehensive ${prof.label} exam preparation resources including practice questions, mock exams, flashcards, and study guides.`,
        areaServed: ["Canada", "United States"],
        hasCredential: { "@type": "EducationalOccupationalCredential", credentialCategory: prof.exam },
      },
      {
        "@context": "https://schema.org",
        "@type": "Course",
        name: `${prof.label} Certification Exam Prep`,
        description: `Complete ${prof.exam} exam preparation course with practice questions, mock exams, study guides, and flashcards.`,
        provider: { "@type": "EducationalOrganization", name: "NurseNest", url: "https://www.nursenest.ca" },
        educationalLevel: "Professional Certification",
        about: prof.label,
        inLanguage: "en",
        isAccessibleForFree: true,
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: "PT20H",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `How do I prepare for the ${prof.exam} exam?`,
            acceptedAnswer: { "@type": "Answer", text: `Prepare for the ${prof.exam} exam by using a combination of practice questions, study guides, flashcards, and mock exams. NurseNest offers comprehensive ${prof.label} exam prep resources. Create a study schedule, focus on your weak areas, and take timed practice tests regularly.` },
          },
          {
            "@type": "Question",
            name: `What topics are covered on the ${prof.exam} exam?`,
            acceptedAnswer: { "@type": "Answer", text: `The ${prof.exam} exam covers core competencies for ${prof.label} practice. Review the official exam blueprint for the complete list of topics and their weightings. NurseNest practice questions align with these exam domains.` },
          },
          {
            "@type": "Question",
            name: `How many practice questions should I complete before taking the ${prof.exam} exam?`,
            acceptedAnswer: { "@type": "Answer", text: `We recommend completing at least 500-1000 practice questions before taking the ${prof.exam} exam. Focus on understanding the rationales for both correct and incorrect answers to strengthen your clinical reasoning.` },
          },
        ],
      },
    ];

    res.json({ profession: prof, schemas });
  });

  app.post("/api/allied-marketing/generate-blog-batch", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { profession, count = 5 } = req.body;
      if (!profession) return res.status(400).json({ error: "profession required" });

      const topics = BLOG_TOPICS[profession];
      if (!topics) return res.status(404).json({ error: "Profession not found" });

      const prof = ALLIED_PROFESSIONS.find(p => p.slug === profession);
      const selectedTopics = topics.slice(0, Math.min(count, topics.length));
      const created: any[] = [];

      for (const topic of selectedTopics) {
        const slug = `${profession}/${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

        const existing = await pool.query("SELECT id FROM seo_articles WHERE slug = $1", [slug]);
        if (existing.rows.length > 0) continue;

        const clusterSlug = `${profession}/${profession}-blog-cluster`;
        let clusterId: string;

        const existingCluster = await pool.query("SELECT id FROM seo_clusters WHERE pillar_slug = $1", [clusterSlug]);
        if (existingCluster.rows.length > 0) {
          clusterId = existingCluster.rows[0].id;
        } else {
          const cr = await pool.query(
            `INSERT INTO seo_clusters (keyword, country_mode, exam_tier, pillar_slug, status, site_context, career_track, career_country_mode)
             VALUES ($1, 'BOTH', 'ALL', $2, 'draft', 'allied', $3, 'BOTH')
             ON CONFLICT (pillar_slug) DO UPDATE SET updated_at = NOW() RETURNING id`,
            [`${prof?.label || profession} Blog`, clusterSlug, profession]
          );
          clusterId = cr.rows[0].id;
        }

        await pool.query(
          `INSERT INTO seo_articles (cluster_id, type, status, title, slug, target_keyword, search_intent, site_context, career_track, gating_level)
           VALUES ($1, 'support', 'draft', $2, $3, $2, 'informational', 'allied', $4, 'public')
           ON CONFLICT (slug) DO NOTHING`,
          [clusterId, topic, slug, profession]
        );

        created.push({ topic, slug });
      }

      res.json({ created: created.length, articles: created });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
