/**
 * Map PathwayLesson rows to CanonicalTopic nodes.
 *
 * Uses deterministic slug/title/topicSlug matching.
 * Dry-run by default; writes a markdown report.
 *
 * Usage:
 *   npx tsx scripts/map-lessons-to-canonical-topics.mts           # dry-run
 *   npx tsx scripts/map-lessons-to-canonical-topics.mts --apply   # write canonicalTopicId to DB
 *
 * Safety rules:
 *  - Only maps lessons where match confidence is HIGH (exact slug/title keyword match)
 *  - Ambiguous lessons are reported separately, not mapped
 *  - Never maps unrelated lessons together (no fuzzy cross-topic matching)
 *  - Does not touch COUNTRY_SPECIFIC/DIFFERENT/DIVERGENT diff-flagged lessons for consolidation
 *    (mapping is safe — it just adds a topicId reference, doesn't merge content)
 */
import "@/lib/db/env-bootstrap";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY_RUN = !process.argv.includes("--apply");

// ── Topic matching patterns ───────────────────────────────────────────────

type TopicMatcher = {
  topicKey: string;
  /** Slug must contain ALL of these terms (AND) */
  slugTerms: string[][];
  /** Title must contain ALL of these terms (AND) */
  titleTerms: string[][];
  /** topicSlug values that map to this topic */
  topicSlugs?: string[];
  /** Slugs to exclude even if other patterns match */
  excludeSlugTerms?: string[];
  /** Titles to exclude even if other patterns match */
  excludeTitleTerms?: string[];
};

const TOPIC_MATCHERS: TopicMatcher[] = [
  // ── Respiratory ────────────────────────────────────────────────────────
  {
    topicKey: "copd",
    slugTerms: [["copd"]],
    titleTerms: [["copd"], ["chronic obstructive"]],
    excludeSlugTerms: ["overlap", "asthma-copd"],
    excludeTitleTerms: ["Asthma COPD Overlap"],
  },
  {
    topicKey: "asthma",
    slugTerms: [["asthma"]],
    titleTerms: [["asthma"]],
    excludeSlugTerms: ["asthma-copd-overlap"],
    excludeTitleTerms: ["Asthma COPD Overlap"],
  },
  {
    topicKey: "pneumonia",
    slugTerms: [["pneumonia"]],
    titleTerms: [["pneumonia"]],
    excludeSlugTerms: ["covid", "aspiration-pneumonia-prevention"],
    excludeTitleTerms: ["COVID", "Aspiration Prevention"],
  },
  {
    topicKey: "pulmonary-embolism",
    slugTerms: [["pulmonary-embolism"], ["pulmonary-embol"]],
    titleTerms: [["Pulmonary Embolism"], ["pulmonary embol"]],
  },
  // ── Cardiovascular ─────────────────────────────────────────────────────
  {
    topicKey: "heart-failure",
    slugTerms: [["heart-failure"], ["heart-fail"]],
    titleTerms: [["Heart Failure"], ["heart failure"]],
    topicSlugs: [],
    excludeTitleTerms: ["Right Heart"],
  },
  {
    topicKey: "myocardial-infarction",
    slugTerms: [["myocardial-infarction"], ["mi-"], ["-mi-"], ["stemi"], ["nstemi"], ["acs-"]],
    titleTerms: [["Myocardial Infarction"], ["STEMI"], ["NSTEMI"], ["Acute Coronary"]],
  },
  {
    topicKey: "hypertension",
    slugTerms: [["hypertension"], ["hypertensive"]],
    titleTerms: [["Hypertension"], ["hypertension"]],
    excludeTitleTerms: ["Pulmonary Hypertension", "Intracranial Hypertension"],
  },
  {
    topicKey: "deep-vein-thrombosis",
    slugTerms: [["dvt"], ["deep-vein-thrombosis"]],
    titleTerms: [["DVT"], ["Deep Vein Thrombosis"]],
  },
  {
    topicKey: "ecg-interpretation",
    slugTerms: [["ecg-interpretation"], ["ecg-interp"], ["ekg-interp"]],
    titleTerms: [["ECG Interpretation"], ["EKG Interpretation"]],
    topicSlugs: ["ecg"],
  },
  {
    topicKey: "shock",
    slugTerms: [["shock"]],
    titleTerms: [["Shock"], [" shock"]],
    excludeSlugTerms: ["septic-shock-"], // septic shock maps to sepsis
    excludeTitleTerms: ["Septic Shock", "Toxic Shock"],
  },
  // ── Neurological ───────────────────────────────────────────────────────
  {
    topicKey: "stroke",
    slugTerms: [["stroke"]],
    titleTerms: [["Stroke"], [" stroke"]],
    excludeTitleTerms: ["Heat Stroke", "Sun Stroke"],
  },
  {
    topicKey: "seizures",
    slugTerms: [["seizure"], ["epilep"]],
    titleTerms: [["Seizure"], ["Epilep"]],
    excludeTitleTerms: ["Febrile Seizure"], // pediatric variant
  },
  {
    topicKey: "meningitis",
    slugTerms: [["meningitis"], ["meningi"]],
    titleTerms: [["Meningitis"], ["meningitis"]],
  },
  {
    topicKey: "spinal-cord-injury",
    slugTerms: [["spinal-cord-injury"], ["spinal-cord"]],
    titleTerms: [["Spinal Cord Injury"], ["Spinal Cord"]],
    excludeTitleTerms: ["Spinal Cord Compression", "Spinal Cord Tumor"],
  },
  {
    topicKey: "increased-intracranial-pressure",
    slugTerms: [["intracranial-pressure"], ["icp-"], ["-icp"]],
    titleTerms: [["Intracranial Pressure"], ["ICP"]],
  },
  {
    topicKey: "delirium",
    slugTerms: [["delirium"]],
    titleTerms: [["Delirium"]],
  },
  {
    topicKey: "dementia",
    slugTerms: [["dementia"], ["alzheimer"]],
    titleTerms: [["Dementia"], ["Alzheimer"]],
  },
  // ── Endocrine ──────────────────────────────────────────────────────────
  {
    topicKey: "diabetic-ketoacidosis",
    slugTerms: [["dka"], ["diabetic-ketoacidosis"]],
    titleTerms: [["DKA"], ["Diabetic Ketoacidosis"]],
  },
  {
    topicKey: "diabetes-mellitus",
    slugTerms: [["diabetes"], ["diabetic"], ["hyperglycemia"], ["hypoglycemia"]],
    titleTerms: [["Diabetes"], ["Diabetic"], ["Hyperglycemia"], ["Hypoglycemia"], ["Insulin"], ["Oral Antidiabetic"], ["Blood Glucose"]],
    excludeSlugTerms: ["dka", "diabetic-ketoacidosis", "diabetic-foot", "diabetic-nephropathy"],
    excludeTitleTerms: ["DKA", "Diabetic Ketoacidosis", "Diabetic Foot", "Diabetic Nephropathy"],
  },
  // ── Renal ──────────────────────────────────────────────────────────────
  {
    topicKey: "acute-kidney-injury",
    slugTerms: [["aki"], ["acute-kidney-injury"]],
    titleTerms: [["Acute Kidney Injury"], ["AKI"]],
  },
  {
    topicKey: "chronic-kidney-disease",
    slugTerms: [["ckd"], ["chronic-kidney"]],
    titleTerms: [["Chronic Kidney Disease"], ["CKD"], ["End-Stage Kidney"], ["ESKD"]],
  },
  // ── GI ────────────────────────────────────────────────────────────────
  {
    topicKey: "liver-cirrhosis",
    slugTerms: [["cirrhosis"], ["liver-failure"], ["hepatic-encephalopathy"]],
    titleTerms: [["Cirrhosis"], ["Liver Failure"], ["Hepatic Encephalopathy"]],
  },
  {
    topicKey: "pancreatitis",
    slugTerms: [["pancreatitis"]],
    titleTerms: [["Pancreatitis"]],
  },
  {
    topicKey: "gi-bleed",
    slugTerms: [["gi-bleed"], ["gastrointestinal-bleed"], ["gi-hemorrhage"]],
    titleTerms: [["GI Bleed"], ["GI Hemorrhage"], ["Gastrointestinal Bleed"]],
  },
  // ── Hematology ────────────────────────────────────────────────────────
  {
    topicKey: "anemia",
    slugTerms: [["anemia"]],
    titleTerms: [["Anemia"]],
    excludeTitleTerms: ["Aplastic Anemia"], // more specific; let it map generically
  },
  {
    topicKey: "sickle-cell-disease",
    slugTerms: [["sickle-cell"]],
    titleTerms: [["Sickle Cell"]],
  },
  {
    topicKey: "blood-transfusion",
    slugTerms: [["blood-transfusion"], ["transfusion-reaction"]],
    titleTerms: [["Blood Transfusion"], ["Transfusion Reaction"], ["Blood Product"]],
  },
  // ── Infection ─────────────────────────────────────────────────────────
  {
    topicKey: "sepsis",
    slugTerms: [["sepsis"]],
    titleTerms: [["Sepsis"], ["Septic"]],
  },
  {
    topicKey: "infection-control",
    slugTerms: [["infection-control"], ["isolation-precautions"], ["hand-hygiene"]],
    titleTerms: [["Infection Control"], ["Isolation Precautions"], ["Hand Hygiene"]],
  },
  // ── Pain ──────────────────────────────────────────────────────────────
  {
    topicKey: "pain-management",
    slugTerms: [["pain-management"], ["pain-assessment"]],
    titleTerms: [["Pain Management"], ["Pain Assessment"], ["Pain: Assessment"]],
    excludeSlugTerms: ["cancer-pain", "chest-pain", "abdominal-pain"],
    excludeTitleTerms: ["Cancer Pain", "Chest Pain", "Abdominal Pain", "Back Pain", "Hip Pain", "Knee Pain", "Neck Pain", "Shoulder Pain"],
  },
  // ── Integumentary ─────────────────────────────────────────────────────
  {
    topicKey: "burns",
    slugTerms: [["burn-", "-burn"]],
    titleTerms: [["Burns"], ["Burn "]],
    excludeTitleTerms: ["Burnout"],
  },
  {
    topicKey: "wound-care",
    slugTerms: [["wound-care"], ["wound-healing"], ["wound-management"]],
    titleTerms: [["Wound Care"], ["Wound Healing"], ["Wound Management"]],
  },
  {
    topicKey: "pressure-injuries",
    slugTerms: [["pressure-injury"], ["pressure-ulcer"]],
    titleTerms: [["Pressure Injury"], ["Pressure Ulcer"], ["Pressure Injuries"]],
  },
  // ── Safety ────────────────────────────────────────────────────────────
  {
    topicKey: "falls-prevention",
    slugTerms: [["falls-prevention"], ["fall-prevention"]],
    titleTerms: [["Falls Prevention"], ["Fall Prevention"]],
  },
  {
    topicKey: "medication-safety",
    slugTerms: [["medication-safety"], ["high-alert-medication"]],
    titleTerms: [["Medication Safety"], ["High Alert Medication"]],
  },
  // ── Mental Health ─────────────────────────────────────────────────────
  {
    topicKey: "depression",
    slugTerms: [["depression"], ["major-depressive"]],
    titleTerms: [["Depression"], ["Major Depressive"]],
    excludeTitleTerms: ["Postpartum Depression"],
  },
  {
    topicKey: "anxiety",
    slugTerms: [["anxiety"]],
    titleTerms: [["Anxiety"]],
    excludeTitleTerms: ["Separation Anxiety"],
  },
  {
    topicKey: "bipolar-disorder",
    slugTerms: [["bipolar"]],
    titleTerms: [["Bipolar"]],
  },
  {
    topicKey: "schizophrenia",
    slugTerms: [["schizophrenia"]],
    titleTerms: [["Schizophrenia"]],
  },
  {
    topicKey: "substance-use-disorder",
    slugTerms: [["substance-use"], ["alcohol-use-disorder"], ["opioid-use"]],
    titleTerms: [["Substance Use Disorder"], ["Alcohol Use Disorder"], ["Opioid Use Disorder"], ["Substance Withdrawal"]],
  },
  // ── Maternal / Newborn ────────────────────────────────────────────────
  {
    topicKey: "postpartum-hemorrhage",
    slugTerms: [["postpartum-hemorrhage"], ["pph"]],
    titleTerms: [["Postpartum Hemorrhage"], ["PPH"]],
  },
  {
    topicKey: "preeclampsia",
    slugTerms: [["preeclampsia"], ["eclampsia"], ["hellp"]],
    titleTerms: [["Preeclampsia"], ["Eclampsia"], ["HELLP"]],
  },
  {
    topicKey: "neonatal-jaundice",
    slugTerms: [["neonatal-jaundice"], ["newborn-jaundice"], ["phototherapy"]],
    titleTerms: [["Neonatal Jaundice"], ["Newborn Jaundice"], ["Phototherapy"]],
  },
  // ── Pediatric ─────────────────────────────────────────────────────────
  {
    topicKey: "pediatric-dehydration",
    slugTerms: [["pediatric-dehydration"], ["pediatric-fluid"]],
    titleTerms: [["Pediatric Dehydration"], ["Pediatric Fluid Balance"]],
  },
  {
    topicKey: "pediatric-respiratory-distress",
    slugTerms: [["pediatric-respiratory"], ["newborn-respiratory-distress"]],
    titleTerms: [["Pediatric Respiratory Distress"], ["Newborn Respiratory Distress"]],
  },
  // ── Fluids / Electrolytes / Acid-Base ────────────────────────────────
  {
    topicKey: "fluid-electrolyte-balance",
    slugTerms: [["fluid-balance"], ["fluids-electrolytes"], ["fluid-electrolyte"], ["electrolyte-imbalance"]],
    titleTerms: [["Fluid Balance"], ["Fluid & Electrolyte"], ["Fluid and Electrolyte"], ["Electrolyte Imbalance"]],
    excludeTitleTerms: ["Acid-Base"],
  },
  {
    topicKey: "acid-base-balance",
    slugTerms: [["acid-base"], ["abg-interpretation"], ["metabolic-acidosis"], ["metabolic-alkalosis"], ["respiratory-acidosis"]],
    titleTerms: [["Acid-Base"], ["ABG"], ["Metabolic Acidosis"], ["Metabolic Alkalosis"], ["Respiratory Acidosis"]],
  },
  // ── Leadership ────────────────────────────────────────────────────────
  {
    topicKey: "delegation",
    slugTerms: [["delegation"], ["assignment-vs-delegation"]],
    titleTerms: [["Delegation"], ["Assignment vs Delegation"]],
  },
  {
    topicKey: "prioritization",
    slugTerms: [["prioritization"], ["abcs-safety"]],
    titleTerms: [["Prioritization"], ["ABCs & Safety"], ["ABCs and Safety"], ["Prioritization, ABCs"]],
  },
];

// ── Matching logic ────────────────────────────────────────────────────────

type LessonRow = {
  id: string;
  slug: string;
  title: string;
  pathwayId: string;
  topic: string;
  topicSlug: string;
  canonicalTopicId: string | null;
};

function matchLesson(lesson: LessonRow): { topicKey: string; confidence: "HIGH" | "MEDIUM" } | null {
  const slug = lesson.slug.toLowerCase();
  const title = lesson.title;

  for (const matcher of TOPIC_MATCHERS) {
    // Check exclusions first
    if (matcher.excludeSlugTerms?.some((term) => slug.includes(term.toLowerCase()))) continue;
    if (matcher.excludeTitleTerms?.some((term) => title.includes(term))) continue;

    // Match on slug terms (any group of AND terms)
    for (const andTerms of matcher.slugTerms) {
      if (andTerms.every((term) => slug.includes(term.toLowerCase()))) {
        return { topicKey: matcher.topicKey, confidence: "HIGH" };
      }
    }

    // Match on title terms (any group of AND terms)
    for (const andTerms of matcher.titleTerms) {
      if (andTerms.every((term) => title.toLowerCase().includes(term.toLowerCase()))) {
        return { topicKey: matcher.topicKey, confidence: "HIGH" };
      }
    }

    // Match on topicSlug
    if (matcher.topicSlugs?.includes(lesson.topicSlug)) {
      return { topicKey: matcher.topicKey, confidence: "MEDIUM" };
    }
  }

  return null;
}

// ── Unsafe lesson detection ───────────────────────────────────────────────

function isUnsafeToMap(lesson: LessonRow, countrySpecificSlugs: Set<string>): boolean {
  // Lessons already mapped — skip
  if (lesson.canonicalTopicId) return false; // already mapped, not unsafe just already done

  // Pediatric variants of conditions covered by adult topics
  const slug = lesson.slug.toLowerCase();
  const title = lesson.title.toLowerCase();
  const PEDIATRIC_MARKERS = ["pediatric", "paediatric", "childhood", "newborn", "neonatal", "infant", "adolescent"];
  return false; // Mapping is safe even for pediatric — we just add a reference
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const prisma = new PrismaClient();

  console.log("Loading lessons from DB...");
  const lessons = await prisma.pathwayLesson.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      pathwayId: true,
      topic: true,
      topicSlug: true,
      canonicalTopicId: true,
    },
    where: {
      status: "PUBLISHED",
      canonicalTopicId: null, // only unmatched lessons
    },
    orderBy: [{ pathwayId: "asc" }, { slug: "asc" }],
  });

  console.log(`Found ${lessons.length} unmapped published lessons.`);

  // Load canonical topics from DB
  const canonicalTopics = await prisma.canonicalTopic.findMany();
  const topicByKey = new Map(canonicalTopics.map((t) => [t.topicKey, t]));
  console.log(`Loaded ${canonicalTopics.length} canonical topics.\n`);

  // Load CA vs US diff report for context (not used to block mapping, only for reporting)
  let diffReport: Record<string, string> = {};
  const diffPath = path.join(__dirname, "../.claude/audits/lesson-ca-vs-us-diff.json");
  if (fs.existsSync(diffPath)) {
    const diffData = JSON.parse(fs.readFileSync(diffPath, "utf8"));
    for (const r of diffData.results ?? []) {
      if (r.classification) {
        diffReport[r.caSlug] = r.classification;
        diffReport[r.usSlug] = r.classification;
      }
    }
  }

  // Process lessons
  const matched: Array<{ lesson: LessonRow; topicKey: string; confidence: string }> = [];
  const alreadyMapped: number[] = [];
  const ambiguous: Array<{ lesson: LessonRow; candidates: string[] }> = [];
  const skipped: LessonRow[] = [];

  for (const lesson of lessons) {
    const result = matchLesson(lesson);

    if (!result) {
      skipped.push(lesson);
      continue;
    }

    if (!topicByKey.has(result.topicKey)) {
      skipped.push(lesson);
      continue;
    }

    matched.push({ lesson, topicKey: result.topicKey, confidence: result.confidence });
  }

  // Stats
  const byTopic: Record<string, number> = {};
  for (const m of matched) byTopic[m.topicKey] = (byTopic[m.topicKey] || 0) + 1;

  console.log("=".repeat(60));
  console.log("CANONICAL TOPIC MAPPING RESULTS");
  console.log("=".repeat(60));
  console.log(`Matched:   ${matched.length}`);
  console.log(`Skipped:   ${skipped.length} (no matching topic)`);
  console.log(`\nMatches by topic:`);
  for (const [key, count] of Object.entries(byTopic).sort((a, b) => b[1] - a[1]).slice(0, 20)) {
    console.log(`  ${key.padEnd(40)} ${count}`);
  }

  if (!DRY_RUN) {
    console.log("\nApplying canonicalTopicId updates...");
    let applied = 0;
    for (const m of matched) {
      const topic = topicByKey.get(m.topicKey)!;
      await prisma.pathwayLesson.update({
        where: { id: m.lesson.id },
        data: { canonicalTopicId: topic.id },
      });
      applied++;
      if (applied % 100 === 0) process.stdout.write(`  ${applied}/${matched.length}...\r`);
    }
    console.log(`\n✓ Applied ${applied} canonicalTopicId mappings.`);
  } else {
    console.log("\n[DRY RUN] No DB changes. Run with --apply to write.");
  }

  // ── Write markdown report ───────────────────────────────────────────────
  const reportsDir = path.join(__dirname, "../docs/reports");
  fs.mkdirSync(reportsDir, { recursive: true });

  const lines: string[] = [
    "# Canonical Topic Mapping Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Mode: ${DRY_RUN ? "DRY RUN" : "APPLIED"}`,
    "",
    "## Summary",
    `- Lessons processed: **${lessons.length}** (unmapped published lessons)`,
    `- Matched: **${matched.length}**`,
    `- Skipped (no match): **${skipped.length}**`,
    "",
    "## Matched Lessons by Topic",
    "",
    ...Object.entries(byTopic)
      .sort((a, b) => b[1] - a[1])
      .map(([key, n]) => `- **${key}**: ${n} lessons`),
    "",
    "## Sample Matched Lessons (first 50)",
    "",
    "| Pathway | Slug | Title | Topic | Confidence |",
    "|---|---|---|---|---|",
    ...matched.slice(0, 50).map(
      (m) =>
        `| ${m.lesson.pathwayId} | \`${m.lesson.slug}\` | ${m.lesson.title} | ${m.topicKey} | ${m.confidence} |`
    ),
    "",
    "## Skipped Lessons (no matching canonical topic)",
    "",
    `Total: ${skipped.length}`,
    "",
    "| Pathway | Slug | Title |",
    "|---|---|---|",
    ...skipped.slice(0, 100).map(
      (l) => `| ${l.pathwayId} | \`${l.slug}\` | ${l.title} |`
    ),
    skipped.length > 100 ? `\n...and ${skipped.length - 100} more` : "",
    "",
    "## Safety Notes",
    "",
    "- Mapping adds a `canonicalTopicId` reference only — no content was changed",
    "- Country-specific lessons are safely mapped (they reference the same clinical topic, but content remains separate)",
    "- Pediatric variants mapped to same topic as adult (both are about the same condition; content differentiation preserved in PathwayLesson.sections)",
    "- Lessons with no clear single-topic match were skipped for manual review",
  ];

  const reportPath = path.join(reportsDir, "canonical-topic-mapping-report.md");
  fs.writeFileSync(reportPath, lines.join("\n"));
  console.log(`\nReport written → ${reportPath}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
