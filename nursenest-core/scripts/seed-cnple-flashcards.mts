/**
 * Seed CNPLE flashcards from CNPLE lesson sections.
 *
 * Strategy:
 *   - Load published CNPLE lessons from DB (structuralPublicComplete = true)
 *   - Generate Q&A flashcard pairs from each lesson's sections
 *   - Write cards to the CNPLE flashcard deck
 *   - Update deck cardCount and promote to PUBLIC_PREVIEW visibility
 *
 * Usage:
 *   npx tsx scripts/seed-cnple-flashcards.mts              # dry-run
 *   npx tsx scripts/seed-cnple-flashcards.mts --apply       # write to DB
 *   npx tsx scripts/seed-cnple-flashcards.mts --apply --limit=200
 *
 * Target: 500–1000 cards from the first 200 structurally-complete lessons.
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

// ── CNPLE domain mapping (bodySystem + topic → category name) ─────────────────
function resolveDomain(bodySystem: string, topic: string): string {
  const sys = (bodySystem ?? "").toLowerCase();
  const top = (topic ?? "").toLowerCase();

  if (sys.includes("cardio") || top.includes("cardiac") || top.includes("heart") || top.includes("vascular")) return "CNPLE — Cardiovascular & Circulatory";
  if (sys.includes("respirat") || top.includes("pulm") || top.includes("lung") || top.includes("airway")) return "CNPLE — Respiratory & Pulmonary";
  if (sys.includes("endocrine") || top.includes("endocrine") || top.includes("diabetes") || top.includes("thyroid") || top.includes("adrenal")) return "CNPLE — Endocrine & Metabolic";
  if (sys.includes("renal") || top.includes("renal") || top.includes("kidney") || top.includes("electrolyte")) return "CNPLE — Renal & Fluid-Electrolyte";
  if (sys.includes("gastroint") || top.includes("gi") || top.includes("liver") || top.includes("gastro")) return "CNPLE — Gastrointestinal & Hepatic";
  if (sys.includes("neurolog") || top.includes("neuro") || top.includes("stroke") || top.includes("seizure")) return "CNPLE — Neurological & Neurovascular";
  if (sys.includes("hematol") || top.includes("hematol") || top.includes("anemia") || top.includes("oncol")) return "CNPLE — Hematology & Oncology";
  if (sys.includes("musculo") || top.includes("musculo") || top.includes("joint") || top.includes("bone")) return "CNPLE — Musculoskeletal";
  if (sys.includes("integument") || top.includes("wound") || top.includes("skin") || top.includes("dermat")) return "CNPLE — Integumentary & Wound";
  if (sys.includes("mental") || sys.includes("psychiatr") || top.includes("mental") || top.includes("psychiatr") || top.includes("depression") || top.includes("anxiety")) return "CNPLE — Mental Health & Psychiatry";
  if (sys.includes("maternal") || top.includes("women") || top.includes("obstet") || top.includes("prenatal") || top.includes("postpart")) return "CNPLE — Maternal & Women's Health";
  if (sys.includes("pediatr") || top.includes("pediatr") || top.includes("child") || top.includes("neonat")) return "CNPLE — Pediatric";
  if (top.includes("pharmacol") || top.includes("prescrib") || top.includes("medication") || top.includes("drug")) return "CNPLE — Pharmacology & Prescribing";
  if (top.includes("primary care")) return "CNPLE — Primary Care";
  if (top.includes("geriatr")) return "CNPLE — Geriatrics";
  if (top.includes("sepsis") || top.includes("critical") || top.includes("icu") || top.includes("shock")) return "CNPLE — Multisystem & Critical Care";
  if (top.includes("professional") || top.includes("leadership") || top.includes("ethic")) return "CNPLE — Professional Practice";
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
  "CNPLE — Primary Care",
  "CNPLE — Geriatrics",
  "CNPLE — Multisystem & Critical Care",
  "CNPLE — Professional Practice",
  "CNPLE — Advanced NP Practice",
];

// ── Card generation from lesson sections ─────────────────────────────────────

type Section = { id: string; kind: string; heading: string; body: string };

function extractParagraphs(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((p) => p.replace(/\*\*/g, "").replace(/^[-•]\s+/, "").trim())
    .filter((p) => p.length >= 60 && !p.startsWith("#") && !p.startsWith("|"));
}

function buildFront(heading: string, kind: string, para: string): string {
  const para60 = para.slice(0, 60);

  // Kind-specific question framing for NP-level study
  if (kind === "clinical_meaning" || kind === "core_concept") {
    const matchIs = para.match(/^([A-Z][a-zA-Z ]{3,35}) (?:is|are|refers to|occurs)\b/);
    if (matchIs) return `What is ${matchIs[1]}?`;
    return `Explain the NP clinical significance of: ${heading}`;
  }
  if (kind === "exam_relevance") {
    return `What is the key CNPLE exam priority for: ${heading}?`;
  }
  if (kind === "clinical_scenario") {
    return `In a clinical scenario involving ${heading.toLowerCase()}, what is the critical NP action?`;
  }
  if (kind === "takeaways") {
    return `What are the essential NP takeaways for ${heading}?`;
  }
  // pharmacology
  if (kind === "pharmacology") {
    return `What NP prescribing consideration is key for ${heading}?`;
  }
  // diagnostics
  if (kind === "labs_diagnostics" || kind === "diagnostics") {
    return `What diagnostic approach does the NP use for ${heading}?`;
  }
  // generic fallback
  return `NP clinical focus — ${heading}: ${para60.endsWith(".") ? para60 : para60 + "…"}`;
}

function generateCardsFromLesson(lesson: {
  slug: string;
  title: string;
  topic: string;
  bodySystem: string;
  sections: Section[];
}): Array<{ front: string; back: string; domain: string; contentKey: string }> {
  const cards: Array<{ front: string; back: string; domain: string; contentKey: string }> = [];
  const domain = resolveDomain(lesson.bodySystem, lesson.topic);
  const seenFronts = new Set<string>();

  for (const section of lesson.sections) {
    const paras = extractParagraphs(section.body ?? "");
    let sectionCards = 0;

    for (const para of paras) {
      if (sectionCards >= 2) break; // max 2 cards per section
      if (cards.length >= 8) break;  // max 8 cards per lesson

      const front = buildFront(section.heading, section.kind, para);
      if (seenFronts.has(front)) continue;
      seenFronts.add(front);

      const back = para.length > 400 ? para.slice(0, 400).trimEnd() + "…" : para;
      const contentKey = `cnple:${lesson.slug}:${section.kind}:${sectionCards}`;

      cards.push({ front, back, domain, contentKey });
      sectionCards++;
    }
  }

  return cards;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(DRY_RUN ? "=== DRY RUN ===" : "=== APPLYING CNPLE FLASHCARD SEED ===");
  console.log(`Target: up to ${LIMIT} lessons → 500–1000 cards\n`);

  // Verify CNPLE deck exists
  const deck = await prisma.flashcardDeck.findUnique({ where: { id: CNPLE_DECK_ID } });
  if (!deck) {
    console.error("CNPLE flashcard deck not found! Run the deck creation script first.");
    process.exit(1);
  }
  console.log(`CNPLE deck: "${deck.title}" (current cardCount: ${deck.cardCount})`);

  // Ensure Category exists for each domain
  const categoryMap = new Map<string, string>(); // domain name → category ID
  const fallbackCatId = "cmndxtbt500000nf06gfvxfdt";
  if (!DRY_RUN) {
    for (const domainName of ALL_DOMAINS) {
      const slug = domainName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const cat = await prisma.category.upsert({
        where: { slug },
        update: { name: domainName },
        create: { name: domainName, slug },
      });
      categoryMap.set(domainName, cat.id);
    }
    console.log(`Ensured ${categoryMap.size} CNPLE domain categories.`);
  }

  // Load CNPLE lessons from DB (structurally complete, limit to LIMIT)
  console.log(`\nLoading up to ${LIMIT} structurally-complete CNPLE lessons...`);
  const lessons = await prisma.pathwayLesson.findMany({
    where: {
      pathwayId: CNPLE_PATHWAY_ID,
      status: ContentStatus.PUBLISHED,
      structuralPublicComplete: true,
    },
    select: {
      slug: true,
      title: true,
      topic: true,
      bodySystem: true,
      sections: true,
    },
    orderBy: [{ bodySystem: "asc" }, { slug: "asc" }],
    take: LIMIT,
  });
  console.log(`Loaded ${lessons.length} lessons.`);

  // Generate cards
  const allCards: Array<{
    front: string; back: string; domain: string; contentKey: string; lessonSlug: string;
  }> = [];

  for (const lesson of lessons) {
    const secs = lesson.sections as Section[];
    const cards = generateCardsFromLesson({
      slug: lesson.slug,
      title: lesson.title,
      topic: lesson.topic,
      bodySystem: lesson.bodySystem,
      sections: secs,
    });
    for (const card of cards) {
      allCards.push({ ...card, lessonSlug: lesson.slug });
    }
  }

  console.log(`Generated ${allCards.length} flashcard candidates.`);

  // Domain breakdown
  const byDomain: Record<string, number> = {};
  for (const c of allCards) byDomain[c.domain] = (byDomain[c.domain] ?? 0) + 1;
  console.log("\nCards by domain:");
  for (const [d, n] of Object.entries(byDomain).sort((a, b) => b[1] - a[1]).slice(0, 15)) {
    console.log(`  ${n.toString().padStart(4)} ${d}`);
  }

  if (DRY_RUN) {
    console.log(`\n[DRY RUN] Would write ${allCards.length} cards to CNPLE deck.`);
    console.log("Run with --apply to write to DB.");
    return;
  }

  // Clear existing deck cards if any (idempotent re-run)
  const existingCount = await prisma.flashcard.count({ where: { deckId: CNPLE_DECK_ID } });
  if (existingCount > 0) {
    console.log(`Clearing ${existingCount} existing cards from CNPLE deck...`);
    await prisma.flashcard.deleteMany({ where: { deckId: CNPLE_DECK_ID } });
  }

  // Write cards to DB in batches
  console.log(`\nWriting ${allCards.length} cards to DB...`);
  const BATCH_SIZE = 100;
  let written = 0;

  for (let i = 0; i < allCards.length; i += BATCH_SIZE) {
    const batch = allCards.slice(i, i + BATCH_SIZE);
    const records = batch.map((card, j) => ({
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
    }));
    // sourceKey is @unique — use skipDuplicates so re-runs are idempotent
    await prisma.flashcard.createMany({ data: records, skipDuplicates: true });
    written += batch.length;
    process.stdout.write(`  ${written}/${allCards.length}...\r`);
  }

  // Update deck cardCount and promote visibility
  const actualCount = await prisma.flashcard.count({ where: { deckId: CNPLE_DECK_ID } });
  await prisma.flashcardDeck.update({
    where: { id: CNPLE_DECK_ID },
    data: {
      cardCount: actualCount,
      title: "CNPLE Flashcards — Canadian NP Licensure Prep",
      description:
        "Domain-targeted flashcard decks for CNPLE preparation: prescribing safety, diagnostics, chronic disease management, primary care, lifespan care, and professional practice. Aligned to Canadian NP competency domains.",
      visibility: "PUBLIC_PREVIEW",
    },
  });

  console.log(`\n✓ Wrote ${written} cards. Skipped: ${skipped}`);
  console.log(`✓ CNPLE deck updated: cardCount=${actualCount}, visibility=PUBLIC_PREVIEW`);
  console.log(`✓ Deck title: "CNPLE Flashcards — Canadian NP Licensure Prep"`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
