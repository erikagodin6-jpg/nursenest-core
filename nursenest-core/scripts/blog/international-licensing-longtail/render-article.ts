import type { InternationalLicensingTopicSpec } from "./types";

const INTERNAL_BLOG_SLUGS = [
  "sepsis-pathophysiology-early-nursing-recognition",
  "acute-kidney-injury-prerenal-intrinsic-postrenal",
  "metabolic-acidosis-vs-metabolic-alkalosis",
  "hyperkalemia-ecg-changes-nursing-students",
  "hypokalemia-pathophysiology-nursing-priorities",
  "copd-symptoms-treatment-nursing-care",
  "dka-vs-hhs-nursing-priorities",
] as const;

const BLOG_TITLE_BY_SLUG: Record<string, string> = {
  "sepsis-pathophysiology-early-nursing-recognition": "Sepsis pathophysiology and early nursing recognition",
  "acute-kidney-injury-prerenal-intrinsic-postrenal": "Acute kidney injury: prerenal, intrinsic, and postrenal",
  "metabolic-acidosis-vs-metabolic-alkalosis": "Metabolic acidosis vs metabolic alkalosis",
  "hyperkalemia-ecg-changes-nursing-students": "Hyperkalemia ECG changes for nursing students",
  "hypokalemia-pathophysiology-nursing-priorities": "Hypokalemia pathophysiology and nursing priorities",
  "copd-symptoms-treatment-nursing-care": "COPD symptoms, treatment themes, and nursing care",
  "dka-vs-hhs-nursing-priorities": "DKA vs HHS nursing priorities",
};

export function h(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function blogLinkLi(slug: string): string {
  const label = BLOG_TITLE_BY_SLUG[slug] ?? slug.replace(/-/g, " ");
  return `<li><a href="/blog/${slug}">${h(label)}</a></li>`;
}

function internalLinksSection(): string {
  const blog = INTERNAL_BLOG_SLUGS.map(blogLinkLi).join("\n");
  return `<h2>Suggested internal links</h2>
<p>Use NurseNest study surfaces alongside this overview: spaced repetition, targeted practice, and telemetry-style reasoning reinforce the habits regulators expect in safe, entry-level practice.</p>
<ul>
${blog}
<li><a href="/app/dashboard">NurseNest learner dashboard</a> — track progress, streaks, and your next best study block.</li>
<li><a href="/app/lessons?pathwayId=nclex-rn">RN lessons hub</a> — structured lessons aligned to NCLEX-style clinical judgment.</li>
<li><a href="/app/practice-tests?pathwayId=nclex-rn&amp;topic=cardiac">Practice tests</a> — topic-filtered question practice for exam stamina.</li>
<li><a href="/app/flashcards?pathwayId=nclex-rn&amp;topic=Fluid-Balance">Flashcards hub</a> — high-yield memorization for labs, meds, and systems.</li>
<li><a href="/app/cat">Computerized adaptive testing (CAT)</a> — build endurance for adaptive exam engines.</li>
<li><a href="/app/labs">Lab values and interpretation</a> — strengthen the numeric reasoning many international routes emphasize.</li>
<li><a href="/modules/ecg">ECG interpretation module</a> — rhythm and ischemia pattern drills common in acute care orientation.</li>
<li><a href="/app/account/report-card">Learner report card</a> — see strengths, gaps, and remediation suggestions over time.</li>
</ul>`;
}

function premiumCta(): string {
  return `<h2>Premium CTA</h2>
<p>NurseNest Premium bundles adaptive lessons, CAT-style practice, flashcards, labs reasoning, and ECG skills into one premium study loop designed for busy candidates. If you are balancing bridging coursework, language exams, and family responsibilities, use short daily blocks on the dashboard rather than marathon cramming—consistency beats intensity for licensing exams and for clinical judgment retention.</p>`;
}

function faqSection(faq: [string, string][]): string {
  const body = faq.map(([q, a]) => `<h3>${h(q)}</h3>\n<p>${h(a)}</p>`).join("\n\n");
  return `<h2>FAQ schema questions</h2>
${body}`;
}

function apaSection(refs: string[]): string {
  const ps = refs.map((r) => `<p>${h(r)}</p>`).join("\n");
  return `<h2>APA-7 references</h2>
${ps}
<p>When jurisdictions update eligibility, fees, or documentation, treat regulator portals as the authoritative update channel. This article is an educational orientation, not a substitute for individualized legal, immigration, or employment advice.</p>`;
}

export function renderInternationalLicensingArticle(spec: InternationalLicensingTopicSpec): string {
  const takeaways = spec.takeaways.map((t) => `<li>${h(t)}</li>`).join("\n");
  return `<h2>Introduction</h2>
<p>Internationally educated nurses (IENs) and international nursing students often face a layered journey: proving language proficiency, verifying education, passing a high-stakes licensing exam, and then meeting registration or credentialing requirements that differ by country, province, or board. This article focuses on <strong>${h(spec.exam)}</strong> within <strong>${h(spec.country)}</strong> as an educational overview for study planning and realistic timelines.</p>
<p>Regulations, fees, and required documents change. Before you spend money on translations or third-party services, confirm the current checklist on the official regulator site (${h(spec.regulatorLabel)}) and keep screenshots or PDF receipts organized in one folder so you are not repeating work under deadline pressure.</p>
<p>NurseNest content is built for premium clinical reasoning and exam stamina. It does not replace regulator instructions, employer onboarding, or individualized immigration guidance.</p>

<h2>Key takeaways</h2>
<ul>
${takeaways}
</ul>

<h2>Overview of the exam or credential</h2>
<p>${h(spec.overview)}</p>
<p>Across markets, the same theme repeats: regulators want evidence that you can practice safely at entry level, communicate in the local healthcare language, and understand scope boundaries. That is why many routes pair a knowledge test with communication assessment, orientation, or supervised practice milestones.</p>
<p>Use this overview to build a study map: identify the official handbook, locate sample content if published, list prerequisite courses or assessments, and schedule your first attempt with enough buffer for a thoughtful retake plan if needed.</p>

<h2>Eligibility requirements</h2>
<p>${h(spec.eligibility)}</p>
<p>Typical eligibility categories include verified nursing diploma or degree, transcripts, registration history, identification, criminal record checks, language tests, and sometimes refresher education or competency assessment after a gap from practice. Missing one document can pause an otherwise-ready application, so treat document completeness as part of your exam preparation project.</p>
<p>If you trained in a different language than the host country, budget time for both general language exams and healthcare communication practice. Reading research abstracts is not the same skill as rapid handoff, patient education, or conflict de-escalation at the bedside.</p>

<h2>Exam structure and format</h2>
<p>${h(spec.structure)}</p>
<p>Many high-stakes nursing exams blend multiple item types: standalone multiple choice, multiple response, ordered response, charts or exhibits, and case-based clusters. Adaptive engines may change difficulty based on performance, which can feel psychologically different from school tests even when the underlying content is similar.</p>
<p>Prepare for time pressure and interface literacy. Practice on a laptop with a mouse or trackpad if your exam delivery uses computer-based testing, and rehearse flagging, elimination, and return-to-item strategies so you are not learning the UI on exam day.</p>

<h2>Clinical judgment expectations</h2>
<p>${h(spec.clinicalJudgment)}</p>
<p>Clinical judgment is not memorizing every rare disease. It is recognizing the pattern that matters now: airway risk, bleeding, infection progression, perfusion failure, medication toxicity, or sudden neurologic change. Licensing items often reward the nurse who can prioritize assessment, escalate appropriately, and teach within scope.</p>
<p>For IENs, judgment questions may also implicitly test cultural humility, advocacy, and safe scope—especially when stem details include interpreter use, consent, refusals, or family dynamics. Read every option for what it assumes about autonomy, safety, and teamwork.</p>

<h2>Common mistakes candidates make</h2>
<p>${h(spec.mistakes)}</p>
<p>Other frequent errors include studying only content lists without timed practice, ignoring mental and physical recovery, and comparing your timeline to peers on social media. Licensing is individualized; boards care about your evidence packet and your results, not your cohort’s story.</p>
<p>Avoid rumor-based document advice. If a forum contradicts the regulator, trust the regulator and ask clarifying questions through official channels when available.</p>

<h2>Study strategies</h2>
<p>${h(spec.studyStrategies)}</p>
<p>Build a weekly plan that mixes systems review, weak-topic drills, and full-length practice. After each block, write a three-line debrief: what concept was tested, what trap you almost fell for, and what rule you will restate tomorrow. That debrief is how international candidates turn unfamiliar item styles into stable skill.</p>
<p>Pair pathophysiology with safety: for every condition, practice naming early cues, late cues, the most urgent intervention within nursing scope, and the teaching point a stable patient needs before discharge.</p>

<h2>Time management tips</h2>
<p>${h(spec.timeManagement)}</p>
<p>Time management also means protecting sleep and language exposure. Short morning sessions for vocabulary and longer weekend sessions for case clusters can match real life constraints while still advancing depth.</p>

<h2>Practice question strategy</h2>
<p>${h(spec.practiceStrategy)}</p>
<p>When reviewing explanations, do not stop at the correct answer. Ask why each distractor is tempting and what single clue in the stem should have steered you away. That second pass is what converts volume into precision.</p>

<h2>Country-specific nursing considerations</h2>
<p>${h(spec.countryNursing)}</p>
<p>Healthcare systems differ in team roles, common medications, documentation norms, and escalation pathways. Even when the physiology is universal, the “best next step” may emphasize interprofessional language or local policy themes. Use official orientation materials and reputable continuing education once you know your intended practice region.</p>

<h2>Registration and licensing considerations</h2>
<p>${h(spec.registration)}</p>
<p>Keep a living checklist: application submitted date, transcripts requested, translation vendor, verification service, exam authorization, provisional license conditions, and renewal cycle. Licensing delays are often administrative; calm, organized follow-up beats panic.</p>

${internalLinksSection()}

${premiumCta()}

${faqSection(spec.faq)}

${apaSection(spec.references)}
`;
}
