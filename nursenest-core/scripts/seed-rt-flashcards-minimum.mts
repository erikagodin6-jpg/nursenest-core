#!/usr/bin/env npx tsx
/** Seed a minimum published RT/RRT flashcard deck. */
import { ContentStatus, CountryCode, ExamFamily, FlashcardDeckVisibility, TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";

const PATHWAY_ID = "us-allied-core";
const PROFESSION_KEY = "respiratory";

const CARDS = [
  ["ABG first step", "Start with pH, then decide whether PaCO2 or HCO3 explains the pH direction."],
  ["Respiratory acidosis", "Low pH with high PaCO2 means CO2 retention from inadequate ventilation."],
  ["Acute-on-chronic CO2 retention", "High PaCO2 with elevated HCO3 and low pH suggests chronic compensation plus acute decompensation."],
  ["Oxygenation tools", "FiO2 and PEEP primarily support oxygenation."],
  ["Ventilation tools", "Respiratory rate and tidal volume primarily change minute ventilation and PaCO2."],
  ["Volume assist-control", "Tidal volume is set; airway pressure varies with resistance and compliance."],
  ["Rising peak, stable plateau", "Think increased airway resistance such as secretions, bronchospasm, biting, or kinked tubing."],
  ["Rising peak and plateau", "Think reduced compliance such as ARDS, pulmonary edema, pneumothorax, or atelectasis."],
  ["Auto-PEEP waveform clue", "Expiratory flow fails to return to baseline before the next breath."],
  ["Air trapping risk", "Increasing respiratory rate can worsen incomplete exhalation in obstructive physiology."],
  ["ARDS physiology", "ARDS causes shunt, low compliance, refractory hypoxemia, and ventilator-induced injury risk."],
  ["PEEP in ARDS", "PEEP may recruit alveoli but must be balanced against overdistention and reduced venous return."],
  ["P/F ratio", "PaO2 divided by FiO2 estimates oxygenation severity and helps classify ARDS severity."],
  ["Obstructive spirometry", "Reduced FEV1/FVC ratio supports obstructive disease."],
  ["Albuterol effect", "Beta-2 bronchodilation improves airflow in bronchospasm."],
  ["Surfactant deficiency", "High alveolar surface tension causes atelectasis and poor compliance in neonatal RDS."],
  ["Tracheostomy distress", "Assess patient, airway patency, tube position, secretions, and circuit obstruction first."],
  ["VAP prevention", "Use bundle-based oral care, hand hygiene, positioning, and minimize avoidable circuit breaks."],
  ["Oxygen vs ventilation failure", "Low PaO2 with normal PaCO2 points more toward oxygenation failure than ventilation failure."],
  ["RT exam trap", "Do not change ventilator settings reflexively; match every intervention to the physiologic problem."],
] as const;

async function main(): Promise<void> {
  const category = await prisma.category.upsert({
    where: { slug: "respiratory-therapy" },
    create: { name: "Respiratory Therapy", slug: "respiratory-therapy", topicCode: "respiratory" },
    update: { name: "Respiratory Therapy", topicCode: "respiratory" },
  });

  const tag = await prisma.flashcardTag.upsert({
    where: { slug: PROFESSION_KEY },
    create: { slug: PROFESSION_KEY, name: "Respiratory Therapy" },
    update: { name: "Respiratory Therapy" },
  });

  const deck = await prisma.flashcardDeck.upsert({
    where: { slug: "rt-respiratory-therapy-readiness" },
    create: {
      slug: "rt-respiratory-therapy-readiness",
      title: "Respiratory Therapy Readiness",
      description: "ABGs, ventilation, waveforms, airway, oxygen therapy, pharmacology, neonatal care, and infection control.",
      country: CountryCode.US,
      tier: TierCode.ALLIED,
      examFamily: ExamFamily.GENERIC,
      pathwayId: PATHWAY_ID,
      visibility: FlashcardDeckVisibility.SUBSCRIBER,
      status: ContentStatus.PUBLISHED,
      sortOrder: 1,
      cardCount: 0,
    },
    update: {
      title: "Respiratory Therapy Readiness",
      description: "ABGs, ventilation, waveforms, airway, oxygen therapy, pharmacology, neonatal care, and infection control.",
      country: CountryCode.US,
      tier: TierCode.ALLIED,
      pathwayId: PATHWAY_ID,
      visibility: FlashcardDeckVisibility.SUBSCRIBER,
      status: ContentStatus.PUBLISHED,
      sortOrder: 1,
    },
  });

  await prisma.flashcardDeckOnTag.upsert({
    where: { deckId_tagId: { deckId: deck.id, tagId: tag.id } },
    create: { deckId: deck.id, tagId: tag.id },
    update: {},
  });

  let count = 0;
  for (const [index, [front, back]] of CARDS.entries()) {
    await prisma.flashcard.upsert({
      where: { sourceKey: `rt-readiness-flashcard:${index + 1}` },
      create: {
        front,
        back,
        country: CountryCode.US,
        tier: TierCode.ALLIED,
        status: ContentStatus.PUBLISHED,
        examFamily: ExamFamily.GENERIC,
        categoryId: category.id,
        deckId: deck.id,
        positionInDeck: index + 1,
        sourceKey: `rt-readiness-flashcard:${index + 1}`,
      },
      update: {
        front,
        back,
        country: CountryCode.US,
        tier: TierCode.ALLIED,
        status: ContentStatus.PUBLISHED,
        examFamily: ExamFamily.GENERIC,
        categoryId: category.id,
        deckId: deck.id,
        positionInDeck: index + 1,
      },
    });
    count += 1;
  }

  await prisma.flashcardDeck.update({
    where: { id: deck.id },
    data: { cardCount: await prisma.flashcard.count({ where: { deckId: deck.id, status: ContentStatus.PUBLISHED } }) },
  });

  console.log(JSON.stringify({ ok: true, deck: deck.slug, seededFlashcards: count }, null, 2));
}

main().catch((error) => {
  console.error("[seed-rt-flashcards-minimum] failed", error);
  process.exitCode = 1;
}).finally(async () => prisma.$disconnect());
