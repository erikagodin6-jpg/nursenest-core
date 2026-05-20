import pg from "pg";
import { getImagingQuestions, getPositioningEntries, getPhysicsTopics, getFlashcards } from "./startup-data-migrations";
const IMAGING_QUESTIONS = getImagingQuestions();
const POSITIONING_ENTRIES = getPositioningEntries();
const PHYSICS_TOPICS = getPhysicsTopics();
const FLASHCARDS = getFlashcards();

export async function seedImagingQuestions(pool: pg.Pool) {
  const client = await pool.connect();
  try {
    const { rows: [{ count: imgCount }] } = await client.query(
      "SELECT count(*) as count FROM imaging_questions WHERE status = 'published'"
    );
    if (parseInt(imgCount) >= 20) {
      console.log(`[Seed] Imaging questions already seeded (${imgCount})`);
      return;
    }
    let created = 0;
    for (const q of IMAGING_QUESTIONS) {
      const existing = await client.query(
        "SELECT id FROM imaging_questions WHERE question=$1 AND country=$2 LIMIT 1",
        [q.question, q.country]
      );
      if (existing.rows.length > 0) continue;
      await client.query(
        `INSERT INTO imaging_questions (question, option_a, option_b, option_c, option_d, correct_answer, rationale, category, topic, difficulty, country, body_part, exam, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'published')`,
        [q.question, q.optionA, q.optionB, q.optionC, q.optionD, q.correctAnswer, q.rationale, q.category, q.topic, q.difficulty, q.country, q.bodyPart || null, q.exam || null]
      );
      created++;
    }
    console.log(`[Seed] Seeded ${created} imaging questions`);
  } finally {
    client.release();
  }
}

export async function seedPositioningEntries(pool: pg.Pool) {
  const client = await pool.connect();
  try {
    const { rows: [{ count: posCount }] } = await client.query(
      "SELECT count(*) as count FROM imaging_positioning_entries WHERE status = 'published'"
    );
    if (parseInt(posCount) >= 10) {
      console.log(`[Seed] Positioning entries already seeded (${posCount})`);
      return;
    }
    let posCreated = 0;
    for (const e of POSITIONING_ENTRIES) {
      const ex = await client.query("SELECT id FROM imaging_positioning_entries WHERE body_part=$1 AND projection_name=$2 LIMIT 1", [e.bodyPart, e.projectionName]);
      if (ex.rows.length > 0) continue;
      const slug = e.projectionName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await client.query(
        `INSERT INTO imaging_positioning_entries (slug, projection_name, body_part, body_region, country, patient_position, central_ray, sid, film_size, anatomy_demonstrated, tips, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'published')`,
        [slug, e.projectionName, e.bodyPart, e.bodyPart, 'canada', e.patientPosition, e.centralRay, e.sid || null, e.filmSize || null, e.anatomyDemonstrated || null, e.tips || null]
      );
      posCreated++;
    }
    console.log(`[Seed] Seeded ${posCreated} positioning entries`);
  } finally {
    client.release();
  }
}

export async function seedPhysicsTopics(pool: pg.Pool) {
  const client = await pool.connect();
  try {
    const { rows: [{ count: physCount }] } = await client.query(
      "SELECT count(*) as count FROM imaging_physics_topics WHERE status = 'published'"
    );
    if (parseInt(physCount) >= 5) {
      console.log(`[Seed] Physics topics already seeded (${physCount})`);
      return;
    }
    let physCreated = 0;
    for (const t of PHYSICS_TOPICS) {
      const ex = await client.query("SELECT id FROM imaging_physics_topics WHERE title=$1 LIMIT 1", [t.title]);
      if (ex.rows.length > 0) continue;
      await client.query(
        `INSERT INTO imaging_physics_topics (title, content, category, key_concepts, formulas, difficulty, status) VALUES ($1,$2,$3,$4,$5,$6,'published')`,
        [t.title, t.content, t.category, t.keyConcepts, JSON.stringify(t.formulas), t.difficulty]
      );
      physCreated++;
    }
    console.log(`[Seed] Seeded ${physCreated} physics topics`);
  } finally {
    client.release();
  }
}

export async function seedImagingFlashcards(pool: pg.Pool) {
  const client = await pool.connect();
  try {
    const { rows: [{ count: fcCount }] } = await client.query(
      "SELECT count(*) as count FROM imaging_flashcards WHERE status = 'published'"
    );
    if (parseInt(fcCount) >= 20) {
      console.log(`[Seed] Flashcards already seeded (${fcCount})`);
      return;
    }
    let fcCreated = 0;
    for (const fc of FLASHCARDS) {
      const ex = await client.query("SELECT id FROM imaging_flashcards WHERE front=$1 LIMIT 1", [fc.front]);
      if (ex.rows.length > 0) continue;
      await client.query(
        `INSERT INTO imaging_flashcards (front, back, category, body_part, difficulty, status) VALUES ($1,$2,$3,$4,$5,'published')`,
        [fc.front, fc.back, fc.category, fc.bodyPart || null, fc.difficulty]
      );
      fcCreated++;
    }
    console.log(`[Seed] Seeded ${fcCreated} flashcards`);
  } finally {
    client.release();
  }
}

export async function seedWaveforms() {
  const { seedWaveformData } = await import("./paramedic-waveform-routes");
  const wfCount = await seedWaveformData();
  if (wfCount > 0) {
    console.log(`[Seed] Seeded ${wfCount} paramedic waveforms`);
  } else {
    console.log(`[Seed] Paramedic waveforms already seeded`);
  }
}
