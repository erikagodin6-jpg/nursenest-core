import { Pool } from "pg";
import { categoryPages, topicPages, glossaryPages, comparisonPages, studyGuidePages } from "./data/paramedic-seo-pages";
import { paramedicDecks } from "./data/paramedic-flashcards";
import { paramedicScenarios } from "./data/paramedic-scenarios";

const SYSTEM_USER_ID = "system-nursenest";

export async function seedParamedicContent(pool: Pool) {
  try {
    const seoCheck = await pool.query(
      "SELECT COUNT(*)::int AS cnt FROM seo_pages WHERE exam IN ('paramedic','NREMT','COPR')"
    ).catch(() => ({ rows: [{ cnt: 0 }] }));
    if (seoCheck.rows[0].cnt >= 60) {
      console.log(`[Paramedic Seed] Fast-path: ${seoCheck.rows[0].cnt} paramedic SEO pages exist, skipping`);
      return;
    }

    console.log("[Paramedic Seed] Starting paramedic content seeding...");

    const allSeoPages = [
      ...categoryPages,
      ...topicPages,
      ...glossaryPages,
      ...comparisonPages,
      ...studyGuidePages,
    ];

    let seoCount = 0;
    for (const page of allSeoPages) {
      const existing = await pool.query(
        `SELECT id FROM seo_pages WHERE slug = $1 AND language_code = 'en'`,
        [page.slug]
      );
      if (existing.rows.length > 0) continue;

      await pool.query(
        `INSERT INTO seo_pages (id, page_type, exam, language_code, title, slug, meta_title, meta_description, content_html, toc_json, faq_json, internal_links_json, is_public, is_indexable, translation_status, last_updated)
         VALUES (gen_random_uuid(), $1, $2, 'en', $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10::jsonb, true, true, 'en_source', NOW())`,
        [
          page.pageType,
          page.exam,
          page.title,
          page.slug,
          page.metaTitle,
          page.metaDescription,
          page.contentHtml,
          JSON.stringify(page.tocJson),
          JSON.stringify(page.faqJson),
          JSON.stringify(page.internalLinksJson),
        ]
      );
      seoCount++;
    }
    console.log(`[Paramedic Seed] Created ${seoCount} SEO pages (${allSeoPages.length} total processed).`);

    const userCheck = await pool.query(
      `SELECT id FROM users WHERE id = $1`,
      [SYSTEM_USER_ID]
    );
    let ownerId = SYSTEM_USER_ID;
    if (userCheck.rows.length === 0) {
      const fallback = await pool.query(
        `SELECT id FROM users WHERE username = 'NurseNest-System' LIMIT 1`
      );
      if (fallback.rows.length > 0) {
        ownerId = fallback.rows[0].id;
      } else {
        await pool.query(
          `INSERT INTO users (id, username, password, tier, subscription_status)
           VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
          [SYSTEM_USER_ID, "NurseNest-System", "system-no-login", "admin", "active"]
        );
      }
    }

    let deckCount = 0;
    let cardCount = 0;
    for (const deck of paramedicDecks) {
      const existingDeck = await pool.query(
        `SELECT id FROM flashcard_decks WHERE slug = $1 AND owner_id = $2`,
        [deck.slug, ownerId]
      );
      if (existingDeck.rows.length > 0) continue;

      const deckResult = await pool.query(
        `INSERT INTO flashcard_decks (title, slug, description, owner_id, visibility, tags, career_type, is_upgraded, upgraded_limit)
         VALUES ($1, $2, $3, $4, $5, $6::jsonb, 'paramedic', true, 500)
         RETURNING id`,
        [deck.title, deck.slug, deck.description, ownerId, "public", JSON.stringify(deck.tags)]
      );
      const deckId = deckResult.rows[0].id;

      for (let i = 0; i < deck.cards.length; i++) {
        const card = deck.cards[i];
        await pool.query(
          `INSERT INTO deck_flashcards (deck_id, front, back, rationale, sort_order)
           VALUES ($1, $2, $3, $4, $5)`,
          [deckId, card.front, card.back, card.rationale || null, i]
        );
        cardCount++;
      }
      deckCount++;
    }
    console.log(`[Paramedic Seed] Created ${deckCount} flashcard decks with ${cardCount} cards.`);

    let scenarioCount = 0;
    for (const scenario of paramedicScenarios) {
      const existingScenario = await pool.query(
        `SELECT id FROM paramedic_scenarios WHERE slug = $1`,
        [scenario.slug]
      );
      if (existingScenario.rows.length > 0) continue;

      await pool.query(
        `INSERT INTO paramedic_scenarios (title, slug, content_domain, profession_track, region, visibility_tier, difficulty, exam_relevance, category, dispatch_info, scene_description, scene_safety, primary_assessment, secondary_assessment, vital_signs, history, decision_points, correct_interventions, common_errors, debrief, learning_objectives, related_lesson_slugs, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15::jsonb, $16::jsonb, $17::jsonb, $18::text[], $19::text[], $20, $21::text[], $22::text[], 'published')`,
        [
          scenario.title,
          scenario.slug,
          scenario.contentDomain || "paramedic",
          scenario.professionTrack || "General",
          scenario.region || "BOTH",
          scenario.visibilityTier || "free",
          scenario.difficulty || 3,
          scenario.examRelevance || "medium",
          scenario.category,
          scenario.dispatchInfo,
          scenario.sceneDescription,
          scenario.sceneSafety,
          scenario.primaryAssessment,
          scenario.secondaryAssessment,
          JSON.stringify(scenario.vitalSigns),
          JSON.stringify(scenario.history),
          JSON.stringify(scenario.decisionPoints),
          scenario.correctInterventions,
          scenario.commonErrors,
          scenario.debrief,
          scenario.learningObjectives || [],
          scenario.relatedLessonSlugs || [],
        ]
      );
      scenarioCount++;
    }
    console.log(`[Paramedic Seed] Created ${scenarioCount} EMS scenarios.`);

    console.log(`[Paramedic Seed] Paramedic content seeding complete.`);
  } catch (error: any) {
    console.error("[Paramedic Seed] Error seeding paramedic content:", error.message);
  }
}
