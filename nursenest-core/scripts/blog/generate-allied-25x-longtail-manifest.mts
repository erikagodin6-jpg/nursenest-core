#!/usr/bin/env npx tsx
/**
 * Emits a canonical batch manifest: 25 long-tail SEO topics per allied role
 * (pathophysiology / pharmacology / exam-style intent), all `pathwayId: us-allied-core`.
 *
 *   cd nursenest-core && npx tsx scripts/blog/generate-allied-25x-longtail-manifest.mts
 *   npx tsx scripts/blog/generate-allied-25x-longtail-manifest.mts --pathway=ca-allied-core
 *   npx tsx scripts/blog/generate-allied-25x-longtail-manifest.mts --out=./scripts/blog/custom.manifest.json
 *
 * Then split/run:
 *   npx tsx scripts/blog/export-batch-topics.mts --file=./scripts/blog/allied-longtail-225.manifest.json --out-dir=./tmp/allied-topics
 */
import fs from "node:fs";
import path from "node:path";

const DEFAULT_PATHWAY = "us-allied-core";
const TIER = "Allied" as const;

type Row = {
  topic: string;
  pathwayId: string;
  tier: string;
  occupation: string;
  domains: string[];
};

type Manifest = {
  batchId: string;
  notes: string;
  items: Row[];
};

function parseOut(argv: string[]): string | null {
  for (const a of argv.slice(2)) {
    if (a.startsWith("--out=")) return a.slice("--out=".length);
  }
  return null;
}

function parsePathway(argv: string[]): string {
  for (const a of argv.slice(2)) {
    if (a.startsWith("--pathway=")) return a.slice("--pathway=".length).trim() || DEFAULT_PATHWAY;
  }
  return DEFAULT_PATHWAY;
}

function pad25<T>(arr: T[], build: (i: number) => T): T[] {
  const out = [...arr];
  for (let i = out.length; i < 25; i += 1) out.push(build(i));
  return out.slice(0, 25);
}

function row(topic: string, pathwayId: string, occupation: string, domains: string[]): Row {
  return { topic, pathwayId, tier: TIER, occupation, domains };
}

/** 25 RT / RRT-style long-tail prompts */
function topicsRespiratory(): string[] {
  return pad25(
    [
      "RT exam question: why does auto-PEEP develop during mechanical ventilation — mechanism, waveform clues, and first vent changes",
      "Respiratory therapy board prep: how do you calculate desired minute ventilation from PaCO2 and dead space assumptions",
      "When should you escalate from high-flow nasal cannula to NIV — clinical decision criteria and contraindications on exams",
      "What is the mechanism of bronchodilator-induced tremor versus hypokalemia after high-dose beta-agonist therapy",
      "ABG interpretation: why does pure hypoventilation raise PaCO2 without changing the anion gap",
      "RT credential question: how does inverse-ratio ventilation alter mean airway pressure and oxygenation trade-offs",
      "Why does mucus plugging worsen V/Q mismatch after extubation — pathophysiology and nursing/RT co-monitoring",
      "Mechanical ventilation: what is the difference between pressure control and volume control for peak inspiratory pressure patterns",
      "When should you hold MDIs before certain cardiac stress protocols — scope-safe rationale items testing RT judgment",
      "Exam-style: why does left-to-right shunt physiology cause refractory hypoxemia that PEEP may partially improve",
      "High-alert respiratory meds: what is the mechanism of magnesium sulfate in severe asthma exacerbation and monitoring priorities",
      "RT board question: how do you troubleshoot high-pressure alarms on volume AC versus pressure support",
      "Why does metabolic alkalosis shift the oxyhemoglobin dissociation curve — clinical pearl for gas exchange teaching",
      "When should you suspect tension pneumothorax versus mainstem intubation from sudden desaturation",
      "Pathophysiology deep dive: why does pulmonary embolism produce sudden hypoxemia with a normal chest film early on",
      "RT exam: how do you select initial FiO2 in COPD patients at risk of CO2 retention without omitting safety margins",
      "What is the difference between shunt and dead space as causes of increased A-a gradient on exams",
      "Why does salbutamol/albuterol lower serum potassium — mechanism, ECG relevance, and repeat assessment timing",
      "NIV failure criteria on RT exams: tachypnea, accessory muscle use, and pH thresholds explained stepwise",
      "Ventilator-associated events: why does subglottic suctioning reduce contamination risk — infection control rationale",
      "RT question: how does helium-oxygen mixture change laminar flow assumptions in upper airway obstruction teaching items",
      "When should RT recommend bronchoscopy timing in massive hemoptysis scenarios — exam prioritization frameworks",
      "Why does flail chest impair ventilation mechanics — pathophysiology link to pain control and pulmonary toilet",
      "Exam trap: why does compensatory hyperventilation in metabolic acidosis lower PaCO2 predictably on ABG drills",
      "RT pharmacology: rocuronium versus succinylcholine considerations for RSI adjacent roles — mechanism and adverse effect contrast",
    ],
    (i) =>
      `Respiratory therapy exam drill ${i + 1}: oxygen delivery devices — when to switch interfaces based on work of breathing and SpO2 trajectory`,
  );
}

function topicsOT(): string[] {
  return pad25(
    [
      "OT board-style question: anticholinergic burden scales — how medications alter attention, ADLs, and fall risk in older adults",
      "Occupational therapy exam: why does dopaminergic fluctuation change handwriting and meal setup tasks across the day",
      "When should OT flag serotonin syndrome versus anticholinergic toxicity in polypharmacy scenarios",
      "OT credential prep: what is the difference between compensatory and restorative approaches after stroke for medication timing windows",
      "How do you calculate safe reach envelopes for hemiparesis when pain medications reduce proprioceptive feedback",
      "OT exam question: why does peripheral neuropathy from chemotherapy alter grip strategy and hot-surface judgment",
      "What is the mechanism of steroid-induced myopathy affecting proximal strength — OT implications for grading and pacing",
      "Occupational therapy licensing: benzodiazepine effects on dual-tasking during community mobility simulations",
      "Why does orthostatic hypotension from alpha-blockers change kitchen safety sequencing on exam vignettes",
      "OT item: when should you collaborate before recommending home med changes — scope, documentation, and escalation",
      "Exam-style: how SSRIs can blunt emotional expression in depression — OT assessment nuance without diagnosing",
      "OT board: why does lithium tremor interfere with fine motor ADL tasks and what accommodations are exam-appropriate",
      "What is the difference between fatigue from anemia versus deconditioning for grading energy conservation education",
      "Occupational therapy question: opioid sedation effects on cooking safety — cue hierarchy and caregiver handoffs",
      "Why does uncontrolled hyperglycemia impair wound healing on the hand — OT splinting and infection prevention rationale",
      "OT prep: antipsychotic metabolic syndrome cues that change community mobility teaching priorities",
      "When should OT defer driving decisions — red flags from sedating antihistamines and muscle relaxants in case stems",
      "How stimulant medications for ADHD change sustained attention tasks — school-based OT exam framing",
      "OT exam: why does diuretic-induced nocturia increase night fall risk and what environmental modifications are prioritized",
      "What is the mechanism of cyclobenzaprine sedation overlapping with concussion recovery pacing on test items",
      "Occupational therapy: high-dose NSAID GI risk — when exam items expect referral versus education-only boundaries",
      "Why does carbidopa-levodopa timing matter for shaving and buttoning tasks — OT exam mechanism link",
      "OT board question: contrast sensitivity changes with antimalarial retinopathy risk — screening roles across disciplines",
      "Exam vignette: why does alcohol withdrawal tremor confound fine motor assessment timing in acute care OT",
      "Pediatric OT item: stimulant appetite suppression effects on mealtime participation and growth monitoring handoffs",
    ],
    (i) =>
      `Occupational therapy exam scenario ${i + 1}: grading IADL participation when pain medications mask musculoskeletal limits`,
  );
}

function topicsSocialWork(): string[] {
  return pad25(
    [
      "MSW licensing exam: when should you screen for alcohol use disorder before starting buprenorphine collaboration cases",
      "Social work exam question: why does trauma-informed care change motivational interviewing pacing with PTSD medications in play",
      "What is the difference between duty to warn and mandated reporting — psychopharm-related aggression vignettes",
      "LCSW-style item: SSRIs and akathisia — how to document risk, collaborate, and avoid practicing medicine on exams",
      "When should social work escalate serotonin syndrome suspicion versus anxiety exacerbation in emergency department handoffs",
      "Social work board prep: lithium toxicity cues in older adults — assessment boundaries and interdisciplinary communication",
      "Why does stimulant diversion complicate ADHD treatment plans — ethics, confidentiality, and safety documentation items",
      "Exam question: how antipsychotic metabolic monitoring expectations show up in integrated care case management stems",
      "Social work licensing: benzodiazepine deprescribing conversations — motivational interviewing without prescribing language",
      "What is the mechanism of naltrexone for alcohol use disorder — how items test referral and adherence barriers",
      "When should you involve psychiatry urgently versus outpatient follow-up for medication nonadherence in depression cases",
      "MSW exam: why does polypharmacy increase delirium risk in hospital social work assessments and discharge planning",
      "Social work vignette: MAOI dietary teaching scope — what the exam expects you to coordinate versus defer",
      "How do you document capacity concerns when anticholinergics contribute to confusion without overstepping scope",
      "Licensing item: why does pregnancy change antidepressant risk–benefit framing in collaborative care scenarios",
      "Social work exam: clozapine monitoring requirements as a case manager coordination topic, not prescriptive authority",
      "When should social work prioritize elder financial exploitation screening with cognitive impact from sedating medications",
      "What is the difference between medication adherence barriers from cost versus health literacy on exam case plans",
      "Social work board: opioid use disorder and housing instability — contingency management boundaries in test rationales",
      "Why does gabapentin misuse appear in chronic pain social work cases — safety planning without diagnosing substance use",
      "Exam-style: how to navigate cultural beliefs about psychiatric medication in family meetings within SW ethics codes",
      "MSW question: when sleep medications mask untreated sleep apnea — referral language social workers use on tests",
      "Social work prep: ketamine clinic access inequities — policy questions versus clinical dosing (scope trap items)",
      "Why does stimulant use disorder in adolescents change confidentiality rules in exam multi-step stems",
      "LCSW exam: antidepressant sexual side effects — couples counseling boundaries and medical referral timing",
    ],
    (i) =>
      `Social work licensing scenario ${i + 1}: psychotropic polypharmacy in foster care transitions — documentation and team roles`,
  );
}

function topicsParamedic(): string[] {
  return pad25(
    [
      "Paramedic exam question: ketamine versus etomidate for RSI in shock — hemodynamic mechanisms and contraindication review",
      "When should you give calcium chloride versus gluconate for hyperkalemia with ECG changes in prehospital protocols",
      "What is the mechanism of epinephrine in cardiac arrest dosing rationale and common exam dose-error traps",
      "Paramedic board prep: why does nitroglycerin precipitate hypotension in RV infarct vignettes",
      "How do you calculate dopamine infusion rates from mcg/kg/min when pumps use mL/hr on certification exams",
      "Prehospital pharmacology: atropine versus pacing for symptomatic bradycardia — algorithm forks that tests love",
      "Why does sodium bicarbonate appear in tricyclic overdose teaching — sodium channel blockade mechanism on exams",
      "Paramedic item: when should you withhold fluids in trauma resuscitation — permissive hypotension nuance and updates",
      "What is the difference between anaphylaxis and vasovagal syncope for IM epinephrine decisions in field scenarios",
      "Exam question: why does amiodarone prolong QT — implications for polymorphic VT recognition in case stems",
      "Paramedic credential: magnesium for torsades — mechanism, dosing pattern, and reassessment endpoints",
      "When should you choose needle decompression site and depth assumptions on test questions versus real protocol variance",
      "Why does aspirin dosing matter in suspected ACS for EMS items — platelet inhibition mechanism recap",
      "Paramedic pharmacology: naloxone partial agonist concepts when buprenorphine is present — precipitated withdrawal teaching",
      "What is the mechanism of albuterol-induced tachycardia versus true ACS pain patterns in noisy field presentations",
      "Prehospital exam: calcium channel blocker overdose — hyperinsulinemia-euglycemia therapy as advanced item recognition",
      "Why does sepsis alter antibiotic timing ethics in EMS — scope and hospital notification items",
      "Paramedic question: push-dose phenylephrine versus epinephrine for peri-intubation hypotension mechanisms",
      "When should you suspect preeclampsia progression to eclampsia — magnesium indications adjacent to transport priorities",
      "Exam-style: why does carbon monoxide poisoning produce false-normal SpO2 on standard pulse oximetry items",
      "Paramedic board: rocuronium dosing and sugammadex awareness as recognition-only versus scope-of-practice traps",
      "Why does drowning physiology produce metabolic acidosis with respiratory compensation patterns on ABG teaching",
      "Prehospital pain control: fentanyl versus morphine PK differences tested on paramedic pharmacology sections",
      "When should you withhold NTG if phosphodiesterase inhibitor use is suspected — exam stem clue patterns",
      "Trauma exam question: TXA mechanism and timing windows — contraindications that show up as distractors",
    ],
    (i) =>
      `Paramedic certification drill ${i + 1}: pediatric epinephrine IM dosing errors — weight-based math and device selection`,
  );
}

function topicsMLT(): string[] {
  return pad25(
    [
      "MLT exam question: why does hemolysis falsely elevate or depress potassium depending on assay method teaching points",
      "When should you reject a specimen for coagulation testing — pre-analytical errors that certification exams emphasize",
      "What is the mechanism of EDTA-induced platelet clumping falsely lowering automated platelet counts",
      "Medical laboratory science item: lactate dehydrogenase isoenzyme patterns in hemolysis versus tissue injury vignettes",
      "How do you interpret corrected sodium for hyperglycemia on chemistry panels — calculation items on MLS exams",
      "MLT board prep: why does lipemia interfere with spectrophotometric assays — blanking strategies and limitations",
      "When should you suspect a specimen mix-up from impossible lab combinations — delta check reasoning on tests",
      "What is the difference between Type 1 and Type 2 von Willebrand panel patterns at a recognition level for MLT items",
      "Exam question: why does high-dose IV vitamin C interfere with certain glucose meters — mechanism and safety reporting",
      "MLT credential: peripheral smear schistocytes versus spherocytes — pathophysiology links to TTP versus hereditary spherocytosis teaching",
      "Why does potassium shift falsely low if plasma is separated late from cells in uncentrifuged tubes",
      "Medical lab exam: troponin serial testing rationale — hook effect recognition at conceptual level",
      "When should QC Westgard rules trigger investigation versus repeat — exam algorithms for laboratory scientists",
      "What is the mechanism of cryoprecipitate composition relevant to fibrinogen replacement recognition items",
      "MLT question: why does urobilinogen change in hemolytic versus obstructive jaundice patterns on urinalysis teaching",
      "Exam-style: ANA patterns as screening limitations — what MLT exams expect versus rheumatology depth boundaries",
      "Why does cold agglutinin disease affect automated CBC results — warming steps and validation concepts",
      "MLS prep: procalcitonin as bacterial sepsis adjunct — interpretation limits on certification stems",
      "When should you suspect heterophile antibody interference in immunoassays — false positive/negative mechanism items",
      "What is the difference between GFR estimating equations for creatinine versus cystatin C in lab reporting questions",
      "MLT exam: why does methemoglobinemia produce chocolate-colored blood and abnormal SpO2 on co-oximetry teaching",
      "Medical laboratory item: D-dimer specificity limitations — when exams pair with Wells score narrative",
      "Why does specimen hemolysis affect troponin assays differently by platform — high-level exam concept questions",
      "When should you call a critical potassium — policy versus physiology thresholds in case-based items",
      "MLS board: iron studies pattern in anemia of chronic disease versus iron deficiency — ferritin interpretation pearls",
    ],
    (i) =>
      `MLT certification drill ${i + 1}: specimen labeling errors near-miss — root cause categories tested on quality exams`,
  );
}

function topicsPT(): string[] {
  return pad25(
    [
      "PT board prep: why does prolonged corticosteroid use increase tendon rupture risk during eccentric loading programs",
      "Physical therapy exam question: beta-blocker effects on max HR estimation — exercise prescription exam traps",
      "When should PT defer progression after starting ACE inhibitors due to orthostasis in older adult case stems",
      "What is the mechanism of statin-associated myalgia affecting strength retesting schedules on licensing items",
      "PT exam: anticoagulation implications for manual therapy timing — INR concepts at collaborative decision level",
      "Why does opioid sedation change gait variability measures — safety teaching in neurologic PT vignettes",
      "Physical therapy item: bisphosphonate-related atypical femur stress fractures — load management exam language",
      "When should you screen for red flags before spinal manipulation cases involving antiplatelet medications",
      "PT credential question: diuretic-induced electrolyte loss and muscle cramping — referral versus education boundaries",
      "What is the difference between central and peripheral vertigo medication responses on exam differentiation tables",
      "Physical therapy licensing: gabapentinoids and fall risk — home exercise program modifications tested",
      "Why does insulin timing matter for exercise-induced hypoglycemia prevention in diabetes mellitus PT scenarios",
      "PT exam-style: SSRIs and hyponatremia risk during heat exposure in outdoor sports rehab case stems",
      "When should PT coordinate with cardiology before high-intensity intervals in post-MI patients on multiple antianginals",
      "What is the mechanism of nitrates reducing preload — implications for orthostatic symptoms after mat exercises",
      "Physical therapy board: benzodiazepines and balance — objective test selection rationales without diagnosing",
      "Why does caffeine withdrawal headache confound post-concussion symptom tracking in RTP protocols on exams",
      "PT question: NSAID renal risk during dehydration in athletic training adjacent case management items",
      "When should weight-bearing restrictions after certain osteoporosis medications influence gait training plans on tests",
      "What is the mechanism of claudication from PAD versus spinal stenosis pseudo-claudication medication responses",
      "Physical therapy exam: antipsychotic EPS mimicking Parkinson disease — referral cues within PT scope items",
      "Why does metformin-associated B12 deficiency matter for endurance complaints in long-term diabetes rehab cases",
      "PT prep: SGLT2 inhibitors and euglycemic DKA risk during illness — exercise counseling recognition questions",
      "When should PT pause progression if new peripheral edema appears after calcium channel blocker titration vignettes",
      "Exam trap: fluoroquinolone tendonopathy timing — explosive plyometric progression errors on PT tests",
    ],
    (i) =>
      `Physical therapy exam scenario ${i + 1}: antiseizure medication taper affecting seizure risk during return-to-sport drills`,
  );
}

function topicsPSW(): string[] {
  return pad25(
    [
      "PSW exam question: insulin timing with meals — hypoglycemia recognition, 15-15 rule, and observation reporting priorities",
      "When should you hold oral fluids before swallowing assessment — scope boundaries versus nursing delegation on tests",
      "What is the mechanism of sliding-scale insulin limitations — why exams push basal-bolus awareness for PSWs at education level",
      "PSW credential prep: opioid-induced constipation cues — safe prompting and documentation without medication changes",
      "How do you calculate mL of juice for mild hypoglycemia when a care plan specifies carbohydrate amounts",
      "Why does metformin GI upset improve with meals — PSW meal assistance sequencing items",
      "PSW board-style: anticholinergic dry mouth and aspiration risk during feeding assistance vignettes",
      "When should PSW report sudden confusion after new antibiotics — delirium versus infection progression exam stems",
      "What is the difference between PRN anxiolytic sedation and normal fatigue during evening care scenarios",
      "PSW exam: warfarin and fall risk — bleeding precautions without interpreting INR numbers on items",
      "Why does nitroglycerin patch removal timing matter for PSW shower assistance safety teaching",
      "Personal support worker item: topical glycopyrrolate for sweating — indirect care and skin observation expectations",
      "When should PSW escalate missed antiseizure doses versus watchful waiting per care plan exam language",
      "What is the mechanism of laxative overuse causing electrolyte disturbance recognition at PSW reporting depth",
      "PSW prep: SGLT2 genital infection education — dignity-preserving observation cues without diagnosing",
      "Why does aspirin allergy history matter when assisting with OTC purchases in community PSW exam traps",
      "Exam question: PSW role in medication reminder apps versus administering — scope-of-practice distractors",
      "When should you report patchy rash after new antibiotics — allergy communication chain items",
      "PSW licensing: dopamine agonist impulse-control topics as observation-and-report scenarios, not counseling depth",
      "What is the difference between side effect reporting and diagnosing in PSW documentation case studies",
      "Why does insulin pen priming errors cause hyperglycemia patterns PSWs observe before nurse review",
      "PSW exam: naloxone community availability — what PSWs are expected to know versus administer by region items",
      "When should mealtime insulin be held per nurse instruction — PSW exam prioritization of orders over habit",
      "Personal support worker vignette: polypharmacy and pill organizers — tampering signs and reporting ethics",
      "Why does alcohol use increase bleeding risk on anticoagulants — simple mechanism for PSW safety teaching exams",
    ],
    (i) =>
      `PSW certification drill ${i + 1}: transdermal fentanyl heat exposure — observation priorities and escalation wording`,
  );
}

function topicsPharmTech(): string[] {
  return pad25(
    [
      "Pharmacy technician exam: high-alert LASA pairs in inpatient carts — verification steps and tall-man lettering items",
      "When should you involve pharmacists for look-alike vial errors — tech scope questions on certification exams",
      "What is the mechanism of potassium chloride concentrate dangers — dilution requirements tested as safety scenarios",
      "Pharm tech board prep: how do you calculate tablets needed for a 10-day supply with BID dosing and partial tablets rules",
      "Why does insulin concentration mix-ups (U-100 vs U-500) appear as sentinel event teaching on PTCE-style items",
      "Pharmacy technician question: beyond-use dating for compounded nonsterile preparations — USP concept recognition",
      "When should refrigerated chain breaks trigger quarantine procedures — exam workflow sequencing questions",
      "What is the difference between generic substitution laws and therapeutic substitution authority on tests",
      "Pharm tech exam: chemotherapy Spill kit steps — PPE order and surface decontamination rationale items",
      "How do you calculate IV flow rate from gtt/mL and mL/hr when an order uses both on exam math",
      "Why does grapefruit juice affect certain statins — CYP3A4 interaction depth appropriate for pharmacy technicians",
      "Pharmacy technician item: DEA controlled substance inventory discrepancies — reporting timelines on exams",
      "When should you refuse to release a prescription early for controlled substances — policy versus judgment stems",
      "What is the mechanism of reconstituted antibiotic stability windows affecting auxiliary labels on test items",
      "Pharm tech credential: narrow therapeutic index drugs — why digoxin and warfarin appear in counseling adjunct questions",
      "Why does barcode scanning reduce wrong-patient errors — medication safety technology questions for technicians",
      "Pharmacy technician board: hazardous drug handling in retail versus hospital — PPE differences on exams",
      "When should partial fills for opioids follow state law patterns tested as multiple true/false clusters",
      "What is the difference between formulary tiers and prior authorization from a technician workflow perspective",
      "Pharm tech exam: vaccine storage excursions — documentation and pharmacist notification sequences",
      "Why does isotonic versus hypertonic saline concentration matter for IV admixture checks on calculation exams",
      "Pharmacy technician prep: USP <797> basics at recognition level — not sterile compounding certification depth traps",
      "When should you use a filter needle with glass ampules — exam rationale and waste minimization items",
      "What is the mechanism of methotrexate weekly versus daily fatal error patterns in case-based technician exams",
      "Pharm tech question: pediatric liquid measurement with oral syringes — rounding rules and device selection",
    ],
    (i) =>
      `Pharmacy technician certification drill ${i + 1}: expiration dating after multi-dose vial punctures — policy memory items`,
  );
}

function topicsPsychotherapy(): string[] {
  return pad25(
    [
      "Psychotherapy licensing exam: when should you postpone exposure therapy if benzodiazepines blunt habituation on case stems",
      "What is the mechanism of SSRI delayed onset — how exam items test psychoeducation without medication management",
      "Psychotherapy board prep: MAOI dietary restrictions — collaborative care language versus prescriptive traps",
      "When should therapists escalate suicidal ideation with recent antidepressant initiation — black box warning teaching",
      "Why does bupropion lower seizure threshold — group therapy environment planning items for licensing exams",
      "Psychotherapy exam: lithium toxicity mild tremor versus anxiety — scope-appropriate referral phrasing",
      "What is the difference between medication-induced akathisia and agitated depression in session observation vignettes",
      "When should you document capacity concerns after high-dose antipsychotic sedation in crisis counseling cases",
      "Psychotherapy credential question: stimulant appetite suppression in adolescents — family systems items paired with medical collaboration",
      "Why does abrupt SSRI discontinuation cause discontinuation syndrome — psychoeducation points tested on exams",
      "Licensing item: ketamine-assisted therapy settings — what psychotherapy exams treat as out-of-scope dosing detail",
      "Psychotherapy prep: naltrexone for alcohol use disorder as adjunct to CBT — adherence barriers without prescribing",
      "When should sleep medication effects on memory consolidation change homework design in CBT-I adjacent items",
      "What is the mechanism of prazosin for PTSD nightmares — informed consent boundaries for non-prescribing therapists",
      "Psychotherapy exam question: valproate teratogenicity — couples counseling ethics when pregnancy is possible",
      "Why does anticholinergic burden worsen cognitive scores in therapy intake — differential referral language",
      "When should you coordinate with psychiatry before behavioral activation if severe anhedonia and weight loss appear",
      "Psychotherapy board: gabapentin misuse in chronic pain clients — motivational interviewing without diagnosing SUD",
      "What is the difference between therapeutic relationship ruptures and emergent mania from antidepressant activation items",
      "Psychotherapy licensing: clozapine sialorrhea as a distress topic — containment versus medical management referral",
      "When should digital therapeutics for depression integrate with medication adherence tracking — privacy exam questions",
      "Why does propranolol performance anxiety dosing appear as off-label awareness items for therapists not prescribers",
      "Psychotherapy exam: peripartum depression medication decisions — supportive therapy boundaries in vignettes",
      "When should you screen for bipolar disorder before interpreting SSRI failure in CBT case conceptualizations",
      "What is the mechanism of thyroid hormone correction improving mood — biopsychosocial integration questions on tests",
    ],
    (i) =>
      `Psychotherapy exam scenario ${i + 1}: long-acting injectable antipsychotics — adherence psychoeducation without device knowledge tests`,
  );
}

function topicsEMT(): string[] {
  return pad25(
    [
      "EMT exam question: epinephrine auto-injector versus IM dosing assumptions in anaphylaxis recognition drills",
      "When should BLS withhold assisted ventilation in obvious death criteria — exam ethics versus trauma vignettes",
      "What is the mechanism of hypoglycemia producing seizure-like activity — field differentiation items for EMT tests",
      "EMT board prep: aspirin administration for suspected ACS — contraindications and scope limitations on exams",
      "Why does naloxone precipitate withdrawal — mechanism tested at BLS recognition depth adjacent to safety",
      "EMT item: spinal motion restriction updates — exam questions reflecting contemporary evidence-based practice",
      "When should you assist with nitroglycerin administration checks — blood pressure prerequisites on test algorithms",
      "What is the difference between heat exhaustion and heat stroke for cooling interventions on certification exams",
      "EMT exam: opioid respiratory depression assessment — ventilatory rate versus pulse oximetry pitfalls in the field",
      "Why does carbon monoxide exposure produce headache with normal SpO2 on basic monitoring teaching items",
      "EMT credential question: pediatric bradycardia with poor perfusion — CPR integration and AED use exam paths",
      "When should you prioritize epinephrine in unstable bradycardia versus pacing-capable transport decisions at EMT scope",
      "What is the mechanism of simple pneumothorax progression to tension in exam pathophysiology stems",
      "EMT prep: stroke scales and last-known-well time — thrombectomy window recognition without hospital dosing",
      "Why does glucose paste administration timing matter in altered mental status algorithm questions",
      "EMT exam-style: epinephrine routes for cardiac arrest in adult BLS — chain of survival ordering items",
      "When should you suspect pulmonary edema from flash pulmonary hypertension in pregnancy field scenarios at recognition level",
      "What is the difference between allergic reaction and anaphylaxis for epinephrine IM decisions on EMT tests",
      "EMT question: trauma triage destination criteria — mechanism severity cues without hospital capability lists",
      "Why does atropine dosing change in organophosphate exposure teaching at advanced recognition tiers on some exams",
      "EMT board: burn fluid resuscitation initiation — what BLS exams expect versus paramedic scope boundaries",
      "When should you apply pelvic binder for suspected pelvic fracture — exam indications and contraindication recognition",
      "What is the mechanism of vasovagal syncope bradycardia patterns on simple monitor strips in EMT items",
      "EMT licensing: epinephrine for croup in interfacility transport questions — scope-of-practice regional variance traps",
      "Why does drowning resuscitation emphasize oxygenation and ventilation first in BLS exam answer keys",
    ],
    (i) =>
      `EMT certification drill ${i + 1}: scene safety with downed power lines — oxygen use and ignition risk recognition items`,
  );
}

function main(): void {
  const pathwayId = parsePathway(process.argv);
  const specs: { occupation: string; domains: string[]; topics: string[] }[] = [
    { occupation: "Respiratory Therapy", domains: ["pharmacology", "pathophysiology", "clinical decision making"], topics: topicsRespiratory() },
    { occupation: "OT", domains: ["pharmacology", "clinical decision making", "pathophysiology"], topics: topicsOT() },
    { occupation: "Social Work", domains: ["pharmacology", "medication safety", "clinical decision making"], topics: topicsSocialWork() },
    { occupation: "Paramedic", domains: ["pharmacology", "pathophysiology", "clinical decision making"], topics: topicsParamedic() },
    { occupation: "MLT", domains: ["lab interpretation", "pathophysiology", "medication safety"], topics: topicsMLT() },
    { occupation: "PT", domains: ["pharmacology", "pathophysiology", "clinical decision making"], topics: topicsPT() },
    { occupation: "PSW", domains: ["medication safety", "dosage calculation", "clinical decision making"], topics: topicsPSW() },
    { occupation: "Pharmacy Technician", domains: ["pharmacology", "medication safety", "dosage calculation"], topics: topicsPharmTech() },
    { occupation: "Psychotherapy", domains: ["pharmacology", "medication safety", "clinical decision making"], topics: topicsPsychotherapy() },
    { occupation: "EMT", domains: ["pharmacology", "pathophysiology", "clinical decision making"], topics: topicsEMT() },
  ];

  const items: Row[] = [];
  for (const s of specs) {
    for (const topic of s.topics) {
      items.push(row(topic, pathwayId, s.occupation, s.domains));
    }
  }

  const manifest: Manifest = {
    batchId: `allied-longtail-25x-ten-roles-${pathwayId}`,
    notes: `Generated ${items.length} items (25 each × ${specs.length} occupations). pathwayId=${pathwayId}. Regenerate: npx tsx scripts/blog/generate-allied-25x-longtail-manifest.mts [--pathway=ca-allied-core]. Publish via generate-blog-posts + publishBlogPostCanonical only.`,
    items,
  };

  const outArg = parseOut(process.argv);
  const defaultName =
    pathwayId === DEFAULT_PATHWAY ? "allied-longtail-250.manifest.json" : `allied-longtail-250.${pathwayId}.manifest.json`;
  const outPath = outArg
    ? path.isAbsolute(outArg)
      ? outArg
      : path.resolve(process.cwd(), outArg)
    : path.resolve(process.cwd(), `scripts/blog/${defaultName}`);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ wrote: outPath, itemCount: items.length, pathwayId }, null, 2));
}

main();
