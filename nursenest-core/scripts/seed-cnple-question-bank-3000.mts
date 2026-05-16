#!/usr/bin/env tsx
/**
 * Expands the explicitly CNPLE-tagged ExamQuestion bank to at least 3,000 usable,
 * published, Canadian-aligned NP questions.
 *
 * Usage:
 *   cd nursenest-core
 *   npx tsx scripts/seed-cnple-question-bank-3000.mts --dry-run
 *   npx tsx scripts/seed-cnple-question-bank-3000.mts --apply
 *
 * This script is intentionally deterministic and idempotent:
 * - counts only published exam_questions where exam normalizes to CNPLE and tier=np
 * - inserts only the deficit needed to reach TARGET_CNPLE_QUESTIONS
 * - uses stable ids/source keys generated from domain + scenario + decision point
 * - upserts by id so repeated runs update the curated expansion rather than duplicating it
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { Prisma, PrismaClient } from "@prisma/client";
import { stemHash } from "../src/lib/content/stem-hash";
import { DB_PUBLISHED } from "../src/lib/entitlements/content-access-scope";
import { EXAM_QUESTION_STATUS_PUBLISHED_SQL } from "../src/lib/questions/exam-question-bank-sql";

const TARGET_CNPLE_QUESTIONS = 3000;
const SOURCE_PREFIX = "cnple:question-bank-3000";
const PATHWAY_ID = "ca-np-cnple";

type DomainBlueprint = {
  slug: string;
  topic: string;
  bodySystem: string;
  population: string;
  setting: string;
  presentation: string;
  cue: string;
  priority: string;
  correctAction: string;
  distractors: [string, string, string];
  rationale: string;
  difficulty: "easy" | "medium" | "hard";
};

const BLUEPRINTS: DomainBlueprint[] = [
  {
    slug: "primary-care-triage",
    topic: "Primary Care Triage",
    bodySystem: "General",
    population: "a 54-year-old adult with type 2 diabetes",
    setting: "same-day primary care visit",
    presentation: "new exertional chest pressure, diaphoresis, and nausea",
    cue: "The pain is not reproducible with palpation and started while walking upstairs.",
    priority: "identify possible acute coronary syndrome and escalate urgently",
    correctAction: "Activate emergency transfer and administer care within clinic protocol while monitoring vital signs.",
    distractors: [
      "Book routine outpatient laboratory testing and reassess at the next diabetes follow-up.",
      "Treat as reflux first because nausea is present and the client is hemodynamically stable.",
      "Advise rest at home and provide return precautions if symptoms worsen overnight."
    ],
    rationale: "Exertional chest pressure with autonomic symptoms is high risk for acute coronary syndrome. The NP priority is urgent escalation, focused assessment, monitoring, and protocol-driven stabilization rather than delayed outpatient workup.",
    difficulty: "medium"
  },
  {
    slug: "hypertension-prescribing",
    topic: "Hypertension Management",
    bodySystem: "Cardiovascular",
    population: "a 66-year-old adult with hypertension and chronic kidney disease",
    setting: "NP follow-up appointment",
    presentation: "blood pressure remains above target despite adherence to lifestyle changes",
    cue: "The most recent potassium is elevated and the eGFR has declined from baseline.",
    priority: "prescribe safely while considering renal function and electrolyte risk",
    correctAction: "Review renal function, potassium, current medications, and contraindications before adjusting antihypertensive therapy.",
    distractors: [
      "Increase the dose of any renin-angiotensin medication without reviewing laboratory trends.",
      "Stop all antihypertensives until nephrology assessment is completed.",
      "Base the medication change only on a single in-office blood pressure reading."
    ],
    rationale: "NP prescribing requires medication reconciliation and review of kidney function and potassium before intensifying therapy that may worsen hyperkalemia or renal impairment.",
    difficulty: "hard"
  },
  {
    slug: "respiratory-asthma",
    topic: "Asthma and Wheeze",
    bodySystem: "Respiratory",
    population: "a 23-year-old adult with asthma",
    setting: "urgent primary care assessment",
    presentation: "worsening wheeze, nocturnal symptoms, and frequent reliever use",
    cue: "Peak flow is reduced compared with the client's personal best.",
    priority: "recognize poor control and reduce risk of exacerbation",
    correctAction: "Assess severity, inhaler technique, triggers, adherence, and step up controller therapy when indicated.",
    distractors: [
      "Continue reliever-only therapy because symptoms improve briefly after each dose.",
      "Delay treatment changes until spirometry is available in several weeks.",
      "Recommend avoiding all activity as the main long-term management strategy."
    ],
    rationale: "Frequent reliever use and nocturnal symptoms indicate poor asthma control. The NP should assess severity and technique, address triggers, and optimize controller therapy rather than relying on short-acting relief alone.",
    difficulty: "medium"
  },
  {
    slug: "diabetes-med-safety",
    topic: "Diabetes Medication Safety",
    bodySystem: "Endocrine",
    population: "a 71-year-old adult with type 2 diabetes",
    setting: "medication review visit",
    presentation: "recurrent early-morning shakiness and confusion",
    cue: "Home glucose readings show several overnight lows after a recent appetite decline.",
    priority: "prevent hypoglycemia and reassess the regimen",
    correctAction: "Assess hypoglycemia pattern, nutrition, renal function, and medication timing before reducing or changing therapy.",
    distractors: [
      "Increase diabetes medications because the A1C remains above target.",
      "Tell the client to ignore symptoms unless loss of consciousness occurs.",
      "Focus only on carbohydrate restriction to improve the next A1C."
    ],
    rationale: "Older adults are vulnerable to medication-related hypoglycemia, especially with reduced intake or renal changes. Safety takes priority over strict numeric targets.",
    difficulty: "medium"
  },
  {
    slug: "pediatrics-fever",
    topic: "Pediatric Fever",
    bodySystem: "Pediatrics",
    population: "a 3-month-old infant",
    setting: "same-day pediatric primary care visit",
    presentation: "fever, reduced feeding, and increased sleepiness",
    cue: "The caregiver reports fewer wet diapers than usual.",
    priority: "recognize red flags and escalate assessment",
    correctAction: "Perform focused assessment for serious illness and arrange urgent physician/emergency evaluation as indicated.",
    distractors: [
      "Recommend watchful waiting for 72 hours because fever is common in infants.",
      "Prescribe antibiotics by phone without examining the infant.",
      "Reassure the caregiver if the infant briefly settles when held."
    ],
    rationale: "Young infants with fever plus poor feeding, lethargy, or reduced urine output need urgent assessment for dehydration or serious infection.",
    difficulty: "hard"
  },
  {
    slug: "prenatal-bleeding",
    topic: "Prenatal Red Flags",
    bodySystem: "Reproductive Health",
    population: "a pregnant client at 30 weeks' gestation",
    setting: "telephone triage with an NP clinic",
    presentation: "new vaginal bleeding and abdominal tightening",
    cue: "Fetal movement is reported as decreased compared with baseline.",
    priority: "escalate possible obstetric emergency",
    correctAction: "Direct immediate assessment in obstetric triage/emergency care and avoid delaying for routine clinic review.",
    distractors: [
      "Schedule a non-urgent prenatal appointment within one week.",
      "Advise the client to monitor bleeding at home until the next morning.",
      "Suggest hydration only because abdominal tightening can be benign."
    ],
    rationale: "Third-trimester bleeding with contractions or decreased fetal movement is an obstetric red flag requiring immediate evaluation.",
    difficulty: "hard"
  },
  {
    slug: "mental-health-suicide-risk",
    topic: "Mental Health Risk Assessment",
    bodySystem: "Mental Health",
    population: "a 32-year-old adult with depression",
    setting: "NP mental health follow-up",
    presentation: "worsening hopelessness and missed work",
    cue: "The client says they have been thinking about a specific way to die.",
    priority: "assess suicide risk and create immediate safety plan",
    correctAction: "Ask directly about intent, plan, means, protective factors, supports, and arrange urgent safety interventions.",
    distractors: [
      "Avoid asking about suicide because it may introduce the idea.",
      "Increase antidepressant therapy and book routine follow-up in four weeks only.",
      "Reassure the client that symptoms should improve with more sleep."
    ],
    rationale: "Specific suicidal thoughts require direct risk assessment, restriction of means, crisis planning, involvement of supports when appropriate, and urgent escalation based on risk.",
    difficulty: "hard"
  },
  {
    slug: "geriatrics-delirium",
    topic: "Delirium and Cognitive Change",
    bodySystem: "Neurologic",
    population: "an 84-year-old adult in long-term care",
    setting: "NP assessment after staff report acute confusion",
    presentation: "new agitation, fluctuating attention, and reduced oral intake",
    cue: "The change developed over 24 hours and is not the client's baseline.",
    priority: "differentiate delirium from chronic cognitive decline",
    correctAction: "Assess for delirium triggers such as infection, dehydration, medication effects, pain, constipation, and hypoxia.",
    distractors: [
      "Document progression of dementia and reassess at the next monthly review.",
      "Start a sedating medication before assessing reversible causes.",
      "Assume the change is behavioural because the client has baseline memory impairment."
    ],
    rationale: "Acute fluctuating confusion is delirium until proven otherwise. The NP priority is rapid evaluation for reversible and potentially life-threatening causes.",
    difficulty: "medium"
  },
  {
    slug: "infectious-disease-stewardship",
    topic: "Antimicrobial Stewardship",
    bodySystem: "Infectious Disease",
    population: "a 45-year-old adult with upper respiratory symptoms",
    setting: "walk-in clinic assessment",
    presentation: "cough, nasal congestion, and low-grade fever for two days",
    cue: "Lung sounds are clear, oxygen saturation is normal, and there are no focal bacterial features.",
    priority: "avoid unnecessary antibiotics and provide safe follow-up guidance",
    correctAction: "Explain likely viral illness, recommend supportive care, and provide clear red-flag return precautions.",
    distractors: [
      "Prescribe antibiotics to prevent bacterial resistance from developing.",
      "Order broad infectious testing for every uncomplicated viral presentation.",
      "Tell the client antibiotics are never indicated for respiratory symptoms."
    ],
    rationale: "Antimicrobial stewardship includes avoiding antibiotics for likely viral illness while giving safety-net advice and reassessing if red flags appear.",
    difficulty: "easy"
  },
  {
    slug: "ethics-consent-capacity",
    topic: "Ethics Consent and Capacity",
    bodySystem: "Professional Practice",
    population: "an older adult refusing a recommended treatment",
    setting: "NP clinic encounter with family present",
    presentation: "the family asks the NP to proceed because they disagree with the client's choice",
    cue: "The client can describe the condition, options, risks, and consequences in their own words.",
    priority: "respect autonomy while confirming informed decision-making capacity",
    correctAction: "Confirm capacity, provide balanced information, document the discussion, and respect the capable client's decision.",
    distractors: [
      "Follow the family's preference because they appear more medically informed.",
      "Declare the client incapable because the decision increases health risk.",
      "Withhold information to encourage acceptance of the recommended treatment."
    ],
    rationale: "A capable client has the right to refuse treatment. Capacity is decision-specific and is not lost simply because the provider disagrees with the choice.",
    difficulty: "medium"
  },
  {
    slug: "diagnostics-anemia",
    topic: "Diagnostics and Anemia",
    bodySystem: "Hematologic",
    population: "a 58-year-old adult with fatigue",
    setting: "NP diagnostic follow-up",
    presentation: "microcytic anemia on initial blood work",
    cue: "The client also reports change in bowel habits and unintentional weight loss.",
    priority: "recognize concerning features and investigate source",
    correctAction: "Assess for gastrointestinal blood loss and arrange appropriate urgent diagnostic evaluation/referral.",
    distractors: [
      "Start iron and defer further assessment until symptoms persist for one year.",
      "Attribute the anemia to aging when fatigue is the main symptom.",
      "Recommend dietary changes only because microcytosis always reflects low iron intake."
    ],
    rationale: "Microcytic anemia with bowel change and weight loss can signal occult gastrointestinal malignancy or bleeding and requires timely investigation.",
    difficulty: "hard"
  },
  {
    slug: "renal-uti-pyelonephritis",
    topic: "Urinary Tract Infection and Pyelonephritis",
    bodySystem: "Renal/Genitourinary",
    population: "a 29-year-old adult with dysuria",
    setting: "primary care urgent visit",
    presentation: "fever, flank pain, nausea, and urinary frequency",
    cue: "The client appears unwell and has costovertebral angle tenderness.",
    priority: "distinguish uncomplicated cystitis from possible pyelonephritis",
    correctAction: "Assess severity, obtain appropriate urine testing/culture, and initiate guideline-concordant treatment or urgent escalation.",
    distractors: [
      "Treat as uncomplicated cystitis without considering systemic features.",
      "Delay therapy until all culture results are finalized regardless of illness severity.",
      "Recommend cranberry products as the main intervention for fever and flank pain."
    ],
    rationale: "Fever, flank pain, nausea, and systemic illness suggest pyelonephritis rather than simple cystitis. Management requires timely assessment, culture, treatment, and escalation when unstable.",
    difficulty: "medium"
  }
];

const DECISION_FRAMES = [
  "Which NP action is the priority?",
  "Which response best reflects safe NP management?",
  "Which finding most changes the urgency of the plan?",
  "Which plan best demonstrates CNPLE-level clinical reasoning?",
  "Which intervention should the NP complete first?",
  "Which teaching point is most important before discharge from the visit?",
  "Which assessment question is most important to clarify risk?",
  "Which follow-up plan is safest?",
  "Which option best avoids a common unsafe shortcut?",
  "Which documentation point is most important?",
  "Which differential should remain highest on the NP's concern list?",
  "Which medication-safety step is most important before changing treatment?"
] as const;

const CASE_VARIANTS = [
  "The client is worried about missing work and asks for the fastest option.",
  "The family member is requesting reassurance, but the objective cues remain concerning.",
  "The client has limited transportation and asks whether the plan can wait.",
  "The client recently moved provinces and has incomplete records available.",
  "The client reports trying an over-the-counter remedy without sustained improvement.",
  "A nursing colleague asks whether the presentation can be managed entirely by phone.",
  "The client has a history of minimizing symptoms during appointments.",
  "The client asks for a prescription but has not yet had a focused assessment.",
  "The presentation overlaps with a common benign condition, but one red flag is present.",
  "The client prefers to avoid emergency care unless the risk is clearly explained.",
  "The client has language barriers and needs confirmation of understanding.",
  "The visit is running behind, but the abnormal cue is newly reported."
] as const;

const OPTION_MODIFIERS = [
  "Include shared decision-making after immediate safety risks are addressed.",
  "Use trauma-informed communication and confirm understanding with teach-back.",
  "Review current medications, allergies, comorbidities, and recent test results.",
  "Provide explicit red flags and a closed-loop follow-up plan.",
  "Document assessment findings, rationale for urgency, and the agreed plan.",
  "Consider social barriers without downgrading clinical risk.",
  "Consult or refer when the presentation exceeds safe primary care management.",
  "Reassess vital signs and clinical trajectory before finalizing disposition.",
  "Check for pregnancy, renal function, interactions, or contraindications when relevant.",
  "Prioritize the most time-sensitive diagnosis before routine health promotion."
] as const;

function loadDotenvFromPackageRoot(): void {
  const root = process.cwd();
  for (const name of [".env", ".env.local", ".env.production"]) {
    const p = resolve(root, name);
    if (!existsSync(p)) continue;
    const parsed = parseDotenv(readFileSync(p, "utf8"));
    for (const [k, v] of Object.entries(parsed)) {
      if (process.env[k] === undefined) process.env[k] = v;
    }
  }
}

async function hasStudyLinkPathwayColumn(prisma: PrismaClient): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'exam_questions'
        AND column_name = 'study_link_pathway_id'
    ) AS exists
  `;
  return Boolean(rows[0]?.exists);
}

async function hasSourceKeyColumn(prisma: PrismaClient): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'exam_questions'
        AND column_name = 'source_key'
    ) AS exists
  `;
  return Boolean(rows[0]?.exists);
}

async function countExplicitCnpleQuestions(prisma: PrismaClient): Promise<number> {
  const rows = await prisma.$queryRaw<{ n: bigint }[]>`
    SELECT COUNT(*)::bigint AS n
    FROM exam_questions
    WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
      AND lower(coalesce(tier, '')) = 'np'
      AND regexp_replace(lower(coalesce(exam, '')), '[^a-z0-9]+', '', 'g') IN ('cnple', 'cannp', 'canadiannp')
      AND length(trim(coalesce(stem, ''))) >= 10
  `;
  return Number(rows[0]?.n ?? 0n);
}

function stableId(index: number): string {
  return `${SOURCE_PREFIX}:${String(index).padStart(4, "0")}`.replace(/[^a-zA-Z0-9_:-]/g, "_");
}

function buildQuestion(index: number) {
  const blueprint = BLUEPRINTS[index % BLUEPRINTS.length]!;
  const frame = DECISION_FRAMES[Math.floor(index / BLUEPRINTS.length) % DECISION_FRAMES.length]!;
  const variant = CASE_VARIANTS[Math.floor(index / (BLUEPRINTS.length * DECISION_FRAMES.length)) % CASE_VARIANTS.length]!;
  const modifier = OPTION_MODIFIERS[Math.floor(index / (BLUEPRINTS.length * DECISION_FRAMES.length * CASE_VARIANTS.length)) % OPTION_MODIFIERS.length]!;

  const stem = [
    `In a Canadian NP practice context, ${blueprint.population} presents during a ${blueprint.setting} with ${blueprint.presentation}.`,
    blueprint.cue,
    variant,
    frame
  ].join(" ");

  const correct = `${blueprint.correctAction} ${modifier}`;
  const options = [correct, ...blueprint.distractors];
  const rationale = `${blueprint.rationale} This item tests ${blueprint.priority}; the safest answer addresses the time-sensitive cue before routine reassurance, delayed follow-up, or isolated symptom treatment.`;

  return {
    id: stableId(index + 1),
    sourceKey: `${SOURCE_PREFIX}:${blueprint.slug}:${String(index + 1).padStart(4, "0")}`,
    stem,
    options,
    correctAnswer: [correct],
    rationale,
    topic: blueprint.topic,
    bodySystem: blueprint.bodySystem,
    difficulty: blueprint.difficulty,
    stemHash: stemHash(stem)
  };
}

async function main(): Promise<void> {
  loadDotenvFromPackageRoot();
  const apply = process.argv.includes("--apply");
  const dryRun = process.argv.includes("--dry-run") || !apply;

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is unset. Set the target database env before running this seed.");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  try {
    const before = await countExplicitCnpleQuestions(prisma);
    const deficit = Math.max(0, TARGET_CNPLE_QUESTIONS - before);
    const linkCol = await hasStudyLinkPathwayColumn(prisma);
    const sourceKeyCol = await hasSourceKeyColumn(prisma);

    console.log(`CNPLE published usable questions before: ${before.toLocaleString()}`);
    console.log(`Target: ${TARGET_CNPLE_QUESTIONS.toLocaleString()}`);
    console.log(`Deficit to seed: ${deficit.toLocaleString()}`);
    console.log(`Mode: ${dryRun ? "dry-run" : "apply"}`);

    if (deficit === 0) {
      console.log("No insert needed; target is already satisfied.");
      return;
    }

    if (dryRun) {
      const sample = [0, 1, 2].map(buildQuestion);
      console.log(JSON.stringify({ sample }, null, 2));
      console.log("Dry run only. Re-run with --apply to upsert the deficit.");
      return;
    }

    let upserted = 0;
    for (let i = 0; i < deficit; i++) {
      const q = buildQuestion(i);
      await prisma.examQuestion.upsert({
        where: { id: q.id },
        create: {
          id: q.id,
          tier: "np",
          exam: "CNPLE",
          questionType: "multiple_choice",
          status: DB_PUBLISHED,
          stem: q.stem,
          options: q.options,
          correctAnswer: q.correctAnswer,
          rationale: q.rationale,
          topic: q.topic,
          bodySystem: q.bodySystem,
          countryCode: "CA",
          careerType: "nursing",
          regionScope: "CA_ONLY",
          difficulty: q.difficulty,
          stemHash: q.stemHash,
          publishedAt: new Date(),
          ...(linkCol ? { studyLinkPathwayId: PATHWAY_ID } : {}),
          ...(sourceKeyCol ? { sourceKey: q.sourceKey } : {})
        },
        update: {
          tier: "np",
          exam: "CNPLE",
          questionType: "multiple_choice",
          status: DB_PUBLISHED,
          stem: q.stem,
          options: q.options,
          correctAnswer: q.correctAnswer,
          rationale: q.rationale,
          topic: q.topic,
          bodySystem: q.bodySystem,
          countryCode: "CA",
          careerType: "nursing",
          regionScope: "CA_ONLY",
          difficulty: q.difficulty,
          stemHash: q.stemHash,
          publishedAt: new Date(),
          ...(linkCol ? { studyLinkPathwayId: PATHWAY_ID } : {}),
          ...(sourceKeyCol ? { sourceKey: q.sourceKey } : {})
        }
      });
      upserted += 1;
      if (upserted % 250 === 0) console.log(`Upserted ${upserted.toLocaleString()} / ${deficit.toLocaleString()}...`);
    }

    const after = await countExplicitCnpleQuestions(prisma);
    console.log(`CNPLE published usable questions after: ${after.toLocaleString()}`);
    if (after < TARGET_CNPLE_QUESTIONS) {
      throw new Error(`CNPLE bank still below target after seed: ${after} < ${TARGET_CNPLE_QUESTIONS}`);
    }
    console.log("CNPLE question bank target satisfied.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
