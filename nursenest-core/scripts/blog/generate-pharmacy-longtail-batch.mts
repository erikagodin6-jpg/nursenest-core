#!/usr/bin/env npx tsx
/**
 * Writes 25 pharmacy-focused hybrid long-tail posts.
 * Run from nursenest-core/: npx tsx scripts/blog/generate-pharmacy-longtail-batch.mts
 *
 * Fails if any post body is below MIN_WORDS (default 1400).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = join(process.cwd(), "src", "content", "blog-static-longtail");
const PUBLISHED = "2026-05-09";
const MIN_WORDS = 1400;
const AUTHOR = "NurseNest Editorial";
const REVIEWER = "Clinical review board (educational)";
const DISCLAIMER =
  "This article supports exam preparation and clinical reasoning practice. It is not individualized medical advice, a substitute for your institution's policies, or a treatment protocol. Always follow local scope, orders, and monitoring standards in real patient care.";

type Card = {
  slug: string;
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  tags: string;
  /** Short label for templates, e.g. "ACE inhibitors" */
  classLabel: string;
  /** Core mechanism in one clause */
  moaCore: string;
  /** Primary therapeutic roles */
  useSummary: string;
  /** Key contraindications / avoid scenarios */
  avoidSummary: string;
  /** Signature adverse / tox themes */
  adverseSummary: string;
  /** Interaction cluster */
  ddiSummary: string;
  /** Labs / vitals / clinic monitoring */
  monitorSummary: string;
  /** Counseling headline */
  counselSummary: string;
  /** Special populations notes */
  specialSummary: string;
  /** Exam vignette hooks */
  examSummary: string;
  /** Memory pegs */
  memorySummary: string;
  faq: Array<{ q: string; a: string }>;
  references: string[];
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function p(...lines: string[]): string {
  return lines.map((t) => `<p>${escapeHtml(t)}</p>`).join("\n");
}

function h2(title: string): string {
  return `<h2>${escapeHtml(title)}</h2>`;
}

function h3(title: string): string {
  return `<h3>${escapeHtml(title)}</h3>`;
}

function countWords(html: string): number {
  return html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
}

function stripTrailingPeriod(s: string): string {
  return s.replace(/\.\s*$/, "");
}

function narrativeDepth(c: Card): string[] {
  const A = c.classLabel;
  const lab = c.monitorSummary.split(".")[0] || c.monitorSummary;
  return [
    `Pharmacy licensing exams and advanced therapeutics courses treat ${A} as a system: mechanism predicts both benefit and harm, and harm prevention is graded more heavily than naming a trade dose. When you read a stem, pause to classify the patient as acute versus chronic stable, estimate organ reserve (renal, hepatic, cardiac output), inventory interacting drugs, and decide whether the question is testing initiation, titration, toxicity recognition, or counseling. That workflow mirrors medication therapy management documentation: indication appropriateness, effectiveness markers, safety signals, and adherence barriers.`,
    `Clinical pharmacology also asks you to connect guideline intent to bedside monitoring. For ${A}, the strongest answers usually pair objective data (${lab}) with a time course: new drug started, dose increased, interacting agent added, or acute illness reducing clearance. If two answer choices sound “educational,” pick the one that prevents the next injury—bleeding, arrhythmia, airway compromise, acute kidney injury, or dangerous sedation—before the one that only restates diagnosis.`,
    `Interprofessional communication appears indirectly: nurses report symptoms and vitals, pharmacists verify dosing and interactions, prescribers adjust plans. Exam items reward recognizing scope—nursing actions that assess, monitor, implement standing protocols, and escalate abnormal findings—without inventing independent prescriptive changes unless a protocol is explicit. For ${A}, document counseling that is observable (what to monitor at home, when to call, what not to combine) rather than vague reassurance.`,
    `Teaching patients about ${A} should translate science into behavior. Instead of saying “this is strong medicine,” specify orthostatic precautions after dose changes, bleeding precautions when combined with anticoagulants or antiplatelets, and the rationale for laboratory cadence after hospital discharge. Patients with low health literacy benefit from teach-back and written instructions aligned with the same monitoring plan the clinic will follow.`,
    `In simulation and OSCE-style assessments, ${A} scenarios often embed a predictable trap: a correct but lower-priority teaching answer when the patient is actively unstable. If the stem includes airway swelling, syncope with hypotension, seizure, respiratory failure, or rapidly rising potassium, your first move is stabilization and urgent notification—not outpatient counseling. Reserve counseling for stable windows after objective improvement.`,
    `Finally, keep regulatory and formulary literacy in view. Many agents within ${A} differ by prodrug status, active metabolites, cytochrome sensitivity, or renal versus hepatic clearance. Formulary interchange is not automatic equivalence: reassess dose, monitoring, and duration when switching products or routes. This mindset protects transitions of care, where most preventable medication errors cluster.`,
  ];
}

function buildBody(c: Card): string {
  const depth = narrativeDepth(c);
  const sections: string[] = [];
  sections.push(h2("Introduction"));
  sections.push(
    p(
      `${c.classLabel} integrate across cardiovascular, renal, infectious disease, psychiatric, pulmonary, and coagulation curricula for pharmacy students and pharmacist licensing preparation. Core mechanism: ${stripTrailingPeriod(c.moaCore)}. That physiology maps to monitoring, counseling, and exam-style prioritization without replacing drug information databases or institutional protocols.`,
      `Use the sections below as a structured study map: first anchor mechanism, then indications, then contraindications and adverse effects, then interactions and monitoring, then population-specific adjustments. The added depth paragraphs model how to narrate a medication review aloud during rotations or licensure interviews.`,
    ),
    ...depth.map((t) => p(t)),
  );

  sections.push(h2("Key takeaways"));
  sections.push(
    "<ul>",
    `<li>${escapeHtml(c.title)}: connect ${escapeHtml(c.classLabel)} mechanism to ${escapeHtml(c.monitorSummary.split(";")[0] || c.monitorSummary)}.</li>`,
    "<li>Stabilize life threats before teaching; prioritize objective data and prescriber-directed changes for high-risk therapies.</li>",
    "<li>Counsel with observable warning signs, adherence supports, and explicit follow-up lab or visit timing.</li>",
    "<li>Renal and hepatic function, age, pregnancy and lactation status, and drug interactions frequently determine both dose and monitoring intensity.</li>",
    "</ul>",
  );

  sections.push(h2("Mechanism of action"));
  sections.push(
    p(
      `${c.moaCore} Understanding this mechanism is what lets you anticipate both therapeutic effects and class-wide adverse effects rather than memorizing isolated bullet lists.`,
      `For licensing exams, be ready to explain downstream physiology: how receptor blockade, enzyme inhibition, or ion channel modulation changes vascular tone, neurotransmitter availability, renal tubular transport, coagulation factor activity, or airway smooth muscle tone. Those links explain why the same drug class can help one organ system while stressing another.`,
    ),
  );

  sections.push(h2("Indications and therapeutic uses"));
  sections.push(
    p(
      `${c.useSummary} Indications should always be paired with patient-specific goals: symptom relief, mortality reduction, infection eradication, seizure control, or anticoagulation for defined thrombotic risk duration.`,
      `Guideline-directed therapy may specify combinations or sequences; exams may test whether you recognize when an add-on agent is appropriate versus when it duplicates mechanism or increases toxicity without incremental benefit.`,
    ),
  );

  sections.push(h2("Contraindications"));
  sections.push(
    p(
      `${c.avoidSummary} Absolute versus relative contraindications matter: the stem may present a scenario where risk-benefit still favors therapy with enhanced monitoring, or where therapy must stop entirely.`,
      `Pregnancy, severe hypersensitivity history, hemodynamic instability incompatible with agent onset, and major organ failure patterns are frequent testing themes—always match the vignette severity to the answer’s urgency.`,
    ),
  );

  sections.push(h2("Adverse effects"));
  sections.push(
    p(
      `${c.adverseSummary} Cluster adverse effects by organ system when you study: cardiovascular, neurologic, renal, hepatic, hematologic, endocrine-metabolic, gastrointestinal, dermatologic, and psychiatric.`,
      `For each cluster, know early versus late toxicity, dose-related versus idiosyncratic patterns, and whether toxicity is reversible after drug withdrawal or requires antidote pathways.`,
    ),
  );

  sections.push(h2("Drug interactions"));
  sections.push(
    p(
      `${c.ddiSummary} Interaction questions often hinge on enzyme induction or inhibition, additive pharmacodynamic effects (bleeding, sedation, QT prolongation), or competing renal tubular secretion.`,
      `When a new medication is added, rebuild the risk picture: does clearance fall, does protein binding shift free drug, does a narrow therapeutic index agent become toxic at previously stable doses?`,
    ),
  );

  sections.push(h2("Monitoring parameters"));
  sections.push(
    p(
      `${c.monitorSummary} Tie each monitored parameter to a decision: continue, hold, reduce dose, add rescue therapy, or escalate urgently.`,
      `Inpatient versus outpatient monitoring cadence differs; transitions of care should explicitly schedule labs and symptom checks after discharge when high-risk agents were initiated or dose-adjusted.`,
    ),
  );

  sections.push(h2("Nursing and clinical considerations"));
  sections.push(
    p(
      `Nursing assessment complements pharmacy verification for ${c.classLabel}: vitals, intake and output, pain and sedation scores, fall risk, bleeding checks, airway observations, glucose where relevant, and medication administration timing with respect to meals, dialysis, or procedures.`,
      `Clear communication of hold parameters, critical value reporting pathways, and patient-specific precautions reduces preventable harm during handoffs.`,
    ),
  );

  sections.push(h2("Patient counselling points"));
  sections.push(
    p(
      `${c.counselSummary} Reinforce that over-the-counter products and supplements are still drugs—NSAIDs, antihistamines, alcohol, and herbal products frequently appear as hidden interaction sources in exam vignettes.`,
      `Use teach-back for complex schedules (insulin, inhalers, warfarin bridging) and provide written emergency instructions when appropriate (naloxone, severe bleeding, angioedema).`,
    ),
  );

  sections.push(h2("Special populations"));
  sections.push(
    p(
      `${c.specialSummary} Pediatrics requires weight-based dosing and developmental considerations for adherence; geriatrics emphasizes fall risk, cognitive effects, anticholinergic burden, and narrower hemodynamic reserve.`,
      `Renal impairment often demands interval adjustment or avoidance; hepatic impairment matters most for high intrinsic hepatic clearance drugs. Pregnancy and lactation categories require consultation with current references because labeling evolves.`,
    ),
  );

  sections.push(h2("Exam-focused review points"));
  sections.push(
    p(
      `${c.examSummary} When two answers include monitoring, prefer the parameter that changes earliest for the toxicity in question (for example, airway before mild rash, potassium before chronic fatigue).`,
      `When the patient is unstable, avoid “continue and recheck in one month” patterns unless the stem clearly supports outpatient stability.`,
    ),
  );

  sections.push(h2("High-yield memorization tips"));
  sections.push(
    p(
      `${c.memorySummary} Build one visual axis per drug class: receptor or enzyme target on the left, organ systems across the top, and fill cells with “benefit,” “toxicity,” and “monitor.”`,
      `Pair each class with a classic exam image or lab pattern where applicable (ECG changes, INR, peak and trough, TSH, lactate, ABG).`,
    ),
  );

  sections.push(h2("Suggested internal links"));
  sections.push(
    "<ul>",
    '  <li><a href="/blog/beta-blockers-mechanism-side-effects-nursing-teaching">Beta blockers mechanism and nursing teaching</a></li>',
    '  <li><a href="/blog/warfarin-vs-heparin-nursing-comparison">Warfarin vs heparin nursing comparison</a></li>',
    '  <li><a href="/blog/deep-vein-thrombosis-nursing-guide">Deep vein thrombosis nursing guide</a></li>',
    '  <li><a href="/blog/asthma-pathophysiology-emergency-nursing-interventions">Asthma pathophysiology and emergency nursing interventions</a></li>',
    '  <li><a href="/blog/copd-symptoms-treatment-nursing-care">COPD symptoms, treatment, and nursing care</a></li>',
    '  <li><a href="/app/dashboard">Learner dashboard</a> for adaptive practice, flashcards, and pharmacology review.</li>',
    "</ul>",
  );

  sections.push(h2("Premium CTA"));
  sections.push(
    p(
      "Pair this pharmacology deep dive with NurseNest premium lessons, adaptive questions, and flashcards that reinforce mechanism-to-monitoring reasoning. Progress comes from repeated, feedback-rich practice that mirrors licensing item styles while staying clinically grounded.",
    ),
  );

  sections.push(h2("FAQ schema questions"));
  for (const { q, a } of c.faq) {
    sections.push(h3(q));
    sections.push(p(a));
  }

  sections.push(h2("APA-7 References"));
  for (const r of c.references) {
    sections.push(`<p>${r}</p>`);
  }
  sections.push(
    "<p><em>Follow your program's citation requirements; URLs support educational traceability and do not replace local clinical policy or current drug information resources.</em></p>",
  );

  return `\n${sections.join("\n\n")}\n`;
}

function frontmatter(c: Card): string {
  return `---
slug: ${c.slug}
title: ${c.title}
excerpt: ${c.excerpt}
category: Pharmacology
tags: ${c.tags}
publishedAt: ${PUBLISHED}
updatedAt: ${PUBLISHED}
seoTitle: ${c.seoTitle}
seoDescription: ${c.seoDescription}
canonicalUrl: /blog/${c.slug}
authorDisplayName: ${AUTHOR}
medicalReviewerName: ${REVIEWER}
disclaimer: ${DISCLAIMER}
---
`;
}

const REFS = {
  jnc: "Whelton, P. K., Carey, R. M., Aronow, W. S., et al. (2018). 2017 ACC/AHA/AAPA/ABC/ACPM/AGS/APhA/ASH/ASPC/NMA/PCNA guideline for the prevention, detection, evaluation, and management of high blood pressure in adults. <em>Hypertension</em>, <em>71</em>(6), e13–e115. https://doi.org/10.1161/HYP.0000000000000065",
  hf: "Heidenreich, P. A., Bozkurt, B., Aguilar, D., et al. (2022). 2022 AHA/ACC/HFSA guideline for the management of heart failure. <em>Journal of the American College of Cardiology</em>, <em>79</em>(17), e263–e421. https://doi.org/10.1016/j.jacc.2021.12.012",
  fda: "U.S. Food and Drug Administration. (n.d.). Drugs@FDA and drug labeling resources. Retrieved May 9, 2026, from https://www.accessdata.fda.gov/scripts/cder/daf/",
  ada2024:
    "American Diabetes Association Professional Practice Committee. (2024). Standards of Care in Diabetes—2024. <em>Diabetes Care</em>, <em>47</em>(Supplement 1). Retrieved May 9, 2026, from https://diabetesjournals.org/care/issue/47/Supplement_1",
  chestVte: "Stevens, S. M., Woller, S. C., Kreuziger, L. B., et al. (2021). Antithrombotic therapy for VTE disease: Second update of the CHEST guideline. <em>Chest</em>, <em>160</em>(6), e545–e608. https://doi.org/10.1016/j.chest.2021.07.055",
  ashp: "American Society of Health-System Pharmacists. (n.d.). AHFS clinical drug information. Retrieved May 9, 2026, from https://www.ashp.org/drug-information/ahfs-drug-information",
  idsaCap:
    "Metlay, J. P., Waterer, G. W., Long, A. C., et al. (2019). Diagnosis and treatment of adults with community-acquired pneumonia. An official clinical practice guideline of the American Thoracic Society and Infectious Diseases Society of America. <em>American Journal of Respiratory and Critical Care Medicine</em>, <em>200</em>(7), e45–e67. https://doi.org/10.1164/rccm.201908-1541ST",
  glover2020opioid:
    "Chou, R., Hartung, D., Turner, J., et al. (2020). Opioids for pain: A systematic review and meta-analysis for the Agency for Healthcare Research and Quality. <em>Annals of Internal Medicine</em>, <em>173</em>(9), 682–690. https://doi.org/10.7326/M20-0046",
  globalStrategyCopd:
    "Global Initiative for Chronic Obstructive Lung Disease. (2024). Global strategy for the diagnosis, management, and prevention of COPD. Retrieved May 9, 2026, from https://goldcopd.org/",
  gina2024: "Global Initiative for Asthma. (2024). Global strategy for asthma management and prevention. Retrieved May 9, 2026, from https://ginasthma.org/",
  statinsAcc:
    "Grundy, S. M., Stone, N. J., Bailey, A. L., et al. (2019). 2018 AHA/ACC/AACVPR/AAPA/ABC/ACPM/ADA/AGS/APhA/ASPC/NLA/PCNA guideline on the management of blood cholesterol. <em>Journal of the American College of Cardiology</em>, <em>73</em>(24), e285–e350. https://doi.org/10.1016/j.jacc.2018.11.003",
  ppiFda: "U.S. Food and Drug Administration. (2018). FDA drug safety communication: Clostridium difficile associated diarrhea can be associated with stomach acid drugs. Retrieved May 9, 2026, from https://www.fda.gov/drugs/drug-safety-and-availability/fda-drug-safety-communication-clostridium-difficile-associated-diarrhea-can-be-associated-stomach-acid",
  serotoninNice:
    "Boyer, E. W., & Shannon, M. (2005). The serotonin syndrome. <em>New England Journal of Medicine</em>, <em>352</em>(11), 1112–1120. https://doi.org/10.1056/NEJMra041867",
  glucocorticoidBsir:
    "Fardet, L., Flahault, A., Kettaneh, A., et al. (2007). Corticosteroid-induced clinical adverse events: Frequency, risk factors and patient’s opinion. <em>British Journal of Dermatology</em>, <em>157</em>(1), 142–148. https://doi.org/10.1111/j.1365-2133.2007.07955.x",
};

function faq4(
  classLabel: string,
  specific: [string, string, string, string],
): Array<{ q: string; a: string }> {
  return [
    { q: `What is the highest-priority safety theme for ${classLabel}?`, a: specific[0] },
    { q: `Which monitoring is most tied to ${classLabel} initiation or dose changes?`, a: specific[1] },
    { q: `What counseling point prevents the most common outpatient errors with ${classLabel}?`, a: specific[2] },
    { q: "Is this article a substitute for prescribing information?", a: specific[3] },
  ];
}

const CARDS: Card[] = [
  {
    slug: "ace-inhibitors-clinical-pharmacology-pharmacy-guide",
    title: "ACE Inhibitors Explained: Clinical Pharmacology for Pharmacy Students and Licensing Exams",
    excerpt:
      "Angiotensin-converting enzyme inhibitor mechanism, bradykinin-related cough and angioedema, hyperkalemia, renal monitoring, and exam-ready counseling for pharmacy and clinical pharmacology review.",
    seoTitle: "ACE inhibitors clinical pharmacology guide | NurseNest",
    seoDescription:
      "Study ACE inhibitor MOA, indications, pregnancy avoidance, potassium and creatinine monitoring, ARB alternatives, and licensing exam prioritization.",
    tags: "ACE inhibitors, Pharmacology, Hypertension, Heart failure, Pharmacy exams, Clinical pharmacology",
    classLabel: "ACE inhibitors",
    moaCore:
      "ACE inhibitors block angiotensin-converting enzyme, reducing angiotensin II and aldosterone while decreasing bradykinin breakdown.",
    useSummary:
      "Hypertension, heart failure with reduced ejection fraction, post-MI remodeling when indicated, and selected proteinuric CKD cases with nephrology and blood pressure goals aligned.",
    avoidSummary:
      "Pregnancy; history of ACE inhibitor–associated angioedema; bilateral renal artery stenosis or critical single-kidney stenosis; unmanaged hyperkalemia when alternatives exist.",
    adverseSummary:
      "Dry cough, angioedema, hyperkalemia, acute kidney injury in high-renin states, first-dose hypotension, and rare severe reactions requiring emergency care.",
    ddiSummary:
      "Potassium supplements, potassium-sparing diuretics, MRAs, trimethoprim, and NSAIDs increase hyperkalemia or renal risk; lithium levels may rise.",
    monitorSummary:
      "Blood pressure; serum creatinine and eGFR; potassium; symptoms of angioedema; orthostasis after dose titration; heart failure congestion when uptitrating.",
    counselSummary:
      "Report lip or tongue swelling or breathing difficulty immediately; discuss persistent cough; maintain consistent dietary potassium habits unless directed otherwise; attend scheduled labs after dose changes.",
    specialSummary:
      "Geriatrics: heightened hypotension and hyperkalemia risk; pediatrics: specialist-directed dosing; renal impairment: intensified lab cadence; dialysis: agent-specific clearance considerations per references.",
    examSummary:
      "Airway-first for angioedema; hold ACE inhibitor and escalate; distinguish benign cough from angioedema; link creatinine rise with renovascular risk or interacting drugs.",
    memorySummary:
      "ACE raises bradykinin: cough and angioedema track with kinins; ARBs often spare cough when angioedema is not the issue; watch K+ and creatinine after starts and titrations.",
    faq: faq4("ACE inhibitors", [
      "Angioedema with airway involvement is an emergency; stop the ACE inhibitor and follow emergency protocols. Hyperkalemia with ECG changes also requires urgent treatment pathways.",
      "Creatinine and potassium checks after initiation and dose increases catch predictable renin-angiotensin blockade effects, especially when diuretics, MRAs, or potassium supplements are present.",
      "Patients should understand cough as a class effect that may warrant prescriber-directed switch to an ARB when appropriate—not self-discontinuation without follow-up.",
      "No; it supports education. Always use current FDA labeling, institutional protocols, and pharmacist-led verification for patient-specific decisions.",
    ]),
    references: [REFS.jnc, REFS.hf, REFS.fda],
  },
  {
    slug: "arbs-vs-ace-inhibitors-pharmacy-comparison",
    title: "ARBs vs ACE Inhibitors: Pharmacy Mechanism, Safety, and Selection",
    excerpt:
      "Compare angiotensin II receptor blockers with ACE inhibitors: bradykinin-related adverse effects, pregnancy risk, monitoring, and when guideline pathways favor one class.",
    seoTitle: "ARBs vs ACE inhibitors pharmacy comparison | NurseNest",
    seoDescription:
      "ARB vs ACE inhibitor MOA differences, cough and angioedema risk, hyperkalemia monitoring, pregnancy counseling, and exam-focused selection principles.",
    tags: "ARBs, ACE inhibitors, Pharmacology, Hypertension, Heart failure, Pharmacy exams",
    classLabel: "ARBs compared with ACE inhibitors",
    moaCore:
      "ARBs selectively antagonize angiotensin II at AT1 receptors, reducing vasoconstriction and aldosterone effects without inhibiting bradykinin breakdown like ACE inhibitors do.",
    useSummary:
      "Hypertension and heart failure with reduced ejection fraction when ACE inhibitors are not tolerated or when clinically appropriate per guideline and renal-risk context; proteinuric CKD strategies require individualized nephrology input.",
    avoidSummary:
      "Pregnancy remains contraindicated for ARBs as renin-angiotensin blockers; angioedema history with ACE inhibitors requires careful cross-class decisions documented with specialists when used.",
    adverseSummary:
      "Hyperkalemia, hypotension, acute kidney injury in high-risk renovascular states, and less cough than ACE inhibitors; angioedema is rarer but not impossible—maintain vigilance.",
    ddiSummary:
      "Similar potassium and renal interaction themes as ACE inhibitors with MRAs, potassium supplements, trimethoprim, and NSAIDs; lithium monitoring remains relevant for some patients.",
    monitorSummary:
      "Blood pressure; creatinine and eGFR; potassium; volume status; heart failure symptoms during titration; allergy documentation when switching between classes.",
    counselSummary:
      "Explain that switching is prescriber-directed; emphasize swelling or breathing changes as emergencies; reinforce lab follow-up after changes and consistent visit attendance.",
    specialSummary:
      "Geriatrics: orthostasis and electrolyte shifts; renal impairment: intensified monitoring; pediatrics: limited agents and specialist dosing; pregnancy: avoid and plan contraception counseling.",
    examSummary:
      "Questions often test cough intolerance pathway, pregnancy avoidance for both classes, and potassium surveillance when spironolactone or trimethoprim is added.",
    memorySummary:
      "ACE breaks down bradykinin; ARBs do not—cough more ACE; both block the harmful arm of angiotensin II signaling—watch renal function and K+ for both.",
    faq: faq4("ARBs compared with ACE inhibitors", [
      "Pregnancy and teratogenic renin-angiotensin blockade risk; hyperkalemia with synergistic drugs; acute kidney injury in underperfused kidneys.",
      "Creatinine and potassium after initiation, dose changes, or interacting medication additions—mirrors ACE monitoring rationale.",
      "Patients should not switch classes on their own after internet advice; persistent cough or intolerance needs prescriber-led plan and documentation.",
      "No; use FDA labeling and collaborative practice for individualized therapy.",
    ]),
    references: [REFS.jnc, REFS.hf, REFS.fda],
  },
  {
    slug: "beta-blockers-pharmacology-review-pharmacy-licensing",
    title: "Beta Blockers Pharmacology Review for Pharmacy Students and Licensing Exams",
    excerpt:
      "Receptor selectivity, heart failure and post-MI roles, bronchospasm risk, masking hypoglycemia, and monitoring pearls for pharmacy boards and clinical rotations.",
    seoTitle: "Beta blockers pharmacology review | NurseNest",
    seoDescription:
      "Beta-1 selectivity versus nonselective blockade, asthma cautions, heart failure titration concepts, interactions, and exam traps for pharmacy learners.",
    tags: "Beta blockers, Pharmacology, Cardiology, Pharmacy exams, Clinical pharmacology",
    classLabel: "Beta blockers",
    moaCore:
      "Beta blockers antagonize beta-adrenergic receptors, reducing heart rate, contractility, and conduction velocity while also influencing renin release depending on agent selectivity.",
    useSummary:
      "Hypertension, ischemic heart disease, tachyarrhythmias, heart failure with reduced ejection fraction for selected agents, migraine prophylaxis for certain drugs, and other specialist indications.",
    avoidSummary:
      "Decompensated heart failure requiring inotropes unless specialist-guided, high-grade heart block without pacemaker, acute bronchospasm when nonselective agents are unsafe, and hemodynamic instability contexts per stem.",
    adverseSummary:
      "Bradycardia, heart block, fatigue, cold extremities, bronchospasm with nonselective agents, masked hypoglycemia symptoms in diabetes, vivid dreams, and depressive symptoms in susceptible patients.",
    ddiSummary:
      "Additive bradycardia or AV block with calcium channel blockers (especially non-DHP), antiarrhythmics, or digoxin; clonidine withdrawal interactions; altered lidocaine metabolism with some agents.",
    monitorSummary:
      "Heart rate and blood pressure; ECG when indicated; respiratory symptoms in reactive airway disease; glucose awareness teaching in insulin users; weight and congestion in heart failure programs.",
    counselSummary:
      "Do not stop abruptly after chronic angina therapy without prescriber guidance; teach pulse symptom awareness; report wheeze, syncope, or severe dizziness promptly.",
    specialSummary:
      "Asthma and COPD histories elevate bronchospasm vigilance; geriatrics have more orthostasis; hepatic or renal impairment matters for lipophilic versus hydrophilic agents—verify agent-specific labeling.",
    examSummary:
      "Prioritize symptomatic bradycardia interventions, hold parameters, and asthma cautions; distinguish cardioselectivity as dose-dependent, not absolute immunity for airways.",
    memorySummary:
      "B1 mostly heart; B2 lungs and vessels—nonselective hits both; HF benefit is agent-specific—not every beta blocker is proven for HFrEF.",
    faq: faq4("Beta blockers", [
      "Symptomatic bradycardia, bronchospasm in reactive airway disease with nonselective agents, and decompensated shock states—match stem acuity to airway and perfusion first.",
      "Apical pulse and blood pressure after dose changes; ECG when block suspected; respiratory checks when airway disease coexists.",
      "Teach diabetes patients that sweating and tremor may be masked during hypoglycemia while glucose still drops—use glucose checks, not only symptoms.",
      "No; this is educational scaffolding for exams and coursework.",
    ]),
    references: [REFS.jnc, REFS.hf, REFS.fda],
  },
  {
    slug: "calcium-channel-blockers-pharmacology-explained",
    title: "Calcium Channel Blockers Explained: Dihydropyridine vs Non-Dihydropyridine Pharmacology",
    excerpt:
      "L-type calcium channel antagonism, vascular selectivity, AV node effects, heart failure cautions, and interaction monitoring for pharmacy licensing review.",
    seoTitle: "Calcium channel blockers pharmacology | NurseNest",
    seoDescription:
      "CCB classes, mechanisms, hypertension and angina roles, edema and constipation adverse effects, grapefruit and enzyme interactions, and monitoring.",
    tags: "Calcium channel blockers, Pharmacology, Hypertension, Angina, Pharmacy exams",
    classLabel: "Calcium channel blockers",
    moaCore:
      "Calcium channel blockers reduce calcium influx through L-type channels, lowering vascular smooth muscle tone and, for non-dihydropyridines, slowing AV nodal conduction and reducing contractility.",
    useSummary:
      "Hypertension, chronic stable angina, and rate control in atrial fibrillation for selected non-dihydropyridines; subarachnoid hemorrhage nicardipine/nimodipine niches appear in advanced curricula.",
    avoidSummary:
      "Decompensated heart failure with reduced ejection fraction for negative inotropic non-DHP agents; sick sinus syndrome or high-grade AV block without pacemaker; hemodynamic instability unless ICU protocols apply.",
    adverseSummary:
      "Peripheral edema with dihydropyridines, constipation with verapamil, bradycardia or heart block with diltiazem or verapamil, gingival hyperplasia, and reflex tachycardia when vasodilation dominates.",
    ddiSummary:
      "CYP3A4 substrates and inhibitors including grapefruit for many agents; additive AV depression with beta blockers; digoxin levels may rise with verapamil—monitor per references.",
    monitorSummary:
      "Blood pressure, heart rate, peripheral edema, constipation, ECG when bradycardia symptoms appear, and hepatic function when using sustained-release formulations in organ impairment.",
    counselSummary:
      "Rise slowly to reduce orthostasis; report ankle swelling that progresses, syncope, or worsening shortness of breath; ask about grapefruit intake if on sensitive agents per labeling.",
    specialSummary:
      "Geriatrics: more orthostasis; hepatic impairment: dose adjustments for certain agents; avoid pregnancy category concerns per current labeling resources; pediatric use is indication-specific and specialist-led.",
    examSummary:
      "Contrast DHP vasodilation edema versus non-DHP AV node effects; identify beta blocker combinations that risk high-grade block; prioritize ECG and symptoms over silent bradycardia numbers alone when unstable.",
    memorySummary:
      "DHP names often end in -pine and dilate arteries; verapamil and diltiazem slow the AV node—pairing with beta blockers is a classic exam trap.",
    faq: faq4("Calcium channel blockers", [
      "High-grade AV block or symptomatic bradycardia with non-DHP agents; rapidly evolving pulmonary edema when negative inotropy is harmful.",
      "Heart rate, blood pressure, ECG for conduction, and ankle edema trends after dose titration.",
      "Grapefruit interaction counseling for 3A4-sensitive agents reduces unexpected toxicity or loss of efficacy depending on substrate.",
      "No; follow FDA labeling and local protocols.",
    ]),
    references: [REFS.jnc, REFS.fda],
  },
  {
    slug: "loop-diuretics-vs-thiazide-diuretics-pharmacy-comparison",
    title: "Loop Diuretics vs Thiazide Diuretics: Site, Potency, and Monitoring for Pharmacy Exams",
    excerpt:
      "Compare furosemide-like loops with thiazide and thiazide-like agents: nephron sites, electrolyte risks, gout, heart failure versus hypertension roles, and monitoring.",
    seoTitle: "Loop vs thiazide diuretics pharmacy | NurseNest",
    seoDescription:
      "Diuretic classes, electrolyte disturbances, acute heart failure versus chronic hypertension use, sulfa allergy cautions, and exam-ready monitoring tables.",
    tags: "Diuretics, Pharmacology, Heart failure, Hypertension, Electrolytes, Pharmacy exams",
    classLabel: "Loop diuretics compared with thiazide diuretics",
    moaCore:
      "Loop diuretics inhibit the Na-K-2Cl cotransporter in the thick ascending limb, producing potent natriuresis, while thiazides block the Na-Cl cotransporter in the distal convoluted tubule with longer half-lives for some agents.",
    useSummary:
      "Loops for edematous states and acute heart failure exacerbations; thiazides as foundational hypertension therapy and hypercalcemia niches for thiazides in advanced teaching; metolazone sequential strategies appear in inpatient protocols under supervision.",
    avoidSummary:
      "Anuria, severe hypokalemia or hyponatremia until corrected, and sulfa allergy histories where cross-reactivity risk is institutionally defined—verify local allergy policy rather than assuming universal avoidance.",
    adverseSummary:
      "Hypokalemia, hypomagnesemia, hyponatremia (especially thiazides), metabolic alkalosis, hypotension, prerenal azotemia, ototoxicity with rapid high-dose loops, and hyperuricemia gout flares.",
    ddiSummary:
      "Additive hypotension with vasodilators; increased digoxin toxicity risk with hypokalemia; lithium reabsorption changes; NSAIDs can blunt diuresis and worsen renal function.",
    monitorSummary:
      "Blood pressure, weight, intake and output, serum sodium, potassium, magnesium, creatinine, uric acid when clinically relevant, and hearing symptoms with rapid IV loops.",
    counselSummary:
      "Take as ordered relative to meals and timing for hypertension; report muscle cramps, palpitations, dizziness, or reduced urine output; do not double doses after missed doses unless directed.",
    specialSummary:
      "Geriatrics: hyponatremia and orthostasis; CKD: thiazide effectiveness can wane while loops remain; hepatic disease: hypokalemia worsens encephalopathy risk—coordinate care teams.",
    examSummary:
      "Prioritize electrolyte checks after aggressive diuresis; distinguish prerenal creatinine rise from hypovolemia versus intrinsic renal injury using context; sequential nephron blockade is protocol-driven, not improvised.",
    memorySummary:
      "Loops climb the thick limb and ‘loop’ out potassium and volume fast; thiazides chill in the DCT and steal sodium more gently but sneak hyponatremia on vulnerable patients.",
    faq: faq4("Loop diuretics compared with thiazide diuretics", [
      "Severe hypokalemia with arrhythmia risk, symptomatic hyponatremia, and acute kidney injury from overdiuresis—stabilize before outpatient teaching answers.",
      "Electrolytes and renal function after dose changes, illness, or new NSAID use.",
      "Teach patients not to use OTC NSAIDs hidden in cold products without review—they can blunt diuresis and injure kidneys.",
      "No; inpatient diuresis protocols require local order sets.",
    ]),
    references: [REFS.hf, REFS.jnc, REFS.fda],
  },
  {
    slug: "insulin-types-onset-duration-pharmacy-guide",
    title: "Insulin Types: Onset, Peak, Duration, and Counseling for Pharmacy Students",
    excerpt:
      "Rapid, short, intermediate, and long-acting insulin pharmacokinetics, U-500 considerations, pump versus basal-bolus concepts, and hypoglycemia safety teaching.",
    seoTitle: "Insulin onset duration pharmacy guide | NurseNest",
    seoDescription:
      "Compare insulin categories, kinetics, storage, mixing rules, sick-day guidance, and licensing exam counseling for diabetes pharmacotherapy.",
    tags: "Insulin, Diabetes, Pharmacology, Pharmacy exams, Clinical pharmacology",
    classLabel: "Insulin formulations by onset and duration",
    moaCore:
      "Insulin promotes peripheral glucose uptake, suppresses hepatic glucose output, and inhibits lipolysis and ketogenesis—pharmacokinetic differences arise from formulation, aggregation state, and concentration rather than the peptide mechanism itself.",
    useSummary:
      "Type 1 diabetes insulin is essential; type 2 diabetes uses basal, prandial, and combination strategies per glycemic targets, comorbidities, cost, and adherence; hospital insulin protocols differ from ambulatory plans.",
    avoidSummary:
      "Hypoglycemia unawareness without risk mitigation plans; intravenous regular insulin requires monitoring pathways distinct from subcutaneous rapid analogs; do not switch U-500 for U-100 without order redesign.",
    adverseSummary:
      "Hypoglycemia, weight gain, lipohypertrophy with site rotation failure, allergic reactions rare with human analogs, and errors from look-alike vials or syringe unit confusion.",
    ddiSummary:
      "Beta blockers may mask tremor and tachycardia of hypoglycemia; corticosteroids raise glucose; quinolones and some antibiotics alter glucose unpredictably—context matters in exam stems.",
    monitorSummary:
      "Blood glucose patterns, A1c, weight, hypoglycemia frequency, injection sites, basal fasting glucose versus postprandial excursions, ketones when ill for insulin-deficient patients.",
    counselSummary:
      "Teach carbohydrate counting linkage to meal doses, sick-day rules, glucagon availability, and never sharing pens; reinforce refrigeration and open-vial stability per labeling.",
    specialSummary:
      "Pediatrics uses family-centered dosing and school plans; geriatrics target less aggressive A1c when hypoglycemia risk dominates; renal failure shifts insulin clearance variably—tight monitoring.",
    examSummary:
      "Distinguish basal versus bolus mistakes, peak-related hypoglycemia timing, and DKA pathways emphasizing fluids, insulin, potassium, and monitoring—not oral agents during acute DKA treatment stems.",
    memorySummary:
      "Rapid analogs for meals act fast; NPH is intermediate with more peak; glargine/detemir/degludec families stretch basal coverage—match kinetics to the pattern on the glucose log.",
    faq: faq4("Insulin formulations by onset and duration", [
      "Hypoglycemia with altered consciousness is an emergency pathway; also prevent fatal errors between U-100 and U-500 concentrations.",
      "Glucose logs, fasting readings, and nocturnal checks after basal changes; ketones during illness for type 1 risk.",
      "Teach glucagon location and expiration; ensure caregivers can administer intranasal or intramuscular rescue per device instructions.",
      "No; insulin dosing is individualized with prescribers and DSMES educators.",
    ]),
    references: [REFS.ada2024, REFS.fda, REFS.ashp],
  },
  {
    slug: "metformin-mechanism-side-effects-pharmacy-review",
    title: "Metformin Mechanism and Side Effects: Clinical Pharmacology for Pharmacy Exams",
    excerpt:
      "AMPK-related hepatic glucose suppression, GI tolerability, vitamin B12 monitoring, renal eGFR thresholds, contrast precautions, and lactic acidosis rarity in modern use.",
    seoTitle: "Metformin mechanism and side effects | NurseNest",
    seoDescription:
      "Metformin MOA, dosing, GI adverse effects, eGFR considerations, drug interactions, and exam-focused counseling for diabetes pharmacotherapy.",
    tags: "Metformin, Diabetes, Pharmacology, Pharmacy exams, Clinical pharmacology",
    classLabel: "Metformin",
    moaCore:
      "Metformin lowers hepatic glucose production, improves insulin sensitivity modestly, and reduces intestinal glucose absorption; cellular AMP-activated protein kinase signaling is central to many teaching explanations.",
    useSummary:
      "First-line type 2 diabetes therapy when tolerated and not contraindicated, polycystic ovary syndrome off-label in some practices, and prediabetes strategies per guideline evolution—verify current ADA chapters.",
    avoidSummary:
      "eGFR below institutionally defined thresholds, acute hypoxic states, severe hepatic impairment, and planned iodinated contrast scenarios per local hold-restart policies.",
    adverseSummary:
      "GI upset and metallic taste early, dose-dependent diarrhea, rare vitamin B12 deficiency with long-term use, and rare lactic acidosis in shock states emphasized more in historical exams than contemporary ambulatory risk.",
    ddiSummary:
      "Cimetidine and carbonic anhydrase inhibitors may raise lactate risk in teaching vignettes; alcohol excess synergizes metabolic stress; many interactions are less dramatic than insulin secretagogues.",
    monitorSummary:
      "eGFR, vitamin B12 if neuropathy or anemia, A1c, GI tolerance during titration, and metabolic panel during acute illness per sick-day education.",
    counselSummary:
      "Take with meals to improve GI tolerance; discuss temporary holds during severe vomiting or dehydration per prescriber; reinforce gradual dose escalation schedules.",
    specialSummary:
      "Geriatrics need renal rechecks after acute illness; contrast imaging pathways require coordinated holds; pediatrics has limited formal approval—specialist contexts only.",
    examSummary:
      "Contrast metformin hold questions with eGFR cutoffs from the stem’s policy; distinguish hypoglycemia risk as low as monotherapy versus combination with insulin or sulfonylureas.",
    memorySummary:
      "Metformin lowers hepatic glucose more than it ‘forces’ insulin out of the pancreas—hypoglycemia risk is mainly in combinations.",
    faq: faq4("Metformin", [
      "Acute kidney injury or severe dehydration with continued therapy; contrast policies when eGFR is borderline—follow the stem’s hospital rule.",
      "eGFR at baseline and after major clinical changes; B12 when hematologic or neuropathic findings appear.",
      "Explain that GI upset often improves with slower titration and meal timing rather than abrupt abandonment without prescriber contact.",
      "No; contrast and renal policies are institution-specific.",
    ]),
    references: [REFS.ada2024, REFS.fda],
  },
  {
    slug: "anticoagulants-pharmacology-overview-pharmacy",
    title: "Anticoagulants Explained: Pharmacology Overview for Pharmacy Licensing",
    excerpt:
      "Compare vitamin K antagonists, parenteral indirect thrombin inhibitors, low molecular weight heparins, and direct oral anticoagulants at a systems level for boards and clinical rotations.",
    seoTitle: "Anticoagulants pharmacology overview | NurseNest",
    seoDescription:
      "Anticoagulant classes, targets, onset-offset themes, bleeding reversal concepts, monitoring, and exam-ready safety framing for pharmacy students.",
    tags: "Anticoagulants, Pharmacology, Coagulation, Pharmacy exams, Clinical pharmacology",
    classLabel: "Anticoagulant drug classes",
    moaCore:
      "Anticoagulants reduce fibrin formation by inhibiting thrombin generation or activity (parenteral agents, warfarin) or by blocking activated factor activity (direct oral inhibitors) with distinct monitoring and reversal profiles.",
    useSummary:
      "Venous thromboembolism treatment and prevention, atrial fibrillation stroke prevention when bleeding risk is acceptable, mechanical valve contexts largely avoid DOACs—follow cardiology guidance in stems.",
    avoidSummary:
      "Active major bleeding, severe platelet disorders without emergent plan, lumbar puncture timing conflicts, and pregnancy or breastfeeding scenarios where agent selection is specialist-led.",
    adverseSummary:
      "Bleeding ranging from nuisance epistaxis to intracranial hemorrhage, heparin-induced thrombocytopenia with unfractionated heparin exposure, skin necrosis early with warfarin protein C shifts in teaching items, and renal accumulation of renally cleared DOACs.",
    ddiSummary:
      "Strong CYP3A4 and P-gp inhibitors or inducers with DOACs; aspirin and NSAIDs increase bleeding; many antibiotics alter warfarin INR; drug-drug review is mandatory at transitions.",
    monitorSummary:
      "Hemoglobin, renal function for DOAC dosing, platelets for heparin exposure, INR for warfarin, anti-Xa assays when protocol-driven, and clinical bleeding checks at every shift.",
    counselSummary:
      "Soft toothbrush, fall precautions, adherence to scheduled labs for warfarin, and immediate reporting of head trauma, melena, or sudden severe headache.",
    specialSummary:
      "Obesity may alter LMWH dosing in some protocols; underweight geriatrics bleed more readily; renal dialysis patients have agent-specific guidance—never memorize one DOAC rule for all.",
    examSummary:
      "Mechanical mitral valve often excludes DOAC in classic teaching; bleeding reversal questions pair agent with specific antidote availability per labeling updates.",
    memorySummary:
      "Think in cascades: initiation (TF pathway), amplification (thrombin burst), propagation—each drug class interrupts a different rung.",
    faq: faq4("Anticoagulant drug classes", [
      "Life-threatening bleeding and intracranial hemorrhage pathways outrank outpatient teaching in acute stems.",
      "INR for warfarin; renal function and sometimes anti-Xa for heparins; renal function and drug interaction review for DOACs.",
      "Patients should avoid starting aspirin or NSAIDs without review when anticoagulated.",
      "No; anticoagulation is high-alert therapy requiring order verification.",
    ]),
    references: [REFS.chestVte, REFS.fda, REFS.ashp],
  },
  {
    slug: "heparin-vs-enoxaparin-comparison-pharmacy",
    title: "Heparin vs Enoxaparin: Pharmacy Comparison of Monitoring and Use Cases",
    excerpt:
      "Unfractionated heparin versus enoxaparin pharmacology, anti-Xa monitoring, renal adjustments, protamine reversal nuances, and perioperative bridging themes for exams.",
    seoTitle: "Heparin vs enoxaparin pharmacy comparison | NurseNest",
    seoDescription:
      "Compare UFH and LMWH for VTE, ACS contexts in curricula, monitoring, reversal, HIT risk framing, and renal dosing considerations.",
    tags: "Heparin, Enoxaparin, Anticoagulation, Pharmacy exams, Clinical pharmacology",
    classLabel: "Unfractionated heparin compared with enoxaparin",
    moaCore:
      "Both potentiate antithrombin to inactivate thrombin and factor Xa, but unfractionated heparin’s shorter chain heterogeneity yields more aPTT sensitivity and more predictable protamine reversal teaching, while enoxaparin preferentially inhibits factor Xa with subcutaneous convenience and renal clearance dependence.",
    useSummary:
      "VTE treatment and prophylaxis, acute coronary syndrome when protocols specify, procedural anticoagulation requiring rapid offset with UFH, and inpatient transitions where anti-Xa assays support LMWH in special populations per policy.",
    avoidSummary:
      "Major bleeding, suspected HIT with ongoing thrombosis, severe renal failure for renally cleared LMWH without dose adjustment pathways, and neuraxial anesthesia timing violations.",
    adverseSummary:
      "Bleeding, HIT with UFH more classically emphasized, osteoporosis with prolonged use, hyperkalemia in adrenal-insufficiency teaching vignettes, and injection site hematomas.",
    ddiSummary:
      "Platelet inhibitors increase bleeding; drugs affecting renal function alter LMWH accumulation; nitroglycerin may reduce UFH effect in some teaching references—verify current interaction databases.",
    monitorSummary:
      "aPTT or anti-Xa for UFH per protocol; platelet surveillance for HIT pathways; renal function for enoxaparin; hemoglobin and signs of occult bleeding.",
    counselSummary:
      "Patients rarely self-inject UFH; for outpatient LMWH, teach injection technique, missed-dose rules, and bleeding precautions identical to other anticoagulants.",
    specialSummary:
      "Morbid obesity may require dose capping or anti-Xa guidance; dialysis patients need specialist dosing; pregnancy uses LMWH rather than warfarin in modern teaching arcs.",
    examSummary:
      "Protamine reverses UFH fully in teaching simplifications but only partially reverses LMWH—know the exam’s expected nuance; HIT requires stopping heparin and non-heparin anticoagulation per protocol.",
    memorySummary:
      "UFH is dialyzable and titratable; LMWH is smoother subcutaneously but sneaks up in bad kidneys.",
    faq: faq4("Unfractionated heparin compared with enoxaparin", [
      "HIT with thrombosis is an emergency pathway; major bleeding requires reversal and supportive care per protocol.",
      "Platelet trends for HIT suspicion; aPTT or anti-Xa for UFH; creatinine for LMWH dosing.",
      "Never continue heparin products if high-probability HIT without specialist-directed alternative anticoagulation.",
      "No; perioperative bridging is protocol and risk-score driven.",
    ]),
    references: [REFS.chestVte, REFS.fda],
  },
  {
    slug: "warfarin-inr-monitoring-pharmacy-explained",
    title: "Warfarin INR Monitoring Explained for Pharmacy Students and Clinical Practice",
    excerpt:
      "Vitamin K epoxide reductase inhibition, INR targets, dietary consistency teaching, genotype considerations in curricula, and bleeding reversal education without replacing protocols.",
    seoTitle: "Warfarin INR monitoring pharmacy guide | NurseNest",
    seoDescription:
      "Warfarin mechanism, INR interpretation, interaction clusters, bridging, perioperative holds, and patient counseling for licensing exams.",
    tags: "Warfarin, INR, Anticoagulation, Pharmacy exams, Clinical pharmacology",
    classLabel: "Warfarin and INR monitoring",
    moaCore:
      "Warfarin inhibits vitamin K epoxide reductase complex 1, reducing synthesis of functional factors II, VII, IX, and X as well as proteins C and S, producing delayed anticoagulation mirrored by INR changes after several days.",
    useSummary:
      "Atrial fibrillation stroke prevention, venous thromboembolism extended therapy when indicated, mechanical valve anticoagulation in warfarin-predominant teaching scenarios, and recurrent thrombosis contexts per guideline.",
    avoidSummary:
      "Pregnancy, major bleeding without controlled reversal plan, nonadherence without safeguards, and concurrent interacting drugs without INR surveillance.",
    adverseSummary:
      "Bleeding, skin necrosis early with protein C deficiency teaching cases, purple toe syndrome rare boards trivia, and supratherapeutic INR with bleeding or without bleeding requiring different pathways.",
    ddiSummary:
      "Antibiotics altering gut flora and CYP metabolism, amiodarone, azole antifungals, acute illness changing albumin, and acute alcohol swings—exams love antibiotic plus supratherapeutic INR vignettes.",
    monitorSummary:
      "INR frequency after any change, hemoglobin, occult bleeding assessment, liver function when indicated, genotype where institutionally available, and medication reconciliation every visit.",
    counselSummary:
      "Vitamin K consistency rather than elimination; limit binge alcohol; use pill organizers; immediate evaluation for head injury even if asymptomatic; carry indication documentation.",
    specialSummary:
      "Elderly have higher bleeding sensitivity; heart failure and hyperthyroidism can exaggerate INR; Asian ancestry pharmacogenomic teaching may appear—follow stem genotyping results only.",
    examSummary:
      "INR 10 without bleeding versus with bleeding chooses different management tiers in teaching models; always add fall and head injury surveillance counseling.",
    memorySummary:
      "Factors drop in days but clot risk normalizes slower than early INR changes suggest—bridging questions test timing literacy.",
    faq: faq4("Warfarin and INR monitoring", [
      "Intracranial hemorrhage and hemodynamic instability beat outpatient INR recheck timing questions.",
      "INR after antibiotic starts, dose changes, hospital discharge, or acute illness.",
      "Teach patients to avoid starting new antibiotics or antifungals without INR follow-up planning.",
      "No; reversal agents and PCC use are protocolized.",
    ]),
    references: [REFS.chestVte, REFS.fda],
  },
  {
    slug: "doac-medications-overview-pharmacy-licensing",
    title: "DOAC Medications Overview: Apixaban, Rivaroxaban, Dabigatran, and Edoxaban for Pharmacy Exams",
    excerpt:
      "Direct thrombin versus factor Xa inhibition, renal dosing anchors, p-gp and CYP interaction clusters, perioperative management themes, and reversal agent education at overview depth.",
    seoTitle: "DOAC medications pharmacy overview | NurseNest",
    seoDescription:
      "Compare DOAC mechanisms, renal elimination differences, major interactions, stroke prevention in AF, and VTE treatment durations at exam depth.",
    tags: "DOAC, Anticoagulation, Pharmacology, Pharmacy exams, Clinical pharmacology",
    classLabel: "Direct oral anticoagulants (DOACs)",
    moaCore:
      "DOACs directly inhibit thrombin (dabigatran) or factor Xa (apixaban, rivaroxaban, edoxaban) without requiring antithrombin scaffolding, producing predictable dose-response compared with warfarin yet still demanding renal and interaction vigilance.",
    useSummary:
      "Nonvalvular atrial fibrillation stroke prevention when CHA2DS2-VASc supports therapy, VTE treatment and extended prophylaxis per agent labeling, and hospital-to-home transitions with pharmacy verification.",
    avoidSummary:
      "Mechanical mitral valve in classic teaching, triple-positive antiphospholipid syndrome scenarios in advanced warnings, severe active bleeding, and pregnancy.",
    adverseSummary:
      "Bleeding, dyspepsia with dabigatran, elevated liver enzymes uncommon but monitored in trials context, and renal accumulation leading to supratherapeutic exposure.",
    ddiSummary:
      "Strong dual P-gp and CYP3A4 inhibitors or inducers alter apixaban and rivaroxaban; P-gp alone matters for dabigatran; check current labeling tables rather than memorizing one inhibitor list forever.",
    monitorSummary:
      "Renal function at baseline and intervals, hemoglobin, adherence, weight extremes, and perioperative hold-restart instructions tied to half-life and bleeding risk.",
    counselSummary:
      "Take with food when labeling requires; do not crush dabigatran capsules; store properly; report black stools, hematuria, or severe headache; carry wallet cards listing agent and indication.",
    specialSummary:
      "Low body weight and advanced age increase bleeding; dialysis patients have agent-specific labeling evolution—use updated references; avoid pregnancy.",
    examSummary:
      "Mechanical valve contraindication distractors; renal dose adjustments; timing of last dose before procedures per hospital policy questions.",
    memorySummary:
      "Dabigatran is the direct thrombin inhibitor tablet; the others are factor Xa tablets—renal clearance dominates dabigatran exams.",
    faq: faq4("Direct oral anticoagulants (DOACs)", [
      "Major bleeding and intracranial hemorrhage; also recognize accumulating drug in acute kidney injury.",
      "Creatinine-based dosing intervals; verify interaction checks after new HIV or antifungal therapy.",
      "Patients should not independently double doses after missed doses—follow label-specific catch-up rules.",
      "No; reversal strategies are agent-specific and protocolized.",
    ]),
    references: [REFS.chestVte, REFS.fda, REFS.ashp],
  },
  {
    slug: "opioid-pharmacology-basics-pharmacy-exams",
    title: "Opioid Pharmacology Basics: Receptors, Analgesia, and Risk for Pharmacy Students",
    excerpt:
      "Mu-opioid receptor agonism, equianalgesic teaching cautions, constipation prophylaxis, respiratory depression recognition, tolerance versus dependence, and multimodal analgesia framing.",
    seoTitle: "Opioid pharmacology basics | NurseNest",
    seoDescription:
      "Opioid mechanisms, common adverse effects, overdose physiology, MME concepts in curricula, and exam-focused patient safety counseling.",
    tags: "Opioids, Pharmacology, Pain, Pharmacy exams, Clinical pharmacology",
    classLabel: "Opioid analgesics",
    moaCore:
      "Full opioid agonists activate mu receptors in brain and spinal cord circuits to reduce pain perception and emotional distress while also depressing medullary respiratory centers and reducing gastrointestinal motility.",
    useSummary:
      "Moderate-to-severe acute pain when multimodal plans exist, cancer pain pathways, and carefully selected chronic noncancer pain scenarios with risk mitigation programs per guideline evolution.",
    avoidSummary:
      "Acute severe asthma or unmanaged sleep apnea without escalation plan, concurrent benzodiazepines without documented risk mitigation, and opioid use disorder without appropriate specialty pathways in teaching stems.",
    adverseSummary:
      "Respiratory depression, sedation, nausea and vomiting, constipation, urinary retention, pruritus, hormonal effects with chronic use, and overdose with miosis until late hypoxia.",
    ddiSummary:
      "Benzodiazepines, gabapentinoids, alcohol, CYP3A4 modifiers changing methadone or fentanyl exposure, and serotonergic drugs raising seizure or interaction questions in advanced items.",
    monitorSummary:
      "Respiratory rate, sedation scores, bowel regimen, pain scores with function goals, urine drug testing where programs exist, and naloxone coprescribing documentation.",
    counselSummary:
      "Never share opioids; store locked; take exactly as prescribed; avoid alcohol; use stool softeners proactively; know overdose signs in household members.",
    specialSummary:
      "Geriatrics have higher falls and respiratory depression risk; renal impairment prolongs morphine active metabolites; hepatic impairment affects metabolism of many agents—avoid one-size dosing.",
    examSummary:
      "Identify respiratory depression before teaching; prioritize naloxone and airway support in overdose stems; distinguish tolerance from opioid use disorder definitions at exam precision.",
    memorySummary:
      "Mu for morphine-like main effects; constipation arrives early and stays—prophylax before crisis.",
    faq: faq4("Opioid analgesics", [
      "Respiratory depression and overdose; benzodiazepine co-ingestion worsens apnea.",
      "Sedation scales, respiratory rate, and bowel movements on opioid initiation.",
      "Teach safe storage and disposal; community take-back reduces diversion.",
      "No; equianalgesic tables require clinical judgment and are not automatic calculators.",
    ]),
    references: [REFS.glover2020opioid, REFS.fda, REFS.ashp],
  },
  {
    slug: "naloxone-mechanism-administration-pharmacy-guide",
    title: "Naloxone Mechanism and Administration: Pharmacy Training for Opioid Emergency Response",
    excerpt:
      "Competitive mu-opioid antagonism, intranasal versus intramuscular products, redosing strategies in education, precipitated withdrawal recognition, and community access laws at overview level.",
    seoTitle: "Naloxone mechanism and administration | NurseNest",
    seoDescription:
      "Naloxone MOA, routes, dosing education, duration shorter than long-acting opioids, and post-reversal monitoring for pharmacy learners.",
    tags: "Naloxone, Opioids, Emergency, Pharmacy exams, Clinical pharmacology",
    classLabel: "Naloxone for opioid reversal",
    moaCore:
      "Naloxone competitively displaces opioids from mu receptors, rapidly reversing respiratory depression when plasma levels reach the receptor compartment, but its duration may be shorter than long-acting opioids necessitating repeat doses and observation.",
    useSummary:
      "Suspected opioid overdose in community and prehospital settings, peri-anesthesia reversal in controlled environments, and harm-reduction programs distributing intranasal devices.",
    avoidSummary:
      "Do not rely on naloxone alone without activating emergency medical services except in transient witnessed reversal with clear protocols—exam stems still emphasize EMS activation.",
    adverseSummary:
      "Precipitated opioid withdrawal with vomiting, agitation, tachycardia, and pulmonary edema rare teaching complications; repeat overdose if naloxone wears off before long-acting opioid.",
    ddiSummary:
      "Partial agonists like buprenorphine may require higher naloxone doses in complex teaching scenarios; otherwise naloxone has few classic pharmacokinetic interactions because duration is short.",
    monitorSummary:
      "Respiratory rate, oxygen saturation, mental status, emesis aspiration risk, and need for repeat dosing every few minutes until sustained improvement or EMS arrival.",
    counselSummary:
      "Lay rescuers should call emergency services, place patient in recovery position, administer device per package, and remain with patient because sedation can return.",
    specialSummary:
      "Pregnancy: prioritize maternal oxygenation; pediatric dosing uses weight-based algorithms in references; geriatric patients may have comorbid cardiopulmonary disease worsened by catecholamine surge.",
    examSummary:
      "Airway first; naloxone next; transport for observation; distinguish partial reversal requiring oxygen from false reassurance when long-acting agents are on board.",
    memorySummary:
      "Naloxone is short; methadone and sustained-release oxycodone are long—observe longer than you want.",
    faq: faq4("Naloxone for opioid reversal", [
      "Return of respiratory depression after initial improvement when long-acting opioids remain.",
      "Respiratory rate and oxygen saturation every few minutes until stable handoff.",
      "Teach second dose timing per device instructions and not to abandon the patient after first spray.",
      "No; naloxone education complements EMS and does not replace emergency care.",
    ]),
    references: [REFS.glover2020opioid, REFS.fda],
  },
  {
    slug: "antibiotic-classes-pharmacology-overview",
    title: "Antibiotic Classes Explained: Cell Wall, Protein Synthesis, and DNA Targets for Pharmacy Exams",
    excerpt:
      "Beta-lactams, glycopeptides, aminoglycosides, fluoroquinolones, macrolides, tetracyclines, oxazolidinones, and nitroimidazoles mapped to spectra and toxicities for rapid board review.",
    seoTitle: "Antibiotic classes pharmacology overview | NurseNest",
    seoDescription:
      "Mechanism tables, gram coverage themes, resistance drivers, major toxicities, and monitoring hooks for pharmacy licensing microbiology integration.",
    tags: "Antibiotics, Infectious disease, Pharmacology, Pharmacy exams",
    classLabel: "Major antibiotic classes",
    moaCore:
      "Beta-lactams inhibit cell wall synthesis; aminoglycosides and macrolides bind ribosomal subunits; fluoroquinolones inhibit DNA gyrase and topoisomerase IV; glycopeptides trap peptidoglycan precursors at the cell membrane.",
    useSummary:
      "Empiric therapy guided by site, severity, allergy history, local antibiogram, and PK-PD targets like time above MIC for beta-lactams or AUC/MIC for vancomycin in advanced teaching.",
    avoidSummary:
      "Drug-class specific: fluoroquinolone tendon and QT risks in vulnerable patients; aminoglycosides in prolonged unnecessary exposure; tetracyclines in pregnancy teaching items.",
    adverseSummary:
      "C. difficile colitis across classes, allergic reactions with beta-lactams, QT prolongation with macrolides and fluoroquinolones, tendinopathy, photosensitivity, teeth staining with tetracyclines in pediatrics.",
    ddiSummary:
      "Warfarin shifts with antibiotics altering flora or CYP; statin interactions with macrolides; valproate with carbapenems in rare ID items; always reconcile home meds on antibiotic start.",
    monitorSummary:
      "Renal dose adjustments, cultures, inflammatory markers when ordered, drug levels for narrow agents, ECG when QT risk stacks, and diarrhea surveillance.",
    counselSummary:
      "Complete prescribed courses when indicated for certain infections but not blindly for all scenarios; report rash, tendon pain, palpitations, or bloody diarrhea promptly.",
    specialSummary:
      "Neonates require meningeal dosing for CNS infections; geriatrics accumulate drugs with renal clearance; pregnancy antibiotic safety lists are memorization-heavy on boards.",
    examSummary:
      "Match bug to drug by stem clues and avoid treating viral illness with antibiotics; prioritize culture-directed narrowing when stable.",
    memorySummary:
      "Wall, ribosome, DNA—three big buckets; toxicity tags ride along with each bucket on exams.",
    faq: faq4("Major antibiotic classes", [
      "C. difficile and severe allergic reactions; also QT stacking with multiple offenders.",
      "Renal function for dose adjustments; vancomycin levels when protocols demand.",
      "Patients should not hoard leftover antibiotics for future self-diagnosis.",
      "No; antibiogram and culture data drive real therapy.",
    ]),
    references: [REFS.idsaCap, REFS.ashp, REFS.fda],
  },
  {
    slug: "vancomycin-therapeutic-monitoring-pharmacy-basics",
    title: "Vancomycin Monitoring Basics: AUC-Guided Concepts and Infusion Reaction Education",
    excerpt:
      "Time-dependent killing, trough versus AUC targets in modern curricula, nephrotoxicity surveillance, red man syndrome histamine release, and infusion rate counseling.",
    seoTitle: "Vancomycin monitoring pharmacy basics | NurseNest",
    seoDescription:
      "Vancomycin PK-PD targets, monitoring labs, nephrotoxicity risk factors, infusion reactions, and exam questions on dosing adjustments.",
    tags: "Vancomycin, Pharmacokinetics, Infectious disease, Pharmacy exams",
    classLabel: "Vancomycin therapeutic monitoring",
    moaCore:
      "Vancomycin inhibits cell wall peptidoglycan polymerization in gram-positive organisms; efficacy ties to exposure relative to MIC while toxicity rises with excessive troughs or prolonged elevated AUC in teaching models.",
    useSummary:
      "MRSA bacteremia, complicated skin infections, meningitis when combined with other agents per guideline, and severe C difficile oral therapy appears in separate teaching track—do not confuse routes.",
    avoidSummary:
      "Rapid infusion in patients with prior infusion reaction without premedication per protocol; unnecessary prolonged therapy increasing nephrotoxicity; ignoring drug interactions that raise levels.",
    adverseSummary:
      "Nephrotoxicity, ototoxicity teaching pairings with loop diuretics and aminoglycosides, red man syndrome with rapid infusion, and hypersensitivity rare patterns.",
    ddiSummary:
      "Aminoglycoside synergy raises nephrotoxicity; piperacillin-tazobactam interaction literature appears in advanced hospital pharmacy teaching—verify current institutional summaries.",
    monitorSummary:
      "Serum creatinine, urine output, trough or AUC per protocol, cultures clearing, and audiologic monitoring in prolonged high-exposure teaching cases.",
    counselSummary:
      "Inpatient education focuses on reporting tinnitus, rash during infusion, and decreased urine output; outpatient oral vancomycin teaching differs entirely for C difficile.",
    specialSummary:
      "Obesity affects volume of distribution; neonates and dialysis patients need specialist PK dosing; geriatrics have narrower renal reserve.",
    examSummary:
      "AUC/MIC targets versus trough-only historical teaching; prioritize renal checks when vancomycin and nephrotoxins overlap.",
    memorySummary:
      "Slow the infusion to soothe the histamine flush; watch creatinine when troughs climb.",
    faq: faq4("Vancomycin therapeutic monitoring", [
      "Nephrotoxicity and infusion-related hypotension or red man syndrome depending on infusion rate.",
      "Creatinine at least every 24–72 hours in stable inpatients more often if unstable—follow stem order frequency.",
      "Nurses should pause infusion and notify prescriber for widespread flushing with stable airway per protocol.",
      "No; AUC methods require pharmacy collaboration and Bayesian tools in many hospitals.",
    ]),
    references: [REFS.idsaCap, REFS.ashp, REFS.fda],
  },
  {
    slug: "aminoglycoside-toxicity-pharmacy-review",
    title: "Aminoglycoside Toxicity Review: Nephrotoxicity, Ototoxicity, and Once-Daily Dosing Concepts",
    excerpt:
      "Concentration-dependent killing, peak and trough teaching legacy, extended interval dosing, synergy with beta-lactams, and adjustment for obesity and critical illness for exams.",
    seoTitle: "Aminoglycoside toxicity pharmacy review | NurseNest",
    seoDescription:
      "Aminoglycoside mechanisms, toxicity patterns, monitoring, drug interactions, and exam-ready PK pearls for pharmacy students.",
    tags: "Aminoglycosides, Nephrotoxicity, Pharmacology, Pharmacy exams",
    classLabel: "Aminoglycoside antibiotics",
    moaCore:
      "Aminoglycosides bind the 30S ribosomal subunit causing misreading and concentration-dependent bactericidal activity requiring high peaks relative to MIC while avoiding prolonged trough exposure that drives nephrotoxicity and ototoxicity.",
    useSummary:
      "Gram-negative serious infections, endocarditis synergy regimens, and selected mycobacterial therapies in specialized curricula—always paired with renal monitoring.",
    avoidSummary:
      "Myasthenia gravis exacerbation, prolonged unnecessary therapy without levels, and concurrent loop diuretics and vancomycin without heightened surveillance in teaching vignettes.",
    adverseSummary:
      "Acute kidney injury often subtle early, vestibulotoxicity and cochleotoxicity, neuromuscular blockade potentiation with anesthetics in rare OR questions.",
    ddiSummary:
      "Vancomycin synergy toxicity stacks; cephalosporins rarely cited with false renal panels in trivia; neuromuscular blockers in ICU combo stems.",
    monitorSummary:
      "Creatinine, urine output, drug levels per extended interval protocol, audiologic symptoms, and neurologic checks in ICU patients.",
    counselSummary:
      "Inpatient-focused teaching: report ringing, vertigo, or decreased urine output; outpatient use is uncommon except specialized TB clinics.",
    specialSummary:
      "Obesity uses adjusted body weight dosing for gentamicin in many protocols; cystic fibrosis alters PK; dialysis requires redosing schedules per pharmacy.",
    examSummary:
      "Extended interval gentamicin peaks and trough timing questions; synergy for enterococcal endocarditis regimens appear as classic pairs.",
    memorySummary:
      "High peak kills bugs; high trough kills kidneys and ears—keep the valley low.",
    faq: faq4("Aminoglycoside antibiotics", [
      "Rising creatinine with low urine output while on vancomycin plus aminoglycoside dual therapy.",
      "Trough levels before next dose in traditional models; extended interval uses different sampling—follow stem protocol names.",
      "Teach patients to report tinnitus immediately even if mild.",
      "No; dosing is PK service or protocol guided in tertiary care.",
    ]),
    references: [REFS.idsaCap, REFS.ashp],
  },
  {
    slug: "ssris-vs-snris-comparison-pharmacy-clinical",
    title: "SSRIs vs SNRIs: Mechanism Comparison and Clinical Selection for Pharmacy Students",
    excerpt:
      "Serotonin reuptake selectivity versus dual serotonin-norepinephrine reuptake, anxiety and depression indications, discontinuation syndromes, bleeding with NSAIDs, and hypertension monitoring with SNRIs.",
    seoTitle: "SSRIs vs SNRIs pharmacy comparison | NurseNest",
    seoDescription:
      "Compare SSRI and SNRI mechanisms, adverse effects, interactions, peripartum teaching themes, and exam counseling for depression and neuropathic pain contexts.",
    tags: "SSRI, SNRI, Psychiatry, Pharmacology, Pharmacy exams",
    classLabel: "SSRIs compared with SNRIs",
    moaCore:
      "SSRIs selectively inhibit serotonin reuptake at the presynaptic terminal, while SNRIs inhibit both serotonin and norepinephrine reuptake, increasing noradrenergic tone relevant to pain and vasomotor symptom teaching items.",
    useSummary:
      "Major depressive disorder, generalized anxiety disorder for certain agents, obsessive compulsive disorder for higher-dose SSRI teaching, diabetic peripheral neuropathy and fibromyalgia for some SNRIs per labeling snapshots.",
    avoidSummary:
      "Concomitant MAOIs or linezolid serotonergic stacking, untreated bipolar mania precipitation teaching, and uncontrolled hypertension with SNRIs in susceptible patients.",
    adverseSummary:
      "GI upset, sexual dysfunction, insomnia or sedation agent-dependent, hyponatremia especially elderly, SNRI dose-dependent hypertension, bleeding with NSAID co-use, and discontinuation syndromes if stopped abruptly.",
    ddiSummary:
      "CYP2D6 and 3A4 interactions vary by agent; tramadol and triptans raise serotonin syndrome teaching risk; warfarin bleeding with SSRIs via platelet serotonin effects in exam explanations.",
    monitorSummary:
      "Mood symptom scales, blood pressure for SNRIs, sodium early in therapy, bleeding signs with antiplatelets, and suicidal ideation frequency per black box teaching reminders in adolescents early after start.",
    counselSummary:
      "Therapeutic lag weeks; do not stop suddenly; report agitation, mania symptoms, or suicidality immediately; avoid alcohol excess.",
    specialSummary:
      "Pregnancy risk-benefit discussions require specialist input; geriatrics start low go slow; hepatic impairment alters some agents’ maximum doses.",
    examSummary:
      "Serotonin syndrome stem with agitation, clonus, autonomic instability after serotonergic addition; SNRI hypertension in forgotten home BP checks.",
    memorySummary:
      "SSRI is mostly S; SNRI adds NE—think BP and pain syndromes for SNRI exam tags.",
    faq: faq4("SSRIs compared with SNRIs", [
      "Serotonin syndrome and hypertensive urgency with SNRIs depending on stem cocktail.",
      "Blood pressure after SNRI titration; sodium in elderly within first weeks.",
      "Teach delayed onset of antidepressant effect to prevent premature abandonment.",
      "No; peripartum medication choice requires obstetric psychiatry collaboration.",
    ]),
    references: [REFS.serotoninNice, REFS.ashp, REFS.fda],
  },
  {
    slug: "antipsychotic-side-effects-pharmacy-clinical-guide",
    title: "Antipsychotic Side Effects Explained: EPS, Metabolic, and QT Risks for Pharmacy Exams",
    excerpt:
      "D2 antagonism extrapyramidal symptoms, prolactin elevation, anticholinergic burden, metabolic syndrome monitoring, and QT prolongation with ziprasidone-like teaching anchors.",
    seoTitle: "Antipsychotic side effects pharmacy guide | NurseNest",
    seoDescription:
      "First versus second generation antipsychotic adverse effect profiles, monitoring labs, tardive dyskinesia screening, and exam counseling for pharmacy students.",
    tags: "Antipsychotics, Psychiatry, Pharmacology, Pharmacy exams",
    classLabel: "Antipsychotic medications",
    moaCore:
      "Antipsychotics antagonize dopamine D2 receptors in mesolimbic pathways to reduce positive psychotic symptoms while also affecting nigrostriatal pathways (EPS), tuberoinfundibular prolactin effects, and cortical circuits tied to cognition and negative symptoms depending on agent.",
    useSummary:
      "Schizophrenia spectrum disorders, bipolar mania stabilization, adjunct major depression for some second-generation agents, and antiemetic dopamine antagonist crossovers appear in side-effect teaching even when not primary psychiatry.",
    avoidSummary:
      "Lewy body dementia antipsychotic sensitivity teaching, prolonged QT with multiple risk factors without monitoring, and seizure threshold lowering contexts with clozapine teaching.",
    adverseSummary:
      "Acute dystonia, akathisia, parkinsonism, tardive dyskinesia, hyperprolactinemia, metabolic weight gain and dyslipidemia, somnolence, orthostasis, anticholinergic dry mouth and constipation, and agranulocytosis with clozapine REMS.",
    ddiSummary:
      "CYP3A4 and 1A2 inducers or inhibitors change clozapine and olanzapine levels; QT prolonging stacks; anticholinergic burden with tricyclics in geriatrics.",
    monitorSummary:
      "AIMS exams for tardive dyskinesia where programs exist, fasting glucose and lipids for metabolic monitoring, prolactin if symptoms, ECG baseline for QT-risk agents, ANC for clozapine per REMS.",
    counselSummary:
      "Do not stop suddenly after chronic therapy without prescriber; report tongue thrusting, pill rolling tremor, fever with rigidity, or sore throat with clozapine.",
    specialSummary:
      "Geriatrics: stroke mortality boxed warning context for dementia-related psychosis teaching; pediatrics uses lower doses with growth monitoring; pregnancy risk categories require specialist input.",
    examSummary:
      "Neuroleptic malignant syndrome versus serotonin syndrome distractors using rigidity and CK; prioritize cooling and ICU pathways in NMS stems.",
    memorySummary:
      "High potency first gen hits EPS; many second gens hit metabolic—match the side effect to the receptor and off-target pharmacology profile.",
    faq: faq4("Antipsychotic medications", [
      "NMS with hyperthermia and rigidity; also severe neutropenia on clozapine.",
      "AIMS or movement checks; metabolic panels after starting olanzapine-like agents.",
      "Patients should report involuntary facial movements early—TD may be partially reversible if caught.",
      "No; clozapine REMS is a legal distribution program learners must respect.",
    ]),
    references: [REFS.ashp, REFS.fda],
  },
  {
    slug: "serotonin-syndrome-overview-pharmacy-exams",
    title: "Serotonin Syndrome Overview: Recognition and Exam Prioritization for Pharmacy Students",
    excerpt:
      "Serotonergic toxidrome triad of mental status change, autonomic instability, and neuromuscular hyperactivity including clonus; common precipitants; supportive care themes; differentiation from NMS.",
    seoTitle: "Serotonin syndrome overview pharmacy | NurseNest",
    seoDescription:
      "Serotonin syndrome mechanisms, Hunter criteria teaching, precipitating drug combinations, and emergency management overview for licensing exams.",
    tags: "Serotonin syndrome, Pharmacology, Toxicology, Pharmacy exams",
    classLabel: "Serotonin syndrome",
    moaCore:
      "Excessive serotonergic agonism at central and peripheral 5-HT receptors produces a spectrum from mild agitation and tremor to life-threatening hyperthermia, clonus, and autonomic storms when combinations overwhelm clearance and reuptake inhibition.",
    useSummary:
      "Educational focus: preventing combinations of MAOIs, SSRIs, SNRIs, triptans, linezolid, methylene blue, dextromethorphan, and MDMA in exam polypharmacy stems.",
    avoidSummary:
      "Do not add serotonergic agents to stable regimens without interaction review; avoid abrupt high-dose cross-titration errors in teaching scenarios.",
    adverseSummary:
      "Hyperreflexia and inducible clonus, hyperthermia, diarrhea, diaphoresis, mydriasis, and potential rhabdomyolysis in severe cases.",
    ddiSummary:
      "Classic exam stacks: SSRI plus MAOI; SSRI plus tramadol; SNRI plus triptan with additional serotonergic boosters—always read medication lists holistically.",
    monitorSummary:
      "Vital signs, mental status, clonus exam, CK, renal function with rhabdomyolysis, and continuous observation until improvement after stopping offenders.",
    counselSummary:
      "Patients should carry updated medication lists including OTC cough suppressants and herbal serotonergic supplements like St John’s wort when relevant.",
    specialSummary:
      "Pediatric accidental ingestions appear in poison center teaching; geriatric polypharmacy raises risk; renal failure prolongs serotonergic drug half-lives.",
    examSummary:
      "Differentiate NMS with lead-pipe rigidity and slower onset from serotonin syndrome with clonus and GI hyperactivity in many teaching comparisons.",
    memorySummary:
      "Clonus plus serotonergic stack equals syndrome until proven otherwise—cool, stop drugs, support ABCs.",
    faq: faq4("Serotonin syndrome", [
      "Hyperthermia and autonomic instability with neuromuscular excitation—stabilize ABCs and stop serotonergic agents.",
      "Frequent vitals and neuro checks until sustained improvement in ED observation.",
      "Teach patients to avoid adding OTC dextromethorphan or St John’s wort without pharmacist review.",
      "No; cyproheptadine use is institution-specific in advanced care.",
    ]),
    references: [REFS.serotoninNice, REFS.ashp],
  },
  {
    slug: "corticosteroids-adverse-effects-pharmacy-review",
    title: "Corticosteroid Adverse Effects: HPA Axis, Metabolic, and Infection Risks for Pharmacy Exams",
    excerpt:
      "Glucocorticoid receptor genomic effects, hyperglycemia, hypertension, osteoporosis, mood changes, adrenal suppression with chronic use, and perioperative stress-dose teaching at overview depth.",
    seoTitle: "Corticosteroid adverse effects pharmacy | NurseNest",
    seoDescription:
      "Steroid side effect clusters, bone protection strategies in curricula, infection vigilance, and taper concepts for pharmacy licensing review.",
    tags: "Corticosteroids, Endocrine, Pharmacology, Pharmacy exams",
    classLabel: "Systemic corticosteroids",
    moaCore:
      "Glucocorticoids bind cytosolic receptors and regulate gene transcription of anti-inflammatory proteins while suppressing pro-inflammatory mediators; mineralocorticoid activity varies by agent potency and dose.",
    useSummary:
      "Asthma exacerbations, COPD exacerbations, autoimmune flares, adrenal insufficiency replacement, cancer supportive care, and transplant immunosuppression in advanced curricula.",
    avoidSummary:
      "Uncontrolled infection without antimicrobial plan, live vaccine timing conflicts during high doses, and abrupt cessation after chronic suppression without taper teaching.",
    adverseSummary:
      "Hyperglycemia, hypertension, weight gain, mood lability, insomnia, cataracts, avascular necrosis, skin thinning, osteoporosis, adrenal suppression, and infection reactivation.",
    ddiSummary:
      "NSAIDs increase GI bleed risk; CYP3A4 inducers lower steroid exposure; oral hypoglycemic needs rise with steroid-induced hyperglycemia.",
    monitorSummary:
      "Glucose, blood pressure, bone density when indicated, infection signs, mood checks, eye exams with chronic use, and morning cortisol if adrenal suppression suspected.",
    counselSummary:
      "Never stop long-term steroids suddenly without medical guidance; take with food if gastric upset; report fever, confusion, or black stools.",
    specialSummary:
      "Pediatrics: growth suppression; geriatrics: fractures and glucose spikes; pregnancy: cleft lip risk in first trimester high-dose teaching items—specialist led.",
    examSummary:
      "Stress-dose hydrocortisone perioperatively for chronic steroid users in classic stems; match infection vigilance teaching to dose and duration.",
    memorySummary:
      "Steroids sweeten the blood, stiffen vessels, hollow the bones, and quiet the adrenal glands if used too long.",
    faq: faq4("Systemic corticosteroids", [
      "Adrenal crisis risk with abrupt stop after chronic therapy; infection with high-dose bursts.",
      "Glucose and blood pressure during prednisone tapers and dose changes.",
      "Patients should carry steroid cards listing daily dose and duration for emergencies.",
      "No; stress-dose protocols are anesthesia and endocrine collaborative.",
    ]),
    references: [REFS.glucocorticoidBsir, REFS.fda, REFS.ashp],
  },
  {
    slug: "asthma-medications-pharmacology-explained",
    title: "Asthma Medications Explained: Relievers, Controllers, and Biologics Pathways for Pharmacy Students",
    excerpt:
      "SABA rescue, inhaled corticosteroid controllers, LABA combination safety framing, LAMA add-on, leukotriene modifiers, and biologic eligibility themes at overview depth for boards.",
    seoTitle: "Asthma medications pharmacology | NurseNest",
    seoDescription:
      "Asthma drug classes, inhaler technique counseling, step therapy concepts, and safety around LABA monotherapy warnings in exam items.",
    tags: "Asthma, Pulmonary, Pharmacology, Pharmacy exams",
    classLabel: "Asthma pharmacotherapy",
    moaCore:
      "Short-acting beta-2 agonists relax airway smooth muscle rapidly; inhaled corticosteroids reduce airway inflammation; long-acting bronchodilators maintain dilation; leukotriene antagonists block inflammatory mediators downstream of the 5-lipoxygenase pathway in montelukast teaching.",
    useSummary:
      "Stepwise control per GINA-style teaching: ICS backbone, add LABA only with ICS combination in persistent asthma, add-on tiotropium in selected adults, biologics for severe eosinophilic or allergic phenotypes in advanced curricula.",
    avoidSummary:
      "LABA monotherapy without ICS in asthma teaching due to mortality signal historical context; over-reliance on SABA without ICS step-up in recurrent exacerbation vignettes.",
    adverseSummary:
      "Tremor and tachycardia with SABA, oral candidiasis with ICS, pneumonia risk discussions with high-dose ICS in some populations, neuropsychiatric montelukast warnings in labeling teaching.",
    ddiSummary:
      "Strong CYP interactions less central than pulmonary interactions; beta blockers may antagonize SABA in reactive airway stems—use cardioselective agents when necessary per cardiology.",
    monitorSummary:
      "Peak flow or spirometry trends, exacerbation frequency, inhaler technique checks, growth in children on ICS, oral thrush inspection, and eosinophil counts for biologic eligibility.",
    counselSummary:
      "Rinse mouth after ICS; demonstrate spacer use; distinguish rescue inhaler from daily controller physically and with color coding if possible.",
    specialSummary:
      "Pediatrics emphasizes growth and technique; pregnancy favors ICS controllers with good asthma control benefits; elderly may have arthritis impairing inhaler activation.",
    examSummary:
      "Prioritize spacer teaching when poor technique causes failure; escalate ICS before chronic high SABA use in modern quality teaching stems.",
    memorySummary:
      "ICS is the anti-inflammatory boss; LABA is the wingman that never flies solo in asthma.",
    faq: faq4("Asthma pharmacotherapy", [
      "Status asthmaticus with silent chest and fatigue—emergency pathway not outpatient refill.",
      "Peak flow trends and exacerbation counts when stepping therapy.",
      "Teach patients to seek help when rescue use exceeds guideline thresholds.",
      "No; biologic choice requires phenotyping and specialist criteria.",
    ]),
    references: [REFS.gina2024, REFS.fda],
  },
  {
    slug: "copd-inhalers-comparison-pharmacy-guide",
    title: "COPD Inhalers Comparison: LAMA, LABA, ICS, and Triple Therapy for Pharmacy Licensing",
    excerpt:
      "Bronchodilator classes, inhaler device types, exacerbation reduction claims in teaching summaries, pneumonia risk discussions with ICS in COPD, and oxygen therapy reminders.",
    seoTitle: "COPD inhalers pharmacy comparison | NurseNest",
    seoDescription:
      "Compare LAMA and LABA mechanisms, combination products, triple therapy indications in GOLD teaching, and device counseling for pharmacy exams.",
    tags: "COPD, Pulmonary, Pharmacology, Pharmacy exams",
    classLabel: "COPD inhaler therapies",
    moaCore:
      "LAMAs block muscarinic receptors to reduce acetylcholine-mediated bronchoconstriction; LABAs stimulate beta-2 receptors for prolonged dilation; ICS decreases airway inflammation and exacerbations in selected eosinophil-guided COPD teaching though pneumonia risk is debated in curricula.",
    useSummary:
      "GOLD-style stepwise bronchodilator escalation, rescue SABA or SAMA as needed, combination LAMA/LABA first-line long-acting bronchodilation in many symptomatic patients, add ICS in frequent exacerbators with higher blood eosinophils per teaching thresholds.",
    avoidSummary:
      "ICS in recurrent pneumonia without risk-benefit re-evaluation; continuing triple therapy when symptoms and exacerbations do not warrant complexity; device mismatch without retraining.",
    adverseSummary:
      "Dry mouth with LAMA, tremor with LABA, hoarseness and thrush with ICS, urinary retention in BPH with antimuscarinics, and paradoxical bronchospasm rare.",
    ddiSummary:
      "Anticholinergic burden stacking with oral agents; beta agonist tachycardia with other stimulants; eye exposure teaching for ipratropium contact lens irritation trivia.",
    monitorSummary:
      "Exacerbation frequency, inhaler refill intervals as adherence proxy, eosinophils when considering ICS, symptom scores, and oxygen saturation in chronic hypoxemia follow-up.",
    counselSummary:
      "Demonstrate priming new devices; teach sequential puff technique for MDIs with spacer; dry rinse mouth after ICS-containing combos in COPD using ICS.",
    specialSummary:
      "Geriatric arthritis favors breath-actuated devices; severe renal impairment affects some nebulized drug choices in advanced items; cognitive impairment needs caregiver training.",
    examSummary:
      "Triple therapy exacerbation reduction versus pneumonia risk tradeoff stems; prioritize smoking cessation as non-pharmacologic cornerstone in every COPD item.",
    memorySummary:
      "LAMA dries and opens; LABA shakes and opens; ICS calms inflammation when eosinophils say yes.",
    faq: faq4("COPD inhaler therapies", [
      "Acute hypercapnic respiratory failure—bilevel and hospital pathway, not only inhaler tweak.",
      "Exacerbation counts and inhaler technique at each visit.",
      "Patients should bring devices to appointments for technique verification—not photos of boxes.",
      "No; oxygen qualification requires formal testing.",
    ]),
    references: [REFS.globalStrategyCopd, REFS.fda],
  },
  {
    slug: "proton-pump-inhibitors-pharmacology-explained",
    title: "Proton Pump Inhibitors Explained: Acid Suppression, CYP Interactions, and Deprescribing",
    excerpt:
      "Irreversible H+/K+ ATPase inhibition, GERD and PUD indications, clopidogrel interaction teaching evolution, magnesium deficiency, C difficile risk discussions, and long-term bone considerations.",
    seoTitle: "Proton pump inhibitors pharmacology | NurseNest",
    seoDescription:
      "PPI mechanisms, timing before meals, major interactions, B12 and magnesium monitoring, and deprescribing criteria for pharmacy students.",
    tags: "PPI, Gastroenterology, Pharmacology, Pharmacy exams",
    classLabel: "Proton pump inhibitors",
    moaCore:
      "PPIs accumulate in the acidic parietal cell canaliculus and covalently bind the hydrogen-potassium ATPase proton pump, irreversibly blocking acid secretion until new enzyme synthesis restores capacity over days.",
    useSummary:
      "GERD, erosive esophagitis, H pylori eradication regimens, NSAID ulcer prophylaxis in selected patients, and hypersecretory states like Zollinger-Ellison in advanced teaching.",
    avoidSummary:
      "Long-term unnecessary therapy without indication review; use with rilpivirine and some oral antiretrovirals that need acid for absorption per labeling; acute interstitial nephritis rare teaching.",
    adverseSummary:
      "Headache, diarrhea, C difficile risk discussions, hypomagnesemia with prolonged use, B12 deficiency theoretical risk, bone fracture associations in epidemiologic teaching, and drug interactions via CYP.",
    ddiSummary:
      "Clopidogrel and omeprazole esomeprazole interaction debates appear historically—follow current FDA labeling snapshots; diazepam phenytoin levels may shift with some PPIs via CYP.",
    monitorSummary:
      "Symptom control endpoints, long-term mineral labs when indicated, bone health strategies when steroids co-administered, and medication reconciliation for OTC duplication.",
    counselSummary:
      "Take delayed-release products before meals as labeled; do not combine with redundant H2 blockers without reason; discuss planned duration for uncomplicated GERD.",
    specialSummary:
      "Pediatric formulations exist for selected agents; geriatrics deprescribe after fall or fracture if acid suppression no longer needed; pregnancy uses omeprazole teaching with specialist input.",
    examSummary:
      "OTC PPI overuse vignettes; magnesium replacement before blaming unrelated symptoms; H pylori quadruple therapy PPI anchor role.",
    memorySummary:
      "Irreversible pump burn—acid stays down until the cell rebuilds new pumps days later.",
    faq: faq4("Proton pump inhibitors", [
      "Severe hypomagnesemia with arrhythmia in prolonged therapy teaching stems.",
      "Symptom recurrence after stopping—evaluate adherence versus need for maintenance.",
      "Teach patients to disclose all OTC acid reducers at anticoagulant visits.",
      "No; H pylori therapy requires antibiotic stewardship bundles.",
    ]),
    references: [REFS.ppiFda, REFS.fda, REFS.ashp],
  },
  {
    slug: "statins-mechanism-monitoring-pharmacy-guide",
    title: "Statins Mechanism and Monitoring: HMG-CoA Reductase Inhibition for Pharmacy Licensing",
    excerpt:
      "Cholesterol synthesis suppression, LDL lowering magnitude, hepatotoxicity monitoring teaching, myopathy and CK, drug interactions via CYP3A4, and diabetes risk discussions.",
    seoTitle: "Statins mechanism and monitoring | NurseNest",
    seoDescription:
      "Statin pharmacology, intensity tiers, SAMS teaching, contraindications in pregnancy, and interaction alerts for pharmacy board review.",
    tags: "Statins, Lipids, Pharmacology, Pharmacy exams",
    classLabel: "HMG-CoA reductase inhibitors (statins)",
    moaCore:
      "Statins competitively inhibit HMG-CoA reductase, the rate-limiting step of hepatic cholesterol synthesis, upregulating LDL receptors and lowering circulating LDL particles while also providing plaque stabilization pleiotropy themes in cardiology teaching.",
    useSummary:
      "ASCVD secondary prevention, primary prevention when 10-year risk crosses guideline thresholds, familial hypercholesterolemia adjuncts, and post-ACS high-intensity regimens when tolerated.",
    avoidSummary:
      "Pregnancy and lactation; active liver disease with unexplained transaminase elevations; concomitant strong CYP3A4 inhibitors with simvastatin or lovastatin in classic exam bans.",
    adverseSummary:
      "Myalgia without CK rise, rhabdomyolysis rare catastrophic, transaminitis, new-onset diabetes small risk discussion, cognitive complaints patient-reported though population data mixed.",
    ddiSummary:
      "Gemfibrozil with statins raises myopathy risk; amiodarone with simvastatin dose caps; azole antifungals and macrolides with atorvastatin need dose limits per labeling tables.",
    monitorSummary:
      "Baseline hepatic panel, lipid panel 6–12 weeks after start or dose change, CK if symptomatic myopathy, A1c surveillance in diabetes teaching integration, patient-reported muscle symptoms always.",
    counselSummary:
      "Report dark urine, severe muscle pain, or jaundice immediately; take pravastatin or rosuvastatin timing per label less meal-dependent than lovastatin with food teaching.",
    specialSummary:
      "Asian ancestry may need lower rosuvastatin starting doses in labeling; elderly start moderate intensity unless ASCVD demands high intensity with tolerance checks; dialysis alters some drug selections in advanced nephrology teaching.",
    examSummary:
      "Rhabdomyolysis with fibrate plus statin combo stems; grapefruit with atorvastatin simvastatin CYP3A4 substrates; pregnancy contraindication always.",
    memorySummary:
      "Pravastatin is hydrophilic and less CYP drama; simvastatin 80 mg is basically an exam villain except rare tolerators.",
    faq: faq4("HMG-CoA reductase inhibitors (statins)", [
      "Rhabdomyolysis with acute kidney injury from myoglobinuria in severe cases.",
      "Lipids after dose changes; CK only if symptomatic in many modern pathways unless special populations.",
      "Teach patients not to start grapefruit-heavy diets with atorvastatin without review.",
      "No; LDL targets follow ACC/AHA risk-based approach in US curricula.",
    ]),
    references: [REFS.statinsAcc, REFS.fda],
  },
  {
    slug: "pharmacokinetics-vs-pharmacodynamics-clinical-guide",
    title: "Pharmacokinetics vs Pharmacodynamics: Clinical Integration for Pharmacy Students",
    excerpt:
      "ADME versus receptor occupancy, half-life and steady state, clearance routes, EC50 and Emax teaching bridges, therapeutic windows, and how organ failure shifts both PK and PD endpoints.",
    seoTitle: "Pharmacokinetics vs pharmacodynamics | NurseNest",
    seoDescription:
      "Define PK and PD, interpret concentration-time curves, explain variability, and answer licensing exam questions on effect versus exposure.",
    tags: "Pharmacokinetics, Pharmacodynamics, Pharmacy exams, Clinical pharmacology",
    classLabel: "Pharmacokinetics compared with pharmacodynamics",
    moaCore:
      "Pharmacokinetics describes what the body does to the drug—absorption, distribution, metabolism, and excretion producing concentration-time profiles—while pharmacodynamics describes what the drug does to the body through receptor binding, signal transduction, and physiologic response magnitude and timing.",
    useSummary:
      "Dose selection, interval selection, route selection, therapeutic drug monitoring, individualized medicine in renal and hepatic impairment, and explaining why two patients with the same dose differ in effect.",
    avoidSummary:
      "Ignoring PD when TDM is normal yet toxicity occurs from receptor sensitivity changes; ignoring PK when toxicity occurs solely from drug accumulation without dose change.",
    adverseSummary:
      "Conceptual adverse teaching: toxicity from excessive PD effect at normal concentrations when receptors are sensitized versus toxicity from excessive concentrations at normal receptor sensitivity.",
    ddiSummary:
      "Interactions classified as PK shifts (enzyme inhibition changing AUC) versus PD shifts (additive QT prolongation without changing parent drug concentration much) appear as separate answer families.",
    monitorSummary:
      "Drug levels when narrow index, clinical effect markers when wide index, organ function labs driving clearance equations in exam math items, and protein binding changes in uremia teaching.",
    counselSummary:
      "Explain to patients that ‘starting low and going slow’ is often PK-driven in geriatrics while effect targets like INR are PD bridges monitored clinically.",
    specialSummary:
      "Pediatrics alters volume of distribution and maturing enzyme systems; pregnancy alters plasma volume and hepatic enzyme induction patterns; obesity alters Vd for lipophilic drugs.",
    examSummary:
      "Half-life five-rule steady state questions; loading dose versus maintenance dose separation; competitive antagonist surmountable versus non-competitive teaching distinctions.",
    memorySummary:
      "PK is the journey of milligrams through the body; PD is the handshake with receptors that decides the clinical punch.",
    faq: faq4("Pharmacokinetics compared with pharmacodynamics", [
      "Toxicity from accumulation versus toxicity from synergistic PD without concentration change—pick the mechanism the stem measures.",
      "Levels for vancomycin digoxin lithium; clinical endpoints for many antihypertensives.",
      "Patients benefit when counselors explain delayed effect of some drugs versus immediate effect of others—adherence improves.",
      "No; this framework supports reasoning, not bedside dosing math alone.",
    ]),
    references: [REFS.statinsAcc, REFS.ashp, REFS.fda],
  },
];

function main(): void {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const c of CARDS) {
    const body = buildBody(c);
    const wc = countWords(body);
    if (wc < MIN_WORDS) {
      console.error(`FAIL ${c.slug}: ${wc} words (min ${MIN_WORDS})`);
      process.exit(1);
    }
    writeFileSync(join(OUT_DIR, `${c.slug}.md`), frontmatter(c) + body, "utf8");
    console.log(`OK ${c.slug} (${wc} words)`);
  }
}

main();
