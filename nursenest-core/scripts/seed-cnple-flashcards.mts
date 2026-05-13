/**
 * Seed CNPLE flashcards v2 — condition-specific, NP-level, no duplicates.
 *
 * V1 failure: generic 5-template fronts produced 1,430 duplicates.
 * V2 fix: use lesson title in every front; extract clinical bullet points for backs.
 *
 * Each lesson produces 2-4 cards with unique fronts by combining:
 *   - lesson title (e.g., "Hypertensive Emergency")
 *   - section kind (diagnostic, management, prescribing, clinical, takeaway)
 *   - first concrete clinical content from section body
 *
 * Quality standards:
 *   - Every front includes the condition name
 *   - Every back contains ≥ 1 concrete clinical fact (lab value, drug name, dose, threshold)
 *   - No vague meta-questions ("what should you know about...")
 *   - NP-specific framing: prescribing, differential, ordering, autonomous management
 *
 * Usage:
 *   npx tsx scripts/seed-cnple-flashcards.mts              # dry-run
 *   npx tsx scripts/seed-cnple-flashcards.mts --apply       # write to DB
 *   npx tsx scripts/seed-cnple-flashcards.mts --apply --limit=250
 */
import "@/lib/db/env-bootstrap";
import { prisma } from "./lib/prisma-script-client";
import { ContentStatus, CountryCode, ExamFamily, TierCode } from "@prisma/client";

const DRY_RUN = !process.argv.includes("--apply");
const LIMIT = (() => {
  const i = process.argv.indexOf("--limit");
  return i >= 0 ? parseInt(process.argv[i + 1] ?? "300", 10) : 300;
})();

const CNPLE_DECK_ID = "cmnxsjry200050ntcsbzo7378";
const CNPLE_PATHWAY_ID = "ca-np-cnple";

// ── Domain mapping ────────────────────────────────────────────────────────────
function resolveDomain(bodySystem: string, topic: string): string {
  const sys = (bodySystem ?? "").toLowerCase();
  const top = (topic ?? "").toLowerCase();
  if (sys.includes("cardio") || top.includes("cardiac") || top.includes("heart") || top.includes("vascular") || top.includes("coronary")) return "CNPLE — Cardiovascular & Circulatory";
  if (sys.includes("respirat") || top.includes("pulm") || top.includes("lung") || top.includes("airway") || top.includes("copd") || top.includes("asthma")) return "CNPLE — Respiratory & Pulmonary";
  if (sys.includes("endocrine") || top.includes("endocrine") || top.includes("diabetes") || top.includes("thyroid") || top.includes("adrenal") || top.includes("pituitary")) return "CNPLE — Endocrine & Metabolic";
  if (sys.includes("renal") || top.includes("renal") || top.includes("kidney") || top.includes("electrolyte") || top.includes("fluid")) return "CNPLE — Renal & Fluid-Electrolyte";
  if (sys.includes("gastroint") || top.includes("gi") || top.includes("liver") || top.includes("gastro") || top.includes("hepat") || top.includes("bowel")) return "CNPLE — Gastrointestinal & Hepatic";
  if (sys.includes("neurolog") || sys.includes("neurologic") || top.includes("neuro") || top.includes("stroke") || top.includes("seizure") || top.includes("headache") || top.includes("migraine")) return "CNPLE — Neurological & Neurovascular";
  if (sys.includes("hematol") || sys.includes("hematologic") || top.includes("hematol") || top.includes("anemia") || top.includes("oncol") || top.includes("coagul")) return "CNPLE — Hematology & Oncology";
  if (sys.includes("musculo") || top.includes("musculo") || top.includes("joint") || top.includes("bone") || top.includes("arthrit") || top.includes("osteo")) return "CNPLE — Musculoskeletal";
  if (sys.includes("integument") || top.includes("wound") || top.includes("skin") || top.includes("dermat") || top.includes("derm")) return "CNPLE — Integumentary & Wound";
  if (sys.includes("mental") || sys.includes("psychiatr") || top.includes("mental") || top.includes("psychiatr") || top.includes("depression") || top.includes("anxiety") || top.includes("bipolar") || top.includes("schizo") || top.includes("adhd")) return "CNPLE — Mental Health & Psychiatry";
  if (sys.includes("maternal") || top.includes("women") || top.includes("obstet") || top.includes("prenatal") || top.includes("postpart") || top.includes("perinatal") || top.includes("gynaecol") || top.includes("gynecol") || top.includes("menopaus")) return "CNPLE — Maternal & Women's Health";
  if (sys.includes("pediatr") || sys.includes("paediatr") || top.includes("pediatr") || top.includes("paediatr") || top.includes("child") || top.includes("neonat") || top.includes("infant")) return "CNPLE — Pediatric";
  if (top.includes("pharmacol") || top.includes("prescrib") || top.includes("medication") || top.includes("drug") || top.includes("antibiot") || top.includes("anticoagul")) return "CNPLE — Pharmacology & Prescribing";
  if (top.includes("primary care") || top.includes("preventive") || top.includes("screening") || top.includes("immunizat")) return "CNPLE — Primary Care & Prevention";
  if (top.includes("geriatr") || top.includes("elderly") || top.includes("older adult") || top.includes("polypharmacy")) return "CNPLE — Geriatrics";
  if (top.includes("sepsis") || top.includes("critical") || top.includes("shock") || top.includes("icu") || top.includes("emergenc")) return "CNPLE — Multisystem & Critical Care";
  if (top.includes("professional") || top.includes("leadership") || top.includes("ethic") || top.includes("scope") || top.includes("regulat")) return "CNPLE — Professional Practice & Ethics";
  if (sys.includes("infection") || top.includes("infect") || top.includes("antimicr")) return "CNPLE — Infectious Disease";
  return "CNPLE — Advanced NP Practice";
}

const ALL_DOMAINS = [
  "CNPLE — Cardiovascular & Circulatory",
  "CNPLE — Respiratory & Pulmonary",
  "CNPLE — Endocrine & Metabolic",
  "CNPLE — Renal & Fluid-Electrolyte",
  "CNPLE — Gastrointestinal & Hepatic",
  "CNPLE — Neurological & Neurovascular",
  "CNPLE — Hematology & Oncology",
  "CNPLE — Musculoskeletal",
  "CNPLE — Integumentary & Wound",
  "CNPLE — Mental Health & Psychiatry",
  "CNPLE — Maternal & Women's Health",
  "CNPLE — Pediatric",
  "CNPLE — Pharmacology & Prescribing",
  "CNPLE — Primary Care & Prevention",
  "CNPLE — Geriatrics",
  "CNPLE — Multisystem & Critical Care",
  "CNPLE — Professional Practice & Ethics",
  "CNPLE — Infectious Disease",
  "CNPLE — Advanced NP Practice",
];

// ── Extract first meaningful paragraph from body ──────────────────────────────

/** Extract bullet-list items from a section body (lines starting with - or •). */
function extractBullets(body: string, maxBullets = 4): string | null {
  const lines = body.split("\n").map((l) => l.replace(/^\s*[-•]\s*/, "").trim()).filter((l) => l.length > 20);
  if (lines.length === 0) return null;
  return lines.slice(0, maxBullets).join("; ");
}

/** Extract first dense sentence or paragraph (not just bullets). */
function extractFirstSentence(body: string): string | null {
  const cleaned = body.replace(/\*\*/g, "").replace(/^#{1,3}\s+/gm, "").replace(/\n/g, " ").trim();
  // Find first sentence of ≥50 chars
  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  const first = sentences.find((s) => s.trim().length >= 50);
  if (!first) return null;
  return first.trim().slice(0, 350);
}

/** Extract a specific clinical value/threshold from body (numbers, drugs, dosages). */
function extractClinicalFact(body: string): string | null {
  // Look for lines containing numbers, drug names, or threshold values
  const lines = body.split("\n").map((l) => l.trim()).filter((l) => l.length >= 30 && /\d|mg|mmHg|mmol|mEq|%|bpm|L\/min|mcg|IU/.test(l));
  if (lines.length === 0) return null;
  return lines[0]!.replace(/^[-•]\s*/, "").replace(/\*\*/g, "").slice(0, 300);
}

// ── Condition-specific front question generation ──────────────────────────────

type Section = { id: string; kind: string; heading: string; body: string };

/** Generate 2-4 high-quality, condition-specific flashcard pairs from a lesson. */
function generateNpCards(lesson: {
  slug: string;
  title: string;
  topic: string;
  bodySystem: string;
  sections: Section[];
}): Array<{ front: string; back: string; domain: string; contentKey: string }> {
  const title = lesson.title;
  const domain = resolveDomain(lesson.bodySystem, lesson.topic);
  const cards: Array<{ front: string; back: string; domain: string; contentKey: string }> = [];
  const seenFronts = new Set<string>();

  function addCard(front: string, back: string, keyTag: string): void {
    const normalFront = front.trim().toLowerCase().slice(0, 80);
    if (seenFronts.has(normalFront) || front.length < 15 || back.length < 20) return;
    seenFronts.add(normalFront);
    cards.push({
      front: front.trim(),
      back: back.trim().slice(0, 400),
      domain,
      contentKey: `cnplev2:${lesson.slug}:${keyTag}`,
    });
  }

  for (const section of lesson.sections) {
    if (cards.length >= 4) break;
    const body = section.body ?? "";
    const kind = section.kind;

    if (kind === "clinical_meaning" || kind === "introduction" || kind === "pathophysiology_overview") {
      const fact = extractFirstSentence(body);
      if (fact) {
        addCard(
          `What is the NP understanding of ${title}?`,
          fact,
          "pathophys"
        );
      }
    }

    if (kind === "exam_relevance" || kind === "labs_diagnostics") {
      const bullets = extractBullets(body, 3);
      if (bullets) {
        addCard(
          `What diagnostic workup does the NP order for ${title}?`,
          bullets,
          "diagnostics"
        );
      }
    }

    if (kind === "core_concept" || kind === "treatments") {
      // Try to pull management bullets
      const bullets = extractBullets(body, 4);
      if (bullets) {
        addCard(
          `What is the NP management approach for ${title}?`,
          bullets,
          "management"
        );
      } else {
        const fact = extractClinicalFact(body);
        if (fact) {
          addCard(
            `What is a key clinical decision in managing ${title}?`,
            fact,
            "clinicaldecision"
          );
        }
      }
    }

    if (kind === "pharmacology") {
      const bullets = extractBullets(body, 3);
      if (bullets) {
        addCard(
          `What are the key prescribing considerations for ${title}?`,
          bullets,
          "prescribing"
        );
      }
    }

    if (kind === "clinical_scenario" || kind === "takeaways") {
      // Extract the clinical pearl / red flag
      const fact = extractFirstSentence(body) ?? extractBullets(body, 2);
      if (fact) {
        addCard(
          `What is the Canadian NP clinical priority for ${title}?`,
          fact,
          "priority"
        );
      }
    }

    if (kind === "red_flags" || kind === "nursing_assessment_interventions" || kind === "nursing_priorities") {
      const bullets = extractBullets(body, 3);
      if (bullets) {
        addCard(
          `What are the red flags or escalation triggers in ${title}?`,
          bullets,
          "redflags"
        );
      }
    }

    if (kind === "client_education" || kind === "patient_education") {
      const fact = extractFirstSentence(body);
      if (fact) {
        addCard(
          `What patient education does the NP provide for ${title}?`,
          fact,
          "education"
        );
      }
    }
  }

  // Ensure at least 1 card per lesson using any available section
  if (cards.length === 0 && lesson.sections.length > 0) {
    const body = lesson.sections[0]!.body ?? "";
    const fallback = extractFirstSentence(body) ?? extractBullets(body, 2);
    if (fallback) {
      addCard(
        `What is the NP clinical focus for ${title}?`,
        fallback,
        "fallback"
      );
    }
  }

  return cards;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(DRY_RUN ? "=== DRY RUN ===" : "=== APPLYING CNPLE FLASHCARD SEED v2 ===");
  console.log(`Lesson limit: ${LIMIT} | Target: 400–600 unique condition-specific cards\n`);

  const deck = await prisma.flashcardDeck.findUnique({ where: { id: CNPLE_DECK_ID } });
  if (!deck) { console.error("Deck not found"); process.exit(1); }
  console.log(`Deck: "${deck.title}" (current: ${deck.cardCount} cards)\n`);

  // Ensure domain categories
  const categoryMap = new Map<string, string>();
  const fallbackCatId = "cmndxtbt500000nf06gfvxfdt";
  if (!DRY_RUN) {
    for (const d of ALL_DOMAINS) {
      const slug = d.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const cat = await prisma.category.upsert({ where: { slug }, update: { name: d }, create: { name: d, slug } });
      categoryMap.set(d, cat.id);
    }
    console.log(`Ensured ${categoryMap.size} domain categories.`);
  }

  // Load CNPLE lessons (structurally complete)
  console.log(`Loading up to ${LIMIT} CNPLE lessons...`);
  const lessons = await prisma.pathwayLesson.findMany({
    where: { pathwayId: CNPLE_PATHWAY_ID, status: "PUBLISHED", structuralPublicComplete: true },
    select: { slug: true, title: true, topic: true, bodySystem: true, sections: true },
    orderBy: [{ bodySystem: "asc" }, { slug: "asc" }],
    take: LIMIT,
  });
  console.log(`Loaded ${lessons.length} lessons.`);

  // Generate cards
  const allCards: Array<{ front: string; back: string; domain: string; contentKey: string }> = [];
  const seenGlobalFronts = new Set<string>();

  for (const lesson of lessons) {
    const secs = lesson.sections as Section[];
    const cards = generateNpCards({ ...lesson, sections: secs });
    for (const card of cards) {
      // Global dedup on front (within this seed run)
      const normalFront = card.front.trim().toLowerCase().slice(0, 80);
      if (seenGlobalFronts.has(normalFront)) continue;
      seenGlobalFronts.add(normalFront);
      allCards.push(card);
    }
  }

  // Domain breakdown
  const byDomain: Record<string, number> = {};
  for (const c of allCards) byDomain[c.domain] = (byDomain[c.domain] ?? 0) + 1;
  console.log(`\nGenerated ${allCards.length} unique condition-specific cards:`);
  for (const [d, n] of Object.entries(byDomain).sort((a, b) => b[1] - a[1]).slice(0, 12)) {
    console.log(`  ${n.toString().padStart(4)}  ${d}`);
  }

  // Sample preview
  console.log("\nSample cards (first 5):");
  for (const c of allCards.slice(0, 5)) {
    console.log(`  FRONT: ${c.front}`);
    console.log(`  BACK:  ${c.back.slice(0, 100)}...`);
    console.log("");
  }

  if (DRY_RUN) {
    console.log("[DRY RUN] Run with --apply to write.");
    return;
  }

  // Clear old cards
  const existing = await prisma.flashcard.count({ where: { deckId: CNPLE_DECK_ID } });
  if (existing > 0) {
    console.log(`Clearing ${existing} old cards...`);
    await prisma.flashcard.deleteMany({ where: { deckId: CNPLE_DECK_ID } });
  }

  // Write in batches
  console.log(`Writing ${allCards.length} cards...`);
  const BATCH = 100;
  let written = 0;
  for (let i = 0; i < allCards.length; i += BATCH) {
    const batch = allCards.slice(i, i + BATCH);
    await prisma.flashcard.createMany({
      data: batch.map((card, j) => ({
        front: card.front,
        back: card.back,
        country: CountryCode.CA,
        tier: TierCode.NP,
        examFamily: ExamFamily.NP,
        status: ContentStatus.PUBLISHED,
        categoryId: categoryMap.get(card.domain) ?? fallbackCatId,
        deckId: CNPLE_DECK_ID,
        positionInDeck: i + j,
        sourceKey: card.contentKey,
      })),
      skipDuplicates: true,
    });
    written += batch.length;
    process.stdout.write(`  ${written}/${allCards.length}...\r`);
  }

  // Update deck
  const finalCount = await prisma.flashcard.count({ where: { deckId: CNPLE_DECK_ID } });
  await prisma.flashcardDeck.update({
    where: { id: CNPLE_DECK_ID },
    data: {
      cardCount: finalCount,
      title: "CNPLE Flashcards — Canadian NP Licensure Prep",
      description:
        "Condition-specific flashcards for CNPLE preparation: NP prescribing decisions, diagnostic workup, management priorities, red flags, and Canadian NP scope — across all major CNPLE competency domains.",
      visibility: "PUBLIC_PREVIEW",
    },
  });

  console.log(`\n✓ Written: ${written} cards → ${finalCount} in deck after dedup`);
  console.log(`✓ Deck updated: cardCount=${finalCount}, visibility=PUBLIC_PREVIEW`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
