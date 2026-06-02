import crypto from "crypto";
import pg from "pg";

const pool = new pg.Pool({
  host: process.env.PGHOST || "helium",
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "password",
  database: process.env.PGDATABASE || "heliumdb",
  ssl: false,
});

function stemHash(text: string): string {
  return crypto.createHash("sha256").update(text.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ")).digest("hex").substring(0, 16);
}

interface Q {
  tier: string;
  exam: string;
  questionType: string;
  stem: string;
  options: { label: string; text: string }[];
  correctAnswer: string[];
  rationale: string;
  difficulty: number;
  tags: string[];
  topic: string;
  subtopic: string;
  regionScope: string;
  scenario: string;
  clinicalPearl: string;
  examStrategy: string;
  clinicalTrap: string;
  distractorRationales: Record<string, string>;
  bodySystem: string;
}

function q(tier: string, exam: string, regionScope: string, topic: string, subtopic: string, bodySystem: string, questionType: string, difficulty: number, stem: string, options: { label: string; text: string }[], correctAnswer: string[], rationale: string, clinicalPearl: string, examStrategy: string, clinicalTrap: string, distractorRationales: Record<string, string>, tags: string[]): Q {
  return { tier, exam, questionType, stem, options, correctAnswer, rationale, difficulty, tags, topic, subtopic, regionScope, scenario: stem.substring(0, 120), clinicalPearl, examStrategy, clinicalTrap, distractorRationales, bodySystem };
}

function buildAllQuestions(): Q[] {
  const questions: Q[] = [];

  const rpnCA = (topic: string, sub: string, bs: string, qt: string, diff: number, stem: string, opts: {label:string;text:string}[], ca: string[], rat: string, cp: string, es: string, ct: string, dr: Record<string,string>, tags: string[]) =>
    q("rpn", "REx-PN", "CA", topic, sub, bs, qt, diff, stem, opts, ca, rat, cp, es, ct, dr, tags);

  const rpnUS = (topic: string, sub: string, bs: string, qt: string, diff: number, stem: string, opts: {label:string;text:string}[], ca: string[], rat: string, cp: string, es: string, ct: string, dr: Record<string,string>, tags: string[]) =>
    q("rpn", "NCLEX-PN", "US", topic, sub, bs, qt, diff, stem, opts, ca, rat, cp, es, ct, dr, tags);

  const rnBOTH = (topic: string, sub: string, bs: string, qt: string, diff: number, stem: string, opts: {label:string;text:string}[], ca: string[], rat: string, cp: string, es: string, ct: string, dr: Record<string,string>, tags: string[]) =>
    q("rn", "NCLEX-RN", "BOTH", topic, sub, bs, qt, diff, stem, opts, ca, rat, cp, es, ct, dr, tags);

  const O = (l: string, t: string) => ({ label: l, text: t });

  // =============== REx-PN QUESTIONS (Canadian Context) ===============

  // --- Infection Control ---
  questions.push(rpnCA("Infection Control", "Chain of Infection", "Safe & Effective Care Environment", "MCQ", 2,
    "An RPN is teaching a patient about preventing the spread of infection. Which component of the chain of infection does hand hygiene primarily target?",
    [O("A","Infectious agent"), O("B","Portal of exit"), O("C","Mode of transmission"), O("D","Susceptible host")],
    ["C"],
    "Hand hygiene is the single most effective intervention to break the chain of infection by targeting the mode of transmission. The chain of infection has six links: infectious agent, reservoir, portal of exit, mode of transmission, portal of entry, and susceptible host. By performing proper hand hygiene, healthcare workers prevent the transfer of microorganisms from contaminated surfaces or patients to new hosts via contact transmission. The Public Health Agency of Canada (PHAC) recommends alcohol-based hand rub as the preferred method when hands are not visibly soiled, and soap and water when hands are visibly contaminated. Breaking any link in the chain prevents infection transmission, but targeting the mode of transmission through hand hygiene is the most practical and widely applicable intervention in clinical settings.",
    "Hand hygiene targets the MODE OF TRANSMISSION link in the chain of infection, making it the most effective single intervention for preventing healthcare-associated infections",
    "Chain of infection questions ask which link is being targeted; identify the intervention and match it to the correct link",
    "Hand hygiene does not kill all organisms (infectious agent); it prevents their TRANSMISSION from one person/surface to another",
    { A: "Killing the infectious agent requires sterilization or antimicrobial treatment, not hand hygiene alone", B: "Portal of exit refers to how organisms leave the reservoir (coughing, wound drainage), not addressed by hand hygiene", D: "Strengthening the susceptible host involves immunization and nutrition, not hand hygiene" },
    ["infection-control", "chain-of-infection", "hand-hygiene", "prevention"]
  ));

  questions.push(rpnCA("Infection Control", "Surgical Asepsis", "Safe & Effective Care Environment", "MCQ", 3,
    "An RPN is setting up a sterile field for a urinary catheter insertion. Which action would contaminate the sterile field?",
    [O("A","Opening the sterile package away from the body, opening the flap furthest away first"), O("B","Placing sterile items in the centre of the sterile field using sterile forceps"), O("C","Reaching across the sterile field to grab an item on the opposite side"), O("D","Keeping sterile items above waist level and within line of sight")],
    ["C"],
    "Reaching across a sterile field is a critical contamination error because the nurse's arm and clothing are not sterile and would pass over the sterile surface, potentially dropping microorganisms onto the field. The principles of surgical asepsis include: (1) only sterile items can be placed on a sterile field, (2) a sterile barrier that has been penetrated is contaminated, (3) sterile fields must be kept in view at all times, (4) items below waist level are considered contaminated, (5) the edges of a sterile wrapper (2.5 cm border) are considered non-sterile, (6) if in doubt about sterility, consider the item contaminated. When items need to be placed on the far side of the sterile field, the nurse should walk around the table rather than reaching across. Opening sterile packages correctly (away from body, far flap first) maintains sterility. Using sterile forceps to place items prevents contamination. Keeping items above waist level and within sight ensures ongoing sterility monitoring.",
    "Never reach ACROSS a sterile field; walk around to the other side; if you break sterile technique, start over with new supplies",
    "Sterile field contamination questions: look for reaching across, turning away, touching edges, dropping below waist level, or wet-through",
    "The 2.5 cm border of a sterile drape is NON-sterile; items placed on this border are contaminated even though the drape is sterile",
    { A: "Opening away from the body with the far flap first is the correct technique that prevents contamination", B: "Using sterile forceps to place items is appropriate sterile technique", D: "Keeping items above waist level and within sight maintains the integrity of the sterile field" },
    ["infection-control", "sterile-technique", "surgical-asepsis", "urinary-catheter"]
  ));

  questions.push(rpnCA("Infection Control", "Personal Protective Equipment", "Safe & Effective Care Environment", "MCQ", 2,
    "An RPN is preparing to enter a patient's room who is on contact precautions for Clostridioides difficile (C. diff) infection. Which PPE sequence is correct for donning?",
    [O("A","Gloves first, then gown, then mask"), O("B","Gown first, then gloves"), O("C","Gloves first, then gown"), O("D","Mask first, then gown, then gloves")],
    ["B"],
    "For contact precautions, the correct donning sequence is gown first, then gloves. The gown is applied first to cover clothing and provide a barrier against contamination. Gloves are applied second and should extend over the cuffs of the gown to ensure no skin is exposed. For C. difficile specifically, additional considerations apply: (1) alcohol-based hand rub is NOT effective against C. diff spores - soap and water must be used for hand hygiene, (2) the patient should ideally be in a private room with dedicated equipment, (3) environmental cleaning with sporicidal agents (bleach-based solutions) is required. The doffing sequence is equally important and reverses the process: gloves are removed first (most contaminated item), followed by hand hygiene, then gown removal, followed by hand hygiene again. Proper PPE use prevents healthcare worker contamination and cross-transmission between patients.",
    "C. diff requires SOAP AND WATER for hand hygiene, not alcohol-based hand rub; alcohol does not kill C. diff spores",
    "Contact precautions donning: gown then gloves; doffing: gloves then gown; for C. diff always use soap and water",
    "Alcohol-based hand rub does NOT kill C. difficile spores; this is the most commonly tested exception to the ABHR preference",
    { A: "Gloves should not be applied before the gown; the gown must be in place first so gloves can overlap the cuffs", C: "Same as A - gown goes on before gloves to ensure proper coverage", D: "A mask is not required for standard contact precautions unless combined with droplet precautions" },
    ["infection-control", "PPE", "C-diff", "contact-precautions", "donning-doffing"]
  ));

  // --- Medication Administration ---
  questions.push(rpnCA("Medication Administration", "Medication Rights", "Safe & Effective Care Environment", "MCQ", 2,
    "An RPN is preparing to administer a medication. Which action best demonstrates adherence to the rights of medication administration?",
    [O("A","Checking the medication against the MAR once before administration"), O("B","Performing three checks: when retrieving, when preparing, and when administering the medication"), O("C","Relying on the pharmacy label without cross-referencing the MAR"), O("D","Administering the medication based on verbal order without documentation")],
    ["B"],
    "The standard of safe medication administration requires three checks of the medication against the Medication Administration Record (MAR): (1) when retrieving the medication from storage, (2) when preparing/pouring the medication, and (3) at the patient's bedside before administration. This triple-check system minimizes the risk of administering the wrong medication, wrong dose, or wrong formulation. In Canadian practice, the '10 Rights' of medication administration include: right patient, right medication, right dose, right route, right time, right documentation, right reason, right response, right to refuse, and right education. Simply checking once (option A) does not meet the standard. Relying solely on the pharmacy label (option C) without cross-referencing the MAR fails to catch transcription errors or changes to orders. Verbal orders (option D) should only be accepted in emergency situations and must be read back, verified, and documented immediately with a co-signature within a specified timeframe per facility policy.",
    "Perform THREE checks: at retrieval, at preparation, and at bedside; this triple-check system catches errors at multiple points",
    "Medication rights questions: the answer that includes the MOST safety checks is usually correct; three checks is the standard",
    "One check is NOT sufficient; errors can occur at any stage and the triple-check catches what a single check might miss",
    { A: "One check does not meet the standard of practice; three checks are required to minimize medication errors", C: "Pharmacy labels can contain errors; cross-referencing with the MAR is essential for safety", D: "Verbal orders require read-back verification and immediate documentation; routine medications should have written orders" },
    ["medication-administration", "medication-rights", "patient-safety", "three-checks"]
  ));

  questions.push(rpnCA("Medication Administration", "Subcutaneous Injection", "Physiological Integrity", "MCQ", 2,
    "An RPN is administering a subcutaneous injection of enoxaparin (Lovenox) to a patient for DVT prophylaxis. Which technique is correct?",
    [O("A","Inject at a 90-degree angle into the deltoid muscle, aspirating before injection"), O("B","Inject at a 45-90 degree angle into the abdominal fatty tissue, 5 cm from the umbilicus, without aspirating"), O("C","Inject at a 15-degree angle into the forearm using a Z-track method"), O("D","Inject at a 90-degree angle into the vastus lateralis after massaging the site")],
    ["B"],
    "Enoxaparin (Lovenox) is a low molecular weight heparin (LMWH) administered subcutaneously for DVT prophylaxis and treatment. The correct technique includes: (1) inject into the fatty tissue of the abdomen, at least 5 cm (2 inches) from the umbilicus, avoiding the area around the belly button, (2) angle of insertion is 45-90 degrees depending on the amount of subcutaneous tissue, (3) do NOT aspirate before injection - aspiration with subcutaneous heparin products can cause bruising and is no longer recommended by current evidence-based guidelines, (4) do NOT rub or massage the injection site after administration as this increases bruising and can alter the absorption rate, (5) use the air lock technique by not expelling the air bubble in the pre-filled syringe. The deltoid (option A) is an intramuscular site, not subcutaneous. A 15-degree angle (option C) is used for intradermal injections. Z-track is an IM technique. Massaging the site (option D) after heparin injection increases bruising and hematoma formation.",
    "Enoxaparin subcutaneous injection: abdomen, 5 cm from umbilicus, do NOT aspirate, do NOT massage; leave the air bubble in the pre-filled syringe",
    "For subcutaneous heparin/LMWH: no aspiration, no massage, abdomen preferred; these three rules are frequently tested",
    "DO NOT massage the site after heparin injection; massaging increases bruising and hematoma risk",
    { A: "Deltoid is an intramuscular site; enoxaparin requires subcutaneous injection into fatty tissue", C: "15-degree angle is for intradermal injections; Z-track is an intramuscular technique not used for subcutaneous injections", D: "Massaging after heparin injection increases bruising; the vastus lateralis is an IM site" },
    ["medication-administration", "subcutaneous-injection", "enoxaparin", "DVT-prophylaxis", "anticoagulation"]
  ));

  questions.push(rpnCA("Medication Administration", "IV Medication Safety", "Physiological Integrity", "MCQ", 3,
    "An RPN is monitoring a patient receiving IV vancomycin 1 g over 60 minutes. Twenty minutes into the infusion, the patient develops facial flushing, pruritus on the neck and chest, and a decrease in blood pressure. What is the nurse's priority action?",
    [O("A","Increase the infusion rate to complete the dose faster"), O("B","Stop the infusion immediately, maintain IV access, and notify the physician"), O("C","Continue the infusion and administer diphenhydramine"), O("D","Apply warm compresses to the flushed areas")],
    ["B"],
    "This patient is experiencing 'Red Man Syndrome' (vancomycin flushing syndrome), a histamine-mediated reaction that occurs when vancomycin is infused too rapidly. It is characterized by erythema (flushing) of the face, neck, and upper trunk, pruritus, and potentially hypotension. While Red Man Syndrome is not a true allergic reaction (it is a non-immune-mediated histamine release), it requires immediate intervention because the hypotension can be significant. The priority action is to STOP the infusion immediately while maintaining IV access for potential emergency medications. After stopping the infusion, the nurse should notify the physician, who may order diphenhydramine (an antihistamine) and a slower infusion rate when restarting. Vancomycin should be infused over at least 60 minutes per gram (some protocols recommend slower rates of at least 100 minutes for 1 g). Increasing the rate (option A) would worsen the histamine release. Continuing the infusion while treating symptoms (option C) does not address the cause. Warm compresses (option D) do not address the systemic reaction.",
    "Red Man Syndrome = too-rapid vancomycin infusion; stop the infusion, give antihistamine, restart at a slower rate; it is NOT a true allergy",
    "Vancomycin flushing reaction: stop infusion first, then notify and treat; differentiate Red Man Syndrome (rate-related) from true anaphylaxis",
    "Red Man Syndrome is NOT a true allergy and does NOT contraindicate future vancomycin use; it is managed by slowing the infusion rate",
    { A: "Increasing the rate would worsen histamine release and could cause cardiovascular collapse", C: "Continuing the infusion while giving diphenhydramine does not address the rate-dependent cause of the reaction", D: "Warm compresses do not address the systemic histamine release; the infusion must be stopped first" },
    ["medication-administration", "vancomycin", "red-man-syndrome", "IV-safety", "adverse-reaction"]
  ));

  // --- Patient Safety ---
  questions.push(rpnCA("Patient Safety", "Restraint Alternatives", "Safe & Effective Care Environment", "MCQ", 3,
    "An RPN is caring for an agitated patient with dementia who keeps trying to remove their NG tube. Before considering restraints, which alternative intervention should the RPN try FIRST?",
    [O("A","Apply bilateral wrist restraints immediately to prevent tube removal"), O("B","Use therapeutic communication, redirection, mittens, or camouflaging the tube before resorting to restraints"), O("C","Sedate the patient with PRN lorazepam to keep them calm"), O("D","Place the patient in a locked room for their safety")],
    ["B"],
    "Restraints should always be considered a LAST resort after less restrictive alternatives have been exhausted. The College of Nurses of Ontario (CNO) and Canadian patient safety guidelines emphasize that restraint alternatives must be tried first. Effective alternatives for patients attempting to remove medical devices include: (1) THERAPEUTIC COMMUNICATION - speaking calmly, reorienting the patient, explaining the purpose of the tube, (2) REDIRECTION - engaging the patient in activities or conversation to divert attention from the tube, (3) MITTENS or hand covers - padded mittens prevent the patient from grasping the tube while allowing hand movement, (4) CAMOUFLAGING the tube - securing the tube under clothing or dressings so it is less visible and accessible, (5) Maintaining the patient's comfort - addressing pain, positioning, and environmental factors that may increase agitation. If all alternatives fail and the patient is at risk of serious harm, restraints may be considered with a physician's order, but must be applied for the shortest duration possible with frequent reassessment (every 1-2 hours). Immediate restraint application (option A) bypasses required alternatives. Sedation (option C) has its own risks including respiratory depression and falls. Seclusion (option D) is not appropriate for medical patients.",
    "Always try less restrictive alternatives FIRST: communication, redirection, mittens, camouflaging devices; restraints are LAST resort",
    "Restraint questions almost always have 'try alternatives first' as the correct answer; immediate restraint application is rarely correct",
    "Restraints are associated with increased agitation, pressure injuries, strangulation risk, and loss of dignity; they are not a benign intervention",
    { A: "Immediate restraint application violates the principle of least restraint; alternatives must be tried first", C: "Sedation carries significant risks including respiratory depression and does not address the underlying cause of agitation", D: "Seclusion is not appropriate for confused medical patients and does not prevent tube removal" },
    ["patient-safety", "restraints", "alternatives", "dementia", "NG-tube"]
  ));

  // --- Fluid & Electrolytes ---
  questions.push(rpnCA("Fluid & Electrolytes", "Hyponatremia", "Physiological Integrity", "MCQ", 3,
    "An RPN reviews laboratory results for a patient admitted with SIADH (syndrome of inappropriate antidiuretic hormone). The serum sodium is 122 mmol/L (normal: 135-145 mmol/L). Which clinical manifestation should the RPN anticipate?",
    [O("A","Excessive thirst and dry mucous membranes"), O("B","Confusion, headache, and potential seizures due to cerebral edema"), O("C","Peaked T waves and muscle weakness"), O("D","Polyuria with dilute urine")],
    ["B"],
    "SIADH causes the kidneys to retain excess water, diluting the serum sodium concentration (dilutional hyponatremia). With a serum sodium of 122 mmol/L (severely hyponatremic), the low extracellular sodium creates an osmotic gradient that draws water into cells, including brain cells. This cellular swelling (cerebral edema) is responsible for the neurological symptoms: headache, confusion, lethargy, nausea, and potentially seizures and coma if sodium drops below 120 mmol/L. The RPN should monitor neurological status closely, implement seizure precautions, enforce fluid restriction (the primary treatment for SIADH), and report findings immediately. Excessive thirst and dry mucous membranes (option A) are signs of hypernatremia (high sodium) or dehydration, the opposite condition. Peaked T waves (option C) are associated with hyperkalemia, not hyponatremia. Polyuria with dilute urine (option D) is seen in diabetes insipidus, which causes hypernatremia; SIADH causes concentrated urine with low output.",
    "SIADH = too much ADH = water retention = dilutional hyponatremia; neurological symptoms occur because water shifts into brain cells causing cerebral edema",
    "Hyponatremia symptoms are primarily neurological (confusion, seizures); hypernatremia symptoms are primarily related to dehydration (thirst, dry mucous membranes)",
    "Do not confuse SIADH (too much ADH = water retention = low sodium) with diabetes insipidus (too little ADH = water loss = high sodium)",
    { A: "Excessive thirst and dry membranes indicate hypernatremia or dehydration, not the dilutional hyponatremia of SIADH", C: "Peaked T waves are the hallmark of hyperkalemia, not hyponatremia", D: "Polyuria with dilute urine characterizes diabetes insipidus (ADH deficiency), the opposite of SIADH" },
    ["fluid-electrolytes", "hyponatremia", "SIADH", "neurological", "seizure-precautions"]
  ));

  questions.push(rpnCA("Fluid & Electrolytes", "Hypocalcemia", "Physiological Integrity", "MCQ", 3,
    "An RPN is caring for a patient 24 hours after a total thyroidectomy. The patient reports tingling around the mouth and numbness in the fingertips. The nurse taps on the facial nerve anterior to the ear, and the facial muscles on that side contract. What does this assessment finding indicate?",
    [O("A","Normal cranial nerve VII function"), O("B","Positive Chvostek sign indicating hypocalcemia from inadvertent parathyroid removal"), O("C","Positive Trousseau sign indicating hyperkalemia"), O("D","Bell palsy requiring immediate neurological consultation")],
    ["B"],
    "This is a positive Chvostek sign, a clinical indicator of hypocalcemia. After thyroidectomy, the parathyroid glands (which regulate calcium homeostasis) may be inadvertently damaged or removed, leading to hypoparathyroidism and subsequent hypocalcemia. The Chvostek sign is elicited by tapping on the facial nerve (cranial nerve VII) just anterior to the ear (over the zygomatic arch). A positive result is ipsilateral facial muscle twitching or contraction, indicating neuromuscular irritability from low calcium levels. The patient's symptoms of perioral tingling and fingertip numbness are early signs of hypocalcemia. Another important sign is Trousseau sign (not Chvostek): inflate a blood pressure cuff above systolic pressure for 3 minutes; a positive result is carpopedal spasm (hand/wrist contraction), also indicating hypocalcemia. The RPN should immediately report these findings, anticipate IV calcium gluconate administration, monitor for laryngospasm (a life-threatening complication of severe hypocalcemia that is especially dangerous post-thyroidectomy due to airway edema), and ensure emergency airway equipment is at bedside.",
    "Post-thyroidectomy: monitor for hypocalcemia signs (Chvostek, Trousseau, tingling, numbness); keep IV calcium gluconate and tracheostomy tray at bedside",
    "Chvostek = facial tapping = facial twitch; Trousseau = BP cuff inflated = carpopedal spasm; both indicate hypocalcemia",
    "Trousseau sign (BP cuff) and Chvostek sign (facial tap) BOTH indicate hypocalcemia; do not confuse them or mix up the techniques",
    { A: "Normal cranial nerve VII function would not produce involuntary facial contraction from tapping; this response indicates neuromuscular irritability", C: "Trousseau sign involves BP cuff inflation causing carpopedal spasm, not facial tapping; and both signs indicate hypocalcemia, not hyperkalemia", D: "Bell palsy causes unilateral facial weakness/paralysis, not involuntary contraction from nerve tapping" },
    ["fluid-electrolytes", "hypocalcemia", "thyroidectomy", "Chvostek-sign", "parathyroid"]
  ));

  // --- Vital Signs ---
  questions.push(rpnCA("Vital Signs Assessment", "Orthostatic Hypotension", "Physiological Integrity", "MCQ", 2,
    "An RPN obtains the following orthostatic vital signs on a 70-year-old patient: Lying: BP 138/82 mmHg, HR 72 bpm; Sitting: BP 126/78 mmHg, HR 80 bpm; Standing: BP 112/64 mmHg, HR 96 bpm. How should the RPN interpret these findings?",
    [O("A","Normal blood pressure response to position changes"), O("B","Positive orthostatic hypotension requiring fall precautions and provider notification"), O("C","Hypertensive emergency requiring immediate treatment"), O("D","Normal age-related blood pressure variation")],
    ["B"],
    "Orthostatic (postural) hypotension is defined as a decrease of 20 mmHg or more in systolic blood pressure OR 10 mmHg or more in diastolic blood pressure within 3 minutes of standing from a supine or sitting position, often accompanied by a compensatory increase in heart rate of 20 bpm or more. In this patient: systolic BP drops from 138 (lying) to 112 (standing) = 26 mmHg decrease, which exceeds the 20 mmHg threshold. Diastolic BP drops from 82 to 64 = 18 mmHg decrease, also exceeding the 10 mmHg threshold. Heart rate increases from 72 to 96 = 24 bpm increase, indicating compensatory tachycardia. This is a positive orthostatic test. Common causes include dehydration, medication effects (antihypertensives, diuretics, antidepressants), autonomic dysfunction, prolonged bed rest, and age-related changes. The RPN should implement fall precautions, educate the patient about slow position changes, ensure adequate hydration, report to the provider, and review the medication list for contributing factors. This is not a hypertensive emergency (option C) as the elevated reading is the baseline, not the acute change.",
    "Orthostatic hypotension criteria: systolic drop ≥20 mmHg OR diastolic drop ≥10 mmHg OR HR increase ≥20 bpm upon standing",
    "Calculate the DIFFERENCE between lying and standing readings; if systolic drops ≥20 or diastolic drops ≥10, it is positive for orthostatic hypotension",
    "The lying BP may appear elevated (138/82) but the concern is the CHANGE between positions, not the absolute value",
    { A: "A 26 mmHg systolic drop exceeds the 20 mmHg threshold for orthostatic hypotension; this is not a normal response", C: "The elevated lying BP is a separate concern; the orthostatic drop is the immediate safety issue requiring fall precautions", D: "While older adults are more susceptible to orthostatic changes, a 26 mmHg drop is clinically significant and not simply age-related variation" },
    ["vital-signs", "orthostatic-hypotension", "fall-prevention", "geriatric", "assessment"]
  ));

  // --- Wound Care ---
  questions.push(rpnCA("Wound Care", "Wound Assessment", "Physiological Integrity", "MCQ", 2,
    "An RPN is assessing a patient's wound and documents: 'wound bed is 80% red, granulating tissue with 20% yellow slough along the wound edges.' Using the Red-Yellow-Black wound classification system, what is the primary treatment goal?",
    [O("A","Debridement to remove necrotic black eschar"), O("B","Protection and moisture maintenance to support the red granulation tissue while gently removing the yellow slough"), O("C","Application of silver sulfadiazine for infection"), O("D","Immediate surgical closure of the wound")],
    ["B"],
    "The Red-Yellow-Black (RYB) wound classification system guides wound management based on tissue type: RED wounds (granulation tissue) need PROTECTION and moisture; YELLOW wounds (slough/fibrin) need CLEANSING/debridement; BLACK wounds (eschar/necrotic tissue) need DEBRIDEMENT. This wound is predominantly red (80% granulation, indicating healthy healing) with 20% yellow slough. The treatment priority is to protect the healthy granulation tissue while gently removing the slough. Appropriate interventions include: moisture-retentive dressings (hydrogels, foams) to maintain optimal healing environment, gentle mechanical debridement or autolytic debridement with occlusive dressings for the slough areas, and avoiding disruption of the granulation tissue. Sharp debridement of eschar (option A) is not indicated as there is no black necrotic tissue described. Silver sulfadiazine (option C) is used for burns and infected wounds; there are no signs of infection described. Surgical closure (option D) is not indicated for a wound that is actively granulating.",
    "Red-Yellow-Black system: RED = protect and moisturize; YELLOW = clean and debride slough; BLACK = debride necrotic tissue; prioritize the dominant colour",
    "When a wound has mixed tissue types (red + yellow), protect the healthy tissue while addressing the problematic tissue; the dominant colour guides primary treatment",
    "Do not confuse yellow slough (needs gentle debridement) with yellow purulent exudate (indicates infection requiring antimicrobial treatment)",
    { A: "Debridement of black eschar is not indicated; the wound has granulation tissue and slough, not necrotic eschar", C: "Silver sulfadiazine is indicated for burns and infected wounds; this wound shows no signs of infection", D: "Surgical closure is not appropriate for a wound that is actively healing with granulation tissue" },
    ["wound-care", "wound-assessment", "RYB-classification", "granulation", "dressing-selection"]
  ));

  // --- Pain Management ---
  questions.push(rpnCA("Pain Management", "Non-Pharmacological Interventions", "Physiological Integrity", "MCQ", 2,
    "An RPN is caring for a patient experiencing chronic low back pain. The patient requests non-pharmacological pain management. Which intervention is evidence-based for chronic pain management?",
    [O("A","Strict bed rest for 2 weeks to allow healing"), O("B","Application of heat therapy combined with progressive exercise and relaxation techniques"), O("C","Avoidance of all physical activity until pain resolves completely"), O("D","Application of ice packs continuously for 24 hours")],
    ["B"],
    "Evidence-based non-pharmacological interventions for chronic low back pain include heat therapy, progressive exercise, cognitive-behavioral approaches, and relaxation techniques. Current Canadian clinical practice guidelines recommend AGAINST prolonged bed rest for chronic low back pain, as it leads to deconditioning, muscle weakness, and worsening of pain. Instead, staying active with gradual progression of activity is recommended. Heat therapy (superficial heat application for 15-20 minutes) increases blood flow, relaxes muscles, and reduces pain. Progressive exercise (physiotherapy-guided) strengthens core muscles and improves flexibility. Relaxation techniques (deep breathing, progressive muscle relaxation, meditation) reduce muscle tension and the psychological component of chronic pain. Ice application (option D) is more appropriate for acute injuries (first 48-72 hours) and should be applied for 15-20 minutes with a barrier, never continuously. The gate control theory of pain supports using multiple modalities (heat, exercise, relaxation) to modulate pain perception.",
    "For chronic low back pain: stay active, use heat (not ice), progressive exercise, and relaxation; prolonged bed rest worsens outcomes",
    "Chronic pain management: activity and multimodal non-pharmacological approaches are preferred; bed rest and activity avoidance are almost always wrong answers",
    "ICE is for ACUTE injuries (first 48-72 hours); HEAT is for CHRONIC pain and muscle spasm; do not confuse the two",
    { A: "Prolonged bed rest is contraindicated for chronic back pain; it causes deconditioning and worsens outcomes", C: "Complete activity avoidance leads to deconditioning; evidence supports staying active with gradual progression", D: "Continuous ice for 24 hours can cause tissue damage; ice is for acute injuries, applied 15-20 min at a time with barriers" },
    ["pain-management", "non-pharmacological", "chronic-pain", "evidence-based", "heat-therapy"]
  ));

  // --- Nutrition ---
  questions.push(rpnCA("Nutrition", "Enteral Feeding", "Physiological Integrity", "MCQ", 3,
    "An RPN is preparing to administer a continuous enteral feeding via nasogastric tube. Before starting the feeding, the RPN checks the gastric residual volume (GRV) and obtains 280 mL. The facility protocol states to hold feedings for GRV greater than 300 mL. What should the RPN do?",
    [O("A","Discard the residual volume and start the feeding at the ordered rate"), O("B","Return the residual to the stomach and start the feeding at the ordered rate, monitoring for signs of intolerance"), O("C","Hold the feeding for 4 hours and recheck the residual"), O("D","Remove the NG tube and insert a new one at a different location")],
    ["B"],
    "With a gastric residual volume of 280 mL, which is below the facility's hold threshold of 300 mL, the RPN should return the residual to the stomach and proceed with the feeding. Returning the residual is important because it contains gastric acids, electrolytes, and partially digested nutrients; discarding it can lead to fluid and electrolyte imbalances. However, the RPN should closely monitor for signs of feeding intolerance including: abdominal distension, nausea/vomiting, abdominal cramping, diarrhea, and increasing residual volumes. Current evidence from the American Society for Parenteral and Enteral Nutrition (ASPEN) suggests that routine GRV monitoring may not be necessary in all patients, and some guidelines have raised the hold threshold to 500 mL. However, the RPN should follow facility-specific protocols. The head of the bed should be elevated at least 30-45 degrees during continuous feeding to prevent aspiration. If subsequent residuals exceed the threshold, the nurse should hold the feeding and notify the provider for further evaluation.",
    "GRV below hold threshold: return residual to stomach and proceed with feeding while monitoring for intolerance; never discard residual unless facility protocol specifies",
    "For GRV questions: below threshold = return and feed; above threshold = hold and reassess; always return residual to prevent electrolyte loss",
    "Discarding gastric residual wastes important electrolytes and nutrients; it should be returned unless it is bloody or the volume is excessive per protocol",
    { A: "Discarding the residual removes important gastric acids and electrolytes; it should be returned to the stomach", C: "Holding the feeding is not necessary as the GRV (280 mL) is below the 300 mL threshold", D: "There is no indication that the NG tube is malpositioned; removing and reinserting is unnecessary and increases patient discomfort" },
    ["nutrition", "enteral-feeding", "NG-tube", "gastric-residual", "feeding-intolerance"]
  ));

  // --- Elimination ---
  questions.push(rpnCA("Elimination", "Bowel Assessment", "Physiological Integrity", "MCQ", 2,
    "An RPN is assessing a patient who reports not having a bowel movement for 5 days. The patient has been on bed rest following surgery and is taking opioid pain medication. Which assessment finding is most consistent with constipation?",
    [O("A","Hyperactive bowel sounds in all four quadrants"), O("B","Hard, distended abdomen with hypoactive bowel sounds"), O("C","Liquid stool with mucus and blood"), O("D","Soft, non-tender abdomen with normoactive bowel sounds")],
    ["B"],
    "Constipation presents with a hard, distended abdomen and hypoactive (decreased) bowel sounds. The patient has two major risk factors: prolonged bed rest (decreased mobility reduces peristalsis) and opioid medication (opioids bind to mu receptors in the GI tract, slowing peristalsis, increasing water absorption, and causing constipation). Additional risk factors include decreased fluid and fibre intake, changes in routine, and certain medications. The nursing assessment for constipation includes: (1) abdominal inspection (distension), (2) auscultation (hypoactive bowel sounds indicating decreased peristalsis), (3) palpation (hard, firm abdomen, possible palpable stool), (4) history of last bowel movement and normal pattern. Hyperactive bowel sounds (option A) suggest diarrhea or early bowel obstruction. Liquid stool with blood (option C) suggests GI bleeding or infection, not simple constipation. Normal findings (option D) are inconsistent with 5 days of no bowel movement. Prevention includes adequate hydration, high-fibre diet if appropriate, mobility as tolerated, and prophylactic stool softeners with opioid use.",
    "Opioid-induced constipation is preventable; prophylactic stool softeners (docusate) and/or stimulant laxatives (senna) should be ordered with opioid prescriptions",
    "Constipation assessment: hard abdomen + hypoactive bowel sounds + no BM = constipation; hyperactive sounds suggest different pathology",
    "Liquid stool around hard stool (overflow incontinence) can occur with severe constipation; do not mistake it for diarrhea",
    { A: "Hyperactive bowel sounds indicate increased peristalsis, more consistent with diarrhea or early obstruction than constipation", C: "Liquid stool with blood suggests GI bleeding, infection, or inflammatory bowel disease, not simple constipation", D: "A soft, non-tender abdomen with normal bowel sounds is inconsistent with 5 days of constipation" },
    ["elimination", "constipation", "opioid-induced", "bowel-assessment", "postoperative"]
  ));

  // --- Perioperative Care ---
  questions.push(rpnCA("Perioperative Care", "Preoperative Checklist", "Safe & Effective Care Environment", "MCQ", 2,
    "An RPN is completing the preoperative checklist for a patient scheduled for an elective knee replacement. Which finding should the RPN report to the surgeon BEFORE the patient is transported to the operating room?",
    [O("A","The patient took their morning antihypertensive medication with a sip of water as instructed"), O("B","The patient reports taking acetylsalicylic acid (ASA) 81 mg daily and last took it yesterday"), O("C","The patient's identification band matches the consent form and MAR"), O("D","The surgical site has been marked with the surgeon's initials")],
    ["B"],
    "ASA (aspirin/acetylsalicylic acid) is an antiplatelet medication that irreversibly inhibits cyclooxygenase (COX-1), preventing thromboxane A2 production and platelet aggregation. This effect lasts for the entire lifespan of the platelet (7-10 days). Most surgical protocols require ASA to be discontinued 7-10 days before elective surgery to reduce the risk of excessive intraoperative and postoperative bleeding. If the patient took ASA only 1 day ago, the antiplatelet effect is still fully active, placing the patient at increased bleeding risk during surgery. The surgeon must be notified immediately so they can make an informed decision about whether to proceed with or postpone the surgery. Taking the morning antihypertensive (option A) is generally recommended per anesthesia protocols to maintain blood pressure stability during surgery. Matching identification (option C) is a normal verification step. Surgical site marking (option D) is a required safety step that has already been completed. The preoperative checklist should include medication reconciliation with specific attention to anticoagulants, antiplatelets, and herbals that affect bleeding.",
    "ASA/aspirin is typically held 7-10 days before elective surgery due to irreversible platelet inhibition; report if taken within this window",
    "On preoperative checklists, medications that increase bleeding (ASA, warfarin, clopidogrel, NSAIDs, herbal supplements like ginkgo) are the most critical to verify",
    "ASA's antiplatelet effect is IRREVERSIBLE and lasts the entire platelet lifespan (7-10 days); a single dose yesterday means full antiplatelet effect is still present",
    { A: "Taking antihypertensives with a sip of water before surgery is standard practice to maintain hemodynamic stability", C: "ID band verification is a routine safety check that confirms patient identity; it does not need to be reported as a concern", D: "Surgical site marking is a required safety procedure; its completion is expected and normal" },
    ["perioperative", "preoperative-checklist", "ASA", "antiplatelet", "bleeding-risk", "medication-reconciliation"]
  ));

  // --- Mental Health ---
  questions.push(rpnCA("Mental Health Basics", "Anxiety Management", "Psychosocial Integrity", "MCQ", 2,
    "An RPN is caring for a patient experiencing a panic attack. The patient is hyperventilating, reports chest tightness, and says 'I feel like I am going to die.' What is the RPN's priority intervention?",
    [O("A","Leave the patient alone to calm down in a quiet room"), O("B","Stay with the patient, speak in a calm low voice, and guide them through slow deep breathing exercises"), O("C","Administer oxygen via non-rebreather mask at 15 L/min"), O("D","Call a code blue for potential cardiac arrest")],
    ["B"],
    "A panic attack is a sudden episode of intense anxiety with physical symptoms (hyperventilation, chest tightness, tachycardia, diaphoresis, trembling) and cognitive symptoms (fear of dying, feeling of unreality). The priority nursing intervention is to remain with the patient and provide a calming, reassuring presence. Speaking in a calm, low, slow voice helps reduce the patient's anxiety through the principle of emotional contagion and models the desired behaviour. Guided slow deep breathing (breathe in for 4 counts, hold for 4 counts, breathe out for 6 counts) addresses the hyperventilation, which causes respiratory alkalosis and worsening of symptoms through CO2 depletion. The nursing goal is to reduce stimulation, provide safety, and help the patient regain control of breathing. Leaving the patient alone (option A) is contraindicated during a panic attack as isolation increases fear and the patient may injure themselves. A non-rebreather at 15L (option C) is inappropriate because the problem is hyperventilation (too much oxygen/CO2 loss), not hypoxemia. A code blue (option D) is not indicated; while the symptoms mimic cardiac events, the nurse should differentiate based on the presentation and history.",
    "During a panic attack: stay with the patient, remain calm, guide slow breathing; do NOT leave the patient alone or apply high-flow oxygen",
    "Panic attack interventions: presence + calm voice + guided breathing; leaving alone or escalating to emergency response are both incorrect",
    "Panic attacks cause hyperventilation (CO2 loss, respiratory alkalosis); high-flow oxygen worsens this by providing more O2 without addressing the CO2 deficit",
    { A: "Leaving an anxious patient alone increases fear and isolation; the nurse's calming presence is therapeutic", C: "High-flow oxygen is inappropriate; the problem is hyperventilation causing CO2 loss, not oxygen deficiency", D: "A code blue is not indicated for a panic attack; the symptoms, while distressing, are not a cardiac emergency" },
    ["mental-health", "panic-attack", "anxiety", "therapeutic-communication", "breathing-exercises"]
  ));

  // --- Maternal-Newborn ---
  questions.push(rpnCA("Maternal-Newborn", "Prenatal Assessment", "Health Promotion & Maintenance", "MCQ", 3,
    "An RPN at a prenatal clinic is assessing a patient at 32 weeks gestation. The patient's blood pressure is 148/96 mmHg (baseline was 110/70 mmHg at the first visit). Urine dipstick shows 2+ protein. The patient reports a persistent headache. Which condition should the RPN suspect?",
    [O("A","Gestational diabetes mellitus"), O("B","Preeclampsia"), O("C","Normal pregnancy-related blood pressure elevation"), O("D","Urinary tract infection")],
    ["B"],
    "The triad of hypertension (BP 148/96, significantly elevated from baseline of 110/70), proteinuria (2+ protein on urine dipstick), and symptoms such as persistent headache occurring after 20 weeks gestation is the classic presentation of preeclampsia. Preeclampsia is a pregnancy-specific hypertensive disorder characterized by new-onset hypertension (systolic ≥140 mmHg or diastolic ≥90 mmHg) AND proteinuria (≥300 mg/24 hours or protein/creatinine ratio ≥0.3, or dipstick ≥2+) developing after 20 weeks of gestation. Additional warning signs include visual disturbances (scotomata, blurred vision), epigastric or right upper quadrant pain (hepatic involvement), facial and hand edema, and hyperreflexia. The persistent headache is particularly concerning as it may indicate cerebral edema and increased risk for eclampsia (seizures). The RPN must immediately report these findings to the physician/midwife, as the patient requires further evaluation including blood work (CBC, liver enzymes, renal function, LDH), fetal monitoring (NST, biophysical profile), and possibly hospital admission. Preeclampsia can rapidly progress to eclampsia, HELLP syndrome, or placental abruption, all of which are life-threatening to mother and fetus.",
    "Preeclampsia triad: hypertension + proteinuria + symptoms (headache, visual changes, edema) after 20 weeks gestation; report immediately",
    "When a question describes elevated BP + proteinuria + symptoms in pregnancy after 20 weeks, preeclampsia is almost always the correct answer",
    "Do not dismiss pregnancy headaches as 'normal'; in the context of elevated BP and proteinuria, headache indicates preeclampsia with severe features",
    { A: "Gestational diabetes presents with hyperglycemia, not hypertension and proteinuria", C: "A BP increase from 110/70 to 148/96 with proteinuria and headache is NOT normal pregnancy variation; this is pathological", D: "UTI may cause proteinuria but would not explain the significant hypertension and headache" },
    ["maternal-newborn", "preeclampsia", "prenatal", "hypertension", "proteinuria", "pregnancy-complication"]
  ));

  // --- Pediatric Nursing ---
  questions.push(rpnCA("Pediatric Nursing", "Childhood Immunizations", "Health Promotion & Maintenance", "MCQ", 2,
    "An RPN is administering the MMR (measles, mumps, rubella) vaccine to a 12-month-old. The parent asks when the next dose is due. What is the correct response?",
    [O("A","The next dose is at 18 months of age"), O("B","No additional dose is needed; one dose provides lifelong immunity"), O("C","The second dose is recommended at 4-6 years of age, before school entry"), O("D","A booster is needed every 5 years throughout childhood")],
    ["C"],
    "In Canada, the National Advisory Committee on Immunization (NACI) recommends two doses of MMR vaccine: the first dose at 12 months of age and the second dose at either 18 months or 4-6 years of age (timing varies by province/territory, but school entry is a common target for the second dose in many jurisdictions). The Canadian immunization schedule in most provinces provides the first dose of MMR at 12 months and the second dose as MMRV (measles, mumps, rubella, varicella) at 18 months. However, the standard recommendation for the second dose timing is typically at 4-6 years before school entry to ensure optimal immunity. Two doses of MMR provide approximately 97% protection against measles, 88% against mumps, and 97% against rubella. A single dose (option B) provides about 93% protection against measles but is not sufficient for herd immunity; the second dose is essential. MMR does not require boosters every 5 years (option D); the two-dose series provides long-lasting immunity. The RPN should update the immunization record and provide the parent with the next appointment date per provincial guidelines.",
    "MMR requires TWO doses: first at 12 months, second at 4-6 years (before school entry); check provincial guidelines for specific timing",
    "For immunization schedule questions, know key ages: birth (Hep B), 2-4-6 months (primary series), 12-15 months (MMR, varicella), 4-6 years (school boosters)",
    "One dose of MMR is NOT sufficient for adequate protection; the second dose is essential for achieving herd immunity levels",
    { A: "While some provinces give MMRV at 18 months, the standard second dose of MMR is recommended at 4-6 years", B: "One dose provides about 93% protection against measles; two doses are recommended for optimal immunity", D: "MMR does not require periodic boosters; the two-dose series provides long-lasting immunity" },
    ["pediatric", "immunization", "MMR", "vaccine-schedule", "health-promotion"]
  ));

  // --- Geriatric Care ---
  questions.push(rpnCA("Geriatric Care", "Polypharmacy", "Safe & Effective Care Environment", "MCQ", 3,
    "An RPN is reviewing medications for an 85-year-old patient who takes 12 different medications. The patient reports dizziness, fatigue, and confusion that worsened over the past month. Which nursing action addresses the potential problem of polypharmacy?",
    [O("A","Encourage the patient to stop all medications immediately to see which symptoms resolve"), O("B","Collaborate with the pharmacist and physician to conduct a comprehensive medication review using the Beers Criteria for potentially inappropriate medications in older adults"), O("C","Add an additional medication to treat the new symptoms of dizziness and confusion"), O("D","Suggest the patient take all medications at bedtime to reduce daytime side effects")],
    ["B"],
    "Polypharmacy (use of 5 or more medications) is a significant concern in geriatric patients because aging-related physiological changes affect drug metabolism and excretion: decreased hepatic blood flow and liver enzyme activity slow drug metabolism (Phase I reactions), decreased renal function (GFR declines approximately 1% per year after age 40) impairs drug excretion, decreased albumin levels increase free drug levels, and increased body fat can prolong the effects of lipophilic drugs. The Beers Criteria (American Geriatrics Society) is an evidence-based tool that identifies potentially inappropriate medications (PIMs) for older adults due to unfavourable risk-benefit ratios. A comprehensive medication review by an interprofessional team (nurse, pharmacist, physician) can identify: drug-drug interactions, therapeutic duplications, medications without clear indication, and PIMs that may be causing the patient's symptoms. The patient's dizziness, fatigue, and confusion could be side effects of one or more medications or drug interactions. Stopping all medications abruptly (option A) is dangerous and could cause withdrawal syndromes or disease exacerbation. Adding more medication (option C) perpetuates the polypharmacy cycle. Taking all medications at bedtime (option D) does not address the root cause and could worsen nocturnal side effects.",
    "Beers Criteria identifies potentially inappropriate medications in older adults; a comprehensive medication review is the evidence-based approach to polypharmacy",
    "For geriatric polypharmacy questions, the correct answer involves systematic medication REVIEW, not adding or removing medications without assessment",
    "Never recommend stopping all medications abruptly; this can cause dangerous withdrawal effects and disease exacerbation",
    { A: "Abruptly stopping all medications can cause dangerous withdrawal syndromes, rebound effects, and uncontrolled disease", C: "Adding medication to treat drug side effects perpetuates the prescribing cascade and worsens polypharmacy", D: "Taking all medications at bedtime does not address the underlying problem and could create dangerous drug interactions or nocturnal side effects" },
    ["geriatric", "polypharmacy", "Beers-criteria", "medication-review", "patient-safety"]
  ));

  // --- Delegation ---
  questions.push(rpnCA("Delegation & Scope", "Interprofessional Collaboration", "Safe & Effective Care Environment", "delegation", 3,
    "An RPN receives a new order to administer IV potassium chloride 40 mmol in 1000 mL normal saline over 4 hours to a patient with hypokalemia (K+ 3.0 mmol/L). The RPN's provincial scope allows IV medication administration with appropriate education. Which action is MOST appropriate?",
    [O("A","Administer the IV potassium without any additional verification since it is a physician's order"), O("B","Verify the order, check the maximum infusion rate (10 mmol/hour), ensure cardiac monitoring is available, and use an IV pump for accurate delivery"), O("C","Refuse to administer IV potassium as it is beyond all RPN scope of practice"), O("D","Dilute the potassium and administer it as a rapid IV push over 5 minutes")],
    ["B"],
    "IV potassium chloride is a HIGH-ALERT medication that requires careful verification and monitoring. The RPN must: (1) verify the order for accuracy (dose: 40 mmol is within standard range; concentration: 40 mmol/1000 mL = 40 mEq/L which is within safe peripheral IV limits of ≤40 mEq/L), (2) check the maximum infusion rate (standard maximum is 10 mmol/hour for peripheral IV; central line allows higher rates with monitoring), (3) calculate the infusion rate (40 mmol over 4 hours = 10 mmol/hour, which is at the maximum rate), (4) ensure cardiac monitoring is available (potassium directly affects cardiac conduction), (5) use an IV infusion pump for accurate delivery (never run potassium by gravity), (6) assess the IV site for patency (potassium is a vesicant that causes tissue damage if it infiltrates), and (7) monitor for signs of phlebitis at the IV site. IV potassium should NEVER be administered as a rapid IV push (option D) as this can cause fatal cardiac arrest (hyperkalemia-induced ventricular fibrillation). While RPN scope varies by province, many provincial regulatory bodies allow RPNs to administer IV medications with appropriate education and authorization. The RPN should follow facility policy and their regulatory body's guidelines.",
    "IV potassium is HIGH-ALERT: never push IV, always use a pump, max 10 mmol/hour peripherally, cardiac monitoring required, check IV site patency",
    "For IV potassium questions: NEVER rapid push, ALWAYS pump, ALWAYS cardiac monitoring; these rules are non-negotiable",
    "IV potassium given too rapidly can cause FATAL cardiac arrest; it must never be administered as an IV push regardless of the clinical urgency",
    { A: "High-alert medications require additional verification steps beyond simply checking that an order exists", C: "Many Canadian provincial regulatory bodies allow RPNs to administer IV medications with appropriate education; a blanket refusal is not appropriate", D: "NEVER administer potassium as a rapid IV push; this can cause fatal cardiac arrest from acute hyperkalemia" },
    ["delegation", "IV-potassium", "high-alert-medication", "cardiac-monitoring", "patient-safety"]
  ));

  // --- Communication ---
  questions.push(rpnCA("Communication", "Handoff Communication", "Safe & Effective Care Environment", "MCQ", 2,
    "An RPN is giving a shift report to the incoming nurse using the I-SBAR-R format. Which component of the report provides the patient's relevant medical history and current treatment?",
    [O("A","Introduction"), O("B","Situation"), O("C","Background"), O("D","Recommendation")],
    ["C"],
    "The I-SBAR-R communication framework is a structured handoff tool that ensures complete and organized information transfer between healthcare providers. Each component has a specific purpose: INTRODUCTION (I) - identifies the sender, their role, and the patient being discussed. SITUATION (S) - describes the current clinical situation and the reason for the communication (why are you calling or reporting?). BACKGROUND (B) - provides relevant medical history, current diagnoses, treatment plan, allergies, code status, and pertinent lab/test results that provide context for the current situation. ASSESSMENT (A) - presents the nurse's clinical assessment of the patient's current condition, including vital signs, physical findings, and clinical judgment about what may be happening. RECOMMENDATION (R) - suggests what the nurse believes should be done next, including anticipated orders, monitoring needs, or follow-up actions. READ-BACK (R) - confirms mutual understanding of the communication. The Background component specifically includes: admitting diagnosis, medical and surgical history, relevant medications, allergies, advance directives/code status, current treatment plan, significant lab values, and pending procedures or tests.",
    "I-SBAR-R: Introduction (who), Situation (what's happening now), Background (history/context), Assessment (clinical findings), Recommendation (what's needed), Read-back (confirm)",
    "SBAR components: Situation = current issue; Background = history; Assessment = clinical findings; Recommendation = next steps; do not confuse them",
    "Background is NOT the current situation; it is the HISTORY that provides context for understanding the current clinical picture",
    { A: "Introduction identifies who you are and which patient you are discussing, not the medical history", B: "Situation describes the CURRENT clinical concern, not the past medical history", D: "Recommendation addresses what should be done NEXT, not the patient's background" },
    ["communication", "SBAR", "handoff", "patient-safety", "shift-report"]
  ));

  // --- Ethics & Legal ---
  questions.push(rpnCA("Ethics & Legal", "Advance Directives", "Safe & Effective Care Environment", "MCQ", 3,
    "An RPN is caring for a patient who has a valid Do Not Resuscitate (DNR) order documented in their medical record. The patient goes into cardiac arrest while the family is visiting. The family member demands that the RPN 'do everything' to save the patient. What is the RPN's ethical and legal obligation?",
    [O("A","Begin CPR immediately because the family has requested it, overriding the DNR order"), O("B","Honour the patient's DNR order as documented, provide comfort measures, and explain the DNR order to the family while notifying the physician"), O("C","Call a code and let the resuscitation team decide whether to follow the DNR"), O("D","Leave the room to find a supervisor before taking any action")],
    ["B"],
    "The patient's DNR order represents their autonomous, informed decision about end-of-life care made when they were competent. This order takes legal and ethical precedence over family requests. The RPN's obligations are: (1) HONOUR the DNR order - the patient's right to self-determination (autonomy) is a fundamental ethical principle in Canadian nursing practice, (2) PROVIDE COMFORT MEASURES - position the patient comfortably, maintain dignity, provide emotional support to the family, (3) COMMUNICATE with the family - explain that the DNR order was the patient's choice, made to ensure their wishes are respected, (4) NOTIFY the physician of the cardiac arrest and the DNR status, (5) DOCUMENT the event and actions taken. Family members cannot override a valid DNR order because the right to make healthcare decisions belongs to the PATIENT, not to family members (unless they hold a valid power of attorney for personal care and the patient lacks capacity, but the existing valid DNR was made by the competent patient). Beginning CPR (option A) would violate the patient's expressed wishes and could constitute unwanted medical treatment. Calling a code (option C) would also violate the DNR order. Leaving the room (option D) abandons the patient during a critical moment.",
    "A valid DNR order reflects the patient's AUTONOMOUS decision; it cannot be overridden by family requests; the nurse's obligation is to honour the patient's wishes",
    "DNR questions: the patient's documented wishes take precedence over family requests; the nurse honours the DNR and provides comfort care",
    "Family members CANNOT override a valid DNR order; the right to make healthcare decisions belongs to the patient, not the family",
    { A: "Beginning CPR against the patient's documented wishes violates their autonomy and could constitute unwanted medical treatment", C: "Calling a code team would violate the DNR order; the decision has already been made by the patient", D: "Leaving the patient to find a supervisor constitutes patient abandonment; the RPN must stay and provide comfort measures" },
    ["ethics", "DNR", "advance-directives", "patient-autonomy", "end-of-life", "legal"]
  ));

  // --- Emergency Response ---
  questions.push(rpnCA("Emergency Response", "Choking Management", "Safe & Effective Care Environment", "MCQ", 2,
    "An RPN in a long-term care facility observes a resident clutching their throat during lunch. The resident is unable to speak, cough, or breathe. What is the RPN's immediate action?",
    [O("A","Perform blind finger sweeps to remove the obstruction"), O("B","Stand behind the resident and perform abdominal thrusts (Heimlich manoeuvre)"), O("C","Lay the resident flat and begin chest compressions"), O("D","Call 911 and wait for paramedics to arrive before intervening")],
    ["B"],
    "The resident is displaying the universal sign of choking (clutching the throat) with a complete airway obstruction (unable to speak, cough, or breathe). For a conscious adult with a complete obstruction, the immediate intervention is abdominal thrusts (Heimlich manoeuvre). The technique involves: (1) stand behind the choking person, (2) wrap arms around their waist, (3) make a fist with one hand and place it thumb-side against the abdomen, just above the umbilicus and below the xiphoid process, (4) grasp the fist with the other hand, (5) perform quick, upward thrusts to create artificial cough pressure to expel the foreign body. Continue until the object is expelled or the person becomes unconscious. If the person becomes unconscious, lower them to the floor and begin CPR (30 compressions to 2 breaths), checking for visible objects in the mouth before giving breaths. Blind finger sweeps (option A) are NO longer recommended as they may push the object deeper into the airway. Chest compressions (option C) are for unconscious choking victims, not conscious ones. Waiting for paramedics (option D) delays life-saving intervention in a situation that requires immediate action.",
    "Conscious choking adult = abdominal thrusts (Heimlich); unconscious choking = CPR with visual checks for objects; NO blind finger sweeps",
    "Choking questions: conscious + unable to speak/cough = abdominal thrusts; unconscious = CPR; pregnant/obese = chest thrusts",
    "Blind finger sweeps are OUTDATED and no longer recommended; they can push the object deeper into the airway",
    { A: "Blind finger sweeps are no longer recommended; they may push the foreign body deeper into the airway", C: "Chest compressions and CPR are indicated for UNCONSCIOUS choking victims, not conscious ones", D: "Complete airway obstruction is a life-threatening emergency requiring immediate intervention; waiting for paramedics could be fatal" },
    ["emergency", "choking", "airway-obstruction", "Heimlich", "first-aid"]
  ));

  // --- Fundamentals ---
  questions.push(rpnCA("Fundamentals of Nursing", "Oxygen Administration", "Physiological Integrity", "MCQ", 2,
    "An RPN is caring for a patient prescribed oxygen at 2 L/min via nasal cannula. What approximate FiO2 (fraction of inspired oxygen) does this deliver?",
    [O("A","21% (room air)"), O("B","28%"), O("C","40%"), O("D","60%")],
    ["B"],
    "A nasal cannula is a low-flow oxygen delivery device that provides supplemental oxygen at flow rates of 1-6 L/min. The approximate FiO2 delivered increases by approximately 4% for each additional litre per minute of flow: 1 L/min = approximately 24% FiO2, 2 L/min = approximately 28% FiO2, 3 L/min = approximately 32% FiO2, 4 L/min = approximately 36% FiO2, 5 L/min = approximately 40% FiO2, 6 L/min = approximately 44% FiO2. Flow rates above 6 L/min are not recommended for nasal cannula because they provide minimal additional FiO2, dry the nasal mucosa, and can cause discomfort, epistaxis, and headaches. The actual FiO2 varies based on the patient's respiratory rate, tidal volume, and breathing pattern because room air is entrained with each breath, diluting the supplemental oxygen. For patients requiring higher FiO2, alternative devices include simple face mask (35-55%), Venturi mask (precise FiO2 24-50%), partial rebreather (60-80%), or non-rebreather (80-95%). The RPN should monitor oxygen saturation with pulse oximetry and assess for signs of hypoxemia or hyperoxemia.",
    "Nasal cannula FiO2: 1L=24%, 2L=28%, 3L=32%, 4L=36%, 5L=40%, 6L=44% (increases ~4% per litre); max 6 L/min for nasal cannula",
    "Memorize the nasal cannula FiO2 ladder: start at 24% for 1L, add 4% for each additional litre; this is a commonly tested calculation",
    "Do not exceed 6 L/min by nasal cannula; higher flow rates dry the mucosa without significantly increasing FiO2",
    { A: "21% is room air with no supplemental oxygen; 2 L/min nasal cannula provides approximately 28%", C: "40% FiO2 corresponds to approximately 5 L/min nasal cannula, not 2 L/min", D: "60% FiO2 requires a higher-flow device such as a non-rebreather mask; nasal cannula at 2 L/min cannot deliver this concentration" },
    ["fundamentals", "oxygen-therapy", "nasal-cannula", "FiO2", "respiratory"]
  ));

  questions.push(rpnCA("Documentation", "Legal Documentation", "Safe & Effective Care Environment", "MCQ", 2,
    "An RPN makes an error while documenting in a patient's paper chart. What is the correct method to correct the documentation error?",
    [O("A","Use correction fluid (white-out) to cover the error and rewrite the correct information"), O("B","Draw a single line through the error, write 'error' above it, initial, date, and write the correct entry"), O("C","Remove the page from the chart and rewrite the entire entry"), O("D","Scribble over the error so it cannot be read and continue documenting")],
    ["B"],
    "Legal documentation in healthcare requires that errors be corrected in a specific, transparent manner that maintains the integrity of the medical record as a legal document. The correct method is: (1) draw a single line through the incorrect entry so that the original text remains readable, (2) write 'error' or 'mistaken entry' above or near the crossed-out text, (3) initial and date the correction, (4) write the correct information adjacent to or below the correction. This method preserves the audit trail and ensures transparency. The original entry must remain legible because medical records may be subpoenaed for legal proceedings, and any alteration that obscures the original text can be interpreted as tampering or concealment. Correction fluid/white-out (option A) is NEVER acceptable in medical records as it conceals the original entry and raises questions about document integrity. Removing pages (option C) constitutes destruction of a legal document and could result in criminal charges. Scribbling over entries (option D) obscures the original text and could be interpreted as intentional concealment. Electronic health records (EHR) have their own correction mechanisms, typically involving addendums and late entries with automatic timestamps.",
    "Single line through error + 'error' + initials + date + correct entry; NEVER use white-out, remove pages, or obscure original text",
    "Documentation correction: the answer that preserves the original entry's readability while clearly marking the correction is correct",
    "White-out and page removal in medical records can be considered tampering or destruction of a legal document with criminal implications",
    { A: "White-out/correction fluid is never acceptable in medical records; it conceals the original entry and questions document integrity", C: "Removing pages from a medical record constitutes destruction of a legal document and may have criminal consequences", D: "Scribbling over entries obscures the original text and could be interpreted as intentional concealment or tampering" },
    ["documentation", "legal", "medical-records", "error-correction", "charting"]
  ));

  // =============== NCLEX-PN QUESTIONS (US Context) ===============

  questions.push(rpnUS("Physiological Integrity", "Cardiovascular Assessment", "Physiological Integrity", "MCQ", 3,
    "An LPN is caring for a patient with a new diagnosis of atrial fibrillation. The patient's heart rate is 142 bpm and irregular. Which complication of atrial fibrillation should the LPN monitor for MOST closely?",
    [O("A","Pneumothorax"), O("B","Thromboembolic stroke"), O("C","Renal calculi"), O("D","Peptic ulcer disease")],
    ["B"],
    "Atrial fibrillation (AF) is the most common cardiac dysrhythmia and carries a significant risk of thromboembolic stroke. In AF, the atria quiver (fibrillate) instead of contracting effectively, causing blood to pool and stagnate in the atrial chambers, particularly the left atrial appendage. This stasis promotes thrombus (clot) formation. If a thrombus dislodges, it can travel through the arterial system to the brain, causing an ischemic stroke. AF increases the stroke risk by 5-fold compared to normal sinus rhythm. The CHA2DS2-VASc score is used to assess stroke risk and determine the need for anticoagulation therapy in AF patients. Patients with AF are typically prescribed anticoagulants (warfarin with target INR 2.0-3.0, or direct oral anticoagulants like apixaban or rivarelbán) to prevent clot formation. The LPN should monitor for signs of stroke (FAST: Face drooping, Arm weakness, Speech difficulty, Time to call 911), signs of bleeding (if on anticoagulants), and hemodynamic stability. Pneumothorax (option A), renal calculi (option C), and peptic ulcer disease (option D) are not complications of atrial fibrillation.",
    "Atrial fibrillation's most dangerous complication is thromboembolic STROKE from blood stasis in the fibrillating atria; anticoagulation is key prevention",
    "AF + stroke risk is a high-yield exam topic; know that AF = irregular atrial activity = blood pooling = clot formation = stroke risk",
    "Not all AF patients have noticeable symptoms; silent AF still carries stroke risk and requires anticoagulation assessment",
    { A: "Pneumothorax is a respiratory condition unrelated to atrial fibrillation", C: "Renal calculi are formed in the urinary system and not related to atrial fibrillation", D: "Peptic ulcer disease is a GI condition not caused by atrial fibrillation" },
    ["cardiovascular", "atrial-fibrillation", "stroke", "anticoagulation", "thromboembolic"]
  ));

  questions.push(rpnUS("Pharmacological Therapies", "Anticoagulant Monitoring", "Physiological Integrity", "MCQ", 3,
    "An LPN is caring for a patient on warfarin therapy for deep vein thrombosis. The patient's INR result is 4.8 (therapeutic range: 2.0-3.0). Which finding should the LPN report immediately?",
    [O("A","INR within therapeutic range"), O("B","Blood in the patient's urine (hematuria) and bruising on the arms"), O("C","Mild headache relieved by acetaminophen"), O("D","Blood pressure of 128/78 mmHg")],
    ["B"],
    "An INR of 4.8 is significantly supratherapeutic (normal therapeutic range for warfarin is 2.0-3.0 for most indications), placing the patient at high risk for hemorrhage. Hematuria (blood in urine) and easy bruising are signs of bleeding complications from excessive anticoagulation. The LPN must report these findings immediately because internal bleeding can be life-threatening. The physician will likely order: (1) hold warfarin, (2) vitamin K (phytonadione) administration to reverse anticoagulation (dose depends on clinical situation and INR level), (3) possible fresh frozen plasma (FFP) or prothrombin complex concentrate (PCC) for significant or life-threatening bleeding, and (4) investigation of the bleeding source. Additional signs of bleeding the LPN should monitor include: petechiae, ecchymosis, tarry black stools (melena), coffee-ground emesis (hematemesis), blood in sputum (hemoptysis), prolonged bleeding from cuts, epistaxis, and gingival bleeding. The most dangerous complication is intracranial hemorrhage. The INR of 4.8 is NOT within therapeutic range (option A is factually incorrect). A mild headache responsive to acetaminophen (option C) and normal blood pressure (option D) are not emergency findings, although headache should be monitored in the context of high INR.",
    "INR > 3.0 on warfarin = supratherapeutic = increased bleeding risk; INR > 4.0 with signs of bleeding = emergency requiring immediate intervention",
    "For warfarin/INR questions: know the therapeutic range (2.0-3.0), the antidote (vitamin K), and the signs of bleeding that require immediate reporting",
    "A supratherapeutic INR does NOT always cause visible bleeding; occult internal hemorrhage can occur without obvious external signs",
    { A: "An INR of 4.8 is NOT within the therapeutic range of 2.0-3.0; it is dangerously elevated", C: "While headache in an over-anticoagulated patient warrants monitoring, hematuria and bruising indicate active bleeding requiring immediate intervention", D: "A blood pressure of 128/78 is within normal limits and is not an emergency finding" },
    ["pharmacology", "warfarin", "INR", "anticoagulation", "bleeding", "patient-safety"]
  ));

  questions.push(rpnUS("Safety and Infection Control", "Fire Safety", "Safe & Effective Care Environment", "MCQ", 2,
    "An LPN discovers a small electrical fire in a patient's room. Using the RACE mnemonic, what is the FIRST action?",
    [O("A","Activate the fire alarm"), O("B","Contain the fire by closing doors"), O("C","Rescue/remove the patient from immediate danger"), O("D","Extinguish the fire using the appropriate fire extinguisher")],
    ["C"],
    "The RACE mnemonic provides the proper sequence of actions in a hospital fire emergency: R - RESCUE/REMOVE patients from immediate danger (this is always first because patient safety is the top priority), A - ACTIVATE the fire alarm and call the fire department (notify others of the emergency), C - CONTAIN the fire by closing doors and windows to limit oxygen supply and prevent fire spread, E - EXTINGUISH the fire using the appropriate fire extinguisher (if safe to do so). The rationale for this sequence is: human life takes priority over all other actions. Even before activating the alarm, the nurse must ensure that patients in immediate danger are moved to safety. For fire extinguisher use, the PASS mnemonic applies: P - Pull the pin, A - Aim at the base of the fire, S - Squeeze the handle, S - Sweep side to side. The LPN should also know the types of fire extinguishers: Class A (ordinary combustibles), Class B (flammable liquids), Class C (electrical), Class ABC (multi-purpose). For an electrical fire, disconnect the power source if safely possible and use a Class C or ABC extinguisher. NEVER use water on an electrical fire.",
    "RACE: Rescue, Alarm, Contain, Extinguish; always rescue patients FIRST before activating alarms or fighting the fire",
    "Fire safety sequence: RACE (Rescue first, then Alarm, Contain, Extinguish); PASS for extinguisher use (Pull, Aim, Squeeze, Sweep)",
    "NEVER use water on an electrical fire; use a Class C or ABC fire extinguisher only",
    { A: "Activating the alarm is the second step (A in RACE); rescuing patients from danger always comes first", B: "Containing the fire is the third step (C in RACE); rescue and alarm activation come before containment", D: "Extinguishing is the last step (E in RACE); patient rescue is always the first priority" },
    ["patient-safety", "fire-safety", "RACE", "emergency", "hospital-safety"]
  ));

  questions.push(rpnUS("Physiological Integrity", "Diabetes Complications", "Physiological Integrity", "MCQ", 3,
    "An LPN is caring for a patient with Type 2 diabetes who presents with extreme thirst, polyuria, blood glucose of 680 mg/dL, serum osmolality of 340 mOsm/kg, and no ketonuria. The patient is drowsy but responsive. Which condition does the LPN suspect?",
    [O("A","Diabetic ketoacidosis (DKA)"), O("B","Hyperosmolar hyperglycemic state (HHS)"), O("C","Hypoglycemia"), O("D","Addisonian crisis")],
    ["B"],
    "Hyperosmolar Hyperglycemic State (HHS), formerly known as HHNK (hyperosmolar hyperglycemic nonketotic coma), is a life-threatening complication of Type 2 diabetes characterized by: (1) extremely elevated blood glucose (often > 600 mg/dL), (2) hyperosmolality (serum osmolality > 320 mOsm/kg), (3) profound dehydration from osmotic diuresis, (4) ABSENCE of significant ketonuria or ketonemia (which distinguishes it from DKA), and (5) altered mental status ranging from confusion to coma. HHS occurs because the patient produces enough insulin to prevent lipolysis and ketone formation (unlike DKA where absolute insulin deficiency leads to ketogenesis) but not enough to prevent hyperglycemia. The extreme hyperglycemia causes osmotic diuresis (polyuria), leading to severe dehydration and electrolyte imbalances. Treatment involves aggressive IV fluid resuscitation (priority), insulin therapy (lower doses than DKA), electrolyte replacement (especially potassium), and identification/treatment of the precipitating cause. HHS has a higher mortality rate than DKA (10-20% vs 1-5%) partly because patients are typically older with more comorbidities and present later in the disease course. DKA (option A) would present with ketonuria, metabolic acidosis, and Kussmaul respirations. Hypoglycemia (option C) would have a LOW blood glucose. Addisonian crisis (option D) involves cortisol deficiency with different clinical features.",
    "HHS differentiator: very high glucose (>600), high osmolality (>320), NO ketones, altered mental status; occurs in Type 2 DM; higher mortality than DKA",
    "HHS vs DKA: HHS = no ketones, higher glucose, more dehydration, Type 2 DM; DKA = ketones, acidosis, Kussmaul breathing, often Type 1 DM",
    "HHS can be confused with DKA; the KEY differentiator is the ABSENCE of significant ketones in HHS",
    { A: "DKA presents with ketonuria, metabolic acidosis, and typically glucose levels of 250-600 mg/dL; this patient has no ketonuria", C: "Hypoglycemia would present with low blood glucose (<70 mg/dL), not the extremely elevated glucose seen here", D: "Addisonian crisis involves cortisol deficiency with different presentations including hypotension, hyperkalemia, and hyponatremia" },
    ["diabetes", "HHS", "hyperglycemia", "emergency", "Type-2-diabetes", "dehydration"]
  ));

  questions.push(rpnUS("Psychosocial Integrity", "Grief and Loss", "Psychosocial Integrity", "MCQ", 2,
    "An LPN is caring for a patient who was recently told their cancer is terminal. The patient says, 'If I could just make it to my daughter's wedding next month, I would accept anything after that.' According to Kubler-Ross, which stage of grief is the patient demonstrating?",
    [O("A","Denial"), O("B","Anger"), O("C","Bargaining"), O("D","Acceptance")],
    ["C"],
    "Elisabeth Kubler-Ross described five stages of grief: Denial ('This can't be happening'), Anger ('Why is this happening to me?'), Bargaining ('If I could just...'), Depression (deep sadness and withdrawal), and Acceptance (coming to terms with the reality). This patient is in the BARGAINING stage, characterized by 'if only' or 'what if' statements and attempts to negotiate for more time, often with a higher power. The patient is making a conditional agreement: 'If I can just make it to my daughter's wedding' (the bargain), 'I would accept anything after that' (the concession). Bargaining is a coping mechanism that allows the individual to maintain hope while beginning to process the reality of the situation. The nurse should: (1) acknowledge the patient's feelings without judgment, (2) support the patient's hope while being honest, (3) help facilitate connections with family and spiritual support if desired, (4) avoid dismissing or correcting the patient's bargaining statements, and (5) assess for readiness to discuss advance care planning. Denial (option A) would involve refusing to believe the diagnosis. Anger (option B) would involve hostility and resentment. Acceptance (option D) would involve peaceful acknowledgment without conditions.",
    "Kubler-Ross stages: Denial, Anger, Bargaining, Depression, Acceptance; not all patients progress linearly through all stages",
    "Look for key language cues: 'If only' or 'If I could just' = Bargaining; 'Why me?' = Anger; 'It can't be true' = Denial",
    "The five stages are NOT linear; patients may skip stages, revisit stages, or experience multiple stages simultaneously",
    { A: "Denial involves refusing to acknowledge the diagnosis; this patient acknowledges the terminal prognosis and is negotiating for more time", B: "Anger involves hostility, resentment, and questioning 'Why me?'; this patient is not expressing anger but rather making a conditional agreement", D: "Acceptance involves coming to terms with the situation without conditions; this patient is setting a condition (making it to the wedding)" },
    ["psychosocial", "grief", "Kubler-Ross", "terminal-illness", "therapeutic-communication"]
  ));

  questions.push(rpnUS("Health Promotion and Maintenance", "Screening Guidelines", "Health Promotion & Maintenance", "MCQ", 2,
    "An LPN is providing health education to a 50-year-old patient with no family history of colorectal cancer. According to the US Preventive Services Task Force (USPSTF) guidelines, when should the patient begin routine colorectal cancer screening?",
    [O("A","At age 40"), O("B","At age 45"), O("C","At age 50"), O("D","At age 55")],
    ["B"],
    "The US Preventive Services Task Force (USPSTF) updated their colorectal cancer screening recommendations in 2021, lowering the recommended age to begin screening from 50 to 45 years for average-risk adults. Screening should continue until age 75, with individualized decision-making for ages 76-85. Recommended screening methods include: stool-based tests (fecal immunochemical test [FIT] annually, high-sensitivity guaiac fecal occult blood test [gFOBT] annually, or multi-target stool DNA test [mt-sDNA/Cologuard] every 1-3 years) and direct visualization tests (colonoscopy every 10 years, CT colonography every 5 years, or flexible sigmoidoscopy every 5-10 years). For this 50-year-old patient with no family history, they should have already begun screening at age 45. The LPN should educate the patient about the importance of screening and facilitate referral for appropriate testing. Patients with increased risk factors (family history of colorectal cancer or polyps, inflammatory bowel disease, hereditary syndromes) should begin screening earlier and/or more frequently, as recommended by their healthcare provider.",
    "USPSTF 2021: colorectal cancer screening begins at age 45 for average-risk adults, continues to age 75; colonoscopy every 10 years or annual FIT",
    "Know the updated 2021 USPSTF guideline: colorectal screening now starts at 45, not 50; this change is frequently tested",
    "The previous recommendation was age 50; the 2021 update lowered it to 45 due to increasing incidence of colorectal cancer in younger adults",
    { A: "Age 40 is earlier than recommended for average-risk adults without family history", C: "Age 50 was the previous recommendation; USPSTF updated to age 45 in 2021", D: "Age 55 would delay screening beyond the recommended starting age" },
    ["health-promotion", "cancer-screening", "colorectal", "USPSTF", "preventive-care"]
  ));

  questions.push(rpnUS("Safe and Effective Care Environment", "Patient Identification", "Safe & Effective Care Environment", "MCQ", 1,
    "An LPN is preparing to administer a blood transfusion. Which method of patient identification meets The Joint Commission's National Patient Safety Goals?",
    [O("A","Asking the patient their name only"), O("B","Checking the patient's room number against the blood product label"), O("C","Using two patient identifiers: verifying the patient's name and date of birth against the identification band and blood product label"), O("D","Verifying the patient's identity with the nursing assistant who admits them")],
    ["C"],
    "The Joint Commission's National Patient Safety Goals (NPSG) require the use of at least TWO patient identifiers before performing any procedure, administering medications, or transfusing blood products. Acceptable identifiers include: patient's full legal name, date of birth, medical record number, social security number (last 4 digits), or patient photograph. Room number is NEVER an acceptable identifier because patients may change rooms, and multiple patients may share rooms. For blood transfusion specifically, the verification process is even more stringent: two licensed healthcare providers must independently verify the patient's identity against the blood product label, checking: patient name, date of birth, medical record number, blood type and Rh factor, unit number, and expiration date. This two-person verification is required because transfusion of ABO-incompatible blood can cause a fatal hemolytic reaction. Asking only the patient's name (option A) provides only one identifier, which is insufficient. Room number (option B) is never an acceptable identifier. Relying on another person's verbal confirmation (option D) does not meet the standard for independent verification.",
    "TWO patient identifiers required for all procedures; room number is NEVER an acceptable identifier; blood transfusions require two-nurse verification",
    "Patient identification questions: the correct answer always uses at least TWO identifiers; room number is NEVER correct",
    "Room number is NEVER a valid patient identifier because patients change rooms; this is the most common incorrect answer on patient safety questions",
    { A: "One identifier (name only) does not meet the minimum standard of two identifiers", B: "Room number is never an acceptable patient identifier per Joint Commission standards", D: "Verbal confirmation from another staff member does not meet the standard for independent verification with two identifiers" },
    ["patient-safety", "patient-identification", "blood-transfusion", "Joint-Commission", "NPSG"]
  ));

  // =============== NCLEX-RN QUESTIONS ===============

  questions.push(rnBOTH("Pharmacology", "Drug Interactions", "Physiological Integrity", "MCQ", 4,
    "An RN is reviewing a patient's medication list and notes the patient is taking warfarin 5 mg daily and has been started on trimethoprim-sulfamethoxazole (Bactrim) for a urinary tract infection. Which action should the RN take?",
    [O("A","Administer both medications as ordered; there is no interaction"), O("B","Notify the prescriber about the potential interaction; Bactrim inhibits warfarin metabolism and can significantly increase INR and bleeding risk"), O("C","Hold the warfarin until the antibiotic course is completed"), O("D","Administer the medications 4 hours apart to prevent interaction")],
    ["B"],
    "Trimethoprim-sulfamethoxazole (TMP-SMX, Bactrim) is a well-documented significant drug interaction with warfarin. TMP-SMX inhibits the cytochrome P450 enzyme CYP2C9, which is the primary enzyme responsible for warfarin metabolism. When CYP2C9 is inhibited, warfarin is metabolized more slowly, leading to elevated warfarin levels, prolonged prothrombin time, and significantly increased INR - potentially resulting in serious or fatal hemorrhage. This interaction is classified as highly clinically significant. The RN must notify the prescriber so they can: (1) consider an alternative antibiotic that does not interact with warfarin, (2) if Bactrim must be used, reduce the warfarin dose empirically, (3) order more frequent INR monitoring (every 2-3 days during antibiotic therapy and for 1-2 weeks after completion), and (4) educate the patient about signs of bleeding. Simply administering both medications (option A) ignores a dangerous interaction. Holding warfarin entirely (option C) puts the patient at risk for thromboembolic events. Spacing the medications (option D) does not prevent the interaction because the mechanism is enzymatic inhibition, not physical drug binding in the gut.",
    "Bactrim (TMP-SMX) potentiates warfarin by inhibiting CYP2C9; other common potentiators: metronidazole, fluconazole, amiodarone, NSAIDs",
    "For drug interaction questions, know the CYP450 interactions: inhibitors increase drug levels (bleeding risk with warfarin), inducers decrease levels (loss of therapeutic effect)",
    "Spacing medications 4 hours apart does NOT prevent CYP450-mediated interactions; the mechanism is enzymatic, not absorption-based",
    { A: "There IS a clinically significant interaction; administering both without action puts the patient at serious bleeding risk", C: "Holding warfarin entirely risks thromboembolic events; dose adjustment and monitoring is preferred", D: "Spacing does not prevent CYP450-mediated interactions; the interaction occurs at the hepatic metabolism level, not GI absorption" },
    ["pharmacology", "drug-interaction", "warfarin", "Bactrim", "CYP450", "patient-safety"]
  ));

  questions.push(rnBOTH("Medical-Surgical Nursing", "Chest Pain Assessment", "Physiological Integrity", "MCQ", 3,
    "An RN is caring for a patient who presents with sudden onset substernal chest pain radiating to the left arm and jaw. The patient is diaphoretic, nauseated, and rates the pain as 9/10. The ECG shows ST-segment elevation in leads II, III, and aVF. Which coronary artery is MOST likely occluded?",
    [O("A","Left anterior descending (LAD) artery"), O("B","Right coronary artery (RCA)"), O("C","Left circumflex artery (LCx)"), O("D","Left main coronary artery")],
    ["B"],
    "ST-segment elevation in leads II, III, and aVF indicates an INFERIOR myocardial infarction (STEMI), which is most commonly caused by occlusion of the right coronary artery (RCA). The RCA supplies blood to the inferior wall of the left ventricle, the right ventricle, and importantly, the SA node (in 60% of people) and AV node (in 90% of people). ECG lead territory correlates with coronary arteries: INFERIOR (II, III, aVF) = Right Coronary Artery; ANTERIOR (V1-V4) = Left Anterior Descending; LATERAL (I, aVL, V5-V6) = Left Circumflex; SEPTAL (V1-V2) = Left Anterior Descending (septal branches). Because the RCA supplies the conduction system, inferior MIs commonly present with bradycardia and heart blocks (AV blocks). The nurse should monitor for: bradycardia, hypotension (especially right ventricular infarction), heart blocks, and signs of right ventricular failure. The mnemonic for MI assessment is MONA (although current guidelines have modified this): Morphine (if pain persists), Oxygen (only if SpO2 < 94%), Nitroglycerin (sublingual), and Aspirin (325 mg chewed). Emergent interventions include cardiac catheterization with percutaneous coronary intervention (PCI) or thrombolytic therapy if PCI is not available within 120 minutes.",
    "Inferior MI (leads II, III, aVF) = Right Coronary Artery; Anterior MI (V1-V4) = LAD; Lateral MI (I, aVL, V5-V6) = Left Circumflex",
    "Match ECG lead groups to coronary arteries: inferior leads = RCA, anterior leads = LAD, lateral leads = LCx; this is a high-yield exam topic",
    "Inferior MIs from RCA occlusion often cause bradycardia and AV blocks because the RCA supplies the SA and AV nodes",
    { A: "LAD occlusion causes anterior MI with ST elevation in V1-V4, not the inferior leads II, III, aVF", C: "Left circumflex occlusion causes lateral MI with ST elevation in I, aVL, V5-V6", D: "Left main occlusion would cause widespread ST changes and is typically rapidly fatal" },
    ["cardiac", "STEMI", "myocardial-infarction", "ECG", "coronary-arteries", "emergency"]
  ));

  questions.push(rnBOTH("Hematology & Oncology", "Neutropenic Precautions", "Physiological Integrity", "SATA", 3,
    "An RN is caring for a patient receiving chemotherapy whose absolute neutrophil count (ANC) is 400 cells/mm3. Which interventions should the RN implement? (Select all that apply.)",
    [O("A","Place the patient in a private room with strict hand hygiene for all visitors"), O("B","Avoid fresh fruits, raw vegetables, and fresh flowers in the patient's room"), O("C","Administer a live virus vaccine to boost the patient's immune system"), O("D","Monitor temperature every 4 hours and report any temperature of 100.4°F (38°C) or higher immediately"), O("E","Encourage the patient to perform daily rectal temperature measurements for accuracy"), O("F","Avoid invasive procedures when possible; no rectal thermometers, suppositories, or enemas")],
    ["A", "B", "D", "F"],
    "An ANC of 400 cells/mm3 indicates severe neutropenia (ANC < 500 = severe; ANC 500-1000 = moderate; ANC 1000-1500 = mild). Neutropenia places the patient at extreme risk for life-threatening infections because neutrophils are the primary defense against bacterial and fungal pathogens. Neutropenic precautions include: (1) PRIVATE ROOM with strict hand hygiene - hand hygiene is the single most important infection prevention measure; all visitors must wash hands and be screened for illness. (2) NEUTROPENIC DIET (low-microbial diet) - avoiding raw/uncooked foods, fresh flowers and plants (harbor Aspergillus and other fungi), standing water, and unpasteurized products to reduce microbial exposure. (3) TEMPERATURE MONITORING every 4 hours with immediate reporting of fever ≥100.4°F (38°C), as fever in a neutropenic patient is a medical emergency requiring blood cultures and empiric broad-spectrum antibiotics within 1 hour. (4) AVOID INVASIVE PROCEDURES - no rectal thermometers, suppositories, or enemas (risk of mucosal damage creating a portal of entry for bacteria); no unnecessary venipunctures; meticulous oral care with soft toothbrush. Live virus vaccines (option C) are CONTRAINDICATED in immunosuppressed patients as they can cause the disease they are meant to prevent. Rectal temperature measurement (option E) is contraindicated due to risk of mucosal trauma and bacteremia.",
    "ANC < 500 = severe neutropenia = medical emergency if fever develops; fever (≥38°C) requires blood cultures and antibiotics within 1 hour",
    "For neutropenic precautions SATA: select private room, neutropenic diet, temperature monitoring, and avoiding invasive procedures; live vaccines and rectal temps are always wrong",
    "Fever in neutropenia may be the ONLY sign of life-threatening infection because neutrophils are needed to produce the inflammatory signs (redness, swelling, pus) we normally see",
    { C: "Live virus vaccines are absolutely CONTRAINDICATED in immunosuppressed/neutropenic patients; they can cause disseminated disease", E: "Rectal thermometers are CONTRAINDICATED in neutropenic patients; mucosal trauma can introduce bacteria into the bloodstream, causing life-threatening bacteremia" },
    ["hematology", "oncology", "neutropenia", "chemotherapy", "infection-prevention", "patient-safety"]
  ));

  questions.push(rnBOTH("Emergency & Trauma Nursing", "Trauma Assessment", "Physiological Integrity", "MCQ", 3,
    "An RN in the emergency department is performing a primary survey on a trauma patient. Using the ABCDE approach, the nurse assesses the airway first. The patient is unconscious with blood pooling in the oropharynx. What is the priority intervention?",
    [O("A","Perform a head-tilt chin-lift manoeuvre to open the airway"), O("B","Suction the oropharynx and perform a jaw-thrust manoeuvre with cervical spine stabilization"), O("C","Insert an oropharyngeal airway without suctioning first"), O("D","Begin chest compressions immediately")],
    ["B"],
    "In trauma assessment, the primary survey follows the ABCDE approach: Airway (with cervical spine protection), Breathing, Circulation, Disability (neurological), and Exposure. For this unconscious trauma patient with blood in the oropharynx, the priority is to establish a patent airway while maintaining cervical spine immobilization (all trauma patients are treated as having a potential cervical spine injury until ruled out by imaging). The correct sequence is: (1) SUCTION the oropharynx to clear blood and secretions that could cause aspiration, (2) perform a JAW-THRUST manoeuvre (NOT head-tilt chin-lift) because the jaw-thrust opens the airway without moving the cervical spine. The head-tilt chin-lift (option A) is CONTRAINDICATED in trauma because it hyperextends the neck and could worsen a cervical spine injury. (3) Maintain in-line cervical spine stabilization with a cervical collar and manual support. Inserting an OPA without suctioning first (option C) risks pushing debris deeper and could cause vomiting. Chest compressions (option D) are for cardiac arrest; the primary survey has not yet progressed to circulation assessment. After securing the airway, the RN continues with Breathing assessment (breath sounds, chest wall integrity, oxygen saturation), then Circulation (hemorrhage control, IV access, fluid resuscitation), Disability (GCS, pupil response), and Exposure (undress patient to find all injuries while preventing hypothermia).",
    "Trauma airway management: jaw-thrust (not head-tilt chin-lift) + cervical spine immobilization + suction BEFORE inserting airway devices",
    "In trauma, ALWAYS assume cervical spine injury until cleared; jaw-thrust is the only acceptable airway manoeuvre for trauma patients",
    "Head-tilt chin-lift is CONTRAINDICATED in trauma; it hyperextends the cervical spine and can worsen spinal cord injuries",
    { A: "Head-tilt chin-lift hyperextends the cervical spine and is CONTRAINDICATED in trauma patients due to potential spinal cord injury", C: "Inserting an OPA without suctioning first risks pushing debris deeper into the airway and can trigger vomiting in a patient with a gag reflex", D: "Chest compressions are for cardiac arrest; the ABCDE approach requires airway management first, and there is no indication of cardiac arrest" },
    ["emergency", "trauma", "ABCDE", "airway-management", "cervical-spine", "jaw-thrust"]
  ));

  questions.push(rnBOTH("Community & Public Health", "Communicable Disease Reporting", "Safe & Effective Care Environment", "MCQ", 2,
    "An RN in a community health clinic diagnoses a patient with active pulmonary tuberculosis (TB). Which action is required by law?",
    [O("A","Report the case to the local public health department for contact tracing and disease surveillance"), O("B","Keep the information confidential; TB is not a reportable disease"), O("C","Report only if the patient refuses treatment"), O("D","Notify the patient's employer directly about the TB diagnosis")],
    ["A"],
    "Active pulmonary tuberculosis is a mandatory reportable disease in all US states and Canadian provinces/territories. Healthcare providers are required BY LAW to report confirmed or suspected cases of TB to the local public health department within a specified timeframe (usually 24 hours to 7 days depending on jurisdiction). The public health department then initiates: (1) contact investigation - identifying and screening individuals who had close contact with the infectious patient, (2) disease surveillance - tracking TB cases to monitor trends, detect outbreaks, and guide public health interventions, (3) directly observed therapy (DOT) - ensuring the patient completes the full treatment course (typically 6-9 months of multiple anti-TB medications including isoniazid, rifampin, pyrazinamide, and ethambutol), and (4) infection control measures - ensuring the patient is on appropriate isolation until sputum cultures convert to negative. This reporting is a legal requirement that supersedes patient confidentiality in the interest of public health protection. TB is not the only reportable disease; others include measles, hepatitis, HIV/AIDS, foodborne illness (Salmonella, E. coli), and sexually transmitted infections (gonorrhoea, syphilis, chlamydia). The patient's employer should NOT be notified directly by the healthcare provider (option D); this would violate patient privacy. The public health department may coordinate workplace exposure investigation if needed.",
    "TB is a MANDATORY reportable disease; the nurse is legally required to report to the public health department regardless of patient consent",
    "Reportable disease questions: the correct answer involves reporting to public health authorities; mandatory reporting supersedes patient confidentiality for public safety",
    "Mandatory reporting does NOT violate confidentiality; it is a legal exception to privacy rules specifically designed to protect public health",
    { B: "TB IS a mandatory reportable disease in all US states and Canadian provinces; failure to report can result in legal consequences for the healthcare provider", C: "TB must be reported regardless of whether the patient accepts or refuses treatment; reporting is based on diagnosis, not treatment compliance", D: "Notifying the employer directly violates patient privacy; the public health department coordinates any workplace investigations" },
    ["community-health", "TB", "reportable-disease", "public-health", "contact-tracing", "legal"]
  ));

  questions.push(rnBOTH("Evidence-Based Practice", "Research Utilization", "Safe & Effective Care Environment", "MCQ", 3,
    "An RN wants to implement a new evidence-based practice for reducing catheter-associated urinary tract infections (CAUTI) on the unit. Which is the strongest level of evidence to support this practice change?",
    [O("A","Expert opinion from a senior nurse with 30 years of experience"), O("B","A single randomized controlled trial (RCT) with positive results"), O("C","A systematic review and meta-analysis of multiple randomized controlled trials"), O("D","A case study describing successful CAUTI reduction on one unit")],
    ["C"],
    "The hierarchy of evidence ranks research evidence from strongest to weakest: Level I (strongest): Systematic review and meta-analysis of multiple RCTs - this combines data from multiple high-quality studies, reducing bias and increasing statistical power. Level II: Single well-designed RCT. Level III: Controlled trials without randomization (quasi-experimental). Level IV: Cohort studies and case-control studies. Level V: Systematic reviews of descriptive and qualitative studies. Level VI: Single descriptive or qualitative studies. Level VII (weakest): Expert opinion. A systematic review with meta-analysis (option C) is the strongest because it synthesizes evidence from multiple independent studies, reduces the impact of individual study bias, increases the sample size through pooling, and provides a quantitative estimate of the overall effect. A single RCT (option B) is strong but represents only one study with one population. Expert opinion (option A), while valuable for clinical experience, is the weakest level of evidence because it is subjective and may not be generalizable. A case study (option D) describes a single instance and cannot establish causality. The RN should use the strongest available evidence to support practice changes, following the EBP process: ask a clinical question (PICO format), search for the best evidence, critically appraise the evidence, integrate it with clinical expertise and patient preferences, and evaluate outcomes.",
    "Evidence hierarchy: systematic review/meta-analysis (strongest) > RCT > cohort study > case study > expert opinion (weakest)",
    "For evidence hierarchy questions, systematic reviews/meta-analyses of RCTs are ALWAYS the strongest level; expert opinion is ALWAYS the weakest",
    "A single RCT, while strong, is NOT the strongest level of evidence; systematic reviews that combine multiple RCTs are stronger",
    { A: "Expert opinion, regardless of experience, is the weakest level of evidence in the hierarchy", B: "A single RCT is Level II evidence; a systematic review combining multiple RCTs (Level I) is stronger", D: "A case study is descriptive evidence (Level VI); it describes one situation and cannot establish causality or generalizability" },
    ["evidence-based-practice", "research", "evidence-hierarchy", "systematic-review", "quality-improvement"]
  ));

  questions.push(rnBOTH("Immune & Infectious Disease", "HIV Management", "Physiological Integrity", "MCQ", 3,
    "An RN is providing education to a newly diagnosed HIV-positive patient about their antiretroviral therapy (ART). The patient's CD4 count is 320 cells/mm3 and viral load is 45,000 copies/mL. Which statement by the patient indicates correct understanding?",
    [O("A","'I only need to take the medication when I feel sick or have symptoms.'"), O("B","'I need to take my antiretroviral medications consistently every day to suppress the virus and prevent drug resistance.'"), O("C","'Once my viral load becomes undetectable, I can stop taking the medication permanently.'"), O("D","'I should stop the medication if I experience any side effects.'")],
    ["B"],
    "Current HIV treatment guidelines recommend initiating antiretroviral therapy (ART) for ALL individuals diagnosed with HIV, regardless of CD4 count, as early treatment improves outcomes and reduces transmission. The cornerstone of ART adherence education includes: (1) DAILY CONSISTENT USE is essential - ART must be taken every day, at the same time, to maintain therapeutic drug levels. HIV replicates rapidly (billions of new virions daily), and inconsistent dosing allows the virus to develop resistance mutations. (2) ART does NOT cure HIV - it suppresses viral replication to undetectable levels, allowing immune reconstitution (CD4 count recovery) and preventing AIDS-defining illnesses. Even when the viral load becomes undetectable, the virus persists in reservoirs (latently infected CD4 cells) and will rebound if ART is stopped. (3) 'Undetectable = Untransmittable' (U=U) - when viral load is consistently undetectable, the risk of sexual transmission is effectively zero, but this only applies if ART adherence is maintained. (4) Side effects should be reported but NOT used as a reason to independently stop medication; the provider can adjust the regimen. Drug resistance from non-adherence limits future treatment options and can be transmitted to others. Option A promotes intermittent dosing which leads to resistance. Option C suggests stopping after undetectable status, which would cause viral rebound. Option D encourages stopping for side effects without provider guidance.",
    "ART adherence must be >95% to prevent resistance; undetectable viral load requires CONTINUED treatment, not discontinuation",
    "HIV medication teaching questions: the correct answer emphasizes DAILY CONSISTENT use and LIFELONG treatment; stopping or intermittent use is always wrong",
    "An undetectable viral load does NOT mean the patient is cured; HIV persists in latent reservoirs and will rebound if ART is stopped",
    { A: "ART must be taken consistently every day regardless of symptoms; intermittent dosing promotes drug resistance", C: "An undetectable viral load requires continued lifelong ART; stopping allows viral rebound from latent reservoirs", D: "Side effects should be reported to the provider who can adjust the regimen; independently stopping ART risks viral resistance" },
    ["infectious-disease", "HIV", "ART", "adherence", "patient-education", "viral-load"]
  ));

  questions.push(rnBOTH("Musculoskeletal", "Hip Fracture Post-Op", "Physiological Integrity", "MCQ", 3,
    "An RN is caring for a patient who had a total hip replacement (posterior approach) 1 day ago. Which position should the RN AVOID placing the patient in?",
    [O("A","Supine with an abduction pillow between the legs"), O("B","Side-lying on the operative side with legs crossed and hip flexed beyond 90 degrees"), O("C","Semi-Fowler's position with legs slightly abducted"), O("D","Supine with the operative leg in neutral alignment")],
    ["B"],
    "After a posterior approach total hip replacement (arthroplasty), hip precautions must be maintained to prevent prosthetic hip dislocation. The posterior approach involves cutting through the posterior hip capsule and external rotators, making the hip vulnerable to dislocation in certain positions. The three movements to AVOID are: (1) hip FLEXION beyond 90 degrees (no bending forward past 90 degrees, no sitting on low chairs, no bending to tie shoes), (2) ADDUCTION past midline (no crossing legs, no turning the operative leg inward), and (3) INTERNAL ROTATION (no pointing toes inward on the operative side). Option B violates ALL three precautions: lying on the operative side with legs crossed (adduction) and hip flexed beyond 90 degrees (excessive flexion) creates maximum dislocation risk. An abduction pillow (option A) keeps the legs separated and is a standard intervention to maintain proper alignment. Semi-Fowler's with slight abduction (option C) maintains the hip at less than 90 degrees of flexion with proper abduction. Neutral alignment (option D) is the correct resting position. The RN should educate the patient about hip precautions that must be maintained for 6-12 weeks postoperatively (per surgeon's instructions) and ensure the patient demonstrates understanding before discharge.",
    "Posterior approach hip precautions: NO flexion >90 degrees, NO adduction past midline, NO internal rotation; use abduction pillow and raised toilet seat",
    "Total hip replacement questions: identify the surgical approach (posterior vs anterior) and match the precautions; posterior approach has MORE restrictions",
    "Anterior approach hip replacement has fewer precautions because the posterior structures remain intact; do not apply posterior precautions to anterior approaches",
    { A: "An abduction pillow maintains proper leg separation and is a standard intervention after posterior hip replacement", C: "Semi-Fowler's position maintains hip flexion under 90 degrees and slight abduction, both of which are appropriate", D: "Supine with neutral alignment is the correct resting position that avoids all restricted movements" },
    ["musculoskeletal", "hip-replacement", "post-operative", "hip-precautions", "patient-education"]
  ));

  questions.push(rnBOTH("Integumentary", "Burn Assessment", "Physiological Integrity", "MCQ", 4,
    "An RN is assessing a patient admitted with burns to the entire anterior trunk, both anterior arms, and the face. Using the Rule of Nines for an adult, what is the estimated total body surface area (TBSA) burned?",
    [O("A","18%"), O("B","27%"), O("C","36%"), O("D","45%")],
    ["C"],
    "The Rule of Nines is a rapid assessment tool for estimating the total body surface area (TBSA) affected by burns in adults. Each body region is assigned a percentage: Head and neck = 9%, Anterior trunk = 18%, Posterior trunk = 18%, Each entire arm = 9% (anterior 4.5% + posterior 4.5%), Each entire leg = 18% (anterior 9% + posterior 9%), Perineum = 1%. For this patient: Anterior trunk = 18%, Both anterior arms = 9% (4.5% x 2), Face (head) = 9%. Total TBSA = 18% + 9% + 9% = 36%. However, if only the anterior arms are burned (not the full circumference), the calculation uses 4.5% per arm: 18% + 4.5% + 4.5% + 9% = 36%. Burns greater than 20-25% TBSA in adults are considered major burns requiring fluid resuscitation using the Parkland formula: 4 mL x body weight (kg) x %TBSA burned, with half given in the first 8 hours from the time of injury and the remaining half over the next 16 hours. This patient with 36% TBSA requires aggressive fluid resuscitation, assessment for inhalation injury (facial burns are a red flag), continuous cardiac monitoring, pain management, and likely transfer to a burn centre. The Lund and Browder chart provides more accurate assessment, especially in children, by accounting for age-related body proportion differences.",
    "Rule of Nines: head 9%, each arm 9%, anterior trunk 18%, posterior trunk 18%, each leg 18%, perineum 1%; facial burns = suspect inhalation injury",
    "Rule of Nines: add up the affected regions; anterior trunk (18) + each arm (9) + head/face (9) = 36% for this scenario",
    "The Rule of Nines is for ADULTS only; children have proportionally larger heads and smaller legs, requiring the Lund and Browder chart",
    { A: "18% accounts for the anterior trunk only; the arms and face are also burned", B: "27% accounts for trunk and face but underestimates the arm involvement", D: "45% would overestimate the burned area in this scenario" },
    ["integumentary", "burns", "Rule-of-Nines", "TBSA", "fluid-resuscitation", "emergency"]
  ));

  questions.push(rnBOTH("Patient Education", "Discharge Teaching", "Health Promotion & Maintenance", "MCQ", 2,
    "An RN is providing discharge teaching to a patient who had a myocardial infarction and will be going home on aspirin, metoprolol, lisinopril, and atorvastatin. The patient asks why they need to take so many medications. Which explanation is MOST appropriate?",
    [O("A","'Your doctor ordered them, so you should just take them as directed without questioning.'"), O("B","'Each medication targets a different aspect of heart protection: aspirin prevents blood clots, metoprolol slows your heart to reduce workload, lisinopril protects your heart from remodeling, and atorvastatin lowers cholesterol to prevent plaque buildup.'"), O("C","'You only need to take them for a few weeks until your heart heals completely.'"), O("D","'These are standard medications; everyone who has a heart attack takes the same ones.'")],
    ["B"],
    "Post-MI cardiac medications are often referred to as 'ABCD' therapy: Aspirin/Antiplatelet (prevents platelet aggregation and clot formation at the site of coronary artery damage), Beta-blocker (metoprolol reduces heart rate, blood pressure, and myocardial oxygen demand, decreasing the risk of reinfarction and sudden cardiac death), ACE inhibitor (lisinopril prevents ventricular remodeling by blocking the renin-angiotensin-aldosterone system, reduces afterload, and improves cardiac output), and Statin (atorvastatin lowers LDL cholesterol, stabilizes atherosclerotic plaques, and has anti-inflammatory effects that reduce cardiovascular risk). The RN's explanation (option B) demonstrates the teach-back method of patient education by explaining the purpose of EACH medication in understandable language. This promotes medication adherence because patients who understand WHY they take medications are more likely to comply. Telling the patient not to question (option A) is paternalistic and fails to support informed decision-making. Suggesting short-term use (option C) is incorrect; these medications are typically lifelong. Generalizing (option D) does not address the patient's specific concern about medication burden.",
    "Post-MI medications: ABCD = Aspirin, Beta-blocker, ACE inhibitor (or ARB), and statin (cholesterol Drug); all are typically lifelong",
    "For medication teaching questions, the best answer explains the PURPOSE of each medication in patient-friendly language; patients understand 'why' = better adherence",
    "Post-MI medications are typically LIFELONG, not temporary; patients should understand they will likely take these indefinitely",
    { A: "Telling patients not to question their medications violates informed consent principles and undermines the therapeutic relationship", C: "Post-MI cardiac medications are typically lifelong therapies, not short-term treatments", D: "While the medications are standard, the explanation should be individualized to the patient's specific situation and learning needs" },
    ["patient-education", "cardiac-rehabilitation", "post-MI", "medication-adherence", "discharge-teaching"]
  ));

  questions.push(rnBOTH("Quality Improvement", "Sentinel Events", "Safe & Effective Care Environment", "MCQ", 3,
    "An RN is the charge nurse when a patient falls and sustains a hip fracture while in the hospital. Under The Joint Commission's classification, this event is considered a:",
    [O("A","Near miss that does not require reporting"), O("B","Sentinel event requiring a root cause analysis within a specified timeframe"), O("C","Expected outcome of hospitalization for elderly patients"), O("D","Minor adverse event requiring only documentation in the incident report")],
    ["B"],
    "A sentinel event, as defined by The Joint Commission, is an unexpected occurrence involving death or serious physical or psychological injury, or the risk thereof. The term 'sentinel' signals the need for immediate investigation and response. A patient fall resulting in a hip fracture meets the criteria for a sentinel event because it represents serious physical harm that was unexpected and not part of the natural course of the patient's illness. When a sentinel event occurs, the organization is required to: (1) provide appropriate care for the affected patient, (2) notify the patient and family, (3) conduct a thorough ROOT CAUSE ANALYSIS (RCA) within a specified timeframe (typically 45 calendar days), (4) develop and implement an action plan to prevent recurrence, and (5) monitor the effectiveness of the action plan. The RCA should investigate system and process failures rather than focusing on individual blame. Common contributing factors for inpatient falls include: medication effects, environmental hazards, inadequate fall risk assessment, staffing levels, and failure to implement fall prevention protocols. A near miss (option A) involves no actual patient harm. Falls with fractures are never expected outcomes (option C). The severity of the outcome (hip fracture) elevates this beyond a minor adverse event (option D).",
    "Sentinel events = unexpected serious harm/death; require Root Cause Analysis (RCA) focused on SYSTEM failures, not individual blame",
    "Fall + fracture in hospital = sentinel event = RCA required; 'sentinel' means it signals a need for immediate, thorough investigation",
    "Sentinel events are NOT punitive; the focus is on system improvement through RCA, not on disciplining individual healthcare workers",
    { A: "A near miss involves no actual harm; this patient sustained a hip fracture, which is serious physical injury", C: "Patient falls with fractures are never expected outcomes of hospitalization; they represent failures in safety systems", D: "The severity of the outcome (hip fracture) classifies this as a sentinel event, which requires more than just documentation" },
    ["quality-improvement", "sentinel-event", "root-cause-analysis", "Joint-Commission", "patient-safety", "falls"]
  ));

  questions.push(rnBOTH("Cultural Competence", "Cultural Assessment", "Psychosocial Integrity", "MCQ", 2,
    "An RN is caring for a patient from a culture where direct eye contact with authority figures is considered disrespectful. During the assessment, the patient avoids eye contact and speaks softly. How should the RN interpret this behaviour?",
    [O("A","The patient is likely being dishonest or hiding information"), O("B","The patient is demonstrating culturally appropriate behaviour; the nurse should adapt communication style accordingly"), O("C","The patient is clinically depressed and needs a psychiatric referral"), O("D","The patient is uncooperative and does not want to participate in care")],
    ["B"],
    "Cultural competence in nursing requires understanding that communication norms vary significantly across cultures. In many cultures (including some Asian, Indigenous, Middle Eastern, and African cultures), avoiding direct eye contact with authority figures is a sign of RESPECT, not dishonesty, depression, or non-compliance. The RN should: (1) recognize this as culturally appropriate behaviour rather than pathologizing it, (2) adapt their communication style - perhaps sitting at the same level, allowing pauses, and not requiring eye contact, (3) use open-ended questions with patience for responses, (4) consider the need for a cultural liaison or interpreter if language barriers exist, and (5) build trust through consistent, respectful interactions. The nurse should avoid ethnocentrism (judging other cultures by the standards of one's own culture). The soft speaking voice may also be culturally normative and does not necessarily indicate depression or withdrawal. Cultural assessment tools (such as Giger and Davidhizar's Transcultural Assessment Model or Leininger's Sunrise Model) can guide the nurse in providing culturally congruent care. Making assumptions about dishonesty (option A), mental illness (option C), or non-cooperation (option D) based on culturally normative behaviour reflects cultural bias.",
    "Lack of eye contact, soft speech, and deference to authority may be cultural norms, not signs of dishonesty, depression, or non-cooperation",
    "Cultural competence questions: the correct answer respects cultural differences and adapts nursing practice accordingly; avoid ethnocentric interpretations",
    "Do not apply Western cultural norms (e.g., direct eye contact = honesty) universally; this reflects ethnocentrism and can damage the therapeutic relationship",
    { A: "Interpreting lack of eye contact as dishonesty reflects ethnocentrism and Western cultural bias", C: "Avoiding eye contact in many cultures is a sign of respect, not a symptom of depression", D: "The patient's behaviour reflects cultural norms, not non-cooperation; labelling it as uncooperative damages the therapeutic relationship" },
    ["cultural-competence", "communication", "diversity", "patient-centered-care", "assessment"]
  ));

  return questions;
}

async function main() {
  console.log("=== RPN & RN Question Bank Bulk Seeding ===\n");

  const beforeCounts = await pool.query(
    `SELECT tier, exam, COUNT(*)::int as count FROM exam_questions WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN') GROUP BY tier, exam ORDER BY tier, exam`
  );
  console.log("BEFORE counts:");
  for (const r of beforeCounts.rows) console.log(`  ${r.tier}/${r.exam}: ${r.count}`);

  const allQuestions = buildAllQuestions();
  console.log(`\nGenerated ${allQuestions.length} questions total`);

  let inserted = 0;
  let duplicates = 0;
  let errors = 0;

  for (const q of allQuestions) {
    const hash = stemHash(q.stem);
    try {
      const existing = await pool.query(
        `SELECT id FROM exam_questions WHERE stem_hash = $1 AND tier = $2 AND exam = $3 LIMIT 1`,
        [hash, q.tier, q.exam]
      );
      if (existing.rows.length > 0) {
        duplicates++;
        continue;
      }

      await pool.query(
        `INSERT INTO exam_questions (id, tier, exam, question_type, status, stem, options, correct_answer, rationale, difficulty, tags, body_system, topic, subtopic, region_scope, stem_hash, scenario, clinical_pearl, exam_strategy, clinical_trap, distractor_rationales, career_type, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, 'published', $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 'nursing', NOW(), NOW())`,
        [
          q.tier, q.exam, q.questionType, q.stem,
          JSON.stringify(q.options), JSON.stringify(q.correctAnswer),
          q.rationale, q.difficulty, q.tags, q.bodySystem,
          q.topic, q.subtopic, q.regionScope, hash,
          q.scenario, q.clinicalPearl, q.examStrategy,
          q.clinicalTrap, JSON.stringify(q.distractorRationales),
        ]
      );
      inserted++;
    } catch (err: any) {
      errors++;
      console.error(`  [ERROR]: ${err.message.substring(0, 100)}`);
    }
  }

  console.log(`\nInserted: ${inserted}, Duplicates: ${duplicates}, Errors: ${errors}`);

  console.log("\n--- Bulk publishing any non-published questions ---");
  const publishResult = await pool.query(
    `UPDATE exam_questions SET status = 'published', updated_at = NOW()
     WHERE tier IN ('rpn', 'rn') AND exam IN ('REx-PN', 'NCLEX-PN', 'NCLEX-RN')
     AND (status IS NULL OR status != 'published')`
  );
  console.log(`Published ${publishResult.rowCount} additional questions`);

  console.log("\n--- Deduplication ---");
  const dupeCheck = await pool.query(
    `SELECT stem_hash, tier, exam, COUNT(*)::int as cnt
     FROM exam_questions WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN')
     AND stem_hash IS NOT NULL GROUP BY stem_hash, tier, exam HAVING COUNT(*) > 1`
  );
  if (dupeCheck.rows.length > 0) {
    let removed = 0;
    for (const r of dupeCheck.rows) {
      const dupes = await pool.query(
        `SELECT id FROM exam_questions WHERE stem_hash = $1 AND tier = $2 AND exam = $3 ORDER BY created_at ASC`,
        [r.stem_hash, r.tier, r.exam]
      );
      const idsToDelete = dupes.rows.slice(1).map((d: any) => d.id);
      if (idsToDelete.length > 0) {
        await pool.query(`DELETE FROM exam_questions WHERE id = ANY($1)`, [idsToDelete]);
        removed += idsToDelete.length;
      }
    }
    console.log(`Removed ${removed} duplicate questions`);
  } else {
    console.log("No duplicates found");
  }

  console.log("\n=== FINAL COUNTS ===");
  const afterCounts = await pool.query(
    `SELECT tier, exam, status, COUNT(*)::int as count FROM exam_questions
     WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN')
     GROUP BY tier, exam, status ORDER BY tier, exam, status`
  );
  for (const r of afterCounts.rows) console.log(`  ${r.tier}/${r.exam}/${r.status}: ${r.count}`);

  const formatDist = await pool.query(
    `SELECT exam, question_type, COUNT(*)::int as count FROM exam_questions
     WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN')
     GROUP BY exam, question_type ORDER BY exam, count DESC`
  );
  console.log("\nFormat distribution:");
  for (const r of formatDist.rows) console.log(`  ${r.exam}: ${r.question_type} = ${r.count}`);

  const diffDist = await pool.query(
    `SELECT exam, difficulty, COUNT(*)::int as count FROM exam_questions
     WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN')
     GROUP BY exam, difficulty ORDER BY exam, difficulty`
  );
  console.log("\nDifficulty distribution:");
  for (const r of diffDist.rows) console.log(`  ${r.exam}: diff ${r.difficulty} = ${r.count}`);

  await pool.end();
  console.log("\n=== Done! ===");
}

main().catch(err => { console.error("Fatal:", err); process.exit(1); });
