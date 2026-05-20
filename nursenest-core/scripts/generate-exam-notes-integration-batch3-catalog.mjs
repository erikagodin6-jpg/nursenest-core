#!/usr/bin/env node
/**
 * Generates `src/content/pathway-lessons/rn-nclex-exam-notes-integration-batch3-catalog.json`
 * — exam-notes batch 3: net-new RN NCLEX-RN / CA RN rows (deduped by slug; merges go in source lessons).
 * Run: node scripts/generate-exam-notes-integration-batch3-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../src/content/pathway-lessons/rn-nclex-exam-notes-integration-batch3-catalog.json");

function block(title, paras) {
  const p = paras.join("\n\n");
  return `**${title}** ties high-yield nursing judgment to airway, perfusion, infection control, and safe medication administration. ${p}\n\nCross-link [US RN lessons hub](/us/rn/nclex-rn/lessons) · [Canada RN lessons hub](/canada/rn/nclex-rn/lessons) and related LESSON cards where the stem crosses systems.`;
}

function scenario(title, stem) {
  return `**Patient vignette.** ${stem}\n\n**Fork:** prioritize ABCs, obtain objective trends (vitals, glucose, neuro checks, intake/output), prepare time-sensitive diagnostics per orders, and notify the provider with SBAR including quantified findings—not deferrable tasks first.`;
}

const EXPANSION_SPINE = `
**Pathophysiology in plain language.** Think in layers: cells → organs → whole-person compensation. When a stem describes acute change (fever, pain, new neuro deficit, hypoxia, hypotension), ask what system is failing to compensate and what reversible threat is most time-sensitive. Nurses are the continuity layer: you trend objective data, reconcile subjective reports, and prevent “task completion” from replacing “problem recognition.”

**Risk factors and epidemiology (exam framing).** NCLEX-style items rarely require memorized incidence tables; they require you to connect **age**, **comorbidities**, **medications**, **recent procedures**, **pregnancy**, **travel**, **substance use**, and **immunization status** to plausible mechanisms. When two answers are “true,” pick the one that addresses the **current priority threat** (airway, breathing, circulation, neuro decline, infection, bleeding).

**Clinical manifestations — typical and atypical.** Classic textbook findings get you halfway; boards reward recognition when presentations are **incomplete**, **muted** (older adults, immunosuppression), or **overlap** (sepsis can look like delirium; MI can present as epigastric pain; pediatric dehydration can present as tachypnea before hypotension). Always pair symptoms with **vitals**, **mentation**, **perfusion**, and **risk of rapid deterioration**.

**Diagnostics and labs (interpretation, not trivia).** Use the numbers the stem gives: if creatinine is rising, think prerenal vs intrinsic vs postrenal patterns; if lactate is elevated, think tissue hypoperfusion; if hemoglobin drops, quantify bleeding risk and perfusion. Imaging and consult themes should match stability: unstable patients move toward **bedside** diagnostics and **resuscitation** first.

**Management and treatments (nursing lens).** Treatments are rarely “interesting” alone; exams test whether you know **monitoring**, **expected effects**, **adverse effects**, **contraindications**, and **when to hold and call**. Include oxygen titration targets when COPD is relevant, seizure precautions when neuro risk is relevant, and isolation when transmission risk is relevant.

**Medications — nursing implications.** Rights of medication administration, IV compatibility themes, titration protocols, antidote awareness, and high-alert medication safety appear constantly. Always ask: what do I **monitor before**, **during**, and **after**? What patient education prevents readmission?

**Nursing priorities and clinical actions.** Use a consistent priority stack: protect airway and breathing, restore perfusion, stop bleeding, treat infection, prevent injury, then comfort and teaching when safe. Document objective trends and communicate with SBAR.

**Complications.** Early complications are minutes-to-hours (airway compromise, arrhythmia, bleeding, anaphylaxis). Later complications are days-to-weeks (DVT, infection, deconditioning, pressure injury). Match the timeframe in the stem.

**Client education.** Stable patients need teach-back on red flags, medication timing, wound care, follow-up appointments, and when to call emergency services. Avoid education during active instability.

**Exam traps and priority cues.** If an option delays assessment of a changing neurologic exam, it is usually wrong. If an option prioritizes discharge paperwork over new hypoxia, it is wrong. If an option gives a blanket “encourage fluids” in a heart failure exacerbation without context, suspect a trap.

**Clinical pearls.** Trend beats snapshot; orthostatics can reveal volume status; silent MI happens; pediatric compensation can fool you until sudden collapse; postoperative patients can bleed into the compartment or abdomen with “stable” early vitals.

**Practice-style self-check.** Ask: what is the **most likely** process, what is the **most dangerous** process I must rule out, and what is the **first nursing action** that reduces harm in the next few minutes?
`.trim();

function lesson(def) {
  const {
    slug,
    title,
    topic,
    topicSlug,
    bodySystem,
    clinicalMeaning,
    examRelevance,
    coreConcept,
    clinicalScenario,
    takeaways,
  } = def;
  return {
    slug,
    title,
    topic,
    topicSlug,
    bodySystem,
    system: topicSlug,
    previewSectionCount: 1,
    seoTitle: `${title} | NCLEX-RN | NurseNest`,
    seoDescription: `NCLEX-RN review: ${title} — pathophysiology, assessment, nursing priorities, complications, client education, and exam traps (US + Canada frames).`,
    relatedLessonRefs: def.relatedLessonRefs ?? [],
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `${clinicalMeaning}\n\n${EXPANSION_SPINE}`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `${examRelevance}\n\n**NP / advanced practice overlay (when the stem is NP-framed):** include differentials as “most likely vs most dangerous,” document decision thresholds, and identify when to consult cardiology, neurology, nephrology, surgery, or critical care. **Prescribing logic** items expect you to match drug choice to comorbidity (renal dosing, hepatic risk, pregnancy category themes) and to avoid contraindicated combinations.\n\n**RPN/PN emphasis:** stay inside scope—monitor, report, reinforce teaching, support ADLs, and recognize when to escalate to RN or provider.\n\n**New grad emphasis:** name **what to report first** (quantified vitals, new neuro change, chest pain characteristics, bleeding volume), and avoid common mistakes (assuming someone else already notified the provider).`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `${coreConcept}\n\n${EXPANSION_SPINE}`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `${clinicalScenario}\n\n**Shift-based thinking:** handoff should include code status, lines/drains/airway devices, last vitals, pending labs, and family communication status. If the patient is “borderline stable,” increase monitoring frequency and pre-brief rapid response criteria.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `${takeaways}\n\n**Practice question style review:**\n1) Which option reduces harm fastest?\n2) Which option is safe but mis-prioritized?\n3) Which option is contraindicated given a keyword in the stem?\n\n${EXPANSION_SPINE}`,
      },
    ],
    preTest: def.preTest,
    postTest: def.postTest,
  };
}

const pq = (q, opts, correct, rationale) => ({
  question: q,
  options: opts,
  correct,
  rationale,
});

const defs = [
  {
    slug: "malignant-hyperthermia-nclex-rn",
    title: "Malignant Hyperthermia (MH)",
    topic: "Pharmacology",
    topicSlug: "pharmacology",
    bodySystem: "Pharmacology",
    clinicalMeaning: block("Malignant hyperthermia", [
      "Malignant hyperthermia (MH) is a pharmacogenetic hypermetabolic crisis triggered most characteristically by **volatile anesthetics** (e.g., sevoflurane, desflurane) and **succinylcholine** in susceptible patients (RYR1/CACNA1S mutations). Uncontrolled calcium release from the sarcoplasmic reticulum produces sustained muscle rigidity, extreme heat production, hypercapnia, mixed respiratory–metabolic acidosis, hyperkalemia, and rhabdomyolysis—progressing to DIC, acute kidney injury, and cardiac arrest if untreated.",
      "Nurses in perioperative and PACU areas must recognize **unexpected hyperthermia**, **masseter muscle rigidity after succinylcholine**, **unexplained rising ETCO₂** despite minute ventilation increases, **tachycardia out of proportion to depth**, **coagulopathy**, and **dark urine** (myoglobinuria). MH is **not** simple “fever from infection” in the first minutes; it is a **supply-and-demand mismatch** with massive oxygen consumption.",
      "Definitive treatment is **dantrolene** (ryanodine receptor antagonist) plus aggressive **cooling**, **hyperventilation** to blow off CO₂, **treat hyperkalemia**, **maintain urine output** for myoglobin clearance, and **discontinue triggering agents** while finishing surgery with non-triggering anesthetic if needed. Document timing, serial vitals, labs, and dantrolene doses for medicolegal clarity and family communication.",
    ]),
    examRelevance:
      "Examiners reward **first actions** that stop the metabolic spiral: discontinue triggers, call for MH cart/dantrolene, increase minute ventilation, cool the patient, treat **K⁺** if peaked T-waves appear, and prepare for ICU transfer. Traps include treating isolated fever with antipyretics alone, delaying dantrolene while “waiting for cultures,” or choosing routine warming devices when temperature is already climbing with rigidity.",
    coreConcept:
      "**Overview & pathophysiology:** RYR1-mediated uncontrolled skeletal muscle contraction → heat + CO₂ + lactate + K⁺ + myoglobin.\n\n**Risk factors / causes:** family history of MH or unexpected intraoperative death, myopathies, prior MH episode.\n\n**Clinical manifestations:** rising ETCO₂, rigidity, tachycardia, hyperthermia (may be late), mottled skin, arrhythmias from hyperkalemia.\n\n**Diagnostics / labs:** ABG (mixed acidosis), K⁺, CK, lactate, coagulation studies, urine myoglobin.\n\n**Treatments:** dantrolene per protocol, stop volatile agents, switch circuit, cool, correct electrolytes, forced alkaline diuresis themes per orders.\n\n**Nursing priorities:** time-stamped escalation, continuous monitoring, avoid succinylcholine in future, Malignant Hyperthermia Association of the United States (MHAUS) hotline themes.\n\n**Complications:** AKI, compartment syndrome, coagulopathy.\n\n**Client education:** first-degree relatives need counseling about susceptibility testing.\n\n**Exam traps:** succinylcholine-induced masseter spasm as a red flag; do not attribute rising CO₂ only to “light anesthesia” when other MH signs cluster.\n\n**Clinical pearls:** ETCO₂ trend is an early sentinel; dantrolene is the disease-modifying rescue, not ice packs alone.",
    clinicalScenario: scenario(
      "MH crisis",
      "During emergence from general anesthesia for an appendectomy, the ETCO₂ climbs from **42 to 82 mmHg** despite increasing minute ventilation. Heart rate is **140**, temperature **38.9°C** and rising, and the patient appears **rigid** when you try to pass an oral airway.",
    ),
    takeaways:
      "- **Rising ETCO₂ + rigidity + tachycardia** after trigger exposure → think **MH** until proven otherwise.\n- **Dantrolene + stop triggers + support ABCs** dominate correct answer arcs.\n- **Hyperkalemia** can kill before fever peaks—pair ECG with labs.\n\n**Related:** [perioperative nursing priorities](LESSON:proc-skill-surgical-asepsis-rn) · [US RN hub](/us/rn/nclex-rn/lessons).",
    preTest: [
      pq(
        "Which finding best supports suspicion of malignant hyperthermia in the OR?",
        ["Stable sinus rhythm after spinal anesthesia only", "Rising ETCO₂ with muscle rigidity after volatile agent + succinylcholine", "Isolated sore throat 24 hours post-op", "Mild shivering in PACU with normal ETCO₂"],
        1,
        "MH classically produces hypermetabolism with CO₂ production outstripping ventilation and often rigidity after trigger agents.",
      ),
    ],
    postTest: [
      pq(
        "After MH is suspected, which intervention is most essential alongside discontinuing triggering agents?",
        ["Send the patient to MRI immediately", "Administer dantrolene per protocol and escalate critical care support", "Apply a heating blanket", "Hold all IV fluids"],
        1,
        "Dantrolene reverses the pathologic calcium release; supportive ICU-level care addresses acid–base, temperature, and renal protection.",
      ),
    ],
  },
  {
    slug: "hellp-syndrome-nclex-rn",
    title: "HELLP Syndrome",
    topic: "Maternal & Newborn",
    topicSlug: "maternity",
    bodySystem: "Hematologic",
    clinicalMeaning: block("HELLP syndrome", [
      "HELLP is a severe variant of the **hypertensive disorders of pregnancy** spectrum: **H**emolysis, **E**levated **L**iver enzymes, and **L**ow **P**latelets. Microangiopathic hemolysis fragments red cells (schistocytes on smear when shown), hepatic sinusoidal injury drives transaminase elevations, and consumptive thrombocytopenia raises bleeding risk for delivery, regional anesthesia, and hepatic hematoma or rupture.",
      "Clinical overlap with **acute fatty liver of pregnancy**, **thrombotic thrombocytopenic purpura**, and **atypical hemolytic uremic syndrome** appears in advanced items—nursing anchors on **pregnancy timing**, **BP**, **RUQ/epigastric pain**, **nausea**, **headache**, **visual changes**, and **fetal status** while the team differentiates.",
      "Management is obstetric–critical care partnership: **magnesium sulfate** for seizure prophylaxis when indicated, **blood pressure control** per protocol, **platelet support** when counts threaten hemostasis, and **delivery timing** as definitive therapy in many cases. Nurses trend labs on a tight schedule, watch for **DIC**, **pulmonary edema**, and **renal injury**, and avoid antiplatelet procedures (e.g., epidural) when platelets are below institutional thresholds.",
    ]),
    examRelevance:
      "Expect **prioritization** between seizure risk, bleeding risk, fetal compromise, and maternal perfusion. Traps include treating HELLP as “only preeclampsia with labs” without recognizing **platelet-driven anesthesia contraindications**, or delaying provider notification when RUQ pain, falling platelets, and hemolysis markers cluster.",
    coreConcept:
      "**Pathophysiology:** endothelial injury → hemolysis + hepatic ischemia + platelet consumption.\n\n**Manifestations:** malaise, nausea/vomiting, RUQ pain, edema, HTN (may be absent or mild), petechiae/bleeding.\n\n**Labs:** LDH ↑, bilirubin ↑, haptoglobin ↓, schistocytes; AST/ALT ↑; platelets ↓; creatinine may rise.\n\n**Interventions:** MgSO₄ per orders, antihypertensives, platelets if needed for procedure or active bleeding, delivery planning.\n\n**Complications:** hepatic rupture/hematoma, stroke, placental abruption, DIC.\n\n**Education:** return for headache, RUQ pain, visual changes, bleeding.\n\n**Exam traps:** severe HELLP can occur without dramatic BP if baseline was low; do not dismiss symptoms.",
    clinicalScenario: scenario(
      "HELLP",
      "A 34-week pregnant client reports **severe epigastric pain** and **nausea**. BP is **158/96**, platelets **58,000/µL**, AST **210 U/L**, LDH **780 U/L**, and peripheral smear shows **schistocytes**.",
    ),
    takeaways:
      "- **RUQ pain + dropping platelets + hemolysis** → HELLP until cleared.\n- **Magnesium** for seizure prophylaxis when ordered in severe features.\n- **Platelet threshold** gates neuraxial anesthesia—verify policy.\n\n**Related:** [preeclampsia vs eclampsia](LESSON:preeclampsia-vs-eclampsia) · [Canada RN hub](/canada/rn/nclex-rn/lessons).",
    preTest: [
      pq(
        "Which lab pattern best matches HELLP syndrome?",
        ["High platelets, low LDH, normal LFTs", "Hemolysis markers + elevated transaminases + thrombocytopenia", "Isolated hyperglycemia without ketones", "Normal smear with isolated hyponatremia"],
        1,
        "HELLP combines hemolysis, hepatocellular injury, and low platelets.",
      ),
    ],
    postTest: [
      pq(
        "A client with suspected HELLP asks why an epidural might be deferred. The best nursing explanation is:",
        [
          "Epidurals are never used in pregnancy",
          "Low platelets increase epidural hematoma risk; the team will reassess counts and risks per policy",
          "Epidurals cause HELLP",
          "Platelets do not matter for neuraxial anesthesia",
        ],
        1,
        "Platelet thresholds protect against spinal/epidural hematoma; communication must be honest and policy-aligned.",
      ),
    ],
  },
  {
    slug: "vacuum-assisted-vaginal-birth-complications-nclex-rn",
    title: "Vacuum-Assisted Vaginal Birth & Complications",
    topic: "Maternal & Newborn",
    topicSlug: "maternity",
    bodySystem: "Obstetric",
    clinicalMeaning: block("Vacuum-assisted delivery", [
      "Operative vaginal birth with a **vacuum extractor** applies controlled traction to a fetal cup attached by suction to the fetal scalp when second-stage arrest or emergent shortening of second stage is indicated (maternal exhaustion, nonreassuring fetal status with adequate pelvis, experienced operator). Nursing integrates **fetal tracing** interpretation, **maternal positioning**, **uterotonic readiness**, and **neonatal resuscitation** preparation.",
      "Complications include **neonatal cephalohematoma or subgaleal hemorrhage** (especially with prolonged traction, multiple pop-offs, or improper cup placement), **scalp lacerations**, **shoulder dystocia** if macrosomia underestimated, and **maternal lower-genital-tract lacerations** extending to third- or fourth-degree tears.",
      "Postpartum priorities include **Apgar scoring**, **newborn neuro exam** documentation, **fundal massage** with uterotonic administration for atony, **quantified blood loss**, and **cooling/warming** per newborn transition protocols. Escalate for **expanding head circumference**, **boggy fluctuant scalp**, **tachycardia**, **pallor**, or **hypotension** in the newborn—possible subgaleal bleed.",
    ]),
    examRelevance:
      "Boards test **traction limits**, **pop-off** responses, **fetal heart rate** patterns during attempts, and **post-birth newborn surveillance**. Traps include ignoring **newborn tachycardia** as “fussy baby,” delaying provider notification for **scalp swelling that crosses suture lines**, or focusing on maternal bonding alone before stabilizing perfusion.",
    coreConcept:
      "**Indications / contraindications themes:** adequate anesthesia, engaged vertex, trained operator, gestational age and station within device limits per policy.\n\n**Neonatal complications:** cephalohematoma (suture-bound) vs subgaleal (crosses sutures) teaching distinction.\n\n**Maternal complications:** lacerations, hemorrhage, infection.\n\n**Nursing priorities:** count attempts, document timing, prepare resuscitation, support second clinician checks.\n\n**Education:** parents need warning signs for newborn lethargy, poor feeding, tachypnea, scalp swelling progression.\n\n**Exam traps:** subgaleal hemorrhage can present with hypovolemic shock—treat as emergency.",
    clinicalScenario: scenario(
      "Vacuum delivery",
      "After three vacuum pulls, a term newborn develops **pallor**, **tachycardia to 210**, and a **soft, boggy** swelling over the occiput that seems to **spread across suture lines** within an hour of birth.",
    ),
    takeaways:
      "- **Scalp swelling crossing suture lines + shock** → think **subgaleal hemorrhage** until evaluated.\n- **Quantify blood loss** and trend **Hgb/Hct** in both mother and baby when bleeding risk.\n\n**Related:** [postpartum hemorrhage first actions](LESSON:postpartum-hemorrhage-first-actions-nclex) · [US RN hub](/us/rn/nclex-rn/lessons).",
    preTest: [
      pq(
        "Which newborn finding after vacuum delivery most urgently escalates care?",
        ["Transient acrocyanosis resolving with warming", "Cross-suture-line boggy scalp swelling with tachycardia and pallor", "One brief cry then calm", "Mild molding without bruising"],
        1,
        "Subgaleal hemorrhage can evolve rapidly into hypovolemic shock; crossing suture lines is a classic discriminator.",
      ),
    ],
    postTest: [
      pq(
        "Nursing documentation after vacuum delivery should prioritize:",
        ["Only maternal pain score", "Number of pulls, cup applications, fetal tracing snapshot, Apgars, and newborn scalp assessment", "Only time of birth", "Only cord gases if collected"],
        1,
        "Objective operative details and newborn neurovascular/skin assessment support safety and handoffs.",
      ),
    ],
  },
  {
    slug: "breast-engorgement-nclex-rn",
    title: "Breast Engorgement",
    topic: "Maternal & Newborn",
    topicSlug: "maternity",
    bodySystem: "Breast",
    clinicalMeaning: block("Breast engorgement", [
      "Engorgement reflects **vascular congestion** and **alveolar distension** when milk production ramps faster than removal—classically days 2–5 postpartum but also with **weaning**, **pumping gaps**, or **supplementation shifts**. The breasts become **firm, warm, tender**, and the areola may flatten, making **latch difficult** and worsening a cycle of ineffective milk transfer.",
      "Differentiate simple engorgement from **mastitis** (fever, focal erythema, systemic symptoms) and **abscess** (fluctuant mass). Nursing supports **frequent effective milk removal**, **reverse pressure softening** before latch, **analgesia** per orders, **cold compresses** between feeds for vasoconstriction, and **warmth** briefly before expression if helpful.",
      "Education emphasizes **feeding cues**, **hand expression** skills, **proper flange fit** for pumps, and **when to call** for fever, red streaking, or unilateral hot wedge—mastitis pathways.",
    ]),
    examRelevance:
      "Items reward **latch facilitation** over ignoring feeding difficulty, **supporting milk removal** rather than advising strict NPO to “rest the breasts,” and **infection surveillance**. Traps include recommending **dry up** strategies for early physiologic engorgement or delaying evaluation for **febrile unilateral breast pain**.",
    coreConcept:
      "**Pathophysiology:** lymphatic/vascular congestion + milk stasis.\n\n**Manifestations:** tight shiny skin, flattened nipple, baby fussing at breast.\n\n**Interventions:** feed/express on demand, reverse pressure softening, ibuprofen/acetaminophen per orders, cabbage leaves optional cultural practice if acceptable.\n\n**Complications:** nipple trauma, mastitis, undersupply from poor emptying.\n\n**Education:** paced return to work pumping plans, flange sizing, hydration, sleep.\n\n**Exam traps:** do not tell client to stop breastfeeding for routine engorgement without a clinical reason.",
    clinicalScenario: scenario(
      "Engorgement",
      "On postpartum day 3, a lactating client has **very firm breasts**, **nipples that are difficult to grasp**, and the newborn **latches briefly then slips off**, becoming increasingly frustrated.",
    ),
    takeaways:
      "- **Empty breasts gently but frequently**; soften areola to improve latch.\n- **Febrile focal pain** → mastitis workup—not “only engorgement.”\n\n**Related:** [breastfeeding assessment and teaching](LESSON:breastfeeding-assessment-teaching-nclex) · [Canada RN hub](/canada/rn/nclex-rn/lessons).",
    preTest: [
      pq(
        "Which strategy best supports latch during severe engorgement?",
        ["Advise skipping two feeds to rest the breasts", "Reverse pressure softening then latch with frequent feeding or pumping", "Recommend tight breast binding", "Apply heat continuously for 24 hours without feeding"],
        1,
        "Milk removal treats engorgement; areolar softening improves latch mechanics.",
      ),
    ],
    postTest: [
      pq(
        "Which symptom cluster should prompt urgent evaluation for mastitis rather than simple engorgement?",
        ["Soft bilateral fullness improving with feeds", "Fever with localized erythema and unilateral breast pain", "Mild nipple tenderness only", "Leaking milk between feeds without fever"],
        1,
        "Systemic symptoms with focal inflammation suggest infection.",
      ),
    ],
  },
  {
    slug: "prostate-cancer-nclex-rn",
    title: "Prostate Cancer — Nursing Across the Continuum",
    topic: "Renal & Urinary",
    topicSlug: "renal-gu",
    bodySystem: "Genitourinary",
    clinicalMeaning: block("Prostate cancer", [
      "Adenocarcinoma of the prostate is common and often **indolent**, but advanced disease threatens **bone**, **spinal cord**, **renal function**, and **nutrition**. Nurses coordinate **PSA trends** (with controversy awareness), **digital rectal exam** themes, **multiparametric MRI** and **biopsy** recovery, and **Gleason/Grade Group** literacy enough to teach in plain language.",
      "Localized disease pathways include **active surveillance**, **radical prostatectomy**, and **radiation** (IMRT, brachytherapy). Advanced disease may use **androgen deprivation therapy (ADT)** with bone-protective agents, **novel hormonal agents**, and **chemotherapy**—each with distinct toxicity profiles (hot flashes, metabolic syndrome, fractures, fatigue, cardiac risk).",
      "Oncologic emergencies include **spinal cord compression** from vertebral metastases (**new back pain + neuro deficit**), **DIC** patterns in disseminated disease, and **obstructive uropathy**. Nurses prioritize **neuro checks**, **bladder scanning**, **strict I&O**, and **timely escalation**.",
    ]),
    examRelevance:
      "Examiners contrast **BPH obstructive symptoms** with **malignant invasion** patterns (constitutional symptoms, bone pain). Traps include assuming **all PSA elevation is cancer**, or delaying **neuro assessment** when back pain and leg weakness coexist in a patient on ADT.",
    coreConcept:
      "**Risk factors:** age, family history, African ancestry, certain germline mutations (exam may hint BRCA2 themes).\n\n**Diagnostics:** PSA, imaging, biopsy; staging includes TNM and Gleason.\n\n**Treatments:** surgery, radiation, ADT, antiandrogens, chemotherapy—monitor bone health, cardiac risk, mood.\n\n**Nursing priorities:** sexual health counseling, incontinence after prostatectomy, radiation cystitis/skin care, fatigue.\n\n**Complications:** cord compression, pathologic fracture, urinary retention.\n\n**Education:** symptom reporting, exercise, calcium/vitamin D, adherence.\n\n**Exam traps:** cord compression = steroids + urgent MRI pathway—do not ambulate alone for “muscle strain.”",
    clinicalScenario: scenario(
      "Prostate cancer",
      "A client on ADT for metastatic prostate cancer reports **new mid-back pain** and **numb legs** when walking; post-void residual is **420 mL** and lower extremity strength is **4/5** bilaterally.",
    ),
    takeaways:
      "- **Back pain + neuro deficit** in metastatic prostate cancer → **cord compression** until cleared.\n- **Urinary retention** can be medication- or obstruction-related—scan and trend.\n\n**Related:** [BPH and urinary obstruction](LESSON:bph-urinary-obstruction-nclex) · [US RN hub](/us/rn/nclex-rn/lessons).",
    preTest: [
      pq(
        "Which finding in a patient with metastatic prostate cancer most urgently escalates care?",
        ["Stable mild nocturia", "New bilateral leg weakness with mid-thoracic back pain", "Mild fatigue without neuro change", "Request for a second pillow"],
        1,
        "Epidural metastasis with cord compression is a neurosurgical/oncologic emergency.",
      ),
    ],
    postTest: [
      pq(
        "ADT teaching should include monitoring for:",
        ["Improved deep tendon reflexes only", "Hot flashes, mood changes, bone loss risk, and metabolic changes", "Only hair growth", "Isolated ear ringing without follow-up"],
        1,
        "ADT has endocrine, metabolic, musculoskeletal, and psychosocial effects requiring surveillance and support.",
      ),
    ],
  },
  {
    slug: "diabetic-nephropathy-nursing-nclex-rn",
    title: "Diabetic Nephropathy",
    topic: "Renal & Urinary",
    topicSlug: "renal-gu",
    bodySystem: "Renal",
    clinicalMeaning: block("Diabetic nephropathy", [
      "Chronic hyperglycemia drives **glomerular hyperfiltration**, then **microalbuminuria**, then **macroalbuminuria** with declining **eGFR**—the leading cause of **ESRD** requiring dialysis in many populations. Hemodynamic and metabolic insults (RAAS activation, AGE deposition, podocyte injury) combine to scar nephrons irreversibly if glycemia and BP remain uncontrolled.",
      "Nursing integrates **home glucose patterns**, **ACE inhibitor/ARB** adherence when pregnancy-safe and indicated, **SGLT2 inhibitor** kidney-benefit themes when ordered, **BP targets**, **lipid control**, and **nephrotoxin avoidance** (NSAIDs, IV contrast caution with metformin hold policies per protocol).",
      "Patient education stresses **annual urine albumin-to-creatinine ratio**, **eGFR staging**, **dialysis access planning** early (fistula maturation months), **dietary protein and potassium** counseling with renal dietitian, and **hypoglycemia risk** as GFR falls (renally cleared agents).",
    ]),
    examRelevance:
      "Boards test **first detectable stage** (microalbuminuria), **ACE/ARB renoprotection** teaching, **contrast precautions**, and **anemia of CKD** with **ESA** themes as ordered. Traps include advising high-protein fad diets in advanced CKD or ignoring **rising potassium** after RAAS blockade initiation without follow-up labs.",
    coreConcept:
      "**Stages:** microalbuminuria → overt proteinuria → reduced eGFR.\n\n**Labs:** UACR, eGFR, BMP, Hgb for anemia.\n\n**BP control:** RAAS blockade when not contraindicated.\n\n**Glycemic agents:** dose-adjust renally cleared drugs; SGLT2 where appropriate.\n\n**Dialysis preparation:** AV fistula planning, access care, fluid limits.\n\n**Exam traps:** hold metformin when eGFR below institutional threshold; contrast-induced risk in CKD.",
    clinicalScenario: scenario(
      "Diabetic CKD",
      "A client with type 2 diabetes has **eGFR 28**, **K⁺ 5.6**, **Hgb 9.2**, and **UACR 890 mg/g**. They take **lisinopril** started two weeks ago and **metformin 1000 mg BID**.",
    ),
    takeaways:
      "- **Rising K⁺ after RAAS initiation** → recheck labs, hold/adjust per orders, ECG if symptomatic.\n- **Low eGFR** → reconcile **metformin** and **contrast** plans with provider/pharmacy.\n\n**Related:** [diabetes self-management](LESSON:diabetes-self-management-teaching) · [US RN hub](/us/rn/nclex-rn/lessons).",
    preTest: [
      pq(
        "Early diabetic kidney disease is best screened with:",
        ["Random glucose only", "Urine albumin-to-creatinine ratio and eGFR", "Urinalysis dipstick alone once", "Abdominal ultrasound yearly for all diabetics"],
        1,
        "UACR detects microalbuminuria; eGFR tracks function.",
      ),
    ],
    postTest: [
      pq(
        "Which teaching point best reflects RAAS blocker use in diabetic nephropathy?",
        ["Stop lisinopril if cough appears without provider input", "Report dizziness; follow-up creatinine and potassium after starts or dose changes", "ACE inhibitors are contraindicated in all diabetes", "Ignore potassium if asymptomatic"],
        1,
        "Hyperkalemia and acute kidney function changes can follow RAAS initiation—monitor per protocol.",
      ),
    ],
  },
  {
    slug: "allergen-immunotherapy-subcutaneous-nclex-rn",
    title: "Allergen Immunotherapy (Allergy Shots)",
    topic: "Infection Control",
    topicSlug: "infection-control",
    bodySystem: "Immune",
    clinicalMeaning: block("Allergen immunotherapy", [
      "Subcutaneous immunotherapy (SCIT) exposes allergic patients to **incrementally increasing** allergen extracts to induce **immune tolerance**, reducing rhinitis, asthma exacerbations, and anaphylaxis risk over months to years. Administration occurs only under **medical supervision** with **post-injection observation** (typically 30 minutes) because **systemic reactions** and **anaphylaxis** can occur even after uneventful prior doses.",
      "Nurses verify **extract identity**, **dose schedule**, **vital signs**, **asthma control** (many clinics defer if peak flow poorly controlled), and **concomitant beta-blocker** issues (may blunt epinephrine response—team decision). Emergency kit includes **intramuscular epinephrine**, **H1/H2 antihistamines**, **albuterol**, **IV access supplies**, and **oxygen**.",
      "Patient education covers **avoiding exercise** and **heat** immediately after injection, recognizing **urticaria, throat tightness, wheeze, syncope**, and the need to **remain on-site** for observation. Document **injection site** reactions (large late local swelling vs immediate systemic).",
    ]),
    examRelevance:
      "Examiners reward **observation time**, **epinephrine first** in anaphylaxis, and **withholding dose** when asthma is unstable or after a systemic reaction until reviewed. Traps include sending the patient home immediately after the first dose series escalation or using **oral antihistamines alone** for airway compromise.",
    coreConcept:
      "**Build-up vs maintenance phases:** incremental dosing schedule.\n\n**Adverse effects:** local erythema vs systemic anaphylaxis.\n\n**Nursing priorities:** double-check vial, site rotation, timed observation, emergency readiness.\n\n**Education:** autoinjector for home environmental allergies is different—clarify context.\n\n**Exam traps:** epinephrine IM anterolateral thigh is first-line for anaphylaxis—not diphenhydramine alone.",
    clinicalScenario: scenario(
      "Allergy shot reaction",
      "Ten minutes after an immunotherapy injection, a client develops **widespread hives**, **wheezing**, and **BP 88/52**.",
    ),
    takeaways:
      "- **Airway + circulation** first; **epinephrine IM** per anaphylaxis protocol.\n- **Observation** after every injection is non-negotiable in clinic policy.\n\n**Related:** [antibiotics, allergies, and hypersensitivity reactions](LESSON:antibiotic-classes-allergies-hy) · [US RN hub](/us/rn/nclex-rn/lessons).",
    preTest: [
      pq(
        "After allergen immunotherapy, priority nursing surveillance includes:",
        ["Immediate discharge to save chairs", "Timed observation with emergency medications available", "Heat and exercise to speed absorption", "Skipping vitals if the patient feels fine"],
        1,
        "Anaphylaxis can be delayed; observation and rescue readiness are standard.",
      ),
    ],
    postTest: [
      pq(
        "First-line medication for immunotherapy-induced anaphylaxis with bronchospasm and hypotension is:",
        ["Oral diphenhydramine only", "Intramuscular epinephrine", "Albuterol MDI only without assessment", "IV normal saline bolus only without airway assessment"],
        1,
        "Epinephrine treats both airway and shock in anaphylaxis.",
      ),
    ],
  },
  {
    slug: "tinea-corporis-nursing-nclex-rn",
    title: "Tinea Corporis (Ringworm)",
    topic: "Integumentary & Wound Care",
    topicSlug: "integumentary",
    bodySystem: "Integumentary",
    clinicalMeaning: block("Tinea corporis", [
      "**Dermatophyte** fungi (Trichophyton, Microsporum, Epidermophyton) invade keratin producing **annular, scaly plaques** with central clearing and a raised advancing border—often pruritic. Transmission is **skin-to-skin**, **fomites** (wrestling mats, shared towels), and **zoonotic** exposure (kittens with Microsporum canis).",
      "Topical **allylamines** (terbinafine) and **azoles** are first-line for limited disease; **oral antifungals** appear when extensive, refractory, or tinea capitis/onychomycosis coexists—monitor **LFTs** for oral terbinafine themes and drug interactions.",
      "Nursing differentiates tinea from **nummular eczema**, **psoriasis**, **erythema migrans**, and **granuloma annulare**. **KOH prep** (when performed) shows hyphae. Teach **completion** of therapy beyond symptom resolution to prevent recurrence.",
    ]),
    examRelevance:
      "Items test **hygiene teaching**, **pet source** questions, and **avoiding steroid monotherapy** on undiagnosed rashes (tinea incognito worsens with topical steroid). Traps include treating ringworm with **oral antibiotics**.",
    coreConcept:
      "**Manifestations:** pruritic annular scaly patches.\n\n**Diagnostics:** clinical exam; KOH; culture if atypical.\n\n**Treatment:** topical antifungal 1–2 weeks beyond resolution; oral if extensive.\n\n**Education:** wash clothing/bedding, avoid sharing razors, treat pets.\n\n**Exam traps:** steroid cream alone masks and spreads tinea.",
    clinicalScenario: scenario(
      "Ringworm",
      "A wrestler has **one pruritic round plaque** on the shoulder with **central clearing** and **raised scaly edge**; teammate has similar lesions.",
    ),
    takeaways:
      "- **Annular scaly border** → dermatophyte until proven otherwise.\n- **No steroid mono** on undiagnosed annular rash.\n\n**Related:** [cellulitis vs rash](LESSON:cellulitis-nursing-care-nclex) · [US RN hub](/us/rn/nclex-rn/lessons).",
    preTest: [
      pq(
        "Which feature best supports tinea corporis over nummular eczema?",
        ["Weeping coin-shaped vesicles without scale", "Raised scaly advancing border with central clearing", "Dermatomal distribution only", "Pain out of proportion without rash"],
        1,
        "The active border with central clearing is classic for dermatophyte infection.",
      ),
    ],
    postTest: [
      pq(
        "A patient applied triamcinolone ointment to a ring-shaped rash for two weeks; the rash worsened and lost its sharp border. This is best described as:",
        ["Allergic reaction to triamcinolone only", "Tinea incognito from steroid on undiagnosed dermatophyte infection", "Impetigo", "Urticaria"],
        1,
        "Topical steroids can alter tinea appearance and worsen fungal spread.",
      ),
    ],
  },
  {
    slug: "linezolid-nclex-rn",
    title: "Linezolid — Oxazolidinone Safety & Interactions",
    topic: "Pharmacology",
    topicSlug: "pharmacology",
    bodySystem: "Pharmacology",
    clinicalMeaning: block("Linezolid", [
      "Linezolid inhibits **bacterial protein synthesis** by binding the **50S ribosomal subunit**; it covers **MRSA**, **VRE**, and some **gram-positive** cocci orally and IV—valuable for OPAT and resistant infections. It is also a **reversible, nonselective MAO inhibitor** at human monoamine oxidase, creating **serotonergic drug interaction** risk and **dietary tyramine** concerns at higher cumulative exposure, especially when combined with **SSRIs/SNRIs**, **TCAs**, **triptans**, **meperidine**, or **dextromethorphan**.",
      "Toxicities include **thrombocytopenia** (often after >2 weeks), **anemia**, **peripheral/optic neuropathy** with prolonged use, and **lactic acidosis**—nurses trend **CBC**, **symptoms** (visual changes, paresthesias), and **lactate** when long courses are ordered.",
      "Serotonin syndrome presents with **hyperreflexia**, **clonus**, **agitation**, **tremor**, **fever**, **diarrhea**, and **autonomic instability** when serotonergic burden rises. Management is **withdrawal of offending agents**, **benzodiazepines** for agitation, **cyproheptadine** themes per provider, and **ICU** support for severe cases.",
    ]),
    examRelevance:
      "Examiners contrast **linezolid** with **vancomycin** (nephrotoxicity/infusion reaction) and test **drug interaction** knowledge. Traps include co-prescribing linezolid with **SSRI** without monitoring, ignoring **platelet trends** on day 14, or assuming MAOI diet rules never apply.",
    coreConcept:
      "**Mechanism:** 50S inhibitor; weak MAOI activity in humans.\n\n**Interactions:** serotonin syndrome with serotonergic meds; tyramine caution with high tyramine foods on prolonged therapy.\n\n**Monitoring:** CBC weekly on long courses; neuro checks; lactate if unwell.\n\n**Nursing priorities:** medication reconciliation, patient teaching on new neuro or visual symptoms.\n\n**Exam traps:** serotonin syndrome vs NMS—clonus and GI hyperactivity favor serotonin toxicity.",
    clinicalScenario: scenario(
      "Linezolid interaction",
      "On hospital day 12 of linezolid for MRSA osteomyelitis, a patient on **sertraline** develops **fever 38.8°C**, **diarrhea**, **tremor**, **hyperreflexia with ankle clonus**, and **HR 122**.",
    ),
    takeaways:
      "- **Clonus + serotonergic meds + linezolid** → **serotonin syndrome** until evaluated.\n- **Platelets** and **neuro-ocular** toxicity rise with duration.\n\n**Related:** [antibiotic classes and allergies](LESSON:antibiotic-classes-allergies-hy) · [US RN hub](/us/rn/nclex-rn/lessons).",
    preTest: [
      pq(
        "Which adverse effect pair is most specific to prolonged linezolid therapy?",
        ["Hypokalemia and metabolic alkalosis", "Thrombocytopenia and peripheral neuropathy risk", "Pulmonary fibrosis", "Ototoxicity requiring peak/trough"],
        1,
        "Linezolid marrow suppression and neuropathy increase with duration; vancomycin carries nephro/ototoxicity.",
      ),
    ],
    postTest: [
      pq(
        "A patient on linezolid and an SSRI shows clonus and autonomic instability. The priority nursing action is:",
        ["Encourage tyramine-rich foods", "Stop the SSRI/linezolid per provider protocol and escalate care for serotonin syndrome evaluation", "Administer another SSRI", "Discharge home with diphenhydramine only"],
        1,
        "Remove serotonergic agents and support ABCs; escalate per severity.",
      ),
    ],
  },
  {
    slug: "administering-medication-to-infants-nclex-rn",
    title: "Administering Medication to Infants",
    topic: "Pediatrics",
    topicSlug: "pediatrics",
    bodySystem: "Pediatrics",
    clinicalMeaning: block("Infant medication administration", [
      "Infants have **immature hepatic enzymes**, **higher body water**, **lower plasma protein binding**, and **narrow therapeutic windows**—dosing is **weight-based (mg/kg)** with **double-check** policies for high-alert drugs. Liquid formulations require **exact mL measurement** with oral syringes (not household spoons), **shake suspensions**, and **verify concentration** (e.g., acetaminophen mg/5 mL variants).",
      "Routes include **oral**, **IV**, **IM**, **rectal**, and **ophthalmic/otic**—each with positioning and aspiration precautions. **IV extravasation** risk is higher with small veins; secure lines, use smallest appropriate catheter, and monitor sites frequently.",
      "**Codeine/tramadol** themes: avoid in **ultra-rapid CYP2D6 metabolizers** and young children when exam stems reference FDA cautions—**morphine alternatives** per modern practice appear as safer teaching.",
    ]),
    examRelevance:
      "Boards test **six rights**, **two-nurse checks** for insulin/heparin/chemo, **oral syringe technique**, and **parent teach-back**. Traps include **rounding mg/kg doses incorrectly**, **mixing incompatible IV meds**, or **crushing enteric-coated** granules not labeled for sprinkles.",
    coreConcept:
      "**Rights of medication administration** plus weight-based math.\n\n**Aspiration:** elevate head for feeds/meds when appropriate.\n\n**Pain/fever:** acetaminophen vs ibuprofen age gates.\n\n**Antibiotics:** complete course teaching.\n\n**Exam traps:** verify concentration before every administration change.",
    clinicalScenario: scenario(
      "Infant med",
      "A 4-month-old is ordered **160 mg acetaminophen PO**; the cabinet has **80 mg/0.8 mL** concentrated drops and **160 mg/5 mL** liquid. The parent asks which syringe line to use.",
    ),
    takeaways:
      "- **Read mg AND mg/mL** every time; use **oral syringe**.\n- **Weight-based math** errors are a top harm event—have a second check.\n\n**Related:** [pediatric fever and dehydration](LESSON:pediatric-fever-dehydration) · [US RN hub](/us/rn/nclex-rn/lessons).",
    preTest: [
      pq(
        "Which device is safest for measuring liquid acetaminophen for an infant?",
        ["Kitchen tablespoon", "Oral syringe marked in milliliters", "Teaspoon from silverware drawer", "Estimating half the bottle"],
        1,
        "Milliliter-marked oral syringes reduce dosing errors.",
      ),
    ],
    postTest: [
      pq(
        "Before administering a new IV medication to an infant, the nurse should:",
        ["Skip compatibility because the line is peripheral", "Verify compatibility, flush per policy, and monitor the site during infusion", "Infuse rapidly to finish before shift change", "Mix all meds in one syringe to save supplies"],
        1,
        "Compatibility and site monitoring protect small veins from extravasation.",
      ),
    ],
  },
  {
    slug: "guaiac-fecal-occult-blood-testing-nclex-rn",
    title: "Fecal Occult Blood Testing (Guaiac / FIT)",
    topic: "Procedures & Skills",
    topicSlug: "procedures-skills",
    bodySystem: "Gastrointestinal",
    clinicalMeaning: block("FOBT / FIT", [
      "**Guaiac-based fecal occult blood tests (gFOBT)** detect **heme peroxidase activity**—they can be **false-positive** with **dietary red meat**, **some raw vegetables**, **vitamin C extremes**, and **NSAIDs/aspirin** depending on kit instructions. **FIT (immunochemical)** detects **human globin** and does not require dietary restriction—preferred in many screening programs for average-risk colorectal cancer screening.",
      "Nursing teaches **sample collection** from two or three separate bowel movements for gFOBT cards, **avoiding urine/water contamination**, and **returning slides** promptly. Explain that a **positive screen is not cancer**—it triggers **colonoscopy** referral.",
      "High-risk patients (IBD, family history, bleeding symptoms) should not rely on FOBT alone when guidelines recommend **direct visualization**—match teaching to provider plan.",
    ]),
    examRelevance:
      "Items test **diet/medication restrictions** for gFOBT vs FIT, **sample timing**, and **follow-up** for positives. Traps include continuing **high-dose aspirin** when kit prohibits, or telling patients **colonoscopy is unnecessary** after a positive FIT.",
    coreConcept:
      "**gFOBT:** peroxidase reaction; diet/medication instructions matter.\n\n**FIT:** antibody-based; fewer dietary interactions.\n\n**Nursing teaching:** written instructions, translation, privacy for collection.\n\n**Exam traps:** vitamin C can cause false negatives with guaiac; NSAIDs may increase positives.",
    clinicalScenario: scenario(
      "FOBT prep",
      "A 58-year-old asks if they can eat **rare steak** the night before returning a **guaiac** card and whether **ibuprofen** for knee pain is okay.",
    ),
    takeaways:
      "- Match instructions to **kit type** (guaiac vs FIT).\n- **Positive screen** → colonoscopy referral—document teaching.\n\n**Related:** [bowel management procedures](LESSON:proc-skill-bowel-management-rn) · [US RN hub](/us/rn/nclex-rn/lessons).",
    preTest: [
      pq(
        "Which statement best compares FIT with traditional guaiac stool cards?",
        ["FIT requires a week of red-meat loading", "FIT detects human hemoglobin and typically avoids dietary restrictions", "FIT measures gastric pH", "FIT replaces colonoscopy after any positive result"],
        1,
        "FIT is more specific to lower GI human blood and simplifies patient prep.",
      ),
    ],
    postTest: [
      pq(
        "A patient’s gFOBT is positive. The best next nursing action after notifying the provider is:",
        ["Reassure that bleeding is always benign hemorrhoids", "Teach that colonoscopy or next diagnostic step is needed per provider plan", "Tell the patient to repeat the test in one year only", "Advise high-dose NSAIDs to rule inflammation"],
        1,
        "Positive screening must trigger appropriate diagnostic follow-up.",
      ),
    ],
  },
  {
    slug: "major-depressive-disorder-nclex-rn",
    title: "Major Depressive Disorder (incl. SIGECAPS)",
    topic: "Mental Health",
    topicSlug: "mental-health",
    bodySystem: "Mental Health",
    clinicalMeaning: block("Major depressive disorder", [
      "MDD is a **syndrome of depressed mood or anhedonia** plus neurovegetative signs lasting **≥2 weeks** causing dysfunction. The **SIGECAPS** mnemonic maps screening domains: **S**leep change, **I**nterest loss, **G**uilt/worthlessness, **E**nergy loss, **C**oncentration impairment, **A**ppetite/weight change, **P**sychomotor change, **S**uicidality.",
      "Nursing performs **safety screening** (ideation, plan, intent, means, protective factors), **substance use** assessment, **medical mimics** (hypothyroid, B12 deficiency, OSA), and **perinatal** specificity. Therapies include **SSRIs/SNRIs**, **psychotherapy**, **ECT** for severe catatonia/suicidality, and **ketamine/esketamine** pathways in select systems.",
      "**Black box:** young adults may have **activation/akathisia** early after SSRI start—teach to report **restlessness**, **impulsivity**, or **worsening mood** especially in the first weeks.",
    ]),
    examRelevance:
      "Examiners reward **suicide risk triage**, **therapeutic communication**, and **medication teaching**. Traps include agreeing with hopeless statements (“you’re right, life is pointless”), **delaying** safety assessment to complete paperwork, or stopping SSRIs abruptly without taper plans.",
    coreConcept:
      "**DSM-style stem:** ≥5 symptoms including depressed mood or anhedonia for 2 weeks.\n\n**SIGECAPS:** rapid checklist.\n\n**Safety:** ask directly about suicidal thoughts—does not plant ideas.\n\n**Medications:** SSRIs take weeks; monitor GI, sexual side effects, hyponatremia in elderly.\n\n**Exam traps:** differentiate grief, adjustment, bipolar depression (mania history).",
    clinicalScenario: scenario(
      "MDD",
      "A college student reports **8 weeks** of **low mood**, **stopped soccer**, **insomnia**, **20 lb weight loss**, **worthlessness**, and **passive death wishes** without plan when asked.",
    ),
    takeaways:
      "- **Ask suicidality clearly**; escalate per protocol.\n- **SIGECAPS** helps structure documentation and education.\n\n**Related:** [delirium vs dementia vs depression](LESSON:delirium-vs-dementia-vs-depression-nclex) · [US RN hub](/us/rn/nclex-rn/lessons).",
    preTest: [
      pq(
        "Which question is best practice when assessing suicide risk?",
        ["Are you sure you would never hurt yourself because that would be selfish?", "Are you thinking about killing yourself right now? If so, do you have a plan and means?", "Let’s avoid scary topics—tell me about your hobbies", "If you were suicidal you would have done it already"],
        1,
        "Direct, nonjudgmental inquiry clarifies ideation, intent, and planning.",
      ),
    ],
    postTest: [
      pq(
        "The “S” in SIGECAPS refers to:",
        ["Speech latency only", "Sleep disturbance (insomnia or hypersomnia)", "Serum sodium", "Social drinking"],
        1,
        "SIGECAPS sleep changes are core neurovegetative signs.",
      ),
    ],
  },
  {
    slug: "infants-of-diabetic-mothers-nclex-rn",
    title: "Infants of Diabetic Mothers (IDM)",
    topic: "Maternal & Newborn",
    topicSlug: "maternity",
    bodySystem: "Neonatal",
    clinicalMeaning: block("Infants of diabetic mothers", [
      "Maternal hyperglycemia drives **fetal hyperinsulinism**, which shifts glucose across the placenta freely but **insulin does not cross**—after cord clamping, neonatal **insulin remains high** while **glucose supply stops**, producing **transient hypoglycemia** risk in the first hours. **Macrosomia**, **shoulder dystocia**, **birth trauma**, **polycythemia**, **hyperbilirubinemia**, **hypocalcemia**, and **RDS** (delayed lung maturity if diabetes poorly controlled) appear as vignette hooks.",
      "Nursing performs **early feeds** when stable, **glucose screening** per protocol (30–60 minutes first check common), **warmth**, and **respiratory** support if grunting/flaring. **IV dextrose** per NICU protocol when oral correction fails.",
      "Teach parents **feeding cues**, **shakiness**, **lethargy**, **poor latch**, and **when to call**—especially if home with borderline screen values.",
    ]),
    examRelevance:
      "Boards test **first glucose check timing**, **feed vs IV dextrose** decisions, and **RDS** risk. Traps include **waiting 12 hours** for first glucose on an IDM LGA infant, or assuming **polycythemia** is benign without monitoring jaundice or viscosity symptoms.",
    coreConcept:
      "**Pathophysiology:** fetal hyperinsulinemia → postnatal hypoglycemia.\n\n**Monitoring:** serial glucose, feeds, temperature, bilirubin, Hct.\n\n**Complications:** seizures from hypoglycemia, RDS, birth injury.\n\n**Exam traps:** LGA does not guarantee euglycemia—still screen.",
    clinicalScenario: scenario(
      "IDM",
      "A 3.9 kg newborn of a GDM mother is **jittery** at 45 minutes of life; first glucose is **42 mg/dL** before first feed attempt.",
    ),
    takeaways:
      "- **Early glucose surveillance + early feeding** are recurring correct arcs.\n- **Polycythemia** links to hyperviscosity and jaundice—monitor.\n\n**Related:** [newborn hypoglycemia](LESSON:newborn-hypoglycemia-nclex-rn) · [US RN hub](/us/rn/nclex-rn/lessons).",
    preTest: [
      pq(
        "Why are infants of diabetic mothers at risk for hypoglycemia after birth?",
        ["Maternal insulin crosses the placenta and suppresses the baby’s liver", "Fetal hyperinsulinism persists while exogenous glucose from the placenta ends at delivery", "The placenta stores glucose indefinitely", "Breast milk is hypotonic"],
        1,
        "Neonatal hyperinsulinism continues after placental glucose supply stops.",
      ),
    ],
    postTest: [
      pq(
        "Which additional complication is classically associated with poorly controlled maternal diabetes in pregnancy?",
        ["Microcephaly", "Macrosomia and birth injury risk", "Congenital rubella syndrome", "Biliary atresia"],
        1,
        "Hyperglycemia and hyperinsulinism promote fetal growth and metabolic complications.",
      ),
    ],
  },
  {
    slug: "carotid-endarterectomy-nclex-rn",
    title: "Carotid Endarterectomy — Perioperative Nursing",
    topic: "Cardiovascular",
    topicSlug: "cardiovascular",
    bodySystem: "Cardiovascular",
    clinicalMeaning: block("Carotid endarterectomy", [
      "**CEA** removes atherosclerotic plaque from the **internal carotid artery** to reduce **stroke risk** in symptomatic high-grade stenosis and selected asymptomatic patients per vascular surgery guidelines. Perioperative threats include **stroke/TIA recurrence**, **cranial nerve injury** (hypoglossal, vagus/recurrent laryngeal → hoarseness, facial marginal mandibular branch), **neck hematoma** with **airway compromise**, **hypertension** causing **hyperperfusion syndrome**, and **hypotension** causing watershed infarct.",
      "Nurses monitor **neuro checks** (speech, facial symmetry, strength), **BP tightly** per unit protocol, **drain output**, **swallow** before diet advancement, and **neck circumference** for expanding hematoma. **Emergent airway** equipment and surgeon notification are rehearsed for **stridor** or **rapid swelling**.",
      "Postoperative teaching includes **wound care**, **avoiding neck flexion/rotation** that stresses the incision, **antiplatelet** adherence, and **TIA warning** return precautions.",
    ]),
    examRelevance:
      "Examiners reward **neck hematoma + stridor = call surgeon and prepare airway** sequences. Traps include treating new hoarseness as “just sore throat” without nerve injury consideration, or allowing **wide BP swings** after CEA.",
    coreConcept:
      "**Complications:** hematoma, stroke, MI, hyperperfusion (headache, seizure, edema).\n\n**Monitoring:** neurovital signs, BP parameters, drains, swallow screen.\n\n**Medications:** antiplatelet per orders; antihypertensives titrated.\n\n**Exam traps:** expanding neck hematoma threatens airway faster than visible skin changes alone.",
    clinicalScenario: scenario(
      "CEA",
      "Two hours after CEA, the client develops **neck tightness**, **stridor**, and **BP 190/110** with **new mild left facial droop**.",
    ),
    takeaways:
      "- **Stridor after neck surgery** → airway emergency pathway.\n- **Tight BP control** protects against hyperperfusion and hypotension injury.\n\n**Related:** [stroke assessment](LESSON:stroke-assessment-tpa-window) · [US RN hub](/us/rn/nclex-rn/lessons).",
    preTest: [
      pq(
        "Which finding after carotid endarterectomy most urgently requires escalation?",
        ["Mild sore throat without stridor", "Expanding neck swelling with stridor and respiratory distress", "Stable incision bruising", "Mild headache relieved with acetaminophen"],
        1,
        "Hematoma can compress the airway; stridor signals imminent compromise.",
      ),
    ],
    postTest: [
      pq(
        "New hoarseness after CEA should prompt the nurse to:",
        ["Ignore if the patient can swallow water", "Assess cranial nerve function and notify the provider—possible recurrent laryngeal nerve injury", "Encourage shouting exercises", "Remove all IV fluids"],
        1,
        "Recurrent laryngeal nerve injury is a known surgical risk; assessment and communication matter.",
      ),
    ],
  },
  {
    slug: "vasectomy-teaching-nclex-rn",
    title: "Vasectomy — Pre- and Postprocedure Teaching",
    topic: "Renal & Urinary",
    topicSlug: "renal-gu",
    bodySystem: "Reproductive",
    clinicalMeaning: block("Vasectomy teaching", [
      "Vasectomy interrupts the **vas deferens** to provide **permanent contraception** while preserving **testosterone** production and **sexual function** themes patients worry about. It is typically office-based with **local anesthesia**; complications include **bleeding/hematoma**, **infection**, **chronic pain syndrome**, and **failure** if **early unprotected intercourse** occurs before **azoospermia** is confirmed on **post-vasectomy semen analysis (PVSA)** at ~8–12 weeks and ~20 ejaculations (protocols vary).",
      "Nursing teaches **scrotal support**, **ice intermittently**, **avoid heavy lifting**, **NSAID** use if not contraindicated, **signs of infection** (fever, purulent drainage), and **continued contraception** until PVSA shows no motile sperm.",
      "**Sterility is not immediate**—this is the most common exam trap.",
    ]),
    examRelevance:
      "Items test **contraception until PVSA**, **infection signs**, and **psychological readiness**. Traps include stating sterility is immediate or that **testosterone** drops.",
    coreConcept:
      "**Procedure basics:** local anesthesia, small incision or no-scalpel technique.\n\n**Post-op:** rest, ice, support, analgesia.\n\n**Follow-up:** semen analysis.\n\n**Exam traps:** alternate contraception until cleared by lab.",
    clinicalScenario: scenario(
      "Vasectomy",
      "A client asks if **condoms** can stop tonight—surgery was **yesterday** and PVSA is scheduled in **10 weeks**.",
    ),
    takeaways:
      "- **No unprotected intercourse** until provider confirms azoospermia.\n- **Pain, fever, expanding hematoma** → urgent evaluation.\n\n**Related:** [needlestick and bloodborne pathogen safety](LESSON:needlestick-bloodborne-pathogen-exposure-nclex-rn) · [US RN hub](/us/rn/nclex-rn/lessons).",
    preTest: [
      pq(
        "Which statement about vasectomy is accurate for patient teaching?",
        ["Sterility is immediate after the procedure", "Another contraceptive method is needed until post-vasectomy semen analysis confirms success", "Testosterone production stops", "Ejaculation will cease"],
        1,
        "Residual sperm remain distal to the cut until cleared by ejaculation and confirmed by PVSA.",
      ),
    ],
    postTest: [
      pq(
        "Which symptom should prompt urgent post-vasectomy evaluation?",
        ["Mild bruising at day 2", "Fever with purulent drainage from the incision", "Brief sting at injection site only", "Anxiety about the procedure"],
        1,
        "Fever and purulent drainage suggest infection requiring assessment.",
      ),
    ],
  },
  {
    slug: "encopresis-nclex-rn",
    title: "Encopresis — Pediatric Bowel Soiling",
    topic: "Pediatrics",
    topicSlug: "pediatrics",
    bodySystem: "Gastrointestinal",
    clinicalMeaning: block("Encopresis", [
      "**Retentive encopresis** begins with **voluntary or involuntary stool withholding** → **chronic constipation** → **rectal distension** and **decreased rectal sensation** → **liquid stool leaks** around impacted mass, mistaken for diarrhea. **Nonretentive** encopresis lacks constipation and links to **developmental/behavioral** factors—different workup.",
      "Nursing supports **disimpaction** (oral or rectal per provider), **maintenance polyethylene glycol** dosing, **scheduled toilet sits**, **positive reinforcement**, and **family shame reduction**. Teach **adequate fluids**, **fiber appropriate to age**, and **follow-up weights** if poor intake.",
      "Red flags for **organic** causes include **delayed meconium**, **failure to thrive**, **neurologic deficits**, **bloody stool**, or onset in infancy—escalate evaluation.",
    ]),
    examRelevance:
      "Boards distinguish **overflow incontinence** from infectious diarrhea and reward **bowel clean-out + maintenance** plans. Traps include **loperamide** for “diarrhea” when overflow is present, or punishing the child for soiling.",
    coreConcept:
      "**Pathophysiology:** impaction + overflow leakage.\n\n**Assessment:** abdominal exam, rectal exam per scope, stool calendar.\n\n**Treatment:** disimpaction then PEG maintenance; behavior plan.\n\n**Education:** nonpunitive approach, expected timeline to sensation recovery.\n\n**Exam traps:** do not use antidiarrheals for retentive encopresis.",
    clinicalScenario: scenario(
      "Encopresis",
      "A 6-year-old has **small stool accidents** daily but **large hard stools** twice weekly and **distended LLQ** on exam.",
    ),
    takeaways:
      "- **Hard stools + leakage** → retentive encopresis until proven otherwise.\n- **PEG maintenance** after successful clean-out is a common correct teaching arc.\n\n**Related:** [bowel sounds and GI assessment](LESSON:bowel-sounds-meaning-nclex-rn) · [US RN hub](/us/rn/nclex-rn/lessons).",
    preTest: [
      pq(
        "Which history best supports retentive encopresis?",
        ["Watery diarrhea only after travel", "Chronic constipation with intermittent liquid stool leakage", "Bloody stools with fever", "Six formed stools daily without distress"],
        1,
        "Overflow soiling around impaction is classic.",
      ),
    ],
    postTest: [
      pq(
        "Which medication class is cornerstone maintenance after disimpaction in retentive encopresis?",
        ["Loperamide daily", "Osmotic laxative such as PEG per provider protocol", "Broad-spectrum antibiotics empirically", "Proton pump inhibitors"],
        1,
        "PEG softens stool and supports regular evacuation; antidiarrheals worsen retention.",
      ),
    ],
  },
  {
    slug: "pertussis-nclex-rn",
    title: "Pertussis (Whooping Cough)",
    topic: "Infection Control",
    topicSlug: "infection-control",
    bodySystem: "Respiratory",
    clinicalMeaning: block("Pertussis", [
      "**Bordetella pertussis** toxin damages ciliated epithelium producing a **catarrhal** phase (URI-like), **paroxysmal** phase with **staccato cough bursts** and **inspiratory whoop** (may be absent in adults/immunized), and prolonged **convalescent** cough. Infants may present with **apnea**, **cyanosis**, or **bradycardia** without classic whoop—**high index of suspicion**.",
      "**Droplet precautions** plus **standard** for hospitalized patients; some institutions use **droplet for 5 days after starting effective macrolide** or until criteria met—follow facility policy. **Azithromycin** themes for treatment and post-exposure prophylaxis of close contacts appear frequently.",
      "Vaccination with **DTaP/Tdap** remains cornerstone prevention; educate on **maternal Tdap** timing in pregnancy per local guidelines.",
    ]),
    examRelevance:
      "Examiners reward **isolation timing**, **macrolide** administration, **respiratory support** for infants, and **contact tracing**. Traps include using **penicillin** as first-line when macrolides are guideline-central, or discontinuing precautions immediately without policy criteria.",
    coreConcept:
      "**Transmission:** respiratory droplets; highly contagious in catarrhal phase.\n\n**Clinical:** paroxysms, post-tussive emesis, whoop.\n\n**Labs:** PCR/nasopharyngeal swab.\n\n**Treatment:** azithromycin; supportive care; ICU for apnea.\n\n**Exam traps:** leukocytosis with lymphocytosis in infants—bad prognostic sign.",
    clinicalScenario: scenario(
      "Pertussis",
      "A 6-week-old has **apneic episodes** and **post-tussive cyanosis**; sibling has **100-day cough**.",
    ),
    takeaways:
      "- **Apnea in infant** + **household cough** → consider pertussis testing.\n- **Macrolide** for index and often prophylaxis for contacts per orders.\n\n**Related:** [airborne vs droplet vs contact precautions](LESSON:airborne-droplet-contact-respiratory-precautions-nclex) · [US RN hub](/us/rn/nclex-rn/lessons).",
    preTest: [
      pq(
        "Which precaution set is most appropriate for hospitalized pertussis until criteria are met?",
        ["Contact only", "Standard plus droplet precautions per policy", "Protective environment reverse isolation", "No precautions because vaccines exist"],
        1,
        "Pertussis spreads by droplets; combine with standard precautions.",
      ),
    ],
    postTest: [
      pq(
        "First-line antibiotic class commonly used for pertussis treatment in many guidelines:",
        ["Vancomycin", "Macrolide such as azithromycin", "Metronidazole", "First-generation cephalosporin alone"],
        1,
        "Macrolides treat pertussis and reduce bacterial shedding.",
      ),
    ],
  },
  {
    slug: "allopurinol-nclex-rn",
    title: "Allopurinol — Uric Acid Lowering & Safety",
    topic: "Pharmacology",
    topicSlug: "pharmacology",
    bodySystem: "Pharmacology",
    clinicalMeaning: block("Allopurinol", [
      "Allopurinol inhibits **xanthine oxidase**, reducing **uric acid** production for **gout prophylaxis**, **uric acid nephrolithiasis**, and **tumor lysis prophylaxis**. It is also one of the classic **SJS/TEN**–inducing drugs—**HLA-B*5801** screening appears in high-risk ancestries in teaching items.",
      "**Acute gout flare** can paradoxically occur when starting urate-lowering therapy—often **colchicine/NSAID** bridge per provider. **Hydration** and **alkalinization** themes accompany TLS prevention.",
      "Teach **rash reporting immediately** (can precede SJS), **avoid stopping abruptly** without provider when used for TLS plans, and **renal dose adjustment**.",
    ]),
    examRelevance:
      "Boards test **rash = stop drug and escalate**, **TLS prevention sequencing**, and **drug interaction** with **azathioprine/6-MP** (toxicity via xanthine oxidase blockade). Traps include continuing allopurinol through a **progressive morbilliform rash**.",
    coreConcept:
      "**Mechanism:** xanthine oxidase inhibitor.\n\n**Uses:** gout, TLS prophylaxis, some stone disease.\n\n**Adverse effects:** rash/SJS, hepatitis, bone marrow suppression.\n\n**Interactions:** azathioprine toxicity risk.\n\n**Exam traps:** start low, titrate; screen HLA-B*5801 in at-risk populations per policy.",
    clinicalScenario: scenario(
      "Allopurinol",
      "On day 10 of allopurinol for gout, a patient develops **confluent pruritic rash** on trunk with **fever 38.6°C**.",
    ),
    takeaways:
      "- **Fever + rash** on allopurinol → **stop and urgent evaluation** for SJS.\n- **TLS:** allopurinol before cytotoxic therapy per protocol—not after labs crash.\n\n**Related:** [gout nursing care](LESSON:gout-nursing-care-nclex) · [tumor lysis syndrome](LESSON:tumour-lysis-syndrome-tls) · [US RN hub](/us/rn/nclex-rn/lessons).",
    preTest: [
      pq(
        "Allopurinol lowers uric acid by inhibiting which enzyme?",
        ["Carbonic anhydrase", "Xanthine oxidase", "Cyclooxygenase-2", "Dihydrofolate reductase"],
        1,
        "Xanthine oxidase converts hypoxanthine and xanthine to uric acid.",
      ),
    ],
    postTest: [
      pq(
        "Which finding should prompt the nurse to urgently notify the provider in a patient newly on allopurinol?",
        ["Mild ankle stiffness without skin changes", "Progressive rash with mucosal involvement or fever", "Mild thirst", "One episode of heartburn"],
        1,
        "SJS/TEN can evolve from drug eruptions; early escalation saves lives.",
      ),
    ],
  },
  {
    slug: "neuroleptic-malignant-syndrome-nclex-rn",
    title: "Neuroleptic Malignant Syndrome (NMS)",
    topic: "Mental Health",
    topicSlug: "mental-health",
    bodySystem: "Neurological",
    clinicalMeaning: block("Neuroleptic malignant syndrome", [
      "NMS is a life-threatening idiosyncratic reaction to **dopamine D2 antagonists** (typical and atypical antipsychotics) and rarely other dopamine-depleting drugs. **Hypothalamic dysfunction** produces **hyperthermia**, **severe muscle rigidity** (“lead pipe”), **autonomic instability** (labile BP, tachycardia, diaphoresis), **altered mental status**, and **elevated CK** from rhabdomyolysis.",
      "Management is **stop the offending agent**, **supportive ICU care**, **bromocriptine** or **dantrolene** themes per psychiatry/neurocritical care protocols, **benzodiazepines** for agitation, **IV fluids** for CK/myoglobin, and **cooling** for hyperthermia. **Rechallenge** decisions are specialist-led.",
      "Differentiate from **serotonin syndrome** (medication class exposure, hyperreflexia/clonus, GI hyperactivity), **malignant hyperthermia** (anesthetic triggers), **anticholinergic toxicity**, and **sepsis**.",
    ]),
    examRelevance:
      "Examiners reward **early recognition**, **stopping dopamine blockers**, and **ICU-level support**. Traps include attributing fever only to infection without reviewing **new antipsychotic** timing, or giving **another antipsychotic** for agitation during NMS.",
    coreConcept:
      "**Diagnostic clues:** rigidity + fever + autonomic instability + CK rise after neuroleptic.\n\n**Interventions:** stop drug, cool, hydrate, monitor renal function, consider specific antidotes per orders.\n\n**Vs serotonin syndrome:** less clonus/GI hyperactivity prominence in NMS; medication history differs.\n\n**Exam traps:** do not restrain in ways that worsen heat production without cooling plan.",
    clinicalScenario: scenario(
      "NMS",
      "48 hours after **haloperidol** for ICU delirium, temperature is **40.2°C**, **lead-pipe rigidity**, **CK 18,000**, **BP 190/110 then 86/50**, and the patient is mute with fluctuating alertness.",
    ),
    takeaways:
      "- **Dopamine blocker + hyperthermia + rigidity + CK** → NMS until evaluated.\n- **Supportive ICU care** and **stop offending agents** are priority themes.\n\n**Related:** [linezolid serotonin](LESSON:linezolid-nclex-rn) · [delirium](LESSON:delirium-vs-dementia-vs-depression-nclex) · [US RN hub](/us/rn/nclex-rn/lessons).",
    preTest: [
      pq(
        "Which finding best differentiates NMS from serotonin syndrome in many vignettes?",
        ["Recent SSRI addition with clonus and hyperreflexia", "Lead-pipe rigidity with dopamine antagonist exposure and markedly elevated CK", "Isolated allergic urticaria", "Localized cellulitis"],
        1,
        "NMS centers on dopamine blockade with muscular rigidity and rhabdomyolysis; serotonin syndrome often shows clonus with serotonergic agents.",
      ),
    ],
    postTest: [
      pq(
        "First priority when NMS is suspected is:",
        ["Administer another antipsychotic for agitation", "Discontinue the offending antipsychotic and arrange urgent medical stabilization", "Continue the antipsychotic but add diphenhydramine", "Discharge to outpatient follow-up"],
        1,
        "Stop the trigger and escalate supportive care.",
      ),
    ],
  },
];

const pathways = {
  "us-rn-nclex-rn": defs.map(lesson),
  "ca-rn-nclex-rn": defs.map(lesson),
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ version: 1, generatedAt: new Date().toISOString(), source: "scripts/generate-exam-notes-integration-batch3-catalog.mjs", pathways }, null, 2) + "\n");
console.log("wrote", outPath, "lessons per pathway", pathways["us-rn-nclex-rn"].length);
