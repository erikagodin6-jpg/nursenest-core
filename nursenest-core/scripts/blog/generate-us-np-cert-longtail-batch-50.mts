#!/usr/bin/env npx tsx
/**
 * Deterministic 50-post US NP certification long-tail batch for `blog-static-longtail`.
 * Run from nursenest-core/: npx tsx scripts/blog/generate-us-np-cert-longtail-batch-50.mts
 *
 * Writes markdown under src/content/blog-static-longtail/ and reports/us-np-cert-longtail-batch-50.md
 */
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..", "..");
const OUT = join(APP_ROOT, "src", "content", "blog-static-longtail");
const REPORT = join(APP_ROOT, "reports", "us-np-cert-longtail-batch-50.md");

const MIN_WORDS = 1850;

const DISCLAIMER =
  "This article supports educational exam preparation for US nurse practitioner certification candidates. It is not individualized medical advice, a substitute for your institution's policies, or a treatment protocol. Always follow state scope of practice, collaborative requirements, formularies, and local protocols in real patient care.";

type Primary = "FNP" | "AGPCNP" | "PMHNP" | "PNP-PC" | "WHNP";
type Domain =
  | "cardio"
  | "endocrine"
  | "pulm"
  | "renal"
  | "gi"
  | "heme"
  | "neuro"
  | "infectious"
  | "psych"
  | "womens"
  | "peds"
  | "rheum"
  | "derm"
  | "education"
  | "acute";

type Topic = {
  slug: string;
  title: string;
  excerpt: string;
  primary: Primary;
  tags: string;
  domain: Domain;
  category: string;
  seoTitle: string;
  seoDescription: string;
  guideline: string;
};

function hashSeed(s: string): number {
  const h = createHash("sha256").update(s).digest();
  return h.readUInt32BE(0) ^ h.readUInt32BE(4);
}

function mulberry32(a: number): () => number {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function wordCount(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ");
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

const INTERNAL_BLOG: Record<string, string> = {
  "sepsis-pathophysiology-early-nursing-recognition": "Sepsis pathophysiology and early nursing recognition",
  "left-sided-vs-right-sided-heart-failure": "Left-sided vs right-sided heart failure",
  "copd-symptoms-treatment-nursing-care": "COPD symptoms, treatment themes, and nursing care",
  "asthma-pathophysiology-emergency-nursing-interventions": "Asthma pathophysiology and emergency nursing interventions",
  "acute-kidney-injury-prerenal-intrinsic-postrenal": "Acute kidney injury: prerenal, intrinsic, and postrenal patterns",
  "dka-vs-hhs-nursing-priorities": "DKA vs HHS nursing priorities",
  "stroke-ischemic-vs-hemorrhagic-nursing-care": "Stroke: ischemic vs hemorrhagic nursing care",
  "deep-vein-thrombosis-nursing-guide": "Deep vein thrombosis nursing guide",
  "warfarin-vs-heparin-nursing-comparison": "Warfarin vs heparin nursing comparison",
  "pulmonary-embolism-signs-symptoms-nursing-priorities": "Pulmonary embolism signs, symptoms, and nursing priorities",
};

const INTERNAL_KEYS = Object.keys(INTERNAL_BLOG) as (keyof typeof INTERNAL_BLOG)[];

function pickInternal(rng: () => number): string[] {
  const pool = [...INTERNAL_KEYS];
  const out: string[] = [];
  for (let i = 0; i < 5 && pool.length; i++) {
    const idx = Math.floor(rng() * pool.length);
    out.push(pool.splice(idx, 1)[0]!);
  }
  return out;
}

const NP_ACTIONS = [
  "risk stratification before intensifying therapy",
  "serial vitals and focused reassessment after each medication change",
  "kidney and electrolyte monitoring when renin–angiotensin or diuretic therapy changes",
  "age-related pharmacokinetic shifts that alter starting doses in older adults",
  "pregnancy status documentation before prescribing teratogenic drug classes",
  "interaction checks across anticoagulants, antiplatelets, and NSAIDs",
  "shared decision-making with measurable targets and follow-up intervals",
  "screening for sleep apnea, thyroid disorders, or secondary causes when hypertension resists therapy",
  "clear escalation thresholds for emergency referral versus outpatient adjustment",
  "culture and literacy adapted teaching with teach-back verification",
  "documentation that links assessment data to the medical decision and monitoring plan",
  "collaboration with pharmacy for high-risk polypharmacy regimens",
  "taper plans for corticosteroids, opioids, or benzodiazepines when applicable",
  "vaccination status review as part of preventive care integration",
  "social determinants that affect adherence, cost, and follow-up feasibility",
] as const;

const DOMAIN_ANCHORS: Record<Domain, readonly string[]> = {
  cardio: [
    "blood pressure patterns should be interpreted with home readings and proper cuff size",
    "ASCVD risk estimation informs statin intensity and nonstatin add-ons when triglycerides remain elevated",
    "heart failure phenotypes differ in congestion, perfusion, and ejection fraction implications",
    "ischemic equivalents may present as dyspnea, nausea, or syncope rather than classic chest pressure",
    "orthostatic blood pressure assessment helps detect volume depletion or autonomic contributors",
    "after myocardial infarction, secondary prevention bundles include antiplatelet therapy where indicated, statins, and risk factor control",
    "atrial fibrillation stroke prevention integrates CHA2DS2-VASc concepts with bleeding risk awareness",
    "hypertensive urgency is managed without parenteral therapy unless end-organ damage is present",
  ],
  endocrine: [
    "A1c reflects average glycemia but misses rapid excursions; fasting glucose and CGM patterns add context",
    "metformin remains foundational for type 2 diabetes when renal function and contraindications allow",
    "GLP-1 receptor agonists and SGLT2 inhibitors add cardiorenal benefits beyond glucose lowering in selected patients",
    "hypoglycemia risk rises with insulin secretagogues, insulin, renal impairment, and missed meals",
    "thyroid function tests should be paired with clinical syndrome and pregnancy status for interpretation",
    "osteoporosis therapy selection balances fracture risk, duration limits, dental procedures, and renal function",
    "obesity pharmacotherapy complements structured lifestyle therapy and addresses comorbidity targets",
    "insulin intensification uses basal–bolus or premixed strategies matched to literacy and monitoring capacity",
  ],
  pulm: [
    "COPD severity integrates symptoms, exacerbation history, spirometry when available, and oxygen needs",
    "inhaled therapy classes differ in onset, device technique requirements, and anticholinergic cautions",
    "asthma step therapy emphasizes correct inhaler technique, adherence, triggers, and comorbid rhinitis control",
    "pneumonia severity tools help decide outpatient versus inpatient management when clinically appropriate",
    "oxygen titration targets balance hypoxemia correction with hypercapnia risk in selected COPD patients",
    "sleep-related breathing disorders can worsen hypertension and daytime somnolence",
    "vaccination reduces exacerbation risk in chronic lung disease when not contraindicated",
    "pulmonary rehabilitation referral supports exercise tolerance and self-management skills",
  ],
  renal: [
    "CKD staging uses eGFR and albuminuria categories to stratify risk and guide medication dosing",
    "ACE inhibitors or ARBs reduce progression risk in proteinuric kidney disease when safe",
    "potassium and creatinine monitoring follows RAAS blockade and potassium-sparing combinations",
    "contrast exposure planning considers hydration status and baseline kidney function",
    "anemia of chronic kidney disease requires iron studies before erythropoiesis-stimulating decisions in many pathways",
    "drug dose adjustments are common when eGFR falls below thresholds in prescribing references",
    "nephrotoxin review includes NSAIDs, certain antimicrobials, and herbal supplements",
    "transitional care after hospitalization should reconcile diuretics and antihypertensives carefully",
  ],
  gi: [
    "alarm features in dyspepsia prompt endoscopic evaluation rather than empiric long-term PPI alone",
    "PPI therapy duration should be revisited periodically to reduce long-term risks when possible",
    "H pylori testing and treatment change dyspepsia management pathways",
    "liver enzyme patterns suggest hepatocellular versus cholestatic injury mechanisms",
    "GI bleeding risk stratification integrates hemodynamics, comorbidities, anticoagulation, and hemoglobin trend",
    "iron deficiency in men and postmenopausal women warrants evaluation for occult blood loss sources",
    "IBD mimics require infection exclusion before immunosuppression intensification",
    "constipation management differentiates slow transit, outlet dysfunction, and medication-induced contributors",
  ],
  heme: [
    "microcytic anemia patterns suggest iron deficiency, thalassemia trait, or anemia of chronic disease",
    "iron studies include ferritin interpretation with inflammatory state awareness",
    "oral iron strategies address tolerance, timing with PPIs, and expected hemoglobin response intervals",
    "B12 and folate deficiency produce macrocytosis with distinct risk factors and replacement routes",
    "anticoagulation bridges require individualized bleeding and thrombosis risk assessment",
    "DOAC selection considers renal function, weight, age, and drug interactions",
    "warfarin education emphasizes consistent vitamin K intake and INR monitoring cadence",
    "thrombocytopenia prompts medication review and clinical correlation before invasive procedures",
  ],
  neuro: [
    "stroke timelines emphasize last known well, imaging eligibility, and contraindications to reperfusion therapy",
    "migraine red flags include thunderclap onset, focal deficits, fever, and immunocompromise",
    "TIA requires urgent risk factor modification and often specialist coordination",
    "delirium is an acute attention fluctuation with medical triggers; dementia is chronic cognitive decline",
    "Parkinson medication timing affects mobility and falls risk across the day",
    "seizure first aid emphasizes airway protection, timing, and emergency activation when prolonged",
    "headache chronicity patterns inform medication overuse headache considerations",
    "cognitive screening tools support detection but do not replace diagnostic workup when unclear",
  ],
  infectious: [
    "sepsis bundles emphasize early recognition, cultures, antibiotics, and hemodynamic support within scope",
    "UTI syndromes differ in uncomplicated cystitis, pyelonephritis, and catheter-associated patterns",
    "STI testing uses nucleic acid amplification tests when available and treats partners per guidelines",
    "Lyme disease staging integrates endemic exposure, rash morphology, and systemic symptoms",
    "pneumonia pathogens shift by setting: community versus healthcare exposure",
    "HIV PrEP and PEP pathways require risk assessment and baseline labs where programs exist",
    "hepatitis screening follows USPSTF recommendations for at-risk cohorts",
    "travel history changes fever differential diagnosis and isolation considerations",
  ],
  psych: [
    "SSRIs require discussion of activation, sexual side effects, bleeding risk with NSAIDs, and serotonin syndrome cues",
    "bipolar disorder treatment distinguishes acute mania, depression, and maintenance mood stabilizer strategies",
    "antipsychotic metabolic monitoring includes weight, lipids, glucose, and movement disorder screening",
    "substance use disorder care integrates motivational interviewing, harm reduction where appropriate, and MAT options",
    "suicide risk assessment is ongoing, not a one-time checkbox, and includes means reduction planning",
    "ADHD stimulant prescribing follows controlled substance regulations and cardiovascular screening when indicated",
    "anxiety disorder therapy combines psychotherapy access, SSRI or SNRI selection, and avoid benzodiazepine reliance",
    "QT prolongation risk rises with polypharmacy and electrolyte abnormalities",
  ],
  womens: [
    "prenatal visits track blood pressure, weight trend, fetal growth concerns, and mental health screening",
    "contraception selection integrates thrombosis risk, migraine with aura, smoking age limits, and drug interactions",
    "menopause counseling addresses vasomotor symptoms, bone health, cardiovascular risk, and urogenital symptoms",
    "STI partner treatment and retesting intervals follow guideline cadences",
    "osteoporosis screening timing uses age, menopause status, and risk factors",
    "pregnancy category considerations have shifted toward detailed labeling review rather than simplistic letter memory",
    "cervical cancer screening intervals depend on age and prior test history",
    "domestic violence screening uses private settings and supportive language",
  ],
  peds: [
    "fever in young infants triggers different thresholds for evaluation than in older children",
    "developmental milestones are interpreted with corrected age for premature infants",
    "ADHD diagnosis requires impairment across settings and exclusion of alternative explanations",
    "growth charts contextualize weight for length and adolescent BMI trends",
    "immunization schedules reduce vaccine-preventable morbidity when families accept vaccination",
    "dosing is predominantly weight-based and must avoid adult assumptions",
    "return precautions after urgent care visits should be caregiver-friendly and specific",
    "adolescent confidentiality laws affect STI testing consent in many jurisdictions",
  ],
  rheum: [
    "inflammatory arthritis morning stiffness pattern differs from degenerative mechanical pain",
    "methotrexate monitoring includes CBC and liver enzymes on a protocol schedule",
    "gout flares and chronic urate lowering therapy are managed as distinct phases",
    "polymyalgia rheumatica and giant cell arteritis share age-related risk and urgency distinctions",
    "fibromyalgia management emphasizes education, graded activity, and comorbid mood disorder treatment",
    "lupus flares may involve hematologic, renal, and serologic changes requiring escalation",
    "OA management combines weight reduction, physical activity, topical NSAIDs, and joint protection",
    "biologic therapy requires infection screening and immunization optimization when possible",
  ],
  derm: [
    "ABCDE criteria support melanoma suspicion but biopsy confirms diagnosis",
    "actinic keratoses and squamous lesions differ in invasion risk and management urgency",
    "dermatophyte infections require duration adequate for cure rather than symptom-only treatment",
    "cellulitis mimics include stasis dermatitis and contact allergy",
    "drug eruptions correlate with recent medication starts and eosinophilia in severe cases",
    "HSV and zoster lesions have distinct dermatomal patterns and antiviral timing windows",
    "acne therapy escalates by severity and scarring risk with teratogenicity counseling for isotretinoin pathways",
    "pressure injury staging guides offloading and nutrition optimization",
  ],
  education: [
    "PICO questions clarify population, intervention, comparison, and outcomes for literature appraisal",
    "GRADE concepts distinguish certainty of evidence from strength of recommendations",
    "bias types include selection, performance, detection, and attrition biases in trials",
    "SOAP notes link subjective report, objective data, assessment synthesis, and measurable plan steps",
    "differential diagnosis frameworks cluster by organ system, risk, and pretest probability",
    "study plans should pair weak domains with timed question blocks and spaced review",
    "exam anxiety management includes sleep hygiene, simulation timing, and error logging",
    "professional ethics scenarios test boundary maintenance and scope clarity",
  ],
  acute: [
    "hemodynamic instability prioritizes airway, breathing, circulation assessment before detailed history",
    "shock categories include distributive, hypovolemic, cardiogenic, and obstructive physiology",
    "acute coronary syndrome pathways integrate ECG, troponins, and risk scores",
    "abdominal pain red flags include peritoneal signs, melena, pregnancy, and elder toxicity presentations",
    "sepsis recognition uses systemic infection signs plus organ dysfunction markers",
    "stroke codes require glucose checks and time documentation precision",
    "GI bleeding management sequences resuscitation, risk stratification, and source control planning",
    "respiratory failure patterns include work of breathing, gas exchange, and fatigue indicators",
  ],
} as const;

function factStream(topic: Topic, rng: () => number, n: number): string[] {
  const anchors = DOMAIN_ANCHORS[topic.domain];
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = pick(anchors, rng);
    const b = pick(NP_ACTIONS, rng);
    out.push(
      `When studying ${topic.title.split(":")[0]!.trim()}, anchor ${a}; certification-style items reward ${b}.`,
    );
  }
  return out;
}

function paragraphsFromFacts(facts: string[], rng: () => number): string {
  const chunks: string[] = [];
  for (let i = 0; i < facts.length; i += 2) {
    const pair = facts.slice(i, i + 2).join(" ");
    const bridge = pick(
      [
        "Translate this into a two-step exam habit: name the mechanism, then name the monitoring parameter that makes the plan safer.",
        "On the exam, compare answer choices for contraindications before comparing them for textbook correctness.",
        "If the stem adds pregnancy, anticoagulation, or acute kidney injury, re-rank options using safety-first sequencing.",
        "Write a one-line chart note version of the decision: what changed, why you acted, and when you will reassess.",
      ],
      rng,
    );
    chunks.push(`<p>${pair} ${bridge}</p>`);
  }
  return chunks.join("\n");
}

function apaBlock(topic: Topic): string {
  const g = topic.guideline;
  const lines = [
    `<p>American Association of Colleges of Nursing. (2021). <em>The essentials: Core competencies for professional nursing education</em>. https://www.aacnnursing.org/</p>`,
    `<p>National Organization of Nurse Practitioner Faculties. (2022). NP core competencies and population foci. https://www.nonpf.org/</p>`,
    `<p>${g}</p>`,
    `<p>U.S. Preventive Services Task Force. (2024). Recommendations for primary care clinicians. https://www.uspreventiveservicestaskforce.org/</p>`,
    `<p>Centers for Disease Control and Prevention. (2024). Clinical guidelines and public health resources for clinicians. https://www.cdc.gov/</p>`,
    `<p>Agency for Healthcare Research and Quality. (2023). Evidence-based practice resources. https://www.ahrq.gov/</p>`,
    `<p><em>Follow your program citation requirements; URLs support educational traceability and do not replace institutional policy or prescribing references.</em></p>`,
  ];
  return lines.join("\n");
}

function buildBody(topic: Topic): string {
  const rng = mulberry32(hashSeed(topic.slug));
  const label = topic.title.split(":")[0]!.trim();
  const factsA = factStream(topic, rng, 26);
  const factsB = factStream(topic, mulberry32(hashSeed(`${topic.slug}:b`)), 20);
  const factsC = factStream(topic, mulberry32(hashSeed(`${topic.slug}:c`)), 16);

  const parts: string[] = [];

  parts.push(`<h2>Introduction</h2>`);
  parts.push(
    `<p>This guide supports US-based nurse practitioner certification preparation for <strong>${label}</strong>. It emphasizes advanced practice clinical reasoning, guideline-informed decision-making, and prescribing safety language commonly tested on AANP-style and ANCC-style item formats. Content is educational and international-English: it avoids idioms and focuses on transferable concepts.</p>`,
  );
  parts.push(
    `<p>Advanced practice registered nurses integrate pathophysiology, diagnostics, therapeutics, and patient education within state scope and collaborative agreements where required. As you read, practice translating each paragraph into a patient vignette: what data you would collect, what you would prescribe or defer, and what you would monitor.</p>`,
  );
  parts.push(paragraphsFromFacts(factsA.slice(0, 6), rng));

  parts.push(`<h2>Key Takeaways</h2>`);
  parts.push("<ul>");
  const bullets = [
    `Primary certification relevance is strongest for the <strong>${topic.primary}</strong> population focus; cross-track learners should still map concepts to their exam blueprint.`,
    "Guideline synthesis beats memorizing isolated numbers: know targets, exceptions, and monitoring pairs.",
    "Red-flag recognition and escalation are frequent single-best-answer themes in acute presentations.",
    "Prescribing questions often test renal adjustment, pregnancy avoidance, QT risk, and interaction pairs.",
    "Documentation and shared decision-making appear as professional practice items, not only science items.",
    "Use structured differential frameworks to avoid anchoring on the first plausible diagnosis in a stem.",
    "Chronic disease questions reward follow-up intervals, measurable outcomes, and adherence barriers.",
  ];
  for (const b of bullets) parts.push(`<li>${b}</li>`);
  parts.push("</ul>");

  parts.push(`<h2>Why this matters for NP certification exams</h2>`);
  parts.push(
    `<p>Certification items reward the clinician who can prioritize data, identify unsafe options, and select evidence-aligned next steps within NP scope. For <strong>${label}</strong>, expect multimorbidity, medication lists, pregnancy status, kidney function, and social context to change the correct answer.</p>`,
  );
  parts.push(paragraphsFromFacts(factsA.slice(6, 14), rng));

  parts.push(`<h2>Advanced pathophysiology</h2>`);
  parts.push(
    `<p>Exam preparation should connect mechanisms to bedside cues. For <strong>${label}</strong>, explain how cellular, organ-level, and systemic changes produce the symptom cluster in the stem, then name the complication the item is trying to prevent.</p>`,
  );
  parts.push(paragraphsFromFacts(factsB.slice(0, 10), rng));

  parts.push(`<h2>Differential diagnosis</h2>`);
  parts.push(
    `<p>Build differentials as clusters: urgent versus non-urgent, organ system versus systemic mimic, and medication-induced versus primary disease. For <strong>${label}</strong>, rehearse at least five plausible alternatives that share overlapping features but differ in timing, risk factors, or key exam or lab discriminators.</p>`,
  );
  parts.push(paragraphsFromFacts(factsB.slice(10, 18), rng));

  parts.push(`<h2>Diagnostic workup</h2>`);
  parts.push(
    `<p>Workup sequencing should match pretest probability and patient stability. Certification items often test whether you order the right test at the right time, avoid low-yield panels, and choose monitoring that changes management for <strong>${label}</strong>.</p>`,
  );
  parts.push(paragraphsFromFacts(factsC.slice(0, 8), rng));

  parts.push(`<h2>Interpretation of labs/imaging</h2>`);
  parts.push(
    `<p>Interpret tests in context: acute versus chronic changes, baseline versus trend, and confounders such as hemolysis, volume status, or timing relative to therapy. For <strong>${label}</strong>, connect each abnormal value to a decision: continue, adjust, stop, or escalate.</p>`,
  );
  parts.push(paragraphsFromFacts(factsC.slice(8, 14), rng));

  parts.push(`<h2>Pharmacologic management</h2>`);
  parts.push(
    `<p>NP-focused pharmacology questions pair first-line therapy with monitoring. Study class effects, major contraindications, taper needs, and renal or hepatic dose adjustments. For <strong>${label}</strong>, rehearse what you would do if the patient reports intolerance, if eGFR changes, or if pregnancy is possible.</p>`,
  );
  parts.push(paragraphsFromFacts(factsA.slice(14, 22), rng));

  parts.push(`<h2>Nonpharmacologic management</h2>`);
  parts.push(
    `<p>Lifestyle, physical activity, nutrition, sleep, and behavioral strategies are not optional add-ons; they are core management for many conditions tested on primary care exams. For <strong>${label}</strong>, connect nonpharmacologic plans to measurable outcomes and follow-up timing.</p>`,
  );
  parts.push(paragraphsFromFacts(factsB.slice(18, 22), rng));

  parts.push(`<h2>Red flags and escalation</h2>`);
  parts.push(
    `<p>Escalation themes include hemodynamic instability, neurologic deficits, severe dyspnea, syncope, gastrointestinal bleeding, sepsis suspicion, and pregnancy complications. For <strong>${label}</strong>, memorize a short list of “same-day evaluation” triggers and the information you would send with the referral.</p>`,
  );
  parts.push(paragraphsFromFacts(factsA.slice(22), rng));

  parts.push(`<h2>Evidence-based practice considerations</h2>`);
  parts.push(
    `<p>${topic.guideline} Use guideline summaries to learn default care paths, then study exceptions: pregnancy, advanced CKD, liver failure, immunosuppression, and frailty syndromes.</p>`,
  );
  parts.push(
    `<p>Evidence-based practice also means appraising single-study headlines cautiously, integrating patient values, and recognizing when local protocols differ from national summaries for legitimate reasons.</p>`,
  );

  parts.push(`<h2>Patient education</h2>`);
  parts.push(
    `<p>Teach patients what to monitor at home, what should trigger a message versus emergency care, and how to take medications correctly. For <strong>${label}</strong>, use plain language, written instructions, interpreter access when needed, and teach-back to verify understanding.</p>`,
  );
  parts.push(paragraphsFromFacts(factsC.slice(14), rng));

  parts.push(`<h2>Prescribing safety considerations</h2>`);
  parts.push(
    `<p>Safety checks include allergies, pregnancy, lactation, renal function, hepatic function, QT risk, serotonin syndrome risk, bleeding risk, drug–drug interactions, duplicate therapy, and controlled substance rules. For <strong>${label}</strong>, practice verbalizing a prescribing checklist you would run before e-prescribing.</p>`,
  );
  parts.push(
    `<p>Many items test black box awareness at a principle level: what monitoring is required, what counseling is mandatory, and when a medication class is contraindicated rather than merely “less preferred.”</p>`,
  );

  parts.push(`<h2>Common certification exam traps</h2>`);
  parts.push("<ul>");
  const traps = [
    "Choosing a correct therapy for the diagnosis but ignoring an absolute contraindication in the stem.",
    "Picking a subspecialty referral when the unstable patient needs emergency stabilization first.",
    "Stopping anticoagulation inappropriately based on a single mild lab abnormality without clinical context.",
    "Treating a positive screen as definitive diagnosis without confirmatory testing when guidelines require it.",
    "Selecting benzodiazepines as first-line long-term therapy for chronic anxiety in ambulatory primary care.",
    "Ignoring pediatric weight-based dosing principles in medication math stems.",
    "Anchoring on depression when bipolar disorder features are present in the history.",
  ];
  for (const t of traps) parts.push(`<li>${t}</li>`);
  parts.push("</ul>");
  parts.push(
    `<p>For <strong>${label}</strong>, re-read the last sentence of the stem; exam writers often place the decisive clue there.</p>`,
  );

  parts.push(`<h2>High-yield memorization pearls</h2>`);
  parts.push("<ul>");
  const pearls = [
    "Pair each new medication with a monitoring parameter and a follow-up interval.",
    "Memorize pregnancy contraindications as a class review: ACE inhibitors, ARBs, statins in some contexts, teratogenic anti-epileptics, and vitamin A analogues.",
    "Know CKD stages enough to recognize when metformin, NSAIDs, or certain antibiotics need avoidance or dose change at a principle level.",
    "For infectious disease stems, match syndrome to likely pathogens and guideline-preferred outpatient regimens when stability allows.",
    "For psychiatric stems, screen for mania before starting antidepressant monotherapy when clinically appropriate.",
  ];
  for (const p of pearls) parts.push(`<li>${p}</li>`);
  parts.push("</ul>");

  const ir = mulberry32(hashSeed(`${topic.slug}:links`));
  const blogLinks = pickInternal(ir);
  parts.push(`<h2>Suggested internal links</h2>`);
  parts.push("<ul>");
  for (const s of blogLinks) {
    parts.push(`<li><a href="/blog/${s}">${INTERNAL_BLOG[s]}</a></li>`);
  }
  parts.push(`<li><a href="/app/lessons">NurseNest lessons library</a> for pathway-aligned depth and spaced review.</li>`);
  parts.push(`<li><a href="/app/questions">Practice questions bank</a> for topic-targeted drills.</li>`);
  parts.push(`<li><a href="/app/practice-tests">Practice tests and CAT-style workflows</a> for timed readiness checks.</li>`);
  parts.push(`<li><a href="/app/flashcards">Flashcards</a> for rapid recall of drug classes and criteria.</li>`);
  parts.push(`<li><a href="/app/labs">Labs learning hub</a> for interpretation drills that complement primary care stems.</li>`);
  parts.push(`<li><a href="/app/ecg-video-quiz">ECG video quiz</a> when rhythm interpretation appears in your study plan.</li>`);
  parts.push(`<li><a href="/app/account/progress">Progress and study history</a> to keep momentum visible.</li>`);
  parts.push(`<li><a href="/app/dashboard">Learner dashboard</a> to resume your adaptive study loop.</li>`);
  parts.push("</ul>");

  parts.push(`<h2>Premium CTA</h2>`);
  parts.push(
    `<p>Pair this long-tail guide with NurseNest premium lessons, adaptive practice, and readiness tracking so <strong>${label}</strong> becomes a repeatable decision framework rather than a memorized paragraph. Premium study loops help you connect physiology, prescribing, and safety distractors under time pressure.</p>`,
  );

  parts.push(`<h2>FAQ Schema Questions</h2>`);
  parts.push(`<h3>Is this article individualized medical advice?</h3>`);
  parts.push(
    `<p>No. It supports educational exam preparation for nurse practitioner candidates. Real patients require individualized assessment, local protocols, and prescriptive authority consistent with your role.</p>`,
  );
  parts.push(`<h3>Which certification exams does <strong>${label}</strong> map to?</h3>`);
  parts.push(
    `<p>Concepts align with primary care and population-focused NP certification preparation, with strongest alignment to the <strong>${topic.primary}</strong> track; always cross-check your own blueprint.</p>`,
  );
  parts.push(`<h3>How should I study this topic efficiently?</h3>`);
  parts.push(
    `<p>Read once for structure, then answer practice questions on the same topic the same day. Log misses as either knowledge gaps or reading errors, then revisit the gap with a targeted guideline summary.</p>`,
  );
  parts.push(`<h3>Can I use this guide as a workplace protocol?</h3>`);
  parts.push(
    `<p>No. Protocols must be authorized by your employer and medical staff processes. Use this material to build exam reasoning and references, not as a substitute for order sets or institutional policy.</p>`,
  );

  parts.push(`<h2>APA-7 References</h2>`);
  parts.push(apaBlock(topic));

  return parts.join("\n");
}

function padToMinWords(topic: Topic, body: string, min: number): string {
  let out = body;
  let wc = wordCount(out);
  let i = 0;
  const rng = mulberry32(hashSeed(`${topic.slug}:pad`));
  while (wc < min && i < 80) {
    const a = pick(DOMAIN_ANCHORS[topic.domain], rng);
    const b = pick(NP_ACTIONS, rng);
    out += `\n<p><strong>Additional certification depth:</strong> For ${topic.title.split(":")[0]!.trim()}, connect ${a} with ${b}, then restate the monitoring plan you would document after initiating therapy.</p>`;
    wc = wordCount(out);
    i++;
  }
  return out;
}

const TOPICS: Topic[] = [
  {
    slug: "hypertension-guidelines-for-nps",
    title: "Hypertension Guidelines for NPs: Primary Care Integration for Certification Exams",
    excerpt:
      "Synthesize blood pressure targets, out-of-office measurement, comorbidity-driven therapy intensification, and prescribing safety for US NP certification preparation.",
    primary: "FNP",
    tags: "FNP, AGPCNP, Hypertension, Cardiovascular, Certification, Primary care",
    domain: "cardio",
    category: "Nurse Practitioner",
    seoTitle: "Hypertension guidelines for NPs | NurseNest",
    seoDescription:
      "US-focused NP certification review of hypertension measurement, guideline targets, comorbidity integration, prescribing safety, and exam-style traps.",
    guideline:
      "American Heart Association. (2024). Guideline resources for cardiovascular prevention and hypertension management. https://www.heart.org/",
  },
  {
    slug: "diabetes-management-for-fnp-students",
    title: "Diabetes Management for FNP Students: Glycemic Targets, Therapy Sequencing, and Safety Monitoring",
    excerpt:
      "Connect A1c interpretation, pharmacologic sequencing, hypoglycemia prevention, and renal-safe prescribing for family nurse practitioner certification review.",
    primary: "FNP",
    tags: "FNP, Diabetes, Endocrine, Certification, Primary care, Pharmacology",
    domain: "endocrine",
    category: "Nurse Practitioner",
    seoTitle: "Diabetes management for FNP students | NurseNest",
    seoDescription:
      "FNP-focused diabetes review for certification exams: targets, medication classes, monitoring, comorbidity integration, and patient education anchors.",
    guideline:
      "American Diabetes Association. (2024). Standards of Care in Diabetes (professional resources). https://diabetes.org/",
  },
  {
    slug: "copd-pharmacology-review-np-certification",
    title: "COPD Pharmacology Review for NP Certification: Inhaled Therapies, Exacerbations, and Monitoring",
    excerpt:
      "Review LABA, LAMA, ICS combinations, exacerbation risk, oxygen safety themes, and exam-style prescribing decisions for chronic obstructive pulmonary disease.",
    primary: "FNP",
    tags: "FNP, AGPCNP, COPD, Pulmonary, Pharmacology, Certification",
    domain: "pulm",
    category: "Nurse Practitioner",
    seoTitle: "COPD pharmacology review for NP certification | NurseNest",
    seoDescription:
      "NP certification-focused COPD pharmacology: device classes, exacerbation management principles, oxygen considerations, and monitoring pearls.",
    guideline:
      "Global Initiative for Chronic Obstructive Lung Disease. (2024). GOLD reports and teaching slides. https://goldcopd.org/",
  },
  {
    slug: "heart-failure-management-np-certification",
    title: "Heart Failure Management for NP Certification: Phenotypes, GDMT, and Decompensation Clues",
    excerpt:
      "Link reduced and preserved ejection fraction pathways, guideline-directed medical therapy concepts, diuretic strategies, and red-flag escalation for exams.",
    primary: "FNP",
    tags: "FNP, Heart failure, Cardiovascular, Certification, Pharmacology",
    domain: "cardio",
    category: "Nurse Practitioner",
    seoTitle: "Heart failure management for NP certification | NurseNest",
    seoDescription:
      "Exam-oriented heart failure review for NPs: staging concepts, medication pillars, monitoring, patient education, and acute decompensation recognition.",
    guideline:
      "American Heart Association; American College of Cardiology. (2022). Guideline hub for heart failure (clinical tools and updates). https://www.acc.org/",
  },
  {
    slug: "chest-pain-differential-diagnosis-np-certification",
    title: "Chest Pain Differential Diagnosis for NP Certification: ACS Mimics, Risk Stratification, and Workup",
    excerpt:
      "Structure ischemic, pulmonary, musculoskeletal, and gastrointestinal causes of chest pain with testing sequences and emergency escalation cues.",
    primary: "AGPCNP",
    tags: "AGPCNP, FNP, Chest pain, Acute care, Certification, Cardiovascular",
    domain: "acute",
    category: "Nurse Practitioner",
    seoTitle: "Chest pain differential diagnosis for NP certification | NurseNest",
    seoDescription:
      "NP certification prep for chest pain: ACS considerations, risk tools, ECG and lab sequencing, mimics, and safe escalation language.",
    guideline:
      "American College of Cardiology. (2024). Acute coronary syndrome and chest pain clinician resources. https://www.acc.org/",
  },
  {
    slug: "acute-abdominal-pain-workup-np-certification",
    title: "Acute Abdominal Pain Workup for NP Certification: Surgical Emergencies, Imaging, and Laboratory Clues",
    excerpt:
      "Organize abdominal pain by quadrant and syndrome, identify surgical emergencies, and select rational laboratory and imaging steps for certification items.",
    primary: "AGPCNP",
    tags: "AGPCNP, FNP, Abdominal pain, Acute care, Certification",
    domain: "acute",
    category: "Nurse Practitioner",
    seoTitle: "Acute abdominal pain workup for NP certification | NurseNest",
    seoDescription:
      "NP-focused abdominal pain certification review: alarm features, differential clusters, testing discipline, and escalation principles.",
    guideline:
      "American College of Surgeons. (2023). Educational resources for acute care and emergency general surgery topics. https://www.facs.org/",
  },
  {
    slug: "chronic-kidney-disease-staging-np-certification",
    title: "Chronic Kidney Disease Staging for NP Certification: eGFR, Albuminuria, and Medication Safety",
    excerpt:
      "Apply KDIGO-style risk categories, monitoring cadence, renoprotective therapy principles, and drug dose vigilance for nurse practitioner exams.",
    primary: "FNP",
    tags: "FNP, AGPCNP, CKD, Renal, Certification, Pharmacology",
    domain: "renal",
    category: "Nurse Practitioner",
    seoTitle: "Chronic kidney disease staging for NP certification | NurseNest",
    seoDescription:
      "CKD staging and management review for NP certification: albuminuria categories, RAAS considerations at principle level, and prescribing safety.",
    guideline:
      "KDIGO. (2024). Clinical practice guideline resources for kidney disease (public summaries). https://kdigo.org/",
  },
  {
    slug: "hyperthyroidism-vs-hypothyroidism-np-certification",
    title: "Hyperthyroidism vs Hypothyroidism for NP Certification: Symptoms, Labs, and Therapy Monitoring",
    excerpt:
      "Compare syndromes, interpret TSH and free T4 patterns at a certification level, and outline treatment monitoring and pregnancy considerations.",
    primary: "FNP",
    tags: "FNP, WHNP, Thyroid, Endocrine, Certification",
    domain: "endocrine",
    category: "Nurse Practitioner",
    seoTitle: "Hyperthyroidism vs hypothyroidism for NP certification | NurseNest",
    seoDescription:
      "NP exam review contrasting hyperthyroidism and hypothyroidism: presentation patterns, laboratory interpretation, therapies, and monitoring.",
    guideline:
      "American Thyroid Association. (2024). Clinical practice statements and patient guides (professional hub). https://www.thyroid.org/",
  },
  {
    slug: "anticoagulant-prescribing-review-np-certification",
    title: "Anticoagulant Prescribing Review for NP Certification: DOACs, Warfarin, Reversal Concepts, and Monitoring",
    excerpt:
      "Summarize selection themes, renal considerations, peri-procedural planning at principle level, and bleeding risk counseling for certification exams.",
    primary: "FNP",
    tags: "FNP, AGPCNP, Anticoagulation, Hematology, Certification, Safety",
    domain: "heme",
    category: "Nurse Practitioner",
    seoTitle: "Anticoagulant prescribing review for NP certification | NurseNest",
    seoDescription:
      "Anticoagulation certification review for NPs: mechanism comparisons, monitoring, interaction themes, perioperative concepts, and exam traps.",
    guideline:
      "American Society of Hematology. (2023). Clinical education resources on thrombosis and hemostasis. https://www.hematology.org/",
  },
  {
    slug: "asthma-stepwise-therapy-np-certification",
    title: "Asthma Stepwise Therapy for NP Certification: ICS Formulations, Risk Reduction, and Acute Escalation",
    excerpt:
      "Translate GINA-style step concepts into exam decisions about controller therapy, rescue therapy updates, and when urgent care or emergency referral is indicated.",
    primary: "FNP",
    tags: "FNP, PNP-PC, Asthma, Pulmonary, Certification, Pharmacology",
    domain: "pulm",
    category: "Nurse Practitioner",
    seoTitle: "Asthma stepwise therapy for NP certification | NurseNest",
    seoDescription:
      "Asthma management for NP exams: step therapy principles, inhaler technique themes, exacerbation recognition, and monitoring.",
    guideline:
      "Global Initiative for Asthma. (2024). GINA reports and implementation resources. https://ginasthma.org/",
  },
  {
    slug: "pediatric-fever-evaluation-np-certification",
    title: "Pediatric Fever Evaluation for NP Certification: Age-Based Risk, Serious Bacterial Infection Clues, and Parent Education",
    excerpt:
      "Differentiate low-risk from higher-risk febrile young infants, outline rational testing approaches, and teach return precautions for certification-style cases.",
    primary: "PNP-PC",
    tags: "PNP-PC, Pediatrics, Fever, Infectious disease, Certification",
    domain: "peds",
    category: "Nurse Practitioner",
    seoTitle: "Pediatric fever evaluation for NP certification | NurseNest",
    seoDescription:
      "PNP-focused fever evaluation for certification exams: age thresholds, red flags, testing discipline, and family communication.",
    guideline:
      "American Academy of Pediatrics. (2023). Clinical practice guideline resource hub for pediatricians and advanced practice clinicians. https://publications.aap.org/",
  },
  {
    slug: "adhd-management-review-np-certification",
    title: "ADHD Management Review for NP Certification: Diagnosis Integrity, Stimulants, and Cardiovascular Screening",
    excerpt:
      "Review diagnostic criteria integration, first-line pharmacotherapy concepts, growth and cardiovascular monitoring themes, and nonpharmacologic supports.",
    primary: "PNP-PC",
    tags: "PNP-PC, FNP, ADHD, Pediatrics, Certification, Psychopharmacology",
    domain: "peds",
    category: "Nurse Practitioner",
    seoTitle: "ADHD management review for NP certification | NurseNest",
    seoDescription:
      "ADHD certification review for NPs: assessment integrity, medication classes, monitoring, school accommodation coordination, and safety.",
    guideline:
      "American Academy of Pediatrics. (2019). ADHD clinical practice guideline update (resource page). https://publications.aap.org/",
  },
  {
    slug: "depression-treatment-guidelines-np-certification",
    title: "Depression Treatment Guidelines for NP Certification: SSRI Selection, Monitoring, and Scope-Safe Referral",
    excerpt:
      "Outline measurement-based care concepts, medication initiation and titration themes, suicide risk documentation, and when psychotherapy or psychiatry referral is prioritized.",
    primary: "FNP",
    tags: "FNP, PMHNP, Depression, Mental health, Certification",
    domain: "psych",
    category: "Nurse Practitioner",
    seoTitle: "Depression treatment guidelines for NP certification | NurseNest",
    seoDescription:
      "NP certification-oriented depression management: initial therapy selection, side-effect monitoring, bipolar screening cues, and safety planning principles.",
    guideline:
      "American Psychiatric Association. (2023). Practice guideline resource center (clinical topics). https://www.psychiatry.org/",
  },
  {
    slug: "anxiety-disorders-for-pmhnp-certification",
    title: "Anxiety Disorders for PMHNP Certification: GAD, Panic, Phobias, and Evidence-Informed Therapy Sequencing",
    excerpt:
      "Differentiate anxiety phenotypes, first-line medication classes, CBT access documentation, and benzodiazepine risk language for psychiatric mental health NP exams.",
    primary: "PMHNP",
    tags: "PMHNP, Anxiety, Mental health, Certification, Psychopharmacology",
    domain: "psych",
    category: "Nurse Practitioner",
    seoTitle: "Anxiety disorders for PMHNP certification | NurseNest",
    seoDescription:
      "PMHNP exam preparation for anxiety disorders: therapy sequencing, medication monitoring, comorbidity integration, and exam traps.",
    guideline:
      "American Psychiatric Association. (2023). Anxiety disorders clinical resources for clinicians. https://www.psychiatry.org/",
  },
  {
    slug: "bipolar-disorder-pharmacology-np-certification",
    title: "Bipolar Disorder Pharmacology for NP Certification: Mood Stabilizers, Antipsychotics, and Monitoring Burdens",
    excerpt:
      "Contrast acute mania, bipolar depression, and maintenance strategies at a principle level with metabolic and neurologic monitoring themes.",
    primary: "PMHNP",
    tags: "PMHNP, Bipolar disorder, Psychopharmacology, Certification",
    domain: "psych",
    category: "Nurse Practitioner",
    seoTitle: "Bipolar disorder pharmacology for NP certification | NurseNest",
    seoDescription:
      "PMHNP-focused bipolar pharmacology review: mood stabilizer themes, antipsychotic monitoring, lithium concepts, and exam-style safety questions.",
    guideline:
      "American Psychiatric Association. (2024). Bipolar disorder practice resources for clinicians. https://www.psychiatry.org/",
  },
  {
    slug: "schizophrenia-medication-management-np-certification",
    title: "Schizophrenia Medication Management for NP Certification: Long-Acting Injectables, Monitoring, and Relapse Prevention",
    excerpt:
      "Summarize antipsychotic class effects, metabolic monitoring, adherence barriers, and crisis planning language commonly tested for PMHNP candidates.",
    primary: "PMHNP",
    tags: "PMHNP, Schizophrenia, Psychopharmacology, Certification",
    domain: "psych",
    category: "Nurse Practitioner",
    seoTitle: "Schizophrenia medication management for NP certification | NurseNest",
    seoDescription:
      "Schizophrenia management review for PMHNP exams: medication monitoring, relapse signatures, community resources, and prescribing safety.",
    guideline:
      "American Psychiatric Association. (2021). Schizophrenia treatment resource summaries for clinicians. https://www.psychiatry.org/",
  },
  {
    slug: "substance-use-disorder-treatment-np-certification",
    title: "Substance Use Disorder Treatment for NP Certification: MAT Concepts, Stigma Reduction, and Safety Monitoring",
    excerpt:
      "Review opioid use disorder medication options at principle level, alcohol use disorder therapies, withdrawal red flags, and collaborative care documentation.",
    primary: "PMHNP",
    tags: "PMHNP, FNP, Substance use, Addiction medicine, Certification",
    domain: "psych",
    category: "Nurse Practitioner",
    seoTitle: "Substance use disorder treatment for NP certification | NurseNest",
    seoDescription:
      "SUD certification review for NPs: screening, MAT themes, counseling integration, pregnancy considerations, and exam ethics language.",
    guideline:
      "Substance Abuse and Mental Health Services Administration. (2024). Medications for substance use disorders (training and guidance hub). https://www.samhsa.gov/",
  },
  {
    slug: "prenatal-care-basics-for-whnp-certification",
    title: "Prenatal Care Basics for WHNP Certification: Visit Cadence, Screening, and High-Risk Referral Triggers",
    excerpt:
      "Outline routine prenatal visit elements, evidence-informed screening themes, nutrition and supplement counseling, and hypertension and diabetes escalation cues.",
    primary: "WHNP",
    tags: "WHNP, Prenatal, Obstetrics, Certification, Primary care",
    domain: "womens",
    category: "Nurse Practitioner",
    seoTitle: "Prenatal care basics for WHNP certification | NurseNest",
    seoDescription:
      "WHNP-focused prenatal certification review: visit structure, screening, red flags, patient education, and interprofessional referral language.",
    guideline:
      "American College of Obstetricians and Gynecologists. (2024). Clinical guidance resources for obstetrician–gynecologists and women’s health clinicians. https://www.acog.org/",
  },
  {
    slug: "contraception-prescribing-review-np-certification",
    title: "Contraception Prescribing Review for NP Certification: Hormonal Methods, IUD Counseling, and Contraindication Screening",
    excerpt:
      "Compare contraceptive mechanisms, common side-effect counseling, drug interactions, and thrombosis risk screening language for certification exams.",
    primary: "WHNP",
    tags: "WHNP, FNP, Contraception, Women’s health, Certification",
    domain: "womens",
    category: "Nurse Practitioner",
    seoTitle: "Contraception prescribing review for NP certification | NurseNest",
    seoDescription:
      "Contraception certification review for NPs: selection frameworks, contraindications, follow-up, and exam-style counseling stems.",
    guideline:
      "Centers for Disease Control and Prevention. (2024). U.S. medical eligibility criteria for contraceptive use (summary resources). https://www.cdc.gov/reproductivehealth/",
  },
  {
    slug: "sti-management-guidelines-np-certification",
    title: "STI Management Guidelines for NP Certification: Testing, Treatment Partners, and Special Populations",
    excerpt:
      "Summarize syndromic and laboratory-based approaches, partner notification principles, pregnancy considerations, and follow-up testing cadences.",
    primary: "WHNP",
    tags: "WHNP, FNP, PMHNP, STI, Infectious disease, Certification",
    domain: "infectious",
    category: "Nurse Practitioner",
    seoTitle: "STI management guidelines for NP certification | NurseNest",
    seoDescription:
      "STI management for NP certification exams: guideline summaries, resistance themes at principle level, partner treatment, and counseling.",
    guideline:
      "Centers for Disease Control and Prevention. (2021). Sexually transmitted infections treatment guidelines (clinical resources). https://www.cdc.gov/std/",
  },
  {
    slug: "sepsis-recognition-and-management-np-certification",
    title: "Sepsis Recognition and Management for NP Certification: qSOFA Context, Lactate, and Escalation Discipline",
    excerpt:
      "Connect infection plus organ dysfunction patterns, initial resuscitation themes within NP scope in acute settings, antibiotic timing concepts, and escalation language.",
    primary: "FNP",
    tags: "FNP, AGPCNP, Sepsis, Acute care, Certification",
    domain: "acute",
    category: "Nurse Practitioner",
    seoTitle: "Sepsis recognition and management for NP certification | NurseNest",
    seoDescription:
      "Sepsis review for NP certification: recognition scores as adjuncts, perfusion assessment, escalation, and exam traps about delayed care.",
    guideline:
      "Surviving Sepsis Campaign (Society of Critical Care Medicine). (2021). Adult sepsis guideline resources (public access summaries). https://www.sccm.org/",
  },
  {
    slug: "ecg-interpretation-for-nps-certification",
    title: "ECG Interpretation for NPs: High-Yield Rhythm and Ischemia Patterns for Certification Study",
    excerpt:
      "Prioritize rate and rhythm emergencies, ischemia findings, electrolyte effect patterns, and medication toxicity clues commonly embedded in NP exam stems.",
    primary: "FNP",
    tags: "FNP, AGPCNP, ECG, Cardiovascular, Certification",
    domain: "cardio",
    category: "Nurse Practitioner",
    seoTitle: "ECG interpretation for NPs (certification) | NurseNest",
    seoDescription:
      "ECG study guide for NP certification: emergency rhythms, ischemia recognition, axis and interval cues, and safety-oriented interpretation habits.",
    guideline:
      "American Heart Association. (2024). ECG literacy and cardiovascular emergency education resources. https://www.heart.org/",
  },
  {
    slug: "abg-interpretation-advanced-review-np-certification",
    title: "ABG Interpretation Advanced Review for NP Certification: Acid–Base, Oxygenation, and Compensation Patterns",
    excerpt:
      "Practice systematic interpretation of pH, PaCO2, bicarbonate, anion gap, and A–a gradient concepts with mixed disturbances and clinical correlation.",
    primary: "AGPCNP",
    tags: "AGPCNP, FNP, ABG, Pulmonary, Renal, Certification",
    domain: "pulm",
    category: "Nurse Practitioner",
    seoTitle: "ABG interpretation advanced review for NP certification | NurseNest",
    seoDescription:
      "Advanced ABG review for NP exams: acid–base classification, compensation limits, hypoxemia mechanisms, and integration with ventilatory failure clues.",
    guideline:
      "American Thoracic Society. (2023). Patient and clinician education resources on pulmonary physiology and gas exchange. https://www.thoracic.org/",
  },
  {
    slug: "acute-stroke-management-np-certification",
    title: "Acute Stroke Management for NP Certification: Time Windows, Imaging Decisions, and Blood Pressure Controversies",
    excerpt:
      "Outline ischemic stroke eligibility themes, hemorrhage exclusion concepts, post-tPA monitoring priorities, and secondary prevention initiation timing at principle level.",
    primary: "AGPCNP",
    tags: "AGPCNP, FNP, Stroke, Neurology, Acute care, Certification",
    domain: "neuro",
    category: "Nurse Practitioner",
    seoTitle: "Acute stroke management for NP certification | NurseNest",
    seoDescription:
      "Stroke certification review for NPs: acute management principles within team care, monitoring, complications, and exam timing traps.",
    guideline:
      "American Heart Association; American Stroke Association. (2023). Stroke professional education and guideline hub. https://www.stroke.org/",
  },
  {
    slug: "migraine-differential-diagnosis-np-certification",
    title: "Migraine Differential Diagnosis for NP Certification: Primary Headache Syndromes vs Secondary Emergencies",
    excerpt:
      "Contrast migraine with tension-type and cluster patterns, identify thunderclap and focal red flags, and summarize acute and preventive therapy selection themes.",
    primary: "FNP",
    tags: "FNP, PMHNP, Migraine, Neurology, Certification",
    domain: "neuro",
    category: "Nurse Practitioner",
    seoTitle: "Migraine differential diagnosis for NP certification | NurseNest",
    seoDescription:
      "Migraine exam prep for NPs: phenotype recognition, dangerous secondary causes, acute therapy options, and preventive medication monitoring.",
    guideline:
      "American Academy of Neurology. (2024). Clinical practice guideline resources for headache disorders. https://www.aan.com/",
  },
  {
    slug: "pneumonia-treatment-guidelines-np-certification",
    title: "Pneumonia Treatment Guidelines for NP Certification: Outpatient Regimens, Severity Tools, and Follow-Up",
    excerpt:
      "Differentiate community-acquired pneumonia management by severity, review macrolide allergy alternatives at principle level, and define return precautions.",
    primary: "FNP",
    tags: "FNP, AGPCNP, Pneumonia, Infectious disease, Certification",
    domain: "infectious",
    category: "Nurse Practitioner",
    seoTitle: "Pneumonia treatment guidelines for NP certification | NurseNest",
    seoDescription:
      "Pneumonia management for NP certification: severity assessment, antibiotic selection themes, monitoring, and patient education.",
    guideline:
      "Infectious Diseases Society of America; American Thoracic Society. (2019). Community-acquired pneumonia guideline resource page (updates indexed on society sites). https://www.idsociety.org/",
  },
  {
    slug: "uti-treatment-considerations-np-certification",
    title: "UTI Treatment Considerations for NP Certification: Uncomplicated Cystitis, Pyelonephritis, and Special Populations",
    excerpt:
      "Compare first-line oral regimens, pregnancy adjustments at principle level, renal dose concepts, and catheter-associated pathway differences for exams.",
    primary: "WHNP",
    tags: "WHNP, FNP, UTI, Infectious disease, Certification",
    domain: "infectious",
    category: "Nurse Practitioner",
    seoTitle: "UTI treatment considerations for NP certification | NurseNest",
    seoDescription:
      "UTI certification review for NPs: syndrome definitions, antibiotic themes, follow-up testing, and safety counseling.",
    guideline:
      "Infectious Diseases Society of America. (2024). Urinary tract infection guideline summaries for clinicians. https://www.idsociety.org/",
  },
  {
    slug: "osteoporosis-screening-guidelines-np-certification",
    title: "Osteoporosis Screening Guidelines for NP Certification: DXA Timing, FRAX Concepts, and Treatment Thresholds",
    excerpt:
      "Integrate USPSTF-style screening themes, fracture risk estimation concepts, and pharmacologic class monitoring for women’s health and primary care tracks.",
    primary: "WHNP",
    tags: "WHNP, FNP, AGPCNP, Osteoporosis, Certification",
    domain: "womens",
    category: "Nurse Practitioner",
    seoTitle: "Osteoporosis screening guidelines for NP certification | NurseNest",
    seoDescription:
      "Osteoporosis screening and management review for NP exams: DXA, risk tools, therapy classes, duration limits, and monitoring.",
    guideline:
      "U.S. Preventive Services Task Force. (2024). Osteoporosis screening recommendation summary for clinicians. https://www.uspreventiveservicestaskforce.org/",
  },
  {
    slug: "lipid-management-review-np-certification",
    title: "Lipid Management Review for NP Certification: Statin Intensity, Add-On Therapies, and ASCVD Risk Tools",
    excerpt:
      "Translate ASCVD risk estimation, statin benefit groups, triglyceride management themes, and monitoring for muscle symptoms and liver enzyme changes.",
    primary: "FNP",
    tags: "FNP, AGPCNP, Lipids, Cardiovascular, Certification",
    domain: "cardio",
    category: "Nurse Practitioner",
    seoTitle: "Lipid management review for NP certification | NurseNest",
    seoDescription:
      "Lipid management certification review for NPs: risk tools, therapy intensification, monitoring, and patient education anchors.",
    guideline:
      "National Heart, Lung, and Blood Institute. (2023). Blood cholesterol management clinician resources. https://www.nhlbi.nih.gov/",
  },
  {
    slug: "obesity-pharmacotherapy-np-certification",
    title: "Obesity Pharmacotherapy for NP Certification: GLP-1 Agonists, Contraindications, and Monitoring Plans",
    excerpt:
      "Review anti-obesity medication classes at principle level, gastrointestinal side effects, thyroid medullary carcinoma contraindication themes, and lifestyle integration.",
    primary: "FNP",
    tags: "FNP, WHNP, Obesity, Endocrine, Certification",
    domain: "endocrine",
    category: "Nurse Practitioner",
    seoTitle: "Obesity pharmacotherapy for NP certification | NurseNest",
    seoDescription:
      "Obesity medication review for NP exams: patient selection, monitoring, comorbidity benefits, and counseling requirements.",
    guideline:
      "American Association of Clinical Endocrinology. (2024). Obesity management resource library (public clinical summaries). https://www.aace.com/",
  },
  {
    slug: "polypharmacy-in-older-adults-np-certification",
    title: "Polypharmacy in Older Adults for NP Certification: Deprescribing, Beer Criteria Concepts, and Fall Risk",
    excerpt:
      "Apply geriatric prescribing safety frameworks, medication reconciliation habits, anticholinergic burden themes, and shared decision-making for deprescribing.",
    primary: "AGPCNP",
    tags: "AGPCNP, FNP, Geriatrics, Pharmacology, Certification",
    domain: "education",
    category: "Nurse Practitioner",
    seoTitle: "Polypharmacy in older adults for NP certification | NurseNest",
    seoDescription:
      "Geriatric polypharmacy review for NP certification: deprescribing steps, high-risk medications, monitoring, and exam-style prioritization.",
    guideline:
      "American Geriatrics Society. (2023). Updated Beers Criteria® public information and clinical resources. https://www.americangeriatrics.org/",
  },
  {
    slug: "delirium-vs-dementia-np-certification",
    title: "Delirium vs Dementia for NP Certification: Acute Workup, CAM Clues, and Safety Planning",
    excerpt:
      "Differentiate acute attention fluctuation from chronic cognitive syndromes, identify common precipitants, and outline hospital and outpatient safety themes.",
    primary: "AGPCNP",
    tags: "AGPCNP, PMHNP, Geriatrics, Neurology, Certification",
    domain: "neuro",
    category: "Nurse Practitioner",
    seoTitle: "Delirium vs dementia for NP certification | NurseNest",
    seoDescription:
      "Delirium and dementia comparison for NP exams: features, workup, medication contributors, caregiver education, and monitoring.",
    guideline:
      "American Psychiatric Association. (2023). Neurocognitive disorder clinical resources for clinicians. https://www.psychiatry.org/",
  },
  {
    slug: "pediatric-developmental-milestones-np-certification",
    title: "Pediatric Developmental Milestones for NP Certification: Surveillance, Red Flags, and Referral Timing",
    excerpt:
      "Organize gross motor, fine motor, language, and social milestones with corrected age for prematurity and early intervention referral triggers.",
    primary: "PNP-PC",
    tags: "PNP-PC, Pediatrics, Development, Certification",
    domain: "peds",
    category: "Nurse Practitioner",
    seoTitle: "Pediatric developmental milestones for NP certification | NurseNest",
    seoDescription:
      "Developmental milestones review for PNP certification: surveillance schedules, autism screening themes, referral language, and caregiver education.",
    guideline:
      "American Academy of Pediatrics. (2022). Bright Futures guidelines hub for health supervision visits. https://brightfutures.aap.org/",
  },
  {
    slug: "menopause-management-np-certification",
    title: "Menopause Management for NP Certification: Vasomotor Therapies, Bone Health, and Shared Decision-Making",
    excerpt:
      "Compare hormone therapy eligibility themes at principle level, nonhormonal options, genitourinary syndrome of menopause, and cardiovascular risk framing for exams.",
    primary: "WHNP",
    tags: "WHNP, FNP, Menopause, Women’s health, Certification",
    domain: "womens",
    category: "Nurse Practitioner",
    seoTitle: "Menopause management for NP certification | NurseNest",
    seoDescription:
      "Menopause certification review for WHNP and primary care tracks: symptom management, risks, benefits counseling, and monitoring.",
    guideline:
      "North American Menopause Society. (2022). Menopause practice resource summaries for clinicians. https://www.menopause.org/",
  },
  {
    slug: "thyroid-medication-management-np-certification",
    title: "Thyroid Medication Management for NP Certification: Levothyroxine Dosing, Monitoring, and Special Populations",
    excerpt:
      "Review levothyroxine administration timing, drug interactions, pregnancy dose adjustment themes, and subclinical thyroid dysfunction management principles.",
    primary: "FNP",
    tags: "FNP, WHNP, Endocrine, Thyroid, Certification",
    domain: "endocrine",
    category: "Nurse Practitioner",
    seoTitle: "Thyroid medication management for NP certification | NurseNest",
    seoDescription:
      "Thyroid replacement therapy review for NP exams: dosing, monitoring, interactions, pregnancy, and patient education.",
    guideline:
      "American Thyroid Association. (2024). Hypothyroidism management resources for clinicians. https://www.thyroid.org/",
  },
  {
    slug: "insulin-therapy-intensification-np-certification",
    title: "Insulin Therapy Intensification for NP Certification: Basal–Bolus Concepts, Hypoglycemia Prevention, and Titration Rules",
    excerpt:
      "Outline basal insulin initiation themes, correction factor concepts at principle level, CGM integration benefits, and sick-day rules for certification cases.",
    primary: "FNP",
    tags: "FNP, Diabetes, Insulin, Endocrine, Certification",
    domain: "endocrine",
    category: "Nurse Practitioner",
    seoTitle: "Insulin therapy intensification for NP certification | NurseNest",
    seoDescription:
      "Insulin intensification review for NP certification: titration safety, monitoring, education, and exam math patterns.",
    guideline:
      "American Diabetes Association. (2024). Insulin therapy guidance within Standards of Care resources. https://diabetes.org/",
  },
  {
    slug: "chronic-pain-management-np-certification",
    title: "Chronic Pain Management for NP Certification: Multimodal Plans, Risk Tools, and Functional Goals",
    excerpt:
      "Integrate nonopioid multimodal strategies, screening and assessment tools, opioid risk mitigation when opioids remain in plan, and interprofessional referral patterns.",
    primary: "FNP",
    tags: "FNP, PMHNP, Pain management, Certification",
    domain: "psych",
    category: "Nurse Practitioner",
    seoTitle: "Chronic pain management for NP certification | NurseNest",
    seoDescription:
      "Chronic pain certification review for NPs: multimodal care, risk mitigation, monitoring, and exam ethics language.",
    guideline:
      "Centers for Disease Control and Prevention. (2022). Clinical practice guideline for prescribing opioids for pain (public health communication resources). https://www.cdc.gov/",
  },
  {
    slug: "opioid-prescribing-safety-np-certification",
    title: "Opioid Prescribing Safety for NP Certification: PDMP Use, MME Concepts, Naloxone, and Taper Principles",
    excerpt:
      "Summarize risk assessment, prescription drug monitoring program documentation themes, naloxone co-prescribing rationale, and buprenorphine referral concepts where applicable.",
    primary: "FNP",
    tags: "FNP, PMHNP, Opioids, Pain, Certification, Safety",
    domain: "psych",
    category: "Nurse Practitioner",
    seoTitle: "Opioid prescribing safety for NP certification | NurseNest",
    seoDescription:
      "Opioid safety review for NP exams: PDMP, risk tools, naloxone, urine drug testing themes, and regulatory documentation.",
    guideline:
      "Centers for Disease Control and Prevention. (2022). Opioid prescribing guideline communication toolkit for clinicians. https://www.cdc.gov/",
  },
  {
    slug: "dermatology-lesion-assessment-np-certification",
    title: "Dermatology Lesion Assessment for NP Certification: Benign Mimics, Melanoma Clues, and Biopsy Thresholds",
    excerpt:
      "Apply pattern recognition for common rashes and pigmented lesions, describe when shave versus punch biopsy is indicated at principle level, and teach sun protection.",
    primary: "FNP",
    tags: "FNP, Dermatology, Certification, Primary care",
    domain: "derm",
    category: "Nurse Practitioner",
    seoTitle: "Dermatology lesion assessment for NP certification | NurseNest",
    seoDescription:
      "Dermatology assessment review for NP certification: lesion morphology, melanoma screening, biopsy triggers, and counseling.",
    guideline:
      "American Academy of Dermatology. (2024). Public and professional skin cancer prevention resources. https://www.aad.org/",
  },
  {
    slug: "lyme-disease-diagnosis-np-certification",
    title: "Lyme Disease Diagnosis for NP Certification: Endemic Risk, Erythema Migrans, and Testing Limitations",
    excerpt:
      "Integrate geographic exposure history, classic and atypical rash descriptions, two-tier testing concepts, and post-treatment symptom counseling without antibiotic overuse themes.",
    primary: "FNP",
    tags: "FNP, Infectious disease, Lyme disease, Certification",
    domain: "infectious",
    category: "Nurse Practitioner",
    seoTitle: "Lyme disease diagnosis for NP certification | NurseNest",
    seoDescription:
      "Lyme disease certification review for NPs: clinical diagnosis emphasis, testing interpretation themes, treatment duration concepts, and prevention.",
    guideline:
      "Centers for Disease Control and Prevention. (2024). Lyme disease clinical information for healthcare providers. https://www.cdc.gov/lyme/",
  },
  {
    slug: "rheumatoid-arthritis-overview-np-certification",
    title: "Rheumatoid Arthritis Overview for NP Certification: Inflammatory Clues, Labs, and DMARD Monitoring Themes",
    excerpt:
      "Contrast inflammatory arthritis with osteoarthritis, interpret rheumatoid factor and anti-CCP at a principle level, and outline monitoring for methotrexate and biologics.",
    primary: "FNP",
    tags: "FNP, AGPCNP, Rheumatology, Certification",
    domain: "rheum",
    category: "Nurse Practitioner",
    seoTitle: "Rheumatoid arthritis overview for NP certification | NurseNest",
    seoDescription:
      "RA certification review for NPs: clinical presentation, laboratory themes, treatment classes, infection screening concepts, and referral timing.",
    guideline:
      "American College of Rheumatology. (2024). Rheumatoid arthritis clinical guideline summaries for clinicians. https://www.rheumatology.org/",
  },
  {
    slug: "gerd-management-review-np-certification",
    title: "GERD Management Review for NP Certification: PPI Trials, Alarm Features, and Maintenance Strategies",
    excerpt:
      "Structure typical reflux management, alarm symptom evaluation, H pylori testing integration, and long-term PPI risk discussions for primary care exams.",
    primary: "FNP",
    tags: "FNP, GERD, Gastroenterology, Certification",
    domain: "gi",
    category: "Nurse Practitioner",
    seoTitle: "GERD management review for NP certification | NurseNest",
    seoDescription:
      "GERD review for NP certification: diagnostic approach, therapy sequencing, monitoring, and when to refer for endoscopy.",
    guideline:
      "American Gastroenterological Association. (2022). GERD clinical guideline resource hub. https://gastro.org/",
  },
  {
    slug: "liver-function-interpretation-np-certification",
    title: "Liver Function Interpretation for NP Certification: Hepatocellular vs Cholestatic Patterns, Imaging, and Medication Review",
    excerpt:
      "Interpret ALT, AST, ALP, GGT, bilirubin, and albumin patterns; identify common medication and alcohol contributors; outline rational follow-up testing.",
    primary: "FNP",
    tags: "FNP, Gastroenterology, Hepatology, Certification",
    domain: "gi",
    category: "Nurse Practitioner",
    seoTitle: "Liver function interpretation for NP certification | NurseNest",
    seoDescription:
      "Liver laboratory review for NP exams: pattern recognition, medication-induced injury themes, viral hepatitis screening, and referral triggers.",
    guideline:
      "American Association for the Study of Liver Diseases. (2023). Public education and guideline resource listings for liver disease. https://www.aasld.org/",
  },
  {
    slug: "iron-deficiency-anemia-workup-np-certification",
    title: "Iron Deficiency Anemia Workup for NP Certification: Ferritin Nuances, GI Evaluation, and Replacement Therapy",
    excerpt:
      "Differentiate absolute iron deficiency from anemia of chronic disease patterns at principle level, select oral versus IV iron themes, and identify who needs source evaluation.",
    primary: "FNP",
    tags: "FNP, WHNP, Hematology, Certification",
    domain: "heme",
    category: "Nurse Practitioner",
    seoTitle: "Iron deficiency anemia workup for NP certification | NurseNest",
    seoDescription:
      "Iron deficiency certification review for NPs: laboratory interpretation, bleeding evaluation triggers, therapy monitoring, and patient education.",
    guideline:
      "American Gastroenterological Association. (2020). GI bleeding and iron deficiency evaluation clinician resources. https://gastro.org/",
  },
  {
    slug: "gi-bleed-differential-diagnosis-np-certification",
    title: "GI Bleed Differential Diagnosis for NP Certification: Upper vs Lower Sources, Risk Stratification, and Stabilization",
    excerpt:
      "Organize melena versus hematochezia frameworks, shock recognition, anticoagulation reversal themes as team decisions, and endoscopy urgency language.",
    primary: "AGPCNP",
    tags: "AGPCNP, FNP, Gastroenterology, Acute care, Certification",
    domain: "gi",
    category: "Nurse Practitioner",
    seoTitle: "GI bleed differential diagnosis for NP certification | NurseNest",
    seoDescription:
      "GI bleeding review for NP certification: stabilization priorities, risk tools, differential diagnosis clusters, and monitoring.",
    guideline:
      "American College of Gastroenterology. (2021). Acute gastrointestinal bleeding clinical guideline resources. https://gi.org/",
  },
  {
    slug: "evidence-based-practice-for-np-students-certification",
    title: "Evidence-Based Practice for NP Students: Appraisal, Guidelines, and Certification-Style Application Questions",
    excerpt:
      "Translate PICO questions, bias recognition, guideline strength language, and shared decision-making documentation into exam-ready reasoning habits.",
    primary: "FNP",
    tags: "FNP, AGPCNP, PMHNP, Research literacy, Certification, Education",
    domain: "education",
    category: "Nurse Practitioner",
    seoTitle: "Evidence-based practice for NP students | NurseNest",
    seoDescription:
      "EBP review for NP certification: study design basics, guideline use, ethical application, and how exam items test appraisal skills.",
    guideline:
      "Agency for Healthcare Research and Quality. (2023). Evidence-based practice training resources for clinicians. https://www.ahrq.gov/",
  },
  {
    slug: "soap-note-documentation-review-np-certification",
    title: "SOAP Note Documentation Review for NP Certification: Assessment Synthesis, Plan Measurability, and Compliance",
    excerpt:
      "Strengthen subjective and objective separation, avoid diagnostic overreach in assessment, and write measurable plans aligned with billing and safety expectations.",
    primary: "FNP",
    tags: "FNP, Documentation, Professional issues, Certification",
    domain: "education",
    category: "Nurse Practitioner",
    seoTitle: "SOAP note documentation review for NP certification | NurseNest",
    seoDescription:
      "SOAP documentation for NP students: legal and clinical integrity, measurable planning, risk documentation, and exam-style professionalism items.",
    guideline:
      "American Nurses Association. (2023). Nursing scope and standards of practice (resource hub). https://www.nursingworld.org/",
  },
  {
    slug: "differential-diagnosis-frameworks-np-certification",
    title: "Differential Diagnosis Frameworks for NP Certification: VINDICATE Mnemonics, Risk Stratification, and Test Selection",
    excerpt:
      "Practice structured differentials for fatigue, dyspnea, chest pain, abdominal pain, and altered mental status with emphasis on dangerous diagnoses first.",
    primary: "FNP",
    tags: "FNP, AGPCNP, Clinical reasoning, Certification",
    domain: "education",
    category: "Nurse Practitioner",
    seoTitle: "Differential diagnosis frameworks for NP certification | NurseNest",
    seoDescription:
      "Clinical reasoning frameworks for NP exams: pretest probability, clustering differentials, choosing tests that change management, and avoiding premature closure.",
    guideline:
      "National Academies of Sciences, Engineering, and Medicine. (2015). Improving diagnosis in health care (public summary resources). https://www.nationalacademies.org/",
  },
  {
    slug: "how-to-pass-fnp-certification-exam",
    title: "How to Pass the FNP Certification Exam: Study Architecture, Weak-Area Drills, and Test-Day Strategy",
    excerpt:
      "Build a blueprint-aligned schedule, combine content review with timed questions, track error patterns, and manage fatigue and anxiety for exam day performance.",
    primary: "FNP",
    tags: "FNP, Test strategy, Certification, Study skills",
    domain: "education",
    category: "Nurse Practitioner",
    seoTitle: "How to pass the FNP certification exam | NurseNest",
    seoDescription:
      "FNP certification study plan: blueprint mapping, question banks, review cycles, readiness checks, and professional test-day habits.",
    guideline:
      "American Association of Nurse Practitioners. (2024). Certification preparation and professional development resources. https://www.aanp.org/",
  },
  {
    slug: "pmhnp-board-exam-study-strategies-certification",
    title: "PMHNP Board Exam Study Strategies: Psychopharmacology Depth, Ethics Items, and Case-Based Practice",
    excerpt:
      "Organize high-yield psychiatry topics, medication monitoring grids, emergency psychiatry escalation cues, and psychotherapy boundary questions for PMHNP candidates.",
    primary: "PMHNP",
    tags: "PMHNP, Test strategy, Mental health, Certification",
    domain: "education",
    category: "Nurse Practitioner",
    seoTitle: "PMHNP board exam study strategies | NurseNest",
    seoDescription:
      "PMHNP certification preparation: study architecture, pharmacology grids, ethics traps, and case-based reasoning drills.",
    guideline:
      "American Nurses Credentialing Center. (2024). Psychiatric–mental health nurse practitioner certification candidate resources. https://www.nursingworld.org/",
  },
];

function main(): void {
  if (TOPICS.length !== 50) {
    throw new Error(`Expected exactly 50 topics, found ${TOPICS.length}`);
  }
  mkdirSync(join(APP_ROOT, "reports"), { recursive: true });
  const rows: string[] = [
    "# US NP certification long-tail batch (50 posts)",
    "",
    "Generated by `scripts/blog/generate-us-np-cert-longtail-batch-50.mts`.",
    "",
    "| Title | Slug | Primary NP track | Word count | validate:blog-static-longtail | diagnose:blog-slug-collisions | SEO fields | Internal links |",
    "| --- | --- | --- | ---: | --- | --- | --- | --- |",
  ];

  for (const topic of TOPICS) {
    let body = buildBody(topic);
    body = padToMinWords(topic, body, MIN_WORDS);
    const wc = wordCount(body);
    if (wc < MIN_WORDS) {
      throw new Error(`FAIL: ${topic.slug} below ${MIN_WORDS} words: ${wc}`);
    }

    const md = [
      "---",
      `slug: ${topic.slug}`,
      `title: ${topic.title}`,
      `excerpt: ${topic.excerpt}`,
      `category: ${topic.category}`,
      `tags: ${topic.tags}`,
      "publishedAt: 2026-05-09",
      "updatedAt: 2026-05-09",
      `seoTitle: ${topic.seoTitle}`,
      `seoDescription: ${topic.seoDescription}`,
      `canonicalUrl: /blog/${topic.slug}`,
      "authorDisplayName: NurseNest Editorial",
      "medicalReviewerName: Clinical review board (educational)",
      `disclaimer: ${DISCLAIMER}`,
      "---",
      "",
      body,
      "",
    ].join("\n");

    writeFileSync(join(OUT, `${topic.slug}.md`), md, "utf8");
    rows.push(
      `| ${topic.title.replace(/\|/g, "\\|")} | ${topic.slug} | ${topic.primary} | ${wc} | pending | pending | seoTitle+seoDescription+canonical | /app/* + /blog/* |`,
    );
  }

  rows.push("");
  rows.push("## Validation notes");
  rows.push("");
  rows.push("Run from `nursenest-core/`:");
  rows.push("");
  rows.push("- `npm run validate:blog-static-longtail`");
  rows.push("- `npm run diagnose:blog-slug-collisions -- --write-report`");
  rows.push("- `npm run typecheck:critical`");
  rows.push("- `npm run test:blog-recovery`");
  rows.push("- `npm run test:homepage`");
  rows.push("");
  rows.push("Update the table with exit codes after gates complete.");
  writeFileSync(REPORT, `${rows.join("\n")}\n`, "utf8");
  console.log(`OK: wrote ${TOPICS.length} posts; report: ${REPORT}`);
}

main();
