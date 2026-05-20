import { createLazyPrimaryPoolProxy } from "./db";
import { fisherYatesShuffle } from "../shared/shuffle";

const pool = createLazyPrimaryPoolProxy();

/* =========================
   TYPES
========================= */

interface Lesson {
  slug: string;
  title: string;
  category: string;
  summary: string;
  body: string;
  objectives: string[];
  keyPoints: string[];
  commonMistakes: string[];
  relatedDeckSlugs: string[];
  certContext: string;
}

/* =========================
   SAFE JSON
========================= */

function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return JSON.stringify({ error: "serialization_failed" });
  }
}

/* =========================
   VALIDATION
========================= */

function validateLesson(lesson: Lesson): boolean {
  if (!lesson.slug || !lesson.title || !lesson.body) return false;
  return true;
}

/* =========================
   CORE INSERT
========================= */

async function insertLesson(lesson: Lesson): Promise<void> {
  if (!validateLesson(lesson)) {
    console.warn(`[Seed] Skipping invalid lesson: ${lesson.slug}`);
    return;
  }

  try {
    await pool.query(
      `
      INSERT INTO lessons (
        slug,
        title,
        category,
        summary,
        body,
        objectives,
        key_points,
        common_mistakes,
        related_deck_slugs,
        cert_context,
        created_at,
        updated_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6::jsonb,$7::jsonb,$8::jsonb,$9::jsonb,$10,NOW(),NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        summary = EXCLUDED.summary,
        body = EXCLUDED.body,
        objectives = EXCLUDED.objectives,
        key_points = EXCLUDED.key_points,
        common_mistakes = EXCLUDED.common_mistakes,
        related_deck_slugs = EXCLUDED.related_deck_slugs,
        cert_context = EXCLUDED.cert_context,
        updated_at = NOW()
      `,
      [
        lesson.slug,
        lesson.title,
        lesson.category,
        lesson.summary,
        lesson.body,
        safeJson(lesson.objectives),
        safeJson(lesson.keyPoints),
        safeJson(lesson.commonMistakes),
        safeJson(lesson.relatedDeckSlugs),
        lesson.certContext,
      ],
    );

    console.log(`[Seed] Upserted lesson: ${lesson.slug}`);
  } catch (e) {
    console.error(`[Seed] Failed lesson ${lesson.slug}`, e);
  }
}

/* =========================
   BULK SEED
========================= */

export async function seedLessons(lessons: Lesson[]): Promise<void> {
  console.log(`[Seed] Starting lesson seed: ${lessons.length} items`);

  const shuffled = fisherYatesShuffle([...lessons]);

  for (const lesson of shuffled) {
    await insertLesson(lesson);
  }

  console.log(`[Seed] Lesson seed complete`);
}

/* =========================
   EXPORT YOUR LESSONS
========================= */

export const LESSONS: Lesson[] = [
  {
    slug: "top-200-drugs",
    title: "Top 200 Drugs: Brand & Generic Names",
    category: "Pharmacology",
    summary:
      "Master commonly prescribed medications including brand/generic pairs and therapeutic uses.",
    body: "FULL CONTENT HERE",
    objectives: ["Identify drug pairs"],
    keyPoints: ["Statins end in -statin"],
    commonMistakes: ["Confusing similar names"],
    relatedDeckSlugs: ["top-200-drugs-deck"],
    certContext: "BOTH",
  },

  {
    slug: "dosage-calculations-fundamentals",
    title: "Dosage Calculations",
    category: "Calculations",
    summary: "Core pharmacy math principles.",
    body: "FULL CONTENT HERE",
    objectives: ["Solve ratios"],
    keyPoints: ["Always convert units"],
    commonMistakes: ["Unit mismatch"],
    relatedDeckSlugs: ["math-deck"],
    certContext: "BOTH",
  },
];

/* =========================
   RUNNER (OPTIONAL)
========================= */

export async function runLessonSeed(): Promise<void> {
  await seedLessons(LESSONS);
}