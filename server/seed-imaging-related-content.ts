import { pool } from "./storage";

const TOPIC_TO_CATEGORY: Record<string, string[]> = {
  "Chest": ["Radiographic Positioning"],
  "Abdomen": ["Radiographic Positioning"],
  "Upper Extremity": ["Radiographic Positioning"],
  "Lower Extremity": ["Radiographic Positioning"],
  "Pelvis and Hip": ["Radiographic Positioning"],
  "Spine": ["Radiographic Positioning"],
  "Contrast Media": ["Contrast Media"],
  "Digital Imaging": ["Digital Imaging"],
  "Image Quality": ["Image Production & Evaluation"],
  "Technical Factors": ["Image Production & Evaluation", "Radiation Physics"],
  "Physics Principles": ["Radiation Physics"],
  "X-ray Production": ["Radiation Physics", "Equipment Operation"],
  "X-ray Equipment": ["Equipment Operation"],
  "Radiation Protection": ["Radiation Safety & Protection"],
  "Dose Limits": ["Radiation Safety & Protection"],
  "Radiation Interactions": ["Radiation Physics"],
  "Patient Safety": ["Patient Care"],
  "Infection Control": ["Patient Care"],
  "Emergency Response": ["Patient Care"],
};

const FLASHCARD_CATEGORY_MAP: Record<string, string[]> = {
  "positioning": ["Radiographic Positioning"],
  "anatomy": ["Radiographic Positioning"],
  "physics": ["Radiation Physics"],
  "radiation": ["Radiation Safety & Protection", "Radiation Physics"],
  "ct": ["CT Imaging"],
  "mri": ["MRI Principles"],
  "digital": ["Digital Imaging"],
  "contrast": ["Contrast Media"],
  "mammography": ["Mammography"],
  "fluoroscopy": ["Fluoroscopy"],
  "quality": ["Quality Control"],
  "pediatric": ["Pediatric Imaging"],
  "equipment": ["Equipment Operation"],
  "image": ["Image Production & Evaluation"],
  "patient": ["Patient Care"],
};

async function mapRelatedContent() {
  console.log("Mapping related content to imaging encyclopedia entries...\n");

  const questions = await pool.query(
    `SELECT id, topic FROM imaging_questions`
  );
  console.log(`Found ${questions.rows.length} imaging questions`);

  const flashcards = await pool.query(
    `SELECT id, category, front, modality FROM imaging_flashcards`
  );
  console.log(`Found ${flashcards.rows.length} imaging flashcards`);

  const entries = await pool.query(
    `SELECT id, slug, category FROM encyclopedia_entries WHERE profession = 'imaging' AND status = 'published'`
  );
  console.log(`Found ${entries.rows.length} imaging encyclopedia entries\n`);

  const categoryEntries: Record<string, string[]> = {};
  for (const entry of entries.rows) {
    if (!categoryEntries[entry.category]) categoryEntries[entry.category] = [];
    categoryEntries[entry.category].push(entry.id);
  }

  const entryQuestionIds: Record<string, Set<string>> = {};
  const entryFlashcardIds: Record<string, Set<string>> = {};

  for (const q of questions.rows) {
    const categories = TOPIC_TO_CATEGORY[q.topic] || [];
    for (const cat of categories) {
      const entryIds = categoryEntries[cat] || [];
      for (const entryId of entryIds) {
        if (!entryQuestionIds[entryId]) entryQuestionIds[entryId] = new Set();
        entryQuestionIds[entryId].add(q.id);
      }
    }
  }

  for (const fc of flashcards.rows) {
    const text = `${fc.category || ""} ${fc.front || ""} ${fc.modality || ""}`.toLowerCase();
    for (const [keyword, categories] of Object.entries(FLASHCARD_CATEGORY_MAP)) {
      if (text.includes(keyword)) {
        for (const cat of categories) {
          const entryIds = categoryEntries[cat] || [];
          for (const entryId of entryIds) {
            if (!entryFlashcardIds[entryId]) entryFlashcardIds[entryId] = new Set();
            entryFlashcardIds[entryId].add(fc.id);
          }
        }
      }
    }
  }

  let updated = 0;
  for (const entry of entries.rows) {
    const qIds = entryQuestionIds[entry.id] ? [...entryQuestionIds[entry.id]] : [];
    const fIds = entryFlashcardIds[entry.id] ? [...entryFlashcardIds[entry.id]] : [];

    if (qIds.length > 0 || fIds.length > 0) {
      await pool.query(
        `UPDATE encyclopedia_entries SET
          related_question_ids = $1,
          related_flashcard_ids = $2,
          updated_at = NOW()
         WHERE id = $3`,
        [qIds, fIds, entry.id]
      );
      updated++;
    }
  }

  console.log(`Updated ${updated} entries with related content IDs`);

  const stats = await pool.query(
    `SELECT category,
       COUNT(*)::int AS total,
       COUNT(*) FILTER (WHERE array_length(related_question_ids, 1) > 0)::int AS with_questions,
       COUNT(*) FILTER (WHERE array_length(related_flashcard_ids, 1) > 0)::int AS with_flashcards
     FROM encyclopedia_entries
     WHERE profession = 'imaging' AND status = 'published'
     GROUP BY category ORDER BY category`
  );
  console.log("\nRelated content mapping by category:");
  for (const row of stats.rows) {
    console.log(`  ${row.category}: ${row.with_questions}/${row.total} with questions, ${row.with_flashcards}/${row.total} with flashcards`);
  }
}

mapRelatedContent()
  .then(() => {
    console.log("\nDone!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Failed:", err);
    process.exit(1);
  });
