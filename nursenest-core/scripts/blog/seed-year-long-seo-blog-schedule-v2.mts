#!/usr/bin/env npx tsx
/**
 * V2 year-long NurseNest SEO scheduler.
 *
 * Creates up to 1,825 distinct scheduled BlogPost rows: 5 posts/day × 365 days.
 * This version prevents slug reuse by combining:
 * - core clinical/exam topic
 * - search-intent angle
 * - tier/audience modifier
 *
 * Usage from nursenest-core/:
 *   npx tsx scripts/blog/seed-year-long-seo-blog-schedule-v2.mts --dry-run
 *   npx tsx scripts/blog/seed-year-long-seo-blog-schedule-v2.mts --apply --days=30
 *   npx tsx scripts/blog/seed-year-long-seo-blog-schedule-v2.mts --apply --days=365
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

type Topic = {
  subject: string;
  mechanism: string;
  tier: string;
  exam: string;
  careerSlug: string | null;
  category: string;
  ctaHref: string;
  primaryLink: string;
  secondaryLink: string;
};

const rawArgs = process.argv.slice(2);
const apply = rawArgs.includes("--apply");
const dryRun = !apply;
const arg = (name: string) => rawArgs.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const days = Math.max(1, Math.min(365, Number(arg("days") ?? 365) || 365));
const limit = Math.max(1, Math.min(1825, Number(arg("limit") ?? days * 5) || days * 5));
const startDate = arg("start") ? new Date(`${arg("start")}T08:00:00-04:00`) : nextTorontoMorning();
const publishHoursToronto = [8, 11, 14, 17, 20];

function nextTorontoMorning(): Date {
  const now = new Date();
  const d = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return new Date(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T08:00:00-04:00`);
}

function publishDate(day: number, slot: number): Date {
  const d = new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000);
  return new Date(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(publishHoursToronto[slot] ?? 8).padStart(2, "0")}:00:00-04:00`);
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 190);
}

const topics: Topic[] = [
  { subject: "Hyperkalemia", mechanism: "why potassium changes cardiac conduction", tier: "ECG", exam: "ECG", careerSlug: "rn", category: "ECG interpretation", ctaHref: "/ecg-interpretation", primaryLink: "/ecg-interpretation", secondaryLink: "/advanced-ecg-nursing" },
  { subject: "ABG interpretation", mechanism: "how pH, CO2, and bicarbonate fit together", tier: "RN", exam: "NCLEX-RN", careerSlug: "rn", category: "ABGs", ctaHref: "/app/questions", primaryLink: "/app/lessons", secondaryLink: "/app/questions" },
  { subject: "REx-PN CAT exams", mechanism: "how adaptive testing changes question difficulty", tier: "RPN", exam: "REx-PN", careerSlug: "rex-pn", category: "REx-PN", ctaHref: "/canada/rpn/rex-pn", primaryLink: "/canada/rpn/rex-pn", secondaryLink: "/app/practice-tests" },
  { subject: "CNPLE LOFT simulation", mechanism: "how NP decisions are tested across a patient scenario", tier: "NP", exam: "CNPLE", careerSlug: "cnple", category: "CNPLE", ctaHref: "/canada/np/cnple/simulation", primaryLink: "/canada/np/cnple/simulation", secondaryLink: "/app/cases/cnple" },
  { subject: "COPD CO2 retention", mechanism: "why ventilation failure causes hypercapnia", tier: "RN", exam: "NCLEX-RN", careerSlug: "rn", category: "Respiratory", ctaHref: "/app/practice-tests", primaryLink: "/app/lessons", secondaryLink: "/app/practice-tests" },
  { subject: "SVT versus ventricular tachycardia", mechanism: "how rhythm origin changes nursing priority", tier: "ECG", exam: "ECG", careerSlug: "rn", category: "ECG interpretation", ctaHref: "/ecg-interpretation", primaryLink: "/ecg-interpretation", secondaryLink: "/app/flashcards" },
  { subject: "Burns and hyperkalemia", mechanism: "why tissue injury shifts potassium", tier: "RN", exam: "NCLEX-RN", careerSlug: "rn", category: "Fluids and electrolytes", ctaHref: "/app/questions", primaryLink: "/app/questions", secondaryLink: "/app/lessons" },
  { subject: "NCLEX prioritization", mechanism: "how to identify instability before choosing an answer", tier: "RN", exam: "NCLEX-RN", careerSlug: "rn", category: "Prioritization", ctaHref: "/canada/rn/nclex-rn", primaryLink: "/canada/rn/nclex-rn", secondaryLink: "/app/practice-tests" },
  { subject: "Neonatal sepsis", mechanism: "why newborn infection signs are subtle", tier: "NEW_GRAD", exam: "New Grad", careerSlug: "new-grad", category: "Pediatrics", ctaHref: "/nursing/new-grad", primaryLink: "/nursing/new-grad", secondaryLink: "/app/lessons" },
  { subject: "Pediatric vital signs", mechanism: "how age changes normal ranges and red flags", tier: "PRE_NURSING", exam: "Pre-Nursing", careerSlug: "pre-nursing", category: "Pediatrics", ctaHref: "/pre-nursing", primaryLink: "/pre-nursing", secondaryLink: "/app/flashcards" },
  { subject: "Atrial flutter versus atrial fibrillation", mechanism: "how atrial activity changes the ECG strip", tier: "ECG", exam: "ECG", careerSlug: "rn", category: "ECG interpretation", ctaHref: "/advanced-ecg-nursing", primaryLink: "/ecg-interpretation", secondaryLink: "/advanced-ecg-nursing" },
  { subject: "Sepsis hypotension", mechanism: "why vasodilation and capillary leak reduce perfusion", tier: "RN", exam: "NCLEX-RN", careerSlug: "rn", category: "Critical care", ctaHref: "/app/questions", primaryLink: "/app/lessons", secondaryLink: "/app/questions" },
  { subject: "DKA potassium shifts", mechanism: "why serum potassium can mislead learners", tier: "RN", exam: "NCLEX-RN", careerSlug: "rn", category: "Endocrine", ctaHref: "/app/questions", primaryLink: "/app/questions", secondaryLink: "/app/flashcards" },
  { subject: "Isolation precautions", mechanism: "how transmission route determines PPE", tier: "RPN", exam: "REx-PN", careerSlug: "rex-pn", category: "Infection control", ctaHref: "/canada/rpn/rex-pn", primaryLink: "/canada/rpn/rex-pn", secondaryLink: "/app/questions" },
  { subject: "Heart failure priorities", mechanism: "why preload, afterload, and perfusion drive assessment", tier: "RN", exam: "NCLEX-RN", careerSlug: "rn", category: "Cardiac", ctaHref: "/canada/rn/nclex-rn", primaryLink: "/canada/rn/nclex-rn", secondaryLink: "/app/practice-tests" },
  { subject: "Torsades de pointes", mechanism: "why prolonged QT creates polymorphic VT", tier: "ECG", exam: "ECG", careerSlug: "rn", category: "ECG interpretation", ctaHref: "/advanced-ecg-nursing", primaryLink: "/ecg-interpretation", secondaryLink: "/advanced-ecg-nursing" },
  { subject: "Elevated lactate", mechanism: "how oxygen debt appears in labs", tier: "ALLIED", exam: "Allied Health", careerSlug: "respiratory", category: "Critical care", ctaHref: "/allied-health/respiratory", primaryLink: "/allied-health/respiratory", secondaryLink: "/app/lessons" },
  { subject: "Respiratory therapy ABGs", mechanism: "how ventilation and oxygenation differ", tier: "ALLIED", exam: "Respiratory Therapy", careerSlug: "respiratory", category: "Respiratory therapy", ctaHref: "/allied-health/respiratory", primaryLink: "/allied-health/respiratory", secondaryLink: "/app/questions" },
  { subject: "Pharmacology safety", mechanism: "why high-alert medications create exam traps", tier: "RPN", exam: "REx-PN", careerSlug: "rex-pn", category: "Pharmacology", ctaHref: "/canada/rpn/rex-pn", primaryLink: "/canada/rpn/rex-pn", secondaryLink: "/app/flashcards" },
  { subject: "Delegation questions", mechanism: "how scope and stability determine assignments", tier: "RN", exam: "NCLEX-RN", careerSlug: "rn", category: "Delegation", ctaHref: "/canada/rn/nclex-rn", primaryLink: "/canada/rn/nclex-rn", secondaryLink: "/app/questions" },
  { subject: "SOAP notes for CNPLE", mechanism: "how assessment and plan logic are scored", tier: "NP", exam: "CNPLE", careerSlug: "cnple", category: "NP clinical reasoning", ctaHref: "/canada/np/cnple/simulation", primaryLink: "/canada/np/cnple/simulation", secondaryLink: "/app/cases/cnple" },
  { subject: "Preeclampsia", mechanism: "why endothelial dysfunction drives seizure risk", tier: "RN", exam: "NCLEX-RN", careerSlug: "rn", category: "Maternal newborn", ctaHref: "/app/questions", primaryLink: "/app/lessons", secondaryLink: "/app/questions" },
  { subject: "Acid-base compensation", mechanism: "how lungs and kidneys respond over time", tier: "RN", exam: "NCLEX-RN", careerSlug: "rn", category: "ABGs", ctaHref: "/app/flashcards", primaryLink: "/app/lessons", secondaryLink: "/app/flashcards" },
  { subject: "Pacemaker rhythms", mechanism: "how pacing spikes and capture change interpretation", tier: "ECG", exam: "ECG", careerSlug: "rn", category: "ECG interpretation", ctaHref: "/advanced-ecg-nursing", primaryLink: "/advanced-ecg-nursing", secondaryLink: "/app/flashcards" },
  { subject: "Ventilator alarms", mechanism: "how pressure, volume, and disconnection clues guide response", tier: "ALLIED", exam: "Respiratory Therapy", careerSlug: "respiratory", category: "Respiratory therapy", ctaHref: "/allied-health/respiratory", primaryLink: "/allied-health/respiratory", secondaryLink: "/app/questions" },
];

const searchAngles = [
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

const audienceModifiers = [
  "for first-time test writers",
  "for anxious nursing students",
  "for last-week review",
  "for visual learners",
  "for clinical judgment questions",
  "for prioritization practice",
  "for safety-focused questions",
  "for SATA-style thinking",
  "for case study questions",
  "for Canadian learners",
  "for bedside-to-exam transfer",
  "for rapid review",
  "for remediation after missed questions",
  "for learners who overthink answers",
  "for learners building confidence",
  "for medication-safety questions",
  "for critical-care review",
  "for pediatrics review",
  "for cardiac review",
  "for respiratory review",
  "for electrolyte review",
  "for simulation practice",
  "for flashcard drilling",
  "for question-bank review",
  "for CAT readiness",
];

function topicAt(i: number): Topic & { searchAngle: string; audience: string } {
  const topic = topics[i % topics.length]!;
  const searchAngle = searchAngles[Math.floor(i / topics.length) % searchAngles.length]!;
  const audience = audienceModifiers[Math.floor(i / (topics.length * searchAngles.length)) % audienceModifiers.length]!;
  return { ...topic, searchAngle, audience };
}

function titleFor(t: ReturnType<typeof topicAt>): string {
  return `${t.subject}: ${t.mechanism} — ${t.searchAngle} ${t.audience}`;
}

function bodyFor(t: ReturnType<typeof topicAt>): string {
  const links = Array.from(new Set([t.primaryLink, t.secondaryLink, "/app/lessons", "/app/questions", "/app/flashcards", "/app/practice-tests"]));
  const linkHtml = links.map((href) => `<li><a href="${href}">${href}</a></li>`).join("\n");
  return `
<h1>${titleFor(t)}</h1>
<p>${t.subject} is a high-yield NurseNest topic because it connects mechanism, assessment, prioritization, and exam-style decision making. This guide focuses on ${t.mechanism} and turns that idea into a practical study path for ${t.exam} learners.</p>
<h2>Why this topic matters</h2>
<p>Many learners miss ${t.subject.toLowerCase()} questions because they memorize isolated facts instead of recognizing the clinical pattern. On nursing and allied health exams, the safest answer usually comes from identifying the patient’s current risk, not from choosing the answer that sounds most familiar.</p>
<p>For ${t.exam}, this topic can appear as a knowledge question, a prioritization item, a case study, a simulation decision, a rhythm recognition item, or a question-bank rationale. The shared skill is clinical judgment: connect the data to the mechanism, then choose the action that prevents harm.</p>
<h2>The mechanism</h2>
<p>The core mechanism is ${t.mechanism}. Study this first. Then connect it to assessment findings, red flags, interventions, and reassessment. When the mechanism is clear, distractors become easier to eliminate because you can tell which options do not match the patient’s actual problem.</p>
<h2>Assessment clues</h2>
<ul>
<li><strong>Airway:</strong> look for obstruction, aspiration risk, swelling, or declining consciousness.</li>
<li><strong>Breathing:</strong> decide whether the problem is oxygenation, ventilation, work of breathing, or fatigue.</li>
<li><strong>Circulation:</strong> connect blood pressure, pulse quality, rhythm, perfusion, urine output, and skin signs.</li>
<li><strong>Neurologic status:</strong> treat acute confusion, seizure risk, and reduced responsiveness as safety signals.</li>
<li><strong>Trends:</strong> worsening values matter more than a single memorized number.</li>
</ul>
<h2>Common exam traps</h2>
<p>The most common trap is choosing an answer that is true but not urgent. Another trap is choosing patient education when the stem is asking for immediate assessment or intervention. A third trap is missing the difference between chronic expected findings and acute deterioration.</p>
<h2>How to answer questions on this topic</h2>
<ol>
<li>Identify whether the patient is stable or unstable.</li>
<li>Name the mechanism in plain language.</li>
<li>Match the mechanism to the assessment finding.</li>
<li>Choose the action that addresses the highest safety risk first.</li>
<li>Reassess the patient and watch for improvement or deterioration.</li>
</ol>
<h2>Practice question</h2>
<p><strong>Question:</strong> A learner sees ${t.subject.toLowerCase()} in a stem and must choose the safest first action. Which answer pattern is most reliable?</p>
<p><strong>Answer:</strong> The safest answer is the one that matches the mechanism, addresses immediate instability, and prevents deterioration before moving to teaching or routine follow-up.</p>
<p><strong>Rationale:</strong> Exams reward safe clinical reasoning. If two answers seem correct, prioritize airway, breathing, circulation, neurologic change, sepsis/shock risk, lethal rhythm risk, or acute deterioration.</p>
<h2>Study it inside NurseNest</h2>
<p>Use this article as the explanation, then move into active practice:</p>
<ul>${linkHtml}</ul>
<h2>FAQ</h2>
<h3>Is ${t.subject.toLowerCase()} important for ${t.exam}?</h3>
<p>Yes. It is high-yield because it links pathophysiology, assessment, prioritization, and safe intervention.</p>
<h3>Should I memorize or understand this?</h3>
<p>Understand first, then memorize the key cues. Mechanism helps you handle unfamiliar question stems.</p>
<h3>How should I practice?</h3>
<p>Use a lesson for understanding, flashcards for recall, and mixed practice questions for application.</p>
<h2>Next step</h2>
<p><a href="${t.ctaHref}">Practice this topic inside NurseNest.</a></p>
`.trim();
}

function payloadFor(index: number, publishAt: Date) {
  const t = topicAt(index);
  const title = titleFor(t);
  const primaryKeyword = `${t.subject.toLowerCase()} ${t.searchAngle} ${t.audience}`;
  const practiceIntent = t.searchAngle.includes("practice") || t.searchAngle.includes("CAT") || t.audience.includes("question");
  return {
    slug: slugify(title),
    title,
    excerpt: `${t.subject} explained for ${t.exam} learners with mechanism, exam traps, clinical judgment, practice logic, and NurseNest study links.`,
    body: bodyFor(t),
    tags: Array.from(new Set([t.tier, t.exam, t.category, t.subject, "clinical reasoning", "practice questions"])),
    category: t.category,
    exam: t.exam,
    careerSlug: t.careerSlug,
    locale: "en",
    seoTitle: title.slice(0, 220),
    seoDescription: `${t.subject} study guide for ${t.exam}: mechanism, red flags, exam traps, practice logic, and NurseNest links.`.slice(0, 156),
    targetKeyword: primaryKeyword,
    keywordCluster: "year-long-nursenest-seo-2026-v2",
    keywordPlan: [primaryKeyword, t.subject.toLowerCase(), t.category.toLowerCase(), `${t.exam.toLowerCase()} practice questions`],
    postTemplate: practiceIntent ? BlogPostTemplate.EXAM_GUIDE : BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
    intent: practiceIntent ? BlogPostIntent.PRACTICE_QUESTIONS : BlogPostIntent.CONCEPT_EXPLAINER,
    funnelStage: practiceIntent ? BlogFunnelStage.CONVERSION : BlogFunnelStage.CONSIDERATION,
    faqBlock: [
      { question: `Is ${t.subject} important for ${t.exam}?`, answer: "Yes. It connects mechanism, assessment, and safe action." },
      { question: `How should I study ${t.subject}?`, answer: "Use lessons, flashcards, and mixed practice questions." },
      { question: "What is the common mistake?", answer: "Choosing a true answer that is not the safest first action." },
    ] as Prisma.InputJsonValue,
    internalLinkPlan: {
      links: Array.from(new Set([t.primaryLink, t.secondaryLink, "/app/lessons", "/app/questions", "/app/flashcards", "/app/practice-tests"])).map((href) => ({ href, reason: "Relevant NurseNest study surface" })),
      ctaHref: t.ctaHref,
    } as Prisma.InputJsonValue,
    schemaSummary: `FAQ and article schema candidate for ${primaryKeyword}.`,
    requiresReferences: false,
    apaReferences: [],
    sourcesJson: [] as Prisma.InputJsonValue,
    keyQuestions: [`How does ${t.subject} appear on ${t.exam}?`, "What is the safest first action?", "What red flags change priority?"],
    legacySource: "year-long-seo-schedule-2026-v2",
    imageStatus: BlogImageStatus.NONE,
    medicalRiskFlags: ["educational_clinical_content"],
    ctaType: "practice",
    ctaText: "Practice this topic inside NurseNest.",
    ctaHref: t.ctaHref,
    postStatus: BlogPostStatus.SCHEDULED,
    workflowStatus: BlogWorkflowStatus.SCHEDULED,
    publishAt,
    scheduledAt: publishAt,
    adminPublishLog: [{ at: new Date().toISOString(), kind: "year_long_seo_schedule_seed_v2", outcome: "scheduled", ordinal: index + 1, publishAt: publishAt.toISOString() }] as Prisma.InputJsonValue,
  };
}

async function main(): Promise<void> {
  if (apply && !process.env.DATABASE_URL?.trim()) {
    console.error("[blog:year-seo-v2] Refusing writes: DATABASE_URL is not set.");
    process.exit(1);
  }
  const seen = new Set<string>();
  let planned = 0;
  let created = 0;
  let skippedExisting = 0;
  const sample: Array<{ slug: string; title: string; publishAt: string }> = [];

  for (let day = 0; day < days; day++) {
    for (let slot = 0; slot < 5; slot++) {
      if (planned >= limit) break;
      const publishAt = publishDate(day, slot);
      const payload = payloadFor(planned, publishAt);
      if (seen.has(payload.slug)) throw new Error(`duplicate generated slug: ${payload.slug}`);
      seen.add(payload.slug);
      if (sample.length < 10) sample.push({ slug: payload.slug, title: payload.title, publishAt: publishAt.toISOString() });
      planned += 1;
      if (dryRun) continue;
      const existing = await prisma.blogPost.findUnique({ where: { slug: payload.slug }, select: { id: true } });
      if (existing) {
        skippedExisting += 1;
        continue;
      }
      await prisma.blogPost.create({ data: payload });
      created += 1;
    }
  }

  console.log(JSON.stringify({ ok: true, dryRun, startDate: startDate.toISOString(), days, planned, uniqueSlugs: seen.size, created, skippedExisting, sample }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => undefined);
  });
