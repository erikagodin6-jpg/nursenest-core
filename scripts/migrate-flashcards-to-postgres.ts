import { pool } from "../server/storage";
import crypto from "crypto";

type StaticFlashcardData = {
  id: string;
  type: "question" | "term";
  question: string;
  options?: string[];
  correctIndex?: number;
  answer: string;
  category: string;
  difficulty: number;
  image?: string;
  optionRationales?: string[];
  clinicalPearl?: string;
  detailedRationale?: string;
};

function sha32(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex").slice(0, 32);
}

function optionLetter(i: number): string {
  return String.fromCharCode(65 + i);
}

function coerceNumber(value: any): number | undefined {
  if (value === null || value === undefined) return undefined;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : undefined;
}

async function ensureFlashcardIndexes(): Promise<void> {
  await pool.query(`
    ALTER TABLE flashcard_bank ADD COLUMN IF NOT EXISTS sort_order integer;

    CREATE INDEX IF NOT EXISTS idx_flashcard_bank_source_type ON flashcard_bank(source_type);
    CREATE INDEX IF NOT EXISTS idx_flashcard_bank_static_filters ON flashcard_bank(status, flashcard_enabled, source_type, tier);
    CREATE INDEX IF NOT EXISTS idx_flashcard_bank_body_system ON flashcard_bank(body_system);
    CREATE INDEX IF NOT EXISTS idx_flashcard_bank_topic_tag ON flashcard_bank(topic_tag);
    CREATE INDEX IF NOT EXISTS idx_flashcard_bank_difficulty ON flashcard_bank(difficulty);

    CREATE INDEX IF NOT EXISTS idx_flashcard_bank_tags_json_gin ON flashcard_bank USING GIN (tags_json);
  `);
}

const DECK_IMPORTS: Array<{
  deckKey: string;
  modulePath: string;
  exportName: string;
  tier: "free" | "rpn" | "rn" | "np" | "admin";
  sourceType: string;
}> = [
  { deckKey: "rn", modulePath: "../client/src/data/flashcards-rn", exportName: "rnFlashcards", tier: "rn", sourceType: "static_rn" },
  { deckKey: "icuCriticalCare", modulePath: "../client/src/data/flashcards-icu-critical-care", exportName: "icuCriticalCareFlashcards", tier: "rn", sourceType: "static_icuCriticalCare" },

  { deckKey: "np", modulePath: "../client/src/data/flashcards-np", exportName: "npFlashcards", tier: "np", sourceType: "static_np" },
  { deckKey: "npPatho", modulePath: "../client/src/data/flashcards-np-patho", exportName: "npPathoFlashcards", tier: "np", sourceType: "static_npPatho" },
  { deckKey: "npEnrichment1", modulePath: "../client/src/data/flashcards-np-enrichment-1", exportName: "npFlashcardsEnrichment1", tier: "np", sourceType: "static_npEnrichment1" },
  { deckKey: "npEnrichment2", modulePath: "../client/src/data/flashcards-np-enrichment-2", exportName: "npFlashcardsEnrichment2", tier: "np", sourceType: "static_npEnrichment2" },
  { deckKey: "npEnrichment3", modulePath: "../client/src/data/flashcards-np-enrichment-3", exportName: "npFlashcardsEnrichment3", tier: "np", sourceType: "static_npEnrichment3" },
  { deckKey: "npEnrichment4", modulePath: "../client/src/data/flashcards-np-enrichment-4", exportName: "npFlashcardsEnrichment4", tier: "np", sourceType: "static_npEnrichment4" },
  { deckKey: "npEnrichment5", modulePath: "../client/src/data/flashcards-np-enrichment-5", exportName: "npFlashcardsEnrichment5", tier: "np", sourceType: "static_npEnrichment5" },
  { deckKey: "npEnrichment6", modulePath: "../client/src/data/flashcards-np-enrichment-6", exportName: "npFlashcardsEnrichment6", tier: "np", sourceType: "static_npEnrichment6" },
  { deckKey: "npSubspecialty", modulePath: "../client/src/data/flashcards-np-subspecialties", exportName: "npSubspecialtyFlashcards", tier: "np", sourceType: "static_npSubspecialty" },

  { deckKey: "rpnExpansion", modulePath: "../client/src/data/flashcards-rpn-expansion", exportName: "rpnExpansionFlashcards", tier: "rpn", sourceType: "static_rpnExpansion" },
  { deckKey: "rnExpansion2", modulePath: "../client/src/data/flashcards-rn-expansion-2", exportName: "rnExpansion2Flashcards", tier: "rn", sourceType: "static_rnExpansion2" },
];

async function main() {
  const deckFilter = process.env.FLASHCARD_DECK_KEYS?.trim()
    ? new Set(process.env.FLASHCARD_DECK_KEYS.split(",").map((s) => s.trim()).filter(Boolean))
    : null;

  console.log(`[flashcards-migration] Starting import. Deck filter: ${deckFilter ? Array.from(deckFilter).join(",") : "(all)"}`);
  await ensureFlashcardIndexes();

  let grandInserted = 0;
  let grandFailures = 0;

  for (const deck of DECK_IMPORTS) {
    if (deckFilter && !deckFilter.has(deck.deckKey)) continue;

    console.log(`\n[flashcards-migration] Importing deck=${deck.deckKey} (${deck.sourceType})`);
    const before = await pool.query(`SELECT COUNT(*)::int as c FROM flashcard_bank WHERE source_type = $1 AND status = 'published' AND flashcard_enabled = true`, [deck.sourceType]);
    const beforeCount = before.rows[0]?.c || 0;

    const mod: any = await import(deck.modulePath);
    const extracted: StaticFlashcardData[] = mod?.[deck.exportName];
    const cards = Array.isArray(extracted) ? extracted : [];

    let failures = 0;
    let attempted = 0;

    const upsertSql = `
      INSERT INTO flashcard_bank (
        id, tier, source_type, topic_tag,
        front, back, tags_json, status, content_hash, question_type,
        options, correct_answer, rationale_correct, distractor_rationales,
        clinical_takeaway, exam_pearl, rationale_media, lesson_links,
        difficulty, body_system, topic, subtopic, region_scope, flashcard_enabled,
        category, career_type, blueprint_category, sort_order
      ) VALUES (
        $1,$2,$3,$4,
        $5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,
        $15,$16,$17,$18,
        $19,$20,$21,$22,$23,$24,
        $25,$26,$27,$28
      )
      ON CONFLICT (id) DO UPDATE SET
        tier = EXCLUDED.tier,
        source_type = EXCLUDED.source_type,
        topic_tag = EXCLUDED.topic_tag,
        front = EXCLUDED.front,
        back = EXCLUDED.back,
        tags_json = EXCLUDED.tags_json,
        status = EXCLUDED.status,
        content_hash = EXCLUDED.content_hash,
        question_type = EXCLUDED.question_type,
        options = EXCLUDED.options,
        correct_answer = EXCLUDED.correct_answer,
        rationale_correct = EXCLUDED.rationale_correct,
        distractor_rationales = EXCLUDED.distractor_rationales,
        clinical_takeaway = EXCLUDED.clinical_takeaway,
        exam_pearl = EXCLUDED.exam_pearl,
        rationale_media = EXCLUDED.rationale_media,
        lesson_links = EXCLUDED.lesson_links,
        difficulty = EXCLUDED.difficulty,
        body_system = EXCLUDED.body_system,
        topic = EXCLUDED.topic,
        subtopic = EXCLUDED.subtopic,
        region_scope = EXCLUDED.region_scope,
        flashcard_enabled = EXCLUDED.flashcard_enabled,
        category = EXCLUDED.category,
        career_type = EXCLUDED.career_type,
        blueprint_category = EXCLUDED.blueprint_category,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    `;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as any;
      if (!card || card.type !== "question") continue;

      attempted++;

      try {
        const id = String(card.id);
        const front = String(card.question ?? "");
        const back = String(card.answer ?? "");
        if (!id || !front || !back) {
          failures++;
          continue;
        }

        const options = Array.isArray(card.options) ? card.options.map(String) : [];
        const correctIndex = typeof card.correctIndex === "number" ? card.correctIndex : coerceNumber(card.correctIndex);

        const correctAnswer = typeof correctIndex === "number" && Number.isFinite(correctIndex) ? JSON.stringify([correctIndex]) : JSON.stringify([]);

        const category = String(card.category ?? "General");
        const difficulty = coerceNumber(card.difficulty) ?? 1;

        const tags = category ? [category] : [];

        const optionRationales = Array.isArray(card.optionRationales) ? card.optionRationales.map((x) => String(x ?? "")) : undefined;

        const rationaleCorrect = (() => {
          if (!optionRationales || correctIndex === undefined) return "";
          const v = optionRationales[correctIndex];
          return typeof v === "string" ? v : "";
        })();

        const distractorRationales: Record<string, string> = {};
        if (optionRationales && typeof correctIndex === "number" && Number.isFinite(correctIndex)) {
          for (let optIdx = 0; optIdx < options.length; optIdx++) {
            if (optIdx === correctIndex) continue;
            const letter = optionLetter(optIdx);
            distractorRationales[letter] = optionRationales[optIdx] ?? "";
          }
        }

        const rationaleMedia = card.image
          ? JSON.stringify([
              {
                imageUrl: String(card.image),
                imageAlt: category,
                imageCaption: "",
                imageDescription: "",
                sortOrder: 0,
              },
            ])
          : JSON.stringify([]);

        const sortOrder = i;

        await pool.query(upsertSql, [
          id,
          deck.tier,
          deck.sourceType,
          category,
          front,
          back,
          JSON.stringify(tags),
          "published",
          sha32(`${deck.deckKey}:${id}:${front}:${back}`),
          "mcq_single",
          JSON.stringify(options),
          correctAnswer,
          rationaleCorrect,
          JSON.stringify(distractorRationales),
          card.clinicalPearl ? String(card.clinicalPearl) : null,
          null,
          rationaleMedia,
          JSON.stringify([]),
          difficulty,
          category, // body_system
          category, // topic
          null, // subtopic
          "BOTH",
          true,
          category, // category
          "nursing",
          category, // blueprint_category
          sortOrder,
        ]);

        grandInserted++;
      } catch (e: any) {
        failures++;
        grandFailures++;
        console.error(`[flashcards-migration] Deck=${deck.deckKey} failed card id=${card?.id}:`, e?.message || e);
      }

      if ((attempted % 250) === 0) {
        console.log(`[flashcards-migration] ${deck.deckKey}: attempted=${attempted}/${cards.length} failures=${failures}`);
      }
    }

    const after = await pool.query(`SELECT COUNT(*)::int as c FROM flashcard_bank WHERE source_type = $1 AND status = 'published' AND flashcard_enabled = true`, [deck.sourceType]);
    const afterCount = after.rows[0]?.c || 0;

    console.log(`[flashcards-migration] Deck=${deck.deckKey} complete. before=${beforeCount} after=${afterCount} attempted=${attempted} failures=${failures}`);
  }

  console.log(`\n[flashcards-migration] Done. attempted cards upserted=${grandInserted} failures=${grandFailures}`);
}

main().catch((e) => {
  console.error("[flashcards-migration] Fatal error:", e?.message || e);
  process.exit(1);
});

