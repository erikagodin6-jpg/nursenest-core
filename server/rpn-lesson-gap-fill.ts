import OpenAI from "openai";
import crypto from "crypto";
import { getPool } from "./db";

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function hashContent(text: string): string {
  return crypto.createHash("sha256").update(text.toLowerCase().trim()).digest("hex");
}

const GAP_LESSONS = [
  { title: "Heart Failure", bodySystem: "Cardiovascular", category: "pathophysiology" },
  { title: "Hypertension", bodySystem: "Cardiovascular", category: "pathophysiology" },
  { title: "Deep Vein Thrombosis", bodySystem: "Cardiovascular", category: "pathophysiology" },
  { title: "Atrial Fibrillation", bodySystem: "Cardiovascular", category: "pathophysiology" },
  { title: "Aortic Aneurysm", bodySystem: "Cardiovascular", category: "pathophysiology" },
  { title: "Coronary Artery Disease", bodySystem: "Cardiovascular", category: "pathophysiology" },
  { title: "Asthma", bodySystem: "Respiratory", category: "pathophysiology" },
  { title: "Pneumonia", bodySystem: "Respiratory", category: "pathophysiology" },
  { title: "Pneumothorax", bodySystem: "Respiratory", category: "pathophysiology" },
  { title: "Pulmonary Embolism", bodySystem: "Respiratory", category: "pathophysiology" },
  { title: "Acute Respiratory Distress Syndrome", bodySystem: "Respiratory", category: "pathophysiology" },
  { title: "Bipolar Disorder", bodySystem: "Mental Health", category: "pathophysiology" },
  { title: "Schizophrenia", bodySystem: "Mental Health", category: "pathophysiology" },
  { title: "Post-Traumatic Stress Disorder", bodySystem: "Mental Health", category: "pathophysiology" },
  { title: "Eating Disorders", bodySystem: "Mental Health", category: "pathophysiology" },
  { title: "Obsessive-Compulsive Disorder", bodySystem: "Mental Health", category: "pathophysiology" },
  { title: "Personality Disorders", bodySystem: "Mental Health", category: "pathophysiology" },
  { title: "Delirium vs Dementia", bodySystem: "Neurological", category: "pathophysiology" },
  { title: "Anticoagulant Therapy", bodySystem: "Hematological", category: "pharmacology" },
  { title: "Insulin Administration", bodySystem: "Endocrine", category: "pharmacology" },
  { title: "Pain Management", bodySystem: "Neurological", category: "fundamentals" },
  { title: "Opioid Safety", bodySystem: "Neurological", category: "pharmacology" },
  { title: "Antibiotic Stewardship", bodySystem: "Immunological", category: "pharmacology" },
  { title: "Sterile Technique", bodySystem: "Immunological", category: "fundamentals" },
  { title: "Wound Dehiscence", bodySystem: "Integumentary", category: "surgical" },
  { title: "Pediatric Asthma", bodySystem: "Pediatrics", category: "pathophysiology" },
  { title: "Croup Management", bodySystem: "Pediatrics", category: "pathophysiology" },
  { title: "Kawasaki Disease", bodySystem: "Pediatrics", category: "pathophysiology" },
  { title: "Cleft Lip and Palate", bodySystem: "Pediatrics", category: "pathophysiology" },
  { title: "Child Abuse Recognition", bodySystem: "Pediatrics", category: "fundamentals" },
  { title: "Burns Classification and Management", bodySystem: "Integumentary", category: "pathophysiology" },
  { title: "Osteoarthritis", bodySystem: "Musculoskeletal", category: "pathophysiology" },
  { title: "Cataracts", bodySystem: "Neurological", category: "pathophysiology" },
  { title: "Otitis Media", bodySystem: "Pediatrics", category: "pathophysiology" },
  { title: "Anaphylaxis Management", bodySystem: "Immunological", category: "pathophysiology" },
];

const LESSON_GENERATION_PROMPT = `You are a senior RPN/LPN nursing educator creating a comprehensive study lesson for NurseNest.

Generate a structured nursing lesson for RPN (Registered Practical Nurse / Licensed Practical Nurse) students.

IMPORTANT: Output MUST be a valid JSON object with this exact structure:
{
  "content": [
    {"type": "heading", "content": "Pathophysiology"},
    {"type": "paragraph", "content": "...detailed pathophysiology explanation..."},
    {"type": "heading", "content": "Risk Factors"},
    {"type": "list", "items": ["risk factor 1", "risk factor 2", ...]},
    {"type": "heading", "content": "Diagnostic Findings"},
    {"type": "list", "items": ["finding 1 with normal/abnormal values", ...]},
    {"type": "heading", "content": "Medical Management"},
    {"type": "list", "items": ["treatment 1", "treatment 2", ...]},
    {"type": "heading", "content": "Priority Nursing Actions"},
    {"type": "list", "items": ["action 1", "action 2", ...]},
    {"type": "heading", "content": "Assessment Findings"},
    {"type": "list", "items": ["finding 1", "finding 2", ...]},
    {"type": "heading", "content": "Signs & Symptoms"},
    {"type": "heading", "content": "Early Signs"},
    {"type": "list", "items": ["sign 1", "sign 2", ...]},
    {"type": "heading", "content": "Late/Emergency Signs"},
    {"type": "list", "items": ["sign 1", "sign 2", ...]},
    {"type": "heading", "content": "Medications"},
    {"type": "medication", "content": "Drug Name (Class)\\nAction: ...\\nSide Effects: ...\\nContraindications: ...\\nNursing Pearl: ..."},
    {"type": "medication", "content": "Drug Name (Class)\\nAction: ...\\nSide Effects: ...\\nContraindications: ...\\nNursing Pearl: ..."},
    {"type": "heading", "content": "Patient Education"},
    {"type": "list", "items": ["teaching point 1", "teaching point 2", ...]},
    {"type": "heading", "content": "Clinical Pearls"},
    {"type": "list", "items": ["pearl 1", "pearl 2", ...]},
    {"type": "heading", "content": "Common Exam Pitfalls"},
    {"type": "list", "items": ["pitfall 1", "pitfall 2", ...]},
    {"type": "heading", "content": "Complications"},
    {"type": "list", "items": ["complication 1", "complication 2", ...]},
    {"type": "heading", "content": "Nursing Interventions"},
    {"type": "list", "items": ["intervention 1", "intervention 2", ...]},
    {"type": "heading", "content": "Documentation Requirements"},
    {"type": "list", "items": ["requirement 1", "requirement 2", ...]}
  ],
  "summary": "Brief 1-2 sentence summary of this lesson",
  "seoTitle": "SEO-optimized title (60 chars max)",
  "seoDescription": "Meta description (155 chars max)",
  "flashcards": [
    {"front": "Question about key concept", "back": "Concise clinical answer"},
    {"front": "Question about key concept", "back": "Concise clinical answer"},
    {"front": "Question about key concept", "back": "Concise clinical answer"},
    {"front": "Question about key concept", "back": "Concise clinical answer"},
    {"front": "Question about key concept", "back": "Concise clinical answer"}
  ]
}

Requirements:
- All content must be clinically accurate for RPN/LPN scope of practice
- Include specific lab values with units (use Canadian/SI units where applicable)
- Include at least 8 items in each list section
- Include at least 2-3 medications with full details
- Include exactly 5 flashcards covering the most testable concepts
- Use evidence-based nursing practice guidelines
- Content should be comprehensive (equivalent to a full textbook chapter section)
- Do NOT include any markdown formatting - use plain text only
- Return ONLY valid JSON, no other text`;

async function generateLesson(topic: string, bodySystem: string): Promise<any> {
  const openai = getOpenAI();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: LESSON_GENERATION_PROMPT },
      {
        role: "user",
        content: `Generate a comprehensive RPN nursing lesson on: ${topic}
Body System: ${bodySystem}
Scope: Practical nursing (RPN/LPN) - focus on assessment, monitoring, medication administration, patient education, and when to escalate to RN/physician.`
      }
    ],
    temperature: 0.7,
    max_tokens: 6000,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error(`No content returned for ${topic}`);
  return JSON.parse(content);
}

async function insertLesson(pool: any, lesson: any, title: string, bodySystem: string, category: string): Promise<string | null> {
  const slug = slugify(title) + "-rpn";
  const id = crypto.randomUUID();

  const contentBody = JSON.stringify(lesson.content);
  if (!contentBody || contentBody === '""' || contentBody === 'null' || contentBody === '{}' || contentBody === '[]') {
    console.warn(`[RPN-GAP-FILL] Skipping lesson "${title}" - empty content body`);
    return null;
  }

  const existingCheck = await pool.query(`SELECT id, title FROM content_items WHERE slug = $1`, [slug]);
  if (existingCheck.rows.length > 0) {
    console.warn(`[RPN-GAP-FILL] Duplicate slug detected: "${slug}" already exists as "${existingCheck.rows[0].title}" (id: ${existingCheck.rows[0].id}). Skipping insert.`);
    return existingCheck.rows[0].id;
  }

  console.log(`[RPN-GAP-FILL] Publishing lesson: title="${title}", slug="${slug}", category="${category}", bodySystem="${bodySystem}", tier=rpn`);

  const result = await pool.query(
    `INSERT INTO content_items (id, title, slug, type, category, body_system, tier, status, tags, summary, content, seo_title, seo_description, auto_publish, clinical_safety_review, region_scope, created_at, updated_at, published_at)
     VALUES ($1, $2, $3, 'lesson', $4, $5, 'rpn', 'published', $6, $7, $8, $9, $10, true, true, 'BOTH', NOW(), NOW(), NOW())
     ON CONFLICT (slug) DO NOTHING
     RETURNING id`,
    [
      id,
      title,
      slug,
      category,
      bodySystem,
      [bodySystem.toLowerCase(), category, "rpn"],
      lesson.summary || `Comprehensive RPN lesson on ${title}`,
      contentBody,
      lesson.seoTitle || `${title} - RPN Nursing Study Guide`,
      lesson.seoDescription || `Learn about ${title} for RPN/LPN exam preparation. Includes pathophysiology, nursing interventions, medications, and clinical pearls.`,
    ]
  );

  return result.rows[0]?.id || id;
}

async function insertFlashcards(pool: any, flashcards: any[], lessonTitle: string, bodySystem: string, lessonSlug: string): Promise<number> {
  let count = 0;
  for (const fc of flashcards) {
    const contentHash = hashContent(fc.front);
    try {
      await pool.query(
        `INSERT INTO flashcard_bank (tier, topic_tag, front, back, status, content_hash, body_system, topic, source_type, lesson_links, flashcard_enabled, region_scope, created_at)
         VALUES ('rpn', $1, $2, $3, 'approved', $4, $5, $6, 'auto_generated', $7, true, 'BOTH', NOW())
         ON CONFLICT (content_hash) DO NOTHING`,
        [
          bodySystem,
          fc.front,
          fc.back,
          contentHash,
          bodySystem,
          lessonTitle,
          JSON.stringify([{ lessonTitle, lessonUrl: `/rpn/lessons/${lessonSlug}` }]),
        ]
      );
      count++;
    } catch (err: any) {
      if (err.code !== "23505") {
        console.error(`  Flashcard insert error: ${err.message}`);
      }
    }
  }
  return count;
}

async function linkToExamQuestions(pool: any, lessonTitle: string, bodySystem: string, lessonSlug: string): Promise<number> {
  try {
    const result = await pool.query(
      `UPDATE exam_questions 
       SET lesson_links = COALESCE(lesson_links, '[]'::jsonb) || $1::jsonb
       WHERE id IN (
         SELECT id FROM exam_questions
         WHERE tier = 'rpn' 
         AND body_system ILIKE $2
         AND (lesson_links IS NULL OR lesson_links::text NOT LIKE $3)
         LIMIT 5
       )`,
      [
        JSON.stringify([{ lessonTitle, lessonUrl: `/rpn/lessons/${lessonSlug}` }]),
        `%${bodySystem}%`,
        `%${lessonSlug}%`,
      ]
    );
    return result.rowCount || 0;
  } catch {
    return 0;
  }
}

export async function runRpnLessonGapFill() {
  const pool = getPool();
  console.log(`[Gap Fill] Starting RPN lesson gap fill - ${GAP_LESSONS.length} lessons to generate`);

  let totalLessons = 0;
  let totalFlashcards = 0;
  let totalLinked = 0;
  const errors: string[] = [];

  for (let i = 0; i < GAP_LESSONS.length; i++) {
    const { title, bodySystem, category } = GAP_LESSONS[i];
    const slug = slugify(title) + "-rpn";
    console.log(`[Gap Fill] (${i + 1}/${GAP_LESSONS.length}) Generating: ${title}`);

    try {
      const existing = await pool.query(
        "SELECT id FROM content_items WHERE slug = $1",
        [slug]
      );
      if (existing.rows.length > 0) {
        console.log(`  Skipping - already exists`);
        continue;
      }

      const lesson = await generateLesson(title, bodySystem);

      const lessonId = await insertLesson(pool, lesson, title, bodySystem, category);
      if (!lessonId) {
        console.warn(`  Lesson skipped (empty content): ${title}`);
        continue;
      }
      totalLessons++;
      console.log(`  Lesson inserted: ${lessonId}`);

      if (lesson.flashcards && Array.isArray(lesson.flashcards)) {
        const fcCount = await insertFlashcards(pool, lesson.flashcards, title, bodySystem, slug);
        totalFlashcards += fcCount;
        console.log(`  ${fcCount} flashcards inserted`);
      }

      const linked = await linkToExamQuestions(pool, title, bodySystem, slug);
      totalLinked += linked;
      if (linked > 0) {
        console.log(`  ${linked} exam questions linked`);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err: any) {
      console.error(`  ERROR generating ${title}: ${err.message}`);
      errors.push(`${title}: ${err.message}`);
    }
  }

  const finalCount = await pool.query(
    "SELECT COUNT(*) as cnt FROM content_items WHERE type = 'lesson' AND tier = 'rpn'"
  );

  console.log(`\n[Gap Fill] === COMPLETE ===`);
  console.log(`  New lessons created: ${totalLessons}`);
  console.log(`  New flashcards created: ${totalFlashcards}`);
  console.log(`  Exam questions linked: ${totalLinked}`);
  console.log(`  Total RPN lessons in dev DB: ${finalCount.rows[0].cnt}`);
  console.log(`  Errors: ${errors.length}`);
  if (errors.length > 0) {
    errors.forEach(e => console.log(`    - ${e}`));
  }

  return {
    newLessons: totalLessons,
    newFlashcards: totalFlashcards,
    linkedQuestions: totalLinked,
    totalRpnLessons: parseInt(finalCount.rows[0].cnt),
    errors,
  };
}

const isMain = process.argv[1]?.includes("rpn-lesson-gap-fill");
if (isMain) {
  runRpnLessonGapFill()
    .then(result => {
      console.log("\nResult:", JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch(err => {
      console.error("Fatal error:", err);
      process.exit(1);
    });
}
