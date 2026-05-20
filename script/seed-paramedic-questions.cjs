const pg = require('pg');
const fs = require('fs');

async function seed() {
  const pool = new pg.Pool({ connectionString: process.env.PROD_DATABASE_URL || process.env.DATABASE_URL });
  
  // 1. Load extracted questions
  const questions = JSON.parse(fs.readFileSync('/tmp/paramedic_questions.json', 'utf8'));
  console.log(`Loaded ${questions.length} paramedic questions`);
  
  // 2. Map difficulty values to numeric 1-5
  function mapDifficulty(d) {
    const m = { 'introductory': 1, 'beginner': 1, 'intermediate': 3, 'advanced': 5, 'mixed': 3 };
    return m[(d || '').toLowerCase()] || 3;
  }
  
  // 3. Map correctAnswer to 0-indexed integer
  function mapCorrectAnswer(q) {
    const ca = q.correctAnswer;
    if (Array.isArray(ca)) {
      // For SATA, find indices of all correct answers
      const indices = ca.map(ans => q.options.indexOf(ans)).filter(i => i >= 0);
      return indices.length > 0 ? indices[0] : 0; // Store first correct for DB (SATA uses distractor_rationales for full answer set)
    }
    if (typeof ca === 'number') return ca;
    if (typeof ca === 'string') {
      const idx = q.options.indexOf(ca);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  }
  
  // 4. Map question type
  function mapQuestionType(qt) {
    const m = {
      'multiple-choice': 'multiple_choice',
      'select-all-that-apply': 'select_all',
      'clinical-scenario': 'multiple_choice',
      'medication-calculation': 'multiple_choice',
      'true-false': 'true_false'
    };
    return m[qt] || 'multiple_choice';
  }
  
  // 5. Map cognitive level from question type  
  function mapCognitiveLevel(qt) {
    if (qt === 'clinical-scenario') return 'application';
    if (qt === 'select-all-that-apply') return 'analysis';
    return 'recall';
  }
  
  // 6. Insert questions in batches
  let inserted = 0;
  let errors = 0;
  const batchId = `paramedic-seed-${Date.now()}`;
  
  for (const q of questions) {
    try {
      const options = JSON.stringify(q.options.map((text, i) => ({ id: i, text })));
      const correctAnswer = mapCorrectAnswer(q);
      const difficulty = mapDifficulty(q.difficulty);
      const questionType = mapQuestionType(q.questionType);
      const cognitiveLevel = mapCognitiveLevel(q.questionType);
      const isFree = q.visibilityTier === 'free';
      
      // Build distractor rationales for SATA
      let distractorRationales = null;
      if (q.questionType === 'select-all-that-apply' && Array.isArray(q.correctAnswer)) {
        const dr = {};
        q.options.forEach((opt, i) => {
          dr[i] = q.correctAnswer.includes(opt) ? 'Correct choice' : 'Incorrect choice';
        });
        distractorRationales = JSON.stringify(dr);
      }
      
      // Build clinical pearls and safety note from tags
      const clinicalPearls = q.tags ? JSON.stringify(q.tags) : null;
      
      await pool.query(`
        INSERT INTO allied_questions (
          career_type, batch_id, stem, options, correct_answer, rationale_long,
          learning_objective, blueprint_category, subtopic, difficulty,
          cognitive_level, question_type, exam_trap, clinical_pearls,
          safety_note, distractor_rationales, is_free, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      `, [
        'paramedic',
        batchId,
        q.questionStem,
        options,
        correctAnswer,
        q.rationale,
        q.relatedTopicSlug || q.category,
        q.category,
        q.subcategory || q.category,
        difficulty,
        cognitiveLevel,
        questionType,
        null, // exam_trap
        clinicalPearls,
        null, // safety_note
        distractorRationales,
        isFree,
        'published'
      ]);
      inserted++;
    } catch(e) {
      errors++;
      if (errors <= 3) console.error('Insert error:', e.message, 'for question:', q.questionStem?.substring(0, 60));
    }
  }
  
  console.log(`\nInserted: ${inserted}`);
  console.log(`Errors: ${errors}`);
  
  // Verify
  const count = await pool.query("SELECT COUNT(*) as total FROM allied_questions WHERE career_type='paramedic'");
  console.log(`Total paramedic questions in DB: ${count.rows[0].total}`);
  
  const catCount = await pool.query("SELECT blueprint_category, COUNT(*) as cnt FROM allied_questions WHERE career_type='paramedic' GROUP BY blueprint_category ORDER BY cnt DESC");
  console.log('\nBy category:');
  catCount.rows.forEach(r => console.log(`  ${r.blueprint_category}: ${r.cnt}`));
  
  const freeCount = await pool.query("SELECT is_free, COUNT(*) as cnt FROM allied_questions WHERE career_type='paramedic' GROUP BY is_free");
  console.log('\nBy visibility:');
  freeCount.rows.forEach(r => console.log(`  ${r.is_free ? 'free' : 'premium'}: ${r.cnt}`));
  
  await pool.end();
}

seed().catch(e => { console.error(e); process.exit(1); });
