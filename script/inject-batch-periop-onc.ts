import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LESSONS_DIR = path.join(__dirname, "../client/src/data/lessons");

function escapeStr(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function buildLS(l: any): string {
  const li: string[] = [];
  li.push(`    title: "${escapeStr(l.title)}",`);
  li.push(`    cellular: { title: "${escapeStr(l.cellular.title)}", content: "${escapeStr(l.cellular.content)}" },`);
  li.push(`    riskFactors: [${l.riskFactors.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    diagnostics: [${l.diagnostics.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    management: [${l.management.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    nursingActions: [${l.nursingActions.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    assessmentFindings: [${l.assessmentFindings.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    signs: { left: [${l.signs.left.map((r:string) => `"${escapeStr(r)}"`).join(",")}], right: [${l.signs.right.map((r:string) => `"${escapeStr(r)}"`).join(",")}] },`);
  li.push(`    medications: [${l.medications.map((m:any) => `{ name: "${escapeStr(m.name)}", type: "${escapeStr(m.type)}", action: "${escapeStr(m.action)}", sideEffects: "${escapeStr(m.sideEffects)}", contra: "${escapeStr(m.contra)}", pearl: "${escapeStr(m.pearl)}" }`).join(",")}],`);
  li.push(`    pearls: [${l.pearls.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    quiz: [${l.quiz.map((q:any) => `{ question: "${escapeStr(q.question)}", options: [${q.options.map((o:string) => `"${escapeStr(o)}"`).join(",")}], correct: ${q.correct}, rationale: "${escapeStr(q.rationale)}" }`).join(",")}]`);
  return li.join("\n    ");
}

function inject(id: string, lesson: any): boolean {
  const files = fs.readdirSync(LESSONS_DIR).filter(f => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts");
  for (const file of files) {
    const fp = path.join(LESSONS_DIR, file);
    let src = fs.readFileSync(fp, "utf-8");
    const re = new RegExp(`"${id}":\\s*\\{[\\s\\S]*?\\[WRITE YOUR[\\s\\S]*?\\n  \\}`, "m");
    if (re.test(src)) {
      const replacement = `"${id}": {\n    ${buildLS(lesson)}\n  }`;
      src = src.replace(re, replacement);
      fs.writeFileSync(fp, src, "utf-8");
      console.log(`  Injected: ${id} -> ${file}`);
      return true;
    }
  }
  console.log(`  SKIP: ${id} (no placeholder found)`);
  return false;
}

const lessons: Record<string, any> = {
  "pre-post-op-care-rpn": {
    title: "Pre- and Post-Operative Care for Practical Nurses",
    cellular: {
      title: "Perioperative Physiology and Surgical Stress Response",
      content: "Surgery triggers a complex neuroendocrine stress response that begins with tissue injury and anesthesia. The hypothalamic-pituitary-adrenal (HPA) axis activates within minutes of surgical incision, releasing cortisol and catecholamines (epinephrine and norepinephrine) from the adrenal glands. Cortisol promotes gluconeogenesis, protein catabolism, and anti-inflammatory effects, while catecholamines increase heart rate, blood pressure, and cardiac output to maintain perfusion to vital organs. The sympathetic nervous system activation causes peripheral vasoconstriction, which redirects blood flow away from the skin and gastrointestinal tract toward the heart, brain, and kidneys. This explains why postoperative patients often present with cool extremities, decreased bowel sounds, and urinary retention. The inflammatory cascade releases cytokines (interleukin-1, interleukin-6, tumor necrosis factor-alpha) from damaged tissue, producing the systemic inflammatory response that manifests as fever, tachycardia, leukocytosis, and increased metabolic rate in the first 24 to 72 hours after surgery. Anesthetic agents depress the central nervous system, respiratory center, and cardiovascular reflexes. General anesthesia suppresses the cough reflex, impairs mucociliary clearance, and reduces functional residual capacity of the lungs, predisposing patients to atelectasis (alveolar collapse) and pneumonia. Opioid analgesics further depress respiratory drive and decrease gastrointestinal motility, contributing to postoperative ileus. Immobility during and after surgery activates Virchow triad (venous stasis, endothelial injury, hypercoagulability), significantly increasing the risk of deep vein thrombosis (DVT) and pulmonary embolism (PE). The practical nurse must understand these physiological responses to anticipate complications, perform systematic assessments, and report deviations from expected postoperative recovery patterns to the registered nurse or physician. The preoperative phase focuses on risk identification, patient preparation, and informed consent verification. The intraoperative phase involves maintaining patient safety and physiological stability. The postoperative phase requires vigilant monitoring of airway, breathing, circulation, neurological status, wound integrity, fluid balance, and pain management. Early ambulation, incentive spirometry, and sequential compression devices are evidence-based interventions that mitigate the physiological consequences of surgical stress and immobility."
    },
    riskFactors: [
      "Advanced age (slower metabolism of anesthetic agents, decreased cardiovascular reserve, impaired wound healing)",
      "Obesity (BMI greater than 30 increases risk of atelectasis, wound dehiscence, DVT, and difficult intubation)",
      "Smoking (impaired mucociliary clearance, increased carboxyhemoglobin, vasoconstriction delays wound healing)",
      "Diabetes mellitus (hyperglycemia impairs neutrophil function and wound healing, increases infection risk)",
      "Chronic obstructive pulmonary disease (reduced respiratory reserve, higher risk of postoperative pneumonia and ventilator dependence)",
      "Anticoagulant or antiplatelet therapy (increased bleeding risk during and after surgery)",
      "Malnutrition (serum albumin below 3.5 g/dL associated with poor wound healing, increased infection rates, and prolonged hospital stay)"
    ],
    diagnostics: [
      "Complete blood count (CBC): baseline hemoglobin and hematocrit to assess for anemia; WBC for infection; platelet count for bleeding risk; report hemoglobin below 10 g/dL preoperatively",
      "Basic metabolic panel (BMP): electrolytes (potassium critical for cardiac rhythm), glucose (hyperglycemia impairs healing), BUN/creatinine for renal function and anesthetic clearance",
      "Coagulation studies (PT/INR, aPTT): assess bleeding risk; INR greater than 1.5 may require correction before surgery; check if patient is on warfarin or heparin",
      "Chest X-ray: baseline assessment of cardiopulmonary status in patients over 60 or with respiratory/cardiac history; identifies cardiomegaly, pleural effusion, or lung pathology",
      "12-lead ECG: baseline cardiac rhythm and ischemia screening for patients over 50 or with cardiac risk factors; identify arrhythmias that may affect anesthesia",
      "Type and screen/crossmatch: blood typing and antibody screening for procedures with anticipated blood loss; crossmatch if transfusion is likely"
    ],
    management: [
      "Enforce NPO (nil per os) guidelines: clear liquids up to 2 hours before surgery, light meal up to 6 hours before, and full meal up to 8 hours before per ASA guidelines to prevent aspiration",
      "Complete the preoperative checklist: verify consent signed, identification band on, allergies documented, lab results available, NPO status confirmed, surgical site marked",
      "Administer preoperative medications as ordered: prophylactic antibiotics (typically within 60 minutes of incision), anxiolytics, and chronic medications per anesthesia instructions",
      "Implement postoperative respiratory interventions: incentive spirometry every 1-2 hours while awake (10 repetitions), coughing and deep breathing exercises, early head-of-bed elevation",
      "Initiate DVT prophylaxis as ordered: sequential compression devices (SCDs) applied before induction and continued until fully ambulatory; low-molecular-weight heparin as prescribed",
      "Promote early ambulation: progressive mobility starting with dangling legs at bedside, then standing, then walking within 4-8 hours after surgery unless contraindicated",
      "Monitor surgical wound: assess dressing for drainage (type, amount, odor), reinforce but do not change initial surgical dressing unless ordered; report excessive bleeding or purulent drainage"
    ],
    nursingActions: [
      "Perform immediate postoperative assessment using the ABCDE approach: Airway patency, Breathing rate and depth, Circulation (BP, pulse, capillary refill), Disability (level of consciousness, pupil response), Exposure (wound, drains, IV sites)",
      "Monitor vital signs every 15 minutes for the first hour, then every 30 minutes for 2 hours, then every 4 hours or per facility protocol; report temperature above 38.3 C (101 F) after 48 hours",
      "Assess pain using a validated tool (numeric rating scale 0-10) at least every 4 hours and within 30-60 minutes after analgesic administration; document pain score and response to intervention",
      "Monitor intake and output strictly: report urine output less than 30 mL/hour or 0.5 mL/kg/hour; assess for urinary retention (bladder distension) which is common after anesthesia",
      "Assess bowel function: auscultate bowel sounds in all four quadrants; document first flatus and bowel movement; report absent bowel sounds beyond 72 hours postoperatively (possible ileus)",
      "Verify surgical safety checklist (WHO Surgical Safety Checklist) elements: correct patient, correct procedure, correct site, consent verified, allergies confirmed, equipment available",
      "Report abnormal findings immediately: sudden increase in pain, change in wound drainage color or amount, new-onset confusion, oxygen saturation below 92%, absent pedal pulses, or calf tenderness"
    ],
    assessmentFindings: [
      "Hypoventilation and decreased oxygen saturation (SpO2 below 94%): residual effects of general anesthesia and opioid analgesics suppress respiratory drive",
      "Hypothermia (temperature below 36 C / 96.8 F): common in the immediate postoperative period due to cold operating room, IV fluid infusion, and anesthetic vasodilation",
      "Nausea and vomiting: affects 20-30% of postoperative patients; risk factors include female sex, history of motion sickness, use of volatile anesthetics and opioids",
      "Oliguria (urine output less than 30 mL/hour): may indicate hypovolemia, renal hypoperfusion, or urinary retention from anesthetic effects on the bladder detrusor muscle",
      "Wound drainage assessment: serous (clear, thin), sanguineous (bloody), serosanguineous (pink-tinged, most common postoperative drainage), or purulent (thick, yellow-green, indicates infection)",
      "Homan sign and calf assessment: unilateral calf swelling, warmth, redness, or pain with dorsiflexion may indicate DVT; however, Homan sign is unreliable and imaging is needed for confirmation",
      "Paralytic ileus: absent bowel sounds, abdominal distension, nausea, inability to pass flatus; common after abdominal surgery and opioid use"
    ],
    signs: {
      left: [
        "Mild incisional pain rated 3-4 on numeric scale",
        "Clear to serosanguineous wound drainage on dressing",
        "Drowsiness and slow emergence from anesthesia",
        "Mild nausea without vomiting",
        "Temperature slightly below 36.5 C in the first hour",
        "Slightly decreased urine output in the first 2 hours"
      ],
      right: [
        "Sudden severe pain or pain unresponsive to prescribed analgesics (possible hemorrhage, compartment syndrome)",
        "Oxygen saturation below 90% or respiratory rate below 8 or above 30 breaths per minute",
        "Frank hemorrhage or rapidly expanding hematoma at surgical site",
        "New-onset confusion, agitation, or unresponsiveness (may indicate hypoxia, hemorrhage, or stroke)",
        "Absent pedal pulses or cold, pale extremity after orthopedic surgery (possible vascular compromise)",
        "Wound evisceration (protrusion of abdominal organs through incision) -- cover with sterile saline-moistened gauze and call surgeon immediately"
      ]
    },
    medications: [
      {
        name: "Cefazolin (Ancef/Kefzol)",
        type: "First-generation cephalosporin (prophylactic antibiotic)",
        action: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins (PBPs), disrupting peptidoglycan cross-linking. Provides excellent gram-positive coverage (Staphylococcus aureus, Streptococcus species) and moderate gram-negative coverage for surgical wound prophylaxis.",
        sideEffects: "Injection site pain, diarrhea, nausea, allergic reaction (rash, urticaria), Clostridioides difficile-associated diarrhea with prolonged use",
        contra: "Known anaphylaxis to cephalosporins; use with caution in patients with penicillin allergy (approximately 1-2% cross-reactivity); dose adjustment in renal impairment (CrCl below 55 mL/min)",
        pearl: "Administer within 60 minutes before surgical incision for optimal tissue levels; re-dose every 4 hours during surgery or if blood loss exceeds 1500 mL; most commonly used prophylactic antibiotic for clean and clean-contaminated surgical procedures"
      },
      {
        name: "Ondansetron (Zofran)",
        type: "Antiemetic (5-HT3 serotonin receptor antagonist)",
        action: "Selectively blocks serotonin 5-HT3 receptors in the chemoreceptor trigger zone (CTZ) and on vagal afferent nerve terminals in the gastrointestinal tract, preventing nausea and vomiting signals from reaching the vomiting center in the medulla oblongata.",
        sideEffects: "Headache (most common), constipation, dizziness, QT prolongation (dose-dependent risk of torsades de pointes)",
        contra: "Congenital long QT syndrome; concurrent use with apomorphine; caution with other QT-prolonging medications (fluoroquinolones, antipsychotics, class III antiarrhythmics)",
        pearl: "Administer 4 mg IV at the end of surgery for postoperative nausea and vomiting (PONV) prophylaxis; maximum single IV dose is 16 mg; check ECG if giving repeat doses or in patients with cardiac history; can be given orally, IV, or as an orally disintegrating tablet"
      },
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low-molecular-weight heparin (LMWH) anticoagulant",
        action: "Binds to antithrombin III and preferentially inhibits Factor Xa (with less effect on thrombin/Factor IIa compared to unfractionated heparin), preventing conversion of prothrombin to thrombin and fibrinogen to fibrin, thereby inhibiting clot formation in the venous system.",
        sideEffects: "Injection site bruising and hematoma, bleeding (gingival, epistaxis, hematuria), thrombocytopenia (HIT less common than with unfractionated heparin), elevated liver enzymes",
        contra: "Active major bleeding; history of heparin-induced thrombocytopenia (HIT); severe thrombocytopenia (platelets below 100,000); epidural catheter in place (risk of spinal hematoma -- must wait per protocol before insertion or removal)",
        pearl: "Inject subcutaneously into the abdomen (alternate left and right sides); do NOT rub the injection site after administration; prophylactic dose is typically 40 mg subcutaneous once daily starting 12 hours preoperatively or 12 hours postoperatively; monitor platelet count for HIT; no routine aPTT monitoring needed (unlike unfractionated heparin)"
      }
    ],
    pearls: [
      "The preoperative checklist is a PATIENT SAFETY priority: verify identification, consent, allergies, NPO status, surgical site marking, and removal of jewelry, dentures, hearing aids, and nail polish before transfer to the operating room",
      "NPO guidelines follow the 2-4-6-8 rule: clear liquids 2 hours, breast milk 4 hours, light meal or formula 6 hours, full meal or fatty foods 8 hours before surgery -- aspiration of gastric contents is a life-threatening anesthetic complication",
      "Incentive spirometry is the single most important respiratory intervention after surgery: instruct patients to sustain inhalation for 3-5 seconds, perform 10 repetitions every 1-2 hours while awake to prevent atelectasis and pneumonia",
      "Postoperative fever follows a predictable timeline (the 5 Ws): Wind (atelectasis, postoperative day 1-2), Water (UTI, day 3-5), Wound (surgical site infection, day 5-7), Walking (DVT/PE, day 4-6), Wonder drugs (drug fever or transfusion reaction, any time)",
      "Wound dehiscence risk factors include obesity, diabetes, malnutrition, smoking, and chronic steroid use -- if evisceration occurs, place the patient in low Fowler position with knees bent, cover the exposed organs with sterile saline-moistened gauze, and notify the surgeon immediately",
      "Malignant hyperthermia is a rare but life-threatening reaction to volatile anesthetic agents (halothane, sevoflurane) and succinylcholine -- presents with rapidly rising temperature (above 40 C), muscle rigidity, tachycardia, and hypercarbia; treatment is immediate dantrolene sodium IV",
      "Postoperative urinary retention is common after spinal anesthesia, pelvic surgery, and opioid administration -- bladder scan showing greater than 300-400 mL with inability to void requires straight catheterization per protocol"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient 2 hours after abdominal surgery. The patient has not voided since returning from the operating room and reports suprapubic discomfort. A bladder scan shows 450 mL of urine. Which action should the practical nurse take first?",
        options: [
          "Encourage the patient to ambulate to the bathroom",
          "Perform straight catheterization per facility protocol",
          "Increase the IV fluid rate to promote diuresis",
          "Apply a warm compress to the lower abdomen and reassess in 1 hour"
        ],
        correct: 1,
        rationale: "A bladder scan showing 450 mL with inability to void indicates urinary retention, which is common after anesthesia. Straight catheterization is the appropriate intervention to relieve the distended bladder and prevent bladder injury. Ambulation may be premature at 2 hours post-abdominal surgery, and increasing IV fluids would worsen distension."
      },
      {
        question: "A patient is scheduled for surgery at 1000. The anesthesiologist has ordered NPO after midnight. At 0600, the patient asks for a glass of apple juice. Based on current ASA fasting guidelines, what is the most appropriate response?",
        options: [
          "Allow the apple juice because clear liquids are permitted up to 2 hours before surgery",
          "Refuse all oral intake because the NPO order states nothing after midnight",
          "Allow only ice chips because they are not considered a liquid",
          "Contact the anesthesiologist to clarify whether clear liquids are permitted"
        ],
        correct: 3,
        rationale: "While current ASA guidelines permit clear liquids up to 2 hours before surgery, the anesthesiologist's specific order states NPO after midnight. The practical nurse should not independently override a physician order. The correct action is to contact the anesthesiologist to clarify whether the patient may have clear liquids, as the order may be updated based on current guidelines."
      },
      {
        question: "A practical nurse is performing postoperative assessments on a patient who had surgery 48 hours ago. The patient develops a temperature of 38.5 C (101.3 F). Using the 5 Ws framework, which is the most likely cause of fever at this time point?",
        options: [
          "Atelectasis (Wind)",
          "Urinary tract infection (Water)",
          "Surgical site infection (Wound)",
          "Deep vein thrombosis (Walking)"
        ],
        correct: 0,
        rationale: "Using the 5 Ws mnemonic for postoperative fever, Wind (atelectasis) is the most common cause of fever in the first 24-48 hours after surgery. Atelectasis results from shallow breathing, reduced cough reflex from anesthesia, and immobility. Incentive spirometry and coughing/deep breathing exercises are the primary interventions to prevent and treat atelectasis."
      }
    ]
  },

  "prostate-cancer-basics-rpn": {
    title: "Prostate Cancer Basics for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Prostate Cancer",
      content: "Prostate cancer is the most common non-skin cancer in men and the second leading cause of cancer death in males. The prostate gland is a walnut-sized exocrine gland located inferior to the urinary bladder and anterior to the rectum, surrounding the proximal urethra. Its primary function is to secrete an alkaline fluid that constitutes approximately 30% of seminal fluid volume, providing nutrients and a protective environment for spermatozoa. The peripheral zone of the prostate is where approximately 70% of prostate cancers originate, which is why the digital rectal exam (DRE) can detect many tumors because the peripheral zone is directly palpable through the anterior rectal wall. Prostate cancer is an adenocarcinoma in over 95% of cases, arising from glandular epithelial cells that undergo malignant transformation. The development of prostate cancer is strongly androgen-dependent: testosterone is converted to dihydrotestosterone (DHT) by the enzyme 5-alpha reductase within prostate cells, and DHT binds to androgen receptors to stimulate cell growth and proliferation. This androgen dependence is the basis for hormonal therapy (androgen deprivation therapy). The Gleason grading system evaluates tumor differentiation: pathologists assign two scores (most predominant and second most predominant pattern, each from 1 to 5) that are added together for a Gleason sum score ranging from 2 to 10. Higher Gleason scores (8-10) indicate poorly differentiated, more aggressive tumors with worse prognosis. The Grade Group system (1-5) has largely replaced the Gleason system in clinical practice but both remain in use. Prostate-specific antigen (PSA) is a serine protease enzyme produced by both normal and malignant prostate epithelial cells. PSA is organ-specific but NOT cancer-specific -- elevations can occur with benign prostatic hyperplasia, prostatitis, urinary tract infection, recent ejaculation, or vigorous cycling. A PSA level above 4.0 ng/mL is generally considered the threshold for further evaluation, though age-adjusted ranges exist. The primary metastatic pathway for prostate cancer is through the vertebral venous plexus (Batson plexus) to the axial skeleton, making bone the most common site of distant metastasis. Bone metastases in prostate cancer are characteristically osteoblastic (bone-forming) rather than osteolytic (bone-destroying), appearing as dense white areas on bone scan. Locally, the tumor can extend beyond the prostatic capsule to invade the seminal vesicles, bladder neck, or pelvic lymph nodes. The practical nurse plays a critical role in monitoring patients throughout the screening, diagnosis, treatment, and survivorship continuum, including managing urinary symptoms, supporting emotional wellbeing, and reporting changes in pain patterns that may indicate disease progression."
    },
    riskFactors: [
      "Age over 50 years (risk increases sharply after age 50; rare before age 40; median age at diagnosis is 66 years)",
      "Family history of prostate cancer (first-degree relative with prostate cancer doubles the risk; BRCA2 mutation carriers have significantly elevated risk)",
      "African American ethnicity (1.7 times higher incidence and 2.1 times higher mortality compared to Caucasian men; earlier age of onset)",
      "High-fat Western diet (diets high in red meat, processed meat, and dairy may increase risk; diets rich in tomatoes/lycopene and cruciferous vegetables may be protective)",
      "Obesity (BMI greater than 30 associated with higher-grade tumors and increased risk of biochemical recurrence after treatment)",
      "Agent Orange exposure (veterans exposed to Agent Orange have increased prostate cancer risk and more aggressive disease patterns)",
      "Lynch syndrome and BRCA gene mutations (hereditary cancer syndromes significantly increase lifetime prostate cancer risk)"
    ],
    diagnostics: [
      "Prostate-specific antigen (PSA) blood test: normal is typically below 4.0 ng/mL; PSA velocity (rate of rise) greater than 0.75 ng/mL/year is concerning; PSA density (PSA divided by prostate volume) helps distinguish cancer from BPH",
      "Digital rectal exam (DRE): palpation of the prostate through the anterior rectal wall; cancer feels as a hard, irregular, fixed nodule; normal prostate feels smooth and rubbery",
      "Transrectal ultrasound (TRUS)-guided biopsy: 12-core systematic biopsy is the standard for tissue diagnosis; performed when PSA is elevated or DRE is abnormal; complications include bleeding, infection, and urinary retention",
      "Multiparametric MRI (mpMRI) of the prostate: PI-RADS scoring system (1-5) identifies suspicious lesions before biopsy; increasingly used to guide targeted biopsies and reduce unnecessary biopsies",
      "Bone scan (technetium-99m): indicated when PSA is above 20 ng/mL, Gleason score 8 or higher, or bone pain symptoms; detects osteoblastic metastases as areas of increased radiotracer uptake",
      "CT scan of abdomen and pelvis: evaluates for lymph node enlargement, organ metastases, and local extension beyond the prostate capsule; used in staging workup for intermediate and high-risk disease"
    ],
    management: [
      "Active surveillance: appropriate for low-risk, localized disease (Gleason 3+3, PSA below 10, stage T1c-T2a); involves PSA every 3-6 months, DRE every 12 months, and repeat biopsy at 1-2 years",
      "Radical prostatectomy: surgical removal of the entire prostate, seminal vesicles, and surrounding tissue; common complications include urinary incontinence (improves over 6-12 months) and erectile dysfunction",
      "External beam radiation therapy: delivers targeted radiation to the prostate over 7-9 weeks; side effects include radiation cystitis, proctitis (rectal inflammation), fatigue, and erectile dysfunction",
      "Androgen deprivation therapy (ADT): reduces testosterone to castrate levels to slow androgen-dependent tumor growth; achieved with GnRH agonists (leuprolide) or antagonists or bilateral orchiectomy",
      "Monitor for and manage treatment side effects: urinary incontinence (pelvic floor exercises/Kegel exercises), erectile dysfunction, hot flashes from ADT, osteoporosis risk from long-term ADT",
      "Provide psychosocial support: address anxiety about diagnosis, body image changes, sexual dysfunction, and partner relationship concerns; refer to support groups and counseling as needed",
      "Pain management for advanced disease: bone metastases require a multimodal approach including analgesics, bisphosphonates or denosumab for bone protection, and palliative radiation for painful lesions"
    ],
    nursingActions: [
      "Educate patients about PSA screening limitations: PSA is not cancer-specific and can be elevated by BPH, prostatitis, UTI, recent ejaculation, or bicycle riding; shared decision-making about screening is recommended",
      "Monitor for post-prostatectomy complications: assess urine output and catheter patency (Foley catheter typically remains 1-2 weeks); report continuous bladder irrigation (CBI) clots or frank hemorrhage",
      "Instruct on pelvic floor muscle exercises (Kegel exercises): contract pelvic floor muscles for 5-10 seconds, relax for 10 seconds, repeat 10-15 times, 3 times daily; begin preoperatively for best outcomes in reducing post-prostatectomy incontinence",
      "Monitor patients on ADT for metabolic effects: weight gain, hyperglycemia, dyslipidemia, osteoporosis (DEXA scan at baseline), cardiovascular risk -- report significant changes to the healthcare team",
      "Assess pain patterns in patients with bone metastases: new or worsening back pain, pathological fracture risk, spinal cord compression symptoms (bilateral leg weakness, urinary retention, saddle anesthesia) require emergency reporting",
      "Provide pre-procedure education for prostate biopsy: antibiotic prophylaxis, discontinue anticoagulants as ordered, possible hematuria/hematospermia for several weeks, report fever or inability to void",
      "Document and report changes in urinary function: frequency, urgency, nocturia, weak stream, hesitancy, hematuria, or urinary retention may indicate disease progression or treatment side effects"
    ],
    assessmentFindings: [
      "Early-stage prostate cancer is typically asymptomatic and detected only through PSA screening or incidental DRE finding",
      "Lower urinary tract symptoms (LUTS): urinary frequency, urgency, nocturia, hesitancy, weak stream, incomplete emptying -- more common with locally advanced disease compressing the urethra",
      "Hematuria (blood in urine) or hematospermia (blood in semen): may indicate local tumor invasion into the urethra or ejaculatory ducts",
      "Bone pain (especially lower back, pelvis, hips, ribs): characteristic of metastatic disease; osteoblastic metastases cause deep, aching, constant pain that worsens at night",
      "Pathological fracture: may be the presenting sign of metastatic prostate cancer; vertebral compression fractures can cause acute severe back pain and height loss",
      "Bilateral lower extremity edema: may indicate lymph node metastases causing lymphatic obstruction in the pelvis",
      "Spinal cord compression: bilateral leg weakness, sensory loss, urinary retention with overflow incontinence, and saddle anesthesia -- this is an oncological emergency requiring immediate intervention"
    ],
    signs: {
      left: [
        "Elevated PSA level requiring follow-up evaluation",
        "Mild urinary frequency or nocturia (1-2 times per night)",
        "Small, firm nodule on DRE",
        "Transient hematospermia after biopsy",
        "Fatigue during radiation therapy",
        "Mild hot flashes during androgen deprivation therapy"
      ],
      right: [
        "Spinal cord compression symptoms (bilateral leg weakness, saddle anesthesia, urinary retention)",
        "Pathological fracture from bone metastasis",
        "Acute urinary retention (inability to void with bladder distension above 500 mL)",
        "Severe uncontrolled bone pain unresponsive to prescribed analgesics",
        "Deep vein thrombosis or pulmonary embolism (cancer-associated hypercoagulability)",
        "Urosepsis (fever, rigors, hypotension following urological procedure)"
      ]
    },
    medications: [
      {
        name: "Leuprolide (Lupron)",
        type: "GnRH agonist (androgen deprivation therapy)",
        action: "Initially stimulates then downregulates GnRH receptors in the anterior pituitary, leading to suppression of luteinizing hormone (LH) and follicle-stimulating hormone (FSH) release, ultimately reducing testicular testosterone production to castrate levels (below 50 ng/dL) within 2-4 weeks.",
        sideEffects: "Hot flashes (most common), decreased libido, erectile dysfunction, weight gain, gynecomastia, osteoporosis (long-term), fatigue, metabolic syndrome (increased glucose, cholesterol, triglycerides), depression",
        contra: "Pregnancy (teratogenic); caution in patients with prolonged QT interval, cardiovascular disease, or vertebral metastases with impending spinal cord compression (initial testosterone flare can worsen symptoms)",
        pearl: "Initial testosterone flare occurs in the first 1-2 weeks (tumor flare) -- antiandrogen (bicalutamide) is often started 1-2 weeks before leuprolide to block the flare; administer as intramuscular or subcutaneous depot injection (monthly, 3-month, 4-month, or 6-month formulations); monitor bone density (DEXA scan) annually during long-term therapy"
      },
      {
        name: "Bicalutamide (Casodex)",
        type: "Nonsteroidal antiandrogen",
        action: "Competitively blocks androgen receptors in prostate tissue, preventing testosterone and dihydrotestosterone (DHT) from binding and stimulating tumor cell growth. Does not reduce serum testosterone levels but blocks its cellular effects at the receptor level.",
        sideEffects: "Gynecomastia and breast tenderness (most common), hot flashes, diarrhea, nausea, hepatotoxicity (monitor liver function tests), fatigue, decreased libido",
        contra: "Severe hepatic impairment; concurrent use with terfenadine, astemizole, or cisapride (CYP3A4 interactions); women who are or may become pregnant (pregnancy category X)",
        pearl: "Often given concurrently with a GnRH agonist for combined androgen blockade (CAB); started 1-2 weeks before GnRH agonist to prevent tumor flare; check liver function tests (ALT, AST) at baseline and periodically during treatment; taken once daily with or without food"
      },
      {
        name: "Tamsulosin (Flomax)",
        type: "Alpha-1 adrenergic blocker (selective alpha-1A antagonist)",
        action: "Selectively blocks alpha-1A adrenergic receptors in the smooth muscle of the prostate capsule, prostatic urethra, and bladder neck, causing relaxation and improved urinary flow. Does NOT shrink the prostate but relieves obstructive urinary symptoms by reducing smooth muscle tone.",
        sideEffects: "Orthostatic hypotension and dizziness (especially with first dose), retrograde ejaculation, nasal congestion, headache, intraoperative floppy iris syndrome (IFIS) during cataract surgery",
        contra: "Concurrent use with strong CYP3A4 inhibitors (ketoconazole); known hypersensitivity to sulfonamides (tamsulosin contains a sulfonamide moiety); caution with concurrent PDE5 inhibitors or other alpha-blockers (additive hypotension)",
        pearl: "Administered 30 minutes after the same meal each day to improve absorption and reduce side effects; instruct patients to rise slowly from sitting or lying position to prevent orthostatic hypotension; inform ophthalmologist about tamsulosin use before any cataract surgery due to IFIS risk; symptom relief typically occurs within 1-2 weeks"
      }
    ],
    pearls: [
      "PSA is organ-specific but NOT cancer-specific -- BPH, prostatitis, UTI, ejaculation within 48 hours, vigorous cycling, and DRE can all elevate PSA; always interpret PSA in clinical context",
      "The Gleason score is the sum of the two most predominant tumor pattern grades (each 1-5); a Gleason 4+3=7 is more aggressive than a 3+4=7 because the predominant pattern is higher grade",
      "Prostate cancer bone metastases are characteristically OSTEOBLASTIC (bone-forming, appear white/dense on X-ray and bone scan) unlike most other cancers which cause osteolytic (bone-destroying) lesions",
      "Spinal cord compression from vertebral metastases is an oncological emergency: bilateral leg weakness, saddle anesthesia, and urinary retention require emergency MRI and high-dose corticosteroids -- permanent paralysis can result from delayed treatment",
      "Testosterone flare with GnRH agonists can cause acute bone pain, urinary obstruction, or spinal cord compression in the first 1-2 weeks -- antiandrogen (bicalutamide) is started before the GnRH agonist to prevent this",
      "Pelvic floor muscle exercises (Kegel exercises) started BEFORE prostatectomy significantly improve postoperative urinary continence recovery -- teach the patient to identify and strengthen the pubococcygeus muscle",
      "Long-term androgen deprivation therapy increases risk of metabolic syndrome, diabetes, cardiovascular disease, and osteoporosis -- monitor BMI, glucose, lipids, and bone density regularly and encourage weight-bearing exercise and calcium/vitamin D supplementation"
    ],
    quiz: [
      {
        question: "A 68-year-old patient has been started on leuprolide (Lupron) for advanced prostate cancer. The patient asks why he is also taking bicalutamide (Casodex). What is the best explanation the practical nurse can provide?",
        options: [
          "Bicalutamide reduces the hot flashes caused by leuprolide",
          "Bicalutamide prevents the initial testosterone flare that occurs with leuprolide",
          "Bicalutamide is needed to lower PSA levels faster than leuprolide alone",
          "Bicalutamide replaces leuprolide once testosterone levels are suppressed"
        ],
        correct: 1,
        rationale: "GnRH agonists like leuprolide cause an initial surge (flare) of testosterone production in the first 1-2 weeks before downregulating GnRH receptors. This flare can worsen symptoms, particularly bone pain or urinary obstruction. Bicalutamide is started before leuprolide to block androgen receptors during the flare period and prevent symptom exacerbation."
      },
      {
        question: "A practical nurse is caring for a patient with metastatic prostate cancer who reports new-onset bilateral leg weakness and difficulty urinating. What is the priority action?",
        options: [
          "Administer prescribed opioid analgesic and reassess in 1 hour",
          "Notify the physician immediately as these symptoms may indicate spinal cord compression",
          "Encourage the patient to ambulate with assistance to assess leg strength",
          "Insert a urinary catheter and document the urine output"
        ],
        correct: 1,
        rationale: "Bilateral leg weakness combined with urinary difficulty in a patient with known bone metastases is highly suggestive of spinal cord compression, which is an oncological emergency. Immediate notification of the physician is required for emergency MRI and treatment with high-dose corticosteroids and possible surgical decompression or radiation. Delayed treatment can result in permanent paralysis."
      },
      {
        question: "A patient asks the practical nurse whether a PSA level of 5.2 ng/mL means he has prostate cancer. What is the most accurate response?",
        options: [
          "Yes, any PSA above 4.0 ng/mL confirms prostate cancer and requires immediate treatment",
          "No, PSA levels are always normal up to 10.0 ng/mL in men over 65",
          "An elevated PSA can be caused by several conditions including BPH and infection, and further evaluation is needed to determine the cause",
          "The PSA test is unreliable and should not be used for screening purposes"
        ],
        correct: 2,
        rationale: "PSA is organ-specific but not cancer-specific. Elevated PSA can result from benign prostatic hyperplasia, prostatitis, urinary tract infection, recent ejaculation, or prostate cancer. A PSA of 5.2 ng/mL warrants further evaluation (repeat PSA, DRE, possible biopsy) but does not confirm cancer. Shared decision-making between the patient and provider about next steps is recommended."
      }
    ]
  },

  "pseudohypoparathyroidism-rpn": {
    title: "Pseudohypoparathyroidism for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Pseudohypoparathyroidism and PTH Resistance",
      content: "Pseudohypoparathyroidism (PHP) is a rare group of heterogeneous endocrine disorders characterized by end-organ resistance to parathyroid hormone (PTH) rather than a deficiency of PTH itself. Unlike true hypoparathyroidism where the parathyroid glands produce insufficient PTH, patients with pseudohypoparathyroidism produce adequate or even elevated levels of PTH, but their target tissues (primarily the kidneys and bone) fail to respond appropriately to the hormone. The underlying mechanism involves defective G-protein-coupled signal transduction. Normally, PTH binds to PTH receptors on renal tubular cells and osteoblasts, activating a stimulatory G-protein alpha subunit (Gs-alpha, encoded by the GNAS gene on chromosome 20q13.3). This Gs-alpha protein activates adenylyl cyclase, which converts adenosine triphosphate (ATP) to cyclic adenosine monophosphate (cAMP), the intracellular second messenger that mediates the biological effects of PTH. In pseudohypoparathyroidism type Ia (PHP-Ia), the most common form, there is a heterozygous inactivating mutation of the GNAS gene resulting in approximately 50% reduction in Gs-alpha protein activity. Because Gs-alpha is a ubiquitous signaling protein used by multiple hormones (including TSH, gonadotropins, and growth hormone-releasing hormone), patients with PHP-Ia often develop resistance to multiple hormones, not just PTH. The hallmark biochemical findings are hypocalcemia and hyperphosphatemia (identical to hypoparathyroidism) but with ELEVATED serum PTH levels (distinguishing PHP from hypoparathyroidism, where PTH is low). The kidneys fail to respond to PTH stimulation, resulting in decreased reabsorption of calcium, decreased excretion of phosphate, and impaired conversion of 25-hydroxyvitamin D to its active form (1,25-dihydroxyvitamin D/calcitriol), which further reduces intestinal calcium absorption. The characteristic phenotype associated with PHP-Ia is called Albright hereditary osteodystrophy (AHO), described by Fuller Albright in 1942. AHO features include short stature, round facies, obesity, brachydactyly (shortened fingers and toes, especially the fourth and fifth metacarpals/metatarsals), subcutaneous calcifications (ectopic ossification), and variable cognitive impairment. The shortened fourth metacarpal is a classic physical finding: when the patient makes a fist, the fourth knuckle appears dimpled or absent rather than raised. Pseudopseudohypoparathyroidism (PPHP) is a related condition where patients have the AHO phenotype but normal calcium, phosphate, and PTH levels (no hormone resistance). The clinical presentation of hypocalcemia in PHP includes neuromuscular irritability (muscle cramps, tetany, Chvostek sign, Trousseau sign), perioral and digital paresthesias, seizures, prolonged QT interval on ECG, and in chronic cases, cataracts, dental enamel hypoplasia, and basal ganglia calcifications. The practical nurse must monitor calcium levels closely, recognize signs of hypocalcemia, administer calcium and vitamin D supplements as prescribed, and report any signs of tetany, seizures, or cardiac rhythm changes immediately."
    },
    riskFactors: [
      "Genetic inheritance: PHP-Ia follows autosomal dominant pattern with parent-of-origin imprinting (maternal inheritance causes full PHP; paternal inheritance causes PPHP)",
      "Female sex (PHP-Ia is approximately twice as common in females due to preferential maternal expression of the GNAS gene in certain tissues)",
      "Family history of Albright hereditary osteodystrophy or pseudohypoparathyroidism in maternal relatives",
      "Associated endocrine resistance: patients with PHP-Ia have increased risk of hypothyroidism (TSH resistance), hypogonadism, and growth hormone deficiency",
      "Obesity and metabolic syndrome: AHO-associated obesity begins in early childhood and is often treatment-resistant",
      "Chronic hypocalcemia without treatment: increases risk of seizures, cardiac arrhythmias, cataracts, and basal ganglia calcification",
      "Vitamin D deficiency: exacerbates hypocalcemia in PHP patients because impaired 1-alpha-hydroxylation reduces active vitamin D formation"
    ],
    diagnostics: [
      "Serum calcium (total and ionized): characteristically LOW; total calcium below 8.5 mg/dL or ionized calcium below 4.5 mg/dL; always correct total calcium for albumin (corrected Ca = measured Ca + 0.8 x (4.0 - albumin))",
      "Serum phosphate: characteristically HIGH (hyperphosphatemia above 4.5 mg/dL); elevated because PTH-mediated phosphate excretion by the kidneys is impaired",
      "Intact PTH level: ELEVATED (typically 2-10 times the upper limit of normal); this is the key distinguishing feature from hypoparathyroidism where PTH is low",
      "25-hydroxyvitamin D and 1,25-dihydroxyvitamin D levels: 25-OH vitamin D may be normal; 1,25-dihydroxy vitamin D is often low because PTH-stimulated renal 1-alpha-hydroxylation is impaired",
      "Ellsworth-Howard test (PTH infusion test): exogenous PTH administered IV; in PHP, urinary cAMP and phosphate excretion do NOT increase appropriately (blunted response); historically diagnostic but now less commonly performed",
      "Hand X-rays: shortened fourth and fifth metacarpals (brachydactyly) visible on AP films; the metacarpal sign (Archibald sign) is positive when a line drawn tangent to the heads of the fourth and fifth metacarpals passes through the head of the third metacarpal",
      "ECG: prolonged QT interval from hypocalcemia; monitor for cardiac arrhythmias including torsades de pointes"
    ],
    management: [
      "Oral calcium supplementation: calcium carbonate (most common, requires acidic stomach for absorption -- take with meals) or calcium citrate (can be taken without food, better for patients on PPIs or with achlorhydria); goal is to maintain serum calcium in the low-normal range (8.0-8.5 mg/dL)",
      "Active vitamin D therapy: calcitriol (1,25-dihydroxyvitamin D) is the preferred form because the kidneys cannot convert 25-OH vitamin D to its active form in PHP; calcitriol bypasses the renal hydroxylation step",
      "Monitor serum calcium, phosphate, and creatinine regularly: initially every 1-2 weeks during dose adjustment, then every 3-6 months once stable; avoid hypercalcemia from overtreatment (risk of nephrocalcinosis)",
      "Monitor 24-hour urine calcium: keep below 300 mg/24 hours to prevent kidney stone formation and nephrocalcinosis from calcium supplementation",
      "Manage associated endocrine disorders: levothyroxine for TSH-resistant hypothyroidism, growth hormone therapy if GH deficiency documented, sex hormone replacement for hypogonadism",
      "Low-phosphate diet: limit dairy products, processed foods, cola beverages, and organ meats to help control hyperphosphatemia; phosphate binders may be needed if dietary restriction is insufficient",
      "Genetic counseling: discuss autosomal dominant inheritance pattern with parent-of-origin imprinting; maternal transmission produces PHP-Ia, paternal transmission produces PPHP"
    ],
    nursingActions: [
      "Monitor for signs of hypocalcemia: perioral numbness and tingling, fingertip paresthesias, muscle cramps, Chvostek sign (facial twitching when tapping facial nerve), Trousseau sign (carpopedal spasm with blood pressure cuff inflation), seizures",
      "Check Chvostek sign by tapping the facial nerve anterior to the ear; a positive response is ipsilateral twitching of the upper lip, nose, or facial muscles -- indicates neuromuscular irritability from hypocalcemia",
      "Check Trousseau sign by inflating a blood pressure cuff above systolic pressure for 3 minutes; a positive response is carpopedal spasm (hand cramping with thumb adduction and finger flexion) -- more specific for hypocalcemia than Chvostek sign",
      "Administer IV calcium gluconate 10% slowly (over 10-20 minutes) for severe symptomatic hypocalcemia or seizures; use cardiac monitoring during IV calcium infusion; never give IV calcium push (risk of cardiac arrest)",
      "Monitor ECG for QT prolongation: hypocalcemia prolongs the QT interval, increasing the risk of ventricular arrhythmias including torsades de pointes; report QTc greater than 500 msec",
      "Educate patient and family about lifelong calcium and vitamin D supplementation: explain that PHP requires ongoing treatment, importance of medication adherence, and signs of both hypocalcemia and hypercalcemia (overcorrection)",
      "Assess for shortened fourth metacarpal: have patient make a fist and observe knuckle height; dimpled or absent fourth knuckle is characteristic of Albright hereditary osteodystrophy"
    ],
    assessmentFindings: [
      "Hypocalcemia symptoms: perioral and digital paresthesias (tingling around mouth, fingers, toes), muscle cramps, carpopedal spasm, hyperactive deep tendon reflexes",
      "Positive Chvostek sign: ipsilateral facial twitching when the facial nerve is tapped anterior to the ear (present in up to 10% of normocalcemic individuals, so not fully specific)",
      "Positive Trousseau sign: carpopedal spasm (hand cramping with flexion of the wrist and metacarpophalangeal joints) after 3 minutes of blood pressure cuff inflation above systolic pressure",
      "Albright hereditary osteodystrophy features: short stature, round facies, obesity, brachydactyly (shortened fourth and fifth digits), subcutaneous calcifications (hard, painless nodules under the skin)",
      "Shortened fourth metacarpal (Archibald sign): when making a fist, the fourth knuckle is dimpled or flush rather than prominent; may also affect the fifth metacarpal",
      "Seizures: may be the presenting feature of PHP, especially in children; generalized tonic-clonic seizures from severe hypocalcemia",
      "Dental abnormalities: enamel hypoplasia, delayed tooth eruption, blunted tooth roots visible on dental X-rays; occurs due to chronic hypocalcemia during tooth development"
    ],
    signs: {
      left: [
        "Mild perioral tingling or fingertip numbness",
        "Occasional muscle cramps (legs, feet)",
        "Mildly shortened fourth finger noted on exam",
        "Mild fatigue or lethargy",
        "Low-normal serum calcium levels (8.0-8.5 mg/dL) on treatment",
        "Dry skin and brittle nails from chronic hypocalcemia"
      ],
      right: [
        "Tetany (sustained involuntary muscle contraction with carpopedal spasm)",
        "Generalized tonic-clonic seizure from severe hypocalcemia",
        "Laryngospasm (stridor, respiratory distress from laryngeal muscle spasm)",
        "QT prolongation with ventricular arrhythmia on cardiac monitor",
        "Serum calcium below 7.0 mg/dL (severe, life-threatening hypocalcemia)",
        "Altered level of consciousness or new-onset confusion"
      ]
    },
    medications: [
      {
        name: "Calcium Carbonate (Os-Cal/Tums/Caltrate)",
        type: "Oral calcium supplement",
        action: "Provides eleite calcium (40% elemental calcium by weight -- the highest percentage of any oral calcium salt) for replacement in hypocalcemic states. Calcium is absorbed primarily in the duodenum and proximal jejunum via active transport (vitamin D-dependent) and passive paracellular diffusion. Restores serum calcium toward normal range to prevent neuromuscular irritability, cardiac conduction abnormalities, and seizures.",
        sideEffects: "Constipation (most common), bloating, gas, hypercalcemia with overtreatment (nausea, polyuria, confusion), kidney stones with excessive doses, milk-alkali syndrome (hypercalcemia, metabolic alkalosis, renal impairment) with very high doses",
        contra: "Hypercalcemia, severe renal impairment (risk of calcium accumulation), hypercalciuria, calcium-containing kidney stones, concurrent digoxin therapy requires caution (hypercalcemia potentiates digoxin toxicity)",
        pearl: "Take with meals because calcium carbonate requires gastric acid for dissolution and absorption; maximum single dose absorption is approximately 500-600 mg elemental calcium -- divide total daily dose into 2-3 doses; avoid concurrent iron or levothyroxine administration (calcium impairs their absorption -- separate by at least 2-4 hours)"
      },
      {
        name: "Calcitriol (Rocaltrol)",
        type: "Active vitamin D3 analog (1,25-dihydroxyvitamin D)",
        action: "The most biologically active form of vitamin D. Binds to vitamin D receptors (VDR) in the intestinal epithelium to increase calcium and phosphate absorption, in the kidneys to increase calcium reabsorption, and in bone to mobilize calcium stores. Calcitriol bypasses the impaired renal 1-alpha-hydroxylation step that is defective in pseudohypoparathyroidism, making it the preferred vitamin D preparation for this condition.",
        sideEffects: "Hypercalcemia (most serious -- presents as nausea, vomiting, polyuria, polydipsia, constipation, confusion), hypercalciuria, hyperphosphatemia, nephrocalcinosis and kidney stones with chronic overtreatment, weakness",
        contra: "Hypercalcemia, vitamin D toxicity, hyperphosphatemia (correct phosphate levels before or concurrent with calcitriol therapy to avoid metastatic calcification)",
        pearl: "Typical starting dose is 0.25-0.5 mcg twice daily; has rapid onset of action (1-2 days) and short half-life (5-8 hours), which makes it safer to manage than ergocalciferol or cholecalciferol (which have weeks-long half-lives); monitor serum calcium weekly during dose adjustments and 24-hour urine calcium to prevent nephrocalcinosis"
      },
      {
        name: "Magnesium Oxide (Mag-Ox)",
        type: "Mineral supplement / electrolyte replacement",
        action: "Provides supplemental magnesium to correct hypomagnesemia, which frequently coexists with hypocalcemia. Magnesium is required for PTH secretion from the parathyroid glands and for PTH action at target tissues. Hypomagnesemia causes functional hypoparathyroidism and also creates PTH resistance at the receptor level, making hypocalcemia refractory to calcium and vitamin D therapy until magnesium is corrected.",
        sideEffects: "Diarrhea (magnesium salts have osmotic laxative effect), abdominal cramping, nausea, hypermagnesemia with renal impairment (muscle weakness, hypotension, respiratory depression, cardiac arrest)",
        contra: "Severe renal impairment (GFR below 30 mL/min -- impaired magnesium excretion leading to accumulation); myasthenia gravis (magnesium can worsen neuromuscular weakness); heart block",
        pearl: "Correct hypomagnesemia BEFORE treating hypocalcemia -- hypocalcemia will be refractory to calcium supplementation if magnesium is low; normal serum magnesium is 1.5-2.5 mg/dL; take magnesium supplements separately from calcium (they compete for absorption); magnesium oxide contains more elemental magnesium per tablet than other forms but has lower bioavailability"
      }
    ],
    pearls: [
      "The KEY distinguishing feature of pseudohypoparathyroidism from true hypoparathyroidism: both present with hypocalcemia and hyperphosphatemia, but PHP has HIGH PTH levels while hypoparathyroidism has LOW PTH levels",
      "Albright hereditary osteodystrophy mnemonic (SHORBEC): Short stature, Hypothyroidism (TSH resistance), Obesity, Round facies, Brachydactyly, Ectopic calcifications, Cognitive impairment",
      "The shortened fourth metacarpal is tested by asking the patient to make a fist -- if the fourth knuckle is dimpled or absent rather than raised, this is the Archibald sign, pathognomonic for AHO",
      "Trousseau sign is MORE SPECIFIC for hypocalcemia than Chvostek sign -- Chvostek sign can be positive in up to 10% of people with normal calcium levels",
      "IV calcium gluconate is preferred over IV calcium chloride for peripheral IV administration because calcium chloride causes severe tissue necrosis if it extravasates; calcium chloride is reserved for central line administration",
      "Correct hypomagnesemia FIRST before treating hypocalcemia -- if magnesium is low, PTH cannot be secreted properly and calcium therapy will be ineffective until magnesium is replaced",
      "Calcitriol is the preferred vitamin D preparation in PHP because the kidneys cannot perform the 1-alpha-hydroxylation step needed to convert 25-hydroxyvitamin D to its active form -- calcitriol is already in the active form and bypasses this defect"
    ],
    quiz: [
      {
        question: "A practical nurse is reviewing laboratory results for a patient with pseudohypoparathyroidism. Which combination of findings is expected in this condition?",
        options: [
          "Low calcium, low phosphate, low PTH",
          "Low calcium, high phosphate, high PTH",
          "High calcium, low phosphate, high PTH",
          "Normal calcium, normal phosphate, high PTH"
        ],
        correct: 1,
        rationale: "Pseudohypoparathyroidism is characterized by end-organ resistance to PTH. The kidneys fail to respond to PTH, resulting in decreased calcium reabsorption (hypocalcemia) and decreased phosphate excretion (hyperphosphatemia). The parathyroid glands respond to low calcium by producing MORE PTH (elevated PTH), but the target organs remain unresponsive. This triad of low calcium, high phosphate, and high PTH distinguishes PHP from true hypoparathyroidism (where PTH would be low)."
      },
      {
        question: "A patient with pseudohypoparathyroidism reports perioral tingling and finger numbness. The practical nurse inflates a blood pressure cuff above systolic pressure for 3 minutes and observes hand cramping. This finding is documented as which sign?",
        options: [
          "Chvostek sign",
          "Trousseau sign",
          "Homans sign",
          "Brudzinski sign"
        ],
        correct: 1,
        rationale: "Trousseau sign is elicited by inflating a blood pressure cuff above systolic pressure for 3 minutes. A positive response is carpopedal spasm (hand cramping with flexion of the wrist and metacarpophalangeal joints, thumb adduction), indicating neuromuscular irritability from hypocalcemia. Trousseau sign is more specific for hypocalcemia than Chvostek sign. Chvostek sign involves tapping the facial nerve, not cuff inflation."
      },
      {
        question: "A patient with pseudohypoparathyroidism has a serum magnesium level of 1.1 mg/dL. Despite receiving oral calcium and calcitriol, the serum calcium remains critically low at 6.8 mg/dL. What should the practical nurse recognize as the likely reason for treatment failure?",
        options: [
          "The calcium dose is too low and needs to be doubled",
          "The calcitriol has expired and is no longer effective",
          "Hypomagnesemia must be corrected before hypocalcemia will respond to treatment",
          "The patient has developed resistance to calcitriol"
        ],
        correct: 2,
        rationale: "Hypomagnesemia (normal 1.5-2.5 mg/dL) impairs PTH secretion and causes PTH resistance at the receptor level, making hypocalcemia refractory to calcium and vitamin D supplementation. Magnesium must be corrected FIRST before calcium therapy can be effective. A serum magnesium of 1.1 mg/dL is significantly low and requires magnesium replacement as the priority intervention."
      }
    ]
  },

  "public-health-concepts-rpn": {
    title: "Public Health Concepts for Practical Nurses",
    cellular: {
      title: "Foundations of Public Health and Population Health Assessment",
      content: "Public health is the science and practice of protecting and improving the health of populations through organized community efforts, education, policy development, and research. Unlike clinical medicine, which focuses on individual patient care, public health takes a population-based approach to prevent disease, promote health, and prolong life among entire communities. The epidemiological triad is the foundational model for understanding infectious disease transmission and consists of three interconnected components: the agent (the causative factor, such as a bacterium, virus, chemical, or physical force), the host (the human or animal that harbors the agent, with susceptibility influenced by age, genetics, immunity, nutritional status, and behavior), and the environment (external factors that affect the agent and host interaction, including physical environment, biological environment, and socioeconomic conditions). Disease occurs when these three elements interact in a way that allows the agent to reach a susceptible host through an appropriate mode of transmission. The chain of infection model expands on this concept with six links: infectious agent, reservoir, portal of exit, mode of transmission, portal of entry, and susceptible host. Breaking any single link in the chain prevents disease transmission. Levels of prevention form a three-tiered framework for public health interventions. Primary prevention aims to prevent disease BEFORE it occurs through health promotion and specific protection (vaccinations, health education, seatbelt laws, water fluoridation, smoking cessation programs). Secondary prevention focuses on early detection and prompt treatment of disease to reduce severity and prevent complications (screening programs such as mammography, Pap smears, blood pressure screening, tuberculin skin testing, newborn metabolic screening). Tertiary prevention aims to reduce disability, prevent complications, and restore maximum function in patients with established disease (cardiac rehabilitation after myocardial infarction, diabetic foot care programs, stroke rehabilitation, chronic disease management programs). Social determinants of health (SDOH) are the conditions in which people are born, grow, work, live, and age that shape health outcomes. The World Health Organization identifies five key domains: economic stability (income, employment, food security), education access and quality, healthcare access and quality, neighborhood and built environment (housing, transportation, safety), and social and community context (social support, discrimination, civic participation). Research consistently demonstrates that social determinants account for 30-55% of health outcomes, far exceeding the contribution of clinical care (estimated at 10-20%). Health disparities are measurable differences in health outcomes between population groups, often driven by inequitable distribution of social determinants. The practical nurse contributes to public health through health education, vaccination administration, communicable disease reporting, community health assessment participation, and advocacy for vulnerable populations."
    },
    riskFactors: [
      "Low socioeconomic status (poverty is the single strongest predictor of poor health outcomes across all populations and disease categories)",
      "Lack of health insurance or underinsurance (delays in seeking care, reduced access to preventive services, poor chronic disease management)",
      "Low health literacy (difficulty understanding health information, medication instructions, and navigating the healthcare system; affects approximately 36% of adults)",
      "Geographic isolation (rural communities face provider shortages, limited specialty care, increased emergency transport times, and fewer public health resources)",
      "Food insecurity (inadequate access to nutritious food leads to diet-related chronic diseases: obesity, diabetes, cardiovascular disease, and malnutrition)",
      "Exposure to environmental hazards (air pollution, lead paint, contaminated water, industrial chemicals; disproportionately affects low-income communities and communities of color)",
      "Systemic discrimination and racism (creates barriers to healthcare access, education, employment, and housing; contributes to chronic stress and allostatic load)"
    ],
    diagnostics: [
      "Community health needs assessment (CHNA): systematic process of identifying health priorities in a defined population using quantitative data (vital statistics, disease registries, census data) and qualitative data (community surveys, focus groups, key informant interviews)",
      "Epidemiological surveillance: ongoing systematic collection, analysis, and interpretation of health data for planning, implementation, and evaluation of public health practice; includes passive surveillance (routine reporting) and active surveillance (targeted case finding)",
      "Vital statistics analysis: birth rates, death rates, infant mortality rates, maternal mortality rates, life expectancy, and cause-specific mortality rates; used to identify health trends and disparities within and between populations",
      "Disease incidence and prevalence: incidence measures NEW cases of disease in a defined time period (attack rate); prevalence measures ALL existing cases at a point in time (point prevalence) or over a period (period prevalence); both are essential for resource planning",
      "Notifiable disease reporting: legally mandated reporting of specific communicable diseases to local and national public health authorities; examples include tuberculosis, measles, hepatitis, HIV/AIDS, foodborne outbreaks, and sexually transmitted infections",
      "Health impact assessment (HIA): evaluates potential health effects of proposed policies, projects, or programs on a population; considers both positive and negative impacts on health equity"
    ],
    management: [
      "Implement primary prevention programs: vaccination campaigns (childhood immunizations, influenza, COVID-19), health education workshops (nutrition, physical activity, substance abuse prevention), safety legislation enforcement",
      "Conduct secondary prevention screening: blood pressure screening events, blood glucose screening for diabetes risk, vision and hearing screening in schools, developmental screening in pediatric populations",
      "Coordinate tertiary prevention services: chronic disease self-management programs, rehabilitation referrals, support group facilitation, case management for complex patients",
      "Apply the social-ecological model: address health behaviors at multiple levels -- individual (knowledge, attitudes, skills), interpersonal (family, peers, social networks), organizational (schools, workplaces, healthcare settings), community (social norms, local policies), and societal (national policies, cultural values)",
      "Promote health equity: identify and address disparities in health outcomes; advocate for policies that improve access to care, education, employment, and safe housing for underserved populations",
      "Emergency preparedness and response: participate in disaster planning, mass casualty triage (START triage), pandemic response protocols, evacuation procedures, and community emergency communication plans",
      "Develop and implement health promotion plans: set measurable objectives (SMART goals), identify evidence-based interventions, allocate resources, implement programs, and evaluate outcomes using validated metrics"
    ],
    nursingActions: [
      "Administer immunizations per recommended schedules: follow CDC/NACI immunization schedules for children and adults; document vaccine lot numbers, administration sites, and patient responses; report adverse events through VAERS/CAEFISS",
      "Participate in communicable disease investigation: assist with contact tracing, specimen collection, patient education on isolation precautions, and post-exposure prophylaxis administration as directed",
      "Report notifiable diseases to public health authorities: follow provincial/state and federal mandatory reporting requirements; document case details including demographics, symptoms, laboratory confirmation, and exposure history",
      "Conduct health education sessions: teach disease prevention strategies appropriate to the target population's literacy level, language, and cultural context; use teach-back method to verify understanding",
      "Perform community health assessments: collect data through windshield surveys (systematic observation of community characteristics from a vehicle), community mapping, and population surveys; identify community strengths and health needs",
      "Advocate for vulnerable populations: identify social determinants affecting patients' health; connect patients with community resources (food banks, housing assistance, transportation services, mental health services); document social needs screening results",
      "Document surveillance data accurately: complete required public health forms, contribute to disease registries, and report trends and unusual disease patterns to the supervising nurse and public health unit"
    ],
    assessmentFindings: [
      "Community-level health indicators: elevated infant mortality rate, increased rates of vaccine-preventable diseases, high prevalence of chronic disease, increased emergency department utilization for primary care conditions",
      "Social determinant screening findings: food insecurity (positive screen on Hunger Vital Sign), housing instability, transportation barriers, social isolation, intimate partner violence, financial stress affecting medication adherence",
      "Outbreak indicators: unusual clustering of similar illness cases in time and place, disease incidence exceeding expected baseline rates, identification of a common exposure source (foodborne, waterborne, airborne)",
      "Health literacy assessment: difficulty reading medication labels or appointment slips, inability to identify medications by name or purpose, poor adherence to treatment plans despite expressed desire to comply",
      "Environmental health hazards: lead paint exposure in older housing, unsafe drinking water sources, air quality concerns near industrial facilities, food desert conditions in the community",
      "Immunization gap identification: missed vaccines on record review, expired titers, populations with below-threshold vaccination rates risking loss of herd immunity (typically below 85-95% coverage depending on the pathogen)",
      "Health disparity indicators: significant differences in morbidity, mortality, or access to care between population subgroups defined by race, ethnicity, income, geographic location, or disability status"
    ],
    signs: {
      left: [
        "Community vaccination rates above 90% for routine childhood immunizations",
        "Functional community health centers with adequate provider-to-population ratios",
        "Active health education programs in schools and workplaces",
        "Accessible clean water, food sources, and safe housing",
        "Established emergency preparedness plans with regular drills",
        "Community health indicators trending toward national benchmarks"
      ],
      right: [
        "Disease outbreak exceeding expected incidence (epidemic threshold crossed)",
        "Infant mortality rate significantly above national average",
        "Community vaccination rate below herd immunity threshold (risk of outbreak)",
        "Cluster of unexplained illness cases requiring immediate investigation",
        "Environmental contamination event (chemical spill, water contamination, radiation exposure)",
        "Mass casualty incident requiring activation of emergency response protocols"
      ]
    },
    medications: [
      {
        name: "Surveillance Report (Assessment Tool)",
        type: "Epidemiological monitoring instrument",
        action: "Provides systematic framework for collecting, analyzing, and disseminating health data about disease occurrence, health behaviors, and health outcomes in defined populations. Enables identification of trends, outbreaks, and health disparities. Includes standardized case definitions, data collection forms, and reporting timelines established by public health authorities.",
        sideEffects: "Time-intensive data collection process, potential for underreporting (not all cases seek medical care), reporting delays, privacy concerns with identifiable health data, varying case definitions between jurisdictions",
        contra: "Not applicable as a clinical intervention; however, surveillance systems require compliance with privacy legislation (PIPEDA in Canada, HIPAA in the United States) to protect individual health information",
        pearl: "Surveillance is the backbone of public health practice -- without accurate and timely data, outbreaks cannot be detected, interventions cannot be targeted, and program effectiveness cannot be evaluated; practical nurses contribute by reporting notifiable diseases promptly and accurately"
      },
      {
        name: "Community Needs Assessment (Assessment Tool)",
        type: "Population health assessment instrument",
        action: "Systematically identifies health priorities, community assets, and resource gaps within a defined population or geographic area. Combines quantitative data (vital statistics, hospital discharge data, census demographics) with qualitative data (community surveys, focus groups, key informant interviews) to create a comprehensive picture of community health status and needs.",
        sideEffects: "Resource-intensive process (time, personnel, funding), potential for bias in data collection or interpretation, community assessment fatigue (over-surveyed populations), findings may reflect point-in-time conditions that change",
        contra: "Assessment without subsequent action can erode community trust; results must be shared with the community and used to inform programmatic decisions and resource allocation",
        pearl: "A windshield survey is a practical nurse-accessible assessment technique: systematically observe and document community characteristics (housing conditions, availability of grocery stores vs. fast food, public transportation, parks and recreation, safety concerns, healthcare facilities) while driving through the community"
      },
      {
        name: "Health Promotion Plan (Assessment Tool)",
        type: "Population health intervention framework",
        action: "Provides a structured approach to designing, implementing, and evaluating health promotion programs using the PRECEDE-PROCEED model or similar evidence-based frameworks. Identifies predisposing factors (knowledge, attitudes, beliefs), enabling factors (resources, skills, accessibility), and reinforcing factors (social support, feedback, incentives) that influence health behaviors in a target population.",
        sideEffects: "Program implementation challenges (funding limitations, staffing constraints, community engagement barriers), difficulty measuring long-term outcomes, cultural adaptation needs, sustainability concerns after initial funding ends",
        contra: "One-size-fits-all approaches are ineffective; health promotion plans must be culturally appropriate, linguistically accessible, and tailored to the specific needs, values, and resources of the target community",
        pearl: "Use SMART objectives for health promotion planning: Specific (what, who, where), Measurable (how much, how many), Achievable (realistic given resources), Relevant (aligned with community priorities), Time-bound (target date for achievement); evaluate both process outcomes (program reach, participation) and health outcomes (behavior change, disease reduction)"
      }
    ],
    pearls: [
      "The epidemiological triad (Agent-Host-Environment) is the foundational model for understanding disease causation -- modifying any component can prevent disease; for example, vaccination alters host susceptibility, sanitation modifies the environment, and antibiotics target the agent",
      "Levels of prevention: Primary = PREVENT disease (vaccines, seatbelts, health education), Secondary = DETECT disease early (screening programs, Pap smears, mammograms), Tertiary = MANAGE established disease and prevent complications (cardiac rehab, diabetic foot care)",
      "Social determinants of health account for 30-55% of health outcomes -- clinical care accounts for only 10-20%; addressing poverty, education, housing, and food security often has greater population health impact than individual clinical interventions",
      "Herd immunity thresholds vary by pathogen: measles requires approximately 95% population immunity, pertussis approximately 92-94%, polio approximately 80-86%, influenza approximately 75-80%; when vaccination rates drop below these thresholds, outbreaks become possible",
      "The chain of infection has six links: Agent, Reservoir, Portal of Exit, Mode of Transmission, Portal of Entry, Susceptible Host -- breaking ANY single link prevents disease transmission; hand hygiene is the single most effective intervention",
      "Incidence measures NEW cases (how fast disease is spreading), while prevalence measures ALL existing cases (total disease burden in the population); a disease with high incidence but short duration may have low prevalence, and vice versa",
      "Health literacy affects approximately 36% of adults -- always use plain language, visual aids, and the teach-back method when providing health education; ask patients to explain in their own words what they understood rather than asking if they understand"
    ],
    quiz: [
      {
        question: "A practical nurse is participating in a community health fair and provides blood pressure screening to attendees who have not been diagnosed with hypertension. This activity represents which level of prevention?",
        options: [
          "Primary prevention",
          "Secondary prevention",
          "Tertiary prevention",
          "Quaternary prevention"
        ],
        correct: 1,
        rationale: "Secondary prevention focuses on early detection and prompt treatment of disease before symptoms develop or worsen. Blood pressure screening in undiagnosed individuals is a classic example of secondary prevention because it aims to identify hypertension early so treatment can begin before complications (stroke, heart attack, kidney disease) develop. Primary prevention would be health education about dietary sodium reduction to prevent hypertension from developing."
      },
      {
        question: "A practical nurse is teaching a community group about disease transmission. Using the epidemiological triad, which intervention modifies the HOST component to prevent influenza?",
        options: [
          "Proper hand hygiene and surface disinfection",
          "Quarantine of infected individuals",
          "Annual influenza vaccination",
          "Improving ventilation in public buildings"
        ],
        correct: 2,
        rationale: "The epidemiological triad consists of Agent, Host, and Environment. Annual influenza vaccination modifies the HOST by boosting immune defense against the influenza virus, making the host less susceptible. Hand hygiene and surface disinfection target the agent and mode of transmission. Quarantine removes the reservoir. Improving ventilation modifies the environment."
      },
      {
        question: "During a community assessment, a practical nurse identifies that a neighborhood has no grocery stores but has multiple fast food restaurants, and residents rely on convenience stores for food purchases. Which social determinant of health does this finding primarily represent?",
        options: [
          "Education access and quality",
          "Healthcare access and quality",
          "Neighborhood and built environment",
          "Social and community context"
        ],
        correct: 2,
        rationale: "This scenario describes a food desert, which is a component of the Neighborhood and Built Environment domain of social determinants of health. The built environment includes access to nutritious food sources, safe housing, transportation, and walkability. Food deserts are associated with higher rates of obesity, diabetes, and cardiovascular disease because residents rely on calorie-dense, nutrient-poor food from fast food restaurants and convenience stores."
      }
    ]
  },

  "pulse-oximetry-rpn": {
    title: "Pulse Oximetry and SpO2 Monitoring for Practical Nurses",
    cellular: {
      title: "Physiology of Oxygen Transport and Pulse Oximetry Measurement",
      content: "Pulse oximetry is a noninvasive method of continuously monitoring the oxygen saturation of arterial hemoglobin (SpO2). Understanding its principles requires knowledge of oxygen transport physiology. Oxygen enters the lungs during inspiration and crosses the alveolar-capillary membrane (which is only 0.5 micrometers thick) by simple diffusion, moving from an area of higher partial pressure in the alveolus (PAO2 approximately 100 mmHg) to lower partial pressure in the pulmonary capillary blood (PvO2 approximately 40 mmHg). Once in the blood, oxygen is transported in two forms: approximately 98.5% bound to hemoglobin molecules within red blood cells (each hemoglobin molecule can carry up to four oxygen molecules), and approximately 1.5% dissolved in plasma (measured as PaO2 on arterial blood gas). Hemoglobin (Hb) is a quaternary protein consisting of four polypeptide chains (two alpha and two beta in normal adult hemoglobin HbA), each containing a heme group with a central iron atom (Fe2+) that reversibly binds one molecule of oxygen. Oxyhemoglobin (HbO2) is hemoglobin bound to oxygen, which appears bright red. Deoxyhemoglobin (Hb) is hemoglobin without oxygen, which appears dark blue-red and accounts for the bluish discoloration seen in cyanosis. The oxygen-hemoglobin dissociation curve describes the relationship between PaO2 and hemoglobin oxygen saturation (SaO2). This curve is S-shaped (sigmoidal), which has critical clinical significance: at the upper plateau (PaO2 60-100 mmHg), large changes in PaO2 produce only small changes in saturation (SpO2 remains 90-100%). However, at the steep portion of the curve (PaO2 below 60 mmHg), even small decreases in PaO2 cause rapid desaturation. This is why SpO2 of 90% (corresponding to PaO2 of approximately 60 mmHg) is considered the critical threshold -- below this point, oxygen saturation drops precipitously. Pulse oximeters work by spectrophotometry: the device emits two wavelengths of light through a pulsatile vascular bed (typically the fingertip). Red light (660 nm wavelength) is absorbed more by deoxyhemoglobin, while infrared light (940 nm wavelength) is absorbed more by oxyhemoglobin. A photodetector on the opposite side of the probe measures the ratio of absorbed red to infrared light during the pulsatile (arterial) component of blood flow, and the microprocessor calculates SpO2 based on this ratio. Because the device relies on pulsatile arterial blood flow and light transmission, several factors can produce inaccurate readings. Nail polish (especially blue, green, and black) absorbs light at wavelengths similar to deoxyhemoglobin, falsely lowering SpO2 readings. Dark skin pigmentation can slightly decrease accuracy at lower saturation ranges. Cold extremities, peripheral vasoconstriction, and hypotension reduce pulsatile flow, producing weak or absent signals. Carbon monoxide poisoning is particularly dangerous because carboxyhemoglobin (COHb) absorbs light similarly to oxyhemoglobin, causing the pulse oximeter to display a falsely NORMAL SpO2 despite severe tissue hypoxia. The practical nurse must understand these limitations to interpret SpO2 readings accurately and recognize when clinical assessment contradicts the monitor reading."
    },
    riskFactors: [
      "Chronic obstructive pulmonary disease (chronic CO2 retention may blunt hypoxic drive; target SpO2 88-92% per physician order rather than standard 94-100%)",
      "Congestive heart failure (pulmonary edema impairs gas exchange across thickened alveolar-capillary membrane, causing hypoxemia)",
      "Pneumonia (alveolar consolidation with fluid and inflammatory exudate prevents oxygen diffusion, creating intrapulmonary shunt)",
      "Anemia (hemoglobin below 7 g/dL reduces oxygen-carrying capacity; SpO2 may read normally because available hemoglobin is fully saturated but total oxygen delivery is inadequate)",
      "Carbon monoxide exposure (CO binds hemoglobin with 200-250 times greater affinity than oxygen; displaces O2 from hemoglobin; pulse oximeter reads falsely normal)",
      "Peripheral vascular disease (impaired arterial circulation to extremities may produce unreliable distal probe readings)",
      "Hypothermia (causes peripheral vasoconstriction, shifting blood centrally and reducing pulsatile flow at fingertip probe sites)"
    ],
    diagnostics: [
      "Pulse oximetry (SpO2): continuous noninvasive monitoring; normal SpO2 94-100% on room air (88-92% target for COPD patients with chronic CO2 retention); correlates with PaO2 on the upper plateau of the oxygen-hemoglobin dissociation curve",
      "Arterial blood gas (ABG): definitive assessment of oxygenation (PaO2), ventilation (PaCO2), and acid-base status (pH, HCO3-); provides actual SaO2, which is more accurate than SpO2; necessary when pulse oximetry is unreliable",
      "Capnography (end-tidal CO2/EtCO2): noninvasive measurement of exhaled CO2; normal 35-45 mmHg; used to monitor ventilation adequacy, confirm endotracheal tube placement, and detect hypoventilation before SpO2 drops",
      "Chest X-ray: identifies pulmonary causes of hypoxemia including pneumonia, pneumothorax, pleural effusion, pulmonary edema, and atelectasis",
      "Complete blood count (CBC): hemoglobin and hematocrit levels determine oxygen-carrying capacity; anemia (Hb below 12 g/dL females, below 14 g/dL males) may explain tissue hypoxia despite normal SpO2",
      "Carboxyhemoglobin level (COHb): measured by co-oximetry on arterial blood gas; normal less than 3% in non-smokers, less than 10% in smokers; levels above 20% cause significant symptoms; pulse oximetry CANNOT detect CO poisoning"
    ],
    management: [
      "Apply supplemental oxygen as prescribed: nasal cannula (1-6 L/min, delivers 24-44% FiO2), simple face mask (5-10 L/min, delivers 40-60% FiO2), non-rebreather mask (10-15 L/min, delivers 60-95% FiO2 with reservoir bag inflated)",
      "Titrate oxygen to maintain prescribed SpO2 target: typically 94-100% for most patients; 88-92% for COPD patients with chronic CO2 retention (avoid suppressing hypoxic ventilatory drive)",
      "Reposition the patient: elevate head of bed to 30-45 degrees (semi-Fowler or high Fowler position) to maximize diaphragmatic excursion and lung expansion; turn immobile patients every 2 hours to prevent dependent atelectasis",
      "Encourage deep breathing and coughing exercises: 10 deep breaths every hour while awake; incentive spirometry 10 repetitions every 1-2 hours; sustained maximal inspiration (hold for 3-5 seconds at peak inhalation)",
      "Suction airway secretions as needed: assess for audible gurgling, visible secretions, or declining SpO2 that improves with repositioning; follow facility suctioning protocol (pre-oxygenate, limit suction pass to 10-15 seconds)",
      "Prepare for escalation if SpO2 does not improve with initial interventions: have bag-valve mask available, anticipate possible need for bilevel positive airway pressure (BiPAP) or intubation, notify rapid response team for SpO2 below 88% unresponsive to oxygen therapy",
      "Monitor continuously during high-risk activities: procedural sedation, post-anesthesia recovery, opioid administration, patient transport, and sleep (obstructive sleep apnea patients)"
    ],
    nursingActions: [
      "Select the appropriate probe site: fingertip (most common and most accurate in well-perfused patients), earlobe (alternative when fingers are unavailable or poorly perfused), forehead (reflectance probe, less affected by peripheral vasoconstriction), toe (alternative for infants)",
      "Ensure accurate probe placement: position sensor so that the light emitter and photodetector are directly opposite each other across the pulsatile vascular bed; avoid placing probe on same extremity as blood pressure cuff or arterial line",
      "Identify and correct factors causing inaccurate readings: remove nail polish or acrylic nails (or use earlobe/forehead probe), warm cold fingers, ensure adequate perfusion, stabilize probe to prevent motion artifact, check for ambient light interference",
      "Correlate SpO2 reading with clinical assessment: if SpO2 reads 95% but the patient is cyanotic, diaphoretic, and tachypneic, the clinical picture takes priority -- obtain an ABG for definitive assessment",
      "Monitor the plethysmographic waveform (pulse waveform on the monitor): a strong, regular waveform indicates reliable signal; a weak, irregular, or absent waveform suggests poor perfusion or probe malfunction and the SpO2 value is unreliable",
      "Document SpO2 readings with clinical context: record the oxygen delivery device, flow rate (L/min), patient position, activity level, and respiratory assessment findings at the time of reading",
      "Report SpO2 below 92% (or below prescribed target) promptly: assess the patient, apply or increase supplemental oxygen, reposition, encourage deep breathing, check probe placement, and notify the healthcare team if saturation does not improve"
    ],
    assessmentFindings: [
      "Normal SpO2 (94-100% on room air): indicates adequate hemoglobin oxygen saturation; does not guarantee adequate tissue oxygen delivery if hemoglobin is low (anemia) or cardiac output is reduced",
      "Mild hypoxemia (SpO2 90-93%): patient may be asymptomatic or have mild dyspnea; corresponds to PaO2 of approximately 60-75 mmHg; warrants intervention (supplemental oxygen, respiratory assessment, position change)",
      "Moderate hypoxemia (SpO2 85-89%): tachypnea, tachycardia, restlessness, accessory muscle use, nasal flaring; corresponds to the steep portion of the oxyhemoglobin dissociation curve where rapid deterioration can occur",
      "Severe hypoxemia (SpO2 below 85%): cyanosis (central cyanosis of lips and tongue is more reliable than peripheral), confusion, altered level of consciousness, bradycardia (late sign), cardiovascular collapse; this is a medical emergency",
      "Falsely normal SpO2 in carbon monoxide poisoning: patient presents with headache, nausea, cherry-red skin color, confusion, but pulse oximeter reads 96-100%; requires co-oximetry (ABG with COHb level) for accurate assessment",
      "Unreliable signal indicators: erratic SpO2 values (jumping between numbers), weak or absent plethysmographic waveform, low perfusion index, discrepancy between displayed heart rate and palpated pulse rate",
      "Respiratory distress signs: increased work of breathing (accessory muscle use, intercostal retractions, nasal flaring, tripod positioning), paradoxical abdominal breathing, inability to speak in full sentences, diaphoresis"
    ],
    signs: {
      left: [
        "SpO2 94-100% on room air with regular respiratory pattern",
        "Clear bilateral breath sounds on auscultation",
        "Respiratory rate 12-20 breaths per minute with normal depth",
        "Pink mucous membranes and warm extremities",
        "Patient able to speak in full sentences without dyspnea",
        "Strong pulse oximetry waveform with consistent readings"
      ],
      right: [
        "SpO2 below 88% despite supplemental oxygen (refractory hypoxemia)",
        "Central cyanosis (blue discoloration of lips, tongue, and oral mucosa)",
        "Respiratory rate below 8 or above 30 breaths per minute",
        "Altered level of consciousness with declining SpO2 (impending respiratory failure)",
        "Absence of breath sounds unilaterally (possible pneumothorax, massive pleural effusion, or mainstem bronchus obstruction)",
        "Agonal breathing or respiratory arrest requiring immediate bag-valve mask ventilation"
      ]
    },
    medications: [
      {
        name: "Oxygen via Nasal Cannula (Respiratory Equipment)",
        type: "Low-flow supplemental oxygen delivery device",
        action: "Delivers supplemental oxygen through two prongs inserted into the nares at flow rates of 1-6 L/min, providing an approximate FiO2 of 24-44%. Each liter per minute of flow increases FiO2 by approximately 4% above room air (21%). Mixes delivered oxygen with room air during each breath, making the actual FiO2 variable and dependent on the patient's respiratory rate, tidal volume, and breathing pattern.",
        sideEffects: "Nasal dryness and irritation (humidification recommended at flows above 4 L/min), epistaxis from mucosal drying, skin breakdown behind ears from tubing pressure, claustrophobia is rare with nasal cannula compared to masks",
        contra: "Not appropriate when high FiO2 concentration is needed (maximum approximately 44% at 6 L/min); ineffective in complete mouth breathers; nasal obstruction or recent nasal surgery may prevent proper placement",
        pearl: "Flow rates above 6 L/min do not significantly increase FiO2 but do increase nasal mucosal drying and discomfort; humidification (bubble humidifier) should be applied at flows of 4 L/min or greater; nasal cannula allows the patient to eat, drink, and speak normally, making it the preferred device for stable patients requiring low to moderate supplemental oxygen"
      },
      {
        name: "Non-Rebreather Mask (Respiratory Equipment)",
        type: "High-flow oxygen delivery device with reservoir",
        action: "Delivers high-concentration oxygen (60-95% FiO2) at flow rates of 10-15 L/min through a face mask connected to a reservoir bag. One-way valves on the exhalation ports prevent room air entrainment during inspiration, while the reservoir bag stores 100% oxygen between breaths. The patient inhales oxygen from the reservoir bag and exhales through the one-way valves. This design minimizes dilution with room air, providing near-100% oxygen at high flow rates.",
        sideEffects: "Claustrophobia and anxiety from face mask, skin pressure injury on nasal bridge and cheeks with prolonged use, aspiration risk if the patient vomits while wearing the mask, oxygen toxicity with prolonged use at high FiO2 (greater than 60% for more than 24-48 hours can cause absorption atelectasis and pulmonary oxygen toxicity)",
        contra: "Not appropriate for patients with chronic CO2 retention (COPD type II) as high FiO2 may suppress hypoxic ventilatory drive; must be removed for eating, drinking, and oral medication administration; requires adequate respiratory effort (not appropriate for apneic patients)",
        pearl: "The reservoir bag must remain at least two-thirds inflated during inspiration -- if the bag collapses completely, the flow rate is insufficient and must be increased; ensure a tight mask seal to prevent room air entrainment; this is the highest-concentration oxygen delivery device available without positive pressure ventilation; used for acute hypoxemia, trauma, carbon monoxide poisoning, and shock"
      },
      {
        name: "Bag-Valve Mask (BVM/Ambu Bag) (Respiratory Equipment)",
        type: "Manual positive-pressure ventilation device",
        action: "Provides manual positive-pressure ventilation by squeezing a self-inflating bag connected to a face mask, forcing oxygen-enriched air into the patient's lungs. When connected to an oxygen source at 15 L/min with a reservoir attached, delivers approximately 90-100% FiO2. Without supplemental oxygen, delivers approximately 21% FiO2 (room air). Used for patients who are not breathing adequately or who are in respiratory/cardiac arrest requiring assisted ventilation.",
        sideEffects: "Gastric distension from air insufflation into the stomach (can cause vomiting and aspiration), barotrauma from excessive ventilation pressures (pneumothorax), hyperventilation if squeeze rate is too fast (target 10-12 breaths/minute for adults), inadequate ventilation if mask seal is poor",
        contra: "Should not be used as a definitive airway in patients requiring prolonged ventilation (endotracheal intubation or supraglottic airway preferred); ineffective with facial trauma preventing mask seal; requires two-person technique for optimal mask seal and ventilation (one person maintains jaw-thrust and mask seal, the other squeezes the bag)",
        pearl: "Use the E-C clamp technique for mask seal: form a C with the thumb and index finger to hold the mask on the face, and an E with the remaining three fingers under the jaw to maintain jaw thrust and head tilt; deliver each breath over 1 second with just enough volume to produce visible chest rise (approximately 500-600 mL for adults); avoid excessive ventilation rate and volume to prevent gastric distension and barotrauma"
      }
    ],
    pearls: [
      "SpO2 of 90% corresponds to a PaO2 of approximately 60 mmHg -- this is the critical inflection point on the oxygen-hemoglobin dissociation curve; below this point, even small decreases in PaO2 cause rapid desaturation (the cliff edge phenomenon)",
      "Pulse oximetry CANNOT detect carbon monoxide poisoning: carboxyhemoglobin absorbs light similarly to oxyhemoglobin, producing a falsely normal SpO2 reading; always suspect CO poisoning in patients with headache, nausea, and confusion after fire exposure or during winter heating season",
      "Nail polish (especially dark blue, green, and black) can falsely LOWER SpO2 readings by absorbing light at wavelengths similar to deoxyhemoglobin -- remove nail polish or use an alternative probe site (earlobe, forehead) for accurate readings",
      "SpO2 does not measure oxygen DELIVERY to tissues -- a patient with severe anemia (Hb 5 g/dL) can have an SpO2 of 100% but dangerously inadequate tissue oxygenation because there are not enough hemoglobin molecules to carry sufficient oxygen",
      "For COPD patients with chronic CO2 retention, the target SpO2 is typically 88-92% (NOT 94-100%) because excessive oxygen supplementation can suppress the hypoxic ventilatory drive and cause hypoventilation and CO2 narcosis",
      "The plethysmographic waveform (pulse waveform) is more important than the SpO2 number: a strong, regular waveform indicates a reliable reading; a weak, erratic, or flat waveform means the number displayed is unreliable regardless of what it shows",
      "Each liter per minute of nasal cannula flow increases FiO2 by approximately 4% above room air (21%): 1 L/min = 24%, 2 L/min = 28%, 3 L/min = 32%, 4 L/min = 36%, 5 L/min = 40%, 6 L/min = 44%; flows above 6 L/min require a mask"
    ],
    quiz: [
      {
        question: "A practical nurse is monitoring a patient who was rescued from a house fire. The pulse oximeter reads SpO2 98%, but the patient is confused and has a cherry-red skin color. What should the practical nurse recognize about this situation?",
        options: [
          "The SpO2 reading is accurate and the patient's oxygenation is adequate",
          "The pulse oximeter cannot detect carbon monoxide poisoning, and the SpO2 reading is falsely normal",
          "The confusion is caused by anxiety and the patient should be reassured",
          "The cherry-red color indicates adequate tissue perfusion"
        ],
        correct: 1,
        rationale: "Carbon monoxide (CO) binds to hemoglobin with 200-250 times greater affinity than oxygen, forming carboxyhemoglobin (COHb). Pulse oximeters cannot distinguish between oxyhemoglobin and carboxyhemoglobin because they absorb light at similar wavelengths. The SpO2 reads falsely normal despite severe tissue hypoxia. Cherry-red skin color and confusion are classic signs of CO poisoning. An arterial blood gas with co-oximetry is needed for accurate assessment."
      },
      {
        question: "A practical nurse is caring for a patient with COPD who is on 2 L/min nasal cannula. The SpO2 reads 95%. Based on the prescribed target of 88-92%, what is the appropriate action?",
        options: [
          "Continue monitoring because higher SpO2 is always better",
          "Reduce the oxygen flow rate as prescribed and reassess to maintain the 88-92% target",
          "Increase the oxygen to 4 L/min to ensure adequate oxygenation",
          "Remove the oxygen completely since SpO2 is above target"
        ],
        correct: 1,
        rationale: "For patients with COPD and chronic CO2 retention, the target SpO2 is typically 88-92%. Excessive oxygen supplementation (SpO2 above the target) can suppress the hypoxic ventilatory drive, leading to hypoventilation, CO2 accumulation, and respiratory acidosis (CO2 narcosis). The appropriate action is to reduce the oxygen flow rate per the prescriber's order and reassess SpO2 to maintain it within the prescribed target range."
      },
      {
        question: "A practical nurse obtains a pulse oximetry reading of 87% on a patient's finger. The patient is wearing dark blue nail polish and has cold hands. The patient denies shortness of breath and has a regular respiratory rate of 16 breaths per minute. What should the practical nurse do first?",
        options: [
          "Immediately apply a non-rebreather mask at 15 L/min",
          "Remove the nail polish or move the probe to the earlobe and reassess the reading",
          "Document the reading and continue routine monitoring",
          "Obtain an arterial blood gas immediately"
        ],
        correct: 1,
        rationale: "Dark blue nail polish and cold fingers are both known causes of falsely low SpO2 readings. The patient's clinical presentation (no dyspnea, normal respiratory rate) does not correlate with an SpO2 of 87%. Before escalating interventions, the practical nurse should first address factors that can produce inaccurate readings: remove the nail polish, warm the fingers, or move the probe to an alternative site (earlobe or forehead). If the reading remains low after correcting these factors, further assessment and intervention are warranted."
      }
    ]
  }
};

let ok = 0;
let fail = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++;
  else fail++;
}
console.log(`\nDone: ${ok} injected, ${fail} skipped`);
if (fail > 0) process.exit(1);
