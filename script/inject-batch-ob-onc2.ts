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
  "cesarean-section-care-rpn": {
    title: "Cesarean Section Care for Practical Nurses",
    cellular: {
      title: "Anatomy, Physiology, and Surgical Considerations of Cesarean Delivery",
      content: "A cesarean section (C-section) is a surgical procedure in which the fetus is delivered through an incision in the abdominal wall (laparotomy) and the uterine wall (hysterotomy). The procedure involves incision through multiple tissue layers: skin, subcutaneous fat, rectus fascia, rectus abdominis muscle (separated, not cut), peritoneum, and finally the uterine myometrium. The most common uterine incision is the low transverse (Kerr) incision, made in the thinner lower uterine segment, which results in less blood loss, easier repair, and lower risk of uterine rupture in future pregnancies compared to the classical vertical incision. The uterine myometrium is composed of three smooth muscle layers: the outer longitudinal layer, the middle interlacing layer (which contains the major blood vessels and is responsible for the 'living ligature' effect that controls postpartum hemorrhage through contraction), and the inner circular layer. After delivery, the uterus must contract firmly to compress the spiral arteries at the former placental attachment site. The placental site covers approximately 200 square centimeters of endometrial surface and contains between 150 and 200 spiral arteries. Failure of the myometrium to contract (uterine atony) leaves these arteries unsupported, resulting in hemorrhage that can exceed 500 mL per minute. Postoperatively, the endometrium undergoes involution over approximately 6 weeks, during which the decidual lining is shed as lochia. Lochia progresses through three stages: lochia rubra (red, days 1-3), lochia serosa (pinkish-brown, days 4-10), and lochia alba (yellowish-white, days 11 to approximately 6 weeks). The practical nurse must understand wound healing principles as they apply to the surgical incision: the inflammatory phase (days 0-4), proliferative phase (days 4-21), and remodeling phase (day 21 to 1 year). Breastfeeding initiation after cesarean delivery may be delayed due to surgical recovery, anesthesia effects, and maternal-infant separation. The LATCH scoring system evaluates breastfeeding effectiveness across five components: Latch (attachment quality), Audible swallowing, Type of nipple, Comfort of the breast and nipple, and Hold (positioning assistance needed). Each component is scored 0-2, with a total score of 10 indicating optimal breastfeeding."
    },
    riskFactors: [
      "Previous cesarean delivery (risk of uterine rupture with subsequent vaginal delivery, scar tissue complications)",
      "Placenta previa or placental abruption (absolute indication when placenta covers cervical os)",
      "Cephalopelvic disproportion (fetal head too large for maternal pelvis)",
      "Malpresentation (breech, transverse lie) that cannot be corrected by external cephalic version",
      "Maternal conditions: preeclampsia with severe features, active genital herpes, HIV with high viral load",
      "Fetal distress: non-reassuring fetal heart rate patterns, cord prolapse requiring emergent delivery",
      "Failed induction of labor or failure to progress in labor (arrested dilation or descent)"
    ],
    diagnostics: [
      "Complete blood count (CBC): baseline hemoglobin/hematocrit pre-operatively; repeat post-op to assess blood loss; hemoglobin drop greater than 2 g/dL suggests significant hemorrhage",
      "Type and screen/crossmatch: blood type, Rh factor, and antibody screen required before surgery; crossmatch 2 units packed red blood cells for high-risk patients",
      "Coagulation studies (PT, PTT, INR, fibrinogen): assess clotting ability pre-operatively; fibrinogen below 200 mg/dL increases hemorrhage risk",
      "Basic metabolic panel: electrolytes, glucose, BUN/creatinine; monitor glucose closely in diabetic patients; potassium critical for cardiac function during anesthesia",
      "Urinalysis and urine culture: rule out urinary tract infection before surgery; catheterization increases post-operative UTI risk",
      "Fetal assessment: continuous electronic fetal monitoring until surgery; biophysical profile if indicated; confirm fetal presentation by ultrasound"
    ],
    management: [
      "Pre-operative preparation: verify informed consent, NPO status (minimum 6-8 hours for solids, 2 hours for clear liquids), surgical site preparation, insert Foley catheter, administer pre-operative antibiotics within 60 minutes of incision",
      "Intraoperative monitoring: continuous pulse oximetry, blood pressure every 3-5 minutes, ECG monitoring; count sponges and instruments before closure; document estimated blood loss",
      "Post-operative vital signs: every 15 minutes for first hour, every 30 minutes for second hour, then every 4 hours or per facility protocol; assess for hemorrhage signs",
      "Fundal assessment: palpate fundus every 15 minutes for first hour post-delivery; fundus should be firm and at or below the umbilicus; massage if boggy (soft)",
      "Pain management: multimodal approach using scheduled analgesics; neuraxial morphine provides 18-24 hours of post-operative pain relief; transition to oral analgesics as tolerated",
      "Encourage early ambulation within 6-8 hours post-surgery to prevent deep vein thrombosis, promote bowel function, and reduce ileus risk",
      "Breastfeeding support: initiate skin-to-skin contact as soon as possible in recovery; assess LATCH score at each feeding; assist with positioning to avoid incisional pressure"
    ],
    nursingActions: [
      "Assess surgical incision every shift for signs of infection (redness, warmth, swelling, purulent drainage, dehiscence) and document findings using standardized wound assessment",
      "Monitor lochia: assess color, amount, odor, and presence of clots every 15 minutes for the first hour, then every 4 hours; report saturating more than 1 pad per hour or foul-smelling lochia",
      "Perform fundal checks: locate uterine fundus by palpating abdomen; fundus should be firm, midline, and at or 1 fingerbreadth below the umbilicus on day 1; report boggy or deviated fundus immediately",
      "Monitor intake and output: record all IV fluids, oral intake, Foley catheter output; report urine output less than 30 mL/hour; remove Foley within 12-24 hours per order",
      "Assess for deep vein thrombosis: Homans sign (calf pain with dorsiflexion, though sensitivity is low), calf circumference, warmth, redness; apply sequential compression devices until ambulating",
      "Administer medications as ordered: analgesics on schedule, stool softeners to prevent straining, Rh immunoglobulin (RhoGAM) within 72 hours if mother is Rh-negative and infant is Rh-positive",
      "Educate patient on incision care, activity restrictions (no lifting greater than 10 pounds for 6 weeks), signs of infection, when to seek emergency care, and contraception counseling"
    ],
    assessmentFindings: [
      "Normal fundal height progression: immediately post-delivery the fundus is at the umbilicus; descends approximately 1 fingerbreadth per day; non-palpable by day 10-14",
      "Normal lochia progression: rubra (bright red, days 1-3), serosa (pinkish-brown, days 4-10), alba (yellowish-white, days 11 onward); total duration approximately 4-6 weeks",
      "Incision assessment: clean, dry, intact, well-approximated edges; staples or sutures present; mild ecchymosis is normal; steri-strips applied after staple removal",
      "Post-spinal anesthesia assessment: assess return of motor and sensory function in lower extremities; monitor for post-dural puncture headache (positional headache worse when upright)",
      "Bowel function recovery: auscultate bowel sounds in all four quadrants; absent sounds expected initially; return of flatus indicates GI motility recovery; advance diet as tolerated",
      "Emotional assessment: monitor for signs of postpartum depression or anxiety; difficulty bonding, persistent crying, feelings of inadequacy, sleep disturbance beyond expected newborn care demands",
      "Bladder assessment after Foley removal: first void within 6 hours; assess for urinary retention by palpating suprapubic area; bladder scan if unable to void"
    ],
    signs: {
      left: [
        "Mild incisional pain controlled with oral analgesics",
        "Lochia rubra that is moderate in amount and without large clots",
        "Fundus firm and midline at or below umbilicus",
        "Mild peripheral edema in lower extremities",
        "Low-grade temperature (below 38 degrees Celsius) in first 24 hours",
        "Decreased bowel sounds in immediate post-operative period"
      ],
      right: [
        "Boggy or non-contractile uterus unresponsive to massage (hemorrhage risk)",
        "Saturating more than 1 pad per hour or passing clots larger than a golf ball",
        "Temperature above 38 degrees Celsius after first 24 hours (infection)",
        "Incision with purulent drainage, dehiscence, or evisceration",
        "Unilateral leg swelling with warmth and redness (deep vein thrombosis)",
        "Severe headache with visual changes (post-dural puncture or preeclampsia)"
      ]
    },
    medications: [
      {
        name: "Ketorolac (Toradol)",
        type: "Nonsteroidal anti-inflammatory drug (NSAID)",
        action: "Inhibits cyclooxygenase-1 and cyclooxygenase-2 enzymes, blocking prostaglandin synthesis at the site of tissue injury and inflammation, reducing pain, inflammation, and fever through peripheral and central mechanisms",
        sideEffects: "GI bleeding, renal impairment, platelet dysfunction (increased bleeding risk), nausea, headache, dizziness, injection site pain",
        contra: "Active GI bleeding or peptic ulcer disease; renal impairment (creatinine clearance below 30 mL/min); concurrent use with anticoagulants; third trimester pregnancy (premature closure of ductus arteriosus); post-CABG surgery",
        pearl: "Maximum duration of use is 5 days total (all routes combined) due to increased GI and renal toxicity with prolonged use; commonly used IV/IM for 24-48 hours post-cesarean before transitioning to oral ibuprofen; administer with food if given orally"
      },
      {
        name: "Oxytocin (Pitocin)",
        type: "Uterotonic hormone / oxytocic agent",
        action: "Synthetic form of the posterior pituitary hormone oxytocin; binds to oxytocin receptors on uterine smooth muscle cells, increasing intracellular calcium and stimulating rhythmic uterine contractions; promotes contraction of the myometrium around spiral arteries at the placental site to prevent hemorrhage",
        sideEffects: "Uterine hyperstimulation (tetanic contractions), water intoxication and hyponatremia (antidiuretic effect at high doses), hypotension (rapid IV bolus), nausea, vomiting, cardiac arrhythmias",
        contra: "Contraindicated when vaginal delivery is not appropriate (for labor induction); use cautiously in patients with uterine overdistension (multiple gestation, polyhydramnios); hypersensitivity to oxytocin",
        pearl: "After cesarean delivery, 10-40 units in 1 liter of IV fluid is the standard infusion to maintain uterine tone; NEVER administer as undiluted IV bolus (causes severe hypotension); monitor fundal tone and lochia output during infusion; uterine massage is performed concurrently if fundus is boggy"
      },
      {
        name: "Cefazolin (Ancef/Kefzol)",
        type: "First-generation cephalosporin antibiotic",
        action: "Binds to penicillin-binding proteins in the bacterial cell wall, inhibiting transpeptidation and disrupting cell wall synthesis, leading to bacterial cell lysis and death; effective against gram-positive organisms (Staphylococcus aureus, Streptococcus species) and some gram-negative organisms",
        sideEffects: "Hypersensitivity reactions (rash, urticaria, anaphylaxis in rare cases), diarrhea, nausea, Clostridioides difficile-associated diarrhea, phlebitis at IV site, elevated liver enzymes",
        contra: "Known anaphylaxis to cephalosporins; use with caution in patients with documented penicillin allergy (approximately 1-2% cross-reactivity); severe renal impairment requires dose adjustment",
        pearl: "Standard surgical prophylaxis dose is 2 g IV (3 g if patient weighs over 120 kg) given within 60 minutes before skin incision; redose every 4 hours during prolonged surgery; single pre-operative dose reduces surgical site infection rate by 60-70%; ask about penicillin allergy before administration"
      }
    ],
    pearls: [
      "Fundal assessment technique: support the lower uterine segment with one hand above the symphysis pubis while palpating the fundus with the other hand; a firm, contracted fundus feels like a grapefruit; a boggy fundus requires immediate massage with circular motions until firm",
      "The LATCH breastfeeding assessment score evaluates five components (Latch, Audible swallowing, Type of nipple, Comfort, Hold) each scored 0-2; a score below 7 indicates the mother needs additional breastfeeding support and lactation consultation",
      "Lochia should NEVER contain foul odor -- foul-smelling lochia is a hallmark sign of endometritis (uterine infection) and requires immediate reporting and antibiotic therapy",
      "After cesarean delivery, the fundus may be slightly higher than expected due to abdominal distension; always assess in conjunction with lochia amount and patient symptoms rather than relying on a single finding",
      "Post-operative ileus is common after cesarean section due to bowel manipulation and anesthesia; encourage early ambulation, chewing gum (shown to stimulate bowel motility), and advance diet progressively from clear liquids to regular diet",
      "Rh-negative mothers who deliver Rh-positive infants must receive Rh immunoglobulin (RhoGAM) within 72 hours of delivery to prevent alloimmunization; verify Rh status of both mother and infant before administration",
      "The practical nurse must differentiate between expected post-surgical pain and signs of complications: incisional pain that worsens after initial improvement, accompanied by fever and erythema, suggests wound infection rather than normal healing"
    ],
    quiz: [
      {
        question: "A practical nurse is assessing a patient 4 hours after cesarean delivery and finds the uterine fundus to be soft and boggy above the umbilicus. What is the priority nursing action?",
        options: [
          "Document the finding and reassess in 30 minutes",
          "Firmly massage the fundus and notify the physician if it does not become firm",
          "Administer oral analgesics for incisional discomfort",
          "Assist the patient to ambulate to promote uterine contraction"
        ],
        correct: 1,
        rationale: "A boggy (soft, non-contracted) fundus above the umbilicus indicates uterine atony, which is the leading cause of postpartum hemorrhage. The priority action is to firmly massage the fundus to stimulate contraction and notify the physician if the uterus does not respond. Documentation alone delays treatment, and ambulation is not appropriate for an actively atonic uterus."
      },
      {
        question: "A patient is 2 days post-cesarean section and reports a severe headache that worsens when sitting upright and improves when lying flat. Which complication should the practical nurse suspect?",
        options: [
          "Postpartum preeclampsia",
          "Post-dural puncture headache from spinal anesthesia",
          "Tension headache from stress",
          "Meningitis"
        ],
        correct: 1,
        rationale: "A positional headache that worsens with upright position and improves when lying flat is the hallmark presentation of a post-dural puncture headache (PDPH), which occurs when cerebrospinal fluid leaks through the puncture site in the dura mater created during spinal anesthesia. Treatment includes bed rest, hydration, caffeine, and potentially an epidural blood patch."
      },
      {
        question: "The practical nurse is providing discharge teaching to a post-cesarean patient. Which statement by the patient indicates a need for further education?",
        options: [
          "I should not lift anything heavier than my baby for six weeks",
          "I will call my doctor if my incision becomes red, swollen, or drains pus",
          "Bright red bleeding that returns after it had turned pink means I should rest more, that is normal",
          "I should report a fever above 38 degrees Celsius to my healthcare provider"
        ],
        correct: 2,
        rationale: "A return to bright red bleeding (lochia rubra) after lochia had progressed to serosa (pink) may indicate subinvolution of the uterus, retained placental fragments, or excessive activity, and requires medical evaluation rather than simply resting. This statement indicates a need for further teaching about warning signs that require contacting the healthcare provider."
      }
    ]
  },

  "carbon-monoxide-poisoning-rpn": {
    title: "Carbon Monoxide Poisoning for Practical Nurses",
    cellular: {
      title: "Pathophysiology and Cellular Mechanisms of Carbon Monoxide Toxicity",
      content: "Carbon monoxide (CO) is a colorless, odorless, tasteless gas produced by the incomplete combustion of carbon-containing fuels (natural gas, gasoline, wood, charcoal, propane). CO exerts its toxic effects through multiple cellular mechanisms that impair oxygen delivery and utilization at the tissue level. The primary mechanism involves CO binding to hemoglobin with an affinity approximately 200-250 times greater than oxygen, forming carboxyhemoglobin (COHb). This binding occurs at the same site on the hemoglobin molecule where oxygen normally attaches (the iron center of the heme group). When CO occupies one or more of the four heme binding sites, it causes a conformational change in the hemoglobin molecule that increases the affinity of the remaining heme groups for oxygen. This is known as the left shift of the oxyhemoglobin dissociation curve, meaning that hemoglobin holds onto oxygen more tightly and releases it less readily to the tissues. The result is a dual insult: reduced oxygen-carrying capacity (because CO-occupied sites cannot carry oxygen) and impaired oxygen release at the cellular level (because the remaining oxygen is bound too tightly). CO also binds to myoglobin in cardiac and skeletal muscle with high affinity, directly impairing muscle oxygen storage and contributing to cardiac dysfunction and rhabdomyolysis. At the mitochondrial level, CO binds to cytochrome c oxidase (Complex IV of the electron transport chain), disrupting oxidative phosphorylation and ATP production. This causes a shift to anaerobic metabolism, resulting in lactic acid accumulation and metabolic acidosis. CO also triggers inflammatory cascades by activating neutrophils and promoting lipid peroxidation in the brain, which contributes to delayed neurological sequelae (DNS) that can appear days to weeks after apparent recovery. Carboxyhemoglobin levels correlate roughly with severity: non-smokers have baseline COHb of less than 3%, smokers up to 10%; symptoms typically begin at 10-20% (headache, dizziness), moderate toxicity at 20-40% (confusion, syncope, tachycardia), severe toxicity at 40-60% (seizures, coma, cardiac arrhythmias), and levels above 60% are often fatal. Standard pulse oximetry is UNRELIABLE in CO poisoning because the device cannot differentiate between oxyhemoglobin and carboxyhemoglobin, often displaying falsely normal SpO2 readings. CO-oximetry, which uses multiple wavelengths of light, is required for accurate measurement."
    },
    riskFactors: [
      "Residential exposure: poorly maintained furnaces, blocked chimneys, unvented gas heaters, charcoal grills used indoors, generators operated in enclosed spaces",
      "Occupational exposure: firefighters, mechanics, toll booth operators, warehouse workers near propane-powered forklifts, miners",
      "Seasonal risk: highest incidence during winter months (heating system use) and after natural disasters (generator use during power outages)",
      "Smoking: chronic smokers have baseline carboxyhemoglobin levels of 5-10%, making them more susceptible to additional CO exposure",
      "Enclosed environments: vehicles idling in garages, poorly ventilated parking structures, ice-skating rinks with propane-powered resurfacing machines",
      "Age extremes: infants and elderly are more susceptible due to higher metabolic rates (infants) and decreased cardiopulmonary reserve (elderly)",
      "Pre-existing conditions: coronary artery disease, anemia, COPD (reduced compensatory reserve for oxygen delivery impairment)"
    ],
    diagnostics: [
      "CO-oximetry (co-oximeter blood test): gold standard for diagnosis; measures carboxyhemoglobin level directly using multi-wavelength spectrophotometry; venous sample is acceptable (arterial not required for COHb level alone); normal non-smoker less than 3%, smoker less than 10%",
      "Arterial blood gas (ABG): PaO2 is often NORMAL (measures dissolved O2, not hemoglobin-bound O2); look for metabolic acidosis (low pH, low HCO3-, elevated lactate) indicating tissue hypoxia",
      "Serum lactate: elevated in significant CO poisoning due to anaerobic metabolism; lactate greater than 2 mmol/L indicates tissue hypoperfusion; useful marker of severity",
      "Troponin and ECG: assess for myocardial injury; CO binds to myoglobin and causes direct cardiac toxicity; ECG may show ST changes, arrhythmias, or ischemic patterns",
      "Basic metabolic panel: assess electrolytes, glucose, renal function; monitor for rhabdomyolysis (elevated creatinine kinase, hyperkalemia, myoglobinuria)",
      "Neuropsychological testing: recommended for patients with significant exposure; baseline testing helps identify delayed neurological sequelae that may develop 2-40 days after exposure"
    ],
    management: [
      "Immediately remove patient from the source of CO exposure and move to fresh air; this is the single most important initial intervention",
      "Administer 100% oxygen via non-rebreather mask at 15 L/min: high-flow oxygen is the primary treatment; it reduces COHb half-life from 4-6 hours (on room air) to 60-90 minutes",
      "Hyperbaric oxygen therapy (HBO): delivers 100% O2 at 2-3 atmospheres pressure; reduces COHb half-life to 15-30 minutes; indicated for COHb greater than 25%, loss of consciousness, cardiac ischemia, pregnancy, or persistent neurological symptoms",
      "Continuous cardiac monitoring: CO causes direct myocardial toxicity and arrhythmias; monitor for ST changes, ventricular dysrhythmias, and hemodynamic instability",
      "IV fluid resuscitation: maintain adequate hydration to support renal perfusion; alkalinize urine if rhabdomyolysis is suspected to prevent myoglobin-induced renal injury",
      "Serial neurological assessments: monitor for delayed neurological sequelae including cognitive impairment, personality changes, movement disorders; may appear 2-40 days after exposure",
      "Seizure precautions: maintain safe environment, padded side rails, suction at bedside; administer anticonvulsants as ordered if seizures occur"
    ],
    nursingActions: [
      "Apply 100% oxygen via non-rebreather mask immediately upon admission and maintain until carboxyhemoglobin level returns to normal (below 3% for non-smokers); do NOT titrate down based on pulse oximetry readings",
      "Monitor cardiac rhythm continuously; report any dysrhythmias, ST segment changes, or complaints of chest pain immediately to the physician",
      "Perform neurological assessments every 1-2 hours including level of consciousness (Glasgow Coma Scale), orientation, pupil response, motor strength, and cognitive function (short-term memory, word recall)",
      "Document and report pulse oximetry findings with the notation that SpO2 is unreliable in CO poisoning; ensure CO-oximetry results are obtained and communicated to the care team",
      "Monitor for signs of cerebral edema: worsening headache, projectile vomiting, altered level of consciousness, unequal pupils, Cushing triad (hypertension, bradycardia, irregular respirations)",
      "Assess urine output and color: dark brown or cola-colored urine suggests myoglobinuria from rhabdomyolysis; report immediately and maintain IV fluid infusion as ordered",
      "Provide emotional support and education: patients and families may experience anxiety about long-term neurological effects; explain the importance of follow-up neuropsychological testing at 1 and 6 months"
    ],
    assessmentFindings: [
      "Mild toxicity (COHb 10-20%): headache (most common early symptom, described as throbbing bilateral), dizziness, nausea, vomiting, fatigue, difficulty concentrating",
      "Moderate toxicity (COHb 20-40%): confusion, disorientation, visual disturbances (blurred vision), syncope or near-syncope, tachycardia, tachypnea, chest pain in patients with coronary artery disease",
      "Severe toxicity (COHb 40-60%): seizures, loss of consciousness, coma, cardiac arrhythmias (ventricular tachycardia, ventricular fibrillation), pulmonary edema, lactic acidosis",
      "Cherry-red skin appearance: classically described in textbooks but is actually an UNRELIABLE and LATE finding; more commonly seen postmortem; living patients typically present with normal or pale skin color",
      "Retinal hemorrhages: flame-shaped hemorrhages visible on fundoscopic examination; indicate severe exposure and increased risk of neurological complications",
      "Delayed neurological sequelae (DNS): cognitive deficits, memory impairment, personality changes, parkinsonism, incontinence; may appear 2-40 days after initial recovery and apparent symptom resolution",
      "Fetal effects in pregnant patients: fetal hemoglobin has even higher affinity for CO than adult hemoglobin; fetal COHb levels may be 10-15% higher than maternal levels"
    ],
    signs: {
      left: [
        "Headache described as throbbing or pressure-like",
        "Mild nausea and dizziness",
        "Fatigue and difficulty concentrating",
        "Tachycardia at rest",
        "Irritability and restlessness",
        "Mild shortness of breath with exertion"
      ],
      right: [
        "Loss of consciousness or unresponsiveness",
        "Seizure activity",
        "Cardiac arrhythmias on monitor (ventricular tachycardia, V-fib)",
        "Signs of cerebral edema (Cushing triad: hypertension, bradycardia, irregular respirations)",
        "Severe metabolic acidosis (pH below 7.2 on ABG)",
        "Cherry-red skin (late, ominous finding suggesting lethal exposure)"
      ]
    },
    medications: [
      {
        name: "Oxygen (100% high-flow via non-rebreather mask)",
        type: "Respiratory gas / antidote for CO poisoning",
        action: "High-concentration oxygen competitively displaces carbon monoxide from hemoglobin binding sites by mass action effect; increases dissolved oxygen in plasma (independent of hemoglobin) to support tissue oxygenation; reduces COHb half-life from 4-6 hours on room air to 60-90 minutes on 100% O2",
        sideEffects: "Oxygen toxicity with prolonged exposure (greater than 24-48 hours at 100%): pulmonary oxygen toxicity (tracheobronchitis, absorption atelectasis, ARDS); retinopathy of prematurity in neonates",
        contra: "No absolute contraindications in CO poisoning (benefit always outweighs risk); use caution in premature neonates (retinopathy risk); in CO poisoning, do NOT withhold oxygen based on SpO2 readings or COPD CO2 retention concerns",
        pearl: "Standard pulse oximetry reads falsely normal in CO poisoning because the device cannot distinguish COHb from oxyhemoglobin; always use CO-oximetry for accurate assessment; do not titrate oxygen down based on SpO2 in suspected CO exposure"
      },
      {
        name: "Hydroxocobalamin (Cyanokit)",
        type: "Cyanide antidote / vitamin B12 precursor",
        action: "Contains a cobalt ion that binds directly to cyanide with very high affinity, forming cyanocobalamin (vitamin B12) which is renally excreted; used when combined CO and cyanide poisoning is suspected (common in structural fire victims who inhale both CO and hydrogen cyanide from burning plastics and synthetic materials)",
        sideEffects: "Red discoloration of skin, mucous membranes, and urine (lasting up to 2 weeks, benign but alarming to patients); transient hypertension; headache; nausea; injection site reactions; interferes with colorimetric laboratory tests (falsely elevated bilirubin, falsely decreased creatinine)",
        contra: "Known hypersensitivity to hydroxocobalamin or cyanocobalamin; use caution in patients with known renal impairment (primary elimination route); note that red discoloration may interfere with laboratory measurements for several days",
        pearl: "Indicated specifically for smoke inhalation victims with suspected concurrent cyanide poisoning; administer 5 g IV over 15 minutes; clinical clues for cyanide co-poisoning include lactic acidosis out of proportion to COHb level, altered mental status with normal or high PaO2, and cardiac instability"
      },
      {
        name: "Diazepam (Valium)",
        type: "Benzodiazepine / anticonvulsant / anxiolytic",
        action: "Enhances the effect of gamma-aminobutyric acid (GABA) at the GABA-A receptor by increasing the frequency of chloride channel opening, resulting in neuronal hyperpolarization and decreased neuronal excitability; provides anticonvulsant, anxiolytic, muscle relaxant, and sedative effects",
        sideEffects: "Respiratory depression (especially when combined with opioids or in patients with compromised ventilation), excessive sedation, hypotension, paradoxical agitation (rare, more common in elderly), anterograde amnesia, venous irritation with IV administration",
        contra: "Severe respiratory depression; acute narrow-angle glaucoma; sleep apnea syndrome; concurrent use with opioids (additive respiratory depression); myasthenia gravis; severe hepatic impairment",
        pearl: "Used for seizure management in CO poisoning; IV route preferred for acute seizures (onset 1-3 minutes); monitor respiratory status closely after administration; have bag-valve-mask and suction available; in CO poisoning, seizures indicate severe toxicity and may necessitate hyperbaric oxygen therapy"
      }
    ],
    pearls: [
      "Standard pulse oximetry is UNRELIABLE in carbon monoxide poisoning because the device uses only two wavelengths of light and cannot differentiate between oxyhemoglobin and carboxyhemoglobin -- always obtain CO-oximetry from a blood sample",
      "Cherry-red skin color is classically taught as a sign of CO poisoning but is actually an unreliable and LATE clinical finding seen more commonly at autopsy than in living patients; do not rely on skin color to diagnose or exclude CO poisoning",
      "The half-life of carboxyhemoglobin decreases dramatically with oxygen therapy: 4-6 hours on room air, 60-90 minutes on 100% O2, and 15-30 minutes with hyperbaric oxygen at 2.5-3 atmospheres",
      "Consider CO poisoning in any patient presenting with headache, nausea, and dizziness, especially when multiple household members present with similar symptoms simultaneously (cluster presentation) -- this pattern is highly suggestive of environmental CO exposure",
      "Pregnant patients require more aggressive treatment because fetal hemoglobin has an even higher affinity for CO than adult hemoglobin, resulting in fetal COHb levels 10-15% higher than maternal levels; lower threshold for hyperbaric oxygen therapy in pregnancy",
      "Delayed neurological sequelae (DNS) can appear 2-40 days after initial CO exposure even in patients who appeared to have fully recovered; symptoms include cognitive impairment, personality changes, memory loss, and parkinsonism; patients must be counseled about this risk and scheduled for follow-up",
      "In house fire victims, always consider concurrent cyanide poisoning from combustion of synthetic materials (plastics, nylon, polyurethane); lactic acidosis disproportionate to COHb level and rapid cardiovascular collapse are clues to dual toxicity requiring hydroxocobalamin"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient admitted with carbon monoxide poisoning. The pulse oximeter displays an SpO2 of 99%. The patient is confused with a carboxyhemoglobin level of 32%. What is the most appropriate nursing action?",
        options: [
          "Remove the non-rebreather mask since the SpO2 is adequate",
          "Continue 100% oxygen via non-rebreather mask and document that SpO2 is unreliable in CO poisoning",
          "Decrease oxygen to 2 L/min via nasal cannula to prevent oxygen toxicity",
          "Reassess the pulse oximetry probe placement since the reading seems incorrect"
        ],
        correct: 1,
        rationale: "Pulse oximetry is unreliable in CO poisoning because the device cannot differentiate between oxyhemoglobin and carboxyhemoglobin, producing falsely elevated SpO2 readings. A COHb of 32% indicates moderate-to-severe toxicity requiring continued 100% oxygen therapy regardless of SpO2 readings. CO-oximetry is the only accurate method to assess oxygenation status."
      },
      {
        question: "A family of four presents to the emergency department with headache, nausea, and dizziness. All symptoms began after they started using a new space heater in their home. Which action should the practical nurse prioritize?",
        options: [
          "Obtain individual patient histories to determine the most likely diagnosis",
          "Place all patients on 100% oxygen via non-rebreather mask and obtain carboxyhemoglobin levels",
          "Administer ondansetron for nausea and acetaminophen for headaches",
          "Perform a comprehensive physical examination on each patient"
        ],
        correct: 1,
        rationale: "When multiple household members present with similar symptoms (headache, nausea, dizziness), especially with a new combustion source, carbon monoxide poisoning must be suspected. The priority is to administer 100% oxygen immediately to begin displacing CO from hemoglobin while obtaining COHb levels to confirm the diagnosis. Treating symptoms without addressing the underlying cause is dangerous."
      },
      {
        question: "A practical nurse is monitoring a patient recovering from moderate carbon monoxide poisoning. The carboxyhemoglobin level has normalized and the patient states they feel completely fine. Which teaching point is most important before discharge?",
        options: [
          "Resume normal activities immediately since the carboxyhemoglobin has returned to normal",
          "Avoid smoking for 48 hours to prevent re-elevation of carboxyhemoglobin",
          "Return for follow-up neuropsychological evaluation because delayed neurological problems can appear days to weeks after exposure",
          "Install a carbon monoxide detector only in the bedroom"
        ],
        correct: 2,
        rationale: "Delayed neurological sequelae (DNS) can develop 2-40 days after CO poisoning even in patients who appear to have fully recovered. Symptoms include cognitive impairment, personality changes, memory loss, and movement disorders. Follow-up neuropsychological testing is essential to detect these complications early. CO detectors should be installed on every level of the home."
      }
    ]
  },

  "breast-cancer-basics-rpn": {
    title: "Breast Cancer Basics for Practical Nurses",
    cellular: {
      title: "Cellular Biology and Pathophysiology of Breast Cancer",
      content: "Breast cancer develops when cells in the breast undergo malignant transformation through accumulated genetic mutations that disable normal cell cycle regulation. The breast is composed of 15-20 lobes arranged in a circular pattern around the nipple, each containing lobules (milk-producing glands) connected by ducts that converge at the nipple. The majority of breast cancers arise from the epithelial cells lining these ducts (ductal carcinoma, approximately 70-80% of cases) or from the lobules (lobular carcinoma, approximately 10-15%). At the cellular level, cancer development follows a multi-step progression model. Ductal carcinoma in situ (DCIS) represents a pre-invasive stage where malignant cells proliferate within the duct but have not penetrated the basement membrane. Once tumor cells breach the basement membrane and invade the surrounding stroma, the cancer is classified as invasive (infiltrating) ductal carcinoma. The invasion process requires the tumor cells to secrete matrix metalloproteinases (MMPs) that degrade the extracellular matrix, allowing cellular migration and eventually metastasis through lymphatic and hematogenous spread. Breast cancer cells are classified by receptor status, which is critical for treatment selection. Estrogen receptor-positive (ER+) tumors have receptors that bind estrogen, which stimulates cell proliferation; approximately 70% of breast cancers are ER+. Progesterone receptor-positive (PR+) tumors similarly respond to progesterone stimulation. HER2-positive tumors overexpress the human epidermal growth factor receptor 2 protein, which drives aggressive cell growth through the RAS-MAPK and PI3K-AKT signaling pathways; approximately 15-20% of breast cancers are HER2+. Triple-negative breast cancer (TNBC) lacks all three receptors (ER-, PR-, HER2-), limiting treatment options to chemotherapy alone and carrying a generally poorer prognosis. The BRCA1 and BRCA2 genes are tumor suppressor genes involved in DNA double-strand break repair through homologous recombination. Mutations in these genes significantly increase lifetime breast cancer risk: BRCA1 mutation carriers have a 55-72% lifetime risk, and BRCA2 carriers have a 45-69% lifetime risk. TNM staging classifies tumors by size (T), lymph node involvement (N), and distant metastasis (M), with higher stages indicating more advanced disease and generally poorer prognosis. Sentinel lymph node biopsy identifies the first lymph node(s) to receive drainage from the tumor site, allowing assessment of regional spread while minimizing the surgical morbidity associated with full axillary lymph node dissection."
    },
    riskFactors: [
      "Female sex (99% of breast cancers occur in females; males account for approximately 1%)",
      "Age: risk increases significantly after age 50; median age at diagnosis is 62 years",
      "BRCA1 or BRCA2 gene mutation (55-72% and 45-69% lifetime risk respectively); strong family history (first-degree relative with breast cancer doubles the risk)",
      "Personal history of breast cancer or atypical ductal hyperplasia (increases risk 4-5 times)",
      "Early menarche (before age 12) or late menopause (after age 55) -- prolonged estrogen exposure",
      "Nulliparity or first full-term pregnancy after age 30 (prolonged exposure to cyclic estrogen without the protective effect of pregnancy-related breast differentiation)",
      "Combined hormone replacement therapy (estrogen plus progesterone) for more than 5 years post-menopause; obesity post-menopause (adipose tissue produces estrogen via aromatase enzyme); alcohol consumption (even moderate intake increases risk by 7-10% per drink per day); sedentary lifestyle"
    ],
    diagnostics: [
      "Mammography: screening standard for breast cancer detection; recommended annually or biennially starting at age 40-50 depending on guidelines; detects microcalcifications, masses, and architectural distortion; sensitivity approximately 85% (lower in dense breast tissue)",
      "Breast ultrasound: used to evaluate mammographic findings and differentiate solid masses from cysts; preferred imaging modality in women under 30 and during pregnancy; no radiation exposure",
      "Breast MRI: highest sensitivity for breast cancer detection (approximately 95%); recommended for high-risk screening (BRCA carriers, chest radiation history); used for extent-of-disease evaluation and contralateral breast assessment",
      "Core needle biopsy: gold standard for tissue diagnosis; provides histological type, grade, and receptor status (ER, PR, HER2); preferred over fine-needle aspiration for definitive diagnosis",
      "Sentinel lymph node biopsy (SLNB): blue dye or radioactive tracer injected near tumor; first draining node(s) identified and biopsied; negative sentinel node generally eliminates need for full axillary dissection",
      "Oncotype DX or MammaPrint genomic testing: gene expression profiling of tumor tissue to predict recurrence risk and chemotherapy benefit in ER+, HER2-, node-negative tumors; guides treatment decisions"
    ],
    management: [
      "Surgery: breast-conserving surgery (lumpectomy) with radiation or mastectomy (simple, modified radical); choice depends on tumor size relative to breast, multicentricity, and patient preference",
      "Radiation therapy: typically administered after lumpectomy (25-30 daily fractions over 5-6 weeks); reduces local recurrence by 50-70%; monitor for skin reactions (erythema, desquamation, fibrosis)",
      "Chemotherapy: adjuvant (after surgery) or neoadjuvant (before surgery to shrink tumor); common regimens include AC-T (doxorubicin/cyclophosphamide followed by taxane); monitor for myelosuppression, nausea, alopecia",
      "Endocrine (hormonal) therapy: for ER+ tumors; tamoxifen (premenopausal) or aromatase inhibitors (postmenopausal) for 5-10 years; reduces recurrence risk by approximately 40-50%",
      "Targeted therapy: trastuzumab (Herceptin) for HER2+ tumors given for 1 year; monitor cardiac function (echocardiogram every 3 months) for cardiotoxicity risk",
      "Supportive care: lymphedema prevention education (avoid blood pressures, venipunctures, and constricting garments on affected arm); psychosocial support; fertility counseling for premenopausal patients before treatment",
      "Follow-up surveillance: clinical breast exam every 3-6 months for first 3 years, then annually; annual mammography of remaining breast tissue; report new symptoms promptly"
    ],
    nursingActions: [
      "Perform and teach breast self-examination (BSE) technique: best performed 7-10 days after menstruation when breast tissue is least dense; use pads of three middle fingers in circular motion with light, medium, and deep pressure; cover entire breast, axilla, and supraclavicular area",
      "Monitor surgical site for complications: hematoma (swelling, discoloration), seroma (fluid collection), infection (redness, warmth, purulent drainage, fever), and wound dehiscence",
      "Manage surgical drains (Jackson-Pratt): measure and record output every 8-12 hours; empty when half full; report output greater than 30 mL in 8 hours or sudden change in color (bright red indicates bleeding)",
      "Monitor for lymphedema in the affected arm: measure arm circumference bilaterally at consistent landmarks; a difference of 2 cm or more indicates lymphedema development; educate patient on lifelong prevention measures",
      "Assess for chemotherapy side effects: monitor CBC for myelosuppression (nadir typically 7-14 days after treatment); report ANC below 1500 (neutropenia); teach infection prevention during nadir period",
      "Provide emotional support and body image counseling: breast cancer diagnosis and treatment significantly impact self-esteem, sexuality, and relationships; refer to support groups and counseling resources as needed",
      "Administer medications as ordered and monitor for adverse effects: check cardiac function before trastuzumab; assess for peripheral neuropathy with taxanes; monitor bone density with aromatase inhibitors"
    ],
    assessmentFindings: [
      "Painless, hard, fixed, irregularly shaped breast mass (most common initial presentation for invasive cancer); usually in upper outer quadrant (50% of cancers occur here due to highest concentration of breast tissue)",
      "Skin changes: dimpling (peau d'orange appearance from lymphatic obstruction), retraction, erythema, or thickening; nipple retraction, inversion, or bloody/serous nipple discharge",
      "Axillary lymphadenopathy: palpable, hard, fixed lymph nodes in the axilla suggest regional metastasis; ipsilateral supraclavicular nodes indicate advanced disease",
      "Inflammatory breast cancer (rare, aggressive): rapid onset of breast erythema, warmth, and edema with peau d'orange skin; breast appears infected but does not respond to antibiotics; requires urgent biopsy",
      "Paget disease of the nipple: eczema-like changes of the nipple and areola (crusting, scaling, erythema) that do not resolve with topical treatment; associated with underlying ductal carcinoma",
      "Bone pain (spine, pelvis, ribs), persistent cough or dyspnea, jaundice or right upper quadrant pain, headaches or neurological changes: may indicate metastatic disease to bone, lung, liver, or brain respectively",
      "Chemotherapy-related findings: alopecia (begins 2-3 weeks after first treatment), mucositis (oral ulceration), neutropenic fever (temperature 38.3 degrees or higher with ANC below 500)"
    ],
    signs: {
      left: [
        "Painless breast lump discovered on self-examination or mammography",
        "Mild breast asymmetry or subtle skin texture change",
        "Unilateral clear or serous nipple discharge",
        "Small, mobile axillary lymph node",
        "Fatigue and mild weight changes during treatment",
        "Mild erythema at radiation treatment site"
      ],
      right: [
        "Rapidly enlarging breast mass with skin fixation",
        "Peau d'orange skin changes with diffuse breast erythema (inflammatory breast cancer)",
        "Fixed, matted axillary or supraclavicular lymph nodes",
        "Bloody nipple discharge with palpable retroareolar mass",
        "Neutropenic fever (temperature above 38.3 with ANC below 500) during chemotherapy",
        "New bone pain, persistent cough, or neurological changes suggesting metastasis"
      ]
    },
    medications: [
      {
        name: "Tamoxifen (Nolvadex)",
        type: "Selective estrogen receptor modulator (SERM)",
        action: "Competitively binds to estrogen receptors on breast cancer cells, blocking estrogen from binding and activating estrogen-dependent gene transcription, thereby inhibiting estrogen-driven cell proliferation; acts as an estrogen antagonist in breast tissue but partial agonist in bone (protects against osteoporosis) and uterus (increases endometrial cancer risk)",
        sideEffects: "Hot flashes, vaginal dryness or discharge, mood changes, increased risk of endometrial cancer (2-7 fold), venous thromboembolism (DVT, pulmonary embolism), cataracts, weight gain",
        contra: "Pregnancy (teratogenic, Category D); history of deep vein thrombosis or pulmonary embolism; concurrent warfarin therapy (increased bleeding risk); known endometrial hyperplasia",
        pearl: "Standard duration is 5-10 years for ER+ breast cancer; primarily used in PREMENOPAUSAL women; annual gynecological examination required due to endometrial cancer risk; educate patients to report any abnormal vaginal bleeding immediately; effective contraception required during treatment and for 2 months after discontinuation"
      },
      {
        name: "Anastrozole (Arimidex)",
        type: "Aromatase inhibitor (non-steroidal)",
        action: "Selectively and reversibly inhibits the aromatase enzyme (cytochrome P450 enzyme CYP19) that converts androgens (androstenedione, testosterone) to estrogens (estrone, estradiol) in peripheral tissues (adipose, muscle, liver); reduces circulating estrogen levels by approximately 95-98% in postmenopausal women, depriving ER+ tumor cells of estrogen stimulation",
        sideEffects: "Arthralgia and myalgia (most common reason for discontinuation, affects up to 50% of patients), hot flashes, osteoporosis and increased fracture risk, hypercholesterolemia, vaginal dryness, headache, fatigue",
        contra: "Premenopausal women (ineffective because ovarian estrogen production is not aromatase-dependent); severe hepatic impairment; pregnancy (Category X); concurrent tamoxifen use (reduces efficacy of anastrozole)",
        pearl: "Used ONLY in POSTMENOPAUSAL women with ER+ breast cancer; baseline and annual bone density (DEXA) scans recommended due to osteoporosis risk; prescribe calcium and vitamin D supplementation; joint pain may be managed with exercise and NSAIDs; treatment duration is typically 5-10 years"
      },
      {
        name: "Trastuzumab (Herceptin)",
        type: "Monoclonal antibody / HER2-targeted therapy",
        action: "Recombinant humanized monoclonal antibody that binds to the extracellular domain of the HER2 protein receptor, preventing receptor dimerization and blocking downstream RAS-MAPK and PI3K-AKT signaling pathways; inhibits HER2-mediated cell proliferation; also recruits immune effector cells to HER2-overexpressing tumor cells via antibody-dependent cellular cytotoxicity (ADCC)",
        sideEffects: "Cardiotoxicity (reduced left ventricular ejection fraction, heart failure in 2-7% of patients, higher when combined with anthracyclines), infusion reactions (fever, chills, nausea, especially with first dose), diarrhea, fatigue, headache, rash",
        contra: "LVEF below 50% or clinically significant heart failure; concurrent anthracycline therapy during trastuzumab administration (sequential administration preferred to reduce cardiotoxicity); known hypersensitivity",
        pearl: "LVEF must be assessed by echocardiogram or MUGA scan at baseline and every 3 months during treatment; hold if LVEF drops more than 16% from baseline or falls below 50%; unlike anthracycline cardiotoxicity, trastuzumab-related cardiac dysfunction is often REVERSIBLE upon discontinuation; standard treatment duration is 1 year"
      }
    ],
    pearls: [
      "Breast self-examination should be performed 7-10 days after the onset of menstruation when breast tissue is least dense and tender; postmenopausal women should choose a consistent day each month; any new lump, dimpling, or nipple changes require prompt evaluation",
      "The upper outer quadrant of the breast contains the most breast tissue and the axillary tail of Spence -- approximately 50% of breast cancers are found in this location; always include axillary palpation in breast assessment",
      "Sentinel lymph node biopsy has largely replaced full axillary lymph node dissection for staging, reducing the risk of lymphedema from approximately 20-30% to 5-7%; if the sentinel node is negative, further node dissection is generally unnecessary",
      "Triple-negative breast cancer (ER-, PR-, HER2-) accounts for 10-15% of breast cancers, is more common in BRCA1 mutation carriers and African American women, and has limited treatment options because it does not respond to hormonal therapy or HER2-targeted therapy",
      "Tamoxifen is for PREMENOPAUSAL ER+ patients; aromatase inhibitors (anastrozole, letrozole, exemestane) are for POSTMENOPAUSAL ER+ patients -- this distinction is critical because aromatase inhibitors are ineffective when ovarian estrogen production is active",
      "After axillary surgery or radiation, lifelong precautions for the affected arm include: no blood pressure measurements, no venipunctures, no injections, avoid constricting jewelry or clothing, use sunscreen and insect repellent, and wear protective gloves for gardening",
      "Trastuzumab cardiotoxicity is typically REVERSIBLE (unlike anthracycline cardiotoxicity which causes permanent myocyte damage); LVEF monitoring every 3 months during treatment allows early detection and drug hold if cardiac function declines"
    ],
    quiz: [
      {
        question: "A practical nurse is teaching a 55-year-old postmenopausal patient with ER-positive breast cancer about her prescribed anastrozole. Which side effect is most important to monitor with this medication?",
        options: [
          "Increased risk of endometrial cancer",
          "Bone density loss and increased fracture risk",
          "Cardiotoxicity requiring echocardiogram monitoring",
          "Neutropenia requiring frequent blood counts"
        ],
        correct: 1,
        rationale: "Aromatase inhibitors such as anastrozole reduce estrogen levels by approximately 95-98%, which significantly accelerates bone loss and increases fracture risk. Baseline and annual DEXA scans are recommended with calcium and vitamin D supplementation. Endometrial cancer risk is associated with tamoxifen, not aromatase inhibitors. Cardiotoxicity monitoring is associated with trastuzumab."
      },
      {
        question: "A patient who had a left mastectomy with axillary lymph node dissection 3 months ago is admitted for an unrelated condition. The practical nurse needs to obtain a blood pressure reading and start an IV. Which action is correct?",
        options: [
          "Use the left arm for blood pressure and the right arm for IV access",
          "Use either arm since the surgery was 3 months ago",
          "Use the right arm for both blood pressure and IV access",
          "Use the left arm for IV access since veins are more accessible after surgery"
        ],
        correct: 2,
        rationale: "After axillary lymph node dissection, the affected arm (left) must be permanently protected from blood pressure measurements, venipunctures, IV access, and injections to prevent lymphedema. All procedures should be performed on the unaffected (right) arm. These precautions are lifelong, regardless of how much time has passed since surgery."
      },
      {
        question: "A practical nurse is assessing a patient and notices dimpling of the breast skin with an orange-peel texture. Which term correctly describes this finding and what does it suggest?",
        options: [
          "Peau d'orange; it suggests lymphatic obstruction and possible underlying malignancy",
          "Paget disease; it suggests nipple eczema",
          "Gynecomastia; it suggests hormonal imbalance",
          "Fibroadenoma; it suggests a benign breast condition"
        ],
        correct: 0,
        rationale: "Peau d'orange (French for 'orange peel skin') describes the dimpled, thickened skin appearance caused by lymphatic obstruction from tumor cells blocking dermal lymphatic drainage. This finding is associated with inflammatory breast cancer or locally advanced breast cancer and requires urgent evaluation. It is a significant clinical finding that the practical nurse must recognize and report immediately."
      }
    ]
  },

  "cancer-pain-management-rpn": {
    title: "Cancer Pain Management for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Cancer Pain and Nociceptive Mechanisms",
      content: "Cancer pain is a complex, multidimensional experience that affects 55-70% of patients undergoing active treatment and up to 90% of patients with advanced disease. Pain in cancer arises through several distinct pathophysiological mechanisms that often coexist in the same patient. Nociceptive pain results from activation of peripheral pain receptors (nociceptors) by tissue damage and can be somatic (arising from bone, muscle, skin, and connective tissue -- described as aching, throbbing, or pressure-like) or visceral (arising from internal organs -- described as deep, cramping, squeezing, or referred to distant sites). Neuropathic pain results from direct injury to peripheral or central nervous system structures by tumor invasion or compression of nerves, nerve plexuses, or the spinal cord; it is described as burning, shooting, tingling, or electric-shock-like sensations and often responds poorly to standard analgesics alone. Bone pain is the most common type of cancer pain, occurring when tumor cells metastasize to bone and activate osteoclast-mediated bone resorption through the RANK-RANKL pathway. The tumor microenvironment releases inflammatory mediators (prostaglandins, cytokines including TNF-alpha and interleukins, nerve growth factor) that sensitize peripheral nociceptors, lowering their activation threshold (peripheral sensitization). Repeated nociceptive input to the dorsal horn of the spinal cord leads to central sensitization, where neurons become hyperexcitable, amplifying pain signals through increased NMDA receptor activation and wind-up phenomenon. The World Health Organization (WHO) Pain Ladder provides a systematic framework for cancer pain management using three steps: Step 1 (mild pain, 1-3 on numeric rating scale) uses non-opioid analgesics (acetaminophen, NSAIDs) with or without adjuvants; Step 2 (moderate pain, 4-6) adds weak opioids (codeine, tramadol) or low-dose strong opioids; Step 3 (severe pain, 7-10) uses strong opioids (morphine, hydromorphone, fentanyl) with or without non-opioids and adjuvants. Breakthrough pain (BTP) is a transient exacerbation of pain that occurs despite adequate baseline (around-the-clock) analgesia, affecting 40-80% of cancer patients. BTP is classified as spontaneous (unpredictable), incident (triggered by activity, movement, or coughing), or end-of-dose failure (pain returning before the next scheduled dose). The breakthrough dose is typically calculated as 10-15% of the total 24-hour opioid dose, administered as an immediate-release formulation. Equianalgesic dosing is the concept of calculating equivalent doses when converting between different opioids or routes of administration; oral morphine 30 mg is the reference standard (equivalent to morphine 10 mg IV/SC, hydromorphone 6 mg oral, or oxycodone 20 mg oral). Understanding these conversion ratios is essential for safe opioid rotation."
    },
    riskFactors: [
      "Tumor type and location: bone metastases (most common source of cancer pain), nerve plexus invasion, visceral organ involvement, brain metastases with increased intracranial pressure",
      "Advanced stage disease: pain prevalence increases from 30-40% in early-stage cancer to 60-90% in advanced or metastatic disease",
      "Cancer treatment-related pain: post-surgical pain (mastectomy, thoracotomy), chemotherapy-induced peripheral neuropathy (vincristine, taxanes, platinum agents), radiation-induced mucositis or fibrosis",
      "History of substance use disorder: complicates pain management due to tolerance, risk of aberrant drug behaviors, and clinician reluctance to prescribe adequate opioids",
      "Psychological factors: depression, anxiety, catastrophizing, social isolation, and existential distress amplify pain perception through descending modulation pathways",
      "Inadequate pain assessment: patients who are cognitively impaired, nonverbal, pediatric, or from cultures that discourage reporting pain are at risk for under-treatment",
      "Opioid-induced hyperalgesia: paradoxical increase in pain sensitivity caused by chronic opioid use, mediated by NMDA receptor activation and glial cell sensitization"
    ],
    diagnostics: [
      "Numeric Rating Scale (NRS 0-10): most widely used unidimensional pain assessment; 0 = no pain, 10 = worst possible pain; document at baseline and after each intervention; target reduction of at least 30% indicates clinically meaningful improvement",
      "Wong-Baker FACES Pain Scale: uses facial expression images for patients who cannot use numeric scales (pediatric patients, cognitively impaired adults, language barriers)",
      "Brief Pain Inventory (BPI): multidimensional assessment tool measuring pain severity and interference with daily activities (mood, walking, sleep, work, relationships, enjoyment); used for comprehensive cancer pain evaluation",
      "Diagnostic imaging: bone scan (technetium-99m) for skeletal metastases; MRI for nerve compression, spinal cord involvement, or soft tissue masses; CT for visceral tumors and lymphadenopathy",
      "Laboratory studies: serum calcium (hypercalcemia from bone metastases causes pain and neurological symptoms); alkaline phosphatase (elevated with bone involvement); liver function tests (hepatic metastases); renal function (affects opioid metabolism and dosing)",
      "Nerve conduction studies and EMG: evaluate chemotherapy-induced peripheral neuropathy; help distinguish neuropathic from nociceptive pain components for targeted treatment"
    ],
    management: [
      "WHO Pain Ladder Step 1 (mild pain 1-3): acetaminophen 650-1000 mg every 4-6 hours (max 4 g/day, 2 g with liver disease) and/or NSAIDs (ibuprofen 400-800 mg every 6-8 hours) with adjuvants as needed",
      "WHO Pain Ladder Step 2 (moderate pain 4-6): add low-dose strong opioid (morphine 5-15 mg oral every 4 hours) or weak opioid (codeine, tramadol); continue non-opioid analgesics for additive effect",
      "WHO Pain Ladder Step 3 (severe pain 7-10): strong opioids (morphine, hydromorphone, oxycodone, fentanyl patch for stable chronic pain); titrate dose upward by 25-50% if pain is not controlled; no ceiling dose for strong opioids",
      "Around-the-clock (ATC) dosing: scheduled doses maintain consistent plasma levels; prevents pain recurrence; extended-release formulations (MS Contin, OxyContin) for basal pain control",
      "Breakthrough pain management: immediate-release opioid at 10-15% of total 24-hour dose; onset within 15-30 minutes for oral route; reassess if more than 3-4 breakthrough doses needed per day (indicates need to increase baseline dose)",
      "Adjuvant therapy: gabapentin or pregabalin for neuropathic pain; corticosteroids (dexamethasone) for bone pain, brain metastases, nerve compression, and appetite stimulation; bisphosphonates or denosumab for bone metastases",
      "Non-pharmacological interventions: positioning, heat/cold application, massage, relaxation techniques, guided imagery, music therapy, TENS unit; important complements to pharmacological management"
    ],
    nursingActions: [
      "Assess pain using a consistent, validated tool at every patient encounter: location, intensity (0-10), quality (sharp, burning, aching), onset, duration, aggravating and alleviating factors, and impact on function",
      "Administer analgesics on schedule (around-the-clock) rather than waiting for pain to become severe; document time of administration, dose, route, pain level before and 30-60 minutes after administration",
      "Monitor for opioid side effects: constipation (most common, does NOT develop tolerance -- prophylactic bowel regimen required), nausea/vomiting (usually resolves within 3-5 days), sedation (precedes respiratory depression), pruritus, urinary retention",
      "Assess respiratory status before and after opioid administration: hold opioid and notify physician if respiratory rate is below 12 breaths/minute or if patient is excessively sedated; keep naloxone (Narcan) accessible",
      "Implement a prophylactic bowel regimen for ALL patients receiving opioids: stimulant laxative (senna/bisacodyl) plus stool softener (docusate) scheduled daily; opioid-induced constipation does not resolve spontaneously and tolerance does not develop",
      "Educate patients and families about pain management goals: complete pain elimination may not be possible; realistic goal is to reduce pain to a tolerable level that allows function and sleep; address opioid myths (addiction vs. physical dependence vs. tolerance)",
      "Report uncontrolled pain (pain score persistently above 4 despite prescribed regimen) to the physician promptly; advocate for dose adjustment, opioid rotation, or addition of adjuvant medications"
    ],
    assessmentFindings: [
      "Somatic nociceptive pain: well-localized, described as aching, throbbing, or pressure; worsened by movement or palpation; common in bone metastases, post-surgical sites, and soft tissue invasion",
      "Visceral nociceptive pain: poorly localized, deep, cramping, or squeezing; may be referred to distant sites (e.g., diaphragmatic irritation referred to shoulder); common in hepatic, pancreatic, and peritoneal cancers",
      "Neuropathic pain: burning, shooting, electric-shock-like, tingling, or numbness along nerve distribution; allodynia (pain from normally non-painful stimulus); hyperalgesia (exaggerated response to painful stimulus); common with nerve compression or chemotherapy-induced neuropathy",
      "Behavioral pain indicators (non-verbal patients): facial grimacing, guarding, bracing, restlessness, agitation, moaning, withdrawal from touch, changes in appetite or sleep, tachycardia, diaphoresis",
      "Breakthrough pain episodes: sudden-onset, severe pain lasting 15-30 minutes on average; may be spontaneous or triggered by movement, coughing, or position changes; occurs despite adequate baseline analgesia",
      "Signs of opioid toxicity: pinpoint pupils (miosis), excessive sedation (Pasero Opioid Sedation Scale), respiratory depression (rate below 8), confusion, myoclonus (muscle jerking), hallucinations"
    ],
    signs: {
      left: [
        "Pain rated 1-3 on numeric rating scale, controlled with current regimen",
        "Mild constipation managed with bowel regimen",
        "Mild nausea that improves over 3-5 days of opioid therapy",
        "Fatigue and drowsiness in first 24-48 hours of opioid initiation",
        "Mild pruritus without rash",
        "Occasional breakthrough pain episodes (fewer than 3 per day)"
      ],
      right: [
        "Respiratory rate below 8 breaths/minute with excessive sedation (opioid overdose)",
        "Uncontrolled pain persistently rated 7-10 despite maximum prescribed regimen",
        "Myoclonus (involuntary muscle jerking) indicating opioid neurotoxicity",
        "Fecal impaction from unmanaged opioid-induced constipation",
        "Signs of spinal cord compression: new back pain, bilateral leg weakness, bowel/bladder dysfunction (oncological emergency)",
        "Sudden severe bone pain with inability to bear weight (pathological fracture)"
      ]
    },
    medications: [
      {
        name: "Morphine Sulfate (MS Contin, MSIR)",
        type: "Opioid agonist analgesic (mu-receptor agonist)",
        action: "Binds to mu-opioid receptors in the central nervous system (brain and spinal cord dorsal horn), activating descending inhibitory pain pathways and reducing the transmission and perception of pain signals; also reduces the emotional component of pain through limbic system modulation; available as immediate-release (MSIR, onset 15-30 minutes, duration 3-4 hours) and extended-release (MS Contin, duration 8-12 hours)",
        sideEffects: "Constipation (most common, tolerance does NOT develop), nausea and vomiting (tolerance usually develops within 3-5 days), sedation, respiratory depression, pruritus, urinary retention, miosis, histamine release causing hypotension and bronchospasm",
        contra: "Severe respiratory depression; acute or severe bronchial asthma in unmonitored settings; known or suspected GI obstruction (including paralytic ileus); concurrent MAO inhibitor use (within 14 days); hypersensitivity to morphine",
        pearl: "Morphine is the gold standard opioid for cancer pain and has NO ceiling dose for analgesia (unlike acetaminophen or NSAIDs); extended-release formulations must be swallowed whole, NEVER crushed or chewed (risk of fatal dose dumping); active metabolite morphine-6-glucuronide accumulates in renal failure causing prolonged sedation and respiratory depression -- use hydromorphone instead in renal impairment"
      },
      {
        name: "Gabapentin (Neurontin)",
        type: "Anticonvulsant / neuropathic pain adjuvant",
        action: "Binds to the alpha-2-delta subunit of voltage-gated calcium channels in the dorsal horn of the spinal cord, reducing calcium influx and inhibiting the release of excitatory neurotransmitters (glutamate, substance P, norepinephrine); reduces central sensitization and wind-up phenomenon in neuropathic pain; does NOT interact with GABA receptors despite its name",
        sideEffects: "Drowsiness and sedation (most common, usually improves with continued use), dizziness, ataxia, peripheral edema, weight gain, blurred vision; abrupt discontinuation may cause withdrawal seizures",
        contra: "Known hypersensitivity to gabapentin; use caution in renal impairment (dose reduction required, eliminated entirely by kidneys); concurrent use with CNS depressants (additive sedation); monitor for suicidal ideation (FDA black box warning for all anticonvulsants)",
        pearl: "Start low and titrate slowly (100-300 mg at bedtime, increase by 100-300 mg every 3-7 days) to minimize sedation; effective dose for neuropathic pain typically 900-3600 mg/day divided three times daily; particularly effective for chemotherapy-induced peripheral neuropathy; takes 1-2 weeks to reach full analgesic effect; must be tapered gradually to discontinue (never stop abruptly)"
      },
      {
        name: "Dexamethasone (Decadron)",
        type: "Corticosteroid / anti-inflammatory / adjuvant analgesic",
        action: "Potent synthetic glucocorticoid that suppresses inflammatory and immune responses by inhibiting phospholipase A2 (blocking prostaglandin and leukotriene synthesis), stabilizing cell membranes, reducing vascular permeability, and decreasing edema around tumors and nerves; 25-30 times more potent than cortisol with minimal mineralocorticoid activity; reduces peritumoral edema, thereby relieving compression of nerves, spinal cord, and brain structures",
        sideEffects: "Hyperglycemia (check blood glucose regularly, especially in diabetics), immunosuppression (increased infection risk), GI irritation and peptic ulcer risk (administer with food or PPI), insomnia, mood changes (euphoria, agitation, psychosis), muscle wasting, osteoporosis with prolonged use, adrenal suppression",
        contra: "Systemic fungal infections; live vaccines during therapy; active untreated infections; psychotic disorders (may worsen); diabetes (monitor closely and adjust insulin/oral hypoglycemics); use lowest effective dose for shortest duration possible",
        pearl: "Administer in the morning to mimic physiological cortisol rhythm and minimize insomnia; particularly effective as adjuvant for bone metastasis pain, brain metastases (reduces cerebral edema), spinal cord compression (emergency dose 10-16 mg IV bolus), and appetite stimulation in cachexia; taper gradually after prolonged use to prevent adrenal crisis (do NOT stop abruptly)"
      }
    ],
    pearls: [
      "The WHO Pain Ladder is a stepwise approach: Step 1 (non-opioids for mild pain), Step 2 (weak opioids or low-dose strong opioids for moderate pain), Step 3 (strong opioids for severe pain) -- each step may include adjuvant medications; the ladder can be entered at any step based on pain severity",
      "Opioid-induced constipation is the ONE opioid side effect for which tolerance NEVER develops; every patient on opioids must receive a prophylactic bowel regimen (stimulant laxative plus stool softener) from day one of opioid therapy",
      "Breakthrough pain dose calculation: the rescue dose should be 10-15% of the total 24-hour opioid dose given as an immediate-release formulation; if a patient is receiving 120 mg of oral morphine daily, the breakthrough dose would be 12-18 mg of immediate-release morphine",
      "When converting between opioids (opioid rotation), use equianalgesic tables and then reduce the calculated dose by 25-50% to account for incomplete cross-tolerance; this prevents overdose when switching to a new opioid",
      "Addiction (psychological craving and compulsive use despite harm) is rare in cancer patients receiving opioids for pain; physical DEPENDENCE (withdrawal symptoms if abruptly stopped) and TOLERANCE (need for higher doses over time) are expected physiological responses, not signs of addiction",
      "Morphine-6-glucuronide, the active metabolite of morphine, accumulates in renal impairment causing prolonged sedation and respiratory depression; hydromorphone or fentanyl are safer alternatives in patients with creatinine clearance below 30 mL/min",
      "Sedation assessment using the Pasero Opioid-Induced Sedation Scale (POSS) should precede respiratory rate counting: S = sleeping, easily aroused; 1 = awake and alert; 2 = slightly drowsy; 3 = frequently drowsy, arousable; 4 = somnolent, minimal response -- score of 3 or 4 requires holding opioid and notifying physician"
    ],
    quiz: [
      {
        question: "A cancer patient receiving morphine sulfate extended-release 60 mg every 12 hours reports sudden severe pain rated 8/10. An immediate-release morphine order is available for breakthrough pain. What is the appropriate breakthrough dose?",
        options: [
          "5-10 mg oral morphine",
          "12-18 mg oral morphine",
          "30 mg oral morphine",
          "60 mg oral morphine"
        ],
        correct: 1,
        rationale: "The breakthrough dose is calculated as 10-15% of the total 24-hour opioid dose. This patient receives 60 mg every 12 hours, totaling 120 mg per 24 hours. 10-15% of 120 mg equals 12-18 mg of immediate-release morphine. This provides effective pain relief while minimizing the risk of oversedation."
      },
      {
        question: "A practical nurse is caring for a patient who started on morphine for cancer pain 5 days ago. The patient reports no bowel movement for 4 days. Which nursing action is most appropriate?",
        options: [
          "Advise increased fluid intake and wait to see if the constipation resolves naturally",
          "Administer the prescribed stimulant laxative and notify the physician that a bowel regimen was not initiated when morphine was started",
          "Discontinue the morphine to resolve the constipation",
          "Request a dietary consult for increased fiber"
        ],
        correct: 1,
        rationale: "Opioid-induced constipation does not resolve spontaneously and tolerance does not develop. A prophylactic bowel regimen (stimulant laxative plus stool softener) should have been initiated when opioid therapy began. The practical nurse should administer the laxative and notify the physician that the bowel regimen needs to be addressed. Discontinuing pain medication is not appropriate, and fiber/fluids alone are insufficient for opioid-induced constipation."
      },
      {
        question: "A practical nurse notes that a cancer patient on opioid therapy has a sedation score of 3 (frequently drowsy, arousable) on the Pasero Opioid-Induced Sedation Scale and a respiratory rate of 10 breaths per minute. What is the priority action?",
        options: [
          "Document the findings and continue monitoring",
          "Administer the next scheduled opioid dose",
          "Hold the opioid dose, stimulate the patient, elevate the head of bed, and notify the physician immediately",
          "Administer naloxone 0.4 mg IV immediately"
        ],
        correct: 2,
        rationale: "A Pasero score of 3 with respiratory depression (rate below 12) indicates significant opioid-related sedation requiring immediate intervention. The priority actions are to hold the opioid, stimulate the patient, position for optimal ventilation, and notify the physician. Naloxone is reserved for severe respiratory depression (rate below 8) or unresponsiveness, as it reverses all analgesia and can precipitate severe pain and withdrawal."
      }
    ]
  },

  "ectopic-pregnancy-basics-rpn": {
    title: "Ectopic Pregnancy Basics for Practical Nurses",
    cellular: {
      title: "Pathophysiology and Cellular Mechanisms of Ectopic Pregnancy",
      content: "An ectopic pregnancy occurs when a fertilized ovum implants outside the uterine cavity. The most common site is the fallopian tube (approximately 95% of cases), specifically the ampullary segment (70%), followed by the isthmic segment (12%), fimbrial end (11%), and interstitial/cornual segment (2-3%). Less common implantation sites include the ovary (3%), cervix (less than 1%), cesarean section scar, and abdominal cavity (less than 1%). Under normal physiology, after fertilization in the ampulla of the fallopian tube, the zygote is propelled toward the uterine cavity by rhythmic contractions of the tubal smooth muscle (peristalsis) and the beating of ciliated epithelial cells lining the tubal lumen. This transport takes approximately 3-4 days, during which the zygote develops from a morula to a blastocyst. Ectopic implantation occurs when this transport mechanism is impaired, most commonly by damage to the tubal epithelium from prior infection (particularly Chlamydia trachomatis and Neisseria gonorrhoeae), previous tubal surgery, or anatomic abnormalities. Once implanted in the fallopian tube, the trophoblast cells of the developing embryo invade the tubal wall, which lacks the thick, distensible myometrium and specialized decidual response of the uterus. The tubal wall has only a thin layer of smooth muscle and limited blood supply compared to the endometrium. As the embryo grows, the expanding gestational sac stretches the tubal wall, causing ischemia and necrosis of the surrounding tissue. The trophoblast invasion erodes into tubal blood vessels, which initially may cause intermittent vaginal bleeding (often described as spotting or dark brown discharge, distinct from normal menstrual flow). Without intervention, the growing ectopic pregnancy will eventually rupture the fallopian tube, typically between 6-10 weeks of gestation. Tubal rupture results in hemorrhage into the peritoneal cavity (hemoperitoneum) that can be rapid and massive because the tubal arteries branch directly from the uterine artery system. Hemorrhage from a ruptured ectopic pregnancy can exceed 500-1500 mL within minutes, leading to hemorrhagic shock. Human chorionic gonadotropin (hCG) is produced by the trophoblast cells and is the primary hormone used for diagnostic monitoring. In a normal intrauterine pregnancy, serum beta-hCG levels double approximately every 48-72 hours during the first 8 weeks. In ectopic pregnancy, hCG levels typically rise more slowly (less than 53% increase in 48 hours) or plateau, reflecting impaired trophoblast growth. A discriminatory level of beta-hCG (typically 1500-2000 mIU/mL for transvaginal ultrasound) is the threshold above which a gestational sac should be visible in the uterus; absence of an intrauterine gestational sac above this level is highly suspicious for ectopic pregnancy. Cullen sign (periumbilical ecchymosis) indicates blood tracking along the falciform ligament to the umbilical area and suggests significant intraperitoneal hemorrhage from a ruptured ectopic pregnancy."
    },
    riskFactors: [
      "Previous ectopic pregnancy (recurrence rate 10-15% after one ectopic, 25-30% after two ectopics)",
      "History of pelvic inflammatory disease (PID), especially from Chlamydia trachomatis or Neisseria gonorrhoeae (damages tubal ciliated epithelium and causes adhesion formation)",
      "Previous tubal surgery: tubal ligation (sterilization), tubal reconstruction, or salpingostomy; altered tubal anatomy impedes ovum transport",
      "Assisted reproductive technology (IVF): despite uterine embryo transfer, ectopic implantation occurs in 2-5% of IVF pregnancies due to altered tubal motility from hormonal stimulation",
      "Intrauterine device (IUD) use: while IUDs prevent intrauterine pregnancy effectively, if pregnancy occurs with an IUD in place, there is a higher proportion of ectopic implantation (not higher absolute risk)",
      "Smoking: nicotine impairs tubal ciliary beat frequency and smooth muscle contractility, delaying ovum transport; dose-dependent risk increase",
      "Age over 35 years: age-related changes in tubal function and increased prevalence of tubal pathology; endometriosis (causes tubal adhesions and distortion)"
    ],
    diagnostics: [
      "Serum quantitative beta-hCG: serial measurements 48 hours apart are essential; normal intrauterine pregnancy shows at least 53% rise in 48 hours; abnormally slow rise, plateau, or decline suggests ectopic or nonviable pregnancy",
      "Transvaginal ultrasound (TVUS): first-line imaging; should visualize intrauterine gestational sac when beta-hCG exceeds discriminatory level (1500-2000 mIU/mL); absence of intrauterine pregnancy above this level is highly suspicious for ectopic; may visualize adnexal mass, free fluid, or extrauterine gestational sac",
      "Complete blood count (CBC): hemoglobin and hematocrit for baseline and to monitor for hemorrhage; WBC may be mildly elevated; type and crossmatch if rupture is suspected or surgery planned",
      "Blood type and Rh factor: critical for determining need for Rh immunoglobulin (RhoGAM) in Rh-negative patients to prevent alloimmunization from fetal-maternal hemorrhage",
      "Progesterone level: serum progesterone below 5 ng/mL suggests nonviable pregnancy (ectopic or miscarriage); above 20 ng/mL strongly suggests viable intrauterine pregnancy; levels between 5-20 ng/mL are indeterminate",
      "Culdocentesis (rarely performed now due to ultrasound availability): aspiration of fluid from posterior cul-de-sac; non-clotting blood indicates hemoperitoneum from ruptured ectopic; largely replaced by ultrasound and beta-hCG monitoring"
    ],
    management: [
      "Expectant management: appropriate ONLY for select patients with declining beta-hCG levels, low initial hCG (typically below 1000-1500 mIU/mL), no evidence of rupture, and reliable follow-up; serial hCG monitoring until level reaches zero",
      "Medical management with methotrexate: single-dose intramuscular injection for hemodynamically stable patients with unruptured ectopic, beta-hCG below 5000 mIU/mL (some protocols up to 10,000), no fetal cardiac activity, and ectopic mass less than 3.5 cm; monitor beta-hCG on days 4 and 7 (expect 15% decline between days 4-7)",
      "Surgical management: salpingostomy (linear incision to remove ectopic, preserves tube) or salpingectomy (tube removal); laparoscopic approach preferred when hemodynamically stable; emergent laparotomy for ruptured ectopic with hemodynamic instability",
      "Hemodynamic stabilization for ruptured ectopic: establish two large-bore IV lines (14-16 gauge), rapid crystalloid infusion (normal saline or lactated Ringer), type and crossmatch for blood products, prepare for emergency surgery",
      "Rh immunoglobulin (RhoGAM) administration: 50 mcg IM for ectopic pregnancy before 12 weeks gestation in Rh-negative patients; must be given within 72 hours of diagnosis/treatment to prevent alloimmunization",
      "Pain management: ketorolac or acetaminophen for mild-moderate pain; avoid NSAIDs if methotrexate is planned (may delay methotrexate clearance); opioids for severe pain as needed",
      "Emotional support: ectopic pregnancy represents a pregnancy loss requiring grief support; provide information about future fertility (intrauterine pregnancy rate 50-80% after one ectopic depending on treatment method and tubal status)"
    ],
    nursingActions: [
      "Monitor vital signs every 15 minutes if rupture is suspected or confirmed; tachycardia (heart rate above 100) and hypotension (systolic BP below 90 mmHg) are early signs of hemorrhagic shock; report immediately",
      "Assess for signs of tubal rupture: sudden severe unilateral lower abdominal pain (often described as tearing or stabbing), referred shoulder pain (diaphragmatic irritation from blood in peritoneum, Kehr sign), abdominal rigidity, rebound tenderness, and signs of shock",
      "Monitor serial beta-hCG levels as ordered and report results to the physician; document trending pattern (rising, plateauing, or declining) to guide management decisions",
      "For patients receiving methotrexate: educate about expected side effects (nausea, abdominal pain, stomatitis); instruct to avoid alcohol, folic acid supplements (antagonizes methotrexate), NSAIDs, and sexual intercourse until hCG reaches zero; reinforce reliable contraception for 3 months after treatment",
      "Assess vaginal bleeding: document color (bright red vs. dark brown), amount (number of pads saturated per hour), and presence of tissue or clots; report saturating more than 1 pad per hour or passing tissue",
      "Provide grief counseling and emotional support: validate the patient's feelings of loss; provide information about support groups and counseling resources; allow time for questions and expression of emotions",
      "Verify Rh status and administer Rh immunoglobulin (RhoGAM) as ordered for Rh-negative patients within 72 hours of ectopic pregnancy diagnosis or treatment to prevent hemolytic disease in future pregnancies"
    ],
    assessmentFindings: [
      "Classic triad (present in approximately 50% of cases): amenorrhea (missed menstrual period), unilateral lower abdominal or pelvic pain, and vaginal bleeding (typically light, dark brown or spotting, distinct from normal menses)",
      "Unilateral adnexal tenderness on palpation; palpable adnexal mass may be present (but absence does not exclude ectopic pregnancy)",
      "Cervical motion tenderness (Chandelier sign): severe pain elicited when the cervix is moved during bimanual examination; indicates peritoneal irritation and is a classic finding in ectopic pregnancy",
      "Signs of ruptured ectopic pregnancy: acute onset of severe, sharp lower abdominal pain; abdominal distension and rigidity; referred shoulder pain (Kehr sign from diaphragmatic irritation by blood); signs of hypovolemic shock (tachycardia, hypotension, pallor, diaphoresis, altered level of consciousness)",
      "Cullen sign: periumbilical ecchymosis (bluish-purple discoloration around the umbilicus) indicating retroperitoneal or intraperitoneal hemorrhage; a LATE sign suggesting significant blood loss",
      "Vaginal bleeding pattern: typically scant, dark brown or intermittent spotting (from decidual shedding due to inadequate progesterone support); heavy bright red bleeding is less common and may indicate rupture or concomitant miscarriage",
      "Orthostatic vital sign changes: drop in systolic blood pressure greater than 20 mmHg or increase in heart rate greater than 20 bpm when moving from supine to standing position, indicating significant intravascular volume depletion"
    ],
    signs: {
      left: [
        "Mild unilateral lower abdominal cramping or discomfort",
        "Light vaginal spotting (dark brown or pink)",
        "Missed or late menstrual period with positive pregnancy test",
        "Mild adnexal tenderness on examination",
        "Fatigue and breast tenderness (early pregnancy symptoms)",
        "Beta-hCG rising but slower than expected"
      ],
      right: [
        "Sudden severe unilateral abdominal or pelvic pain (tubal rupture)",
        "Referred shoulder pain (Kehr sign -- blood irritating the diaphragm)",
        "Signs of hemorrhagic shock: tachycardia, hypotension, pallor, diaphoresis, confusion",
        "Rigid, distended abdomen with rebound tenderness",
        "Cullen sign (periumbilical ecchymosis indicating hemoperitoneum)",
        "Syncope or near-syncope with orthostatic hypotension"
      ]
    },
    medications: [
      {
        name: "Methotrexate (Trexall)",
        type: "Antimetabolite / folic acid antagonist",
        action: "Inhibits dihydrofolate reductase (DHFR), the enzyme that converts dihydrofolate to tetrahydrofolate, which is essential for thymidylate and purine synthesis; this blocks DNA synthesis and cell division in rapidly dividing trophoblast cells of the ectopic pregnancy, causing dissolution of the ectopic tissue; single-dose protocol: 50 mg/m2 IM based on body surface area",
        sideEffects: "Nausea, vomiting, stomatitis (oral mucositis), abdominal pain and cramping (expected as ectopic tissue resolves -- may be confused with rupture), transient elevation in beta-hCG between days 1-4 (normal response), bone marrow suppression (monitor CBC), hepatotoxicity (monitor liver function), photosensitivity",
        contra: "Hemodynamically unstable patient (requires surgical management); hepatic or renal disease (methotrexate is renally cleared and hepatotoxic); immunodeficiency or active infection; breastfeeding; pulmonary disease; peptic ulcer disease; blood dyscrasias (low WBC or platelets); concurrent folic acid supplementation (directly antagonizes methotrexate's mechanism)",
        pearl: "Patients must STOP folic acid and prenatal vitamins before methotrexate administration (folate antagonizes the drug's effect); a transient rise in beta-hCG between days 1-4 is EXPECTED and does not indicate treatment failure; true treatment success is assessed by at least 15% decline in beta-hCG between days 4 and 7; patients should avoid alcohol, NSAIDs, and sun exposure during treatment; reliable contraception is required for at least 3 months after treatment"
      },
      {
        name: "Rh Immunoglobulin (RhoGAM)",
        type: "Immune globulin / anti-D immunoglobulin",
        action: "Contains concentrated anti-D (anti-Rh) antibodies that bind to and destroy any fetal Rh-positive red blood cells that have entered the Rh-negative mother's circulation during the ectopic pregnancy or its treatment; this prevents the mother's immune system from recognizing and developing antibodies against the D antigen (alloimmunization), which would cause hemolytic disease of the fetus and newborn (HDFN) in future Rh-positive pregnancies",
        sideEffects: "Injection site pain and swelling, low-grade fever, myalgia, headache, mild hemolytic reaction (rare), allergic reaction (rare; contains human plasma proteins)",
        contra: "Rh-positive patients (only indicated for Rh-negative mothers); known hypersensitivity to human immunoglobulin products; IgA deficiency with anti-IgA antibodies (risk of anaphylaxis)",
        pearl: "Must be administered within 72 hours of any sensitizing event (ectopic pregnancy, miscarriage, amniocentesis, trauma) to prevent alloimmunization; dose for first trimester events is 50 mcg IM (versus 300 mcg for events after 12 weeks gestation); always verify Rh status before administration; a Kleihauer-Betke test may be ordered if large fetal-maternal hemorrhage is suspected to determine if additional doses are needed"
      },
      {
        name: "Ketorolac (Toradol)",
        type: "Nonsteroidal anti-inflammatory drug (NSAID)",
        action: "Inhibits cyclooxygenase-1 and cyclooxygenase-2 enzymes, blocking the synthesis of prostaglandins at the site of tissue injury and inflammation; prostaglandins sensitize nociceptors and amplify pain signals; by reducing prostaglandin production, ketorolac provides potent analgesic, anti-inflammatory, and antipyretic effects through both peripheral and central mechanisms",
        sideEffects: "GI bleeding and ulceration, renal impairment (decreased renal blood flow from prostaglandin inhibition), platelet dysfunction and increased bleeding time, nausea, headache, dizziness, injection site pain with IM administration",
        contra: "Active GI bleeding or peptic ulcer disease; renal impairment; concurrent use with anticoagulants; concurrent methotrexate therapy (NSAIDs decrease renal clearance of methotrexate, increasing toxicity risk); perioperative CABG surgery; third trimester pregnancy",
        pearl: "Maximum treatment duration is 5 days (all routes combined) due to increased GI and renal adverse effects with prolonged use; in ectopic pregnancy management, ketorolac should be AVOIDED if methotrexate treatment is planned or ongoing because NSAIDs impair renal excretion of methotrexate and increase its toxicity; use acetaminophen as an alternative analgesic when methotrexate is part of the treatment plan"
      }
    ],
    pearls: [
      "The classic triad of ectopic pregnancy (amenorrhea, unilateral pelvic pain, and vaginal bleeding) is present in only approximately 50% of cases; maintain a high index of suspicion in any reproductive-age female presenting with abdominal pain and a positive pregnancy test",
      "Serial beta-hCG monitoring is critical: normal intrauterine pregnancy doubles hCG approximately every 48-72 hours; a rise of less than 53% in 48 hours suggests ectopic or nonviable pregnancy; a single hCG value cannot differentiate between intrauterine and ectopic pregnancy",
      "Referred shoulder pain (Kehr sign) in a pregnant patient with abdominal pain is an ominous finding indicating diaphragmatic irritation from blood in the peritoneal cavity and suggests ruptured ectopic pregnancy -- this requires immediate surgical intervention",
      "Cullen sign (periumbilical ecchymosis) indicates significant intraperitoneal or retroperitoneal hemorrhage; in the context of early pregnancy, this is highly suggestive of ruptured ectopic pregnancy and represents a surgical emergency",
      "Methotrexate therapy requires specific patient education: stop folic acid and prenatal vitamins (they antagonize the drug), avoid alcohol (hepatotoxicity risk), avoid NSAIDs (impair methotrexate clearance), use reliable contraception for 3 months after treatment, and expect transient hCG rise between days 1-4",
      "Rh-negative patients experiencing ectopic pregnancy must receive Rh immunoglobulin (RhoGAM) within 72 hours to prevent alloimmunization; the dose for first-trimester events is 50 mcg IM (smaller than the standard 300 mcg dose used after 12 weeks)",
      "After treatment for ectopic pregnancy, future fertility counseling is essential: approximately 60-70% of patients achieve intrauterine pregnancy, but the recurrence risk is 10-15% after one ectopic; early ultrasound confirmation of intrauterine pregnancy location is recommended in all subsequent pregnancies"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient diagnosed with an unruptured ectopic pregnancy who is receiving methotrexate. The patient asks if she should continue taking her prenatal vitamins. What is the correct response?",
        options: [
          "Yes, prenatal vitamins support the health of both you and the pregnancy",
          "No, you must stop all folic acid-containing supplements because they interfere with how methotrexate works to treat the ectopic pregnancy",
          "You can continue the vitamins but skip the folic acid component",
          "Prenatal vitamins have no interaction with methotrexate"
        ],
        correct: 1,
        rationale: "Methotrexate works by inhibiting dihydrofolate reductase, blocking folic acid metabolism essential for DNA synthesis in rapidly dividing trophoblast cells. Folic acid supplementation (found in prenatal vitamins) directly antagonizes this mechanism and can cause treatment failure. All folic acid-containing supplements must be discontinued before and during methotrexate therapy."
      },
      {
        question: "A patient at 7 weeks gestation presents with sudden severe right-sided lower abdominal pain and right shoulder pain. Her blood pressure is 88/52 mmHg and heart rate is 124 bpm. The pregnancy test is positive. Which condition should the practical nurse suspect?",
        options: [
          "Appendicitis with referred pain",
          "Ruptured ectopic pregnancy with hemoperitoneum",
          "Normal round ligament pain of pregnancy",
          "Urinary tract infection with flank pain"
        ],
        correct: 1,
        rationale: "The combination of sudden severe unilateral pelvic pain, referred shoulder pain (Kehr sign from diaphragmatic irritation by intraperitoneal blood), positive pregnancy test, and signs of hemorrhagic shock (hypotension, tachycardia) is classic for ruptured ectopic pregnancy. This is a surgical emergency requiring immediate intervention. Round ligament pain does not cause hemodynamic instability."
      },
      {
        question: "A patient with a confirmed ectopic pregnancy is Rh-negative. Her partner is Rh-positive. Which medication must the practical nurse ensure is administered within 72 hours?",
        options: [
          "Methotrexate 50 mg/m2 intramuscularly",
          "Oxytocin to prevent uterine hemorrhage",
          "Rh immunoglobulin (RhoGAM) 50 mcg intramuscularly",
          "Misoprostol to promote tissue expulsion"
        ],
        correct: 2,
        rationale: "An Rh-negative mother experiencing any pregnancy event (including ectopic pregnancy) where fetal-maternal blood mixing may occur must receive Rh immunoglobulin (RhoGAM) within 72 hours to prevent alloimmunization. The dose for first-trimester events is 50 mcg IM. Without RhoGAM, the mother may develop anti-D antibodies that would attack Rh-positive red blood cells in future pregnancies, causing hemolytic disease of the fetus and newborn."
      }
    ]
  }
};

let injected = 0;
let skipped = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) injected++;
  else skipped++;
}
console.log(`\nDone: ${injected} injected, ${skipped} skipped`);
