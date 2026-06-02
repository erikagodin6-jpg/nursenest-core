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
  "abdominal-assessment-rpn": {
    title: "Abdominal Assessment for Practical Nurses",
    cellular: {
      title: "Anatomy and Physiology of Abdominal Assessment",
      content: "The abdomen contains organs from multiple body systems, including the gastrointestinal tract (stomach, small and large intestines, liver, gallbladder, pancreas), the urinary system (kidneys, ureters, bladder), the spleen, and the abdominal aorta. The peritoneum is a serous membrane that lines the abdominal cavity and covers most abdominal organs; inflammation of this membrane (peritonitis) constitutes a surgical emergency. For clinical assessment, the abdomen is divided into four quadrants using the umbilicus as the central landmark: right upper quadrant (RUQ) containing the liver, gallbladder, and right kidney; left upper quadrant (LUQ) containing the spleen, stomach, and left kidney; right lower quadrant (RLQ) containing the appendix, cecum, and right ovary/fallopian tube in females; and left lower quadrant (LLQ) containing the sigmoid colon and left ovary/fallopian tube. Alternatively, nine regions may be used for more precise localization. Abdominal assessment follows a specific sequence that differs from other body system assessments: inspection, auscultation, percussion, and palpation. Auscultation must be performed BEFORE percussion and palpation because physical manipulation of the abdomen can alter peristaltic sounds and produce false findings. Normal bowel sounds occur every 5 to 15 seconds and are described as high-pitched gurgling or clicking sounds. The practical nurse must be able to recognize and accurately describe abdominal findings including distension, guarding, rigidity, rebound tenderness, and referred pain patterns to report to the physician or nurse practitioner promptly."
    },
    riskFactors: [
      "Advanced age (decreased abdominal muscle tone, altered pain perception)",
      "History of abdominal surgery (adhesion formation, altered anatomy)",
      "Chronic NSAID or corticosteroid use (increased risk of GI bleeding and ulceration)",
      "Alcohol use disorder (liver disease, pancreatitis, gastritis)",
      "Immobility (constipation, ileus risk)",
      "Opioid use (decreased bowel motility, constipation)",
      "Diabetes mellitus (gastroparesis, neuropathy affecting visceral sensation)"
    ],
    diagnostics: [
      "Abdominal X-ray (KUB): identifies bowel obstruction, free air under diaphragm, and calcifications; no patient prep needed",
      "CT scan with contrast: gold standard for evaluating acute abdominal pain; check for contrast allergy and renal function (creatinine) before scan",
      "Abdominal ultrasound: first-line for gallbladder pathology and abdominal aortic aneurysm screening; patient should be NPO for 8-12 hours",
      "Complete blood count (CBC): elevated WBC suggests infection or inflammation; low hemoglobin may indicate GI bleeding",
      "Serum lipase and amylase: lipase is more specific for pancreatitis; elevation 3x normal is diagnostic",
      "Liver function tests (AST, ALT, ALP, bilirubin): elevated in hepatobiliary disease; ALT is most specific for liver cell damage"
    ],
    management: [
      "Maintain NPO status as ordered for patients with suspected surgical abdomen or pending diagnostic procedures",
      "Position patient in semi-Fowler or knee-to-chest position to reduce abdominal tension and promote comfort",
      "Administer analgesics as prescribed; note that pain assessment should be performed before AND after medication administration",
      "Insert and maintain nasogastric tube (NGT) if ordered for decompression; verify placement per facility protocol before use",
      "Monitor intake and output strictly; report urine output less than 30 mL/hour",
      "Apply sequential compression devices (SCDs) to prevent deep vein thrombosis in patients on bedrest",
      "Provide oral care every 2 hours for patients who are NPO or have NGT in place"
    ],
    nursingActions: [
      "Perform abdominal assessment using the correct sequence: inspect, auscultate, percuss, palpate -- auscultation BEFORE palpation is critical",
      "Auscultate all four quadrants for at least 5 minutes total before documenting absent bowel sounds",
      "Report rigid, board-like abdomen immediately as it indicates possible peritonitis (surgical emergency)",
      "Document pain using PQRST format: Provocation, Quality, Region/Radiation, Severity, Timing",
      "Monitor vital signs every 4 hours or as ordered; tachycardia and hypotension may indicate internal hemorrhage",
      "Measure abdominal girth at the umbilicus with a consistent technique each time to detect distension changes",
      "Report new-onset rebound tenderness, involuntary guarding, or absent bowel sounds to the physician immediately"
    ],
    assessmentFindings: [
      "Hyperactive bowel sounds (high-pitched, frequent, rushing): may indicate early obstruction, gastroenteritis, or diarrhea",
      "Hypoactive or absent bowel sounds: may indicate paralytic ileus, peritonitis, or post-surgical state",
      "Abdominal distension with tympany on percussion: suggests gas accumulation or obstruction",
      "Rebound tenderness (Blumberg sign): pain worsens when pressure is released; positive sign suggests peritoneal irritation",
      "Murphy sign positive: inspiratory arrest during RUQ palpation; classic for acute cholecystitis",
      "McBurney point tenderness: pain at one-third the distance from the ASIS to the umbilicus; classic for appendicitis",
      "Grey Turner sign (flank bruising) or Cullen sign (periumbilical bruising): suggest retroperitoneal hemorrhage or hemorrhagic pancreatitis"
    ],
    signs: {
      left: [
        "Abdominal distension and visible peristalsis",
        "Guarding (voluntary muscle tensing) on palpation",
        "Hyperactive or hypoactive bowel sounds",
        "Nausea and vomiting",
        "Changes in bowel pattern (constipation or diarrhea)",
        "Mild tenderness localized to one quadrant"
      ],
      right: [
        "Rigid, board-like abdomen (peritonitis)",
        "Absent bowel sounds beyond 5 minutes of auscultation",
        "Rebound tenderness (peritoneal irritation)",
        "Grey Turner sign or Cullen sign (hemorrhage)",
        "Hematemesis (vomiting blood) or melena (tarry stools)",
        "Sudden severe abdominal pain with hypotension and tachycardia"
      ]
    },
    medications: [
      {
        name: "Ondansetron (Zofran)",
        type: "Antiemetic (5-HT3 receptor antagonist)",
        action: "Blocks serotonin receptors in the chemoreceptor trigger zone and vagal nerve terminals in the GI tract, preventing nausea and vomiting signals from reaching the vomiting center in the medulla",
        sideEffects: "Headache, constipation, dizziness, QT prolongation (dose-dependent)",
        contra: "Congenital long QT syndrome; use caution with other QT-prolonging medications",
        pearl: "Check ECG in patients receiving multiple doses or those with cardiac history; maximum IV dose 16 mg per dose to reduce QT prolongation risk"
      },
      {
        name: "Pantoprazole (Pantoloc/Protonix)",
        type: "Proton pump inhibitor (PPI)",
        action: "Irreversibly binds to the hydrogen-potassium ATPase enzyme (proton pump) on gastric parietal cells, blocking the final step of acid secretion and raising gastric pH",
        sideEffects: "Headache, diarrhea, abdominal pain; long-term use associated with vitamin B12 deficiency, hypomagnesemia, and Clostridioides difficile infection",
        contra: "Known hypersensitivity; concurrent use with rilpivirine or atazanavir (decreased absorption of these drugs)",
        pearl: "IV pantoprazole is given for acute GI bleeding; oral form should be taken 30-60 minutes before breakfast on an empty stomach for best acid suppression"
      },
      {
        name: "Metoclopramide (Reglan/Maxeran)",
        type: "Prokinetic agent and antiemetic (dopamine D2 antagonist)",
        action: "Increases upper GI motility by enhancing acetylcholine release from myenteric neurons and blocking dopamine D2 receptors in the chemoreceptor trigger zone; accelerates gastric emptying",
        sideEffects: "Drowsiness, restlessness, diarrhea, extrapyramidal symptoms (EPS), tardive dyskinesia with prolonged use",
        contra: "GI obstruction, perforation, or hemorrhage; pheochromocytoma; seizure disorder; concurrent use with other dopamine antagonists",
        pearl: "Use for shortest duration possible (usually no more than 12 weeks); monitor for involuntary facial movements (tardive dyskinesia) which may be irreversible; administer 30 minutes before meals"
      }
    ],
    pearls: [
      "The CRITICAL sequence for abdominal assessment is: Inspect, Auscultate, Percuss, Palpate -- auscultation must come BEFORE palpation to avoid altering bowel sounds",
      "Listen for at least 5 minutes in each quadrant before documenting absent bowel sounds -- premature documentation can lead to missed findings",
      "A rigid (board-like) abdomen is a red flag for peritonitis and requires immediate physician notification -- this is a potential surgical emergency",
      "Murphy sign is tested by palpating the RUQ while asking the patient to inhale deeply -- positive if the patient catches their breath and stops inhaling due to pain",
      "McBurney point tenderness is assessed at a point one-third of the distance from the right anterior superior iliac spine (ASIS) to the umbilicus",
      "Grey Turner sign (flank ecchymosis) and Cullen sign (periumbilical ecchymosis) are late signs of retroperitoneal hemorrhage and indicate a life-threatening emergency",
      "Always document abdominal girth measurements at the level of the umbilicus using the same technique to ensure consistency and detect changes in distension"
    ],
    quiz: [
      {
        question: "A practical nurse is preparing to perform an abdominal assessment. In which order should the assessment techniques be performed?",
        options: [
          "Inspect, palpate, percuss, auscultate",
          "Inspect, auscultate, percuss, palpate",
          "Auscultate, inspect, palpate, percuss",
          "Inspect, percuss, palpate, auscultate"
        ],
        correct: 1,
        rationale: "The correct sequence for abdominal assessment is inspect, auscultate, percuss, palpate. Auscultation must be performed before percussion and palpation because physical manipulation can alter peristaltic activity and produce false findings."
      },
      {
        question: "A patient presents with tenderness at McBurney point. The practical nurse recognizes this finding is most consistent with which condition?",
        options: [
          "Acute cholecystitis",
          "Acute appendicitis",
          "Acute pancreatitis",
          "Splenic rupture"
        ],
        correct: 1,
        rationale: "McBurney point tenderness (located one-third the distance from the right anterior superior iliac spine to the umbilicus) is a classic assessment finding for acute appendicitis. Cholecystitis is associated with Murphy sign (RUQ pain on inspiration)."
      },
      {
        question: "The practical nurse observes bluish discoloration around a patient's umbilicus following an episode of severe abdominal pain. Which finding does this represent?",
        options: [
          "Murphy sign",
          "Blumberg sign",
          "Cullen sign",
          "Rovsing sign"
        ],
        correct: 2,
        rationale: "Cullen sign is periumbilical ecchymosis (bluish discoloration around the umbilicus) indicating retroperitoneal hemorrhage, often associated with hemorrhagic pancreatitis or ruptured ectopic pregnancy. Grey Turner sign (flank ecchymosis) is a related finding."
      }
    ]
  },

  "acid-base-balance-rpn": {
    title: "Acid-Base Balance and Arterial Blood Gas Interpretation",
    cellular: {
      title: "Physiology of Acid-Base Homeostasis",
      content: "The body maintains blood pH within a very narrow range of 7.35 to 7.45, which is slightly alkaline. Even small deviations outside this range can impair enzyme function, alter electrolyte balance, and compromise cellular metabolism. Three primary regulatory systems maintain acid-base balance: the chemical buffer system (responds within seconds), the respiratory system (responds within minutes), and the renal system (responds within hours to days). The bicarbonate buffer system is the body's most important extracellular buffer, consisting of carbonic acid (H2CO3) and bicarbonate (HCO3-). The normal ratio of bicarbonate to carbonic acid is 20:1, and this ratio -- not the absolute values -- determines blood pH. The respiratory system regulates pH by adjusting the rate and depth of ventilation, thereby controlling CO2 elimination. When CO2 accumulates (hypoventilation), it combines with water to form carbonic acid, lowering pH (acidosis). When CO2 is blown off through hyperventilation, carbonic acid decreases and pH rises (alkalosis). The kidneys regulate acid-base balance by reabsorbing or excreting bicarbonate and hydrogen ions. The kidneys can regenerate bicarbonate and excrete hydrogen ions in the form of ammonium (NH4+) and titratable acids. An arterial blood gas (ABG) provides four critical values: pH (7.35-7.45), PaCO2 (35-45 mmHg, the respiratory component), HCO3- (22-26 mEq/L, the metabolic component), and PaO2 (80-100 mmHg, oxygenation status). The practical nurse must understand these values to recognize acid-base disturbances and report findings accurately. Compensation occurs when one system attempts to correct the imbalance caused by the other: respiratory compensation adjusts CO2 within minutes, while renal (metabolic) compensation adjusts HCO3- over hours to days. Full compensation returns pH to normal range; partial compensation moves pH toward normal but does not fully restore it."
    },
    riskFactors: [
      "Chronic obstructive pulmonary disease (impaired CO2 elimination leads to respiratory acidosis)",
      "Diabetes mellitus (diabetic ketoacidosis from ketone body accumulation)",
      "Chronic kidney disease (impaired hydrogen ion excretion and bicarbonate regeneration)",
      "Prolonged vomiting (loss of hydrochloric acid leads to metabolic alkalosis)",
      "Prolonged diarrhea (loss of bicarbonate leads to metabolic acidosis)",
      "Mechanical ventilation (risk of respiratory alkalosis from over-ventilation)",
      "Anxiety/panic disorder (hyperventilation-induced respiratory alkalosis)"
    ],
    diagnostics: [
      "Arterial blood gas (ABG): the definitive test for acid-base status; provides pH, PaCO2, HCO3-, PaO2; collect in heparinized syringe, on ice, to lab within 15 minutes",
      "Basic metabolic panel (BMP): serum bicarbonate (CO2 content on BMP approximates HCO3-), electrolytes (potassium shifts with pH), BUN/creatinine for renal function",
      "Anion gap calculation: Na+ - (Cl- + HCO3-); normal 8-12 mEq/L; elevated anion gap indicates accumulation of unmeasured acids (ketoacids, lactic acid, uremic toxins)",
      "Serum lactate: elevated in lactic acidosis from tissue hypoperfusion, sepsis, or shock",
      "Urine pH: helps differentiate renal vs. non-renal causes of metabolic acidosis; kidneys should acidify urine (pH less than 5.5) in metabolic acidosis",
      "Serum ketones: elevated in diabetic ketoacidosis (DKA), alcoholic ketoacidosis, and starvation ketoacidosis"
    ],
    management: [
      "Respiratory acidosis: improve ventilation -- suction airway, administer bronchodilators, adjust ventilator settings as ordered, position patient upright",
      "Respiratory alkalosis: reduce hyperventilation -- coach slow breathing, treat underlying anxiety, adjust ventilator rate if mechanically ventilated",
      "Metabolic acidosis: treat underlying cause (insulin for DKA, fluids for lactic acidosis); administer sodium bicarbonate IV if pH below 7.1 as ordered",
      "Metabolic alkalosis: replace potassium and chloride (normal saline infusion); discontinue causative medications (loop diuretics, antacids)",
      "Monitor and replace electrolytes, especially potassium: acidosis causes potassium to shift OUT of cells (hyperkalemia), alkalosis causes potassium to shift INTO cells (hypokalemia)",
      "Monitor respiratory rate, depth, and pattern every 1-2 hours in acute acid-base disturbances",
      "Apply oxygen therapy as prescribed; monitor SpO2 continuously; titrate to maintain saturation above 92% (or as ordered for COPD patients)"
    ],
    nursingActions: [
      "Perform Allen test before radial artery ABG draw to confirm collateral circulation via the ulnar artery",
      "Apply firm pressure to the arterial puncture site for a minimum of 5 minutes after ABG draw (10 minutes if on anticoagulants)",
      "Use the ROME mnemonic to interpret ABGs: Respiratory Opposite (pH and PaCO2 move in opposite directions) / Metabolic Equal (pH and HCO3- move in the same direction)",
      "Monitor for Kussmaul respirations (deep, rapid breathing) -- a compensatory mechanism for metabolic acidosis",
      "Report any ABG with pH below 7.25 or above 7.55 immediately as these represent life-threatening acid-base imbalances",
      "Monitor cardiac rhythm continuously -- both acidosis and alkalosis can cause dysrhythmias, especially when potassium levels are abnormal",
      "Maintain accurate intake and output records; administer IV fluids as prescribed to support renal compensation"
    ],
    assessmentFindings: [
      "Acidosis (pH below 7.35): confusion, drowsiness, headache, Kussmaul respirations (metabolic), hypoventilation (respiratory), warm flushed skin, hypotension",
      "Alkalosis (pH above 7.45): lightheadedness, tingling/numbness in extremities, muscle cramps, tetany, hyperactive reflexes, seizures",
      "Respiratory acidosis: decreased level of consciousness, CO2 narcosis (confusion, somnolence), bounding pulse, papilledema",
      "Respiratory alkalosis: dizziness, carpopedal spasm, circumoral numbness, palpitations, chest tightness",
      "Metabolic acidosis: fruity breath odor (DKA), deep rapid breathing (Kussmaul), nausea, vomiting, fatigue, abdominal pain",
      "Metabolic alkalosis: slow shallow respirations (compensatory), muscle weakness, decreased bowel sounds, polyuria"
    ],
    signs: {
      left: [
        "Changes in respiratory rate and depth",
        "Mild confusion or restlessness",
        "Nausea or vomiting",
        "Muscle weakness or cramps",
        "Headache",
        "Fatigue and malaise"
      ],
      right: [
        "Kussmaul respirations (deep, rapid, labored breathing)",
        "Cardiac dysrhythmias (especially with concurrent potassium shifts)",
        "Seizures",
        "Loss of consciousness or coma",
        "Carpopedal spasm and tetany (alkalosis)",
        "pH below 7.1 or above 7.6 (life-threatening)"
      ]
    },
    medications: [
      {
        name: "Sodium Bicarbonate (NaHCO3)",
        type: "Alkalinizing agent / systemic buffer",
        action: "Dissociates into sodium and bicarbonate ions in the blood, directly increasing serum HCO3- concentration and raising blood pH; neutralizes excess hydrogen ions in severe metabolic acidosis",
        sideEffects: "Metabolic alkalosis (overcorrection), hypernatremia, fluid overload, hypokalemia (alkalosis drives potassium into cells), tissue necrosis if IV extravasation occurs",
        contra: "Metabolic or respiratory alkalosis; hypocalcemia (alkalosis decreases ionized calcium); chloride-responsive metabolic alkalosis (treat with normal saline instead)",
        pearl: "Reserved for severe metabolic acidosis (pH below 7.1); must be given slowly IV and never mixed with calcium-containing solutions (precipitates); monitor ABGs every 15-30 minutes during infusion"
      },
      {
        name: "Acetazolamide (Diamox)",
        type: "Carbonic anhydrase inhibitor / weak diuretic",
        action: "Inhibits carbonic anhydrase enzyme in the proximal renal tubule, reducing bicarbonate reabsorption and increasing bicarbonate excretion in the urine; produces a mild metabolic acidosis that can correct metabolic alkalosis",
        sideEffects: "Metabolic acidosis (therapeutic or excessive), hypokalemia, drowsiness, paresthesias (tingling), kidney stones (alkaline urine precipitates calcium)",
        contra: "Severe renal or hepatic disease; hyponatremia; hypokalemia; sulfonamide allergy (cross-sensitivity); adrenal insufficiency",
        pearl: "Also used for altitude sickness prophylaxis and glaucoma; encourage increased fluid intake to prevent kidney stones; monitor potassium levels closely during therapy"
      },
      {
        name: "Potassium Chloride (KCl)",
        type: "Electrolyte replacement",
        action: "Provides exogenous potassium and chloride ions to correct deficiencies; critical in acid-base management because potassium shifts between intracellular and extracellular compartments with pH changes (H+/K+ exchange)",
        sideEffects: "Hyperkalemia (cardiac arrest risk), GI irritation (nausea, vomiting, diarrhea), phlebitis at IV site, cardiac dysrhythmias",
        contra: "Hyperkalemia; severe renal impairment (impaired potassium excretion); concurrent use with potassium-sparing diuretics; untreated Addison disease",
        pearl: "NEVER give IV potassium as a bolus -- always dilute and infuse via pump at no more than 10-20 mEq/hour; monitor cardiac telemetry during IV infusion; oral forms should be taken with food and a full glass of water to prevent GI ulceration"
      }
    ],
    pearls: [
      "ROME mnemonic: Respiratory = Opposite (pH and PaCO2 go opposite directions), Metabolic = Equal (pH and HCO3- go same direction) -- use this to quickly identify the primary disturbance",
      "Acidosis shifts potassium OUT of cells (hyperkalemia risk); alkalosis shifts potassium INTO cells (hypokalemia risk) -- always check potassium when managing acid-base disorders",
      "Kussmaul respirations (deep, rapid, labored breathing) are the body's attempt to blow off CO2 to compensate for metabolic acidosis -- classic in DKA",
      "The anion gap helps differentiate causes of metabolic acidosis: elevated gap (MUDPILES: Methanol, Uremia, DKA, Propylene glycol, Isoniazid, Lactic acidosis, Ethylene glycol, Salicylates) vs. normal gap (hyperchloremic acidosis from diarrhea or renal tubular acidosis)",
      "Allen test must be performed before radial artery ABG draw to confirm adequate ulnar collateral flow -- compress both arteries, release ulnar, palm should reperfuse within 5-10 seconds",
      "Respiratory compensation occurs within minutes (adjusting ventilation rate); renal compensation takes hours to days (adjusting bicarbonate reabsorption) -- this timing helps identify acute vs. chronic disturbances"
    ],
    quiz: [
      {
        question: "A patient with diabetic ketoacidosis has the following ABG: pH 7.28, PaCO2 22 mmHg, HCO3- 12 mEq/L. Using the ROME mnemonic, which acid-base disturbance does this represent?",
        options: [
          "Respiratory acidosis with metabolic compensation",
          "Metabolic acidosis with respiratory compensation",
          "Respiratory alkalosis with metabolic compensation",
          "Metabolic alkalosis with respiratory compensation"
        ],
        correct: 1,
        rationale: "pH 7.28 is acidotic. Using ROME: pH and HCO3- are moving in the same direction (both low) = Metabolic Equal, so the primary disturbance is metabolic acidosis. The low PaCO2 (22 mmHg) represents respiratory compensation (the body is hyperventilating to blow off CO2 and raise pH). This is consistent with DKA."
      },
      {
        question: "A practical nurse is preparing to draw an arterial blood gas from the radial artery. Which assessment must be performed first?",
        options: [
          "Checking the patient's coagulation studies",
          "Performing the Allen test",
          "Obtaining a venous blood sample",
          "Applying a tourniquet to the wrist"
        ],
        correct: 1,
        rationale: "The Allen test must be performed before a radial artery ABG draw to assess collateral circulation through the ulnar artery. Both arteries are compressed, then the ulnar artery is released. The palm should reperfuse within 5-10 seconds, confirming adequate collateral flow."
      },
      {
        question: "A patient with metabolic acidosis (pH 7.20) is being treated with IV sodium bicarbonate. Which electrolyte must the practical nurse monitor most closely during this infusion?",
        options: [
          "Sodium",
          "Calcium",
          "Potassium",
          "Magnesium"
        ],
        correct: 2,
        rationale: "Potassium must be monitored closely during sodium bicarbonate administration. As pH rises (becomes less acidotic), potassium shifts back into cells (intracellular shift), which can cause dangerous hypokalemia. Hypokalemia can lead to cardiac dysrhythmias, muscle weakness, and respiratory failure."
      }
    ]
  },

  "calcium-imbalance-rpn": {
    title: "Calcium Imbalance: Hypocalcemia and Hypercalcemia",
    cellular: {
      title: "Calcium Homeostasis and Cellular Function",
      content: "Calcium is the most abundant mineral in the body, with approximately 99% stored in bones and teeth and only 1% circulating in the blood. Normal total serum calcium ranges from 8.5 to 10.5 mg/dL (2.12-2.62 mmol/L). Approximately 50% of serum calcium is bound to albumin (inactive), 40% is ionized/free (biologically active), and 10% is bound to other anions. The ionized fraction (normal 4.5-5.5 mg/dL or 1.12-1.37 mmol/L) is the physiologically important form that affects neuromuscular excitability, cardiac conduction, blood clotting, and bone metabolism. Three hormones regulate calcium balance: parathyroid hormone (PTH) raises serum calcium by stimulating osteoclast activity (bone resorption), increasing renal calcium reabsorption, and activating vitamin D; calcitonin (from thyroid C-cells) lowers serum calcium by inhibiting osteoclast activity; and active vitamin D (calcitriol) increases intestinal calcium absorption. Calcium and phosphorus have an inverse relationship -- when one rises, the other tends to fall. Calcium also has an important relationship with albumin: low albumin causes falsely low total calcium (correct by adding 0.8 mg/dL for each 1 g/dL decrease in albumin below 4 g/dL). Hypocalcemia (total calcium below 8.5 mg/dL) increases neuromuscular excitability, causing tetany, muscle spasms, and cardiac conduction abnormalities. Hypercalcemia (total calcium above 10.5 mg/dL) decreases neuromuscular excitability, causing muscle weakness, lethargy, constipation, and potentially fatal cardiac dysrhythmias. The practical nurse must recognize the clinical manifestations of calcium imbalances and understand the urgency of reporting and intervening appropriately."
    },
    riskFactors: [
      "Hypoparathyroidism (post-thyroidectomy or parathyroidectomy -- most common surgical cause of hypocalcemia)",
      "Vitamin D deficiency (inadequate dietary intake, malabsorption, chronic kidney disease)",
      "Chronic kidney disease (impaired vitamin D activation and phosphorus retention)",
      "Malignancy with bone metastases (osteolytic activity releases calcium -- most common cause of hypercalcemia in hospitalized patients)",
      "Primary hyperparathyroidism (most common cause of hypercalcemia in outpatients)",
      "Immobility (calcium leaches from bones into blood -- disuse osteoporosis)",
      "Medications: loop diuretics (increase calcium excretion -- hypocalcemia), thiazide diuretics (decrease calcium excretion -- hypercalcemia), lithium (stimulates PTH)"
    ],
    diagnostics: [
      "Total serum calcium (normal 8.5-10.5 mg/dL): must be interpreted in context of albumin level; corrected calcium = total Ca + 0.8 x (4 - albumin)",
      "Ionized calcium (normal 4.5-5.5 mg/dL): the biologically active form; more accurate than total calcium in patients with abnormal albumin",
      "Serum phosphorus (normal 2.5-4.5 mg/dL): inverse relationship with calcium; elevated phosphorus drives calcium down",
      "Parathyroid hormone (PTH) level: elevated in primary hyperparathyroidism and secondary hyperparathyroidism; low/absent in hypoparathyroidism",
      "25-hydroxyvitamin D level: low levels indicate vitamin D deficiency contributing to hypocalcemia",
      "ECG: hypocalcemia causes prolonged QT interval (risk for torsades de pointes); hypercalcemia causes shortened QT interval and possible heart block"
    ],
    management: [
      "Hypocalcemia (mild): oral calcium supplements (calcium carbonate or calcium citrate) with vitamin D; take with food to enhance absorption",
      "Hypocalcemia (severe/symptomatic): IV calcium gluconate 10% is preferred; infuse slowly over 10-20 minutes with cardiac monitoring; never give as rapid IV push",
      "Hypercalcemia (mild): increase oral fluid intake to 3-4 liters per day; increase mobility; reduce dietary calcium intake",
      "Hypercalcemia (moderate to severe): aggressive IV normal saline hydration (200-300 mL/hour initially); loop diuretics (furosemide) after adequate hydration to promote calciuresis",
      "Hypercalcemia from malignancy: bisphosphonates (pamidronate or zoledronic acid IV) or calcitonin for rapid reduction; treat underlying malignancy",
      "Seizure precautions for severe hypocalcemia: pad side rails, maintain suction and oxygen at bedside, reduce environmental stimuli"
    ],
    nursingActions: [
      "Assess for Trousseau sign (inflate BP cuff above systolic for 3 minutes -- positive if carpopedal spasm occurs) and Chvostek sign (tap facial nerve anterior to ear -- positive if facial twitching occurs) as bedside tests for hypocalcemia",
      "Place patient on continuous cardiac monitoring when calcium levels are critically abnormal (below 7.0 or above 13.0 mg/dL)",
      "Administer IV calcium gluconate through a large-bore IV in a large vein; if extravasation occurs, calcium chloride causes severe tissue necrosis",
      "Monitor for tingling around the mouth and in the fingertips -- earliest symptom of hypocalcemia",
      "In hypercalcemia, encourage ambulation (weight-bearing activity promotes calcium deposition in bone) and maintain high fluid intake",
      "Monitor for constipation in hypercalcemia and administer stool softeners as ordered",
      "Report ECG changes promptly: prolonged QT interval (hypocalcemia) or shortened QT interval (hypercalcemia)"
    ],
    assessmentFindings: [
      "Hypocalcemia: perioral and fingertip tingling/numbness (earliest), muscle cramps, positive Trousseau and Chvostek signs, hyperactive deep tendon reflexes, tetany, laryngospasm, seizures",
      "Hypercalcemia: muscle weakness, fatigue, lethargy, confusion, constipation, anorexia, nausea, polyuria, polydipsia, shortened QT on ECG, kidney stones",
      "Severe hypocalcemia: stridor (laryngospasm), bronchospasm, seizures, prolonged QT interval, cardiac arrest",
      "Severe hypercalcemia (calcium crisis above 14 mg/dL): obtundation, coma, cardiac arrest, renal failure"
    ],
    signs: {
      left: [
        "Perioral tingling and numbness (hypocalcemia)",
        "Muscle cramps and spasms (hypocalcemia)",
        "Fatigue and weakness (hypercalcemia)",
        "Constipation and anorexia (hypercalcemia)",
        "Hyperactive deep tendon reflexes (hypocalcemia)",
        "Decreased deep tendon reflexes (hypercalcemia)"
      ],
      right: [
        "Positive Trousseau sign (carpopedal spasm with BP cuff inflation)",
        "Positive Chvostek sign (facial twitching with nerve tap)",
        "Tetany and laryngospasm (severe hypocalcemia)",
        "Seizures (severe hypocalcemia)",
        "Prolonged QT interval and torsades de pointes (hypocalcemia)",
        "Calcium crisis: coma, cardiac arrest, acute kidney injury (severe hypercalcemia)"
      ]
    },
    medications: [
      {
        name: "Calcium Gluconate 10% (IV)",
        type: "Electrolyte replacement / calcium supplement",
        action: "Provides ionized calcium directly to the bloodstream, restoring neuromuscular function, cardiac conduction, and coagulation in acute hypocalcemia; 10 mL of 10% calcium gluconate provides approximately 93 mg elemental calcium",
        sideEffects: "Bradycardia, hypotension (if infused too rapidly), flushing, nausea, phlebitis at IV site, tissue irritation (less severe than calcium chloride)",
        contra: "Hypercalcemia; digitalis toxicity (calcium potentiates digoxin effects and can cause fatal dysrhythmias); severe renal impairment",
        pearl: "PREFERRED IV calcium formulation because it is less irritating to veins than calcium chloride; infuse slowly over 10-20 minutes with cardiac monitoring; if patient is on digoxin, use extreme caution and monitor ECG continuously"
      },
      {
        name: "Calcitriol (Rocaltrol)",
        type: "Active vitamin D analog (1,25-dihydroxyvitamin D3)",
        action: "The active form of vitamin D that increases intestinal absorption of calcium and phosphorus and promotes calcium reabsorption in the renal tubules; does not require renal activation (important in CKD patients)",
        sideEffects: "Hypercalcemia, hyperphosphatemia, nausea, vomiting, constipation, weakness, headache, metallic taste",
        contra: "Hypercalcemia; vitamin D toxicity; hyperphosphatemia (correct phosphorus first before starting calcitriol)",
        pearl: "Essential for patients with chronic kidney disease who cannot activate vitamin D; monitor serum calcium and phosphorus levels weekly during dose titration; calcium x phosphorus product should remain below 55 to prevent metastatic calcification"
      },
      {
        name: "Pamidronate (Aredia)",
        type: "Bisphosphonate (osteoclast inhibitor)",
        action: "Binds to hydroxyapatite in bone and inhibits osteoclast-mediated bone resorption, reducing calcium release from bone into the bloodstream; takes 24-72 hours for full effect",
        sideEffects: "Fever (most common), bone pain, myalgia, nausea, injection site reaction, hypocalcemia, osteonecrosis of the jaw (rare with prolonged use)",
        contra: "Hypocalcemia (must correct before administration); severe renal impairment (GFR below 30 mL/min); pregnancy",
        pearl: "Used for hypercalcemia of malignancy; infuse IV over 2-4 hours (never as bolus); ensure adequate hydration BEFORE administration; onset of action is 24-72 hours so calcitonin may be used as a bridge for rapid calcium reduction"
      }
    ],
    pearls: [
      "ALWAYS correct calcium for albumin: corrected Ca = total Ca + 0.8 x (4.0 - albumin). A total calcium of 7.8 with albumin of 2.0 gives corrected calcium of 9.4 (actually normal).",
      "Trousseau sign is MORE sensitive than Chvostek sign for hypocalcemia. To perform: inflate BP cuff above systolic pressure for 3 minutes -- positive if carpopedal spasm (wrist flexion, finger adduction) occurs.",
      "Calcium and digoxin are a DANGEROUS combination: elevated calcium potentiates digoxin toxicity and can cause fatal dysrhythmias. Use extreme caution giving IV calcium to patients on digitalis preparations.",
      "The mnemonic for hypercalcemia symptoms: Stones (kidney), Bones (pain), Groans (GI: constipation, nausea), Moans (neuropsych: confusion, lethargy), and Thrones (polyuria from osmotic diuresis).",
      "IV calcium gluconate is PREFERRED over calcium chloride for peripheral IV administration because calcium chloride causes severe tissue necrosis if it extravasates.",
      "Post-thyroidectomy patients are at HIGH risk for hypocalcemia due to inadvertent removal or damage to the parathyroid glands; monitor for Chvostek and Trousseau signs and tingling within 24-48 hours after surgery."
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient 24 hours after total thyroidectomy. The patient reports tingling around the mouth and in the fingertips. Which action should the nurse take FIRST?",
        options: [
          "Administer a calcium supplement as prescribed",
          "Encourage the patient to drink more fluids",
          "Check the serum calcium level and notify the physician",
          "Apply ice packs to the surgical site"
        ],
        correct: 2,
        rationale: "Perioral and fingertip tingling are the earliest signs of hypocalcemia, a common complication after thyroidectomy due to inadvertent parathyroid gland damage. The nurse should check the calcium level and notify the physician immediately for assessment and treatment orders."
      },
      {
        question: "A patient has a total serum calcium of 7.6 mg/dL and albumin of 2.0 g/dL. What is the corrected calcium level?",
        options: [
          "7.6 mg/dL",
          "8.4 mg/dL",
          "9.2 mg/dL",
          "10.0 mg/dL"
        ],
        correct: 2,
        rationale: "Corrected calcium = total Ca + 0.8 x (4.0 - albumin) = 7.6 + 0.8 x (4.0 - 2.0) = 7.6 + 1.6 = 9.2 mg/dL. The corrected calcium of 9.2 is within the normal range (8.5-10.5), indicating the low total calcium was due to hypoalbuminemia, not true hypocalcemia."
      },
      {
        question: "A patient with hypercalcemia of malignancy (calcium 14.2 mg/dL) is receiving IV normal saline and pamidronate. Which finding should the practical nurse report as an expected effect of treatment?",
        options: [
          "Decreased urine output",
          "Gradual decline in calcium level over 24-72 hours",
          "Immediate return of calcium to normal within 1 hour",
          "Increased serum phosphorus level"
        ],
        correct: 1,
        rationale: "Pamidronate (a bisphosphonate) takes 24-72 hours for full effect as it inhibits osteoclast bone resorption. A gradual decline in calcium over this timeframe is an expected and appropriate response. IV hydration with normal saline promotes calciuresis and supports renal calcium excretion in the interim."
      }
    ]
  },

  "burn-wound-basics-rpn": {
    title: "Burn Wound Classification, Assessment, and Nursing Care",
    cellular: {
      title: "Pathophysiology of Burn Injury",
      content: "A burn injury causes tissue destruction through direct cellular damage from thermal, chemical, electrical, or radiation energy. The degree of tissue damage depends on the temperature (or chemical concentration), duration of exposure, and thickness of the affected skin. Burns are classified by depth of tissue involvement. Superficial (first-degree) burns affect only the epidermis, causing erythema, pain, and mild edema without blistering; sunburn is the classic example. Superficial partial-thickness (second-degree) burns extend through the epidermis into the papillary dermis, producing blisters (vesicles or bullae), significant pain (nerve endings are exposed but intact), weeping wound surfaces, and blanching with pressure. Deep partial-thickness burns extend into the reticular dermis, appear mottled red and white, have decreased sensation, and may require surgical intervention. Full-thickness (third-degree) burns destroy the entire epidermis and dermis, appearing white, waxy, leathery, or charred; they are insensate (painless at the burn site because nerve endings are destroyed) and always require surgical excision and grafting. Subdermal (fourth-degree) burns extend into muscle, fascia, and bone. The Jackson burn wound model describes three concentric zones of tissue injury: the zone of coagulation (center -- irreversible cell death), the zone of stasis (surrounding area -- potentially salvageable tissue with compromised blood flow), and the zone of hyperemia (outermost -- increased blood flow, minimal cell damage, recovers within 7-10 days). Burn severity also depends on total body surface area (TBSA) affected, calculated using the Rule of Nines in adults: head 9%, each arm 9%, anterior trunk 18%, posterior trunk 18%, each leg 18%, perineum 1%. The Lund-Browder chart provides more accurate TBSA estimation in children. Burns greater than 20% TBSA in adults trigger a systemic inflammatory response with massive capillary leak, fluid shifts from intravascular to interstitial spaces (third-spacing), hypovolemic shock, and organ dysfunction. The practical nurse plays a critical role in initial assessment, fluid resuscitation monitoring, wound care, pain management, and infection prevention."
    },
    riskFactors: [
      "Age extremes: children under 5 and adults over 65 (thinner skin, higher mortality, less physiologic reserve)",
      "Occupational exposure (firefighters, industrial workers, food service workers)",
      "Smoking and alcohol use (impaired escape ability, decreased wound healing)",
      "Inhalation injury (significantly increases mortality; suspect with facial burns, singed nasal hairs, sooty sputum)",
      "Pre-existing conditions: diabetes, peripheral vascular disease, immunosuppression (impaired wound healing)",
      "Circumferential burns of extremities or chest (risk for compartment syndrome or restricted ventilation)",
      "Burns involving the face, hands, feet, genitalia, perineum, or major joints (classified as major burns regardless of TBSA)"
    ],
    diagnostics: [
      "Total body surface area (TBSA) calculation using Rule of Nines (adults) or Lund-Browder chart (children): determines burn severity and fluid resuscitation needs",
      "Carboxyhemoglobin (COHb) level: obtained for any suspected inhalation injury or closed-space fire; level above 10% confirms CO exposure; above 40% is often fatal",
      "Complete blood count: initial hemoconcentration (elevated hematocrit) due to plasma loss; later anemia as fluid resuscitation dilutes blood",
      "Basic metabolic panel: monitor potassium (hyperkalemia from cell lysis in first 24-48 hours), BUN/creatinine (renal function), glucose (stress hyperglycemia)",
      "Urinalysis and urine myoglobin: dark tea-colored urine with positive myoglobin indicates rhabdomyolysis from deep burns or electrical injury",
      "Chest X-ray and bronchoscopy: for suspected inhalation injury; bronchoscopy is the gold standard for diagnosing airway burns"
    ],
    management: [
      "Immediate cooling: cool running water (15-25 degrees C) for 20 minutes within 3 hours of injury; do NOT use ice (causes vasoconstriction and deepens tissue injury)",
      "Fluid resuscitation using Parkland formula: 4 mL x body weight (kg) x %TBSA; give half in first 8 hours from time of burn (not time of arrival), remaining half over next 16 hours using lactated Ringer solution",
      "Pain management: IV opioids (morphine, hydromorphone) during acute phase; titrate to adequate pain control; provide pre-medication before dressing changes",
      "Wound care: cleanse with mild soap and water or normal saline; debride loose tissue; apply prescribed topical antimicrobial agent; cover with appropriate dressings",
      "Tetanus prophylaxis: update tetanus immunization if last dose was more than 5 years ago",
      "Nutritional support: burn patients require 2-3 times normal caloric intake; high-protein diet (1.5-2 g protein/kg/day); consult dietitian early; consider enteral feeding within 6-12 hours of admission"
    ],
    nursingActions: [
      "Monitor urine output hourly as the primary indicator of adequate fluid resuscitation: target 0.5-1 mL/kg/hour in adults; 1-2 mL/kg/hour in children",
      "Assess for signs of inhalation injury: hoarseness, stridor, singed nasal hairs, carbonaceous sputum, facial or neck burns -- report immediately as airway compromise can develop rapidly",
      "Elevate burned extremities above heart level to reduce edema formation during the first 24-48 hours",
      "Perform neurovascular checks every 1-2 hours on circumferentially burned extremities: assess pulses, capillary refill, sensation, and movement -- report diminished findings immediately (may need escharotomy)",
      "Maintain strict aseptic technique during wound care; burn wounds are highly susceptible to infection due to loss of skin barrier",
      "Monitor temperature closely: burn patients lose thermoregulatory capacity through damaged skin; maintain warm environment (85-90 degrees F / 29-32 degrees C)",
      "Document wound appearance, size, depth, exudate, and odor with each dressing change; report signs of infection (purulent drainage, foul odor, wound color change, cellulitis)"
    ],
    assessmentFindings: [
      "Superficial (first-degree): dry, red, painful, no blisters, blanches with pressure; heals in 3-7 days without scarring",
      "Superficial partial-thickness (second-degree): blisters, moist, painful, weeping, blanches with pressure; heals in 10-21 days with minimal scarring",
      "Deep partial-thickness (second-degree): mottled red and white, decreased sensation, may or may not blister; heals in 21-35 days with scarring; may need grafting",
      "Full-thickness (third-degree): white, waxy, leathery, or charred; insensate (painless at burn site); does not blanch; requires grafting",
      "Burn shock (emergent phase, first 24-48 hours): hypovolemia, tachycardia, hypotension, decreased urine output, hemoconcentration, edema at burn and non-burn sites"
    ],
    signs: {
      left: [
        "Erythema and mild edema at burn site",
        "Pain proportional to burn depth (greatest in partial-thickness)",
        "Intact blisters on partial-thickness burns",
        "Mild tachycardia",
        "Anxiety and restlessness",
        "Low-grade temperature elevation"
      ],
      right: [
        "Airway compromise: stridor, hoarseness, drooling (inhalation injury)",
        "Hemodynamic instability: hypotension, severe tachycardia, oliguria (burn shock)",
        "Circumferential eschar restricting circulation or respiration",
        "Dark or tea-colored urine (myoglobinuria from rhabdomyolysis)",
        "Absent distal pulses in burned extremity (compartment syndrome)",
        "Signs of burn wound infection: green drainage (Pseudomonas), foul odor, tissue necrosis progression"
      ]
    },
    medications: [
      {
        name: "Silver Sulfadiazine (Flamazine/Silvadene)",
        type: "Topical antimicrobial (sulfonamide with silver)",
        action: "Silver ions bind to bacterial DNA and cell membranes, producing broad-spectrum bactericidal activity against gram-positive and gram-negative organisms and Candida species; creates a protective barrier over the burn wound",
        sideEffects: "Transient leukopenia (usually resolves after discontinuation), burning sensation on application, grey-black wound discoloration, rare allergic reaction (sulfonamide allergy)",
        contra: "Sulfonamide allergy; pregnancy (near term -- risk of kernicterus); infants under 2 months of age (immature liver cannot conjugate bilirubin displaced by sulfonamides); patients with glucose-6-phosphate dehydrogenase (G6PD) deficiency",
        pearl: "Apply 1/16 inch (2mm) thick layer with sterile gloved hand or tongue blade; can cause transient leukopenia -- monitor CBC; contraindicated on the face in most protocols (may use bacitracin or mafenide acetate for facial burns instead)"
      },
      {
        name: "Morphine Sulfate (IV)",
        type: "Opioid analgesic (mu-receptor agonist)",
        action: "Binds to mu-opioid receptors in the central nervous system, modulating pain perception in the spinal cord and brain; also reduces anxiety and has mild sedative properties; provides reliable analgesic effect for severe burn pain",
        sideEffects: "Respiratory depression (dose-limiting), hypotension, nausea and vomiting, constipation, urinary retention, pruritus, sedation",
        contra: "Respiratory depression; severe asthma without monitoring; paralytic ileus; concurrent MAO inhibitor use (serotonin syndrome risk); known hypersensitivity",
        pearl: "IV route is REQUIRED in major burns (not IM or SubQ) because decreased peripheral perfusion from burn shock makes absorption erratic; titrate to pain score; have naloxone (Narcan) readily available; provide analgesics 20-30 minutes BEFORE wound care procedures"
      },
      {
        name: "Mafenide Acetate (Sulfamylon)",
        type: "Topical antimicrobial (carbonic anhydrase inhibitor with antimicrobial properties)",
        action: "Penetrates burn eschar to reach organisms beneath the wound surface; bacteriostatic against gram-negative and gram-positive organisms including Pseudomonas aeruginosa and anaerobes; has deeper tissue penetration than silver sulfadiazine",
        sideEffects: "Significant pain/burning sensation on application (most common complaint), metabolic acidosis (carbonic anhydrase inhibition reduces bicarbonate reabsorption), allergic rash, superinfection with resistant organisms",
        contra: "Sulfonamide allergy; metabolic acidosis (worsens acid-base imbalance); renal impairment",
        pearl: "Best choice for burns OVER cartilage (ears, nose) due to superior eschar penetration; warn patients about the burning pain on application; monitor ABGs for metabolic acidosis during prolonged use; if acidosis occurs, discontinue for 24-48 hours"
      }
    ],
    pearls: [
      "Rule of Nines for adults: Head 9%, each arm 9%, anterior trunk 18%, posterior trunk 18%, each leg 18%, perineum 1% = 100%. For children, the head is proportionally larger (18% for infant) and legs are smaller.",
      "Parkland formula: 4 mL x weight (kg) x %TBSA. Give HALF in first 8 hours from TIME OF BURN (not time of arrival at hospital), second half over next 16 hours. Use lactated Ringer solution.",
      "Urine output is the BEST indicator of adequate fluid resuscitation: target 0.5-1 mL/kg/hour in adults. If urine output falls below this threshold, increase infusion rate.",
      "Do NOT pop intact blisters on partial-thickness burns -- the blister provides a natural sterile dressing and reduces pain. Only debride blisters that are broken or at high risk for rupture.",
      "Full-thickness burns are PAINLESS at the burn site because nerve endings are destroyed. Patients may still have pain from surrounding partial-thickness areas.",
      "Silver sulfadiazine is contraindicated in patients with sulfa allergy, pregnant women near term, and infants under 2 months. Use bacitracin or mafenide acetate as alternatives.",
      "Circumferential full-thickness burns of extremities can act as a tourniquet (eschar is inelastic); assess pulses hourly and prepare for emergent escharotomy if circulation is compromised."
    ],
    quiz: [
      {
        question: "Using the Rule of Nines, a patient with burns covering the entire anterior trunk and both arms has approximately what total body surface area (TBSA) burned?",
        options: [
          "27%",
          "36%",
          "45%",
          "54%"
        ],
        correct: 1,
        rationale: "Using the Rule of Nines: anterior trunk = 18% + both arms = 9% + 9% = 18%. Total TBSA = 18% + 18% = 36%. This calculation determines fluid resuscitation needs using the Parkland formula."
      },
      {
        question: "A practical nurse is monitoring a 70 kg patient receiving fluid resuscitation for 40% TBSA burns. Using the Parkland formula, what is the total volume to be infused in the first 24 hours?",
        options: [
          "5,600 mL",
          "8,400 mL",
          "11,200 mL",
          "14,000 mL"
        ],
        correct: 2,
        rationale: "Parkland formula: 4 mL x 70 kg x 40% TBSA = 11,200 mL total in 24 hours. Half (5,600 mL) is given in the first 8 hours from the time of burn, and the remaining half (5,600 mL) is given over the next 16 hours."
      },
      {
        question: "Which assessment finding in a patient with circumferential full-thickness burns of the right forearm should the practical nurse report IMMEDIATELY?",
        options: [
          "Absence of pain at the burn site",
          "Diminished radial pulse in the affected extremity",
          "Dry, leathery appearance of the wound",
          "Mild edema distal to the burn"
        ],
        correct: 1,
        rationale: "Diminished or absent pulses in a circumferentially burned extremity indicate compartment syndrome from constricting eschar. This requires immediate physician notification and possible escharotomy (surgical incision through the eschar to restore circulation). Painlessness and leathery appearance are expected findings in full-thickness burns."
      }
    ]
  },

  "bph-basics-rpn": {
    title: "Benign Prostatic Hyperplasia (BPH): Assessment and Nursing Care",
    cellular: {
      title: "Pathophysiology of Benign Prostatic Hyperplasia",
      content: "Benign prostatic hyperplasia (BPH) is a non-cancerous enlargement of the prostate gland that results from hyperplasia (increased cell number) of both the stromal and epithelial components of the prostate. The prostate gland is a walnut-sized organ located just below the bladder and surrounding the prostatic urethra. It produces approximately 20-30% of seminal fluid. Two factors are required for BPH development: aging and the presence of androgens, specifically dihydrotestosterone (DHT). Testosterone is converted to DHT by the enzyme 5-alpha reductase within the prostate. DHT binds to androgen receptors and stimulates prostate cell growth. As men age, the balance between cell proliferation and programmed cell death (apoptosis) shifts toward proliferation, leading to progressive glandular enlargement. The enlarged prostate compresses the urethra and causes bladder outlet obstruction, resulting in lower urinary tract symptoms (LUTS). These symptoms are divided into obstructive (voiding) symptoms and irritative (storage) symptoms. Obstructive symptoms include hesitancy (difficulty initiating urination), weak urinary stream, intermittency (start-stop stream), straining to void, prolonged voiding time, incomplete emptying, and post-void dribbling. Irritative symptoms include urinary frequency (voiding more than 8 times per day), urgency (sudden compelling desire to void), nocturia (waking more than once at night to void), and urge incontinence. Over time, chronic bladder outlet obstruction causes detrusor muscle hypertrophy (the bladder wall thickens to generate higher pressures), followed by detrusor decompensation (the muscle fails and post-void residual increases), and eventually overflow incontinence, urinary retention, hydronephrosis, and renal insufficiency. BPH affects approximately 50% of men by age 50 and up to 90% of men by age 80. It is important to note that BPH is NOT a precursor to prostate cancer, and the two conditions can coexist independently. The practical nurse must assess urinary symptoms accurately, administer medications as prescribed, educate patients about symptom management, and recognize complications requiring immediate intervention."
    },
    riskFactors: [
      "Age over 50 years (prevalence increases linearly with age; nearly universal in men over 80)",
      "Family history of BPH (genetic component -- first-degree relatives have 4x increased risk)",
      "Obesity and metabolic syndrome (increased estrogen-to-androgen ratio promotes prostatic growth)",
      "Sedentary lifestyle (physical activity is protective; inactivity increases LUTS severity)",
      "Diabetes mellitus (autonomic neuropathy affects bladder function; hyperinsulinemia may promote prostate growth)",
      "Medications that worsen symptoms: antihistamines, decongestants, anticholinergics, opioids (increase urinary retention)",
      "Alcohol and caffeine intake (diuretic effects increase urinary frequency and urgency)"
    ],
    diagnostics: [
      "Digital rectal exam (DRE): prostate feels smooth, firm, symmetrically enlarged, with obliteration of the median sulcus; irregular, hard nodules suggest possible malignancy requiring further evaluation",
      "Prostate-specific antigen (PSA): mildly elevated in BPH (typically 4-10 ng/mL); markedly elevated levels or rapidly rising PSA requires further evaluation to rule out prostate cancer",
      "Urinalysis and urine culture: rule out urinary tract infection which can mimic or worsen BPH symptoms; check for hematuria",
      "Post-void residual (PVR) volume by ultrasound or catheterization: PVR greater than 200 mL suggests significant bladder outlet obstruction and detrusor decompensation",
      "International Prostate Symptom Score (IPSS): standardized 7-question questionnaire; mild (0-7), moderate (8-19), severe (20-35) symptom categories; used to track treatment response",
      "Serum creatinine and BUN: assess for renal insufficiency from chronic obstruction and back-pressure on kidneys (obstructive uropathy)"
    ],
    management: [
      "Watchful waiting (active surveillance): appropriate for mild symptoms (IPSS 0-7); annual DRE and symptom reassessment; lifestyle modifications",
      "Lifestyle modifications: limit fluid intake 2 hours before bedtime (reduce nocturia), avoid caffeine and alcohol, practice double voiding (void, wait, void again), scheduled voiding every 3-4 hours",
      "Alpha-1 adrenergic blockers (tamsulosin, alfuzosin): first-line pharmacotherapy; relaxes prostatic smooth muscle within 1-2 weeks",
      "5-alpha reductase inhibitors (finasteride, dutasteride): shrinks prostate volume by 20-30% over 6-12 months; used for larger prostates (over 40 grams)",
      "Combination therapy: alpha-blocker plus 5-alpha reductase inhibitor for moderate-to-severe symptoms with enlarged prostate; more effective than either alone",
      "Surgical intervention (transurethral resection of the prostate -- TURP): gold standard surgery for BPH; indicated for refractory symptoms, recurrent UTIs, bladder stones, renal insufficiency, or urinary retention"
    ],
    nursingActions: [
      "Assess and document urinary symptoms using IPSS questionnaire or detailed voiding diary (frequency, volume, nocturia, urgency episodes)",
      "Monitor intake and output; assess for urinary retention by palpating bladder for distension above the symphysis pubis after voiding",
      "Administer tamsulosin 30 minutes after the same meal each day for consistent absorption; advise patient to take at bedtime to minimize orthostatic hypotension",
      "Instruct patients on 5-alpha reductase inhibitors that symptom improvement takes 3-6 months and that the medication must be taken continuously; warn that PSA levels will decrease by approximately 50%",
      "Teach patients to avoid over-the-counter medications containing pseudoephedrine, phenylephrine, or diphenhydramine as these can worsen urinary retention",
      "Post-TURP: monitor for hemorrhage (continuous bladder irrigation -- CBI -- is used to prevent clot formation); maintain traction on Foley catheter balloon as ordered",
      "Post-TURP: report bright red bleeding with clots, decreased urine output despite CBI running, bladder spasms not relieved by antispasmodics, or signs of hyponatremia (confusion, nausea, seizures -- TUR syndrome)"
    ],
    assessmentFindings: [
      "Obstructive symptoms: hesitancy, weak stream, intermittency, straining, incomplete emptying, post-void dribbling, urinary retention",
      "Irritative symptoms: frequency (more than 8 times/day), urgency, nocturia (more than once per night), urge incontinence",
      "Palpable bladder above symphysis pubis after voiding (indicates urinary retention with elevated post-void residual)",
      "DRE: smooth, firm, symmetrically enlarged prostate (irregular nodules suggest malignancy)",
      "Complications of untreated BPH: recurrent UTIs, gross hematuria, bladder stones, acute urinary retention, overflow incontinence, hydronephrosis, renal failure"
    ],
    signs: {
      left: [
        "Weak urinary stream and hesitancy",
        "Increased urinary frequency and nocturia",
        "Feeling of incomplete bladder emptying",
        "Post-void dribbling",
        "Mild urgency",
        "IPSS score 8-19 (moderate symptoms)"
      ],
      right: [
        "Acute urinary retention (painful inability to void -- emergency)",
        "Overflow incontinence (continuous dribbling from overdistended bladder)",
        "Gross hematuria",
        "Recurrent urinary tract infections",
        "Elevated creatinine (obstructive uropathy affecting kidneys)",
        "Post-TURP: TUR syndrome (hyponatremia: confusion, nausea, seizures)"
      ]
    },
    medications: [
      {
        name: "Tamsulosin (Flomax)",
        type: "Alpha-1A adrenergic blocker (selective)",
        action: "Selectively blocks alpha-1A adrenergic receptors concentrated in the prostate, bladder neck, and prostatic urethra, causing smooth muscle relaxation and improved urine flow without significant blood pressure effects; does NOT shrink the prostate",
        sideEffects: "Orthostatic hypotension (less than non-selective alpha-blockers), dizziness, abnormal ejaculation (retrograde ejaculation), nasal congestion, headache, intraoperative floppy iris syndrome (IFIS) during cataract surgery",
        contra: "Concurrent use with strong CYP3A4 inhibitors (ketoconazole); known hypersensitivity to sulfonamides (chemical structure similarity); planned cataract surgery (inform ophthalmologist about IFIS risk)",
        pearl: "Onset of action within 1-2 weeks; take 30 minutes after the same meal daily (food improves absorption consistency); instruct patient to inform eye surgeon if cataract surgery is planned because tamsulosin causes floppy iris syndrome"
      },
      {
        name: "Finasteride (Proscar)",
        type: "5-alpha reductase inhibitor (type II selective)",
        action: "Inhibits the type II 5-alpha reductase enzyme, blocking the conversion of testosterone to dihydrotestosterone (DHT) in the prostate; reduces prostate volume by 20-30% over 6-12 months by promoting apoptosis of prostatic epithelial cells",
        sideEffects: "Decreased libido (6-10%), erectile dysfunction (8%), decreased ejaculate volume, gynecomastia (breast enlargement/tenderness), depression (rare)",
        contra: "Women who are or may become pregnant must NOT handle crushed or broken tablets (teratogenic -- causes feminization of male fetus external genitalia); hepatic impairment (metabolized by liver)",
        pearl: "Takes 3-6 months for clinical benefit; reduces PSA by approximately 50% -- the clinician must DOUBLE the PSA value to interpret cancer screening results accurately; more effective for larger prostates (over 40 grams)"
      },
      {
        name: "Oxybutynin (Ditropan)",
        type: "Anticholinergic / antimuscarinic (bladder relaxant)",
        action: "Blocks muscarinic (M3) receptors on the detrusor muscle of the bladder, reducing involuntary bladder contractions and increasing bladder capacity; used for irritative LUTS (urgency, frequency, urge incontinence) when alpha-blockers alone are insufficient",
        sideEffects: "Dry mouth (most common), constipation, blurred vision, cognitive impairment (especially in elderly -- crosses blood-brain barrier), tachycardia, urinary retention, heat intolerance (decreased sweating)",
        contra: "Uncontrolled narrow-angle glaucoma; urinary retention or gastric retention; myasthenia gravis; severe ulcerative colitis or toxic megacolon; dementia (worsens cognitive function)",
        pearl: "Use with EXTREME caution in BPH patients because anticholinergics can WORSEN urinary retention; typically only added when adequate alpha-blocker therapy is in place; extended-release formulation has fewer side effects; monitor for urinary retention after initiation"
      }
    ],
    pearls: [
      "BPH is NOT a precursor to prostate cancer. The two conditions arise from different zones of the prostate (BPH from the transitional zone, cancer from the peripheral zone) and can coexist independently.",
      "NEVER give anticholinergics (oxybutynin, tolterodine) to a BPH patient WITHOUT first establishing adequate alpha-blocker therapy -- anticholinergics can precipitate acute urinary retention.",
      "OTC cold medications containing pseudoephedrine or phenylephrine (alpha-agonists) constrict the bladder neck and can precipitate acute urinary retention in BPH patients. Antihistamines (diphenhydramine) have anticholinergic effects that also worsen retention.",
      "Finasteride reduces PSA by approximately 50% -- to interpret prostate cancer screening, DOUBLE the measured PSA value. Pregnant women must NOT handle crushed finasteride tablets (teratogenic).",
      "Acute urinary retention (painful inability to void with palpable distended bladder) is a urological emergency requiring immediate catheterization. Decompress slowly (no more than 500-1000 mL at once) to prevent decompression hematuria.",
      "Post-TURP syndrome (TUR syndrome) is dilutional hyponatremia caused by absorption of hypotonic irrigating fluid during surgery; assess for confusion, nausea, vomiting, visual changes, and seizures; report immediately.",
      "Tamsulosin is the preferred alpha-blocker for BPH because of its selectivity for alpha-1A receptors in the prostate, resulting in fewer cardiovascular side effects (less orthostatic hypotension) compared to non-selective agents like doxazosin."
    ],
    quiz: [
      {
        question: "A patient with BPH calls the clinic to report that he took an over-the-counter cold medication containing pseudoephedrine and now cannot urinate. What is the practical nurse's priority action?",
        options: [
          "Advise the patient to drink more fluids to stimulate voiding",
          "Instruct the patient to come to the clinic for evaluation",
          "Instruct the patient to go to the emergency department immediately",
          "Advise the patient to take a warm bath to relax the muscles"
        ],
        correct: 2,
        rationale: "Inability to void (acute urinary retention) in a patient with BPH who took an alpha-agonist (pseudoephedrine) is a urological emergency requiring immediate catheterization. The patient should go to the emergency department for bladder decompression. Pseudoephedrine stimulates alpha receptors at the bladder neck, causing constriction and obstruction."
      },
      {
        question: "A patient taking finasteride (Proscar) for BPH asks when he can expect symptom improvement. What is the most accurate response?",
        options: [
          "Within the first week of treatment",
          "Within 2-4 weeks of treatment",
          "After 3-6 months of continuous treatment",
          "After 12-18 months of treatment"
        ],
        correct: 2,
        rationale: "Finasteride (a 5-alpha reductase inhibitor) works by shrinking the prostate gland, a process that takes 3-6 months for noticeable clinical improvement. The patient must take the medication continuously and should not discontinue it prematurely. Alpha-blockers like tamsulosin provide faster symptom relief (1-2 weeks)."
      },
      {
        question: "A practical nurse is caring for a patient 6 hours after TURP. The patient's continuous bladder irrigation (CBI) output has become bright red with multiple clots. Which action should the nurse take FIRST?",
        options: [
          "Increase the CBI flow rate as ordered",
          "Notify the surgeon immediately",
          "Document the finding and reassess in 1 hour",
          "Administer prescribed pain medication"
        ],
        correct: 1,
        rationale: "Bright red bleeding with clots after TURP indicates active hemorrhage and is a complication that must be reported to the surgeon immediately. While increasing CBI rate may be appropriate to prevent clot obstruction, the primary action is to notify the surgeon because surgical intervention (return to OR for cauterization) may be needed."
      }
    ]
  }
};

let count = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) count++;
}
console.log(`\nDone: ${count}/${Object.keys(lessons).length} lessons injected.`);
