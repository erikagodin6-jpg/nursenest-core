/**
 * 50 English blog seed definitions for UK NMC CBT/OSCE and HCPC topics.
 * Used by `import-uk-licensure-blog-seeds.mts` (Prisma). Not bundled in the Next app.
 */

export type UkBlogSeedAngle =
  | "osce"
  | "cbt"
  | "nmc"
  | "ien"
  | "hcpc"
  | "compare"
  | "migration"
  | "clinical";

export type UkBlogSeedTopic = {
  slug: string;
  title: string;
  keyword: string;
  angle: UkBlogSeedAngle;
};

/** Exactly 50 topics: SEO coverage for UK nursing exam OSCE, CBT nursing UK, HCPC, IEN funnel, NCLEX comparison. */
export const UK_LICENSURE_BLOG_TOPICS: UkBlogSeedTopic[] = [
  { slug: "uk-nursing-exam-osce-overview", title: "UK nursing exam OSCE: what international recruits should expect", keyword: "UK nursing exam OSCE", angle: "osce" },
  { slug: "cbt-nursing-uk-scheduling-and-format", title: "CBT nursing UK: scheduling, format, and how to prepare", keyword: "CBT nursing UK", angle: "cbt" },
  { slug: "nmc-test-competence-part-1-cbt-blueprint", title: "NMC Test of Competence Part 1 (CBT): blueprint-style preparation", keyword: "NMC CBT", angle: "cbt" },
  { slug: "nmc-test-competence-part-2-osce-stations", title: "NMC Test of Competence Part 2: OSCE stations and professional judgement", keyword: "UK nursing exam OSCE", angle: "osce" },
  { slug: "hcpc-registration-no-single-exam", title: "HCPC registration: why there is no single allied health exam", keyword: "HCPC", angle: "hcpc" },
  { slug: "nclex-vs-nmc-cbt-what-transfers", title: "NCLEX vs NMC CBT: what study habits transfer (and what does not)", keyword: "NCLEX", angle: "compare" },
  { slug: "osce-communication-scenarios-nmc", title: "OSCE communication scenarios: scoring well on UK nursing exam OSCE", keyword: "UK nursing exam OSCE", angle: "osce" },
  { slug: "cbt-nursing-uk-pharmacology-revision", title: "CBT nursing UK: pharmacology revision that matches UK framing", keyword: "CBT nursing UK", angle: "cbt" },
  { slug: "ien-pathway-nmc-cbt-then-osce", title: "International nurse pathway: ordering CBT, OSCE, and evidence for the NMC", keyword: "NMC", angle: "ien" },
  { slug: "ielts-oet-for-nmc-thresholds", title: "IELTS and OET for NMC: planning language evidence alongside exams", keyword: "NMC", angle: "ien" },
  { slug: "after-cbt-pass-nmc-next-steps", title: "After you pass the NMC CBT: decision letters and OSCE planning", keyword: "NMC CBT", angle: "nmc" },
  { slug: "osce-retake-strategy-nmc-part-2", title: "NMC OSCE retake strategy: structured improvement after a miss", keyword: "UK nursing exam OSCE", angle: "osce" },
  { slug: "safeguarding-and-escalation-osce", title: "Safeguarding and escalation: common OSCE themes for UK registration", keyword: "UK nursing exam OSCE", angle: "clinical" },
  { slug: "medicines-administration-osce-checks", title: "Medicines administration checks under UK OSCE-style assessment", keyword: "UK nursing exam OSCE", angle: "clinical" },
  { slug: "nmc-code-care-planning-and-documentation", title: "NMC Code: care planning and documentation signals examiners expect", keyword: "NMC", angle: "nmc" },
  { slug: "mental-health-field-osce-focus", title: "Mental health nursing: OSCE-style focus areas for UK preparation", keyword: "UK nursing exam OSCE", angle: "osce" },
  { slug: "adult-nursing-field-osce-traps", title: "Adult nursing field: avoiding common OSCE traps", keyword: "UK nursing exam OSCE", angle: "osce" },
  { slug: "child-field-international-nurse-prep", title: "Child nursing field: preparation notes for international recruits", keyword: "NMC", angle: "ien" },
  { slug: "midwifery-nmc-route-overview", title: "Midwifery and the NMC: separate standards from general nursing", keyword: "NMC", angle: "nmc" },
  { slug: "hcpc-paramedic-registration-essentials", title: "HCPC paramedic: education, evidence, and standards route", keyword: "HCPC", angle: "hcpc" },
  { slug: "hcpc-physiotherapist-evidence", title: "HCPC physiotherapist: proficiency evidence without an NCLEX analogue", keyword: "HCPC", angle: "hcpc" },
  { slug: "hcpc-radiographer-registration", title: "HCPC radiographer: programme outcomes and registration steps", keyword: "HCPC", angle: "hcpc" },
  { slug: "hcpc-speech-language-therapy", title: "HCPC speech and language therapist: standards and supervised practice", keyword: "HCPC", angle: "hcpc" },
  { slug: "hcpc-occupational-therapy-uk", title: "HCPC occupational therapist: UK registration pathway overview", keyword: "HCPC", angle: "hcpc" },
  { slug: "hcpc-biomedical-scientist-portfolio", title: "HCPC biomedical scientist: evidence-heavy registration culture", keyword: "HCPC", angle: "hcpc" },
  { slug: "hcpc-operating-department-practitioner", title: "HCPC operating department practitioner: scope and protected title", keyword: "HCPC", angle: "hcpc" },
  { slug: "hcpc-orthoptist-and-practice-settings", title: "HCPC orthoptist: clinical settings and registration expectations", keyword: "HCPC", angle: "hcpc" },
  { slug: "hcpc-practitioner-psychologist-doctoral-route", title: "HCPC practitioner psychologist: training length and title protection", keyword: "HCPC", angle: "hcpc" },
  { slug: "hcpc-arts-therapist-standards", title: "HCPC arts therapist: standards of proficiency and supervised practice", keyword: "HCPC", angle: "hcpc" },
  { slug: "hcpc-prosthetist-orthotist-uk", title: "HCPC prosthetist and orthotist: specialist fabrication and patient safety", keyword: "HCPC", angle: "hcpc" },
  { slug: "nhs-employer-checks-dbs-and-registration", title: "NHS employer checks: DBS and your NMC pin timeline", keyword: "NMC", angle: "migration" },
  { slug: "skilled-worker-visa-and-nmc-order", title: "Skilled Worker visa and nursing: registration milestones vs job offers", keyword: "NMC", angle: "migration" },
  { slug: "agency-nursing-uk-pin-requirements", title: "Agency nursing in the UK: why your pin status matters before shifts", keyword: "NMC", angle: "migration" },
  { slug: "revalidation-vs-us-license-renewal-culture", title: "UK revalidation culture compared with US state licence renewal habits", keyword: "NMC", angle: "compare" },
  { slug: "osce-simulation-drills-that-work", title: "OSCE simulation drills: feedback loops that raise station scores", keyword: "UK nursing exam OSCE", angle: "osce" },
  { slug: "cbt-time-management-item-pacing", title: "CBT time management: pacing items on UK nursing computer tests", keyword: "CBT nursing UK", angle: "cbt" },
  { slug: "osce-day-anxiety-management", title: "OSCE day anxiety: practical grounding before UK nursing exam OSCE", keyword: "UK nursing exam OSCE", angle: "osce" },
  { slug: "evidence-based-stems-on-nmc-cbt", title: "Evidence-based practice cues: how CBT stems test application", keyword: "CBT nursing UK", angle: "cbt" },
  { slug: "infection-prevention-osce-cluster", title: "Infection prevention: OSCE-style clusters for UK nursing exams", keyword: "UK nursing exam OSCE", angle: "clinical" },
  { slug: "news-and-deterioration-osce-scenarios", title: "NEWS and deterioration: OSCE scenarios that reward escalation", keyword: "UK nursing exam OSCE", angle: "clinical" },
  { slug: "diabetes-care-uk-style-scenarios", title: "Diabetes care: UK-style scenario language for CBT and OSCE prep", keyword: "CBT nursing UK", angle: "clinical" },
  { slug: "cultural-competence-osce-tips", title: "Cultural competence in communication stations: OSCE tips", keyword: "UK nursing exam OSCE", angle: "osce" },
  { slug: "delegation-nclex-thinking-in-uk-context", title: "Delegation thinking: NCLEX habits mapped to NHS team language", keyword: "NCLEX", angle: "compare" },
  { slug: "critical-thinking-cbt-nmc-style", title: "Critical thinking for NMC CBT: stems that reward safe priorities", keyword: "CBT nursing UK", angle: "cbt" },
  { slug: "nurse-nest-question-bank-with-uk-prep", title: "Using NurseNest practice while you prepare for UK NMC tests", keyword: "CBT nursing UK", angle: "compare" },
  { slug: "twelve-week-osce-plan-after-cbt", title: "A 12-week OSCE preparation plan after CBT pass (international route)", keyword: "UK nursing exam OSCE", angle: "ien" },
  { slug: "hcpc-hearing-aid-dispenser-route", title: "HCPC hearing aid dispenser: specialist registration route", keyword: "HCPC", angle: "hcpc" },
  { slug: "hcpc-clinical-scientist-training", title: "HCPC clinical scientist: structured training and protected title", keyword: "HCPC", angle: "hcpc" },
  { slug: "portfolio-cpd-hcpc-registrants", title: "CPD portfolios for HCPC registrants: ongoing competence culture", keyword: "HCPC", angle: "hcpc" },
  { slug: "uk-licensure-guide-start-here", title: "Start here: UK licensure guide for nurses and allied health (hub)", keyword: "UK nursing exam OSCE", angle: "nmc" },
];

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function buildUkBlogBody(topic: UkBlogSeedTopic): string {
  const kw = esc(topic.keyword);
  const guide = `<a href="/exams/uk">UK licensure guide</a>`;
  const bank = `<a href="/question-bank">question bank</a>`;
  const lessons = `<a href="/lessons">clinical lessons</a>`;
  const intro = `<p>This article supports nurses and allied health professionals planning UK registration. It is educational and does not replace NMC or HCPC rules. Always confirm eligibility with your regulator.</p>`;

  const angleBlocks: Record<UkBlogSeedAngle, string> = {
    osce: `<h2>OSCE-style preparation</h2><p>Station-based assessments reward clear communication, safety, and the NMC Code in action. Rehearse with timed scenarios, seek feedback on non-technical skills, and rehearse concise handovers. Keyword focus: ${kw}.</p><h2>Signals examiners notice</h2><ul><li>Person-centred language and consent checks.</li><li>Early recognition of risk and appropriate escalation.</li><li>Accurate medicines checks when the station requires them.</li></ul>`,
    cbt: `<h2>CBT-style preparation</h2><p>Computer-based tests reward application, not memorisation alone. Build mixed-topic sessions, review rationales, and track weak domains. Keyword focus: ${kw}.</p><h2>Study rhythm</h2><ul><li>Short daily blocks with spaced repetition.</li><li>Timed sets to match exam pacing.</li><li>Error log with rule-based review.</li></ul>`,
    nmc: `<h2>NMC registration context</h2><p>The Nursing and Midwifery Council sets standards for nursing and midwifery. Your decision letter and candidate instructions define which parts of the Test of Competence apply. Keyword focus: ${kw}.</p><h2>Professional anchors</h2><ul><li>The Code and scope of practice.</li><li>Documentation and duty of candour themes.</li><li>Partnership with patients and multidisciplinary teams.</li></ul>`,
    ien: `<h2>International nurse pathway</h2><p>International routes combine credential checks, English evidence, and Test of Competence components. Build a calendar that sequences language tests, CBT, and OSCE where required. Keyword focus: ${kw}.</p><h2>Migration discipline</h2><ul><li>Keep primary sources for eligibility.</li><li>Book exams only when permitted.</li><li>Separate immigration advice from clinical prep.</li></ul>`,
    hcpc: `<h2>HCPC registration culture</h2><p>HCPC protects titles for listed professions. Registration is evidence-led and profession-specific rather than one universal clinical MCQ. Keyword focus: ${kw}.</p><h2>What to prepare</h2><ul><li>Standards of proficiency for your profession.</li><li>Health, character, and indemnity expectations where applicable.</li><li>Continuing professional development habits for renewal.</li></ul>`,
    compare: `<h2>NCLEX thinking vs UK regulators</h2><p>NCLEX-style practice strengthens clinical judgement. UK NMC tests use different formats and governance. Treat transferable skills as cognitive fitness, then specialise using NMC candidate briefings. Keyword focus: ${kw}.</p><h2>Practical takeaway</h2><ul><li>Keep prioritisation drills from NCLEX-style banks.</li><li>Add UK scope vocabulary for OSCE communication.</li><li>Avoid assuming identical scoring rules.</li></ul>`,
    migration: `<h2>Employer and workforce context</h2><p>Registration, sponsorship, and employer checks layer on top of exams. Plan documents early and keep copies aligned with regulator timelines. Keyword focus: ${kw}.</p><h2>Checklist</h2><ul><li>Pin status and role requirements for your job plan.</li><li>Occupational health and immunisation where requested.</li><li>DBS and identity checks per employer policy.</li></ul>`,
    clinical: `<h2>Clinical themes</h2><p>UK assessments often embed safety-critical themes: infection prevention, deterioration, medicines safety, and mental capacity aware communication. Drill scenarios until your first actions are automatic. Keyword focus: ${kw}.</p><h2>Practice pattern</h2><ul><li>One weak system per day with rationale review.</li><li>Pair content with ${lessons} then ${bank} sets.</li></ul>`,
  };

  const outro = `<h2>Use NurseNest alongside regulator guidance</h2><p>Read ${guide}, then practise clinical reasoning in our ${bank} and ${lessons}.</p>`;
  return `${intro}${angleBlocks[topic.angle]}${outro}`;
}

export function excerptFromBody(html: string): string {
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.slice(0, 280) + (plain.length > 280 ? "…" : "");
}
