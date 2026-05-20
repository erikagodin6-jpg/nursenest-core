import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

const PAGE_TYPES = [
  "study-guide",
  "exam-tips",
  "clinical-scenarios",
  "practice-questions",
  "question-detail",
  "flashcard-detail",
] as const;

type PageType = typeof PAGE_TYPES[number];

const CAREER_TRACKS = [
  { slug: "pharmacy-tech", label: "Pharmacy Technician", exam: "PTCB" },
  { slug: "respiratory-therapy", label: "Respiratory Therapy", exam: "RRT/TMC" },
  { slug: "paramedic", label: "Paramedic", exam: "NREMT" },
  { slug: "medical-lab-technologist", label: "Medical Lab Technologist", exam: "MLT/ASCP" },
  { slug: "medical-imaging", label: "Medical Imaging", exam: "ARRT" },
  { slug: "ultrasound", label: "Ultrasound Technologist", exam: "ARDMS" },
  { slug: "physical-therapy-assistant", label: "Physical Therapy Assistant", exam: "PTA" },
  { slug: "occupational-therapy-assistant", label: "Occupational Therapy Assistant", exam: "OTA" },
  { slug: "nursing", label: "Nursing", exam: "NCLEX" },
  { slug: "social-work", label: "Social Work", exam: "ASWB/OASW" },
  { slug: "psychotherapy", label: "Psychotherapy", exam: "CRPO" },
  { slug: "addictions", label: "Addictions Counselling", exam: "IC&RC/CACCF" },
  { slug: "occupational-therapy", label: "Occupational Therapy", exam: "NBCOT" },
];

function getCareerLabel(slug: string): string {
  return CAREER_TRACKS.find(c => c.slug === slug)?.label || slug;
}

function getCareerExam(slug: string): string {
  return CAREER_TRACKS.find(c => c.slug === slug)?.exam || "";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateStudyGuideSections(title: string, career: string): any[] {
  const exam = getCareerExam(career);
  return [
    { heading: "Overview", content: `This comprehensive study guide covers ${title} for ${getCareerLabel(career)} students preparing for the ${exam} exam. Master the key concepts, clinical applications, and exam strategies.` },
    { heading: "Key Concepts", content: `Understanding ${title} is essential for ${getCareerLabel(career)} practice. This section breaks down the foundational knowledge you need for exam success.` },
    { heading: "Clinical Applications", content: `Learn how ${title} concepts apply in real clinical settings. Understanding practical applications helps reinforce theoretical knowledge.` },
    { heading: "Exam Preparation Tips", content: `Focus on high-yield topics within ${title}. The ${exam} exam frequently tests application-level understanding of these concepts.` },
    { heading: "Common Mistakes to Avoid", content: `Students often confuse key aspects of ${title}. Review these common pitfalls to avoid losing points on exam day.` },
    { heading: "Quick Review Summary", content: `Use this summary as a rapid review tool before your ${exam} exam. Focus on the key points and clinical pearls.` },
  ];
}

function generateExamTipsSections(title: string, career: string): any[] {
  const exam = getCareerExam(career);
  return [
    { heading: "Exam Strategy Overview", content: `Master ${title} on the ${exam} exam with these targeted tips. Understanding the exam format and question patterns is crucial for success.` },
    { heading: "High-Yield Topics", content: `These are the most frequently tested aspects of ${title} on the ${exam} exam. Prioritize these areas in your study sessions.` },
    { heading: "Common Pitfalls", content: `Avoid these common mistakes that students make when answering ${title} questions. Recognizing traps can significantly improve your score.` },
    { heading: "Memorization Techniques", content: `Use mnemonics and memory hooks to retain key facts about ${title}. These techniques help with recall during high-pressure exam situations.` },
    { heading: "Test-Taking Strategies", content: `Apply these specific strategies when encountering ${title} questions on your ${exam} exam. Process of elimination and critical thinking are key.` },
  ];
}

function generateClinicalScenariosSections(title: string, career: string): any[] {
  return [
    { heading: "Patient Presentation", content: `A patient presents with findings related to ${title}. Consider the clinical context and relevant assessment data.` },
    { heading: "Clinical Assessment", content: `Systematic assessment for ${title} involves gathering subjective and objective data. Prioritize your assessment based on clinical urgency.` },
    { heading: "Clinical Reasoning", content: `Apply clinical reasoning frameworks to ${title} scenarios. Consider differential diagnoses and evidence-based decision making.` },
    { heading: "Management Steps", content: `Evidence-based management of ${title} includes initial stabilization, targeted interventions, and ongoing monitoring.` },
    { heading: "Expected Outcomes", content: `Monitor for expected outcomes and potential complications in ${title} management. Documentation and follow-up are essential.` },
  ];
}

function generatePracticeQuestionsSections(title: string, career: string): any[] {
  const exam = getCareerExam(career);
  return [
    { heading: "About These Practice Questions", content: `Test your knowledge of ${title} with these ${exam} exam-style practice questions. Each question includes detailed rationales.` },
    { heading: "Question Format Guide", content: `These questions mirror the format you'll encounter on the ${exam} exam. Practice with multiple choice, select-all-that-apply, and case-based formats.` },
    { heading: "Study Recommendations", content: `After completing these practice questions, review any areas where you struggled. Use the linked study guide and flashcards for additional review.` },
  ];
}

function generateFAQs(title: string, career: string, pageType: string): any[] {
  const exam = getCareerExam(career);
  const careerLabel = getCareerLabel(career);

  const baseFAQs = [
    { q: `What is ${title}?`, a: `${title} is an important concept in ${careerLabel} practice that is frequently tested on the ${exam} exam.` },
    { q: `Why is ${title} important for the ${exam} exam?`, a: `${title} is a high-yield topic on the ${exam} exam. Understanding this concept is essential for clinical practice and exam success.` },
    { q: `How should I study ${title}?`, a: `Start with the fundamental concepts, then practice with exam-style questions. Use flashcards for memorization and clinical scenarios for application.` },
  ];

  if (pageType === "study-guide") {
    baseFAQs.push(
      { q: `How long does it take to master ${title}?`, a: `Most students need 2-4 study sessions to build solid understanding. Regular review with spaced repetition helps retention.` },
      { q: `What related topics should I study alongside ${title}?`, a: `Review the related resources linked below for comprehensive preparation. Many ${exam} questions integrate multiple concepts.` }
    );
  } else if (pageType === "exam-tips") {
    baseFAQs.push(
      { q: `What are the most common ${title} exam questions?`, a: `The ${exam} frequently tests application and analysis-level questions on ${title}. Focus on clinical scenarios rather than simple recall.` }
    );
  }

  return baseFAQs;
}

function generateSiblingLinks(careerTrack: string, topicSlug: string, currentType: string): any[] {
  const siblings: any[] = [];
  for (const pt of PAGE_TYPES) {
    if (pt === currentType || pt === "question-detail" || pt === "flashcard-detail") continue;
    siblings.push({
      pageType: pt,
      label: pt.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      url: `/${careerTrack}/${pt}/${topicSlug}`,
    });
  }
  return siblings;
}

function buildPageRecord(
  pageType: PageType,
  sourceId: string,
  sourceType: string,
  careerTrack: string,
  topicSlug: string,
  title: string,
) {
  const careerLabel = getCareerLabel(careerTrack);
  const exam = getCareerExam(careerTrack);
  const pageSlug = `${careerTrack}/${pageType}/${topicSlug}`;

  const typeLabels: Record<string, string> = {
    "study-guide": "Study Guide",
    "exam-tips": "Exam Tips",
    "clinical-scenarios": "Clinical Scenarios",
    "practice-questions": "Practice Questions",
    "question-detail": "Question Detail",
    "flashcard-detail": "Flashcard Detail",
  };

  const typeLabel = typeLabels[pageType] || pageType;
  const pageTitle = `${title} — ${typeLabel} | ${careerLabel}`;

  let metaTitle = `${title} ${typeLabel} for ${exam} Exam | NurseNest`;
  if (metaTitle.length > 60) metaTitle = `${title} ${typeLabel} | NurseNest`;
  if (metaTitle.length > 60) metaTitle = metaTitle.slice(0, 57) + "...";

  let metaDescription = `${typeLabel} for ${title} — ${careerLabel} ${exam} exam preparation. `;
  if (pageType === "study-guide") metaDescription += `Comprehensive review with key concepts, clinical applications, and exam tips.`;
  else if (pageType === "exam-tips") metaDescription += `Common pitfalls, memorization techniques, and test-taking strategies.`;
  else if (pageType === "clinical-scenarios") metaDescription += `Patient vignettes with clinical reasoning and management steps.`;
  else if (pageType === "practice-questions") metaDescription += `Exam-style questions with detailed rationales and explanations.`;
  else if (pageType === "flashcard-detail") metaDescription += `Quick-review flashcards with concept explanations and practice questions.`;
  else metaDescription += `Detailed study resource for ${exam} exam preparation.`;
  if (metaDescription.length > 155) metaDescription = metaDescription.slice(0, 152) + "...";

  let contentSections: any[];
  switch (pageType) {
    case "study-guide": contentSections = generateStudyGuideSections(title, careerTrack); break;
    case "exam-tips": contentSections = generateExamTipsSections(title, careerTrack); break;
    case "clinical-scenarios": contentSections = generateClinicalScenariosSections(title, careerTrack); break;
    case "practice-questions": contentSections = generatePracticeQuestionsSections(title, careerTrack); break;
    default: contentSections = generateStudyGuideSections(title, careerTrack);
  }

  const faqJson = generateFAQs(title, careerTrack, pageType);
  const siblingLinks = generateSiblingLinks(careerTrack, topicSlug, pageType);

  return {
    pageType,
    sourceContentId: sourceId,
    sourceContentType: sourceType,
    careerTrack,
    slug: pageSlug,
    title: pageTitle,
    metaTitle,
    metaDescription,
    contentSections: JSON.stringify(contentSections),
    faqJson: JSON.stringify(faqJson),
    relatedContentLinks: JSON.stringify([]),
    siblingLinks: JSON.stringify(siblingLinks),
    status: "published",
    gatingLevel: "public",
  };
}

async function generatePagesForContent(
  sourceId: string,
  sourceType: string,
  careerTrack: string,
  topicSlug: string,
  title: string,
): Promise<number> {
  let created = 0;
  const pageTypes: PageType[] = ["study-guide", "exam-tips", "clinical-scenarios", "practice-questions"];

  if (sourceType === "question") {
    const record = buildPageRecord("question-detail", sourceId, sourceType, careerTrack, topicSlug, title);
    await pool.query(
      `INSERT INTO programmatic_pages (page_type, source_content_id, source_content_type, career_track, slug, title, meta_title, meta_description, content_sections, faq_json, related_content_links, sibling_links, status, gating_level)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (slug) DO UPDATE SET title=$6, meta_title=$7, meta_description=$8, content_sections=$9, faq_json=$10, sibling_links=$12, updated_at=NOW()`,
      [record.pageType, record.sourceContentId, record.sourceContentType, record.careerTrack, record.slug, record.title, record.metaTitle, record.metaDescription, record.contentSections, record.faqJson, record.relatedContentLinks, record.siblingLinks, record.status, record.gatingLevel]
    );
    created++;
    return created;
  }

  if (sourceType === "flashcard_deck") {
    const record = buildPageRecord("flashcard-detail", sourceId, sourceType, careerTrack, topicSlug, title);
    await pool.query(
      `INSERT INTO programmatic_pages (page_type, source_content_id, source_content_type, career_track, slug, title, meta_title, meta_description, content_sections, faq_json, related_content_links, sibling_links, status, gating_level)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (slug) DO UPDATE SET title=$6, meta_title=$7, meta_description=$8, content_sections=$9, faq_json=$10, sibling_links=$12, updated_at=NOW()`,
      [record.pageType, record.sourceContentId, record.sourceContentType, record.careerTrack, record.slug, record.title, record.metaTitle, record.metaDescription, record.contentSections, record.faqJson, record.relatedContentLinks, record.siblingLinks, record.status, record.gatingLevel]
    );
    created++;
    return created;
  }

  for (const pt of pageTypes) {
    const record = buildPageRecord(pt, sourceId, sourceType, careerTrack, topicSlug, title);
    await pool.query(
      `INSERT INTO programmatic_pages (page_type, source_content_id, source_content_type, career_track, slug, title, meta_title, meta_description, content_sections, faq_json, related_content_links, sibling_links, status, gating_level)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (slug) DO UPDATE SET title=$6, meta_title=$7, meta_description=$8, content_sections=$9, faq_json=$10, sibling_links=$12, updated_at=NOW()`,
      [record.pageType, record.sourceContentId, record.sourceContentType, record.careerTrack, record.slug, record.title, record.metaTitle, record.metaDescription, record.contentSections, record.faqJson, record.relatedContentLinks, record.siblingLinks, record.status, record.gatingLevel]
    );
    created++;
  }

  return created;
}

async function computeRelatedContentForPage(pageId: string): Promise<number> {
  const pageRes = await pool.query("SELECT * FROM programmatic_pages WHERE id = $1", [pageId]);
  const page = pageRes.rows[0];
  if (!page) return 0;

  const related = await pool.query(
    `SELECT id, title, slug, page_type, career_track FROM programmatic_pages
     WHERE career_track = $1 AND id != $2 AND status = 'published'
     ORDER BY RANDOM() LIMIT 6`,
    [page.career_track, pageId]
  );

  const crossCareer = await pool.query(
    `SELECT id, title, slug, page_type, career_track FROM programmatic_pages
     WHERE career_track != $1 AND page_type = $2 AND status = 'published'
     ORDER BY RANDOM() LIMIT 3`,
    [page.career_track, page.page_type]
  );

  const links = [
    ...related.rows.map((r: any) => ({
      label: r.title,
      url: `/${r.slug}`,
      type: r.page_type,
      careerTrack: r.career_track,
    })),
    ...crossCareer.rows.map((r: any) => ({
      label: r.title,
      url: `/${r.slug}`,
      type: r.page_type,
      careerTrack: r.career_track,
    })),
  ];

  await pool.query(
    "UPDATE programmatic_pages SET related_content_links = $1, updated_at = NOW() WHERE id = $2",
    [JSON.stringify(links), pageId]
  );

  return links.length;
}

async function runFullGeneration(): Promise<{ pagesCreated: number; linksComputed: number; errors: string[] }> {
  let pagesCreated = 0;
  let linksComputed = 0;
  const errors: string[] = [];

  try {
    const lessons = await pool.query(
      `SELECT id, title, slug, COALESCE(
        CASE
          WHEN tags @> ARRAY['pharmacy-tech'] THEN 'pharmacy-tech'
          WHEN tags @> ARRAY['respiratory-therapy'] THEN 'respiratory-therapy'
          WHEN tags @> ARRAY['paramedic'] THEN 'paramedic'
          WHEN tags @> ARRAY['mlt'] THEN 'medical-lab-technologist'
          WHEN tags @> ARRAY['medical-imaging'] THEN 'medical-imaging'
          WHEN tags @> ARRAY['ultrasound'] THEN 'ultrasound'
          WHEN tags @> ARRAY['pta'] THEN 'physical-therapy-assistant'
          WHEN tags @> ARRAY['ota'] THEN 'occupational-therapy-assistant'
          WHEN tags @> ARRAY['social-work'] THEN 'social-work'
          WHEN tags @> ARRAY['psychotherapy'] THEN 'psychotherapy'
          WHEN tags @> ARRAY['addictions'] THEN 'addictions'
          WHEN tags @> ARRAY['occupational-therapy'] THEN 'occupational-therapy'
          ELSE 'nursing'
        END, 'nursing'
      ) AS career_track
      FROM content_items WHERE status = 'published' AND type = 'lesson'`
    );

    for (const lesson of lessons.rows) {
      try {
        const count = await generatePagesForContent(lesson.id, "lesson", lesson.career_track, lesson.slug, lesson.title);
        pagesCreated += count;
      } catch (e: any) {
        errors.push(`Lesson ${lesson.id}: ${e.message}`);
      }
    }

    const questions = await pool.query(
      `SELECT id, stem, topic, body_system,
        COALESCE(career_type, 'nursing') AS career_track
       FROM exam_questions WHERE status = 'published'`
    );

    for (const q of questions.rows) {
      try {
        const topicSlug = slugify(q.topic || q.body_system || `question-${q.id.slice(0, 8)}`);
        const title = q.topic || q.body_system || "Practice Question";
        const careerMap: Record<string, string> = {
          nursing: "nursing",
          pharmacy_tech: "pharmacy-tech",
          respiratory_therapy: "respiratory-therapy",
          paramedic_ems: "paramedic",
          mlt: "medical-lab-technologist",
          radiology: "medical-imaging",
          social_work: "social-work",
          psychotherapy: "psychotherapy",
          addictions: "addictions",
          occupational_therapy: "occupational-therapy",
        };
        const career = careerMap[q.career_track] || q.career_track || "nursing";
        const count = await generatePagesForContent(q.id, "question", career, topicSlug, title);
        pagesCreated += count;
      } catch (e: any) {
        errors.push(`Question ${q.id}: ${e.message}`);
      }
    }

    const decks = await pool.query(
      `SELECT id, title, slug, COALESCE(career_type, 'nursing') AS career_track
       FROM flashcard_decks WHERE visibility = 'public'`
    );

    for (const deck of decks.rows) {
      try {
        const deckSlug = deck.slug || slugify(deck.title);
        const careerMap: Record<string, string> = {
          nursing: "nursing",
          pharmacy_tech: "pharmacy-tech",
          respiratory_therapy: "respiratory-therapy",
          paramedic_ems: "paramedic",
          mlt: "medical-lab-technologist",
          radiology: "medical-imaging",
          social_work: "social-work",
          psychotherapy: "psychotherapy",
          addictions: "addictions",
          occupational_therapy: "occupational-therapy",
        };
        const career = careerMap[deck.career_track] || deck.career_track || "nursing";
        const count = await generatePagesForContent(deck.id, "flashcard_deck", career, deckSlug, deck.title);
        pagesCreated += count;
      } catch (e: any) {
        errors.push(`Deck ${deck.id}: ${e.message}`);
      }
    }

    const allPages = await pool.query("SELECT id FROM programmatic_pages WHERE status = 'published'");
    for (const p of allPages.rows) {
      try {
        const linkCount = await computeRelatedContentForPage(p.id);
        linksComputed += linkCount;
      } catch (e: any) {
        errors.push(`Links for ${p.id}: ${e.message}`);
      }
    }
  } catch (e: any) {
    errors.push(`Generation error: ${e.message}`);
  }

  return { pagesCreated, linksComputed, errors };
}

function mapPage(row: any) {
  return {
    id: row.id,
    pageType: row.page_type,
    sourceContentId: row.source_content_id,
    sourceContentType: row.source_content_type,
    careerTrack: row.career_track,
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    contentSections: typeof row.content_sections === "string" ? JSON.parse(row.content_sections) : (row.content_sections || []),
    faqJson: typeof row.faq_json === "string" ? JSON.parse(row.faq_json) : (row.faq_json || []),
    relatedContentLinks: typeof row.related_content_links === "string" ? JSON.parse(row.related_content_links) : (row.related_content_links || []),
    siblingLinks: typeof row.sibling_links === "string" ? JSON.parse(row.sibling_links) : (row.sibling_links || []),
    status: row.status,
    gatingLevel: row.gating_level,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function registerProgrammaticSeoRoutes(app: Express): void {
  app.get("/api/programmatic/:careerSlug/:pageType/:topicSlug", async (req: Request, res: Response) => {
    try {
      const { careerSlug, pageType, topicSlug } = req.params;
      const slug = `${careerSlug}/${pageType}/${topicSlug}`;
      const result = await pool.query(
        "SELECT * FROM programmatic_pages WHERE slug = $1 AND status = 'published'",
        [slug]
      );
      if (!result.rows[0]) {
        return res.status(404).json({ error: "Page not found" });
      }
      res.json(mapPage(result.rows[0]));
    } catch (e: any) {
      console.error("[ProgrammaticSEO] Page fetch error:", e.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/programmatic/:careerSlug/:pageType", async (req: Request, res: Response) => {
    try {
      const { careerSlug, pageType } = req.params;
      const limit = Math.min(parseInt(String(req.query.limit)) || 50, 200);
      const result = await pool.query(
        "SELECT * FROM programmatic_pages WHERE career_track = $1 AND page_type = $2 AND status = 'published' ORDER BY title ASC LIMIT $3",
        [careerSlug, pageType, limit]
      );
      res.json(result.rows.map(mapPage));
    } catch (e: any) {
      console.error("[ProgrammaticSEO] Error:", e.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/programmatic-seo/stats", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const careerTrack = req.query.careerTrack ? String(req.query.careerTrack) : null;

      let where = "WHERE 1=1";
      const params: any[] = [];
      let idx = 1;
      if (careerTrack) {
        where += ` AND career_track = $${idx++}`;
        params.push(careerTrack);
      }

      const totals = await pool.query(
        `SELECT
          COUNT(*)::int AS total_pages,
          COUNT(*) FILTER (WHERE status = 'published')::int AS published_pages,
          COUNT(*) FILTER (WHERE status = 'draft')::int AS draft_pages,
          COUNT(DISTINCT career_track)::int AS career_tracks,
          COUNT(DISTINCT source_content_id)::int AS source_items
        FROM programmatic_pages ${where}`,
        params
      );

      const byType = await pool.query(
        `SELECT page_type, COUNT(*)::int AS count
         FROM programmatic_pages ${where}
         GROUP BY page_type ORDER BY count DESC`,
        params
      );

      const byCareer = await pool.query(
        `SELECT career_track, COUNT(*)::int AS count
         FROM programmatic_pages ${where}
         GROUP BY career_track ORDER BY count DESC`,
        params
      );

      const linkStats = await pool.query(
        `SELECT
          COUNT(*)::int AS total_pages_with_links,
          COALESCE(SUM(jsonb_array_length(COALESCE(related_content_links, '[]'::jsonb))), 0)::int AS total_related_links,
          COALESCE(SUM(jsonb_array_length(COALESCE(sibling_links, '[]'::jsonb))), 0)::int AS total_sibling_links
        FROM programmatic_pages ${where}`,
        params
      );

      res.json({
        totals: totals.rows[0],
        byType: byType.rows,
        byCareer: byCareer.rows,
        linkStats: linkStats.rows[0],
      });
    } catch (e: any) {
      console.error("[ProgrammaticSEO] Error:", e.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/programmatic-seo/pages", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    try {
      const { careerTrack, pageType, status, limit = "50" } = req.query;
      let query = "SELECT * FROM programmatic_pages WHERE 1=1";
      const params: any[] = [];
      let idx = 1;

      if (careerTrack) { query += ` AND career_track = $${idx++}`; params.push(careerTrack); }
      if (pageType) { query += ` AND page_type = $${idx++}`; params.push(pageType); }
      if (status) { query += ` AND status = $${idx++}`; params.push(status); }
      query += ` ORDER BY created_at DESC LIMIT $${idx++}`;
      params.push(Math.min(parseInt(String(limit)) || 50, 200));

      const result = await pool.query(query, params);
      res.json(result.rows.map(mapPage));
    } catch (e: any) {
      console.error("[ProgrammaticSEO] Error:", e.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  let generationRunning = false;

  app.post("/api/admin/programmatic-seo/generate", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    if (generationRunning) {
      return res.status(409).json({ error: "Generation is already running" });
    }

    generationRunning = true;
    res.json({ ok: true, message: "Generation started. Check stats for progress." });

    runFullGeneration()
      .then(result => {
        console.log(`[ProgrammaticSEO] Generation complete: ${result.pagesCreated} pages, ${result.linksComputed} links, ${result.errors.length} errors`);
        if (result.errors.length > 0) {
          console.warn(`[ProgrammaticSEO] Errors:`, result.errors.slice(0, 10));
        }
      })
      .catch(err => {
        console.error(`[ProgrammaticSEO] Generation failed:`, err.message);
      })
      .finally(() => {
        generationRunning = false;
      });
  });

  app.get("/api/admin/programmatic-seo/generation-status", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    res.json({ running: generationRunning });
  });

  app.get("/api/programmatic-sitemap/:pageType", async (req: Request, res: Response) => {
    try {
      const { pageType } = req.params;
      if (!PAGE_TYPES.includes(pageType as PageType)) {
        return res.status(404).send("Not found");
      }
      const result = await pool.query(
        "SELECT slug, updated_at FROM programmatic_pages WHERE page_type = $1 AND status = 'published' ORDER BY slug",
        [pageType]
      );

      const base = "https://www.nursenest.ca";
      const today = new Date().toISOString().split("T")[0];
      const urls = result.rows.map((row: any) => {
        const lastmod = row.updated_at ? new Date(row.updated_at).toISOString().split("T")[0] : today;
        return `<url><loc>${base}/${row.slug}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`;
      });

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

      res.setHeader("Content-Type", "application/xml");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(xml);
    } catch (e: any) {
      res.status(500).send("Error generating sitemap");
    }
  });
}
