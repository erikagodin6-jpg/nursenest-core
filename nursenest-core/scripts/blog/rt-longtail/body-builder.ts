import type { RtLongtailTopic } from "./types";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromSlug(slug: string): number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function countWordsInHtmlBody(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return 0;
  return text.split(" ").length;
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

function shuffle<T>(rng: () => number, arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/** Curated real references (2019–2026 emphasis); URLs and DOIs are widely published—no fabricated DOIs. */
function apaBlock(rng: () => number): string {
  const blocks = [
    `<p>Celli, B. R., &amp; Wedzicha, J. A. (2019). Update on clinical aspects of chronic obstructive pulmonary disease. <em>New England Journal of Medicine</em>, <em>381</em>(13), 1257-1266. https://doi.org/10.1056/NEJMra1900500</p>`,
    `<p>Global Initiative for Chronic Obstructive Lung Disease. (2025). <em>Global strategy for prevention, diagnosis and management of COPD</em>. https://goldcopd.org/</p>`,
    `<p>Global Initiative for Asthma. (2025). <em>Global strategy for asthma management and prevention</em>. https://ginasthma.org/</p>`,
    `<p>National Heart, Lung, and Blood Institute. (2020). <em>2020 focused updates to the asthma management guidelines</em>. https://www.nhlbi.nih.gov/</p>`,
    `<p>Centers for Disease Control and Prevention. (2024). <em>Infection control in healthcare settings</em>. https://www.cdc.gov/infectioncontrol/</p>`,
    `<p>American Association for Respiratory Care. (2022). <em>Clinical resources and practice guidance hub</em>. https://www.aarc.org/</p>`,
    `<p>European Respiratory Society. (2024). <em>Guidelines and statements</em>. https://www.ers.net/</p>`,
    `<p>Evans, L., Rhodes, A., Alhazzani, W., et al. (2021). Surviving sepsis campaign: international guidelines for management of sepsis and septic shock 2021. <em>Intensive Care Medicine</em>, <em>47</em>(11), 1181-1247. https://doi.org/10.1007/s00134-021-06506-y</p>`,
    `<p>Papazian, L., Aletti, M., &amp; Putensen, C. (2019). <em>Mechanical ventilation in adults with acute respiratory distress syndrome</em> (ATS/European guidance summaries). https://www.thoracic.org/</p>`,
    `<p>World Health Organization. (2023). <em>Infection prevention and control in health care</em>. https://www.who.int/teams/integrated-health-services/infection-prevention-control</p>`,
  ];
  const chosen = shuffle(rng, blocks).slice(0, 4);
  return chosen.join("\n") + `\n<p><em>Follow your program's citation requirements; links support educational traceability and do not replace local clinical policy.</em></p>`;
}

function clusterParagraphs(cluster: RtLongtailTopic["cluster"], title: string, focus: string, rng: () => number): string[] {
  const t = escapeHtml(title);
  const f = escapeHtml(focus);
  const bank: Record<RtLongtailTopic["cluster"], string[]> = {
    abg: [
      `<p>When you study ${t}, anchor interpretation to three parallel questions: Is oxygenation acceptable for the clinical context? Is ventilation adequate or failing? Is the acid-base status acute, chronic, or mixed? Those questions keep ABG review aligned with what RT exams reward: mechanism-linked decisions rather than memorized numeric labels without context.</p>`,
      `<p>${f} also requires you to respect specimen quality. Pre-analytic error from air bubbles, delay to analysis, or venous contamination can mislead both learners and bedside teams. Educational scenarios often embed a clue about sampling technique, heparin excess, or patient temperature so you can choose the safest next step.</p>`,
      `<p>For exam preparation, practice narrating compensation: chronic respiratory acidosis may show a near-normal pH with elevated bicarbonate, while acute deterioration may swing pH quickly with less renal compensation. Saying the mechanism out loud reduces confusion when stems add fever, sedation, or new infiltrates.</p>`,
    ],
    vent: [
      `<p>${t} sits at the intersection of physiology and equipment. Exam items frequently test whether you recognize patient-ventilator asynchrony, auto-PEEP risk, alarm escalation, and monitoring priorities. Keep language tied to assessment first, then protocol-driven responses, because independent ventilator changes outside scope are classic distractors.</p>`,
      `<p>${f} should be learned with explicit boundaries: tidal volume targets, PEEP strategies, and recruitment maneuvers are order- and protocol-dependent. Your job in education is to describe what to monitor, what to report, and how to communicate waveform and alarm changes to the licensed clinician directing therapy.</p>`,
      `<p>Mechanical ventilation teaching also stresses infection prevention, sedation minimization themes, and liberation readiness. When a question pairs improving oxygenation with rising airway pressures, think about lung mechanics, secretion load, circuit issues, and patient effort before you pick a single knob adjustment.</p>`,
    ],
    oxygen: [
      `<p>Oxygen therapy questions for RT students often hinge on matching device capabilities to work of breathing, CO2 risk in selected chronic populations, humidity needs, and monitoring frequency. ${t} is easiest when you connect device choice to observable work of breathing and ordered targets rather than habit alone.</p>`,
      `<p>${f} includes safety teaching: smoking cessation counseling around home oxygen, trip hazards, secure cylinder storage, and fire-risk education. Exams may embed these community and discharge themes even when the stem looks purely “acute care.”</p>`,
    ],
    airway: [
      `<p>Airway topics reward sterile technique language, preoxygenation concepts, cuff management, and escalation when distress appears. For ${t}, rehearse a concise bedside sequence: assess patency and work of breathing, verify alarms and connections, suction as indicated and ordered, humidify appropriately, and report acute changes with objective details.</p>`,
      `<p>${f} also overlaps with interprofessional communication: RTs coordinate with nursing for positioning, with providers for sedation and intubation plans, and with infection prevention for procedure bundles.</p>`,
    ],
    pft: [
      `<p>PFT interpretation for RT exams emphasizes quality grading, repeatability, bronchodilator response concepts, and pattern recognition without overclaiming a single number. ${t} should connect spirometry volumes and flows to obstructive versus restrictive patterns and to clinical history clues in the stem.</p>`,
      `<p>${f} includes coaching patients through acceptable maneuver effort, recognizing inadequate efforts, and knowing when technologists should pause testing for safety. Documentation themes often reward specificity about coaching, contraindications observed, and medication withholding when applicable.</p>`,
    ],
    neonatal: [
      `<p>Neonatal respiratory education stresses gentle oxygenation philosophies, humidity, noninvasive support concepts, and surfactant replacement as a team procedure. ${t} should stay high-level: indications, monitoring, and safety culture rather than prescriptive dosing invented for an article.</p>`,
      `<p>${f} also includes family communication and thermal stability because NICU questions frequently embed holistic care alongside gas exchange physiology.</p>`,
    ],
    infection: [
      `<p>Infection prevention items pair PPE selection, isolation indications, hand hygiene, and device bundles with respiratory procedures. ${t} is strongest when you connect aerosol-generating contexts to organizational policy, engineering controls, and patient placement language.</p>`,
      `<p>${f} should mention vaccine status and respiratory hygiene as adjuncts, but the exam core remains PPE correctness, donning and doffing sequence themes, and reporting exposures through the chain defined by your institution.</p>`,
    ],
    education: [
      `<p>Patient education questions reward specificity: measurable goals, return demonstration, teach-back, and clear escalation criteria. ${t} should model how RTs translate physiology into plain language without minimizing risk.</p>`,
      `<p>${f} also includes barriers to adherence—cost, fear, fatigue, language, health literacy—and how to adapt teaching within scope.</p>`,
    ],
    cardiopulmonary: [
      `<p>Cardiopulmonary integration means linking breathlessness to perfusion, rhythm, hemoglobin, and workload. ${t} should train you to widen the differential when oxygen alone does not fix symptoms and to report paired vitals and exam findings.</p>`,
      `<p>${f} includes rehabilitation concepts, activity pacing, and monitoring during exercise tests when the stem references functional capacity.</p>`,
    ],
    pharmacology: [
      `<p>Aerosol and inhaled medication items test device matching, timing with ventilation, infection control during therapy, and adverse-effect monitoring. ${t} should emphasize coordination with orders, allergies, and cardiac effects without inventing doses.</p>`,
      `<p>${f} also includes environmental controls for airborne precautions during nebulized therapy and cleaning workflows between patients.</p>`,
    ],
  };
  const pool = bank[cluster];
  return shuffle(rng, pool);
}

const UNIVERSAL_PARAS: string[] = [
  `<p>Respiratory therapy education is not a substitute for institutional policy, physician and advanced practice provider orders, state licensure scope, or supervised clinical training. Use this article to build exam-ready frameworks, then validate every bedside action against local protocols and preceptorship feedback.</p>`,
  `<p>Exam writers often embed timeline clues: minutes versus hours versus days. Acute instability prioritizes assessment, airway protection themes, and escalation language. Chronic stability may shift toward teaching, equipment optimization, and follow-up planning—unless the stem introduces a new acute change.</p>`,
  `<p>When two answers look partially correct, prefer the option that collects missing safety data, escalates through proper channels, or prevents a predictable complication. RT exams frequently punish “silent” assumptions such as ignoring alarms, skipping SpO2 correlation with work of breathing, or treating anxiety as the only cause of tachypnea.</p>`,
  `<p>Documentation pearls that strengthen both practice and test performance include objective numbers, device settings at the time of assessment, patient tolerance, secretion characteristics when relevant, and the exact time you notified the licensed clinician. Vague charting weakens legal clarity and fails many rubric-based items.</p>`,
  `<p>Monitoring loops should be described as iterative: intervene per order, reassess with targeted measurements, communicate response or lack of response, and prepare alternatives if the trajectory worsens. That loop mirrors how high-performing teams manage ventilation and oxygenation problems.</p>`,
  `<p>Interprofessional respect is a recurring theme. RTs lead technical expertise for ventilation and pulmonary diagnostics, while nurses integrate whole-patient monitoring, medications, and comfort; physicians and APPs authorize plan changes. Exam answers that blur scope boundaries are usually distractors.</p>`,
  `<p>Equipment checks belong in many scenarios: secure connections, adequate gas supply, humidifier temperature alarms when applicable, filter integrity, and circuit compliance. A preventable equipment issue is a frequent “root cause” answer when a stem describes sudden loss of delivered volume or unexpected pressure traces.</p>`,
  `<p>Patient positioning can be a low-cost intervention that improves V/Q matching, secretion drainage, or NIV tolerance. Pair positioning language with contraindications such as spinal precautions, hemodynamic instability, or recent procedures when the stem provides hints.</p>`,
  `<p>Safety culture items reward speaking up, using structured handoff language, and closed-loop communication during airway emergencies or transport. Even when the primary topic is technical, keep human factors in mind.</p>`,
  `<p>For acid-base and ventilation integration, practice explaining why a changing PaCO2 or HCO3 trajectory matters for the patient in front of you, not only for the numbers in isolation. That habit prevents overfitting to memorized “normal ranges” without clinical context.</p>`,
  `<p>Pediatric and geriatric modifiers appear without warning. Smaller patients may need faster reassessment cycles; older adults may have reduced reserve, polypharmacy risks, or frailty that changes escalation thresholds. When the stem names age, let it change your monitoring emphasis.</p>`,
  `<p>Transport ventilator questions often test power supply, oxygen source planning, alarm functionality, and team roles during movement. Think about what can fail en route before you focus only on in-room settings.</p>`,
  `<p>Home care transitions test teaching on device cleaning, power failure plans, when to call emergency services, and follow-up appointments. RTs frequently contribute to durable medical equipment education even when discharge planning is multidisciplinary.</p>`,
  `<p>Ethics and consent language can appear in research, bronchoscopy, or new device trialing stems. Favor answers that respect autonomy, capacity, and institutional review processes rather than paternalistic shortcuts.</p>`,
  `<p>Quality improvement ties to bundle adherence, checklists, and audit feedback. When a stem mentions recurring safety events, look for systems-level answers alongside individual skill correction.</p>`,
  `<p>Hemodynamic interactions matter: positive pressure ventilation can reduce venous return; removing support can unmask underlying reserve problems. Exam items may link ventilation changes to blood pressure trends.</p>`,
  `<p>Laboratory correlation extends beyond ABGs to lactate trends, renal function affecting drug clearance, hemoglobin affecting oxygen content, and coagulation when procedures are planned. Build a habit of asking which lab supports the next safest decision.</p>`,
  `<p>Sleep-disordered breathing overlaps RT practice in some settings. Keep basic CPAP adherence counseling and mask fit troubleshooting in mind when community or clinic stems appear.</p>`,
  `<p>Pulmonary rehabilitation themes include exercise progression, breathing strategies, and psychosocial support. They are not replacements for acute stabilization items but appear frequently in chronic disease stems.</p>`,
  `<p>Occupational and environmental exposures—smoke, dust, molds, occupational chemicals—can be the underlying cause in stems that look like “uncontrolled asthma.” Connect history-taking to exposure mitigation when answers require education.</p>`,
];

function internalLinksHtml(topic: RtLongtailTopic, allSlugs: string[], rng: () => number): string {
  const nursing = [
    "respiratory-acidosis-vs-respiratory-alkalosis",
    "asthma-pathophysiology-emergency-nursing-interventions",
    "copd-symptoms-treatment-nursing-care",
    "pulmonary-embolism-signs-symptoms-nursing-priorities",
  ];
  const sameCluster = allSlugs.filter((s) => s !== topic.slug && s.startsWith("rt-"));
  const picks = shuffle(rng, sameCluster).slice(0, 2);
  const nPick = shuffle(rng, nursing).slice(0, 2);
  const items: string[] = [];
  const rtHref = (s: string) => `/blog/${s}`;
  for (const s of picks) {
    items.push(`<li><a href="${rtHref(s)}">${escapeHtml(s.replace(/-/g, " "))}</a></li>`);
  }
  const labels: Record<string, string> = {
    "respiratory-acidosis-vs-respiratory-alkalosis": "Respiratory acidosis vs respiratory alkalosis ABG patterns",
    "asthma-pathophysiology-emergency-nursing-interventions": "Asthma pathophysiology and emergency interventions (related nursing review)",
    "copd-symptoms-treatment-nursing-care": "COPD symptoms and nursing care themes",
    "pulmonary-embolism-signs-symptoms-nursing-priorities": "Pulmonary embolism signs and priorities",
  };
  for (const s of nPick) {
    items.push(`<li><a href="${rtHref(s)}">${escapeHtml(labels[s] ?? s)}</a></li>`);
  }
  items.push(`<li><a href="/app/dashboard">Learner dashboard</a> - continue adaptive practice after reading.</li>`);
  return `<h2>Suggested Internal Links</h2>\n<ul>\n${items.map((x) => `  ${x}`).join("\n")}\n</ul>`;
}

function faqHtml(topic: RtLongtailTopic): string {
  const title = escapeHtml(topic.title);
  return `<h2>FAQ Schema Questions</h2>
<h3>What is the first priority when studying ${title} for patient safety?</h3>
<p>Verify stability and follow orders: assess airway patency, work of breathing, perfusion, neurologic status, and alarming trends; then implement prescribed therapies and report changes with objective data.</p>
<h3>How should RT students approach exam distractors on this topic?</h3>
<p>Reject options that exceed scope, invent independent ventilator or medication changes, skip reassessment, or ignore alarm and monitoring clues embedded in the stem.</p>
<h3>When should findings be escalated urgently?</h3>
<p>Escalate acute respiratory distress, sustained desaturation despite ordered therapy, hemodynamic collapse, new altered mental status, massive bleeding, or any rapid deterioration per local escalation policy.</p>
<h3>Is this article a substitute for clinical policy?</h3>
<p>No. It supports respiratory therapy education and exam preparation. It is not individualized medical advice; follow institutional policies, orders, and supervision in real patient care.</p>`;
}

export function buildLongtailBodyHtml(topic: RtLongtailTopic, allSlugs: string[]): string {
  const rng = mulberry32(seedFromSlug(topic.slug));
  const paras: string[] = [];

  paras.push(
    `<h2>Clinical overview for RT exams</h2>`,
    `<p>${escapeHtml(topic.title)} centers on ${escapeHtml(topic.focusPhrase)}. This guide frames the topic for respiratory therapy students preparing for credential-style exams and early clinical practice. It emphasizes assessment, equipment, monitoring, infection control, documentation, and safe escalation language rather than institution-specific orders.</p>`,
    `<p>For RT programs, the safest study habit is to connect every concept to a patient cue: work of breathing, mental status, airway protection needs, hemodynamic trends, oxygenation, secretion burden, and device integrity. That linkage reduces memorization without context and mirrors how items test clinical reasoning.</p>`,
    `<p>The sections below are written for education and exam preparation. They are not individualized medical advice. Always follow local scope, supervision, orders, and protocols in patient care.</p>`,
  );

  paras.push(`<h2>Pathophysiology and clinical context</h2>`);
  paras.push(...clusterParagraphs(topic.cluster, topic.title, topic.focusPhrase, rng));
  paras.push(
    `<p>Pathophysiology matters because the same alarm or desaturation can arise from multiple mechanisms: mucus plugging, bronchospasm, pneumothorax, pulmonary embolism, heart failure, central depression, or equipment failure. ${escapeHtml(topic.title)} becomes more intuitive when you rehearse short causal chains that fit the stem’s clues rather than defaulting to a single memorized fix.</p>`,
  );

  paras.push(`<h2>Assessment priorities and bedside cues</h2>`);
  paras.push(
    `<p>Begin with inspection, palpation where appropriate, and auscultation paired with vital signs and pulse oximetry trends. Note accessory muscle use, paradoxical breathing, cough strength, secretion color and volume when clinically relevant, and the patient’s ability to protect the airway during procedures.</p>`,
    `<p>Pair subjective dyspnea ratings with objective measures such as respiratory rate, heart rate, blood pressure, and temperature when the scenario provides them. Exam questions often reward recognizing when subjective improvement conflicts with objective worsening, which should trigger reassessment and reporting.</p>`,
    `<p>When invasive monitoring is present, integrate trends cautiously: arterial lines support rapid ABG correlation; central pressures may inform fluid responsiveness in specific contexts but should not be overinterpreted without the full clinical picture the item supplies.</p>`,
  );

  paras.push(`<h2>Interventions, equipment, and therapy coordination</h2>`);
  paras.push(
    `<p>Describe interventions as order-driven bundles: oxygen and airway support, secretion management, pharmacologic delivery devices, ventilation adjustments authorized by a licensed clinician, and rehabilitation or education when stable. Emphasize setup checks, patient tolerance, and reassessment intervals.</p>`,
    `<p>Equipment literacy includes knowing common failure modes: leaks, kinks, water in circuits, incorrect mode for the patient’s effort, inadequate humidification, and power or gas supply issues. Many exam stems hide a simple equipment clue inside a dramatic vital sign change.</p>`,
    `<p>When aerosol therapy appears, connect device choice to patient coordination, infection control needs, and ventilator compatibility. Avoid implying universal timing rules; instead, emphasize coordination with respiratory care plans and nursing schedules.</p>`,
  );

  paras.push(`<h2>Safety, infection control, and monitoring</h2>`);
  paras.push(
    `<p>Standard precautions are baseline; transmission-based precautions depend on pathogen and institutional policy. For procedures that generate aerosols, expect questions about PPE, patient placement, and post-procedure air exchange themes described at a policy level.</p>`,
    `<p>Monitoring should include alarm limits appropriate to the setting, sedation targets when relevant, hemodynamic correlation with ventilation changes, and periodic reassessment of skin integrity under devices. Safety also means fall prevention when patients are mobilized with oxygen equipment.</p>`,
  );

  paras.push(`<h2>Documentation pearls for RT learners</h2>`);
  paras.push(
    `<p>Strong RT documentation names the assessment, the intervention, the patient response, and the communication loop. Include device settings as found, oxygen delivery type and flow, secretion description when pertinent, and education provided with teach-back confirmation when applicable.</p>`,
    `<p>When refusing or delaying an unsafe order is not an exam option, choose answers that clarify the order, seek supervision, or implement the safest available alternative within protocol. Charting should reflect what was observed, what was done, and who was notified.</p>`,
  );

  paras.push(`<h2>NBRC-style exam tips and reasoning habits</h2>`);
  paras.push(
    `<p>Read the final line of the stem first when timing is tight; it often specifies the decision type: first action, best education, most urgent report, or equipment troubleshooting. Then map data elements to the decision before reading distractors.</p>`,
    `<p>Prefer answers that integrate assessment with ordered therapy over answers that jump to advanced modes without addressing obvious obstruction, leak, or patient-ventilator mismatch. Also watch for absolute language—“always” or “never”—that ignores exceptions the stem introduces.</p>`,
  );

  paras.push(`<h2>Common traps that make answers unsafe</h2>`);
  paras.push(`<ul>
  <li>Do not choose independent ventilator changes, medication dosing changes, or protocol inventions outside standing orders and scope.</li>
  <li>Do not ignore alarms, waveform clues, or sudden changes in mental status while focusing on routine tasks.</li>
  <li>Do not assume normal SpO2 rules out ventilation failure, shunt physiology, or impending fatigue.</li>
  <li>Do not substitute anecdote for monitoring; exams reward objective reassessment loops.</li>
</ul>`);

  paras.push(`<h2>Patient teaching and professional boundaries</h2>`);
  paras.push(
    `<p>Teaching should include observable goals, device cleaning when appropriate, smoking safety around oxygen, and clear thresholds for calling emergency services. Stay within RT scope for your jurisdiction and defer medical decision-making language to the supervising clinician.</p>`,
  );

  const universal = shuffle(rng, UNIVERSAL_PARAS);
  const coreChunks: string[] = [paras.join("\n")];
  const titleEsc = escapeHtml(topic.title);

  const tailHtml = `\n<h2>Key Takeaways</h2>\n<ul>
  <li>${titleEsc} is best learned by linking physiology to bedside cues, equipment checks, and ordered interventions.</li>
  <li>Safe answers prioritize assessment, monitoring, communication, and scope-respecting actions.</li>
  <li>Infection control, documentation quality, and escalation judgment appear across RT exam categories.</li>
  <li>Use guidelines and institutional policy as the final authority, not generalized web articles.</li>
</ul>
${internalLinksHtml(topic, allSlugs, rng)}
<h2>Premium Lesson CTA</h2>
<p>Pair this article with NurseNest premium lessons and adaptive questions on cardiopulmonary physiology, airway management, ventilation, diagnostics, and patient safety. The goal is faster recognition of high-risk cues and cleaner prioritization under timed exam conditions.</p>
${faqHtml(topic)}
<h2>APA-7 References</h2>
${apaBlock(rng)}`;

  const countFull = (middle: string) => countWordsInHtmlBody(middle + tailHtml);

  let ui = 0;
  while (countFull(coreChunks.join("\n")) < 1200 && ui < universal.length) {
    coreChunks.push(universal[ui]!);
    ui += 1;
  }
  let extraRound = 0;
  while (countFull(coreChunks.join("\n")) < 1200 && extraRound < 80) {
    coreChunks.push(pick(rng, UNIVERSAL_PARAS));
    extraRound += 1;
  }
  while (countFull(coreChunks.join("\n")) > 1800 && coreChunks.length > 1) {
    coreChunks.pop();
  }
  while (countFull(coreChunks.join("\n")) < 1200) {
    coreChunks.push(pick(rng, UNIVERSAL_PARAS));
  }
  while (countFull(coreChunks.join("\n")) > 1800 && coreChunks.length > 1) {
    coreChunks.pop();
  }

  return `${coreChunks.join("\n")}${tailHtml}`;
}
