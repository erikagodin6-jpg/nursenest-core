#!/usr/bin/env npx tsx
/**
 * Seeds a year-long NurseNest SEO blog schedule: 5 scheduled posts/day for 365 days.
 *
 * Production intent:
 * - DB-backed BlogPost rows, not static files.
 * - Skips existing slugs by default to avoid duplicate/cannibalized posts.
 * - Schedules future publication times through BlogPost.publishAt/scheduledAt.
 * - Uses the existing blog scheduler/promoter to publish rows when due.
 *
 * Usage from nursenest-core/:
 *   npx tsx scripts/blog/seed-year-long-seo-blog-schedule.mts --dry-run
 *   npx tsx scripts/blog/seed-year-long-seo-blog-schedule.mts --apply
 *   npx tsx scripts/blog/seed-year-long-seo-blog-schedule.mts --apply --start=2026-05-18 --days=30
 */
import "../../src/lib/db/script-env-bootstrap";

import {
  BlogFunnelStage,
  BlogImageStatus,
  BlogPostIntent,
  BlogPostStatus,
  BlogPostTemplate,
  BlogWorkflowStatus,
  type Prisma,
} from "@prisma/client";

import { prisma } from "../lib/prisma-script-client";

type TierKey = "RN" | "RPN" | "NP" | "ALLIED" | "NEW_GRAD" | "PRE_NURSING" | "ECG";

type TopicSeed = {
  subject: string;
  angle: string;
  tier: TierKey;
  exam: string;
  careerSlug: string | null;
  category: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  ctaHref: string;
  ctaText: string;
  links: string[];
  template: BlogPostTemplate;
  intent: BlogPostIntent;
  funnel: BlogFunnelStage;
};

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const dryRun = !apply;
const daysArg = process.argv.find((a) => a.startsWith("--days="));
const startArg = process.argv.find((a) => a.startsWith("--start="));
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const days = daysArg ? Math.max(1, Math.min(365, Number(daysArg.split("=")[1]) || 365)) : 365;
const limit = limitArg ? Math.max(1, Math.min(1825, Number(limitArg.split("=")[1]) || 1825)) : days * 5;
const startDate = startArg ? new Date(`${startArg.split("=")[1]}T08:00:00-04:00`) : nextTorontoMorning();

const publishHoursToronto = [8, 11, 14, 17, 20];

function nextTorontoMorning(): Date {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const dd = String(tomorrow.getDate()).padStart(2, "0");
  return new Date(`${yyyy}-${mm}-${dd}T08:00:00-04:00`);
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

function addDays(date: Date, daysToAdd: number, hourToronto: number): Date {
  const d = new Date(date.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return new Date(`${yyyy}-${mm}-${dd}T${String(hourToronto).padStart(2, "0")}:00:00-04:00`);
}

const subjects = [
  ["Hyperkalemia", "why it causes peaked T waves", "ECG", "ECG", "ecg", "ECG interpretation", "/ecg-interpretation", "/advanced-ecg-nursing"],
  ["ABG interpretation", "a stepwise nursing method", "RN", "RN", "rn", "ABGs", "/app/lessons", "/app/questions"],
  ["REx-PN CAT exams", "how adaptive testing works", "RPN", "REx-PN", "rex-pn", "REx-PN", "/canada/rpn/rex-pn", "/app/practice-tests"],
  ["CNPLE LOFT simulation", "how NP clinical reasoning is tested", "NP", "CNPLE", "cnple", "CNPLE", "/canada/np/cnple/simulation", "/app/cases/cnple"],
  ["COPD CO2 retention", "why hypercapnia happens", "RN", "RN", "rn", "Respiratory", "/app/lessons", "/app/practice-tests"],
  ["SVT versus ventricular tachycardia", "how nurses tell them apart", "ECG", "ECG", "ecg", "ECG interpretation", "/ecg-interpretation", "/app/flashcards"],
  ["Burns and hyperkalemia", "electrolyte shifts explained", "RN", "RN", "rn", "Fluids and electrolytes", "/app/questions", "/app/lessons"],
  ["NCLEX prioritization", "what makes a patient unstable", "RN", "NCLEX-RN", "rn", "Prioritization", "/canada/rn/nclex-rn", "/app/practice-tests"],
  ["Neonatal sepsis", "early signs nurses miss", "NEW_GRAD", "New Grad", "new-grad", "Pediatrics", "/nursing/new-grad", "/app/lessons"],
  ["Pediatric vital signs", "normal ranges and red flags", "PRE_NURSING", "Pre-Nursing", "pre-nursing", "Pediatrics", "/pre-nursing", "/app/flashcards"],
  ["Atrial flutter versus atrial fibrillation", "ECG recognition", "ECG", "ECG", "ecg", "ECG interpretation", "/ecg-interpretation", "/advanced-ecg-nursing"],
  ["Sepsis hypotension", "why vasodilation drops blood pressure", "RN", "RN", "rn", "Critical care", "/app/lessons", "/app/questions"],
  ["DKA potassium shifts", "why potassium can be high before treatment", "RN", "RN", "rn", "Endocrine", "/app/questions", "/app/flashcards"],
  ["Isolation precautions", "NCLEX and REx-PN traps", "RPN", "REx-PN", "rex-pn", "Infection control", "/canada/rpn/rex-pn", "/app/questions"],
  ["Heart failure priorities", "what to assess first", "RN", "NCLEX-RN", "rn", "Cardiac", "/canada/rn/nclex-rn", "/app/practice-tests"],
  ["Torsades de pointes", "recognition and magnesium rationale", "ECG", "ECG", "ecg", "ECG interpretation", "/ecg-interpretation", "/advanced-ecg-nursing"],
  ["Elevated lactate", "what it means in sepsis and shock", "ALLIED", "Allied Health", "respiratory", "Critical care", "/allied-health/respiratory/blog", "/app/lessons"],
  ["Respiratory therapy ABGs", "ventilation versus oxygenation", "ALLIED", "Respiratory Therapy", "respiratory", "Respiratory therapy", "/allied-health/respiratory", "/app/questions"],
  ["Pharmacology safety", "high-alert medication exam traps", "RPN", "REx-PN", "rex-pn", "Pharmacology", "/canada/rpn/rex-pn", "/app/flashcards"],
  ["Delegation questions", "RN scope versus PN scope", "RN", "NCLEX-RN", "rn", "Delegation", "/canada/rn/nclex-rn", "/app/questions"],
  ["SOAP notes for CNPLE", "assessment and plan reasoning", "NP", "CNPLE", "cnple", "NP clinical reasoning", "/canada/np/cnple/simulation", "/app/cases/cnple"],
  ["Preeclampsia", "magnesium sulfate and seizure prevention", "RN", "NCLEX-RN", "rn", "Maternal newborn", "/app/lessons", "/app/questions"],
  ["Acid-base compensation", "partial versus full compensation", "RN", "RN", "rn", "ABGs", "/app/lessons", "/app/flashcards"],
  ["Pacemaker rhythms", "what nurses should identify", "ECG", "ECG", "ecg", "ECG interpretation", "/advanced-ecg-nursing", "/app/flashcards"],
  ["Ventilator alarms", "what to check first", "ALLIED", "Respiratory Therapy", "respiratory", "Respiratory therapy", "/allied-health/respiratory", "/app/questions"],
] as const;

const angles = [
  "explained for nursing students",
  "practice questions and rationales",
  "common exam traps",
  "clinical reasoning guide",
  "what to assess first",
  "priority interventions",
  "pathophysiology made simple",
  "case-based study guide",
  "flashcard review guide",
  "CAT exam strategy",
  "Canadian nursing exam focus",
  "new grad bedside guide",
  "mechanism and nursing implications",
  "red flags and safety priorities",
  "how to study it without memorizing",
];

function topicAt(i: number): TopicSeed {
  const s = subjects[i % subjects.length];
  const angle = angles[Math.floor(i / subjects.length) % angles.length];
  const subject = s[0];
  const tier = s[2] as TierKey;
  const titleAngle = `${s[1]} — ${angle}`;
  const exam = s[3];
  const careerSlug = s[4];
  const category = s[5];
  const linkA = s[6];
  const linkB = s[7];
  const isPractice = angle.includes("practice") || angle.includes("CAT");
  return {
    subject,
    angle: titleAngle,
    tier,
    exam,
    careerSlug: careerSlug === "ecg" ? "rn" : careerSlug,
    category,
    primaryKeyword: `${subject.toLowerCase()} ${angle.replace(/—/g, "").toLowerCase()}`,
    secondaryKeywords: [subject.toLowerCase(), category.toLowerCase(), `${exam.toLowerCase()} study guide`],
    ctaHref: tier === "NP" ? "/canada/np/cnple/simulation" : tier === "RPN" ? "/canada/rpn/rex-pn" : tier === "ALLIED" ? linkA : tier === "ECG" ? "/ecg-interpretation" : "/app/practice-tests",
    ctaText:
      tier === "NP"
        ? "Build CNPLE clinical reasoning with NurseNest simulations."
        : tier === "RPN"
          ? "Practice REx-PN-style questions and CAT readiness in NurseNest."
          : tier === "ECG"
            ? "Practice ECG interpretation with NurseNest rhythm lessons and flashcards."
            : "Turn this topic into practice questions, flashcards, and CAT review inside NurseNest.",
    links: Array.from(new Set([linkA, linkB, "/app/lessons", "/app/questions", "/app/flashcards", "/app/practice-tests"])),
    template: isPractice ? BlogPostTemplate.EXAM_GUIDE : BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
    intent: isPractice ? BlogPostIntent.PRACTICE_QUESTIONS : BlogPostIntent.CONCEPT_EXPLAINER,
    funnel: isPractice ? BlogFunnelStage.CONVERSION : BlogFunnelStage.CONSIDERATION,
  };
}

function titleFor(t: TopicSeed): string {
  return `${t.subject}: ${t.angle}`;
}

function bodyFor(t: TopicSeed): string {
  const title = titleFor(t);
  const linkList = t.links.map((href) => `<li><a href="${href}">${href}</a></li>`).join("\n");
  const practicePrompt = `A learner sees ${t.subject.toLowerCase()} in a question stem and has to decide what finding matters first. The safest answer usually comes from identifying instability, matching the mechanism to the symptoms, and choosing the intervention that prevents deterioration.`;

  return `
<h1>${title}</h1>
<p>${t.subject} is a high-yield topic because it connects mechanism, assessment, prioritization, and exam-style decision making. This guide is written for NurseNest learners who want more than a memorized fact. The goal is to help you understand what is happening, why it matters clinically, and how the same idea appears in practice questions, flashcards, CAT exams, ECG review, or CNPLE simulation.</p>

<h2>Why this topic matters</h2>
<p>Students often miss ${t.subject.toLowerCase()} questions because they jump to a memorized intervention before identifying the clinical pattern. On nursing exams, the best answer is rarely just the most familiar answer. It is the answer that matches the patient's current risk. That means you need to know the mechanism, the expected assessment findings, the red flags, and the intervention that protects airway, breathing, circulation, neurologic status, or perfusion.</p>
<p>For ${t.exam} learners, this topic also matters because it appears in different question formats. A straightforward knowledge question may ask for a definition. A prioritization question may ask who to see first. A clinical judgment item may give trend data and ask what action is safest. A simulation may require you to reassess after an intervention and recognize whether the patient is improving.</p>

<h2>The mechanism in plain language</h2>
<p>The mechanism behind ${t.subject.toLowerCase()} should be treated as the anchor for every answer choice. Start by asking what body system is being stressed. Then ask what compensation is occurring. Finally, ask when compensation fails. When compensation fails, the patient moves from expected findings to danger signs. That transition is where exam questions become prioritization questions.</p>
<p>A strong learner does not simply memorize that a finding is “bad.” A strong learner can explain why it is bad. If the problem affects oxygenation, ventilation, perfusion, cardiac conduction, neurologic status, fluid balance, or infection control, the nursing priority becomes clearer. That is the difference between guessing and clinical reasoning.</p>

<h2>Assessment findings to connect</h2>
<p>When reviewing ${t.subject.toLowerCase()}, connect each assessment finding to a cause. Vital signs, mental status, work of breathing, skin signs, urine output, pain pattern, rhythm changes, and laboratory trends should not be studied as isolated facts. They should be studied as clues that tell you whether the patient is stable, compensating, or deteriorating.</p>
<ul>
  <li><strong>Airway:</strong> Is there obstruction, aspiration risk, swelling, or declining consciousness?</li>
  <li><strong>Breathing:</strong> Is oxygenation or ventilation the main issue?</li>
  <li><strong>Circulation:</strong> Are perfusion, blood pressure, rhythm, or fluid status changing?</li>
  <li><strong>Neurologic status:</strong> Is confusion, lethargy, seizure risk, or acute change present?</li>
  <li><strong>Trends:</strong> Is the patient improving, unchanged, or getting worse?</li>
</ul>

<h2>Common exam traps</h2>
<p>The most common trap is choosing an answer that is true but not urgent. Another trap is choosing education when the patient needs assessment or intervention. A third trap is treating a chronic expected finding like an acute emergency, or missing that an acute change requires immediate action.</p>
<p>For ${t.subject.toLowerCase()}, slow down and separate stable findings from unstable findings. Stable does not always mean normal. Stable means the finding is expected, chronic, controlled, or not currently threatening the patient. Unstable means new, worsening, severe, unexpected, or connected to airway, breathing, circulation, neurologic decline, sepsis, shock, or lethal rhythm risk.</p>

<h2>How NurseNest learners should study it</h2>
<p>Use a three-pass method. First, learn the mechanism in a lesson. Second, convert the mechanism into flashcards so you can retrieve it quickly. Third, answer practice questions so you can apply it under pressure. This is the fastest way to move from passive reading to actual exam performance.</p>
<ol>
  <li><strong>Lesson pass:</strong> Learn the pathophysiology and expected findings.</li>
  <li><strong>Flashcard pass:</strong> Drill definitions, red flags, interventions, and comparison points.</li>
  <li><strong>Question pass:</strong> Practice prioritization, delegation, SATA, case-based, and CAT-style items.</li>
</ol>

<h2>Practice question</h2>
<p><strong>Question:</strong> ${practicePrompt}</p>
<p><strong>Best thinking process:</strong> Identify the immediate risk first. Then decide whether the safest action is assessment, intervention, notification, medication, isolation, oxygen/ventilation support, rhythm management, or reassessment.</p>
<p><strong>Rationale:</strong> Exam questions reward clinical judgment. The correct answer is the one that addresses the most immediate threat and matches the mechanism. If two options are both reasonable, choose the one that prevents harm first.</p>

<h2>Internal NurseNest study path</h2>
<p>Use these NurseNest study surfaces to turn this article into active recall and exam practice:</p>
<ul>
${linkList}
</ul>

<h2>FAQ</h2>
<h3>Is ${t.subject.toLowerCase()} important for ${t.exam}?</h3>
<p>Yes. It is important because it connects assessment, pathophysiology, prioritization, and safe intervention. Those are the exact thinking patterns tested across NurseNest learning tiers.</p>
<h3>Should I memorize this or understand it?</h3>
<p>You need both, but understanding comes first. Memorization helps with speed. Mechanism helps with unfamiliar questions.</p>
<h3>How do I practice this topic?</h3>
<p>Read the lesson, review flashcards, then answer mixed practice questions. Do not only practice the topic in isolation. Mix it with related cardiac, respiratory, endocrine, pediatric, pharmacology, or critical care topics so you learn to recognize it in realistic question stems.</p>

<h2>Next step</h2>
<p><a href="${t.ctaHref}">${t.ctaText}</a></p>
`.trim();
}

function faqFor(t: TopicSeed): Prisma.InputJsonValue {
  return [
    { question: `Is ${t.subject} high yield for ${t.exam}?`, answer: `Yes. ${t.subject} is high yield because it links mechanism, assessment, and safe nursing action.` },
    { question: `How should I study ${t.subject}?`, answer: "Use a lesson, flashcards, and mixed practice questions instead of memorizing isolated facts." },
    { question: "What is the most common mistake?", answer: "Choosing an answer that is true but not the safest or most urgent action for the current patient." },
  ] as Prisma.InputJsonValue;
}

function payloadFor(t: TopicSeed, index: number, publishAt: Date) {
  const title = titleFor(t);
  const slug = slugify(title);
  const seoDescription = `${t.subject} explained for nursing exams with mechanism, red flags, practice logic, and NurseNest study links.`.slice(0, 156);
  const links = t.links.map((href) => ({ href, reason: "Relevant NurseNest study surface" }));
  return {
    slug,
    title,
    excerpt: `${t.subject} explained with clinical reasoning, exam traps, practice-question logic, and NurseNest internal study links for ${t.exam} learners.`,
    body: bodyFor(t),
    tags: Array.from(new Set([t.tier, t.exam, t.category, t.subject, "clinical reasoning", "practice questions"])),
    category: t.category,
    exam: t.exam,
    careerSlug: t.careerSlug,
    locale: "en",
    seoTitle: title.slice(0, 220),
    seoDescription,
    targetKeyword: t.primaryKeyword,
    keywordCluster: "year-long-nursenest-seo-2026",
    keywordPlan: [t.primaryKeyword, ...t.secondaryKeywords],
    postTemplate: t.template,
    intent: t.intent,
    funnelStage: t.funnel,
    faqBlock: faqFor(t),
    internalLinkPlan: { links, ctaHref: t.ctaHref, ctaText: t.ctaText } as Prisma.InputJsonValue,
    schemaSummary: `FAQ and article schema candidate for ${t.primaryKeyword}.`,
    requiresReferences: false,
    apaReferences: [],
    sourcesJson: [] as Prisma.InputJsonValue,
    keyQuestions: [`How does ${t.subject} appear on ${t.exam}?`, `What red flags matter for ${t.subject}?`, `What should the nurse do first?`],
    legacySource: "year-long-seo-schedule-2026",
    imageStatus: BlogImageStatus.NONE,
    medicalRiskFlags: ["educational_clinical_content"],
    ctaType: "practice",
    ctaText: t.ctaText,
    ctaHref: t.ctaHref,
    postStatus: BlogPostStatus.SCHEDULED,
    workflowStatus: BlogWorkflowStatus.SCHEDULED,
    publishAt,
    scheduledAt: publishAt,
    adminPublishLog: [
      {
        at: new Date().toISOString(),
        kind: "year_long_seo_schedule_seed",
        outcome: "scheduled",
        ordinal: index + 1,
        publishAt: publishAt.toISOString(),
      },
    ] as Prisma.InputJsonValue,
  };
}

async function main(): Promise<void> {
  if (apply && !process.env.DATABASE_URL?.trim()) {
    console.error("[blog:year-seo] Refusing writes: DATABASE_URL is not set.");
    process.exit(1);
  }

  let planned = 0;
  let created = 0;
  let skippedExisting = 0;
  let dryRunOk = 0;
  const sample: Array<{ slug: string; title: string; publishAt: string }> = [];

  outer: for (let day = 0; day < days; day++) {
    for (let slot = 0; slot < 5; slot++) {
      if (planned >= limit) break outer;
      const idx = planned;
      const t = topicAt(idx);
      const publishAt = addDays(startDate, day, publishHoursToronto[slot] ?? 8);
      const payload = payloadFor(t, idx, publishAt);
      planned += 1;
      if (sample.length < 10) sample.push({ slug: payload.slug, title: payload.title, publishAt: publishAt.toISOString() });

      if (dryRun) {
        dryRunOk += 1;
        continue;
      }

      const existing = await prisma.blogPost.findUnique({ where: { slug: payload.slug }, select: { id: true } });
      if (existing) {
        skippedExisting += 1;
        continue;
      }

      await prisma.blogPost.create({ data: payload });
      created += 1;
    }
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        dryRun,
        startDate: startDate.toISOString(),
        days,
        planned,
        dryRunOk,
        created,
        skippedExisting,
        sample,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => undefined);
  });
