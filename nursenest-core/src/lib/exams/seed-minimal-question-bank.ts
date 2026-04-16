import { ContentStatus, CountryCode, ExamFamily, Prisma, TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";
import { isNonFatalPrismaSchemaError } from "@/lib/prisma/safe-reads";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";

/** Fixed exam ids — one published exam per (country, tier) so submit() can resolve access. */
function examIdFor(country: CountryCode, tier: TierCode): string {
  return `seed_exam_${country}_${tier}`;
}

const EXAM_SEEDS: Array<{
  country: CountryCode;
  tier: TierCode;
  title: string;
  examFamily: ExamFamily;
}> = [
  { country: "CA", tier: "RPN", title: "Canada RPN practice", examFamily: ExamFamily.NCLEX_PN },
  { country: "CA", tier: "LVN_LPN", title: "Canada PN practice", examFamily: ExamFamily.NCLEX_PN },
  { country: "CA", tier: "RN", title: "Canada RN practice", examFamily: ExamFamily.NCLEX_RN },
  { country: "CA", tier: "NP", title: "Canada NP practice", examFamily: ExamFamily.NP },
  { country: "CA", tier: "ALLIED", title: "Canada allied practice", examFamily: ExamFamily.ALLIED },
  { country: "US", tier: "RPN", title: "US PN practice", examFamily: ExamFamily.NCLEX_PN },
  { country: "US", tier: "LVN_LPN", title: "US LVN/LPN practice", examFamily: ExamFamily.NCLEX_PN },
  { country: "US", tier: "RN", title: "US RN practice", examFamily: ExamFamily.NCLEX_RN },
  { country: "US", tier: "NP", title: "US NP practice", examFamily: ExamFamily.NP },
  { country: "US", tier: "ALLIED", title: "US allied practice", examFamily: ExamFamily.ALLIED },
];

type QSeed = {
  id: string;
  tier: string;
  exam: string;
  questionType: string;
  stem: string;
  options: string[];
  correctAnswer: Prisma.InputJsonValue;
  rationale: string;
  topic?: string;
  bodySystem?: string;
};

const QUESTION_SEEDS: QSeed[] = [
  {
    id: "seed_q_rpn_001",
    tier: "rpn",
    exam: "NCLEX-PN",
    questionType: "multiple_choice",
    stem: "A client reports dizziness when standing slowly. Which action should the nurse take first?",
    options: [
      "Assess orthostatic vital signs",
      "Administer an antiemetic",
      "Encourage increased fluid intake without assessment",
      "Discharge the client home",
    ],
    correctAnswer: ["Assess orthostatic vital signs"],
    rationale: "Assess before treating—orthostatic changes can reflect volume status or medications.",
    topic: "Safety",
    bodySystem: "Cardiovascular",
  },
  {
    id: "seed_q_rpn_002",
    tier: "rpn",
    exam: "NCLEX-PN",
    questionType: "multiple_choice",
    stem: "Which finding should the nurse report immediately for a post-op client?",
    options: ["Pain 3/10 controlled with PRN", "Oxygen saturation 89% on room air", "Soft, non-tender abdomen", "Urine output 60 mL in the last hour"],
    correctAnswer: ["Oxygen saturation 89% on room air"],
    rationale: "Hypoxemia requires prompt evaluation and intervention per protocol.",
    topic: "Prioritization",
    bodySystem: "Respiratory",
  },
  {
    id: "seed_q_lvn_001",
    tier: "lvn",
    exam: "NCLEX-PN",
    questionType: "multiple_choice",
    stem: "A provider orders an unfamiliar medication. What is the LVN/LPN priority?",
    options: [
      "Clarify the order using appropriate channels if scope/policy requires",
      "Ask the client which dose they prefer",
      "Skip the dose if unsure",
      "Borrow medication from another unit",
    ],
    correctAnswer: ["Clarify the order using appropriate channels if scope/policy requires"],
    rationale: "Never guess with medications—clarify per policy and scope.",
    topic: "Pharmacology",
  },
  {
    id: "seed_q_rn_001",
    tier: "rn",
    exam: "NCLEX-RN",
    questionType: "multiple_choice",
    stem: "Which client should the nurse see first?",
    options: [
      "Stable client awaiting routine morning medications",
      "Client with sudden confusion and slurred speech",
      "Client requesting a blanket",
      "Client scheduled for discharge this afternoon",
    ],
    correctAnswer: ["Client with sudden confusion and slurred speech"],
    rationale: "Neurologic change suggests urgent assessment—treat as highest priority.",
    topic: "Prioritization",
    bodySystem: "Neurological",
  },
  {
    id: "seed_q_rn_002",
    tier: "rn",
    exam: "NCLEX-RN",
    questionType: "SATA",
    stem: "Select all that apply: signs of fluid overload may include:",
    options: ["Crackles in lung bases", "Peripheral edema", "Dry mucous membranes", "Jugular venous distention"],
    correctAnswer: ["Crackles in lung bases", "Peripheral edema", "Jugular venous distention"],
    rationale: "Dry mucous membranes suggests dehydration, not overload.",
    topic: "Fluids",
    bodySystem: "Cardiovascular",
  },
  {
    id: "seed_q_np_001",
    tier: "np",
    exam: "NP",
    questionType: "multiple_choice",
    stem: "Which element best reflects advanced practice assessment depth?",
    options: [
      "Synthesize history, exam, and differentials before ordering diagnostics",
      "Rely solely on protocol checklists",
      "Defer physical exam if labs are pending",
      "Avoid documenting clinical reasoning",
    ],
    correctAnswer: ["Synthesize history, exam, and differentials before ordering diagnostics"],
    rationale: "NP-level items emphasize synthesis and safe diagnostic reasoning.",
    topic: "Clinical reasoning",
  },
  {
    id: "seed_q_allied_001",
    tier: "allied",
    exam: "ALLIED",
    questionType: "multiple_choice",
    stem: "Before a high-risk procedure, which safety practice is most foundational?",
    options: [
      "Use two identifiers and follow time-out policy",
      "Rely on the client’s verbal confirmation alone",
      "Skip documentation to save time",
      "Proceed if the room feels calm",
    ],
    correctAnswer: ["Use two identifiers and follow time-out policy"],
    rationale: "Universal protocols reduce wrong-patient and wrong-site events.",
    topic: "Safety",
  },
  {
    id: "seed_q_allied_002",
    tier: "allied",
    exam: "ALLIED",
    questionType: "multiple_choice",
    stem: "A client reports new chest pressure mid-session. What should the allied clinician do first?",
    options: [
      "Stop the procedure and activate emergency response per facility policy",
      "Continue and document later",
      "Ask the client to walk it off",
      "Dismiss as anxiety without assessment",
    ],
    correctAnswer: ["Stop the procedure and activate emergency response per facility policy"],
    rationale: "New chest pressure requires immediate evaluation—stop and escalate.",
    topic: "Emergency",
    bodySystem: "Cardiovascular",
  },
];

/**
 * If the bank is empty, insert minimal published exams + questions (idempotent).
 * Safe on repeated calls; skips when published questions already exist.
 *
 * **Production:** do not call from learner routes — use {@link allowRuntimeMinimalQuestionBankSeed}
 * or enqueue `content.seed_minimal_question_bank_if_empty` via `POST /api/cron/jobs` (see `processPendingJobs`).
 */
export async function seedMinimalQuestionBankIfEmpty(): Promise<{ seeded: boolean }> {
  if (!isDatabaseUrlConfigured()) return { seeded: false };

  try {
    const anyPublished = await prisma.examQuestion.findFirst({
      where: { status: DB_PUBLISHED },
      select: { id: true },
    });
    if (anyPublished) return { seeded: false };
  } catch (e) {
    if (isNonFatalPrismaSchemaError(e)) {
      safeServerLog("seed_bank", "skip_schema", {});
      return { seeded: false };
    }
    throw e;
  }

  try {
    await prisma.$transaction(async (tx) => {
      for (const ex of EXAM_SEEDS) {
        await tx.exam.upsert({
          where: { id: examIdFor(ex.country, ex.tier) },
          create: {
            id: examIdFor(ex.country, ex.tier),
            title: ex.title,
            country: ex.country,
            tier: ex.tier,
            status: ContentStatus.PUBLISHED,
            examFamily: ex.examFamily,
          },
          update: {
            title: ex.title,
            status: ContentStatus.PUBLISHED,
            examFamily: ex.examFamily,
          },
        });
      }

      for (const q of QUESTION_SEEDS) {
        await tx.examQuestion.upsert({
          where: { id: q.id },
          create: {
            id: q.id,
            tier: q.tier,
            exam: q.exam,
            questionType: q.questionType,
            status: DB_PUBLISHED,
            stem: q.stem,
            options: q.options,
            correctAnswer: q.correctAnswer,
            rationale: q.rationale,
            topic: q.topic,
            bodySystem: q.bodySystem,
            regionScope: "BOTH",
          },
          update: {
            stem: q.stem,
            options: q.options,
            correctAnswer: q.correctAnswer,
            rationale: q.rationale,
            status: DB_PUBLISHED,
            regionScope: "BOTH",
          },
        });
      }
    });
    safeServerLog("seed_bank", "seeded_minimal_pool", { questions: QUESTION_SEEDS.length, exams: EXAM_SEEDS.length });
    return { seeded: true };
  } catch (e) {
    if (isNonFatalPrismaSchemaError(e)) {
      safeServerLog("seed_bank", "transaction_failed_schema", {});
      return { seeded: false };
    }
    safeServerLogCritical("seed_bank", "transaction_failed", {}, e);
    return { seeded: false };
  }
}
