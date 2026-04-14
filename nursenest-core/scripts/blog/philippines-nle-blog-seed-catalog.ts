/**
 * 200 English blog seed definitions for Philippine NLE context, NCLEX bridge, and migration.
 * Each body is expanded to at least 1200 words for SEO depth. Used by
 * `import-philippines-nle-blog-seeds.mts` (Prisma). Not bundled in the Next app.
 */

export type PhilippinesBlogAngle =
  | "structure"
  | "volume"
  | "nclex"
  | "us-migration"
  | "ca-migration"
  | "clinical"
  | "language"
  | "study-plan";

export type PhilippinesBlogSeedTopic = {
  slug: string;
  title: string;
  keyword: string;
  angle: PhilippinesBlogAngle;
  /** Clinical or professional theme rotated for variety */
  domain: string;
  index: number;
};

const DOMAINS: string[] = [
  "Medical-surgical nursing",
  "Community health nursing",
  "Maternal and newborn nursing",
  "Child health nursing",
  "Mental health and psychiatric nursing",
  "Gerontology and chronic illness",
  "Infection prevention and isolation",
  "Pharmacology and safe medication practice",
  "Fluid, electrolyte, and acid-base balance",
  "Cardiovascular nursing",
  "Respiratory nursing",
  "Neurological nursing",
  "Gastrointestinal and nutrition nursing",
  "Renal and genitourinary nursing",
  "Endocrine and metabolic nursing",
  "Musculoskeletal and mobility nursing",
  "Hematologic and immunologic nursing",
  "Perioperative and procedural nursing",
  "Pain assessment and multimodal management",
  "Ethics, consent, and advocacy",
  "Leadership, delegation, and supervision",
  "Quality improvement and patient safety",
  "Nursing research and evidence appraisal",
  "Disaster and emergency nursing",
  "Occupational health and worker safety",
  "Palliative and end-of-life care",
  "School and adolescent health",
  "Public health surveillance and reporting",
  "Family-centered communication",
  "Cultural humility in Filipino nursing practice",
];

const KEYWORDS = [
  "Philippines nursing board exam",
  "NLE nursing",
  "NLE Philippines",
  "PRC nursing licensure exam",
  "Nurse Licensure Examination Philippines",
];

const ANGLES: PhilippinesBlogAngle[] = [
  "structure",
  "volume",
  "nclex",
  "us-migration",
  "ca-migration",
  "clinical",
  "language",
  "study-plan",
];

function titleFor(i: number, keyword: string, domain: string, angle: PhilippinesBlogAngle): string {
  const capKw = keyword.charAt(0).toUpperCase() + keyword.slice(1);
  const angleHint: Record<PhilippinesBlogAngle, string> = {
    structure: "blueprint-style preparation",
    volume: "cohort pressure and pacing",
    nclex: "bridge toward NCLEX-RN",
    "us-migration": "United States registration planning",
    "ca-migration": "Canada registration planning",
    clinical: "clinical reasoning drills",
    language: "English and Tagalog study workflows",
    "study-plan": "twelve-week study architecture",
  };
  return `${capKw} (${i}): ${domain} — ${angleHint[angle]}`;
}

function buildTopics(): PhilippinesBlogSeedTopic[] {
  const out: PhilippinesBlogSeedTopic[] = [];
  for (let i = 1; i <= 200; i += 1) {
    const domain = DOMAINS[(i - 1) % DOMAINS.length];
    const keyword = KEYWORDS[(i - 1) % KEYWORDS.length];
    const angle = ANGLES[(i - 1) % ANGLES.length];
    out.push({
      slug: `philippines-nle-nursing-${String(i).padStart(3, "0")}`,
      title: titleFor(i, keyword, domain, angle),
      keyword,
      angle,
      domain,
      index: i,
    });
  }
  return out;
}

/** Exactly 200 topics for philippines-nle tag SEO coverage */
export const PHILIPPINES_NLE_BLOG_TOPICS: PhilippinesBlogSeedTopic[] = buildTopics();

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Plain-text word count from HTML */
export function wordCountFromHtml(html: string): number {
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!plain) return 0;
  return plain.split(/\s+/).length;
}

const MIN_WORDS = 1200;

const PH_HUB = `<a href="/exams/philippines">Philippines nursing exam hub</a>`;
const BANK = `<a href="/question-bank">question bank</a>`;
const US_LESS = `<a href="/us/rn/nclex-rn/lessons">NCLEX-RN lessons (US)</a>`;
const US_Q = `<a href="/us/rn/nclex-rn/questions">NCLEX-RN practice questions (US)</a>`;
const CA_LESS = `<a href="/canada/rn/nclex-rn/lessons">NCLEX-RN lessons (Canada)</a>`;
const CA_Q = `<a href="/canada/rn/nclex-rn/questions">NCLEX-RN practice questions (Canada)</a>`;
const LESS = `<a href="/lessons">clinical lessons library</a>`;

/** Long paragraphs used to pad weak drafts while staying on-topic */
const EXPANSION_PARAGRAPHS: string[] = [
  "Philippine nursing education stresses holistic patient care, family involvement, and community orientation. When you translate that mindset into NCLEX-style items, prioritise the option that protects life, maintains airway and circulation when threatened, and escalates within scope when the scenario implies instability. Repetition builds speed: your first pass should identify safety signals, your second pass should eliminate distractors that sound reasonable but violate scope or timing.",
  "High-stakes cohort dynamics can push candidates toward cramming. Spaced repetition beats massed practice for long-term retention. After each study block, write a three-bullet error log: what concept slipped, what rule you will restate in your own words, and one question you will redo tomorrow cold. That loop turns volume into mastery rather than anxiety.",
  "Medication safety crosses every domain. For Philippine licensure and later NCLEX preparation, rehearse the rights of medication administration, allergy verification, laboratory cues for toxicity, and patient teaching for adherence. When an item offers multiple correct-sounding interventions, ask which action must happen first to reduce imminent harm.",
  "Community health scenarios often embed surveillance, outbreak response, and teaching for families with limited resources. Frame answers that respect autonomy, build sustainable behaviour change, and coordinate with local systems. NCLEX rewards public-health thinking when the stem clearly places you outside acute walls.",
  "Maternal-newborn items frequently test fetal well-being, stages of labour, postpartum hemorrhage recognition, and newborn transition. Memorise thresholds but also rehearse the story arc: assessment findings first, then interventions that match severity. Escalation language should match the regulator you are preparing for once you leave the NLE phase.",
  "Mental health stems reward therapeutic communication: reflection, clarifying, validating emotion without false promises, and maintaining boundaries. Avoid collusion with delusional content; avoid premature advice. Safety always includes suicide and harm risk when the vignette hints at hopelessness, intent, or plan.",
  "Leadership items probe delegation rules: which task fits the assistant, which task stays with the RN, and how to supervise after delegation. Illegal delegation is a common trap. Pair leadership study with your employer policy once you are in practice; for exams, follow the textbook RN scope model.",
  "Ethics scenarios often place two values in tension: autonomy versus safety, truth-telling versus harm reduction. Choose the path that preserves life when imminent risk exists, documents transparently, and involves ethics resources when the case is genuinely ambiguous. Never select an option that abandons monitoring when deterioration is likely.",
  "International migration planning is a project management problem. Build a single spreadsheet with regulator deadlines, credential evaluation milestones, English test dates, NCLEX readiness checkpoints, and employer touchpoints. Clinical preparation belongs in the same calendar as paperwork so neither strand starves the other.",
  "Canadian provincial colleges publish competencies that align to NCLEX-RN as the national RN exam. Filipino nurses should read their target province’s internationally educated nurse pathway before assuming timelines. NNAS and college-specific instructions can change; treat web snapshots as hints, not contracts.",
  "United States state boards differ on CGFNS requirements, fingerprinting, and English evidence. Pick a state early, download the checklist, and confirm whether you need VisaScreen for immigration later. NurseNest supports the knowledge portion of NCLEX-RN; immigration counsel belongs with qualified advisers.",
  "English proficiency exams are gatekeeping steps, not nuisances. Schedule them with buffer before your NCLEX attempt so a single bad day does not cascade into job offer loss. Pair listening practice with clinical vocabulary so workplace communication feels familiar, not performative.",
  "Tagalog-first learners can keep Tagalog notes for pathophysiology stories while rehearsing NCLEX stems in English. Mixed-language study groups help accountability; assign one member to challenge rationales out loud each session. The goal is fluent English clinical reading speed, not perfect accent.",
  "Cebuano, Hiligaynon, Ilocano, and other regional languages shape how families discuss illness. Respect that cultural layer in communication stems, but select exam answers in the professional English framing NCLEX expects. Cultural competence is not the same as delaying necessary escalation.",
  "Simulation-style drills for prioritisation: list six patients, assign acuity, then defend your first two visits. Swap cases weekly. This trains the same triage muscles NLE items reward and NCLEX later amplifies with alternate-format questions.",
  "Nutrition and GI content often links to electrolyte derangements. Track common pairs: vomiting and metabolic alkalosis patterns, diarrhoea and metabolic acidosis patterns, diuretic misuse and potassium shifts. Draw mini graphs in the margin of your notes to cement relationships.",
  "Renal scenarios emphasise fluid balance, dialysis access protection, and medication adjustments for clearance. When creatinine trends appear, anticipate polypharmacy risk and teaching for dietary potassium if applicable. Always verify allergies before suggesting contrast or new drugs.",
  "Endocrine cases cluster around glucose extremes, thyroid storms, adrenal crises, and pituitary regulation. Cold and warm cues matter: diaphoresis versus dry skin, tachycardia patterns, and neuro checks. Tie each presentation to the hormone axis involved.",
  "Infection control stems love isolation indications, hand hygiene moments, and cluster outbreak steps. Choose answers that stop transmission first when the scenario implies contagion risk. Remember occupational health: sharps safety and post-exposure pathways belong in the same mental model.",
  "Pain management balances assessment scales, opioid risk, multimodal non-opioid options, and patient goals. Avoid undertreating severe pain when orders exist; avoid dangerous stacking when sedation risk is high. Document-focused answers appear when the stem mentions regulatory audit or legal review.",
  "Research literacy items ask you to interpret a snippet of evidence: sample size caveats, bias, and applicability. Even if you dislike statistics, learn a few heuristics: randomisation reduces selection bias, blinding reduces performance bias, and clinical significance differs from statistical significance.",
  "Disaster nursing scenarios prioritise triage tags, resource allocation, and psychological first aid. Choose answers that stabilise the most lives per unit time when resources are finite. Ethical distress is normal; exam items still want clear triage rules, not indefinite heroics without supplies.",
  "Palliative content rewards symptom control, family communication, and clarity about goals-of-care. Hastening death is never the correct nursing action. Sedation for refractory symptoms is different from sedation to end life; read stems carefully for wording that signals legitimate palliative intent.",
  "Occupational health items address needlestick protocols, TB testing, ergonomics, and violence prevention. Your answer should protect both worker and patient. If the stem places you in a community factory clinic, think prevention and education, not only acute treatment.",
  "School health scenarios emphasise developmental milestones, vaccination schedules, and safeguarding minors. Mandatory reporting appears when abuse is suspected. Communication with guardians should be collaborative unless immediate danger requires statutory reporting first.",
  "Hematology and immunology items weave anemia patterns, transfusion reactions, neutropenic precautions, and graft-versus-host cues. Anchor management to the underlying mechanism: replace what is missing, stop what is harming, protect what is vulnerable.",
  "Musculoskeletal content includes falls prevention, joint replacement teaching, and compartment syndrome vigilance. Neurovascular checks after casts or procedures are classic exam bait. Escalate when pain is out of proportion or pulses change.",
  "Perioperative nursing spans pre-op teaching, intra-op safety timeouts, and post-op complication surveillance. Airway, bleeding, and infection remain the big three. When unclear, choose the assessment that detects deterioration earliest.",
  "Neurological stems reward GCS trends, stroke timelines for intervention, seizure safety, and ICP management basics. Time-sensitive strokes and evolving deficits should trigger rapid escalation pathways when the scenario allows.",
  "Respiratory items emphasise oxygen delivery devices, asthma and COPD exacerbations, pulmonary embolism suspicion, and ventilator basics for nurses. Always verify oxygen saturation trends before congratulating yourself on a stable-looking patient.",
  "Cardiovascular cases layer chest pain protocols, heart failure compensation, arrhythmia recognition, and anticoagulation vigilance. ECG interpretation may be high level, but exam writers expect you to connect rhythm risk to patient stability.",
  "Acid-base interpretation improves with deliberate practice. Learn quick rules for metabolic versus respiratory drivers, then verify with expected compensation ranges. Items often embed a single lab pair that unlocks the whole story.",
  "Family communication in Filipino contexts may involve large decision-making circles. Respect that dynamic in therapeutic communication answers while still advocating for patient autonomy when the patient has capacity.",
  "Public health law questions appear less often but matter: reportable diseases, contact tracing ethics, and vaccination policy. Choose answers that align with statute and protection of population health when privacy and public good collide in the stem.",
  "Leadership and management items may reference quality metrics, root cause analysis, and just culture. Blame-free systems still hold individuals accountable for reckless behaviour; choose answers that improve systems while addressing unsafe acts.",
  "Simulation debrief habits help OSCE-style skills even when your immediate exam is written. Practice aloud: introduction, consent, closed-loop communication, and teach-back. Those behaviours also strengthen employer interviews later.",
  "Sleep, nutrition, and exercise protect cognition during long preparation arcs. Treat recovery as part of the study plan, not a reward you never grant. Burnout reduces reading comprehension more than missing one more chapter ever could.",
  "Financial planning for exams and migration reduces background stress. Budget NCLEX attempts, travel for clinical placements, English tests, and credential fees. Unknown costs derail timelines; spreadsheets restore agency.",
  "Peer teaching accelerates mastery. Explain a topic weekly to a classmate without notes. Gaps in your explanation reveal gaps in understanding faster than passive highlighting ever will.",
  "Professional identity matters: you are accountable to patients, employers, and regulators. Items that test boundary crossing, gifts from patients, or social media conduct want conservative, patient-centred choices.",
  "Documentation stems reward factual charting, timely incident reports, and refusal to chart what did not occur. Legal defensibility flows from accuracy, not verbosity.",
  "Telehealth and digital literacy increasingly appear in modern item banks. Verify identity, confirm consent for virtual care, and ensure follow-up plans are explicit when remote assessment is incomplete.",
];

function angleBlock(angle: PhilippinesBlogAngle, kw: string, domain: string): string {
  const k = esc(kw);
  const d = esc(domain);
  const blocks: Record<PhilippinesBlogAngle, string> = {
    structure: `<h2>Structure and blueprint thinking</h2><p>This article emphasises how the ${k} frames nursing competence across domains such as ${d}. Treat the official Professional Regulation Commission bulletin as the authoritative map for your testing window. NurseNest supplements with NCLEX-aligned reasoning, not a substitute for PRC-specific administration.</p><ul><li>Anchor every week to one domain cluster and one ethics or leadership theme.</li><li>Cross-check school notes with current scope statements for Filipino practice.</li><li>Log unfamiliar stems in a single notebook to spot recurring traps.</li></ul>`,
    volume: `<h2>High-volume cohort realities</h2><p>The ${k} search intent often reflects crowded testing seasons and competitive hiring. Volume is not a comment on individual worth; it is a systems reality. Respond with disciplined scheduling, peer accountability, and recovery days to avoid burnout while covering ${d}.</p><ul><li>Protect sleep before heavy drill days.</li><li>Alternate new content with mixed review sets.</li><li>Measure progress with timed blocks, not vague hours studied.</li></ul>`,
    nclex: `<h2>Bridging from NLE nursing toward NCLEX-RN</h2><p>After Philippine licensure milestones, NCLEX-RN becomes a separate regulator-led project. This ${k} article ties ${d} study habits to the cognitive skills NCLEX rewards: prioritisation, safety, and clinical judgement under uncertainty.</p><ul><li>Keep Philippine foundations; add CAT-style pacing drills early.</li><li>Separate CGFNS or college paperwork from daily question practice.</li><li>Use bilingual notes if that preserves comprehension without slowing English reading speed gains.</li></ul>`,
    "us-migration": `<h2>United States pathway notes</h2><p>United States registration layers state board rules, credential evaluation, possible VisaScreen requirements, and NCLEX-RN. The ${k} theme intersects ${d} because clinical employers still expect sound judgement from day one. NurseNest helps you train knowledge; immigration counsel belongs with qualified professionals.</p><ul><li>Download your board’s IEN checklist and mark completed rows monthly.</li><li>Align English test dates with employer recruitment windows when possible.</li><li>Practice NCLEX-style communication for handoff scenarios common in US units.</li></ul>`,
    "ca-migration": `<h2>Canada pathway notes</h2><p>Canadian RN registration is provincial. NNAS and college-specific steps precede or accompany NCLEX-RN depending on stream. This ${k} discussion highlights ${d} as transferable clinical capital while you navigate paperwork.</p><ul><li>Read your college’s latest IEN guide; save PDFs with dates.</li><li>Map NCLEX prep to the competency language your province emphasises.</li><li>Plan finances for multiple assessment fees before your first shift.</li></ul>`,
    clinical: `<h2>Clinical reasoning for ${d}</h2><p>Deep work in ${d} strengthens both Philippine licensure study and later NCLEX preparation. The keyword ${k} should lead you to structured drills, not random reading.</p><ul><li>Use case clusters: one patient story, three decision points, full rationales.</li><li>Pair pathophysiology review with ${LESS} chapters before ${BANK} sets.</li><li>Teach-back a complex topic weekly to solidify retrieval.</li></ul>`,
    language: `<h2>Language workflows for Filipino candidates</h2><p>English remains the operational language for NCLEX-RN items. Many candidates searching ${k} also want Tagalog-accessible navigation for marketing pages; use localized pricing and lessons entry when helpful. For ${d}, keep English labels in your flashcards even if explanations mix languages.</p><ul><li>Schedule daily English reading of rationales aloud.</li><li>Build a shared glossary for family-centered terms you use with patients.</li><li>Track reading speed weekly to ensure exam pacing feasibility.</li></ul>`,
    "study-plan": `<h2>Twelve-week scaffolding</h2><p>Long arcs beat panic. For ${d}, distribute baseline review, mixed practice, and full-length simulations across twelve weeks when possible. ${k} preparation benefits from visible milestones.</p><ul><li>Weeks 1-4: content rebuild and weak-domain diagnostics.</li><li>Weeks 5-8: timed mixed sets with error pattern tracking.</li><li>Weeks 9-12: simulation days, sleep discipline, and light review only.</li></ul>`,
  };
  return blocks[angle];
}

export function buildPhilippinesBlogBody(topic: PhilippinesBlogSeedTopic): string {
  const kw = esc(topic.keyword);
  const domain = esc(topic.domain);
  const idx = topic.index;
  const hub = PH_HUB;
  const intro = `<p>This long-form guide supports nursing students and registered nurses navigating the <strong>${kw}</strong> discussion space, with emphasis on <strong>${domain}</strong>. It is educational, not legal advice, and does not replace Professional Regulation Commission communications. Index reference: ${idx}.</p>`;

  const core = `<h2>Why this topic matters now</h2><p>Readers searching <strong>${kw}</strong> often juggle school deadlines, board review, family expectations, and early thoughts about NCLEX-RN. Clarify your sequence: master Philippine licensure expectations first if you are still pre-registration, then layer NCLEX-aligned practice when a US state board or Canadian college authorises you to test. Domain focus today: ${domain}.</p>
<h2>Philippines nursing board exam context</h2><p>The national licensure examination validates that graduates meet entry-level competence for practice under Philippine regulation. Items reward integration across nursing science, clinical skills reasoning, community orientation, ethics, and leadership foundations. Your program’s outcomes map to those domains even when daily classes feel siloed. Use spiral review so ${domain} knowledge stays connected to pharmacology, communication, and systems thinking.</p>
<h2>NLE nursing volume and your study design</h2><p>Large annual cohorts mean competitive hiring and emotional pressure. Respond with evidence-backed study habits: spaced repetition, interleaved practice, deliberate rest, and weekly self-testing. Volume explains environment; it does not define your ceiling. Track metrics—accuracy on timed sets, average rationale quality in your own words, and number of distinct patient scenarios rehearsed—to prove progress objectively.</p>
<h2>Connecting to NCLEX-style practice responsibly</h2><p>NurseNest’s ${BANK} trains clinical judgement for NCLEX-RN pathways in the United States and Canada. The ${kw} phase may still benefit from that style of thinking because safety and prioritisation skills transfer across regulators, even when item formats differ. Pair ${US_LESS} with ${US_Q} for American routes, and ${CA_LESS} with ${CA_Q} for Canadian RN routes. Always confirm eligibility independently.</p>
<h2>Migration awareness without legal overreach</h2><p>Philippine nurses contribute globally; migration steps involve regulators, employers, and immigration frameworks. This article avoids visa legal advice. Instead, it stresses parallel planning: keep credential documents organised, schedule English tests with buffer, and maintain clinical competence through continual practice. Refer to ${hub} for the hub-level map.</p>`;

  const angled = angleBlock(topic.angle, topic.keyword, topic.domain);

  const outro = `<h2>Action checklist</h2><ul><li>Confirm PRC bulletin details for your cohort.</li><li>Build a weekly schedule that includes ${domain} review plus mixed items.</li><li>Log errors and revisit them after sleep.</li><li>When NCLEX approaches, pivot time toward CAT-style drills and full-length simulations.</li></ul><h2>Where NurseNest fits</h2><p>Use ${hub} for orientation, then practise in ${BANK}, ${LESS}, and the NCLEX pathway links above. Tag this article series under philippines-nle for ongoing reading.</p>`;

  let html = `${intro}${core}${angled}${outro}`;

  let guard = 0;
  while (wordCountFromHtml(html) < MIN_WORDS && guard < 500) {
    const chunk = EXPANSION_PARAGRAPHS[(idx + guard) % EXPANSION_PARAGRAPHS.length];
    html += `<h3>Expanded study notes (${guard + 1})</h3><p>${chunk}</p>`;
    guard += 1;
  }

  if (wordCountFromHtml(html) < MIN_WORDS) {
    throw new Error(`Philippines blog body still below ${MIN_WORDS} words for slug ${topic.slug}`);
  }

  return html;
}

export function excerptFromBody(html: string): string {
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.slice(0, 280) + (plain.length > 280 ? "…" : "");
}

/** Dev/test helper: verify every generated body meets minimum length */
export function assertPhilippinesBodiesMeetMinWords(): void {
  for (const t of PHILIPPINES_NLE_BLOG_TOPICS) {
    const w = wordCountFromHtml(buildPhilippinesBlogBody(t));
    if (w < MIN_WORDS) {
      throw new Error(`Below ${MIN_WORDS} words: ${t.slug} (${w})`);
    }
  }
}
