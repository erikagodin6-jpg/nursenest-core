import "server-only";
import {
  ContentStatus,
  CountryCode,
  ExamFamily,
  FlashcardDeckVisibility,
  FlashcardItemKind,
  TierCode,
} from "@prisma/client";
import { prisma } from "@/lib/db";

const DECK_SLUG = "nclex-rn-fundamentals-phase1-seed";
const CATEGORY_SLUG = "fundamentals-of-nursing-seed";

/** Idempotent — safe to call multiple times. Creates the deck only if the slug doesn't exist. */
export async function seedFlashcardFoundationDeck(): Promise<{ created: boolean; deckId: string }> {
  const existing = await prisma.flashcardDeck.findUnique({ where: { slug: DECK_SLUG } });
  if (existing) return { created: false, deckId: existing.id };

  const category = await prisma.category.upsert({
    where: { slug: CATEGORY_SLUG },
    create: { name: "Fundamentals of Nursing", slug: CATEGORY_SLUG },
    update: {},
  });

  const deck = await prisma.flashcardDeck.create({
    data: {
      slug: DECK_SLUG,
      title: "NCLEX-RN Fundamentals",
      description:
        "Core nursing fundamentals: safety, basic care, medication rights, and priority setting. A solid starting point for NCLEX-RN prep.",
      country: CountryCode.US,
      tier: TierCode.RN,
      examFamily: ExamFamily.NCLEX_RN,
      visibility: FlashcardDeckVisibility.SUBSCRIBER,
      status: ContentStatus.PUBLISHED,
      sortOrder: 1,
      cardCount: 5,
      cards: {
        create: [
          {
            front: "Six Rights of Medication Administration",
            back: "Right patient, right drug, right dose, right route, right time, right documentation.",
            country: CountryCode.US,
            tier: TierCode.RN,
            examFamily: ExamFamily.NCLEX_RN,
            status: ContentStatus.PUBLISHED,
            categoryId: category.id,
            positionInDeck: 1,
            examItemKind: FlashcardItemKind.RECALL,
            questionStem:
              "A nurse is preparing to administer a medication. Which of the following represents the correct sequence of the Six Rights of Medication Administration?",
            correctAnswer: "A",
            rationaleCorrect:
              "The Six Rights are: Right patient, Right drug, Right dose, Right route, Right time, Right documentation. These are foundational safety checks performed before every medication administration.",
            options: {
              create: [
                {
                  optionKey: "A",
                  content: "Right patient, right drug, right dose, right route, right time, right documentation",
                  isCorrect: true,
                  rationale: null,
                  displayOrder: 1,
                },
                {
                  optionKey: "B",
                  content: "Right medication, right patient, right amount, right time, right route, right chart",
                  isCorrect: false,
                  rationale: "'Right chart' is not one of the Six Rights; the correct term is 'right documentation'.",
                  displayOrder: 2,
                },
                {
                  optionKey: "C",
                  content: "Right nurse, right drug, right dose, right patient, right time, right form",
                  isCorrect: false,
                  rationale: "'Right nurse' and 'right form' are not part of the Six Rights.",
                  displayOrder: 3,
                },
                {
                  optionKey: "D",
                  content: "Right drug, right dose, right route, right reason, right documentation, right follow-up",
                  isCorrect: false,
                  rationale:
                    "'Right reason' and 'right follow-up' are sometimes cited as extended rights, but the foundational Six Rights do not include them — and 'right patient' and 'right time' are omitted here.",
                  displayOrder: 4,
                },
              ],
            },
          },
          {
            front: "Maslow's Hierarchy — Nursing Priority",
            back: "Physiological needs come first (airway, breathing, circulation), then safety, then psychosocial. Always address life-threatening needs before comfort.",
            country: CountryCode.US,
            tier: TierCode.RN,
            examFamily: ExamFamily.NCLEX_RN,
            status: ContentStatus.PUBLISHED,
            categoryId: category.id,
            positionInDeck: 2,
            examItemKind: FlashcardItemKind.PRIORITY,
            questionStem:
              "A nurse receives a report on four patients. Using Maslow's hierarchy of needs, which patient should the nurse assess first?",
            correctAnswer: "B",
            rationaleCorrect:
              "An oxygen saturation of 88% signals a compromised airway/oxygenation — a physiological (survival) need at the base of Maslow's hierarchy. This is an immediate life threat and takes priority over all other needs.",
            options: {
              create: [
                {
                  optionKey: "A",
                  content: "A patient asking for pain medication rated 5/10",
                  isCorrect: false,
                  rationale:
                    "Pain at 5/10 is a physiological need, but it is not immediately life-threatening. Oxygenation failure is more urgent.",
                  displayOrder: 1,
                },
                {
                  optionKey: "B",
                  content: "A patient with an oxygen saturation of 88% on room air",
                  isCorrect: true,
                  rationale: null,
                  displayOrder: 2,
                },
                {
                  optionKey: "C",
                  content: "A patient expressing fear about upcoming surgery",
                  isCorrect: false,
                  rationale:
                    "Fear is a safety/psychosocial need. It should be addressed, but only after physiological emergencies are managed.",
                  displayOrder: 3,
                },
                {
                  optionKey: "D",
                  content: "A patient who is hungry and requesting a meal tray",
                  isCorrect: false,
                  rationale:
                    "Hunger is a physiological need, but it is non-urgent compared to hypoxia. Requesting a meal tray does not indicate an immediate threat.",
                  displayOrder: 4,
                },
              ],
            },
          },
          {
            front: "Informed Consent — Nurse's Role",
            back: "The nurse's role is to witness the patient's signature, not to explain the procedure. The physician/provider obtains consent. The nurse verifies the patient understands and is not coerced.",
            country: CountryCode.US,
            tier: TierCode.RN,
            examFamily: ExamFamily.NCLEX_RN,
            status: ContentStatus.PUBLISHED,
            categoryId: category.id,
            positionInDeck: 3,
            examItemKind: FlashcardItemKind.CLINICAL,
            questionStem:
              "A patient signs an informed consent form for surgery. What is the primary nursing responsibility regarding informed consent?",
            correctAnswer: "C",
            rationaleCorrect:
              "The nurse's responsibility is to witness the patient signing the consent form and to verify that the patient appears to understand what was explained and is signing voluntarily. Explaining the risks and alternatives is the provider's (physician/surgeon) duty.",
            options: {
              create: [
                {
                  optionKey: "A",
                  content: "Explain all risks and benefits of the procedure in detail",
                  isCorrect: false,
                  rationale:
                    "Explaining the procedure's risks and benefits is the provider's (surgeon/physician) legal and ethical obligation, not the nurse's.",
                  displayOrder: 1,
                },
                {
                  optionKey: "B",
                  content: "Refuse to witness if the patient has any questions",
                  isCorrect: false,
                  rationale:
                    "Having questions does not invalidate consent. If the patient has unanswered questions, the nurse should notify the provider — not refuse to witness.",
                  displayOrder: 2,
                },
                {
                  optionKey: "C",
                  content: "Witness the patient's signature and verify the patient is signing voluntarily",
                  isCorrect: true,
                  rationale: null,
                  displayOrder: 3,
                },
                {
                  optionKey: "D",
                  content: "Obtain verbal consent and document it in the chart as sufficient",
                  isCorrect: false,
                  rationale:
                    "For surgical procedures, written informed consent is required. Verbal consent alone is not sufficient documentation.",
                  displayOrder: 4,
                },
              ],
            },
          },
          {
            front: "Standard Precautions",
            back: "Used with ALL patients regardless of diagnosis. Includes hand hygiene, gloves for body fluid contact, gown/mask/eye protection when splash risk exists, safe sharps disposal.",
            country: CountryCode.US,
            tier: TierCode.RN,
            examFamily: ExamFamily.NCLEX_RN,
            status: ContentStatus.PUBLISHED,
            categoryId: category.id,
            positionInDeck: 4,
            examItemKind: FlashcardItemKind.CONCEPT,
            questionStem:
              "Which statement best describes when standard precautions should be used?",
            correctAnswer: "D",
            rationaleCorrect:
              "Standard precautions apply to ALL patients at ALL times, regardless of known infection status. They are based on the principle that all blood, body fluids, non-intact skin, and mucous membranes may be infectious.",
            options: {
              create: [
                {
                  optionKey: "A",
                  content: "Only when caring for patients with confirmed infectious diseases",
                  isCorrect: false,
                  rationale:
                    "This describes an older 'disease-specific' isolation model. Standard precautions assume all patients may carry infectious agents, not just those with known diagnoses.",
                  displayOrder: 1,
                },
                {
                  optionKey: "B",
                  content: "Only when the patient is on contact isolation precautions",
                  isCorrect: false,
                  rationale:
                    "Contact isolation is a transmission-based precaution layered ON TOP of standard precautions — standard precautions are used for every patient regardless of isolation status.",
                  displayOrder: 2,
                },
                {
                  optionKey: "C",
                  content: "Only in ICU or surgical settings where infection risk is high",
                  isCorrect: false,
                  rationale:
                    "Standard precautions apply in all clinical settings, not only high-acuity areas.",
                  displayOrder: 3,
                },
                {
                  optionKey: "D",
                  content: "With all patients, at all times, regardless of diagnosis or infection status",
                  isCorrect: true,
                  rationale: null,
                  displayOrder: 4,
                },
              ],
            },
          },
          {
            front: "Delegation — RN to UAP",
            back: "RN may delegate tasks that are routine, have predictable outcomes, and do not require nursing judgment. Cannot delegate assessment, care planning, teaching, or evaluation.",
            country: CountryCode.US,
            tier: TierCode.RN,
            examFamily: ExamFamily.NCLEX_RN,
            status: ContentStatus.PUBLISHED,
            categoryId: category.id,
            positionInDeck: 5,
            examItemKind: FlashcardItemKind.CLINICAL,
            questionStem:
              "An RN is managing a busy medical-surgical unit. Which task is appropriate to delegate to an unlicensed assistive personnel (UAP)?",
            correctAnswer: "B",
            rationaleCorrect:
              "Measuring and recording intake and output is a routine task with predictable outcomes that does not require nursing judgment. It is appropriate to delegate to a UAP. The RN retains responsibility for interpreting the data.",
            options: {
              create: [
                {
                  optionKey: "A",
                  content: "Performing an initial assessment on a newly admitted patient",
                  isCorrect: false,
                  rationale:
                    "Initial assessment requires clinical judgment and is within the RN's scope of practice only. It cannot be delegated to a UAP.",
                  displayOrder: 1,
                },
                {
                  optionKey: "B",
                  content: "Measuring and recording urine output for a stable patient",
                  isCorrect: true,
                  rationale: null,
                  displayOrder: 2,
                },
                {
                  optionKey: "C",
                  content: "Teaching a diabetic patient about insulin self-injection",
                  isCorrect: false,
                  rationale:
                    "Patient education requires nursing judgment, knowledge, and evaluation of understanding. Teaching cannot be delegated to a UAP.",
                  displayOrder: 3,
                },
                {
                  optionKey: "D",
                  content: "Developing a care plan for a post-operative patient",
                  isCorrect: false,
                  rationale:
                    "Care plan development requires nursing assessment and clinical reasoning. It is exclusively within the RN's scope and cannot be delegated.",
                  displayOrder: 4,
                },
              ],
            },
          },
        ],
      },
    },
  });

  return { created: true, deckId: deck.id };
}
