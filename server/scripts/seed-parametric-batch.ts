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

const O = (l: string, t: string) => ({ label: l, text: t });

interface Q {
  tier: string; exam: string; qt: string; stem: string;
  options: { label: string; text: string }[]; ca: string[]; rat: string;
  diff: number; tags: string[]; topic: string; sub: string; rs: string;
  cp: string; es: string; ct: string; dr: Record<string, string>; bs: string;
}

function buildQuestions(): Q[] {
  const qs: Q[] = [];

  // ===== PARAMETRIC REx-PN GENERATORS =====

  // Vital sign interpretation across age groups
  const vitalScenarios = [
    { age: "newborn (12 hours old)", hr: "180 bpm", rr: "68 breaths/min", bp: "not measured", temp: "36.2°C axillary", concern: "tachypnea (RR > 60 in newborn) and borderline hypothermia", priority: "Assess for signs of respiratory distress (nasal flaring, grunting, retractions, cyanosis), provide skin-to-skin contact or radiant warmer for temperature regulation, and notify the physician about the tachypnea", wrong1: "These are normal vital signs for a newborn; no intervention needed", wrong2: "Administer oxygen at 10 L/min via face mask immediately", wrong3: "Prepare for immediate intubation based on the heart rate alone", rationale: "Normal newborn vital signs: HR 120-160 bpm (180 is tachycardic but may be from crying/activity), RR 30-60 breaths/min (68 exceeds normal, indicating tachypnea), Temperature 36.5-37.5°C (36.2 is slightly hypothermic). Newborn tachypnea (RR >60) requires assessment for respiratory distress syndrome, transient tachypnea of the newborn (TTN), pneumonia, or cardiac anomalies. Mild hypothermia in a newborn can worsen respiratory distress through increased oxygen consumption.", tags: ["vital-signs", "newborn", "tachypnea", "hypothermia", "neonatal"] },
    { age: "5-year-old child", hr: "140 bpm", rr: "32 breaths/min", bp: "88/50 mmHg", temp: "39.4°C", concern: "fever with compensatory tachycardia and tachypnea, borderline hypotension for age", priority: "Assess hydration status, administer antipyretics as ordered, initiate cooling measures, monitor for signs of sepsis or shock (altered mental status, prolonged capillary refill, mottled skin), and ensure IV access", wrong1: "All vital signs are within normal limits for this age group", wrong2: "Focus treatment on the blood pressure alone by starting vasopressors", wrong3: "Administer aspirin for the fever and send the child home", rationale: "Normal vital signs for a 5-year-old: HR 75-115 bpm, RR 20-25, BP systolic >70+(age×2)=80 mmHg. This child has tachycardia (140 bpm) and tachypnea (32/min) likely compensatory for the fever (39.4°C). The BP of 88/50 is at the lower limit (minimum systolic for age 5 = 80 mmHg). Fever increases HR by approximately 10 bpm per 1°C above 37°C. The nurse should assess for the source of fever and signs of decompensation. NEVER give aspirin to children under 18 due to Reye syndrome risk.", tags: ["vital-signs", "pediatric", "fever", "compensatory-tachycardia", "Reye-syndrome"] },
    { age: "78-year-old patient", hr: "48 bpm", rr: "14 breaths/min", bp: "96/54 mmHg", temp: "35.8°C", concern: "symptomatic bradycardia with hypotension and hypothermia in an elderly patient", priority: "Assess the patient's level of consciousness, check medication list for rate-controlling drugs (beta-blockers, calcium channel blockers, digoxin), obtain a 12-lead ECG, warm the patient gradually, and notify the physician immediately", wrong1: "These are normal age-related changes that require no intervention", wrong2: "Administer atropine 2 mg IV push without assessment or physician notification", wrong3: "Encourage the patient to exercise vigorously to increase their heart rate", rationale: "While heart rates may trend slightly lower in healthy elderly adults, a HR of 48 bpm combined with hypotension (96/54) and hypothermia (35.8°C) is clinically significant. Common causes of bradycardia in elderly patients include: medication effects (beta-blockers like metoprolol, calcium channel blockers like diltiazem, digoxin), sick sinus syndrome, AV heart blocks, hypothyroidism, and hypothermia. The combination of bradycardia + hypotension suggests the patient may be symptomatic and hemodynamically unstable. Hypothermia itself can cause bradycardia and should be corrected slowly. A 12-lead ECG will identify the rhythm and any conduction abnormalities.", tags: ["vital-signs", "geriatric", "bradycardia", "hypotension", "hypothermia", "ECG"] },
    { age: "32-year-old pregnant patient at 36 weeks gestation", hr: "92 bpm", rr: "18 breaths/min", bp: "152/98 mmHg", temp: "37.0°C", concern: "elevated blood pressure concerning for gestational hypertension or preeclampsia", priority: "Recheck the blood pressure in 15 minutes with proper technique (correct cuff size, patient resting, arm at heart level), assess for signs of preeclampsia (headache, visual changes, epigastric pain, facial edema, hyperreflexia), check urine for protein, and notify the obstetric provider", wrong1: "The blood pressure is elevated due to pregnancy and is considered normal", wrong2: "Administer a diuretic to reduce the blood pressure quickly", wrong3: "Advise the patient to reduce sodium intake and return for a checkup next month", rationale: "Gestational hypertension is defined as new-onset hypertension (≥140/90 mmHg) after 20 weeks of gestation without proteinuria. Preeclampsia adds proteinuria and/or other signs of organ dysfunction. With BP 152/98, this patient meets criteria for hypertension in pregnancy. The nurse must differentiate between gestational hypertension and preeclampsia through additional assessment. Preeclampsia warning signs include headache, visual disturbances (scotomata), epigastric or RUQ pain (liver involvement), and 3+ deep tendon reflexes with clonus. Diuretics are generally contraindicated in pregnancy as they reduce intravascular volume. This requires same-day evaluation, not a follow-up next month.", tags: ["vital-signs", "pregnancy", "gestational-hypertension", "preeclampsia", "prenatal"] },
  ];

  for (const vs of vitalScenarios) {
    qs.push({ tier: "rpn", exam: "REx-PN", qt: "MCQ", stem: `An RPN is assessing a ${vs.age}. The vital signs are: heart rate ${vs.hr}, respiratory rate ${vs.rr}, blood pressure ${vs.bp}, temperature ${vs.temp}. The RPN identifies the concern as ${vs.concern}. What is the priority action?`,
      options: [O("A", vs.wrong1), O("B", vs.priority), O("C", vs.wrong2), O("D", vs.wrong3)],
      ca: ["B"], rat: vs.rationale, diff: 3, tags: vs.tags, topic: "Vital Signs Assessment", sub: "Age-Specific Vital Signs", rs: "CA",
      cp: `Know age-specific vital sign ranges; ${vs.concern}`, es: "Compare vital signs to age-specific norms and identify the most concerning deviation",
      ct: "Do not apply adult normal ranges to pediatric or neonatal patients; each age group has specific parameters",
      dr: { A: "This misidentifies the significance of the vital signs for this age group", C: "This intervention is premature, excessive, or inappropriate without proper assessment", D: "This is dangerous, inappropriate, or ineffective for the situation" }, bs: "Physiological Integrity" });
  }

  // Medication calculation scenarios
  const calcScenarios = [
    { drug: "amoxicillin suspension", order: "250 mg PO q8h", available: "125 mg per 5 mL", answer: "10 mL", calc: "250 mg / 125 mg × 5 mL = 10 mL", wrong1: "5 mL", wrong2: "2.5 mL", wrong3: "20 mL", patient: "child with otitis media", tags: ["dosage-calculation", "amoxicillin", "oral-suspension", "pediatric"] },
    { drug: "heparin", order: "800 units/hour IV", available: "25,000 units in 500 mL D5W", answer: "16 mL/hour", calc: "25,000 units / 500 mL = 50 units/mL; 800 units/hour ÷ 50 units/mL = 16 mL/hour", wrong1: "8 mL/hour", wrong2: "32 mL/hour", wrong3: "50 mL/hour", patient: "patient with deep vein thrombosis", tags: ["dosage-calculation", "heparin", "IV-infusion", "anticoagulation"] },
    { drug: "morphine", order: "4 mg IV q4h PRN", available: "10 mg per mL", answer: "0.4 mL", calc: "4 mg / 10 mg/mL = 0.4 mL", wrong1: "0.04 mL", wrong2: "4 mL", wrong3: "1 mL", patient: "post-operative patient", tags: ["dosage-calculation", "morphine", "IV-push", "pain-management"] },
    { drug: "furosemide", order: "60 mg IV", available: "40 mg per 4 mL", answer: "6 mL", calc: "60 mg / 40 mg × 4 mL = 6 mL", wrong1: "4 mL", wrong2: "8 mL", wrong3: "3 mL", patient: "patient with heart failure", tags: ["dosage-calculation", "furosemide", "IV-push", "diuretic"] },
    { drug: "gentamicin", order: "5 mg/kg/day divided q8h for a 70 kg patient", available: "80 mg per 2 mL", answer: "approximately 2.9 mL per dose (116.7 mg per dose)", calc: "5 mg/kg × 70 kg = 350 mg/day; 350 mg ÷ 3 doses = 116.7 mg per dose; 116.7 mg ÷ (80 mg/2 mL) = 116.7/40 = 2.9 mL", wrong1: "2.0 mL per dose", wrong2: "4.4 mL per dose", wrong3: "8.75 mL per dose", patient: "patient with a serious gram-negative infection", tags: ["dosage-calculation", "gentamicin", "weight-based", "aminoglycoside"] },
    { drug: "insulin regular (Humulin R)", order: "6 units subcutaneous", available: "100 units per mL in a U-100 insulin syringe", answer: "0.06 mL (or 6 units on the insulin syringe)", calc: "6 units / 100 units per mL = 0.06 mL; on a U-100 insulin syringe, draw up to the 6-unit mark", wrong1: "0.6 mL", wrong2: "60 units on the syringe", wrong3: "6 mL", patient: "patient with type 1 diabetes", tags: ["dosage-calculation", "insulin", "subcutaneous", "diabetes"] },
  ];

  for (const cs of calcScenarios) {
    qs.push({ tier: "rpn", exam: "REx-PN", qt: "dosage-calculation", stem: `An RPN receives an order for ${cs.drug} ${cs.order} for a ${cs.patient}. The medication is available as ${cs.available}. How much should the RPN administer?`,
      options: [O("A", cs.wrong1), O("B", cs.answer), O("C", cs.wrong2), O("D", cs.wrong3)],
      ca: ["B"], rat: `Using dimensional analysis or the desired-over-have formula: ${cs.calc}. Always verify calculations with a second nurse for high-alert medications. Medication errors due to miscalculation can cause serious patient harm including overdose or therapeutic failure.`, diff: 2,
      tags: cs.tags, topic: "Medication Administration", sub: "Dosage Calculation", rs: "CA",
      cp: `Calculation: ${cs.calc}`, es: "Use D/H × Q formula: Desired dose ÷ Available dose × Quantity; always double-check with dimensional analysis",
      ct: "Pay close attention to units (mg vs mcg, mL vs L) and concentration format; unit conversion errors are the most common calculation mistakes",
      dr: { A: "Incorrect calculation; verify using the desired/have formula", C: "Incorrect calculation; check your math step by step", D: "Incorrect calculation; this would result in a significant overdose or underdose" }, bs: "Safe & Effective Care Environment" });
  }

  // Infectious disease isolation types
  const isolationScenarios = [
    { disease: "measles (rubeola)", precaution: "Airborne precautions", room: "negative-pressure isolation room (AIIR)", ppe: "N95 respirator for all healthcare workers entering the room; patient wears surgical mask during transport", wrong1: "Standard precautions only with hand hygiene", wrong2: "Contact precautions with gown and gloves", wrong3: "Droplet precautions with a surgical mask", reason: "Measles virus is transmitted via airborne nuclei (<5 micrometers) that remain suspended in the air for up to 2 hours after the infected person has left the room. The virus is one of the most contagious known pathogens (R0 of 12-18). Airborne precautions require a negative-pressure room to prevent viral spread to hallways, N95 respirators (surgical masks are insufficient for airborne particles), and the patient should wear a surgical mask during transport.", tags: ["measles", "airborne", "N95", "isolation", "highly-contagious"] },
    { disease: "Clostridioides difficile (C. diff) infection", precaution: "Contact precautions", room: "private room with dedicated equipment", ppe: "Gown and gloves; hand hygiene with SOAP AND WATER (not alcohol-based hand rub)", wrong1: "Standard precautions only", wrong2: "Airborne precautions with N95 respirator", wrong3: "Droplet precautions with surgical mask", reason: "C. difficile produces spores that are resistant to alcohol-based hand rubs, heat, and many common disinfectants. Contact precautions are required because the organism is transmitted by the fecal-oral route through contact with contaminated surfaces and equipment. The critical distinction is that SOAP AND WATER must be used for hand hygiene (not alcohol-based hand rub) because mechanical friction from handwashing physically removes the spores. Environmental cleaning must use sporicidal agents (bleach-based solutions with at least 1000 ppm chlorine). C. diff spores can survive on environmental surfaces for months.", tags: ["C-diff", "contact-precautions", "spores", "soap-water", "bleach"] },
    { disease: "bacterial meningitis (Neisseria meningitidis)", precaution: "Droplet precautions", room: "private room with door closed", ppe: "Surgical mask when within 1-2 metres of the patient; droplet precautions can be discontinued after 24 hours of effective antibiotic therapy", wrong1: "Standard precautions only", wrong2: "Airborne precautions with negative-pressure room", wrong3: "Contact precautions with gown and gloves only", reason: "Neisseria meningitidis (meningococcal meningitis) is transmitted via large respiratory droplets (>5 micrometers) generated during coughing, sneezing, and talking. These droplets travel short distances (<1-2 metres) and do not remain suspended in the air like airborne particles. A surgical mask (not N95) is sufficient protection when within 1-2 metres. Close contacts (household members, kissing contacts) should receive prophylactic antibiotics (ciprofloxacin or rifampin). Droplet precautions for meningococcal meningitis can be discontinued after 24 hours of effective antibiotic therapy (ceftriaxone or penicillin G).", tags: ["meningitis", "droplet-precautions", "surgical-mask", "prophylaxis", "Neisseria"] },
    { disease: "methicillin-resistant Staphylococcus aureus (MRSA) wound infection", precaution: "Contact precautions", room: "private room or cohorted with another MRSA patient", ppe: "Gown and gloves for all direct patient contact and contact with the patient's environment; hand hygiene with alcohol-based hand rub or soap and water", wrong1: "Airborne precautions with negative-pressure room", wrong2: "Droplet precautions with surgical mask", wrong3: "No special precautions; MRSA is treated with standard precautions only", reason: "MRSA is transmitted primarily through direct contact with infected wounds or contaminated surfaces and equipment. Contact precautions include gown and gloves when entering the room or having contact with the patient or their environment. Dedicated equipment (stethoscope, blood pressure cuff, thermometer) should remain in the room. Unlike C. difficile, alcohol-based hand rub IS effective against MRSA. Environmental cleaning with standard hospital-grade disinfectants is adequate. MRSA screening (nasal swab) and decolonization protocols (mupirocin nasal ointment, chlorhexidine baths) may be implemented per facility policy.", tags: ["MRSA", "contact-precautions", "wound-infection", "antibiotic-resistance", "hand-hygiene"] },
    { disease: "varicella (chickenpox)", precaution: "Airborne AND contact precautions combined", room: "negative-pressure isolation room (AIIR)", ppe: "N95 respirator AND gown and gloves; only immune healthcare workers (history of varicella or positive varicella titer) should care for the patient", wrong1: "Standard precautions only since varicella is a childhood illness", wrong2: "Droplet precautions with surgical mask", wrong3: "Contact precautions alone with gown and gloves", reason: "Varicella (chickenpox) requires BOTH airborne AND contact precautions because the varicella-zoster virus (VZV) is transmitted via airborne nuclei from respiratory secretions AND by direct contact with the vesicular skin lesions (which contain high viral loads). The combination of transmission routes necessitates a negative-pressure room (for airborne particles), N95 respirator, AND gown/gloves (for contact with lesions). The patient is contagious from 1-2 days before the rash appears until ALL lesions have crusted over. Only immune healthcare workers should provide care. Non-immune pregnant women should NOT enter the room due to the risk of congenital varicella syndrome in the fetus.", tags: ["varicella", "chickenpox", "airborne-contact", "combined-precautions", "VZV"] },
  ];

  for (const is_ of isolationScenarios) {
    qs.push({ tier: "rpn", exam: "REx-PN", qt: "MCQ", stem: `An RPN is admitting a patient diagnosed with ${is_.disease}. Which type of isolation precautions should the RPN implement?`,
      options: [O("A", is_.wrong1), O("B", `${is_.precaution}: place the patient in a ${is_.room} and use ${is_.ppe}`), O("C", is_.wrong2), O("D", is_.wrong3)],
      ca: ["B"], rat: is_.reason, diff: 2, tags: is_.tags, topic: "Infection Control", sub: "Isolation Precautions", rs: "CA",
      cp: `${is_.disease} requires ${is_.precaution}`, es: "Match the transmission route to the precaution type: airborne=N95+AIIR, droplet=surgical mask, contact=gown+gloves",
      ct: "Do not confuse airborne (small particles, remain suspended) with droplet (large particles, fall within 1-2m); the PPE is different for each",
      dr: { A: "Insufficient protection for this pathogen's transmission route", C: "Incorrect precaution type for this organism's mode of transmission", D: "Does not match the established guidelines for this infectious agent" }, bs: "Safe & Effective Care Environment" });
  }

  // ===== PARAMETRIC NCLEX-PN GENERATORS =====

  // Nutrition and diet therapy
  const dietScenarios = [
    { condition: "chronic kidney disease (CKD) stage 4", restriction: "low-sodium, low-potassium, low-phosphorus diet with controlled protein intake", foods: "fresh fruits and vegetables without high-potassium options (bananas, oranges, potatoes), low-phosphorus dairy alternatives, herbs and spices instead of salt", wrongDiet1: "High-protein diet with unlimited dairy and potassium-rich foods", wrongDiet2: "Clear liquid diet indefinitely", wrongDiet3: "No dietary restrictions; the patient can eat normally",
      rationale: "In CKD stage 4 (GFR 15-29 mL/min), the kidneys cannot adequately excrete sodium (leading to fluid retention and hypertension), potassium (risk of hyperkalemia and cardiac arrest), phosphorus (leads to renal osteodystrophy and cardiovascular calcification), or metabolic waste products from protein metabolism (BUN elevation causing uremic symptoms). Dietary management includes: sodium restriction (<2000 mg/day), potassium restriction (2000-3000 mg/day - avoid bananas, oranges, tomatoes, potatoes, avocados), phosphorus restriction (<800-1000 mg/day - limit dairy, nuts, dark colas, processed foods), and moderate protein restriction (0.6-0.8 g/kg/day pre-dialysis) to reduce uremic toxin production. Phosphate binders (calcium acetate, sevelamer) are taken with meals to bind dietary phosphorus in the GI tract.", tags: ["CKD", "renal-diet", "potassium", "phosphorus", "sodium-restriction"] },
    { condition: "celiac disease", restriction: "strict gluten-free diet eliminating all wheat, barley, rye, and cross-contaminated oats", foods: "rice, corn, quinoa, potatoes, certified gluten-free products, fresh fruits and vegetables, unprocessed meats", wrongDiet1: "Low-fat diet with whole wheat bread and barley soup", wrongDiet2: "Dairy-free diet while continuing to eat regular wheat products", wrongDiet3: "Gluten-free diet only during symptom flares; gluten can be reintroduced when feeling well",
      rationale: "Celiac disease is an autoimmune disorder triggered by gluten (a protein found in wheat, barley, and rye) in genetically susceptible individuals. Gluten causes an immune response that damages the intestinal villi, leading to malabsorption of nutrients. The ONLY treatment is a strict, LIFELONG gluten-free diet. Even small amounts of gluten (<50 mg/day) can cause villous atrophy and symptoms (diarrhea, bloating, malabsorption, dermatitis herpetiformis). Gluten-free alternatives include rice, corn, quinoa, millet, buckwheat, potatoes, and certified gluten-free oats. Patients must read food labels carefully as gluten is hidden in many processed foods, sauces, and seasonings. The diet must be maintained even when asymptomatic (option C) because subclinical intestinal damage continues with gluten exposure.", tags: ["celiac", "gluten-free", "autoimmune", "malabsorption", "nutrition"] },
    { condition: "phenylketonuria (PKU) in a 4-year-old child", restriction: "low-phenylalanine diet that eliminates high-protein foods (meat, fish, eggs, dairy, nuts, legumes) and aspartame-containing products", foods: "special low-protein formula, measured amounts of fruits, vegetables, and low-protein breads and pastas; PKU-specific medical formula provides essential amino acids without excess phenylalanine", wrongDiet1: "High-protein diet to support the child's growth and development", wrongDiet2: "Regular diet with diet soda (containing aspartame) as a treat", wrongDiet3: "The child can outgrow PKU and transition to a normal diet at age 6",
      rationale: "Phenylketonuria (PKU) is an autosomal recessive genetic disorder causing deficiency of phenylalanine hydroxylase (PAH), the enzyme that converts phenylalanine to tyrosine. Without this enzyme, phenylalanine accumulates to toxic levels in the blood, causing irreversible intellectual disability, seizures, and behavioral problems if untreated. The mainstay of treatment is a LIFELONG low-phenylalanine diet started immediately after newborn screening diagnosis. High-protein foods are restricted because most protein-containing foods are high in phenylalanine. Aspartame (artificial sweetener in diet drinks and sugar-free products) is CONTRAINDICATED because it is metabolized to phenylalanine. Special PKU formulas provide essential amino acids, vitamins, and minerals without excess phenylalanine. Children do NOT outgrow PKU; the diet should continue lifelong. Maternal PKU requires strict dietary control during pregnancy to prevent fetal damage.", tags: ["PKU", "phenylalanine", "genetic", "newborn-screening", "medical-nutrition"] },
    { condition: "iron-deficiency anemia", restriction: "high-iron diet with vitamin C to enhance absorption, avoiding calcium-rich foods and tea/coffee with iron-rich meals", foods: "lean red meat, liver, dark leafy greens (spinach, kale), fortified cereals, legumes (lentils, beans), dried fruits; pair with vitamin C sources (orange juice, citrus fruits, bell peppers)", wrongDiet1: "Low-iron diet to prevent iron overload and hemochromatosis", wrongDiet2: "Drink tea or coffee with meals to help absorb the iron better", wrongDiet3: "Avoid all meat products and rely solely on spinach for iron",
      rationale: "Iron-deficiency anemia treatment includes dietary modification and often oral iron supplementation. Dietary sources of iron come in two forms: heme iron (from animal sources - 15-35% absorption rate) and non-heme iron (from plant sources - 2-20% absorption rate). The best dietary sources include lean red meat, organ meats (liver), dark leafy greens, fortified cereals, and legumes. VITAMIN C (ascorbic acid) significantly ENHANCES non-heme iron absorption by reducing ferric iron (Fe3+) to ferrous iron (Fe2+), the more absorbable form. Patients should drink orange juice or eat citrus fruits with iron-rich meals. INHIBITORS of iron absorption include: tannins (tea, coffee), calcium (dairy products), phytates (whole grains), and antacids - these should be separated from iron-rich meals by at least 2 hours. Oral iron supplements (ferrous sulfate) should be taken on an empty stomach with vitamin C for best absorption, though GI side effects may necessitate taking with food.", tags: ["iron-deficiency-anemia", "dietary-iron", "vitamin-C", "heme-iron", "nutrition"] },
  ];

  for (const ds of dietScenarios) {
    qs.push({ tier: "rpn", exam: "NCLEX-PN", qt: "MCQ", stem: `An LPN is providing nutritional counseling to a patient diagnosed with ${ds.condition}. Which dietary recommendation is correct?`,
      options: [O("A", ds.wrongDiet1), O("B", `Follow a ${ds.restriction}. Recommended foods include: ${ds.foods}`), O("C", ds.wrongDiet2), O("D", ds.wrongDiet3)],
      ca: ["B"], rat: ds.rationale, diff: 2, tags: ds.tags, topic: "Nutrition", sub: "Therapeutic Diets", rs: "US",
      cp: `${ds.condition} requires ${ds.restriction.substring(0, 50)}`, es: "Match the disease to its specific dietary modification; know the rationale for each restriction",
      ct: "Dietary modifications are disease-specific; do not apply general healthy eating advice to therapeutic diets",
      dr: { A: "This diet would worsen the patient's condition or symptoms", C: "This recommendation contains dangerous misinformation", D: "This advice is medically incorrect and could cause harm" }, bs: "Health Promotion & Maintenance" });
  }

  // Safety scenarios - NCLEX-PN
  const safetyPN = [
    { stem: "An LPN discovers that a medication error has occurred: the wrong dose of a medication was administered to a patient. The patient appears unharmed at this time. What is the LPN's FIRST action?",
      correct: "Assess the patient immediately for any adverse effects from the incorrect dose, then notify the charge nurse/supervisor and the physician, complete an incident/variance report, and document the event in the patient's medical record",
      wrong1: "Cover up the error to avoid disciplinary action and monitor the patient quietly",
      wrong2: "Complete the incident report first before assessing the patient or notifying anyone",
      wrong3: "Call the pharmacy to blame them for dispensing the wrong dose",
      rationale: "When a medication error occurs, the nurse's FIRST priority is PATIENT SAFETY - assessing the patient for any adverse effects. The sequence of actions follows the ethical and legal standards of nursing practice: (1) ASSESS the patient immediately for adverse reactions (vital signs, neurological status, symptoms); (2) NOTIFY the charge nurse/supervisor AND the physician so appropriate interventions can be ordered if needed (monitoring, antidotes, supportive care); (3) DOCUMENT the error factually in the patient's medical record (what was given, when it was discovered, patient's response, actions taken); (4) COMPLETE an incident/variance report per facility policy - this is a separate document from the chart that is used for quality improvement, NOT for punitive purposes (in a just culture environment). Covering up errors (option A) is unethical, illegal, and puts the patient at risk. Completing paperwork before assessing the patient (option B) delays care. Blaming others (option D) does not address patient safety.", tags: ["medication-error", "patient-safety", "incident-report", "nursing-ethics", "error-disclosure"] },
    { stem: "An LPN is caring for a patient who is confused and has a history of falls. The patient has been found on the floor twice in the past 24 hours. The family requests that the patient be restrained 'for their safety.' What is the MOST appropriate response?",
      correct: "Explain that restraints are a last resort and can actually increase injury risk, then implement evidence-based fall prevention measures: bed alarm, non-slip footwear, toileting schedule, low bed, adequate lighting, and one-to-one observation if needed",
      wrong1: "Apply bilateral wrist restraints immediately as the family requested to show responsiveness to their concerns",
      wrong2: "Agree with the family and apply a vest restraint without a physician's order",
      wrong3: "Discharge the patient since the hospital cannot guarantee safety",
      rationale: "Evidence consistently shows that physical restraints do NOT prevent falls and actually INCREASE injury severity when falls do occur. Restrained patients who fall may sustain fractures, strangulation injuries, and death. Restraints also cause psychological distress, loss of dignity, agitation (often worsening the behavior they were meant to control), skin breakdown, contractures, and deconditioning. Evidence-based fall prevention strategies include: environmental modifications (low bed, night light, clear pathways, non-slip footwear), bed/chair alarms, hourly rounding with attention to toileting needs, medication review (reducing sedatives, psychotropics), physical therapy consultation, one-to-one observation for high-risk patients, and patient/family education. If restraints are absolutely necessary after all alternatives have failed, they require: a physician's order specifying type and duration, assessment every 1-2 hours, release every 2 hours for movement and toileting, neurovascular checks, and documented ongoing evaluation of the need for continued restraint.", tags: ["fall-prevention", "restraints", "patient-safety", "evidence-based", "alternatives-to-restraints"] },
    { stem: "An LPN is preparing to give medications to a patient. When scanning the patient's identification band, the barcode scanner indicates a mismatch with the medication. What should the LPN do?",
      correct: "Stop the medication administration process, verify the patient's identity manually using two patient identifiers, check the medication order against the MAR, and resolve the discrepancy before administering any medication",
      wrong1: "Override the scanner alert and administer the medication since the patient verbally confirmed their name",
      wrong2: "Assume the scanner is malfunctioning and administer the medication based on room number verification",
      wrong3: "Ask the patient's roommate to confirm the patient's identity",
      rationale: "Barcode medication administration (BCMA) technology is a safety system designed to prevent medication errors by verifying the 'five rights' at the point of care. When the scanner indicates a MISMATCH, it means there is a discrepancy between the scanned patient identification and the medication - this could indicate: wrong patient, wrong medication, wrong dose, wrong time, or expired medication. The nurse must STOP and investigate the cause of the mismatch BEFORE administering the medication. Overriding safety alerts (option A) is the leading cause of BCMA-related errors and defeats the purpose of the technology. Room number (option B) is NEVER an acceptable patient identifier. Asking a roommate (option D) is not a valid identification method. The nurse should: verify the patient's identity using two identifiers (name + DOB), cross-reference the medication with the MAR, check for recent order changes, and contact the pharmacy if the discrepancy cannot be resolved.", tags: ["BCMA", "barcode-scanning", "medication-safety", "patient-identification", "technology"] },
  ];

  for (const ss of safetyPN) {
    qs.push({ tier: "rpn", exam: "NCLEX-PN", qt: "MCQ", stem: ss.stem,
      options: [O("A", ss.wrong1), O("B", ss.correct), O("C", ss.wrong2), O("D", ss.wrong3)],
      ca: ["B"], rat: ss.rationale, diff: 2, tags: ss.tags, topic: "Patient Safety", sub: "Error Management", rs: "US",
      cp: `Patient safety first; follow established protocols`, es: "When a safety concern is identified, always STOP, ASSESS, and RESOLVE before proceeding",
      ct: "Never override safety systems, cover up errors, or use shortcuts that bypass patient identification protocols",
      dr: { A: "This violates patient safety standards and could cause harm", C: "This approach bypasses critical safety checks", D: "This method is not an acceptable patient safety practice" }, bs: "Safe & Effective Care Environment" });
  }

  // ===== PARAMETRIC NCLEX-RN GENERATORS =====

  // Acid-base interpretation
  const abgScenarios = [
    { pH: "7.28", pCO2: "56 mmHg", HCO3: "24 mEq/L", pO2: "68 mmHg", context: "COPD exacerbation with productive cough and wheezing", interpretation: "Uncompensated respiratory acidosis: the pH is low (acidotic), pCO2 is elevated (respiratory cause), and HCO3 is normal (no renal compensation yet). The elevated pCO2 indicates CO2 retention from impaired ventilation in COPD exacerbation", wrongInterp1: "Metabolic acidosis from diabetic ketoacidosis", wrongInterp2: "Respiratory alkalosis from hyperventilation", wrongInterp3: "Fully compensated metabolic alkalosis",
      rationale: "ABG interpretation follows a systematic approach: (1) pH 7.28 is below normal (7.35-7.45) = ACIDOSIS; (2) pCO2 56 mmHg is above normal (35-45) = elevated CO2 indicates the RESPIRATORY system is causing the acidosis (CO2 is an acid that combines with water to form carbonic acid); (3) HCO3 24 mEq/L is within normal range (22-26) = the kidneys have NOT yet compensated. Therefore: uncompensated RESPIRATORY ACIDOSIS. In COPD exacerbation, bronchospasm, mucus plugging, and air trapping impair gas exchange, preventing adequate CO2 elimination. Treatment focuses on improving ventilation: bronchodilators (salbutamol, ipratropium), corticosteroids (prednisone, methylprednisolone), supplemental oxygen (carefully titrated to SpO2 88-92% in COPD), possibly BiPAP for non-invasive ventilation, and antibiotics if bacterial infection is the trigger.", tags: ["ABG", "respiratory-acidosis", "COPD", "CO2-retention", "acid-base"] },
    { pH: "7.50", pCO2: "30 mmHg", HCO3: "24 mEq/L", pO2: "96 mmHg", context: "panic attack with rapid shallow breathing", interpretation: "Uncompensated respiratory alkalosis: the pH is elevated (alkalotic), pCO2 is low (hyperventilation is blowing off CO2 faster than the body produces it), and HCO3 is normal (no renal compensation). Hyperventilation during the panic attack is the direct cause", wrongInterp1: "Metabolic alkalosis from prolonged vomiting", wrongInterp2: "Respiratory acidosis from hypoventilation", wrongInterp3: "Normal arterial blood gas values",
      rationale: "Systematic ABG interpretation: (1) pH 7.50 is above normal (7.35-7.45) = ALKALOSIS; (2) pCO2 30 mmHg is below normal (35-45) = the patient is blowing off too much CO2 through hyperventilation, causing the alkalosis (loss of the acid CO2 makes the blood more alkaline); (3) HCO3 24 mEq/L is normal (22-26) = no metabolic compensation. Therefore: uncompensated RESPIRATORY ALKALOSIS. During a panic attack, the sympathetic nervous system triggers rapid breathing (hyperventilation), which excessively eliminates CO2. Symptoms of respiratory alkalosis include: lightheadedness, tingling/numbness of extremities and perioral area (from ionized calcium decrease in alkalotic blood), muscle spasms (carpopedal spasm), palpitations, and chest tightness. Treatment: calm the patient, guide slow deep breathing, address the underlying anxiety. The old practice of breathing into a paper bag is no longer recommended as it can worsen hypoxemia in patients with underlying pulmonary conditions.", tags: ["ABG", "respiratory-alkalosis", "hyperventilation", "panic-attack", "acid-base"] },
    { pH: "7.32", pCO2: "38 mmHg", HCO3: "16 mEq/L", pO2: "92 mmHg", context: "diabetic patient with blood glucose of 480 mg/dL, Kussmaul respirations, and fruity breath", interpretation: "Partially compensated metabolic acidosis: the pH is low (acidotic), HCO3 is low (metabolic cause - ketoacid accumulation in DKA), and pCO2 is low-normal (the lungs are attempting to compensate by blowing off CO2 through Kussmaul respirations, but compensation is incomplete as pH is still abnormal)", wrongInterp1: "Respiratory acidosis from pneumonia", wrongInterp2: "Metabolic alkalosis from antacid overuse", wrongInterp3: "Normal ABG with expected diabetic values",
      rationale: "Systematic ABG interpretation: (1) pH 7.32 is below normal = ACIDOSIS; (2) pCO2 38 mmHg is within normal range (35-45) but trending toward the lower end, suggesting respiratory compensation is occurring; (3) HCO3 16 mEq/L is below normal (22-26) = the acidosis is METABOLIC in origin (loss of bicarbonate buffer from ketoacid accumulation). The combination of low pH, low HCO3, and a pCO2 that is lower than expected (the respiratory system is compensating by increasing ventilation to blow off CO2, hence Kussmaul respirations) but pH is still acidotic indicates PARTIALLY compensated metabolic acidosis. In DKA, absolute insulin deficiency causes unrestrained lipolysis producing ketone bodies (beta-hydroxybutyric acid, acetoacetic acid) that consume bicarbonate buffers and overwhelm the body's acid-base regulation. Kussmaul respirations (deep, rapid breathing) are the respiratory system's compensatory mechanism to eliminate CO2 and raise pH.", tags: ["ABG", "metabolic-acidosis", "DKA", "Kussmaul", "acid-base", "diabetes"] },
    { pH: "7.48", pCO2: "44 mmHg", HCO3: "32 mEq/L", pO2: "90 mmHg", context: "patient with nasogastric tube connected to continuous suction for 3 days", interpretation: "Uncompensated metabolic alkalosis: the pH is elevated (alkalotic), HCO3 is elevated (metabolic cause - loss of hydrochloric acid from gastric suction causes the body to retain bicarbonate), and pCO2 is normal (no respiratory compensation yet)", wrongInterp1: "Respiratory alkalosis from anxiety", wrongInterp2: "Metabolic acidosis from diarrhea", wrongInterp3: "Respiratory acidosis from sedation",
      rationale: "Systematic ABG interpretation: (1) pH 7.48 is above normal = ALKALOSIS; (2) pCO2 44 mmHg is within normal range (35-45) = the respiratory system is NOT the cause and has NOT compensated; (3) HCO3 32 mEq/L is above normal (22-26) = excess bicarbonate indicates METABOLIC alkalosis. Therefore: uncompensated METABOLIC ALKALOSIS. The pathophysiology: continuous nasogastric (NG) suction removes hydrochloric acid (HCl) from the stomach. For every H+ ion lost, the body generates a bicarbonate (HCO3-) ion to maintain electroneutrality, causing metabolic alkalosis. Additionally, the loss of chloride (hypochloremia) impairs the kidney's ability to excrete bicarbonate ('chloride-responsive alkalosis'). Other causes of metabolic alkalosis include: prolonged vomiting, excessive antacid use, loop or thiazide diuretics (cause loss of H+ and K+), and hypokalemia. Treatment: replace chloride and potassium (IV normal saline with KCl), monitor electrolytes, and if NG suction continues, administer prescribed acid-reducing medications to decrease gastric acid production.", tags: ["ABG", "metabolic-alkalosis", "NG-suction", "gastric-acid-loss", "acid-base"] },
  ];

  for (const abg of abgScenarios) {
    qs.push({ tier: "rn", exam: "NCLEX-RN", qt: "MCQ", stem: `An RN is interpreting arterial blood gas (ABG) results for a patient with ${abg.context}. The ABG values are: pH ${abg.pH}, pCO2 ${abg.pCO2}, HCO3 ${abg.HCO3}, pO2 ${abg.pO2}. What is the correct interpretation?`,
      options: [O("A", abg.wrongInterp1), O("B", abg.interpretation), O("C", abg.wrongInterp2), O("D", abg.wrongInterp3)],
      ca: ["B"], rat: abg.rationale, diff: 3, tags: abg.tags, topic: "Acid-Base Balance", sub: "ABG Interpretation", rs: "BOTH",
      cp: `ABG analysis: pH determines acid/base, then identify the cause (respiratory=pCO2, metabolic=HCO3), then check for compensation`, es: "Follow the 3-step ABG method: (1) pH high or low? (2) Which value matches the pH change? (3) Is the other value compensating?",
      ct: "Do not confuse respiratory and metabolic causes; remember: pCO2 is INVERSELY related to pH (high CO2=low pH), HCO3 DIRECTLY relates to pH (high HCO3=high pH)",
      dr: { A: "This interpretation does not match the ABG values; review the systematic approach", C: "This is the opposite acid-base disturbance from what the values indicate", D: "These values are NOT normal and represent a clinically significant acid-base imbalance" }, bs: "Physiological Integrity" });
  }

  // ECG rhythm interpretation
  const ecgScenarios = [
    { rhythm: "regular, narrow QRS complexes at a rate of 150 bpm, absent P waves, and a 'saw-tooth' baseline pattern", diagnosis: "Atrial flutter with 2:1 conduction block: the atrial rate is approximately 300 bpm with every other impulse conducted through the AV node, resulting in a ventricular rate of 150 bpm. The saw-tooth pattern represents the flutter waves (F waves)", wrong1: "Normal sinus tachycardia from exercise", wrong2: "Ventricular tachycardia requiring immediate defibrillation", wrong3: "Third-degree (complete) heart block", tags: ["ECG", "atrial-flutter", "flutter-waves", "saw-tooth", "cardiac-rhythm"],
      rationale: "Atrial flutter is a supraventricular tachyarrhythmia characterized by rapid, regular atrial depolarization at a rate of approximately 250-350 bpm, most commonly around 300 bpm. The characteristic 'saw-tooth' or 'picket fence' pattern of flutter waves (F waves) is best seen in leads II, III, aVF, and V1. The AV node cannot conduct all atrial impulses, so a conduction ratio develops: 2:1 (most common, ventricular rate ~150), 3:1 (rate ~100), or 4:1 (rate ~75). A ventricular rate of exactly or near 150 bpm should always raise suspicion for atrial flutter with 2:1 block. Treatment includes rate control (beta-blockers, calcium channel blockers, digoxin), anticoagulation (same stroke risk as atrial fibrillation), and possibly cardioversion (electrical or pharmacological). Distinguishing from sinus tachycardia: sinus tachycardia has P waves before each QRS; flutter has saw-tooth F waves. From VT: VT has wide QRS complexes; flutter has narrow QRS." },
    { rhythm: "irregularly irregular rhythm, narrow QRS complexes at varying rates of 60-120 bpm, with no identifiable P waves and a chaotic baseline", diagnosis: "Atrial fibrillation: the atria are depolarizing chaotically at 350-600 bpm, and the AV node conducts impulses irregularly to the ventricles, creating the characteristically 'irregularly irregular' rhythm with no organized P waves", wrong1: "Sinus arrhythmia, a normal variant related to breathing", wrong2: "Premature ventricular contractions (PVCs) requiring lidocaine", wrong3: "Second-degree AV block Type II (Mobitz II)", tags: ["ECG", "atrial-fibrillation", "irregularly-irregular", "anticoagulation", "cardiac-rhythm"],
      rationale: "Atrial fibrillation (AF) is the most common sustained cardiac dysrhythmia, affecting approximately 1-2% of the general population and up to 10% of those over 80 years of age. The hallmark ECG findings are: (1) IRREGULARLY IRREGULAR R-R intervals (no two R-R intervals are the same length; this is the most distinctive feature and what 'irregularly irregular' means); (2) ABSENCE of organized P waves (replaced by chaotic fibrillatory waves giving a 'wavy' or undulating baseline); (3) Narrow QRS complexes (unless there is a pre-existing bundle branch block or aberrant conduction). Clinical significance: the disorganized atrial activity means the atria do not contract effectively, allowing blood to pool (especially in the left atrial appendage), forming thrombi that can embolize and cause ischemic stroke. Stroke risk is assessed using the CHA2DS2-VASc score, and anticoagulation (warfarin, DOACs like apixaban, rivarelbán) is prescribed accordingly. Rate control targets a ventricular rate <110 bpm at rest using beta-blockers, calcium channel blockers, or digoxin." },
    { rhythm: "no P waves, no QRS complexes, no identifiable waveforms; the tracing shows a flat (isoelectric) line across all leads, confirmed with lead checks", diagnosis: "Asystole: the complete absence of electrical cardiac activity, representing cardiac arrest. This is NOT a shockable rhythm. Treatment follows the ACLS pulseless arrest algorithm: immediate high-quality CPR, epinephrine 1 mg IV every 3-5 minutes, identify and treat reversible causes (Hs and Ts)", wrong1: "Fine ventricular fibrillation requiring immediate defibrillation", wrong2: "Normal ECG of a sleeping patient", wrong3: "Lead disconnection artifact (the patient is fine)", tags: ["ECG", "asystole", "cardiac-arrest", "ACLS", "CPR", "non-shockable"],
      rationale: "Asystole represents the absence of any electrical cardiac activity - no organized depolarization is occurring in the heart. On the ECG monitor, it appears as a flat (isoelectric) line across all leads. It is critical to CONFIRM asystole is real and not simply a lead disconnection by: (1) checking that all leads are properly attached, (2) confirming in multiple leads, (3) turning up the gain/amplitude on the monitor. Asystole is a NON-SHOCKABLE rhythm (defibrillation will NOT convert asystole and wastes time that should be spent on CPR). The ACLS algorithm for asystole/PEA includes: immediate high-quality CPR (100-120 compressions/min, depth of at least 5 cm, full chest recoil, minimize interruptions), epinephrine 1 mg IV/IO every 3-5 minutes, advanced airway management, and aggressive identification and treatment of reversible causes using the 'Hs and Ts': Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia; Tension pneumothorax, cardiac Tamponade, Toxins, and pulmonary Thrombosis. Asystole carries a very poor prognosis, with survival to discharge rates of approximately 2-5%." },
  ];

  for (const ecg of ecgScenarios) {
    qs.push({ tier: "rn", exam: "NCLEX-RN", qt: "MCQ", stem: `An RN is monitoring a patient on telemetry and observes the following ECG characteristics: ${ecg.rhythm}. What is the correct interpretation and appropriate nursing response?`,
      options: [O("A", ecg.wrong1), O("B", ecg.diagnosis), O("C", ecg.wrong2), O("D", ecg.wrong3)],
      ca: ["B"], rat: ecg.rationale, diff: 4, tags: ecg.tags, topic: "Cardiac Rhythm Interpretation", sub: "ECG Analysis", rs: "BOTH",
      cp: `ECG identification: focus on rate, regularity, P waves, QRS width, and relationship between P waves and QRS complexes`, es: "For ECG questions: determine rate→regularity→P waves→PR interval→QRS width; this systematic approach identifies most rhythms",
      ct: "Asystole is NOT shockable; only VF and pulseless VT are shockable rhythms; defibrillating asystole wastes precious CPR time",
      dr: { A: "This rhythm description does not match the stated ECG characteristics", C: "This interpretation is incorrect and would lead to inappropriate treatment", D: "This is not a benign finding; it requires immediate clinical action" }, bs: "Physiological Integrity" });
  }

  // Pharmacology - Critical Drug Interactions for RN
  const drugInteractions = [
    { drugs: "warfarin and ciprofloxacin", effect: "Ciprofloxacin inhibits CYP1A2, increasing warfarin levels and significantly elevating the INR, increasing bleeding risk. Monitor INR closely (every 2-3 days) and anticipate warfarin dose reduction", tags: ["warfarin", "ciprofloxacin", "CYP1A2", "drug-interaction", "bleeding"] },
    { drugs: "lithium and NSAIDs (ibuprofen)", effect: "NSAIDs reduce renal blood flow and lithium excretion, causing lithium levels to rise to potentially toxic levels. Lithium toxicity can cause tremors, ataxia, seizures, renal failure, and cardiac dysrhythmias", tags: ["lithium", "NSAIDs", "renal-excretion", "drug-interaction", "toxicity"] },
    { drugs: "methotrexate and trimethoprim", effect: "Both drugs are folate antagonists; concurrent use can cause severe pancytopenia (aplastic anemia) from additive bone marrow suppression. Monitor CBC frequently and consider alternative antibiotic", tags: ["methotrexate", "trimethoprim", "folate-antagonist", "pancytopenia", "drug-interaction"] },
    { drugs: "an SSRI (fluoxetine) and tramadol", effect: "Both drugs increase serotonin levels in the CNS. The combination risks serotonin syndrome, a potentially fatal condition characterized by mental status changes, autonomic instability, and neuromuscular abnormalities (clonus, rigidity, hyperthermia)", tags: ["serotonin-syndrome", "SSRI", "tramadol", "drug-interaction", "CNS"] },
    { drugs: "potassium-sparing diuretic (spironolactone) and an ACE inhibitor (lisinopril)", effect: "Both medications promote potassium retention. The combination significantly increases the risk of life-threatening hyperkalemia, especially in patients with renal impairment. Monitor serum potassium closely and assess for cardiac rhythm changes", tags: ["hyperkalemia", "spironolactone", "ACE-inhibitor", "potassium", "drug-interaction"] },
    { drugs: "digoxin and amiodarone", effect: "Amiodarone inhibits P-glycoprotein and CYP3A4, increasing digoxin levels by 70-100%. The digoxin dose should typically be reduced by 50% when amiodarone is initiated. Monitor for digoxin toxicity (nausea, visual changes, bradycardia, dysrhythmias)", tags: ["digoxin", "amiodarone", "P-glycoprotein", "dose-adjustment", "drug-interaction"] },
  ];

  for (const di of drugInteractions) {
    qs.push({ tier: "rn", exam: "NCLEX-RN", qt: "MCQ", stem: `An RN reviews a patient's medication list and identifies that the patient is concurrently taking ${di.drugs}. What is the clinical significance of this drug combination?`,
      options: [
        O("A", "There is no significant interaction between these medications; they can be administered safely together"),
        O("B", di.effect),
        O("C", "The combination is beneficial and enhances the therapeutic effect without additional risk"),
        O("D", "Separating administration times by 2 hours completely eliminates any interaction"),
      ],
      ca: ["B"], rat: `The interaction between ${di.drugs} is clinically significant and requires nursing vigilance. ${di.effect}. Drug interactions can occur through pharmacokinetic mechanisms (affecting absorption, distribution, metabolism, or excretion) or pharmacodynamic mechanisms (additive, synergistic, or antagonistic effects at the receptor level). The nurse's role includes: identifying potential interactions during medication reconciliation, monitoring for adverse effects, communicating concerns to the prescriber, and educating the patient about warning signs.`, diff: 4, tags: di.tags, topic: "Pharmacology", sub: "Drug Interactions", rs: "BOTH",
      cp: `${di.drugs}: ${di.effect.substring(0, 60)}`, es: "For drug interaction questions, identify the mechanism (CYP450 inhibition, additive effects, altered excretion) and predict the clinical consequence",
      ct: "Time-spacing does NOT prevent most drug interactions; CYP450-mediated and pharmacodynamic interactions occur regardless of administration timing",
      dr: { A: "There IS a clinically significant interaction that requires monitoring and possible dose adjustment", C: "The combination increases RISK, not therapeutic benefit", D: "Time-spacing does not prevent interactions that occur at the metabolic or receptor level" }, bs: "Physiological Integrity" });
  }

  // ===== ADDITIONAL REx-PN & NCLEX-PN TO REACH TARGETS =====

  // Professional Practice scenarios (REx-PN)
  const profPractice = [
    { stem: "An RPN is caring for a patient who asks the nurse to witness the signing of their advance directive (personal directive in Alberta). What is the RPN's role?",
      correct: "The RPN may witness the signing if permitted by provincial legislation, ensuring the patient is competent, understands the document, and is signing voluntarily without coercion",
      wrong1: "RPNs cannot witness any legal documents under any circumstances", wrong2: "The RPN should tell the patient what to include in their advance directive", wrong3: "The RPN should sign the document as the patient's healthcare proxy",
      tags: ["advance-directive", "legal", "witness", "patient-rights", "autonomy"] },
    { stem: "An RPN notices a colleague has arrived for their shift smelling of alcohol and appears impaired. What is the RPN's professional obligation?",
      correct: "Report the observation to the charge nurse or supervisor immediately, as the colleague poses a safety risk to patients and must be removed from patient care; document the observations objectively",
      wrong1: "Give the colleague coffee and let them start their shift since they seem able to function", wrong2: "Ignore the situation since it is not the RPN's business and reporting could damage the colleague's career", wrong3: "Post about the incident on social media to raise awareness about impaired nursing",
      tags: ["professional-conduct", "impaired-practice", "mandatory-reporting", "patient-safety", "colleague"] },
    { stem: "An RPN is assigned to care for a patient whose care requirements exceed the RPN's competence and scope of practice. What should the RPN do?",
      correct: "Notify the charge nurse immediately that the assignment is beyond scope/competence, document the concern, request reassignment or appropriate support, and continue providing care within their competence until reassignment occurs",
      wrong1: "Accept the assignment without question since refusing an assignment can result in termination", wrong2: "Abandon the patient and go home since the assignment is unsafe", wrong3: "Attempt all required care regardless of competence since practice is the best way to learn",
      tags: ["scope-of-practice", "professional-responsibility", "unsafe-assignment", "advocacy", "competence"] },
  ];

  for (const pp of profPractice) {
    qs.push({ tier: "rpn", exam: "REx-PN", qt: "MCQ", stem: pp.stem,
      options: [O("A", pp.wrong1), O("B", pp.correct), O("C", pp.wrong2), O("D", pp.wrong3)],
      ca: ["B"], rat: `${pp.correct}. Professional nursing practice requires adherence to regulatory standards, patient safety advocacy, and ethical decision-making. The nurse has both a professional and legal obligation to act in the patient's best interest while practicing within their scope of competence.`,
      diff: 3, tags: pp.tags, topic: "Professional Practice", sub: "Professional Standards", rs: "CA",
      cp: "Professional obligation: patient safety always comes first; report concerns through proper channels",
      es: "For professional practice questions, the correct answer prioritizes patient safety while following proper reporting channels",
      ct: "Neither ignoring safety concerns nor abandoning patients is acceptable; the nurse must advocate through proper channels",
      dr: { A: "This fails to address the professional obligation to act", C: "This approach could endanger patients or violate professional standards", D: "This is inappropriate and could have serious consequences" }, bs: "Safe & Effective Care Environment" });
  }

  // More NCLEX-PN clinical
  const pnMore = [
    { stem: "An LPN is caring for a patient with a newly placed central venous catheter (CVC). Which complication should the LPN monitor for in the first 24 hours?",
      correct: "Pneumothorax: assess for sudden dyspnea, unilateral decreased breath sounds, chest pain, and subcutaneous emphysema (crepitus), as the subclavian or internal jugular vein insertion can inadvertently puncture the pleura",
      wrong1: "Appendicitis from catheter migration into the abdominal cavity", wrong2: "Migraine headache from the catheter insertion procedure", wrong3: "Urinary tract infection from the central line",
      tags: ["central-line", "pneumothorax", "CVC", "complication", "assessment"], topic: "Central Line Care", sub: "Complications" },
    { stem: "An LPN is performing a skin assessment on a patient and identifies a lesion described as a flat, non-palpable, irregularly shaped area of skin discoloration larger than 1 cm. What is the correct dermatological term for this finding?",
      correct: "Patch: a flat, non-palpable lesion larger than 1 cm (a macule that is >1 cm); examples include vitiligo and port-wine stain",
      wrong1: "Papule: a raised, palpable lesion less than 1 cm", wrong2: "Vesicle: a fluid-filled blister less than 1 cm", wrong3: "Nodule: a solid, palpable lesion extending deeper into the dermis",
      tags: ["dermatology", "skin-assessment", "lesion-terminology", "patch", "macule"], topic: "Integumentary Assessment", sub: "Lesion Classification" },
    { stem: "An LPN is assisting a patient with newly diagnosed heart failure to understand their fluid restriction of 1500 mL per day. Which teaching point is MOST important?",
      correct: "All fluids count toward the daily limit including water, juice, coffee, soup, ice cream, gelatin, and ice chips; the patient should measure and record all fluid intake and distribute the allowance throughout the day",
      wrong1: "Only water counts toward the fluid restriction; other beverages are unlimited", wrong2: "The fluid restriction only applies during waking hours; the patient can drink freely at night", wrong3: "Fluid restriction means avoiding all oral fluids and relying only on IV fluids",
      tags: ["heart-failure", "fluid-restriction", "patient-education", "self-management", "nutrition"], topic: "Heart Failure Management", sub: "Fluid Restriction Education" },
    { stem: "An LPN is inserting a nasogastric (NG) tube. During insertion, the patient begins coughing, choking, and turns cyanotic. What should the LPN do immediately?",
      correct: "Remove the tube immediately as it has likely entered the trachea instead of the esophagus; allow the patient to rest and reoxygenate, then reattempt insertion after ensuring proper positioning technique",
      wrong1: "Continue advancing the tube since coughing is normal during NG insertion", wrong2: "Flush the tube with 30 mL of water to check placement while the patient is coughing", wrong3: "Apply suction to the tube to clear the patient's airway",
      tags: ["NG-tube", "insertion", "complication", "tracheal-intubation", "patient-safety"], topic: "Nasogastric Tube", sub: "Safe Insertion" },
    { stem: "An LPN is caring for a patient receiving a unit of packed red blood cells (PRBCs). The patient develops urticaria (hives) but has stable vital signs and no respiratory distress. What should the LPN do?",
      correct: "Slow the transfusion rate, notify the RN and physician, and anticipate an order for diphenhydramine (Benadryl); if symptoms resolve after antihistamine, the transfusion may be resumed per physician order; continue to monitor closely",
      wrong1: "Stop the transfusion, disconnect the blood product, and discard it immediately", wrong2: "Increase the transfusion rate to finish the unit quickly before symptoms worsen", wrong3: "Apply calamine lotion to the hives and continue the transfusion at the same rate",
      tags: ["blood-transfusion", "allergic-reaction", "urticaria", "antihistamine", "transfusion-reaction"], topic: "Blood Transfusion", sub: "Mild Allergic Reaction" },
    { stem: "An LPN is providing wound care education to a patient with diabetes who has a foot ulcer. Which instruction is MOST important for preventing further complications?",
      correct: "Inspect your feet daily (use a mirror for the soles), wash and thoroughly dry between toes, wear properly fitting shoes and clean socks, never walk barefoot, manage blood glucose carefully, and report any changes in skin color, temperature, or sensation immediately",
      wrong1: "Soak your feet in hot water for 30 minutes daily to improve circulation", wrong2: "Use a razor blade to carefully trim calluses and corns at home", wrong3: "Apply heating pads to the feet to keep them warm and promote healing",
      tags: ["diabetes", "foot-care", "ulcer-prevention", "patient-education", "neuropathy"], topic: "Diabetic Foot Care", sub: "Prevention Education" },
  ];

  for (const pm of pnMore) {
    qs.push({ tier: "rpn", exam: "NCLEX-PN", qt: "MCQ", stem: pm.stem,
      options: [O("A", pm.wrong1), O("B", pm.correct), O("C", pm.wrong2), O("D", pm.wrong3)],
      ca: ["B"], rat: `${pm.correct}. This question tests knowledge of safe, evidence-based nursing practice in the clinical setting. Understanding the rationale behind each intervention helps the nurse provide optimal patient care.`,
      diff: 2, tags: pm.tags, topic: pm.topic, sub: pm.sub, rs: "US",
      cp: `Key concept: ${pm.correct.substring(0, 60)}`, es: "Select the answer demonstrating evidence-based practice and patient safety",
      ct: "Avoid outdated practices that could cause harm", dr: { A: "Incorrect or harmful approach", C: "Inappropriate intervention", D: "Dangerous or ineffective" }, bs: "Physiological Integrity" });
  }

  // Additional NCLEX-RN questions for various domains
  const rnMore = [
    { topic: "Ethical & Legal", sub: "Informed Consent", stem: "An RN is preparing a patient for surgery. The patient asks the RN to explain the surgical procedure, risks, and alternatives. What is the RN's appropriate response?",
      correct: "Explain that obtaining informed consent is the physician/surgeon's responsibility, which includes explaining the procedure, risks, benefits, and alternatives; the RN's role is to ensure the consent form is signed, witness the patient's signature, and verify the patient understands the information and is not coerced",
      wrong1: "Provide a detailed explanation of the surgical technique, including the specific incisions and suturing methods",
      wrong2: "Tell the patient to just sign the form since the surgeon already decided the procedure is necessary",
      wrong3: "Refuse to discuss anything about the surgery and direct all questions to the hospital's legal department",
      tags: ["informed-consent", "surgical", "legal", "patient-rights", "nurse-role"] },
    { topic: "Leadership", sub: "Conflict Resolution", stem: "An RN charge nurse notices that two staff nurses are having a heated disagreement about patient care in the hallway within earshot of patients and families. What is the charge nurse's FIRST action?",
      correct: "Intervene immediately to redirect the nurses to a private area, then facilitate a calm discussion to resolve the disagreement using evidence-based practice guidelines and a collaborative approach",
      wrong1: "Ignore the conflict since adults should be able to resolve their own disagreements",
      wrong2: "Write both nurses up for disciplinary action without addressing the underlying issue",
      wrong3: "Take sides with the nurse who has more experience since seniority determines who is correct",
      tags: ["leadership", "conflict-resolution", "professionalism", "patient-environment", "charge-nurse"] },
    { topic: "Quality Improvement", sub: "Evidence-Based Practice Implementation", stem: "An RN is leading a quality improvement project to reduce central line-associated bloodstream infections (CLABSI) on the unit. Which evidence-based intervention bundle should be implemented?",
      correct: "The CDC/IHI Central Line Bundle: hand hygiene, full barrier precautions during insertion, chlorhexidine skin antisepsis, optimal catheter site selection (subclavian preferred over femoral), daily review of line necessity with prompt removal when no longer needed, and standardized maintenance bundles",
      wrong1: "Apply topical antibiotics to the insertion site daily and change the dressing every 24 hours",
      wrong2: "Replace all central lines routinely every 3 days regardless of indication or complications",
      wrong3: "Use povidone-iodine instead of chlorhexidine for skin antisepsis and avoid dressing the site",
      tags: ["CLABSI", "central-line-bundle", "quality-improvement", "infection-prevention", "evidence-based"] },
    { topic: "Pediatric Nursing", sub: "Growth and Development", stem: "An RN is assessing a 9-month-old infant. Which developmental milestone would the RN expect to observe?",
      correct: "Sits without support, crawls, pulls to stand, uses pincer grasp (thumb and forefinger), says 'mama' and 'dada' non-specifically, demonstrates stranger anxiety, and plays peek-a-boo",
      wrong1: "Walks independently, speaks in 2-3 word sentences, and is fully toilet trained",
      wrong2: "Turns head to sound, has social smile, and holds head up when prone (these are 2-4 month milestones)",
      wrong3: "Rides a tricycle, counts to 10, and dresses independently (these are preschool milestones)",
      tags: ["developmental-milestones", "9-month", "infant", "growth-development", "pediatric-assessment"] },
    { topic: "Psychiatric Nursing", sub: "Eating Disorders", stem: "An RN is caring for a patient admitted with anorexia nervosa whose BMI is 15 kg/m2 (normal 18.5-24.9). When refeeding is initiated, which potentially fatal complication must the RN monitor for?",
      correct: "Refeeding syndrome: a potentially lethal shift in fluids and electrolytes (especially phosphorus, potassium, and magnesium) that occurs when nutrition is reintroduced after prolonged starvation, causing cardiac failure, respiratory failure, seizures, and death",
      wrong1: "Immediate weight gain of 5 kg in the first 24 hours of eating",
      wrong2: "Hyperglycemia requiring insulin therapy within the first hour of eating",
      wrong3: "Development of food allergies from the reintroduction of previously avoided foods",
      tags: ["eating-disorders", "anorexia-nervosa", "refeeding-syndrome", "hypophosphatemia", "psychiatric"] },
    { topic: "Gerontology", sub: "Delirium vs Dementia", stem: "An RN is assessing an 80-year-old hospitalized patient who was oriented on admission yesterday but is now confused, agitated, and having visual hallucinations. Which characteristic helps differentiate delirium from dementia?",
      correct: "Delirium has an ACUTE onset (hours to days), FLUCTUATING course, is typically REVERSIBLE when the underlying cause is identified and treated, and often involves altered level of consciousness and inattention; dementia has a GRADUAL onset (months to years) and is generally IRREVERSIBLE",
      wrong1: "Delirium and dementia are the same condition with the same treatment",
      wrong2: "Dementia always develops suddenly overnight and is easily reversed with medication",
      wrong3: "Delirium is a normal age-related change that does not require medical evaluation",
      tags: ["delirium", "dementia", "geriatric", "altered-mental-status", "acute-confusion"] },
  ];

  for (const rm of rnMore) {
    qs.push({ tier: "rn", exam: "NCLEX-RN", qt: "MCQ", stem: rm.stem,
      options: [O("A", rm.wrong1), O("B", rm.correct), O("C", rm.wrong2), O("D", rm.wrong3)],
      ca: ["B"], rat: `${rm.correct}. Understanding the underlying principles helps guide clinical decision-making and promotes safe, evidence-based nursing practice.`,
      diff: 3, tags: rm.tags, topic: rm.topic, sub: rm.sub, rs: "BOTH",
      cp: `Key concept: ${rm.correct.substring(0, 60)}`, es: "Select answers based on current evidence-based guidelines and systematic clinical reasoning",
      ct: "Avoid answers that describe outdated practices or misconceptions about the condition", dr: { A: "Incorrect understanding of the concept", C: "Outdated or inaccurate information", D: "This is not consistent with current evidence-based practice" }, bs: "Safe & Effective Care Environment" });
  }

  return qs;
}

async function main() {
  console.log("=== Parametric Question Bank Batch ===\n");

  const beforeCounts = await pool.query(
    `SELECT tier, exam, COUNT(*)::int as count FROM exam_questions WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN') GROUP BY tier, exam ORDER BY tier, exam`
  );
  console.log("BEFORE counts:");
  for (const r of beforeCounts.rows) console.log(`  ${r.tier}/${r.exam}: ${r.count}`);

  const allQs = buildQuestions();
  console.log(`\nGenerated ${allQs.length} questions total`);
  const breakdown: Record<string, number> = {};
  for (const q of allQs) { breakdown[q.exam] = (breakdown[q.exam] || 0) + 1; }
  console.log("Breakdown:", breakdown);

  let inserted = 0, duplicates = 0, errors = 0;

  for (const q of allQs) {
    const hash = stemHash(q.stem);
    try {
      const existing = await pool.query(
        `SELECT id FROM exam_questions WHERE stem_hash = $1 AND tier = $2 AND exam = $3 LIMIT 1`,
        [hash, q.tier, q.exam]
      );
      if (existing.rows.length > 0) { duplicates++; continue; }

      await pool.query(
        `INSERT INTO exam_questions (id, tier, exam, question_type, status, stem, options, correct_answer, rationale, difficulty, tags, body_system, topic, subtopic, region_scope, stem_hash, scenario, clinical_pearl, exam_strategy, clinical_trap, distractor_rationales, career_type, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, 'published', $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 'nursing', NOW(), NOW())`,
        [q.tier, q.exam, q.qt, q.stem, JSON.stringify(q.options), JSON.stringify(q.ca), q.rat, q.diff, q.tags, q.bs, q.topic, q.sub, q.rs, hash, q.stem.substring(0, 120), q.cp, q.es, q.ct, JSON.stringify(q.dr)]
      );
      inserted++;
    } catch (err: any) {
      errors++;
      console.error(`  [ERROR]: ${err.message.substring(0, 120)}`);
    }
  }

  console.log(`\nInserted: ${inserted}, Duplicates: ${duplicates}, Errors: ${errors}`);

  const afterCounts = await pool.query(
    `SELECT tier, exam, COUNT(*)::int as count FROM exam_questions WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN') GROUP BY tier, exam ORDER BY tier, exam`
  );
  console.log("\nAFTER counts:");
  for (const r of afterCounts.rows) console.log(`  ${r.tier}/${r.exam}: ${r.count}`);

  // Show topic distribution
  const topicDist = await pool.query(
    `SELECT exam, topic, COUNT(*)::int as cnt FROM exam_questions WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN') AND created_at > NOW() - INTERVAL '1 hour' GROUP BY exam, topic ORDER BY exam, cnt DESC`
  );
  console.log("\nTopic distribution (recent questions):");
  for (const r of topicDist.rows) console.log(`  ${r.exam}: ${r.topic} = ${r.cnt}`);

  await pool.end();
  console.log("\n=== Done! ===");
}

main().catch(err => { console.error("Fatal:", err); process.exit(1); });
