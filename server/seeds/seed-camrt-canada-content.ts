import { pool } from "../storage";
import {
  generateAllCamrtQuestions,
  generateCamrtFlashcards,
  generateCamrtPositioningEntries,
  generateCamrtArtifactEntries,
  generateCamrtCaseStudies,
  generateCamrtLessons,
  generateCamrtSeoBlueprints,
  generateCamrtImageBriefs,
} from "./camrt-canada-content-data";
import {
  generateSupplementaryQuestions,
  generateSupplementaryFlashcards,
  generateSupplementaryPositioningEntries,
  generateSupplementaryImageBriefs,
  generateBulkQuestions,
  generateBulkQuestions2,
  generateBulkQuestions3,
  generateBulkQuestions4,
  generateBulkQuestions5,
  generateBulkQuestions6,
  generateBulkQuestions7,
} from "./camrt-canada-supplementary";

async function clearExistingCamrtData() {
  console.log("\n--- Clearing existing CAMRT/Canada data ---");
  const deletes = [
    `DELETE FROM imaging_questions WHERE exam = 'CAMRT' AND country = 'canada'`,
    `DELETE FROM imaging_flashcards WHERE category LIKE '%CAMRT%' OR category LIKE '%Artifact Recognition%'`,
    `DELETE FROM imaging_positioning_entries WHERE country = 'canada'`,
    `DELETE FROM imaging_case_studies WHERE modality IS NOT NULL AND title LIKE '%CAMRT%' OR body_part IS NOT NULL`,
    `DELETE FROM imaging_physics_topics WHERE category IS NOT NULL`,
    `DELETE FROM seo_clusters WHERE country_mode = 'CA' AND exam_name = 'CAMRT'`,
    `DELETE FROM image_assets WHERE 'CAMRT' = ANY(tags) OR 'canada' = ANY(tags)`,
  ];
  for (const sql of deletes) {
    try {
      const r = await pool.query(sql);
      console.log(`  Deleted ${r.rowCount} rows: ${sql.substring(0, 60)}...`);
    } catch (err: any) {
      console.log(`  Skip: ${err.message.substring(0, 80)}`);
    }
  }
}

async function seedQuestions() {
  const allQuestions = [
    ...generateAllCamrtQuestions(),
    ...generateSupplementaryQuestions(),
    ...generateBulkQuestions(),
    ...generateBulkQuestions2(),
    ...generateBulkQuestions3(),
    ...generateBulkQuestions4(),
    ...generateBulkQuestions5(),
    ...generateBulkQuestions6(),
    ...generateBulkQuestions7(),
  ];
  console.log(`\n--- Seeding ${allQuestions.length} CAMRT Questions ---`);
  let inserted = 0;
  let errors = 0;

  for (const q of allQuestions) {
    try {
      await pool.query(
        `INSERT INTO imaging_questions (
          id, question, option_a, option_b, option_c, option_d,
          correct_answer, rationale, modality, body_part, category,
          difficulty, exam, country, topic, status, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, 'CAMRT', 'canada', $12, 'published', NOW(), NOW()
        )`,
        [
          q.question, q.optionA, q.optionB, q.optionC, q.optionD,
          q.correctAnswer, q.rationale, q.modality, q.bodyPart, q.category,
          q.difficulty, q.topic,
        ]
      );
      inserted++;
    } catch (err: any) {
      errors++;
      if (errors <= 5) console.error(`  Error: ${err.message}`);
    }
  }
  console.log(`  Inserted: ${inserted}, Errors: ${errors}`);
  return inserted;
}

async function seedFlashcards() {
  const cards = [
    ...generateCamrtFlashcards(),
    ...generateSupplementaryFlashcards(),
  ];
  console.log(`\n--- Seeding ${cards.length} CAMRT Flashcards ---`);
  let inserted = 0;
  let errors = 0;

  for (const c of cards) {
    try {
      await pool.query(
        `INSERT INTO imaging_flashcards (
          id, front, back, modality, body_part, category,
          difficulty, status, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'published', NOW(), NOW()
        )`,
        [c.front, c.back, c.modality, c.bodyPart, c.category, c.difficulty]
      );
      inserted++;
    } catch (err: any) {
      errors++;
      if (errors <= 3) console.error(`  Error: ${err.message}`);
    }
  }
  console.log(`  Inserted: ${inserted}, Errors: ${errors}`);
  return inserted;
}

async function seedPositioningEntries() {
  const entries = [
    ...generateCamrtPositioningEntries(),
    ...generateSupplementaryPositioningEntries(),
  ];
  console.log(`\n--- Seeding ${entries.length} Positioning Drill Entries ---`);
  let inserted = 0;
  let errors = 0;

  for (const e of entries) {
    try {
      await pool.query(
        `INSERT INTO imaging_positioning_entries (
          id, slug, projection_name, body_part, body_region, country,
          exam_relevance, patient_position, body_part_position, central_ray,
          central_ray_direction, film_size, sid, detector_placement,
          collimation_guidance, breathing_instructions, technical_factors,
          anatomy_demonstrated, common_errors, evaluation_criteria,
          clinical_notes, tips, exam_tips, seo_title, seo_description,
          status, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, 'canada', $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21,
          $22, $23, 'published', NOW(), NOW()
        )`,
        [
          e.slug, e.projectionName, e.bodyPart, e.bodyRegion,
          e.examRelevance, e.patientPosition, e.bodyPartPosition, e.centralRay,
          e.centralRayDirection, (e.filmSize || '').substring(0, 50), (e.sid || '').substring(0, 50), e.detectorPlacement,
          e.collimationGuidance, e.breathingInstructions, e.technicalFactors,
          e.anatomyDemonstrated, JSON.stringify(e.commonErrors), e.evaluationCriteria,
          e.clinicalNotes, e.tips, e.examTips, e.seoTitle, e.seoDescription,
        ]
      );
      inserted++;
    } catch (err: any) {
      errors++;
      if (errors <= 3) console.error(`  Error: ${err.message}`);
    }
  }
  console.log(`  Inserted: ${inserted}, Errors: ${errors}`);
  return inserted;
}

async function seedArtifactEntries() {
  const artifacts = generateCamrtArtifactEntries();
  console.log(`\n--- Seeding ${artifacts.length} Artifact Recognition Entries ---`);
  let inserted = 0;
  let errors = 0;

  for (const a of artifacts) {
    try {
      await pool.query(
        `INSERT INTO imaging_flashcards (
          id, front, back, modality, body_part, category,
          difficulty, status, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, 'X-ray', 'General', $3,
          $4, 'published', NOW(), NOW()
        )`,
        [a.front, a.back, `Artifact Recognition - ${a.category}`, a.difficulty]
      );
      inserted++;
    } catch (err: any) {
      errors++;
      if (errors <= 3) console.error(`  Error: ${err.message}`);
    }
  }
  console.log(`  Inserted: ${inserted}, Errors: ${errors}`);
  return inserted;
}

async function seedCaseStudies() {
  const cases = generateCamrtCaseStudies();
  console.log(`\n--- Seeding ${cases.length} Clinical Case Studies ---`);
  let inserted = 0;
  let errors = 0;

  const difficultyMap: Record<string, number> = { easy: 1, medium: 2, hard: 3 };

  for (const c of cases) {
    try {
      const findingsText = JSON.stringify(c.findings);
      const discussionText = JSON.stringify([...c.discussionPoints, { questions: c.questions }]);
      const diffNum = difficultyMap[c.difficulty] || 2;
      const imageUrls = Array.isArray(c.imageRefs) ? c.imageRefs : [];

      await pool.query(
        `INSERT INTO imaging_case_studies (
          id, title, clinical_history, findings, diagnosis, discussion,
          modality, body_part, difficulty, image_urls, status,
          created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9,
          'published', NOW(), NOW()
        )`,
        [
          c.title, c.clinicalHistory, findingsText, c.diagnosis,
          discussionText, c.modality || 'X-ray', c.bodyPart || 'General',
          diffNum, imageUrls,
        ]
      );
      inserted++;
    } catch (err: any) {
      errors++;
      if (errors <= 5) console.error(`  Case study error: ${err.message}`);
    }
  }
  console.log(`  Inserted: ${inserted}, Errors: ${errors}`);
  return inserted;
}

async function seedLessons() {
  const lessons = generateCamrtLessons();
  console.log(`\n--- Seeding ${lessons.length} Structured Lessons ---`);
  let inserted = 0;
  let errors = 0;

  for (const l of lessons) {
    try {
      await pool.query(
        `INSERT INTO imaging_physics_topics (
          id, title, content, category, modality, key_concepts,
          formulas, difficulty, status, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'published', NOW(), NOW()
        )`,
        [
          l.title, l.content, l.category, l.modality,
          l.keyConcepts, JSON.stringify(l.formulas), l.difficulty,
        ]
      );
      inserted++;
    } catch (err: any) {
      errors++;
      if (errors <= 3) console.error(`  Error: ${err.message}`);
    }
  }
  console.log(`  Inserted: ${inserted}, Errors: ${errors}`);
  return inserted;
}

async function seedSeoBlueprints() {
  const blueprints = generateCamrtSeoBlueprints();
  console.log(`\n--- Seeding ${blueprints.length} SEO Blueprints ---`);
  let inserted = 0;
  let errors = 0;

  for (const b of blueprints) {
    try {
      await pool.query(
        `INSERT INTO seo_clusters (
          id, keyword, country_mode, exam_tier, pillar_slug, status,
          notes, site_context, career_track, career_country_mode,
          exam_name, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, 'CA', $2, $3, 'draft', $4,
          'medical_imaging', $5, 'CA', $6, NOW(), NOW()
        )`,
        [b.keyword, b.examTier, b.pillarSlug, b.notes, b.careerTrack, b.examName]
      );
      inserted++;
    } catch (err: any) {
      errors++;
      if (errors <= 3) console.error(`  Error: ${err.message}`);
    }
  }
  console.log(`  Inserted: ${inserted}, Errors: ${errors}`);
  return inserted;
}

async function seedImageBriefs() {
  const briefs = [
    ...generateCamrtImageBriefs(),
    ...generateSupplementaryImageBriefs(),
  ];
  console.log(`\n--- Seeding ${briefs.length} Image Briefs ---`);
  let inserted = 0;
  let errors = 0;

  for (const b of briefs) {
    try {
      await pool.query(
        `INSERT INTO image_assets (
          id, title, description, image_url, modality, body_part, tags,
          clinical_context, status, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7,
          'pending', NOW(), NOW()
        )`,
        [
          (b.seoTitle || '').substring(0, 200),
          b.seoDescription,
          `placeholder://${b.assetType}/${b.bodyRegion}/${b.projection}`.toLowerCase().replace(/\s+/g, '-'),
          b.modality,
          b.bodyRegion,
          [b.assetType, b.projection, 'CAMRT', 'canada'],
          `${b.assetType} - ${b.projection} - ${b.bodyRegion}`,
        ]
      );
      inserted++;
    } catch (err: any) {
      errors++;
      if (errors <= 3) console.error(`  Error: ${err.message}`);
    }
  }
  console.log(`  Inserted: ${inserted}, Errors: ${errors}`);
  return inserted;
}

async function main() {
  console.log("=== CAMRT Canada Content Seeder ===\n");
  console.log("Verifying and clearing existing data...");
  await clearExistingCamrtData();

  const results: Record<string, number> = {};

  results.questions = await seedQuestions();
  results.flashcards = await seedFlashcards();
  results.positioning = await seedPositioningEntries();
  results.artifacts = await seedArtifactEntries();
  results.caseStudies = await seedCaseStudies();
  results.lessons = await seedLessons();
  results.seoBlueprints = await seedSeoBlueprints();
  results.imageBriefs = await seedImageBriefs();

  console.log("\n=== Summary ===");
  for (const [key, count] of Object.entries(results)) {
    console.log(`  ${key}: ${count} inserted`);
  }

  console.log("\n--- Verification ---");
  const qCount = await pool.query(
    `SELECT COUNT(*) FROM imaging_questions WHERE country = 'canada' AND exam = 'CAMRT' AND status = 'published'`
  );
  console.log(`  Published CAMRT questions: ${qCount.rows[0].count}`);

  const fCount = await pool.query(
    `SELECT COUNT(*) FROM imaging_flashcards WHERE status = 'published'`
  );
  console.log(`  Published flashcards (all): ${fCount.rows[0].count}`);

  const pCount = await pool.query(
    `SELECT COUNT(*) FROM imaging_positioning_entries WHERE country = 'canada' AND status = 'published'`
  );
  console.log(`  Published positioning entries: ${pCount.rows[0].count}`);

  const csCount = await pool.query(
    `SELECT COUNT(*) FROM imaging_case_studies WHERE status = 'published'`
  );
  console.log(`  Published case studies: ${csCount.rows[0].count}`);

  const lCount = await pool.query(
    `SELECT COUNT(*) FROM imaging_physics_topics WHERE status = 'published'`
  );
  console.log(`  Published lessons/topics: ${lCount.rows[0].count}`);

  const seoCount = await pool.query(
    `SELECT COUNT(*) FROM seo_clusters WHERE country_mode = 'CA' AND exam_name = 'CAMRT'`
  );
  console.log(`  SEO blueprints: ${seoCount.rows[0].count}`);

  const iaCount = await pool.query(
    `SELECT COUNT(*) FROM image_assets WHERE 'CAMRT' = ANY(tags)`
  );
  console.log(`  Image asset briefs: ${iaCount.rows[0].count}`);

  console.log("\n=== CAMRT Canada Content Seeding Complete! ===\n");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
