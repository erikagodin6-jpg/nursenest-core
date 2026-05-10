#!/usr/bin/env npx tsx
/** Generates 50 EMS long-tail posts. Run: cd nursenest-core && npx tsx scripts/blog/generate-ems-longtail-batch.mts */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../../src/content/blog-static-longtail");
const DATA = join(__dirname, "ems-longtail-topics.json");

type Topic = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  focus: string;
  scenario: string;
  examAngle: string;
};

const FM = {
  authorDisplayName: "NurseNest Editorial",
  medicalReviewerName: "Clinical review board (educational)",
  disclaimer:
    "This article supports EMS and paramedic exam preparation and clinical reasoning practice. It is not individualized medical advice, a substitute for your agency protocols, or authorization to perform procedures outside scope. Always follow local medical direction, policies, and standing orders in real patient care.",
  publishedAt: "2026-05-09",
  updatedAt: "2026-05-09",
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h | 0;
}

function p(...parts: string[]): string {
  return "<p>" + parts.join(" ") + "</p>";
}

function h2(t: string): string {
  return "<h2>" + t + "</h2>";
}

function h3(t: string): string {
  return "<h3>" + t + "</h3>";
}

function ul(items: string[]): string {
  return "<ul>" + items.map((i) => "<li>" + i + "</li>").join("") + "</ul>";
}

function wordCount(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text ? text.split(/\s+/).length : 0;
}

const POOL: Record<string, string[]> = {
  scene: [
    "Scene safety preserves the team so treatment can continue. Identify traffic, violence, confined space, hazmat, and electrical hazards before committing resources. If unsafe, stage and reassess access plans rather than improvising in a hot zone.",
    "Establish command early on complex scenes. Communicate staging, assign roles, and keep radio discipline so patient updates are not lost. For roadway scenes, use blocking positioning and limit unnecessary foot traffic in travel lanes.",
    "Dynamic violence risk means maintaining exit routes, requesting law enforcement early, and using tactical patient contact principles taught in your course. Do not let curiosity pull you into an uncontrolled approach.",
  ],
  assess: [
    "Assessment priorities follow life threats first, then the finding that explains the most data with the fewest assumptions. Obtain a focused vital set, repeat after interventions, and document trends with timestamps.",
    "Trends beat snapshots. A normal blood pressure can still be shock for that patient. Pair skin, capillary refill, mental status, and work of breathing with numbers.",
    "Exam stems reward objective instability: airway protection failure, respiratory fatigue, shock, evolving stroke deficits, or uncontrolled bleeding.",
  ],
  abc: [
    "Airway, breathing, and circulation are sequential only when you are alone; with a team, parallelize safely. Airway patency and protection come first when mental status is depressed or vomiting risk is high.",
    "Breathing support includes rate, rhythm, depth, accessory muscles, lung sounds, and oxygenation targets per protocol. Circulation includes hemorrhage control when external bleeding is present and perfusion assessment.",
    "When interventions compete, pick the step that restores oxygen delivery fastest without predictable harm, then reassess.",
  ],
  diff: [
    "Maintain a differential to avoid anchoring. Chest pain spans ACS, PE, aortic catastrophe, pneumothorax, and benign mimics. Stroke symptoms can be hypoglycemia, seizure, migraine, or conversion patterns until proven otherwise.",
    "Pediatric distress can be airway, parenchymal, or circulatory failure with wheeze-like sounds. Geriatric patients may present quietly with sepsis or shock.",
    "Toxicologic mimics matter: carbon monoxide can look like viral illness; calcium channel blocker overdose can look like cardiogenic shock with bradycardia.",
  ],
  rx: [
    "Medication actions must match scope and protocol. Verify allergies, concentration, route, indication, and monitoring after administration.",
    "Time-critical drugs reward early correct therapy: epinephrine for anaphylaxis, naloxone for opioid respiratory depression when indicated, adenosine for stable regular narrow complex SVT per protocol, and defibrillation for shockable arrest rhythms.",
    "Sedation and analgesia change exams and vitals; document pre- and post-intervention neurologic status when neuro drives triage.",
  ],
  transport: [
    "Transport decisions weigh time to definitive care, patient trajectory, specialty resources, and weather or traffic constraints. Upgrade early when deterioration is likely.",
    "Refusal documentation requires capacity assessment, risks in plain language, and alternatives offered. Exams reward completeness and patient safety.",
    "Handoff should include mechanism, interventions, response, monitoring lines, and explicit stability statement.",
  ],
  doc: [
    "Document mechanism, baseline mental status, serial vitals, ECG impressions within scope, med doses and response, and transport justification.",
    "When protocols branch, document criteria used: stroke screen times, sepsis alert triggers, trauma triage category, or STEMI activation elements.",
    "If complications occur, document rationale, medical direction contact if applicable, and patient response.",
  ],
  exam: [
    "Choose answers that stabilize fastest with least avoidable harm and clearest protocol alignment. Avoid sophisticated distractors that delay time-critical therapy.",
    "Use the stem timeline: sudden focal deficit suggests stroke systems; fever and hypoperfusion suggest sepsis; pleuritic hypoxia keeps PE in mind while you oxygenate.",
    "Reassessment after every major intervention is a recurring correct theme.",
  ],
};

const INTERNAL: { href: string; label: string }[] = [
  { href: "/blog/sepsis-pathophysiology-early-nursing-recognition", label: "Sepsis pathophysiology and early nursing recognition" },
  { href: "/blog/stroke-ischemic-vs-hemorrhagic-nursing-care", label: "Stroke: ischemic vs hemorrhagic nursing care" },
  { href: "/blog/pulmonary-embolism-signs-symptoms-nursing-priorities", label: "Pulmonary embolism signs, symptoms, and nursing priorities" },
  { href: "/blog/respiratory-acidosis-vs-respiratory-alkalosis", label: "Respiratory acidosis vs respiratory alkalosis" },
  { href: "/blog/metabolic-acidosis-vs-metabolic-alkalosis", label: "Metabolic acidosis vs metabolic alkalosis" },
  { href: "/blog/dka-vs-hhs-nursing-priorities", label: "DKA vs HHS nursing priorities" },
  { href: "/blog/hyperkalemia-ecg-changes-nursing-students", label: "Hyperkalemia ECG changes for nursing students" },
  { href: "/blog/hypokalemia-pathophysiology-nursing-priorities", label: "Hypokalemia pathophysiology and nursing priorities" },
  { href: "/app/dashboard", label: "Learner dashboard — continue adaptive practice after reading" },
];

function pick(pool: string[], key: string): string {
  return pool[Math.abs(hash(key)) % pool.length]!;
}

function apaRefs(slug: string): string[] {
  const sets = [
    [
      "American Heart Association. (2020). 2020 American Heart Association guidelines for cardiopulmonary resuscitation and emergency cardiovascular care. Circulation, 142(16_suppl_2), S337-S357. https://doi.org/10.1161/CIR.0000000000000916",
      "National Association of EMS Physicians and American College of Surgeons Committee on Trauma. (2023). EMS spinal precautions and the use of the long backboard: Resource document to the position statement. Prehospital Emergency Care, 27(4), 444-453. https://doi.org/10.1080/10903127.2023.2194819",
      "Centers for Disease Control and Prevention. (2024). Stroke facts. https://www.cdc.gov/stroke/facts.htm",
    ],
    [
      "National Highway Traffic Safety Administration. (2022). National EMS scope of practice model. https://www.ems.gov/pdf/National_EMS_Scope_of_Practice_Model_2022.pdf",
      "World Health Organization. (2022). Emergency care systems: Integrated approach improves outcomes. https://www.who.int/news-room/feature-stories/detail/emergency-care-systems--integrated-approach-improves-outcomes",
      "American College of Emergency Physicians. (2019). Clinical policies (resource center). https://www.acep.org/clinical-policies/",
    ],
    [
      "Singer, M., Deutschman, C. S., Seymour, C. W., et al. (2016). The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3). JAMA, 315(8), 801-810. https://doi.org/10.1001/jama.2016.0287",
      "Evans, L., Rhodes, A., Alhazzani, W., et al. (2021). Surviving Sepsis Campaign: International guidelines for management of sepsis and septic shock 2021. Intensive Care Medicine, 47, 1181-1247. https://doi.org/10.1007/s00134-021-06506-y",
      "Centers for Disease Control and Prevention. (2023). Sepsis basics. https://www.cdc.gov/sepsis/basics/index.html",
    ],
  ];
  return sets[Math.abs(hash(slug)) % sets.length]!;
}

function buildBody(t: Topic): string {
  const intro =
    p(
      t.scenario,
      "The sections below support paramedic students, AEMT candidates, and EMS clinicians preparing for registry-style reasoning. They emphasize scene safety, assessment discipline, protocol-aligned interventions, and documentation.",
      "Clinical focus: " + t.focus + ".",
    ) +
    p(
      "Translate each scenario into a field problem: airway protection, ventilation adequacy, oxygen delivery, perfusion, hemorrhage control, neurologic time windows, and toxicologic triggers. Prehospital care is interrupt-driven; document decisions at each step.",
    ) +
    h2("Clinical overview for EMS exams") +
    p(
      "Registry and course exams reward a disciplined primary survey loop: look, listen, and feel for threats while your partner prepares airway equipment, establishes monitoring, and gathers a targeted history from bystanders. When information conflicts, trust objective trends and repeat assessments after each intervention rather than anchoring on the first set of vitals taken during chaos.",
    ) +
    p(
      "Medical oversight and destination decisions depend on what you communicate. Practice concise radio reports that include age, mechanism or chief complaint, critical interventions, response to therapy, and current stability. If you are unsure, say what you ruled out, what remains likely, and what resources you need next.",
    ) +
    p(
      "Finally, connect every topic to operational safety: fatigue, crew resource management, and infection control are not afterthoughts. A tired crew mis-doses; a rushed report loses the sepsis time window; a skipped scene size-up creates a second patient. Exam writers often embed these human factors as the least obvious but most ethical answer choice.",
    ) +
    p(
      "Assign explicit roles early when staffing allows: airway, ventilation, monitoring, access, scribe, and driver. Closed-loop communication reduces error when dosing or repeating vitals. If you are the lead medic, state what you want measured next and when you want it reported, especially during advanced airway preparation, post-ROSC titration, or obstetric emergencies where tasks stack faster than one provider can track.",
    ) +
    p(
      "If a hospital asks for additional information en route, answer with a concise high-yield data set: stability versus instability, working diagnosis with uncertainty, interventions given with times, allergies, and anticipated needs on arrival. Avoid long pathophysiology lectures on the radio; save teaching for debrief and documentation.",
    );

  const key =
    h2("Key Takeaways") +
    ul([
      t.title + ": study as scene safe, then primary survey, then protocol branch, then reassess, then transport decision.",
      "Stability is shown by trends after intervention, not a single reassuring number.",
      "Medication and procedures must match agency scope, standing orders, and medical direction expectations.",
      "Documentation should make reasoning auditable for QA and for exam prompts that ask what to chart.",
    ]);

  const sec = (title: string, extra: string, poolKey: keyof typeof POOL, poolKey2: string) =>
    h2(title) + p(pick(POOL[poolKey], t.slug + poolKey2)) + p(extra);

  const mid =
    sec(
      "Scene safety",
      "Add hazard specifics for this case: traffic, fire, chemicals, electricity, confined space, or interpersonal violence. If mitigation delays access, communicate timelines and reassess patient viability.",
      "scene",
      "s",
    ) +
    sec(
      "Assessment priorities",
      "Pair chief complaint with vitals and monitoring. For respiratory failure risk, include work of breathing, lung sounds, and waveform capnography when available. For shock, assess skin, pulses, mental status, and bleeding concurrently.",
      "assess",
      "a",
    ) +
    sec(
      "ABCs",
      "If airway or ventilation fails, use positioning, suction, adjuncts, and BVM per training until advanced airway is indicated. For circulation threats, treat mechanism first: hemorrhage control, rhythm management, and perfusion support per protocol.",
      "abc",
      "b",
    ) +
    sec(
      "Differential considerations",
      "Use the fastest bedside checks that change management in scope: glucose, ECG, SpO2 with clinical correlation, pregnancy when relevant, and targeted history for exposure or trauma mechanism.",
      "diff",
      "d",
    ) +
    h2("Prehospital interventions") +
    p(
      "Order interventions by benefit and protocol: life threats first, then targeted therapy, then supportive care and packaging. After each step, reassess vitals, breathing work, perfusion, pain, and neurologic status.",
      "Notify receiving facilities early when activation criteria are met so teams prepare. For time-sensitive pathways, document last known well, onset, treatment times, and response.",
    ) +
    p(
      "When packaging for transport, protect lines and monitors, secure airway devices against dislodgement, and anticipate predictable deterioration during movement. Elevate the head of the stretcher when intracranial or respiratory pathology is suspected unless contraindicated. Keep suction and airway adjuncts immediately available whenever sedation, opioids, or seizures are part of the clinical picture.",
    ) +
    p(
      "If a protocol offers optional branches, document the decision criteria you used. Quality improvement teams and exam keys both favor explicit reasoning: why you chose CPAP before nitrates, why you withheld fluids, why you upgraded to lights-and-siren transport, or why you requested a rendezvous ALS intercept.",
    ) +
    sec(
      "Medication considerations",
      "Verify concentration, route, indication, contraindications in protocol, and monitoring after administration. Communicate allergies and prior reactions.",
      "rx",
      "r",
    ) +
    sec(
      "Transport and escalation decisions",
      "Match destination and priority to trajectory and specialty needs. Medical direction can help when protocol branches are unclear, but exams expect activation without hesitation when instability criteria are met.",
      "transport",
      "t",
    ) +
    sec(
      "Documentation pearls",
      "Include pertinent negatives that change risk, such as lack of stroke risk factors when mimics are possible, or atypical trauma presentation when internal injury remains a concern.",
      "doc",
      "o",
    ) +
    h2("Exam tips") +
    p(pick(POOL.exam, t.slug + "e")) +
    p(t.examAngle) +
    p(
      "When a question pairs two correct-sounding actions, choose the one that addresses the life threat first, uses the least invasive effective step, and matches documentation and scope expectations. When the stem includes a time anchor, align your answer with time-sensitive systems: STEMI, stroke, sepsis, trauma, and obstetric emergencies all have different clocks, but all punish unnecessary delay.",
    );

  const faq =
    h2("FAQ Schema Questions") +
    h3("What is the first field priority for this topic?") +
    p(
      "Scene safety and immediate life threats. Stabilize airway, breathing, and circulation in parallel when staffing allows; otherwise follow the sequence your training emphasizes while requesting additional resources.",
    ) +
    h3("How do I avoid an answer that is textbook-correct but unsafe in EMS?") +
    p(
      "Match scope, protocol, and reassessment. Avoid independent dose changes, delayed time-critical therapy, or procedures beyond capability without rendezvous or transport.",
    ) +
    h3("When should I contact medical direction?") +
    p(
      "When protocol criteria are unclear, the patient does not fit a branch, comorbidities create risk, or you need documentation support for an unusual decision.",
    ) +
    h3("Is this a protocol replacement?") +
    p("No. Educational preparation only. Real care follows agency protocols and medical direction.");

  const links =
    h2("Suggested Internal Links") +
    ul(
      INTERNAL.map(({ href, label }) => {
        return '<a href="' + href + '">' + label + "</a>";
      }),
    );

  const cta =
    h2("Premium Lesson CTA") +
    p(
      "Pair this EMS review with NurseNest premium lessons and adaptive questions on emergency pathophysiology, pharmacology, airway management, and exam-style prioritization. The goal is faster pattern recognition under time pressure.",
    );

  const apa =
    h2("APA-7 References") +
    apaRefs(t.slug)
      .map((r) => "<p>" + r + "</p>")
      .join("") +
    p(
      "Follow your program and agency citation requirements; links support educational traceability and do not replace local clinical policy or medical direction.",
    );

  return intro + key + mid + faq + links + cta + apa;
}

function seoTitle(title: string): string {
  const base = title + " | EMS exam prep";
  return base.length > 72 ? title.slice(0, 58) + "… | EMS" : base;
}

function seoDesc(excerpt: string): string {
  const pad = excerpt + " Scenario-focused EMS review for paramedic students.";
  return pad.length > 158 ? pad.slice(0, 155) + "…" : pad;
}

function md(t: Topic, body: string): string {
  const q = JSON.stringify;
  return (
    "---\n" +
    "slug: " +
    t.slug +
    "\n" +
    "title: " +
    q(t.title) +
    "\n" +
    "excerpt: " +
    q(t.excerpt) +
    "\n" +
    "category: " +
    q(t.category) +
    "\n" +
    "tags: " +
    JSON.stringify(t.tags) +
    "\n" +
    "publishedAt: " +
    FM.publishedAt +
    "\n" +
    "updatedAt: " +
    FM.updatedAt +
    "\n" +
    "seoTitle: " +
    q(seoTitle(t.title)) +
    "\n" +
    "seoDescription: " +
    q(seoDesc(t.excerpt)) +
    "\n" +
    "canonicalUrl: /blog/" +
    t.slug +
    "\n" +
    "authorDisplayName: " +
    q(FM.authorDisplayName) +
    "\n" +
    "medicalReviewerName: " +
    q(FM.medicalReviewerName) +
    "\n" +
    "disclaimer: " +
    q(FM.disclaimer) +
    "\n" +
    "---\n\n" +
    body
  );
}

function main(): void {
  const topics = JSON.parse(readFileSync(DATA, "utf8")) as Topic[];
  if (topics.length !== 50) throw new Error("Expected 50 topics");
  mkdirSync(OUT, { recursive: true });
  const slugs = new Set<string>();
  for (const t of topics) {
    if (slugs.has(t.slug)) throw new Error("dup " + t.slug);
    slugs.add(t.slug);
    const body = buildBody(t);
    const wc = wordCount(body);
    if (wc < 1200) throw new Error(t.slug + " only " + wc + " words");
    writeFileSync(join(OUT, t.slug + ".md"), md(t, body), "utf8");
    console.log(t.slug + "\t" + wc);
  }
  console.log("OK", topics.length);
}

main();
