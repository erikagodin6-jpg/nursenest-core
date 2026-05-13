/**
 * Seed CanonicalTopic rows for the top 50 high-value clinical topics.
 *
 * Idempotent — uses upsert on topicKey; never deletes existing topics.
 *
 * Usage:
 *   npx tsx scripts/seed-canonical-topics.mts            # dry-run (default)
 *   npx tsx scripts/seed-canonical-topics.mts --apply    # write to DB
 */
import "@/lib/db/env-bootstrap";
import { PrismaClient } from "@prisma/client";

const DRY_RUN = !process.argv.includes("--apply");

// ── Top 50 canonical topics ───────────────────────────────────────────────

type TopicDef = {
  topicKey: string;
  displayName: string;
  bodySystem: string;
  clinicalCategory: string;
  flashcardTopicKey: string;
  practiceTopicKey: string;
  catPoolKey: string;
  remediationTagKey: string;
  blogTopicKey: string;
};

const CANONICAL_TOPICS: TopicDef[] = [
  // ── Respiratory ───────────────────────────────────────────────────────
  {
    topicKey: "copd",
    displayName: "COPD",
    bodySystem: "Respiratory",
    clinicalCategory: "Chronic Disease",
    flashcardTopicKey: "copd",
    practiceTopicKey: "copd",
    catPoolKey: "respiratory",
    remediationTagKey: "copd",
    blogTopicKey: "copd",
  },
  {
    topicKey: "asthma",
    displayName: "Asthma",
    bodySystem: "Respiratory",
    clinicalCategory: "Chronic Disease",
    flashcardTopicKey: "asthma",
    practiceTopicKey: "asthma",
    catPoolKey: "respiratory",
    remediationTagKey: "asthma",
    blogTopicKey: "asthma",
  },
  {
    topicKey: "pneumonia",
    displayName: "Pneumonia",
    bodySystem: "Respiratory",
    clinicalCategory: "Infection",
    flashcardTopicKey: "pneumonia",
    practiceTopicKey: "pneumonia",
    catPoolKey: "respiratory",
    remediationTagKey: "pneumonia",
    blogTopicKey: "pneumonia",
  },
  {
    topicKey: "pulmonary-embolism",
    displayName: "Pulmonary Embolism",
    bodySystem: "Respiratory",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "pulmonary-embolism",
    practiceTopicKey: "pulmonary-embolism",
    catPoolKey: "respiratory",
    remediationTagKey: "pulmonary-embolism",
    blogTopicKey: "pulmonary-embolism",
  },
  // ── Cardiovascular ────────────────────────────────────────────────────
  {
    topicKey: "heart-failure",
    displayName: "Heart Failure",
    bodySystem: "Cardiovascular",
    clinicalCategory: "Chronic Disease",
    flashcardTopicKey: "heart-failure",
    practiceTopicKey: "heart-failure",
    catPoolKey: "cardiovascular",
    remediationTagKey: "heart-failure",
    blogTopicKey: "heart-failure",
  },
  {
    topicKey: "myocardial-infarction",
    displayName: "Myocardial Infarction",
    bodySystem: "Cardiovascular",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "myocardial-infarction",
    practiceTopicKey: "myocardial-infarction",
    catPoolKey: "cardiovascular",
    remediationTagKey: "myocardial-infarction",
    blogTopicKey: "myocardial-infarction",
  },
  {
    topicKey: "hypertension",
    displayName: "Hypertension",
    bodySystem: "Cardiovascular",
    clinicalCategory: "Chronic Disease",
    flashcardTopicKey: "hypertension",
    practiceTopicKey: "hypertension",
    catPoolKey: "cardiovascular",
    remediationTagKey: "hypertension",
    blogTopicKey: "hypertension",
  },
  {
    topicKey: "deep-vein-thrombosis",
    displayName: "Deep Vein Thrombosis",
    bodySystem: "Cardiovascular",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "dvt",
    practiceTopicKey: "dvt",
    catPoolKey: "cardiovascular",
    remediationTagKey: "dvt",
    blogTopicKey: "deep-vein-thrombosis",
  },
  {
    topicKey: "ecg-interpretation",
    displayName: "ECG Interpretation",
    bodySystem: "Cardiovascular",
    clinicalCategory: "Clinical Skills",
    flashcardTopicKey: "ecg",
    practiceTopicKey: "ecg",
    catPoolKey: "cardiovascular",
    remediationTagKey: "ecg",
    blogTopicKey: "ecg-interpretation",
  },
  {
    topicKey: "shock",
    displayName: "Shock",
    bodySystem: "Cardiovascular",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "shock",
    practiceTopicKey: "shock",
    catPoolKey: "cardiovascular",
    remediationTagKey: "shock",
    blogTopicKey: "shock",
  },
  // ── Neurological ──────────────────────────────────────────────────────
  {
    topicKey: "stroke",
    displayName: "Stroke",
    bodySystem: "Neurological",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "stroke",
    practiceTopicKey: "stroke",
    catPoolKey: "neurological",
    remediationTagKey: "stroke",
    blogTopicKey: "stroke",
  },
  {
    topicKey: "seizures",
    displayName: "Seizures",
    bodySystem: "Neurological",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "seizures",
    practiceTopicKey: "seizures",
    catPoolKey: "neurological",
    remediationTagKey: "seizures",
    blogTopicKey: "seizures",
  },
  {
    topicKey: "meningitis",
    displayName: "Meningitis",
    bodySystem: "Neurological",
    clinicalCategory: "Infection",
    flashcardTopicKey: "meningitis",
    practiceTopicKey: "meningitis",
    catPoolKey: "neurological",
    remediationTagKey: "meningitis",
    blogTopicKey: "meningitis",
  },
  {
    topicKey: "spinal-cord-injury",
    displayName: "Spinal Cord Injury",
    bodySystem: "Neurological",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "spinal-cord-injury",
    practiceTopicKey: "spinal-cord-injury",
    catPoolKey: "neurological",
    remediationTagKey: "spinal-cord-injury",
    blogTopicKey: "spinal-cord-injury",
  },
  {
    topicKey: "increased-intracranial-pressure",
    displayName: "Increased Intracranial Pressure",
    bodySystem: "Neurological",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "icp",
    practiceTopicKey: "icp",
    catPoolKey: "neurological",
    remediationTagKey: "icp",
    blogTopicKey: "increased-icp",
  },
  {
    topicKey: "delirium",
    displayName: "Delirium",
    bodySystem: "Neurological",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "delirium",
    practiceTopicKey: "delirium",
    catPoolKey: "neurological",
    remediationTagKey: "delirium",
    blogTopicKey: "delirium",
  },
  {
    topicKey: "dementia",
    displayName: "Dementia",
    bodySystem: "Neurological",
    clinicalCategory: "Chronic Disease",
    flashcardTopicKey: "dementia",
    practiceTopicKey: "dementia",
    catPoolKey: "neurological",
    remediationTagKey: "dementia",
    blogTopicKey: "dementia",
  },
  // ── Endocrine ─────────────────────────────────────────────────────────
  {
    topicKey: "diabetes-mellitus",
    displayName: "Diabetes Mellitus",
    bodySystem: "Endocrine",
    clinicalCategory: "Chronic Disease",
    flashcardTopicKey: "diabetes",
    practiceTopicKey: "diabetes",
    catPoolKey: "endocrine",
    remediationTagKey: "diabetes",
    blogTopicKey: "diabetes",
  },
  {
    topicKey: "diabetic-ketoacidosis",
    displayName: "Diabetic Ketoacidosis",
    bodySystem: "Endocrine",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "dka",
    practiceTopicKey: "dka",
    catPoolKey: "endocrine",
    remediationTagKey: "dka",
    blogTopicKey: "dka",
  },
  // ── Renal ─────────────────────────────────────────────────────────────
  {
    topicKey: "acute-kidney-injury",
    displayName: "Acute Kidney Injury",
    bodySystem: "Renal",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "aki",
    practiceTopicKey: "aki",
    catPoolKey: "renal",
    remediationTagKey: "aki",
    blogTopicKey: "acute-kidney-injury",
  },
  {
    topicKey: "chronic-kidney-disease",
    displayName: "Chronic Kidney Disease",
    bodySystem: "Renal",
    clinicalCategory: "Chronic Disease",
    flashcardTopicKey: "ckd",
    practiceTopicKey: "ckd",
    catPoolKey: "renal",
    remediationTagKey: "ckd",
    blogTopicKey: "chronic-kidney-disease",
  },
  // ── GI / Hepatic ──────────────────────────────────────────────────────
  {
    topicKey: "liver-cirrhosis",
    displayName: "Liver Cirrhosis",
    bodySystem: "Gastrointestinal",
    clinicalCategory: "Chronic Disease",
    flashcardTopicKey: "cirrhosis",
    practiceTopicKey: "cirrhosis",
    catPoolKey: "gastrointestinal",
    remediationTagKey: "cirrhosis",
    blogTopicKey: "liver-cirrhosis",
  },
  {
    topicKey: "pancreatitis",
    displayName: "Pancreatitis",
    bodySystem: "Gastrointestinal",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "pancreatitis",
    practiceTopicKey: "pancreatitis",
    catPoolKey: "gastrointestinal",
    remediationTagKey: "pancreatitis",
    blogTopicKey: "pancreatitis",
  },
  {
    topicKey: "gi-bleed",
    displayName: "GI Bleed",
    bodySystem: "Gastrointestinal",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "gi-bleed",
    practiceTopicKey: "gi-bleed",
    catPoolKey: "gastrointestinal",
    remediationTagKey: "gi-bleed",
    blogTopicKey: "gi-bleed",
  },
  // ── Hematology ────────────────────────────────────────────────────────
  {
    topicKey: "anemia",
    displayName: "Anemia",
    bodySystem: "Hematology",
    clinicalCategory: "Chronic Disease",
    flashcardTopicKey: "anemia",
    practiceTopicKey: "anemia",
    catPoolKey: "hematology",
    remediationTagKey: "anemia",
    blogTopicKey: "anemia",
  },
  {
    topicKey: "sickle-cell-disease",
    displayName: "Sickle Cell Disease",
    bodySystem: "Hematology",
    clinicalCategory: "Chronic Disease",
    flashcardTopicKey: "sickle-cell",
    practiceTopicKey: "sickle-cell",
    catPoolKey: "hematology",
    remediationTagKey: "sickle-cell",
    blogTopicKey: "sickle-cell-disease",
  },
  {
    topicKey: "blood-transfusion",
    displayName: "Blood Transfusion",
    bodySystem: "Hematology",
    clinicalCategory: "Clinical Skills",
    flashcardTopicKey: "blood-transfusion",
    practiceTopicKey: "blood-transfusion",
    catPoolKey: "hematology",
    remediationTagKey: "blood-transfusion",
    blogTopicKey: "blood-transfusion",
  },
  // ── Infection ─────────────────────────────────────────────────────────
  {
    topicKey: "sepsis",
    displayName: "Sepsis",
    bodySystem: "Multisystem",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "sepsis",
    practiceTopicKey: "sepsis",
    catPoolKey: "infection",
    remediationTagKey: "sepsis",
    blogTopicKey: "sepsis",
  },
  {
    topicKey: "infection-control",
    displayName: "Infection Control",
    bodySystem: "Multisystem",
    clinicalCategory: "Clinical Skills",
    flashcardTopicKey: "infection-control",
    practiceTopicKey: "infection-control",
    catPoolKey: "infection",
    remediationTagKey: "infection-control",
    blogTopicKey: "infection-control",
  },
  // ── Pain & Symptom ────────────────────────────────────────────────────
  {
    topicKey: "pain-management",
    displayName: "Pain Management",
    bodySystem: "Multisystem",
    clinicalCategory: "Clinical Skills",
    flashcardTopicKey: "pain",
    practiceTopicKey: "pain",
    catPoolKey: "pain",
    remediationTagKey: "pain",
    blogTopicKey: "pain-management",
  },
  // ── Integumentary ─────────────────────────────────────────────────────
  {
    topicKey: "burns",
    displayName: "Burns",
    bodySystem: "Integumentary",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "burns",
    practiceTopicKey: "burns",
    catPoolKey: "integumentary",
    remediationTagKey: "burns",
    blogTopicKey: "burns",
  },
  {
    topicKey: "wound-care",
    displayName: "Wound Care",
    bodySystem: "Integumentary",
    clinicalCategory: "Clinical Skills",
    flashcardTopicKey: "wound-care",
    practiceTopicKey: "wound-care",
    catPoolKey: "integumentary",
    remediationTagKey: "wound-care",
    blogTopicKey: "wound-care",
  },
  {
    topicKey: "pressure-injuries",
    displayName: "Pressure Injuries",
    bodySystem: "Integumentary",
    clinicalCategory: "Clinical Skills",
    flashcardTopicKey: "pressure-injuries",
    practiceTopicKey: "pressure-injuries",
    catPoolKey: "integumentary",
    remediationTagKey: "pressure-injuries",
    blogTopicKey: "pressure-injuries",
  },
  // ── Safety ────────────────────────────────────────────────────────────
  {
    topicKey: "falls-prevention",
    displayName: "Falls Prevention",
    bodySystem: "Multisystem",
    clinicalCategory: "Patient Safety",
    flashcardTopicKey: "falls",
    practiceTopicKey: "falls",
    catPoolKey: "safety",
    remediationTagKey: "falls",
    blogTopicKey: "falls-prevention",
  },
  {
    topicKey: "medication-safety",
    displayName: "Medication Safety",
    bodySystem: "Multisystem",
    clinicalCategory: "Patient Safety",
    flashcardTopicKey: "medication-safety",
    practiceTopicKey: "medication-safety",
    catPoolKey: "safety",
    remediationTagKey: "medication-safety",
    blogTopicKey: "medication-safety",
  },
  // ── Mental Health ─────────────────────────────────────────────────────
  {
    topicKey: "depression",
    displayName: "Depression",
    bodySystem: "Mental Health",
    clinicalCategory: "Chronic Disease",
    flashcardTopicKey: "depression",
    practiceTopicKey: "depression",
    catPoolKey: "mental-health",
    remediationTagKey: "depression",
    blogTopicKey: "depression",
  },
  {
    topicKey: "anxiety",
    displayName: "Anxiety Disorders",
    bodySystem: "Mental Health",
    clinicalCategory: "Chronic Disease",
    flashcardTopicKey: "anxiety",
    practiceTopicKey: "anxiety",
    catPoolKey: "mental-health",
    remediationTagKey: "anxiety",
    blogTopicKey: "anxiety",
  },
  {
    topicKey: "bipolar-disorder",
    displayName: "Bipolar Disorder",
    bodySystem: "Mental Health",
    clinicalCategory: "Chronic Disease",
    flashcardTopicKey: "bipolar",
    practiceTopicKey: "bipolar",
    catPoolKey: "mental-health",
    remediationTagKey: "bipolar",
    blogTopicKey: "bipolar-disorder",
  },
  {
    topicKey: "schizophrenia",
    displayName: "Schizophrenia",
    bodySystem: "Mental Health",
    clinicalCategory: "Chronic Disease",
    flashcardTopicKey: "schizophrenia",
    practiceTopicKey: "schizophrenia",
    catPoolKey: "mental-health",
    remediationTagKey: "schizophrenia",
    blogTopicKey: "schizophrenia",
  },
  {
    topicKey: "substance-use-disorder",
    displayName: "Substance Use Disorder",
    bodySystem: "Mental Health",
    clinicalCategory: "Chronic Disease",
    flashcardTopicKey: "substance-use",
    practiceTopicKey: "substance-use",
    catPoolKey: "mental-health",
    remediationTagKey: "substance-use",
    blogTopicKey: "substance-use-disorder",
  },
  // ── Maternal / Newborn ────────────────────────────────────────────────
  {
    topicKey: "pregnancy-complications",
    displayName: "Pregnancy Complications",
    bodySystem: "Maternal-Newborn",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "pregnancy-complications",
    practiceTopicKey: "pregnancy-complications",
    catPoolKey: "maternal-newborn",
    remediationTagKey: "pregnancy-complications",
    blogTopicKey: "pregnancy-complications",
  },
  {
    topicKey: "postpartum-hemorrhage",
    displayName: "Postpartum Hemorrhage",
    bodySystem: "Maternal-Newborn",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "pph",
    practiceTopicKey: "pph",
    catPoolKey: "maternal-newborn",
    remediationTagKey: "pph",
    blogTopicKey: "postpartum-hemorrhage",
  },
  {
    topicKey: "preeclampsia",
    displayName: "Preeclampsia",
    bodySystem: "Maternal-Newborn",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "preeclampsia",
    practiceTopicKey: "preeclampsia",
    catPoolKey: "maternal-newborn",
    remediationTagKey: "preeclampsia",
    blogTopicKey: "preeclampsia",
  },
  {
    topicKey: "neonatal-jaundice",
    displayName: "Neonatal Jaundice",
    bodySystem: "Maternal-Newborn",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "neonatal-jaundice",
    practiceTopicKey: "neonatal-jaundice",
    catPoolKey: "maternal-newborn",
    remediationTagKey: "neonatal-jaundice",
    blogTopicKey: "neonatal-jaundice",
  },
  // ── Pediatric ─────────────────────────────────────────────────────────
  {
    topicKey: "pediatric-dehydration",
    displayName: "Pediatric Dehydration",
    bodySystem: "Pediatric",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "pediatric-dehydration",
    practiceTopicKey: "pediatric-dehydration",
    catPoolKey: "pediatric",
    remediationTagKey: "pediatric-dehydration",
    blogTopicKey: "pediatric-dehydration",
  },
  {
    topicKey: "pediatric-respiratory-distress",
    displayName: "Pediatric Respiratory Distress",
    bodySystem: "Pediatric",
    clinicalCategory: "Acute Care",
    flashcardTopicKey: "pediatric-respiratory",
    practiceTopicKey: "pediatric-respiratory",
    catPoolKey: "pediatric",
    remediationTagKey: "pediatric-respiratory",
    blogTopicKey: "pediatric-respiratory-distress",
  },
  // ── Fluids / Electrolytes / Acid-Base ────────────────────────────────
  {
    topicKey: "fluid-electrolyte-balance",
    displayName: "Fluid & Electrolyte Balance",
    bodySystem: "Renal",
    clinicalCategory: "Clinical Skills",
    flashcardTopicKey: "fluids-electrolytes",
    practiceTopicKey: "fluids-electrolytes",
    catPoolKey: "renal",
    remediationTagKey: "fluids-electrolytes",
    blogTopicKey: "fluid-electrolytes",
  },
  {
    topicKey: "acid-base-balance",
    displayName: "Acid-Base Balance",
    bodySystem: "Renal",
    clinicalCategory: "Clinical Skills",
    flashcardTopicKey: "acid-base",
    practiceTopicKey: "acid-base",
    catPoolKey: "renal",
    remediationTagKey: "acid-base",
    blogTopicKey: "acid-base",
  },
  // ── Leadership ────────────────────────────────────────────────────────
  {
    topicKey: "delegation",
    displayName: "Delegation & Assignment",
    bodySystem: "Leadership",
    clinicalCategory: "Leadership",
    flashcardTopicKey: "delegation",
    practiceTopicKey: "delegation",
    catPoolKey: "leadership",
    remediationTagKey: "delegation",
    blogTopicKey: "delegation",
  },
  {
    topicKey: "prioritization",
    displayName: "Prioritization & ABCs",
    bodySystem: "Leadership",
    clinicalCategory: "Leadership",
    flashcardTopicKey: "prioritization",
    practiceTopicKey: "prioritization",
    catPoolKey: "leadership",
    remediationTagKey: "prioritization",
    blogTopicKey: "prioritization",
  },
];

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const prisma = new PrismaClient();

  if (DRY_RUN) {
    console.log("=== DRY RUN — no DB writes ===\n");
    console.log(`Would upsert ${CANONICAL_TOPICS.length} CanonicalTopic rows:\n`);
    for (const t of CANONICAL_TOPICS) {
      console.log(`  ${t.topicKey.padEnd(40)} ${t.displayName} [${t.bodySystem}]`);
    }
    console.log(`\nRun with --apply to write to DB.`);
    return;
  }

  console.log(`Seeding ${CANONICAL_TOPICS.length} CanonicalTopic rows...\n`);
  let created = 0, updated = 0, skipped = 0;

  for (const topic of CANONICAL_TOPICS) {
    const existing = await prisma.canonicalTopic.findUnique({ where: { topicKey: topic.topicKey } });

    if (existing) {
      // Update if any field changed
      const needsUpdate =
        existing.displayName !== topic.displayName ||
        existing.bodySystem !== topic.bodySystem ||
        existing.clinicalCategory !== topic.clinicalCategory ||
        existing.flashcardTopicKey !== topic.flashcardTopicKey ||
        existing.practiceTopicKey !== topic.practiceTopicKey ||
        existing.catPoolKey !== topic.catPoolKey ||
        existing.remediationTagKey !== topic.remediationTagKey ||
        existing.blogTopicKey !== topic.blogTopicKey;

      if (needsUpdate) {
        await prisma.canonicalTopic.update({
          where: { topicKey: topic.topicKey },
          data: {
            displayName: topic.displayName,
            bodySystem: topic.bodySystem,
            clinicalCategory: topic.clinicalCategory,
            flashcardTopicKey: topic.flashcardTopicKey,
            practiceTopicKey: topic.practiceTopicKey,
            catPoolKey: topic.catPoolKey,
            remediationTagKey: topic.remediationTagKey,
            blogTopicKey: topic.blogTopicKey,
          },
        });
        console.log(`  UPDATED  ${topic.topicKey}`);
        updated++;
      } else {
        console.log(`  SKIPPED  ${topic.topicKey} (no change)`);
        skipped++;
      }
    } else {
      await prisma.canonicalTopic.create({
        data: {
          topicKey: topic.topicKey,
          displayName: topic.displayName,
          bodySystem: topic.bodySystem,
          clinicalCategory: topic.clinicalCategory,
          flashcardTopicKey: topic.flashcardTopicKey,
          practiceTopicKey: topic.practiceTopicKey,
          catPoolKey: topic.catPoolKey,
          remediationTagKey: topic.remediationTagKey,
          blogTopicKey: topic.blogTopicKey,
        },
      });
      console.log(`  CREATED  ${topic.topicKey}`);
      created++;
    }
  }

  await prisma.$disconnect();

  console.log(`\n${"=".repeat(50)}`);
  console.log(`SEED COMPLETE`);
  console.log(`  Created: ${created}`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Total:   ${CANONICAL_TOPICS.length}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
